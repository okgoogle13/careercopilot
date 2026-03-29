import asyncio
import logging
from typing import Any, cast

from pydantic import BaseModel, Field

from app.core.config import settings

# Import enhanced error handling
from app.core.enhanced_ai_error_handling import (
    AIOperationContext,
    AIServiceType,
    create_fallback_strategy,
    enhanced_ai_handler,
)
from app.core.genkit_init import genkit_flow, get_model
from app.core.prompt_service import format_prompt

# Import the supporting flows
from .extract_job_requirements import JobRequirements, extractJobRequirements
from .extract_resume_entities import ResumeEntities, extractResumeEntities
from .keyword_placer import KeywordPlacementSuggestion, suggestKeywordPlacement

# Genkit imports are handled by the flow_decorator module

logger = logging.getLogger(__name__)


class SemanticAnalysis(BaseModel):
    """Structured output for semantic analysis."""

    similarityScore: int = Field(
        description="A score from 0-100 representing how semantically similar the resume is to the job description."
    )
    explanation: str = Field(description="A brief explanation for the given score.")


# --- Helper Functions for Scoring Logic ---


async def _perform_semantic_analysis(resume_text: str, job_description: str) -> SemanticAnalysis:
    """Perform semantic analysis with proper error handling"""
    model = get_model()  # type: ignore[no-untyped-call]
    if not model:
        raise RuntimeError("Genkit model not available for semantic analysis")

    semantic_prompt = format_prompt(
        "semantic_analysis", resume_text=resume_text, job_description=job_description
    )

    semantic_response = await model.generate(
        prompt=semantic_prompt,
        output_schema=SemanticAnalysis,
        config={"response_mime_type": "application/json"},
    )

    return cast(SemanticAnalysis, semantic_response.output())


def _generate_recommendations(
    keyword_analysis: dict[str, Any],
    semantic_analysis: SemanticAnalysis,
    formatting_score: float,
    job_extraction_success: bool,
    resume_extraction_success: bool,
    semantic_analysis_success: bool,
) -> list[str]:
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
    resume_text: str,
    resume_skills: list[str],
    job_reqs: JobRequirements,
    profile_keywords: list[str] | None = None,
) -> dict[str, Any]:
    """Calculates a score based on keyword matching and basic density (occurrences)."""
    text_lower = resume_text.lower()

    required_matched = []
    required_score_raw = 0.0
    for skill in job_reqs.requiredSkills:
        count = text_lower.count(skill.lower())
        # Check against parsed skills array AND raw text (fallback)
        if skill.lower() in (s.lower() for s in resume_skills) or count > 0:
            required_matched.append(skill)
        # 1 match gives some score, >1 match (density) gives full score
        score_pts = (
            min(1.0, 0.5 + (count * 0.25))
            if count > 0
            else (0.5 if skill.lower() in (s.lower() for s in resume_skills) else 0.0)
        )
        required_score_raw += score_pts

    preferred_matched = []
    preferred_score_raw = 0.0
    for skill in job_reqs.preferredSkills:
        count = text_lower.count(skill.lower())
        if skill.lower() in (s.lower() for s in resume_skills) or count > 0:
            preferred_matched.append(skill)
        score_pts = (
            min(1.0, 0.5 + (count * 0.25))
            if count > 0
            else (0.5 if skill.lower() in (s.lower() for s in resume_skills) else 0.0)
        )
        preferred_score_raw += score_pts

    missing_required = [s for s in job_reqs.requiredSkills if s not in required_matched]
    missing_preferred = [s for s in job_reqs.preferredSkills if s not in preferred_matched]

    # Scoring logic: 80% weight for required, 20% for preferred
    required_score = (
        (required_score_raw / len(job_reqs.requiredSkills)) * 0.8
        if job_reqs.requiredSkills
        else 0.8
    )
    preferred_score = (
        (preferred_score_raw / len(job_reqs.preferredSkills)) * 0.2
        if job_reqs.preferredSkills
        else 0.2
    )

    score = (required_score + preferred_score) * 100

    return {
        "score": min(score, 100),
        "matchedKeywords": required_matched + preferred_matched,
        "missingKeywords": missing_required + missing_preferred,
    }


def _calculate_job_title_score(resume_entities: ResumeEntities, job_reqs: JobRequirements) -> float:
    """Checks if the target job title exists in the user's experience."""
    if not job_reqs.jobTitle or job_reqs.jobTitle.lower() == "unknown role":
        return 50.0  # Neutral score if missing

    job_title_lower = job_reqs.jobTitle.lower()

    for exp in resume_entities.experience:
        exp_title = exp.get("title", "").lower()
        if exp_title and (job_title_lower in exp_title or exp_title in job_title_lower):
            return 100.0  # Exact/partial substring match

    # Fuzzy match threshold logic could go here, but for now fallback to 0
    return 0.0


def _calculate_education_experience_score(
    resume_entities: ResumeEntities, job_reqs: JobRequirements
) -> dict[str, Any]:
    """Calculates generic match for total tenure and degree requirement."""
    # Simple parse for years of experience assuming `start_year` and `end_year`
    total_years = 0
    try:
        from datetime import datetime

        current_year = datetime.now().year
        for exp in resume_entities.experience:
            start_year = int(str(exp.get("start_year", current_year - 1)))
            end_year = int(str(exp.get("end_year", current_year)))
            total_years += max(1, end_year - start_year)
    except Exception:
        pass  # Fallback to 0 if parsing fails

    # Simplified parsing for required experience level against total tenure
    # (assuming job_reqs.experienceLevel like '5+ years')
    required_years = 0
    import re

    match = re.search(r"(\d+)", job_reqs.experienceLevel)
    if match:
        required_years = int(match.group(1))

    exp_match = total_years >= required_years if required_years > 0 else True

    # Handle Degree Match
    education_match = True
    if getattr(job_reqs, "degreeRequirement", None):
        required_degree = job_reqs.degreeRequirement.lower()
        education_match = False
        for edu in resume_entities.education:
            degree_type = edu.get("degree_type", "").lower()
            if degree_type and required_degree in degree_type:
                education_match = True
                break

    score = 0.0
    if exp_match:
        score += 50.0
    if education_match:
        score += 50.0

    return {
        "score": score,
        "experienceMatch": exp_match,
        "educationMatch": education_match,
        "totalYearsCalculated": total_years,
    }


def _calculate_formatting_score(resume_entities: ResumeEntities) -> float:
    """Checks for the presence of key resume sections."""
    score: float = 0.0
    if resume_entities.skills:
        score += 33.3
    if resume_entities.experience:
        score += 33.3
    if resume_entities.education:
        score += 33.4
    return min(score, 100)


# --- Main Flow Output Schema ---


class ScoreBreakdown(BaseModel):
    keywordDensityScore: float
    jobTitleScore: float
    semanticScore: float
    educationExperienceScore: float
    formattingScore: float


class CategoryAnalysis(BaseModel):
    name: str
    score: float
    status: str  # 'good', 'warning', 'poor'
    suggestions: list[str]


class KeywordMatches(BaseModel):
    matched: list[str]
    missing: list[str]


class AtsResult(BaseModel):
    overallScore: float
    summary: str = Field(description="A brief summary of the overall match.")
    breakdown: ScoreBreakdown
    categories: list[CategoryAnalysis]
    keywordMatches: KeywordMatches
    formatIssues: list[str]
    jobTitleMatch: float
    educationMatch: bool
    experienceMatch: bool
    recommendations: list[str]
    keyword_placement_suggestions: list[KeywordPlacementSuggestion] | None = None


# The decorator handles all the setup logic including model validation
@genkit_flow(output_schema=AtsResult, require_model=False)
async def atsScoring(
    resumeText: str,
    jobDescription: str,
    profileKeywords: list[str] | None = None,
    user_id: str = "anonymous",
) -> AtsResult:
    """
    Performs a comprehensive ATS-style analysis of a resume against a job description
    with enhanced error handling and fallback mechanisms.
    """
    logger.info(f"Starting comprehensive ATS scoring for user {user_id}")

    # Step 1 & 2: Extract structured data from both inputs in parallel with error handling
    job_reqs_task = enhanced_ai_handler.execute_ai_operation(
        lambda: extractJobRequirements(jobDescription),
        AIOperationContext(
            operation_name="extract_job_requirements",
            service_type=AIServiceType.GENKIT_FLOW,
            user_id=user_id,
            input_size=len(jobDescription),
        ),
        create_fallback_strategy(enabled=True, degraded_mode=True),
    )

    resume_entities_task = enhanced_ai_handler.execute_ai_operation(
        lambda: extractResumeEntities(resumeText),
        AIOperationContext(
            operation_name="extract_resume_entities",
            service_type=AIServiceType.GENKIT_FLOW,
            user_id=user_id,
            input_size=len(resumeText),
        ),
        create_fallback_strategy(enabled=True, degraded_mode=True),
    )

    # Execute both extractions in parallel
    job_reqs_result, resume_entities_result = await asyncio.gather(
        job_reqs_task, resume_entities_task
    )

    # Check if extractions failed
    if not job_reqs_result.success:
        logger.error(f"Job requirements extraction failed: {job_reqs_result.error}")
        # Use fallback job requirements
        job_reqs = JobRequirements(
            requiredSkills=[],
            preferredSkills=[],
            experienceLevel="",
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
        lambda: _calculate_keyword_score(
            resumeText, resume_entities.skills, job_reqs, profileKeywords
        ),
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

    # Step 5b: Extra Scoring for Job Title and Education/Experience
    job_title_score = _calculate_job_title_score(resume_entities, job_reqs)
    edu_exp_result = _calculate_education_experience_score(resume_entities, job_reqs)
    edu_exp_score = edu_exp_result["score"]

    # Step 6: Combine scores using weighted average from configuration
    weights = settings.ats_scoring_weights

    # Fallback to configured defaults if not all properties exist
    w_keyword = weights.get("keyword_density", 0.30)
    w_job = weights.get("job_title", 0.20)
    w_semantic = weights.get("semantic", 0.25)
    w_edu_exp = weights.get("education_experience", 0.15)
    w_fmt = weights.get("formatting", 0.10)

    overall_score = (
        keyword_analysis["score"] * w_keyword
        + job_title_score * w_job
        + semantic_analysis.similarityScore * w_semantic
        + edu_exp_score * w_edu_exp
        + formatting_score * w_fmt
    )

    # Step 7: Get keyword placement suggestions with error handling
    placement_suggestions = None
    if keyword_analysis["missingKeywords"]:
        placement_result = await enhanced_ai_handler.execute_ai_operation(
            lambda: suggestKeywordPlacement(
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

    # Step 9: Create category breakdown
    categories = [
        CategoryAnalysis(
            name="Keyword Optimization",
            score=round(keyword_analysis["score"], 2),
            status=(
                "good"
                if keyword_analysis["score"] >= 80
                else "warning" if keyword_analysis["score"] >= 60 else "poor"
            ),
            suggestions=(
                [
                    (
                        f"Add missing keywords: {', '.join(keyword_analysis['missingKeywords'][:3])}"
                        if keyword_analysis["missingKeywords"]
                        else "Excellent keyword coverage"
                    ),
                    "Consider using synonyms and variations of key terms",
                ]
                if keyword_analysis["missingKeywords"]
                else ["Excellent keyword coverage"]
            ),
        ),
        CategoryAnalysis(
            name="Content Quality",
            score=semantic_analysis.similarityScore,
            status=(
                "good"
                if semantic_analysis.similarityScore >= 80
                else "warning" if semantic_analysis.similarityScore >= 60 else "poor"
            ),
            suggestions=(
                [semantic_analysis.explanation]
                if semantic_analysis.explanation
                else ["Content aligns well with job requirements"]
            ),
        ),
        CategoryAnalysis(
            name="Format & Structure",
            score=round(formatting_score, 2),
            status=(
                "good"
                if formatting_score >= 80
                else "warning" if formatting_score >= 60 else "poor"
            ),
            suggestions=(
                [
                    (
                        "Ensure clear sections for Skills, Experience, and Education"
                        if formatting_score < 100
                        else "Excellent formatting structure"
                    ),
                    "Use standard section headers for ATS compatibility",
                ]
                if formatting_score < 100
                else ["Excellent formatting structure"]
            ),
        ),
    ]

    # Step 10: Identify format-specific issues
    format_issues = []
    if formatting_score < 100:
        if not resume_entities.skills:
            format_issues.append("Add a clear Skills section")
        if not resume_entities.experience:
            format_issues.append("Add detailed Work Experience section")
        if not resume_entities.education:
            format_issues.append("Include Education section")

    if not format_issues:
        format_issues = ["No major formatting issues detected"]

    # Log completion
    logger.info(
        f"ATS scoring completed for user {user_id}. "
        f"Overall score: {overall_score:.2f}, "
        f"Fallbacks used: {job_reqs_result.fallback_used or resume_entities_result.fallback_used or semantic_analysis_result.fallback_used}"
    )

    # Construct the final output
    return AtsResult(
        overallScore=round(overall_score, 2),
        summary=semantic_analysis.explanation,
        breakdown=ScoreBreakdown(
            keywordDensityScore=round(keyword_analysis["score"], 2),
            jobTitleScore=round(job_title_score, 2),
            semanticScore=semantic_analysis.similarityScore,
            educationExperienceScore=round(edu_exp_score, 2),
            formattingScore=round(formatting_score, 2),
        ),
        categories=categories,
        keywordMatches=KeywordMatches(
            matched=keyword_analysis["matchedKeywords"],
            missing=keyword_analysis["missingKeywords"],
        ),
        formatIssues=format_issues,
        jobTitleMatch=job_title_score,
        educationMatch=edu_exp_result.get("educationMatch", False),
        experienceMatch=edu_exp_result.get("experienceMatch", False),
        recommendations=recommendations,
        keyword_placement_suggestions=placement_suggestions,
    )


# Flow is automatically registered by the @async_genkit_flow decorator
