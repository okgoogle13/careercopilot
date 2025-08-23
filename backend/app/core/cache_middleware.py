"""
Cache middleware for automatic cache management

Handles cache cleanup, monitoring, and automatic invalidation
"""

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Any, Dict

from fastapi import FastAPI, Request
from fastapi.middleware.base import BaseHTTPMiddleware

from .cache import AICache, get_ai_cache

logger = logging.getLogger(__name__)


class CacheCleanupMiddleware(BaseHTTPMiddleware):
    """Middleware to handle periodic cache cleanup"""

    def __init__(self, app: FastAPI, cleanup_interval: int = 3600):
        super().__init__(app)
        self.cleanup_interval = cleanup_interval  # seconds
        self.last_cleanup = datetime.utcnow()
        self.cache = get_ai_cache()

    async def dispatch(self, request: Request, call_next):
        # Check if cleanup is needed
        now = datetime.utcnow()
        if (now - self.last_cleanup).total_seconds() > self.cleanup_interval:
            # Run cleanup in background to not block request
            asyncio.create_task(self._cleanup_cache())
            self.last_cleanup = now

        response = await call_next(request)
        return response

    async def _cleanup_cache(self):
        """Background task to clean up expired cache entries"""
        try:
            cleared = await self.cache.cleanup_expired()
            if cleared > 0:
                logger.info(f"Cache cleanup: removed {cleared} expired entries")
        except Exception as e:
            logger.error(f"Cache cleanup error: {e}")


class CacheMonitoringMiddleware(BaseHTTPMiddleware):
    """Middleware to add cache performance headers"""

    def __init__(self, app: FastAPI, include_headers: bool = True):
        super().__init__(app)
        self.include_headers = include_headers
        self.request_stats = {"total_requests": 0, "cache_hits": 0, "cache_misses": 0}

    async def dispatch(self, request: Request, call_next):
        self.request_stats["total_requests"] += 1

        # Track cache performance if this is an AI operation
        is_ai_endpoint = any(
            path_segment in request.url.path
            for path_segment in ["/analysis", "/jobs", "/ksc", "/profile"]
        )

        if is_ai_endpoint and hasattr(request.state, "cache_hit"):
            if request.state.cache_hit:
                self.request_stats["cache_hits"] += 1
            else:
                self.request_stats["cache_misses"] += 1

        response = await call_next(request)

        # Add cache performance headers in development
        if self.include_headers and os.getenv("ENV") != "production":
            response.headers["X-Cache-Stats"] = (
                f"hits:{self.request_stats['cache_hits']},"
                f"misses:{self.request_stats['cache_misses']}"
            )

        return response

    def get_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_cache_requests = (
            self.request_stats["cache_hits"] + self.request_stats["cache_misses"]
        )
        hit_rate = (
            self.request_stats["cache_hits"] / total_cache_requests * 100
            if total_cache_requests > 0
            else 0
        )

        return {
            "total_requests": self.request_stats["total_requests"],
            "cache_requests": total_cache_requests,
            "cache_hits": self.request_stats["cache_hits"],
            "cache_misses": self.request_stats["cache_misses"],
            "hit_rate_percent": round(hit_rate, 2),
        }


class CacheInvalidationMiddleware(BaseHTTPMiddleware):
    """Middleware to automatically invalidate cache on user data changes"""

    INVALIDATION_ENDPOINTS = {
        "/api/v1/documents": ["resume_analysis", "ats_scoring", "voice_profile"],
        "/api/v1/profile": ["voice_profile", "resume_analysis"],
        "/api/v1/users": ["voice_profile", "resume_analysis", "ats_scoring"],
    }

    def __init__(self, app: FastAPI):
        super().__init__(app)
        self.cache = get_ai_cache()

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Only invalidate on successful POST/PUT/PATCH/DELETE operations
        if (
            request.method in ["POST", "PUT", "PATCH", "DELETE"]
            and 200 <= response.status_code < 300
        ):

            await self._handle_invalidation(request)

        return response

    async def _handle_invalidation(self, request: Request):
        """Handle cache invalidation based on endpoint"""
        try:
            # Extract user ID from request (could be in path, auth, or body)
            user_id = await self._extract_user_id(request)
            if not user_id:
                return

            # Check if this endpoint should trigger invalidation
            endpoint_path = self._normalize_path(request.url.path)
            operation_types = None

            for pattern, ops in self.INVALIDATION_ENDPOINTS.items():
                if endpoint_path.startswith(pattern):
                    operation_types = ops
                    break

            if operation_types:
                invalidated = await self.cache.invalidate_user_cache(
                    user_id, operation_types
                )
                logger.info(
                    f"Invalidated {invalidated} cache entries for user {user_id} after "
                    f"{request.method} {endpoint_path}"
                )

        except Exception as e:
            logger.error(f"Cache invalidation error: {e}")

    async def _extract_user_id(self, request: Request) -> str:
        """Extract user ID from request"""
        # Try to get from auth context first
        if hasattr(request.state, "user_id"):
            return request.state.user_id

        # Try to extract from path parameters
        path_parts = request.url.path.split("/")
        for i, part in enumerate(path_parts):
            if part in ["users", "user"] and i + 1 < len(path_parts):
                return path_parts[i + 1]

        return None

    def _normalize_path(self, path: str) -> str:
        """Normalize path for pattern matching"""
        # Remove trailing slashes and query parameters
        return path.rstrip("/").split("?")[0]


async def setup_cache_backend() -> AICache:
    """Setup cache backend based on environment"""
    redis_url = os.getenv("REDIS_URL")

    if redis_url:
        try:
            from .redis_cache import RedisCacheBackend

            backend = RedisCacheBackend(redis_url=redis_url)

            # Test connection
            if await backend.health_check():
                logger.info("Using Redis cache backend")
                from .cache import setup_cache

                return setup_cache(backend)
            else:
                logger.warning(
                    "Redis health check failed, falling back to in-memory cache"
                )
        except ImportError:
            logger.warning("Redis not available, falling back to in-memory cache")
        except Exception as e:
            logger.error(f"Redis setup failed: {e}, falling back to in-memory cache")

    # Fall back to in-memory cache
    logger.info("Using in-memory cache backend")
    return get_ai_cache()


@asynccontextmanager
async def cache_lifespan(app: FastAPI):
    """Lifespan context manager for cache setup and cleanup"""
    # Setup cache on startup
    cache = await setup_cache_backend()
    app.state.ai_cache = cache

    logger.info("AI cache system initialized")

    yield

    # Cleanup on shutdown
    try:
        if hasattr(cache.backend, "close"):
            await cache.backend.close()
        logger.info("AI cache system shutdown complete")
    except Exception as e:
        logger.error(f"Error during cache shutdown: {e}")


def add_cache_middleware(app: FastAPI):
    """Add all cache middleware to FastAPI app"""

    # Add middleware in reverse order (last added is executed first)
    app.add_middleware(CacheInvalidationMiddleware)

    app.add_middleware(
        CacheMonitoringMiddleware,
        include_headers=os.getenv("ENV", "development") != "production",
    )

    app.add_middleware(
        CacheCleanupMiddleware,
        cleanup_interval=int(os.getenv("CACHE_CLEANUP_INTERVAL", "3600")),
    )

    logger.info("Cache middleware added to FastAPI app")


# Cache health check endpoint
async def cache_health_check() -> Dict[str, Any]:
    """Health check for cache system"""
    cache = get_ai_cache()

    try:
        # Test cache operations
        test_data = {"timestamp": datetime.utcnow().isoformat()}

        # Try to cache and retrieve
        success = await cache.set("health_check", "system", test_data, test_data)
        if success:
            retrieved = await cache.get("health_check", "system", test_data)
            cache_working = retrieved is not None
        else:
            cache_working = False

        # Get backend info if available
        backend_info = {}
        if hasattr(cache.backend, "get_info"):
            backend_info = await cache.backend.get_info()
        elif hasattr(cache.backend, "health_check"):
            backend_health = await cache.backend.health_check()
            backend_info = {"healthy": backend_health}

        return {
            "status": "healthy" if cache_working else "degraded",
            "cache_working": cache_working,
            "backend_type": type(cache.backend).__name__,
            "backend_info": backend_info,
            "configurations_count": len(cache.CACHE_CONFIGS),
        }

    except Exception as e:
        logger.error(f"Cache health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "backend_type": type(cache.backend).__name__,
        }
