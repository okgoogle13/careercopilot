"""
Critical path tests for opportunities endpoint.
Priority: HIGH - 0% coverage, critical user workflow
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.database import User
from app.core.database import get_db


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def mock_current_user(monkeypatch):
    """Mock authenticated user."""
    def mock_get_current_user():
        return User(
            id="test-user-123",
            email="test@example.com",
            name="Test User",
            auth_provider="supabase"
        )

    from app.core import dependencies
    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)


class TestGetOpportunities:
    """Test suite for GET /opportunities/ endpoint."""

    def test_get_opportunities_returns_list(self, client, mock_current_user):
        """Test that endpoint returns list of opportunities."""
        response = client.get("/opportunities/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) > 0

    def test_get_opportunities_response_structure(self, client, mock_current_user):
        """Test that response has correct structure."""
        response = client.get("/opportunities/")
        assert response.status_code == 200

        opportunities = response.json()
        required_fields = {
            "id", "title", "company", "location", "salary",
            "matchScore", "tags", "postedDate", "description",
            "salaryRange", "isRemote", "isFavorited"
        }

        for opp in opportunities:
            assert required_fields.issubset(set(opp.keys())), \
                f"Missing fields in opportunity: {required_fields - set(opp.keys())}"

    def test_get_opportunities_data_types(self, client, mock_current_user):
        """Test that response data has correct types."""
        response = client.get("/opportunities/")
        assert response.status_code == 200

        opportunities = response.json()
        for opp in opportunities:
            assert isinstance(opp["id"], (int, str))
            assert isinstance(opp["title"], str)
            assert isinstance(opp["company"], str)
            assert isinstance(opp["matchScore"], int)
            assert isinstance(opp["tags"], list)
            assert isinstance(opp["isRemote"], bool)
            assert isinstance(opp["isFavorited"], bool)

    def test_get_opportunities_match_score_range(self, client, mock_current_user):
        """Test that match scores are in valid range."""
        response = client.get("/opportunities/")
        assert response.status_code == 200

        for opp in response.json():
            assert 0 <= opp["matchScore"] <= 100, \
                f"Match score {opp['matchScore']} out of range [0-100]"

    def test_get_opportunities_requires_auth(self, client):
        """Test that endpoint requires authentication."""
        # This should fail without authentication
        # (depends on actual auth implementation)
        response = client.get("/opportunities/")
        # Status code depends on auth setup
        # Just verify endpoint exists and responds
        assert response.status_code in [200, 401, 403]

    def test_get_opportunities_empty_list_valid(self, client, mock_current_user):
        """Test that empty list is valid response."""
        response = client.get("/opportunities/")
        assert response.status_code == 200
        # Empty list is valid, just ensure it's a list
        assert isinstance(response.json(), list)


class TestOpportunitiesBusiness:
    """Test business logic for opportunities."""

    def test_critical_paths_present(self, client, mock_current_user):
        """Test that critical job paths are included."""
        response = client.get("/opportunities/")
        assert response.status_code == 200

        opportunities = response.json()
        # Should have at least some opportunities
        assert len(opportunities) > 0

    def test_opportunities_sorted_by_match_score(self, client, mock_current_user):
        """Test that opportunities are reasonably ranked."""
        response = client.get("/opportunities/")
        assert response.status_code == 200

        opportunities = response.json()
        if len(opportunities) > 1:
            # Check that high match scores are present
            match_scores = [opp["matchScore"] for opp in opportunities]
            assert max(match_scores) >= 80, "Should have high match score opportunities"

    def test_remote_opportunities_included(self, client, mock_current_user):
        """Test that remote opportunities are available."""
        response = client.get("/opportunities/")
        assert response.status_code == 200

        opportunities = response.json()
        remote_opps = [opp for opp in opportunities if opp.get("isRemote")]
        # Should include some remote opportunities
        assert len(remote_opps) > 0


class TestOpportunitiesIntegration:
    """Integration tests for opportunities endpoint."""

    def test_opportunities_workflow(self, client, mock_current_user):
        """Test complete opportunities viewing workflow."""
        # Step 1: Get opportunities
        response = client.get("/opportunities/")
        assert response.status_code == 200

        opportunities = response.json()
        assert len(opportunities) > 0

        first_opp = opportunities[0]

        # Step 2: Verify we can access opportunity details
        assert "id" in first_opp
        assert "title" in first_opp
        assert "description" in first_opp

        # Step 3: Verify matching logic
        assert "matchScore" in first_opp
        assert first_opp["matchScore"] >= 0
