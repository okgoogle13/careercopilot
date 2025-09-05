#!/usr/bin/env python3
"""
Test script to verify Firebase secrets and initialization.
"""
import json
import logging
import sys
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

def test_secret_retrieval() -> Dict[str, Any]:
    """Test retrieving Firebase configuration from secret manager."""
    try:
        # Import the secret manager functions
        from app.core.secret_manager import (
            get_firebase_credentials,
            get_firebase_config
        )

        logger.info("Testing Firebase configuration retrieval...")

        # Get Firebase configuration
        config = get_firebase_config()
        logger.info("Successfully retrieved Firebase configuration:")
        for key, value in config.items():
            if key == 'use_emulator':
                value = 'true' if value else 'false'
            logger.info(f"  {key}: {value}")

        # Test getting credentials
        logger.info("\nTesting Firebase credentials retrieval...")
        creds = get_firebase_credentials()
        if creds:
            logger.info("Successfully retrieved Firebase credentials")
            logger.info(f"  Project ID: {creds.get('project_id')}")
            logger.info(f"  Client Email: {creds.get('client_email')}")
        else:
            logger.warning("No Firebase credentials found. This is only expected if using emulator.")

        return {"status": "success", "config": config, "has_creds": bool(creds)}

    except Exception as e:
        logger.error(f"Error testing secret retrieval: {str(e)}", exc_info=True)
        return {"status": "error", "error": str(e)}

def test_firebase_init() -> Dict[str, Any]:
    """Test initializing Firebase with the retrieved configuration."""
    try:
        from app.core.firebase import initialize_firebase, get_firebase_app

        logger.info("\nTesting Firebase initialization...")

        # Initialize Firebase
        app = initialize_firebase()
        if not app:
            return {"status": "error", "error": "Failed to initialize Firebase"}

        logger.info("Successfully initialized Firebase!")
        logger.info(f"  Project ID: {app.project_id}")

        # Test Firestore access
        try:
            import firebase_admin
            from firebase_admin import firestore
            db = firestore.client(app)
            logger.info("Successfully connected to Firestore")
        except Exception as e:
            logger.warning(f"Firestore connection test failed: {str(e)}")

        return {"status": "success", "project_id": app.project_id}

    except Exception as e:
        logger.error(f"Error initializing Firebase: {str(e)}", exc_info=True)
        return {"status": "error", "error": str(e)}

if __name__ == "__main__":
    # Add the project root to Python path
    import sys
    from pathlib import Path
    project_root = str(Path(__file__).parent.parent)
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    print("=" * 80)
    print("Firebase Secrets and Initialization Test")
    print("=" * 80)

    # Test secret retrieval
    secret_result = test_secret_retrieval()

    # Only test Firebase init if secrets were retrieved successfully
    if secret_result["status"] == "success":
        init_result = test_firebase_init()
    else:
        logger.error("Skipping Firebase initialization due to previous errors")
        init_result = {"status": "skipped", "reason": "Secret retrieval failed"}

    # Print summary
    print("\n" + "=" * 80)
    print("Test Summary:")
    print(f"- Secrets: {secret_result['status'].upper()}")
    if secret_result["status"] == "error":
        print(f"  Error: {secret_result.get('error')}")

    print(f"- Firebase Initialization: {init_result['status'].upper()}")
    if init_result["status"] == "error":
        print(f"  Error: {init_result.get('error')}")
    elif init_result["status"] == "success":
        print(f"  Project ID: {init_result.get('project_id')}")

    # Exit with appropriate status code
    if secret_result["status"] == "error" or init_result.get("status") == "error":
        sys.exit(1)
    else:
        sys.exit(0)
