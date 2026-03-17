"""Tests for /workflows API endpoints — MVP contract."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def test_client():
    from app.main import app

    return TestClient(app, raise_server_exceptions=False)


class TestWorkflowsEndpoints:
    def test_generate_application_requires_auth(self, test_client):
        """generate-application must reject unauthenticated requests."""
        response = test_client.post(
            "/api/workflows/generate-application",
            json={
                "job_description": "Senior engineer role with 5+ years experience in Python.",
                "user_profile": {"name": "Jane Smith"},
            },
        )
        assert response.status_code in (401, 403)

    def test_generate_application_validates_job_description_length(self, test_client):
        """Should 422 if job_description is too short (< 50 chars)."""
        response = test_client.post(
            "/api/workflows/generate-application",
            json={"job_description": "Short", "user_profile": {"name": "Jane"}},
        )
        assert response.status_code == 422

    def test_workflow_health_returns_200(self, test_client):
        """Health check should return 200 with available status."""
        response = test_client.get("/api/workflows/health")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "workflows"
        assert data["status"] == "available"
        assert data["components"]["genkit_flows"] == "available"

    def test_workflow_status_requires_auth(self, test_client):
        """Status endpoint must reject unauthenticated requests."""
        response = test_client.get("/api/workflows/status/some-workflow-id")
        assert response.status_code in (401, 403)

    def test_generate_application_with_mock_auth_returns_200(self, test_client):
        """With mocked auth + pipeline, returns 200 with workflow_id and result."""
        mock_user = MagicMock()
        mock_user.id = "test-user-id"
        mock_user.name = "Test User"
        mock_user.email = "test@example.com"

        mock_result = MagicMock()
        mock_result.model_dump.return_value = {
            "job_title": "Engineer",
            "company_name": "Acme",
            "normalized_job_description": "desc",
            "chunk_matches": [],
            "ats_preview": {},
            "artifacts": {},
            "export_pack": {},
        }

        with (
            patch(
                "app.api.endpoints.workflows.get_current_user",
                return_value=mock_user,
            ),
            patch(
                "app.api.endpoints.workflows.analyzeJobFromUrl",
                new=AsyncMock(return_value=mock_result),
            ),
            patch("app.api.endpoints.workflows._store_workflow"),
            patch("app.api.endpoints.workflows._update_workflow"),
        ):
            response = test_client.post(
                "/api/workflows/generate-application",
                json={
                    "job_description": "Senior engineer role with 5+ years experience in Python.",
                    "user_profile": {"name": "Test User"},
                },
                headers={"Authorization": "Bearer test-token"},
            )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "workflow_id" in data
        assert data["status"] == "complete"
