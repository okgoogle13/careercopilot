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

    async def get(self, key: str, category: str = "general") -> Any | None:
        """Retrieve cached value from PostgreSQL"""
        with get_db_session() as db:
            store = self._get_store(db)
            # We combine key and category or use category as operation_type
            # For better compatibility with original PersonalCache:
            full_key = f"{category}:{key}"
            return store.get(full_key)

    async def set(
        self,
        key: str,
        value: Any,
        ttl: timedelta | None = None,
        category: str = "general",
    ) -> bool:
        """Store value in cache with TTL in PostgreSQL"""
        if ttl is None:
            ttl = self.default_ttl
        
        ttl_seconds = int(ttl.total_seconds())
        full_key = f"{category}:{key}"

        with get_db_session() as db:
            store = self._get_store(db)
            return store.set(
                key=full_key,
                value=value,
                operation_type=category,
                ttl_seconds=ttl_seconds
            )

    async def delete(self, key: str, category: str = "general") -> bool:
        """Delete cached value from PostgreSQL"""
        full_key = f"{category}:{key}"
        with get_db_session() as db:
            store = self._get_store(db)
            return store.delete(full_key)

    async def clear_expired(self, category: str | None = None) -> int:
        """Remove all expired cache entries from PostgreSQL"""
        with get_db_session() as db:
            store = self._get_store(db)
            return store.cleanup_expired()

    async def cleanup_expired(self) -> int:
        """Alias for clear_expired"""
        return await self.clear_expired()

    async def get_cache_stats(self) -> dict[str, Any]:
        """Get cache statistics from PostgreSQL"""
        # Simplified stats for SQL
        return {
            "backend": "postgresql",
            "status": "active"
        }

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

    async def get_company_research(
        self, company_name: str, job_url: str
    ) -> dict[str, Any] | None:
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
