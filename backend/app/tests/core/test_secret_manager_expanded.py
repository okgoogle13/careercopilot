import os
from unittest.mock import MagicMock, patch

import pytest

from app.core import secret_manager
from app.core.secret_manager import _get_client, get_firebase_config, get_secret


class TestSecretManagerExpanded:
    @patch("app.core.secret_manager.SECRET_MANAGER_AVAILABLE", True)
    def test_get_client_already_initialized(self):
        # Covers branch where _client is already set (line 53)
        mock_client = MagicMock()
        with patch("app.core.secret_manager._client", mock_client):
            with patch("app.core.secret_manager._client_init_failed", False):
                assert _get_client() == mock_client

    @patch("app.core.secret_manager.SECRET_MANAGER_AVAILABLE", True)
    def test_get_client_already_failed(self):
        # Covers branch where _client_init_failed is True (line 53)
        with patch("app.core.secret_manager._client", None):
            with patch("app.core.secret_manager._client_init_failed", True):
                assert _get_client() is None

    @patch("app.core.secret_manager._get_env_secret")
    @patch("app.core.secret_manager._get_client")
    def test_get_secret_with_provided_project_id(self, mock_get_client, mock_get_env):
        # Covers branch where project_id is provided (line 79)
        mock_get_env.return_value = None
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_response = MagicMock()
        mock_response.payload.data.decode.return_value = "secret_val"
        mock_client.access_secret_version.return_value = mock_response

        # Pass project_id explicitly
        assert get_secret("my-secret", project_id="explicit-project") == "secret_val"
        # Verify the name uses the explicit project
        args, kwargs = mock_client.access_secret_version.call_args
        assert "projects/explicit-project/" in kwargs["name"]

    @patch("app.core.secret_manager._get_env_secret")
    @patch("app.core.secret_manager._get_client")
    @patch.dict(os.environ, {"GOOGLE_CLOUD_PROJECT": "test-project"}, clear=True)
    def test_get_secret_exception_with_default(self, mock_get_client, mock_get_env):
        # Covers line 91 (default is NOT None)
        mock_get_env.return_value = None
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_client.access_secret_version.side_effect = Exception("API error")

        # Should return default instead of raising RuntimeError
        assert get_secret("my-secret", default="my-default") == "my-default"

    @patch("app.core.secret_manager.get_secret")
    @patch.dict(os.environ, {"FIREBASE_PROJECT_ID": "env-id"}, clear=True)
    def test_get_firebase_config_with_env_default(self, mock_get):
        # Ensure we test the default value calculation in get_firebase_config
        # mock_get.side_effect returns the default value passed to it
        mock_get.side_effect = lambda sid, default=None: default

        config = get_firebase_config()
        assert config["project_id"] == "env-id"
