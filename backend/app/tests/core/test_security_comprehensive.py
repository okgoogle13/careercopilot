"""
Tests for security.py, covering JWT, Firebase auth, and OIDC token verification.
"""

import os
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import jwt
import pytest
from fastapi import Header, HTTPException, Request, status
from fastapi.testclient import TestClient
from firebase_admin import auth
from google.auth.transport import requests
from google.oauth2 import id_token

from app.core import security


# Mock Firebase Admin SDK
@pytest.fixture
def mock_firebase_admin():
    with patch("app.core.security.auth") as mock:
        yield mock


# Mock os.getenv
@pytest.fixture
def mock_os_getenv():
    with patch("app.core.security.os") as mock:
        yield mock


# Test JWT Token Generation
def test_create_access_token(mock_os_getenv):
    mock_os_getenv.getenv.return_value = "test_secret_key"
    data = {"user_id": "123"}
    token = security.create_access_token(data)
    assert isinstance(token, str)
    payload = jwt.decode(token, "test_secret_key", algorithms=["HS256"])
    assert payload["user_id"] == "123"
    assert "exp" in payload


def test_create_access_token_with_expiration(mock_os_getenv):
    mock_os_getenv.getenv.return_value = "test_secret_key"
    data = {"user_id": "456"}
    expires_delta = timedelta(minutes=10)
    token = security.create_access_token(data, expires_delta)
    assert isinstance(token, str)
    payload = jwt.decode(token, "test_secret_key", algorithms=["HS256"])
    assert payload["user_id"] == "456"
    assert "exp" in payload
    expire_time = datetime.now(timezone.utc) + expires_delta
    assert payload["exp"] == expire_time.timestamp()


# Test JWT Token Validation (Not directly testable without a full app context)


# Test Firebase Token Verification
def test_verify_firebase_token_success(mock_firebase_admin):
    mock_firebase_admin.verify_id_token.return_value = {"uid": "test_user"}
    token = "test_token"
    decoded_token = security.verify_firebase_token(token)
    assert decoded_token["uid"] == "test_user"
    mock_firebase_admin.verify_id_token.assert_called_once_with(token)


def test_verify_firebase_token_expired(mock_firebase_admin):
    mock_firebase_admin.verify_id_token.side_effect = auth.ExpiredIdTokenError("Token expired")
    with pytest.raises(security.AuthenticationError) as excinfo:
        security.verify_firebase_token("test_token")
    assert "Authentication token has expired" in str(excinfo.value)


def test_verify_firebase_token_revoked(mock_firebase_admin):
    mock_firebase_admin.verify_id_token.side_effect = auth.RevokedIdTokenError("Token revoked")
    with pytest.raises(security.AuthenticationError) as excinfo:
        security.verify_firebase_token("test_token")
    assert "Authentication token has been revoked" in str(excinfo.value)


def test_verify_firebase_token_invalid(mock_firebase_admin):
    mock_firebase_admin.verify_id_token.side_effect = auth.InvalidIdTokenError("Invalid token")
    with pytest.raises(security.AuthenticationError) as excinfo:
        security.verify_firebase_token("test_token")
    assert "Invalid authentication token" in str(excinfo.value)


# Test Google OIDC Token Verification
def test_verify_google_oidc_token_success(mock_os_getenv):
    mock_os_getenv.getenv.return_value = "https://example.com"
    token = "test_token"
    mock_id_token = id_token.verify_oauth2_token(
        token, requests.Request(), audience="https://example.com"
    )
    with patch("google.oauth2.id_token.verify_oauth2_token") as mock_verify:
        mock_verify.return_value = mock_id_token
        id_info = security.verify_google_oidc_token(
            Request(headers={"Authorization": f"Bearer {token}"})
        )
        assert id_info == mock_id_token


def test_verify_google_oidc_token_missing_header():
    with pytest.raises(HTTPException) as excinfo:
        security.verify_google_oidc_token(Request(headers={}))
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED


def test_verify_google_oidc_token_invalid_header():
    with pytest.raises(HTTPException) as excinfo:
        security.verify_google_oidc_token(Request(headers={"Authorization": "invalid"}))
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED


def test_verify_google_oidc_token_no_audience():
    mock_os_getenv = pytest.fixture(autouse=True)
    mock_os_getenv.return_value = None
    with pytest.raises(HTTPException) as excinfo:
        security.verify_google_oidc_token(Request(headers={"Authorization": "Bearer test_token"}))
    assert excinfo.value.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR


def test_verify_google_oidc_token_verification_error():
    mock_os_getenv = pytest.fixture(autouse=True)
    mock_os_getenv.getenv.return_value = "https://example.com"
    with patch("google.oauth2.id_token.verify_oauth2_token") as mock_verify:
        mock_verify.side_effect = Exception("Invalid token")
        with pytest.raises(HTTPException) as excinfo:
            security.verify_google_oidc_token(
                Request(headers={"Authorization": "Bearer test_token"})
            )
        assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED
