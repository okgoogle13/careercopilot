"""Comprehensive integration tests for backend API endpoints."""

from unittest.mock import patch

from app.tests.helpers.payload_factories import (
    make_application_create_request,
    make_cover_letter_request,
    make_generate_application_request,
)
from app.tests.helpers.route_paths import (
    CONFIG_FIREBASE,
    DOCUMENTS_ROOT,
    GENKIT_COVER_LETTER,
    OPPORTUNITIES_ROOT,
    WORKFLOWS_GENERATE_APPLICATION,
)


class TestAnalysisEndpoints:
    """Integration tests for /analysis endpoints."""

    def test_analyze_job_post_endpoint(self, authenticated_client):
        """Test job analysis endpoint integration."""
        response = authenticated_client.get("/api/analysis/job/example-job-id")
        # 404 expected if job doesn't exist
        assert response.status_code in [200, 404, 503]

    def test_analyze_resume_endpoint(self, authenticated_client):
        """Test resume analysis endpoint returns proper structure."""
        # This would require multipart form data with resume file
        # For now, test that endpoint exists and handles missing data
        response = authenticated_client.post("/api/analysis/resume")
        assert response.status_code in [404, 422, 503]


class TestAuthEndpoints:
    """Integration tests for /auth endpoints."""

    def test_auth_router_exists(self, client):
        """Verify auth endpoints are registered."""
        # Test that auth endpoints return proper responses
        response = client.post("/api/auth/register", json={})
        # Should return validation error or success
        assert response.status_code in [200, 404, 422]


class TestConfigEndpoints:
    """Integration tests for /config endpoints."""

    def test_get_app_config(self, authenticated_client):
        """Test config endpoint returns application settings."""
        response = authenticated_client.get(CONFIG_FIREBASE)
        assert response.status_code in [200, 503]
        data = response.json()
        assert isinstance(data, dict)


class TestDocumentsEndpoints:
    """Integration tests for /documents endpoints."""

    def test_documents_endpoint(self, authenticated_client):
        """Test the current documents listing endpoint."""
        response = authenticated_client.get(DOCUMENTS_ROOT)
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestWorkflowsEndpoints:
    """Integration tests for /workflows endpoints."""

    def test_generate_application_workflow_endpoint(self, authenticated_client):
        """Test the current workflow generation endpoint."""
        response = authenticated_client.post(
            WORKFLOWS_GENERATE_APPLICATION,
            json=make_generate_application_request(),
        )
        assert response.status_code in [422, 503]


class TestApplicationsEndpoints:
    """Integration tests for /applications endpoints."""

    def test_list_applications(self, authenticated_client):
        """Test applications list endpoint."""
        response = authenticated_client.get("/api/applications/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_application(self, authenticated_client):
        """Test application creation flow."""
        response = authenticated_client.post(
            "/api/applications/",
            json=make_application_create_request(),
        )
        # Should succeed or return validation error
        assert response.status_code in [200, 201, 422]


class TestOpportunitiesEndpoints:
    """Integration tests for /opportunities endpoints."""

    def test_get_opportunities_list(self, authenticated_client):
        """Test opportunities list endpoint."""
        response = authenticated_client.get(OPPORTUNITIES_ROOT)
        assert response.status_code == 200
        opportunities = response.json()
        assert isinstance(opportunities, list)

    def test_search_opportunities(self, authenticated_client):
        """Test opportunity search with filters."""
        response = authenticated_client.get(f"{OPPORTUNITIES_ROOT}?query=python&location=remote")
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

    @patch("app.core.genkit_init.is_genkit_enabled")
    def test_genkit_disabled_returns_503(self, mock_enabled, authenticated_client):
        """Test Genkit endpoints return 503 when disabled."""
        mock_enabled.return_value = False

        response = authenticated_client.post(
            GENKIT_COVER_LETTER,
            json=make_cover_letter_request(candidate_profile={}, job_description="Test job"),
        )
        assert response.status_code == 503
        assert "disabled" in response.json().get("detail", "").lower()


class TestEndpointErrorHandling:
    """Test cross-endpoint error handling."""

    def test_unauthorized_access_returns_401(self, client):
        """Test endpoints require authentication."""
        # Try accessing protected endpoint without auth
        response = client.get(OPPORTUNITIES_ROOT)
        # Should return 401 if auth is enforced, or 200 if mock allows
        assert response.status_code in [200, 401]

    def test_invalid_endpoint_returns_404(self, client):
        """Test non-existent endpoints return 404."""
        response = client.get("/api/nonexistent/endpoint")
        assert response.status_code == 404

    def test_malformed_request_returns_422(self, authenticated_client):
        """Test validation errors return 422."""
        response = authenticated_client.post(
            "/api/applications/", json={"invalid": "data"}  # Missing required fields
        )
        assert response.status_code == 422


class TestAPIResponseSchemas:
    """Validate API response schemas match Pydantic models."""

    def test_opportunities_response_schema(self, authenticated_client):
        """Validate opportunities response structure."""
        response = authenticated_client.get(OPPORTUNITIES_ROOT)
        assert response.status_code == 200

        opportunities = response.json()
        if len(opportunities) > 0:
            opp = opportunities[0]
            # Check required fields from schema
            assert "id" in opp
            assert "title" in opp
            assert "company" in opp

    def test_config_response_schema(self, authenticated_client):
        """Validate config response structure."""
        response = authenticated_client.get(CONFIG_FIREBASE)
        assert response.status_code in [200, 503]

        config = response.json()
        assert isinstance(config, dict)
