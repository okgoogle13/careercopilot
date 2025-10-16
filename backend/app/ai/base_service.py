"""
Base AI Service

Provides common functionality and configuration for all AI services.
"""

import logging
from typing import Any, Dict, List, Optional, TypeVar

from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class BaseAIService:
    """Base class for all AI services."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the base AI service.

        Args:
            config: Configuration dictionary for the AI service
        """
        self.config = config or {}
        self.is_initialized = False
        self.is_enabled = self.config.get("enabled", False)

        if self.is_enabled:
            self._initialize()

    def _initialize(self) -> None:
        """Initialize the AI service.

        This method should be overridden by subclasses to perform any
        necessary initialization, such as loading models or connecting
        to external services.
        """
        try:
            # Initialize Genkit or other AI frameworks here
            # Example:
            # import genkit
            # genkit.configure(...)
            self.is_initialized = True
            logger.info("AI service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AI service: {str(e)}")
            self.is_initialized = False

    def is_available(self) -> bool:
        """Check if the AI service is available for use.

        Returns:
            bool: True if the service is available, False otherwise
        """
        return self.is_enabled and self.is_initialized

    def validate_input(self, input_data: Any, required_fields: Optional[List[str]] = None) -> None:
        """Validate input data.

        Args:
            input_data: The input data to validate
            required_fields: List of required field names

        Raises:
            ValueError: If the input is invalid
        """
        if input_data is None:
            raise ValueError("Input cannot be None")

        if required_fields and hasattr(input_data, "__getitem__"):
            for field in required_fields:
                if field not in input_data or input_data[field] is None:
                    raise ValueError(f"Missing required field: {field}")

    def handle_error(self, error: Exception, context: str = "") -> None:
        """Handle and log errors consistently.

        Args:
            error: The exception that was raised
            context: Additional context about where the error occurred

        Raises:
            RuntimeError: Always raises a new error with additional context
        """
        error_msg = (
            f"AI Service Error ({context}): {str(error)}"
            if context
            else f"AI Service Error: {str(error)}"
        )
        logger.error(error_msg)
        logger.debug(f"Error details: {error}", exc_info=True)
        raise RuntimeError(error_msg) from error

    def __str__(self) -> str:
        """String representation of the service."""
        return f"{self.__class__.__name__}(enabled={self.is_available()})"
