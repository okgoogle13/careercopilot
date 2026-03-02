"""
flow_decorator.py

Centralized Genkit flow decorator system for standardizing flow definitions.
Handles common setup logic including model initialization, error handling, and flow registration.
"""

import functools
import logging
import importlib
from typing import Any, Callable, Optional, Type, TypeVar, ParamSpec, Awaitable, cast, overload

from pydantic import BaseModel

from app.core.genkit import get_model, is_genkit_enabled, register_flow_function

# Try to import Genkit for decorators, with fallback, keeping a typed 'genkit' symbol
try:
    _genkit = importlib.import_module("genkit.python")
    ai = cast(Any, _genkit)
    GENKIT_AVAILABLE = True
except ImportError:
    ai = cast(Any, None)
    GENKIT_AVAILABLE = False

logger = logging.getLogger(__name__)

# Generic parameters for wrapped functions
P = ParamSpec("P")
R = TypeVar("R")


class FlowConfig:
    """Configuration class for flow decorator settings."""

    def __init__(
        self,
        name: Optional[str] = None,
        output_schema: Optional[Type[BaseModel]] = None,
        require_model: bool = True,
        auto_register: bool = True,
        enable_logging: bool = True,
    ):
        self.name = name
        self.output_schema = output_schema
        self.require_model = require_model
        self.auto_register = auto_register
        self.enable_logging = enable_logging


def genkit_flow(
    name: Optional[str] = None,
    output_schema: Optional[Type[BaseModel]] = None,
    require_model: bool = True,
    auto_register: bool = True,
    enable_logging: bool = True,
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """
    Standardized decorator for Genkit flows that handles common setup logic.

    Args:
        name: Optional name for the flow (defaults to function name)
        output_schema: Pydantic model for structured output
        require_model: Whether to require model availability (default: True)
        auto_register: Whether to automatically register the flow (default: True)
        enable_logging: Whether to enable flow execution logging (default: True)

    Returns:
        Decorated function with standardized Genkit flow setup

    Example:
        @genkit_flow(output_schema=MyResponse)
        def my_flow(input_text: str) -> MyResponse:
            # Flow logic here - model is available via get_model()
            model = get_model()  # type: ignore[no-untyped-call]
            response = model.generate(input_text)
            return response.output()
    """

    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        flow_name = name or func.__name__

        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            if enable_logging:
                logger.info(f"Executing flow: {flow_name}")

            # Check model availability if required
            if require_model:
                model = get_model()  # type: ignore[no-untyped-call]
                if not model:
                    error_msg = f"Genkit model not available for flow: {flow_name}"
                    logger.error(error_msg)
                    raise RuntimeError(error_msg)

            try:
                result = func(*args, **kwargs)

                if enable_logging:
                    logger.debug(f"Flow {flow_name} completed successfully")

                return result

            except Exception as e:
                if enable_logging:
                    logger.error(f"Flow {flow_name} failed: {str(e)}", exc_info=True)
                raise

        # Apply Genkit decorator if available and enabled
        if GENKIT_AVAILABLE and is_genkit_enabled():
            genkit_decorator_kwargs = {}
            if output_schema:
                genkit_decorator_kwargs["output_schema"] = output_schema

            decorated_any = ai.flow(**genkit_decorator_kwargs)(wrapper)
            decorated_func = cast(Callable[P, R], decorated_any)
        else:
            decorated_func = wrapper

        # Auto-register the flow if requested
        if auto_register:
            register_flow_function(decorated_func, flow_name)

        return decorated_func

    return decorator


def async_genkit_flow(
    name: Optional[str] = None,
    output_schema: Optional[Type[BaseModel]] = None,
    require_model: bool = True,
    auto_register: bool = True,
    enable_logging: bool = True,
) -> Callable[[Callable[P, Awaitable[R]]], Callable[P, Awaitable[R]]]:
    """
    Standardized decorator for async Genkit flows with common setup logic.

    Same as genkit_flow but for async functions.
    """

    def decorator(func: Callable[P, Awaitable[R]]) -> Callable[P, Awaitable[R]]:
        flow_name = name or func.__name__

        @functools.wraps(func)
        async def async_wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            if enable_logging:
                logger.info(f"Executing async flow: {flow_name}")

            # Check model availability if required
            if require_model:
                model = get_model()  # type: ignore[no-untyped-call]
                if not model:
                    error_msg = f"Genkit model not available for async flow: {flow_name}"
                    logger.error(error_msg)
                    raise RuntimeError(error_msg)

            try:
                result = await func(*args, **kwargs)

                if enable_logging:
                    logger.debug(f"Async flow {flow_name} completed successfully")

                return result

            except Exception as e:
                if enable_logging:
                    logger.error(f"Async flow {flow_name} failed: {str(e)}", exc_info=True)
                raise

        # Apply Genkit decorator if available and enabled
        if GENKIT_AVAILABLE and is_genkit_enabled():
            genkit_decorator_kwargs = {}
            if output_schema:
                genkit_decorator_kwargs["output_schema"] = output_schema

            decorated_any = ai.flow(**genkit_decorator_kwargs)(async_wrapper)
            decorated_func = cast(Callable[P, Awaitable[R]], decorated_any)
        else:
            decorated_func = async_wrapper

        # Auto-register the flow if requested
        if auto_register:
            register_flow_function(decorated_func, flow_name)

        return decorated_func

    return decorator


def simple_genkit_flow(
    output_schema: Optional[Type[BaseModel]] = None,
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """
    Simplified decorator for basic flows with minimal configuration.

    Args:
        output_schema: Optional Pydantic model for structured output

    Returns:
        Decorated function with basic Genkit flow setup
    """
    return genkit_flow(
        output_schema=output_schema,
        require_model=True,
        auto_register=True,
        enable_logging=True,
    )


# Legacy compatibility functions for existing flows
def get_flow_model() -> Any:
    """
    Legacy helper function for flows to get the model.
    Use get_model() directly in new flows.
    """
    return get_model()  # type: ignore[no-untyped-call]


def validate_flow_model(flow_name: str = "unknown") -> Any:
    """
    Legacy helper function to validate model availability.
    This is now handled automatically by the decorator.
    """
    model = get_model()  # type: ignore[no-untyped-call]
    if not model:
        raise RuntimeError(f"Genkit model not available for flow: {flow_name}")
    return model


def create_flow_wrapper(
    func: Callable[P, R],
    name: Optional[str] = None,
    output_schema: Optional[Type[BaseModel]] = None,
) -> Callable[P, R]:
    """
    Create a flow wrapper programmatically for dynamic flow creation.

    Args:
        func: The function to wrap
        name: Optional flow name
        output_schema: Optional output schema

    Returns:
        Wrapped function ready to be used as a Genkit flow
    """
    return genkit_flow(name=name, output_schema=output_schema)(func)


# Utility functions for application code
@overload
async def run_flow_async(flow_func: Callable[P, Awaitable[R]], **kwargs: Any) -> R: ...

@overload
async def run_flow_async(flow_func: Callable[P, R], **kwargs: Any) -> R: ...

async def run_flow_async(
    flow_func: Callable[P, Awaitable[R]] | Callable[P, R],
    **kwargs: Any,
) -> R:
    """
    Compatibility function to run flows async with new decorator system.

    Args:
        flow_func: The flow function to run
        **kwargs: Arguments to pass to the flow

    Returns:
        Flow result
    """
    import asyncio
    import inspect

    if inspect.iscoroutinefunction(flow_func):
        result = await flow_func(**kwargs)  # type: ignore[misc]
        return cast(R, result)
    else:
        # Run sync function in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        def _call() -> R:
            res = flow_func(**kwargs)  # type: ignore[misc]
            return cast(R, res)

        out = await loop.run_in_executor(None, _call)
        return cast(R, out)


def run_flow(flow_func: Callable[P, R], **kwargs: Any) -> R:
    """
    Compatibility function to run flows sync with new decorator system.

    Args:
        flow_func: The flow function to run
        **kwargs: Arguments to pass to the flow

    Returns:
        Flow result
    """
    return flow_func(**kwargs)
