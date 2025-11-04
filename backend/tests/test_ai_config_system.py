"""
Tests for the AI configuration and client system
"""

import json
import os
import sys
import tempfile
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))

from core.ai_client import AIClientManager, AIRequest, AIResponse  # noqa: E402
from core.ai_config import (  # noqa: E402
    AIConfigManager,
    AIModelType,
    AIProvider,
    AIServiceConfig,
    ModelConfig,
    ProviderCredentials,
)


class TestAIConfigManager:
    """Test AI configuration management"""

    @pytest.fixture
    def temp_config_file(self):
        """Create a temporary configuration file"""
        config_data = {
            "providers": {
                "google_ai": {
                    "provider": "google_ai",
                    "api_key": "test-google-key",
                    "project_id": "test-project",
                }
            },
            "models": {
                "test-model": {
                    "name": "test-model",
                    "provider": "google_ai",
                    "model_type": "text_generation",
                    "model_id": "gemini-2.5-flash",
                    "max_tokens": 8192,
                    "temperature": 0.7,
                    "cost_per_1k_tokens": {"input": 0.001, "output": 0.002},
                    "rate_limit": {
                        "requests_per_minute": 200,
                        "tokens_per_minute": 30000,
                    },
                    "context_window": 131072,
                    "supports_streaming": True,
                    "supports_function_calling": True,
                }
            },
            "services": {
                "test-service": {
                    "service_name": "test-service",
                    "description": "Test service",
                    "primary_model": "test-model",
                    "fallback_models": [],
                    "enabled": True,
                    "cache_enabled": True,
                    "cache_ttl_seconds": 3600,
                    "max_retries": 3,
                    "timeout_seconds": 60,
                    "rate_limit_per_user": 200,
                    "rate_limit_window_seconds": 3600,
                    "cost_budget_daily": 100.0,
                    "quality_threshold": 0.8,
                    "monitoring_enabled": True,
                    "custom_settings": {},
                }
            },
        }

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump(config_data, f)
            f.flush()
            yield f.name

        # Cleanup
        os.unlink(f.name)

    def test_load_configuration_from_file(self, temp_config_file):
        """Test loading configuration from file"""
        config_manager = AIConfigManager(temp_config_file)

        # Check model was loaded
        assert "test-model" in config_manager.models
        model = config_manager.models["test-model"]
        assert model.name == "test-model"
        assert model.provider == AIProvider.GOOGLE_AI
        assert model.model_type == AIModelType.TEXT_GENERATION

        # Check service was loaded
        assert "test-service" in config_manager.services
        service = config_manager.services["test-service"]
        assert service.service_name == "test-service"
        assert service.primary_model == "test-model"
        assert service.enabled is True

    def test_load_credentials_from_environment(self, temp_config_file, monkeypatch):
        """Test loading credentials from environment variables"""
        # Set environment variables
        monkeypatch.setenv("GOOGLE_AI_API_KEY", "ai-test-key-789")

        config_manager = AIConfigManager(temp_config_file)

        # Check Google AI credentials
        google_creds = config_manager.get_provider_credentials(AIProvider.GOOGLE_AI)
        assert google_creds is not None
        assert google_creds.api_key == "ai-test-key-789"

    def test_default_configuration_loading(self):
        """Test that default configuration is loaded when no file exists"""
        # Use non-existent config file
        config_manager = AIConfigManager("non_existent_config.json")

        # Should have default models and services
        assert len(config_manager.models) > 0
        assert len(config_manager.services) > 0

        # Check some expected default models
        expected_models = ["gemini-2.5-pro", "gemini-2.5-flash"]
        for model_name in expected_models:
            assert model_name in config_manager.models

        # Check some expected default services
        expected_services = ["resume_analysis", "job_analysis", "ats_scoring"]
        for service_name in expected_services:
            assert service_name in config_manager.services

    def test_configuration_validation(self, temp_config_file):
        """Test configuration validation"""
        config_manager = AIConfigManager(temp_config_file)

        # Should pass validation with test config
        validation = config_manager.validate_configuration()

        # Should return a list of warnings (e.g., about missing credentials)
        assert isinstance(validation, list)

        # Check that we have the expected warning about missing credentials
        assert any("No credentials found for provider" in str(warning) for warning in validation)

        # Add invalid service to test error detection
        invalid_service = AIServiceConfig(
            service_name="invalid-service",
            description="Invalid service",
            primary_model="non-existent-model",  # This should cause an error
            fallback_models=["also-non-existent"],
            cost_budget_daily=0.0,  # This should cause a warning
        )
        config_manager.services["invalid-service"] = invalid_service

        # Get new validation results with the invalid service
        validation = config_manager.validate_configuration()

        # Should have warnings about the invalid configuration
        assert any("non-existent-model" in str(warning) for warning in validation)

    def test_get_methods(self, temp_config_file):
        """Test getter methods"""
        config_manager = AIConfigManager(temp_config_file)

        # Test get_model_config
        model = config_manager.get_model_config("test-model")
        assert model is not None
        assert model.name == "test-model"

        # Test get_service_config
        service = config_manager.get_service_config("test-service")
        assert service is not None
        assert service.service_name == "test-service"

        # Test get_models_by_provider
        google_models = config_manager.get_models_by_provider(AIProvider.GOOGLE_AI)
        assert len(google_models) >= 1
        assert any(model.name == "test-model" for model in google_models)

        # Test get_enabled_services
        enabled_services = config_manager.get_enabled_services()
        assert len(enabled_services) >= 1
        assert any(service.service_name == "test-service" for service in enabled_services)

    def test_configuration_summary(self, temp_config_file):
        """Test configuration summary generation"""
        config_manager = AIConfigManager(temp_config_file)
        summary = config_manager.get_configuration_summary()

        assert "models" in summary
        assert "services" in summary
        assert "providers" in summary
        assert "validation" in summary

        assert summary["models"]["total"] >= 1
        assert summary["services"]["total"] >= 1


class TestModelConfig:
    """Test model configuration functionality"""

    def test_model_config_serialization(self):
        """Test model config to/from dict conversion"""
        model = ModelConfig(
            name="test-model",
            provider=AIProvider.GOOGLE_AI,
            model_type=AIModelType.TEXT_GENERATION,
            model_id="gemini-2.5-pro",
            max_tokens=4096,
            temperature=0.7,
        )

        # Test to_dict
        model_dict = model.to_dict()
        assert model_dict["name"] == "test-model"
        assert model_dict["provider"] == "google_ai"
        assert model_dict["model_type"] == "text_generation"

        # Test from_dict
        restored_model = ModelConfig.from_dict(model_dict)
        assert restored_model.name == model.name
        assert restored_model.provider == model.provider
        assert restored_model.model_type == model.model_type


class TestProviderCredentials:
    """Test provider credentials functionality"""

    def test_credentials_serialization(self):
        """Test credentials to_dict with and without secrets"""
        creds = ProviderCredentials(
            provider=AIProvider.GOOGLE_AI,
            api_key="test-google-key-123456789",
            project_id="test-project",
            additional_headers={"Custom-Header": "value"},
        )

        # Test with secrets hidden (default)
        creds_dict = creds.to_dict(include_secrets=False)
        assert creds_dict["api_key"] == "***6789"  # Last 4 chars shown
        assert creds_dict["organization_id"] == "org-123"  # Non-secret field

        # Test with secrets included
        creds_dict_with_secrets = creds.to_dict(include_secrets=True)
        assert creds_dict_with_secrets["api_key"] == "sk-very-secret-key-123456789"


class TestAIClientManager:
    """Test AI client management"""

    @pytest.fixture
    def mock_config_manager(self):
        """Create a mock configuration manager"""
        config_manager = MagicMock()

        # Mock model config
        mock_model = MagicMock()
        mock_model.name = "test-model"
        mock_model.provider = AIProvider.GOOGLE_AI
        mock_model.model_id = "gemini-2.5-flash"
        mock_model.max_tokens = 2000
        mock_model.temperature = 0.7
        mock_model.timeout_seconds = 30
        mock_model.cost_per_1k_tokens = {"input": 0.001, "output": 0.002}

        # Mock service config
        mock_service = MagicMock()
        mock_service.enabled = True
        mock_service.primary_model = "test-model"
        mock_service.fallback_models = []

        # Mock credentials
        mock_creds = MagicMock()
        mock_creds.api_key = "sk-test-key"
        mock_creds.organization_id = None

        config_manager.get_model_config.return_value = mock_model
        config_manager.get_service_config.return_value = mock_service
        config_manager.get_provider_credentials.return_value = mock_creds

        return config_manager

    def test_client_manager_initialization(self, mock_config_manager):
        """Test AI client manager initialization"""
        with patch("core.ai_client.GoogleAIClient") as mock_google_client:
            mock_google_client.return_value = MagicMock()

            client_manager = AIClientManager(mock_config_manager)

            # Should have tried to initialize Google AI client
            assert mock_google_client.called

            # Should have clients dictionary
            assert hasattr(client_manager, "clients")

    @pytest.mark.asyncio
    async def test_generate_text_flow(self, mock_config_manager):
        """Test the text generation flow"""
        # Mock AI client
        mock_client = AsyncMock()
        mock_response = AIResponse(
            content="Generated text response",
            model_used="test-model",
            provider="google_ai",
            tokens_used={"input": 100, "output": 50},
            response_time_ms=250.0,
            cached=False,
            cost_estimate=0.0015,
            metadata={},
            request_id="test-123",
        )
        mock_client.generate_text.return_value = mock_response

        # Create client manager with mocked client
        client_manager = AIClientManager(mock_config_manager)
        client_manager.clients[AIProvider.GOOGLE_AI] = mock_client

        # Create test request
        request = AIRequest(prompt="Test prompt", service_name="test-service", user_id="user-123")

        # Generate text
        with patch("core.ai_client.track_ai_usage") as mock_track:
            response = await client_manager.generate_text(request)

            # Verify response
            assert response.content == "Generated text response"
            assert response.model_used == "test-model"
            assert response.tokens_used["input"] == 100

            # Verify tracking was called
            mock_track.assert_called_once()

    @pytest.mark.asyncio
    async def test_service_not_available(self, mock_config_manager):
        """Test handling of unavailable service"""
        # Mock service as disabled
        mock_config_manager.get_service_config.return_value.enabled = False

        client_manager = AIClientManager(mock_config_manager)

        request = AIRequest(
            prompt="Test prompt", service_name="disabled-service", user_id="user-123"
        )

        # Should raise error for disabled service
        with pytest.raises(ValueError, match="not available"):
            await client_manager.generate_text(request)

    def test_get_available_models(self, mock_config_manager):
        """Test getting available models"""
        # Mock models dictionary
        mock_config_manager.models = {
            "model1": MagicMock(),
            "model2": MagicMock(),
            "model3": MagicMock(),
        }

        client_manager = AIClientManager(mock_config_manager)

        # Get all models
        all_models = client_manager.get_available_models()
        assert len(all_models) == 3
        assert "model1" in all_models

        # Get models for specific service
        service_models = client_manager.get_available_models("test-service")
        assert "test-model" in service_models  # From mock service config

    def test_get_service_status(self, mock_config_manager):
        """Test getting service status"""
        # Mock services
        mock_config_manager.services = {
            "service1": mock_config_manager.get_service_config.return_value
        }

        client_manager = AIClientManager(mock_config_manager)
        client_manager.clients[AIProvider.GOOGLE_AI] = MagicMock()

        status = client_manager.get_service_status()

        assert "service1" in status
        service_status = status["service1"]
        assert service_status["enabled"] is True
        assert service_status["primary_model"] == "test-model"
        assert service_status["provider_available"] is True


class TestAIRequest:
    """Test AI request structure"""

    def test_ai_request_creation(self):
        """Test creating AI request"""
        request = AIRequest(
            prompt="Test prompt",
            service_name="test-service",
            user_id="user-123",
            max_tokens=1000,
            temperature=0.8,
        )

        assert request.prompt == "Test prompt"
        assert request.service_name == "test-service"
        assert request.user_id == "user-123"
        assert request.max_tokens == 1000
        assert request.temperature == 0.8
        assert request.stream is False  # Default value


class TestAIResponse:
    """Test AI response structure"""

    def test_ai_response_creation(self):
        """Test creating AI response"""
        response = AIResponse(
            content="Generated content",
            model_used="gemini-2.5-pro",
            provider="google_ai",
            tokens_used={"input": 100, "output": 200},
            response_time_ms=500.0,
            cached=False,
            cost_estimate=0.003,
            metadata={"finish_reason": "stop"},
            request_id="req-123",
        )

        assert response.content == "Generated content"
        assert response.model_used == "gemini-2.5-pro"
        assert response.provider == "google_ai"
        assert response.tokens_used["input"] == 100
        assert response.tokens_used["output"] == 200
        assert response.response_time_ms == 500.0
        assert response.cached is False
        assert response.cost_estimate == 0.003
        assert response.metadata["finish_reason"] == "stop"
        assert response.request_id == "req-123"


@pytest.mark.integration
class TestAIConfigIntegration:
    """Integration tests for AI configuration system"""

    @pytest.mark.asyncio
    async def test_end_to_end_configuration_flow(self):
        """Test complete configuration loading and usage flow"""
        # Create temporary config
        config_data = {
            "models": {
                "integration-test-model": {
                    "name": "integration-test-model",
                    "provider": "google_ai",
                    "model_type": "text_generation",
                    "model_id": "gemini-2.5-flash",
                    "max_tokens": 1000,
                    "temperature": 0.5,
                    "cost_per_1k_tokens": {"input": 0.001, "output": 0.002},
                    "rate_limit": {
                        "requests_per_minute": 60,
                        "tokens_per_minute": 5000,
                    },
                    "context_window": 4096,
                    "supports_streaming": False,
                    "supports_function_calling": False,
                }
            },
            "services": {
                "integration-test-service": {
                    "service_name": "integration-test-service",
                    "description": "Integration test service",
                    "primary_model": "integration-test-model",
                    "fallback_models": [],
                    "enabled": True,
                    "cache_enabled": True,
                    "cache_ttl_seconds": 3600,
                    "max_retries": 2,
                    "timeout_seconds": 30,
                    "rate_limit_per_user": 10,
                    "rate_limit_window_seconds": 3600,
                    "cost_budget_daily": 10.0,
                    "quality_threshold": 0.7,
                    "monitoring_enabled": True,
                    "custom_settings": {"test_mode": True},
                }
            },
        }

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump(config_data, f)
            config_file = f.name

        try:
            # Load configuration
            config_manager = AIConfigManager(config_file)

            # Verify configuration loaded correctly
            assert "integration-test-model" in config_manager.models
            assert "integration-test-service" in config_manager.services

            # Test model retrieval
            model = config_manager.get_model_config("integration-test-model")
            assert model.name == "integration-test-model"
            assert model.provider == AIProvider.GOOGLE_AI
            assert model.max_tokens == 1000

            # Test service retrieval
            service = config_manager.get_service_config("integration-test-service")
            assert service.service_name == "integration-test-service"
            assert service.primary_model == "integration-test-model"
            assert service.custom_settings["test_mode"] is True

            # Test validation
            validation = config_manager.validate_configuration()
            # Should have warnings about missing credentials but no errors
            assert len(validation["errors"]) == 0
            assert len(validation["warnings"]) >= 1  # Missing API keys

            # Test configuration summary
            summary = config_manager.get_configuration_summary()
            assert summary["models"]["total"] >= 1
            assert summary["services"]["enabled"] >= 1

        finally:
            # Cleanup
            os.unlink(config_file)


# Fixtures for all tests
@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    import asyncio

    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
