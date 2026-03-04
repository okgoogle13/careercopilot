"""Focused tests for the config API endpoints."""

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.endpoints import config as module


def _client():
    app = FastAPI()
    app.include_router(module.router)
    return TestClient(app)


def test_get_firebase_config_happy_path(monkeypatch):
    """The endpoint should map snake_case config to Firebase camelCase keys."""
    monkeypatch.setattr(
        module,
        "get_firebase_frontend_config",
        lambda: {
            "api_key": "test_api_key",
            "auth_domain": "test_auth_domain",
            "project_id": "test_project_id",
            "storage_bucket": "test_storage_bucket",
            "messaging_sender_id": "test_messaging_sender_id",
            "app_id": "test_app_id",
        },
    )

    response = _client().get("/firebase-config")

    assert response.status_code == 200
    assert response.json() == {
        "apiKey": "test_api_key",
        "authDomain": "test_auth_domain",
        "projectId": "test_project_id",
        "storageBucket": "test_storage_bucket",
        "messagingSenderId": "test_messaging_sender_id",
        "appId": "test_app_id",
    }


def test_get_firebase_config_missing_project_id_returns_503(monkeypatch):
    """Missing project id should be treated as an unavailable config."""
    monkeypatch.setattr(
        module,
        "get_firebase_frontend_config",
        lambda: {
            "api_key": "test_api_key",
            "auth_domain": "test_auth_domain",
            "project_id": "",
            "storage_bucket": "test_storage_bucket",
            "messaging_sender_id": "test_messaging_sender_id",
            "app_id": "test_app_id",
        },
    )

    response = _client().get("/firebase-config")

    assert response.status_code == 503
    assert response.json() == {"detail": "Firebase configuration not available"}


def test_get_firebase_config_logs_warning_for_missing_project_id(monkeypatch):
    """Missing project id should log the expected warning."""
    warnings = []
    monkeypatch.setattr(
        module,
        "logger",
        type("Logger", (), {"warning": lambda self, msg: warnings.append(msg)})(),
    )
    monkeypatch.setattr(
        module,
        "get_firebase_frontend_config",
        lambda: {
            "api_key": "test_api_key",
            "auth_domain": "test_auth_domain",
            "project_id": "",
            "storage_bucket": "test_storage_bucket",
            "messaging_sender_id": "test_messaging_sender_id",
            "app_id": "test_app_id",
        },
    )

    response = _client().get("/firebase-config")

    assert response.status_code == 503
    assert warnings == ["Firebase configuration incomplete: missing projectId"]


def test_get_firebase_config_exception_returns_500(monkeypatch):
    """Unexpected failures should return the generic 500 response."""
    monkeypatch.setattr(
        module,
        "get_firebase_frontend_config",
        lambda: (_ for _ in ()).throw(RuntimeError("boom")),
    )

    response = _client().get("/firebase-config")

    assert response.status_code == 500
    assert response.json() == {"detail": "Failed to retrieve Firebase configuration"}
