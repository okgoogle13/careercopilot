"""
Personal Cache System for CareerCopilot
Consolidated to use SQLAlchemy/PostgreSQL as the backend.
Replaces file-based PersonalCache to eliminate redundant local storage dependency.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from app.core.database import get_db_session
from app.services.cache_store import SQLAlchemyCacheStore

logger = logging.getLogger(__name__)


class PersonalCache:
    """SQLAlchemy-backed cache system (Supabase/PostgreSQL)"""

    def __init__(self, cache_dir: str = "data/cache") -> None:
        # cache_dir is kept for signature compatibility but ignored
        self.default_ttl = timedelta(hours=24)
        self.backend = self  # For compatibility with cache middleware
        self.CACHE_CONFIGS: dict[str, dict[str, Any]] = {
            "default": {
                "ttl": int(self.default_ttl.total_seconds()),
                "max_size": 1000,
                "enabled": True,
            }
        }
        logger.info("PersonalCache initialized with SQLAlchemy backend")

    def _get_store(self, db) -> SQLAlchemyCacheStore:
        return SQLAlchemyCacheStore(db)

    async def get(self, key: str, *args, **kwargs) -> Any | None:
        """Retrieve cached value from PostgreSQL.
        Supports:
        - get(key, category)
        - get(operation_type, user_id, input_data)
        """
        try:
            # Handle different signature styles
            category = "general"
            input_data = None

            if len(args) >= 1:
                # Check if 2nd arg is user_id or category
                # If 3rd arg exists, then 1st is operation_type, 2nd is user_id, 3rd is input_data
                if len(args) >= 2 or "input_data" in kwargs:
                    user_id = args[0]
                    input_data = args[1] if len(args) >= 2 else kwargs.get("input_data")
                    operation_type = key
                    full_key = self._generate_key(operation_type, user_id, input_data)
                else:
                    # Style: get(key, category)
                    full_key = f"{args[0]}:{key}"
            else:
                category = kwargs.get("category", "general")
                full_key = f"{category}:{key}"

            logger.debug(f"[PersonalCache] GET key: {full_key}")
            with get_db_session() as db:
                store = self._get_store(db)
                return store.get(full_key)
        except Exception as e:
            logger.error(f"Error reading from cache: {e}")
            return None

    async def set(
        self,
        key: str,
        value: Any = None,
        *args,
        **kwargs,
    ) -> bool:
        """Store value in cache with TTL in PostgreSQL.
        Supports:
        - set(key, value, ttl, category)
        - set(operation_type, user_id, input_data, value, ttl)
        """
        try:
            ttl = kwargs.get("ttl")
            category = "general"

            # Determine signature style.
            # AI-operation style uses: set(operation_type, user_id, input_data, value, ttl)
            # where `value` (2nd positional arg in signature) is actually a user_id string.
            if len(args) >= 2 and isinstance(value, str):
                operation_type = key
                user_id = value
                input_data = args[0]
                value = args[1]
                if len(args) >= 3:
                    ttl = args[2]
                full_key = self._generate_key(operation_type, user_id, input_data)
                category = operation_type
            else:
                # Style: set(key, value, ttl, category)
                if len(args) >= 1:
                    ttl = args[0]
                if len(args) >= 2:
                    category = args[1]
                else:
                    category = kwargs.get("category", "general")
                full_key = f"{category}:{key}"

            logger.debug(f"[PersonalCache] SET key: {full_key}")
            if ttl is None:
                ttl = self.default_ttl

            if isinstance(ttl, (int, float)):
                ttl_seconds = int(ttl)
            else:
                ttl_seconds = int(ttl.total_seconds())

            with get_db_session() as db:
                store = self._get_store(db)
                return store.set(
                    key=full_key, value=value, operation_type=category, ttl_seconds=ttl_seconds
                )
        except Exception as e:
            logger.error(f"Error writing to cache: {e}")
            return False

    def _generate_key(self, operation_type: str, user_id: str, input_data: Any) -> str:
        """Generate a consistent cache key"""
        import hashlib
        import json

        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.md5(input_str.encode()).hexdigest()[:16]
        return f"{operation_type}:{user_id}:{input_hash}"

    async def delete(self, key: str, category: str = "general") -> bool:
        """Delete cached value from PostgreSQL"""
        try:
            full_key = f"{category}:{key}"
            with get_db_session() as db:
                store = self._get_store(db)
                return store.delete(full_key)
        except Exception as e:
            logger.error(f"Error deleting from cache: {e}")
            return False

    async def clear_expired(self, category: str | None = None) -> int:
        """Remove all expired cache entries from PostgreSQL"""
        with get_db_session() as db:
            store = self._get_store(db)
            return store.cleanup_expired()

    async def clear_all(self) -> int:
        """Clear all cache entries (for testing)"""
        try:
            with get_db_session() as db:
                from sqlalchemy import text

                result = db.execute(text("DELETE FROM cache"))
                db.commit()
                return result.rowcount
        except Exception as e:
            logger.error(f"Error clearing cache: {e}")
            return 0

    async def invalidate_user_cache(self, user_id: str, categories: list[str] | None = None) -> int:
        """Invalidate cache entries for a specific user"""
        try:
            with get_db_session() as db:
                from sqlalchemy import text

                if categories:
                    # Specific categories
                    count = 0
                    for category in categories:
                        query = "DELETE FROM cache WHERE key LIKE :pattern"
                        pattern = f"{category}:{user_id}:%"
                        result = db.execute(text(query), {"pattern": pattern})
                        count += result.rowcount
                    db.commit()
                    return count
                else:
                    # All categories for this user
                    query = "DELETE FROM cache WHERE key LIKE :pattern"
                    pattern = f"%:{user_id}:%"
                    result = db.execute(text(query), {"pattern": pattern})
                    db.commit()
                    return result.rowcount
        except Exception as e:
            logger.error(f"Error invalidating user cache: {e}")
            return 0

    async def cleanup_expired(self) -> int:
        """Alias for clear_expired"""
        return await self.clear_expired()

    async def get_cache_stats(self) -> dict[str, Any]:
        """Get cache statistics from PostgreSQL"""
        # Simplified stats for SQL
        return {"backend": "postgresql", "status": "active"}

    # Convenience methods for specific cache categories

    async def cache_user_profile(
        self,
        user_id: str,
        profile_data: dict[str, Any],
        ttl: timedelta = timedelta(days=7),
    ) -> bool:
        """Cache user profile"""
        return await self.set(f"profile_{user_id}", profile_data, ttl, "profiles")

    async def get_user_profile(self, user_id: str) -> dict[str, Any] | None:
        """Get cached user profile"""
        return await self.get(f"profile_{user_id}", "profiles")

    async def cache_company_research(
        self,
        company_name: str,
        job_url: str,
        research_data: dict[str, Any],
        ttl: timedelta = timedelta(days=7),
    ) -> bool:
        """Cache company research"""
        import hashlib

        url_hash = hashlib.md5(job_url.encode()).hexdigest()[:8]
        cache_key = f"company_{company_name}_{url_hash}"
        return await self.set(cache_key, research_data, ttl, "research")

    async def get_company_research(self, company_name: str, job_url: str) -> dict[str, Any] | None:
        """Get cached company research"""
        import hashlib

        url_hash = hashlib.md5(job_url.encode()).hexdigest()[:8]
        cache_key = f"company_{company_name}_{url_hash}"
        return await self.get(cache_key, "research")

    async def cache_ai_response(
        self,
        prompt_hash: str,
        response_data: dict[str, Any],
        ttl: timedelta = timedelta(hours=72),
    ) -> bool:
        """Cache AI response"""
        return await self.set(f"ai_{prompt_hash}", response_data, ttl, "ai_responses")

    async def get_ai_response(self, prompt_hash: str) -> dict[str, Any] | None:
        """Get cached AI response"""
        return await self.get(f"ai_{prompt_hash}", "ai_responses")

    async def cache_job_opportunity(
        self, job_id: str, job_data: dict[str, Any], ttl: timedelta = timedelta(days=3)
    ) -> bool:
        """Cache job opportunity"""
        return await self.set(f"job_{job_id}", job_data, ttl, "jobs")

    async def get_job_opportunity(self, job_id: str) -> dict[str, Any] | None:
        """Get cached job opportunity"""
        return await self.get(f"job_{job_id}", "jobs")

    async def cache_ai_operation(
        self,
        operation_type: str,
        input_data: dict[str, Any],
        result: dict[str, Any],
        user_id: str = "default",
        ttl: timedelta = timedelta(hours=72),
    ) -> bool:
        """Cache AI operation result in PostgreSQL"""
        import hashlib
        import json

        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.md5(input_str.encode()).hexdigest()[:16]
        cache_key = f"{operation_type}_{user_id}_{input_hash}"

        return await self.set(cache_key, result, ttl, "ai_operations")

    async def get_ai_operation(
        self, operation_type: str, input_data: dict[str, Any], user_id: str = "default"
    ) -> dict[str, Any] | None:
        """Get cached AI operation result from PostgreSQL"""
        import hashlib
        import json

        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.md5(input_str.encode()).hexdigest()[:16]
        cache_key = f"{operation_type}_{user_id}_{input_hash}"

        return await self.get(cache_key, "ai_operations")

    async def health_check(self) -> bool:
        """Health check for PostgreSQL cache"""
        try:
            with get_db_session() as db:
                db.execute("SELECT 1")
            return True
        except Exception:
            return False


# Global instance
_personal_cache: PersonalCache | None = None


def get_personal_cache(cache_dir: str = "data/cache") -> PersonalCache:
    """Get or create global PersonalCache instance"""
    global _personal_cache
    if _personal_cache is None:
        _personal_cache = PersonalCache(cache_dir)
    return _personal_cache


def get_ai_cache() -> PersonalCache:
    """Backwards compatibility for existing AICache usage"""
    return get_personal_cache()
