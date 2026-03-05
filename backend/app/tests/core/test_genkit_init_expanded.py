from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from app.core import genkit_init


@pytest.fixture(autouse=True)
def _reset_state():
    orig_init = genkit_init.initialized
    orig_inst = genkit_init.genkit_instance
    orig_flows = genkit_init.registered_flows.copy()
    genkit_init.initialized = False
    genkit_init.genkit_instance = None
    genkit_init.registered_flows = {}
    yield
    genkit_init.initialized = orig_init
    genkit_init.genkit_instance = orig_inst
    genkit_init.registered_flows = orig_flows


def test_startup_genkit_enabled_calls_init():
    with (
        patch("app.core.genkit_init.is_genkit_enabled", return_value=True),
        patch("app.core.genkit_init.init_genkit", return_value=True) as mock_init,
    ):
        genkit_init.startup_genkit()
        mock_init.assert_called_once()


def test_init_genkit_returns_true_when_already_initialized():
    genkit_init.initialized = True
    assert genkit_init.init_genkit() is True


def test_startup_genkit_disabled_does_not_call_init():
    with (
        patch("app.core.genkit_init.is_genkit_enabled", return_value=False),
        patch("app.core.genkit_init.init_genkit") as mock_init,
    ):
        genkit_init.startup_genkit()
        mock_init.assert_not_called()


def test_get_registered_flows_returns_copy():
    genkit_init.registered_flows["x"] = lambda: "ok"
    copy_flows = genkit_init.get_registered_flows()
    assert "x" in copy_flows
    copy_flows.clear()
    assert "x" in genkit_init.registered_flows


def test_simple_genkit_flow_and_create_flow_wrapper():
    @genkit_init.simple_genkit_flow()
    def _simple():
        return "ok"

    wrapped = genkit_init.create_flow_wrapper(lambda: "wrapped", name="wrapped-flow")
    assert _simple() == "ok"
    assert wrapped() == "wrapped"
    assert "wrapped-flow" in genkit_init.registered_flows


def test_run_flow_sync():
    def _flow(**kwargs):
        return kwargs["value"] + 1

    assert genkit_init.run_flow(_flow, value=2) == 3


@pytest.mark.asyncio
async def test_run_flow_async_for_async_and_sync():
    async def _async_flow(v):
        return v * 2

    def _sync_flow(v):
        return v + 3

    assert await genkit_init.run_flow_async(_async_flow, 2) == 4
    assert await genkit_init.run_flow_async(_sync_flow, 2) == 5


def test_check_genkit_health_when_enabled_and_not_initialized():
    with (
        patch("app.core.genkit_init.is_genkit_enabled", return_value=True),
        patch("app.core.genkit_init._get_gemini_api_key", return_value=None),
    ):
        health = genkit_init.check_genkit_health()
        assert health["enabled"] is True
        assert health["initialized"] is False
        assert len(health["errors"]) >= 1
