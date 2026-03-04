"""Unit tests for monitoring middleware."""

import asyncio
from contextlib import contextmanager
from types import ModuleType, SimpleNamespace

import pytest
from fastapi import FastAPI, Response

import app.core.monitoring_middleware as module


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for isolated tests."""
    return None


class _Collector:
    """Simple metrics collector stub."""

    def __init__(self):
        self.counters = []
        self.histograms = []

    def increment_counter(self, name, value=1, labels=None):
        self.counters.append((name, value, labels))

    def record_histogram(self, name, value, labels=None):
        self.histograms.append((name, value, labels))

    def get_metrics_summary(self):
        return {
            "uptime_seconds": 60,
            "performance_metrics": {"api.call": {"error_count": 2}},
        }


class _State:
    """Mutable request state placeholder."""


class _Request:
    """Minimal request object for middleware tests."""

    def __init__(
        self,
        path="/api/v1/jobs/123",
        method="POST",
        headers=None,
        body=b'{"ok": true}',
        path_params=None,
        user_id=None,
        query_params="a=1",
        client_host="127.0.0.1",
    ):
        self.url = SimpleNamespace(path=path)
        self.method = method
        self.headers = headers or {"user-agent": "pytest"}
        self._body = body
        self.path_params = path_params or {}
        self.query_params = query_params
        self.client = SimpleNamespace(host=client_host) if client_host else None
        self.state = _State()
        if user_id is not None:
            self.state.user_id = user_id

    async def body(self):
        return self._body


def test_request_monitoring_helpers_extract_user_and_client_ip():
    """Helper methods should derive IDs, IPs, and normalized paths."""
    middleware = module.RequestMonitoringMiddleware(FastAPI())

    state_request = _Request(user_id="state-user")
    path_request = _Request(path_params={"user": "path-user"})
    fwd_request = _Request(headers={"X-Forwarded-For": "1.2.3.4, 5.6.7.8"})
    real_request = _Request(headers={"X-Real-IP": "2.3.4.5"})
    no_client_request = _Request(headers={}, client_host=None)

    assert middleware._extract_user_id(state_request) == "state-user"
    assert middleware._extract_user_id(path_request) == "path-user"
    assert middleware._extract_user_id(_Request(headers={"Authorization": "Bearer token"})) is None
    assert middleware._get_client_ip(fwd_request) == "1.2.3.4"
    assert middleware._get_client_ip(real_request) == "2.3.4.5"
    assert middleware._get_client_ip(no_client_request) == "unknown"
    assert (
        middleware._normalize_path("/api/v1/jobs/123/550e8400-e29b-41d4-a716-446655440000")
        == "/api/v1/jobs/{id}/{uuid}"
    )


def test_request_and_response_body_helpers_capture_json_and_sizes():
    """Body helpers should parse JSON and report truncation for large payloads."""
    middleware = module.RequestMonitoringMiddleware(
        FastAPI(),
        include_request_body=True,
        include_response_body=True,
        max_body_size=15,
    )

    info = asyncio.run(middleware._build_request_info(_Request(body=b'{"x": 1}')))
    assert info["request_body"] == {"x": 1}

    large_info = asyncio.run(middleware._build_request_info(_Request(body=b"x" * 20)))
    assert large_info["request_body_truncated"] is True

    response = Response(content=b'{"ok": true}', media_type="application/json")
    resp_info = asyncio.run(middleware._build_response_info(response))
    assert resp_info["response_body"] == {"ok": True}

    big_response = Response(content=b"x" * 20)
    big_info = asyncio.run(middleware._build_response_info(big_response))
    assert big_info["response_body_truncated"] is True


def test_request_monitoring_dispatch_handles_success_and_exclusions(monkeypatch):
    """Dispatch should skip excluded paths and add headers for successful requests."""
    collector = _Collector()
    monkeypatch.setattr(module, "get_metrics_collector", lambda: collector)
    tracked_actions = []
    monkeypatch.setattr(
        module,
        "track_user_action",
        lambda action, user_id: tracked_actions.append((action, user_id)),
    )

    middleware = module.RequestMonitoringMiddleware(
        FastAPI(),
        include_request_body=True,
        exclude_paths=["/health"],
    )
    middleware.collector = collector

    async def ok_call_next(request):
        return Response(content=b"ok", status_code=201)

    skipped = asyncio.run(middleware.dispatch(_Request(path="/health", method="GET"), ok_call_next))
    success = asyncio.run(
        middleware.dispatch(
            _Request(path="/api/v1/documents", method="GET", user_id="user-1"),
            ok_call_next,
        )
    )

    assert skipped.status_code == 201
    assert success.headers["X-Request-ID"]
    assert success.headers["X-Response-Time"].endswith("s")
    assert collector.counters
    assert tracked_actions == [("documents_view", "user-1")]


def test_request_monitoring_dispatch_returns_structured_500(monkeypatch):
    """Unhandled exceptions should be converted to a JSON 500 response."""
    collector = _Collector()
    monkeypatch.setattr(module, "get_metrics_collector", lambda: collector)
    tracked_errors = []
    monkeypatch.setattr(module, "track_error", lambda **kwargs: tracked_errors.append(kwargs))

    middleware = module.RequestMonitoringMiddleware(FastAPI())
    middleware.collector = collector

    async def failing_call_next(request):
        raise RuntimeError("boom")

    response = asyncio.run(middleware.dispatch(_Request(), failing_call_next))

    assert response.status_code == 500
    assert "X-Request-ID" in response.headers
    assert tracked_errors[0]["error_type"] == "RuntimeError"


def test_error_tracking_middleware_tracks_success_errors_and_exceptions(monkeypatch):
    """ErrorTrackingMiddleware should classify successful, error, and exception flows."""
    collector = _Collector()
    monkeypatch.setattr(module, "get_metrics_collector", lambda: collector)
    tracked_errors = []
    monkeypatch.setattr(module, "track_error", lambda **kwargs: tracked_errors.append(kwargs))

    middleware = module.ErrorTrackingMiddleware(FastAPI())

    async def ok_call_next(request):
        return Response(status_code=204)

    async def bad_call_next(request):
        return Response(status_code=404)

    async def exploding_call_next(request):
        raise ValueError("nope")

    asyncio.run(middleware.dispatch(_Request(method="GET"), ok_call_next))
    asyncio.run(middleware.dispatch(_Request(method="GET"), bad_call_next))
    with pytest.raises(ValueError, match="nope"):
        asyncio.run(middleware.dispatch(_Request(method="GET"), exploding_call_next))

    counter_names = [name for name, _value, _labels in collector.counters]
    assert "requests_successful_total" in counter_names
    assert "requests_client_error_total" in counter_names
    assert "requests_exception_total" in counter_names
    assert tracked_errors[0]["component"] == "unhandled_exception"


def test_health_check_middleware_handles_healthy_degraded_and_failures(monkeypatch):
    """Health checks should surface component status and 503s when degraded."""
    middleware = module.HealthCheckMiddleware(FastAPI())

    monkeypatch.setattr(middleware, "_check_database", lambda: _awaitable({"healthy": True}))
    monkeypatch.setattr(middleware, "_check_cache", lambda: _awaitable({"healthy": True}))
    monkeypatch.setattr(
        middleware, "_check_external_services", lambda: _awaitable({"healthy": True})
    )

    healthy = asyncio.run(
        middleware.dispatch(_Request(path="/health", method="GET"), _noop_call_next)
    )
    assert healthy.status_code == 200

    monkeypatch.setattr(middleware, "_check_cache", lambda: _awaitable({"healthy": False}))
    degraded = asyncio.run(
        middleware.dispatch(_Request(path="/health", method="GET"), _noop_call_next)
    )
    assert degraded.status_code == 503

    async def broken_db():
        raise RuntimeError("db down")

    monkeypatch.setattr(middleware, "_check_database", broken_db)
    failed = asyncio.run(
        middleware.dispatch(_Request(path="/health", method="GET"), _noop_call_next)
    )
    assert failed.status_code == 503

    passthrough = asyncio.run(
        middleware.dispatch(_Request(path="/api", method="GET"), _noop_call_next)
    )
    assert passthrough.status_code == 200


def test_health_check_component_helpers(monkeypatch):
    """Database, cache, and external service helpers should return structured status."""
    middleware = module.HealthCheckMiddleware(FastAPI())

    sqlalchemy_module = ModuleType("sqlalchemy")
    sqlalchemy_module.text = lambda sql: sql
    db_module = ModuleType("app.core.database")

    class _Db:
        def __init__(self):
            self.closed = False

        def execute(self, statement):
            assert statement == "SELECT 1"

        def close(self):
            self.closed = True

    db_instance = _Db()
    db_module.SessionLocal = lambda: db_instance

    cache_module = ModuleType("app.core.cache_middleware")

    async def cache_health_check():
        return {"status": "healthy"}

    cache_module.cache_health_check = cache_health_check

    with _patched_modules(
        {
            "sqlalchemy": sqlalchemy_module,
            "app.core.database": db_module,
            "app.core.cache_middleware": cache_module,
        }
    ):
        db_status = asyncio.run(middleware._check_database())
        cache_status = asyncio.run(middleware._check_cache())
        ext_status = asyncio.run(middleware._check_external_services())

    assert db_status == {"healthy": True, "service": "postgresql"}
    assert cache_status["healthy"] is True
    assert ext_status["healthy"] is True


def test_add_monitoring_middleware_registers_three_layers():
    """The helper should add health, error, and request monitoring middleware."""
    app = FastAPI()
    module.add_monitoring_middleware(app, {"include_request_body": True})

    middleware_classes = [m.cls for m in app.user_middleware]
    assert module.HealthCheckMiddleware in middleware_classes
    assert module.ErrorTrackingMiddleware in middleware_classes
    assert module.RequestMonitoringMiddleware in middleware_classes


async def _noop_call_next(request):
    return Response(status_code=200)


def _awaitable(value):
    async def _inner():
        return value

    return _inner()


@contextmanager
def _patched_modules(modules):
    import sys

    originals = {name: sys.modules.get(name) for name in modules}
    try:
        for name, mod in modules.items():
            sys.modules[name] = mod
        yield
    finally:
        for name, original in originals.items():
            if original is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = original
