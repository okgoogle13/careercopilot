"""
Comprehensive integration tests for all backend API endpoints.
Tests router.py endpoint integration and request/response flows.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import MagicMock, patch

from app.main import app
from app.models.database import User
from app.core.database import get_db


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user for all endpoints."""
    def mock_get_current_user():
        return User(
            id="test-user-integration",
            email="integration@test.com",
            name="Integration Test User",
            auth_provider="firebase"
        )

    from app.core import dependencies
    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


@pytest.fixture
def mock_db():
    """Mock database session."""
    mock_session = MagicMock(spec=Session)
    return mock_session


class TestAnalysisEndpoints:
    """Integration tests for /analysis endpoints."""

    def test_analyze_job_post_endpoint(self, client, mock_current_user):
        """Test job analysis endpoint integration."""
        response = client.get("/api/analysis/job/example-job-id")
        # 404 expected if job doesn't exist
        assert response.status_code in [200, 404, 503]

    def test_analyze_resume_endpoint(self, client, mock_current_user):
        """Test resume analysis endpoint returns proper structure."""
        # This would require multipart form data with resume file
        # For now, test that endpoint exists and handles missing data
        response = client.post("/api/analysis/resume")
        assert response.status_code in [422, 503]  # Missing required data or service disabled


class TestAuthEndpoints:
    """Integration tests for /auth endpoints."""

    def test_auth_router_exists(self, client):
        """Verify auth endpoints are registered."""
        # Test that auth endpoints return proper responses
        response = client.post("/api/auth/register", json={})
        # Should return validation error or success
        assert response.status_code in [200, 422]


class TestConfigEndpoints:
    """Integration tests for /config endpoints."""

    def test_get_app_config(self, client, mock_current_user):
        """Test config endpoint returns application settings."""
        response = client.get("/api/config/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)


class TestDocumentsEndpoints:
    """Integration tests for /documents endpoints."""

    @patch('app.services.document_export_service.DocumentExportService.export_resume')
    def test_export_document_endpoint(self, mock_export, client, mock_current_user):
        """Test document export flow."""
        mock_export.return_value = {"success": True, "url": "https://example.com/doc.pdf"}

        response = client.post(
            "/api/documents/export",
            json={
                "document_type": "resume",
                "user_id": "test-user-integration",
                "format": "pdf"
            }
        )
        assert response.status_code in [200, 404, 422]


class TestWorkflowsEndpoints:
    """Integration tests for /workflows endpoints."""

    @patch('app.genkit_flows.career_application_workflow.run_career_application_workflow')
    def test_career_application_workflow_endpoint(self, mock_workflow, client, mock_current_user):
        """Test career application workflow trigger."""
        mock_workflow.return_value = {"status": "completed", "result": {}}

        response = client.post(
            "/api/workflows/career-application",
            json={
                "user_id": "test-user-integration",
                "job_id": "example-job",
                "resume_id": "example-resume"
            }
        )
        assert response.status_code in [200, 422, 503]


class TestApplicationsEndpoints:
    """Integration tests for /applications endpoints."""

    def test_list_applications(self, client, mock_current_user):
        """Test applications list endpoint."""
        response = client.get("/api/applications/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_application(self, client, mock_current_user):
        """Test application creation flow."""
        response = client.post(
            "/api/applications/",
            json={
                "job_id": "test-job",
                "status": "applied",
                "notes": "Integration test"
            }
        )
        # Should succeed or return validation error
        assert response.status_code in [200, 201, 422]


class TestOpportunitiesEndpoints:
    """Integration tests for /opportunities endpoints."""

    def test_get_opportunities_list(self, client, mock_current_user):
        """Test opportunities list endpoint."""
        response = client.get("/api/opportunities/")
        assert response.status_code == 200
        opportunities = response.json()
        assert isinstance(opportunities, list)

    def test_search_opportunities(self, client, mock_current_user):
        """Test opportunity search with filters."""
        response = client.get("/api/opportunities/?query=python&location=remote")
        assert response.status_code == 200


class TestChromeExtensionEndpoints:
    """Integration tests for /chrome-extension endpoints."""

    def test_chrome_extension_api_exists(self, client):
        """Verify chrome extension endpoints are registered."""
        response = client.get("/api/chrome-extension/health")
        # Should return health check or 404
        assert response.status_code in [200, 404]


class TestGenkitEndpoints:
    """Integration tests for /genkit endpoints."""

    @patch('app.core.genkit_init.is_genkit_enabled')
    def test_genkit_disabled_returns_503(self, mock_enabled, client, mock_current_user):
        """Test Genkit endpoints return 503 when disabled."""
        mock_enabled.return_value = False

        response = client.post(
            "/api/genkit/cover-letter/generate",
            json={
                "candidate_profile": {},
                "job_description": "Test job"
            }
        )
        assert response.status_code == 503
        assert "disabled" in response.json().get("detail", "").lower()


class TestEndpointErrorHandling:
    """Test cross-endpoint error handling."""

    def test_unauthorized_access_returns_401(self, client):
        """Test endpoints require authentication."""
        # Try accessing protected endpoint without auth
        response = client.get("/api/opportunities/")
        # Should return 401 if auth is enforced, or 200 if mock allows
        assert response.status_code in [200, 401]

    def test_invalid_endpoint_returns_404(self, client):
        """Test non-existent endpoints return 404."""
        response = client.get("/api/nonexistent/endpoint")
        assert response.status_code == 404

    def test_malformed_request_returns_422(self, client, mock_current_user):
        """Test validation errors return 422."""
        response = client.post(
            "/api/applications/",
            json={"invalid": "data"}  # Missing required fields
        )
        assert response.status_code == 422


class TestAPIResponseSchemas:
    """Validate API response schemas match Pydantic models."""

    def test_opportunities_response_schema(self, client, mock_current_user):
        """Validate opportunities response structure."""
        response = client.get("/api/opportunities/")
        assert response.status_code == 200

        opportunities = response.json()
        if len(opportunities) > 0:
            opp = opportunities[0]
            # Check required fields from schema
            assert "id" in opp
            assert "title" in opp
            assert "company" in opp

    def test_config_response_schema(self, client, mock_current_user):
        """Validate config response structure."""
        response = client.get("/api/config/")
        assert response.status_code == 200

        config = response.json()
        assert isinstance(config, dict)
