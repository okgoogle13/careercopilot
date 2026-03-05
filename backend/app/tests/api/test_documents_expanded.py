import io
import json
import os
from unittest.mock import MagicMock, patch

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.main import app
from app.models.database import User
from app.models.user_asset import UserAsset
from app.services.doc_intelligence import DocumentIntelligenceService


# Mocking
class MockUserAsset:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    def to_dict(self):
        return {
            "id": getattr(self, "id", "asset_123"),
            "document_type": getattr(self, "document_type", "resume"),
            "file_name": getattr(self, "file_name", "test.docx"),
        }


async def mock_get_current_user():
    return User(id="test_user", email="test@example.com")


@pytest.fixture
def client():
    app.dependency_overrides[get_current_user] = mock_get_current_user
    with TestClient(app) as c:
        yield c
    app.dependency_overrides = {}


def test_get_documents_success(client):
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.all.return_value = [
        MockUserAsset(id="1", document_type="resume", file_name="resume.docx"),
        MockUserAsset(id="2", document_type="ksc", file_name="ksc.docx"),
    ]
    app.dependency_overrides[get_db] = lambda: mock_db

    response = client.get("/api/documents/")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["document_type"] == "resume"


def test_get_documents_exception(client):
    mock_db = MagicMock()
    mock_db.query.side_effect = Exception("DB Error")
    app.dependency_overrides[get_db] = lambda: mock_db

    response = client.get("/api/documents/")
    assert response.status_code == 200
    assert response.json() == []


@patch("app.api.endpoints.documents.DocumentIntelligenceService")
def test_redline_document_success(mock_service_class, client):
    mock_service = mock_service_class.return_value
    mock_service.apply_redlines_to_docx.return_value = True

    # Create a dummy docx content
    file_content = b"fake docx content"
    file = (
        "test.docx",
        io.BytesIO(file_content),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

    edits = json.dumps([{"original": "old", "replacement": "new"}])

    # We need to mock FileResponse or ensure the file exists.
    # The endpoint returns a FileResponse with output_path.
    # Since we are mocking the service, we should probably mock the FileResponse too or create a dummy output file.

    with patch("app.api.endpoints.documents.FileResponse") as mock_file_response:
        mock_file_response.return_value = MagicMock()
        response = client.post(
            "/api/documents/process/redline", files={"file": file}, data={"edits": edits}
        )
        assert response.status_code == 200


def test_redline_document_invalid_json(client):
    file_content = b"fake docx content"
    file = (
        "test.docx",
        io.BytesIO(file_content),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

    response = client.post(
        "/api/documents/process/redline", files={"file": file}, data={"edits": "invalid json"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid JSON for edits"


@patch("app.api.endpoints.documents.DocumentIntelligenceService")
def test_redline_document_service_failure(mock_service_class, client):
    mock_service = mock_service_class.return_value
    mock_service.apply_redlines_to_docx.return_value = False

    file_content = b"fake docx content"
    file = (
        "test.docx",
        io.BytesIO(file_content),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    edits = json.dumps([{"original": "old", "replacement": "new"}])

    response = client.post(
        "/api/documents/process/redline", files={"file": file}, data={"edits": edits}
    )
    assert response.status_code == 500
    assert response.json()["detail"] == "Redlining failed"


@patch("app.api.endpoints.documents.DocumentIntelligenceService")
def test_redline_document_exception(mock_service_class, client):
    mock_service = mock_service_class.return_value
    mock_service.apply_redlines_to_docx.side_effect = Exception("Unexpected error")

    file_content = b"fake docx content"
    file = (
        "test.docx",
        io.BytesIO(file_content),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    edits = json.dumps([{"original": "old", "replacement": "new"}])

    response = client.post(
        "/api/documents/process/redline", files={"file": file}, data={"edits": edits}
    )
    assert response.status_code == 500
    assert response.json()["detail"] == "Document redlining failed: Unexpected error"
