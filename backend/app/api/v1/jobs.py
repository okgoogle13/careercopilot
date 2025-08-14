from fastapi import APIRouter, Depends, HTTPException, Body, Request
from app.core.dependencies import get_current_user
from app.core.db import db
from app.core.limiter import limiter
from app.genkit_flows.job_analyzer import analyze_job_description
from app.genkit_flows.resume_analyzer import compare_resume_to_job
from pydantic import BaseModel
import json

router = APIRouter()

class ResumeComparisonRequest(BaseModel):
    document_id: str
    job_description_text: str

def get_user_uid_for_limiter(request: Request) -> str:
    """
    Custom key function for slowapi to use the authenticated user's UID.
    This assumes the get_current_user dependency has already been resolved
    and the uid is available in the request state, which is a common pattern.
    We'll ensure our dependency does this.
    """
    # This is a bit of a workaround to get the uid into the key function.
    # A more robust solution might involve a custom dependency that sets request.state.user
    # For now, we assume the dependency adds it.
    # Let's adjust the main dependency to do this.
    return request.state.user_uid


@router.post("/analyze")
async def analyze_job(
    uid: str = Depends(get_current_user),
    job_description: str = Body(..., embed=True),
):
    """
    Analyzes a job description using a Genkit flow.
    """
    try:
        # Call the Genkit flow to analyze the job description
        analysis_result_str = await analyze_job_description.run(job_description)

        # Convert the string result to a JSON object
        analysis_result = json.loads(analysis_result_str)
        
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


@router.post("/compare-resume")
@limiter.limit("5/minute")
async def compare_resume(
    request: Request, # Add Request to access its state
    body: ResumeComparisonRequest,
    uid: str = Depends(get_current_user),
):
    """
    Orchestrates the analysis of a job description and comparison with a user's resume.
    """
    # Manually store uid in request state for the limiter to access
    request.state.user_uid = uid
    
    try:
        # Step A: Analyze the job description
        job_analysis_str = await analyze_job_description.run(body.job_description_text)
        job_analysis_data = json.loads(job_analysis_str)

        # Step B: Fetch the user's resume text from Firestore
        doc_ref = db.collection("users").document(uid).collection("documents").document(body.document_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Resume document not found")
        
        resume_text = doc.to_dict().get("extractedText")
        if not resume_text:
            raise HTTPException(status_code=400, detail="Resume has no extracted text.")

        # Step C: Compare the resume to the job analysis
        comparison_result_str = await compare_resume_to_job.run(
            resume_text=resume_text,
            job_analysis_data=job_analysis_data
        )
        comparison_result = json.loads(comparison_result_str)

        return comparison_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during comparison: {e}")
