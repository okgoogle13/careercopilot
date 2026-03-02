from app.core.ai_config import AIModelType, AIProvider, get_ai_config


def test_get_model_config_returns_model():
    config = get_ai_config()
    # Test with a model that exists in the default configuration
    model = config.get_model_config("gemini-2.5-flash")
    assert model is not None
    assert model.name == "gemini-2.5-flash"
    assert model.provider == AIProvider.GOOGLE_AI
    assert model.model_type == AIModelType.TEXT_GENERATION


def test_get_service_config_returns_service():
    config = get_ai_config()
    service = config.get_service_config("resume_analysis")
    assert service is not None
    assert service.primary_model in config.models


def test_validate_configuration_no_errors(monkeypatch):
    # Mock environment variables to ensure credentials exist
    monkeypatch.setenv("GOOGLE_AI_API_KEY", "test-key")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")
<<<<<<< HEAD
    
    # Reload config to pick up env vars
    from app.core.ai_config import reload_ai_config
    config = reload_ai_config()
    
=======

    # Reload config to pick up env vars
    from app.core.ai_config import reload_ai_config
    config = reload_ai_config()

>>>>>>> restoration-KR-Rage-Figma-v2.0
    issues = config.validate_configuration()
    # The method returns a list of issues directly
    assert isinstance(issues, list)
    # With default config and mocked keys, there should be no validation issues
    assert len(issues) == 0, f"Found validation issues: {issues}"


def test_reload_ai_config_does_not_crash():
    from app.core.ai_config import reload_ai_config

    reloaded = reload_ai_config()
    assert reloaded is not None
