import os
import firebase_admin
from app.core.db import db
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth, credentials

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Validates the authentication token and returns the decoded user information.
    This is the primary authentication dependency used by all authenticated endpoints.
    """
    # Development bypass - for testing and development
    if os.getenv("ENV", "development") == "development" and token == "dev-token":
        return {
            "uid": "dev-user-123",
            "email": "developer@example.com",
            "name": "Development User",
        }

    # Fallback auth bypass - for development with frontend fallback auth
    if os.getenv("ENV", "development") == "development" and token.startswith(
        "fallback-token-"
    ):
        return {
            "uid": "dev-user-123",
            "email": "developer@example.com",
            "name": "Development User",
        }

    try:
        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)

        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_with_state(
    request: Request, current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Enhanced authentication dependency that validates the user AND sets
    the user UID in request.state for use by rate limiters.

    This dependency should be used in authenticated endpoints where rate limiting
    is applied, as it enables the rate limiter to use the user UID as the key
    without duplicating authentication logic.
    """
    # Set user UID in request state for rate limiter access
    user_uid = current_user.get("uid")
    if user_uid:
        request.state.user_uid = user_uid

    return current_user


async def get_user_document_from_firestore(
    document_id: str, current_user: dict = Depends(get_current_user)
):
    """
    Fetches a user-owned document from Firestore and handles not-found errors.
    """
    uid = current_user["uid"]
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
