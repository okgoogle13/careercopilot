import json
import logging
import os
from functools import lru_cache

from google.api_core.exceptions import NotFound
from google.cloud import secretmanager
from google.oauth2 import service_account

logger = logging.getLogger(__name__)

# Get the project ID from the environment
GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID", "careercopilot-468811")


def _get_secret_manager_client():
    """Initialize Secret Manager client with proper authentication."""
    try:
        # Try to use service account credentials from environment
        credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
        if credentials_json:
            credentials_dict = json.loads(credentials_json)
            credentials = service_account.Credentials.from_service_account_info(credentials_dict)
            return secretmanager.SecretManagerServiceClient(credentials=credentials)
        else:
            # Check if credentials file exists before trying default
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if cred_path and os.path.exists(cred_path):
                return secretmanager.SecretManagerServiceClient()
            else:
                logger.warning(
                    "No valid Google Cloud credentials found - Secret Manager unavailable"
                )
                return None
    except Exception as e:
        logger.warning(f"Secret Manager client initialization failed: {e}")
        return None


client = _get_secret_manager_client()


def save_user_secret(user_id: str, secret_name: str, secret_value: str) -> str:
    """
    Saves a user-specific secret to Google Cloud Secret Manager.
    Returns the resource name of the secret version.
    """
    if not GCP_PROJECT_ID:
        raise ValueError("GCP_PROJECT_ID environment variable not set.")

    secret_id = f"careercopilot-{secret_name}-{user_id}"

    try:
        secret = client.create_secret(
            request={
                "parent": f"projects/{GCP_PROJECT_ID}",
                "secret_id": secret_id,
                "secret": {"replication": {"automatic": {}}},
            }
        )
        parent = secret.name
    except Exception:  # AlreadyExists
        parent = client.secret_path(GCP_PROJECT_ID, secret_id)

    response = client.add_secret_version(
        request={"parent": parent, "payload": {"data": secret_value.encode("UTF-8")}}
    )
    return response.name


def get_user_secret(user_id: str, secret_name: str, version: str = "latest") -> str:
    """
    Retrieves a user-specific secret from Google Cloud Secret Manager.
    """
    if not GCP_PROJECT_ID:
        raise ValueError("GCP_PROJECT_ID environment variable not set.")

    secret_id = f"careercopilot-{secret_name}-{user_id}"
    name = f"projects/{GCP_PROJECT_ID}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")


def delete_user_secret(user_id: str, secret_name: str):
    """
    Deletes a secret and all its versions for a user.
    """
    if not GCP_PROJECT_ID:
        raise ValueError("GCP_PROJECT_ID environment variable not set.")

    secret_id = f"careercopilot-{secret_name}-{user_id}"
    secret_path = client.secret_path(GCP_PROJECT_ID, secret_id)

    try:
        # Delete the secret itself. This will automatically delete all versions.
        client.delete_secret(request={"name": secret_path})
    except NotFound:
        # If the secret doesn't exist, we can consider it a success.
        print(f"Secret {secret_id} not found, nothing to delete.")
    except Exception as e:
        print(f"Error deleting secret {secret_id}: {e}")
        # Re-raise the exception to be handled by the calling function
        raise e


# Application-level secret management for production deployment
@lru_cache(maxsize=32)
def get_app_secret(secret_name: str, version: str = "latest") -> str:
    """
    Retrieve an application-level secret from Google Secret Manager with caching.

    Args:
        secret_name: Name of the secret (e.g., 'openai-api-key')
        version: Version of the secret (default: 'latest')

    Returns:
        Secret value as string

    Raises:
        Exception if secret cannot be retrieved and no fallback exists
    """
    if not GCP_PROJECT_ID:
        logger.warning("GCP_PROJECT_ID not set, falling back to environment variables")
        return os.getenv(secret_name.upper().replace("-", "_"))

    if client:
        try:
            secret_path = f"projects/{GCP_PROJECT_ID}/secrets/{secret_name}/versions/{version}"
            response = client.access_secret_version(request={"name": secret_path})
            secret_value = response.payload.data.decode("UTF-8")
            logger.info(f"Successfully retrieved secret: {secret_name}")
            return secret_value
        except Exception as e:
            logger.warning(f"Failed to retrieve secret {secret_name}: {e}")
    else:
        logger.debug(f"Secret Manager client not available for {secret_name}")

    # Fallback to environment variable
    fallback_value = os.getenv(secret_name.upper().replace("-", "_"))
    if fallback_value:
        logger.info(f"Using environment fallback for {secret_name}")
        return fallback_value
    else:
        raise Exception(f"Secret {secret_name} not found in Secret Manager or environment")


def get_database_config() -> dict:
    """Get database configuration from secrets."""
    return {
        "host": get_app_secret("db-host") if _secret_exists("db-host") else "postgres",
        "port": int(get_app_secret("db-port") if _secret_exists("db-port") else "5432"),
        "database": get_app_secret("db-name") if _secret_exists("db-name") else "careercopilot",
        "username": get_app_secret("db-user") if _secret_exists("db-user") else "careercopilot",
        "password": get_app_secret("db-password"),
    }


def get_redis_config() -> dict:
    """Get Redis configuration from secrets."""
    password = get_app_secret("redis-password") if _secret_exists("redis-password") else None
    return {
        "password": password,
        "url": f"redis://:{password}@redis:6379/0" if password else "redis://redis:6379/0",
    }


def get_ai_api_keys() -> dict:
    """Get all AI service API keys from secrets."""
    return {
        "openai": get_app_secret("openai-api-key"),
        "anthropic": get_app_secret("anthropic-api-key"),
        "gemini": get_app_secret("gemini-api-key"),
        "perplexity": (
            get_app_secret("perplexity-api-key") if _secret_exists("perplexity-api-key") else None
        ),
    }


def get_jwt_secret() -> str:
    """Get JWT secret key from secrets."""
    return (
        get_app_secret("jwt-secret-key")
        if _secret_exists("jwt-secret-key")
        else "fallback-dev-key-change-in-production"
    )


def _secret_exists(secret_name: str) -> bool:
    """Check if a secret exists in Secret Manager."""
    try:
        secret_path = f"projects/{GCP_PROJECT_ID}/secrets/{secret_name}"
        client.get_secret(request={"name": secret_path})
        return True
    except NotFound:
        return False
    except Exception:
        return False
