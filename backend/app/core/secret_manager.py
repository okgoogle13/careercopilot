"""
Secret Manager abstraction for configuration management.

This module provides functions to access configuration values from environment variables,
ensuring a consistent interface for the application.
"""

import os
import logging
from typing import Optional, Any

logger = logging.getLogger(__name__)

def get_secret(
    secret_id: str,
    default: Optional[str] = None,
) -> str:
    """
    Retrieve a configuration value from environment variables.

    Args:
        secret_id: The ID of the environment variable to retrieve
        default: Default value if not found

    Returns:
        The configuration value as a string

    Raises:
        RuntimeError: If the value is not found and no default exists
    """
    # Try to get from environment variables
    value = os.getenv(secret_id.upper().replace("-", "_")) or os.getenv(secret_id)

    if value:
        return value

    if default is not None:
        return default

    raise RuntimeError(f"Configuration value {secret_id} not found in environment variables")


def get_database_url() -> str:
    """Get the database URL from environment."""
    return get_secret("DATABASE_URL", default="sqlite:///data/careercopilot-dev.db")


def get_secret_key() -> str:
    """Get the secret key for JWT tokens."""
    return get_secret("JWT_SECRET_KEY", default="insecure-default-secret-key")


def get_app_secret(secret_name: str, default: Optional[str] = None) -> str:
    """
    Get an application configuration value.

    Args:
        secret_name: Name of the configuration (e.g., 'openai-api-key')
        default: Default value if not found

    Returns:
        Value as string

    Raises:
        RuntimeError: If not found and no default provided
    """
    return get_secret(secret_name, default=default)
