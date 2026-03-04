"""Focused tests for the calendar manager helper."""

from types import SimpleNamespace

import pytest

from app.genkit_flows import calendar_manager as module


@pytest.mark.asyncio
async def test_create_calendar_event_requires_google_dependencies(monkeypatch):
    """Missing Google client libraries should fail fast."""
    monkeypatch.setattr(module, "Credentials", None)
    monkeypatch.setattr(module, "build", None)

    with pytest.raises(Exception, match="Google API dependencies are not installed"):
        await module.createCalendarEvent("user-1", {"deadline": "2026-12-31"})


@pytest.mark.asyncio
async def test_create_calendar_event_requires_user_auth(monkeypatch):
    """Users without stored Google credentials should be rejected."""
    monkeypatch.setattr(module, "Credentials", SimpleNamespace())
    monkeypatch.setattr(module, "build", object())
    monkeypatch.setattr(module, "get_user_secret", lambda *args, **kwargs: None)

    with pytest.raises(Exception, match="User has not authenticated with Google"):
        await module.createCalendarEvent("user-1", {"deadline": "2026-12-31"})


@pytest.mark.asyncio
async def test_create_calendar_event_requires_deadline(monkeypatch):
    """A missing deadline should raise a validation error."""
    monkeypatch.setattr(
        module,
        "Credentials",
        SimpleNamespace(from_authorized_user_info=lambda value: object()),
    )
    monkeypatch.setattr(module, "build", lambda *args, **kwargs: object())
    monkeypatch.setattr(
        module,
        "get_user_secret",
        lambda *args, **kwargs: {"access_token": "token"},
    )

    with pytest.raises(ValueError, match="must include a 'deadline'"):
        await module.createCalendarEvent("user-1", {"title": "Role"})


@pytest.mark.asyncio
async def test_create_calendar_event_returns_event_id_and_updates_metadata(monkeypatch):
    """Successful event creation should persist the calendar event id."""

    class _Credentials:
        @staticmethod
        def from_authorized_user_info(value):
            return object()

    created = {"id": "event-123"}

    class _Service:
        def events(self):
            return self

        def insert(self, **kwargs):
            return self

        def execute(self):
            return created

    class _Application:
        def __init__(self):
            self.application_metadata = {}

    application = _Application()

    class _Query:
        def filter(self, *args, **kwargs):
            return self

        def first(self):
            return application

    class _DB:
        def __init__(self):
            self.committed = False
            self.closed = False

        def query(self, model):
            return _Query()

        def commit(self):
            self.committed = True

        def close(self):
            self.closed = True

    db = _DB()

    monkeypatch.setattr(module, "Credentials", _Credentials)
    monkeypatch.setattr(module, "build", lambda *args, **kwargs: _Service())
    monkeypatch.setattr(
        module,
        "get_user_secret",
        lambda *args, **kwargs: {"access_token": "token", "refresh_token": "refresh"},
    )
    monkeypatch.setattr(module, "SessionLocal", lambda: db)

    event_id = await module.createCalendarEvent(
        "user-1",
        {
            "id": "app-1",
            "title": "Software Engineer",
            "company": "Acme",
            "deadline": "2026-12-31",
        },
    )

    assert event_id == "event-123"
    assert application.application_metadata["calendar_event_id"] == "event-123"
    assert db.committed is True
    assert db.closed is True
