"""
Comprehensive tests for Firebase Authentication Middleware.
"""

from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from fastapi import Depends, FastAPI, Request, status
from fastapi.testclient import TestClient

from app.api.middleware.firebase_auth import (
    FirebaseAuthBackend,
    auth_backend,
    get_current_user,
    require_role,
)

# Create a test FastAPI app
app = FastAPI()


@app.get("/protected", dependencies=[Depends(auth_backend)])
async def protected_route(request: Request):
    return {"message": "Success", "user": request.state.user}


@app.get("/user-dep")
async def user_dep_route(user: dict = Depends(get_current_user)):
    return {"user": user}


@app.get("/admin-only", dependencies=[Depends(require_role(["admin"]))])
async def admin_route():
    return {"message": "Welcome Admin"}


@app.get("/editor-or-admin", dependencies=[Depends(require_role(["editor", "admin"]))])
async def editor_admin_route():
    return {"message": "Welcome Editor or Admin"}


@app.get("/public")
async def public_route():
    return {"message": "Public access"}


client = TestClient(app)


class TestFirebaseAuthComprehensive:
    """Tests for FirebaseAuthBackend and associated dependencies."""

    @pytest.fixture
    def mock_verify(self):
        with patch("app.api.middleware.firebase_auth.verify_id_token") as mock:
            yield mock

    def test_auth_disabled_in_development(self, mock_verify):
        """Test authentication bypass in development."""
        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "development"
            mock_settings.DISABLE_AUTH = True

            response = client.get("/protected")
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["user"]["uid"] == "dev-user"
            mock_verify.assert_not_called()

    def test_missing_auth_header(self, mock_verify):
        """Test request with missing Authorization header."""
        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/protected")
            # When Bearer is required and missing, TestClient/FastAPI handles it
            assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_invalid_auth_scheme(self, mock_verify):
        """Test request with invalid authentication scheme (not Bearer)."""
        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/protected", headers={"Authorization": "Basic dGVzdDp0ZXN0"})
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            # HTTPBearer returns None for invalid schemes when auto_error=False
            assert "Missing authorization header" in response.json()["detail"]

    def test_valid_token_success(self, mock_verify):
        """Test successful authentication with a valid token."""
        mock_verify.return_value = {"uid": "test-uid", "email": "test@example.com"}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/protected", headers={"Authorization": "Bearer valid-token"})
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["user"]["uid"] == "test-uid"
            mock_verify.assert_called_once_with("valid-token")

    def test_token_verification_failure(self, mock_verify):
        """Test authentication failure when token verification fails."""
        mock_verify.return_value = None

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/protected", headers={"Authorization": "Bearer invalid-token"})
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            assert "Invalid authentication credentials" in response.json()["detail"]

    def test_token_verification_exception(self, mock_verify):
        """Test authentication failure when verification raises an exception."""
        mock_verify.side_effect = Exception("Firebase Error")

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/protected", headers={"Authorization": "Bearer error-token"})
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            assert "Could not validate credentials" in response.json()["detail"]

    def test_get_current_user_dependency(self, mock_verify):
        """Test the get_current_user dependency."""
        mock_verify.return_value = {"uid": "user-123"}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/user-dep", headers={"Authorization": "Bearer some-token"})
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["user"]["uid"] == "user-123"


class TestRequireRoleComprehensive:
    """Tests for the require_role decorator/dependency."""

    @pytest.fixture
    def mock_verify(self):
        with patch("app.api.middleware.firebase_auth.verify_id_token") as mock:
            yield mock

    def test_require_role_success(self, mock_verify):
        """Test success when user has the required role."""
        mock_verify.return_value = {"uid": "admin-uid", "roles": ["admin"]}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/admin-only", headers={"Authorization": "Bearer admin-token"})
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["message"] == "Welcome Admin"

    def test_require_role_list_success(self, mock_verify):
        """Test success when user has one of the required roles from a list."""
        mock_verify.return_value = {"uid": "editor-uid", "roles": ["editor"]}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get(
                "/editor-or-admin", headers={"Authorization": "Bearer editor-token"}
            )
            assert response.status_code == status.HTTP_200_OK
            assert response.json()["message"] == "Welcome Editor or Admin"

    def test_require_role_string_success(self, mock_verify):
        """Test success when the roles claim is a string instead of a list."""
        mock_verify.return_value = {"uid": "admin-uid", "roles": "admin"}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/admin-only", headers={"Authorization": "Bearer admin-token"})
            assert response.status_code == status.HTTP_200_OK

    def test_require_role_insufficient_permissions(self, mock_verify):
        """Test failure when user does not have the required role."""
        mock_verify.return_value = {"uid": "user-uid", "roles": ["user"]}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/admin-only", headers={"Authorization": "Bearer user-token"})
            assert response.status_code == status.HTTP_403_FORBIDDEN
            assert "Insufficient permissions" in response.json()["detail"]

    def test_require_role_missing_roles_claim(self, mock_verify):
        """Test failure when user has no roles claim."""
        mock_verify.return_value = {"uid": "user-uid"}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/admin-only", headers={"Authorization": "Bearer user-token"})
            assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_require_role_empty_required_roles(self, mock_verify):
        """Test success when no specific roles are required (any auth user allowed)."""

        # We'll use a dynamic endpoint for this
        @app.get("/any-role")
        async def any_role_route(user: dict = Depends(require_role([]))):
            return {"user": user}

        @app.get("/none-role")
        async def none_role_route(user: dict = Depends(require_role(None))):
            return {"user": user}

        mock_verify.return_value = {"uid": "any-uid"}

        with patch("app.api.middleware.firebase_auth.settings") as mock_settings:
            mock_settings.ENVIRONMENT = "production"
            mock_settings.DISABLE_AUTH = False

            response = client.get("/any-role", headers={"Authorization": "Bearer token"})
            assert response.status_code == status.HTTP_200_OK

            response = client.get("/none-role", headers={"Authorization": "Bearer token"})
            assert response.status_code == status.HTTP_200_OK
