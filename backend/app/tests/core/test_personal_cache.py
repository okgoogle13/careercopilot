from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest

from app.core.personal_cache import PersonalCache, get_personal_cache


@pytest.fixture
def mock_db():
    return MagicMock()


@pytest.fixture
def mock_store():
    store = MagicMock()
    return store


@pytest.mark.asyncio
async def test_personal_cache_get(mock_db, mock_store):
    cache = PersonalCache()
    mock_store.get.return_value = "cached_value"

    with (
        patch(
            "app.core.personal_cache.get_db_session",
            return_value=MagicMock(__enter__=lambda s: mock_db),
        ),
        patch.object(PersonalCache, "_get_store", return_value=mock_store),
    ):

        # Test basic GET
        result = await cache.get("key", category="test")
        assert result == "cached_value"
        mock_store.get.assert_called_with("test:key")


@pytest.mark.asyncio
async def test_personal_cache_set(mock_db, mock_store):
    cache = PersonalCache()
    mock_store.set.return_value = True

    with (
        patch(
            "app.core.personal_cache.get_db_session",
            return_value=MagicMock(__enter__=lambda s: mock_db),
        ),
        patch.object(PersonalCache, "_get_store", return_value=mock_store),
    ):

        # Test basic SET
        result = await cache.set("key", "value", ttl=timedelta(minutes=5), category="test")
        assert result is True
        mock_store.set.assert_called()


@pytest.mark.asyncio
async def test_personal_cache_generate_key(mock_db):
    cache = PersonalCache()
    key = cache._generate_key("op", "user123", {"data": 123})
    assert "op:user123:" in key
    assert len(key.split(":")[-1]) == 16


@pytest.mark.asyncio
async def test_personal_cache_delete(mock_db, mock_store):
    cache = PersonalCache()
    mock_store.delete.return_value = True

    with (
        patch(
            "app.core.personal_cache.get_db_session",
            return_value=MagicMock(__enter__=lambda s: mock_db),
        ),
        patch.object(PersonalCache, "_get_store", return_value=mock_store),
    ):

        result = await cache.delete("key", category="test")
        assert result is True
        mock_store.delete.assert_called_with("test:key")


@pytest.mark.asyncio
async def test_personal_cache_complex_signatures(mock_db, mock_store):
    cache = PersonalCache()
    mock_store.get.return_value = "complex_value"

    with (
        patch(
            "app.core.personal_cache.get_db_session",
            return_value=MagicMock(__enter__=lambda s: mock_db),
        ),
        patch.object(PersonalCache, "_get_store", return_value=mock_store),
    ):

        # Style: get(operation_type, user_id, input_data)
        result = await cache.get("op", "user1", {"inp": 1})
        assert result == "complex_value"
        # The key should contain the hash
        call_key = mock_store.get.call_args[0][0]
        assert call_key.startswith("op:user1:")


@pytest.mark.asyncio
async def test_global_instance():
    instance1 = get_personal_cache()
    instance2 = get_personal_cache()
    assert instance1 is instance2
