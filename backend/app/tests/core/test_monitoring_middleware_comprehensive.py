"""
Tests for UnifiedObservabilityMiddleware.
"""

from unittest.mock import MagicMock, patch

import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient

from app.core.observability import UnifiedObservabilityMiddleware


@pytest.fixture
def test_app():
    """Create a fresh FastAPI app for each test to avoid middleware accumulation."""
    app = FastAPI()
    app.add_middleware(UnifiedObservabilityMiddleware)

    @app.get("/test")
    async def test_route():
        return {"message": "ok"}

    @app.get("/error")
    async def error_route():
        raise Exception("intentional error")

    return app


@pytest.fixture
def mock_metrics():
    """Mock metrics dictionary in observability module."""
    mock_http_requests = MagicMock()
    mock_http_duration = MagicMock()

    metrics = {"http_requests": mock_http_requests, "http_duration": mock_http_duration}

    with (
        patch("app.core.observability._metrics", metrics),
        patch("app.core.observability.PROMETHEUS_AVAILABLE", True),
    ):
        yield metrics


def test_successful_request_metrics(test_app, mock_metrics):
    """Test that metrics are incremented for successful requests."""
    client = TestClient(test_app)
    response = client.get("/test")

    assert response.status_code == 200

    # Verify counter incremented
    mock_metrics["http_requests"].labels.assert_called_with(
        method="GET", endpoint="/test", status="200", env="test"
    )
    mock_metrics["http_requests"].labels.return_value.inc.assert_called_once()

    # Verify duration observed
    mock_metrics["http_duration"].labels.assert_called_with(
        method="GET", endpoint="/test", env="test"
    )
    mock_metrics["http_duration"].labels.return_value.observe.assert_called_once()


def test_error_request_metrics(test_app, mock_metrics):
    """Test that 500 status is recorded when an exception occurs."""
    client = TestClient(test_app)
    response = client.get("/error")

    assert response.status_code == 500

    # Verify counter incremented with 500
    mock_metrics["http_requests"].labels.assert_called_with(
        method="GET", endpoint="/error", status="500", env="test"
    )
    mock_metrics["http_requests"].labels.return_value.inc.assert_called_once()


def test_excluded_paths(test_app, mock_metrics):
    """Test that health and metrics endpoints are excluded from tracking."""
    client = TestClient(test_app)

    # Health endpoint is excluded by default
    client.get("/health")

    assert mock_metrics["http_requests"].labels.call_count == 0
