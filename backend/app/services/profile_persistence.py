"""Shared helpers for persisting user profile snapshots."""

from __future__ import annotations

import logging
from typing import Any

from app.services.user_profile_service import user_profile_service


async def persist_user_profile_snapshot(
    *,
    db: Any,
    user_id: str,
    field_name: str,
    payload: Any,
    logger: logging.Logger | None = None,
    ignore_failures: bool = False,
) -> bool:
    """Persist a profile snapshot under a single metadata field.

    Returns ``True`` when persistence succeeds. When ``ignore_failures`` is enabled,
    failures are logged and ``False`` is returned instead of raising.
    """
    try:
        await user_profile_service.update_user_profile(
            db=db,
            user_id=user_id,
            update_data={field_name: payload},
        )
        if logger is not None:
            logger.info("Saved %s for user %s", field_name, user_id)
        return True
    except Exception as exc:
        if not ignore_failures:
            raise
        if logger is not None:
            logger.warning(
                "Failed to persist %s for user %s: %s. Continuing with response.",
                field_name,
                user_id,
                exc,
            )
        return False
