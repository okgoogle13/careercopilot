from fastapi import APIRouter, Depends, HTTPException, Request, Header, status
from starlette.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from app.core.dependencies import get_current_user
from app.core.db import db
from app.core.secrets import save_user_secret, delete_user_secret
from app.genkit_flows.email_scanner import scan_user_emails
import os
import asyncio

router = APIRouter()

# --- Configuration ---
CLIENT_SECRETS_FILE = os.getenv("GOOGLE_CLIENT_SECRETS_FILE", "client_secrets.json")
# Add the calendar.events scope to enable creating calendar entries
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/calendar.events'
]
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/integrations/google/callback")
# A simple secret key for protecting the scheduler endpoint. In production, use a more secure validation method.
SCHEDULER_SECRET = os.getenv("SCHEDULER_SECRET")
# ... (rest of the file remains the same)
