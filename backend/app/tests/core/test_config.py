"""Unit tests for the configuration module."""
import os
from unittest.mock import patch, MagicMock

import pytest
from pydantic import ValidationError

from app.core.config import Settings, get_personal_config, validate_required_api_keys


def test_settings_default_values():
    """Test that default values are set correctly."""
    settings = Settings()
    
    # Test some default values
    assert settings.ai_model == "gemini-2.0-flash"
    assert settings.ai_max_tokens == 2000
    assert settings.ai_temperature == 0.2
    assert settings.max_document_size_mb == 10
    assert "application/pdf" in settings.allowed_document_types
    assert settings.ats_scoring_weights["keyword"] == 0.45


def test_settings_environment_variables(monkeypatch):
    """Test that environment variables override defaults."""
    # Set environment variables
    monkeypatch.setenv("AI_MODEL", "gpt-4")
    monkeypatch.setenv("AI_MAX_TOKENS", "4000")
    monkeypatch.setenv("AI_TEMPERATURE", "0.7")
    
    settings = Settings()
    
    # Test that environment variables override defaults
    assert settings.ai_model == "gpt-4"
    assert settings.ai_max_tokens == 4000
    assert settings.ai_temperature == 0.7


def test_settings_validation():
    """Test that invalid values raise validation errors."""
    # Test invalid temperature (should be between 0 and 2)
    with pytest.raises(ValidationError):
        Settings(ai_temperature=2.1)
    
    # Test invalid document size
    with pytest.raises(ValidationError):
        Settings(max_document_size_mb=-1)
    
    # Test invalid ATS weights (should sum to ~1.0)
    with pytest.raises(ValidationError):
        Settings(ats_scoring_weights={"keyword": 0.5, "semantic": 0.6, "formatting": 0.5})


def test_get_personal_config():
    """Test that get_personal_config returns a singleton instance."""
    # First call should create the instance
    config1 = get_personal_config()
    assert config1 is not None
    assert config1.name == "Your Name"
    
    # Second call should return the same instance
    config2 = get_personal_config()
    assert config1 is config2


def test_validate_required_api_keys_missing_keys(monkeypatch):
    """Test validation fails when required API keys are missing."""
    # Mock the settings to simulate missing API keys
    with patch("app.core.config.settings") as mock_settings:
        mock_settings.enable_ai_features = True
        mock_settings.openai_api_key = ""
        mock_settings.anthropic_api_key = ""
        mock_settings.gemini_api_key = ""
        
        # Should raise an exception when AI features are enabled but no API keys are set
        with pytest.raises(RuntimeError, match="Missing required API keys"):
            validate_required_api_keys()


def test_validate_required_api_keys_ai_disabled(monkeypatch):
    """Test validation passes when AI features are disabled, even without API keys."""
    # Mock the settings with AI features disabled
    with patch("app.core.config.settings") as mock_settings:
        mock_settings.enable_ai_features = False
        mock_settings.openai_api_key = ""
        mock_settings.anthropic_api_key = ""
        mock_settings.gemini_api_key = ""
        
        # Should not raise an exception when AI features are disabled
        validate_required_api_keys()


def test_validate_required_api_keys_with_keys(monkeypatch):
    """Test validation passes when required API keys are present."""
    # Mock the settings with valid API keys
    with patch("app.core.config.settings") as mock_settings:
        mock_settings.enable_ai_features = True
        mock_settings.openai_api_key = "test-openai-key"
        mock_settings.anthropic_api_key = "test-anthropic-key"
        mock_settings.gemini_api_key = "test-gemini-key"
        
        # Should not raise an exception when all required API keys are present
        validate_required_api_keys()


def test_secure_settings_integration():
    """Test that secure settings are properly integrated."""
    settings = Settings()
    
    # These values come from secure_settings
    assert settings.secret_key is not None
    assert settings.algorithm is not None
    assert settings.redis_url is not None


def test_settings_extra_fields_ignored():
    """Test that extra fields in environment variables are ignored."""
    # This should not raise an error due to extra="ignore" in Config
    settings = Settings(some_extra_field="value")
    assert not hasattr(settings, "some_extra_field")


def test_settings_env_file_loading(tmp_path):
    """Test that settings can be loaded from a .env file."""
    # Create a temporary .env file
    env_file = tmp_path / ".env"
    env_file.write_text("""
    AI_MODEL=test-model
    AI_MAX_TOKENS=5000
    AI_TEMPERATURE=0.5
    """)
    
    # Create settings with the temporary .env file
    settings = Settings(_env_file=env_file)
    
    # Test that values were loaded from the .env file
    assert settings.ai_model == "test-model"
    assert settings.ai_max_tokens == 5000
    assert settings.ai_temperature == 0.5


def test_personal_career_config_custom_values():
    """Test that PersonalCareerConfig can be customized with custom values."""
    from app.core.config import PersonalCareerConfig
    
    config = PersonalCareerConfig(
        name="Test User",
        email="test@example.com",
        location="Test Location",
        career_transition_from="Old Career",
        career_transition_to="New Career",
        target_industries=["Industry 1", "Industry 2"]
    )
    
    assert config.name == "Test User"
    assert config.email == "test@example.com"
    assert config.location == "Test Location"
    assert config.career_transition_from == "Old Career"
    assert config.career_transition_to == "New Career"
    assert "Industry 1" in config.target_industries
    assert "Industry 2" in config.target_industries
