from __future__ import annotations

from types import SimpleNamespace

from app.core import dependencies


def test_get_current_user_passthrough() -> None:
    user = SimpleNamespace(id="u1")
    assert dependencies.get_current_user(user) is user


def test_get_current_user_optional_passthrough() -> None:
    user = SimpleNamespace(id="u2")
    assert dependencies.get_current_user_optional(user) is user
    assert dependencies.get_current_user_optional(None) is None


def test_get_current_user_with_state_sets_request_uid() -> None:
    request = SimpleNamespace(state=SimpleNamespace())
    user = SimpleNamespace(id="user-123")
    out = dependencies.get_current_user_with_state(request, user)
    assert out is user
    assert request.state.user_uid == "user-123"


def test_get_cache_returns_sqlalchemy_store(monkeypatch) -> None:
    fake_db = object()
    sentinel_store = object()
    monkeypatch.setattr(dependencies, "SQLAlchemyCacheStore", lambda db: (sentinel_store, db))
    out = dependencies.get_cache(fake_db)
    assert out == (sentinel_store, fake_db)
