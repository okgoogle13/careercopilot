"""
Cache decorators for AI operations

Provides easy-to-use decorators for caching AI function results
"""

import functools
<<<<<<< HEAD
import inspect
import logging
from datetime import timedelta
from typing import Any, Callable, Dict, List, Optional, TypeVar, cast
=======
import logging
from collections.abc import Callable
from datetime import timedelta
from typing import Any, TypeVar, cast
>>>>>>> restoration-KR-Rage-Figma-v2.0

from .personal_cache import get_ai_cache

logger = logging.getLogger(__name__)


def cached_ai_operation(
    operation_type: str,
    user_id_param: str = "user_id",
<<<<<<< HEAD
    cache_key_params: Optional[List[str]] = None,
    exclude_params: Optional[List[str]] = None,
=======
    cache_key_params: list[str] | None = None,
    exclude_params: list[str] | None = None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
                # Extract user ID from parameters
                user_id = None
                if user_id_param in kwargs:
                    user_id = kwargs[user_id_param]
                else:
                    # Try to find user_id in args based on function signature
<<<<<<< HEAD
=======
                    import inspect

>>>>>>> restoration-KR-Rage-Figma-v2.0
                    sig = inspect.signature(func)
                    param_names = list(sig.parameters.keys())
                    if user_id_param in param_names:
                        param_index = param_names.index(user_id_param)
                        if param_index < len(args):
                            user_id = args[param_index]

                if not user_id:
                    logger.warning(f"Could not extract user_id for caching {operation_type}")
                    return await func(*args, **kwargs)

                # Prepare cache input data
<<<<<<< HEAD
                input_data = _prepare_cache_input(args, kwargs, cache_key_params, exclude_params)

                # Try to get from cache
                cached_result = await cache.get_ai_operation(operation_type, input_data, user_id)
=======
                _prepare_cache_input(args, kwargs, cache_key_params, exclude_params)

                # Try to get from cache
                cached_result = await cache.get(operation_type, user_id)
>>>>>>> restoration-KR-Rage-Figma-v2.0
                if cached_result is not None:
                    return cached_result

                # Execute function and cache result
                result = await func(*args, **kwargs)

                # Cache the result with TTL from cache config
                cache_config = cache.CACHE_CONFIGS.get("default", {})
                ttl_seconds = cache_config.get("ttl", 3600)  # Default 1 hour TTL
<<<<<<< HEAD
                ttl = timedelta(seconds=ttl_seconds) if ttl_seconds else timedelta(hours=1)

                # Convert result to dict if it's not already
                cache_value = result if isinstance(result, dict) else {"value": result}
                await cache.cache_ai_operation(
                    operation_type, input_data, cache_value, user_id, ttl
                )
=======
                ttl = timedelta(seconds=ttl_seconds) if ttl_seconds else None

                # Convert result to dict if it's not already
                cache_value = result if isinstance(result, dict) else {"value": result}
                await cache.set(operation_type, user_id, cache_value, ttl=ttl)
>>>>>>> restoration-KR-Rage-Figma-v2.0

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
<<<<<<< HEAD
    cache_key_params: Optional[List[str]] = None,
    exclude_params: Optional[List[str]] = None,
) -> Dict[str, Any]:
=======
    cache_key_params: list[str] | None = None,
    exclude_params: list[str] | None = None,
) -> dict[str, Any]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
    user_id: str, operation_types: Optional[List[str]] = None
=======
    user_id: str, operation_types: list[str] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
        self.operation_type = operation_type
        self.user_id = user_id
        self.input_data = input_data
        self.cache = get_ai_cache()
        self.result = None

    async def __aenter__(self):
<<<<<<< HEAD
        self.result = await self.cache.get_ai_operation(
            self.operation_type, self.input_data, self.user_id
        )
=======
        self.result = await self.cache.get(self.operation_type, self.user_id, self.input_data)
>>>>>>> restoration-KR-Rage-Figma-v2.0
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Cache cleanup or additional logic could go here
        pass

    async def set_result(self, result: Any) -> bool:
        """Cache a result within the context"""
<<<<<<< HEAD
        # Convert result to dict if needed
        result_data = result if isinstance(result, dict) else {"value": result}
        return await self.cache.cache_ai_operation(
            self.operation_type, self.input_data, result_data, self.user_id
        )
=======
        return await self.cache.set(self.operation_type, self.user_id, self.input_data, result)
>>>>>>> restoration-KR-Rage-Figma-v2.0


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
