"""Shared lazy compatibility helpers for ``google.generativeai``."""

from __future__ import annotations

import importlib
import importlib.util
import warnings
from typing import Any

try:
    GOOGLE_GENERATIVEAI_AVAILABLE = importlib.util.find_spec("google.generativeai") is not None
except ModuleNotFoundError:
    GOOGLE_GENERATIVEAI_AVAILABLE = False

_google_generativeai: Any = None
_configured_api_key: str | None = None


def import_google_generativeai() -> Any | None:
    """Import ``google.generativeai`` lazily while suppressing deprecation noise."""
    global _google_generativeai

    if _google_generativeai is not None:
        return _google_generativeai
    if not GOOGLE_GENERATIVEAI_AVAILABLE:
        return None

    try:
        with warnings.catch_warnings():
            warnings.filterwarnings(
                "ignore",
                message=r".*google\.generativeai.*",
                category=FutureWarning,
            )
            _google_generativeai = importlib.import_module("google.generativeai")
    except ImportError:
        return None

    return _google_generativeai


def get_configured_google_generativeai(api_key: str | None) -> Any | None:
    """Return the lazy Google GenAI module configured for the provided key."""
    global _configured_api_key

    if not api_key:
        return None

    genai = import_google_generativeai()
    if genai is None:
        return None

    if _configured_api_key != api_key:
        genai.configure(api_key=api_key)
        _configured_api_key = api_key

    return genai
