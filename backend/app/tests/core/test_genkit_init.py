from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.core.genkit_init import (
    genkit_flow,
    get_model,
    get_registered_flows,
    init_genkit,
    is_genkit_enabled,
    register_flow_function,
)


@pytest.fixture(autouse=True)
def reset_genkit_state():
    import app.core.genkit_init as genkit_init

    genkit_init.initialized = False
    genkit_init.genkit_instance = None
    # registered_flows is usually fine to keep or reset
    yield
    genkit_init.initialized = False
    genkit_init.genkit_instance = None


@pytest.fixture
def mock_settings():
    settings = MagicMock()
    settings.ENABLE_AI_FEATURES = True
    settings.ENABLE_GENKIT_FLOWS = True
    settings.GEMINI_API_KEY = "test_key"
    return settings


def test_is_genkit_enabled(mock_settings):
    with patch("app.core.genkit_init._get_settings", return_value=mock_settings):
        assert is_genkit_enabled() is True

        mock_settings.ENABLE_GENKIT_FLOWS = False
        assert is_genkit_enabled() is False


def test_register_flow_function():
    def test_func():
        pass

    register_flow_function(test_func, "test_flow")
    flows = get_registered_flows()
    assert "test_flow" in flows
    assert flows["test_flow"] == test_func


@pytest.mark.asyncio
async def test_genkit_flow_decorator_sync():
    # Test sync flow decoration
    @genkit_flow(name="sync_test")
    def sync_flow(x):
        return x + 1

    assert sync_flow(1) == 2
    assert "sync_test" in get_registered_flows()


@pytest.mark.asyncio
async def test_genkit_flow_decorator_async():
    # Test async flow decoration
    @genkit_flow(name="async_test")
    async def async_flow(x):
        return x + 1

    result = await async_flow(1)
    assert result == 2
    assert "async_test" in get_registered_flows()


def test_init_genkit_fallback(mock_settings):
    with (
        patch("app.core.genkit_init._get_settings", return_value=mock_settings),
        patch("app.core.genkit_init.GENKIT_AVAILABLE", False),
        patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", True),
        patch("app.core.genkit_init.get_configured_google_generativeai") as mock_genai,
    ):

        mock_genai_instance = MagicMock()
        mock_genai_instance.list_models.return_value = ["gemini-pro"]
        mock_genai.return_value = mock_genai_instance

        result = init_genkit()
        assert result is True
        assert get_model() is not None


def test_init_genkit_disabled(mock_settings):
    mock_settings.ENABLE_GENKIT_FLOWS = False
    with patch("app.core.genkit_init._get_settings", return_value=mock_settings):
        assert init_genkit() is False
