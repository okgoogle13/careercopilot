"""
Monitoring middleware for FastAPI applications

Provides request/response monitoring, error tracking, and performance metrics
with automatic logging and metrics collection.
"""

import json
import logging
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from .logging_config import request_id_context, user_id_context
from .monitoring import get_metrics_collector, track_error, track_user_action

logger = logging.getLogger(__name__)


class RequestMonitoringMiddleware(BaseHTTPMiddleware):
    """Middleware to monitor HTTP requests and responses"""

    def __init__(
        self,
        app: ASGIApp,
        include_request_body: bool = False,
        include_response_body: bool = False,
        max_body_size: int = 1024 * 1024,  # 1MB
        exclude_paths: Optional[List[str]] = None,
    ):
        super().__init__(app)
        self.include_request_body = include_request_body
        self.include_response_body = include_response_body
        self.max_body_size = max_body_size
        self.exclude_paths = exclude_paths or ["/health", "/metrics", "/docs", "/redoc"]
        self.collector = get_metrics_collector()

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip monitoring for excluded paths
        if any(request.url.path.startswith(path) for path in self.exclude_paths):
            return await call_next(request)

        # Generate unique request ID
        request_id = str(uuid.uuid4())
        start_time = time.time()

        # Extract user information if available
        user_id = self._extract_user_id(request)

        # Set context variables for logging
        request_id_context.set(request_id)
        if user_id:
            user_id_context.set(user_id)

        # Add request ID to request state
        request.state.request_id = request_id
        request.state.user_id = user_id
        request.state.start_time = start_time

        # Log request start
        request_info = await self._build_request_info(request)
        logger.info(
            f"Request started: {request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "user_id": user_id,
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
                "user_agent": request.headers.get("user-agent"),
                "client_ip": self._get_client_ip(request),
                **request_info,
            },
        )

        # Track request metrics
        self.collector.increment_counter(
            "http_requests_total",
            labels={
                "method": request.method,
                "path": self._normalize_path(request.url.path),
            },
        )

        try:
            # Process request
            response = await call_next(request)

            # Calculate response time
            response_time = time.time() - start_time

            # Track response metrics
            self.collector.record_histogram(
                "http_request_duration_seconds", response_time
            )
            self.collector.increment_counter(
                "http_responses_total",
                labels={
                    "method": request.method,
                    "path": self._normalize_path(request.url.path),
                    "status_code": str(response.status_code),
                },
            )

            # Log successful response
            response_info = await self._build_response_info(response)
            logger.info(
                f"Request completed: {request.method} {request.url.path}",
                extra={
                    "request_id": request_id,
                    "user_id": user_id,
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": response.status_code,
                    "response_time_ms": response_time * 1000,
                    "success": 200 <= response.status_code < 400,
                    **response_info,
                },
            )

            # Add monitoring headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{response_time:.3f}s"

            # Track user actions for specific endpoints
            if user_id and response.status_code < 400:
                self._track_user_action(request, user_id)

            return response

        except Exception as e:
            # Calculate error response time
            response_time = time.time() - start_time

            # Track error metrics
            self.collector.increment_counter(
                "http_requests_errors_total",
                labels={
                    "method": request.method,
                    "path": self._normalize_path(request.url.path),
                    "error_type": type(e).__name__,
                },
            )

            # Track application error
            track_error(
                error_type=type(e).__name__,
                component="http_middleware",
                error_message=str(e),
                user_id=user_id,
            )

            # Log error response
            logger.error(
                f"Request failed: {request.method} {request.url.path}",
                exc_info=True,
                extra={
                    "request_id": request_id,
                    "user_id": user_id,
                    "method": request.method,
                    "path": request.url.path,
                    "error_type": type(e).__name__,
                    "error_message": str(e),
                    "response_time_ms": response_time * 1000,
                },
            )

            # Return structured error response
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal server error",
                    "request_id": request_id,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
                headers={"X-Request-ID": request_id},
            )

    def _extract_user_id(self, request: Request) -> Optional[str]:
        """Extract user ID from request"""
        # Try to get from Authorization header (if using custom auth)
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            # This would need to be implemented based on your auth system
            pass

        # Try to get from request state (set by auth middleware)
        if hasattr(request.state, "user_id"):
            return request.state.user_id

        # Try to get from path parameters
        if "user" in request.path_params:
            return request.path_params["user"]

        return None

    def _get_client_ip(self, request: Request) -> str:
        """Get client IP address with proxy support"""
        # Check for forwarded headers first (reverse proxy/load balancer)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        # Fall back to direct connection
        if request.client:
            return request.client.host

        return "unknown"

    def _normalize_path(self, path: str) -> str:
        """Normalize path for metrics (remove IDs and query params)"""
        # Replace UUIDs and numeric IDs with placeholders
        import re

        # UUID pattern
        path = re.sub(
            r"/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
            "/{uuid}",
            path,
            flags=re.IGNORECASE,
        )

        # Numeric ID pattern
        path = re.sub(r"/\d+", "/{id}", path)

        return path

    async def _build_request_info(self, request: Request) -> Dict[str, Any]:
        """Build additional request information"""
        info = {}

        if self.include_request_body:
            try:
                # Read body if it's not too large
                body = await request.body()
                if len(body) <= self.max_body_size:
                    # Try to parse as JSON first
                    try:
                        info["request_body"] = json.loads(body.decode("utf-8"))
                    except (json.JSONDecodeError, UnicodeDecodeError):
                        info["request_body_size"] = len(body)
                else:
                    info["request_body_size"] = len(body)
                    info["request_body_truncated"] = True
            except Exception:
                # Body already consumed or not available
                pass

        return info

    async def _build_response_info(self, response: Response) -> Dict[str, Any]:
        """Build additional response information"""
        info = {}

        if self.include_response_body and hasattr(response, "body"):
            try:
                body = response.body
                if len(body) <= self.max_body_size:
                    try:
                        body_str = (
                            body.decode("utf-8")
                            if isinstance(body, bytes)
                            else bytes(body).decode("utf-8")
                        )
                        info["response_body"] = json.loads(body_str)
                    except (json.JSONDecodeError, UnicodeDecodeError):
                        info["response_body_size"] = len(body)
                else:
                    info["response_body_size"] = len(body)
                    info["response_body_truncated"] = True
            except Exception:
                pass

        return info

    def _track_user_action(self, request: Request, user_id: str):
        """Track user actions based on request patterns"""
        method = request.method
        path = request.url.path

        # Map endpoints to user actions
        action_mapping = {
            # Updated paths for new API structure - all modules now working!
            (
                "POST",
                "/api/v1/documents/upload",
            ): "document_upload",  # Restored - documents module fixed
            ("GET", "/api/v1/documents"): "documents_view",
            (
                "POST",
                "/api/v1/document-analysis/upload",
            ): "document_upload_analysis",  # Additional endpoint
            ("GET", "/api/v1/document-analysis"): "documents_analysis_view",
            ("POST", "/api/v1/analysis/ats-score"): "ats_analysis",
            ("POST", "/api/v1/jobs/analyze"): "job_analysis",
            ("POST", "/api/v1/jobs/compare-resume"): "resume_comparison",
            (
                "POST",
                "/api/v1/profile/generate-voice-profile",
            ): "voice_profile_generation",  # Restored - profile module fixed
            ("POST", "/api/v1/ksc/generate"): "ksc_generation",
            ("GET", "/api/v1/opportunities"): "opportunities_view",
            ("GET", "/api/v1/settings"): "settings_view",
        }

        action_key = (method, path)
        if action_key in action_mapping:
            track_user_action(action_mapping[action_key], user_id)


class ErrorTrackingMiddleware(BaseHTTPMiddleware):
    """Middleware for comprehensive error tracking and alerting"""

    def __init__(self, app: ASGIApp, enable_alerting: bool = False):
        super().__init__(app)
        self.enable_alerting = enable_alerting
        self.error_thresholds = {
            "error_rate": 0.05,  # 5% error rate threshold
            "errors_per_minute": 10,  # Alert if more than 10 errors per minute
        }

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            response = await call_next(request)

            # Track non-error responses for error rate calculation
            if response.status_code < 400:
                self._track_successful_request()
            else:
                self._track_error_response(request, response)

            return response

        except Exception as e:
            self._track_exception(request, e)
            raise

    def _track_successful_request(self):
        """Track successful requests for error rate calculation"""
        collector = get_metrics_collector()
        collector.increment_counter("requests_successful_total")

    def _track_error_response(self, request: Request, response: Response):
        """Track error responses (4xx, 5xx)"""
        collector = get_metrics_collector()

        status_category = (
            "client_error" if 400 <= response.status_code < 500 else "server_error"
        )

        collector.increment_counter(f"requests_{status_category}_total")
        collector.increment_counter("requests_error_total")

        # Log error response details
        logger.warning(
            f"Error response: {response.status_code}",
            extra={
                "status_code": response.status_code,
                "method": request.method,
                "path": request.url.path,
                "status_category": status_category,
            },
        )

    def _track_exception(self, request: Request, exception: Exception):
        """Track unhandled exceptions"""
        collector = get_metrics_collector()

        error_type = type(exception).__name__

        collector.increment_counter("requests_exception_total")
        collector.increment_counter(f"exception_{error_type}_total")

        # Track detailed error information
        track_error(
            error_type=error_type,
            component="unhandled_exception",
            error_message=str(exception),
            user_id=getattr(request.state, "user_id", None),
        )


class HealthCheckMiddleware(BaseHTTPMiddleware):
    """Middleware to provide application health monitoring"""

    def __init__(self, app: ASGIApp, health_check_path: str = "/health"):
        super().__init__(app)
        self.health_check_path = health_check_path
        self.startup_time = datetime.now(timezone.utc)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Intercept health check requests
        if request.url.path == self.health_check_path:
            return await self._handle_health_check(request)

        return await call_next(request)

    async def _handle_health_check(self, request: Request) -> JSONResponse:
        """Handle health check requests with detailed system status"""
        try:
            # Get system metrics
            collector = get_metrics_collector()
            metrics_summary = collector.get_metrics_summary()

            # Check various system components
            health_status = {
                "status": "healthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "uptime_seconds": metrics_summary["uptime_seconds"],
                "version": "1.0.0",  # Should be injected from environment
                "checks": {
                    "database": await self._check_database(),
                    "cache": await self._check_cache(),
                    "external_services": await self._check_external_services(),
                },
            }

            # Determine overall health
            all_healthy = all(
                check.get("healthy", False)
                for check in health_status["checks"].values()
            )

            if not all_healthy:
                health_status["status"] = "degraded"

            # Add performance metrics
            if "performance_metrics" in metrics_summary:
                recent_errors = sum(
                    pm["error_count"]
                    for pm in metrics_summary["performance_metrics"].values()
                )
                health_status["recent_errors"] = recent_errors

            status_code = 200 if all_healthy else 503
            return JSONResponse(content=health_status, status_code=status_code)

        except Exception as e:
            logger.error("Health check failed", exc_info=True)
            return JSONResponse(
                content={
                    "status": "unhealthy",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "error": str(e),
                },
                status_code=503,
            )

    async def _check_database(self) -> Dict[str, Any]:
        """Check database connectivity"""
        try:
            # Import and test Firestore connection
            from app.core.db import db

            # Simple test - get a non-existent document (should not raise error)
            test_doc = db.collection("health_check").document("test")
            test_doc.get()  # Firestore get() is synchronous, not async

            return {"healthy": True, "service": "firestore"}
        except Exception as e:
            return {"healthy": False, "service": "firestore", "error": str(e)}

    async def _check_cache(self) -> Dict[str, Any]:
        """Check cache system health"""
        try:
            from app.core.cache_middleware import cache_health_check

            cache_status = await cache_health_check()

            return {
                "healthy": cache_status["status"] == "healthy",
                "service": "cache",
                "details": cache_status,
            }
        except Exception as e:
            return {"healthy": False, "service": "cache", "error": str(e)}

    async def _check_external_services(self) -> Dict[str, Any]:
        """Check external service dependencies"""
        # This would check AI services, email services, etc.
        # For now, return healthy as these are temporarily disabled
        return {
            "healthy": True,
            "service": "external_apis",
            "note": "AI services temporarily disabled",
        }


def add_monitoring_middleware(app: FastAPI, config: Optional[Dict[str, Any]] = None):
    """Add all monitoring middleware to the FastAPI application"""

    config = config or {}

    # Add middleware in reverse order (last added is executed first)

    # Health check middleware (should be first to intercept health requests)
    app.add_middleware(
        HealthCheckMiddleware,
        health_check_path=config.get("health_check_path", "/health"),
    )

    # Error tracking middleware
    app.add_middleware(
        ErrorTrackingMiddleware, enable_alerting=config.get("enable_alerting", False)
    )

    # Request monitoring middleware (should be last to capture everything)
    app.add_middleware(
        RequestMonitoringMiddleware,
        include_request_body=config.get("include_request_body", False),
        include_response_body=config.get("include_response_body", False),
        max_body_size=config.get("max_body_size", 1024 * 1024),
        exclude_paths=config.get(
            "exclude_paths", ["/health", "/metrics", "/docs", "/redoc"]
        ),
    )

    logger.info("Monitoring middleware added to FastAPI application")
