"""
Documents API Endpoints (Revised for Supabase Alignment)

FastAPI endpoints for document generation including:
- Document retrieval (Safe)
- Redlining (Safe)
- Cover letter/KSC generation (Disabled due to Genkit 0.4.0 migration)
"""

import json
import os
import shutil
import tempfile

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from app.core.dependencies import get_current_user
from app.services.doc_intelligence import DocumentIntelligenceService

# Legacy Genkit flows disabled
# from app.genkit_flows.cover_letter_generator import generate_tailored_cover_letter
# from app.genkit_flows.ksc_generator import generateKscResponse

router = APIRouter()


# ============================================================================
# Endpoints
# ============================================================================

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.database import User
from app.models.user_asset import UserAsset


@router.get("/", status_code=status.HTTP_200_OK)
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all documents for the current user.
    """
    try:
        assets = db.query(UserAsset).filter(UserAsset.user_id == current_user.id).all()
        return [asset.to_dict() for asset in assets]
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return []

@router.post("/process/redline")
async def redline_document(file: UploadFile = File(...), edits: str = Form(...)):
    """
    Apply tracked changes (redlines) to a DOCX file.
    
    Args:
        file: The DOCX file to process.
        edits: A JSON string representing a list of edits. 
               Example: '[{"original": "old text", "replacement": "new text"}]'
    """
    service = DocumentIntelligenceService()

    # Create temp files
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as input_tmp:
        shutil.copyfileobj(file.file, input_tmp)
        input_path = input_tmp.name

    output_path = input_path.replace(".docx", "_redlined.docx")

    try:
        try:
            edits_list = json.loads(edits)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON for edits")

        success = service.apply_redlines_to_docx(input_path, output_path, edits_list)

        if not success:
             raise HTTPException(status_code=500, detail="Redlining failed")

        return FileResponse(
            output_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"redlined_{file.filename}"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Minimal cleanup: input file only, keep output for serving (OS eventually cleans /tmp)
        if os.path.exists(input_path):
            os.unlink(input_path)
