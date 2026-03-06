"""Comprehensive test suite for genkit_init.py.

Coverage target: 85% (15+ test cases)
Functions tested:
- _get_settings()
- _get_gemini_api_key()
- init_genkit()
- get_model()
- is_genkit_enabled()
- check_genkit_health()
- startup_genkit()
- register_flow_function()
- get_registered_flows()
- genkit_flow() decorator
- create_flow_wrapper()
- run_flow()
- run_flow_async()
"""

import asyncio
from unittest.mock import MagicMock, patch

import pytest

from app.core import genkit_init
from app.core.genkit_init import (
    check_genkit_health,
    create_flow_wrapper,
    genkit_flow,
    get_model,
    get_registered_flows,
    init_genkit,
    is_genkit_enabled,
    register_flow_function,
    run_flow,
    run_flow_async,
    startup_genkit,
)


@pytest.fixture(autouse=True)
def reset_genkit_state():
    """Reset genkit global state before and after each test."""
    # Store original state
    original_initialized = genkit_init.initialized
    original_genkit_instance = genkit_init.genkit_instance
    original_registered_flows = genkit_init.registered_flows.copy()

    yield

    # Restore original state
    genkit_init.initialized = original_initialized
    genkit_init.genkit_instance = original_genkit_instance
    genkit_init.registered_flows.clear()
    genkit_init.registered_flows.update(original_registered_flows)


class TestGenkitSettings:
    """Tests for settings retrieval."""

    def test_get_settings_success(self):
        """Test successful settings retrieval."""
        settings = genkit_init._get_settings()
        assert settings is not None

    def test_get_settings_caching(self):
        """Test that settings are cached."""
        settings1 = genkit_init._get_settings()
        settings2 = genkit_init._get_settings()
        # Should be same object (cached)
        assert settings1 is settings2

    def test_get_gemini_api_key_from_settings(self):
        """Test retrieving Gemini API key from settings."""
        with patch("app.core.genkit_init._get_settings") as mock_get_settings:
            mock_settings = MagicMock()
            mock_settings.GEMINI_API_KEY = "test-api-key-123"
            mock_get_settings.return_value = mock_settings

            api_key = genkit_init._get_gemini_api_key()
            assert api_key == "test-api-key-123"

    def test_get_gemini_api_key_not_set(self):
        """Test API key retrieval when not set."""
        with patch("app.core.genkit_init._get_settings") as mock_get_settings:
            mock_settings = MagicMock()
            mock_settings.GEMINI_API_KEY = None
            mock_get_settings.return_value = mock_settings

            api_key = genkit_init._get_gemini_api_key()
            assert api_key is None

    def test_get_gemini_api_key_invalid_type(self):
        """Test API key retrieval when value is not a string."""
        with patch("app.core.genkit_init._get_settings") as mock_get_settings:
            mock_settings = MagicMock()
            mock_settings.GEMINI_API_KEY = 12345  # Not a string
            mock_get_settings.return_value = mock_settings

            api_key = genkit_init._get_gemini_api_key()
            assert api_key is None


class TestGenkitInitialization:
    """Tests for Genkit initialization."""

    def test_init_genkit_already_initialized(self):
        """Test init_genkit when already initialized."""
        genkit_init.initialized = True
        result = init_genkit()
        assert result is True

    def test_init_genkit_disabled(self):
        """Test init_genkit when flows are disabled."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=False):
            genkit_init.initialized = False
            result = init_genkit()
            assert result is False

    def test_init_genkit_no_api_key(self):
        """Test init_genkit without API key."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init._get_gemini_api_key", return_value=None):
                genkit_init.initialized = False
                result = init_genkit()
                assert result is False

    def test_init_genkit_with_genkit_plugin_success(self):
        """Test successful initialization with Genkit plugin."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", True):
                    mock_genkit_class = MagicMock()
                    mock_google_ai = MagicMock()

                    with patch("app.core.genkit_init.genkit_ai") as mock_ai:
                        with patch("app.core.genkit_init.genkit_plugins_google") as mock_plugins:
                            mock_ai.Genkit = mock_genkit_class
                            mock_plugins.GoogleAI = mock_google_ai

                            genkit_init.initialized = False
                            result = init_genkit()

                            assert result is True
                            assert genkit_init.initialized is True

    def test_init_genkit_with_genkit_plugin_failure(self):
        """Test initialization with Genkit plugin failure."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", True):
                    with patch("app.core.genkit_init.genkit_ai") as mock_ai:
                        mock_ai.Genkit = None  # Missing class

                        with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", False):
                            genkit_init.initialized = False
                            result = init_genkit()
                            assert result is False

    def test_init_genkit_with_google_generativeai_fallback(self):
        """Test successful initialization with google-generativeai fallback."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", False):
                    with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                        mock_genai = MagicMock()
                        mock_genai.list_models.return_value = ["model1", "model2"]

                        with patch(
                            "app.core.genkit_init.get_configured_google_generativeai",
                            return_value=mock_genai,
                        ):
                            genkit_init.initialized = False
                            result = init_genkit()

                            assert result is True
                            assert genkit_init.initialized is True

    def test_init_genkit_google_generativeai_no_models(self):
        """Test google-generativeai initialization with no models."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", False):
                    with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                        mock_genai = MagicMock()
                        mock_genai.list_models.return_value = []  # No models

                        with patch(
                            "app.core.genkit_init.get_configured_google_generativeai",
                            return_value=mock_genai,
                        ):
                            genkit_init.initialized = False
                            result = init_genkit()

                            assert result is False

    def test_init_genkit_google_generativeai_exception(self):
        """Test google-generativeai initialization with exception."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", False):
                    with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                        with patch(
                            "app.core.genkit_init.get_configured_google_generativeai",
                            side_effect=Exception("API Error"),
                        ):
                            genkit_init.initialized = False
                            result = init_genkit()

                            assert result is False

    def test_init_genkit_no_frameworks_available(self):
        """Test initialization when neither Genkit nor google-generativeai available."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", False):
                    with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", False):
                        genkit_init.initialized = False
                        result = init_genkit()

                        assert result is False


class TestGetModel:
    """Tests for get_model() function."""

    def test_get_model_when_enabled_and_initialized(self):
        """Test getting model when genkit is enabled and initialized."""
        genkit_init.initialized = True
        genkit_init.genkit_instance = MagicMock()

        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            model = get_model()
            assert model is not None

    def test_get_model_when_disabled(self):
        """Test getting model when genkit is disabled."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=False):
            model = get_model()
            assert model is None

    def test_get_model_lazy_initialization(self):
        """Test that get_model triggers initialization if needed."""
        genkit_init.initialized = False
        genkit_init.genkit_instance = None

        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init.init_genkit") as mock_init:
                mock_init.return_value = False
                get_model()
                mock_init.assert_called_once()


class TestIsGenkitEnabled:
    """Tests for is_genkit_enabled() function."""

    def test_is_genkit_enabled_both_true(self):
        """Test is_genkit_enabled when both flags are true."""
        with patch("app.core.genkit_init._get_settings") as mock_get_settings:
            mock_settings = MagicMock()
            mock_settings.ENABLE_AI_FEATURES = True
            mock_settings.ENABLE_GENKIT_FLOWS = True
            mock_get_settings.return_value = mock_settings

            result = is_genkit_enabled()
            assert result is True

    def test_is_genkit_enabled_ai_features_false(self):
        """Test is_genkit_enabled when AI features disabled."""
        with patch("app.core.genkit_init._get_settings") as mock_get_settings:
            mock_settings = MagicMock()
            mock_settings.ENABLE_AI_FEATURES = False
            mock_settings.ENABLE_GENKIT_FLOWS = True
            mock_get_settings.return_value = mock_settings

            result = is_genkit_enabled()
            assert result is False

    def test_is_genkit_enabled_genkit_flows_false(self):
        """Test is_genkit_enabled when genkit flows disabled."""
        with patch("app.core.genkit_init._get_settings") as mock_get_settings:
            mock_settings = MagicMock()
            mock_settings.ENABLE_AI_FEATURES = True
            mock_settings.ENABLE_GENKIT_FLOWS = False
            mock_get_settings.return_value = mock_settings

            result = is_genkit_enabled()
            assert result is False

    def test_is_genkit_enabled_both_false(self):
        """Test is_genkit_enabled when both flags are false."""
        with patch("app.core.genkit_init._get_settings") as mock_get_settings:
            mock_settings = MagicMock()
            mock_settings.ENABLE_AI_FEATURES = False
            mock_settings.ENABLE_GENKIT_FLOWS = False
            mock_get_settings.return_value = mock_settings

            result = is_genkit_enabled()
            assert result is False


class TestCheckGenkitHealth:
    """Tests for check_genkit_health() function."""

    def test_check_genkit_health_fully_healthy(self):
        """Test health check when everything is healthy."""
        genkit_init.initialized = True
        genkit_init.genkit_instance = MagicMock()

        with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
            with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", True):
                    with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                        health = check_genkit_health()

                        assert health["available"] is True
                        assert health["initialized"] is True
                        assert health["gemini_api_key_present"] is True
                        assert health["enabled"] is True
                        assert health["model_available"] is True
                        assert health["errors"] == []

    def test_check_genkit_health_disabled(self):
        """Test health check when genkit is disabled."""
        genkit_init.initialized = False
        genkit_init.genkit_instance = None

        with patch("app.core.genkit_init._get_gemini_api_key", return_value=None):
            with patch("app.core.genkit_init.is_genkit_enabled", return_value=False):
                health = check_genkit_health()

                assert health["enabled"] is False
                # Errors should only be checked if enabled
                assert health["errors"] == []

    def test_check_genkit_health_not_available(self):
        """Test health check when frameworks not available."""
        genkit_init.initialized = False

        with patch("app.core.genkit_init._get_gemini_api_key", return_value=None):
            with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", False):
                    with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", False):
                        health = check_genkit_health()

                        assert health["available"] is False
                        assert health["initialized"] is False
                        assert any("not available" in err for err in health["errors"])

    def test_check_genkit_health_not_initialized(self):
        """Test health check when not initialized."""
        genkit_init.initialized = False
        genkit_init.genkit_instance = None

        with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
            with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", True):
                    health = check_genkit_health()

                    assert health["initialized"] is False
                    assert any("initialize" in err for err in health["errors"])

    def test_check_genkit_health_no_model(self):
        """Test health check when model not available."""
        genkit_init.initialized = True
        genkit_init.genkit_instance = None

        with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
            with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
                with patch("app.core.genkit_init.GENKIT_AVAILABLE", True):
                    health = check_genkit_health()

                    assert health["model_available"] is False
                    assert any("available" in err for err in health["errors"])


class TestStartupGenkit:
    """Tests for startup_genkit() function."""

    def test_startup_genkit_enabled_success(self):
        """Test successful startup when enabled."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init.init_genkit", return_value=True):
                # Should not raise
                startup_genkit()

    def test_startup_genkit_enabled_failure(self):
        """Test startup when enabled but initialization fails."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init.init_genkit", return_value=False):
                # Should not raise
                startup_genkit()

    def test_startup_genkit_disabled(self):
        """Test startup when disabled."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=False):
            # Should not raise
            startup_genkit()


class TestFlowRegistration:
    """Tests for flow registration functions."""

    def test_register_flow_function(self):
        """Test registering a flow function."""

        def test_flow():
            return "result"

        result = register_flow_function(test_flow, name="test_flow_custom")
        assert result is test_flow
        assert "test_flow_custom" in genkit_init.registered_flows

    def test_register_flow_function_auto_name(self):
        """Test registering with automatic name from function."""

        def my_flow():
            return "result"

        register_flow_function(my_flow)
        assert "my_flow" in genkit_init.registered_flows

    def test_get_registered_flows(self):
        """Test getting registered flows."""
        genkit_init.registered_flows.clear()

        def flow1():
            pass

        def flow2():
            pass

        register_flow_function(flow1)
        register_flow_function(flow2)

        flows = get_registered_flows()
        assert "flow1" in flows
        assert "flow2" in flows
        assert len(flows) == 2

    def test_get_registered_flows_returns_copy(self):
        """Test that get_registered_flows returns a copy."""
        flows1 = get_registered_flows()
        flows2 = get_registered_flows()
        assert flows1 is not flows2


class TestGenkitFlowDecorator:
    """Tests for genkit_flow decorator."""

    def test_genkit_flow_decorator_sync_function(self):
        """Test decorator on synchronous function."""

        @genkit_flow
        def sync_test_flow():
            return "sync result"

        result = sync_test_flow()
        assert result == "sync result"
        assert "sync_test_flow" in genkit_init.registered_flows

    @pytest.mark.asyncio
    async def test_genkit_flow_decorator_async_function(self):
        """Test decorator on asynchronous function."""

        @genkit_flow
        async def async_test_flow():
            await asyncio.sleep(0)
            return "async result"

        result = await async_test_flow()
        assert result == "async result"
        assert "async_test_flow" in genkit_init.registered_flows

    def test_genkit_flow_decorator_with_custom_name(self):
        """Test decorator with custom flow name."""

        @genkit_flow(name="custom_flow_name")
        def test_flow():
            return "result"

        assert "custom_flow_name" in genkit_init.registered_flows

    def test_genkit_flow_decorator_with_output_schema(self):
        """Test decorator with output schema."""
        from pydantic import BaseModel

        class OutputSchema(BaseModel):
            result: str

        @genkit_flow(output_schema=OutputSchema)
        def test_flow():
            return "result"

        assert callable(test_flow)

    def test_genkit_flow_decorator_passes_arguments(self):
        """Test that decorator preserves function arguments."""

        @genkit_flow
        def test_flow(a, b):
            return a + b

        result = test_flow(2, 3)
        assert result == 5

    def test_genkit_flow_decorator_with_kwargs(self):
        """Test that decorator handles keyword arguments."""

        @genkit_flow
        def test_flow(a, b=10):
            return a + b

        result = test_flow(5, b=15)
        assert result == 20


class TestFlowWrappers:
    """Tests for flow wrapper functions."""

    def test_create_flow_wrapper(self):
        """Test creating a flow wrapper."""

        def my_flow():
            return "wrapped"

        wrapped = create_flow_wrapper(my_flow, name="my_wrapper")
        assert callable(wrapped)
        assert "my_wrapper" in genkit_init.registered_flows

    def test_run_flow_sync(self):
        """Test running a synchronous flow."""

        def test_flow(x, y):
            return x * y

        result = run_flow(test_flow, x=3, y=4)
        assert result == 12

    @pytest.mark.asyncio
    async def test_run_flow_async_with_async_function(self):
        """Test running an async flow with async function."""

        async def test_flow(x, y):
            await asyncio.sleep(0)
            return x * y

        result = await run_flow_async(test_flow, x=3, y=4)
        assert result == 12

    @pytest.mark.asyncio
    async def test_run_flow_async_with_sync_function(self):
        """Test running an async flow with sync function."""

        def test_flow(x, y):
            return x * y

        result = await run_flow_async(test_flow, x=3, y=4)
        assert result == 12


class TestGenkitIntegration:
    """Integration tests for genkit initialization and usage."""

    def test_full_initialization_flow(self):
        """Test complete initialization flow."""
        with patch("app.core.genkit_init._get_gemini_api_key", return_value="test-key"):
            with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
                with patch("app.core.genkit_init.GOOGLE_GENERATIVEAI_AVAILABLE", True):
                    mock_genai = MagicMock()
                    mock_genai.list_models.return_value = ["model1"]

                    with patch(
                        "app.core.genkit_init.get_configured_google_generativeai",
                        return_value=mock_genai,
                    ):
                        genkit_init.initialized = False
                        genkit_init.genkit_instance = None

                        # Initialize
                        result = init_genkit()
                        assert result is True

                        # Get model
                        model = get_model()
                        assert model is not None

                        # Check health
                        health = check_genkit_health()
                        assert health["initialized"] is True

    def test_multiple_flow_registrations(self):
        """Test registering and using multiple flows."""
        genkit_init.registered_flows.clear()

        @genkit_flow(name="flow_a")
        def flow_a(x):
            return x * 2

        @genkit_flow(name="flow_b")
        def flow_b(x):
            return x + 10

        result_a = flow_a(5)
        result_b = flow_b(5)

        assert result_a == 10
        assert result_b == 15
        assert len(genkit_init.registered_flows) >= 2
