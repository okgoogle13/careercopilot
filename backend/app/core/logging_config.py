"""
Comprehensive logging configuration for CareerCopilot

Provides structured logging with different levels, formatters, and outputs
for development, staging, and production environments.
"""

import contextvars
import json
import logging
import logging.config
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


class StructuredFormatter(logging.Formatter):
    """Custom formatter for structured JSON logging"""

    def __init__(self, include_extra: bool = True):
        super().__init__()
        self.include_extra = include_extra

    def format(self, record: logging.LogRecord) -> str:
        """Format log record as structured JSON"""

        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add exception information if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        # Add extra fields if configured
        if self.include_extra:
            extra_fields = {}
            for key, value in record.__dict__.items():
                if key not in [
                    "name",
                    "msg",
                    "args",
                    "levelname",
                    "levelno",
                    "pathname",
                    "filename",
                    "module",
                    "exc_info",
                    "exc_text",
                    "stack_info",
                    "lineno",
                    "funcName",
                    "created",
                    "msecs",
                    "relativeCreated",
                    "thread",
                    "threadName",
                    "processName",
                    "process",
                    "message",
                ]:
                    extra_fields[key] = value

            if extra_fields:
                log_entry["extra"] = extra_fields

        return json.dumps(log_entry, default=str)


class RequestContextFilter(logging.Filter):
    """Filter to add request context to log records"""

    def filter(self, record: logging.LogRecord) -> bool:
        # Add request context if available (will be set by middleware)
        if hasattr(record, "request_id"):
            return True

        # Try to get context from current request
        try:
            pass

            if hasattr(self, "_request_context"):
                context = getattr(self, "_request_context", {})
                for key, value in context.items():
                    setattr(record, key, value)
        except ImportError:
            pass

        return True


def get_logging_config(environment: str | None = None) -> dict[str, Any]:
    """
    Generate logging configuration based on environment

    Args:
        environment: 'development', 'staging', or 'production'
    """

    if environment is None:
        environment = os.getenv("ENV", "development").lower()

    # Base configuration
    config: dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "structured": {"()": StructuredFormatter, "include_extra": True},
            "simple": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(funcName)s:%(lineno)d - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "filters": {"request_context": {"()": RequestContextFilter}},
        "handlers": {},
        "loggers": {},
        "root": {"level": "INFO", "handlers": []},
    }

    # Environment-specific configuration
    if environment == "development":
        config["handlers"] = {
            "console": {
                "class": "logging.StreamHandler",
                "level": "DEBUG",
                "formatter": "detailed",
                "stream": "ext://sys.stdout",
            },
            "file_debug": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "DEBUG",
                "formatter": "detailed",
                "filename": "logs/debug.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
            },
        }
        config["root"]["level"] = "DEBUG"
        config["root"]["handlers"] = ["console", "file_debug"]

    elif environment == "staging":
        config["handlers"] = {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "structured",
                "stream": "ext://sys.stdout",
            },
            "file_app": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "structured",
                "filename": "logs/app.log",
                "maxBytes": 52428800,  # 50MB
                "backupCount": 10,
            },
            "file_error": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "structured",
                "filename": "logs/error.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
            },
        }
        config["root"]["level"] = "INFO"
        config["root"]["handlers"] = ["console", "file_app", "file_error"]

    elif environment == "production":
        config["handlers"] = {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "structured",
                "stream": "ext://sys.stdout",
                "filters": ["request_context"],
            },
            "file_error": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "structured",
                "filename": "logs/error.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 10,
                "filters": ["request_context"],
            },
        }
        config["root"]["level"] = "WARNING"
        config["root"]["handlers"] = ["console", "file_error"]

    # Application-specific loggers
    config["loggers"].update(
        {
            "app": {
                "level": "DEBUG" if environment == "development" else "INFO",
                "handlers": [],
                "propagate": True,
            },
            "app.core.cache": {"level": "INFO", "handlers": [], "propagate": True},
            "app.genkit_flows": {"level": "INFO", "handlers": [], "propagate": True},
            "app.api": {"level": "INFO", "handlers": [], "propagate": True},
            "uvicorn.access": {"level": "INFO", "handlers": [], "propagate": True},
            "uvicorn.error": {"level": "INFO", "handlers": [], "propagate": True},
            # Third-party loggers
            "firebase_admin": {"level": "WARNING", "handlers": [], "propagate": True},
            "google.auth": {"level": "WARNING", "handlers": [], "propagate": True},
        }
    )

    return config


def setup_logging(environment: str | None = None, log_dir: str = "logs") -> None:
    """
    Setup application logging configuration

    Args:
        environment: Target environment ('development', 'staging', 'production')
        log_dir: Directory for log files
    """

    # Create logs directory if it doesn't exist
    Path(log_dir).mkdir(parents=True, exist_ok=True)

    # Get configuration
    config = get_logging_config(environment)

    # Apply configuration
    logging.config.dictConfig(config)

    # Set up root logger
    logger = logging.getLogger(__name__)
    logger.info(
        f"Logging configured for environment: {environment or 'development'}",
        extra={"environment": environment, "log_directory": log_dir},
    )


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the specified name

    Args:
        name: Logger name (typically __name__)

    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)


class LoggerMixin:
    """Mixin class to add logging capability to any class"""

    @property
    def logger(self) -> logging.Logger:
        """Get logger instance for this class"""
        return logging.getLogger(f"{self.__class__.__module__}.{self.__class__.__name__}")


def log_function_call(logger: logging.Logger | None = None, level: int = logging.DEBUG):
    """
    Decorator to log function calls with parameters and results

    Args:
        logger: Logger instance to use
        level: Logging level for the messages
    """

    def decorator(func):
        import functools

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            func_logger = logger or logging.getLogger(func.__module__)

            func_logger.log(
                level,
                f"Calling {func.__name__}",
                extra={
                    "function": func.__name__,
                    "args_count": len(args),
                    "kwargs_keys": list(kwargs.keys()),
                },
            )

            try:
                result = func(*args, **kwargs)
                func_logger.log(
                    level,
                    f"Function {func.__name__} completed successfully",
                    extra={
                        "function": func.__name__,
                        "result_type": type(result).__name__,
                    },
                )
                return result
            except Exception as e:
                func_logger.error(
                    f"Function {func.__name__} failed",
                    exc_info=True,
                    extra={"function": func.__name__, "error_type": type(e).__name__},
                )
                raise

        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            func_logger = logger or logging.getLogger(func.__module__)

            func_logger.log(
                level,
                f"Calling async {func.__name__}",
                extra={
                    "function": func.__name__,
                    "args_count": len(args),
                    "kwargs_keys": list(kwargs.keys()),
                },
            )

            try:
                result = await func(*args, **kwargs)
                func_logger.log(
                    level,
                    f"Async function {func.__name__} completed successfully",
                    extra={
                        "function": func.__name__,
                        "result_type": type(result).__name__,
                    },
                )
                return result
            except Exception as e:
                func_logger.error(
                    f"Async function {func.__name__} failed",
                    exc_info=True,
                    extra={"function": func.__name__, "error_type": type(e).__name__},
                )
                raise

        import asyncio

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


# Context managers for request tracking

request_id_context: contextvars.ContextVar[str | None] = contextvars.ContextVar(
    "request_id", default=None
)
user_id_context: contextvars.ContextVar[str | None] = contextvars.ContextVar(
    "user_id", default=None
)


class RequestContextLogger:
    """Context manager for adding request context to logs"""

    def __init__(self, request_id: str, user_id: str | None = None, **extra_context):
        self.request_id = request_id
        self.user_id = user_id
        self.extra_context = extra_context
        self.tokens: list[contextvars.Token] = []

    def __enter__(self):
        self.tokens.append(request_id_context.set(self.request_id))
        if self.user_id:
            self.tokens.append(user_id_context.set(self.user_id))
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Context variable tokens are actually Token objects
        # We need to reset them properly
        for token in reversed(self.tokens):
            # The token from set() should be reset using contextvars reset
            try:
                # Python contextvars tokens have var and old_value attributes
                token.var.set(token.old_value)
            except AttributeError:
                # Fallback: manually reset known context vars to their defaults
                if self.request_id:
                    request_id_context.set(None)
                if self.user_id:
                    user_id_context.set(None)


def get_context_logger(name: str) -> logging.LoggerAdapter:
    """Get a logger that includes request context"""
    logger = logging.getLogger(name)

    # Create a custom LoggerAdapter that adds context
    class ContextLoggerAdapter(logging.LoggerAdapter):
        def process(self, msg, kwargs):
            extra = kwargs.get("extra", {})

            # Add request context
            request_id = request_id_context.get()
            user_id = user_id_context.get()

            if request_id:
                extra["request_id"] = request_id
            if user_id:
                extra["user_id"] = user_id

            kwargs["extra"] = extra
            return msg, kwargs

    return ContextLoggerAdapter(logger, {})
