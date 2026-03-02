
import json
import logging
from datetime import datetime, timedelta, timezone
<<<<<<< HEAD
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
=======
from typing import Any

from sqlalchemy.orm import Session

>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
    def get(self, key: str) -> Optional[Any]:
=======
    def get(self, key: str) -> Any | None:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Retrieve a cached value.
        """
        try:
            cache_entry = self.db.query(Cache).filter(Cache.key == key).first()
            if not cache_entry:
                return None
<<<<<<< HEAD
            
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
            # Check TTL
            if cache_entry.expires_at < datetime.now(timezone.utc):
                # Delete expired entry
                self.db.delete(cache_entry)
                self.db.commit()
                logger.debug(f"[Cache] Key {key} expired")
                return None
<<<<<<< HEAD
            
            # Increment hit count
            cache_entry.hit_count += 1
            self.db.commit()
            
            logger.debug(f"[Cache] HIT for key {key}")
            
=======

            # Increment hit count
            cache_entry.hit_count += 1
            self.db.commit()

            logger.debug(f"[Cache] HIT for key {key}")

>>>>>>> restoration-KR-Rage-Figma-v2.0
            # Parse value
            try:
                return json.loads(cache_entry.value)
            except json.JSONDecodeError:
                return cache_entry.value
<<<<<<< HEAD
                
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        except Exception as e:
            logger.error(f"[Cache] Error reading key {key}: {e}")
            return None

    def set(
<<<<<<< HEAD
        self, 
        key: str, 
        value: Any, 
        operation_type: str = "general", 
        ttl_seconds: int = 3600, 
        user_id: Optional[str] = None
=======
        self,
        key: str,
        value: Any,
        operation_type: str = "general",
        ttl_seconds: int = 3600,
        user_id: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> bool:
        """
        Store a value in the cache.
        """
        try:
            expires_at = datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)
<<<<<<< HEAD
            
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
            # Serialize value
            if not isinstance(value, str):
                value_str = json.dumps(value, default=str)
            else:
                value_str = value
<<<<<<< HEAD
            
            # Check for existing entry
            cache_entry = self.db.query(Cache).filter(Cache.key == key).first()
            
=======

            # Check for existing entry
            cache_entry = self.db.query(Cache).filter(Cache.key == key).first()

>>>>>>> restoration-KR-Rage-Figma-v2.0
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
                    size_bytes=len(value_str)
                )
                self.db.add(cache_entry)
<<<<<<< HEAD
            
            self.db.commit()
            logger.debug(f"[Cache] SET for key {key} (TTL: {ttl_seconds}s)")
            return True
            
=======

            self.db.commit()
            logger.debug(f"[Cache] SET for key {key} (TTL: {ttl_seconds}s)")
            return True

>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
        Clear all keys matching a pattern (prefix).
        """
        try:
            entries = self.db.query(Cache).filter(Cache.key.like(f"{pattern}%")).all()
            count = len(entries)
            for entry in entries:
                self.db.delete(entry)
            self.db.commit()
=======
        Clear all keys matching a pattern (prefix) using bulk delete for performance.
        """
        try:
            # Use bulk delete instead of iterating - fixes N+1 query problem
            count = self.db.query(Cache).filter(Cache.key.like(f"{pattern}%")).delete(synchronize_session=False)
            self.db.commit()
            if count > 0:
                logger.info(f"[Cache] Cleared {count} entries matching pattern '{pattern}'")
>>>>>>> restoration-KR-Rage-Figma-v2.0
            return count
        except Exception as e:
            logger.error(f"[Cache] Error clearing pattern {pattern}: {e}")
            self.db.rollback()
            return 0

    def cleanup_expired(self) -> int:
        """
<<<<<<< HEAD
        Remove all expired cache entries.
        """
        try:
            now = datetime.now(timezone.utc)
            expired_entries = self.db.query(Cache).filter(Cache.expires_at < now).all()
            count = len(expired_entries)
            if count > 0:
                for entry in expired_entries:
                    self.db.delete(entry)
                self.db.commit()
=======
        Remove all expired cache entries using bulk delete for performance.
        """
        try:
            now = datetime.now(timezone.utc)
            # Use bulk delete instead of iterating - fixes N+1 query problem
            count = self.db.query(Cache).filter(Cache.expires_at < now).delete()
            self.db.commit()
            if count > 0:
>>>>>>> restoration-KR-Rage-Figma-v2.0
                logger.info(f"[Cache] Cleaned up {count} expired SQL entries")
            return count
        except Exception as e:
            logger.error(f"[Cache] Error during expired cleanup: {e}")
            self.db.rollback()
            return 0
