"""Tests for firebase auth middleware contracts."""

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


@patch("app.api.middleware.firebase_auth.verify_id_token")
@patch("app.api.middleware.firebase_auth.settings")
@patch("app.api.middleware.firebase_auth.HTTPBearer.__call__")
@pytest.mark.asyncio
async def test_auth_backend_success(
    mock_super_call, mock_settings, mock_verify, auth_backend, mock_request
):
    mock_settings.ENVIRONMENT = "production"
    mock_settings.DISABLE_AUTH = False
    creds = MagicMock()
    creds.scheme = "Bearer"
    creds.credentials = "token"
    mock_super_call.return_value = creds
    mock_verify.return_value = {"uid": "u1", "roles": ["user"]}

    result = await auth_backend(mock_request)

    assert result["uid"] == "u1"
    assert mock_request.state.user["uid"] == "u1"


def test_get_current_user_passthrough():
    user = {"uid": "abc"}
    assert get_current_user(user) == user


def test_require_role_forbidden():
    checker = require_role(["admin"])
    with pytest.raises(HTTPException) as exc:
        checker({"uid": "abc", "roles": ["user"]})
    assert exc.value.status_code == 403
