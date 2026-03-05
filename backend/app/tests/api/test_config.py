"""Tests for /config API endpoints."""

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def test_client():
    from app.main import app

    return TestClient(app, raise_server_exceptions=False)


@pytest.fixture
def valid_firebase_config():
    return {
        "api_key": "test-api-key",
        "auth_domain": "test.firebaseapp.com",
        "project_id": "test-project",
        "storage_bucket": "test.appspot.com",
        "messaging_sender_id": "123456",
        "app_id": "1:123456:web:abcdef",
    }


class TestGetFirebaseConfig:
    def test_returns_firebase_config(self, test_client, valid_firebase_config):
        """When secret manager returns valid config, should return 200 with camelCase keys."""
        with patch(
            "app.api.endpoints.config.get_firebase_frontend_config",
            return_value=valid_firebase_config,
        ):
            response = test_client.get("/api/config/firebase-config")
        assert response.status_code == 200
        data = response.json()
        assert "apiKey" in data
        assert "projectId" in data
        assert data["apiKey"] == "test-api-key"

    def test_missing_project_id_returns_503(self, test_client, valid_firebase_config):
        """Missing projectId should return 503."""
        valid_firebase_config["project_id"] = ""
        with patch(
            "app.api.endpoints.config.get_firebase_frontend_config",
            return_value=valid_firebase_config,
        ):
            response = test_client.get("/api/config/firebase-config")
        assert response.status_code == 503

    def test_secret_manager_error_returns_500(self, test_client):
        """Exception from secret manager should return 500."""
        with patch(
            "app.api.endpoints.config.get_firebase_frontend_config",
            side_effect=RuntimeError("Secret error"),
        ):
            response = test_client.get("/api/config/firebase-config")
        assert response.status_code in (500, 503)
