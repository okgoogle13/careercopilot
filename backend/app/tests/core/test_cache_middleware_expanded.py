from __future__ import annotations

from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.core import cache_middleware as cm


def _request(path: str, method: str = "GET") -> Request:
    scope = {"type": "http", "method": method, "path": path, "headers": [], "query_string": b""}
    return Request(scope)


@pytest.mark.asyncio
async def test_cache_cleanup_dispatch_schedules_cleanup(monkeypatch: pytest.MonkeyPatch):
    mw = cm.CacheCleanupMiddleware(FastAPI(), cleanup_interval=1)
    mw.last_cleanup = datetime.now(timezone.utc) - timedelta(seconds=10)

    created = {"count": 0}

    def _create_task(_coro):
        created["count"] += 1
        _coro.close()
        return None

    monkeypatch.setattr(cm.asyncio, "create_task", _create_task)

    async def call_next(_request):
        return JSONResponse({"ok": True})

    response = await mw.dispatch(_request("/api/test"), call_next)
    assert response.status_code == 200
    assert created["count"] == 1


@pytest.mark.asyncio
async def test_cache_cleanup_background_cleanup_paths(monkeypatch: pytest.MonkeyPatch):
    mw = cm.CacheCleanupMiddleware(FastAPI(), cleanup_interval=3600)
    mw.cache = SimpleNamespace(cleanup_expired=AsyncMock(return_value=2))

    fake_db = MagicMock()
    monkeypatch.setattr(cm, "SessionLocal", lambda: fake_db)
    monkeypatch.setattr(
        cm,
        "SQLAlchemyCacheStore",
        lambda _db: SimpleNamespace(cleanup_expired=lambda: 3),
    )

    await mw._cleanup_cache()
    mw.cache.cleanup_expired.assert_awaited_once()
    fake_db.close.assert_called_once()


@pytest.mark.asyncio
async def test_cache_cleanup_handles_exceptions(monkeypatch: pytest.MonkeyPatch):
    mw = cm.CacheCleanupMiddleware(FastAPI(), cleanup_interval=3600)
    mw.cache = SimpleNamespace(cleanup_expired=AsyncMock(side_effect=RuntimeError("boom")))
    await mw._cleanup_cache()


@pytest.mark.asyncio
async def test_cache_monitoring_updates_stats_and_headers(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("ENV", "development")
    mw = cm.CacheMonitoringMiddleware(FastAPI(), include_headers=True)

    req = _request("/api/analysis/run")
    req.state.cache_hit = True

    async def call_next(_request):
        return JSONResponse({"ok": True})

    response = await mw.dispatch(req, call_next)
    assert response.headers["X-Cache-Stats"] == "hits:1,misses:0"
    assert mw.request_stats["total_requests"] == 1


@pytest.mark.asyncio
async def test_cache_monitoring_non_ai_path(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("ENV", "development")
    mw = cm.CacheMonitoringMiddleware(FastAPI(), include_headers=True)

    req = _request("/api/non-ai")
    req.state.cache_hit = True

    async def call_next(_request):
        return JSONResponse({"ok": True})

    await mw.dispatch(req, call_next)
    assert mw.request_stats["cache_hits"] == 0
    assert mw.request_stats["cache_misses"] == 0


@pytest.mark.asyncio
async def test_cache_invalidation_internal_helpers(monkeypatch: pytest.MonkeyPatch):
    mw = cm.CacheInvalidationMiddleware(FastAPI())

    req_state = _request("/api/v1/users/u-1")
    req_state.state.user_id = "state-user"
    assert await mw._extract_user_id(req_state) == "state-user"

    req_path = _request("/api/v1/users/u-2")
    assert await mw._extract_user_id(req_path) == "u-2"

    assert mw._normalize_path("/api/v1/x/?q=1") == "/api/v1/x/"


@pytest.mark.asyncio
async def test_cache_invalidation_handle_invalidation(monkeypatch: pytest.MonkeyPatch):
    mw = cm.CacheInvalidationMiddleware(FastAPI())
    mw.cache = SimpleNamespace(invalidate_user_cache=AsyncMock(return_value=2))

    fake_db = MagicMock()
    patterns = []

    class _SqlCache:
        def clear_pattern(self, pattern: str) -> int:
            patterns.append(pattern)
            return 1

    monkeypatch.setattr(cm, "SessionLocal", lambda: fake_db)
    monkeypatch.setattr(cm, "SQLAlchemyCacheStore", lambda _db: _SqlCache())

    req = _request("/api/v1/documents/123", method="POST")
    req.state.user_id = "u-1"
    await mw._handle_invalidation(req)

    assert mw.cache.invalidate_user_cache.await_count == 1
    assert len(patterns) == 3
    fake_db.close.assert_called_once()


@pytest.mark.asyncio
async def test_cache_invalidation_dispatch_calls_on_success(monkeypatch: pytest.MonkeyPatch):
    mw = cm.CacheInvalidationMiddleware(FastAPI())
    called = {"count": 0}

    async def _inv(_request):
        called["count"] += 1

    monkeypatch.setattr(mw, "_handle_invalidation", _inv)

    async def call_next(_request):
        return JSONResponse({"ok": True}, status_code=201)

    await mw.dispatch(_request("/api/v1/documents", method="POST"), call_next)
    assert called["count"] == 1

    async def call_next_fail(_request):
        return JSONResponse({"ok": False}, status_code=500)

    await mw.dispatch(_request("/api/v1/documents", method="POST"), call_next_fail)
    assert called["count"] == 1
