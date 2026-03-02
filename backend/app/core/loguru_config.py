"""
Modern structured logging configuration using Loguru for CareerCopilot.

This module provides enhanced logging with automatic JSON formatting,
better performance, and simplified configuration compared to the standard logging module.
"""

import os
import sys
from pathlib import Path
<<<<<<< HEAD
from typing import Any, Optional
=======
from typing import Any
>>>>>>> restoration-KR-Rage-Figma-v2.0

try:
    from loguru import logger
except ImportError:  # pragma: no cover - optional dependency in test/CI
    import logging

    class _LoguruFallback:
        def __init__(self):
            self._logger = logging.getLogger("careercopilot")

        def add(self, *args, **kwargs):
            return None

        def remove(self, *args, **kwargs):
            return None

        def bind(self, **kwargs):
            return self

        def debug(self, *args, **kwargs):
            return self._logger.debug(*args, **kwargs)

        def info(self, *args, **kwargs):
            return self._logger.info(*args, **kwargs)

        def warning(self, *args, **kwargs):
            return self._logger.warning(*args, **kwargs)

        def error(self, *args, **kwargs):
            return self._logger.error(*args, **kwargs)

        def exception(self, *args, **kwargs):
            return self._logger.exception(*args, **kwargs)

    logger = _LoguruFallback()


def configure_loguru(
<<<<<<< HEAD
    environment: Optional[str] = None,
=======
    environment: str | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
    log_dir: str = "logs",
    service_name: str = "careercopilot",
) -> None:
    """
    Configure Loguru for structured JSON logging with environment-specific settings.

    Args:
        environment: Target environment ('development', 'staging', 'production')
        log_dir: Directory for log files
        service_name: Service name for logging context
    """

    # Remove default handler
    logger.remove()

    if environment is None:
        environment = os.getenv("ENV", "development").lower()

    # Create logs directory
    Path(log_dir).mkdir(parents=True, exist_ok=True)

    # Common JSON format for structured logging
    json_format = (
        f'{{"timestamp": "{{time:YYYY-MM-DDTHH:mm:ss.SSSZ}}", '
        f'"level": "{{level}}", '
        f'"service": "{service_name}", '
        f'"logger": "{{name}}", '
        f'"message": "{{message}}", '
        f'"module": "{{module}}", '
        f'"function": "{{function}}", '
        f'"line": {{line}}, '
        f'"process": {{process}}, '
        f'"thread": "{{thread.name}}",'
        f'"extra": "{{extra}}"}}'
    )

    # Simple format for development
    simple_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )

    if environment == "development":
        # Console output with colors for development
        logger.add(
            sys.stdout,
            format=simple_format,
            level="DEBUG",
            colorize=True,
            serialize=False,
        )

        # Debug file with rotation
        logger.add(
            f"{log_dir}/debug.log",
            format=simple_format,
            level="DEBUG",
            rotation="10 MB",
            retention="7 days",
            compression="gz",
            serialize=False,
        )

    elif environment == "staging":
        # JSON console output for staging
        logger.add(
            sys.stdout,
            format=json_format,
            level="INFO",
            serialize=False,
        )

        # Application log with rotation
        logger.add(
            f"{log_dir}/app.log",
            format=json_format,
            level="INFO",
            rotation="50 MB",
            retention="14 days",
            compression="gz",
            serialize=False,
        )

        # Error log for critical issues
        logger.add(
            f"{log_dir}/error.log",
            format=json_format,
            level="ERROR",
            rotation="10 MB",
            retention="30 days",
            compression="gz",
            serialize=False,
        )

    elif environment == "production":
        # JSON console output for container logs
        logger.add(
            sys.stdout,
            format=json_format,
            level="INFO",
            serialize=False,
        )

        # Error-only file log for production
        logger.add(
            f"{log_dir}/error.log",
            format=json_format,
            level="ERROR",
            rotation="10 MB",
            retention="90 days",
            compression="gz",
            serialize=False,
        )

        # Critical issues log
        logger.add(
            f"{log_dir}/critical.log",
            format=json_format,
            level="CRITICAL",
            rotation="5 MB",
            retention="1 year",
            compression="gz",
            serialize=False,
        )

    # Log the configuration
    logger.info(
        "Loguru logging configured",
        environment=environment,
        log_directory=log_dir,
        service=service_name,
    )


def get_logger(name: str) -> Any:
    """
    Get a Loguru logger instance with context.

    Args:
        name: Logger context name (typically __name__)

    Returns:
        Loguru logger instance
    """
    return logger.bind(context=name)


<<<<<<< HEAD
def add_request_context(request_id: str, user_id: Optional[str] = None, **extra: Any) -> Any:
=======
def add_request_context(request_id: str, user_id: str | None = None, **extra: Any) -> Any:
>>>>>>> restoration-KR-Rage-Figma-v2.0
    """
    Add request context to Loguru logger.

    Args:
        request_id: Unique request identifier
        user_id: Optional user identifier
        **extra: Additional context fields

    Returns:
        Logger with request context
    """
    context = {"request_id": request_id}
    if user_id:
        context["user_id"] = user_id
    context.update(extra)

    return logger.bind(**context)


class LoggerMixin:
    """Mixin class to add Loguru logging capability to any class."""

    @property
    def logger(self) -> Any:
        """Get Loguru logger instance for this class."""
        return logger.bind(
            class_name=self.__class__.__name__,
            module=self.__class__.__module__,
        )


def log_function_call(level: str = "DEBUG", exclude_args: bool = True):
    """
    Decorator to log function calls with Loguru.

    Args:
        level: Logging level for the messages
        exclude_args: Whether to exclude function arguments from logs
    """

    def decorator(func):
        import asyncio
        from functools import wraps

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            func_logger = logger.bind(function=func.__name__, module=func.__module__)

            log_data = {"function": func.__name__}
            if not exclude_args:
                log_data.update(
                    {
                        "args_count": len(args),
                        "kwargs_keys": list(kwargs.keys()),
                    }
                )

            func_logger.log(level, f"Calling {func.__name__}", **log_data)

            try:
                result = func(*args, **kwargs)
                func_logger.log(
                    level,
                    f"Function {func.__name__} completed",
                    function=func.__name__,
                    result_type=type(result).__name__,
                )
                return result
            except Exception as e:
                func_logger.error(
<<<<<<< HEAD
                    f"Function {func.__name__} failed: {str(e)}",
=======
                    f"Function {func.__name__} failed: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    function=func.__name__,
                    error_type=type(e).__name__,
                    exc_info=True,
                )
                raise

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            func_logger = logger.bind(function=func.__name__, module=func.__module__)

            log_data = {"function": func.__name__}
            if not exclude_args:
                log_data.update(
                    {
                        "args_count": len(args),
                        "kwargs_keys": list(kwargs.keys()),
                    }
                )

            func_logger.log(level, f"Calling async {func.__name__}", **log_data)

            try:
                result = await func(*args, **kwargs)
                func_logger.log(
                    level,
                    f"Async function {func.__name__} completed",
                    function=func.__name__,
                    result_type=type(result).__name__,
                )
                return result
            except Exception as e:
                func_logger.error(
<<<<<<< HEAD
                    f"Async function {func.__name__} failed: {str(e)}",
=======
                    f"Async function {func.__name__} failed: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    function=func.__name__,
                    error_type=type(e).__name__,
                    exc_info=True,
                )
                raise

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


# Performance monitoring decorator
def log_performance(threshold_ms: float = 1000.0):
    """
    Decorator to log slow function executions.

    Args:
        threshold_ms: Log if execution time exceeds this threshold in milliseconds
    """

    def decorator(func):
        import asyncio
        import time
        from functools import wraps

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            result = func(*args, **kwargs)
            execution_time = (time.perf_counter() - start_time) * 1000

            if execution_time > threshold_ms:
                logger.warning(
                    f"Slow function execution: {func.__name__}",
                    function=func.__name__,
                    execution_time_ms=round(execution_time, 2),
                    threshold_ms=threshold_ms,
                )

            return result

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            result = await func(*args, **kwargs)
            execution_time = (time.perf_counter() - start_time) * 1000

            if execution_time > threshold_ms:
                logger.warning(
                    f"Slow async function execution: {func.__name__}",
                    function=func.__name__,
                    execution_time_ms=round(execution_time, 2),
                    threshold_ms=threshold_ms,
                )

            return result

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


# Security-focused logging helpers
def log_security_event(event_type: str, **context: Any) -> None:
    """
    Log security-related events with special handling.

    Args:
        event_type: Type of security event
        **context: Additional context for the event
    """
    logger.warning(
        f"Security event: {event_type}",
        event_type=event_type,
        security=True,
        **context,
    )


def log_audit_event(action: str, resource: str, **context: Any) -> None:
    """
    Log audit events for compliance tracking.

    Args:
        action: Action performed
        resource: Resource affected
        **context: Additional context
    """
    logger.info(
        f"Audit: {action} on {resource}",
        action=action,
        resource=resource,
        audit=True,
        **context,
    )
