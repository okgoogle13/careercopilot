"""
Application configuration with secure secret management.

This module provides a centralized way to access configuration values,
with support for loading secrets from Google Cloud Secret Manager.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional

from pydantic_settings import BaseSettings

# Import the secure settings
from .secure_config import settings as secure_settings


# For backward compatibility
class Settings(BaseSettings):
    """Legacy settings class for backward compatibility."""

    # Core application settings
    debug: bool = secure_settings.DEBUG
    environment: str = secure_settings.ENV
    log_level: str = secure_settings.LOG_LEVEL

    # Application settings
    enable_ai_features: bool = secure_settings.ENABLE_AI_FEATURES
    enable_multi_agent: bool = secure_settings.ENABLE_MULTI_AGENT
    enable_ml_analysis: bool = secure_settings.ENABLE_ML_ANALYSIS
    enable_web_search: bool = secure_settings.ENABLE_WEB_SEARCH
    enable_email_notifications: bool = secure_settings.ENABLE_EMAIL_NOTIFICATIONS
    enable_hot_reload: bool = secure_settings.ENABLE_HOT_RELOAD
    show_debug_info: bool = secure_settings.SHOW_DEBUG_INFO

    # AI Settings
    model_name: str = Field("gemini-3.0-flash", description="AI model to use")
    ai_max_tokens: int = 2000
    ai_temperature: float = 0.2

    # Document processing
    max_document_size_mb: int = 10
    allowed_document_types: List[str] = field(
        default_factory=lambda: ["application/pdf", "text/plain", "text/markdown"]
    )

    # Performance settings
    max_workers: int = secure_settings.MAX_WORKERS
    db_pool_size: int = secure_settings.DB_POOL_SIZE

    # API Keys (from secure settings)
    anthropic_api_key: str = secure_settings.ANTHROPIC_API_KEY or ""
    gemini_api_key: str = secure_settings.GEMINI_API_KEY or ""

    # Firebase/Google Cloud settings
    google_application_credentials: str = ""
    gcp_project_id: str = secure_settings.GCP_PROJECT_ID or ""
    google_cloud_project: str = secure_settings.GOOGLE_CLOUD_PROJECT or ""

    # Database settings
    database_url: str = secure_settings.DATABASE_URL or ""

    # Authentication
    secret_key: str = secure_settings.SECRET_KEY
    algorithm: str = secure_settings.ALGORITHM

    # Cache (using Firestore)
    cache_collection: str = secure_settings.CACHE_COLLECTION

    # ATS Scoring Configuration
    ats_scoring_weights: Dict[str, float] = field(
        default_factory=lambda: {"keyword": 0.45, "semantic": 0.35, "formatting": 0.20}
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        # Allow extra environment variables that are not explicitly declared as fields
        # This prevents errors like 'Extra inputs are not permitted' when .env contains
        # additional keys unrelated to this settings model.
        extra = "ignore"


@dataclass
class PersonalCareerConfig:
    """Personal configuration for CareerCopilot"""

    name: str = "Your Name"
    email: str = "nishantdougall@gmail.com"
    location: str = "Northcote, VIC, Australia"
    career_transition_from: str = "Finance"
    career_transition_to: str = "Social Work/Community Services"
    target_industries: List[str] = field(
        default_factory=lambda: [
            "Healthcare",
            "Education",
            "Community Services",
            "Government",
        ]
    )
    target_roles: List[str] = field(
        default_factory=lambda: [
            "Social Worker",
            "Case Manager",
            "Community Services Worker",
        ]
    )
    salary_range: Dict[str, Any] = field(
        default_factory=lambda: {"min": 60000, "max": 85000, "currency": "AUD"}
    )
    transferable_skills: List[str] = field(
        default_factory=lambda: [
            "Financial Analysis",
            "Data Analysis",
            "Client Relationship Management",
            "Risk Assessment",
            "Stakeholder Management",
            "Report Writing",
        ]
    )
    personal_story: Dict[str, str] = field(
        default_factory=lambda: {
            "background": "Finance professional transitioning to social work",
            "motivation": "Direct community impact and social justice",
        }
    )
    email_notifications: bool = True


# Global configuration instances
settings = Settings()
_personal_config: Optional[PersonalCareerConfig] = None


def get_personal_config() -> PersonalCareerConfig:
    """Get or create global PersonalCareerConfig instance"""
    global _personal_config
    if _personal_config is None:
        _personal_config = PersonalCareerConfig()
    return _personal_config


def validate_required_api_keys() -> None:
    """
    Fail-fast validation of required API keys on application startup.

    Raises:
        RuntimeError: If required API keys are missing and AI features are enabled.
    """
    missing_keys = []

    # Only validate if AI features are enabled
    if not settings.enable_ai_features:
        return

    # Check for required AI service API keys
    if not settings.gemini_api_key:
        missing_keys.append("GEMINI_API_KEY")

    # Check for other optional but recommended keys
    warnings = []
    if not settings.anthropic_api_key:
        warnings.append("ANTHROPIC_API_KEY (optional fallback AI service)")

    # Fail fast if critical keys are missing
    if missing_keys:
        missing_keys_str = ", ".join(missing_keys)
        raise RuntimeError(
            f"Critical API keys are missing: {missing_keys_str}. "
            f"AI features are enabled but required keys are not configured. "
            f"Please set these environment variables or disable AI features with ENABLE_AI_FEATURES=false."
        )

    # Log warnings for missing optional keys
    if warnings:
        import logging

        logger = logging.getLogger(__name__)
        warnings_str = ", ".join(warnings)
        logger.warning(
            f"Optional API keys are missing: {warnings_str}. This may limit fallback capabilities."
        )
