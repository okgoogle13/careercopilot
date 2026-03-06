from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.genkit_flows.llm_service import _extract_response_text, generate_llm_response
from app.schemas.ai import LlmRequest, LlmResponse


def test_extract_response_text_with_text_attr():
    response = MagicMock()
    response.text = "hello world"
    assert _extract_response_text(response) == "hello world"


def test_extract_response_text_with_dict():
    response = {"candidates": [{"content": {"parts": [{"text": "hello dict"}]}}]}
    assert _extract_response_text(response) == "hello dict"


def test_extract_response_text_fallback():
    assert _extract_response_text("fallback") == "fallback"


@pytest.mark.asyncio
async def test_generate_llm_response_success():
    mock_model = AsyncMock()
    mock_model.generate.return_value = MagicMock(text="mocked response")
    mock_model.model_name = "gemini-pro"

    with patch("app.genkit_flows.llm_service.get_model", return_value=mock_model):
        request = LlmRequest(prompt="test prompt", model_name="test-model")
        response = await generate_llm_response(request)

        assert isinstance(response, LlmResponse)
        assert response.content == "mocked response"
        assert response.model_used == "gemini-pro"
        assert response.metadata["operation_type"] == "llm_generic"
        mock_model.generate.assert_called_once_with("test prompt")


@pytest.mark.asyncio
async def test_generate_llm_response_with_system_prompt():
    mock_model = AsyncMock()
    mock_model.generate.return_value = MagicMock(text="mocked response")
    mock_model.model_name = "gemini-pro"

    with patch("app.genkit_flows.llm_service.get_model", return_value=mock_model):
        request = LlmRequest(
            prompt="test prompt", system_prompt="you are a bot", service_name="test_service"
        )
        response = await generate_llm_response(request)

        assert response.content == "mocked response"
        assert response.metadata["operation_type"] == "test_service"
        mock_model.generate.assert_called_once_with("you are a bot\n\ntest prompt")


@pytest.mark.asyncio
async def test_generate_llm_response_no_model():
    with patch("app.genkit_flows.llm_service.get_model", return_value=None):
        request = LlmRequest(prompt="test prompt")
        with pytest.raises(RuntimeError, match="Genkit model not initialized"):
            await generate_llm_response(request)
