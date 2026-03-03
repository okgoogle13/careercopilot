"""
Integration tests for Chrome Extension API endpoints.
Tests extension job analysis, auth handling, and error cases.

Endpoint: POST /api/chrome-extension/analyze
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch, AsyncMock
from types import SimpleNamespace

from app.main import app


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def client():
    """Sync FastAPI test client."""
    return TestClient(app, raise_server_exceptions=False)


@pytest.fixture
def valid_job_payload():
    """A minimal valid JobPostingData payload."""
    return {
        "title": "Senior Python Engineer",
        "company": "Acme Corp",
        "description": "We are looking for a senior Python engineer with 5+ years of experience.",
        "url": "https://linkedin.com/jobs/view/12345",
        "location": "Remote",
    }


@pytest.fixture
def mock_flow_output():
    """Mock output from analyzeJobPostingFlow."""
    return SimpleNamespace(
        overall_fit_score=87,
        matching_qualifications=["Python", "FastAPI", "PostgreSQL"],
        gaps_and_development_areas=["Kubernetes"],
        key_selling_points=["5 years experience", "OSS contributor"],
        application_strategy="Apply with a tailored cover letter.",
        deadline=None,
        is_remote=True,
        match_score=0.87,
    )


# ---------------------------------------------------------------------------
# Auth / unauthenticated access
# ---------------------------------------------------------------------------

class TestChromeExtensionAuth:
    """Tests for authentication enforcement on the analyze endpoint."""

    def test_analyze_requires_auth(self, client, valid_job_payload):
        """Unauthenticated request should be rejected (401 or 403)."""
        response = client.post("/api/chrome-extension/analyze", json=valid_job_payload)
        assert response.status_code in (401, 403), (
            f"Expected 401 or 403 for unauthenticated request, got {response.status_code}"
        )

    def test_analyze_with_valid_auth_succeeds(self, client, valid_job_payload, mock_flow_output):
        """Authenticated request with valid payload should return 200 and job analysis."""
        mock_user = MagicMock(id="user-123", email="test@example.com")

        with (
            patch("app.core.dependencies.get_current_user", return_value=mock_user),
            patch(
                "app.api.endpoints.chrome_extension.analyzeJobPostingFlow",
                new_callable=AsyncMock,
                return_value=mock_flow_output,
            ),
            patch("app.core.database.get_db") as mock_get_db,
        ):
            mock_db = MagicMock()
            mock_get_db.return_value = iter([mock_db])

            response = client.post("/api/chrome-extension/analyze", json=valid_job_payload)

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "markdown_analysis" in data
        assert "## Job Analysis" in data["markdown_analysis"]
        assert data["job_saved"] is True


# ---------------------------------------------------------------------------
# Job analysis — happy path
# ---------------------------------------------------------------------------

class TestJobAnalysis:
    """Tests for the core job analysis flow."""

    def test_analysis_response_contains_fit_score(self, client, valid_job_payload, mock_flow_output):
        """Response markdown should include the overall fit score."""
        mock_user = MagicMock(id="user-123", email="test@example.com")

        with (
            patch("app.core.dependencies.get_current_user", return_value=mock_user),
            patch(
                "app.api.endpoints.chrome_extension.analyzeJobPostingFlow",
                new_callable=AsyncMock,
                return_value=mock_flow_output,
            ),
            patch("app.core.database.get_db") as mock_get_db,
        ):
            mock_db = MagicMock()
            mock_get_db.return_value = iter([mock_db])
            response = client.post("/api/chrome-extension/analyze", json=valid_job_payload)

        assert response.status_code == 200
        assert "87%" in response.json()["markdown_analysis"]

    def test_analysis_saves_job_to_db(self, client, valid_job_payload, mock_flow_output):
        """After successful analysis the job record should be added to the DB session."""
        mock_user = MagicMock(id="user-123", email="test@example.com")

        with (
            patch("app.core.dependencies.get_current_user", return_value=mock_user),
            patch(
                "app.api.endpoints.chrome_extension.analyzeJobPostingFlow",
                new_callable=AsyncMock,
                return_value=mock_flow_output,
            ),
            patch("app.core.database.get_db") as mock_get_db,
        ):
            mock_db = MagicMock()
            mock_get_db.return_value = iter([mock_db])
            response = client.post("/api/chrome-extension/analyze", json=valid_job_payload)

        assert response.status_code == 200
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called()

    def test_analysis_remote_flag_in_markdown(self, client, valid_job_payload, mock_flow_output):
        """Remote jobs should mention remote status in the markdown output."""
        mock_user = MagicMock(id="user-123", email="test@example.com")

        with (
            patch("app.core.dependencies.get_current_user", return_value=mock_user),
            patch(
                "app.api.endpoints.chrome_extension.analyzeJobPostingFlow",
                new_callable=AsyncMock,
                return_value=mock_flow_output,
            ),
            patch("app.core.database.get_db") as mock_get_db,
        ):
            mock_db = MagicMock()
            mock_get_db.return_value = iter([mock_db])
            response = client.post("/api/chrome-extension/analyze", json=valid_job_payload)

        assert "Remote" in response.json()["markdown_analysis"]

    def test_analysis_with_deadline_returns_deadline(self, client, valid_job_payload, mock_flow_output):
        """When a deadline is present it should appear in the markdown."""
        mock_flow_output.deadline = "2026-04-01"
        mock_user = MagicMock(id="user-123", email="test@example.com")

        with (
            patch("app.core.dependencies.get_current_user", return_value=mock_user),
            patch(
                "app.api.endpoints.chrome_extension.analyzeJobPostingFlow",
                new_callable=AsyncMock,
                return_value=mock_flow_output,
            ),
            patch("app.core.database.get_db") as mock_get_db,
        ):
            mock_db = MagicMock()
            mock_get_db.return_value = iter([mock_db])
            response = client.post("/api/chrome-extension/analyze", json=valid_job_payload)

        assert response.status_code == 200
        assert response.json()["deadline_found"] == "2026-04-01"


# ---------------------------------------------------------------------------
# Validation errors
# ---------------------------------------------------------------------------

class TestJobCaptureValidation:
    """Tests for request payload validation."""

    def test_missing_title_returns_422(self, client):
        """A payload without the required `title` field should return 422."""
        mock_user = MagicMock(id="user-123", email="test@example.com")
        with patch("app.core.dependencies.get_current_user", return_value=mock_user):
            response = client.post(
                "/api/chrome-extension/analyze",
                json={"company": "Acme", "description": "Some description.", "url": "https://example.com"},
            )
        # FastAPI will return 422 for missing required fields
        assert response.status_code == 422

    def test_empty_payload_returns_422(self, client):
        """Sending an empty JSON body should return 422."""
        mock_user = MagicMock(id="user-123", email="test@example.com")
        with patch("app.core.dependencies.get_current_user", return_value=mock_user):
            response = client.post("/api/chrome-extension/analyze", json={})
        assert response.status_code == 422


# ---------------------------------------------------------------------------
# Error handling
# ---------------------------------------------------------------------------

class TestChromeExtensionErrorHandling:
    """Tests for error handling when Genkit flow fails."""

    def test_genkit_failure_returns_graceful_response(self, client, valid_job_payload):
        """When the Genkit flow throws an exception the endpoint should return success=False."""
        mock_user = MagicMock(id="user-123", email="test@example.com")

        with (
            patch("app.core.dependencies.get_current_user", return_value=mock_user),
            patch(
                "app.api.endpoints.chrome_extension.analyzeJobPostingFlow",
                new_callable=AsyncMock,
                side_effect=RuntimeError("Genkit is down"),
            ),
            patch("app.core.database.get_db") as mock_get_db,
        ):
            mock_db = MagicMock()
            mock_get_db.return_value = iter([mock_db])
            response = client.post("/api/chrome-extension/analyze", json=valid_job_payload)

        assert response.status_code == 200  # endpoint catches and returns gracefully
        data = response.json()
        assert data["success"] is False
        assert "Error" in data["markdown_analysis"]
