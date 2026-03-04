"""Focused tests for the opportunities endpoint."""

from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.core.dependencies import get_current_user
from app.main import app


def _override_user():
    return SimpleNamespace(
        id="test-user-123",
        email="test@example.com",
        name="Test User",
        auth_provider="firebase",
    )


def _client():
    app.dependency_overrides[get_current_user] = _override_user
    return TestClient(app)


class TestGetOpportunities:
    def test_get_opportunities_returns_list(self):
        response = _client().get("/api/opportunities/")

        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) > 0

    def test_get_opportunities_response_structure(self):
        response = _client().get("/api/opportunities/")

        required_fields = {
            "id",
            "title",
            "company",
            "location",
            "salary",
            "matchScore",
            "tags",
            "postedDate",
            "description",
            "salaryRange",
            "isRemote",
            "isFavorited",
        }

        assert response.status_code == 200
        for opportunity in response.json():
            assert required_fields.issubset(opportunity.keys())

    def test_get_opportunities_data_types(self):
        response = _client().get("/api/opportunities/")

        assert response.status_code == 200
        for opportunity in response.json():
            assert isinstance(opportunity["id"], (int, str))
            assert isinstance(opportunity["title"], str)
            assert isinstance(opportunity["company"], str)
            assert isinstance(opportunity["matchScore"], int)
            assert isinstance(opportunity["tags"], list)
            assert isinstance(opportunity["isRemote"], bool)
            assert isinstance(opportunity["isFavorited"], bool)

    def test_get_opportunities_match_score_range(self):
        response = _client().get("/api/opportunities/")

        assert response.status_code == 200
        for opportunity in response.json():
            assert 0 <= opportunity["matchScore"] <= 100


class TestOpportunitiesBusiness:
    def test_remote_opportunities_included(self):
        response = _client().get("/api/opportunities/")

        assert response.status_code == 200
        assert any(opportunity["isRemote"] for opportunity in response.json())

    def test_opportunities_include_high_match_scores(self):
        response = _client().get("/api/opportunities/")

        assert response.status_code == 200
        scores = [opportunity["matchScore"] for opportunity in response.json()]
        assert max(scores) >= 80
