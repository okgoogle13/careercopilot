"""Tests for /opportunities API endpoints."""

import pytest


class TestOpportunitiesEndpoints:
    def test_get_opportunities_happy_path(self, client):
        """Should return a list of hardcoded job opportunities."""
        # Note: opportunities endpoint does not currently check user ID,
        # it just returns a fixed list.
        response = client.get("/api/opportunities/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2
        assert data[0]["title"] == "Senior Community Support Worker"
        assert data[1]["isRemote"] is True
