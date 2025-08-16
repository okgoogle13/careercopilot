from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.dependencies import get_current_user
from app.core.db import db

router = APIRouter()


# Pydantic model for the request body
class ThemePreference(BaseModel):
    theme_id: str


@router.put("/theme")
async def save_theme_preference(
    theme_data: ThemePreference,
    uid: str = Depends(get_current_user),
):
    """
    Saves the user's preferred PDF theme to their profile.
    """
    try:
        user_ref = db.collection("users").document(uid)

        # Use set with merge=True to create or update the preferences map
        user_ref.set(
            {"preferences": {"themeId": theme_data.theme_id}}, merge=True
        )

        return {
            "status": "success",
            "message": f"Theme preference set to '{theme_data.theme_id}'.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
