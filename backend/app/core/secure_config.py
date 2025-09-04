"""
Secure configuration management using Google Cloud Secret Manager.

This module provides a centralized way to access configuration values,
falling back to environment variables when not in production.
"""
import os
from typing import Any, Dict, Optional, Union

from pydantic import BaseSettings, Field, validator

# Try to import the secret manager, but don't fail if not available
try:
    from .secret_manager import get_database_url, get_redis_url, get_secret, get_secret_key

    SECRET_MANAGER_AVAILABLE = True
except ImportError:
    SECRET_MANAGER_AVAILABLE = False


class SecureSettings(BaseSettings):
    """Application settings with secure secret management."""

    # Environment
    ENV: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str = "sqlite:///data/careercopilot-dev.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # Authentication
    SECRET_KEY: str = "insecure-default-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Google Cloud
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    GCP_PROJECT_ID: Optional[str] = None
    FIREBASE_PROJECT_ID: Optional[str] = None

    # AI Services
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_ORG_ID: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # Email
    SENDGRID_API_KEY: Optional[str] = None

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

        @classmethod
        def customise_sources(
            cls,
            init_settings,
            env_settings,
            file_secret_settings,
        ):
            """Customize how settings are loaded."""
            if not SECRET_MANAGER_AVAILABLE:
                # If secret manager is not available, just use the default sources
                return (
                    init_settings,
                    env_settings,
                    file_secret_settings,
                )

            # Load settings from environment first
            settings = {
                **os.environ,
                **env_settings(),
            }

            # Then try to get values from secret manager
            try:
                # Only try to get secrets in production or if explicitly enabled
                if (
                    settings.get("ENV") == "production"
                    or settings.get("USE_SECRET_MANAGER", "").lower() == "true"
                ):
                    # Get database URL from secret manager
                    if not settings.get("DATABASE_URL"):
                        settings["DATABASE_URL"] = get_database_url()

                    # Get Redis URL from secret manager
                    if not settings.get("REDIS_URL"):
                        settings["REDIS_URL"] = get_redis_url()

                    # Get secret key from secret manager
                    if not settings.get("SECRET_KEY"):
                        settings["SECRET_KEY"] = get_secret_key()

                    # Get other secrets
                    for secret in [
                        "GEMINI_API_KEY",
                        "OPENAI_API_KEY",
                        "ANTHROPIC_API_KEY",
                        "SENDGRID_API_KEY",
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
settings = SecureSettings()

# For backward compatibility
if __name__ == "__main__":
    # Print all settings (without sensitive values)
    print("Current settings:")
    for field, value in settings.dict().items():
        if any(sensitive in field.lower() for sensitive in ["key", "secret", "token", "password"]):
            print(f"{field}: {'*' * 8} (hidden)")
        else:
            print(f"{field}: {value}")
