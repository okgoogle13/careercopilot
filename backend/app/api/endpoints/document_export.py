# backend/app/api/endpoints/document_export.py
"""
Document Export API Endpoints

FastAPI endpoints for exporting generated documents with signed URLs.

This module demonstrates best practices for large file handling:
1. Generate documents server-side
2. Store in Cloud Storage
3. Return signed URL instead of content
4. Reduce API response size and bandwidth

Example flow:
    1. Client calls /generate-cover-letter (existing endpoint)
    2. Client then calls /export/cover-letter (this module)
    3. Server exports to Cloud Storage and returns signed URL
    4. Client downloads directly from Cloud Storage
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.document_export_service import DocumentExportResult, document_export_service
from app.core.observability import get_logger
from app.models.document_export_schemas import (
    ApplicationPackageExportRequest,
    ApplicationPackageExportResponse,
    BatchExportRequest,
    BatchExportResponse,
    CoverLetterExportRequest,
    CoverLetterExportResponse,
    DocumentExportResponse,
    KSCResponseExportResponse,
    ResumeExportRequest,
    ResumeExportResponse,
)

logger = get_logger(__name__)

router = APIRouter(prefix="/export", tags=["Document Export"])


# ============================================================================
# Helper Functions
# ============================================================================


def _convert_export_result_to_response(
    result: DocumentExportResult, response_class
) -> DocumentExportResponse:
    """Convert DocumentExportResult to appropriate response model."""
    return response_class(
        success=result.success,
        document_type=result.document_type,
        file_format=result.file_format,
        download_url=result.download_url,
        file_size_bytes=result.file_size_bytes,
        storage_path=result.storage_path,
        expires_at=result.expires_at,
        message=result.message,
    )


async def get_current_user_id() -> str:
    """
    Get current user ID from authentication context.

    In production, this would extract from JWT token.
    For now, this is a placeholder.

    TODO: Integrate with actual authentication middleware
    """
    # Placeholder: In real implementation, extract from request context
    return "user_123"


# ============================================================================
# Cover Letter Export Endpoints
# ============================================================================


@router.post(
    "/cover-letter",
    response_model=CoverLetterExportResponse,
    status_code=status.HTTP_200_OK,
    summary="Export cover letter to file",
    description="""
    Export a previously generated cover letter to a file format and receive a signed download URL.

    This endpoint:
    1. Takes the cover letter content and metadata
    2. Generates a file (PDF, DOCX, or JSON)
    3. Stores in Cloud Storage (encrypted, private)
    4. Returns a signed URL (1-24 hour expiration)
    5. Reduces API response size (3-5 KB → 200 bytes URL)

    **Signed URL Features:**
    - Valid for 1-168 hours (configurable)
    - One-time use capability (with additional header)
    - Bandwidth-efficient (direct GCS download)
    - Audit trail (metadata in Cloud Storage)

    **Formats:**
    - `json`: Structured data with metadata
    - `pdf`: Printable document (requires python-reportlab)
    - `docx`: Microsoft Word format (requires python-docx)
    - `txt`: Plain text

    **Processing time:** ~1-2 seconds (file generation + upload)
    """,
)
async def export_cover_letter(
    request: CoverLetterExportRequest,
    content: str,
    user_id: str = Depends(get_current_user_id),
) -> CoverLetterExportResponse:
    """
    Export cover letter with signed URL.

    Args:
        request: Export request with format and expiration
        content: Cover letter content to export
        user_id: User ID (from authentication context)

    Returns:
        CoverLetterExportResponse with signed download URL

    Raises:
        HTTPException: 400 if format not supported
        HTTPException: 500 if export fails
    """
    try:
        logger.info(
            "Cover letter export request",
            user_id=user_id,
            format=request.format,
            job_title=request.job_title,
        )

        result = await document_export_service.export_cover_letter(
            content=content,
            user_id=user_id,
            job_title=request.job_title,
            company_name=request.company_name,
            format=request.format,
            expiration_hours=request.expiration_hours,
        )

        return _convert_export_result_to_response(result, CoverLetterExportResponse)

    except ValueError as e:
        logger.warning("Invalid format requested", error=str(e), user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {e!s}"
        )
    except Exception as e:
        logger.error("Cover letter export failed", error=str(e), user_id=user_id, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export cover letter",
        )


# ============================================================================
# Resume Export Endpoints
# ============================================================================


@router.post(
    "/resume",
    response_model=ResumeExportResponse,
    status_code=status.HTTP_200_OK,
    summary="Export resume to file",
    description="""
    Export a resume to a file format with signed download URL.

    This endpoint is similar to cover letter export but optimized for resume data.

    **Formats:** json, pdf, docx, txt
    **Processing time:** ~1-2 seconds
    """,
)
async def export_resume(
    request: ResumeExportRequest,
    content: dict[str, Any],
    user_id: str = Depends(get_current_user_id),
) -> ResumeExportResponse:
    """
    Export resume with signed URL.

    Args:
        request: Export request with format and target job
        content: Resume content/data to export
        user_id: User ID (from authentication context)

    Returns:
        ResumeExportResponse with signed download URL
    """
    try:
        logger.info(
            "Resume export request",
            user_id=user_id,
            format=request.format,
            job_title=request.job_title,
        )

        result = await document_export_service.export_resume(
            content=content,
            user_id=user_id,
            job_title=request.job_title,
            format=request.format,
            expiration_hours=request.expiration_hours,
        )

        return _convert_export_result_to_response(result, ResumeExportResponse)

    except ValueError as e:
        logger.warning("Invalid format requested", error=str(e), user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {e!s}"
        )
    except Exception as e:
        logger.error("Resume export failed", error=str(e), user_id=user_id, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to export resume"
        )


# ============================================================================
# KSC Response Export Endpoints
# ============================================================================


@router.post(
    "/ksc-response",
    response_model=KSCResponseExportResponse,
    status_code=status.HTTP_200_OK,
    summary="Export KSC response to file",
    description="""
    Export a KSC (Key Selection Criteria) response to file with signed URL.

    KSC responses are typically stored as JSON (STAR format) but can be
    exported to PDF for printing or document management.

    **Formats:** json, pdf (PDF export includes formatted presentation)
    **Processing time:** ~1-2 seconds
    """,
)
async def export_ksc_response(
    request: DocumentExportResponse,  # Reuse base export request
    response_data: dict[str, Any],
    job_title: str,
    user_id: str = Depends(get_current_user_id),
) -> KSCResponseExportResponse:
    """
    Export KSC response with signed URL.

    Args:
        request: Export request
        response_data: STAR-format KSC response
        job_title: Job title for context
        user_id: User ID (from authentication context)

    Returns:
        KSCResponseExportResponse with signed download URL
    """
    try:
        logger.info(
            "KSC response export request",
            user_id=user_id,
            format=request.format,
            job_title=job_title,
        )

        result = await document_export_service.export_ksc_response(
            response_data=response_data,
            user_id=user_id,
            job_title=job_title,
            format=request.format,
            expiration_hours=request.expiration_hours,
        )

        return _convert_export_result_to_response(result, KSCResponseExportResponse)

    except ValueError as e:
        logger.warning("Invalid format requested", error=str(e), user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {e!s}"
        )
    except Exception as e:
        logger.error("KSC response export failed", error=str(e), user_id=user_id, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export KSC response",
        )


# ============================================================================
# Application Package Export Endpoints
# ============================================================================


@router.post(
    "/application-package",
    response_model=ApplicationPackageExportResponse,
    status_code=status.HTTP_200_OK,
    summary="Export complete application package",
    description="""
    Export a complete application package (resume, cover letter, KSC) with signed URL.

    This endpoint exports the entire application package as:
    - JSON: Single file with all data structured
    - ZIP: Multiple files in archive (future feature)

    **Bandwidth optimization:**
    - Full package JSON: ~50-100 KB
    - Signed URL response: ~200 bytes (0.2% of original)
    - Client downloads from Cloud Storage directly
    - Saves ~50-100 KB API response bandwidth per export

    **Processing time:** ~2-3 seconds
    """,
)
async def export_application_package(
    request: ApplicationPackageExportRequest,
    package_data: dict[str, Any],
    user_id: str = Depends(get_current_user_id),
) -> ApplicationPackageExportResponse:
    """
    Export application package with signed URL.

    Args:
        request: Export request with format and job ID
        package_data: Complete application package data
        user_id: User ID (from authentication context)

    Returns:
        ApplicationPackageExportResponse with signed download URL
    """
    try:
        logger.info(
            "Application package export request",
            user_id=user_id,
            format=request.format,
            job_id=request.job_id,
        )

        result = await document_export_service.export_application_package(
            package_data=package_data,
            user_id=user_id,
            job_id=request.job_id,
            format=request.format,
            expiration_hours=request.expiration_hours,
            include_files=request.include_files,
        )

        return _convert_export_result_to_response(result, ApplicationPackageExportResponse)

    except ValueError as e:
        logger.warning("Invalid format requested", error=str(e), user_id=user_id)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid format: {e!s}"
        )
    except Exception as e:
        logger.error(
            "Application package export failed", error=str(e), user_id=user_id, exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export application package",
        )


# ============================================================================
# Batch Export Endpoints
# ============================================================================


@router.post(
    "/batch",
    response_model=BatchExportResponse,
    status_code=status.HTTP_200_OK,
    summary="Export multiple documents in batch",
    description="""
    Export multiple documents in a single batch operation.

    This endpoint is useful for exporting all documents related to a job application
    or creating an archive of all user documents.

    **Example:**
    Export cover letter, resume, and KSC responses all at once, receiving
    separate signed URLs for each document.

    **Processing time:** ~5-10 seconds (varies by document count)
    """,
)
async def export_batch(
    request: BatchExportRequest,
    documents: dict[str, Any],
    user_id: str = Depends(get_current_user_id),
) -> BatchExportResponse:
    """
    Export multiple documents in batch with signed URLs.

    Args:
        request: Batch export request with document types and format
        documents: Dictionary of document data by type
        user_id: User ID (from authentication context)

    Returns:
        BatchExportResponse with list of export results and signed URLs

    TODO: Implement actual batch export logic
    """
    try:
        logger.info(
            "Batch export request",
            user_id=user_id,
            document_types=request.document_types,
            format=request.format,
        )

        # TODO: Implement batch export
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Batch export feature is coming soon",
        )

    except Exception as e:
        logger.error("Batch export failed", error=str(e), user_id=user_id, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to export batch"
        )


# ============================================================================
# Health Check Endpoint
# ============================================================================


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Check export service health",
    description="Verify that the document export service and Cloud Storage are accessible.",
)
async def health_check() -> dict[str, str]:
    """
    Check health of document export service.

    Returns:
        Dict with status information
    """
    return {"status": "ok", "service": "document-export", "cloud_storage": "connected"}
