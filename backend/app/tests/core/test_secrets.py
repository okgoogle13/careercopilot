from unittest.mock import MagicMock, patch

import pytest

import app.core.secrets as secrets_module
from app.core.secrets import (
    _get_secret_manager_client,
    _secret_exists,
    delete_user_secret,
    get_ai_api_keys,
    get_app_secret,
    get_database_config,
    get_jwt_secret,
    get_user_secret,
    save_user_secret,
)


class TestSecretManagerClient:
    @patch("app.core.secrets.secretmanager", None)
    def test_get_client_no_dependency(self):
        assert _get_secret_manager_client() is None

    @patch("app.core.secrets.secretmanager")
    @patch("app.core.secrets.os.getenv")
    def test_get_client_from_json(self, mock_getenv, mock_sm):
        mock_getenv.return_value = '{"type": "service_account"}'
        with patch("app.core.secrets.service_account") as mock_sa:
            mock_creds = MagicMock()
            mock_sa.Credentials.from_service_account_info.return_value = mock_creds

            client = _get_secret_manager_client()

            mock_sa.Credentials.from_service_account_info.assert_called_once()
            mock_sm.SecretManagerServiceClient.assert_called_once_with(credentials=mock_creds)

    @patch("app.core.secrets.secretmanager")
    @patch("app.core.secrets.os.path.exists")
    @patch("app.core.secrets.os.getenv")
    def test_get_client_from_file(self, mock_getenv, mock_exists, mock_sm):
        def getenv_side_effect(key):
            if key == "GOOGLE_APPLICATION_CREDENTIALS_JSON":
                return None
            return "/path/to/creds.json"

        mock_getenv.side_effect = getenv_side_effect
        mock_exists.return_value = True

        client = _get_secret_manager_client()
        mock_sm.SecretManagerServiceClient.assert_called_once_with()

    @patch("app.core.secrets.secretmanager")
    @patch("app.core.secrets.os.path.exists")
    @patch("app.core.secrets.os.getenv")
    def test_get_client_no_creds(self, mock_getenv, mock_exists, mock_sm):
        mock_getenv.return_value = None
        mock_exists.return_value = False

        client = _get_secret_manager_client()
        assert client is None
        mock_sm.SecretManagerServiceClient.assert_not_called()


class TestUserSecrets:
    @pytest.fixture
    def mock_client(self):
        client = MagicMock()
        return client

    def test_save_user_secret_no_project(self):
        with patch("app.core.secrets.GCP_PROJECT_ID", None):
            with pytest.raises(ValueError):
                save_user_secret("user1", "secret1", "value")

    def test_save_user_secret_no_client(self):
        with patch("app.core.secrets.client", None):
            with pytest.raises(RuntimeError):
                save_user_secret("user1", "secret1", "value")

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_save_user_secret_success_new(self, mock_client):
        with patch("app.core.secrets.client", mock_client):
            mock_secret = MagicMock()
            mock_secret.name = "parent_path"
            mock_client.create_secret.return_value = mock_secret

            mock_version = MagicMock()
            mock_version.name = "version_path"
            mock_client.add_secret_version.return_value = mock_version

            result = save_user_secret("user1", "my-secret", "my-value")

            assert result == "version_path"
            mock_client.create_secret.assert_called_once()
            mock_client.add_secret_version.assert_called_once()
            args, kwargs = mock_client.add_secret_version.call_args
            assert kwargs["request"]["payload"]["data"] == b"my-value"
            assert kwargs["request"]["parent"] == "parent_path"

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_save_user_secret_success_existing(self, mock_client):
        with patch("app.core.secrets.client", mock_client):
            mock_client.create_secret.side_effect = Exception("Already exists")
            mock_client.secret_path.return_value = "parent_path"

            mock_version = MagicMock()
            mock_version.name = "version_path"
            mock_client.add_secret_version.return_value = mock_version

            result = save_user_secret("user1", "my-secret", "my-value")

            assert result == "version_path"
            mock_client.create_secret.assert_called_once()
            mock_client.secret_path.assert_called_once()
            mock_client.add_secret_version.assert_called_once()

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_get_user_secret(self, mock_client):
        with patch("app.core.secrets.client", mock_client):
            mock_response = MagicMock()
            mock_response.payload.data.decode.return_value = "secret_value"
            mock_client.access_secret_version.return_value = mock_response

            result = get_user_secret("user1", "my-secret")

            assert result == "secret_value"
            mock_client.access_secret_version.assert_called_once()

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_delete_user_secret_success(self, mock_client):
        with patch("app.core.secrets.client", mock_client):
            mock_client.secret_path.return_value = "secret_path"

            delete_user_secret("user1", "my-secret")

            mock_client.secret_path.assert_called_once()
            mock_client.delete_secret.assert_called_once()

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_delete_user_secret_not_found(self, mock_client):
        with patch("app.core.secrets.client", mock_client):
            mock_client.secret_path.return_value = "secret_path"
            mock_client.delete_secret.side_effect = secrets_module.NotFound("Not found")

            # Should not raise
            delete_user_secret("user1", "my-secret")

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_delete_user_secret_error(self, mock_client):
        with patch("app.core.secrets.client", mock_client):
            mock_client.delete_secret.side_effect = Exception("Error")

            with pytest.raises(Exception):
                delete_user_secret("user1", "my-secret")


class TestAppSecrets:
    @pytest.fixture(autouse=True)
    def clear_cache(self):
        get_app_secret.cache_clear()

    @patch("app.core.secrets.GCP_PROJECT_ID", None)
    @patch("app.core.secrets.os.getenv")
    def test_get_app_secret_no_project(self, mock_getenv):
        mock_getenv.return_value = "env_value"
        result = get_app_secret("my-secret")
        assert result == "env_value"
        mock_getenv.assert_called_once_with("MY_SECRET")

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    @patch("app.core.secrets.client")
    def test_get_app_secret_from_client(self, mock_client):
        mock_response = MagicMock()
        mock_response.payload.data.decode.return_value = "sm_value"
        mock_client.access_secret_version.return_value = mock_response

        result = get_app_secret("my-secret")
        assert result == "sm_value"
        mock_client.access_secret_version.assert_called_once()

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    @patch("app.core.secrets.client", None)
    @patch("app.core.secrets.os.getenv")
    def test_get_app_secret_fallback_no_client(self, mock_getenv):
        mock_getenv.return_value = "env_value"
        result = get_app_secret("my-secret")
        assert result == "env_value"

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    @patch("app.core.secrets.client")
    @patch("app.core.secrets.os.getenv")
    def test_get_app_secret_fallback_client_error(self, mock_getenv, mock_client):
        mock_client.access_secret_version.side_effect = Exception("Error")
        mock_getenv.return_value = "env_value"
        result = get_app_secret("my-secret")
        assert result == "env_value"

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    @patch("app.core.secrets.client", None)
    @patch("app.core.secrets.os.getenv")
    def test_get_app_secret_not_found(self, mock_getenv):
        mock_getenv.return_value = None
        with pytest.raises(Exception):
            get_app_secret("my-secret")


class TestHelpers:
    @pytest.fixture(autouse=True)
    def clear_cache(self):
        get_app_secret.cache_clear()

    @patch("app.core.secrets.client")
    def test_secret_exists_true(self, mock_client):
        mock_client.get_secret.return_value = True
        assert _secret_exists("my-secret") is True

    @patch("app.core.secrets.client")
    def test_secret_exists_false(self, mock_client):
        mock_client.get_secret.side_effect = secrets_module.NotFound("Not found")
        assert _secret_exists("my-secret") is False

    @patch("app.core.secrets._secret_exists")
    @patch("app.core.secrets.get_app_secret")
    def test_get_database_config(self, mock_get, mock_exists):
        mock_exists.return_value = True
        mock_get.side_effect = lambda x: "5432" if x == "db-port" else f"{x}_val"
        config = get_database_config()
        assert config["host"] == "db-host_val"
        assert config["password"] == "db-password_val"

    @patch("app.core.secrets._secret_exists")
    @patch("app.core.secrets.get_app_secret")
    def test_get_database_config_defaults(self, mock_get, mock_exists):
        mock_exists.return_value = False
        mock_get.return_value = "pass"
        config = get_database_config()
        assert config["host"] == "postgres"
        assert config["password"] == "pass"

    @patch("app.core.secrets._secret_exists")
    @patch("app.core.secrets.get_app_secret")
    def test_get_ai_api_keys(self, mock_get, mock_exists):
        mock_exists.return_value = True
        mock_get.side_effect = lambda x: "5432" if x == "db-port" else f"{x}_val"
        keys = get_ai_api_keys()
        assert keys["anthropic"] == "anthropic-api-key_val"
        assert keys["perplexity"] == "perplexity-api-key_val"

    @patch("app.core.secrets._secret_exists")
    @patch("app.core.secrets.get_app_secret")
    def test_get_jwt_secret(self, mock_get, mock_exists):
        mock_exists.return_value = True
        mock_get.return_value = "jwt_val"
        assert get_jwt_secret() == "jwt_val"

    @patch("app.core.secrets._secret_exists")
    def test_get_jwt_secret_default(self, mock_exists):
        mock_exists.return_value = False
        assert get_jwt_secret() == "fallback-dev-key-change-in-production"
