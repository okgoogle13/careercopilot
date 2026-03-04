import os
from unittest.mock import MagicMock, patch

import pytest

from app.core import secrets
from app.core.secrets import (
    _get_secret_manager_client,
    _secret_exists,
    delete_user_secret,
    get_user_secret,
)


class TestSecretsExpanded:
    @patch("app.core.secrets.secretmanager")
    @patch("app.core.secrets.os.getenv")
    def test_get_client_exception(self, mock_getenv, mock_sm):
        # Covers line 46-48
        mock_getenv.return_value = '{"type": "service_account"}'
        with patch("app.core.secrets.service_account") as mock_sa:
            mock_sa.Credentials.from_service_account_info.side_effect = Exception("Auth failed")
            client = _get_secret_manager_client()
            assert client is None

    @patch("app.core.secrets.GCP_PROJECT_ID", None)
    def test_get_user_secret_no_project(self):
        # Covers line 89
        with pytest.raises(ValueError, match="GCP_PROJECT_ID"):
            get_user_secret("user1", "secret1")

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    @patch("app.core.secrets.client", None)
    def test_get_user_secret_no_client(self):
        # Covers line 91
        with pytest.raises(RuntimeError, match="client is not available"):
            get_user_secret("user1", "secret1")

    @patch("app.core.secrets.GCP_PROJECT_ID", None)
    def test_delete_user_secret_no_project(self):
        # Covers line 104
        with pytest.raises(ValueError, match="GCP_PROJECT_ID"):
            delete_user_secret("user1", "secret1")

    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    @patch("app.core.secrets.client", None)
    def test_delete_user_secret_no_client(self):
        # Covers line 106
        with pytest.raises(RuntimeError, match="client is not available"):
            delete_user_secret("user1", "secret1")

    @patch("app.core.secrets.client")
    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_secret_exists_exception(self, mock_client):
        # Covers line 203-204
        mock_client.get_secret.side_effect = Exception("Unknown API error")
        assert _secret_exists("my-secret") is False

    @patch("app.core.secrets.client")
    @patch("app.core.secrets.GCP_PROJECT_ID", "test-project")
    def test_get_user_secret_success_coverage(self, mock_client):
        # Just to ensure we hit the success branch of get_user_secret fully
        mock_response = MagicMock()
        mock_response.payload.data.decode.return_value = "decoded_secret"
        mock_client.access_secret_version.return_value = mock_response

        result = get_user_secret("user1", "secret1")
        assert result == "decoded_secret"
        # Verify the name format
        args, kwargs = mock_client.access_secret_version.call_args
        assert (
            "projects/test-project/secrets/careercopilot-secret1-user1/versions/latest"
            in kwargs["request"]["name"]
        )
