from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
import uuid
from google.cloud.firestore import SERVER_TIMESTAMP
from google.api_core.exceptions import GoogleAPICallError

from app.core.dependencies import get_current_user, get_user_document_from_firestore
from app.core.db import db
from app.genkit_flows.ats_scoring import atsScoring, AtsResult
from app.genkit_flows.resume_optimizer import optimizeResume, OptimizedResume

router = APIRouter()


class AnalysisRequest(BaseModel):
    job_description: str


class OptimizeResumeResponse(BaseModel):
    optimized_text: str


@router.post("/ats-score/{document_id}", response_model=AtsResult)
async def get_ats_score(
    document_id: str,
    request: AnalysisRequest,
    document: dict = Depends(get_user_document_from_firestore),
    user: dict = Depends(get_current_user),
):
    """
    Accepts a resume document and a job description, runs them through the
    ATS scoring flow, saves the result, and returns the analysis.
    """
    try:
        resume_text = document.get("content") or document.get("extractedText")
        if not resume_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected document has no text content to analyze.",
            )

        # Call the main atsScoring Genkit flow
        analysis_result: AtsResult = await atsScoring.run(
            resumeText=resume_text, jobDescription=request.job_description
        )

        # Save the analysis result for tracking
        doc_ref = (
            db.collection("users")
            .document(user["uid"])
            .collection("documents")
            .document(document_id)
        )
        analysis_id = str(uuid.uuid4())
        analysis_ref = doc_ref.collection("analyses").document(analysis_id)
        analysis_data = {
            "id": analysis_id,
            "createdAt": SERVER_TIMESTAMP,
            "jobDescription": request.job_description,
            "result": analysis_result.model_dump(),  # Save the Pydantic model as a dict
        }
        await analysis_ref.set(analysis_data)

        return analysis_result

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except GoogleAPICallError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Google Cloud API error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during ATS analysis: {str(e)}",
        )


@router.post("/optimize-resume/{document_id}", response_model=OptimizeResumeResponse)
async def optimize_resume_endpoint(
    document_id: str,
    request: AnalysisRequest,
    document: dict = Depends(get_user_document_from_firestore),
    user: dict = Depends(get_current_user),
):
    """
    Optimizes a resume by incorporating missing keywords based on a job description.
    """
    try:
        resume_text = document.get("content") or document.get("extractedText")
        if not resume_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected document has no text content to optimize.",
            )

        # Step 1: Run ATS scoring to find missing keywords
        analysis_result: AtsResult = await atsScoring.run(
            resumeText=resume_text, jobDescription=request.job_description
        )

        if not analysis_result.missingKeywords or len(analysis_result.missingKeywords) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No missing keywords were found to optimize. Your resume is already well-aligned!",
            )

        # Step 2: Run the optimizer flow
        optimized_result: OptimizedResume = await optimizeResume.run(
            resumeText=resume_text,
            missingKeywords=analysis_result.missingKeywords,
            jobDescription=request.job_description,
        )

        return OptimizeResumeResponse(optimized_text=optimized_result.resume_text)

    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except GoogleAPICallError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Google Cloud API error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during resume optimization: {str(e)}",
        )
