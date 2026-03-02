# backend/app/core/document_export_service.py
"""
Document Export Service: Handles generation and storage of large files
with signed URLs for efficient download management.

This service implements best practices for large file handling:
1. Generate files (PDF, DOCX, ZIP) and store in Cloud Storage
2. Return signed URLs (1-24 hours expiration) instead of content in response
3. Reduce API response size and bandwidth usage
4. Enable long-term file archival and audit trails

Bandwidth Optimization:
- Cover Letter (text): ~3-5 KB → PDF: ~50-100 KB (1.5-2 MB if embedded images)
- Resume (JSON): ~10-20 KB → PDF: ~100-300 KB
- Application Package (JSON): ~50-100 KB → ZIP: ~100-500 KB
- Signed URLs: ~200 bytes (0.2% of original content size)
"""

import json
<<<<<<< HEAD
import logging
from datetime import datetime, timedelta
from io import BytesIO
from typing import Optional, Dict, Any, List
from pathlib import Path
=======
import os
from datetime import datetime, timedelta
from typing import Any
>>>>>>> restoration-KR-Rage-Figma-v2.0

from pydantic import BaseModel

from app.core.cloud_storage import cloud_storage_client
<<<<<<< HEAD
=======
from app.core.supabase_repository import supabase_repo
>>>>>>> restoration-KR-Rage-Figma-v2.0
from app.core.loguru_config import get_logger

logger = get_logger(__name__)


class DocumentExportOptions(BaseModel):
    """Options for document export and signed URL generation."""
    format: str  # 'pdf', 'docx', 'txt', 'json', 'zip'
    expiration_hours: float = 24.0  # Signed URL expiration (1-168 hours)
    include_metadata: bool = True
    compression: bool = True  # Enable gzip compression


class DocumentExportResult(BaseModel):
    """Result of document export operation."""
    success: bool
    document_type: str  # 'cover_letter', 'resume', 'ksc_response', 'application_package'
    file_format: str  # 'pdf', 'docx', 'json', 'zip'
    download_url: str  # Signed URL (expires in 24 hours)
    file_size_bytes: int
    storage_path: str  # gs://bucket/path (for audit/retrieval)
    expires_at: str  # ISO 8601 timestamp
    message: str


class DocumentExportService:
    """
    Service for exporting documents and generating signed URLs.

    Usage:
        service = DocumentExportService()
        result = await service.export_cover_letter(
            content="Dear Hiring Manager...",
            user_id="user123",
            job_title="Software Engineer"
        )
        # Return signed URL to client instead of content
    """

    def __init__(self):
        """Initialize the document export service."""
        self.storage_client = cloud_storage_client
        self.default_expiration_hours = 24.0
        self.max_expiration_hours = 168.0  # 7 days

    def _get_storage_path(
        self,
        user_id: str,
        document_type: str,
        file_format: str
    ) -> str:
        """
        Generate Cloud Storage path for exported document.

        Path structure: exports/{user_id}/{document_type}/{timestamp}.{format}
        Example: exports/user123/cover_letter/2025-01-18_14-30-45-123456.pdf
        """
        timestamp = datetime.utcnow().strftime("%Y-%m-%d_%H-%M-%S-%f")
        return f"exports/{user_id}/{document_type}/{timestamp}.{file_format}"

    def _get_expiration_time(self, expiration_hours: float) -> str:
        """Get ISO 8601 timestamp for URL expiration."""
        expires_at = datetime.utcnow() + timedelta(hours=expiration_hours)
        return expires_at.isoformat() + "Z"

    async def export_cover_letter(
        self,
        content: str,
        user_id: str,
        job_title: str,
<<<<<<< HEAD
        company_name: Optional[str] = None,
        format: str = "pdf",
        expiration_hours: Optional[float] = None
=======
        company_name: str | None = None,
        format: str = "docx",
        expiration_hours: float | None = None,
        theme_id: str = "minimal",
        candidate_name: str | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> DocumentExportResult:
        """
        Export cover letter to file and generate signed URL.

        Args:
            content: Cover letter text content
            user_id: User ID for storage organization
            job_title: Job title (for filename and metadata)
            company_name: Company name (for filename and metadata)
            format: Output format ('pdf', 'docx', 'txt', 'json')
            expiration_hours: Signed URL expiration (default: 24 hours)

        Returns:
            DocumentExportResult with signed URL

        Raises:
            ValueError: If format is not supported
            Exception: If storage or export fails
        """
        expiration_hours = expiration_hours or self.default_expiration_hours

        if format not in ["pdf", "docx", "txt", "json"]:
<<<<<<< HEAD
            raise ValueError(f"Unsupported format: {format}")
=======
            raise ValueError(f"Unsupported format: {format}")  # 'txt' is now a first-class format
>>>>>>> restoration-KR-Rage-Figma-v2.0

        try:
            logger.info(
                "Exporting cover letter",
                user_id=user_id,
                job_title=job_title,
                format=format
            )

<<<<<<< HEAD
            # Generate file content based on format
            if format == "txt":
                file_content = content.encode('utf-8')
=======
            # Generate file content based on unified pipeline
            if format == "txt":
                file_content = content.encode("utf-8")
>>>>>>> restoration-KR-Rage-Figma-v2.0
                content_type = "text/plain"
            elif format == "json":
                data = {
                    "type": "cover_letter",
                    "job_title": job_title,
                    "company_name": company_name,
                    "content": content,
                    "exported_at": datetime.utcnow().isoformat()
                }
<<<<<<< HEAD
                file_content = json.dumps(data, indent=2).encode('utf-8')
                content_type = "application/json"
            else:
                # PDF and DOCX would require additional libraries
                # For now, store as JSON
                logger.warning(
                    f"Format {format} not yet implemented, using JSON",
                    user_id=user_id
                )
                data = {
                    "type": "cover_letter",
                    "job_title": job_title,
                    "company_name": company_name,
                    "content": content,
                    "exported_at": datetime.utcnow().isoformat(),
                    "note": f"PDF/DOCX generation requires additional dependencies"
                }
                file_content = json.dumps(data, indent=2).encode('utf-8')
                content_type = "application/json"
                format = "json"
=======
                file_content = json.dumps(data, indent=2).encode("utf-8")
                content_type = "application/json"
            else:
                from app.core.document_pipeline import document_pipeline
                try:
                    file_content = await document_pipeline.generate_document(
                        doc_type="cover_letter",
                        content=content,
                        template_id=template_id,
                        file_format=format,
                        candidate_name=candidate_name,
                        theme_id=theme_id
                    )
                    content_type = "application/pdf" if format == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                except Exception as e:
                    logger.warning(f"Pipeline failed, falling back to txt: {e}", user_id=user_id)
                    file_content = content.encode("utf-8")
                    content_type = "text/plain"
                    format = "txt"
>>>>>>> restoration-KR-Rage-Figma-v2.0

            # Generate storage path
            storage_path = self._get_storage_path(user_id, "cover_letter", format)

            # Upload to Cloud Storage
            gs_uri = self.storage_client.upload_file(
                file_content=file_content,
                destination_blob_name=storage_path,
                content_type=content_type,
                metadata={
                    "user_id": user_id,
                    "job_title": job_title,
                    "company_name": company_name or "N/A",
                    "document_type": "cover_letter",
                    "exported_at": datetime.utcnow().isoformat()
                },
                cache_control="private, max-age=86400"  # Private cache, 24h
            )

            # Generate signed URL
            blob_name = storage_path
            signed_url = self.storage_client.generate_signed_url(
                blob_name=blob_name,
                expiration_hours=expiration_hours,
                method="GET"
            )

            expires_at = self._get_expiration_time(expiration_hours)
            file_size = len(file_content)

            logger.info(
                "Cover letter exported successfully",
                user_id=user_id,
                format=format,
                file_size=file_size,
                storage_path=storage_path
            )

<<<<<<< HEAD
=======
            # Persist to Supabase DB (Phase 4)
            supabase_repo.create_user_asset(
                user_id=user_id,
                document_type="cover_letter",
                file_name=os.path.basename(storage_path),
                file_type=format,
                storage_uri=gs_uri,
                extracted_data={
                    "job_title": job_title,
                    "company_name": company_name,
                    "content": content,
                    "theme_id": theme_id
                },
                file_size_bytes=file_size
            )

>>>>>>> restoration-KR-Rage-Figma-v2.0
            return DocumentExportResult(
                success=True,
                document_type="cover_letter",
                file_format=format,
                download_url=signed_url,
                file_size_bytes=file_size,
                storage_path=gs_uri,
                expires_at=expires_at,
                message=f"Cover letter exported as {format.upper()}"
            )

        except Exception as e:
            logger.error(
                "Failed to export cover letter",
                user_id=user_id,
                error=str(e),
                exc_info=True
            )
            raise

    async def export_resume(
        self,
<<<<<<< HEAD
        content: Dict[str, Any],
        user_id: str,
        job_title: str,
        format: str = "pdf",
        expiration_hours: Optional[float] = None
=======
        content: dict[str, Any],
        user_id: str,
        job_title: str,
        format: str = "docx",
        expiration_hours: float | None = None,
        theme_id: str = "minimal",
        candidate_name: str | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> DocumentExportResult:
        """
        Export resume to file and generate signed URL.

        Args:
            content: Resume data (dict or text)
            user_id: User ID for storage organization
            job_title: Job title (for context)
            format: Output format ('pdf', 'docx', 'json')
            expiration_hours: Signed URL expiration (default: 24 hours)

        Returns:
            DocumentExportResult with signed URL
        """
        expiration_hours = expiration_hours or self.default_expiration_hours

        if format not in ["pdf", "docx", "json"]:
            raise ValueError(f"Unsupported format: {format}")

        try:
            logger.info(
                "Exporting resume",
                user_id=user_id,
                job_title=job_title,
                format=format
            )

<<<<<<< HEAD
            # Handle both dict and string content
            if isinstance(content, dict):
                file_content = json.dumps(content, indent=2).encode('utf-8')
            else:
                file_content = content.encode('utf-8')

            content_type = "application/json" if format in ["json", "pdf", "docx"] else "text/plain"
=======
            # Generate file content based on unified pipeline
            if format == "json":
                if isinstance(content, dict):
                    file_content = json.dumps(content, indent=2).encode("utf-8")
                else:
                    file_content = content.encode("utf-8")
                content_type = "application/json"
            else:
                from app.core.document_pipeline import document_pipeline
                sections = json.loads(content) if isinstance(content, str) else content
                try:
                    file_content = await document_pipeline.generate_document(
                        doc_type="resume",
                        content=sections,
                        template_id=template_id,
                        file_format=format,
                        candidate_name=candidate_name,
                        theme_id=theme_id
                    )
                    content_type = "application/pdf" if format == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                except Exception as e:
                    logger.warning(f"Pipeline failed for resume, using JSON: {e}")
                    file_content = json.dumps(sections).encode("utf-8")
                    content_type = "application/json"
                    format = "json"
>>>>>>> restoration-KR-Rage-Figma-v2.0

            # Generate storage path
            storage_path = self._get_storage_path(user_id, "resume", format)

            # Upload to Cloud Storage
            gs_uri = self.storage_client.upload_file(
                file_content=file_content,
                destination_blob_name=storage_path,
                content_type=content_type,
                metadata={
                    "user_id": user_id,
                    "job_title": job_title,
                    "document_type": "resume",
                    "exported_at": datetime.utcnow().isoformat()
                },
                cache_control="private, max-age=86400"
            )

            # Generate signed URL
            signed_url = self.storage_client.generate_signed_url(
                blob_name=storage_path,
                expiration_hours=expiration_hours,
                method="GET"
            )

            expires_at = self._get_expiration_time(expiration_hours)
            file_size = len(file_content)

            logger.info(
                "Resume exported successfully",
                user_id=user_id,
                format=format,
                file_size=file_size
            )

<<<<<<< HEAD
=======
            # Persist to Supabase DB (Phase 4)
            supabase_repo.create_user_asset(
                user_id=user_id,
                document_type="resume",
                file_name=os.path.basename(storage_path),
                file_type=format,
                storage_uri=gs_uri,
                extracted_data=sections if isinstance(sections, dict) else {"content": sections},
                file_size_bytes=file_size
            )

>>>>>>> restoration-KR-Rage-Figma-v2.0
            return DocumentExportResult(
                success=True,
                document_type="resume",
                file_format=format,
                download_url=signed_url,
                file_size_bytes=file_size,
                storage_path=gs_uri,
                expires_at=expires_at,
                message=f"Resume exported as {format.upper()}"
            )

        except Exception as e:
            logger.error(
                "Failed to export resume",
                user_id=user_id,
                error=str(e),
                exc_info=True
            )
            raise

    async def export_ksc_response(
        self,
<<<<<<< HEAD
        response_data: Dict[str, Any],
        user_id: str,
        job_title: str,
        format: str = "json",
        expiration_hours: Optional[float] = None
=======
        response_data: dict[str, Any],
        user_id: str,
        job_title: str,
        format: str = "docx",
        expiration_hours: float | None = None,
        theme_id: str = "minimal",
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> DocumentExportResult:
        """
        Export KSC response to file and generate signed URL.

        Args:
            response_data: KSC response data (STAR format)
            user_id: User ID for storage organization
            job_title: Job title for reference
            format: Output format ('json', 'pdf')
            expiration_hours: Signed URL expiration (default: 24 hours)

        Returns:
            DocumentExportResult with signed URL
        """
        expiration_hours = expiration_hours or self.default_expiration_hours

<<<<<<< HEAD
        if format not in ["json", "pdf"]:
=======
        if format not in ["json", "pdf", "docx"]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
            raise ValueError(f"Unsupported format: {format}")

        try:
            logger.info(
                "Exporting KSC response",
                user_id=user_id,
                job_title=job_title,
                format=format
            )

<<<<<<< HEAD
            file_content = json.dumps(response_data, indent=2).encode('utf-8')
            content_type = "application/json"

=======
            # Generate file content based on unified pipeline
            # Generate file content based on unified pipeline
            responses = [response_data] if isinstance(response_data, dict) else response_data
            if format == "json":
                file_content = json.dumps(response_data, indent=2).encode("utf-8")
                content_type = "application/json"
            else:
                from app.core.document_pipeline import document_pipeline
                try:
                    file_content = await document_pipeline.generate_document(
                        doc_type="ksc_response",
                        content=responses,
                        template_id="star", # Default for KSC
                        file_format=format,
                        theme_id=theme_id
                    )
                    content_type = "application/pdf" if format == "pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                except Exception as e:
                    logger.warning(f"Pipeline failed for KSC, using JSON: {e}")
                    file_content = json.dumps(response_data, indent=2).encode("utf-8")
                    content_type = "application/json"
                    format = "json"
>>>>>>> restoration-KR-Rage-Figma-v2.0
            storage_path = self._get_storage_path(user_id, "ksc_response", format)

            gs_uri = self.storage_client.upload_file(
                file_content=file_content,
                destination_blob_name=storage_path,
                content_type=content_type,
                metadata={
                    "user_id": user_id,
                    "job_title": job_title,
                    "document_type": "ksc_response",
                    "exported_at": datetime.utcnow().isoformat()
                },
                cache_control="private, max-age=86400"
            )

            signed_url = self.storage_client.generate_signed_url(
                blob_name=storage_path,
                expiration_hours=expiration_hours,
                method="GET"
            )

            expires_at = self._get_expiration_time(expiration_hours)
            file_size = len(file_content)

            logger.info(
                "KSC response exported successfully",
                user_id=user_id,
                format=format,
                file_size=file_size
            )

<<<<<<< HEAD
=======
            # Persist to Supabase DB (Phase 4)
            supabase_repo.create_user_asset(
                user_id=user_id,
                document_type="ksc_response",
                file_name=os.path.basename(storage_path),
                file_type=format,
                storage_uri=gs_uri,
                extracted_data=responses if isinstance(responses, list) else [response_data],
                file_size_bytes=file_size
            )

>>>>>>> restoration-KR-Rage-Figma-v2.0
            return DocumentExportResult(
                success=True,
                document_type="ksc_response",
                file_format=format,
                download_url=signed_url,
                file_size_bytes=file_size,
                storage_path=gs_uri,
                expires_at=expires_at,
                message=f"KSC response exported as {format.upper()}"
            )

        except Exception as e:
            logger.error(
                "Failed to export KSC response",
                user_id=user_id,
                error=str(e),
                exc_info=True
            )
            raise

    async def export_application_package(
        self,
<<<<<<< HEAD
        package_data: Dict[str, Any],
        user_id: str,
        job_id: str,
        format: str = "json",
        expiration_hours: Optional[float] = None,
=======
        package_data: dict[str, Any],
        user_id: str,
        job_id: str,
        format: str = "json",
        expiration_hours: float | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
        include_files: bool = True
    ) -> DocumentExportResult:
        """
        Export complete application package to file and generate signed URL.

        Can export as:
        - JSON: All data in single JSON file
        - ZIP: Multiple files (resume, cover letter, KSC, metadata)

        Args:
            package_data: Complete application package data
            user_id: User ID for storage organization
            job_id: Job ID for reference
            format: Output format ('json', 'zip')
            expiration_hours: Signed URL expiration (default: 24 hours)
            include_files: Include file attachments in ZIP (default: True)

        Returns:
            DocumentExportResult with signed URL
        """
        expiration_hours = expiration_hours or self.default_expiration_hours

        if format not in ["json", "zip"]:
            raise ValueError(f"Unsupported format: {format}")

        try:
            logger.info(
                "Exporting application package",
                user_id=user_id,
                job_id=job_id,
                format=format
            )

            if format == "json":
                # Simple JSON export
<<<<<<< HEAD
                file_content = json.dumps(package_data, indent=2).encode('utf-8')
=======
                file_content = json.dumps(package_data, indent=2).encode("utf-8")
>>>>>>> restoration-KR-Rage-Figma-v2.0
                content_type = "application/json"
            else:
                # ZIP format would require zipfile library
                # For now, export as JSON
                logger.warning(
<<<<<<< HEAD
                    f"ZIP format not yet implemented, using JSON",
                    user_id=user_id
                )
                file_content = json.dumps(package_data, indent=2).encode('utf-8')
=======
                    "ZIP format not yet implemented, using JSON",
                    user_id=user_id
                )
                file_content = json.dumps(package_data, indent=2).encode("utf-8")
>>>>>>> restoration-KR-Rage-Figma-v2.0
                content_type = "application/json"
                format = "json"

            storage_path = self._get_storage_path(user_id, "application_package", format)

            gs_uri = self.storage_client.upload_file(
                file_content=file_content,
                destination_blob_name=storage_path,
                content_type=content_type,
                metadata={
                    "user_id": user_id,
                    "job_id": job_id,
                    "document_type": "application_package",
                    "exported_at": datetime.utcnow().isoformat()
                },
                cache_control="private, max-age=2592000"  # Private cache, 30 days
            )

            signed_url = self.storage_client.generate_signed_url(
                blob_name=storage_path,
                expiration_hours=expiration_hours,
                method="GET"
            )

            expires_at = self._get_expiration_time(expiration_hours)
            file_size = len(file_content)

            logger.info(
                "Application package exported successfully",
                user_id=user_id,
                format=format,
                file_size=file_size
            )

            return DocumentExportResult(
                success=True,
                document_type="application_package",
                file_format=format,
                download_url=signed_url,
                file_size_bytes=file_size,
                storage_path=gs_uri,
                expires_at=expires_at,
                message=f"Application package exported as {format.upper()}"
            )

        except Exception as e:
            logger.error(
                "Failed to export application package",
                user_id=user_id,
                job_id=job_id,
                error=str(e),
                exc_info=True
            )
            raise

    async def generate_batch_download(
        self,
        user_id: str,
<<<<<<< HEAD
        document_types: List[str],
        expiration_hours: Optional[float] = None
    ) -> Dict[str, str]:
=======
        document_types: list[str],
        expiration_hours: float | None = None
    ) -> dict[str, str]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Generate signed URLs for batch download of multiple documents.

        Args:
            user_id: User ID to fetch documents for
            document_types: List of document types to include
            expiration_hours: Signed URL expiration (default: 24 hours)

        Returns:
            Dict mapping document_type to signed_url

        Note:
            This is a template for future implementation with Firestore integration
        """
        expiration_hours = expiration_hours or self.default_expiration_hours

        logger.info(
            "Generating batch download URLs",
            user_id=user_id,
            document_types=document_types,
            expiration_hours=expiration_hours
        )

        # TODO: Integrate with Firestore to fetch stored documents
        # For now, return empty dict
        return {}


# Singleton instance for use across the application
document_export_service = DocumentExportService()
