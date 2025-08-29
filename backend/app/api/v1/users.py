import os
from app.core.db import db
from app.core.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth
from google.cloud.firestore import SERVER_TIMESTAMP
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class UserSettings(BaseModel):
    theme: Optional[str] = "light"
    notifications: Optional[bool] = True
    email_notifications: Optional[bool] = True
    privacy_level: Optional[str] = "standard"
    language: Optional[str] = "en"
    timezone: Optional[str] = "UTC"


class UpdateUserSettingsRequest(BaseModel):
    theme: Optional[str] = None
    notifications: Optional[bool] = None
    email_notifications: Optional[bool] = None
    privacy_level: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None


@router.post("/me")
async def create_user_profile(uid: str = Depends(get_current_user)):
    """
    Creates a user profile in Firestore after they have been created in Firebase Auth.
    """
    try:
        # Check if user profile already exists
        user_ref = db.collection("users").document(uid)
        doc = await user_ref.get()
        if doc.exists:
            raise HTTPException(status_code=409, detail="User profile already exists")

        # Get user data from Firebase Auth
        user_record = auth.get_user(uid)
        email = user_record.email

        # Create the user profile document
        profile_data = {"email": email, "createdAt": SERVER_TIMESTAMP}
        await user_ref.set(profile_data)

        # Retrieve the created document to return it
        created_profile = await user_ref.get()
        return created_profile.to_dict()

    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found in Firebase Auth")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/settings")
async def get_user_settings(uid: str = Depends(get_current_user)) -> UserSettings:
    """Get user settings"""
    try:
        # For development, return mock settings
        # In production, this would fetch from Firestore
        if os.getenv("ENV", "development") == "development":
            return UserSettings(
                theme="light",
                notifications=True,
                email_notifications=True,
                privacy_level="standard",
                language="en",
                timezone="UTC",
            )

        user_ref = db.collection("users").document(uid)
        doc = user_ref.get()  # Remove await for sync Firestore

        if not doc.exists:
            return UserSettings()

        user_data = doc.to_dict()
        settings_data = user_data.get("settings", {})

        return UserSettings(
            theme=settings_data.get("theme", "light"),
            notifications=settings_data.get("notifications", True),
            email_notifications=settings_data.get("email_notifications", True),
            privacy_level=settings_data.get("privacy_level", "standard"),
            language=settings_data.get("language", "en"),
            timezone=settings_data.get("timezone", "UTC"),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings")
async def update_user_settings(
    settings_update: UpdateUserSettingsRequest, uid: str = Depends(get_current_user)
) -> UserSettings:
    """Update user settings"""
    try:
        # For development, just return the updated settings without persisting
        if os.getenv("ENV", "development") == "development":
            # Create updated settings based on the request
            current_settings = UserSettings()
            return UserSettings(
                theme=(
                    settings_update.theme
                    if settings_update.theme is not None
                    else current_settings.theme
                ),
                notifications=(
                    settings_update.notifications
                    if settings_update.notifications is not None
                    else current_settings.notifications
                ),
                email_notifications=(
                    settings_update.email_notifications
                    if settings_update.email_notifications is not None
                    else current_settings.email_notifications
                ),
                privacy_level=(
                    settings_update.privacy_level
                    if settings_update.privacy_level is not None
                    else current_settings.privacy_level
                ),
                language=(
                    settings_update.language
                    if settings_update.language is not None
                    else current_settings.language
                ),
                timezone=(
                    settings_update.timezone
                    if settings_update.timezone is not None
                    else current_settings.timezone
                ),
            )

        user_ref = db.collection("users").document(uid)

        # Build update data - only include non-None values
        update_data = {}
        if settings_update.theme is not None:
            update_data["settings.theme"] = settings_update.theme
        if settings_update.notifications is not None:
            update_data["settings.notifications"] = settings_update.notifications
        if settings_update.email_notifications is not None:
            update_data["settings.email_notifications"] = settings_update.email_notifications
        if settings_update.privacy_level is not None:
            update_data["settings.privacy_level"] = settings_update.privacy_level
        if settings_update.language is not None:
            update_data["settings.language"] = settings_update.language
        if settings_update.timezone is not None:
            update_data["settings.timezone"] = settings_update.timezone

        if update_data:
            user_ref.update(update_data)  # Remove await for sync Firestore

        # Return updated settings
        return await get_user_settings(uid)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
