"""
dependencies.py (Refactore)

FastAPI dependencies for authentication, authorization, and data access.
"""

import os

import firebase_admin
from app.core.db import db  # Assuming your Firestore client is here
from app.models import User  # Import the new User model
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth

# Standard OAuth2 scheme pointing to a conceptual token URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Validates the Firebase JWT token and returns the authenticated user model.
    This is the primary authentication dependency for all protected endpoints.

    Raises:
        HTTPException(401): If the token is invalid, expired, or not provided.
    """
    # RETAINED: Development bypass for easy local testing
    if os.getenv("ENV", "development") == "development" and token in [
        "dev-token",
        "fallback-token-dev",
    ]:
        return User(
            uid="dev-user-123", email="developer@example.com", name="Development User"
        )

    # CRITICAL FIX: Ensure Firebase app is initialized before verifying tokens.
    # This check now assumes initialization happens at startup.
    if not firebase_admin._apps:
        raise HTTPException(
            status_code=500,
            detail="Firebase is not initialized on the server. Authentication is unavailable.",
        )

    # CRITICAL FIX: Correctly handle authentication errors.
    # Any exception here means the token is invalid and the user is unauthorized.
    try:
        decoded_token = auth.verify_id_token(token)
        return User(
            uid=decoded_token.get("uid"),
            email=decoded_token.get("email"),
            name=decoded_token.get("name"),
        )
    except Exception as e:
        # Instead of returning a fake user, we raise a 401 Unauthorized error.
        # This is the secure and standard way to handle failed authentication.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_with_state(
    request: Request, current_user: User = Depends(get_current_user)
) -> User:
    """
    RETAINED & IMPROVED: Enhanced dependency that validates the user AND sets
    the user UID in request.state for use by other dependencies like rate limiters.
    """
    request.state.user_uid = current_user.uid
    return current_user


async def get_user_document_from_firestore(
    document_id: str, current_user: User = Depends(get_current_user)
) -> dict:
    """
    RETAINED & IMPROVED: Fetches a user-owned document from Firestore and handles
    not-found errors, now using the Pydantic User model for type safety.
    """
    uid = current_user.uid
    doc_ref = (
        db.collection("users")
        .document(uid)
        .collection("documents")
        .document(document_id)
    )
    doc = await doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc.to_dict()
