"""Tests for smart-ingestion API endpoints."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.fixture
def auth_client(client):
    from app.core.auth import get_current_user

    mock_user = SimpleNamespace(
        id="test_uid", uid="test_uid", email="test@example.com", name="Test User"
    )
    client.app.dependency_overrides[get_current_user] = lambda: mock_user
    yield client


class TestSmartIngestionEndpoints:
    def test_health_check(self, client):
        """Should return 200 healthy."""
        response = client.get("/api/smart-ingestion/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_upload_and_tag_happy_path(self, auth_client):
        """Should upload and return AI tags."""
        with patch(
            "app.api.endpoints.smart_ingestion.upload_and_read_document", new_callable=AsyncMock
        ) as mock_upload:
            mock_upload.return_value = ("gs://test/doc.pdf", 100, "Sample Text")
            with patch("app.api.endpoints.smart_ingestion.contextTaggerFlow") as mock_flow:
                mock_flow.run = AsyncMock(
                    return_value={"roleType": "Engineer", "subsectors": ["Tech"], "confidence": 0.9}
                )

                files = {"file": ("test.pdf", b"pdf...", "application/pdf")}

                response = auth_client.post("/api/smart-ingestion/upload-and-tag", files=files)

                assert response.status_code == 200
                assert response.json()["suggestedTags"]["roleType"] == "Engineer"
