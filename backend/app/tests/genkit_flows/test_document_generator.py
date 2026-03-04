"""Focused tests for the document generator helper."""

from types import SimpleNamespace

import pytest

from app.genkit_flows import document_generator as module


def test_generate_tailored_resume_returns_model_text(monkeypatch):
    """The helper should return the model text payload."""
    captured = {}

    class _Response:
        def text(self):
            return "Tailored resume"

    class _Model:
        def generate(self, prompt):
            captured["prompt"] = prompt
            return _Response()

    monkeypatch.setattr(module, "gemini_pro", _Model())

    result = module.generate_tailored_resume(
        {"name": "Alex", "skills": ["Python"]},
        {"matching_skills": ["Python"], "missing_skills": ["SQL"]},
    )

    assert result == "Tailored resume"
    assert "matching_skills" in captured["prompt"]
    assert "Alex" in captured["prompt"]


def test_generate_tailored_resume_handles_empty_inputs(monkeypatch):
    """The helper should still pass empty dicts through to the model."""

    class _Response:
        def text(self):
            return "Resume from empty inputs"

    class _Model:
        def generate(self, prompt):
            return _Response()

    monkeypatch.setattr(module, "gemini_pro", _Model())

    assert module.generate_tailored_resume({}, {}) == "Resume from empty inputs"


def test_generate_tailored_resume_bubbles_model_errors(monkeypatch):
    """Generation failures should not be swallowed."""

    class _Model:
        def generate(self, prompt):
            raise RuntimeError("API Error")

    monkeypatch.setattr(module, "gemini_pro", _Model())

    with pytest.raises(RuntimeError, match="API Error"):
        module.generate_tailored_resume({"key": "value"}, {"key": "value"})
