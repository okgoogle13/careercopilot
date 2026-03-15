"""
Cache decorators for AI operations

Provides easy-to-use decorators for caching AI function results
"""

import functools
import logging
from collections.abc import Callable
from datetime import timedelta
from typing import Any, TypeVar, cast

from .personal_cache import get_ai_cache

logger = logging.getLogger(__name__)


def cached_ai_operation(
    operation_type: str,
    user_id_param: str = "user_id",
    cache_key_params: list[str] | None = None,
    exclude_params: list[str] | None = None,
):
    """
    Decorator to cache AI operation results

    Args:
        operation_type: Type of AI operation (must match cache config)
        user_id_param: Name of parameter containing user ID
        cache_key_params: Specific parameters to include in cache key
        exclude_params: Parameters to exclude from cache key

    Usage:
        @cached_ai_operation('resume_analysis', user_id_param='uid')
        async def analyze_resume(uid: str, resume_text: str) -> dict:
            # AI operation here
            return result
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            cache = get_ai_cache()

            try:
                # Try to find user_id in args based on function signature
                user_id = kwargs.get(user_id_param, "default")
                cache_input = _prepare_cache_input(args, kwargs, cache_key_params, exclude_params)

                # Try to get from cache
                cached_result = await cache.get(operation_type, user_id, cache_input)
                if cached_result is not None:
                    return cached_result

                # Execute function and cache result
                result = await func(*args, **kwargs)

                # Cache the result with TTL from cache config
                cache_config = cache.CACHE_CONFIGS.get("default", {})
                ttl_seconds = cache_config.get("ttl", 3600)  # Default 1 hour TTL
                ttl = timedelta(seconds=ttl_seconds) if ttl_seconds else None

                # Convert result to dict if it's not already
                cache_value = result if isinstance(result, dict) else {"value": result}
                await cache.set(operation_type, user_id, cache_input, cache_value, ttl=ttl)

                return result

            except Exception as e:
                logger.error(f"Error in cache decorator for {operation_type}: {e}")
                # Fall back to executing function without caching
                return await func(*args, **kwargs)

        return wrapper

    return decorator


def _prepare_cache_input(
    args: tuple,
    kwargs: dict,
    cache_key_params: list[str] | None = None,
    exclude_params: list[str] | None = None,
) -> dict[str, Any]:
    """Prepare input data for cache key generation"""

    cache_input = {}

    if cache_key_params:
        # Only include specified parameters
        for param in cache_key_params:
            if param in kwargs:
                cache_input[param] = kwargs[param]
    else:
        # Include all kwargs except excluded ones
        exclude_params = exclude_params or []
        cache_input = {k: v for k, v in kwargs.items() if k not in exclude_params}

        # Add positional args
        if args:
            cache_input["_args"] = args

    return cache_input


T = TypeVar("T", bound=Callable[..., Any])


def invalidate_user_ai_cache(
    user_id: str, operation_types: list[str] | None = None
) -> Callable[[T], T]:
    """
    Decorator to invalidate user cache after function execution

    Usage:
        @invalidate_user_ai_cache('user123', ['resume_analysis'])
        async def update_user_resume(user_id: str, resume_data: dict):
            # Update operation that should invalidate cache
            pass
    """

    def decorator(func: T) -> T:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            try:
                result = await func(*args, **kwargs)
                cache = get_ai_cache()
                if operation_types:
                    for op_type in operation_types:
                        await cache.delete(op_type, user_id)
                return result
            except Exception as e:
                logger.error(f"Error in cache invalidation: {e}")
                raise

        return cast(T, wrapper)

    return decorator


class CacheContext:
    """Context manager for cache operations"""

    def __init__(self, operation_type: str, user_id: str, input_data: Any):
        if not operation_type or not user_id:
            raise ValueError("Operation type and User ID are required for CacheContext")
        self.operation_type = operation_type
        self.user_id = user_id
        self.input_data = input_data
        self.cache = get_ai_cache()
        self.result = None

    async def __aenter__(self):
        self.result = await self.cache.get(self.operation_type, self.user_id, self.input_data)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Cache cleanup or additional logic could go here
        pass

    @property
    def cached(self) -> bool:
        """Check if result was retrieved from cache"""
        return self.result is not None

    async def get_result(self) -> Any | None:
        """Retrieve the cached result"""
        return self.result

    async def set_result(self, result: Any, ttl: timedelta | int | None = None) -> bool:
        """Cache a result within the context"""
        # If result is assigned to the context instance, consider it cached
        self.result = result
        return await self.cache.set(
            self.operation_type, self.user_id, self.input_data, result, ttl=ttl
        )

    @property
    def cache_key(self) -> str:
        """Get the cache key for this context"""
        if hasattr(self.cache, "_generate_key"):
            return self.cache._generate_key(self.operation_type, self.user_id, self.input_data)
        return f"{self.operation_type}:{self.user_id}"


# Usage example with context manager:
"""
async def some_ai_operation(user_id: str, input_text: str):
    cache_input = {'input_text': input_text}

    async with CacheContext('resume_analysis', user_id, cache_input) as cached:
        if cached is not None:
            return cached

        # Perform expensive AI operation
        result = await expensive_ai_call(input_text)

        # Cache the result
        await cache_context.set_result(result)

        return result
"""
