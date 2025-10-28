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
from typing import Any, Dict, List, Optional, Union

from app.ai.model_optimizer import OptimizationConfig, OptimizationLevel

logger = logging.getLogger(__name__)


class AIProvider(Enum):
    """Supported AI service providers"""
    GOOGLE_AI = "google_ai"  # Primary provider for Gemini models
    ANTHROPIC = "anthropic"  # Optional fallback provider


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
    optimization_config: Optional[OptimizationConfig] = field(
        default_factory=lambda: OptimizationConfig(level=OptimizationLevel.NONE)
    )
    optimization_enabled: bool = False

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary with enum serialization"""
        data = asdict(self)
        data["provider"] = self.provider.value
        data["model_type"] = self.model_type.value
        # Handle optimization config serialization
        if self.optimization_config:
            data["optimization_config"] = asdict(self.optimization_config)
            data["optimization_config"]["level"] = self.optimization_config.level.value
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ModelConfig":
        """Create from dictionary with enum deserialization"""
        data = data.copy()
        data["provider"] = AIProvider(data["provider"])
        data["model_type"] = AIModelType(data["model_type"])
        
        # Handle optimization config deserialization
        if "optimization_config" in data and data["optimization_config"]:
            opt_data = data["optimization_config"].copy()
            if isinstance(opt_data, dict):
                opt_data["level"] = OptimizationLevel(opt_data.get("level", "none"))
                data["optimization_config"] = OptimizationConfig(**opt_data)
        
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

    def __init__(self, config_file_path: Optional[str] = None) -> None:
        config_path = config_file_path or os.getenv("AI_CONFIG_FILE", "config/ai_config.json")
        self.config_file_path = str(Path(config_path)) if config_path else "config/ai_config.json"

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
        try:
            # Initialize empty containers with proper types
            models: Dict[str, ModelConfig] = {}
            credentials: Dict[AIProvider, ProviderCredentials] = {}
            services: Dict[str, AIServiceConfig] = {}
            issues: List[str] = []  # Initialize issues list

            # Load models with type checking
            for name, model_data in config.get("models", {}).items():
                try:
                    if not isinstance(model_data, dict):
                        logger.warning(
                            f"Invalid model data for {name}: expected dict, got {type(model_data).__name__}"
                        )
                        continue
                    model = ModelConfig.from_dict(model_data)
                    models[str(name)] = model
                except Exception as e:
                    logger.error(f"Error loading model {name}: {e}")
                    continue

            # Load credentials with type checking
            for provider, cred_data in config.get("credentials", {}).items():
                try:
                    if not isinstance(cred_data, dict):
                        logger.warning(
                            f"Invalid credential data for {provider}: expected dict, got {type(cred_data).__name__}"
                        )
                        continue
                    provider_enum = AIProvider(provider)
                    credentials[provider_enum] = ProviderCredentials.from_dict(cred_data)
                except (ValueError, TypeError) as e:
                    logger.error(f"Error loading credentials for {provider}: {e}")
                    continue

            # Load services with type checking
            for name, service_data in config.get("services", {}).items():
                try:
                    if not isinstance(service_data, dict):
                        logger.warning(
                            f"Invalid service data for {name}: expected dict, got {type(service_data).__name__}"
                        )
                        continue
                    service = AIServiceConfig.from_dict(service_data)
                    services[str(name)] = service
                except Exception as e:
                    logger.error(f"Error loading service {name}: {e}")
                    continue

            # Only update if all validations passed
            self.models = models
            self.credentials = credentials
            self.services = services
            self._loaded = True
            logger.info("Successfully loaded AI configuration from dictionary")

        except Exception as e:
            logger.error(f"Error loading AI configuration: {e}")
            self._loaded = False
            raise

    def _load_from_environment(self) -> None:
        """Load configuration from environment variables"""
        # Load provider credentials from environment
        env_credentials: Dict[AIProvider, Dict[str, Any]] = {
            AIProvider.GOOGLE_AI: {
                "api_key": os.getenv("GOOGLE_AI_API_KEY"),
                "project_id": os.getenv("GOOGLE_CLOUD_PROJECT"),
            },
            AIProvider.ANTHROPIC: {"api_key": os.getenv("ANTHROPIC_API_KEY")},
        }

        for provider, creds in env_credentials.items():
            # Only create credentials if at least one value is present
            if any(v for v in creds.values() if v):
                if provider not in self.credentials:
                    self.credentials[provider] = ProviderCredentials(provider=provider)

                # Update existing credentials with environment values
                for key, value in creds.items():
                    if value:
                        if key == "custom_auth" and isinstance(value, dict):
                            self.credentials[provider].custom_auth.update(value)
                        else:
                            setattr(self.credentials[provider], key, value)

        # Load global settings from environment
        cache_enabled = os.getenv("AI_CACHE_ENABLED", "true").lower() == "true"
        monitoring_enabled = os.getenv("AI_MONITORING_ENABLED", "true").lower() == "true"
        retry_attempts = int(os.getenv("AI_RETRY_ATTEMPTS", "3"))
        timeout_seconds = int(os.getenv("AI_TIMEOUT_SECONDS", "30"))
        cost_budget_daily = float(os.getenv("AI_COST_BUDGET_DAILY", "100.0"))

        # Apply global settings to all services
        for service in self.services.values():
            service.cache_enabled = cache_enabled
            service.monitoring_enabled = monitoring_enabled
            service.max_retries = retry_attempts
            service.timeout_seconds = timeout_seconds
            service.cost_budget_daily = cost_budget_daily

    def _load_default_configuration(self) -> None:
        """Load default AI configuration with Gemini models"""
        self.models = {
            "gemini-2.5-pro": ModelConfig(
                name="gemini-2.5-pro",
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
        return self.models.get(model_name) if model_name in self.models else None

    def get_service_config(self, service_name: str) -> Optional[AIServiceConfig]:
        """Get configuration for a specific service"""
        return self.services.get(service_name) if service_name in self.services else None

    def get_provider_credentials(self, provider: AIProvider) -> Optional[ProviderCredentials]:
        """Get credentials for a specific provider"""
        return self.credentials.get(provider) if provider in self.credentials else None

    def get_models_by_provider(self, provider: AIProvider) -> List[ModelConfig]:
        """Get all models for a specific provider"""
        return (
            [model for model in self.models.values() if model.provider == provider]
            if self.models
            else []
        )

    def get_models_by_type(self, model_type: AIModelType) -> List[ModelConfig]:
        """Get all models of a specific type"""
        return (
            [model for model in self.models.values() if model.model_type == model_type]
            if self.models
            else []
        )

    def get_enabled_services(self) -> List[AIServiceConfig]:
        """Get all enabled services"""
        return (
            [service for service in self.services.values() if service.enabled]
            if self.services
            else []
        )

    def validate_configuration(self) -> List[str]:
        """Validate the current configuration and return any issues"""
        issues: List[str] = []

        # Check for missing required fields
        for model_name, model in self.models.items():
            if not model.name:
                issues.append(f"Model {model_name} is missing required field 'name'")
            if not model.provider:
                issues.append(f"Model {model_name} is missing required field 'provider'")

        # Check for missing credentials for configured providers
        for provider in {model.provider for model in self.models.values()}:
            if provider not in self.credentials:
                issues.append(f"No credentials found for provider: {provider.value}")

        # Check service configurations
        for service_name, service in self.services.items():
            if not service.primary_model:
                issues.append(f"Service {service_name} is missing required field 'primary_model'")
            elif service.primary_model not in self.models:
                issues.append(
                    f"Primary model '{service.primary_model}' for service '{service_name}' not found in models"
                )

            # Check fallback models
            for model_name in service.fallback_models:
                if model_name not in self.models:
                    issues.append(
                        f"Fallback model '{model_name}' for service '{service_name}' not found in models"
                    )

        return issues

    def save_configuration(self, file_path: Optional[str] = None) -> bool:
        """Save current configuration to file"""
        try:
            config_path = file_path or self.config_file_path
            if not config_path:
                raise ValueError("No configuration file path specified")

            save_path = Path(config_path)
            save_path.parent.mkdir(parents=True, exist_ok=True)

            # Prepare config dictionary
            config = {
                "models": {name: model.to_dict() for name, model in self.models.items()},
                "credentials": {
                    provider.value: cred.to_dict(include_secrets=False)
                    for provider, cred in self.credentials.items()
                },
                "services": {name: service.to_dict() for name, service in self.services.items()},
            }

            with save_path.open("w") as f:
                json.dump(config, f, indent=2, default=str)

            logger.info(f"Successfully saved AI configuration to {save_path}")
            return True

        except Exception as e:
            logger.error(f"Error saving AI configuration: {e}")
            return False

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
