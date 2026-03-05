"""Tests for job-listings API endpoints."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest


class TestJobListingsEndpoints:
    def test_extract_from_text_happy_path(self, client):
        """Should call run_flow_async with job text."""
        mock_details = MagicMock()
        mock_details.title = "Software Engineer"

        with patch(
            "app.api.endpoints.job_listings.run_flow_async", new_callable=AsyncMock
        ) as mock_flow:
            mock_flow.return_value = mock_details
            response = client.post(
                "/api/job-listings/extract-from-text",
                json={"text": "Software Engineer job at Google"},
            )

        assert response.status_code == 200
        assert response.json()["title"] == "Software Engineer"
        mock_flow.assert_called_once()

    def test_extract_from_url_happy_path(self, client):
        """Should call run_flow_async with URL dict."""
        mock_details = MagicMock()
        mock_details.company = "Acme"

        with patch(
            "app.api.endpoints.job_listings.run_flow_async", new_callable=AsyncMock
        ) as mock_flow:
            mock_flow.return_value = mock_details
            response = client.post(
                "/api/job-listings/extract-from-url", json={"url": "https://jobs.acme.com/123"}
            )

        assert response.status_code == 200
        assert response.json()["company"] == "Acme"
        # Check it was passed as dict
        args, kwargs = mock_flow.call_args
        assert args[1] == {"url": "https://jobs.acme.com/123"}

    def test_advanced_analysis_happy_path(self, client):
        """Should call advanced_job_analysis_flow."""
        with patch(
            "app.api.endpoints.job_listings.run_flow_async", new_callable=AsyncMock
        ) as mock_flow:
            mock_flow.return_value = "Thinking mode analysis result"
            response = client.post(
                "/api/job-listings/advanced-analysis",
                json={"job_details": {"title": "Dev"}, "user_prompt": "Is this a good fit?"},
            )
        assert response.status_code == 200
        assert "Thinking" in response.json()
