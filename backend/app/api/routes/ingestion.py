"""
Career Ingestion API Endpoint
Handles file upload and AI-powered career data extraction
"""
<<<<<<< HEAD
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from app.flows.ingestion_flow import ingest_career_history
from app.schemas.career_master import CareerDatabase
from app.core.dependencies import get_current_user
from app.models import User
from app.services.user_profile_service import user_profile_service
from app.utils.pdf_parser import extract_text_from_upload
import logging

=======
import logging

from app.utils.pdf_parser import extract_text_from_upload
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.dependencies import get_current_user
from app.flows.ingestion_flow import ingest_career_history
from app.models import User
from app.schemas.career_master import CareerDatabase
from app.services.user_profile_service import user_profile_service

>>>>>>> restoration-KR-Rage-Figma-v2.0
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/ingest", response_model=CareerDatabase, status_code=status.HTTP_200_OK)
async def ingest_career_documents(
<<<<<<< HEAD
    files: List[UploadFile] = File(...),
=======
    files: list[UploadFile] = File(...),
>>>>>>> restoration-KR-Rage-Figma-v2.0
    current_user: User = Depends(get_current_user)
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
<<<<<<< HEAD
            
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
            # Extract text based on file type
            text = await extract_text_from_upload(file)
            if text:
                combined_text_parts.append(f"--- SOURCE: {file.filename} ---\n{text}")
            else:
                logger.warning(f"No text extracted from {file.filename}")
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        if not combined_text_parts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No readable text found in uploaded files. Please upload PDF, DOCX, or TXT files."
            )
<<<<<<< HEAD
        
        # Combine all text
        full_text = "\n\n".join(combined_text_parts)
        logger.info(f"Combined text length: {len(full_text)} characters")
        
        # Call Genkit AI flow for structured extraction
        career_db = ingest_career_history(full_text)
        
=======

        # Combine all text
        full_text = "\n\n".join(combined_text_parts)
        logger.info(f"Combined text length: {len(full_text)} characters")

        # Call Genkit AI flow for structured extraction
        career_db = ingest_career_history(full_text)

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Persist to Firestore (optional - user's master career profile)
        try:
            await user_profile_service.update_user_profile(
                user_id=current_user.uid,
                update_data={"career_database": career_db.model_dump(by_alias=True)}
            )
            logger.info(f"Saved career database for user {current_user.uid}")
        except Exception as e:
            logger.warning(f"Failed to persist to Firestore: {e}. Continuing with response.")
<<<<<<< HEAD
        
        return career_db
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Career ingestion failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing failed: {str(e)}"
=======

        return career_db

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Career ingestion failed: {e!s}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing failed: {e!s}"
>>>>>>> restoration-KR-Rage-Figma-v2.0
        )
