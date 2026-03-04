import os
from unittest.mock import MagicMock, patch

import pytest
from firebase_admin import firestore

from app.core import firebase
from app.core.firebase import (
    get_auth,
    get_firestore,
    get_realtime_db,
    get_storage,
    initialize_firebase,
    verify_id_token,
)


@pytest.fixture(autouse=True)
def reset_firebase_app():
    firebase._firebase_app = None
    yield
    firebase._firebase_app = None


class TestFirebaseExpanded:
    @patch("app.core.firebase.get_firebase_config")
    @patch("app.core.firebase.firebase_admin.initialize_app")
    @patch("app.core.firebase.credentials.Certificate")
    def test_partial_emulator_config(self, mock_cert, mock_init, mock_get_config):
        # Test missing auth_emulator_host but use_emulator is True
        mock_get_config.return_value = {
            "project_id": "test-project",
            "use_emulator": True,
            "auth_emulator_host": None,
            "storage_emulator_host": "localhost:9199",
            "database_emulator_host": None,
            "storage_bucket": None,
            "database_url": None,
        }
        mock_init.return_value = MagicMock()

        with patch.dict(os.environ, {}, clear=True):
            app = initialize_firebase()
            assert app is not None
            assert "FIREBASE_AUTH_EMULATOR_HOST" not in os.environ
            assert os.environ["FIREBASE_STORAGE_EMULATOR_HOST"] == "localhost:9199"
            assert "FIREBASE_DATABASE_EMULATOR_HOST" not in os.environ

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.firestore.client")
    def test_firestore_operations_mocked(self, mock_client, mock_get_app):
        # Set up mock app and client
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        mock_db = MagicMock()
        mock_client.return_value = mock_db

        db = get_firestore()
        assert db == mock_db

        # Test Read
        mock_doc_ref = MagicMock()
        mock_doc_snapshot = MagicMock()
        mock_doc_snapshot.exists = True
        mock_doc_snapshot.to_dict.return_value = {"key": "value"}
        mock_doc_ref.get.return_value = mock_doc_snapshot
        mock_db.collection.return_value.document.return_value = mock_doc_ref

        doc = db.collection("users").document("user1").get()
        assert doc.exists is True
        assert doc.to_dict() == {"key": "value"}

        # Test Write
        db.collection("users").document("user1").set({"new": "data"})
        mock_db.collection.return_value.document.return_value.set.assert_called_once_with(
            {"new": "data"}
        )

        # Test Query
        mock_query = MagicMock()
        mock_query.stream.return_value = [mock_doc_snapshot]
        mock_db.collection.return_value.where.return_value = mock_query

        results = list(db.collection("users").where("age", ">", 20).stream())
        assert len(results) == 1
        assert results[0].to_dict() == {"key": "value"}

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.firestore.client")
    def test_firestore_transaction(self, mock_client, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        mock_db = MagicMock()
        mock_client.return_value = mock_db

        db = get_firestore()

        # Mock transaction
        mock_transaction = MagicMock()
        mock_db.transaction.return_value = mock_transaction

        @firestore.transactional
        def update_in_transaction(transaction, doc_ref):
            transaction.update(doc_ref, {"updated": True})

        mock_doc_ref = MagicMock()
        update_in_transaction(mock_transaction, mock_doc_ref)
        mock_transaction.update.assert_called_once_with(mock_doc_ref, {"updated": True})

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.auth.Client")
    def test_auth_client_initialization(self, mock_client, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        get_auth()
        mock_client.assert_called_once_with(app=mock_app)

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.storage.bucket")
    def test_storage_client_initialization(self, mock_bucket, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        get_storage()
        mock_bucket.assert_called_once_with(app=mock_app)

    @patch("app.core.firebase.get_firebase_app")
    @patch("app.core.firebase.db.reference")
    def test_realtime_db_client_initialization(self, mock_ref, mock_get_app):
        mock_app = MagicMock()
        mock_get_app.return_value = mock_app
        get_realtime_db()
        mock_ref.assert_called_once_with(app=mock_app)
