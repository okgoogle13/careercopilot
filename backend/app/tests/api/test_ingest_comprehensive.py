"""Comprehensive tests for ingest endpoint behavior."""

from types import SimpleNamespace
from unittest.mock import patch

from fastapi import HTTPException
from fastapi.testclient import TestClient


def test_upload_artifact_accepts_multipart_form_data(client):
    with patch("app.api.endpoints.ingest.IngestionService") as mock_service:
        response = client.post(
            "/api/ingest/artifacts/upload",
            data={"source_type": "resume"},
            files={"file": ("resume.txt", b"resume body", "text/plain")},
        )

    assert response.status_code == 200
    assert "Successfully ingested resume.txt as resume" == response.json()["message"]
    mock_service.return_value.process_file.assert_called_once()


def test_upload_artifact_returns_422_for_missing_file(client):
    response = client.post(
        "/api/ingest/artifacts/upload",
        data={"source_type": "resume"},
    )

    assert response.status_code == 422


def test_upload_artifact_returns_401_without_auth_override(monkeypatch):
    from app.core.dependencies import get_current_user
    from app.main import app

    app.dependency_overrides = {}
    with TestClient(app) as anon_client:
        response = anon_client.post(
            "/api/ingest/artifacts/upload",
            data={"source_type": "resume"},
            files={"file": ("resume.txt", b"resume body", "text/plain")},
        )

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_upload_artifact_returns_500_for_service_error(client):
    with patch("app.api.endpoints.ingest.IngestionService") as mock_service:
        mock_service.return_value.process_file.side_effect = RuntimeError("storage offline")
        response = client.post(
            "/api/ingest/artifacts/upload",
            data={"source_type": "resume"},
            files={"file": ("resume.txt", b"resume body", "text/plain")},
        )

    assert response.status_code == 500


def test_upload_artifact_returns_404_for_unknown_route(client):
    response = client.post(
        "/api/ingest/artifacts/missing",
        data={"source_type": "resume"},
        files={"file": ("resume.txt", b"resume body", "text/plain")},
    )

    assert response.status_code == 404


def test_upload_artifact_propagates_non_500_http_exception(client):
    with patch(
        "app.api.endpoints.ingest.run_endpoint_operation",
        side_effect=HTTPException(status_code=400, detail="bad request"),
    ):
        response = client.post(
            "/api/ingest/artifacts/upload",
            data={"source_type": "resume"},
            files={"file": ("resume.txt", b"resume body", "text/plain")},
        )

    assert response.status_code == 400
    assert response.json()["detail"] == "bad request"
