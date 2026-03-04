from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException, Request
from firebase_admin import auth

from app.core.security import (
    AuthenticationError,
    create_access_token,
    get_current_user_id,
    get_current_user_optional,
    verify_firebase_token,
    verify_google_oidc_token,
)


class TestVerifyGoogleOidcToken:
    @patch("app.core.security.id_token.verify_oauth2_token")
    @patch("app.core.security.os.getenv")
    @pytest.mark.asyncio
    async def test_verify_success(self, mock_getenv, mock_verify):
        mock_getenv.return_value = "https://app.url"
        mock_verify.return_value = {"iss": "accounts.google.com"}

        request = MagicMock(spec=Request)
        request.headers = {"Authorization": "Bearer valid_token"}

        result = await verify_google_oidc_token(request)
        assert result == {"iss": "accounts.google.com"}

    @pytest.mark.asyncio
    async def test_verify_missing_header(self):
        request = MagicMock(spec=Request)
        request.headers = {}

        with pytest.raises(HTTPException) as exc_info:
            await verify_google_oidc_token(request)
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_verify_invalid_header_format(self):
        request = MagicMock(spec=Request)
        request.headers = {"Authorization": "Basic some_token"}

        with pytest.raises(HTTPException) as exc_info:
            await verify_google_oidc_token(request)
        assert exc_info.value.status_code == 401

    @patch("app.core.security.os.getenv")
    @pytest.mark.asyncio
    async def test_verify_missing_audience(self, mock_getenv):
        mock_getenv.return_value = None
        request = MagicMock(spec=Request)
        request.headers = {"Authorization": "Bearer token"}

        with pytest.raises(HTTPException) as exc_info:
            await verify_google_oidc_token(request)
        assert exc_info.value.status_code == 500

    @patch("app.core.security.id_token.verify_oauth2_token")
    @patch("app.core.security.os.getenv")
    @pytest.mark.asyncio
    async def test_verify_exception(self, mock_getenv, mock_verify):
        mock_getenv.return_value = "audience"
        mock_verify.side_effect = Exception("Invalid token")
        request = MagicMock(spec=Request)
        request.headers = {"Authorization": "Bearer token"}

        with pytest.raises(HTTPException) as exc_info:
            await verify_google_oidc_token(request)
        assert exc_info.value.status_code == 401


class TestCreateAccessToken:
    @patch("app.core.security.jwt.encode")
    def test_create_access_token(self, mock_encode):
        mock_encode.return_value = "encoded_token"
        token = create_access_token({"sub": "123"})
        assert token == "encoded_token"
        mock_encode.assert_called_once()
        args, kwargs = mock_encode.call_args
        assert "exp" in args[0]
        assert args[0]["sub"] == "123"

    @patch("app.core.security.jwt.encode")
    def test_create_access_token_with_delta(self, mock_encode):
        mock_encode.return_value = "encoded_token"
        token = create_access_token({"sub": "123"}, timedelta(minutes=60))
        assert token == "encoded_token"


class TestVerifyFirebaseToken:
    @patch("app.core.security.auth.verify_id_token")
    @pytest.mark.asyncio
    async def test_verify_success(self, mock_verify):
        mock_verify.return_value = {"uid": "123"}
        result = await verify_firebase_token("token")
        assert result == {"uid": "123"}

    @patch("app.core.security.auth.verify_id_token")
    @pytest.mark.asyncio
    async def test_verify_invalid_token(self, mock_verify):
        mock_verify.side_effect = auth.InvalidIdTokenError("Invalid")
        with pytest.raises(AuthenticationError):
            await verify_firebase_token("token")

    @patch("app.core.security.auth.verify_id_token")
    @pytest.mark.asyncio
    async def test_verify_expired_token(self, mock_verify):
        mock_verify.side_effect = auth.ExpiredIdTokenError("Expired", None)
        with pytest.raises(AuthenticationError):
            await verify_firebase_token("token")

    @patch("app.core.security.auth.verify_id_token")
    @pytest.mark.asyncio
    async def test_verify_revoked_token(self, mock_verify):
        mock_verify.side_effect = auth.RevokedIdTokenError("Revoked")
        with pytest.raises(AuthenticationError):
            await verify_firebase_token("token")

    @patch("app.core.security.auth.verify_id_token")
    @pytest.mark.asyncio
    async def test_verify_general_exception(self, mock_verify):
        mock_verify.side_effect = Exception("General error")
        with pytest.raises(AuthenticationError):
            await verify_firebase_token("token")


class TestGetCurrentUserId:
    @patch("app.core.security.verify_firebase_token")
    @pytest.mark.asyncio
    async def test_get_current_user_id_success(self, mock_verify):
        mock_verify.return_value = {"uid": "user123"}
        user_id = await get_current_user_id("Bearer valid_token")
        assert user_id == "user123"

    @pytest.mark.asyncio
    async def test_missing_authorization(self):
        with pytest.raises(AuthenticationError):
            await get_current_user_id(None)

    @pytest.mark.asyncio
    async def test_invalid_authorization_format(self):
        with pytest.raises(AuthenticationError):
            await get_current_user_id("Basic token")

    @patch("app.core.security.verify_firebase_token")
    @pytest.mark.asyncio
    async def test_missing_uid_claim(self, mock_verify):
        mock_verify.return_value = {"email": "test@example.com"}
        with pytest.raises(AuthenticationError):
            await get_current_user_id("Bearer valid_token")

    @patch("app.core.security.verify_firebase_token")
    @pytest.mark.asyncio
    async def test_unexpected_error(self, mock_verify):
        mock_verify.side_effect = Exception("Unexpected")
        with pytest.raises(AuthenticationError):
            await get_current_user_id("Bearer valid_token")


class TestGetCurrentUserOptional:
    @patch("app.core.security.get_current_user_id")
    @pytest.mark.asyncio
    async def test_success(self, mock_get_id):
        mock_get_id.return_value = "user123"
        user_id = await get_current_user_optional("Bearer token")
        assert user_id == "user123"

    @pytest.mark.asyncio
    async def test_missing_authorization(self):
        user_id = await get_current_user_optional(None)
        assert user_id is None

    @patch("app.core.security.get_current_user_id")
    @pytest.mark.asyncio
    async def test_auth_error(self, mock_get_id):
        mock_get_id.side_effect = AuthenticationError("Failed")
        user_id = await get_current_user_optional("Bearer token")
        assert user_id is None
