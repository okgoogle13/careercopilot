"""
Firebase Admin SDK initialization and utilities.

This module provides a centralized way to initialize and access Firebase services
with proper error handling and configuration using Google Cloud Secret Manager.
"""

import logging
import os
from typing import Any

import firebase_admin
from firebase_admin import App, auth, credentials, db, firestore, storage
from firebase_admin.exceptions import FirebaseError

from .secret_manager import get_firebase_config, get_firebase_credentials

logger = logging.getLogger(__name__)

# Global Firebase app instance
_firebase_app = None


def initialize_firebase() -> App | None:
    """Initialize the Firebase Admin SDK with credentials from Secret Manager.

    This function is idempotent and will only initialize Firebase once.

    Returns:
        Optional[App]: Initialized Firebase app instance or None if initialization fails
    """
    global _firebase_app

    if _firebase_app is not None:
        return _firebase_app

    # Get Firebase configuration from secret manager
    firebase_config = get_firebase_config()

    if not firebase_config.get("project_id"):
        environment = os.getenv("ENV", "development").lower()
        log_message = "Firebase project ID not configured. Firebase features will be disabled."
        if environment in {"production", "staging"}:
            logger.warning(log_message)
        else:
            logger.debug(log_message)
        return None

    try:
        # Check if we're running in an emulator environment
        emulator = firebase_config["use_emulator"] or any(
            [
                firebase_config["auth_emulator_host"],
                firebase_config["storage_emulator_host"],
                firebase_config["database_emulator_host"],
            ]
        )

        # Prepare Firebase options
        firebase_options = {
            "projectId": firebase_config["project_id"],
        }

        if firebase_config.get("storage_bucket"):
            firebase_options["storageBucket"] = firebase_config["storage_bucket"]

        if firebase_config.get("database_url"):
            firebase_options["databaseURL"] = firebase_config["database_url"]

        # Initialize with appropriate credentials
        if emulator:
            logger.info("Initializing Firebase Admin SDK with emulator configuration")
            # For emulator, we can use a dummy credential
            cred = credentials.Certificate(
                {
                    "project_id": firebase_config["project_id"],
                    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEAt+Qy8KvF1n1pKvJk\n...",
                    "client_email": 'firebase-adminsdk-{firebase_config["project_id"]}@appspot.gserviceaccount.com',
                }
            )
        else:
            # Try to get credentials from secret manager
            firebase_creds = get_firebase_credentials()
            if firebase_creds:
                logger.info("Initializing Firebase Admin SDK with credentials from Secret Manager")
                cred = credentials.Certificate(firebase_creds)
            else:
                logger.info("Initializing Firebase Admin SDK with default credentials")
                # Will use GOOGLE_APPLICATION_CREDENTIALS or default service account
                cred = None

        # Initialize the Firebase app
        _firebase_app = firebase_admin.initialize_app(
            credential=cred, options=firebase_options, name="careercopilot-backend"
        )

        # Configure emulator hosts if needed
        if emulator:
            if firebase_config["auth_emulator_host"]:
                os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = firebase_config["auth_emulator_host"]
            if firebase_config["storage_emulator_host"]:
                os.environ["FIREBASE_STORAGE_EMULATOR_HOST"] = firebase_config[
                    "storage_emulator_host"
                ]
            if firebase_config["database_emulator_host"]:
                os.environ["FIREBASE_DATABASE_EMULATOR_HOST"] = firebase_config[
                    "database_emulator_host"
                ]

        logger.info(f"Firebase Admin SDK initialized for project: {firebase_config['project_id']}")
        return _firebase_app

    except (ValueError, FirebaseError) as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {e!s}", exc_info=True)
        _firebase_app = None
        return None


def get_firebase_app():
    """Get the initialized Firebase app instance.

    Returns:
        The Firebase app instance or None if initialization failed.
    """
    if _firebase_app is None:
        initialize_firebase()
    return _firebase_app


def get_auth():
    """Get the Firebase Auth client."""
    if get_firebase_app() is None:
        return None
    return auth.Client(app=get_firebase_app())


def get_firestore():
    """Get the Firestore client."""
    if get_firebase_app() is None:
        return None
    return firestore.client(app=get_firebase_app())


def get_storage():
    """Get the Firebase Storage client."""
    if get_firebase_app() is None:
        return None
    return storage.bucket(app=get_firebase_app())


def get_realtime_db():
    """Get the Firebase Realtime Database client."""
    if get_firebase_app() is None:
        return None
    return db.reference(app=get_firebase_app())


def verify_id_token(id_token: str) -> dict[str, Any] | None:
    """Verify a Firebase ID token.

    Args:
        id_token: The Firebase ID token to verify.

    Returns:
        The decoded token if valid, None otherwise.
    """
    if not id_token:
        return None

    try:
        auth_client = get_auth()
        if auth_client is None:
            logger.error("Firebase Auth client not initialized")
            return None

        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token, app=get_firebase_app())
        return decoded_token

    except (ValueError, FirebaseError) as e:
        logger.warning(f"Failed to verify ID token: {e!s}")
        return None
