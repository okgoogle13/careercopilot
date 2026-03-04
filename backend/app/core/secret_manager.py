"""
Secret Manager abstraction for configuration management.

This module prefers environment variables for local development and can
optionally read from Google Cloud Secret Manager when the client library is
available and a project is configured.
"""

import json
import os
from typing import Any, Dict, Optional


class SecretManagerNotFound(Exception):
    """Fallback not-found error when Google client libraries are unavailable."""


SECRET_MANAGER_NOT_FOUND_EXCEPTIONS: tuple[type[Exception], ...]


try:
    from google.api_core.exceptions import NotFound as GoogleSecretManagerNotFound
    from google.cloud import secretmanager

    SECRET_MANAGER_NOT_FOUND_EXCEPTIONS = (GoogleSecretManagerNotFound,)
    SECRET_MANAGER_AVAILABLE = True
except ImportError:  # pragma: no cover - optional dependency
    SECRET_MANAGER_NOT_FOUND_EXCEPTIONS = (SecretManagerNotFound,)
    secretmanager = None  # type: ignore[assignment]
    SECRET_MANAGER_AVAILABLE = False

_client: Any = None
_client_init_failed = False


def _env_candidates(secret_id: str) -> list[str]:
    """Return likely environment variable names for a given secret id."""
    normalized = secret_id.upper().replace("-", "_")
    candidates = [secret_id, normalized]
    candidates.extend(f"DEFAULT_{name}" for name in list(candidates))
    return candidates


def _get_env_secret(secret_id: str) -> Optional[str]:
    """Return a secret from the environment if present."""
    for candidate in _env_candidates(secret_id):
        value = os.getenv(candidate)
        if value:
            return value
    return None


def _get_client() -> Any:
    """Get or initialize the Secret Manager client."""
    global _client, _client_init_failed

    if not SECRET_MANAGER_AVAILABLE:
        return None

    if _client is None and not _client_init_failed:
        try:
            _client = secretmanager.SecretManagerServiceClient()
        except Exception as exc:  # pragma: no cover - environment specific
            print(f"Warning: Could not initialize Secret Manager client: {exc}")
            _client_init_failed = True
            _client = None
    return _client


def get_secret(
    secret_id: str,
    project_id: Optional[str] = None,
    version: str = "latest",
    default: Optional[str] = None,
) -> str:
    """
    Retrieve a secret from environment variables or Secret Manager.

    Environment variables are checked first so local development does not depend
    on cloud access.
    """
    env_value = _get_env_secret(secret_id)
    if env_value:
        return env_value

    if not project_id:
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("GCP_PROJECT_ID")

    client = _get_client()
    if client and project_id:
        name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
        try:
            response = client.access_secret_version(name=name)
            return response.payload.data.decode("UTF-8")
        except SECRET_MANAGER_NOT_FOUND_EXCEPTIONS:
            pass
        except Exception as exc:
            if default is None:
                raise RuntimeError(f"Failed to access secret {secret_id}: {exc}") from exc

    if default is not None:
        return default

    raise RuntimeError(f"Secret {secret_id} not found in environment or Secret Manager")


def get_database_url() -> str:
    """Get the database URL from secrets or environment."""
    return get_secret("DATABASE_URL", default="sqlite:///data/careercopilot-dev.db")


def get_secret_key() -> str:
    """Get the secret key for JWT tokens."""
    jwt_secret = _get_env_secret("JWT_SECRET_KEY")
    if jwt_secret:
        return jwt_secret
    return get_secret("SECRET_KEY", default="insecure-default-secret-key")


def get_firebase_credentials() -> Optional[Dict[str, Any]]:
    """Get Firebase Admin SDK credentials as parsed JSON."""
    try:
        creds_json = get_secret("firebase-credentials-json", default="")
        if creds_json:
            return json.loads(creds_json)
    except Exception as exc:
        print(f"Warning: Could not load Firebase credentials: {exc}")
    return None


def get_firebase_config() -> Dict[str, Any]:
    """Get Firebase configuration from secrets or environment variables."""
    return {
        "project_id": get_secret(
            "firebase-project-id",
            default=os.getenv("FIREBASE_PROJECT_ID", os.getenv("GCP_PROJECT_ID", "")),
        ),
        "storage_bucket": get_secret(
            "firebase-storage-bucket",
            default=os.getenv("FIREBASE_STORAGE_BUCKET", ""),
        ),
        "database_url": get_secret(
            "firebase-database-url",
            default=os.getenv("FIREBASE_DATABASE_URL", ""),
        ),
        "use_emulator": get_secret(
            "firebase-emulator",
            default=os.getenv("FIREBASE_EMULATOR", "false"),
        ).lower()
        == "true",
        "auth_emulator_host": get_secret(
            "firebase-auth-emulator-host",
            default=os.getenv("FIREBASE_AUTH_EMULATOR_HOST", ""),
        ),
        "storage_emulator_host": get_secret(
            "firebase-storage-emulator-host",
            default=os.getenv("FIREBASE_STORAGE_EMULATOR_HOST", ""),
        ),
        "database_emulator_host": get_secret(
            "firebase-database-emulator-host",
            default=os.getenv("FIREBASE_DATABASE_EMULATOR_HOST", ""),
        ),
    }


def get_firebase_frontend_config() -> Dict[str, Any]:
    """Get Firebase frontend configuration for Vite environment variables."""
    return {
        "api_key": get_secret(
            "vite-firebase-api-key", default=os.getenv("VITE_FIREBASE_API_KEY", "")
        ),
        "auth_domain": get_secret(
            "vite-firebase-auth-domain",
            default=os.getenv("VITE_FIREBASE_AUTH_DOMAIN", ""),
        ),
        "project_id": get_secret(
            "firebase-project-id",
            default=os.getenv("FIREBASE_PROJECT_ID", os.getenv("GCP_PROJECT_ID", "")),
        ),
        "storage_bucket": get_secret(
            "firebase-storage-bucket",
            default=os.getenv("FIREBASE_STORAGE_BUCKET", ""),
        ),
        "messaging_sender_id": get_secret(
            "vite-firebase-messaging-sender-id",
            default=os.getenv("VITE_FIREBASE_MESSAGING_SENDER_ID", ""),
        ),
        "app_id": get_secret("vite-firebase-app-id", default=os.getenv("VITE_FIREBASE_APP_ID", "")),
    }


def get_app_secret(secret_name: str, default: Optional[str] = None) -> str:
    """Get an application secret using either hyphenated or env-style naming."""
    return get_secret(secret_name, default=default)
