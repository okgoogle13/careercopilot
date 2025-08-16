import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Optional

# Import the supporting flows
from .extract_job_requirements import extractJobRequirements, JobRequirements
from .extract_resume_entities import extractResumeEntities, ResumeEntities
from .keyword_placer import suggestKeywordPlacement, KeywordPlacementSuggestion

# Load environment variables and initialize Genkit if needed
load_dotenv()
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])
gemini_pro = googleai.gemini_pro


# --- Helper Functions for Scoring Logic ---
def _calculate_keyword_score(
    resume_skills: List[str], job_reqs: JobRequirements, profile_keywords: List[str] = None
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


class SemanticAnalysis(BaseModel):
    """Structured output for semantic analysis."""

    similarityScore: int = Field(
        description="A score from 0-100 representing how semantically similar the resume is to the job description."
    )
    explanation: str = Field(description="A brief explanation for the given score.")


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
    resumeText: str, jobDescription: str, profileKeywords: List[str] = None
) -> AtsResult:
    """
    Performs a comprehensive ATS-style analysis of a resume against a job description.
    """
    # Step 1 & 2: Extract structured data from both inputs in parallel
    job_reqs_future = extractJobRequirements.run(jobDescription=jobDescription)
    resume_entities_future = extractResumeEntities.run(resumeText=resumeText)
    job_reqs: JobRequirements = await job_reqs_future
    resume_entities: ResumeEntities = await resume_entities_future

    # Step 3: Perform Semantic Relevance analysis
    semantic_prompt = f"""
    Compare the resume against the job description. Provide a semantic similarity score from 0-100 and a brief explanation.
    Resume: "{resumeText}"
    Job Description: "{jobDescription}"
    """
    semantic_response = await gemini_pro.generate(
        prompt=semantic_prompt,
        output_schema=SemanticAnalysis,
        config=googleai.GenerationConfig(response_mime_type="application/json"),
    )
    semantic_analysis: SemanticAnalysis = semantic_response.output()

    # Step 4: Perform Keyword Matching
    keyword_analysis = _calculate_keyword_score(
        resume_entities.skills, job_reqs, profileKeywords
    )

    # Step 5: Perform Formatting Compliance check
    formatting_score = _calculate_formatting_score(resume_entities)

    # Step 6: Combine scores using weighted average
    weights = {"keyword": 0.45, "semantic": 0.35, "formatting": 0.20}
    overall_score = (
        keyword_analysis["score"] * weights["keyword"]
        + semantic_analysis.similarityScore * weights["semantic"]
        + formatting_score * weights["formatting"]
    )

    # Step 7: Get keyword placement suggestions if there are missing keywords
    placement_suggestions = None
    if keyword_analysis["missingKeywords"]:
        placement_response = await suggestKeywordPlacement.run(
            resumeText=resumeText,
            list_of_missing_keywords=keyword_analysis["missingKeywords"],
        )
        if placement_response:
            placement_suggestions = placement_response.suggestions

    # Step 8: Generate actionable recommendations
    recommendations = []
    if keyword_analysis["missingKeywords"]:
        recommendations.append(
            "Incorporate missing keywords to better match the job requirements. See suggestions below for how to add them."
        )
    if semantic_analysis.similarityScore < 70:
        recommendations.append(
            f"Improve the alignment of your experience with the job description. The analysis noted: '{semantic_analysis.explanation}'"
        )
    if formatting_score < 100:
        recommendations.append(
            "Ensure your resume includes clear sections for Skills, Work Experience, and Education."
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
