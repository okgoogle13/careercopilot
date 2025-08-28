import os

from app.core.security import verify_google_oidc_token

# from app.genkit_flows.email_scanner import scan_user_emails  # Temporarily disabled for deployment
from app.core.limiter import authenticated_limiter
from fastapi import APIRouter, Depends, HTTPException, Query, Request

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


async def set_user_id_in_state(request: Request, user_id: str = Query(...)):
    """Set user_id in request state for rate limiting"""
    request.state.user_uid = user_id
    return user_id

@router.post("/scan-emails")
@authenticated_limiter.limit("5/minute")
async def trigger_scan(
    request: Request, 
    user_id: str = Depends(set_user_id_in_state),
    _: dict = Depends(verify_google_oidc_token)
):
    """
    Triggers an email scan for a specific user, protected by OIDC authentication.
    This endpoint is intended to be called by a trusted scheduler (e.g., Google Cloud Scheduler).
    The user_id of the user to scan must be provided as a query parameter.
    """
    # The 'verify_google_oidc_token' dependency already handled authentication.
    # We can now proceed with the business logic.

    # Note: The original endpoint used get_current_user, which implies the user initiated the scan.
    # A scheduled task needs to know *which* user to scan.
    # We've changed this to accept a `user_id` query parameter.
    # The scheduler will need to be configured to call this endpoint for each user.
    # For example: POST /scan-emails?user_id=some_user_id_123

    # asyncio.create_task(scan_user_emails(user_id))  # Temporarily disabled for deployment
    raise HTTPException(
        status_code=503, detail="AI features temporarily unavailable during deployment"
    )
    # return {"message": "Email scan triggered successfully"}


# ... (rest of the file remains the same, including OAuth endpoints)
