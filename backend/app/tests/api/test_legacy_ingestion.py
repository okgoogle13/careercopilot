"""Tests for /v1 legacy ingestion endpoints."""

from unittest.mock import ANY, AsyncMock, MagicMock, patch

import pytest


class TestLegacyIngest:
    def test_ingest_happy_path(self, client):
        """Should return CareerDatabase from v1 endpoint."""
        # mock results
        mock_career_db = MagicMock()
        mock_career_db.model_dump.return_value = {"mocked_data": True}

        with patch(
            "app.api.endpoints.legacy_ingestion.collect_uploaded_text", new_callable=AsyncMock
        ) as mock_collect:
            mock_collect.return_value = "Extracted text for legacy ingestion"
            with patch(
                "app.api.endpoints.legacy_ingestion.ingest_career_history",
                return_value=mock_career_db,
            ) as mock_flow:
                with patch(
                    "app.api.endpoints.legacy_ingestion.persist_user_profile_snapshot",
                    new_callable=AsyncMock,
                ) as mock_persist:

                    files = [("files", ("cv.pdf", b"pdf content", "application/pdf"))]
                    response = client.post("/api/v1/ingest", files=files)

        assert response.status_code == 200
        mock_flow.assert_called_once_with("Extracted text for legacy ingestion")
        mock_persist.assert_called_once()
        assert response.json() == {"mocked_data": True}

    def test_ai_fault_returns_500(self, client):
        """AI failure should return 500."""
        with patch(
            "app.api.endpoints.legacy_ingestion.collect_uploaded_text", new_callable=AsyncMock
        ) as mock_collect:
            mock_collect.return_value = "Text"
            with patch(
                "app.api.endpoints.legacy_ingestion.ingest_career_history",
                side_effect=RuntimeError("Genkit failed"),
            ):
                files = [("files", ("cv.pdf", b"content"))]
                response = client.post("/api/v1/ingest", files=files)

        assert response.status_code == 500
        assert "Career ingestion failed" in response.json()["detail"]
