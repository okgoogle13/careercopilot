"""
Deprecated cache system - stub for legacy tests.

This module provides stub implementations of the old cache system
to maintain backward compatibility with existing tests.

TODO: Migrate tests to new cache system and remove this module.
"""

import hashlib
import json
import logging
from collections import OrderedDict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from pydantic import BaseModel

logger = logging.getLogger(__name__)


class CacheEntry(BaseModel):
    """Represents a single cache entry."""

    key: str
    value: Dict[str, Any]
    created_at: datetime
    expires_at: datetime
    operation_type: str
    input_hash: str

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class InMemoryCacheBackend:
    """
    In-memory cache backend with LRU eviction.

    This is a stub implementation for testing purposes.
    """

    def __init__(self, max_size: int = 1000):
        self.max_size = max_size
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()

    async def get(self, key: str) -> Optional[CacheEntry]:
        """Get cache entry by key."""
        entry = self._cache.get(key)

        if entry is None:
            return None

        # Check if expired
        if entry.expires_at < datetime.now(timezone.utc):
            await self.delete(key)
            return None

        # Move to end (most recently used)
        self._cache.move_to_end(key)
        return entry

    async def set(self, entry: CacheEntry) -> bool:
        """Set cache entry."""
        try:
            # Evict oldest entry if at capacity
            if len(self._cache) >= self.max_size and entry.key not in self._cache:
                self._cache.popitem(last=False)

            self._cache[entry.key] = entry
            self._cache.move_to_end(entry.key)
            return True
        except Exception as e:
            logger.error(f"Failed to set cache entry: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete cache entry by key."""
        if key in self._cache:
            del self._cache[key]
            return True
        return False

    async def clear_by_pattern(self, pattern: str) -> int:
        """Clear all cache entries matching pattern."""
        keys_to_delete = [k for k in self._cache.keys() if pattern in k]
        for key in keys_to_delete:
            await self.delete(key)
        return len(keys_to_delete)


class CacheConfig(BaseModel):
    """Configuration for a specific cache operation."""

    ttl_seconds: int = 3600
    max_entries: int = 1000


class AICache:
    """
    Main AI cache interface.

    This is a stub implementation for testing purposes.
    """

    # Default cache configurations for different operation types
    CACHE_CONFIGS = {
        "resume_analysis": CacheConfig(ttl_seconds=3600, max_entries=500),
        "job_analysis": CacheConfig(ttl_seconds=7200, max_entries=1000),
        "ats_scoring": CacheConfig(ttl_seconds=3600, max_entries=500),
        "cover_letter": CacheConfig(ttl_seconds=900, max_entries=200),
        "voice_profile": CacheConfig(ttl_seconds=86400, max_entries=100),
        "ksc_response": CacheConfig(ttl_seconds=3600, max_entries=500),
        "test_operation": CacheConfig(ttl_seconds=3600, max_entries=100),
    }

    def __init__(self, backend: InMemoryCacheBackend):
        self.backend = backend

    def _generate_cache_key(
        self, operation_type: str, user_id: str, input_data: Dict[str, Any]
    ) -> str:
        """Generate a consistent cache key."""
        # Create a stable hash of the input data
        input_str = json.dumps(input_data, sort_keys=True)
        input_hash = hashlib.sha256(input_str.encode()).hexdigest()[:16]
        return f"{operation_type}:{user_id}:{input_hash}"

    async def get(
        self, operation_type: str, user_id: str, input_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Get cached result."""
        try:
            key = self._generate_cache_key(operation_type, user_id, input_data)
            entry = await self.backend.get(key)
            return entry.value if entry else None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None

    async def set(
        self, operation_type: str, user_id: str, input_data: Dict[str, Any], result: Dict[str, Any]
    ) -> bool:
        """Set cache result."""
        try:
            config = self.CACHE_CONFIGS.get(
                operation_type, CacheConfig(ttl_seconds=3600, max_entries=1000)
            )

            key = self._generate_cache_key(operation_type, user_id, input_data)
            input_str = json.dumps(input_data, sort_keys=True)
            input_hash = hashlib.sha256(input_str.encode()).hexdigest()[:16]

            entry = CacheEntry(
                key=key,
                value=result,
                created_at=datetime.now(timezone.utc),
                expires_at=datetime.now(timezone.utc) + timedelta(seconds=config.ttl_seconds),
                operation_type=operation_type,
                input_hash=input_hash,
            )

            return await self.backend.set(entry)
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False

    async def invalidate_user_cache(
        self, user_id: str, operation_types: Optional[list] = None
    ) -> int:
        """Invalidate cache entries for a specific user."""
        if operation_types is None:
            # Invalidate all operations for user
            pattern = f":{user_id}:"
        else:
            # Invalidate specific operations
            total_cleared = 0
            for op_type in operation_types:
                pattern = f"{op_type}:{user_id}:"
                cleared = await self.backend.clear_by_pattern(pattern)
                total_cleared += cleared
            return total_cleared

        return await self.backend.clear_by_pattern(pattern)

    async def clear_ai_operations(self, operation_type: str) -> int:
        """Clear all cache entries for a specific operation type."""
        return await self.backend.clear_by_pattern(f"{operation_type}:")
