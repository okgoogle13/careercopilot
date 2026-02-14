"""
Centralized Error Handling Utilities

This module provides reusable error handling patterns to eliminate code duplication
across API endpoints and services. Consolidates repeated try-except-HTTPException patterns.
"""

import logging
from typing import Any, Callable, TypeVar

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

logger = logging.getLogger(__name__)

T = TypeVar("T")


class ErrorHandler:
    """Centralized error handling for API endpoints."""

    @staticmethod
    def handle_value_error(error: ValueError, context: str = "") -> HTTPException:
        """
        Handle ValueError and convert to appropriate HTTP response.
        
        Args:
            error: The ValueError to handle
            context: Additional context about where the error occurred
            
        Returns:
            HTTPException with 400 status code
        """
        error_msg = str(error)
        logger.warning(f"ValueError in {context}: {error_msg}")
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {error_msg}"
        )

    @staticmethod
    def handle_not_found(resource_type: str, resource_id: Any = None) -> HTTPException:
        """
        Handle resource not found errors.
        
        Args:
            resource_type: Type of resource (e.g., "User", "Document", "Application")
            resource_id: Optional ID of the resource
            
        Returns:
            HTTPException with 404 status code
        """
        detail = f"{resource_type} not found"
        if resource_id:
            detail += f" (ID: {resource_id})"
        logger.info(f"Resource not found: {detail}")
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )

    @staticmethod
    def handle_database_error(error: Exception, context: str = "") -> HTTPException:
        """
        Handle database errors (SQLAlchemy exceptions).
        
        Args:
            error: The database error
            context: Additional context about the operation
            
        Returns:
            HTTPException with appropriate status code
        """
        if isinstance(error, IntegrityError):
            logger.warning(f"Database integrity error in {context}: {error}")
            return HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Database constraint violation. The resource may already exist."
            )
        
        logger.error(f"Database error in {context}: {error}", exc_info=True)
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database operation failed. Please try again later."
        )

    @staticmethod
    def handle_generic_error(error: Exception, context: str = "") -> HTTPException:
        """
        Handle unexpected errors.
        
        Args:
            error: The exception to handle
            context: Additional context about where the error occurred
            
        Returns:
            HTTPException with 500 status code
        """
        error_msg = str(error)
        logger.error(f"Unexpected error in {context}: {error_msg}", exc_info=True)
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {error_msg}"
        )


def with_error_handling(context: str = ""):
    """
    Decorator for endpoints to handle common error patterns.
    
    Usage:
        @router.post("/endpoint")
        @with_error_handling("create_resource")
        async def create_resource(...):
            # Your endpoint logic
            pass
    
    Args:
        context: Description of the operation for logging
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        async def wrapper(*args, **kwargs) -> T:
            try:
                return await func(*args, **kwargs)
            except ValueError as e:
                raise ErrorHandler.handle_value_error(e, context)
            except (IntegrityError, SQLAlchemyError) as e:
                raise ErrorHandler.handle_database_error(e, context)
            except HTTPException:
                # Re-raise HTTPExceptions as-is
                raise
            except Exception as e:
                raise ErrorHandler.handle_generic_error(e, context)
        
        wrapper.__name__ = func.__name__
        wrapper.__doc__ = func.__doc__
        return wrapper
    return decorator


def safe_operation(operation: Callable[[], T], context: str = "", default: T | None = None) -> T | None:
    """
    Execute an operation with automatic error handling.
    
    Useful for non-critical operations where you want to log errors but continue execution.
    
    Args:
        operation: The function to execute
        context: Description of the operation
        default: Default value to return on error
        
    Returns:
        Result of the operation or default value on error
        
    Example:
        result = safe_operation(
            lambda: expensive_computation(),
            context="analytics calculation",
            default={}
        )
    """
    try:
        return operation()
    except Exception as e:
        logger.warning(f"Safe operation failed in {context}: {e}")
        return default
