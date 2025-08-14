from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
import uuid
from google.cloud.firestore import SERVER_TIMESTAMP
from google.api_core.exceptions import GoogleAPICallError

from app.core.dependencies import get_current_user, get_user_document_from_firestore
from app.core.db import db
from app.genkit_flows.ats_scoring import atsScoring, AtsResult

router = APIRouter()

class AtsScoreRequest(BaseModel):
    job_description: str

@router.post("/ats-score/{document_id}")
async def get_ats_score(
    document_id: str,
    request: AtsScoreRequest,
    document: dict = Depends(get_user_document_from_firestore),
    user: dict = Depends(get_current_user)
) -> AtsResult:
    """
    Accepts a resume document and a job description, runs them through the
    ATS scoring flow, saves the result, and returns the analysis.
    """
    try:
        resume_text = document.get("content") or document.get("extractedText")
        if not resume_text:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The selected document has no text content to analyze.")

        # Call the main atsScoring Genkit flow
        analysis_result: AtsResult = await atsScoring.run(
            resumeText=resume_text,
            jobDescription=request.job_description
        )

        # Save the analysis result for tracking
        doc_ref = db.collection("users").document(user['uid']).collection("documents").document(document_id)
        analysis_id = str(uuid.uuid4())
        analysis_ref = doc_ref.collection("analyses").document(analysis_id)
        analysis_data = {
            "id": analysis_id,
            "createdAt": SERVER_TIMESTAMP,
            "jobDescription": request.job_description,
            "result": analysis_result.model_dump() # Save the Pydantic model as a dict
        }
        await analysis_ref.set(analysis_data)
        
        return analysis_result
    
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except GoogleAPICallError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Google Cloud API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred during ATS analysis: {str(e)}")
