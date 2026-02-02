"""
Secure configuration management using Google Cloud Secret Manager.

This module provides a centralized way to access configuration values,
falling back to environment variables when not in production.
"""

import os
from typing import Any, Dict, Optional, Tuple, cast

from pydantic import validator
try:
    from pydantic_settings import BaseSettings
except ImportError:  # pragma: no cover - optional dependency in test/CI
    from pydantic import BaseModel as BaseSettings

# Try to import the secret manager, but don't fail if not available
try:
    from .secret_manager import get_database_url, get_secret, get_secret_key

    SECRET_MANAGER_AVAILABLE = True
except ImportError:
    SECRET_MANAGER_AVAILABLE = False


class SecureSettings(BaseSettings):
    """Application settings with secure secret management."""

    # Environment
    ENV: str = "development"
    ENVIRONMENT: str = "development"  # Alias for ENV
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str = "sqlite:///data/careercopilot-dev.db"
    DB_PASSWORD: Optional[str] = None
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "careercopilot"
    DB_USER: str = "careercopilot"

    # Cache configuration (using Firestore instead of Redis)
    CACHE_COLLECTION: str = "redis_cache"  # Firestore collection for caching

    # Authentication
    SECRET_KEY: str = "insecure-default-secret-key"
    JWT_SECRET_KEY: str = "insecure-default-secret-key"  # Alias for SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        # Handle ENVIRONMENT alias
        if "ENVIRONMENT" in kwargs:
            self.ENV = kwargs["ENVIRONMENT"]
        elif os.getenv("ENVIRONMENT"):
            self.ENV = os.getenv("ENVIRONMENT", "development")

        # Override with secure values for production or staging
        if SECRET_MANAGER_AVAILABLE and self.ENV in ["production", "staging"]:
            try:
                self.SECRET_KEY = get_secret_key()
                self.JWT_SECRET_KEY = self.SECRET_KEY
                self.DATABASE_URL = get_database_url()

                # Load AI API keys from Secret Manager
                self.GEMINI_API_KEY = get_secret("GEMINI_API_KEY", default=self.GEMINI_API_KEY)
                self.ANTHROPIC_API_KEY = get_secret(
                    "ANTHROPIC_API_KEY", default=self.ANTHROPIC_API_KEY
                )

                # Load Firebase credentials
                self.FIREBASE_PROJECT_ID = get_secret(
                    "FIREBASE_PROJECT_ID", default=self.FIREBASE_PROJECT_ID
                )
                self.GOOGLE_APPLICATION_CREDENTIALS_JSON = get_secret(
                    "GOOGLE_APPLICATION_CREDENTIALS_JSON",
                    default=self.GOOGLE_APPLICATION_CREDENTIALS_JSON,
                )
            except Exception as e:
                raise RuntimeError(f"Failed to load production secrets: {e}")
        elif self.ENV in ["production", "staging"]:
            # Fail fast in production if secrets are not properly configured
            if self.SECRET_KEY == "insecure-default-secret-key":
                raise RuntimeError("Production environment requires secure secret configuration")

    # Firebase Configuration
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_STORAGE_BUCKET: str = ""
    FIREBASE_DATABASE_URL: str = ""
    FIREBASE_AUTH_EMULATOR_HOST: Optional[str] = None
    FIREBASE_STORAGE_EMULATOR_HOST: Optional[str] = None
    FIREBASE_DATABASE_EMULATOR_HOST: Optional[str] = None
    FIREBASE_EMULATOR: bool = False

    # Firebase Admin SDK Credentials (JSON string)
    FIREBASE_CREDENTIALS_JSON: Optional[str] = None

    @validator("FIREBASE_CREDENTIALS_JSON", pre=True)
    def validate_firebase_creds(cls, v: Optional[str], values: Dict[str, Any]) -> Optional[str]:
        if not v and values.get("FIREBASE_PROJECT_ID"):
            # Try to load from Google Cloud's default credentials
            try:
                import google.auth

                credentials, project = google.auth.default()  # type: ignore[no-untyped-call]
                if project == values.get("FIREBASE_PROJECT_ID"):
                    return None  # Will use default credentials
            except Exception:
                pass
        return v

    # Google Cloud
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    GCP_PROJECT_ID: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS_JSON: Optional[str] = None

    # AI Services
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # RAG Configuration - REMOVED: Vector search functionality simplified
    # RAG features have been removed in favor of direct AI integration
    EMBEDDING_MODEL: str = "text-embedding-004"

    # Email - AWS SES
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    SES_SENDER_EMAIL: Optional[str] = None

    # Performance
    MAX_WORKERS: int = 2
    DB_POOL_SIZE: int = 3

    # Feature Flags
    ENABLE_MULTI_AGENT: bool = False
    ENABLE_ML_ANALYSIS: bool = False
    ENABLE_WEB_SEARCH: bool = False
    ENABLE_EMAIL_NOTIFICATIONS: bool = False
    ENABLE_AI_FEATURES: bool = True

    # Development Settings
    ENABLE_HOT_RELOAD: bool = False
    SHOW_DEBUG_INFO: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "allow"  # Allow extra fields from environment

        @classmethod
        def customise_sources(
            cls,
            init_settings: Any,
            env_settings: Any,
            file_secret_settings: Any,
        ) -> Tuple[Any, Dict[str, str], Any]:
            """Customize how settings are loaded."""
            if not SECRET_MANAGER_AVAILABLE:
                # If secret manager is not available, just use the default sources
                return (
                    init_settings,
                    env_settings,
                    file_secret_settings,
                )

            # Load settings from environment first
            settings: Dict[str, str] = {
                **os.environ,
                **cast(Dict[str, str], env_settings()),
            }

            # Then try to get values from secret manager
            try:
                # Only try to get secrets in production/staging or if explicitly enabled
                current_env = settings.get("ENV") or settings.get("ENVIRONMENT")
                if (
                    current_env in ["production", "staging"]
                    or settings.get("USE_SECRET_MANAGER", "").lower() == "true"
                ):
                    # Get database URL from secret manager
                    if not settings.get("DATABASE_URL"):
                        settings["DATABASE_URL"] = get_database_url()

                    # Get secret key from secret manager
                    if not settings.get("SECRET_KEY"):
                        settings["SECRET_KEY"] = get_secret_key()

                    # Get other secrets
                    for secret in [
                        "GEMINI_API_KEY",
                        "ANTHROPIC_API_KEY",
                        "AWS_ACCESS_KEY_ID",
                        "AWS_SECRET_ACCESS_KEY",
                        "SES_SENDER_EMAIL",
                    ]:
                        if not settings.get(secret):
                            try:
                                settings[secret] = get_secret(secret)
                            except Exception as e:
                                print(f"Warning: Could not load secret {secret}: {e}")
            except Exception as e:
                print(f"Warning: Could not load secrets from Secret Manager: {e}")

            return (
                init_settings,
                settings,
                file_secret_settings,
            )


# Create a single instance of the settings
settings: 'SecureSettings' = SecureSettings()

# For backward compatibility
if __name__ == "__main__":
    # Print all settings (without sensitive values)
    print("Current settings:")
    for field, value in settings.dict().items():
        if any(sensitive in field.lower() for sensitive in ["key", "secret", "token", "password"]):
            print(f"{field}: {'*' * 8} (hidden)")
        else:
            print(f"{field}: {value}")
