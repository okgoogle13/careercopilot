import pytest
from app.core.ai_config import get_ai_config, AIProvider, AIModelType

def test_get_model_config_returns_model():
    config = get_ai_config()
    model = config.get_model_config("gemini-1.5-pro")
    assert model is not None
    assert model.name == "gemini-1.5-pro"
    assert model.provider == AIProvider.GOOGLE_AI
    assert model.model_type == AIModelType.TEXT_GENERATION


def test_get_service_config_returns_service():
    config = get_ai_config()
    service = config.get_service_config("resume_analysis")
    assert service is not None
    assert service.primary_model in config.models


def test_validate_configuration_no_errors():
    config = get_ai_config()
    issues = config.validate_configuration()
    assert "errors" in issues
    assert isinstance(issues["errors"], list)


def test_reload_ai_config_does_not_crash():
    config = get_ai_config()
    reloaded = config.reload_ai_config()
    assert reloaded is not None
