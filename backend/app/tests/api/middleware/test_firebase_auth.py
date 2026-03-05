from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException, Request

from app.api.middleware.firebase_auth import FirebaseAuthBackend, get_current_user, require_role


@pytest.fixture
def auth_backend():
    return FirebaseAuthBackend()


@pytest.fixture
def mock_request():
    request = MagicMock(spec=Request)
    request.state = MagicMock()
    return request


class TestFirebaseAuthBackend:
    @patch("app.api.middleware.firebase_auth.settings")
    @pytest.mark.asyncio
    async def test_call_dev_override(self, mock_settings, auth_backend, mock_request):
        mock_settings.ENVIRONMENT = "development"
        mock_settings.DISABLE_AUTH = True

        result = await auth_backend(mock_request)
        assert result == {"uid": "dev-user", "email": "dev@example.com", "roles": ["admin"]}

    @patch("app.api.middleware.firebase_auth.settings")
    @patch("app.api.middleware.firebase_auth.HTTPBearer.__call__")
    @pytest.mark.asyncio
    async def test_call_missing_credentials(
        self, mock_super_call, mock_settings, auth_backend, mock_request
    ):
        mock_settings.ENVIRONMENT = "production"
        mock_super_call.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await auth_backend(mock_request)

        assert exc_info.value.status_code == 401
        assert "Missing authorization header" in exc_info.value.detail

    @patch("app.api.middleware.firebase_auth.settings")
    @patch("app.api.middleware.firebase_auth.HTTPBearer.__call__")
    @pytest.mark.asyncio
    async def test_call_invalid_scheme(
        self, mock_super_call, mock_settings, auth_backend, mock_request
    ):
        mock_settings.ENVIRONMENT = "production"
        mock_creds = MagicMock()
        mock_creds.scheme = "Basic"
        mock_super_call.return_value = mock_creds

        with pytest.raises(HTTPException) as exc_info:
            await auth_backend(mock_request)

        assert exc_info.value.status_code == 401
        assert "Invalid authentication scheme" in exc_info.value.detail

    @patch("app.api.middleware.firebase_auth.verify_id_token")
    @patch("app.api.middleware.firebase_auth.settings")
    @patch("app.api.middleware.firebase_auth.HTTPBearer.__call__")
    @pytest.mark.asyncio
    async def test_call_invalid_token(
        self, mock_super_call, mock_settings, mock_verify, auth_backend, mock_request
    ):
        mock_settings.ENVIRONMENT = "production"
        mock_creds = MagicMock()
        mock_creds.scheme = "Bearer"
        mock_creds.credentials = "invalid_token"
        mock_super_call.return_value = mock_creds
        mock_verify.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await auth_backend(mock_request)

        assert exc_info.value.status_code == 401
        assert "Invalid authentication credentials" in exc_info.value.detail

    @patch("app.api.middleware.firebase_auth.verify_id_token")
    @patch("app.api.middleware.firebase_auth.settings")
    @patch("app.api.middleware.firebase_auth.HTTPBearer.__call__")
    @pytest.mark.asyncio
    async def test_call_success(
        self, mock_super_call, mock_settings, mock_verify, auth_backend, mock_request
    ):
        mock_settings.ENVIRONMENT = "production"
        mock_creds = MagicMock()
        mock_creds.scheme = "Bearer"
        mock_creds.credentials = "valid_token"
        mock_super_call.return_value = mock_creds
        mock_verify.return_value = {"uid": "123"}

        result = await auth_backend(mock_request)

        assert result == {"uid": "123"}
        assert mock_request.state.user == {"uid": "123"}

    @patch("app.api.middleware.firebase_auth.verify_id_token")
    @patch("app.api.middleware.firebase_auth.settings")
    @patch("app.api.middleware.firebase_auth.HTTPBearer.__call__")
    @pytest.mark.asyncio
    async def test_call_exception(
        self, mock_super_call, mock_settings, mock_verify, auth_backend, mock_request
    ):
        mock_settings.ENVIRONMENT = "production"
        mock_creds = MagicMock()
        mock_creds.scheme = "Bearer"
        mock_super_call.return_value = mock_creds
        mock_verify.side_effect = Exception("Unexpected error")

        with pytest.raises(HTTPException) as exc_info:
            await auth_backend(mock_request)

        assert exc_info.value.status_code == 401
        assert "Could not validate credentials" in exc_info.value.detail


class TestDependencies:
    def test_get_current_user(self):
        mock_user = {"uid": "123"}
        assert get_current_user(mock_user) == mock_user

    def test_require_role_no_roles_required(self):
        checker = require_role()
        mock_user = {"uid": "123"}
        assert checker(mock_user) == mock_user

    def test_require_role_success_list(self):
        checker = require_role(["admin", "user"])
        mock_user = {"uid": "123", "roles": ["admin"]}
        assert checker(mock_user) == mock_user

    def test_require_role_success_string(self):
        checker = require_role(["admin"])
        mock_user = {"uid": "123", "roles": "admin"}
        assert checker(mock_user) == mock_user

    def test_require_role_forbidden(self):
        checker = require_role(["admin"])
        mock_user = {"uid": "123", "roles": ["user"]}

        with pytest.raises(HTTPException) as exc_info:
            checker(mock_user)

        assert exc_info.value.status_code == 403
        assert "Insufficient permissions" in exc_info.value.detail
