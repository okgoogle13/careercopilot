from fastapi import HTTPException, status
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.requests import Request
from starlette.responses import JSONResponse


def _rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """
    Custom handler to return a 429 error when a rate limit is exceeded.
    """
    return JSONResponse(status_code=429, content={"detail": f"Rate limit exceeded: {exc.detail}"})


def get_user_rate_limit_key(request: Request) -> str:
    """
    Centralized rate limit key function that uses the authenticated user's UID
    when available, otherwise falls back to IP address.

    This function assumes that the get_current_user dependency has been resolved
    and the user information is available in request.state.user_uid.
    If user_uid is not available, it falls back to IP-based limiting.

    This approach eliminates duplicate authentication logic by relying on
    the primary get_current_user dependency to handle token validation.
    """
    # Check if user UID is available in request state (set by authenticated endpoints)
    if hasattr(request.state, "user_uid") and request.state.user_uid:
        return f"user:{request.state.user_uid}"

    # Fall back to IP-based limiting for unauthenticated requests
    return f"ip:{get_remote_address(request)}"


def get_authenticated_user_key(request: Request) -> str:
    """
    Strict rate limit key function that requires an authenticated user's UID.

    This function expects that the get_current_user dependency has been resolved
    and the user information is available in request.state.user_uid.
    If user_uid is not available, it raises an HTTP 401 error.

    This should be used for endpoints that require authentication.
    """
    # Check if user UID is available in request state
    if hasattr(request.state, "user_uid") and request.state.user_uid:
        return f"user:{request.state.user_uid}"

    # If no authenticated user, raise 401 (this shouldn't happen if dependencies are set up correctly)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required for rate limiting",
        headers={"WWW-Authenticate": "Bearer"},
    )


# Create limiter instances with the centralized key functions
limiter = Limiter(key_func=get_user_rate_limit_key)
authenticated_limiter = Limiter(key_func=get_authenticated_user_key)
