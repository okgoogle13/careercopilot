"""Tests for /workflows API endpoints."""

from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def test_client():
    from app.main import app

    return TestClient(app, raise_server_exceptions=False)


class TestWorkflowsEndpoints:
    def test_generate_application_returns_503(self, test_client):
        """generate-application is disabled and should return 503."""
        response = test_client.post(
            "/api/workflows/generate-application",
            json={
                "job_description": "Senior engineer role with 5+ years experience in Python.",
                "user_profile": {"name": "Jane Smith"},
            },
        )
        assert response.status_code == 503

    def test_scan_email_returns_503(self, test_client):
        """scan-email-opportunities is disabled and should return 503."""
        response = test_client.post(
            "/api/workflows/scan-email-opportunities",
            json={"user_id": "user-123"},
        )
        assert response.status_code == 503

    def test_workflow_health_returns_200(self, test_client):
        """Health check endpoint should return 200 with status info."""
        response = test_client.get("/api/workflows/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["service"] == "workflows"

    def test_workflow_status_returns_501(self, test_client):
        """Status endpoint should return 501 for any workflow_id."""
        response = test_client.get("/api/workflows/status/some-workflow-id")
        assert response.status_code == 501

    def test_generate_application_validates_job_description_length(self, test_client):
        """Should 422 if job_description is too short (< 50 chars)."""
        response = test_client.post(
            "/api/workflows/generate-application",
            json={"job_description": "Short", "user_profile": {"name": "Jane"}},
        )
        assert response.status_code == 422
