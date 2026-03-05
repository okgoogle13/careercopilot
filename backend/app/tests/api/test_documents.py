"""Tests for /documents API endpoints."""

import json
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest


@pytest.fixture
def auth_client(client):
    from app.core.dependencies import get_current_user

    mock_user = SimpleNamespace(id=1, uid="test_uid", email="test@example.com", name="Test User")
    client.app.dependency_overrides[get_current_user] = lambda: mock_user
    yield client


class TestDocumentsEndpoints:
    def test_get_documents_empty(self, auth_client):
        """Should return empty list for user with no documents."""
        response = auth_client.get("/api/documents/")
        assert response.status_code == 200
        assert response.json() == []

    def test_redline_document_happy_path(self, auth_client):
        """Should process redlines and return a FileResponse."""
        with patch("app.api.endpoints.documents.DocumentIntelligenceService") as MockService:
            mock_service = MockService.return_value
            mock_service.apply_redlines_to_docx.return_value = True

            # Use real bytes but mock the service that processes them
            edits = json.dumps([{"original": "old", "replacement": "new"}])
            files = {
                "file": (
                    "test.docx",
                    b"fake docx content",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                )
            }
            data = {"edits": edits}

            # Use patch to avoid FileResponse actually checking if output_path exists during init
            # Actually, FileResponse checks existence on init. So we better mock it.
            with patch("app.api.endpoints.documents.FileResponse") as MockFileResponse:
                MockFileResponse.return_value = MagicMock()
                response = auth_client.post(
                    "/api/documents/process/redline", data=data, files=files
                )

        assert response.status_code == 200
        mock_service.apply_redlines_to_docx.assert_called_once()

    def test_redline_document_invalid_json(self, auth_client):
        """Should return 400 for malformed edits JSON."""
        files = {"file": ("test.docx", b"content")}
        data = {"edits": "[[ invalid json"}
        response = auth_client.post("/api/documents/process/redline", data=data, files=files)
        assert response.status_code == 400
        assert "Invalid JSON" in response.json()["detail"]
