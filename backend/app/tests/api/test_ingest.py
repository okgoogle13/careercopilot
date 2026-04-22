"""Tests for /ingest API endpoints."""

from unittest.mock import patch


class TestUploadArtifact:
    def test_upload_resume_happy_path(self, client):
        """Should successfully call IngestionService.process_file."""
        with patch("app.api.endpoints.ingest.IngestionService") as MockService:
            mock_service_instance = MockService.return_value

            response = client.post(
                "/api/ingest/artifacts/upload",
                data={"source_type": "resume"},
                files={"file": ("resume.pdf", b"pdf binary content", "application/pdf")},
            )

        assert response.status_code == 200
        assert "Successfully ingested resume.pdf" in response.json()["message"]
        mock_service_instance.process_file.assert_called_once_with(
            file_content=b"pdf binary content",
            filename="resume.pdf",
            source_type="resume",
            user_id="test_user_id",
        )

    def test_upload_invalid_source_type_returns_422(self, client):
        """Invalid Literal value should return 422."""
        response = client.post(
            "/api/ingest/artifacts/upload",
            data={"source_type": "invalid_type"},
            files={"file": ("resume.pdf", b"content")},
        )
        assert response.status_code == 422

    def test_ingestion_service_error_returns_500(self, client):
        """Internal errors in service should return 500 via run_endpoint_operation."""
        with patch("app.api.endpoints.ingest.IngestionService") as MockService:
            MockService.return_value.process_file.side_effect = RuntimeError("S3 failure")
            response = client.post(
                "/api/ingest/artifacts/upload",
                data={"source_type": "resume"},
                files={"file": ("resume.pdf", b"content")},
            )
        assert response.status_code == 500
        assert "Internal server error" in response.json()["detail"]
