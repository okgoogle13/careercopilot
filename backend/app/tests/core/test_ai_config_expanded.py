"""
Tests for ai_config_expanded module.
"""

import json
from typing import Any
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.core.ai_config import (
    AIConfigManager,
    AIModelType,
    AIProvider,
    AIServiceConfig,
    ModelConfig,
    ProviderCredentials,
)


@pytest.fixture
def ai_config_manager():
    """Fixture for AIConfigManager."""
    return AIConfigManager()


def test_ai_provider_enum():
    """Test AIProvider enum values."""
    assert AIProvider.OPENAI.value == "openai"
    assert AIProvider.GOOGLE_AI.value == "google_ai"
    assert AIProvider.ANTHROPIC.value == "anthropic"
    assert AIProvider.AZURE_OPENAI.value == "azure_openai"
    assert AIProvider.AWS_BEDROCK.value == "aws_bedrock"
    assert AIProvider.HUGGINGFACE.value == "huggingface"


def test_ai_model_type_enum():
    """Test AIModelType enum values."""
    assert AIModelType.TEXT_GENERATION.value == "text_generation"
    assert AIModelType.TEXT_EMBEDDING.value == "text_embedding"
    assert AIModelType.IMAGE_GENERATION.value == "image_generation"
    assert AIModelType.SPEECH_TO_TEXT.value == "speech_to_text"
    assert AIModelType.TEXT_TO_SPEECH.value == "text_to_speech"
    assert AIModelType.CLASSIFICATION.value == "classification"
    assert AIModelType.SUMMARIZATION.value == "summarization"


def test_model_config_to_dict():
    """Test ModelConfig to_dict method."""
    model_config = ModelConfig(
        name="test_model",
        provider=AIProvider.OPENAI,
        model_type=AIModelType.TEXT_GENERATION,
        max_tokens=100,
        temperature=0.5,
    )
    data = model_config.to_dict()
    assert data["name"] == "test_model"
    assert data["provider"] == "openai"
    assert data["model_type"] == "text_generation"
    assert data["max_tokens"] == 100
    assert data["temperature"] == 0.5


def test_model_config_from_dict():
    """Test ModelConfig from_dict method."""
    data = {
        "name": "test_model",
        "provider": "openai",
        "model_type": "text_generation",
        "max_tokens": 100,
        "temperature": 0.5,
    }
    model_config = ModelConfig.from_dict(data)
    assert model_config.name == "test_model"
    assert model_config.provider == AIProvider.OPENAI
    assert model_config.model_type == AIModelType.TEXT_GENERATION
    assert model_config.max_tokens == 100
    assert model_config.temperature == 0.5


def test_provider_credentials_to_dict_include_secrets():
    """Test ProviderCredentials to_dict with include_secrets=True."""
    credentials = ProviderCredentials(
        provider=AIProvider.OPENAI, api_key="test_api_key", api_secret="test_api_secret"
    )
    data = credentials.to_dict(include_secrets=True)
    assert data["api_key"] == "test_api_key"
    assert data["api_secret"] == "test_api_secret"


def test_provider_credentials_to_dict_exclude_secrets():
    """Test ProviderCredentials to_dict with include_secrets=False."""
    credentials = ProviderCredentials(
        provider=AIProvider.OPENAI, api_key="test_api_key", api_secret="test_api_secret"
    )
    data = credentials.to_dict(include_secrets=False)
    assert data["api_key"].startswith("***")
    assert data["api_secret"] == "***"


def test_provider_credentials_from_dict():
    """Test ProviderCredentials from_dict method."""
    data = {
        "provider": "openai",
        "api_key": "test_api_key",
        "api_secret": "test_api_secret",
    }
    credentials = ProviderCredentials.from_dict(data)
    assert credentials.provider == AIProvider.OPENAI
    assert credentials.api_key == "test_api_key"
    assert credentials.api_secret == "test_api_secret"


def test_ai_service_config_to_dict():
    """Test AIServiceConfig to_dict method."""
    service_config = AIServiceConfig(
        service_name="test_service",
        description="Test service description",
        primary_model="test_model",
        enabled=True,
    )
    data = service_config.to_dict()
    assert data["service_name"] == "test_service"
    assert data["description"] == "Test service description"
    assert data["primary_model"] == "test_model"
    assert data["enabled"] is True


def test_ai_service_config_from_dict():
    """Test AIServiceConfig from_dict method."""
    data = {
        "service_name": "test_service",
        "description": "Test service description",
        "primary_model": "test_model",
        "enabled": True,
    }
    service_config = AIServiceConfig.from_dict(data)
    assert service_config.service_name == "test_service"
    assert service_config.description == "Test service description"
    assert service_config.primary_model == "test_model"
    assert service_config.enabled is True


def test_ai_config_manager_init_with_config_file(tmp_path):
    """Test AIConfigManager initialization with a config file."""
    config_file = tmp_path / "ai_config.json"
    config_data = {
        "models": [
            {
                "name": "test_model",
                "provider": "openai",
                "model_type": "text_generation",
            }
        ]
    }
    config_file.write_text(json.dumps(config_data))
    manager = AIConfigManager(config_file_path=str(config_file))
    assert manager.config_file_path == str(config_file)
    assert len(manager.models) == 1
    assert "test_model" in manager.models


def test_ai_config_manager_init_with_env_variable():
    """Test AIConfigManager initialization with AI_CONFIG_FILE env variable."""
    with patch.dict("os.environ", {"AI_CONFIG_FILE": "test_config.json"}):
        manager = AIConfigManager()
    assert manager.config_file_path == "test_config.json"


def test_ai_config_manager_init_with_default_config_file():
    """Test AIConfigManager initialization with default config file."""
    manager = AIConfigManager()
    assert manager.config_file_path == "config/ai_config.json"
