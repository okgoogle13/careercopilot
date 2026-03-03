"""
Career Ingestion API Endpoint
Handles file upload and AI-powered career data extraction
"""
import logging

from app.utils.pdf_parser import extract_text_from_upload
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.dependencies import get_current_user
from app.flows.ingestion_flow import ingest_career_history
from app.models import User
from app.schemas.career_master import CareerDatabase
from app.services.user_profile_service import user_profile_service

from app.core.database import get_db
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/ingest", response_model=CareerDatabase, status_code=status.HTTP_200_OK)
async def ingest_career_documents(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload career documents (PDF, DOCX, TXT) for AI analysis.
    
    Extracts:
    - Personal Information
    - Career Entries (Work, Education, etc.)
    - Structured Achievements (with metrics and STAR analysis)
    - KSC Responses (Key Selection Criteria)
    - Skills Inventory (with proficiency levels)
    
    Returns:
        CareerDatabase: Fully structured career data with AI suggestions
    """
    try:
        # Extract text from all uploaded files
        combined_text_parts = []
        for file in files:
            logger.info(f"Processing file: {file.filename}")

            # Extract text based on file type
            text = await extract_text_from_upload(file)
            if text:
                combined_text_parts.append(f"--- SOURCE: {file.filename} ---\n{text}")
            else:
                logger.warning(f"No text extracted from {file.filename}")

        if not combined_text_parts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No readable text found in uploaded files. Please upload PDF, DOCX, or TXT files."
            )

        # Combine all text
        full_text = "\n\n".join(combined_text_parts)
        logger.info(f"Combined text length: {len(full_text)} characters")

        # Call Genkit AI flow for structured extraction
        career_db = ingest_career_history(full_text)

        # Persist to Firestore (optional - user's master career profile)
        try:
            await user_profile_service.update_user_profile(
                db=db,
                user_id=current_user.id,
                update_data={"career_database": career_db.model_dump(by_alias=True)}
            )
            logger.info(f"Saved career database for user {current_user.id}")
        except Exception as e:
            logger.warning(f"Failed to persist to Firestore: {e}. Continuing with response.")

        return career_db

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Career ingestion failed: {e!s}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing failed: {e!s}"
        )
