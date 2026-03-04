"""Focused tests for the email scanner helpers."""

from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.genkit_flows import email_scanner as module


@pytest.mark.asyncio
async def test_scan_emails_for_job_opportunities_success(monkeypatch):
    """The wrapper should return a successful scan payload."""
    monkeypatch.setattr(
        module,
        "scanUserEmails",
        AsyncMock(return_value=[{"title": "Job 1", "company": "Company 1"}]),
    )

    result = await module.scanEmailsForJobOpportunities("test_user")

    assert result["success"] is True
    assert result["opportunities_found"] == 1
    assert result["opportunities"][0]["title"] == "Job 1"
    assert "scan_timestamp" in result


@pytest.mark.asyncio
async def test_scan_emails_for_job_opportunities_failure(monkeypatch):
    """The wrapper should convert scan failures into a structured error response."""
    monkeypatch.setattr(
        module,
        "scanUserEmails",
        AsyncMock(side_effect=RuntimeError("Failed to scan emails")),
    )

    result = await module.scanEmailsForJobOpportunities("test_user")

    assert result == {
        "success": False,
        "error": "Failed to scan emails",
        "opportunities_found": 0,
        "opportunities": [],
    }


def test_get_gmail_service_success(monkeypatch):
    """The Gmail helper should build a service client from stored credentials."""
    creds = {"access_token": "token", "refresh_token": "refresh"}
    monkeypatch.setattr(module, "get_user_secret", lambda *args, **kwargs: creds)
    monkeypatch.setattr(
        module.Credentials,
        "from_authorized_user_info",
        lambda payload: "credentials",
    )
    monkeypatch.setattr(module, "build", lambda *args, **kwargs: "gmail-service")

    assert module.get_gmail_service("test_user") == "gmail-service"


def test_get_gmail_service_requires_credentials(monkeypatch):
    """Missing user credentials should raise an auth error."""
    monkeypatch.setattr(module, "get_user_secret", lambda *args, **kwargs: None)

    with pytest.raises(Exception, match="User has not authenticated with Google"):
        module.get_gmail_service("test_user")


def test_extract_job_details_from_email_uses_model(monkeypatch):
    """Email extraction should return the model output payload."""
    monkeypatch.setattr(module, "format_prompt", lambda *args, **kwargs: "prompt")
    monkeypatch.setattr(
        module,
        "get_model",
        lambda: SimpleNamespace(
            generate=lambda *args, **kwargs: SimpleNamespace(
                output=lambda: {"title": "Software Engineer", "company": "Acme Corp"}
            )
        ),
    )

    result = module.extract_job_details_from_email("Email body")

    assert result["title"] == "Software Engineer"
    assert result["company"] == "Acme Corp"


@pytest.mark.asyncio
async def test_scan_user_emails_returns_empty_when_user_missing(monkeypatch):
    """The scanner currently swallows missing-user errors and returns no opportunities."""

    class _Query:
        def filter(self, *args, **kwargs):
            return self

        def first(self):
            return None

    class _DB:
        def query(self, model):
            return _Query()

        def close(self):
            return None

    monkeypatch.setattr(module, "SessionLocal", lambda: _DB())

    assert await module.scanUserEmails("missing-user") == []
