"""
Firestore-backed cache implementation using Firebase Cloud Firestore.

This module provides a drop-in replacement for Redis-based caching,
using a Firestore collection (redis_cache) to store cached values
with automatic TTL-based expiration.
"""

import hashlib
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, cast

try:
    from firebase_admin import firestore

    FIRESTORE_AVAILABLE = True
except ImportError:
    FIRESTORE_AVAILABLE = False

logger = logging.getLogger(__name__)

# Collection name for caching
CACHE_COLLECTION = "redis_cache"


class FirestoreCache:
    """Firestore-based cache with TTL support and automatic cleanup."""

    def __init__(self, collection_name: str = CACHE_COLLECTION):
        """
        Initialize Firestore cache client.

        Args:
            collection_name: Name of the Firestore collection for cache (default: redis_cache)
        """
        self.collection_name = collection_name
        self.db = None
        self.is_available = False

        if FIRESTORE_AVAILABLE:
            try:
                self.db = firestore.client()
                # Test connection by accessing the collection
                self.db.collection(self.collection_name).limit(1).stream()
                self.is_available = True
                logger.info(
                    f"Firestore cache initialized successfully using collection: {self.collection_name}"
                )
            except Exception as e:
                logger.warning(
                    f"Firestore cache initialization failed: {e}",
                    exc_info=True,
                )
                self.is_available = False
        else:
            logger.warning("Firebase Admin SDK not available - Firestore cache disabled")

    def _generate_cache_key(self, key: str) -> str:
        """
        Generate a safe Firestore document ID from a cache key.

        Args:
            key: Original cache key

        Returns:
            SHA256 hash (shortened to 32 chars for Firestore document IDs)
        """
        key_hash = hashlib.sha256(key.encode()).hexdigest()[:32]
        return f"cache_{key_hash}"

    def get(self, key: str) -> Optional[Any]:
        """
        Retrieve a cached value.

        Args:
            key: Cache key

        Returns:
            Cached value if found and not expired, None otherwise
        """
        if not self.is_available or not self.db:
            logger.debug(f"Firestore cache unavailable - cache MISS for {key}")
            return None

        try:
            doc_id = self._generate_cache_key(key)
            doc = self.db.collection(self.collection_name).document(doc_id).get()

            if not doc.exists:
                logger.debug(f"Cache MISS: {key} (document not found)")
                return None

            data = doc.to_dict()

            # Check TTL
            expires_at = data.get("expires_at")
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)

            now = datetime.now(timezone.utc)
            if expires_at and now > expires_at:
                logger.debug(f"Cache EXPIRED: {key}")
                # Delete expired document asynchronously in background
                try:
                    self.db.collection(self.collection_name).document(doc_id).delete()
                except Exception as e:
                    logger.warning(f"Failed to delete expired cache entry: {e}")
                return None

            logger.debug(f"Cache HIT: {key}")
            return data.get("value")

        except Exception as e:
            logger.error(f"Cache GET error for {key}: {e}", exc_info=True)
            return None

    def set(self, key: str, value: Any, ttl_seconds: int = 3600) -> bool:
        """
        Store a value in the cache.

        Args:
            key: Cache key
            value: Value to cache (will be JSON serialized)
            ttl_seconds: Time to live in seconds (default: 3600 = 1 hour)

        Returns:
            True if successful, False otherwise
        """
        if not self.is_available or not self.db:
            logger.debug(f"Firestore cache unavailable - skipping SET for {key}")
            return False

        try:
            doc_id = self._generate_cache_key(key)
            expires_at = datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)

            cache_data = {
                "key": key,
                "value": value,
                "created_at": datetime.now(timezone.utc),
                "expires_at": expires_at,
                "ttl_seconds": ttl_seconds,
            }

            self.db.collection(self.collection_name).document(doc_id).set(cache_data)
            logger.debug(f"Response cached: {key} (ttl: {ttl_seconds}s)")
            return True

        except Exception as e:
            logger.error(f"Cache SET error for {key}: {e}", exc_info=True)
            return False

    def delete(self, key: str) -> bool:
        """
        Delete a cache entry.

        Args:
            key: Cache key

        Returns:
            True if successful, False otherwise
        """
        if not self.is_available or not self.db:
            logger.debug(f"Firestore cache unavailable - skipping DELETE for {key}")
            return False

        try:
            doc_id = self._generate_cache_key(key)
            self.db.collection(self.collection_name).document(doc_id).delete()
            logger.debug(f"Cache entry deleted: {key}")
            return True

        except Exception as e:
            logger.error(f"Cache DELETE error for {key}: {e}", exc_info=True)
            return False

    def clear_pattern(self, pattern: str = "") -> int:
        """
        Delete all cache entries matching a pattern.

        Args:
            pattern: Key prefix pattern (e.g., "llm:" deletes all llm:* keys)

        Returns:
            Number of entries deleted
        """
        if not self.is_available or not self.db:
            logger.warning("Firestore cache unavailable - cannot clear pattern")
            return 0

        try:
            deleted_count = 0

            # Query documents by key prefix
            query = self.db.collection(self.collection_name)
            if pattern:
                # Note: This is an approximate pattern match by scanning all docs
                # For production, consider using Firestore's startAt/endAt for prefix
                docs = query.stream()
                batch = self.db.batch()

                for doc in docs:
                    doc_data = doc.to_dict()
                    if doc_data.get("key", "").startswith(pattern):
                        batch.delete(doc.reference)
                        deleted_count += 1

                batch.commit()
            else:
                # Delete all entries
                docs = query.stream()
                batch = self.db.batch()
                for doc in docs:
                    batch.delete(doc.reference)
                    deleted_count += 1
                batch.commit()

            logger.info(f"Cache cleared: {deleted_count} entries (pattern: {pattern})")
            return deleted_count

        except Exception as e:
            logger.error(f"Cache clear error for pattern '{pattern}': {e}", exc_info=True)
            return 0

    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics.

        Returns:
            Dictionary with cache statistics
        """
        if not self.is_available or not self.db:
            return {
                "status": "unavailable",
                "total_entries": 0,
                "expired_entries": 0,
            }

        try:
            stats = {
                "status": "connected",
                "collection": self.collection_name,
                "total_entries": 0,
                "expired_entries": 0,
            }

            now = datetime.now(timezone.utc)
            docs = self.db.collection(self.collection_name).stream()

            for doc in docs:
                total_entries = cast(int, stats.get("total_entries", 0))
                stats["total_entries"] = total_entries + 1
                data = doc.to_dict()
                expires_at = data.get("expires_at")
                if isinstance(expires_at, str):
                    expires_at = datetime.fromisoformat(expires_at)

                if expires_at and now > expires_at:
                    expired_entries = cast(int, stats.get("expired_entries", 0))
                    stats["expired_entries"] = expired_entries + 1

            return stats

        except Exception as e:
            logger.error(f"Cache stats error: {e}", exc_info=True)
            return {
                "status": "error",
                "error": str(e),
            }

    def cleanup_expired(self) -> int:
        """
        Remove all expired entries from cache.

        Returns:
            Number of entries deleted
        """
        if not self.is_available or not self.db:
            logger.warning("Firestore cache unavailable - cannot cleanup expired entries")
            return 0

        try:
            deleted_count = 0
            now = datetime.now(timezone.utc)
            batch = self.db.batch()

            query = self.db.collection(self.collection_name)
            docs = query.stream()

            for doc in docs:
                data = doc.to_dict()
                expires_at = data.get("expires_at")

                if isinstance(expires_at, str):
                    expires_at = datetime.fromisoformat(expires_at)

                if expires_at and now > expires_at:
                    batch.delete(doc.reference)
                    deleted_count += 1

            batch.commit()
            logger.info(f"Cache cleanup completed: {deleted_count} expired entries removed")
            return deleted_count

        except Exception as e:
            logger.error(f"Cache cleanup error: {e}", exc_info=True)
            return 0


# Global cache instance
_firestore_cache: Optional[FirestoreCache] = None


def get_firestore_cache() -> FirestoreCache:
    """Get or create the global Firestore cache instance."""
    global _firestore_cache
    if _firestore_cache is None:
        _firestore_cache = FirestoreCache()
    return _firestore_cache


def init_firestore_cache(collection_name: str = CACHE_COLLECTION) -> FirestoreCache:
    """Initialize the Firestore cache with a specific collection name."""
    global _firestore_cache
    _firestore_cache = FirestoreCache(collection_name)
    return _firestore_cache
