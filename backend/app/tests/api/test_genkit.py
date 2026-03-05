"""Tests for /genkit API endpoints."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.fixture
def enabled_genkit():
    """Mock Genkit as enabled for these tests."""
    with patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=True):
        yield


class TestGenkitEndpoints:
    def test_optimize_resume_happy_path(self, client, enabled_genkit):
        """Should call optimize_resume flow and return result."""
        mock_result = MagicMock()
        mock_result.resume_text = "AI OPTIMIZED"

        with patch("app.api.endpoints.genkit.optimize_resume", new_callable=AsyncMock) as mock_flow:
            mock_flow.return_value = mock_result
            response = client.post(
                "/api/genkit/resume/optimize",
                json={
                    "resume_text": "Normal resume",
                    "missing_keywords": ["FastAPI", "Genkit"],
                    "job_description": "We need FastAPI expert",
                },
            )

        assert response.status_code == 200
        assert response.json()["optimized_text"] == "AI OPTIMIZED"
        mock_flow.assert_called_once()

    def test_get_company_context_happy_path(self, client, enabled_genkit):
        """Should call generate_company_context flow."""
        mock_ctx = MagicMock()
        mock_ctx.company_overview = "Great company"

        with patch(
            "app.api.endpoints.genkit.generate_company_context", new_callable=AsyncMock
        ) as mock_flow:
            mock_flow.return_value = mock_ctx
            response = client.post(
                "/api/genkit/company/context",
                json={"company_name": "Acme", "job_description": "Job text"},
            )

        assert response.status_code == 200
        assert response.json()["company_overview"] == "Great company"

    def test_genkit_disabled_returns_503(self, client):
        """If Genkit is disabled, should return 503 via run_genkit_endpoint."""
        with patch("app.api.endpoints.genkit.is_genkit_enabled", return_value=False):
            response = client.post(
                "/api/genkit/resume/optimize",
                json={"resume_text": "x", "missing_keywords": [], "job_description": "y"},
            )
        assert response.status_code == 503
        assert "disabled" in response.json()["detail"].lower()

    def test_generate_cover_letter_sync_call(self, client, enabled_genkit):
        """Cover letter flow is sync, test happy path."""
        mock_cl = MagicMock()
        mock_cl.letter_content = "Dear Hiring Manager..."

        with patch(
            "app.api.endpoints.genkit.generate_smart_cover_letter", return_value=mock_cl
        ) as mock_flow:
            response = client.post(
                "/api/genkit/cover-letter/generate",
                json={
                    "candidate_profile": {"name": "Test"},
                    "job_description": "Job",
                    "style": "bold",
                },
            )
        assert response.status_code == 200
        assert "Dear" in response.json()["letter_content"]
