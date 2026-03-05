"""
Tests for Firebase Authentication Middleware.
"""

from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from fastapi import Depends, HTTPException, status
from fastapi.testclient import TestClient

from app.api.middleware.firebase_auth import (
    FirebaseAuthBackend,
    FirebaseAuthError,
    get_current_user,
    require_role,
)
from app.core.config import settings
from app.core.firebase import verify_id_token

# Mock settings for testing
settings.ENVIRONMENT = "test"
settings.DISABLE_AUTH = False


@pytest.fixture
def client():
    """Fixture for creating a test client."""
    return TestClient(app="main:app")  # Assuming your FastAPI app is in main.py


@pytest.fixture
def mock_verify_id_token():
    """Mock the verify_id_token function."""
    with patch("app.core.firebase.verify_id_token") as mock:
        yield mock


class TestFirebaseAuthBackend:
    """Tests for the FirebaseAuthBackend class."""

    @pytest.fixture
    def auth_backend(self):
        """Fixture for creating an instance of FirebaseAuthBackend."""
        return FirebaseAuthBackend()

    def test_successful_authentication(self, auth_backend, mock_verify_id_token):
        """Test successful authentication with a valid token."""
        mock_verify_id_token.return_value = {"uid": "test_user", "email": "test@example.com"}
        request = MagicMock()
        request.headers = {"Authorization": "Bearer valid_token"}
        result = auth_backend(request)
        assert result == {"uid": "test_user", "email": "test@example.com"}

    def test_missing_authorization_header(self, auth_backend):
        """Test authentication failure with a missing authorization header."""
        request = MagicMock()
        request.headers = {}
        with pytest.raises(HTTPException) as exc_info:
            auth_backend(request)
        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Missing authorization header" in str(exc_info.value.detail)

    def test_invalid_authentication_scheme(self, auth_backend):
        """Test authentication failure with an invalid authentication scheme."""
        request = MagicMock()
        request.headers = {"Authorization": "Basic valid_token"}
        with pytest.raises(HTTPException) as exc_info:
            auth_backend(request)
        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid authentication scheme" in str(exc_info.value.detail)

    def test_invalid_token(self, auth_backend, mock_verify_id_token):
        """Test authentication failure with an invalid token."""
        mock_verify_id_token.side_effect = Exception("Invalid token")
        request = MagicMock()
        request.headers = {"Authorization": "Bearer invalid_token"}
        with pytest.raises(HTTPException) as exc_info:
            auth_backend(request)
        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Could not validate credentials" in str(exc_info.value.detail)

    def test_development_mode_disabled_auth(self, auth_backend):
        """Test authentication bypass in development mode with auth disabled."""
        settings.ENVIRONMENT = "development"
        settings.DISABLE_AUTH = True
        request = MagicMock()
        request.headers = {"Authorization": "Bearer any_token"}
        result = auth_backend(request)
        assert result == {"uid": "dev-user", "email": "dev@example.com"}

    def test_development_mode_enabled_auth(self, auth_backend, mock_verify_id_token):
        """Test authentication in development mode with auth enabled."""
        settings.ENVIRONMENT = "development"
        settings.DISABLE_AUTH = False
        mock_verify_id_token.return_value = {"uid": "test_user", "email": "test@example.com"}
        request = MagicMock()
        request.headers = {"Authorization": "Bearer valid_token"}
        result = auth_backend(request)
        assert result == {"uid": "test_user", "email": "test@example.com"}


class TestGetCurrentUser:
    """Tests for the get_current_user function."""

    def test_get_current_user_success(self, client, mock_verify_id_token):
        """Test successful retrieval of the current user."""
        mock_verify_id_token.return_value = {"uid": "test_user", "email": "test@example.com"}
        response = client.get("/protected", headers={"Authorization": "Bearer valid_token"})
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"uid": "test_user", "email": "test@example.com"}

    def test_get_current_user_failure(self, client, mock_verify_id_token):
        """Test failure to retrieve the current user."""
        mock_verify_id_token.side_effect = Exception("Invalid token")
        response = client.get("/protected", headers={"Authorization": "Bearer invalid_token"})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Could not validate credentials" in response.json().get("detail")


class TestRequireRole:
    """Tests for the require_role decorator."""

    @pytest.fixture
    def mock_user(self):
        """Fixture for a mock user dictionary."""
        return {"uid": "test_user", "email": "test@example.com", "roles": ["admin"]}

    def test_require_role_success(self, client, mock_user, mock_verify_id_token):
        """Test successful access with required role."""
        mock_verify_id_token.return_value = mock_user
        response = client.get("/protected", headers={"Authorization": "Bearer valid_token"})
        assert response.status_code == status.HTTP_200_OK

    def test_require_role_failure(self, client, mock_user, mock_verify_id_token):
        """Test access denied due to missing required role."""
        mock_user["roles"] = []
        mock_verify_id_token.return_value = mock_user

        @require_role(required_roles=["admin"])
        def protected_route(user: dict[str, Any] = Depends(get_current_user)):
            return user

        with pytest.raises(HTTPException) as exc_info:
            protected_route()
        assert exc_info.value.status_code == status.HTTP_403_FORBIDDEN
        assert "Insufficient permissions" in str(exc_info.value.detail)

    def test_require_role_no_roles_required(self, client, mock_user, mock_verify_id_token):
        """Test access allowed when no roles are required."""
        mock_verify_id_token.return_value = mock_user
        response = client.get("/protected", headers={"Authorization": "Bearer valid_token"})
        assert response.status_code == status.HTTP_200_OK

    def test_require_role_string_roles(self, client, mock_verify_id_token):
        """Test role checking with a single role as a string."""
        mock_verify_id_token.return_value = {
            "uid": "test_user",
            "email": "test@example.com",
            "roles": "admin",
        }
        response = client.get("/protected", headers={"Authorization": "Bearer valid_token"})
        assert response.status_code == status.HTTP_200_OK
