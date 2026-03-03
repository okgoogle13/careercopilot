import json
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

import pytest
from app.services.cache_store import SQLAlchemyCacheStore
from app.models.database import Cache

@pytest.fixture
def mock_cache_db():
    return MagicMock()

@pytest.fixture
def cache_store(mock_cache_db):
    return SQLAlchemyCacheStore(db=mock_cache_db)

def test_cache_store_get_hit(cache_store, mock_cache_db):
    mock_entry = MagicMock()
    mock_entry.key = "test_key"
    mock_entry.value = json.dumps({"hello": "world"})
    mock_entry.expires_at = (datetime.now(timezone.utc) + timedelta(hours=1)).replace(tzinfo=None)
    mock_entry.hit_count = 0
    
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = mock_entry
    
    result = cache_store.get("test_key")
    
    assert result == {"hello": "world"}
    assert mock_entry.hit_count == 1
    mock_cache_db.commit.assert_called_once()
    
def test_cache_store_get_miss(cache_store, mock_cache_db):
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = None
    
    assert cache_store.get("missing_key") is None

def test_cache_store_get_expired(cache_store, mock_cache_db):
    mock_entry = MagicMock()
    mock_entry.key = "test_key"
    mock_entry.value = "expiredval"
    mock_entry.expires_at = (datetime.now(timezone.utc) - timedelta(hours=1)).replace(tzinfo=None)
    
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = mock_entry
    
    assert cache_store.get("test_key") is None
    mock_cache_db.delete.assert_called_once_with(mock_entry)
    mock_cache_db.commit.assert_called_once()

def test_cache_store_set_new(cache_store, mock_cache_db):
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = None  # Key doesnt exist
    
    result = cache_store.set("new_key", {"data": 123}, ttl_seconds=60)
    
    assert result is True
    mock_cache_db.add.assert_called_once()
    mock_cache_db.commit.assert_called_once()

def test_cache_store_set_existing(cache_store, mock_cache_db):
    mock_entry = MagicMock()
    mock_entry.key = "exist_key"
    mock_entry.value = "old"
    
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = mock_entry
    
    result = cache_store.set("exist_key", "new_val")
    
    assert result is True
    assert mock_entry.value == "new_val"
    mock_cache_db.commit.assert_called_once()

def test_cache_store_delete(cache_store, mock_cache_db):
    mock_entry = MagicMock()
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = mock_entry
    
    result = cache_store.delete("key")
    
    assert result is True
    mock_cache_db.delete.assert_called_once_with(mock_entry)

def test_cache_store_clear_pattern(cache_store, mock_cache_db):
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.delete.return_value = 5  # 5 rows deleted
    
    result = cache_store.clear_pattern("test_")
    
    assert result == 5
    mock_cache_db.commit.assert_called_once()

def test_cache_store_cleanup_expired(cache_store, mock_cache_db):
    mock_query = MagicMock()
    mock_cache_db.query.return_value = mock_query
    mock_filter = MagicMock()
    mock_query.filter.return_value = mock_filter
    mock_filter.delete.return_value = 2  # 2 rows expired
    
    result = cache_store.cleanup_expired()
    
    assert result == 2
    mock_cache_db.commit.assert_called_once()

