"""
AI Operations Caching Layer

Provides intelligent caching for AI operations to:
- Reduce API costs by avoiding duplicate requests
- Improve response times for frequently requested analyses
- Handle cache invalidation and TTL management
- Support different cache strategies per operation type
"""

import hashlib
import json
import logging
from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class CacheEntry:
    """Represents a cached AI operation result"""

    key: str
    value: Any
    created_at: datetime
    expires_at: datetime
    operation_type: str
    input_hash: str
    metadata: Dict[str, Any] = None

    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at

    def to_dict(self) -> Dict[str, Any]:
        return {
            **asdict(self),
            "created_at": self.created_at.isoformat(),
            "expires_at": self.expires_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "CacheEntry":
        data["created_at"] = datetime.fromisoformat(data["created_at"])
        data["expires_at"] = datetime.fromisoformat(data["expires_at"])
        return cls(**data)


class CacheBackend(ABC):
    """Abstract base class for cache backends"""

    @abstractmethod
    async def get(self, key: str) -> Optional[CacheEntry]:
        pass

    @abstractmethod
    async def set(self, entry: CacheEntry) -> bool:
        pass

    @abstractmethod
    async def delete(self, key: str) -> bool:
        pass

    @abstractmethod
    async def clear_expired(self) -> int:
        pass

    @abstractmethod
    async def clear_by_pattern(self, pattern: str) -> int:
        pass


class InMemoryCacheBackend(CacheBackend):
    """In-memory cache backend for development/testing"""

    def __init__(self, max_size: int = 1000):
        self.cache: Dict[str, CacheEntry] = {}
        self.max_size = max_size
        self.access_order: List[str] = []  # LRU tracking

    async def get(self, key: str) -> Optional[CacheEntry]:
        entry = self.cache.get(key)
        if entry and entry.is_expired():
            await self.delete(key)
            return None

        if entry:
            # Update LRU order
            if key in self.access_order:
                self.access_order.remove(key)
            self.access_order.append(key)

        return entry

    async def set(self, entry: CacheEntry) -> bool:
        # Evict oldest entries if at capacity
        while len(self.cache) >= self.max_size:
            oldest_key = self.access_order.pop(0)
            del self.cache[oldest_key]

        self.cache[entry.key] = entry
        if entry.key in self.access_order:
            self.access_order.remove(entry.key)
        self.access_order.append(entry.key)

        return True

    async def delete(self, key: str) -> bool:
        if key in self.cache:
            del self.cache[key]
            if key in self.access_order:
                self.access_order.remove(key)
            return True
        return False

    async def clear_expired(self) -> int:
        expired_keys = [key for key, entry in self.cache.items() if entry.is_expired()]

        for key in expired_keys:
            await self.delete(key)

        return len(expired_keys)

    async def clear_by_pattern(self, pattern: str) -> int:
        matching_keys = [key for key in self.cache.keys() if pattern in key]

        for key in matching_keys:
            await self.delete(key)

        return len(matching_keys)


@dataclass
class CacheConfig:
    """Configuration for different AI operation types"""

    ttl_seconds: int
    max_entries: int = 100
    cache_null_results: bool = False
    invalidate_on_user_update: bool = True
    compression_enabled: bool = True


class AICache:
    """Main AI operations cache manager"""

    # Cache configurations for different operation types
    CACHE_CONFIGS = {
        "resume_analysis": CacheConfig(
            ttl_seconds=3600,  # 1 hour - resume content rarely changes
            max_entries=500,
            cache_null_results=False,
            invalidate_on_user_update=True,
        ),
        "job_analysis": CacheConfig(
            ttl_seconds=7200,  # 2 hours - job descriptions are stable
            max_entries=200,
            cache_null_results=False,
            invalidate_on_user_update=False,
        ),
        "ats_scoring": CacheConfig(
            ttl_seconds=1800,  # 30 minutes - scoring may change with updates
            max_entries=300,
            cache_null_results=False,
            invalidate_on_user_update=True,
        ),
        "cover_letter": CacheConfig(
            ttl_seconds=900,  # 15 minutes - personalized content
            max_entries=100,
            cache_null_results=False,
            invalidate_on_user_update=True,
        ),
        "voice_profile": CacheConfig(
            ttl_seconds=86400,  # 24 hours - user voice profile is stable
            max_entries=50,
            cache_null_results=False,
            invalidate_on_user_update=True,
        ),
        "ksc_response": CacheConfig(
            ttl_seconds=3600,  # 1 hour - behavioral responses
            max_entries=200,
            cache_null_results=False,
            invalidate_on_user_update=True,
        ),
    }

    def __init__(self, backend: CacheBackend):
        self.backend = backend

    def _generate_cache_key(
        self, operation_type: str, user_id: str, input_data: Any, **kwargs
    ) -> str:
        """Generate a deterministic cache key for the operation"""
        # Create input hash for consistent key generation
        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.sha256(input_str.encode()).hexdigest()[:16]

        # Include relevant kwargs in key
        kwargs_str = json.dumps(kwargs, sort_keys=True, default=str)
        kwargs_hash = hashlib.sha256(kwargs_str.encode()).hexdigest()[:8]

        return f"ai:{operation_type}:{user_id}:{input_hash}:{kwargs_hash}"

    def _create_cache_entry(
        self, key: str, operation_type: str, input_data: Any, result: Any, **kwargs
    ) -> CacheEntry:
        """Create a cache entry with appropriate TTL"""
        config = self.CACHE_CONFIGS.get(
            operation_type, CacheConfig(ttl_seconds=1800)
        )  # Default 30 min

        created_at = datetime.utcnow()
        expires_at = created_at + timedelta(seconds=config.ttl_seconds)

        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.sha256(input_str.encode()).hexdigest()

        return CacheEntry(
            key=key,
            value=result,
            created_at=created_at,
            expires_at=expires_at,
            operation_type=operation_type,
            input_hash=input_hash,
            metadata={
                "kwargs": kwargs,
                "input_size": len(input_str),
                "result_type": type(result).__name__,
            },
        )

    async def get(
        self, operation_type: str, user_id: str, input_data: Any, **kwargs
    ) -> Optional[Any]:
        """Retrieve cached result for an AI operation"""
        try:
            cache_key = self._generate_cache_key(
                operation_type, user_id, input_data, **kwargs
            )
            entry = await self.backend.get(cache_key)

            if entry:
                logger.info(f"Cache HIT for {operation_type} (user: {user_id})")
                return entry.value

            logger.info(f"Cache MISS for {operation_type} (user: {user_id})")
            return None

        except Exception as e:
            logger.error(f"Cache GET error for {operation_type}: {e}")
            return None

    async def set(
        self, operation_type: str, user_id: str, input_data: Any, result: Any, **kwargs
    ) -> bool:
        """Cache the result of an AI operation"""
        try:
            config = self.CACHE_CONFIGS.get(operation_type)
            if not config:
                logger.warning(f"No cache config for operation: {operation_type}")
                return False

            # Don't cache null results unless configured to do so
            if result is None and not config.cache_null_results:
                return False

            cache_key = self._generate_cache_key(
                operation_type, user_id, input_data, **kwargs
            )
            entry = self._create_cache_entry(
                cache_key, operation_type, input_data, result, **kwargs
            )

            success = await self.backend.set(entry)
            if success:
                logger.info(
                    f"Cache SET for {operation_type} (user: {user_id}, TTL: {config.ttl_seconds}s)"
                )

            return success

        except Exception as e:
            logger.error(f"Cache SET error for {operation_type}: {e}")
            return False

    async def invalidate_user_cache(
        self, user_id: str, operation_types: Optional[List[str]] = None
    ) -> int:
        """Invalidate all cache entries for a user"""
        try:
            if operation_types is None:
                # Invalidate all operations that are configured to invalidate on user update
                operation_types = [
                    op_type
                    for op_type, config in self.CACHE_CONFIGS.items()
                    if config.invalidate_on_user_update
                ]

            total_cleared = 0
            for op_type in operation_types:
                pattern = f"ai:{op_type}:{user_id}:"
                cleared = await self.backend.clear_by_pattern(pattern)
                total_cleared += cleared

            logger.info(f"Invalidated {total_cleared} cache entries for user {user_id}")
            return total_cleared

        except Exception as e:
            logger.error(f"Cache invalidation error for user {user_id}: {e}")
            return 0

    async def cleanup_expired(self) -> int:
        """Remove expired cache entries"""
        try:
            cleared = await self.backend.clear_expired()
            if cleared > 0:
                logger.info(f"Cleared {cleared} expired cache entries")
            return cleared
        except Exception as e:
            logger.error(f"Cache cleanup error: {e}")
            return 0

    async def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        # This would need backend-specific implementation
        return {
            "backend_type": type(self.backend).__name__,
            "configurations": {
                op_type: asdict(config)
                for op_type, config in self.CACHE_CONFIGS.items()
            },
        }


# Global cache instance
_cache_instance: Optional[AICache] = None


def get_ai_cache() -> AICache:
    """Get the global AI cache instance"""
    global _cache_instance
    if _cache_instance is None:
        # Default to in-memory cache for now
        backend = InMemoryCacheBackend(max_size=2000)
        _cache_instance = AICache(backend)
    return _cache_instance


def setup_cache(backend: CacheBackend) -> AICache:
    """Setup the global AI cache with a specific backend"""
    global _cache_instance
    _cache_instance = AICache(backend)
    return _cache_instance
