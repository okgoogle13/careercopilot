import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.database import Cache

logger = logging.getLogger(__name__)


class SQLAlchemyCacheStore:
    """
    SQLAlchemy-backed cache implementation using PostgreSQL.
    Replaces FirestoreCache and PersonalCache.
    """

    def __init__(self, db: Session):
        """
        Initialize the cache store with a DB session.
        """
        self.db = db

    def get(self, key: str) -> Any | None:
        """
        Retrieve a cached value.
        """
        try:
            cache_entry = self.db.query(Cache).filter(Cache.key == key).first()
            if not cache_entry:
                return None

            # Check TTL
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            expires_at = cache_entry.expires_at
            if expires_at.tzinfo is not None:
                expires_at = expires_at.replace(tzinfo=None)

            if expires_at < now:
                # Delete expired entry
                self.db.delete(cache_entry)
                self.db.commit()
                logger.debug(f"[Cache] Key {key} expired")
                return None

            # Increment hit count
            cache_entry.hit_count += 1
            self.db.commit()

            logger.debug(f"[Cache] HIT for key {key}")

            # Parse value
            try:
                return json.loads(cache_entry.value)
            except json.JSONDecodeError:
                return cache_entry.value

        except Exception as e:
            logger.error(f"[Cache] Error reading key {key}: {e}")
            return None

    def set(
        self,
        key: str,
        value: Any,
        operation_type: str = "general",
        ttl_seconds: int = 3600,
        user_id: str | None = None,
    ) -> bool:
        """
        Store a value in the cache.
        """
        try:
            expires_at = (datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)).replace(
                tzinfo=None
            )

            # Serialize value
            if not isinstance(value, str):
                value_str = json.dumps(value, default=str)
            else:
                value_str = value

            # Check for existing entry
            cache_entry = self.db.query(Cache).filter(Cache.key == key).first()

            if cache_entry:
                cache_entry.value = value_str
                cache_entry.expires_at = expires_at
                cache_entry.operation_type = operation_type
                cache_entry.user_id = user_id
                cache_entry.size_bytes = len(value_str)
            else:
                cache_entry = Cache(
                    key=key,
                    value=value_str,
                    expires_at=expires_at,
                    operation_type=operation_type,
                    user_id=user_id,
                    size_bytes=len(value_str),
                )
                self.db.add(cache_entry)

            self.db.commit()
            logger.debug(f"[Cache] SET for key {key} (TTL: {ttl_seconds}s)")
            return True

        except Exception as e:
            logger.error(f"[Cache] Error setting key {key}: {e}")
            self.db.rollback()
            return False

    def delete(self, key: str) -> bool:
        """
        Delete a cache entry.
        """
        try:
            cache_entry = self.db.query(Cache).filter(Cache.key == key).first()
            if cache_entry:
                self.db.delete(cache_entry)
                self.db.commit()
                return True
            return False
        except Exception as e:
            logger.error(f"[Cache] Error deleting key {key}: {e}")
            self.db.rollback()
            return False

    def clear_pattern(self, pattern: str) -> int:
        """
        Clear all keys matching a pattern (prefix) using bulk delete for performance.
        """
        try:
            # Use bulk delete instead of iterating - fixes N+1 query problem
            count = (
                self.db.query(Cache)
                .filter(Cache.key.like(f"{pattern}%"))
                .delete(synchronize_session=False)
            )
            self.db.commit()
            if count > 0:
                logger.info(f"[Cache] Cleared {count} entries matching pattern '{pattern}'")
            return count
        except Exception as e:
            logger.error(f"[Cache] Error clearing pattern {pattern}: {e}")
            self.db.rollback()
            return 0

    def cleanup_expired(self) -> int:
        """
        Remove all expired cache entries using bulk delete for performance.
        """
        try:
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            # Use bulk delete instead of iterating - fixes N+1 query problem
            count = self.db.query(Cache).filter(Cache.expires_at < now).delete()
            self.db.commit()
            if count > 0:
                logger.info(f"[Cache] Cleaned up {count} expired SQL entries")
            return count
        except Exception as e:
            logger.error(f"[Cache] Error during expired cleanup: {e}")
            self.db.rollback()
            return 0
