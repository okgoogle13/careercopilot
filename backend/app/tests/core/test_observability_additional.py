from __future__ import annotations

from types import SimpleNamespace
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from starlette.requests import Request
from starlette.responses import Response as StarletteResponse

from app.core import observability as obs


def test_configure_logging_development_and_production(tmp_path) -> None:
    fake_logger = MagicMock()

    with patch.object(obs, "logger", fake_logger):
        obs.configure_logging(environment="development", log_dir=str(tmp_path / "dev"))
        assert fake_logger.remove.called
        assert fake_logger.add.call_count == 2
        filter_fn = fake_logger.add.call_args_list[0].kwargs["filter"]
        record: dict[str, Any] = {"extra": {}}
        assert filter_fn(record) is True
        assert "request_id" in record["extra"]
        assert "user_id" in record["extra"]

    fake_logger2 = MagicMock()
    with patch.object(obs, "logger", fake_logger2):
        obs.configure_logging(environment="production", log_dir=str(tmp_path / "prod"))
        assert fake_logger2.remove.called
        assert fake_logger2.add.call_count == 3


def test_get_logger_bind_and_fallback() -> None:
    class _Bindable:
        def bind(self, **kwargs):
            return {"bound": kwargs}

    with patch.object(obs, "logger", _Bindable()):
        got = obs.get_logger("x")
        assert got["bound"]["context"] == "x"

    plain = object()
    with patch.object(obs, "logger", plain):
        assert obs.get_logger("x") is plain


def test_init_metrics_with_fake_registry() -> None:
    class _Collector:
        def __init__(self, name):
            self._name = name

    class _MetricFactory:
        def __call__(self, name, *_args, **_kwargs):
            return _Collector(name)

    fake_registry = SimpleNamespace(_collector_to_names={})

    with (
        patch.object(obs, "PROMETHEUS_AVAILABLE", True),
        patch.object(obs, "REGISTRY", fake_registry),
        patch.object(obs, "Counter", _MetricFactory()),
        patch.object(obs, "Histogram", _MetricFactory()),
        patch.object(obs, "_metrics", {}),
    ):
        obs._init_metrics()
        assert "http_requests" in obs._metrics
        assert "http_duration" in obs._metrics
        assert "ai_operations" in obs._metrics
        assert "ai_duration" in obs._metrics


def test_init_metrics_handles_existing_collectors_and_value_error() -> None:
    class _Existing:
        def __init__(self, name):
            self._name = name

    existing = _Existing("http_requests_total")
    fake_registry = SimpleNamespace(_collector_to_names={existing: {"http_requests_total"}})

    class _FailMetricFactory:
        def __call__(self, *_args, **_kwargs):
            raise ValueError("duplicate")

    with (
        patch.object(obs, "PROMETHEUS_AVAILABLE", True),
        patch.object(obs, "REGISTRY", fake_registry),
        patch.object(obs, "Counter", _FailMetricFactory()),
        patch.object(obs, "Histogram", _FailMetricFactory()),
        patch.object(obs, "_metrics", {}),
    ):
        obs._init_metrics()
        # Existing collector should still be reused.
        assert "http_requests" in obs._metrics


def test_init_metrics_skip_when_metrics_already_initialized() -> None:
    class _Collector:
        def __init__(self, name):
            self._name = name

    class _MetricFactory:
        def __call__(self, name, *_args, **_kwargs):
            return _Collector(name)

    fake_registry = SimpleNamespace(_collector_to_names={})
    existing_metrics = {
        "http_requests": _Collector("http_requests_total"),
        "http_duration": _Collector("http_request_duration_seconds"),
        "ai_operations": _Collector("ai_operations_total"),
        "ai_duration": _Collector("ai_operation_duration_seconds"),
    }

    with (
        patch.object(obs, "PROMETHEUS_AVAILABLE", True),
        patch.object(obs, "REGISTRY", fake_registry),
        patch.object(obs, "Counter", _MetricFactory()),
        patch.object(obs, "Histogram", _MetricFactory()),
        patch.object(obs, "_metrics", existing_metrics.copy()),
    ):
        before = dict(obs._metrics)
        obs._init_metrics()
        assert obs._metrics.keys() == before.keys()


def test_init_metrics_http_requests_none_branch() -> None:
    class _Collector:
        def __init__(self, name):
            self._name = name

    class _CounterFactory:
        def __call__(self, *_args, **_kwargs):
            raise ValueError("counter registration failed")

    class _HistogramFactory:
        def __call__(self, name, *_args, **_kwargs):
            return _Collector(name)

    fake_registry = SimpleNamespace(_collector_to_names={})
    with (
        patch.object(obs, "PROMETHEUS_AVAILABLE", True),
        patch.object(obs, "REGISTRY", fake_registry),
        patch.object(obs, "Counter", _CounterFactory()),
        patch.object(obs, "Histogram", _HistogramFactory()),
        patch.object(obs, "_metrics", {}),
    ):
        obs._init_metrics()
        assert "http_requests" not in obs._metrics
        assert "http_duration" in obs._metrics


def test_unified_observability_middleware_success_and_error_paths() -> None:
    app = FastAPI()

    @app.get("/ok")
    async def _ok():
        return {"ok": True}

    @app.get("/boom")
    async def _boom():
        raise RuntimeError("boom")

    with patch.object(obs, "PROMETHEUS_AVAILABLE", False):
        app.add_middleware(obs.UnifiedObservabilityMiddleware, exclude_paths=["/health", "/skip"])
        client = TestClient(app)

        ok = client.get("/ok", headers={"X-Request-ID": "rid-123"})
        assert ok.status_code == 200
        assert ok.headers["X-Request-ID"] == "rid-123"
        assert "X-Response-Time" in ok.headers

        bad = client.get("/boom")
        assert bad.status_code == 500
        assert bad.json()["error"] == "Internal Server Error"


def test_unified_observability_middleware_error_with_prometheus_metrics() -> None:
    app = FastAPI()

    @app.get("/boom")
    async def _boom():
        raise RuntimeError("boom")

    metric = MagicMock()
    metric.labels.return_value = metric
    with (
        patch.object(obs, "PROMETHEUS_AVAILABLE", True),
        patch.object(obs, "_metrics", {"http_requests": metric, "http_duration": metric}),
    ):
        app.add_middleware(obs.UnifiedObservabilityMiddleware)
        client = TestClient(app)
        bad = client.get("/boom")
        assert bad.status_code == 500
        assert metric.labels.called


def test_setup_observability_registers_metrics_endpoint_when_prometheus_available() -> None:
    app = FastAPI()
    with (
        patch.object(obs, "configure_logging"),
        patch.object(obs, "PROMETHEUS_AVAILABLE", True),
    ):
        obs.setup_observability(app, environment="test")

    client = TestClient(app)
    metrics = client.get("/metrics")
    assert metrics.status_code == 200
    assert "http_requests_total" in metrics.text


@pytest.mark.asyncio
async def test_middleware_dispatch_sets_user_id_and_metrics(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    app = FastAPI()
    mw = obs.UnifiedObservabilityMiddleware(app)

    class _Metric:
        def labels(self, **_kwargs):
            return self

        def inc(self):
            return None

        def observe(self, _val):
            return None

    monkeypatch.setattr(obs, "PROMETHEUS_AVAILABLE", True)
    monkeypatch.setattr(obs, "_metrics", {"http_requests": _Metric(), "http_duration": _Metric()})

    scope = {
        "type": "http",
        "http_version": "1.1",
        "method": "GET",
        "path": "/x",
        "raw_path": b"/x",
        "query_string": b"",
        "headers": [(b"x-request-id", b"rid-xyz")],
        "client": ("127.0.0.1", 12345),
        "server": ("testserver", 80),
        "scheme": "http",
    }
    request = Request(scope)
    request.state.user_id = "u123"

    async def _ok(_request):
        return StarletteResponse(content="ok", status_code=200)

    response = await mw.dispatch(request, _ok)
    assert response.status_code == 200
    assert response.headers["X-Request-ID"] == "rid-xyz"
    assert obs.user_id_context.get() == "u123"


@pytest.mark.asyncio
async def test_monitor_performance_async_error_branch() -> None:
    metrics = {"ai_operations": MagicMock(), "ai_duration": MagicMock()}

    with (
        patch("app.core.observability.PROMETHEUS_AVAILABLE", True),
        patch("app.core.observability._metrics", metrics),
    ):

        @obs.monitor_performance("async.op.fail")
        async def _fail():
            raise RuntimeError("boom")

        with pytest.raises(RuntimeError):
            await _fail()

        assert metrics["ai_operations"].labels.called


@pytest.mark.asyncio
async def test_monitor_performance_async_error_without_metric_keys() -> None:
    with (
        patch("app.core.observability.PROMETHEUS_AVAILABLE", True),
        patch("app.core.observability._metrics", {}),
    ):

        @obs.monitor_performance("async.op.fail.nometrics")
        async def _fail():
            raise RuntimeError("boom")

        with pytest.raises(RuntimeError):
            await _fail()


def test_monitor_performance_sync_without_prometheus() -> None:
    with patch("app.core.observability.PROMETHEUS_AVAILABLE", False):

        @obs.monitor_performance("sync.no.prom")
        def _ok(x: int):
            return x + 10

        assert _ok(1) == 11


def test_monitor_performance_sync_error_without_metric_keys() -> None:
    with (
        patch("app.core.observability.PROMETHEUS_AVAILABLE", True),
        patch("app.core.observability._metrics", {}),
    ):

        @obs.monitor_performance("sync.op.fail.nometrics")
        def _fail():
            raise RuntimeError("boom")

        with pytest.raises(RuntimeError):
            _fail()


@pytest.mark.asyncio
async def test_monitor_performance_async_without_prometheus() -> None:
    with patch("app.core.observability.PROMETHEUS_AVAILABLE", False):

        @obs.monitor_performance("async.no.prom")
        async def _ok(x: int):
            return x + 5

        assert await _ok(2) == 7
