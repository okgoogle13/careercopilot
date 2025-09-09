# backend/app/api/v1/analysis.py (Revised)

from app.api.dependencies import User, get_current_user

# Import the flow's output model AND the frontend's expected response model
from app.genkit_flows.ats_scoring import AtsResult, atsScoring
from app.models import ATSScoreResponse, CategoryScore
from fastapi import APIRouter, Body, Depends, HTTPException
from genkit.flow import run_flow_async
from pydantic import BaseModel

router = APIRouter()


class ATSScoreRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post(
    "/ats-score",
    # The response_model MUST match what the frontend expects.
    response_model=ATSScoreResponse,
    summary="Get ATS Score Analysis",
    tags=["Analysis"],
)
async def create_ats_score_analysis(
    request: ATSScoreRequest = Body(...), current_user: User = Depends(get_current_user)
):
    """
    Invokes the sophisticated `atsScoring` Genkit flow and transforms its
    output into the format expected by the frontend UI components.
    """
    try:
        # Step 1: Call your existing, powerful Genkit flow.
        # Note: Your flow expects snake_case arguments.
        flow_result: AtsResult = await run_flow_async(
            atsScoring,
            {
                "resumeText": request.resume_text,
                "jobDescription": request.job_description,
                "user_id": current_user.uid,
            },
        )

        # Step 2: Transform the flow's output (AtsResult) into the API response model (ATSScoreResponse).
        # This is the "Adapter" logic.
        response_data = ATSScoreResponse(
            overallScore=int(flow_result.overallScore),
            categories=[
                CategoryScore(
                    name="Keyword Optimization",
                    score=int(flow_result.breakdown.keywordScore),
                    status="good"
                    if flow_result.breakdown.keywordScore >= 80
                    else "warning"
                    if flow_result.breakdown.keywordScore >= 60
                    else "poor",
                    # We can use the main recommendations for each category or create more specific ones.
                    # For now, let's pass the main recommendations if the score is not 'good'.
                    suggestions=flow_result.recommendations
                    if flow_result.breakdown.keywordScore < 80
                    else ["Keywords are well-optimized."],
                ),
                CategoryScore(
                    name="Semantic Match",
                    score=int(flow_result.breakdown.semanticScore),
                    status="good"
                    if flow_result.breakdown.semanticScore >= 80
                    else "warning"
                    if flow_result.breakdown.semanticScore >= 60
                    else "poor",
                    suggestions=flow_result.recommendations
                    if flow_result.breakdown.semanticScore < 80
                    else ["Semantic content aligns well with the job."],
                ),
                CategoryScore(
                    name="Formatting & Structure",
                    score=int(flow_result.breakdown.formattingScore),
                    status="good"
                    if flow_result.breakdown.formattingScore >= 80
                    else "warning"
                    if flow_result.breakdown.formattingScore >= 60
                    else "poor",
                    suggestions=flow_result.recommendations
                    if flow_result.breakdown.formattingScore < 80
                    else ["Resume format is ATS-friendly."],
                ),
            ],
            matched_keywords=flow_result.matchedKeywords,
            missing_keywords=flow_result.missingKeywords,
        )

        return response_data

    except Exception as e:
        print(f"API Error in /ats-score endpoint: {e}")
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred while running the ATS analysis."
        )


# ... (keep the other endpoints like /keywords and /recommendations as they are for now)
