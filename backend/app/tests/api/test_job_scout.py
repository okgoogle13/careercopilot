"""Tests for /job-scout API endpoints."""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def test_client():
    from app.main import app

    return TestClient(app, raise_server_exceptions=False)


class TestSearchJobs:
    def test_happy_path_returns_links(self, test_client):
        """Should return found job links when agent succeeds."""
        mock_links = ["https://seek.com/job/1", "https://linkedin.com/job/2"]
        with patch("app.api.endpoints.job_scout.JobScoutAgent") as MockAgent:
            MockAgent.return_value.search_jobs = AsyncMock(return_value=mock_links)
            response = test_client.post(
                "/api/v1/job-scout/search",
                json={"query": "Python developer", "location": "Melbourne"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["found_links"] == mock_links
        assert "2" in data["message"]

    def test_default_location_is_australia(self, test_client):
        """When location is omitted, should default to Australia."""
        with patch("app.api.endpoints.job_scout.JobScoutAgent") as MockAgent:
            MockAgent.return_value.search_jobs = AsyncMock(return_value=[])
            response = test_client.post(
                "/api/v1/job-scout/search",
                json={"query": "Backend engineer"},
            )
        assert response.status_code == 200
        _, kwargs = MockAgent.return_value.search_jobs.call_args
        # second positional arg is location
        args_list = MockAgent.return_value.search_jobs.call_args.args
        assert "Australia" in args_list or (
            "Australia" in str(MockAgent.return_value.search_jobs.call_args)
        )

    def test_agent_error_returns_500(self, test_client):
        """If agent throws, should return 500."""
        with patch("app.api.endpoints.job_scout.JobScoutAgent") as MockAgent:
            MockAgent.return_value.search_jobs = AsyncMock(
                side_effect=RuntimeError("Playwright failed")
            )
            response = test_client.post(
                "/api/v1/job-scout/search",
                json={"query": "Python developer"},
            )
        assert response.status_code == 500

    def test_missing_query_returns_422(self, test_client):
        """Missing required 'query' field should return 422."""
        response = test_client.post(
            "/api/v1/job-scout/search",
            json={"location": "Sydney"},
        )
        assert response.status_code == 422
