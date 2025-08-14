from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_user
from app.core.db import db
from firebase_admin import auth
from google.cloud.firestore import SERVER_TIMESTAMP

router = APIRouter()

@router.post("/me")
async def create_user_profile(uid: str = Depends(get_current_user)):
    """
    Creates a user profile in Firestore after they have been created in Firebase Auth.
    """
    try:
        # Check if user profile already exists
        user_ref = db.collection("users").document(uid)
        if user_ref.get().exists:
            raise HTTPException(
                status_code=409,
                detail="User profile already exists"
            )

        # Get user data from Firebase Auth
        user_record = auth.get_user(uid)
        email = user_record.email

        # Create the user profile document
        profile_data = {
            "email": email,
            "createdAt": SERVER_TIMESTAMP
        }
        user_ref.set(profile_data)

        # Retrieve the created document to return it
        created_profile = user_ref.get()
        return created_profile.to_dict()

    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found in Firebase Auth")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
