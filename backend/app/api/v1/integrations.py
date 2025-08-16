from fastapi import APIRouter, Depends, HTTPException, Request, Header, status
from starlette.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from app.core.dependencies import get_current_user
from app.core.db import db
from app.core.secrets import save_user_secret, delete_user_secret
from app.genkit_flows.email_scanner import scan_user_emails
from app.core.limiter import strict_limiter
import os
import asyncio

router = APIRouter()

# --- Configuration ---
CLIENT_SECRETS_FILE = os.getenv("GOOGLE_CLIENT_SECRETS_FILE", "client_secrets.json")
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.events",
]
REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/integrations/google/callback"
)
SCHEDULER_SECRET = os.getenv("SCHEDULER_SECRET")


@router.post("/scan-emails")
@strict_limiter.limit("5/minute")
async def trigger_scan(
    request: Request,
    user: dict = Depends(get_current_user),
    x_scheduler_secret: str = Header(None),
):
    """
    Triggers an email scan for the authenticated user.
    This endpoint is protected by a strict rate limiter.
    """
    if os.getenv("ENVIRONMENT") == "production":
        if not x_scheduler_secret or x_scheduler_secret != SCHEDULER_SECRET:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid scheduler secret",
            )

    asyncio.create_task(scan_user_emails(user["uid"]))
    return {"message": "Email scan triggered successfully"}


# ... (rest of the file remains the same, including OAuth endpoints)
