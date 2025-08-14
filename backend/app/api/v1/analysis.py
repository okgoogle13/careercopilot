`from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import uuid
from google.cloud.firestore import SERVER_TIMESTAMP

from app.core.dependencies import get_current_user
from app.core.db import db
from app.genkit_flows.ats_scoring import atsScoring, AtsResult

router = APIRouter()

class AtsScoreRequest(BaseModel):
    document_id: str
    job_description: str

@router.post("/ats-score")
async def get_ats_score(
    request: AtsScoreRequest,
    uid: str = Depends(get_current_user)
) -> AtsResult:
    """
    Accepts a resume document and a job description, runs them through the
    ATS scoring flow, saves the result, and returns the analysis.
    """
    try:
        # 1. Fetch the resume document from Firestore
        doc_ref = db.collection("users").document(uid).collection("documents").document(request.document_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Resume document not found.")
        
        resume_text = doc.to_dict().get("content") or doc.to_dict().get("extractedText")
        if not resume_text:
            raise HTTPException(status_code=400, detail="The selected document has no text content to analyze.")

        # 2. Call the main atsScoring Genkit flow
        analysis_result: AtsResult = await atsScoring.run(
            resumeText=resume_text,
            jobDescription=request.job_description
        )

        # 3. Save the analysis result for tracking
        analysis_id = str(uuid.uuid4())
        analysis_ref = doc_ref.collection("analyses").document(analysis_id)
        analysis_data = {
            "id": analysis_id,
            "createdAt": SERVER_TIMESTAMP,
            "jobDescription": request.job_description,
            "result": analysis_result.model_dump() # Save the Pydantic model as a dict
        }
        analysis_ref.set(analysis_data)
        
        # 4. Return the full analysis result
        return analysis_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during ATS analysis: {str(e)}")
