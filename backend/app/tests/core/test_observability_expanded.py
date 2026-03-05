"""Expanded tests for observability helpers and decorators."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core import observability as obs


def test_monitor_performance_sync_success_and_error():
    metrics = {"ai_operations": MagicMock(), "ai_duration": MagicMock()}

    with (
        patch("app.core.observability.PROMETHEUS_AVAILABLE", True),
        patch("app.core.observability._metrics", metrics),
    ):

        @obs.monitor_performance("sync.op")
        def _ok(x: int):
            return x + 1

        @obs.monitor_performance("sync.op.fail")
        def _fail():
            raise RuntimeError("boom")

        assert _ok(1) == 2
        with pytest.raises(RuntimeError):
            _fail()

        assert metrics["ai_operations"].labels.call_count >= 2


@pytest.mark.asyncio
async def test_monitor_performance_async_success():
    metrics = {"ai_operations": MagicMock(), "ai_duration": MagicMock()}

    with (
        patch("app.core.observability.PROMETHEUS_AVAILABLE", True),
        patch("app.core.observability._metrics", metrics),
    ):

        @obs.monitor_performance("async.op")
        async def _ok(x: int):
            return x * 2

        assert await _ok(3) == 6
        assert metrics["ai_duration"].labels.return_value.observe.called


def test_setup_observability_registers_health_endpoint():
    app = FastAPI()
    with (
        patch("app.core.observability.configure_logging"),
        patch("app.core.observability.PROMETHEUS_AVAILABLE", False),
    ):
        obs.setup_observability(app, environment="test")

    client = TestClient(app)
    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"


def test_tracking_helpers_and_metrics_collector():
    obs.track_user_action("click", "u1", foo="bar")
    obs.track_ai_usage("analyze", "u1", tokens_used=10, cached=True)
    obs.track_error("ValueError", "component", "bad", user_id="u1")

    collector = obs.get_metrics_collector()
    collector.increment_counter("x")
    collector.record_histogram("x", 1.0)
    collector.set_gauge("x", 1)
    collector.record_performance("x", 1.0)
    assert collector.get_metrics_summary()["uptime_seconds"] == 0
