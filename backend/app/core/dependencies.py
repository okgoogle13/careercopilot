"""
FastAPI Dependencies.

This module provides a set of reusable FastAPI dependencies for handling
common concerns such as authentication, authorization, and data access
in a structured and secure way.
"""
import os

import firebase_admin
from app.core.db import db
from app.models import User
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Validates a Firebase JWT and returns the corresponding User model.

    This is the primary authentication dependency for all protected endpoints.
    It extracts the token from the Authorization header, verifies it with
    Firebase Auth, and constructs a Pydantic `User` model. It also includes a
    bypass for development environments to facilitate testing without a live token.

    Args:
        token: The OAuth2 bearer token extracted from the request header.

    Returns:
        A `User` object representing the authenticated user.

    Raises:
        HTTPException(500): If the Firebase Admin SDK is not initialized.
        HTTPException(401): If the token is invalid, expired, malformed, or
                            not provided.
    """
    if os.getenv("ENV", "development") == "development" and token in [
        "dev-token",
        "fallback-token-dev",
    ]:
        return User(
            uid="dev-user-123", email="developer@example.com", name="Development User"
        )

    if not firebase_admin._apps:
        raise HTTPException(
            status_code=500,
            detail="Firebase is not initialized on the server. Authentication is unavailable.",
        )

    try:
        decoded_token = auth.verify_id_token(token)
        return User(
            uid=decoded_token.get("uid"),
            email=decoded_token.get("email"),
            name=decoded_token.get("name"),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_with_state(
    request: Request, current_user: User = Depends(get_current_user)
) -> User:
    """
    Injects the current user's UID into the request state.

    This dependency builds upon `get_current_user` by making the user's UID
    available in `request.state.user_uid`. This is useful for other
    dependencies or middleware (like rate limiters) that need access to a
    unique user identifier without re-validating the token.

    Args:
        request: The incoming FastAPI `Request` object.
        current_user: The authenticated `User` object, provided by the
                      `get_current_user` dependency.

    Returns:
        The `User` object for the authenticated user.
    """
    request.state.user_uid = current_user.uid
    return current_user


async def get_user_document_from_firestore(
    document_id: str, current_user: User = Depends(get_current_user)
) -> dict:
    """
    Fetches a specific document from Firestore owned by the current user.

    This dependency ensures data isolation by fetching a document from a
    sub-collection scoped to the authenticated user's UID. It acts as an
    authorization layer, preventing one user from accessing another's data.

    Args:
        document_id: The ID of the Firestore document to retrieve.
        current_user: The authenticated `User` object, provided by the
                      `get_current_user` dependency.

    Returns:
        The document's data as a dictionary.

    Raises:
        HTTPException(404): If the document with the specified ID does not
                            exist for the current user.
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
