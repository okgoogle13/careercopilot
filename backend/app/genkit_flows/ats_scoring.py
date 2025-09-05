import logging
import os
from typing import List, Optional

import genkit

# Import enhanced error handling
from app.core.enhanced_ai_error_handling import (
    AIOperationContext,
    AIServiceType,
    create_fallback_strategy,
    enhanced_ai_handler,
)
from dotenv import load_dotenv
from genkit.plugins import google_genai
from pydantic import BaseModel, Field

# Import the supporting flows
from .extract_job_requirements import JobRequirements, extractJobRequirements
from .extract_resume_entities import ResumeEntities, extractResumeEntities
from .keyword_placer import KeywordPlacementSuggestion, suggestKeywordPlacement

logger = logging.getLogger(__name__)


class SemanticAnalysis(BaseModel):
    """Structured output for semantic analysis."""

    similarityScore: int = Field(
        description="A score from 0-100 representing how semantically similar the resume is to the job description."
    )
    explanation: str = Field(description="A brief explanation for the given score.")


# Load environment variables and initialize Genkit if needed
load_dotenv()
if getattr(genkit, "get_plugin", None) and not genkit.get_plugin("googleai"):
    genkit.init(plugins=[google_genai.init(api_key=os.getenv("GEMINI_API_KEY"))])
gemini_pro = google_genai.models.gemini.GEMINI_1_5_PRO

# --- Helper Functions for Scoring Logic ---


async def _perform_semantic_analysis(resume_text: str, job_description: str) -> SemanticAnalysis:
    """Perform semantic analysis with proper error handling"""
    semantic_prompt = f"""
    Compare the resume against the job description.
    Provide a semantic similarity score from 0-100 and a brief explanation.
    Resume: "{resume_text}"
    Job Description: "{job_description}"
    """

    semantic_response = await gemini_pro.generate(
        prompt=semantic_prompt,
        output_schema=SemanticAnalysis,
        config={"response_mime_type": "application/json"},
    )

    return semantic_response.output()


def _generate_recommendations(
    keyword_analysis: dict,
    semantic_analysis: SemanticAnalysis,
    formatting_score: float,
    job_extraction_success: bool,
    resume_extraction_success: bool,
    semantic_analysis_success: bool,
) -> List[str]:
    """Generate actionable recommendations with fallback handling"""
    recommendations = []

    # Add extraction failure warnings first
    if not job_extraction_success:
        recommendations.append(
            "⚠️ Job description analysis was partially unavailable. "
            "Recommendations may be limited. Please try again later for full analysis."
        )

    if not resume_extraction_success:
        recommendations.append(
            "⚠️ Resume parsing was partially unavailable. "
            "Please ensure your resume has clear sections and try again."
        )

    # Standard recommendations
    if keyword_analysis["missingKeywords"] and len(keyword_analysis["missingKeywords"]) > 0:
        recommendations.append(
            "Incorporate missing keywords to better match the job requirements. "
            "See suggestions below for how to add them."
        )

    if semantic_analysis_success and semantic_analysis.similarityScore < 70:
        recommendations.append(
            f"Improve the alignment of your experience with the job description. "
            f"The analysis noted: '{semantic_analysis.explanation}'"
        )
    elif not semantic_analysis_success:
        recommendations.append(
            "Semantic similarity analysis was unavailable. "
            "Focus on matching your experience descriptions to the job requirements."
        )

    if formatting_score < 100:
        recommendations.append(
            "Ensure your resume includes clear sections for Skills, Work Experience, and Education."
        )

    # Add general improvement suggestions if no specific issues found
    if not recommendations or all("⚠️" in rec for rec in recommendations):
        recommendations.append(
            "Your resume shows good alignment with the job requirements. "
            "Consider customizing specific achievements to highlight relevant experience."
        )

    return recommendations


def _calculate_keyword_score(
    resume_skills: List[str],
    job_reqs: JobRequirements,
    profile_keywords: List[str] = None,
):
    """Calculates a score based on keyword matching."""
    required_matched = [
        skill
        for skill in job_reqs.requiredSkills
        if skill.lower() in (s.lower() for s in resume_skills)
    ]
    preferred_matched = [
        skill
        for skill in job_reqs.preferredSkills
        if skill.lower() in (s.lower() for s in resume_skills)
    ]

    missing_required = [
        skill
        for skill in job_reqs.requiredSkills
        if skill.lower() not in (s.lower() for s in resume_skills)
    ]
    missing_preferred = [
        skill
        for skill in job_reqs.preferredSkills
        if skill.lower() not in (s.lower() for s in resume_skills)
    ]

    # Scoring logic: 80% weight for required, 20% for preferred
    required_score = (
        (len(required_matched) / len(job_reqs.requiredSkills)) * 0.8
        if job_reqs.requiredSkills
        else 0.8
    )
    preferred_score = (
        (len(preferred_matched) / len(job_reqs.preferredSkills)) * 0.2
        if job_reqs.preferredSkills
        else 0.2
    )

    score = (required_score + preferred_score) * 100

    return {
        "score": min(score, 100),
        "matchedKeywords": required_matched + preferred_matched,
        "missingKeywords": missing_required + missing_preferred,
    }


def _calculate_formatting_score(resume_entities: ResumeEntities):
    """Checks for the presence of key resume sections."""
    score = 0
    if resume_entities.skills:
        score += 33.3
    if resume_entities.experience:
        score += 33.3
    if resume_entities.education:
        score += 33.4
    return min(score, 100)


# --- Main Flow Output Schema ---


class ScoreBreakdown(BaseModel):
    keywordScore: float
    semanticScore: float
    formattingScore: float


class AtsResult(BaseModel):
    overallScore: float
    breakdown: ScoreBreakdown
    matchedKeywords: List[str]
    missingKeywords: List[str]
    recommendations: List[str]
    keyword_placement_suggestions: Optional[List[KeywordPlacementSuggestion]] = None


@genkit.flow(output_schema=AtsResult)
async def atsScoring(
    resumeText: str,
    jobDescription: str,
    profileKeywords: List[str] = None,
    user_id: str = "anonymous",
) -> AtsResult:
    """
    Performs a comprehensive ATS-style analysis of a resume against a job description
    with enhanced error handling and fallback mechanisms.
    """
    logger.info(f"Starting comprehensive ATS scoring for user {user_id}")

    # Step 1 & 2: Extract structured data from both inputs with error handling
    job_reqs_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: extractJobRequirements.run(jobDescription=jobDescription),
        AIOperationContext(
            operation_name="extract_job_requirements",
            service_type=AIServiceType.GENKIT_FLOW,
            user_id=user_id,
            input_size=len(jobDescription),
        ),
        create_fallback_strategy(enabled=True, degraded_mode=True),
    )

    resume_entities_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: extractResumeEntities.run(resumeText=resumeText),
        AIOperationContext(
            operation_name="extract_resume_entities",
            service_type=AIServiceType.GENKIT_FLOW,
            user_id=user_id,
            input_size=len(resumeText),
        ),
        create_fallback_strategy(enabled=True, degraded_mode=True),
    )

    # Check if extractions failed
    if not job_reqs_result.success:
        logger.error(f"Job requirements extraction failed: {job_reqs_result.error}")
        # Use fallback job requirements
        job_reqs = JobRequirements(
            requiredSkills=[],
            preferredSkills=[],
            experienceLevel="",
            educationLevel="",
            responsibilities=[],
        )
    else:
        job_reqs = job_reqs_result.data

    if not resume_entities_result.success:
        logger.error(f"Resume entities extraction failed: {resume_entities_result.error}")
        # Use fallback resume entities
        resume_entities = ResumeEntities(skills=[], experience=[], education=[])
    else:
        resume_entities = resume_entities_result.data

    # Step 3: Perform Semantic Relevance analysis with error handling
    semantic_analysis_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: _perform_semantic_analysis(resumeText, jobDescription),
        AIOperationContext(
            operation_name="semantic_analysis",
            service_type=AIServiceType.SEMANTIC_ANALYSIS,
            user_id=user_id,
            input_size=len(resumeText) + len(jobDescription),
        ),
        create_fallback_strategy(
            enabled=True,
            fallback_data=SemanticAnalysis(
                similarityScore=50,
                explanation="Semantic analysis temporarily unavailable. Score represents neutral match.",
            ),
        ),
    )

    semantic_analysis = semantic_analysis_result.data

    # Step 4: Perform Keyword Matching (local operation - always succeeds)
    keyword_analysis_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: _calculate_keyword_score(resume_entities.skills, job_reqs, profileKeywords),
        AIOperationContext(
            operation_name="keyword_matching",
            service_type=AIServiceType.KEYWORD_MATCHING,
            user_id=user_id,
            metadata={"resume_skills_count": len(resume_entities.skills)},
        ),
    )

    keyword_analysis = (
        keyword_analysis_result.data
        if keyword_analysis_result.success
        else {"score": 25.0, "matchedKeywords": [], "missingKeywords": []}
    )

    # Step 5: Perform Formatting Compliance check (local operation)
    formatting_score_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: _calculate_formatting_score(resume_entities),
        AIOperationContext(
            operation_name="formatting_analysis",
            service_type=AIServiceType.TEXT_PROCESSING,
            user_id=user_id,
        ),
    )

    formatting_score = formatting_score_result.data if formatting_score_result.success else 50.0

    # Step 6: Combine scores using weighted average
    weights = {"keyword": 0.45, "semantic": 0.35, "formatting": 0.20}
    overall_score = (
        keyword_analysis["score"] * weights["keyword"]
        + semantic_analysis.similarityScore * weights["semantic"]
        + formatting_score * weights["formatting"]
    )

    # Step 7: Get keyword placement suggestions with error handling
    placement_suggestions = None
    if keyword_analysis["missingKeywords"]:
        placement_result = await enhanced_ai_handler.execute_ai_operation(
            lambda: suggestKeywordPlacement.run(
                resumeText=resumeText,
                list_of_missing_keywords=keyword_analysis["missingKeywords"],
            ),
            AIOperationContext(
                operation_name="keyword_placement",
                service_type=AIServiceType.GENKIT_FLOW,
                user_id=user_id,
                metadata={"missing_keywords_count": len(keyword_analysis["missingKeywords"])},
            ),
            create_fallback_strategy(
                enabled=True, fallback_data=None  # Placement suggestions are optional
            ),
        )

        if placement_result.success and placement_result.data:
            placement_suggestions = placement_result.data.suggestions

    # Step 8: Generate actionable recommendations
    recommendations = _generate_recommendations(
        keyword_analysis,
        semantic_analysis,
        formatting_score,
        job_reqs_result.success,
        resume_entities_result.success,
        semantic_analysis_result.success,
    )

    # Log completion
    logger.info(
        f"ATS scoring completed for user {user_id}. "
        f"Overall score: {overall_score:.2f}, "
        f"Fallbacks used: {job_reqs_result.fallback_used or resume_entities_result.fallback_used or semantic_analysis_result.fallback_used}"
    )

    # Construct the final output
    return AtsResult(
        overallScore=round(overall_score, 2),
        breakdown=ScoreBreakdown(
            keywordScore=round(keyword_analysis["score"], 2),
            semanticScore=semantic_analysis.similarityScore,
            formattingScore=round(formatting_score, 2),
        ),
        matchedKeywords=keyword_analysis["matchedKeywords"],
        missingKeywords=keyword_analysis["missingKeywords"],
        recommendations=recommendations,
        keyword_placement_suggestions=placement_suggestions,
    )
