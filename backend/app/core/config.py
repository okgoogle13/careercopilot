"""
Application Configuration Management.

This module provides a centralized and secure way to manage application
configuration. It uses `pydantic-settings` for robust environment variable
parsing and validation, and integrates with `secure_config` to handle
sensitive data like API keys and database URLs, which can be loaded from
Google Cloud Secret Manager.

The main components are:
- `Settings`: A Pydantic model that defines all application configuration
  parameters, serving as a single source of truth for settings.
- `PersonalCareerConfig`: A dataclass for user-specific career preferences,
  allowing for easy personalization of the AI's behavior.
- `validate_required_api_keys`: A startup validation function to ensure
  the application fails fast if critical configurations are missing.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from pydantic_settings import BaseSettings

from .secure_config import settings as secure_settings


class Settings(BaseSettings):
    """
    Main application configuration settings.

    This class defines the complete configuration schema for the application.
    It uses Pydantic's `BaseSettings` to automatically read values from
    environment variables and `.env` files. It also pulls in sensitive values
    from the `secure_settings` object, which handles secret management.

    Attributes:
        debug: Enables or disables debug mode.
        environment: The deployment environment (e.g., 'development', 'production').
        log_level: The logging level for the application.
        enable_ai_features: Global flag to enable or disable all AI-related features.
        ai_model: The default AI model to be used for generation tasks.
        database_url: The connection string for the primary database.
        secret_key: The secret key used for signing JWTs.
        redis_url: The URL for the Redis cache and message broker.
        ... and other application-specific settings.
    """
    debug: bool = secure_settings.DEBUG
    environment: str = secure_settings.ENV
    log_level: str = secure_settings.LOG_LEVEL

    enable_ai_features: bool = secure_settings.ENABLE_AI_FEATURES
    enable_multi_agent: bool = secure_settings.ENABLE_MULTI_AGENT
    enable_ml_analysis: bool = secure_settings.ENABLE_ML_ANALYSIS
    enable_web_search: bool = secure_settings.ENABLE_WEB_SEARCH
    enable_email_notifications: bool = secure_settings.ENABLE_EMAIL_NOTIFICATIONS
    enable_hot_reload: bool = secure_settings.ENABLE_HOT_RELOAD
    show_debug_info: bool = secure_settings.SHOW_DEBUG_INFO

    ai_model: str = "gemini-2.0-flash"
    ai_max_tokens: int = 2000
    ai_temperature: float = 0.2

    enable_rag: bool = True
    rag_chunk_size: int = 1000
    rag_chunk_overlap: int = 200
    rag_vector_collection: str = "document_chunks"
    embedding_model: str = "all-MiniLM-L6-v2"
    embedding_dimension: int = 384
    vertex_ai_index_endpoint: Optional[str] = None
    vertex_ai_region: str = "us-central1"

    max_document_size_mb: int = 10
    allowed_document_types: List[str] = field(
        default_factory=lambda: ["application/pdf", "text/plain", "text/markdown"]
    )

    max_workers: int = secure_settings.MAX_WORKERS
    db_pool_size: int = secure_settings.DB_POOL_SIZE

    openai_api_key: str = secure_settings.OPENAI_API_KEY or ""
    anthropic_api_key: str = secure_settings.ANTHROPIC_API_KEY or ""
    gemini_api_key: str = secure_settings.GEMINI_API_KEY or ""

    google_application_credentials: str = ""
    gcp_project_id: str = secure_settings.GCP_PROJECT_ID or ""
    google_cloud_project: str = secure_settings.GOOGLE_CLOUD_PROJECT or ""
    firebase_project_id: str = secure_settings.FIREBASE_PROJECT_ID or ""

    database_url: str = secure_settings.DATABASE_URL or ""

    secret_key: str = secure_settings.SECRET_KEY
    algorithm: str = secure_settings.ALGORITHM

    redis_url: str = secure_settings.REDIS_URL

    ats_scoring_weights: Dict[str, float] = field(
        default_factory=lambda: {"keyword": 0.45, "semantic": 0.35, "formatting": 0.20}
    )

    class Config:
        """Pydantic configuration options."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


@dataclass
class PersonalCareerConfig:
    """
    Stores personalized career and user-specific information.

    This configuration is used to tailor the AI's responses and analyses to a
    specific user's context, such as their career transition goals, target roles,
    and personal story. It helps the AI generate more relevant and personalized
    content.

    Attributes:
        name: The user's name.
        email: The user's email for notifications.
        location: The user's geographical location.
        career_transition_from: The user's previous career field.
        career_transition_to: The user's target career field.
        target_industries: A list of industries the user is interested in.
        target_roles: A list of specific job roles the user is targeting.
        salary_range: The desired salary range.
        transferable_skills: A list of skills from the previous career.
        personal_story: A dictionary containing the user's background and motivation.
        email_notifications: A flag to enable or disable email notifications for the user.
    """
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
    salary_range: Dict[str, int] = field(
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


settings = Settings()
_personal_config: Optional[PersonalCareerConfig] = None


def get_personal_config() -> PersonalCareerConfig:
    """
    Provides a global singleton instance of the PersonalCareerConfig.

    This function ensures that there is only one instance of the personal
    configuration throughout the application's lifecycle. It creates the
    instance on the first call and returns the existing instance on subsequent
    calls.

    Returns:
        The singleton PersonalCareerConfig instance.
    """
    global _personal_config
    if _personal_config is None:
        _personal_config = PersonalCareerConfig()
    return _personal_config


def validate_required_api_keys() -> None:
    """
    Performs a fail-fast validation of required API keys on application startup.

    This function checks if essential API keys (like `GEMINI_API_KEY`) are present
    in the configuration, but only if AI features are enabled. If a required key
    is missing, it raises a `RuntimeError` to prevent the application from

    starting in a misconfigured state. It also logs warnings for optional but
    recommended keys that are missing.

    Raises:
        RuntimeError: If `settings.enable_ai_features` is True and a critical
                      API key (e.g., `GEMINI_API_KEY`) is not configured.
    """
    if not settings.enable_ai_features:
        return

    missing_keys = []
    if not settings.gemini_api_key:
        missing_keys.append("GEMINI_API_KEY")

    warnings = []
    if not settings.openai_api_key:
        warnings.append("OPENAI_API_KEY (fallback AI service)")
    if not settings.anthropic_api_key:
        warnings.append("ANTHROPIC_API_KEY (fallback AI service)")

    if missing_keys:
        missing_keys_str = ", ".join(missing_keys)
        raise RuntimeError(
            f"Critical API keys are missing: {missing_keys_str}. "
            f"AI features are enabled but required keys are not configured. "
            f"Please set these environment variables or disable AI features with ENABLE_AI_FEATURES=false."
        )

    if warnings:
        import logging
        logger = logging.getLogger(__name__)
        warnings_str = ", ".join(warnings)
        logger.warning(
            f"Optional API keys are missing: {warnings_str}. This may limit fallback capabilities."
        )
