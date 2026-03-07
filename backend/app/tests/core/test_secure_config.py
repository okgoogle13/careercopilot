from __future__ import annotations

import sys
import types

import pytest

from app.core import secure_config


def test_secure_settings_loads_secrets(monkeypatch: pytest.MonkeyPatch) -> None:
    def _get_secret(secret_id: str, default=None, **_kwargs):
        values = {
            "GEMINI_API_KEY": "g-key",
            "ANTHROPIC_API_KEY": "a-key",
            "FIREBASE_PROJECT_ID": "proj-1",
            "FIREBASE_STORAGE_BUCKET": "bucket-1",
            "FIREBASE_CREDENTIALS_JSON": '{"type":"service_account"}',
        }
        return values.get(secret_id, default)

    monkeypatch.setattr(secure_config, "get_secret_key", lambda: "jwt-secret")
    monkeypatch.setattr(secure_config, "get_database_url", lambda: "sqlite:///tmp/test.db")
    monkeypatch.setattr(secure_config, "get_secret", _get_secret)

    s = secure_config.SecureSettings(ENVIRONMENT="development")
    assert s.ENV == "development"
    assert s.ENVIRONMENT == "development"
    assert s.JWT_SECRET_KEY == "jwt-secret"
    assert s.SECRET_KEY == "jwt-secret"
    assert s.DATABASE_URL == "sqlite:///tmp/test.db"
    assert s.FIREBASE_PROJECT_ID == "proj-1"


def test_secure_settings_env_from_os_without_kwargs_branch(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("ENVIRONMENT", "staging")
    monkeypatch.setattr(secure_config, "get_secret_key", lambda: "jwt-secret")
    monkeypatch.setattr(secure_config, "get_database_url", lambda: "sqlite:///tmp/branch.db")
    monkeypatch.setattr(secure_config, "get_secret", lambda _sid, default=None, **_kwargs: default)
    s = secure_config.SecureSettings()
    assert s.ENV == "staging"


def test_secure_settings_without_environment_kwargs_or_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("ENVIRONMENT", raising=False)
    monkeypatch.setattr(secure_config, "get_secret_key", lambda: "jwt-secret")
    monkeypatch.setattr(secure_config, "get_database_url", lambda: "sqlite:///tmp/default.db")
    monkeypatch.setattr(secure_config, "get_secret", lambda _sid, default=None, **_kwargs: default)
    s = secure_config.SecureSettings()
    assert s.ENV != "staging"
    assert s.ENVIRONMENT == s.ENV


def test_secure_settings_secret_key_alias_pre_sync_branch(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(secure_config, "get_secret_key", lambda: "jwt-after")
    monkeypatch.setattr(secure_config, "get_database_url", lambda: "sqlite:///tmp/alias.db")
    monkeypatch.setattr(secure_config, "get_secret", lambda _sid, default=None, **_kwargs: default)
    s = secure_config.SecureSettings(
        ENVIRONMENT="development",
        SECRET_KEY="insecure-default-secret-key",
        JWT_SECRET_KEY="jwt-before",
    )
    assert s.SECRET_KEY == "jwt-after"


def test_secure_settings_production_raises_when_secret_loading_fails(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(
        secure_config, "get_secret_key", lambda: (_ for _ in ()).throw(RuntimeError("no secret"))
    )

    with pytest.raises(RuntimeError, match="Failed to load production configuration"):
        secure_config.SecureSettings(ENVIRONMENT="production")


def test_secure_settings_development_tolerates_secret_failure(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(
        secure_config, "get_secret_key", lambda: (_ for _ in ()).throw(RuntimeError("no secret"))
    )
    s = secure_config.SecureSettings(ENVIRONMENT="development")
    assert s.ENV == "development"


def test_validate_firebase_creds_with_adc_match(monkeypatch: pytest.MonkeyPatch) -> None:
    google_mod = types.ModuleType("google")
    google_auth_mod = types.ModuleType("google.auth")
    setattr(google_auth_mod, "default", lambda: (object(), "proj-match"))
    setattr(google_mod, "auth", google_auth_mod)
    monkeypatch.setitem(sys.modules, "google", google_mod)
    monkeypatch.setitem(sys.modules, "google.auth", google_auth_mod)

    out = secure_config.SecureSettings.validate_firebase_creds(
        None, {"FIREBASE_PROJECT_ID": "proj-match"}
    )
    assert out is None


def test_validate_firebase_creds_project_mismatch_returns_input(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    google_mod = types.ModuleType("google")
    google_auth_mod = types.ModuleType("google.auth")
    setattr(google_auth_mod, "default", lambda: (object(), "other-project"))
    setattr(google_mod, "auth", google_auth_mod)
    monkeypatch.setitem(sys.modules, "google", google_mod)
    monkeypatch.setitem(sys.modules, "google.auth", google_auth_mod)

    out = secure_config.SecureSettings.validate_firebase_creds(
        None, {"FIREBASE_PROJECT_ID": "proj-target"}
    )
    assert out is None


def test_validate_firebase_creds_returns_input_on_explicit_or_no_project() -> None:
    explicit = secure_config.SecureSettings.validate_firebase_creds(
        '{"json":"blob"}', {"FIREBASE_PROJECT_ID": "proj"}
    )
    assert explicit == '{"json":"blob"}'

    no_project = secure_config.SecureSettings.validate_firebase_creds(None, {})
    assert no_project is None


def test_validate_firebase_creds_handles_google_auth_exception(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    google_mod = types.ModuleType("google")
    google_auth_mod = types.ModuleType("google.auth")

    def _broken_default():
        raise RuntimeError("adc unavailable")

    setattr(google_auth_mod, "default", _broken_default)
    setattr(google_mod, "auth", google_auth_mod)
    monkeypatch.setitem(sys.modules, "google", google_mod)
    monkeypatch.setitem(sys.modules, "google.auth", google_auth_mod)

    out = secure_config.SecureSettings.validate_firebase_creds(
        None, {"FIREBASE_PROJECT_ID": "proj-any"}
    )
    assert out is None


def test_customise_sources_for_secret_manager_modes(monkeypatch: pytest.MonkeyPatch) -> None:
    init_settings = object()
    file_secret_settings = object()

    def _env_settings():
        return {"FROM_ENV": "1"}

    monkeypatch.setattr(secure_config, "SECRET_MANAGER_AVAILABLE", False)
    out = secure_config.SecureSettings.Config.customise_sources(
        init_settings, _env_settings, file_secret_settings
    )
    assert out[0] is init_settings
    assert out[1] == {"FROM_ENV": "1"}
    assert out[2] is file_secret_settings

    monkeypatch.setattr(secure_config, "SECRET_MANAGER_AVAILABLE", True)
    monkeypatch.setenv("FROM_OS", "x")
    out2 = secure_config.SecureSettings.Config.customise_sources(
        init_settings, _env_settings, file_secret_settings
    )
    assert out2[0] is init_settings
    assert out2[2] is file_secret_settings
    assert "FROM_ENV" in out2[1]
    assert "FROM_OS" in out2[1]
