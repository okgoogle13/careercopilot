"""Tests for /career API endpoints."""

from unittest.mock import ANY, AsyncMock, MagicMock, patch


class TestIngestDocumentsEndpoint:
    def test_ingest_happy_path(self, client):
        """Should return CareerDatabase after successful ingestion."""
        # Mock dependencies in career.py
        mock_data = {
            "personal_info": {
                "full_name": "Test User",
                "email": "test@example.com",
                "phone": "1234567890",
                "location": "Test City",
                "summary": "Test Summary",
            },
            "career_profile": {"summary": "Tech expert"},
            "experience": [],
            "education": [],
            "skills": {"technical": [], "tools": [], "soft": []},
            "certifications": [],
            "projects": [],
        }
        mock_result = MagicMock()
        mock_result.personal_info.full_name = "Test User"
        mock_result.personal_info.email = "test@example.com"
        mock_result.personal_info.phone = "1234567890"
        mock_result.personal_info.location = "Test City"
        mock_result.personal_info.summary = "Test Summary"
        mock_result.career_profile.summary = "Tech expert"
        mock_result.experience = []
        mock_result.education = []
        mock_result.skills.technical = []
        mock_result.skills.tools = []
        mock_result.skills.soft = []
        mock_result.certifications = []
        mock_result.projects = []
        mock_result.model_dump.return_value = mock_data

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
            payload=mock_result.model_dump.return_value,
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
