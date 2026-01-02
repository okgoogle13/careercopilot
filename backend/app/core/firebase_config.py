"""
backend/app/core/firebase_config.py
------------------------------------
Firebase Admin SDK configuration with singleton pattern.
Provides centralized Firestore client initialization with fallback handling.
"""
import os
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Optional

logger = logging.getLogger(__name__)

# Singleton instance
_db: Optional[firestore.Client] = None
_initialized = False


def get_firestore_client() -> Optional[firestore.Client]:
    """
    Get or initialize the Firestore client using singleton pattern.
    
    Returns:
        firestore.Client: Firestore client instance, or None if initialization fails
        
    Note:
        - Looks for firebase_credentials.json in project root
        - Returns None if credentials not found (graceful degradation)
        - Reuses existing connection if already initialized
    """
    global _db, _initialized
    
    # Return cached instance if already initialized
    if _initialized:
        return _db
    
    # Mark as initialized to prevent retry loops
    _initialized = True
    
    # Check for credentials file
    cred_path = "firebase_credentials.json"
    
    if not os.path.exists(cred_path):
        logger.warning(
            "[Firestore] No firebase_credentials.json found in project root. "
            "Persistence will use fallback mode. "
            "Add firebase_credentials.json for production deployment."
        )
        return None
    
    try:
        # Initialize Firebase Admin SDK if not already initialized
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            logger.info("[Firestore] Firebase Admin SDK initialized successfully")
        
        # Get Firestore client
        _db = firestore.client()
        logger.info("[Firestore] Firestore client connected and ready")
        return _db
        
    except Exception as e:
        logger.error(f"[Firestore] Initialization failed: {e}", exc_info=True)
        logger.warning("[Firestore] Falling back to in-memory storage")
        return None


def reset_firestore_client():
    """
    Reset the singleton instance (useful for testing).
    
    Warning: This should only be used in tests or during shutdown.
    """
    global _db, _initialized
    _db = None
    _initialized = False
    logger.info("[Firestore] Client reset")


def check_firestore_connection() -> dict:
    """
    Check Firestore connection status and return health information.
    
    Returns:
        dict: Connection status with metadata
    """
    try:
        db = get_firestore_client()
        if db is None:
            return {
                "status": "degraded",
                "mode": "in-memory fallback",
                "message": "Firestore not configured, using in-memory storage"
            }
        
        # Try a simple query to verify connection
        # This doesn't create any data, just tests connectivity
        db.collection("_health_check").limit(1).get()
        
        return {
            "status": "healthy",
            "mode": "firestore",
            "message": "Firestore connected successfully"
        }
        
    except Exception as e:
        logger.error(f"[Firestore] Health check failed: {e}")
        return {
            "status": "unhealthy",
            "mode": "unknown",
            "message": f"Connection error: {str(e)}"
        }
