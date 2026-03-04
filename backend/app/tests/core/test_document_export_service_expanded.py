"""Tests for document_export_service using current interfaces."""

import types
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.core.document_export_service import DocumentExportService


def _mock_document_pipeline(file_bytes: bytes):
    """Provide a temporary document pipeline module for import-time patching."""
    fake_module = types.SimpleNamespace(
        document_pipeline=types.SimpleNamespace(
            generate_document=AsyncMock(return_value=file_bytes)
        )
    )
    return patch.dict("sys.modules", {"app.core.document_pipeline": fake_module})


@pytest.fixture
def mock_cloud_storage_client():
    """Mock storage client used by the export service."""
    mock = MagicMock()
    mock.generate_signed_url.return_value = "https://example.com/signed_url"
    return mock


@pytest.fixture
def document_export_service(mock_cloud_storage_client):
    """Fixture for DocumentExportService with mocked storage."""
    service = DocumentExportService()
    service.storage_client = mock_cloud_storage_client
    return service


class TestDocumentExportService:
    """Tests for DocumentExportService."""

    @pytest.mark.asyncio
    async def test_export_cover_letter_success_pdf(
        self,
        document_export_service: DocumentExportService,
        mock_cloud_storage_client,
    ):
        """Test successful cover letter export via the PDF pipeline."""
        content = "Dear Hiring Manager..."
        generated_bytes = b"pdf-bytes"
        mock_cloud_storage_client.upload_file.return_value = "gs://bucket/path.pdf"

        with _mock_document_pipeline(generated_bytes):
            result = await document_export_service.export_cover_letter(
                content=content,
                user_id="user123",
                job_title="Software Engineer",
                format="pdf",
            )

        assert result.success is True
        assert result.document_type == "cover_letter"
        assert result.file_format == "pdf"
        assert result.download_url == "https://example.com/signed_url"
        assert result.file_size_bytes == len(generated_bytes)
        assert result.storage_path == "gs://bucket/path.pdf"
        mock_cloud_storage_client.upload_file.assert_called_once()
        mock_cloud_storage_client.generate_signed_url.assert_called_once()

    @pytest.mark.asyncio
    async def test_export_cover_letter_unsupported_format(
        self,
        document_export_service: DocumentExportService,
    ):
        """Test cover letter export with unsupported format."""
        with pytest.raises(ValueError, match="Unsupported format"):
            await document_export_service.export_cover_letter(
                content="Dear Hiring Manager...",
                user_id="user123",
                job_title="Software Engineer",
                format="invalid",
            )

    @pytest.mark.asyncio
    async def test_export_cover_letter_expiration_hours(
        self,
        document_export_service: DocumentExportService,
        mock_cloud_storage_client,
    ):
        """Test cover letter export with custom expiration hours."""
        content = "Dear Hiring Manager..."
        mock_cloud_storage_client.upload_file.return_value = "gs://bucket/path.pdf"

        with _mock_document_pipeline(b"pdf-bytes"):
            result = await document_export_service.export_cover_letter(
                content=content,
                user_id="user123",
                job_title="Software Engineer",
                format="pdf",
                expiration_hours=12.0,
            )

        assert result.success is True
        assert result.document_type == "cover_letter"
        assert result.file_format == "pdf"
        mock_cloud_storage_client.generate_signed_url.assert_called_with(
            blob_name=mock_cloud_storage_client.upload_file.call_args.kwargs[
                "destination_blob_name"
            ],
            expiration_hours=12.0,
            method="GET",
        )

    @pytest.mark.asyncio
    async def test_export_cover_letter_default_expiration_hours(
        self,
        document_export_service: DocumentExportService,
        mock_cloud_storage_client,
    ):
        """Test cover letter export with default expiration hours."""
        mock_cloud_storage_client.upload_file.return_value = "gs://bucket/path.pdf"

        with _mock_document_pipeline(b"pdf-bytes"):
            result = await document_export_service.export_cover_letter(
                content="Dear Hiring Manager...",
                user_id="user123",
                job_title="Software Engineer",
                format="pdf",
            )

        assert result.success is True
        assert result.document_type == "cover_letter"
        assert result.file_format == "pdf"
        assert (
            mock_cloud_storage_client.generate_signed_url.call_args.kwargs["expiration_hours"]
            == 24.0
        )

    @pytest.mark.asyncio
    async def test_export_cover_letter_txt_format(
        self,
        document_export_service: DocumentExportService,
        mock_cloud_storage_client,
    ):
        """Test cover letter export in txt format."""
        content = "Dear Hiring Manager..."
        mock_cloud_storage_client.upload_file.return_value = "gs://bucket/path.txt"

        result = await document_export_service.export_cover_letter(
            content=content,
            user_id="user123",
            job_title="Software Engineer",
            format="txt",
        )

        assert result.success is True
        assert result.document_type == "cover_letter"
        assert result.file_format == "txt"
        assert result.download_url == "https://example.com/signed_url"
        assert result.file_size_bytes == len(content.encode("utf-8"))
        assert result.storage_path == "gs://bucket/path.txt"

    @pytest.mark.asyncio
    async def test_export_cover_letter_json_format(
        self,
        document_export_service: DocumentExportService,
        mock_cloud_storage_client,
    ):
        """Test cover letter export in json format."""
        mock_cloud_storage_client.upload_file.return_value = "gs://bucket/path.json"

        result = await document_export_service.export_cover_letter(
            content="Dear Hiring Manager...",
            user_id="user123",
            job_title="Software Engineer",
            format="json",
        )

        assert result.success is True
        assert result.document_type == "cover_letter"
        assert result.file_format == "json"
        assert result.download_url == "https://example.com/signed_url"
        assert result.storage_path == "gs://bucket/path.json"

    def test_get_storage_path(self, document_export_service: DocumentExportService):
        """Test storage path generation."""
        path = document_export_service._get_storage_path("user123", "cover_letter", "pdf")
        assert path.startswith("exports/user123/cover_letter/")
        assert path.endswith(".pdf")

    def test_get_expiration_time(self, document_export_service: DocumentExportService):
        """Test expiration timestamp generation."""
        expires_at = document_export_service._get_expiration_time(12.0)
        expires_at_datetime = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
        now = datetime.now(UTC)
        assert expires_at_datetime > now
        hours_until_expiry = (expires_at_datetime - now).total_seconds() / 3600.0
        assert hours_until_expiry == pytest.approx(12.0, abs=0.01)
