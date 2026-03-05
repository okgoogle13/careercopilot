"""
Test suite for the API router.
"""

import pytest
from fastapi import APIRouter
from fastapi.testclient import TestClient

from app.api import router
from app.api.endpoints import (
    analysis,
    applications,
    asset_review,
    auth,
    config,
    documents,
    genkit,
    job_listings,
    manifest_integration,
    opportunities,
    smart_ingestion,
    workflows,
)


@pytest.fixture
def test_client():
    """Fixture for creating a test client."""
    return TestClient(router.api_router)


def test_router_initialization():
    """Test that the API router is initialized correctly."""
    assert isinstance(router.api_router, APIRouter)


def test_endpoint_aggregation():
    """Test that all endpoints are aggregated into the main router."""
    routes = router.api_router.routes
    assert len(routes) > 0


def test_analysis_router_inclusion():
    """Test that the analysis router is included."""
    with pytest.raises(AttributeError):
        router.api_router.routes[0].endpoint  # Check if routes exist
    assert any(route.path == "/analysis" for route in router.api_router.routes)


def test_auth_router_inclusion():
    """Test that the auth router is included."""
    assert any(route.path == "/auth" for route in router.api_router.routes)


def test_config_router_inclusion():
    """Test that the config router is included."""
    assert any(route.path == "/config" for route in router.api_router.routes)


def test_documents_router_inclusion():
    """Test that the documents router is included."""
    assert any(route.path == "/documents" for route in router.api_router.routes)


def test_workflows_router_inclusion():
    """Test that the workflows router is included."""
    assert any(route.path == "/workflows" for route in router.api_router.routes)


def test_smart_ingestion_router_inclusion():
    """Test that the smart ingestion router is included."""
    assert any(route.path == "/smart-ingestion" for route in router.api_router.routes)


def test_applications_router_inclusion():
    """Test that the applications router is included."""
    assert any(route.path == "/applications" for route in router.api_router.routes)


def test_opportunities_router_inclusion():
    """Test that the opportunities router is included."""
    assert any(route.path == "/opportunities" for route in router.api_router.routes)


def test_genkit_router_inclusion():
    """Test that the genkit router is included."""
    assert any(route.path == "/genkit" for route in router.api_router.routes)


def test_job_listings_router_inclusion():
    """Test that the job listings router is included."""
    assert any(route.path == "/job-listings" for route in router.api_router.routes)


def test_manifest_integration_router_inclusion():
    """Test that the manifest integration router is included."""
    assert any(route.path == "/manifest-integration" for route in router.api_router.routes)


def test_asset_review_router_inclusion():
    """Test that the asset review router is included."""
    assert any(route.path == "/asset-review" for route in router.api_router.routes)


# Example of mocking a dependency (not fully implemented, just a demonstration)
@pytest.fixture
def mock_get_current_user():
    """Mock the get_current_user dependency."""

    def _mock_get_current_user():
        return {"id": "123", "email": "test@example.com"}

    return _mock_get_current_user


# Example test using the mocked dependency
# def test_endpoint_with_dependency(test_client, mock_get_current_user):
#     """Test an endpoint that uses the get_current_user dependency."""
#     # Replace 'auth.some_endpoint' with an actual endpoint that uses the dependency
#     response = test_client.get("/auth/some_endpoint")
#     assert response.status_code == 200
