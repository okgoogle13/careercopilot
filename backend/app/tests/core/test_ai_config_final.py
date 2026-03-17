from __future__ import annotations

import json
from pathlib import Path

import pytest

from app.core.ai_config import (
    AIConfigManager,
    AIModelType,
    AIProvider,
    AIServiceConfig,
    ModelConfig,
    ProviderCredentials,
    setup_ai_config,
)


@pytest.fixture
def manager(tmp_path: Path) -> AIConfigManager:
    cfg = tmp_path / "ai.json"
    return AIConfigManager(str(cfg))


def test_load_from_dict_list_inputs_and_invalid_entries(manager: AIConfigManager) -> None:
    payload = {
        "models": [
            {"name": "m1", "provider": "openai", "model_type": "text_generation"},
            "bad-model",
        ],
        "credentials": [
            {"provider": "openai", "api_key": "abcd1234"},
            "bad-cred",
            {"provider": "invalid_provider", "api_key": "x"},
        ],
        "services": [
            {"service_name": "svc", "description": "d", "primary_model": "m1"},
            "bad-service",
        ],
    }

    manager._load_from_dict(payload)
    assert "m1" in manager.models
    assert AIProvider.OPENAI in manager.credentials
    assert "svc" in manager.services


def test_load_from_dict_raises_on_noncopyable(manager: AIConfigManager) -> None:
    with pytest.raises(Exception):
        manager._load_from_dict(object())  # type: ignore[arg-type]


def test_get_helpers_return_empty_when_stores_empty(manager: AIConfigManager) -> None:
    manager.models = {}
    manager.services = {}
    manager.credentials = {}

    assert manager.get_model_config("x") is None
    assert manager.get_service_config("x") is None
    assert manager.get_provider_credentials(AIProvider.OPENAI) is None
    assert manager.get_models_by_provider(AIProvider.OPENAI) == []
    assert manager.get_models_by_type(AIModelType.TEXT_GENERATION) == []
    assert manager.get_enabled_services() == []


def test_validate_configuration_reports_issues() -> None:
    manager = AIConfigManager("/tmp/nonexistent.json")
    manager.models = {
        "": ModelConfig(
            name="", provider=AIProvider.OPENAI, model_type=AIModelType.TEXT_GENERATION
        ),
        "m1": ModelConfig(
            name="m1", provider=AIProvider.GOOGLE_AI, model_type=AIModelType.TEXT_GENERATION
        ),
    }
    manager.credentials = {}  # missing for providers
    manager.services = {
        "svc_missing": AIServiceConfig(
            service_name="svc_missing", description="d", primary_model=""
        ),
        "svc_bad_primary": AIServiceConfig(
            service_name="svc_bad_primary", description="d", primary_model="missing"
        ),
        "svc_bad_fallback": AIServiceConfig(
            service_name="svc_bad_fallback",
            description="d",
            primary_model="m1",
            fallback_models=["also_missing"],
        ),
    }

    issues = manager.validate_configuration()
    assert any("missing required field 'name'" in item for item in issues)
    assert any("No credentials found" in item for item in issues)
    assert any("missing required field 'primary_model'" in item for item in issues)
    assert any("not found in models" in item for item in issues)


def test_save_configuration_success(tmp_path: Path, manager: AIConfigManager) -> None:
    manager.models = {
        "m1": ModelConfig(
            name="m1", provider=AIProvider.OPENAI, model_type=AIModelType.TEXT_GENERATION
        )
    }
    manager.credentials = {
        AIProvider.OPENAI: ProviderCredentials(provider=AIProvider.OPENAI, api_key="secret1234")
    }
    manager.services = {
        "svc": AIServiceConfig(service_name="svc", description="d", primary_model="m1")
    }

    out = tmp_path / "nested" / "cfg.json"
    assert manager.save_configuration(str(out)) is True
    data = json.loads(out.read_text())
    assert "models" in data and "services" in data and "credentials" in data


def test_save_configuration_failure_for_invalid_path(manager: AIConfigManager) -> None:
    manager.config_file_path = ""
    assert manager.save_configuration(None) is False


def test_get_configuration_summary_shapes(manager: AIConfigManager) -> None:
    manager.models = {
        "m1": ModelConfig(
            name="m1", provider=AIProvider.OPENAI, model_type=AIModelType.TEXT_GENERATION
        ),
        "m2": ModelConfig(
            name="m2", provider=AIProvider.OPENAI, model_type=AIModelType.TEXT_EMBEDDING
        ),
    }
    manager.credentials = {
        AIProvider.OPENAI: ProviderCredentials(provider=AIProvider.OPENAI, api_key="abc")
    }
    manager.services = {
        "enabled_svc": AIServiceConfig(
            service_name="enabled_svc", description="d", primary_model="m1", enabled=True
        ),
        "disabled_svc": AIServiceConfig(
            service_name="disabled_svc", description="d", primary_model="m1", enabled=False
        ),
    }

    summary = manager.get_configuration_summary()
    assert summary["models"]["total"] == 2
    assert summary["services"]["enabled"] == 1
    assert summary["providers"]["configured"] == 1


def test_setup_ai_config_replaces_global_instance(tmp_path: Path) -> None:
    path = tmp_path / "cfg.json"
    path.write_text("{}")
    manager = setup_ai_config(str(path))
    assert isinstance(manager, AIConfigManager)
