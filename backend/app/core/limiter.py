from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.requests import Request
from starlette.responses import JSONResponse
import firebase_admin
from firebase_admin import auth, credentials

def _rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """
    Custom handler to return a 429 error when a rate limit is exceeded.
    """
    return JSONResponse(
        status_code=429,
        content={"detail": f"Rate limit exceeded: {exc.detail}"}
    )

def key_func_by_user(request: Request) -> str:
    """
    Custom key function for slowapi to use the authenticated user's UID.
    It extracts the token from the Authorization header and verifies it.
    If the token is missing or invalid, it falls back to the remote IP address.
    """
    # Initialize Firebase Admin SDK if not already done, as this runs before app startup logic
    if not firebase_admin._apps:
        try:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
        except Exception:
            # Fallback to IP if Firebase init fails
            return get_remote_address(request)

    auth_header = request.headers.get("authorization")
    
    # The endpoint's own security dependency will handle the final rejection.
    if not auth_header or not auth_header.startswith("Bearer "):
        return get_remote_address(request)

    try:
        token = auth_header.split(" ")[1]
        decoded_token = auth.verify_id_token(token)
        # Return the UID if available, otherwise fallback to IP
        return decoded_token.get("uid") or get_remote_address(request)
    except Exception:
        # If token is invalid/expired, fallback to IP. The endpoint dependency will raise 401.
        return get_remote_address(request)

limiter = Limiter(key_func=key_func_by_user)
