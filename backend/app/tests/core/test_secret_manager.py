import os
from unittest.mock import MagicMock, patch

import pytest
from google.api_core.exceptions import NotFound

from app.core.secret_manager import (
    _env_candidates,
    _get_client,
    _get_env_secret,
    get_app_secret,
    get_database_url,
    get_firebase_config,
    get_firebase_credentials,
    get_firebase_frontend_config,
    get_secret,
    get_secret_key,
)


class TestEnvCandidates:
    def test_env_candidates(self):
        candidates = _env_candidates("my-secret")
        assert "my-secret" in candidates
        assert "MY_SECRET" in candidates
        assert "DEFAULT_my-secret" in candidates
        assert "DEFAULT_MY_SECRET" in candidates


class TestGetEnvSecret:
    @patch.dict(os.environ, {"MY_SECRET": "test_value"}, clear=True)
    def test_get_env_secret_found(self):
        assert _get_env_secret("my-secret") == "test_value"

    @patch.dict(os.environ, {}, clear=True)
    def test_get_env_secret_not_found(self):
        assert _get_env_secret("my-secret") is None


class TestGetClient:
    @patch("app.core.secret_manager.SECRET_MANAGER_AVAILABLE", False)
    def test_get_client_unavailable(self):
        assert _get_client() is None

    @patch("app.core.secret_manager.SECRET_MANAGER_AVAILABLE", True)
    @patch("app.core.secret_manager._client", None)
    @patch("app.core.secret_manager._client_init_failed", False)
    @patch("app.core.secret_manager.secretmanager")
    def test_get_client_success(self, mock_secretmanager):
        mock_client = MagicMock()
        mock_secretmanager.SecretManagerServiceClient.return_value = mock_client
        assert _get_client() == mock_client


class TestGetSecret:
    @patch("app.core.secret_manager._get_env_secret")
    def test_get_secret_from_env(self, mock_get_env):
        mock_get_env.return_value = "env_value"
        assert get_secret("my-secret") == "env_value"

    @patch.dict(os.environ, {"GOOGLE_CLOUD_PROJECT": "test_project"}, clear=True)
    @patch("app.core.secret_manager._get_env_secret")
    @patch("app.core.secret_manager._get_client")
    def test_get_secret_from_client_success(self, mock_get_client, mock_get_env):
        mock_get_env.return_value = None
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_response = MagicMock()
        mock_response.payload.data.decode.return_value = "secret_manager_value"
        mock_client.access_secret_version.return_value = mock_response

        assert get_secret("my-secret") == "secret_manager_value"
        mock_client.access_secret_version.assert_called_once()

    @patch.dict(os.environ, {"GOOGLE_CLOUD_PROJECT": "test_project"}, clear=True)
    @patch("app.core.secret_manager._get_env_secret")
    @patch("app.core.secret_manager._get_client")
    def test_get_secret_not_found_with_default(self, mock_get_client, mock_get_env):
        mock_get_env.return_value = None
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_client.access_secret_version.side_effect = NotFound("Not found")

        assert get_secret("my-secret", default="default_value") == "default_value"

    @patch.dict(os.environ, {"GOOGLE_CLOUD_PROJECT": "test_project"}, clear=True)
    @patch("app.core.secret_manager._get_env_secret")
    @patch("app.core.secret_manager._get_client")
    def test_get_secret_exception(self, mock_get_client, mock_get_env):
        mock_get_env.return_value = None
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_client.access_secret_version.side_effect = Exception("Unknown error")

        with pytest.raises(RuntimeError):
            get_secret("my-secret")

    @patch("app.core.secret_manager._get_env_secret")
    @patch("app.core.secret_manager._get_client")
    def test_get_secret_no_project(self, mock_get_client, mock_get_env):
        mock_get_env.return_value = None
        mock_get_client.return_value = None

        with pytest.raises(RuntimeError):
            get_secret("my-secret")


class TestHelpers:
    @patch("app.core.secret_manager.get_secret")
    def test_get_database_url(self, mock_get):
        mock_get.return_value = "db_url"
        assert get_database_url() == "db_url"

    @patch("app.core.secret_manager._get_env_secret")
    def test_get_secret_key_env(self, mock_get_env):
        mock_get_env.return_value = "env_key"
        assert get_secret_key() == "env_key"

    @patch("app.core.secret_manager._get_env_secret")
    @patch("app.core.secret_manager.get_secret")
    def test_get_secret_key_secret_manager(self, mock_get, mock_get_env):
        mock_get_env.return_value = None
        mock_get.return_value = "sm_key"
        assert get_secret_key() == "sm_key"

    @patch("app.core.secret_manager.get_secret")
    def test_get_firebase_credentials_success(self, mock_get):
        mock_get.return_value = '{"type": "service_account"}'
        assert get_firebase_credentials() == {"type": "service_account"}

    @patch("app.core.secret_manager.get_secret")
    def test_get_firebase_credentials_empty(self, mock_get):
        mock_get.return_value = ""
        assert get_firebase_credentials() is None

    @patch("app.core.secret_manager.get_secret")
    def test_get_firebase_credentials_invalid_json(self, mock_get):
        mock_get.return_value = "invalid_json"
        assert get_firebase_credentials() is None

    @patch("app.core.secret_manager.get_secret")
    def test_get_firebase_config(self, mock_get):
        mock_get.return_value = "test_val"
        config = get_firebase_config()
        assert config["project_id"] == "test_val"

    @patch("app.core.secret_manager.get_secret")
    def test_get_firebase_frontend_config(self, mock_get):
        mock_get.return_value = "test_val"
        config = get_firebase_frontend_config()
        assert config["api_key"] == "test_val"

    @patch("app.core.secret_manager.get_secret")
    def test_get_app_secret(self, mock_get):
        mock_get.return_value = "secret"
        assert get_app_secret("name") == "secret"
