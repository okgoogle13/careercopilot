"""Tests for /analysis API endpoints."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.fixture
def auth_client(client):
    from app.core.dependencies import get_current_user

    mock_user = SimpleNamespace(
        id="test_user_id", uid="test_uid", email="test@example.com", name="Test User"
    )
    client.app.dependency_overrides[get_current_user] = lambda: mock_user
    yield client


class TestAnalysisEndpoints:
    def test_get_analysis_data(self, auth_client):
        """Should return hardcoded analysis dashboard data."""
        response = auth_client.get("/api/analysis/")
        assert response.status_code == 200
        data = response.json()
        assert "atsScoreHistory" in data
        assert "matchedKeywords" in data

    def test_optimize_resume_happy_path(self, auth_client):
        """Should call optimize_resume flow and return optimized text."""
        mock_result = MagicMock()
        mock_result.resume_text = "OPTIMIZED RESUME CONTENT"

        with patch(
            "app.api.endpoints.analysis.optimize_resume", new_callable=AsyncMock
        ) as mock_flow:
            mock_flow.return_value = mock_result
            response = auth_client.post(
                "/api/analysis/optimize-resume",
                json={
                    "resume_text": "Original Resume",
                    "job_description": "Python dev job",
                    "company_url": "https://acme.com",
                },
            )

        assert response.status_code == 200
        assert response.json()["optimized_text"] == "OPTIMIZED RESUME CONTENT"
        mock_flow.assert_called_once()

    def test_optimize_resume_missing_text_returns_400(self, auth_client):
        """Should return 400 if resume_text is empty."""
        response = auth_client.post(
            "/api/analysis/optimize-resume", json={"resume_text": "", "job_description": "Some job"}
        )
        assert response.status_code == 400
        assert "Resume text required" in response.json()["detail"]
