from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List

from app.flows.career_ingest import ingest_career_docs, IngestInput
from app.utils.pdf_parser import extract_text_from_upload
from app.schemas.career import CareerDatabase
from app.core.dependencies import get_current_user
from app.models import User
from app.services.user_profile_service import user_profile_service

router = APIRouter()

@router.post("/ingest", response_model=CareerDatabase)
async def ingest_documents_endpoint(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Uploads PDFs, extracts text, and uses Genkit AI to structure the data.
    Saves the result to the user's career profile in Firestore.
    """
    try:
        combined_text = []
        for file in files:
            text = await extract_text_from_upload(file)
            if text:
                combined_text.append(f"--- SOURCE: {file.filename} ---\n{text}")
        
        full_text = "\n\n".join(combined_text)
        
        if not full_text:
            raise HTTPException(status_code=400, detail="No readable text found.")

        # Trigger Genkit Flow
        result = await ingest_career_docs(IngestInput(raw_text=full_text))
        
        # Save to Firestore (Profile Persistence)
        await user_profile_service.update_user_profile(
            user_id=current_user.uid,
            update_data={"career_profile": result.model_dump()}
        )
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

