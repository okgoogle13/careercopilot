"""
Centralized error handling and retry logic for AI operations.
Provides consistent error handling across all Genkit flows.
"""

import asyncio
import logging
import time
from dataclasses import dataclass
from enum import Enum
from functools import wraps
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)


class AIErrorType(Enum):
    """Classification of AI-related errors."""

    RATE_LIMIT = "rate_limit"
    TIMEOUT = "timeout"
    QUOTA_EXCEEDED = "quota_exceeded"
    INVALID_REQUEST = "invalid_request"
    SERVICE_UNAVAILABLE = "service_unavailable"
    AUTHENTICATION = "authentication"
    GENERATION_FAILED = "generation_failed"
    UNKNOWN = "unknown"
    # Document processing errors
    DOCUMENT_PROCESSING_ERROR = "document_processing_error"
    API_ERROR = "api_error"
    PARSE_ERROR = "parse_error"
    PROCESSING_ERROR = "processing_error"
    # Model and generation errors
    MODEL_UNAVAILABLE = "model_unavailable"
    PROMPT_FORMATTING_ERROR = "prompt_formatting_error"
    GENERATION_ERROR = "generation_error"


@dataclass
class AIError(Exception):
    """Structured AI operation error."""

    message: str
    error_type: AIErrorType
    original_error: Optional[Exception] = None
    retry_after: Optional[int] = None

    def __str__(self):
        return f"{self.error_type.value}: {self.message}"


@dataclass
class RetryConfig:
    """Configuration for retry logic."""

    max_attempts: int = 3
    base_delay: float = 1.0
    max_delay: float = 60.0
    exponential_base: float = 2.0
    jitter: bool = True


class AIOperationHandler:
    """Handles AI operations with error handling and retry logic."""

    def __init__(self, retry_config: Optional[RetryConfig] = None):
        self.retry_config = retry_config or RetryConfig()

    def classify_error(self, error: Exception) -> AIErrorType:
        """Classify an error to determine retry strategy."""
        error_str = str(error).lower()

        if (
            "rate limit" in error_str
            or "quota" in error_str
            or "too many requests" in error_str
        ):
            return AIErrorType.RATE_LIMIT
        elif "timeout" in error_str or "deadline" in error_str:
            return AIErrorType.TIMEOUT
        elif "quota exceeded" in error_str:
            return AIErrorType.QUOTA_EXCEEDED
        elif "invalid" in error_str or "bad request" in error_str:
            return AIErrorType.INVALID_REQUEST
        elif "service unavailable" in error_str or "503" in error_str:
            return AIErrorType.SERVICE_UNAVAILABLE
        elif "authentication" in error_str or "401" in error_str:
            return AIErrorType.AUTHENTICATION
        else:
            return AIErrorType.UNKNOWN

    def should_retry(self, error_type: AIErrorType) -> bool:
        """Determine if an error type should be retried."""
        retry_errors = {
            AIErrorType.RATE_LIMIT,
            AIErrorType.TIMEOUT,
            AIErrorType.SERVICE_UNAVAILABLE,
            AIErrorType.UNKNOWN,
        }
        return error_type in retry_errors

    def calculate_delay(self, attempt: int, error_type: AIErrorType) -> float:
        """Calculate delay before retry."""
        config = self.retry_config

        # Special handling for rate limits
        if error_type == AIErrorType.RATE_LIMIT:
            base_delay = config.base_delay * 2  # Longer delays for rate limits
        else:
            base_delay = config.base_delay

        # Exponential backoff
        delay = base_delay * (config.exponential_base ** (attempt - 1))
        delay = min(delay, config.max_delay)

        # Add jitter to prevent thundering herd
        if config.jitter:
            import random

            delay *= 0.5 + random.random() * 0.5

        return delay

    async def execute_with_retry(self, operation: Callable, *args, **kwargs) -> Any:
        """
        Execute an AI operation with retry logic.

        Args:
            operation: The AI operation function to execute
            *args, **kwargs: Arguments for the operation

        Returns:
            Result of the successful operation

        Raises:
            AIError: If operation fails after all retries
        """
        last_error = None

        for attempt in range(1, self.retry_config.max_attempts + 1):
            try:
                logger.info(
                    f"Executing AI operation, attempt {attempt}/{self.retry_config.max_attempts}"
                )

                # Execute the operation
                if asyncio.iscoroutinefunction(operation):
                    result = await operation(*args, **kwargs)
                else:
                    result = operation(*args, **kwargs)

                # Validate result
                if result is None:
                    raise AIError(
                        message="AI operation returned None",
                        error_type=AIErrorType.UNKNOWN,
                    )

                logger.info(f"AI operation succeeded on attempt {attempt}")
                return result

            except Exception as e:
                last_error = e
                error_type = self.classify_error(e)

                logger.warning(
                    f"AI operation failed on attempt {attempt}: {error_type.value} - {str(e)}"
                )

                # Don't retry certain error types
                if not self.should_retry(error_type):
                    logger.error(f"Non-retryable error: {error_type.value}")
                    raise AIError(
                        message=str(e), error_type=error_type, original_error=e
                    )

                # Don't retry on the last attempt
                if attempt >= self.retry_config.max_attempts:
                    break

                # Calculate delay and wait
                delay = self.calculate_delay(attempt, error_type)
                logger.info(f"Retrying in {delay:.2f} seconds...")
                await asyncio.sleep(delay)

        # All attempts failed
        logger.error(
            f"AI operation failed after {self.retry_config.max_attempts} attempts"
        )
        raise AIError(
            message=(
                f"Operation failed after {self.retry_config.max_attempts} attempts: "
                f"{str(last_error)}"
            ),
            error_type=(
                self.classify_error(last_error) if last_error else AIErrorType.UNKNOWN
            ),
            original_error=last_error,
        )

    def execute_with_retry_sync(self, operation: Callable, *args, **kwargs) -> Any:
        """Synchronous variant of execute_with_retry for non-async operations."""
        last_error = None

        for attempt in range(1, self.retry_config.max_attempts + 1):
            try:
                logger.info(
                    f"Executing AI operation (sync), attempt {attempt}/{self.retry_config.max_attempts}"
                )

                result = operation(*args, **kwargs)

                if result is None:
                    raise AIError(
                        message="AI operation returned None",
                        error_type=AIErrorType.UNKNOWN,
                    )

                logger.info(f"AI operation (sync) succeeded on attempt {attempt}")
                return result

            except Exception as e:
                last_error = e
                error_type = self.classify_error(e)

                logger.warning(
                    f"AI operation (sync) failed on attempt {attempt}: {error_type.value} - {str(e)}"
                )

                if not self.should_retry(error_type):
                    logger.error(f"Non-retryable error: {error_type.value}")
                    raise AIError(
                        message=str(e), error_type=error_type, original_error=e
                    )

                if attempt >= self.retry_config.max_attempts:
                    break

                delay = self.calculate_delay(attempt, error_type)
                logger.info(f"Retrying in {delay:.2f} seconds...")
                time.sleep(delay)

        logger.error(
            f"AI operation (sync) failed after {self.retry_config.max_attempts} attempts"
        )
        raise AIError(
            message=(
                f"Operation failed after {self.retry_config.max_attempts} attempts: "
                f"{str(last_error)}"
            ),
            error_type=(
                self.classify_error(last_error) if last_error else AIErrorType.UNKNOWN
            ),
            original_error=last_error,
        )


def with_ai_error_handling(retry_config: Optional[RetryConfig] = None):
    """
    Decorator to add error handling and retry logic to AI operations.

    Args:
        retry_config: Optional retry configuration

    Usage:
        @with_ai_error_handling()
        async def my_ai_operation():
            # AI operation code here
            pass
    """

    def decorator(func: Callable) -> Callable:
        if asyncio.iscoroutinefunction(func):

            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                handler = AIOperationHandler(retry_config)
                return await handler.execute_with_retry(func, *args, **kwargs)

            return async_wrapper
        else:

            @wraps(func)
            def sync_wrapper(*args, **kwargs):
                handler = AIOperationHandler(retry_config)
                return handler.execute_with_retry_sync(func, *args, **kwargs)

            return sync_wrapper

    return decorator


def validate_ai_response(response: Any, expected_type: type = str) -> Any:
    """
    Validate AI response before returning to caller.

    Args:
        response: Response from AI operation
        expected_type: Expected type of response

    Returns:
        Validated response

    Raises:
        AIError: If response is invalid
    """
    if response is None:
        raise AIError(
            message="AI response is None", error_type=AIErrorType.INVALID_REQUEST
        )

    if expected_type and not isinstance(response, expected_type):
        raise AIError(
            message=f"AI response type mismatch: expected {expected_type}, got {type(response)}",
            error_type=AIErrorType.INVALID_REQUEST,
        )

    if isinstance(response, str) and not response.strip():
        raise AIError(
            message="AI response is empty", error_type=AIErrorType.INVALID_REQUEST
        )

    return response


# Pre-configured handlers for common use cases
default_handler = AIOperationHandler()
quick_handler = AIOperationHandler(RetryConfig(max_attempts=2, base_delay=0.5))
patient_handler = AIOperationHandler(RetryConfig(max_attempts=5, max_delay=120.0))


# Convenience functions
async def safe_ai_call(operation: Callable, *args, **kwargs) -> Any:
    """Execute AI operation with default error handling."""
    return await default_handler.execute_with_retry(operation, *args, **kwargs)


def create_user_friendly_error(ai_error: AIError) -> str:
    """Convert AIError to user-friendly message."""
    error_messages = {
        AIErrorType.RATE_LIMIT: "AI service is currently busy. Please try again in a few minutes.",
        AIErrorType.TIMEOUT: "The AI request took too long. Please try again.",
        AIErrorType.QUOTA_EXCEEDED: "AI service quota exceeded. Please try again later.",
        AIErrorType.INVALID_REQUEST: "Invalid request. Please check your input and try again.",
        AIErrorType.SERVICE_UNAVAILABLE: "AI service is temporarily unavailable. Please try again later.",
        AIErrorType.AUTHENTICATION: "Authentication error. Please refresh the page and try again.",
        AIErrorType.UNKNOWN: "An unexpected error occurred. Please try again.",
    }

    return error_messages.get(ai_error.error_type, error_messages[AIErrorType.UNKNOWN])
