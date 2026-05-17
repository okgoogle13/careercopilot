"""Smart Ingestion API Router."""

import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from app.api.endpoints._shared import run_endpoint
from app.core.auth import get_current_user
from app.core.file_upload_decorators import FileUploadConfig, require_valid_file_upload
from app.genkit_flows.smart_ingestion import (
    contextTaggerFlow,
)
from app.models.ingestion_schemas import (
    ExtractAndSaveRequest,
    ExtractAndSaveResponse,
    IngestionErrorResponse,
    UploadAndTagResponse,
)
from app.services.smart_ingestion_service import (
    extract_and_store_document,
    upload_and_read_document,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/upload-and-tag",
    response_model=UploadAndTagResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload document and get AI-suggested tags",
    description="""
    Upload a career document (resume, KSC, writing sample) and receive AI-suggested
    contextual tags (roleType, subsectors).

    This is step 1 of the Smart Ingestion workflow. The frontend will display the
    suggested tags for user confirmation before proceeding to extract-and-save.
    """,
)
@require_valid_file_upload(
    config=FileUploadConfig(
        allowed_extensions={".pdf", ".doc", ".docx", ".txt", ".md", ".rtf"},
        max_file_size_mb=10,
        max_files=1,
    ),
    single_file=True,
)
async def upload_and_tag(
    file: UploadFile = File(..., description="Career document to upload (PDF, DOCX, TXT, etc.)"),
    current_user=Depends(get_current_user),
) -> UploadAndTagResponse:
    """Upload document and get AI-suggested contextual tags."""
    user_id = str(current_user.id)
    logger.info(f"Upload-and-tag request from user {user_id}: {file.filename}")

    async def operation() -> UploadAndTagResponse:
        storage_uri, file_size, document_text = await upload_and_read_document(
            file,
            user_id,
            folder="temp_ingestions",
        )

        logger.info(f"Running Context Tagger flow for user {user_id}")
        suggested_tags = await contextTaggerFlow.run(documentText=document_text, user_id=user_id)

        return UploadAndTagResponse(
            suggestedTags=suggested_tags,
            fileId=storage_uri,
            fileName=file.filename or "uploaded-file",
            fileType=file.content_type or "application/octet-stream",
            fileSizeBytes=file_size,
        )

    return await run_endpoint(
        operation,
        "Failed to process document",
        logger=logger,
    )


@router.post(
    "/extract-and-save",
    response_model=ExtractAndSaveResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Extract structured data and save to asset library",
    description="""
    Extract structured career data from uploaded document and save to user's asset library.
    """,
    responses={
        201: {"description": "Asset successfully created"},
        400: {"model": IngestionErrorResponse, "description": "Invalid request"},
        500: {"model": IngestionErrorResponse, "description": "Internal server error"},
    },
)
async def extract_and_save(
    request: ExtractAndSaveRequest,
    current_user=Depends(get_current_user),
) -> ExtractAndSaveResponse:
    """Extract structured data from document and save to asset library."""
    user_id = str(current_user.id)
    logger.info(
        f"Extract-and-save request from user {user_id}: "
        f"type={request.documentType}, fileId={request.fileId}"
    )

    async def operation() -> ExtractAndSaveResponse:
        asset_id, label = await extract_and_store_document(request, user_id)

        return ExtractAndSaveResponse(
            status="success",
            assetId=asset_id,
            message=f"{label} successfully extracted and saved to your asset library",
        )

    return await run_endpoint(
        operation,
        "Failed to extract and save document",
        logger=logger,
    )


@router.get(
    "/health",
    summary="Health check for Smart Ingestion service",
    description="Check if all required services (Firebase, Database, Genkit) are available",
)
async def health_check() -> JSONResponse:
    """Check health of Smart Ingestion dependencies."""
    health_status = {"storage": True, "db": True, "status": "healthy"}

    if not all([health_status["storage"], health_status["db"]]):
        health_status["status"] = "degraded"

    status_code = (
        status.HTTP_200_OK
        if health_status["status"] == "healthy"
        else status.HTTP_503_SERVICE_UNAVAILABLE
    )
    return JSONResponse(content=health_status, status_code=status_code)
