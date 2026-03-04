import os
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException, Request, status
from firebase_admin import auth

from app.core import security
from app.core.security import (
    AuthenticationError,
    create_access_token,
    get_current_user_id,
    get_current_user_optional,
    verify_firebase_token,
    verify_google_oidc_token,
)


@pytest.fixture
def mock_request():
    request = MagicMock(spec=Request)
    request.headers = {"Authorization": "Bearer some_token"}
    return request


class TestSecurityExpanded:
    @patch("app.core.security.id_token.verify_oauth2_token")
    @patch("app.core.security.os.getenv")
    @pytest.mark.asyncio
    async def test_verify_google_oidc_token_unexpected_error(
        self, mock_getenv, mock_verify, mock_request
    ):
        # Covers line 67-73
        mock_getenv.return_value = "https://app.url"
        mock_verify.side_effect = Exception("Unexpected crash")

        with pytest.raises(HTTPException) as exc_info:
            await verify_google_oidc_token(mock_request)
        assert exc_info.value.status_code == 401
        assert "Unexpected crash" in exc_info.value.detail

    @patch("app.core.security.auth.verify_id_token")
    @pytest.mark.asyncio
    async def test_verify_firebase_token_expired(self, mock_verify):
        # Explicitly testing line 136-138
        # Use a more dummy dict for the second arg of ExpiredIdTokenError if needed
        mock_verify.side_effect = auth.ExpiredIdTokenError("Token expired", {"some": "claims"})

        with pytest.raises(AuthenticationError) as exc_info:
            await verify_firebase_token("token")
        assert "expired" in exc_info.value.detail.lower()

    @patch("app.core.security.auth.verify_id_token")
    @pytest.mark.asyncio
    async def test_verify_firebase_token_revoked(self, mock_verify):
        # Explicitly testing line 140-143
        mock_verify.side_effect = auth.RevokedIdTokenError("Token revoked")

        with pytest.raises(AuthenticationError) as exc_info:
            await verify_firebase_token("token")
        assert "revoked" in exc_info.value.detail.lower()

    @patch("app.core.security.verify_firebase_token")
    @pytest.mark.asyncio
    async def test_get_current_user_id_unexpected_error(self, mock_verify):
        # Covers line 196-198
        mock_verify.side_effect = Exception("Unexpected db error")

        with pytest.raises(AuthenticationError) as exc_info:
            await get_current_user_id("Bearer some_token")
        assert exc_info.value.detail == "Authentication failed"

    @patch("app.core.security.verify_firebase_token")
    @pytest.mark.asyncio
    async def test_get_current_user_id_malformed_bearer(self, mock_verify):
        # Covers line 177-178
        with pytest.raises(AuthenticationError) as exc_info:
            await get_current_user_id("TokenOnly")
        assert "format" in exc_info.value.detail

    @patch("app.core.security.verify_firebase_token")
    @pytest.mark.asyncio
    async def test_get_current_user_id_empty_bearer(self, mock_verify):
        # Covers line 177-178
        with pytest.raises(AuthenticationError) as exc_info:
            await get_current_user_id("Bearer ")
        assert "format" in exc_info.value.detail

    def test_create_access_token_no_delta(self):
        # Covers line 90-91
        token = create_access_token({"sub": "user1"})
        assert token is not None

    @pytest.mark.asyncio
    async def test_get_current_user_optional_invalid_format(self):
        # Covers line 225-227
        user_id = await get_current_user_optional("NotBearer token")
        assert user_id is None
