"""
Secure configuration management using environment variables and optional Secret Manager.

This module provides a centralized way to access configuration values while
falling back to local environment variables during development.
"""

import logging
import os
from typing import Any, cast

from pydantic import validator

logger = logging.getLogger(__name__)

try:
    from pydantic_settings import BaseSettings
except ImportError:  # pragma: no cover - optional dependency in test/CI
    from pydantic import BaseModel as BaseSettings

try:
    from .secret_manager import get_database_url, get_secret, get_secret_key

    SECRET_MANAGER_AVAILABLE = True
except ImportError:  # pragma: no cover - local fallback
    SECRET_MANAGER_AVAILABLE = False

    def get_database_url() -> str:
        return os.getenv("DATABASE_URL", "sqlite:///data/careercopilot-dev.db")

    def get_secret(
        secret_id: str,
        project_id: str | None = None,
        version: str = "latest",
        default: str | None = None,
    ) -> str:
        _ = (project_id, version)
        value = os.getenv(secret_id) or os.getenv(secret_id.upper().replace("-", "_"))
        if value:
            return value
        if default is not None:
            return default
        raise RuntimeError(f"Secret {secret_id} not found")

    def get_secret_key() -> str:
        return os.getenv("JWT_SECRET_KEY", os.getenv("SECRET_KEY", "insecure-default-secret-key"))


class SecureSettings(BaseSettings):
    """Application settings with secure secret management."""

    # Environment
    ENV: str = "development"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"
    APP_URL: str = "http://localhost:8000"
    DISABLE_AUTH: bool = False

    # Database
    DATABASE_URL: str = "sqlite:///data/careercopilot-dev.db"
    DB_PASSWORD: str | None = None
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "careercopilot"
    DB_USER: str = "careercopilot"

    # Cache configuration
    CACHE_COLLECTION: str = "redis_cache"

    # Authentication
    SECRET_KEY: str = "insecure-default-secret-key"
    JWT_SECRET_KEY: str = "insecure-default-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Firebase
    FIREBASE_PROJECT_ID: str | None = None
    FIREBASE_STORAGE_BUCKET: str = ""
    FIREBASE_DATABASE_URL: str = ""
    FIREBASE_AUTH_EMULATOR_HOST: str | None = None
    FIREBASE_STORAGE_EMULATOR_HOST: str | None = None
    FIREBASE_DATABASE_EMULATOR_HOST: str | None = None
    FIREBASE_EMULATOR: bool = False
    FIREBASE_CREDENTIALS_JSON: str | None = None

    # Google Cloud
    GOOGLE_CLOUD_PROJECT: str | None = None
    GCP_PROJECT_ID: str | None = None
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None
    GOOGLE_APPLICATION_CREDENTIALS_JSON: str | None = None
    CTS_TENANT_ID: str = "default"

    # AI Services
    GEMINI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None

    # Email
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None
    AWS_REGION: str = "us-east-1"
    SES_SENDER_EMAIL: str | None = None

    # Performance
    MAX_WORKERS: int = 2
    DB_POOL_SIZE: int = 3
    EMBEDDING_MODEL: str = "text-embedding-004"

    # Feature Flags
    ENABLE_MULTI_AGENT: bool = False
    ENABLE_ML_ANALYSIS: bool = False
    ENABLE_WEB_SEARCH: bool = False
    ENABLE_EMAIL_NOTIFICATIONS: bool = False
    ENABLE_AI_FEATURES: bool = True
    ENABLE_GENKIT_FLOWS: bool = True

    # Development Settings
    ENABLE_HOT_RELOAD: bool = False
    SHOW_DEBUG_INFO: bool = False

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)

        if "ENVIRONMENT" in kwargs:
            self.ENV = kwargs["ENVIRONMENT"]
        elif os.getenv("ENVIRONMENT"):
            self.ENV = os.getenv("ENVIRONMENT", "development")

        self.ENVIRONMENT = self.ENV

        # Keep the alias synchronized in non-production contexts.
        if (
            self.SECRET_KEY == "insecure-default-secret-key"
            and self.JWT_SECRET_KEY != self.SECRET_KEY
        ):
            self.SECRET_KEY = self.JWT_SECRET_KEY

        try:
            self.JWT_SECRET_KEY = get_secret_key()
            self.SECRET_KEY = self.JWT_SECRET_KEY
            self.DATABASE_URL = get_database_url()

            self.GEMINI_API_KEY = get_secret("GEMINI_API_KEY", default=self.GEMINI_API_KEY)
            self.ANTHROPIC_API_KEY = get_secret("ANTHROPIC_API_KEY", default=self.ANTHROPIC_API_KEY)

            self.FIREBASE_PROJECT_ID = get_secret(
                "FIREBASE_PROJECT_ID",
                default=self.FIREBASE_PROJECT_ID,
            )
            self.FIREBASE_STORAGE_BUCKET = get_secret(
                "FIREBASE_STORAGE_BUCKET",
                default=self.FIREBASE_STORAGE_BUCKET,
            )
            self.FIREBASE_CREDENTIALS_JSON = get_secret(
                "FIREBASE_CREDENTIALS_JSON",
                default=self.FIREBASE_CREDENTIALS_JSON,
            )

        except Exception as exc:
            if self.ENV in ["production", "staging"]:
                raise RuntimeError(f"Failed to load production configuration: {exc}") from exc
            logger.debug("Some optional local configuration is unavailable: %s", exc)

    @validator("FIREBASE_CREDENTIALS_JSON", pre=True)
    def validate_firebase_creds(
        cls,
        value: str | None,
        values: dict[str, Any],
    ) -> str | None:
        """Allow ADC fallback when the project matches and explicit JSON is absent."""
        if not value and values.get("FIREBASE_PROJECT_ID"):
            try:
                import google.auth

                _, project = google.auth.default()  # type: ignore[no-untyped-call]
                if project == values.get("FIREBASE_PROJECT_ID"):
                    return None
            except Exception:
                pass
        return value

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "allow"

        @classmethod
        def customise_sources(
            cls,
            init_settings: Any,
            env_settings: Any,
            file_secret_settings: Any,
        ) -> tuple[Any, dict[str, str], Any]:
            """Load values from init, environment, then file secrets."""
            if not SECRET_MANAGER_AVAILABLE:
                return (
                    init_settings,
                    cast(dict[str, str], env_settings()),
                    file_secret_settings,
                )

            settings: dict[str, str] = {
                **os.environ,
                **cast(dict[str, str], env_settings()),
            }
            return (
                init_settings,
                settings,
                file_secret_settings,
            )


settings: "SecureSettings" = SecureSettings()


if __name__ == "__main__":
    print("Current settings:")
    dump_method = getattr(settings, "model_dump", None)
    values = dump_method() if callable(dump_method) else settings.dict()
    for field, value in values.items():
        if any(token in field.lower() for token in ["key", "secret", "token", "password"]):
            print(f"{field}: {'*' * 8} (hidden)")
        else:
            print(f"{field}: {value}")
