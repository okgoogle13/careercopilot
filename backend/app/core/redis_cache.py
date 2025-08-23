"""
Redis cache backend for AI operations

Production-ready Redis implementation with connection pooling,
serialization, compression, and error handling
"""

import gzip
import json
import logging
import os
import pickle
from datetime import datetime
from typing import Any, Dict, Optional, Union

try:
    import redis.asyncio as redis
    from redis.asyncio import Redis
    from redis.asyncio.cluster import RedisCluster

    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from .cache import CacheBackend, CacheEntry

logger = logging.getLogger(__name__)


class RedisCacheBackend(CacheBackend):
    """Redis-based cache backend for production use"""

    def __init__(
        self,
        redis_url: Optional[str] = None,
        compression: bool = True,
        serialization: str = "json",  # 'json' or 'pickle'
        key_prefix: str = "aicc:",  # ai cache careercopilot
        max_connections: int = 20,
    ):
        if not REDIS_AVAILABLE:
            raise ImportError(
                "Redis is required for RedisCacheBackend. Install with: pip install redis"
            )

        self.redis_url: str = redis_url or os.getenv("REDIS_URL") or "redis://localhost:6379"
        self.compression = compression
        self.serialization = serialization
        self.key_prefix = key_prefix

        # Connection pool configuration
        self.pool = redis.ConnectionPool.from_url(
            self.redis_url,
            max_connections=max_connections,
            retry_on_timeout=True,
            decode_responses=False,  # We handle serialization ourselves
        )
        self.redis: Union[Redis, RedisCluster] = Redis(connection_pool=self.pool)

    def _serialize_entry(self, entry: CacheEntry) -> bytes:
        """Serialize cache entry for storage"""
        if self.serialization == "pickle":
            data = pickle.dumps(entry.to_dict())
        else:  # json
            data = json.dumps(entry.to_dict(), default=str).encode("utf-8")

        if self.compression:
            data = gzip.compress(data)

        return data

    def _deserialize_entry(self, data: bytes) -> CacheEntry:
        """Deserialize cache entry from storage"""
        if self.compression:
            data = gzip.decompress(data)

        if self.serialization == "pickle":
            entry_dict = pickle.loads(data)
        else:  # json
            entry_dict = json.loads(data.decode("utf-8"))

        return CacheEntry.from_dict(entry_dict)

    def _make_key(self, key: str) -> str:
        """Add prefix to cache key"""
        return f"{self.key_prefix}{key}"

    async def get(self, key: str) -> Optional[CacheEntry]:
        """Retrieve cache entry from Redis"""
        try:
            redis_key = self._make_key(key)
            data = await self.redis.get(redis_key)

            if data is None:
                return None

            entry = self._deserialize_entry(data)

            # Check if expired (Redis TTL should handle this, but double-check)
            if entry.is_expired():
                await self.delete(key)
                return None

            return entry

        except Exception as e:
            logger.error(f"Redis cache GET error for key {key}: {e}")
            return None

    async def set(self, entry: CacheEntry) -> bool:
        """Store cache entry in Redis with TTL"""
        try:
            redis_key = self._make_key(entry.key)
            serialized_data = self._serialize_entry(entry)

            # Calculate TTL in seconds
            now = datetime.utcnow()
            ttl_seconds = int((entry.expires_at - now).total_seconds())

            if ttl_seconds <= 0:
                logger.warning(f"Entry already expired for key {entry.key}")
                return False

            # Set with expiration
            result = await self.redis.setex(redis_key, ttl_seconds, serialized_data)
            return result is True

        except Exception as e:
            logger.error(f"Redis cache SET error for key {entry.key}: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete cache entry from Redis"""
        try:
            redis_key = self._make_key(key)
            result = await self.redis.delete(redis_key)
            return result > 0
        except Exception as e:
            logger.error(f"Redis cache DELETE error for key {key}: {e}")
            return False

    async def clear_expired(self) -> int:
        """Redis handles TTL automatically, but we can scan for consistency"""
        try:
            # Redis automatically removes expired keys, so this is mainly for logging
            logger.info("Redis TTL handles expired key cleanup automatically")
            return 0
        except Exception as e:
            logger.error(f"Redis cache CLEAR_EXPIRED error: {e}")
            return 0

    async def clear_by_pattern(self, pattern: str) -> int:
        """Delete keys matching a pattern"""
        try:
            search_pattern = self._make_key(f"*{pattern}*")

            # Use scan for memory efficiency with large key sets
            cursor = 0
            deleted_count = 0

            while True:
                cursor, keys = await self.redis.scan(
                    cursor=cursor, match=search_pattern, count=100
                )

                if keys:
                    deleted = await self.redis.delete(*keys)
                    deleted_count += deleted

                if cursor == 0:
                    break

            logger.info(f"Deleted {deleted_count} keys matching pattern: {pattern}")
            return deleted_count

        except Exception as e:
            logger.error(
                f"Redis cache CLEAR_BY_PATTERN error for pattern {pattern}: {e}"
            )
            return 0

    async def get_info(self) -> Dict[str, Any]:
        """Get Redis cache information"""
        try:
            info = await self.redis.info()

            # Get key count for our prefix
            search_pattern = self._make_key("*")
            cursor = 0
            key_count = 0

            while True:
                cursor, keys = await self.redis.scan(
                    cursor=cursor, match=search_pattern, count=1000
                )
                key_count += len(keys)

                if cursor == 0:
                    break

            return {
                "backend": "redis",
                "redis_version": info.get("redis_version"),
                "used_memory_human": info.get("used_memory_human"),
                "connected_clients": info.get("connected_clients"),
                "total_commands_processed": info.get("total_commands_processed"),
                "cache_key_count": key_count,
                "compression_enabled": self.compression,
                "serialization_method": self.serialization,
            }

        except Exception as e:
            logger.error(f"Redis cache INFO error: {e}")
            return {"backend": "redis", "error": str(e)}

    async def close(self):
        """Close Redis connections"""
        try:
            await self.redis.close()
            await self.pool.disconnect()
        except Exception as e:
            logger.error(f"Error closing Redis connections: {e}")

    async def health_check(self) -> bool:
        """Check if Redis is accessible"""
        try:
            await self.redis.ping()
            return True
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            return False


class RedisClusterCacheBackend(RedisCacheBackend):
    """Redis Cluster backend for high availability"""

    def __init__(self, cluster_nodes: list, **kwargs):
        if not REDIS_AVAILABLE:
            raise ImportError("Redis is required for RedisClusterCacheBackend")

        try:
            from redis.asyncio.cluster import RedisCluster
        except ImportError:
            raise ImportError("redis-py-cluster is required for cluster support")

        self.compression = kwargs.get("compression", True)
        self.serialization = kwargs.get("serialization", "json")
        self.key_prefix = kwargs.get("key_prefix", "aicc:")

        self.redis: Union[Redis, RedisCluster] = RedisCluster(
            startup_nodes=cluster_nodes,
            decode_responses=False,
        )

    async def close(self):
        """Close Redis cluster connections"""
        try:
            await self.redis.close()
        except Exception as e:
            logger.error(f"Error closing Redis cluster connections: {e}")
