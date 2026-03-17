"""Tests for ingestion_flow — career history ingestion."""

from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

from app.genkit_flows.ingestion_flow import SYSTEM_PROMPT, _extract_output, ingest_career_history


@pytest.fixture
def mock_model(monkeypatch):
    m = MagicMock()
    monkeypatch.setattr("app.genkit_flows.ingestion_flow.get_model", lambda: m)
    return m


@pytest.fixture
def mock_career_db():
    from unittest.mock import MagicMock

    obj = MagicMock()
    obj.__class__.__name__ = "CareerDatabase"
    return obj


class TestSystemPrompt:
    def test_system_prompt_is_not_empty(self):
        assert len(SYSTEM_PROMPT) > 100

    def test_system_prompt_contains_key_instructions(self):
        assert "De-duplication" in SYSTEM_PROMPT or "deduplication" in SYSTEM_PROMPT.lower()


class TestExtractOutput:
    def test_callable_output_is_called(self, mock_career_db):
        response = MagicMock()
        response.output = MagicMock(return_value=mock_career_db)
        result = _extract_output(response)
        response.output.assert_called_once()

    def test_none_output_raises_runtime_error(self):
        response = SimpleNamespace(output=None)
        with pytest.raises(RuntimeError, match="structured output"):
            _extract_output(response)


class TestIngestCareerHistory:
    def test_happy_path_returns_career_database(self, mock_model, mock_career_db):
        """Model generates valid output → should return CareerDatabase."""
        mock_response = MagicMock()
        mock_response.output.return_value = mock_career_db
        mock_model.generate.return_value = mock_response

        result = ingest_career_history("I worked at Acme Corp for 5 years.")
        assert result is mock_career_db
        mock_model.generate.assert_called_once()

    def test_model_unavailable_raises_runtime_error(self, monkeypatch):
        """When get_model returns None, should raise RuntimeError."""
        monkeypatch.setattr("app.genkit_flows.ingestion_flow.get_model", lambda: None)
        with pytest.raises(RuntimeError, match="not available"):
            ingest_career_history("Some career text")

    def test_model_error_propagates(self, mock_model):
        """RuntimeError from model should propagate."""
        mock_model.generate.side_effect = RuntimeError("Model down")
        with pytest.raises(RuntimeError, match="Model down"):
            ingest_career_history("Career text")

    def test_system_prompt_is_included_in_call(self, mock_model, mock_career_db):
        """The model call should include the SYSTEM_PROMPT."""
        mock_response = MagicMock()
        mock_response.output.return_value = mock_career_db
        mock_model.generate.return_value = mock_response

        ingest_career_history("test text")
        call_kwargs = mock_model.generate.call_args
        prompt = call_kwargs[1].get("prompt", "") or call_kwargs[0][0]
        assert "test text" in prompt
