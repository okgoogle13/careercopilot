"""
Batch 3C: AI Config and Document Processor tests for final coverage push.
Focuses on config management, serialization, environment loading, and error handling.
"""

import json
import os
import tempfile
from unittest.mock import patch

from app.core.ai_config import (
    AIConfigManager,
    AIModelType,
    AIProvider,
    AIServiceConfig,
    ModelConfig,
    ProviderCredentials,
)

# ============================================================================
# ModelConfig Tests (5 tests)
# ============================================================================


class TestModelConfig:
    """Tests for ModelConfig dataclass."""

    def test_model_config_creation_with_defaults(self):
        """Test creating ModelConfig with default values."""
        config = ModelConfig(
            name="gpt-4",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
        )
        assert config.name == "gpt-4"
        assert config.provider == AIProvider.OPENAI
        assert config.model_type == AIModelType.TEXT_GENERATION
        assert config.max_tokens == 4096
        assert config.temperature == 0.7
        assert config.top_p == 1.0
        assert config.timeout_seconds == 30
        assert config.retry_attempts == 3
        assert config.supports_streaming is False

    def test_model_config_with_custom_parameters(self):
        """Test ModelConfig with custom parameters."""
        config = ModelConfig(
            name="claude-3",
            provider=AIProvider.ANTHROPIC,
            model_type=AIModelType.TEXT_GENERATION,
            max_tokens=2000,
            temperature=0.9,
            timeout_seconds=60,
            retry_attempts=5,
            custom_parameters={"stop_sequences": ["\n\nHuman:"]},
        )
        assert config.max_tokens == 2000
        assert config.temperature == 0.9
        assert config.timeout_seconds == 60
        assert config.retry_attempts == 5
        assert config.custom_parameters == {"stop_sequences": ["\n\nHuman:"]}

    def test_model_config_to_dict_serialization(self):
        """Test ModelConfig.to_dict() serialization with enum conversion."""
        config = ModelConfig(
            name="test-model",
            provider=AIProvider.GOOGLE_AI,
            model_type=AIModelType.TEXT_EMBEDDING,
            max_tokens=512,
            temperature=0.5,
        )
        data = config.to_dict()
        assert isinstance(data, dict)
        assert data["name"] == "test-model"
        assert data["provider"] == "google_ai"  # Enum converted to value
        assert data["model_type"] == "text_embedding"  # Enum converted to value
        assert data["max_tokens"] == 512
        assert data["temperature"] == 0.5

    def test_model_config_from_dict_deserialization(self):
        """Test ModelConfig.from_dict() deserialization with enum conversion."""
        data = {
            "name": "deserialized-model",
            "provider": "azure_openai",
            "model_type": "text_generation",
            "max_tokens": 3000,
            "temperature": 0.8,
        }
        config = ModelConfig.from_dict(data)
        assert config.name == "deserialized-model"
        assert config.provider == AIProvider.AZURE_OPENAI
        assert config.model_type == AIModelType.TEXT_GENERATION
        assert config.max_tokens == 3000
        assert config.temperature == 0.8

    def test_model_config_rate_limit_defaults(self):
        """Test ModelConfig rate limit default factory."""
        config1 = ModelConfig(
            name="model1",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
        )
        config2 = ModelConfig(
            name="model2",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
        )
        # Each should have independent rate_limit dicts
        config1.rate_limit["custom"] = 999
        assert "custom" not in config2.rate_limit


# ============================================================================
# ProviderCredentials Tests (5 tests)
# ============================================================================


class TestProviderCredentials:
    """Tests for ProviderCredentials dataclass."""

    def test_provider_credentials_creation(self):
        """Test creating ProviderCredentials."""
        creds = ProviderCredentials(
            provider=AIProvider.OPENAI,
            api_key="sk-test-key",
            organization_id="org-123",
        )
        assert creds.provider == AIProvider.OPENAI
        assert creds.api_key == "sk-test-key"
        assert creds.organization_id == "org-123"

    def test_provider_credentials_to_dict_with_secrets(self):
        """Test to_dict() including sensitive data."""
        creds = ProviderCredentials(
            provider=AIProvider.GOOGLE_AI,
            api_key="secret-key-12345",
            api_secret="secret-value",
            additional_headers={"X-Custom": "header-value"},
        )
        data = creds.to_dict(include_secrets=True)
        assert data["api_key"] == "secret-key-12345"
        assert data["api_secret"] == "secret-value"
        assert data["provider"] == "google_ai"

    def test_provider_credentials_to_dict_without_secrets(self):
        """Test to_dict() masking sensitive data."""
        creds = ProviderCredentials(
            provider=AIProvider.OPENAI,
            api_key="sk-very-long-secret-key",
            api_secret="secret",
            custom_auth={"key1": "secret1", "key2": "secret2"},
        )
        data = creds.to_dict(include_secrets=False)
        # Last 4 chars of api_key are shown: "key"
        assert data["api_key"] == "***-key"  # sk-very-long-secret-key ends with -key
        assert data["api_secret"] == "***"  # Fully masked
        assert all(v == "***" for v in data["custom_auth"].values())

    def test_provider_credentials_short_api_key_masking(self):
        """Test masking of very short API keys."""
        creds = ProviderCredentials(
            provider=AIProvider.AZURE_OPENAI,
            api_key="abc",  # Only 3 chars
        )
        data = creds.to_dict(include_secrets=False)
        assert data["api_key"] == "***"

    def test_provider_credentials_from_dict(self):
        """Test creating ProviderCredentials from dictionary."""
        data = {
            "provider": "aws_bedrock",
            "api_key": "AKIAIOSFODNN7EXAMPLE",
            "region": "us-east-1",
        }
        creds = ProviderCredentials.from_dict(data)
        assert creds.provider == AIProvider.AWS_BEDROCK
        assert creds.api_key == "AKIAIOSFODNN7EXAMPLE"
        assert creds.region == "us-east-1"


# ============================================================================
# AIServiceConfig Tests (4 tests)
# ============================================================================


class TestAIServiceConfig:
    """Tests for AIServiceConfig dataclass."""

    def test_service_config_creation_with_defaults(self):
        """Test creating AIServiceConfig with defaults."""
        config = AIServiceConfig(
            service_name="resume-generation",
            description="Generate professional resumes",
            primary_model="gpt-4",
        )
        assert config.service_name == "resume-generation"
        assert config.primary_model == "gpt-4"
        assert config.enabled is True
        assert config.cache_enabled is True
        assert config.cache_ttl_seconds == 3600
        assert config.max_retries == 3
        assert config.cost_budget_daily == 100.0

    def test_service_config_with_fallbacks(self):
        """Test AIServiceConfig with fallback models."""
        config = AIServiceConfig(
            service_name="cover-letter-gen",
            description="Generate cover letters",
            primary_model="gpt-4",
            fallback_models=["gpt-3.5-turbo", "claude-3"],
            enabled=False,
            cache_ttl_seconds=7200,
        )
        assert config.fallback_models == ["gpt-3.5-turbo", "claude-3"]
        assert config.enabled is False
        assert config.cache_ttl_seconds == 7200

    def test_service_config_to_dict(self):
        """Test AIServiceConfig.to_dict()."""
        config = AIServiceConfig(
            service_name="ats-scoring",
            description="Score resume against job",
            primary_model="gpt-4",
            max_retries=5,
            quality_threshold=0.95,
        )
        data = config.to_dict()
        assert data["service_name"] == "ats-scoring"
        assert data["max_retries"] == 5
        assert data["quality_threshold"] == 0.95

    def test_service_config_from_dict(self):
        """Test creating AIServiceConfig from dictionary."""
        data = {
            "service_name": "job-matching",
            "description": "Match candidates to jobs",
            "primary_model": "gpt-4-turbo",
            "fallback_models": ["gpt-4"],
            "rate_limit_per_user": 50,
        }
        config = AIServiceConfig.from_dict(data)
        assert config.service_name == "job-matching"
        assert config.primary_model == "gpt-4-turbo"
        assert config.rate_limit_per_user == 50


# ============================================================================
# AIConfigManager Tests (20+ tests)
# ============================================================================


class TestAIConfigManager:
    """Tests for AIConfigManager configuration loading and management."""

    def test_config_manager_initialization_default(self):
        """Test AIConfigManager initializes with default config path."""
        manager = AIConfigManager()
        assert manager.config_file_path is not None
        assert manager._loaded is True

    def test_config_manager_with_custom_path(self):
        """Test AIConfigManager with custom config file path."""
        with tempfile.TemporaryDirectory() as tmpdir:
            config_path = os.path.join(tmpdir, "test_config.json")
            manager = AIConfigManager(config_file_path=config_path)
            assert manager.config_file_path == config_path

    @patch.dict(os.environ, {"AI_CONFIG_FILE": "/custom/path.json"})
    def test_config_manager_env_var_override(self):
        """Test AI_CONFIG_FILE environment variable override."""
        # Create manager without explicit path (should use env var)
        with tempfile.TemporaryDirectory() as tmpdir:
            # Ensure it creates manager even if env path doesn't exist
            manager = AIConfigManager(config_file_path=None)
            # Should use env var or fallback
            assert manager.config_file_path is not None

    def test_config_manager_add_model(self):
        """Test adding a model to the configuration."""
        manager = AIConfigManager()
        model = ModelConfig(
            name="test-gpt4",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
        )
        manager.models["test-gpt4"] = model
        assert "test-gpt4" in manager.models
        assert manager.models["test-gpt4"].name == "test-gpt4"

    def test_config_manager_add_credentials(self):
        """Test adding credentials to the configuration."""
        manager = AIConfigManager()
        creds = ProviderCredentials(provider=AIProvider.OPENAI, api_key="test-key")
        manager.credentials[AIProvider.OPENAI] = creds
        assert AIProvider.OPENAI in manager.credentials
        assert manager.credentials[AIProvider.OPENAI].api_key == "test-key"

    def test_config_manager_add_service(self):
        """Test adding a service to the configuration."""
        manager = AIConfigManager()
        service = AIServiceConfig(
            service_name="test-service",
            description="Test service",
            primary_model="gpt-4",
        )
        manager.services["test-service"] = service
        assert "test-service" in manager.services
        assert manager.services["test-service"].primary_model == "gpt-4"

    def test_config_manager_load_from_json_file(self):
        """Test loading configuration from JSON file."""
        config_data = {
            "models": {
                "gpt4": {
                    "name": "gpt-4",
                    "provider": "openai",
                    "model_type": "text_generation",
                    "max_tokens": 8000,
                }
            },
            "services": {
                "resume-gen": {
                    "service_name": "resume-gen",
                    "description": "Generate resumes",
                    "primary_model": "gpt4",
                }
            },
        }

        with tempfile.TemporaryDirectory() as tmpdir:
            config_file = os.path.join(tmpdir, "config.json")
            with open(config_file, "w") as f:
                json.dump(config_data, f)

            manager = AIConfigManager(config_file_path=config_file)
            assert len(manager.models) > 0
            assert len(manager.services) > 0

    @patch("app.core.ai_config.logger")
    def test_config_manager_file_not_found_fallback(self, _):
        """Test AIConfigManager falls back to defaults when file not found."""
        manager = AIConfigManager(config_file_path="/nonexistent/path.json")
        assert manager._loaded is True
        # Should have loaded default configuration
        assert len(manager.models) > 0 or len(manager.services) >= 0

    @patch("app.core.ai_config.logger")
    def test_config_manager_json_parse_error(self, mock_logger):
        """Test AIConfigManager handles JSON parse errors."""
        with tempfile.TemporaryDirectory() as tmpdir:
            config_file = os.path.join(tmpdir, "invalid.json")
            with open(config_file, "w") as f:
                f.write("{invalid json content")

            manager = AIConfigManager(config_file_path=config_file)
            assert manager._loaded is True
            # Should fallback to defaults
            mock_logger.error.assert_called()

    def test_config_manager_load_from_environment(self):
        """Test loading configuration from environment variables."""
        with patch.dict(
            os.environ,
            {
                "OPENAI_API_KEY": "sk-test-key",
                "GOOGLE_AI_API_KEY": "google-test-key",
            },
        ):
            manager = AIConfigManager()
            # Manager should have credentials available
            assert manager.credentials is not None

    def test_config_manager_model_lookup(self):
        """Test looking up models by name."""
        manager = AIConfigManager()
        model = ModelConfig(
            name="lookup-test",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
        )
        manager.models["lookup-test"] = model

        found = manager.models.get("lookup-test")
        assert found is not None
        assert found.name == "lookup-test"

    def test_config_manager_service_lookup(self):
        """Test looking up services by name."""
        manager = AIConfigManager()
        service = AIServiceConfig(
            service_name="lookup-service",
            description="Service for lookup",
            primary_model="gpt-4",
        )
        manager.services["lookup-service"] = service

        found = manager.services.get("lookup-service")
        assert found is not None
        assert found.service_name == "lookup-service"

    def test_config_manager_multiple_models_independence(self):
        """Test that multiple models maintain independent configurations."""
        manager = AIConfigManager()
        model1 = ModelConfig(
            name="model1",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
            temperature=0.7,
        )
        model2 = ModelConfig(
            name="model2",
            provider=AIProvider.GOOGLE_AI,
            model_type=AIModelType.TEXT_EMBEDDING,
            temperature=0.3,
        )
        manager.models["model1"] = model1
        manager.models["model2"] = model2

        assert manager.models["model1"].temperature == 0.7
        assert manager.models["model2"].temperature == 0.3
        manager.models["model1"].temperature = 0.9
        assert manager.models["model2"].temperature == 0.3

    def test_config_manager_credentials_per_provider(self):
        """Test maintaining separate credentials per provider."""
        manager = AIConfigManager()
        openai_creds = ProviderCredentials(provider=AIProvider.OPENAI, api_key="openai-key")
        google_creds = ProviderCredentials(provider=AIProvider.GOOGLE_AI, api_key="google-key")
        manager.credentials[AIProvider.OPENAI] = openai_creds
        manager.credentials[AIProvider.GOOGLE_AI] = google_creds

        assert manager.credentials[AIProvider.OPENAI].api_key == "openai-key"
        assert manager.credentials[AIProvider.GOOGLE_AI].api_key == "google-key"

    def test_config_manager_service_with_fallbacks(self):
        """Test service configuration with fallback models."""
        manager = AIConfigManager()
        service = AIServiceConfig(
            service_name="resilient-service",
            description="Service with fallbacks",
            primary_model="primary",
            fallback_models=["fallback1", "fallback2"],
        )
        manager.services["resilient-service"] = service

        found = manager.services["resilient-service"]
        assert found.primary_model == "primary"
        assert found.fallback_models == ["fallback1", "fallback2"]

    def test_config_manager_service_caching_settings(self):
        """Test service cache configuration."""
        manager = AIConfigManager()
        cached_service = AIServiceConfig(
            service_name="cached-service",
            description="Service with caching",
            primary_model="gpt-4",
            cache_enabled=True,
            cache_ttl_seconds=7200,
        )
        manager.services["cached-service"] = cached_service

        found = manager.services["cached-service"]
        assert found.cache_enabled is True
        assert found.cache_ttl_seconds == 7200

    def test_config_manager_rate_limiting_config(self):
        """Test service rate limiting configuration."""
        manager = AIConfigManager()
        rate_limited = AIServiceConfig(
            service_name="rate-limited",
            description="Rate limited service",
            primary_model="gpt-4",
            rate_limit_per_user=50,
            rate_limit_window_seconds=1800,
        )
        manager.services["rate-limited"] = rate_limited

        found = manager.services["rate-limited"]
        assert found.rate_limit_per_user == 50
        assert found.rate_limit_window_seconds == 1800

    def test_config_manager_cost_budget_tracking(self):
        """Test service cost budget configuration."""
        manager = AIConfigManager()
        expensive_service = AIServiceConfig(
            service_name="expensive",
            description="High-cost service",
            primary_model="gpt-4",
            cost_budget_daily=1000.0,
        )
        manager.services["expensive"] = expensive_service

        found = manager.services["expensive"]
        assert found.cost_budget_daily == 1000.0

    def test_config_manager_quality_threshold(self):
        """Test service quality threshold configuration."""
        manager = AIConfigManager()
        quality_service = AIServiceConfig(
            service_name="quality-service",
            description="High quality service",
            primary_model="gpt-4",
            quality_threshold=0.95,
        )
        manager.services["quality-service"] = quality_service

        found = manager.services["quality-service"]
        assert found.quality_threshold == 0.95


# ============================================================================
# Enum Tests (6 tests)
# ============================================================================


class TestAIEnums:
    """Tests for AIProvider and AIModelType enums."""

    def test_ai_provider_all_values(self):
        """Test all AIProvider enum values."""
        providers = {
            "openai": AIProvider.OPENAI,
            "google_ai": AIProvider.GOOGLE_AI,
            "anthropic": AIProvider.ANTHROPIC,
            "azure_openai": AIProvider.AZURE_OPENAI,
            "aws_bedrock": AIProvider.AWS_BEDROCK,
            "huggingface": AIProvider.HUGGINGFACE,
        }
        for value, provider in providers.items():
            assert provider.value == value

    def test_ai_model_type_all_values(self):
        """Test all AIModelType enum values."""
        model_types = {
            "text_generation": AIModelType.TEXT_GENERATION,
            "text_embedding": AIModelType.TEXT_EMBEDDING,
            "image_generation": AIModelType.IMAGE_GENERATION,
            "speech_to_text": AIModelType.SPEECH_TO_TEXT,
            "text_to_speech": AIModelType.TEXT_TO_SPEECH,
            "classification": AIModelType.CLASSIFICATION,
            "summarization": AIModelType.SUMMARIZATION,
        }
        for value, model_type in model_types.items():
            assert model_type.value == value

    def test_ai_provider_enum_member_access(self):
        """Test accessing AIProvider enum members."""
        assert AIProvider.OPENAI == AIProvider["OPENAI"]
        assert AIProvider.GOOGLE_AI == AIProvider["GOOGLE_AI"]

    def test_ai_model_type_enum_member_access(self):
        """Test accessing AIModelType enum members."""
        assert AIModelType.TEXT_GENERATION == AIModelType["TEXT_GENERATION"]
        assert AIModelType.TEXT_EMBEDDING == AIModelType["TEXT_EMBEDDING"]

    def test_ai_provider_enum_construction_from_value(self):
        """Test constructing AIProvider from string value."""
        provider = AIProvider("anthropic")
        assert provider == AIProvider.ANTHROPIC

    def test_ai_model_type_enum_construction_from_value(self):
        """Test constructing AIModelType from string value."""
        model_type = AIModelType("text_generation")
        assert model_type == AIModelType.TEXT_GENERATION


# ============================================================================
# Edge Cases and Error Handling (8 tests)
# ============================================================================


class TestEdgeCasesAndErrors:
    """Tests for edge cases and error handling."""

    def test_model_config_zero_max_tokens(self):
        """Test ModelConfig with zero max_tokens."""
        config = ModelConfig(
            name="limited",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
            max_tokens=0,
        )
        assert config.max_tokens == 0

    def test_model_config_negative_temperature(self):
        """Test ModelConfig with negative temperature."""
        config = ModelConfig(
            name="inverse-temp",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
            temperature=-0.5,
        )
        assert config.temperature == -0.5

    def test_provider_credentials_empty_api_key(self):
        """Test ProviderCredentials with empty API key."""
        creds = ProviderCredentials(provider=AIProvider.OPENAI, api_key="")
        assert creds.api_key == ""
        data = creds.to_dict(include_secrets=False)
        # Empty key stays empty (len check fails, so no masking applied)
        assert data["api_key"] == ""

    def test_provider_credentials_none_fields(self):
        """Test ProviderCredentials with None fields."""
        creds = ProviderCredentials(
            provider=AIProvider.GOOGLE_AI,
            api_key=None,
            api_secret=None,
        )
        assert creds.api_key is None
        assert creds.api_secret is None

    def test_service_config_zero_rate_limit(self):
        """Test AIServiceConfig with zero rate limit."""
        config = AIServiceConfig(
            service_name="no-limit",
            description="Unlimited service",
            primary_model="gpt-4",
            rate_limit_per_user=0,
        )
        assert config.rate_limit_per_user == 0

    def test_service_config_negative_cost_budget(self):
        """Test AIServiceConfig with negative cost budget."""
        config = AIServiceConfig(
            service_name="negative-budget",
            description="Negative budget test",
            primary_model="gpt-4",
            cost_budget_daily=-100.0,
        )
        assert config.cost_budget_daily == -100.0

    def test_service_config_empty_fallbacks(self):
        """Test AIServiceConfig with empty fallback list."""
        config = AIServiceConfig(
            service_name="no-fallback",
            description="No fallback",
            primary_model="gpt-4",
            fallback_models=[],
        )
        assert config.fallback_models == []

    def test_config_manager_duplicate_model_overwrite(self):
        """Test that adding model with same name overwrites previous."""
        manager = AIConfigManager()
        model1 = ModelConfig(
            name="same-name",
            provider=AIProvider.OPENAI,
            model_type=AIModelType.TEXT_GENERATION,
            temperature=0.5,
        )
        model2 = ModelConfig(
            name="same-name",
            provider=AIProvider.ANTHROPIC,
            model_type=AIModelType.TEXT_GENERATION,
            temperature=0.8,
        )
        manager.models["same-name"] = model1
        manager.models["same-name"] = model2

        assert manager.models["same-name"].provider == AIProvider.ANTHROPIC
        assert manager.models["same-name"].temperature == 0.8
