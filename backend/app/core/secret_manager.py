"""
Secret Manager integration for secure configuration management.

This module provides functions to access secrets stored in Google Cloud Secret Manager
in a way that falls back to environment variables for local development.
"""
import os
from typing import Optional

from google.api_core.exceptions import NotFound
from google.cloud import secretmanager

# Initialize the Secret Manager client
client = secretmanager.SecretManagerServiceClient()


def get_secret(secret_id: str, project_id: Optional[str] = None, version: str = "latest") -> str:
    """
    Retrieve a secret from Google Cloud Secret Manager or fall back to environment variables.

    Args:
        secret_id: The ID of the secret to retrieve
        project_id: GCP project ID (defaults to GOOGLE_CLOUD_PROJECT environment variable)
        version: Version of the secret (defaults to "latest")

    Returns:
        The secret value as a string

    Raises:
        RuntimeError: If the secret is not found and no environment variable fallback exists
    """
    # First try to get from environment variables (for local development)
    env_var = os.getenv(secret_id)
    if env_var:
        return env_var

    # If not in environment, try Secret Manager
    if not project_id:
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        if not project_id:
            raise RuntimeError("GOOGLE_CLOUD_PROJECT environment variable is not set")

    # Build the secret version name
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"

    try:
        # Access the secret version
        response = client.access_secret_version(name=name)
        return response.payload.data.decode("UTF-8")
    except NotFound:
        # If secret not found, check if we have a default value in environment
        env_var = os.getenv(f"DEFAULT_{secret_id}")
        if env_var:
            return env_var
        raise RuntimeError(
            f"Secret {secret_id} not found in Secret Manager and no default provided"
        )
    except Exception as e:
        raise RuntimeError(f"Failed to access secret {secret_id}: {str(e)}")


# Helper functions for specific secret types
def get_database_url() -> str:
    """Get the database URL from secrets or environment."""
    try:
        return get_secret("DATABASE_URL")
    except RuntimeError:
        # Default fallback for local development
        return "sqlite:///data/careercopilot-dev.db"


def get_redis_url() -> str:
    """Get the Redis URL from secrets or environment."""
    try:
        return get_secret("REDIS_URL")
    except RuntimeError:
        return "redis://localhost:6379/0"


def get_secret_key() -> str:
    """Get the secret key for JWT tokens."""
    return get_secret("SECRET_KEY")
