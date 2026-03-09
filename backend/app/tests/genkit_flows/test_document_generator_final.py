"""Final branch-coverage tests for document_generator."""

from app.genkit_flows import document_generator as module


def test_generate_text_raises_when_model_missing(monkeypatch):
    monkeypatch.setattr(module, "get_model", lambda: None)

    try:
        module._generate_text("prompt")
        raise AssertionError("Expected RuntimeError")
    except RuntimeError as exc:
        assert "Genkit model not available" in str(exc)


def test_generate_text_returns_string_text_attribute(monkeypatch):
    class _Response:
        text = "direct string"

    class _Model:
        def generate(self, prompt):
            return _Response()

    monkeypatch.setattr(module, "get_model", lambda: _Model())

    assert module._generate_text("prompt") == "direct string"


def test_generate_text_uses_output_callable_and_stringifies(monkeypatch):
    class _Response:
        def output(self):
            return {"k": "v"}

    class _Model:
        def generate(self, prompt):
            return _Response()

    monkeypatch.setattr(module, "get_model", lambda: _Model())

    assert module._generate_text("prompt") == "{'k': 'v'}"


def test_generate_text_falls_back_to_response_string(monkeypatch):
    class _Response:
        def __str__(self):
            return "fallback string"

    class _Model:
        def generate(self, prompt):
            return _Response()

    monkeypatch.setattr(module, "get_model", lambda: _Model())

    assert module._generate_text("prompt") == "fallback string"
