"""
Secret Manager integration for secure configuration management.

This module provides functions to access secrets stored in Google Cloud Secret Manager
in a way that falls back to environment variables for local development.
"""

import os
from typing import Optional

from google.api_core.exceptions import NotFound
from google.cloud import secretmanager

# Lazy initialization of Secret Manager client
_client = None


def _get_client():
    """Get or initialize the Secret Manager client."""
    global _client
    if _client is None:
        try:
            _client = secretmanager.SecretManagerServiceClient()
        except Exception as e:
            print(f"Warning: Could not initialize Secret Manager client: {e}")
            _client = False  # Use False to indicate failed initialization
    return _client if _client is not False else None


def get_secret(
    secret_id: str,
    project_id: Optional[str] = None,
    version: str = "latest",
    default: Optional[str] = None,
) -> str:
    """
    Retrieve a secret from Google Cloud Secret Manager or fall back to environment variables.

    Args:
        secret_id: The ID of the secret to retrieve
        project_id: GCP project ID (defaults to GOOGLE_CLOUD_PROJECT environment variable)
        version: Version of the secret (defaults to "latest")
        default: Default value if secret not found

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

    # Get the client, return environment fallback if not available
    client = _get_client()
    if not client:
        # Secret Manager not available, try environment variable fallback
        env_var = os.getenv(f"DEFAULT_{secret_id}")
        if env_var:
            return env_var
        if default is not None:
            return default
        raise RuntimeError(
            f"Secret Manager not available and no environment fallback for {secret_id}"
        )

    try:
        # Access the secret version
        response = client.access_secret_version(name=name)
        return response.payload.data.decode("UTF-8")
    except NotFound:
        # If secret not found, check if we have a default value in environment
        env_var = os.getenv(f"DEFAULT_{secret_id}")
        if env_var:
            return env_var
        if default is not None:
            return default
        raise RuntimeError(
            f"Secret {secret_id} not found in Secret Manager and no default provided"
        )
    except Exception as e:
        if default is not None:
            return default
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


def get_firebase_credentials() -> Optional[dict]:
    """
    Get Firebase Admin SDK credentials from Secret Manager.

    Returns:
        dict: Parsed JSON credentials or None if not found
    """
    try:
        creds_json = get_secret("firebase-credentials-json")
        if creds_json:
            import json

            return json.loads(creds_json)
    except Exception as e:
        print(f"Warning: Could not load Firebase credentials: {e}")
    return None


def get_firebase_config() -> dict:
    """
    Get Firebase configuration from Secret Manager or environment variables.

    Returns:
        dict: Firebase configuration
    """
    try:
        config = {
            "project_id": get_secret(
                "firebase-project-id", default=os.getenv("GCP_PROJECT_ID", "")
            ),
            "storage_bucket": get_secret("firebase-storage-bucket", default=""),
            "database_url": get_secret("firebase-database-url", default=""),
            "use_emulator": get_secret("firebase-emulator", default="false").lower() == "true",
            "auth_emulator_host": get_secret("firebase-auth-emulator-host", default=""),
            "storage_emulator_host": get_secret("firebase-storage-emulator-host", default=""),
            "database_emulator_host": get_secret("firebase-database-emulator-host", default=""),
        }
        return config
    except Exception as e:
        # Fallback to environment variables
        return {
            "project_id": os.getenv("FIREBASE_PROJECT_ID", os.getenv("GCP_PROJECT_ID", "")),
            "storage_bucket": os.getenv("FIREBASE_STORAGE_BUCKET", ""),
            "database_url": os.getenv("FIREBASE_DATABASE_URL", ""),
            "use_emulator": os.getenv("FIREBASE_EMULATOR", "false").lower() == "true",
            "auth_emulator_host": os.getenv("FIREBASE_AUTH_EMULATOR_HOST", ""),
            "storage_emulator_host": os.getenv("FIREBASE_STORAGE_EMULATOR_HOST", ""),
            "database_emulator_host": os.getenv("FIREBASE_DATABASE_EMULATOR_HOST", ""),
        }


def get_firebase_frontend_config() -> dict:
    """
    Get Firebase frontend configuration from Secret Manager or environment variables.

    Returns:
        dict: Firebase frontend configuration for VITE environment variables
    """
    try:
        config = {
            "api_key": get_secret("vite-firebase-api-key", default=""),
            "auth_domain": get_secret("vite-firebase-auth-domain", default=""),
            "project_id": get_secret(
                "firebase-project-id", default=os.getenv("GCP_PROJECT_ID", "")
            ),
            "storage_bucket": get_secret("firebase-storage-bucket", default=""),
            "messaging_sender_id": get_secret("vite-firebase-messaging-sender-id", default=""),
            "app_id": get_secret("vite-firebase-app-id", default=""),
        }
        return config
    except Exception as e:
        # Fallback to environment variables
        return {
            "api_key": os.getenv("VITE_FIREBASE_API_KEY", ""),
            "auth_domain": os.getenv("VITE_FIREBASE_AUTH_DOMAIN", ""),
            "project_id": os.getenv("FIREBASE_PROJECT_ID", os.getenv("GCP_PROJECT_ID", "")),
            "storage_bucket": os.getenv("FIREBASE_STORAGE_BUCKET", ""),
            "messaging_sender_id": os.getenv("VITE_FIREBASE_MESSAGING_SENDER_ID", ""),
            "app_id": os.getenv("VITE_FIREBASE_APP_ID", ""),
        }


def get_app_secret(secret_name: str, default: str = None) -> str:
    """
    Get an application secret with the modern naming convention.

    This function is compatible with the secrets.py module and provides
    a consistent interface for accessing secrets with fallbacks.

    Args:
        secret_name: Name of the secret (e.g., 'openai-api-key')
        default: Default value if secret not found

    Returns:
        Secret value as string

    Raises:
        RuntimeError: If secret not found and no default provided
    """
    try:
        return get_secret(secret_name.upper().replace("-", "_"))
    except RuntimeError:
        # Try with the original format
        try:
            return get_secret(secret_name)
        except RuntimeError:
            if default is not None:
                return default
            raise RuntimeError(f"Secret {secret_name} not found")
