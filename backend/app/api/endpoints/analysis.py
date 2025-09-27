"""
API endpoints for AI-powered analysis features.

This module provides endpoints for:
- Applicant Tracking System (ATS) score analysis.
- Advanced job compatibility matching.
- Smart content optimization for resumes and cover letters.
- Comprehensive resume intelligence reporting.
"""
from app.core.dependencies import User, get_current_user
from app.genkit_flows.advanced_job_matching import analyze_job_compatibility
from app.genkit_flows.ats_scoring import AtsResult, atsScoring
from app.genkit_flows.flow_decorator import run_flow_async
from app.genkit_flows.resume_intelligence_pipeline import (
    generate_resume_intelligence_report,
)
from app.genkit_flows.smart_content_optimizer import optimize_content_for_target
from app.models import ATSScoreResponse, CategoryScore
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()


class ATSScoreRequest(BaseModel):
    """
    Request model for the ATS score analysis endpoint.

    Attributes:
        resume_text: The full text content of the user's resume.
        job_description: The full text content of the target job description.
    """
    resume_text: str
    job_description: str


@router.post(
    "/ats-score",
    response_model=ATSScoreResponse,
    summary="Get ATS Score Analysis",
    tags=["Analysis"],
)
async def create_ats_score_analysis(
    request: ATSScoreRequest = Body(...), current_user: User = Depends(get_current_user)
) -> ATSScoreResponse:
    """
    Analyzes a resume against a job description to generate an ATS score.

    This endpoint invokes the `atsScoring` Genkit flow, which performs a
    detailed analysis of keyword matching, semantic relevance, and formatting.
    The raw result from the flow is then transformed into a structured
    `ATSScoreResponse` model suitable for the frontend.

    Args:
        request: An `ATSScoreRequest` containing the resume and job description text.
        current_user: The authenticated user, injected by dependency.

    Returns:
        An `ATSScoreResponse` object containing the overall score, category
        breakdowns, and keyword analysis.

    Raises:
        HTTPException: If an unexpected error occurs during the analysis.
    """
    try:
        flow_result: AtsResult = await run_flow_async(
            atsScoring,
            {
                "resumeText": request.resume_text,
                "jobDescription": request.job_description,
                "user_id": current_user.uid,
            },
        )

        response_data = ATSScoreResponse(
            overallScore=int(flow_result.overallScore),
            categories=[
                CategoryScore(
                    name="Keyword Optimization",
                    score=int(flow_result.breakdown.keywordScore),
                    status=(
                        "good"
                        if flow_result.breakdown.keywordScore >= 80
                        else "warning"
                        if flow_result.breakdown.keywordScore >= 60
                        else "poor"
                    ),
                    suggestions=(
                        flow_result.recommendations
                        if flow_result.breakdown.keywordScore < 80
                        else ["Keywords are well-optimized."]
                    ),
                ),
                CategoryScore(
                    name="Semantic Match",
                    score=int(flow_result.breakdown.semanticScore),
                    status=(
                        "good"
                        if flow_result.breakdown.semanticScore >= 80
                        else "warning"
                        if flow_result.breakdown.semanticScore >= 60
                        else "poor"
                    ),
                    suggestions=(
                        flow_result.recommendations
                        if flow_result.breakdown.semanticScore < 80
                        else ["Semantic content aligns well with the job."]
                    ),
                ),
                CategoryScore(
                    name="Formatting & Structure",
                    score=int(flow_result.breakdown.formattingScore),
                    status=(
                        "good"
                        if flow_result.breakdown.formattingScore >= 80
                        else "warning"
                        if flow_result.breakdown.formattingScore >= 60
                        else "poor"
                    ),
                    suggestions=(
                        flow_result.recommendations
                        if flow_result.breakdown.formattingScore < 80
                        else ["Resume format is ATS-friendly."]
                    ),
                ),
            ],
            matched_keywords=flow_result.matchedKeywords,
            missing_keywords=flow_result.missingKeywords,
        )

        return response_data

    except Exception as e:
        print(f"API Error in /ats-score endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while running the ATS analysis.",
        )


class JobMatchingRequest(BaseModel):
    """
    Request model for the advanced job compatibility analysis.

    Attributes:
        candidate_profile: A dictionary representing the candidate's profile,
                           including skills, experience, and preferences.
        job_description: The text of the job description to match against.
        matching_preferences: Optional dictionary of user preferences to
                                fine-tune the matching algorithm.
    """
    candidate_profile: dict
    job_description: str
    matching_preferences: dict = {}


class ContentOptimizationRequest(BaseModel):
    """
    Request model for the smart content optimization endpoint.

    Attributes:
        content: The text content (e.g., resume or cover letter) to be optimized.
        target_role: The specific job role or title to optimize for.
        optimization_goals: A list of specific goals (e.g., "improve clarity",
                              "add keywords") to guide the optimization.
    """
    content: str
    target_role: str
    optimization_goals: list = []


class ResumeIntelligenceRequest(BaseModel):
    """
    Request model for the resume intelligence analysis endpoint.

    Attributes:
        resume_content: The full text of the resume to be analyzed.
        target_industry: The industry the user is targeting.
        career_goals: A description of the user's career aspirations.
        experience_level: The user's self-reported experience level (e.g.,
                          "entry_level", "mid_level", "senior").
    """
    resume_content: str
    target_industry: str = None
    career_goals: str = None
    experience_level: str = "mid_level"


@router.post(
    "/job-matching",
    summary="Advanced Job Compatibility Analysis",
    tags=["Analysis"],
)
async def analyze_job_match(
    request: JobMatchingRequest = Body(...),
    current_user: User = Depends(get_current_user),
):
    """
    Analyzes compatibility between a candidate profile and a job opportunity.

    This endpoint uses advanced multi-dimensional matching algorithms to provide
    a detailed compatibility report, going beyond simple keyword matching.

    Args:
        request: A `JobMatchingRequest` containing the candidate's profile and job details.
        current_user: The authenticated user.

    Returns:
        A dictionary containing the detailed analysis results from the
        `analyze_job_compatibility` flow.

    Raises:
        HTTPException: If the analysis fails.
    """
    try:
        result = await run_flow_async(
            analyze_job_compatibility,
            {
                "candidate_profile": request.candidate_profile,
                "job_description": request.job_description,
                "matching_preferences": request.matching_preferences,
            },
        )
        return result
    except Exception as e:
        print(f"Job matching analysis error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to analyze job compatibility"
        )


@router.post(
    "/content-optimization",
    summary="Smart Content Optimization",
    tags=["Analysis"],
)
async def optimize_content(
    request: ContentOptimizationRequest = Body(...),
    current_user: User = Depends(get_current_user),
):
    """
    Optimizes resume or cover letter content for a specific target role.

    This endpoint uses AI to enhance content based on the provided text,
    target role, and specific optimization goals.

    Args:
        request: A `ContentOptimizationRequest` with the content and optimization parameters.
        current_user: The authenticated user.

    Returns:
        A dictionary containing the optimized content and suggested changes from
        the `optimize_content_for_target` flow.

    Raises:
        HTTPException: If the optimization fails.
    """
    try:
        result = await run_flow_async(
            optimize_content_for_target,
            {
                "content": request.content,
                "target_role": request.target_role,
                "optimization_goals": request.optimization_goals,
            },
        )
        return result
    except Exception as e:
        print(f"Content optimization error: {e}")
        raise HTTPException(status_code=500, detail="Failed to optimize content")


@router.post(
    "/resume-intelligence",
    summary="Resume Intelligence Analysis",
    tags=["Analysis"],
)
async def generate_resume_intelligence(
    request: ResumeIntelligenceRequest = Body(...),
    current_user: User = Depends(get_current_user),
):
    """
    Generates a comprehensive intelligence report for a given resume.

    This analysis provides insights into market readiness, skill gaps, and
    actionable recommendations for improvement based on the user's career goals
    and target industry.

    Args:
        request: A `ResumeIntelligenceRequest` with the resume and career context.
        current_user: The authenticated user.

    Returns:
        A dictionary containing the full intelligence report from the
        `generate_resume_intelligence_report` flow.

    Raises:
        HTTPException: If the report generation fails.
    """
    try:
        result = await run_flow_async(
            generate_resume_intelligence_report,
            {
                "resume_content": request.resume_content,
                "target_industry": request.target_industry,
                "career_goals": request.career_goals,
                "experience_level": request.experience_level,
            },
        )
        return result
    except Exception as e:
        print(f"Resume intelligence error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to generate resume intelligence report"
        )
