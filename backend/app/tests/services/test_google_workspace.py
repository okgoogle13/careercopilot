"""Unit tests for the Google Workspace service wrapper."""

import asyncio
import builtins
import sys
from types import ModuleType, SimpleNamespace
from unittest.mock import MagicMock

import pytest

google_module = sys.modules.setdefault("google", ModuleType("google"))
google_module.__path__ = getattr(google_module, "__path__", [])
google_oauth2_module = sys.modules.setdefault("google.oauth2", ModuleType("google.oauth2"))
google_oauth2_module.__path__ = getattr(google_oauth2_module, "__path__", [])
service_account_module = sys.modules.setdefault(
    "google.oauth2.service_account", ModuleType("google.oauth2.service_account")
)
service_account_module.Credentials = getattr(
    service_account_module,
    "Credentials",
    SimpleNamespace(from_service_account_file=lambda *args, **kwargs: None),
)
google_oauth2_module.service_account = service_account_module
google_module.oauth2 = google_oauth2_module

googleapiclient_module = sys.modules.setdefault("googleapiclient", ModuleType("googleapiclient"))
googleapiclient_module.__path__ = getattr(googleapiclient_module, "__path__", [])
discovery_module = sys.modules.setdefault(
    "googleapiclient.discovery", ModuleType("googleapiclient.discovery")
)
discovery_module.build = getattr(discovery_module, "build", lambda *args, **kwargs: None)
googleapiclient_module.discovery = discovery_module

import app.services.google_workspace as google_workspace_module
from app.services.google_workspace import GoogleWorkspaceService


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


@pytest.fixture
def mock_print(monkeypatch):
    """Capture print statements."""
    printer = MagicMock()
    monkeypatch.setattr(builtins, "print", printer)
    return printer


def test_google_workspace_service_warns_when_credentials_file_missing(monkeypatch, mock_print):
    """Missing credentials should leave the service disabled."""
    monkeypatch.setattr(google_workspace_module.os.path, "exists", lambda _path: False)

    service = GoogleWorkspaceService()

    assert service.creds is None
    mock_print.assert_called_once()
    assert "credentials.json" in mock_print.call_args.args[0]


def test_google_workspace_service_loads_service_account_credentials(monkeypatch, mock_print):
    """Existing credentials.json should be loaded through the Google client."""
    creds = object()
    loader = MagicMock(return_value=creds)
    monkeypatch.setattr(google_workspace_module.os.path, "exists", lambda _path: True)
    monkeypatch.setattr(
        google_workspace_module.service_account.Credentials,
        "from_service_account_file",
        loader,
    )

    service = GoogleWorkspaceService()

    assert service.creds is creds
    loader.assert_called_once_with(google_workspace_module.SERVICE_ACCOUNT_FILE, scopes=google_workspace_module.SCOPES)
    mock_print.assert_not_called()


def test_google_workspace_service_handles_credential_load_failure(monkeypatch, mock_print):
    """Credential loading errors should be printed and ignored."""
    monkeypatch.setattr(google_workspace_module.os.path, "exists", lambda _path: True)
    monkeypatch.setattr(
        google_workspace_module.service_account.Credentials,
        "from_service_account_file",
        MagicMock(side_effect=RuntimeError("bad credentials")),
    )

    service = GoogleWorkspaceService()

    assert service.creds is None
    assert "Error loading Google Credentials" in mock_print.call_args.args[0]


def test_create_task_returns_none_without_credentials(mock_print):
    """Task creation should be skipped when credentials are unavailable."""
    service = GoogleWorkspaceService()
    service.creds = None

    assert asyncio.run(service.create_task("Follow up", "Notes")) is None


def test_create_task_builds_google_tasks_request(monkeypatch):
    """Successful task creation should call the default tasklist insert API."""
    execute = MagicMock(return_value={"title": "Follow up"})
    insert = MagicMock(return_value=SimpleNamespace(execute=execute))
    tasks_service = MagicMock(return_value=SimpleNamespace(insert=insert))
    build = MagicMock(return_value=SimpleNamespace(tasks=tasks_service))
    monkeypatch.setattr(google_workspace_module, "build", build)
    service = GoogleWorkspaceService()
    service.creds = object()

    result = asyncio.run(service.create_task("Follow up", "Notes", "2026-03-05T00:00:00Z"))

    assert result == {"title": "Follow up"}
    build.assert_called_once_with("tasks", "v1", credentials=service.creds)
    insert.assert_called_once_with(
        tasklist="@default",
        body={
            "title": "Follow up",
            "notes": "Notes",
            "due": "2026-03-05T00:00:00Z",
        },
    )


def test_schedule_deep_work_builds_calendar_event(monkeypatch):
    """Calendar scheduling should compute a tomorrow-morning event."""
    execute = MagicMock(return_value={"htmlLink": "https://calendar.example/event"})
    insert = MagicMock(return_value=SimpleNamespace(execute=execute))
    events_service = MagicMock(return_value=SimpleNamespace(insert=insert))
    build = MagicMock(return_value=SimpleNamespace(events=events_service))
    monkeypatch.setattr(google_workspace_module, "build", build)

    class _FixedDate(google_workspace_module.datetime.date):
        @classmethod
        def today(cls):
            return cls(2026, 3, 4)

    monkeypatch.setattr(google_workspace_module.datetime, "date", _FixedDate)
    service = GoogleWorkspaceService()
    service.creds = object()

    result = asyncio.run(service.schedule_deep_work("Portfolio updates", duration_minutes=120))

    assert result == {"htmlLink": "https://calendar.example/event"}
    event = insert.call_args.kwargs["body"]
    assert "Deep Work: Portfolio updates" in event["summary"]
    assert event["start"]["dateTime"].startswith("2026-03-05T09:00:00")
    assert event["end"]["dateTime"].startswith("2026-03-05T11:00:00")


def test_create_doc_returns_placeholder_payload_without_credentials():
    """Document creation should return inline content when creds are missing."""
    service = GoogleWorkspaceService()
    service.creds = None

    result = asyncio.run(service.create_doc("Draft", "Body text"))

    assert result == {
        "status": "credentials_missing",
        "content": "Body text",
        "message": "Add credentials.json to enable Google Docs integration",
    }


def test_create_doc_creates_document_and_inserts_text(monkeypatch):
    """Google Docs creation should create the file and batch-update its body."""
    create_execute = MagicMock(return_value={"documentId": "doc-123"})
    create = MagicMock(return_value=SimpleNamespace(execute=create_execute))
    batch_execute = MagicMock(return_value={})
    batch_update = MagicMock(return_value=SimpleNamespace(execute=batch_execute))
    documents_api = SimpleNamespace(create=create, batchUpdate=batch_update)
    build = MagicMock(return_value=SimpleNamespace(documents=MagicMock(return_value=documents_api)))
    monkeypatch.setattr(google_workspace_module, "build", build)
    service = GoogleWorkspaceService()
    service.creds = object()

    result = asyncio.run(service.create_doc("Draft", "Body text"))

    assert result == {
        "documentId": "doc-123",
        "title": "Draft",
        "webViewLink": "https://docs.google.com/document/d/doc-123/edit",
        "status": "success",
    }
    create.assert_called_once_with(body={"title": "Draft"})
    batch_update.assert_called_once()


def test_create_doc_returns_error_payload_on_failure(monkeypatch):
    """Document creation failures should return an error payload."""
    build = MagicMock(side_effect=RuntimeError("docs unavailable"))
    monkeypatch.setattr(google_workspace_module, "build", build)
    service = GoogleWorkspaceService()
    service.creds = object()

    result = asyncio.run(service.create_doc("Draft", "Body text"))

    assert result["status"] == "error"
    assert result["error"] == "docs unavailable"
    assert result["content"] == "Body text"
