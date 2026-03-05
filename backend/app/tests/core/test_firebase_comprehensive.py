"""
Comprehensive tests for Firebase Core integration.
"""

import os
from unittest.mock import MagicMock, patch

import pytest
from firebase_admin import App

from app.core.firebase import (
    get_auth,
    get_firebase_app,
    get_firestore,
    get_realtime_db,
    get_storage,
    initialize_firebase,
    verify_id_token,
)


class TestFirebaseCoreComprehensive:
    """Tests for Firebase Admin SDK integration."""

    @pytest.fixture(autouse=True)
    def reset_state(self):
        """Reset the global _firebase_app instance before each test."""
        with patch("app.core.firebase._firebase_app", None):
            # Clear emulator env vars to avoid pollution
            env_vars = [
                "FIREBASE_AUTH_EMULATOR_HOST",
                "FIREBASE_STORAGE_EMULATOR_HOST",
                "FIREBASE_DATABASE_EMULATOR_HOST",
            ]
            original_values = {var: os.environ.get(var) for var in env_vars}
            for var in env_vars:
                if var in os.environ:
                    del os.environ[var]

            yield

            # Restore
            for var, val in original_values.items():
                if val:
                    os.environ[var] = val
                elif var in os.environ:
                    del os.environ[var]

    def test_initialize_firebase_success(self):
        """Test successful initialization of Firebase."""
        with patch("app.core.firebase.get_firebase_config") as mock_config:
            mock_config.return_value = {
                "project_id": "test-project",
                "use_emulator": False,
                "storage_bucket": "test-bucket",
                "database_url": None,
                "auth_emulator_host": None,
                "storage_emulator_host": None,
                "database_emulator_host": None,
            }
            with patch("app.core.firebase.get_firebase_credentials") as mock_creds:
                mock_creds.return_value = {"type": "service_account", "project_id": "test-project"}
                with patch("firebase_admin.credentials.Certificate") as mock_cert:
                    mock_cert.return_value = MagicMock()
                    with patch("firebase_admin.initialize_app") as mock_init:
                        mock_init.return_value = MagicMock(spec=App)

                        app = initialize_firebase()
                        assert app is not None
                        mock_init.assert_called_once()

    def test_initialize_firebase_disabled(self):
        """Test initialization when project_id is missing (features disabled)."""
        with patch("app.core.firebase.get_firebase_config") as mock_config:
            mock_config.return_value = {"project_id": None}

            app = initialize_firebase()
            assert app is None

    def test_initialize_firebase_emulator(self):
        """Test initialization in emulator mode."""
        with patch("app.core.firebase.get_firebase_config") as mock_config:
            mock_config.return_value = {
                "project_id": "test-project",
                "use_emulator": True,
                "storage_bucket": "test-bucket",
                "database_url": "test-db-url",
                "auth_emulator_host": "localhost:9099",
                "storage_emulator_host": "localhost:9199",
                "database_emulator_host": "localhost:9000",
            }
            with patch("firebase_admin.credentials.Certificate") as mock_cert:
                with patch("firebase_admin.initialize_app") as mock_init:
                    app = initialize_firebase()
                    assert os.environ.get("FIREBASE_AUTH_EMULATOR_HOST") == "localhost:9099"
                    assert os.environ.get("FIREBASE_STORAGE_EMULATOR_HOST") == "localhost:9199"
                    assert os.environ.get("FIREBASE_DATABASE_EMULATOR_HOST") == "localhost:9000"

    def test_initialize_firebase_error(self):
        """Test initialization failure when an exception occurs."""
        with patch("app.core.firebase.get_firebase_config") as mock_config:
            mock_config.return_value = {
                "project_id": "test-project",
                "use_emulator": False,
                "auth_emulator_host": None,
                "storage_emulator_host": None,
                "database_emulator_host": None,
            }
            with patch(
                "app.core.firebase.get_firebase_credentials",
                side_effect=ValueError("Invalid Creds"),
            ):
                app = initialize_firebase()
                assert app is None

    def test_get_firebase_app_init(self):
        """Test getting the global app instance when not initialized."""
        mock_app = MagicMock(spec=App)
        with patch(
            "app.core.firebase.initialize_firebase",
            side_effect=lambda: setattr(app.core.firebase, "_firebase_app", mock_app),
        ):
            # We need to be careful with global state in tests
            import app.core.firebase

            app.core.firebase._firebase_app = None  # Ensure it starts as None

            result = get_firebase_app()
            assert result is mock_app

    def test_get_firebase_app_memoized(self):
        """Test get_firebase_app returns already initialized app."""
        mock_app = MagicMock(spec=App)
        import app.core.firebase

        with patch.object(app.core.firebase, "_firebase_app", mock_app):
            with patch("app.core.firebase.initialize_firebase") as mock_init:
                result = get_firebase_app()
                assert result is mock_app
                mock_init.assert_not_called()

    def test_initialize_firebase_default_creds(self):
        """Test initialization with default credentials."""
        with patch("app.core.firebase.get_firebase_config") as mock_config:
            mock_config.return_value = {
                "project_id": "test-project",
                "use_emulator": False,
                "auth_emulator_host": None,
                "storage_emulator_host": None,
                "database_emulator_host": None,
            }
            with patch("app.core.firebase.get_firebase_credentials") as mock_creds:
                mock_creds.return_value = None
                with patch("firebase_admin.initialize_app") as mock_init:
                    initialize_firebase()
                    args, kwargs = mock_init.call_args
                    assert kwargs["credential"] is None

    def test_get_auth(self):
        """Test getting Auth client."""
        with patch("app.core.firebase.get_firebase_app") as mock_get_app:
            mock_app = MagicMock(spec=App)
            mock_get_app.return_value = mock_app
            with patch("firebase_admin.auth.Client") as mock_client:
                get_auth()
                mock_client.assert_called_once_with(app=mock_app)

    def test_get_firestore(self):
        """Test getting Firestore client."""
        with patch("app.core.firebase.get_firebase_app") as mock_get_app:
            mock_app = MagicMock(spec=App)
            mock_get_app.return_value = mock_app
            with patch("firebase_admin.firestore.client") as mock_client:
                get_firestore()
                mock_client.assert_called_once_with(app=mock_app)

    def test_get_storage(self):
        """Test getting Storage client."""
        with patch("app.core.firebase.get_firebase_app") as mock_get_app:
            mock_app = MagicMock(spec=App)
            mock_get_app.return_value = mock_app
            with patch("firebase_admin.storage.bucket") as mock_bucket:
                get_storage()
                mock_bucket.assert_called_once_with(app=mock_app)

    def test_get_realtime_db(self):
        """Test getting Realtime Database client."""
        with patch("app.core.firebase.get_firebase_app") as mock_get_app:
            mock_app = MagicMock(spec=App)
            mock_get_app.return_value = mock_app
            with patch("firebase_admin.db.reference") as mock_ref:
                get_realtime_db()
                mock_ref.assert_called_once_with(app=mock_app)

    def test_verify_id_token_success(self):
        """Test successful token verification."""
        with patch("app.core.firebase.get_auth") as mock_get_auth:
            mock_get_auth.return_value = MagicMock()
            with patch("app.core.firebase.get_firebase_app") as mock_get_app:
                mock_get_app.return_value = MagicMock(spec=App)
                with patch("firebase_admin.auth.verify_id_token") as mock_verify:
                    mock_verify.return_value = {"uid": "user-1"}

                    result = verify_id_token("token-123")
                    assert result["uid"] == "user-1"

    def test_verify_id_token_missing_token(self):
        """Test verification with None token."""
        assert verify_id_token(None) is None

    def test_verify_id_token_no_auth_client(self):
        """Test verification when auth client fails to initialize."""
        with patch("app.core.firebase.get_auth") as mock_get_auth:
            mock_get_auth.return_value = None
            assert verify_id_token("token") is None

    def test_verify_id_token_failure(self):
        """Test verification failure (e.g. invalid token)."""
        with patch("app.core.firebase.get_auth") as mock_get_auth:
            mock_get_auth.return_value = MagicMock()
            with patch("app.core.firebase.get_firebase_app") as mock_get_app:
                mock_get_app.return_value = MagicMock(spec=App)
                with patch("firebase_admin.auth.verify_id_token") as mock_verify:
                    mock_verify.side_effect = ValueError("Invalid")
                    assert verify_id_token("bad-token") is None
