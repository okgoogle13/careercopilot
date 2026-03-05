"""Comprehensive tests for email_scanner."""

import base64
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.genkit_flows import email_scanner as module


def _gmail_service_with_messages(messages, payload_map):
    class _Users:
        def messages(self):
            return self

        def list(self, **_kwargs):
            return SimpleNamespace(execute=lambda: {"messages": messages})

        def get(self, userId, id, format):
            return SimpleNamespace(execute=lambda: payload_map[id])

        def modify(self, **_kwargs):
            return SimpleNamespace(execute=lambda: None)

    return SimpleNamespace(users=lambda: _Users())


def test_get_gmail_service_raises_when_credentials_missing(monkeypatch):
    monkeypatch.setattr(module, "get_user_secret", lambda *_args, **_kwargs: None)
    with pytest.raises(Exception, match="not authenticated"):
        module.get_gmail_service("user-1")


def test_extract_job_details_from_email_uses_model(monkeypatch):
    class _Model:
        def generate(self, **_kwargs):
            return SimpleNamespace(output=lambda: {"title": "Role"})

    monkeypatch.setattr(module, "format_prompt", lambda *_args, **_kwargs: "prompt")
    monkeypatch.setattr(module, "get_model", lambda: _Model())

    result = module.extract_job_details_from_email("email body")
    assert result == {"title": "Role"}


def test_extract_job_details_from_email_raises_when_model_missing(monkeypatch):
    monkeypatch.setattr(module, "format_prompt", lambda *_args, **_kwargs: "prompt")
    monkeypatch.setattr(module, "get_model", lambda: None)
    with pytest.raises(RuntimeError, match="Genkit model not available"):
        module.extract_job_details_from_email("email body")


@pytest.mark.asyncio
async def test_scan_emails_for_job_opportunities_success(monkeypatch):
    monkeypatch.setattr(module, "scanUserEmails", AsyncMock(return_value=[{"id": "1"}]))

    result = await module.scanEmailsForJobOpportunities("user-1")

    assert result["success"] is True
    assert result["opportunities_found"] == 1


@pytest.mark.asyncio
async def test_scan_emails_for_job_opportunities_failure(monkeypatch):
    monkeypatch.setattr(module, "scanUserEmails", AsyncMock(side_effect=RuntimeError("fail")))

    result = await module.scanEmailsForJobOpportunities("user-1")

    assert result["success"] is False
    assert result["opportunities"] == []


@pytest.mark.asyncio
async def test_scan_user_emails_returns_empty_when_no_messages(monkeypatch):
    db = SimpleNamespace(
        query=lambda *_a, **_k: SimpleNamespace(
            filter=lambda *_a, **_k: SimpleNamespace(
                first=lambda: SimpleNamespace(to_dict=lambda: {})
            )
        ),
        close=lambda: None,
    )
    monkeypatch.setattr(module, "SessionLocal", lambda: db)
    monkeypatch.setattr(
        module, "get_gmail_service", lambda _uid: _gmail_service_with_messages([], {})
    )

    result = await module.scanUserEmails("user-1")

    assert result == []


@pytest.mark.asyncio
async def test_scan_user_emails_happy_path_saves_and_marks_read(monkeypatch):
    encoded = base64.urlsafe_b64encode(b"email body").decode("utf-8")
    payload = {
        "m1": {"payload": {"parts": [{"mimeType": "text/plain", "body": {"data": encoded}}]}}
    }

    added = []
    db = SimpleNamespace(
        query=lambda *_a, **_k: SimpleNamespace(
            filter=lambda *_a, **_k: SimpleNamespace(
                first=lambda: SimpleNamespace(id="u1", to_dict=lambda: {"email": "u@example.com"})
            )
        ),
        add=lambda obj: added.append(obj),
        commit=lambda: None,
        refresh=lambda obj: setattr(obj, "id", "app-1"),
        close=lambda: None,
    )

    monkeypatch.setattr(module, "SessionLocal", lambda: db)
    monkeypatch.setattr(
        module,
        "get_gmail_service",
        lambda _uid: _gmail_service_with_messages([{"id": "m1"}], payload),
    )
    monkeypatch.setattr(
        module,
        "extract_job_details_from_email",
        lambda _body: {
            "title": "Role",
            "company": "Org",
            "description": "Desc",
            "deadline": "2026-05-01",
        },
    )
    monkeypatch.setattr(module, "createCalendarEvent", AsyncMock(return_value="evt-1"))
    monkeypatch.setattr(module, "sendNewOpportunityNotification", lambda *_args, **_kwargs: None)

    result = await module.scanUserEmails("user-1")

    assert len(result) == 1
    assert result[0]["id"] == "app-1"
    assert len(added) == 1


@pytest.mark.asyncio
async def test_scan_user_emails_skips_messages_without_plaintext_or_title(monkeypatch):
    payload = {
        "m1": {"payload": {"parts": [{"mimeType": "text/html", "body": {"data": "abc"}}]}},
        "m2": {
            "payload": {
                "parts": [
                    {
                        "mimeType": "text/plain",
                        "body": {"data": base64.urlsafe_b64encode(b"x").decode("utf-8")},
                    }
                ]
            }
        },
    }

    db = SimpleNamespace(
        query=lambda *_a, **_k: SimpleNamespace(
            filter=lambda *_a, **_k: SimpleNamespace(
                first=lambda: SimpleNamespace(id="u1", to_dict=lambda: {})
            )
        ),
        add=lambda _obj: None,
        commit=lambda: None,
        refresh=lambda _obj: None,
        close=lambda: None,
    )

    monkeypatch.setattr(module, "SessionLocal", lambda: db)
    monkeypatch.setattr(
        module,
        "get_gmail_service",
        lambda _uid: _gmail_service_with_messages([{"id": "m1"}, {"id": "m2"}], payload),
    )
    monkeypatch.setattr(module, "extract_job_details_from_email", lambda _body: {})

    result = await module.scanUserEmails("user-1")
    assert result == []


@pytest.mark.asyncio
async def test_scan_user_emails_tolerates_calendar_and_notification_failures(monkeypatch):
    encoded = base64.urlsafe_b64encode(b"email body").decode("utf-8")
    payload = {
        "m1": {"payload": {"parts": [{"mimeType": "text/plain", "body": {"data": encoded}}]}}
    }

    db = SimpleNamespace(
        query=lambda *_a, **_k: SimpleNamespace(
            filter=lambda *_a, **_k: SimpleNamespace(
                first=lambda: SimpleNamespace(id="u1", to_dict=lambda: {"email": "u@example.com"})
            )
        ),
        add=lambda _obj: None,
        commit=lambda: None,
        refresh=lambda obj: setattr(obj, "id", "app-1"),
        close=lambda: None,
    )

    monkeypatch.setattr(module, "SessionLocal", lambda: db)
    monkeypatch.setattr(
        module,
        "get_gmail_service",
        lambda _uid: _gmail_service_with_messages([{"id": "m1"}], payload),
    )
    monkeypatch.setattr(
        module,
        "extract_job_details_from_email",
        lambda _body: {
            "title": "Role",
            "company": "Org",
            "description": "Desc",
            "deadline": "2026-05-01",
        },
    )
    monkeypatch.setattr(
        module, "createCalendarEvent", AsyncMock(side_effect=RuntimeError("calendar fail"))
    )
    monkeypatch.setattr(
        module,
        "sendNewOpportunityNotification",
        lambda *_a, **_k: (_ for _ in ()).throw(RuntimeError("notify fail")),
    )

    result = await module.scanUserEmails("user-1")
    assert len(result) == 1


@pytest.mark.asyncio
async def test_scan_user_emails_handles_missing_user(monkeypatch):
    db = SimpleNamespace(
        query=lambda *_a, **_k: SimpleNamespace(
            filter=lambda *_a, **_k: SimpleNamespace(first=lambda: None)
        ),
        close=lambda: None,
    )
    monkeypatch.setattr(module, "SessionLocal", lambda: db)

    result = await module.scanUserEmails("missing-user")

    assert result == []
