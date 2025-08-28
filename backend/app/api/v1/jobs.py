from app.core.dependencies import get_current_user_with_state
from app.core.limiter import limiter
from fastapi import APIRouter, Body, Depends, HTTPException, Request
from app.services.jobs_service import JobsService

# from app.genkit_flows.job_analyzer import analyze_job_description  # Temporarily disabled for deployment
# from app.genkit_flows.resume_analyzer import compare_resume_to_job  #
# Temporarily disabled for deployment
from pydantic import BaseModel

router = APIRouter()


class ResumeComparisonRequest(BaseModel):
    document_id: str
    job_description_text: str


@router.post("/analyze")
async def analyze_job(
    request: Request,
    job_description: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_user_with_state),
):
    """
    Analyzes a job description using a Genkit flow.
    """
    # Temporarily disabled for deployment - genkit flows unavailable
    raise HTTPException(
        status_code=503, detail="AI features temporarily unavailable during deployment"
    )

    # try:
    #     # Call the Genkit flow to analyze the job description
    #     analysis_result_str = await analyze_job_description.run(job_description)
    #
    #     # Convert the string result to a JSON object
    #     analysis_result = json.loads(analysis_result_str)
    #
    #     return analysis_result
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


@router.post("/compare-resume")
@limiter.limit("5/minute")
async def compare_resume(
    request: Request,
    body: ResumeComparisonRequest,
    current_user: dict = Depends(get_current_user_with_state),
):
    """
    Orchestrates the analysis of a job description and comparison with a user's resume.
    """

    # Example Firestore and user ID extraction (replace with actual logic)
    db = request.app.state.firestore_db
    uid = current_user.get("uid")

    # Call the service layer for orchestration and error handling
    return await JobsService.compare_resume_to_job_and_save(
        db=db,
        uid=uid,
        document_id=body.document_id,
        job_description_text=body.job_description_text
    )
