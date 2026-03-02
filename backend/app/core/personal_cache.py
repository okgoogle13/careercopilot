"""
Personal Cache System for CareerCopilot
<<<<<<< HEAD
File-based caching with TTL support for personal automation
"""

import hashlib
import json
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional
=======
Consolidated to use SQLAlchemy/PostgreSQL as the backend.
Replaces file-based PersonalCache to eliminate redundant local storage dependency.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any

from app.core.database import get_db_session
from app.services.cache_store import SQLAlchemyCacheStore
>>>>>>> restoration-KR-Rage-Figma-v2.0

logger = logging.getLogger(__name__)


class PersonalCache:
<<<<<<< HEAD
    """File-based cache with TTL support for personal automation"""

    def __init__(self, cache_dir: str = "data/cache") -> None:
        self.cache_dir = Path(cache_dir)
        self.default_ttl = timedelta(hours=24)
        self.backend = self  # For compatibility with cache middleware
        self.CACHE_CONFIGS: Dict[str, Dict[str, Any]] = {
=======
    """SQLAlchemy-backed cache system (Supabase/PostgreSQL)"""

    def __init__(self, cache_dir: str = "data/cache") -> None:
        # cache_dir is kept for signature compatibility but ignored
        self.default_ttl = timedelta(hours=24)
        self.backend = self  # For compatibility with cache middleware
        self.CACHE_CONFIGS: dict[str, dict[str, Any]] = {
>>>>>>> restoration-KR-Rage-Figma-v2.0
            "default": {
                "ttl": int(self.default_ttl.total_seconds()),
                "max_size": 1000,
                "enabled": True,
            }
<<<<<<< HEAD
        }  # For compatibility with cache middleware

        # Create cache directory if it doesn't exist
        self.cache_dir.mkdir(parents=True, exist_ok=True)

        # Ensure subdirectories exist - unified categories
        (self.cache_dir / "profiles").mkdir(exist_ok=True)
        (self.cache_dir / "research").mkdir(exist_ok=True)
        (self.cache_dir / "jobs").mkdir(exist_ok=True)
        (self.cache_dir / "ai_responses").mkdir(exist_ok=True)
        (self.cache_dir / "ai_operations").mkdir(exist_ok=True)  # Enhanced for AI operations
        (self.cache_dir / "general").mkdir(exist_ok=True)  # For generic caching

        logger.info(f"PersonalCache initialized with directory: {self.cache_dir}")

    def _generate_cache_key(self, key: str) -> str:
        """Generate safe filename from cache key"""
        # Create hash of key for safe filename
        key_hash = hashlib.md5(key.encode()).hexdigest()
        return f"{key_hash}.json"

    def _get_cache_file_path(self, key: str, category: str = "general") -> Path:
        """Get full path for cache file"""
        filename = self._generate_cache_key(key)
        return self.cache_dir / category / filename

    async def get(self, key: str, category: str = "general") -> Optional[Dict[str, Any]]:
        """Retrieve cached value with TTL check"""
        try:
            cache_file = self._get_cache_file_path(key, category)

            if not cache_file.exists():
                logger.debug(f"Cache MISS: {key} (file not found)")
                return None

            # Read cache file
            with open(cache_file, "r") as f:
                cache_data = json.load(f)

            # Check TTL
            datetime.fromisoformat(cache_data.get("timestamp", ""))
            expires_at = datetime.fromisoformat(cache_data.get("expires_at", ""))

            if datetime.now() > expires_at:
                logger.debug(f"Cache EXPIRED: {key}")
                self._delete_cache_file_sync(cache_file)
                return None

            logger.debug(f"Cache HIT: {key}")
            return cache_data.get("value")

        except Exception as e:
            logger.error(f"Cache GET error for {key}: {e}")
            return None
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0

    async def set(
        self,
        key: str,
<<<<<<< HEAD
        value: Dict[str, Any],
        ttl: Optional[timedelta] = None,
        category: str = "general",
    ) -> bool:
        """Store value in cache with TTL"""
        try:
            if ttl is None:
                ttl = self.default_ttl

            cache_file = self._get_cache_file_path(key, category)

            now = datetime.now()
            expires_at = now + ttl

            cache_data = {
                "key": key,
                "value": value,
                "timestamp": now.isoformat(),
                "expires_at": expires_at.isoformat(),
                "ttl_hours": ttl.total_seconds() / 3600,
                "category": category,
            }

            # Ensure parent directory exists
            cache_file.parent.mkdir(parents=True, exist_ok=True)

            # Write cache file
            with open(cache_file, "w") as f:
                json.dump(cache_data, f, indent=2, default=str)

            logger.debug(f"Cache SET: {key} (TTL: {ttl})")
            return True

        except Exception as e:
            logger.error(f"Cache SET error for {key}: {e}")
            return False

    async def delete(self, key: str, category: str = "general") -> bool:
        """Delete cached value"""
        try:
            cache_file = self._get_cache_file_path(key, category)
            return self._delete_cache_file_sync(cache_file)
        except Exception as e:
            logger.error(f"Cache DELETE error for {key}: {e}")
            return False

    def _delete_cache_file_sync(self, cache_file: Path) -> bool:
        """Delete cache file if it exists (synchronous)"""
        try:
            if cache_file.exists():
                os.remove(cache_file)
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting cache file {cache_file}: {e}")
            return False

    async def clear_expired(self, category: Optional[str] = None) -> int:
        """Remove all expired cache entries"""
        try:
            cleared_count = 0

            if category:
                # Clear specific category
                category_dir = self.cache_dir / category
                if category_dir.exists():
                    cleared_count += await self._clear_expired_in_directory(category_dir)
            else:
                # Clear all categories
                for subdir in self.cache_dir.iterdir():
                    if subdir.is_dir():
                        cleared_count += await self._clear_expired_in_directory(subdir)

            logger.info(f"Cleared {cleared_count} expired cache entries")
            return cleared_count

        except Exception as e:
            logger.error(f"Error clearing expired cache: {e}")
            return 0

    async def cleanup_expired(self) -> int:
        """Alias for clear_expired for compatibility with cache middleware"""
        return await self.clear_expired()

    async def _clear_expired_in_directory(self, directory: Path) -> int:
        """Clear expired files in a specific directory"""
        cleared_count = 0
        now = datetime.now()

        for cache_file in directory.glob("*.json"):
            try:
                with open(cache_file, "r") as f:
                    cache_data = json.load(f)

                expires_at = datetime.fromisoformat(cache_data.get("expires_at", ""))

                if now > expires_at:
                    os.remove(cache_file)
                    cleared_count += 1

            except Exception as e:
                logger.error(f"Error checking cache file {cache_file}: {e}")

        return cleared_count

    async def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            stats: Dict[str, Any] = {"total_files": 0, "categories": {}, "total_size_mb": 0.0}

            for category_dir in self.cache_dir.iterdir():
                if category_dir.is_dir():
                    category_name = category_dir.name
                    files = list(category_dir.glob("*.json"))
                    file_count = len(files)

                    # Calculate size
                    total_size = sum(f.stat().st_size for f in files if f.exists())  # type: ignore
                    size_mb = round(float(total_size) / (1024 * 1024), 2)

                    stats["categories"][category_name] = {
                        "files": file_count,
                        "size_mb": size_mb,
                    }

                    stats["total_files"] += file_count
                    stats["total_size_mb"] = float(stats["total_size_mb"]) + size_mb

            stats["total_size_mb"] = round(stats["total_size_mb"], 2)
            return stats

        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"total_files": 0, "categories": {}, "total_size_mb": 0.0}
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0

    # Convenience methods for specific cache categories

    async def cache_user_profile(
        self,
        user_id: str,
<<<<<<< HEAD
        profile_data: Dict[str, Any],
        ttl: timedelta = timedelta(days=7),
    ) -> bool:
        """Cache user profile with 7-day TTL"""
        return await self.set(f"profile_{user_id}", profile_data, ttl, "profiles")

    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
=======
        profile_data: dict[str, Any],
        ttl: timedelta = timedelta(days=7),
    ) -> bool:
        """Cache user profile"""
        return await self.set(f"profile_{user_id}", profile_data, ttl, "profiles")

    async def get_user_profile(self, user_id: str) -> dict[str, Any] | None:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Get cached user profile"""
        return await self.get(f"profile_{user_id}", "profiles")

    async def cache_company_research(
        self,
        company_name: str,
        job_url: str,
<<<<<<< HEAD
        research_data: Dict[str, Any],
        ttl: timedelta = timedelta(days=7),
    ) -> bool:
        """Cache company research with 7-day TTL"""
        # Create composite key from company and job URL hash
=======
        research_data: dict[str, Any],
        ttl: timedelta = timedelta(days=7),
    ) -> bool:
        """Cache company research"""
        import hashlib
>>>>>>> restoration-KR-Rage-Figma-v2.0
        url_hash = hashlib.md5(job_url.encode()).hexdigest()[:8]
        cache_key = f"company_{company_name}_{url_hash}"
        return await self.set(cache_key, research_data, ttl, "research")

    async def get_company_research(
        self, company_name: str, job_url: str
<<<<<<< HEAD
    ) -> Optional[Dict[str, Any]]:
        """Get cached company research"""
=======
    ) -> dict[str, Any] | None:
        """Get cached company research"""
        import hashlib
>>>>>>> restoration-KR-Rage-Figma-v2.0
        url_hash = hashlib.md5(job_url.encode()).hexdigest()[:8]
        cache_key = f"company_{company_name}_{url_hash}"
        return await self.get(cache_key, "research")

    async def cache_ai_response(
        self,
        prompt_hash: str,
<<<<<<< HEAD
        response_data: Dict[str, Any],
        ttl: timedelta = timedelta(hours=72),
    ) -> bool:
        """Cache AI response with 72-hour TTL"""
        return await self.set(f"ai_{prompt_hash}", response_data, ttl, "ai_responses")

    async def get_ai_response(self, prompt_hash: str) -> Optional[Dict[str, Any]]:
=======
        response_data: dict[str, Any],
        ttl: timedelta = timedelta(hours=72),
    ) -> bool:
        """Cache AI response"""
        return await self.set(f"ai_{prompt_hash}", response_data, ttl, "ai_responses")

    async def get_ai_response(self, prompt_hash: str) -> dict[str, Any] | None:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Get cached AI response"""
        return await self.get(f"ai_{prompt_hash}", "ai_responses")

    async def cache_job_opportunity(
<<<<<<< HEAD
        self, job_id: str, job_data: Dict[str, Any], ttl: timedelta = timedelta(days=3)
    ) -> bool:
        """Cache job opportunity with 3-day TTL"""
        return await self.set(f"job_{job_id}", job_data, ttl, "jobs")

    async def get_job_opportunity(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get cached job opportunity"""
        return await self.get(f"job_{job_id}", "jobs")

    # Enhanced AI operations methods (absorbing AICache functionality)

    async def cache_ai_operation(
        self,
        operation_type: str,
        input_data: Dict[str, Any],
        result: Dict[str, Any],
        user_id: str = "default",
        ttl: timedelta = timedelta(hours=72),
    ) -> bool:
        """
        Cache AI operation result with enhanced key generation
        Absorbs AICache functionality for AI operation caching
        """
        # Generate deterministic key from operation inputs
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.md5(input_str.encode()).hexdigest()[:16]
        cache_key = f"{operation_type}_{user_id}_{input_hash}"

<<<<<<< HEAD
        # Store with metadata for better tracking
        cache_data = {
            "result": result,
            "operation_type": operation_type,
            "input_hash": input_hash,
            "user_id": user_id,
            "cached_at": datetime.now().isoformat(),
        }

        return await self.set(cache_key, cache_data, ttl, "ai_operations")

    async def get_ai_operation(
        self, operation_type: str, input_data: Dict[str, Any], user_id: str = "default"
    ) -> Optional[Dict[str, Any]]:
        """
        Get cached AI operation result
        Absorbs AICache functionality for AI operation retrieval
        """
        # Generate same key as cache_ai_operation
=======
        return await self.set(cache_key, result, ttl, "ai_operations")

    async def get_ai_operation(
        self, operation_type: str, input_data: dict[str, Any], user_id: str = "default"
    ) -> dict[str, Any] | None:
        """Get cached AI operation result from PostgreSQL"""
        import hashlib
        import json
>>>>>>> restoration-KR-Rage-Figma-v2.0
        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.md5(input_str.encode()).hexdigest()[:16]
        cache_key = f"{operation_type}_{user_id}_{input_hash}"

<<<<<<< HEAD
        cached_data = await self.get(cache_key, "ai_operations")

        # Return just the result part, maintaining backwards compatibility
        if cached_data and "result" in cached_data:
            return cached_data["result"]
        return cached_data

    async def clear_ai_operations(self, operation_type: Optional[str] = None) -> int:
        """
        Clear AI operations cache, optionally filtered by operation type
        Enhanced cleanup functionality absorbing AICache patterns
        """
        ai_ops_dir = self.cache_dir / "ai_operations"
        if not ai_ops_dir.exists():
            return 0

        cleared_count = 0

        for cache_file in ai_ops_dir.glob("*.json"):
            try:
                if operation_type:
                    # Only clear files matching the operation type
                    if not cache_file.name.startswith(f"{operation_type}_"):
                        continue

                os.remove(cache_file)
                cleared_count += 1

            except Exception as e:
                logger.error(f"Error clearing AI operation cache file {cache_file}: {e}")

        logger.info(f"Cleared {cleared_count} AI operation cache entries")
        return cleared_count

    # AICache compatibility methods for backwards compatibility with cache decorators

    async def get_ai_compatible(
        self, operation_type: str, user_id: str, input_data: Any, **kwargs
    ) -> Optional[Any]:
        """
        AICache-compatible get method for cache decorators
        Maps to enhanced AI operation caching
        """
        return await self.get_ai_operation(operation_type, input_data, user_id)

    async def set_ai_compatible(
        self, operation_type: str, user_id: str, input_data: Any, result: Any, **kwargs
    ) -> bool:
        """
        AICache-compatible set method for cache decorators
        Maps to enhanced AI operation caching
        """
        return await self.cache_ai_operation(operation_type, input_data, result, user_id)

    async def invalidate_user_cache(
        self, user_id: str, operation_types: Optional[List[str]] = None
    ) -> int:
        """
        AICache-compatible invalidation method
        Clear cache entries for specific user and operation types
        """
        cleared_count = 0
        ai_ops_dir = self.cache_dir / "ai_operations"

        if not ai_ops_dir.exists():
            return 0

        for cache_file in ai_ops_dir.glob("*.json"):
            try:
                # Check if file matches user_id pattern
                if f"_{user_id}_" not in cache_file.name:
                    continue

                # If operation_types specified, filter by those
                if operation_types:
                    matches_operation = any(
                        cache_file.name.startswith(f"{op_type}_") for op_type in operation_types
                    )
                    if not matches_operation:
                        continue

                os.remove(cache_file)
                cleared_count += 1

            except Exception as e:
                logger.error(f"Error clearing user cache file {cache_file}: {e}")

        logger.info(f"Invalidated {cleared_count} cache entries for user {user_id}")
        return cleared_count

    async def health_check(self) -> bool:
        """Health check method for cache middleware compatibility"""
        try:
            # Test basic cache operations
            test_key = "health_check"
            test_data = {"status": "test", "timestamp": datetime.now().isoformat()}
            # Try to set and get
            set_success = await self.set(test_key, test_data)
            if not set_success:
                return False
            retrieved_data = await self.get(test_key)
            if retrieved_data is None:
                return False
            # Clean up test data
            await self.delete(test_key)
            return True
        except Exception as e:
            logger.error(f"PersonalCache health check failed: {e}")
=======
        return await self.get(cache_key, "ai_operations")

    async def health_check(self) -> bool:
        """Health check for PostgreSQL cache"""
        try:
            with get_db_session() as db:
                db.execute("SELECT 1")
            return True
        except Exception:
>>>>>>> restoration-KR-Rage-Figma-v2.0
            return False


# Global instance
<<<<<<< HEAD
_personal_cache: Optional[PersonalCache] = None
=======
_personal_cache: PersonalCache | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


def get_personal_cache(cache_dir: str = "data/cache") -> PersonalCache:
    """Get or create global PersonalCache instance"""
    global _personal_cache
    if _personal_cache is None:
        _personal_cache = PersonalCache(cache_dir)
    return _personal_cache


<<<<<<< HEAD
# Unified cache interface - backwards compatibility for AICache usage
def get_ai_cache() -> PersonalCache:
    """
    Get AI cache instance - now unified with PersonalCache
    This provides backwards compatibility for existing AICache usage
    """
    return get_personal_cache()


# Additional PersonalCache methods to absorb AICache functionality
class PersonalCacheExtensions:
    """Extension methods for PersonalCache to absorb AICache functionality"""

    @staticmethod
    def generate_operation_key(
        operation_type: str, input_data: Dict[str, Any], user_id: str = "default"
    ) -> str:
        """
        Generate cache key for AI operations (absorbs AICache key generation)
        """
        # Create deterministic hash from operation inputs
        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.md5(input_str.encode()).hexdigest()[:16]
        return f"{operation_type}_{user_id}_{input_hash}"
=======
def get_ai_cache() -> PersonalCache:
    """Backwards compatibility for existing AICache usage"""
    return get_personal_cache()
>>>>>>> restoration-KR-Rage-Figma-v2.0
