"""Focused tests for the company analyzer flow."""

from types import SimpleNamespace

import pytest
import requests

from app.genkit_flows import company_analyzer as module


class _Response:
    """Simple HTTP response stub for page fetch tests."""

    def __init__(self, content=b"<html><body>Company text</body></html>", error=None):
        self.content = content
        self._error = error

    def raise_for_status(self):
        if self._error:
            raise self._error


def test_analyze_company_website_success(monkeypatch):
    """The analyzer should fetch page text and return the model output."""
    monkeypatch.setattr(module.requests, "get", lambda *args, **kwargs: _Response())
    monkeypatch.setattr(
        module,
        "get_model",
        lambda: SimpleNamespace(
            generate=lambda *args, **kwargs: SimpleNamespace(
                output=lambda: module.CompanyAnalysis(
                    company_keywords=["python", "careers"],
                    company_tone="professional",
                )
            )
        ),
    )

    result = module.analyze_company_website("https://example.com")

    assert result.company_keywords == ["python", "careers"]
    assert result.company_tone == "professional"


def test_analyze_company_website_request_errors_raise_connection_error(monkeypatch):
    """Transport failures should be normalized to ConnectionError."""

    def _raise(*args, **kwargs):
        raise requests.exceptions.RequestException("timeout")

    monkeypatch.setattr(module.requests, "get", _raise)

    with pytest.raises(ConnectionError, match="Failed to fetch URL"):
        module.analyze_company_website("https://example.com")


def test_analyze_company_website_empty_text_raises_value_error(monkeypatch):
    """Empty pages should fail before model generation."""
    monkeypatch.setattr(module.requests, "get", lambda *args, **kwargs: _Response(b"<html></html>"))

    with pytest.raises(ValueError, match="Could not extract any text"):
        module.analyze_company_website("https://example.com")


def test_analyze_company_website_missing_model_output_raises_value_error(monkeypatch):
    """A falsy model output should surface as a validation error."""
    monkeypatch.setattr(module.requests, "get", lambda *args, **kwargs: _Response())
    monkeypatch.setattr(
        module,
        "get_model",
        lambda: SimpleNamespace(
            generate=lambda *args, **kwargs: SimpleNamespace(output=lambda: None)
        ),
    )

    with pytest.raises(ValueError, match="Failed to generate company analysis"):
        module.analyze_company_website("https://example.com")
