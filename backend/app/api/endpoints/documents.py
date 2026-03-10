"""
Documents API Endpoints (Revised for Supabase Alignment)

FastAPI endpoints for document generation including:
- Document retrieval (Safe)
- Redlining (Safe)
"""

import json
import logging
import os
import shutil
import tempfile

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from app.api.endpoints._shared import run_endpoint_operation
from app.core.dependencies import get_current_user
from app.core.firebase import get_firestore
from app.services.doc_intelligence import DocumentIntelligenceService

router = APIRouter()
logger = logging.getLogger(__name__)

from app.models.database import User


@router.get("/", status_code=status.HTTP_200_OK)
async def get_documents(current_user: User = Depends(get_current_user)):
    """
    Get all documents for the current user.
    """
    try:
        db = get_firestore()
        docs = db.collection("user_assets").where("user_id", "==", current_user.id).stream()
        assets = []
        for doc in docs:
            d = doc.to_dict()
            d["id"] = doc.id
            assets.append(d)
        return assets
    except Exception as e:
        logger.error("Error fetching documents: %s", e, exc_info=True)
        return []


@router.post("/process/redline")
async def redline_document(file: UploadFile = File(...), edits: str = Form(...)):
    """
    Apply tracked changes (redlines) to a DOCX file.
    """
    service = DocumentIntelligenceService()

    # Create temp files
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as input_tmp:
        shutil.copyfileobj(file.file, input_tmp)
        input_path = input_tmp.name

    output_path = input_path.replace(".docx", "_redlined.docx")

    async def operation() -> FileResponse:
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
            filename=f"redlined_{file.filename}",
        )

    try:
        return await run_endpoint_operation(
            operation,
            "Document redlining failed",
            logger=logger,
        )
    finally:
        # Minimal cleanup: input file only, keep output for serving (OS eventually cleans /tmp)
        if os.path.exists(input_path):
            os.unlink(input_path)
