"""Tests for asset-review API endpoints."""

from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest


class TestAssetReviewEndpoints:
    def test_submit_review_happy_path(self, client):
        """Should store a review submission."""
        review_data = {
            "asset_id": "KR-SOLID-001",
            "overall_decision": "approved",
            "cultural_feedback": "Looks good",
            "reviewed_by": "reviewer1",
            "confidence": 0.9,
            "overrides": [],
        }
        response = client.post("/api/asset-review/submit", json=review_data)
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_get_pending_reviews(self, client):
        """Should return mock list of pending reviews."""
        response = client.get("/api/asset-review/pending")
        assert response.status_code == 200
        assert len(response.json()) > 0
        assert response.json()[0]["asset_id"].startswith("KR-SOLID")

    def test_get_stats(self, client):
        """Should return dashboard stats."""
        response = client.get("/api/asset-review/dashboard/stats")
        assert response.status_code == 200
        assert "total_assets_pending" in response.json()
