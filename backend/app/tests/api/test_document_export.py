"""
Tests for document_export API endpoints.
"""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.api.endpoints import document_export
from app.core.document_export_service import DocumentExportResult, document_export_service
from app.core.observability import get_logger
from app.models.document_export_schemas import (
    CoverLetterExportRequest,
    CoverLetterExportResponse,
    DocumentExportResponse,
)


# Mocking dependencies
@pytest.fixture
def mock_document_export_service(monkeypatch):
    """Mock document_export_service."""
    mock = AsyncMock()
    monkeypatch.setattr("app.api.endpoints.document_export.document_export_service", mock)
    return mock


@pytest.fixture
def mock_get_current_user_id():
    """Mock get_current_user_id."""

    async def mock():
        return "user_123"

    return mock


@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(document_export.router)


class TestCoverLetterExport:
    @pytest.mark.asyncio
    async def test_export_cover_letter_success(
        self, client, mock_document_export_service, mock_get_current_user_id
    ):
        """Test successful cover letter export."""
        mock_document_export_service.export_cover_letter.return_value = DocumentExportResult(
            success=True,
            document_type="cover_letter",
            file_format="pdf",
            download_url="http://example.com/cover_letter.pdf",
            file_size_bytes=1024,
            storage_path="gs://bucket/cover_letter.pdf",
            expires_at="2024-01-01T00:00:00Z",
            message="Cover letter exported successfully",
        )

        request = CoverLetterExportRequest(
            format="pdf",
            expiration_hours=1,
            job_title="Software Engineer",
            company_name="Acme Corp",
        )
        content = "This is a sample cover letter."

        response = await client.post("/export/cover-letter", json=request.dict(), content=content)

        assert response.status_code == 200
        assert response.json()["success"] is True
        assert response.json()["download_url"] == "http://example.com/cover_letter.pdf"

    @pytest.mark.asyncio
    async def test_export_cover_letter_invalid_format(
        self, client, mock_document_export_service, mock_get_current_user_id
    ):
        """Test cover letter export with invalid format."""
        mock_document_export_service.export_cover_letter.side_effect = ValueError("Invalid format")

        request = CoverLetterExportRequest(
            format="invalid",
            expiration_hours=1,
            job_title="Software Engineer",
            company_name="Acme Corp",
        )
        content = "This is a sample cover letter."

        response = await client.post("/export/cover-letter", json=request.dict(), content=content)

        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid format: Invalid format"}

    @pytest.mark.asyncio
    async def test_export_cover_letter_export_fails(
        self, client, mock_document_export_service, mock_get_current_user_id
    ):
        """Test cover letter export when export fails."""
        mock_document_export_service.export_cover_letter.side_effect = Exception("Export failed")

        request = CoverLetterExportRequest(
            format="pdf",
            expiration_hours=1,
            job_title="Software Engineer",
            company_name="Acme Corp",
        )
        content = "This is a sample cover letter."

        response = await client.post("/export/cover-letter", json=request.dict(), content=content)

        assert response.status_code == 500
        assert response.json() == {"detail": "Internal Server Error"}

    @pytest.mark.asyncio
    async def test_export_cover_letter_logging(
        self, client, mock_document_export_service, mock_get_current_user_id
    ):
        """Test cover letter export logging."""
        mock_document_export_service.export_cover_letter.return_value = DocumentExportResult(
            success=True,
            document_type="cover_letter",
            file_format="pdf",
            download_url="http://example.com/cover_letter.pdf",
            file_size_bytes=1024,
            storage_path="gs://bucket/cover_letter.pdf",
            expires_at="2024-01-01T00:00:00Z",
            message="Cover letter exported successfully",
        )

        request = CoverLetterExportRequest(
            format="pdf",
            expiration_hours=1,
            job_title="Software Engineer",
            company_name="Acme Corp",
        )
        content = "This is a sample cover letter."

        with patch("app.api.endpoints.document_export.logger.info") as mock_logger_info:
            await client.post("/export/cover-letter", json=request.dict(), content=content)
            mock_logger_info.assert_called_once()
