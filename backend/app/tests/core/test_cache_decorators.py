from __future__ import annotations

from datetime import timedelta

import pytest

from app.core import cache_decorators


class _FakeCache:
    def __init__(self, cached=None):
        self.cached = cached
        self.get_calls = []
        self.set_calls = []
        self.delete_calls = []
        self.CACHE_CONFIGS = {"default": {"ttl": 120}}

    async def get(self, operation_type, user_id, cache_input):
        self.get_calls.append((operation_type, user_id, cache_input))
        return self.cached

    async def set(self, operation_type, user_id, cache_input, value, ttl=None):
        self.set_calls.append((operation_type, user_id, cache_input, value, ttl))
        return True

    async def delete(self, operation_type, user_id):
        self.delete_calls.append((operation_type, user_id))
        return True

    def _generate_key(self, operation_type, user_id, input_data):
        return f"{operation_type}:{user_id}:{input_data}"


@pytest.mark.asyncio
async def test_cached_ai_operation_returns_cached_value(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_cache = _FakeCache(cached={"answer": 42})
    monkeypatch.setattr(cache_decorators, "get_ai_cache", lambda: fake_cache)

    @cache_decorators.cached_ai_operation("resume_analysis", user_id_param="user_id")
    async def _fn(user_id: str, payload: str):
        return {"answer": 1}

    out = await _fn(user_id="u1", payload="p")
    assert out == {"answer": 42}
    assert len(fake_cache.get_calls) == 1
    assert len(fake_cache.set_calls) == 0


@pytest.mark.asyncio
async def test_cached_ai_operation_executes_and_sets_cache(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_cache = _FakeCache(cached=None)
    monkeypatch.setattr(cache_decorators, "get_ai_cache", lambda: fake_cache)

    @cache_decorators.cached_ai_operation("resume_analysis", user_id_param="uid")
    async def _fn(uid: str, payload: str):
        return {"value": payload}

    out = await _fn(uid="u2", payload="abc")
    assert out == {"value": "abc"}
    assert len(fake_cache.set_calls) == 1
    assert isinstance(fake_cache.set_calls[0][4], timedelta)


@pytest.mark.asyncio
async def test_cached_ai_operation_fallback_on_cache_error(monkeypatch: pytest.MonkeyPatch) -> None:
    class _BrokenCache(_FakeCache):
        async def get(self, *_args, **_kwargs):
            raise RuntimeError("cache down")

    fake_cache = _BrokenCache()
    monkeypatch.setattr(cache_decorators, "get_ai_cache", lambda: fake_cache)

    @cache_decorators.cached_ai_operation("resume_analysis")
    async def _fn(user_id: str):
        return {"ok": True}

    out = await _fn(user_id="u3")
    assert out == {"ok": True}


def test_prepare_cache_input_inclusion_and_exclusion() -> None:
    selected = cache_decorators._prepare_cache_input(
        args=(),
        kwargs={"user_id": "u1", "payload": "x", "skip": "y"},
        cache_key_params=["payload"],
        exclude_params=None,
    )
    assert selected == {"payload": "x"}

    excluded = cache_decorators._prepare_cache_input(
        args=(1, 2),
        kwargs={"user_id": "u1", "payload": "x", "skip": "y"},
        cache_key_params=None,
        exclude_params=["skip"],
    )
    assert excluded["payload"] == "x"
    assert "skip" not in excluded
    assert excluded["_args"] == (1, 2)


@pytest.mark.asyncio
async def test_invalidate_user_ai_cache_deletes_on_success(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    fake_cache = _FakeCache()
    monkeypatch.setattr(cache_decorators, "get_ai_cache", lambda: fake_cache)

    @cache_decorators.invalidate_user_ai_cache("u9", operation_types=["resume", "cover"])
    async def _fn():
        return "ok"

    out = await _fn()
    assert out == "ok"
    assert fake_cache.delete_calls == [("resume", "u9"), ("cover", "u9")]


@pytest.mark.asyncio
async def test_invalidate_user_ai_cache_logs_and_reraises_on_error() -> None:
    @cache_decorators.invalidate_user_ai_cache("u9", operation_types=["resume"])
    async def _fn():
        raise RuntimeError("boom")

    with pytest.raises(RuntimeError, match="boom"):
        await _fn()


@pytest.mark.asyncio
async def test_cache_context_reads_sets_and_key(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_cache = _FakeCache(cached={"cached": True})
    monkeypatch.setattr(cache_decorators, "get_ai_cache", lambda: fake_cache)

    ctx = cache_decorators.CacheContext("resume_analysis", "u1", {"a": 1})
    async with ctx as active:
        assert active.cached is True
        assert await active.get_result() == {"cached": True}
        ok = await active.set_result({"new": True}, ttl=30)
        assert ok is True

    assert fake_cache.set_calls
    assert ctx.cache_key.startswith("resume_analysis:u1:")


@pytest.mark.asyncio
async def test_cache_context_cache_key_fallback_without_generate_key(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class _NoKeyCache:
        async def get(self, *_args, **_kwargs):
            return None

        async def set(self, *_args, **_kwargs):
            return True

    fake_cache = _NoKeyCache()
    monkeypatch.setattr(cache_decorators, "get_ai_cache", lambda: fake_cache)
    ctx = cache_decorators.CacheContext("resume", "u2", {"x": 1})
    assert ctx.cache_key == "resume:u2"


def test_cache_context_requires_operation_and_user() -> None:
    with pytest.raises(ValueError, match="required"):
        cache_decorators.CacheContext("", "u1", {})
    with pytest.raises(ValueError, match="required"):
        cache_decorators.CacheContext("resume", "", {})
