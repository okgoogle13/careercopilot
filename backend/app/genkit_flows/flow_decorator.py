"""
flow_decorator.py

Centralized Genkit flow decorator system for standardizing flow definitions.
Handles common setup logic including model initialization, error handling, and flow registration.

This implementation is compatible with genkit 0.4.0 which doesn't have a direct flow decorator.
"""

import functools
import inspect
import logging
from typing import Any, Callable, Optional, Type, TypeVar, Union, Awaitable, cast

from app.core.genkit_init import get_model, is_genkit_enabled, register_flow_function
from pydantic import BaseModel

# Try to import Genkit for decorators, with fallback
try:
    import genkit
    from genkit.ai import Genkit
    
    GENKIT_AVAILABLE = True
except ImportError:
    genkit = None
    Genkit = None
    GENKIT_AVAILABLE = False

logger = logging.getLogger(__name__)

# Type variable for function return types
F = TypeVar("F", bound=Callable[..., Any])


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
) -> Callable[[F], F]:
    """
    Standardized decorator for Genkit flows that handles common setup logic.
    
    This provides a compatibility layer for the flow decorator pattern without 
    using the actual genkit.flow decorator.

    Args:
        name: Optional name for the flow (defaults to function name)
        output_schema: Pydantic model for structured output
        require_model: Whether to require model availability
        auto_register: Whether to automatically register the flow
        enable_logging: Whether to enable flow execution logging

    Returns:
        Decorated function with standardized Genkit flow setup
    """
    
    def decorator(func: F) -> F:
        flow_name = name or func.__name__
        
        # Check if the function is async
        is_async = inspect.iscoroutinefunction(func)
        
        # If genkit.flow is available and we should use it
        if GENKIT_AVAILABLE and hasattr(genkit, 'flow') and is_genkit_enabled():
            # Create a simple wrapper that maintains the function signature
            if is_async:
                @functools.wraps(func)
                async def wrapped_async(*args, **kwargs):
                    if enable_logging:
                        logger.info(f"Executing async flow: {flow_name}")
                    try:
                        result = await func(*args, **kwargs)
                        if enable_logging:
                            logger.debug(f"Async flow {flow_name} completed successfully")
                        return result
                    except Exception as e:
                        if enable_logging:
                            logger.error(f"Async flow {flow_name} failed: {str(e)}", exc_info=True)
                        raise
                
                # Apply genkit.flow decorator if available
                if hasattr(genkit, 'flow'):
                    return cast(F, genkit.flow(name=flow_name)(wrapped_async))
                return wrapped_async
            else:
                @functools.wraps(func)
                def wrapped_sync(*args, **kwargs):
                    if enable_logging:
                        logger.info(f"Executing flow: {flow_name}")
                    try:
                        result = func(*args, **kwargs)
                        if enable_logging:
                            logger.debug(f"Flow {flow_name} completed successfully")
                        return result
                    except Exception as e:
                        if enable_logging:
                            logger.error(f"Flow {flow_name} failed: {str(e)}", exc_info=True)
                        raise
                
                # Apply genkit.flow decorator if available
                if hasattr(genkit, 'flow'):
                    return cast(F, genkit.flow(name=flow_name)(wrapped_sync))
                return wrapped_sync
        
        # Fallback implementation without genkit.flow
        if is_async:
            @functools.wraps(func)
            async def wrapped_async_fallback(*args, **kwargs):
                if enable_logging:
                    logger.info(f"Executing async flow (fallback): {flow_name}")
                
                # Check model availability if required
                if require_model:
                    model = get_model()
                    if not model:
                        error_msg = f"Genkit model not available for flow: {flow_name}"
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
            
            return cast(F, wrapped_async_fallback)
        else:
            @functools.wraps(func)
            def wrapped_sync_fallback(*args, **kwargs):
                if enable_logging:
                    logger.info(f"Executing flow (fallback): {flow_name}")
                
                # Check model availability if required
                if require_model:
                    model = get_model()
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
            
            return cast(F, wrapped_sync_fallback)
    
    return decorator


def simple_genkit_flow(
    output_schema: Optional[Type[BaseModel]] = None,
) -> Callable[[F], F]:
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
def get_flow_model():
    """
    Legacy helper function for flows to get the model.
    Use get_model() directly in new flows.
    """
    return get_model()


def validate_flow_model(flow_name: str = "unknown"):
    """
    Legacy helper function to validate model availability.
    This is now handled automatically by the decorator.
    """
    model = get_model()
    if not model:
        raise RuntimeError(f"Genkit model not available for flow: {flow_name}")
    return model


def create_flow_wrapper(
    func: Callable,
    name: Optional[str] = None,
    output_schema: Optional[Type[BaseModel]] = None,
) -> Callable:
    """
    Create a flow wrapper programmatically for dynamic flow creation.
    
    In genkit 0.4.0, this creates a simple wrapper that maintains compatibility
    with the flow interface.

    Args:
        func: The function to wrap
        name: Optional flow name
        output_schema: Optional output schema (not used in this version)

    Returns:
        Wrapped function ready to be used as a Genkit flow
    """
    flow_name = name or func.__name__
    
    # If genkit.flow is available, use it
    if GENKIT_AVAILABLE and hasattr(genkit, 'flow'):
        return genkit.flow(name=flow_name)(func)
        
    # Otherwise, use our simple wrapper
    return simple_genkit_flow(output_schema=output_schema)(func)


# Utility functions for application code
async def run_flow_async(flow_func: Callable, **kwargs) -> Any:
    """
{{ ... }}

    Args:
        flow_func: The flow function to run
        **kwargs: Arguments to pass to the flow

    Returns:
        Flow result
    """
    import asyncio
    import inspect

    if inspect.iscoroutinefunction(flow_func):
        return await flow_func(**kwargs)
    else:
        # Run sync function in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: flow_func(**kwargs))


def run_flow(flow_func: Callable, **kwargs) -> Any:
    """
    Compatibility function to run flows sync with new decorator system.

    Args:
        flow_func: The flow function to run
        **kwargs: Arguments to pass to the flow

    Returns:
        Flow result
    """
    return flow_func(**kwargs)
