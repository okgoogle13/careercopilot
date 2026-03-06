from __future__ import annotations

from datetime import timedelta

import pytest

from app.core import personal_cache


class _FakeResult:
    def __init__(self, rowcount: int):
        self.rowcount = rowcount


class _FakeDB:
    def __init__(self):
        self.commits = 0
        self.executed = []

    def execute(self, query, params=None):
        self.executed.append((str(query), params))
        if params and "pattern" in params and "research" in params["pattern"]:
            return _FakeResult(3)
        return _FakeResult(2)

    def commit(self):
        self.commits += 1


class _FakeSessionCtx:
    def __init__(self, db: _FakeDB):
        self.db = db

    def __enter__(self):
        return self.db

    def __exit__(self, exc_type, exc, tb):
        return False


class _FakeStore:
    def __init__(self):
        self.data = {}

    def get(self, key):
        return self.data.get(key)

    def set(self, key, value, operation_type, ttl_seconds):
        self.data[key] = value
        return True

    def delete(self, key):
        self.data.pop(key, None)
        return True

    def cleanup_expired(self):
        return 7


@pytest.fixture
def cache_with_fakes(monkeypatch: pytest.MonkeyPatch):
    db = _FakeDB()
    store = _FakeStore()
    monkeypatch.setattr(personal_cache, "get_db_session", lambda: _FakeSessionCtx(db))

    cache = personal_cache.PersonalCache()
    monkeypatch.setattr(cache, "_get_store", lambda _db: store)
    return cache, store, db


@pytest.mark.asyncio
async def test_personal_cache_generate_key_and_get_set_signatures(cache_with_fakes) -> None:
    cache, store, _db = cache_with_fakes

    k1 = cache._generate_key("resume", "u1", {"a": 1})
    k2 = cache._generate_key("resume", "u1", {"a": 1})
    assert k1 == k2
    assert k1.startswith("resume:u1:")

    ok = await cache.set("resume", "u1", {"a": 1}, {"value": 123}, timedelta(seconds=30))
    assert ok is True
    out = await cache.get("resume", "u1", {"a": 1})
    assert out == {"value": 123}

    ok2 = await cache.set("my-key", {"x": 1}, 20, "profiles")
    assert ok2 is True
    out2 = await cache.get("my-key", "profiles")
    assert out2 == {"x": 1}

    ok3 = await cache.delete("my-key", "profiles")
    assert ok3 is True
    assert store.get("profiles:my-key") is None


@pytest.mark.asyncio
async def test_personal_cache_invalidation_and_cleanup(cache_with_fakes) -> None:
    cache, _store, db = cache_with_fakes

    removed = await cache.clear_expired()
    assert removed == 7
    removed_alias = await cache.cleanup_expired()
    assert removed_alias == 7

    cleared = await cache.clear_all()
    assert cleared == 2
    assert db.commits >= 1

    count_by_categories = await cache.invalidate_user_cache(
        "u1", categories=["research", "profiles"]
    )
    assert count_by_categories == 5

    count_all = await cache.invalidate_user_cache("u1")
    assert count_all == 2


@pytest.mark.asyncio
async def test_personal_cache_convenience_methods(cache_with_fakes) -> None:
    cache, _store, _db = cache_with_fakes

    assert await cache.cache_user_profile("u1", {"name": "A"}) is True
    assert await cache.get_user_profile("u1") == {"name": "A"}

    assert await cache.cache_company_research("Acme", "https://acme/jobs/1", {"score": 1}) is True
    research = await cache.get_company_research("Acme", "https://acme/jobs/1")
    assert research == {"score": 1}

    assert await cache.cache_ai_response("hash123", {"answer": "ok"}) is True
    assert await cache.get_ai_response("hash123") == {"answer": "ok"}

    assert await cache.cache_job_opportunity("job1", {"title": "Dev"}) is True
    assert await cache.get_job_opportunity("job1") == {"title": "Dev"}

    assert (
        await cache.cache_ai_operation("resume", {"text": "resume"}, {"score": 90}, user_id="u1")
        is True
    )
    analysis = await cache.get_ai_operation("resume", {"text": "resume"}, user_id="u1")
    assert analysis == {"score": 90}

    stats = await cache.get_cache_stats()
    assert stats["backend"] == "postgresql"


@pytest.mark.asyncio
async def test_personal_cache_handles_store_and_session_errors(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    cache = personal_cache.PersonalCache()

    class _BrokenSession:
        def __enter__(self):
            raise RuntimeError("db down")

        def __exit__(self, exc_type, exc, tb):
            return False

    monkeypatch.setattr(personal_cache, "get_db_session", lambda: _BrokenSession())

    assert await cache.get("x", "profiles") is None
    assert await cache.set("x", {"v": 1}, 10, "profiles") is False
    assert await cache.delete("x", "profiles") is False
    assert await cache.clear_all() == 0
    assert await cache.invalidate_user_cache("u1") == 0
    assert await cache.health_check() is False
