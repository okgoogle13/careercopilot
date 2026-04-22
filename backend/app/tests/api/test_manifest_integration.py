"""Tests for manifest-integration API endpoints."""

import json
from unittest.mock import patch

import pytest


@pytest.fixture
def mock_manifest_file(tmp_path):
    """Create a temporary manifest file for testing."""
    manifest_path = tmp_path / "manifest.json"
    data = {
        "project": "test",
        "version": "1.0.0",
        "assets": [],
        "asset_summary": {"total_assets": 0, "by_category": {}, "by_priority": {}},
    }
    manifest_path.write_text(json.dumps(data))
    with patch("app.api.endpoints.manifest_integration.MANIFEST_PATH", manifest_path):
        yield manifest_path


class TestManifestIntegrationEndpoints:
    def test_get_validate_happy_path(self, client, mock_manifest_file):
        """Should validate the manifest and return success."""
        response = client.get("/api/manifest-integration/validate")
        assert response.status_code == 200
        assert response.json()["valid"] is True

    def test_add_assets_happy_path(self, client, mock_manifest_file):
        """Should add assets and bump version."""
        asset_data = {
            "assets_to_add": [
                {
                    "id": "KR-TEST-001",
                    "name": "Test Asset",
                    "category": "symbol",
                    "file_path": "/assets/test.png",
                    "priority": "HIGH",
                    "status": "ready",
                    "intended_context": "Testing manifest integration",
                    "specs": {"aspect_ratio": "1:1", "style": "symbol"},
                }
            ],
            "updated_by": "tester",
            "version_bump": "patch",
        }
        response = client.post("/api/manifest-integration/add-assets", json=asset_data)
        assert response.status_code == 200
        assert response.json()["assets_added"] == 1
        assert response.json()["new_version"] == "1.0.1"

    def test_recalculate_summary(self, client, mock_manifest_file):
        """Should update summary statistics."""
        response = client.post("/api/manifest-integration/recalculate-summary")
        assert response.status_code == 200
        assert "summary" in response.json()
