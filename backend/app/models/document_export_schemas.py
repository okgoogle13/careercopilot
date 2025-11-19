# backend/app/models/document_export_schemas.py
"""
Document Export and Download Schemas

Pydantic models for document export functionality, supporting:
- Signed URL generation for downloads
- Document metadata tracking
- Batch export operations
- Bandwidth-optimized response structures
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl


# ============================================================================
# Export Request Models
# ============================================================================


class DocumentExportRequest(BaseModel):
    """Request for document export with format selection"""

    format: str = Field(
        default="json",
        description="Export format: json, pdf, docx, txt, zip",
        pattern="^(json|pdf|docx|txt|zip)$"
    )
    expiration_hours: float = Field(
        default=24.0,
        description="Signed URL expiration time in hours (1-168)",
        ge=1,
        le=168
    )


class CoverLetterExportRequest(DocumentExportRequest):
    """Request for cover letter export"""

    job_title: str = Field(
        ...,
        description="Job title for export context",
        min_length=1,
        max_length=200
    )
    company_name: Optional[str] = Field(
        default=None,
        description="Company name (optional)",
        max_length=200
    )


class ResumeExportRequest(DocumentExportRequest):
    """Request for resume export"""

    job_title: str = Field(
        ...,
        description="Target job title for personalization",
        min_length=1,
        max_length=200
    )


class ApplicationPackageExportRequest(DocumentExportRequest):
    """Request for application package export"""

    job_id: str = Field(
        ...,
        description="Job ID for export context",
        min_length=1
    )
    include_files: bool = Field(
        default=True,
        description="Include file attachments in ZIP export"
    )


class BatchExportRequest(BaseModel):
    """Request for batch export of multiple documents"""

    document_types: List[str] = Field(
        ...,
        description="Document types to export: cover_letter, resume, ksc_response, application_package",
        min_items=1
    )
    format: str = Field(
        default="json",
        description="Export format",
        pattern="^(json|pdf|docx|txt|zip)$"
    )
    expiration_hours: float = Field(
        default=24.0,
        description="Signed URL expiration time in hours",
        ge=1,
        le=168
    )


# ============================================================================
# Export Response Models
# ============================================================================


class DocumentExportResponse(BaseModel):
    """Response for document export operation"""

    success: bool = Field(
        description="Whether export was successful"
    )
    document_type: str = Field(
        description="Type of document exported: cover_letter, resume, ksc_response, application_package"
    )
    file_format: str = Field(
        description="Format of exported file: json, pdf, docx, txt, zip"
    )
    download_url: str = Field(
        description="Signed URL for downloading exported document (valid for specified hours)"
    )
    file_size_bytes: int = Field(
        ge=0,
        description="Size of exported file in bytes"
    )
    storage_path: str = Field(
        description="Cloud Storage path (gs://bucket/path) for audit and retention"
    )
    expires_at: str = Field(
        description="ISO 8601 timestamp when signed URL expires"
    )
    message: str = Field(
        description="Success or error message"
    )


class CoverLetterExportResponse(DocumentExportResponse):
    """Response for cover letter export"""

    document_type: str = Field(
        default="cover_letter",
        description="Document type is always cover_letter"
    )


class ResumeExportResponse(DocumentExportResponse):
    """Response for resume export"""

    document_type: str = Field(
        default="resume",
        description="Document type is always resume"
    )


class KSCResponseExportResponse(DocumentExportResponse):
    """Response for KSC response export"""

    document_type: str = Field(
        default="ksc_response",
        description="Document type is always ksc_response"
    )


class ApplicationPackageExportResponse(DocumentExportResponse):
    """Response for application package export"""

    document_type: str = Field(
        default="application_package",
        description="Document type is always application_package"
    )


class BatchExportResponse(BaseModel):
    """Response for batch export operation"""

    success: bool = Field(
        description="Whether all exports were successful"
    )
    exports: List[DocumentExportResponse] = Field(
        description="List of export results for each document type"
    )
    total_size_bytes: int = Field(
        ge=0,
        description="Total size of all exported files"
    )
    message: str = Field(
        description="Success or error summary message"
    )


# ============================================================================
# Download Models (for future file download endpoints)
# ============================================================================


class FileDownloadMetadata(BaseModel):
    """Metadata for file download operations"""

    file_id: str = Field(
        description="Unique file identifier (from export operation)"
    )
    file_name: str = Field(
        description="Original or suggested file name"
    )
    content_type: str = Field(
        description="MIME type of file"
    )
    file_size_bytes: int = Field(
        ge=0,
        description="Size of file in bytes"
    )
    created_at: datetime = Field(
        description="Timestamp when file was created"
    )
    expires_at: datetime = Field(
        description="Timestamp when file will expire"
    )
    storage_path: str = Field(
        description="Cloud Storage path for auditing"
    )


class DownloadUrlRequest(BaseModel):
    """Request for download URL (if needed in future)"""

    file_id: str = Field(
        description="File ID from previous export operation"
    )
    expiration_hours: float = Field(
        default=24.0,
        description="Requested URL expiration",
        ge=1,
        le=168
    )


class DownloadUrlResponse(BaseModel):
    """Response with download URL"""

    success: bool = Field(
        description="Whether request was successful"
    )
    download_url: str = Field(
        description="Signed URL for file download"
    )
    expires_at: str = Field(
        description="ISO 8601 timestamp when URL expires"
    )
    metadata: FileDownloadMetadata = Field(
        description="File metadata"
    )
    message: str = Field(
        description="Success or error message"
    )


# ============================================================================
# Enhanced Document Generation Responses (with export support)
# ============================================================================


class CoverLetterResponseWithExport(BaseModel):
    """Enhanced cover letter response with download support"""

    success: bool = Field(
        description="Whether generation was successful"
    )
    coverLetter: Optional[str] = Field(
        description="Generated cover letter content (for immediate use)"
    )
    message: str = Field(
        description="Success or error message"
    )
    processingTimeSeconds: float = Field(
        description="Total processing time"
    )
    export_options: Optional[Dict[str, str]] = Field(
        default=None,
        description="Available export formats and endpoints to retrieve signed URLs"
    )
    # Note: Export URLs are retrieved via separate endpoint to avoid response bloat


class ResumeResponseWithExport(BaseModel):
    """Enhanced resume response with download support"""

    success: bool = Field(
        description="Whether generation was successful"
    )
    resume: Optional[Dict[str, Any]] = Field(
        description="Generated resume data (for immediate use)"
    )
    message: str = Field(
        description="Success or error message"
    )
    processingTimeSeconds: float = Field(
        description="Total processing time"
    )
    export_options: Optional[Dict[str, str]] = Field(
        default=None,
        description="Available export formats and endpoints"
    )


class KSCResponseWithExport(BaseModel):
    """Enhanced KSC response with download support"""

    success: bool = Field(
        description="Whether generation was successful"
    )
    response: Optional[Dict[str, str]] = Field(
        description="Generated STAR response (for immediate use)"
    )
    message: str = Field(
        description="Success or error message"
    )
    processingTimeSeconds: float = Field(
        description="Total processing time"
    )
    export_options: Optional[Dict[str, str]] = Field(
        default=None,
        description="Available export formats and endpoints"
    )


# ============================================================================
# Legacy Response Models (for backward compatibility)
# ============================================================================


class CoverLetterResponseLegacy(BaseModel):
    """Legacy cover letter response (before export support)"""

    success: bool = Field(description="Whether generation was successful")
    coverLetter: Optional[str] = Field(description="Generated cover letter content")
    message: str = Field(description="Success or error message")
    processingTimeSeconds: float = Field(description="Total processing time")
