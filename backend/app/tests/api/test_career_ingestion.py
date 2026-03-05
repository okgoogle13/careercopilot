"""Tests for career ingestion endpoints."""

from unittest.mock import ANY, AsyncMock, MagicMock, patch

import pytest


class TestCareerIngest:
    def test_ingest_happy_path(self, client):
        """Should return CareerDatabase from career ingestion endpoint."""
        # mock results
        mock_data = {
            "Personal_Information": {
                "FullName": "Jane Doe",
                "Phone": "123-456-7890",
                "Email": "jane@example.com",
                "Location": "San Francisco, CA",
                "Portfolio_Website_URLs": [],
            },
            "Career_Profile": {
                "Target_Titles": ["Software Engineer"],
                "Master_Summary_Points": ["Experienced developer"],
            },
            "Master_Skills_Inventory": [],
            "Career_Entries": [],
            "Structured_Achievements": [],
            "KSC_Responses": [],
        }
        from app.schemas.career_master import CareerDatabase

        mock_career_db = CareerDatabase.model_validate(mock_data)

        with patch(
            "app.api.endpoints.career_ingestion.collect_uploaded_text", new_callable=AsyncMock
        ) as mock_collect:
            mock_collect.return_value = "Extracted text for career ingestion"
            with patch(
                "app.api.endpoints.career_ingestion.ingest_career_history",
                return_value=mock_career_db,
            ) as mock_flow:
                with patch(
                    "app.api.endpoints.career_ingestion.persist_user_profile_snapshot",
                    new_callable=AsyncMock,
                ) as mock_persist:

                    files = [("files", ("cv.pdf", b"pdf content", "application/pdf"))]
                    response = client.post("/api/v1/ingest", files=files)

        assert response.status_code == 200
        mock_flow.assert_called_once_with("Extracted text for career ingestion")
        mock_persist.assert_called_once()
        assert response.json() == mock_data

    def test_ai_fault_returns_500(self, client):
        """AI failure should return 500."""
        with patch(
            "app.api.endpoints.career_ingestion.collect_uploaded_text", new_callable=AsyncMock
        ) as mock_collect:
            mock_collect.return_value = "Text"
            with patch(
                "app.api.endpoints.career_ingestion.ingest_career_history",
                side_effect=RuntimeError("Genkit failed"),
            ):
                files = [("files", ("cv.pdf", b"content"))]
                response = client.post("/api/v1/ingest", files=files)

        assert response.status_code == 500
        assert "Career ingestion failed" in response.json()["detail"]
