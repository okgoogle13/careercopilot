"""
Secure configuration management using environment variables.

This module provides a centralized way to access configuration values,
ensuring consistent settings across the application.
"""

import os
from typing import Any, Dict, Optional, Tuple

try:
    from pydantic_settings import BaseSettings
except ImportError:  # pragma: no cover
    from pydantic import BaseModel as BaseSettings

from .secret_manager import get_database_url, get_secret, get_secret_key


class SecureSettings(BaseSettings):
    """Application settings using environment variables."""

    # Environment
    ENV: str = "development"
    ENVIRONMENT: str = "development"  # Alias for ENV
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"
    APP_URL: str = "http://localhost:8000"

    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = "sqlite:///data/careercopilot-dev.db"

    # Supabase Configuration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_STORAGE_BUCKET: str = "user_assets"

    # Authentication
    JWT_SECRET_KEY: str = "insecure-default-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # AI Services
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # AWS (for SES/S3 fallback)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    SES_SENDER_EMAIL: Optional[str] = None

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        # Handle ENVIRONMENT alias
        if "ENVIRONMENT" in kwargs:
            self.ENV = kwargs["ENVIRONMENT"]
        elif os.getenv("ENVIRONMENT"):
            self.ENV = os.getenv("ENVIRONMENT", "development")

        # Load values
        try:
            self.JWT_SECRET_KEY = get_secret_key()
            self.DATABASE_URL = get_database_url()

            # Load AI API keys
            self.GEMINI_API_KEY = get_secret("GEMINI_API_KEY", default=self.GEMINI_API_KEY)
            self.ANTHROPIC_API_KEY = get_secret("ANTHROPIC_API_KEY", default=self.ANTHROPIC_API_KEY)

            # Load Supabase config
            self.SUPABASE_URL = get_secret("SUPABASE_URL", default=self.SUPABASE_URL)
            self.SUPABASE_ANON_KEY = get_secret("SUPABASE_ANON_KEY", default=self.SUPABASE_ANON_KEY)
            self.SUPABASE_SERVICE_ROLE_KEY = get_secret("SUPABASE_SERVICE_ROLE_KEY", default=self.SUPABASE_SERVICE_ROLE_KEY)

        except Exception as e:
            if self.ENV in ["production", "staging"]:
                raise RuntimeError(f"Failed to load production configuration: {e}")
            else:
                print(f"Warning: Failed to load some configuration: {e}")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "allow"


# Create a single instance of the settings
settings: 'SecureSettings' = SecureSettings()


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
