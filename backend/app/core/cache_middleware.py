"""
Cache middleware for automatic cache management
Now aligned with Supabase/SQLAlchemy backend.
"""

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.database import SessionLocal
from app.services.cache_store import SQLAlchemyCacheStore
from .personal_cache import PersonalCache, get_ai_cache

logger = logging.getLogger(__name__)

class CacheCleanupMiddleware(BaseHTTPMiddleware):
    """Middleware to handle periodic cache cleanup"""

    def __init__(self, app: FastAPI, cleanup_interval: int = 3600):
        super().__init__(app)
        self.cleanup_interval = cleanup_interval  # seconds
        self.last_cleanup = datetime.now(timezone.utc)
        self.cache = get_ai_cache()

    async def dispatch(self, request: Request, call_next):
        # Check if cleanup is needed
        now = datetime.now(timezone.utc)
        if (now - self.last_cleanup).total_seconds() > self.cleanup_interval:
            # Run cleanup in background to not block request
            asyncio.create_task(self._cleanup_cache())
            self.last_cleanup = now

        response = await call_next(request)
        return response

    async def _cleanup_cache(self):
        """Background task to clean up expired cache entries"""
        try:
            # 1. Clean up PersonalCache (file-based)
            cleared_personal = 0
            if hasattr(self.cache, "cleanup_expired"):
                cleared_personal = await self.cache.cleanup_expired()

            # 2. Clean up SQL Cache
            cleared_sql = 0
            db = SessionLocal()
            try:
                sql_cache = SQLAlchemyCacheStore(db)
                cleared_sql = sql_cache.cleanup_expired()
            finally:
                db.close()

            total_cleared = cleared_personal + cleared_sql
            if total_cleared > 0:
                logger.info(
                    f"Cache cleanup: removed {total_cleared} expired entries "
                    f"(personal: {cleared_personal}, sql: {cleared_sql})"
                )
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
            for path_segment in ["/analysis", "/jobs", "/ksc", "/profile", "/ingest"]
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

        if (
            request.method in ["POST", "PUT", "PATCH", "DELETE"]
            and 200 <= response.status_code < 300
        ):
            await self._handle_invalidation(request)

        return response

    async def _handle_invalidation(self, request: Request):
        """Handle cache invalidation based on endpoint"""
        try:
            user_id = await self._extract_user_id(request)
            if not user_id:
                return

            endpoint_path = self._normalize_path(request.url.path)
            operation_types = None

            for pattern, ops in self.INVALIDATION_ENDPOINTS.items():
                if endpoint_path.startswith(pattern):
                    operation_types = ops
                    break

            if operation_types:
                # Invalidate file-based cache
                invalidated_personal = await self.cache.invalidate_user_cache(user_id, operation_types)
                
                # Invalidate SQL cache
                invalidated_sql = 0
                db = SessionLocal()
                try:
                    sql_cache = SQLAlchemyCacheStore(db)
                    for op_type in operation_types:
                        invalidated_sql += sql_cache.clear_pattern(f"{op_type}:{user_id}")
                finally:
                    db.close()
                
                logger.info(
                    f"Invalidated {invalidated_personal + invalidated_sql} entries for user {user_id}"
                )

        except Exception as e:
            logger.error(f"Cache invalidation error: {e}")

    async def _extract_user_id(self, request: Request) -> Optional[str]:
        if hasattr(request.state, "user_id"):
            return request.state.user_id
        path_parts = request.url.path.split("/")
        for i, part in enumerate(path_parts):
            if part in ["users", "user"] and i + 1 < len(path_parts):
                return path_parts[i + 1]
        return None

    def _normalize_path(self, path: str) -> str:
        return path.rstrip("/").split("?")[0]

async def setup_cache_backend() -> PersonalCache:
    """Setup cache system"""
    logger.info("Initializing SQL-backed cache monitoring")
    return get_ai_cache()

@asynccontextmanager
async def cache_lifespan(app: FastAPI):
    app.state.ai_cache = await setup_cache_backend()
    yield
    logger.info("Cache system shutdown")

def add_cache_middleware(app: FastAPI):
    app.add_middleware(CacheInvalidationMiddleware)
    app.add_middleware(
        CacheMonitoringMiddleware,
        include_headers=os.getenv("ENV", "development") != "production",
    )
    app.add_middleware(
        CacheCleanupMiddleware,
        cleanup_interval=int(os.getenv("CACHE_CLEANUP_INTERVAL", "3600")),
    )
    logger.info("Cache middleware initialized")
