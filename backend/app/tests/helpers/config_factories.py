"""Shared config stub factories for backend tests."""

from __future__ import annotations

from typing import Any


def make_firebase_frontend_config(**overrides: Any) -> dict[str, str]:
    """Return a valid frontend Firebase config in secret-manager shape."""
    config = {
        "api_key": "test_api_key",
        "auth_domain": "test_auth_domain",
        "project_id": "test_project_id",
        "storage_bucket": "test_storage_bucket",
        "messaging_sender_id": "test_messaging_sender_id",
        "app_id": "test_app_id",
    }
    config.update(overrides)
    return config
