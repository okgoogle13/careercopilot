
from app.utils.pdf_parser import extract_text_from_upload
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.core.dependencies import get_current_user
from app.flows.career_ingest import IngestInput, ingest_career_docs
from app.models import User
from app.schemas.career import CareerDatabase
from app.services.user_profile_service import user_profile_service
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/ingest", response_model=CareerDatabase)
async def ingest_documents_endpoint(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Uploads PDFs, extracts text, and uses Genkit AI to structure the data.
    Saves the result to the user's career profile in PostgreSQL.
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

        # Save to PostgreSQL (Profile Persistence)
        await user_profile_service.update_user_profile(
            db=db,
            user_id=current_user.id,
            update_data={"career_profile": result.model_dump()}
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

