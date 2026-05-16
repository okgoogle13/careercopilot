import logging
from typing import Any, Literal

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.api.endpoints._shared import run_endpoint
from app.core.dependencies import get_current_user
from app.services.ingestion import IngestionService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/artifacts/upload")
async def upload_artifact(
    file: UploadFile = File(...),
    source_type: Literal["resume", "cover_letter", "ksc_response"] = Form(...),
    current_user: Any = Depends(get_current_user),
):
    """
    Uploads a career artifact (PDF/DOCX) for ingestion into the RAG Vector Store.
    """

    async def operation() -> dict[str, str]:
        content = await file.read()
        service = IngestionService()

        # Process and ingest
        service.process_file(
            file_content=content,
            filename=file.filename,
            source_type=source_type,
            user_id=current_user.id,
        )

        return {"message": f"Successfully ingested {file.filename} as {source_type}"}

    return await run_endpoint(
        operation,
        "Internal server error during ingestion",
        bad_request_exceptions=(ValueError,),
        logger=logger,
    )
