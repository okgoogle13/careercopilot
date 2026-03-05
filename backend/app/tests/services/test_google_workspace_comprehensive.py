"""
Tests for Google Workspace integration.
"""

import os
from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.services.google_workspace import SCOPES, SERVICE_ACCOUNT_FILE, GoogleWorkspaceService


@pytest.fixture
def google_workspace_service():
    """Fixture for GoogleWorkspaceService."""
    service = GoogleWorkspaceService()
    return service


@pytest.fixture
def mock_credentials():
    """Mock Google credentials."""
    mock_creds = MagicMock()
    return mock_creds


@pytest.fixture
def mock_build():
    """Mock the googleapiclient.discovery.build function."""
    with patch("backend.app.services.google_workspace.build") as mock:
        yield mock


def test_google_workspace_service_init_with_credentials(mock_credentials, mock_build):
    """Test GoogleWorkspaceService initialization with valid credentials."""
    mock_build.return_value = MagicMock()
    service = GoogleWorkspaceService()
    assert service.creds == mock_credentials


def test_google_workspace_service_init_without_credentials(monkeypatch):
    """Test GoogleWorkspaceService initialization without credentials file."""
    monkeypatch.setattr(os.path, "exists", lambda x: False)
    service = GoogleWorkspaceService()
    assert service.creds is None


def test_create_task_success(google_workspace_service, mock_credentials, mock_build):
    """Test successful task creation."""
    mock_build.return_value = MagicMock()
    mock_credentials.scopes = SCOPES
    google_workspace_service.creds = mock_credentials

    mock_service = mock_build.return_value
    mock_service.tasks().insert.return_value.execute.return_value = {"title": "Test Task"}

    result = google_workspace_service.create_task("Test Task", "Test Notes")
    assert result == {"title": "Test Task"}


def test_create_task_no_credentials(google_workspace_service):
    """Test task creation without credentials."""
    result = google_workspace_service.create_task("Test Task", "Test Notes")
    assert result is None


def test_create_task_exception(google_workspace_service, mock_credentials, mock_build):
    """Test task creation with an exception."""
    mock_build.return_value = MagicMock()
    mock_credentials.scopes = SCOPES
    google_workspace_service.creds = mock_credentials
    mock_service = mock_build.return_value
    mock_service.tasks().insert.return_value.execute.side_effect = Exception("API Error")

    result = google_workspace_service.create_task("Test Task", "Test Notes")
    assert result is None


def test_schedule_deep_work_success(google_workspace_service, mock_credentials, mock_build):
    """Test successful calendar event creation."""
    mock_build.return_value = MagicMock()
    mock_credentials.scopes = SCOPES
    google_workspace_service.creds = mock_credentials
    mock_service = mock_build.return_value
    mock_service.events().insert.return_value.execute.return_value = {"htmlLink": "test_link"}

    result = google_workspace_service.schedule_deep_work("Focus Session")
    assert result == {"htmlLink": "test_link"}


def test_schedule_deep_work_no_credentials(google_workspace_service):
    """Test calendar event creation without credentials."""
    result = google_workspace_service.schedule_deep_work("Focus Session")
    assert result is None


def test_schedule_deep_work_exception(google_workspace_service, mock_credentials, mock_build):
    """Test calendar event creation with an exception."""
    mock_build.return_value = MagicMock()
    mock_credentials.scopes = SCOPES
    google_workspace_service.creds = mock_credentials
    mock_service = mock_build.return_value
    mock_service.events().insert.return_value.execute.side_effect = Exception("API Error")

    result = google_workspace_service.schedule_deep_work("Focus Session")
    assert result is None


def test_create_doc_success(google_workspace_service, mock_credentials, mock_build):
    """Test successful Google Doc creation."""
    mock_build.return_value = MagicMock()
    mock_credentials.scopes = SCOPES
    google_workspace_service.creds = mock_credentials
    mock_service = mock_build.return_value
    mock_service.documents().create.return_value.get.return_value = {"documentId": "test_doc_id"}
    mock_service.documents().batchUpdate.return_value.execute.return_value = {}

    result = google_workspace_service.create_doc("Test Doc", "Test Content")
    assert result["documentId"] == "test_doc_id"
    assert result["status"] == "success"


def test_create_doc_no_credentials(google_workspace_service):
    """Test Google Doc creation without credentials."""
    result = google_workspace_service.create_doc("Test Doc", "Test Content")
    assert result["status"] == "credentials_missing"


def test_create_doc_exception(google_workspace_service, mock_credentials, mock_build):
    """Test Google Doc creation with an exception."""
    mock_build.return_value = MagicMock()
    mock_credentials.scopes = SCOPES
    google_workspace_service.creds = mock_credentials
    mock_service = mock_build.return_value
    mock_service.documents().create.return_value.get.side_effect = Exception("API Error")

    result = google_workspace_service.create_doc("Test Doc", "Test Content")
    assert result["status"] == "error"
