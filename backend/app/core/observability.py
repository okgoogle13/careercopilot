"""
Consolidated Observability Module for CareerCopilot

This module unifies logging, monitoring, and performance tracking into a single,
cohesive interface. It replaces redundant configurations in:
- logging_config.py
- loguru_config.py
- monitoring.py
- monitoring_middleware.py
"""

import asyncio
import contextvars
import json
import os
import sys
import time
import uuid
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Type

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

# Optional dependencies
try:
    from loguru import logger
except ImportError:
    import logging

    logger = logging.getLogger("careercopilot")  # type: ignore[assignment]

try:
    from prometheus_client import CONTENT_TYPE_LATEST, REGISTRY, Counter, Histogram, generate_latest

    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False

try:
    import psutil
except ImportError:
    psutil = None  # type: ignore[assignment]

# =============================================================================
# Context Variables
# =============================================================================

request_id_context: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "request_id", default=None
)
user_id_context: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "user_id", default=None
)

# =============================================================================
# Logging Configuration
# =============================================================================


def configure_logging(
    environment: Optional[str] = None,
    log_dir: str = "logs",
    service_name: str = "careercopilot",
) -> None:
    """Configure structured logging for the application."""
    if environment is None:
        environment = os.getenv("ENV", "development").lower()

    # Remove default handler if using loguru
    if hasattr(logger, "remove"):
        logger.remove()

    Path(log_dir).mkdir(parents=True, exist_ok=True)

    json_format = (
        f'{{"timestamp": "{{time:YYYY-MM-DDTHH:mm:ss.SSSZ}}", '
        f'"level": "{{level}}", '
        f'"service": "{service_name}", '
        f'"request_id": "{{extra[request_id]}}", '
        f'"user_id": "{{extra[user_id]}}", '
        f'"message": "{{message}}", '
        f'"module": "{{module}}", '
        f'"function": "{{function}}", '
        f'"line": {{line}}}}'
    )

    simple_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{extra[request_id]}</cyan> | "
        "<level>{message}</level>"
    )

    # In Loguru, we can use a filter to inject context vars into 'extra'
    def inject_context(record):
        record["extra"]["request_id"] = request_id_context.get() or "-"
        record["extra"]["user_id"] = user_id_context.get() or "-"
        return True

    if environment == "development":
        if hasattr(logger, "add"):
            logger.add(
                sys.stdout,
                format=simple_format,
                level="DEBUG",
                colorize=True,
                filter=inject_context,
            )
            logger.add(
                f"{log_dir}/debug.log",
                format=simple_format,
                level="DEBUG",
                rotation="10 MB",
                filter=inject_context,
            )
    else:
        if hasattr(logger, "add"):
            logger.add(
                sys.stdout, format=json_format, level="INFO", serialize=False, filter=inject_context
            )
            logger.add(
                f"{log_dir}/app.log",
                format=json_format,
                level="INFO",
                rotation="50 MB",
                retention="14 days",
                filter=inject_context,
            )
            logger.add(
                f"{log_dir}/error.log",
                format=json_format,
                level="ERROR",
                rotation="10 MB",
                filter=inject_context,
            )


def get_logger(name: str):
    """Get a logger instance with specified name."""
    if hasattr(logger, "bind"):
        return logger.bind(context=name)
    return logger


# =============================================================================
# Metrics Initialization
# =============================================================================

_metrics: Dict[str, Any] = {}


def _init_metrics():
    """Initialize Prometheus metrics if available.
    Checks REGISTRY to avoid "Duplicated timeseries" errors during re-imports or testing.
    """
    if not PROMETHEUS_AVAILABLE:
        return

    # Helper to check if metric is already registered
    def is_registered(name):
        return any(
            c._name == name for c in REGISTRY._collector_to_names.keys() if hasattr(c, "_name")
        )

    if "http_requests" not in _metrics:
        name = "http_requests_total"
        if not is_registered(name):
            _metrics["http_requests"] = Counter(
                name, "Total HTTP requests", ["method", "endpoint", "status", "env"]
            )
        else:
            # Re-bind if already registered in this process (e.g. during reload)
            # This is a bit tricky with prometheus_client, but often just getting it from registry works
            # For simplicity, we just skip if already there and it will be handled by the next check if needed
            pass

    if "http_duration" not in _metrics:
        name = "http_request_duration_seconds"
        if not is_registered(name):
            _metrics["http_duration"] = Histogram(
                name, "HTTP request duration", ["method", "endpoint", "env"]
            )

    if "ai_operations" not in _metrics:
        name = "ai_operations_total"
        if not is_registered(name):
            _metrics["ai_operations"] = Counter(
                name, "Total AI operations", ["operation", "status", "env"]
            )

    if "ai_duration" not in _metrics:
        name = "ai_operation_duration_seconds"
        if not is_registered(name):
            _metrics["ai_duration"] = Histogram(name, "AI operation duration", ["operation", "env"])


_init_metrics()

# =============================================================================
# Performance Monitoring Decorators
# =============================================================================


def monitor_performance(operation_name: Optional[str] = None):
    """Decorator to monitor function performance and log results."""

    def decorator(func: Callable):
        op_name = operation_name or f"{func.__module__}.{func.__name__}"
        env = os.getenv("ENV", "development")

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start = time.perf_counter()
            rid = request_id_context.get() or "no-request"
            try:
                result = await func(*args, **kwargs)
                duration = time.perf_counter() - start

                if PROMETHEUS_AVAILABLE:
                    _metrics["ai_operations"].labels(
                        operation=op_name, status="success", env=env
                    ).inc()
                    _metrics["ai_duration"].labels(operation=op_name, env=env).observe(duration)

                logger.info(
                    "Operation {operation} succeeded in {duration:.3f}s",
                    operation=op_name,
                    duration=duration,
                    request_id=rid,
                )
                return result
            except Exception as e:
                duration = time.perf_counter() - start
                if PROMETHEUS_AVAILABLE:
                    _metrics["ai_operations"].labels(
                        operation=op_name, status="error", env=env
                    ).inc()

                logger.error(
                    "Operation {operation} failed after {duration:.3f}s: {error}",
                    operation=op_name,
                    duration=duration,
                    request_id=rid,
                    error=str(e),
                )
                raise

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start = time.perf_counter()
            rid = request_id_context.get() or "no-request"
            try:
                result = func(*args, **kwargs)
                duration = time.perf_counter() - start

                if PROMETHEUS_AVAILABLE:
                    _metrics["ai_operations"].labels(
                        operation=op_name, status="success", env=env
                    ).inc()
                    _metrics["ai_duration"].labels(operation=op_name, env=env).observe(duration)

                logger.info(
                    "Operation {operation} succeeded in {duration:.3f}s",
                    operation=op_name,
                    duration=duration,
                    request_id=rid,
                )
                return result
            except Exception as e:
                duration = time.perf_counter() - start
                if PROMETHEUS_AVAILABLE:
                    _metrics["ai_operations"].labels(
                        operation=op_name, status="error", env=env
                    ).inc()

                logger.error(
                    f"Operation {op_name} failed after {duration:.3f}s: {e}",
                    operation=op_name,
                    duration=duration,
                    request_id=rid,
                    error=str(e),
                )
                raise

        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper

    return decorator


# =============================================================================
# FastAPI Middleware
# =============================================================================


class UnifiedObservabilityMiddleware(BaseHTTPMiddleware):
    """Middleware combining request tracking, logging, and metrics."""

    def __init__(self, app: ASGIApp, exclude_paths: Optional[List[str]] = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or ["/health", "/metrics", "/ready", "/docs", "/redoc"]
        self.env = os.getenv("ENV", "development")

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if any(request.url.path.startswith(p) for p in self.exclude_paths):
            return await call_next(request)

        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request_id_context.set(request_id)

        # User ID extraction (simplified)
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            user_id_context.set(str(user_id))

        start_time = time.perf_counter()
        method = request.method
        path = request.url.path

        logger.info(f"REST Request: {method} {path}")

        try:
            response = await call_next(request)
            duration = time.perf_counter() - start_time
            status = str(response.status_code)

            if PROMETHEUS_AVAILABLE:
                _metrics["http_requests"].labels(
                    method=method, endpoint=path, status=status, env=self.env
                ).inc()
                _metrics["http_duration"].labels(
                    method=method, endpoint=path, env=self.env
                ).observe(duration)

            logger.info(f"REST Response: {status} in {duration:.3f}s")

            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{duration:.3f}s"
            return response

        except Exception as e:
            duration = time.perf_counter() - start_time
            if PROMETHEUS_AVAILABLE:
                _metrics["http_requests"].labels(
                    method=method, endpoint=path, status="500", env=self.env
                ).inc()

            logger.error(f"REST Request Failed: {e}")
            return JSONResponse(
                status_code=500,
                content={"error": "Internal Server Error", "request_id": request_id},
            )


def track_user_action(action: str, user_id: str, **metadata):
    """Track user actions (stub)."""
    logger.info(f"User Action: {action} (User: {user_id})", extra={"metadata": metadata})


def track_ai_usage(
    operation_type: str, user_id: str, tokens_used: Optional[int] = None, cached: bool = False
):
    """Track AI operation usage (stub)."""
    logger.info(
        f"AI Usage: {operation_type} (User: {user_id}, Tokens: {tokens_used}, Cached: {cached})"
    )


def track_error(error_type: str, component: str, error_message: str, user_id: Optional[str] = None):
    """Track application errors (stub)."""
    logger.error(
        f"Error in {component}: {error_type} - {error_message}", extra={"user_id": user_id}
    )


def get_metrics_collector():
    """Get metrics collector (stub)."""

    class StubCollector:
        def increment_counter(self, *args, **kwargs):
            pass

        def record_histogram(self, *args, **kwargs):
            pass

        def set_gauge(self, *args, **kwargs):
            pass

        def record_performance(self, *args, **kwargs):
            pass

        def get_metrics_summary(self):
            return {"uptime_seconds": 0}

    return StubCollector()


def setup_observability(app: FastAPI, environment: Optional[str] = None):
    """Initialize everything for a FastAPI app."""
    configure_logging(environment)
    app.add_middleware(UnifiedObservabilityMiddleware)

    if PROMETHEUS_AVAILABLE:

        @app.get("/metrics", include_in_schema=False)
        async def metrics_endpoint():
            return Response(generate_latest(REGISTRY), media_type=CONTENT_TYPE_LATEST)

    @app.get("/health", include_in_schema=False)
    async def health():
        return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}
