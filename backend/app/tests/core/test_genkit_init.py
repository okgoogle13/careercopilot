"""Tests for Genkit initialization logic."""

from typing import cast
from unittest.mock import MagicMock, patch

import pytest

from app.core import genkit_init


class TestGenkitInit:
    @pytest.fixture(autouse=True)
    def reset_global_state(self):
        """Reset global state between tests to ensure isolation."""
        # Save original
        orig_init = genkit_init.initialized
        orig_inst = genkit_init.genkit_instance
        orig_flows = genkit_init.registered_flows.copy()

        genkit_init.initialized = False
        genkit_init.genkit_instance = None
        genkit_init.registered_flows = {}

        yield

        # Restore original
        genkit_init.initialized = orig_init
        genkit_init.genkit_instance = orig_inst
        genkit_init.registered_flows = orig_flows

    def test_is_genkit_enabled_respects_settings(self):
        """Should check both ENABLE_AI_FEATURES and ENABLE_GENKIT_FLOWS."""
        settings = MagicMock()
        with patch("app.core.genkit_init._get_settings", return_value=settings):
            settings.ENABLE_AI_FEATURES = True
            settings.ENABLE_GENKIT_FLOWS = True
            assert genkit_init.is_genkit_enabled() is True

            settings.ENABLE_GENKIT_FLOWS = False
            assert genkit_init.is_genkit_enabled() is False

    def test_init_genkit_no_api_key_aborts(self):
        """Should return False if GEMINI_API_KEY is not available."""
        with patch("app.core.genkit_init._get_gemini_api_key", return_value=None):
            with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
                assert genkit_init.init_genkit() is False

    def test_check_genkit_health_returns_structured_dict(self):
        """Should return all required health keys."""
        health = genkit_init.check_genkit_health()
        assert "available" in health
        assert "initialized" in health
        assert "gemini_api_key_present" in health
        assert "enabled" in health
        assert "errors" in health

    def test_register_flow_function_populates_global_dict(self):
        """register_flow_function should add entries to registered_flows."""

        def my_test_flow():
            pass

        genkit_init.register_flow_function(my_test_flow, name="test_name")
        assert "test_name" in genkit_init.registered_flows
        assert genkit_init.registered_flows["test_name"] == my_test_flow

    def test_genkit_flow_decorator_registers_function(self):
        """genkit_flow should register the function it decorates."""

        @genkit_init.genkit_flow(name="decorated_flow")
        def flow_a():
            return "ok"

        assert "decorated_flow" in genkit_init.registered_flows
        assert flow_a() == "ok"

    @pytest.mark.asyncio
    async def test_genkit_flow_decorator_handles_async(self):
        """genkit_flow should correctly wrap async functions."""

        @genkit_init.genkit_flow(name="async_flow")
        async def flow_b(x):
            return x * 2

        result = await flow_b(10)
        assert result == 20

    def test_startup_genkit_invokes_init(self):
        """startup_genkit should call init_genkit if enabled."""
        with patch("app.core.genkit_init.is_genkit_enabled", return_value=True):
            with patch("app.core.genkit_init.init_genkit") as mock_init:
                genkit_init.startup_genkit()
                mock_init.assert_called_once()
