"""
Centralized AI Service Configuration System

Manages all AI service configurations, credentials, model settings,
and provider-specific parameters in a unified, secure manner.
"""

import json
import logging
import os
from dataclasses import asdict, dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class AIProvider(Enum):
    """Supported AI service providers"""

    OPENAI = "openai"
    GOOGLE_AI = "google_ai"
    ANTHROPIC = "anthropic"
    AZURE_OPENAI = "azure_openai"
    AWS_BEDROCK = "aws_bedrock"
    HUGGINGFACE = "huggingface"


class AIModelType(Enum):
    """Types of AI models"""

    TEXT_GENERATION = "text_generation"
    TEXT_EMBEDDING = "text_embedding"
    IMAGE_GENERATION = "image_generation"
    SPEECH_TO_TEXT = "speech_to_text"
    TEXT_TO_SPEECH = "text_to_speech"
    CLASSIFICATION = "classification"
    SUMMARIZATION = "summarization"


@dataclass
class ModelConfig:
    """Configuration for a specific AI model"""

    name: str
    provider: AIProvider
    model_type: AIModelType
    endpoint_url: Optional[str] = None
    model_id: str = ""
    max_tokens: int = 4096
    temperature: float = 0.7
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    timeout_seconds: int = 30
    retry_attempts: int = 3
    cost_per_1k_tokens: Dict[str, float] = field(
        default_factory=lambda: {"input": 0.0, "output": 0.0}
    )
    rate_limit: Dict[str, int] = field(
        default_factory=lambda: {"requests_per_minute": 60, "tokens_per_minute": 10000}
    )
    context_window: int = 4096
    supports_streaming: bool = False
    supports_function_calling: bool = False
    custom_parameters: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary with enum serialization"""
        data = asdict(self)
        data["provider"] = self.provider.value
        data["model_type"] = self.model_type.value
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ModelConfig":
        """Create from dictionary with enum deserialization"""
        data = data.copy()
        data["provider"] = AIProvider(data["provider"])
        data["model_type"] = AIModelType(data["model_type"])
        return cls(**data)


@dataclass
class ProviderCredentials:
    """Credentials for an AI service provider"""

    provider: AIProvider
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    endpoint_url: Optional[str] = None
    region: Optional[str] = None
    organization_id: Optional[str] = None
    project_id: Optional[str] = None
    additional_headers: Dict[str, str] = field(default_factory=dict)
    custom_auth: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self, include_secrets: bool = False) -> Dict[str, Any]:
        """Convert to dictionary, optionally excluding sensitive data"""
        data = asdict(self)
        data["provider"] = self.provider.value

        if not include_secrets:
            # Mask sensitive information
            if data.get("api_key"):
                data["api_key"] = (
                    f"***{data['api_key'][-4:]}" if len(data["api_key"]) > 4 else "***"
                )
            if data.get("api_secret"):
                data["api_secret"] = "***"
            data["custom_auth"] = {k: "***" for k in data.get("custom_auth", {})}

        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ProviderCredentials":
        """Create from dictionary"""
        data = data.copy()
        data["provider"] = AIProvider(data["provider"])
        return cls(**data)


@dataclass
class AIServiceConfig:
    """Configuration for a specific AI service/operation"""

    service_name: str
    description: str
    primary_model: str
    fallback_models: List[str] = field(default_factory=list)
    enabled: bool = True
    cache_enabled: bool = True
    cache_ttl_seconds: int = 3600
    max_retries: int = 3
    timeout_seconds: int = 30
    rate_limit_per_user: int = 100
    rate_limit_window_seconds: int = 3600
    cost_budget_daily: float = 100.0  # USD per day
    quality_threshold: float = 0.8
    monitoring_enabled: bool = True
    custom_settings: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AIServiceConfig":
        """Create from dictionary"""
        return cls(**data)


class AIConfigManager:
    """Central manager for all AI service configurations"""

    def __init__(self, config_file_path: Optional[str] = None):
        self.config_file_path = config_file_path or os.getenv(
            "AI_CONFIG_FILE", "config/ai_config.json"
        )

        self.models: Dict[str, ModelConfig] = {}
        self.credentials: Dict[AIProvider, ProviderCredentials] = {}
        self.services: Dict[str, AIServiceConfig] = {}
        self._loaded = False

        # Load configuration
        self.load_configuration()

    def load_configuration(self) -> None:
        """Load AI configuration from file and environment"""
        try:
            # Load from file if it exists
            config_path = Path(self.config_file_path)
            if config_path.exists():
                with open(config_path, "r") as f:
                    file_config = json.load(f)
                self._load_from_dict(file_config)
                logger.info(f"Loaded AI configuration from {config_path}")
            else:
                logger.info(f"No config file found at {config_path}, using defaults")

            # Override with environment variables
            self._load_from_environment()

            # Load default configurations if none exist
            if not self._loaded:
                self._load_default_configuration()

            self._loaded = True
            logger.info(
                f"AI configuration loaded: {len(self.models)} models, {len(self.services)} services"
            )

        except Exception as e:
            logger.error(f"Failed to load AI configuration: {e}")
            self._load_default_configuration()
            self._loaded = True

    def _load_from_dict(self, config: Dict[str, Any]) -> None:
        """Load configuration from dictionary"""
        # Load models
        if "models" in config:
            for model_name, model_data in config["models"].items():
                self.models[model_name] = ModelConfig.from_dict(model_data)

        # Load credentials (from environment for security)
        if "credentials" in config:
            for provider_name, cred_data in config["credentials"].items():
                provider = AIProvider(provider_name)
                self.credentials[provider] = ProviderCredentials.from_dict(cred_data)

        # Load services
        if "services" in config:
            for service_name, service_data in config["services"].items():
                self.services[service_name] = AIServiceConfig.from_dict(service_data)

    def _load_from_environment(self) -> None:
        """Load configuration from environment variables"""
        # Load provider credentials from environment
        env_credentials = {
            AIProvider.OPENAI: {
                "api_key": os.getenv("OPENAI_API_KEY"),
                "organization_id": os.getenv("OPENAI_ORG_ID"),
            },
            AIProvider.GOOGLE_AI: {
                "api_key": os.getenv("GOOGLE_AI_API_KEY"),
                "project_id": os.getenv("GOOGLE_CLOUD_PROJECT"),
            },
            AIProvider.ANTHROPIC: {"api_key": os.getenv("ANTHROPIC_API_KEY")},
            AIProvider.AZURE_OPENAI: {
                "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
                "endpoint_url": os.getenv("AZURE_OPENAI_ENDPOINT"),
                "region": os.getenv("AZURE_OPENAI_REGION"),
            },
            AIProvider.AWS_BEDROCK: {
                "region": os.getenv("AWS_DEFAULT_REGION"),
                "custom_auth": {
                    "aws_access_key_id": os.getenv("AWS_ACCESS_KEY_ID"),
                    "aws_secret_access_key": os.getenv("AWS_SECRET_ACCESS_KEY"),
                },
            },
        }

        for provider, creds in env_credentials.items():
            # Only create credentials if at least one value is present
            if any(v for v in creds.values() if v):
                if provider not in self.credentials:
                    self.credentials[provider] = ProviderCredentials(provider=provider)

                # Update existing credentials with environment values
                for key, value in creds.items():
                    if value:
                        if key == "custom_auth":
                            self.credentials[provider].custom_auth.update(value)
                        else:
                            setattr(self.credentials[provider], key, value)

        # Load global settings from environment
        global_settings = {
            "AI_CACHE_ENABLED": os.getenv("AI_CACHE_ENABLED", "true").lower() == "true",
            "AI_MONITORING_ENABLED": os.getenv("AI_MONITORING_ENABLED", "true").lower() == "true",
            "AI_RETRY_ATTEMPTS": int(os.getenv("AI_RETRY_ATTEMPTS", "3")),
            "AI_TIMEOUT_SECONDS": int(os.getenv("AI_TIMEOUT_SECONDS", "30")),
            "AI_COST_BUDGET_DAILY": float(os.getenv("AI_COST_BUDGET_DAILY", "100.0")),
        }

        # Apply global settings to all services
        for service in self.services.values():
            service.cache_enabled = global_settings["AI_CACHE_ENABLED"]
            service.monitoring_enabled = global_settings["AI_MONITORING_ENABLED"]
            service.max_retries = global_settings["AI_RETRY_ATTEMPTS"]
            service.timeout_seconds = global_settings["AI_TIMEOUT_SECONDS"]
            service.cost_budget_daily = global_settings["AI_COST_BUDGET_DAILY"]

    def _load_default_configuration(self) -> None:
        """Load default AI configuration"""
        # Default models
        default_models = {
            "gpt-4o": ModelConfig(
                name="gpt-4o",
                provider=AIProvider.OPENAI,
                model_type=AIModelType.TEXT_GENERATION,
                model_id="gpt-4o",
                max_tokens=4096,
                temperature=0.7,
                cost_per_1k_tokens={"input": 0.005, "output": 0.015},
                context_window=128000,
                supports_streaming=True,
                supports_function_calling=True,
            ),
            "gpt-4o-mini": ModelConfig(
                name="gpt-4o-mini",
                provider=AIProvider.OPENAI,
                model_type=AIModelType.TEXT_GENERATION,
                model_id="gpt-4o-mini",
                max_tokens=4096,
                temperature=0.7,
                cost_per_1k_tokens={"input": 0.00015, "output": 0.0006},
                context_window=128000,
                supports_streaming=True,
                supports_function_calling=True,
            ),
            "gemini-2.0-flash": ModelConfig(
                name="gemini-2.0-flash",
                provider=AIProvider.GOOGLE_AI,
                model_type=AIModelType.TEXT_GENERATION,
                model_id="gemini-2.0-flash",
                max_tokens=8192,
                temperature=0.7,
                cost_per_1k_tokens={"input": 0.000075, "output": 0.0003},
                context_window=1000000,
                supports_streaming=True,
                supports_function_calling=True,
            ),
            "gemini-2.0-flash-lite": ModelConfig(
                name="gemini-2.0-flash-lite",
                provider=AIProvider.GOOGLE_AI,
                model_type=AIModelType.TEXT_GENERATION,
                model_id="gemini-2.0-flash-lite",
                max_tokens=8192,
                temperature=0.7,
                cost_per_1k_tokens={"input": 0.000037, "output": 0.00015},
                context_window=1000000,
                supports_streaming=True,
                supports_function_calling=True,
            ),
            "gemini-2.0-flash-large-context": ModelConfig(
                name="gemini-2.0-flash-large-context",
                provider=AIProvider.GOOGLE_AI,
                model_type=AIModelType.TEXT_GENERATION,
                model_id="gemini-2.0-flash",
                max_tokens=8192,
                temperature=0.7,
                cost_per_1k_tokens={"input": 0.00125, "output": 0.005},
                context_window=2000000,
                supports_streaming=True,
                supports_function_calling=True,
            ),
            "gemini-1.5-flash": ModelConfig(
                name="gemini-1.5-flash",
                provider=AIProvider.GOOGLE_AI,
                model_type=AIModelType.TEXT_GENERATION,
                model_id="gemini-1.5-flash",
                max_tokens=8192,
                temperature=0.7,
                cost_per_1k_tokens={"input": 0.000075, "output": 0.0003},
                context_window=1000000,
                supports_streaming=True,
                supports_function_calling=True,
            ),
            "claude-3-5-sonnet": ModelConfig(
                name="claude-3-5-sonnet",
                provider=AIProvider.ANTHROPIC,
                model_type=AIModelType.TEXT_GENERATION,
                model_id="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                temperature=0.7,
                cost_per_1k_tokens={"input": 0.003, "output": 0.015},
                context_window=200000,
                supports_streaming=True,
                supports_function_calling=True,
            ),
            "text-embedding-3-small": ModelConfig(
                name="text-embedding-3-small",
                provider=AIProvider.OPENAI,
                model_type=AIModelType.TEXT_EMBEDDING,
                model_id="text-embedding-3-small",
                max_tokens=8191,
                cost_per_1k_tokens={"input": 0.00002, "output": 0.0},
                context_window=8191,
            ),
        }

        # Default services
        default_services = {
            "resume_analysis": AIServiceConfig(
                service_name="resume_analysis",
                description="Analyze resumes for skills, experience, and recommendations",
                primary_model="gpt-4o-mini",
                fallback_models=["gemini-2.0-flash-lite"],
                cache_ttl_seconds=3600,
                rate_limit_per_user=50,
                cost_budget_daily=50.0,
            ),
            "job_analysis": AIServiceConfig(
                service_name="job_analysis",
                description="Analyze job descriptions and extract requirements",
                primary_model="gpt-4o-mini",
                fallback_models=["gemini-2.0-flash-lite"],
                cache_ttl_seconds=7200,
                rate_limit_per_user=30,
                cost_budget_daily=25.0,
            ),
            "ats_scoring": AIServiceConfig(
                service_name="ats_scoring",
                description="Score resume compatibility with job descriptions",
                primary_model="gpt-4o",
                fallback_models=["gpt-4o-mini", "claude-3-5-sonnet"],
                cache_ttl_seconds=1800,
                rate_limit_per_user=20,
                cost_budget_daily=75.0,
            ),
            "cover_letter_generation": AIServiceConfig(
                service_name="cover_letter_generation",
                description="Generate personalized cover letters",
                primary_model="gpt-4o",
                fallback_models=["claude-3-5-sonnet"],
                cache_ttl_seconds=900,
                rate_limit_per_user=10,
                cost_budget_daily=60.0,
            ),
            "voice_profile": AIServiceConfig(
                service_name="voice_profile",
                description="Generate user voice profiles from documents",
                primary_model="gpt-4o",
                fallback_models=["gemini-2.0-flash"],
                cache_ttl_seconds=86400,
                rate_limit_per_user=5,
                cost_budget_daily=30.0,
            ),
            "ksc_generation": AIServiceConfig(
                service_name="ksc_generation",
                description="Generate Knowledge, Skills, Competencies responses",
                primary_model="gpt-4o-mini",
                fallback_models=["gemini-2.0-flash-lite"],
                cache_ttl_seconds=3600,
                rate_limit_per_user=15,
                cost_budget_daily=40.0,
            ),
            "document_extraction": AIServiceConfig(
                service_name="document_extraction",
                description="Extract structured data from documents",
                primary_model="gpt-4o-mini",
                fallback_models=["gemini-2.0-flash-lite"],
                cache_ttl_seconds=7200,
                rate_limit_per_user=100,
                cost_budget_daily=35.0,
            ),
            "text_embedding": AIServiceConfig(
                service_name="text_embedding",
                description="Generate text embeddings for semantic search",
                primary_model="text-embedding-3-small",
                fallback_models=[],
                cache_ttl_seconds=86400,
                rate_limit_per_user=200,
                cost_budget_daily=10.0,
            ),
        }

        self.models.update(default_models)
        self.services.update(default_services)

        logger.info("Loaded default AI configuration")

    def get_model_config(self, model_name: str) -> Optional[ModelConfig]:
        """Get configuration for a specific model"""
        return self.models.get(model_name)

    def get_service_config(self, service_name: str) -> Optional[AIServiceConfig]:
        """Get configuration for a specific service"""
        return self.services.get(service_name)

    def get_provider_credentials(self, provider: AIProvider) -> Optional[ProviderCredentials]:
        """Get credentials for a specific provider"""
        return self.credentials.get(provider)

    def get_models_by_provider(self, provider: AIProvider) -> List[ModelConfig]:
        """Get all models for a specific provider"""
        return [model for model in self.models.values() if model.provider == provider]

    def get_models_by_type(self, model_type: AIModelType) -> List[ModelConfig]:
        """Get all models of a specific type"""
        return [model for model in self.models.values() if model.model_type == model_type]

    def get_enabled_services(self) -> List[AIServiceConfig]:
        """Get all enabled services"""
        return [service for service in self.services.values() if service.enabled]

    def validate_configuration(self) -> Dict[str, List[str]]:
        """Validate the current configuration and return any issues"""
        issues = {"errors": [], "warnings": []}

        # Check for missing credentials
        used_providers = set(model.provider for model in self.models.values())
        for provider in used_providers:
            if provider not in self.credentials:
                issues["warnings"].append(f"Missing credentials for provider: {provider.value}")
            else:
                creds = self.credentials[provider]
                if not creds.api_key and provider != AIProvider.AWS_BEDROCK:
                    issues["warnings"].append(f"No API key configured for {provider.value}")

        # Check service configurations
        for service in self.services.values():
            if service.primary_model not in self.models:
                issues["errors"].append(
                    f"Service '{service.service_name}' uses unknown primary model: "
                    f"{service.primary_model}"
                )

            for fallback_model in service.fallback_models:
                if fallback_model not in self.models:
                    issues["warnings"].append(
                        f"Service '{service.service_name}' uses unknown fallback model: "
                        f"{fallback_model}"
                    )

            if service.cost_budget_daily <= 0:
                issues["warnings"].append(
                    f"Service '{service.service_name}' has no cost budget set"
                )

        # Check model configurations
        for model in self.models.values():
            if model.max_tokens <= 0:
                issues["errors"].append(
                    f"Model '{model.name}' has invalid max_tokens: {model.max_tokens}"
                )

            if not (0 <= model.temperature <= 2):
                issues["warnings"].append(
                    f"Model '{model.name}' has unusual temperature: {model.temperature}"
                )

        return issues

    def save_configuration(self, file_path: Optional[str] = None) -> None:
        """Save current configuration to file"""
        save_path = file_path or self.config_file_path

        config_data = {
            "models": {name: model.to_dict() for name, model in self.models.items()},
            "services": {name: service.to_dict() for name, service in self.services.items()},
            # Don't save credentials to file for security
            "credentials": {
                provider.value: creds.to_dict(include_secrets=False)
                for provider, creds in self.credentials.items()
            },
        }

        # Ensure directory exists
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)

        with open(save_path, "w") as f:
            json.dump(config_data, f, indent=2, default=str)

        logger.info(f"AI configuration saved to {save_path}")

    def get_configuration_summary(self) -> Dict[str, Any]:
        """Get a summary of the current configuration"""
        return {
            "models": {
                "total": len(self.models),
                "by_provider": {
                    provider.value: len(self.get_models_by_provider(provider))
                    for provider in AIProvider
                    if self.get_models_by_provider(provider)
                },
                "by_type": {
                    model_type.value: len(self.get_models_by_type(model_type))
                    for model_type in AIModelType
                    if self.get_models_by_type(model_type)
                },
            },
            "services": {
                "total": len(self.services),
                "enabled": len(self.get_enabled_services()),
                "disabled": len(self.services) - len(self.get_enabled_services()),
            },
            "providers": {
                "configured": len(self.credentials),
                "available": [provider.value for provider in self.credentials.keys()],
            },
            "validation": self.validate_configuration(),
        }


# Global AI configuration manager instance
_ai_config_manager: Optional[AIConfigManager] = None


def get_ai_config() -> AIConfigManager:
    """Get the global AI configuration manager instance"""
    global _ai_config_manager
    if _ai_config_manager is None:
        _ai_config_manager = AIConfigManager()
    return _ai_config_manager


def setup_ai_config(config_file_path: Optional[str] = None) -> AIConfigManager:
    """Setup the global AI configuration manager"""
    global _ai_config_manager
    _ai_config_manager = AIConfigManager(config_file_path)
    return _ai_config_manager


def reload_ai_config() -> AIConfigManager:
    """Reload the AI configuration from files and environment"""
    config_manager = get_ai_config()
    config_manager.load_configuration()
    return config_manager
