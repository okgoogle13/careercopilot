# backend/app/api/v1/analysis.py (Revised)

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional, cast

from app.core.dependencies import get_current_user
from app.genkit_flows.advanced_job_matching import analyze_job_match_detailed
from app.genkit_flows.ats_scoring import AtsResult, atsScoring
from app.genkit_flows.flow_decorator import run_flow_async
from app.genkit_flows.resume_intelligence_pipeline import generate_resume_intelligence_report
from app.genkit_flows.smart_content_optimizer import optimize_content_for_job
from app.models import ATSScoreResponse, CategoryScore

router = APIRouter()


class ATSScoreRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post(
    "/ats-score",
    response_model=ATSScoreResponse,
    summary="Get ATS Score Analysis",
    tags=["Analysis"],
)
async def create_ats_score_analysis(
    request: ATSScoreRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> ATSScoreResponse:
    """
    Invokes the sophisticated `atsScoring` Genkit flow and transforms its
    output into the format expected by the frontend UI components.
    """
    try:
        # Step 1: Call your existing, powerful Genkit flow.
        # Note: Your flow expects snake_case arguments.
        flow_result: AtsResult = await run_flow_async(
            atsScoring,
            **{
                "resumeText": request.resume_text,
                "jobDescription": request.job_description,
                "user_id": getattr(current_user, "uid", None),
            },
        )

        # Step 2: Transform flow output (AtsResult) to API response (ATSScoreResponse).
        # This is the "Adapter" logic.
        response_data = ATSScoreResponse(
            overallScore=int(flow_result.overallScore),
            categories=[
                CategoryScore(
                    name="Keyword Optimization",
                    score=int(flow_result.breakdown.keywordScore),
                    status=(
                        "good"
                        if flow_result.breakdown.keywordScore >= 80
                        else ("warning" if flow_result.breakdown.keywordScore >= 60 else "poor")
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
                        else ("warning" if flow_result.breakdown.semanticScore >= 60 else "poor")
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
                        else ("warning" if flow_result.breakdown.formattingScore >= 60 else "poor")
                    ),
                    suggestions=(
                        flow_result.recommendations
                        if flow_result.breakdown.formattingScore < 80
                        else ["Resume format is ATS-friendly."]
                    ),
                ),
            ],
            matched_keywords=getattr(flow_result, "matchedKeywords", []),
            missing_keywords=getattr(flow_result, "missingKeywords", []),
        )

        return response_data

    except Exception as e:
        print(f"API Error in /ats-score endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while running the ATS analysis.",
        )


class JobMatchingRequest(BaseModel):
    candidate_profile: Dict[str, Any]
    job_description: str
    matching_preferences: Dict[str, Any] = Field(default_factory=dict)


class ContentOptimizationRequest(BaseModel):
    content: str
    target_role: str
    optimization_goals: List[str] = Field(default_factory=list)


class ResumeIntelligenceRequest(BaseModel):
    resume_content: str
    target_industry: Optional[str] = None
    career_goals: Optional[str] = None
    experience_level: str = "mid_level"


@router.post(
    "/job-matching",
    summary="Advanced Job Compatibility Analysis",
    tags=["Analysis"],
)
async def analyze_job_match(
    request: JobMatchingRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Analyze compatibility between candidate profile and job opportunity
    using advanced multi-dimensional matching algorithms.
    """
    try:
        result = cast(
            Dict[str, Any],
            await run_flow_async(
                analyze_job_match_detailed,
                **{
                    "job_description": request.job_description,
                    "candidate_profile": request.candidate_profile,
                },
            ),
        )
        return result
    except Exception as e:
        print(f"Job matching analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze job compatibility",
        )


@router.post(
    "/content-optimization",
    summary="Smart Content Optimization",
    tags=["Analysis"],
)
async def optimize_content(
    request: ContentOptimizationRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Optimize resume/cover letter content for specific target roles
    using AI-powered content enhancement.
    """
    try:
        result = cast(
            Dict[str, Any],
            await run_flow_async(
                optimize_content_for_job,
                **{
                    "content": request.content,
                    "job_description": request.target_role,
                    "content_type": "resume",
                    "optimization_goals": request.optimization_goals,
                },
            ),
        )
        return result
    except Exception as e:
        print(f"Content optimization error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to optimize content",
        )


@router.post(
    "/resume-intelligence",
    summary="Resume Intelligence Analysis",
    tags=["Analysis"],
)
async def generate_resume_intelligence(
    request: ResumeIntelligenceRequest = Body(...),
    current_user: Any = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Generate comprehensive resume intelligence report with
    market readiness analysis and optimization recommendations.
    """
    try:
        result = cast(
            Dict[str, Any],
            await run_flow_async(
                generate_resume_intelligence_report,
                **{
                    "resume_content": request.resume_content,
                    "target_industry": request.target_industry,
                    "career_goals": request.career_goals,
                    "experience_level": request.experience_level,
                },
            ),
        )
        return result
    except Exception as e:
        print(f"Resume intelligence error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate resume intelligence report",
        )
