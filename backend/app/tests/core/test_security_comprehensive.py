"""
Tests for security.py, covering JWT, Firebase auth, and OIDC token verification.
"""

import os
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import jwt
import pytest
from fastapi import Header, HTTPException, status
from fastapi.testclient import TestClient
from firebase_admin import auth

from backend.app.core import security
from backend.app.core.security import (
    AuthenticationError,
    create_access_token,
    verify_firebase_token,
    verify_google_oidc_token,
)


# Mock Firebase Admin SDK
@pytest.fixture
def mock_firebase_admin():
    with patch("backend.app.core.security.auth") as mock:
        yield mock


# Test JWT Token Generation and Validation
class TestJWT:
    def test_create_access_token(self, monkeypatch):
        data = {"user_id": "123", "email": "test@example.com"}
        expires_delta = timedelta(minutes=10)
        token = security.create_access_token(data, expires_delta)
        assert isinstance(token, str)
        monkeypatch.setattr(security, "SECRET_KEY", "test_secret")
        decoded_payload = jwt.decode(token, "test_secret", algorithms=["HS256"])
        assert decoded_payload["user_id"] == "123"
        assert decoded_payload["email"] == "test@example.com"
        assert "exp" in decoded_payload

    def test_create_access_token_no_expiry(self, monkeypatch):
        data = {"user_id": "456"}
        token = security.create_access_token(data)
        assert isinstance(token, str)
        monkeypatch.setattr(security, "SECRET_KEY", "test_secret")
        decoded_payload = jwt.decode(token, "test_secret", algorithms=["HS256"])
        assert decoded_payload["user_id"] == "456"
        assert "exp" in decoded_payload


# Test Firebase Authentication
class TestFirebaseAuth:
    def test_verify_firebase_token_success(self, mock_firebase_admin):
        mock_firebase_admin.verify_id_token.return_value = {"uid": "test_user"}
        token = "test_token"
        decoded_token = security.verify_firebase_token(token)
        assert decoded_token["uid"] == "test_user"
        mock_firebase_admin.verify_id_token.assert_called_once_with(token)

    def test_verify_firebase_token_expired(self, mock_firebase_admin):
        mock_firebase_admin.verify_id_token.side_effect = auth.ExpiredIdTokenError("Token expired")
        token = "expired_token"
        with pytest.raises(AuthenticationError) as excinfo:
            security.verify_firebase_token(token)
        assert "Authentication token has expired" in str(excinfo.value)

    def test_verify_firebase_token_revoked(self, mock_firebase_admin):
        mock_firebase_admin.verify_id_token.side_effect = auth.RevokedIdTokenError("Token revoked")
        token = "revoked_token"
        with pytest.raises(AuthenticationError) as excinfo:
            security.verify_firebase_token(token)
        assert "Authentication token has been revoked" in str(excinfo.value)

    def test_verify_firebase_token_invalid(self, mock_firebase_admin):
        mock_firebase_admin.verify_id_token.side_effect = auth.InvalidIdTokenError("Invalid token")
        token = "invalid_token"
        with pytest.raises(AuthenticationError) as excinfo:
            security.verify_firebase_token(token)
        assert "Invalid authentication token" in str(excinfo.value)


# Test Google OIDC Token Verification
class TestGoogleOIDCToken:
    @pytest.fixture
    def mock_id_token_verify(self, monkeypatch):
        with patch("google.oauth2.id_token.verify_oauth2_token") as mock:
            yield mock

    def test_verify_google_oidc_token_success(self, mock_id_token_verify, monkeypatch):
        mock_id_token_verify.return_value = {
            "iss": "https://accounts.google.com",
            "aud": "test_audience",
        }
        monkeypatch.setenv("APP_URL", "test_audience")
        request = pytest.FixtureRequest
        req = request.getfixturevalue("client").request
        req.headers = {"Authorization": "Bearer test_token"}
        id_info = security.verify_google_oidc_token(req)
        assert id_info == {"iss": "https://accounts.google.com", "aud": "test_audience"}

    def test_verify_google_oidc_token_missing_header(self, monkeypatch):
        monkeypatch.setenv("APP_URL", "test_audience")
        request = pytest.FixtureRequest
        req = request.getfixturevalue("client").request
        req.headers = {}
        with pytest.raises(HTTPException) as excinfo:
            security.verify_google_oidc_token(req)
        assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED

    def test_verify_google_oidc_token_invalid_header(self, monkeypatch):
        monkeypatch.setenv("APP_URL", "test_audience")
        request = pytest.FixtureRequest
        req = request.getfixturevalue("client").request
        req.headers = {"Authorization": "InvalidHeader"}
        with pytest.raises(HTTPException) as excinfo:
            security.verify_google_oidc_token(req)
        assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED

    def test_verify_google_oidc_token_missing_audience(self, monkeypatch):
        request = pytest.FixtureRequest
        req = request.getfixturevalue("client").request
        req.headers = {"Authorization": "Bearer test_token"}
        with pytest.raises(HTTPException) as excinfo:
            security.verify_google_oidc_token(req)
        assert excinfo.value.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
