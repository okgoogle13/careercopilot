import os
from unittest.mock import MagicMock, patch

import pytest

from app.core import firebase
from app.core.firebase import (
    get_auth,
    get_firebase_app,
    get_firestore,
    get_realtime_db,
    get_storage,
    initialize_firebase,
    verify_id_token,
)


@pytest.fixture(autouse=True)
def reset_firebase_app():
    # Reset the global variable before and after each test
    firebase._firebase_app = None
    yield
    firebase._firebase_app = None


class TestInitializeFirebase:
    @patch("app.core.firebase.get_firebase_config")
    def test_missing_project_id(self, mock_get_config):
        mock_get_config.return_value = {}
        app = initialize_firebase()
        assert app is None

    @patch.dict(os.environ, {}, clear=True)
    @patch("app.core.firebase.credentials.Certificate")
    @patch("app.core.firebase.get_firebase_config")
    @patch("app.core.firebase.firebase_admin.initialize_app")
    def test_emulator_initialization(self, mock_init, mock_get_config, mock_cert):
        mock_get_config.return_value = {
            "project_id": "test-project",
            "use_emulator": True,
            "auth_emulator_host": "localhost:9099",
            "storage_emulator_host": "localhost:9199",
            "database_emulator_host": "localhost:9000",
            "storage_bucket": "test-bucket",
            "database_url": "test-url",
        }
        mock_app = MagicMock()
        mock_init.return_value = mock_app
        mock_cred = MagicMock()
        mock_cert.return_value = mock_cred

        app = initialize_firebase()

        assert app == mock_app
        mock_init.assert_called_once()
        kwargs = mock_init.call_args.kwargs
        assert kwargs["credential"] == mock_cred
        assert kwargs["options"]["projectId"] == "test-project"
        assert kwargs["options"]["storageBucket"] == "test-bucket"
        assert kwargs["options"]["databaseURL"] == "test-url"

        # Verify emulator hosts were set in environ
        assert os.environ["FIREBASE_AUTH_EMULATOR_HOST"] == "localhost:9099"
        assert os.environ["FIREBASE_STORAGE_EMULATOR_HOST"] == "localhost:9199"
        assert os.environ["FIREBASE_DATABASE_EMULATOR_HOST"] == "localhost:9000"

    @patch("app.core.firebase.credentials.Certificate")
    @patch("app.core.firebase.get_firebase_credentials")
    @patch("app.core.firebase.get_firebase_config")
    @patch("app.core.firebase.firebase_admin.initialize_app")
    def test_secret_manager_credentials(
        self, mock_init, mock_get_config, mock_get_creds, mock_cert
    ):
        mock_get_config.return_value = {
            "project_id": "test-project",
            "use_emulator": False,
            "auth_emulator_host": None,
            "storage_emulator_host": None,
            "database_emulator_host": None,
        }
        mock_get_creds.return_value = {
            "type": "service_account",
            "client_email": "x",
            "token_uri": "x",
        }
        mock_app = MagicMock()
        mock_init.return_value = mock_app
        mock_cred = MagicMock()
        mock_cert.return_value = mock_cred

        app = initialize_firebase()

        assert app == mock_app
        mock_get_creds.assert_called_once()
        mock_init.assert_called_once()
        mock_cert.assert_called_once_with(mock_get_creds.return_value)

    @patch("app.core.firebase.get_firebase_credentials")
    @patch("app.core.firebase.get_firebase_config")
    @patch("app.core.firebase.firebase_admin.initialize_app")
    def test_default_credentials(self, mock_init, mock_get_config, mock_get_creds):
        mock_get_config.return_value = {
            "project_id": "test-project",
            "use_emulator": False,
            "auth_emulator_host": None,
            "storage_emulator_host": None,
            "database_emulator_host": None,
        }
        mock_get_creds.return_value = None
        mock_app = MagicMock()
        mock_init.return_value = mock_app

        app = initialize_firebase()

        assert app == mock_app
        mock_init.assert_called_once()
        kwargs = mock_init.call_args.kwargs
        assert kwargs.get("credential") is None

    @patch("app.core.firebase.get_firebase_config")
    @patch("app.core.firebase.firebase_admin.initialize_app")
    def test_initialization_exception(self, mock_init, mock_get_config):
        mock_get_config.return_value = {
            "project_id": "test-project",
            "use_emulator": True,
            "auth_emulator_host": None,
            "storage_emulator_host": None,
            "database_emulator_host": None,
        }
        mock_init.side_effect = ValueError("Invalid config")

        app = initialize_firebase()
        assert app is None

    def test_already_initialized(self):
        mock_app = MagicMock()
        firebase._firebase_app = mock_app
        assert initialize_firebase() == mock_app


class TestGetClients:
    @patch("app.core.firebase.initialize_firebase")
    def test_get_firebase_app(self, mock_init):
        mock_app = MagicMock()
        # Set the global var instead of relying on initialize_firebase return
        firebase._firebase_app = mock_app
        assert get_firebase_app() == mock_app

    @patch("app.core.firebase.initialize_firebase")
    def test_get_firebase_app_calls_init(self, mock_init):
        # Should call initialize_firebase when _firebase_app is None
        get_firebase_app()
        mock_init.assert_called_once()

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.auth.Client")
    def test_get_auth(self, mock_client, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        mock_auth = MagicMock()
        mock_client.return_value = mock_auth

        assert get_auth() == mock_auth
        mock_client.assert_called_once_with(app=mock_app)

    @patch("app.core.firebase.get_firebase_app")
    def test_get_auth_no_app(self, mock_get_app):
        mock_get_app.return_value = None
        assert get_auth() is None

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.firestore.client")
    def test_get_firestore(self, mock_client, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        mock_db = MagicMock()
        mock_client.return_value = mock_db

        assert get_firestore() == mock_db

    @patch("app.core.firebase.get_firebase_app")
    def test_get_firestore_no_app(self, mock_get_app):
        mock_get_app.return_value = None
        assert get_firestore() is None

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.storage.bucket")
    def test_get_storage(self, mock_bucket, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        mock_store = MagicMock()
        mock_bucket.return_value = mock_store

        assert get_storage() == mock_store

    @patch("app.core.firebase.get_firebase_app")
    def test_get_storage_no_app(self, mock_get_app):
        mock_get_app.return_value = None
        assert get_storage() is None

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.db.reference")
    def test_get_realtime_db(self, mock_ref, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        mock_db = MagicMock()
        mock_ref.return_value = mock_db

        assert get_realtime_db() == mock_db

    @patch("app.core.firebase.get_firebase_app")
    def test_get_realtime_db_no_app(self, mock_get_app):
        mock_get_app.return_value = None
        assert get_realtime_db() is None


class TestVerifyIdToken:
    def test_verify_empty_token(self):
        assert verify_id_token("") is None
        assert verify_id_token(None) is None

    @patch("app.core.firebase.get_auth")
    def test_verify_no_auth_client(self, mock_get_auth):
        mock_get_auth.return_value = None
        assert verify_id_token("token") is None

    @patch("app.core.firebase.get_auth")
    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.auth.verify_id_token")
    def test_verify_success(self, mock_verify, mock_get_app, mock_get_auth):
        mock_get_auth.return_value = MagicMock()
        mock_get_app.return_value = MagicMock()
        mock_verify.return_value = {"uid": "123"}

        assert verify_id_token("valid_token") == {"uid": "123"}
        mock_verify.assert_called_once_with("valid_token", app=mock_get_app.return_value)

    @patch("app.core.firebase.get_auth")
    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.auth.verify_id_token")
    def test_verify_exception(self, mock_verify, mock_get_app, mock_get_auth):
        mock_get_auth.return_value = MagicMock()
        mock_get_app.return_value = MagicMock()
        mock_verify.side_effect = ValueError("Invalid token")

        assert verify_id_token("invalid_token") is None
