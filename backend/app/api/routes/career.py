<<<<<<< HEAD
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List

from app.flows.career_ingest import ingest_career_docs, IngestInput
from app.utils.pdf_parser import extract_text_from_upload
from app.schemas.career import CareerDatabase
from app.core.dependencies import get_current_user
from app.models import User
=======

from app.utils.pdf_parser import extract_text_from_upload
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.core.dependencies import get_current_user
from app.flows.career_ingest import IngestInput, ingest_career_docs
from app.models import User
from app.schemas.career import CareerDatabase
>>>>>>> restoration-KR-Rage-Figma-v2.0
from app.services.user_profile_service import user_profile_service

router = APIRouter()

@router.post("/ingest", response_model=CareerDatabase)
async def ingest_documents_endpoint(
<<<<<<< HEAD
    files: List[UploadFile] = File(...),
=======
    files: list[UploadFile] = File(...),
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
        
        full_text = "\n\n".join(combined_text)
        
=======

        full_text = "\n\n".join(combined_text)

>>>>>>> restoration-KR-Rage-Figma-v2.0
        if not full_text:
            raise HTTPException(status_code=400, detail="No readable text found.")

        # Trigger Genkit Flow
        result = await ingest_career_docs(IngestInput(raw_text=full_text))
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Save to Firestore (Profile Persistence)
        await user_profile_service.update_user_profile(
            user_id=current_user.uid,
            update_data={"career_profile": result.model_dump()}
        )
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

