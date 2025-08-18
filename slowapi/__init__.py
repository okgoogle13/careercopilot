"""Minimal slowapi shim for tests (not full-featured).
Provides Limiter, util.get_remote_address, and errors.RateLimitExceeded used by the app.
"""
from typing import Callable

class RateLimitExceeded(Exception):
    def __init__(self, detail="Rate limit exceeded"):
        self.detail = detail

class Limiter:
    def __init__(self, key_func: Callable = None):
        self.key_func = key_func

    def limit(self, rate: str):
        def _decorator(func):
            return func

        return _decorator

# util
def get_remote_address(request):
    return request.client.host if hasattr(request, 'client') else '127.0.0.1'

# errors
errors = None
