"""Tests for /career API endpoints."""

from unittest.mock import ANY, AsyncMock, MagicMock, patch

import pytest


class TestIngestDocumentsEndpoint:
    def test_ingest_happy_path(self, client):
        """Should return CareerDatabase after successful ingestion."""
        # Mock dependencies in career.py
        mock_result = MagicMock()
        mock_result.model_dump.return_value = {"personal_information": {}}

        # We need to patch where it's imported in app.api.endpoints.career
        with patch(
            "app.api.endpoints.career.collect_uploaded_text", new_callable=AsyncMock
        ) as mock_collect:
            mock_collect.return_value = "Extracted text from resume"
            with patch(
                "app.api.endpoints.career.ingest_career_docs", new_callable=AsyncMock
            ) as mock_ingest:
                mock_ingest.return_value = mock_result
                with patch(
                    "app.api.endpoints.career.persist_user_profile_snapshot", new_callable=AsyncMock
                ) as mock_persist:

                    # Create a dummy file
                    files = [("files", ("resume.pdf", b"pdf content", "application/pdf"))]
                    response = client.post("/api/career/ingest", files=files)

        assert response.status_code == 200
        mock_collect.assert_called_once()
        mock_ingest.assert_called_once()
        mock_persist.assert_called_once_with(
            db=ANY,
            user_id="test_user_id",
            field_name="career_profile",
            payload={"personal_information": {}},
        )

    def test_ingest_failure_returns_500(self, client):
        """Internal errors should return 500 via run_endpoint_operation."""
        with patch(
            "app.api.endpoints.career.collect_uploaded_text",
            side_effect=RuntimeError("Parsing failed"),
        ):
            files = [("files", ("resume.pdf", b"pdf content", "application/pdf"))]
            response = client.post("/api/career/ingest", files=files)

        assert response.status_code == 500
        assert "Career ingestion failed" in response.json()["detail"]
