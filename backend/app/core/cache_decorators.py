"""
Cache decorators for AI operations

Provides easy-to-use decorators for caching AI function results
"""

import functools
import logging
from typing import Any, Callable, Dict, List, Optional

from .cache import get_ai_cache

logger = logging.getLogger(__name__)


def cached_ai_operation(
    operation_type: str,
    user_id_param: str = "user_id",
    cache_key_params: Optional[List[str]] = None,
    exclude_params: Optional[List[str]] = None,
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
                    import inspect

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
                cache_input = _prepare_cache_input(args, kwargs, cache_key_params, exclude_params)

                # Try to get from cache
                cached_result = await cache.get(operation_type, user_id, cache_input)
                if cached_result is not None:
                    return cached_result

                # Execute function and cache result
                result = await func(*args, **kwargs)

                # Cache the result
                await cache.set(operation_type, user_id, cache_input, result)

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
    cache_key_params: Optional[List[str]] = None,
    exclude_params: Optional[List[str]] = None,
) -> Dict[str, Any]:
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


def invalidate_user_ai_cache(user_id: str, operation_types: Optional[List[str]] = None):
    """
    Decorator to invalidate user cache after function execution

    Usage:
        @invalidate_user_ai_cache('user123', ['resume_analysis'])
        async def update_user_resume(user_id: str, resume_data: dict):
            # Update operation that should invalidate cache
            pass
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            result = await func(*args, **kwargs)

            try:
                cache = get_ai_cache()
                await cache.invalidate_user_cache(user_id, operation_types)
            except Exception as e:
                logger.error(f"Error invalidating cache for user {user_id}: {e}")

            return result

        return wrapper

    return decorator


class CacheContext:
    """Context manager for cache operations"""

    def __init__(self, operation_type: str, user_id: str, input_data: Any):
        self.operation_type = operation_type
        self.user_id = user_id
        self.input_data = input_data
        self.cache = get_ai_cache()
        self.cached_result = None

    async def __aenter__(self):
        self.cached_result = await self.cache.get(
            self.operation_type, self.user_id, self.input_data
        )
        return self.cached_result

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Cache cleanup or additional logic could go here
        pass

    async def set_result(self, result: Any) -> bool:
        """Cache a result within the context"""
        return await self.cache.set(self.operation_type, self.user_id, self.input_data, result)


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
