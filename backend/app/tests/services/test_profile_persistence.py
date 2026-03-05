"""Tests for profile persistence service."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.profile_persistence import persist_user_profile_snapshot


@pytest.mark.asyncio
async def test_persist_user_profile_snapshot_happy_path():
    """Should call update_user_profile and return True."""
    mock_db = MagicMock()
    with patch(
        "app.services.profile_persistence.user_profile_service.update_user_profile",
        new_callable=AsyncMock,
    ) as mock_update:
        result = await persist_user_profile_snapshot(
            db=mock_db, user_id="user123", field_name="test_field", payload={"data": "test"}
        )

    assert result is True
    mock_update.assert_called_once_with(
        db=mock_db, user_id="user123", update_data={"test_field": {"data": "test"}}
    )


@pytest.mark.asyncio
async def test_persist_user_profile_snapshot_logs_on_success():
    """Should emit an info log when persistence succeeds and logger is provided."""
    mock_db = MagicMock()
    logger = MagicMock()
    with patch(
        "app.services.profile_persistence.user_profile_service.update_user_profile",
        new_callable=AsyncMock,
    ):
        result = await persist_user_profile_snapshot(
            db=mock_db,
            user_id="user-1",
            field_name="career_profile",
            payload={"summary": "ok"},
            logger=logger,
        )

    assert result is True
    logger.info.assert_called_once()


@pytest.mark.asyncio
async def test_persist_user_profile_snapshot_error_handling():
    """Should raise if update fails and ignore_failures is False."""
    mock_db = MagicMock()
    with patch(
        "app.services.profile_persistence.user_profile_service.update_user_profile",
        side_effect=ValueError("DB error"),
    ):
        with pytest.raises(ValueError, match="DB error"):
            await persist_user_profile_snapshot(
                db=mock_db, user_id="u", field_name="f", payload={}, ignore_failures=False
            )


@pytest.mark.asyncio
async def test_persist_user_profile_snapshot_ignore_failures():
    """Should return False if update fails and ignore_failures is True."""
    mock_db = MagicMock()
    with patch(
        "app.services.profile_persistence.user_profile_service.update_user_profile",
        side_effect=Exception("DB error"),
    ):
        result = await persist_user_profile_snapshot(
            db=mock_db,
            user_id="u",
            field_name="f",
            payload={},
            ignore_failures=True,
            logger=MagicMock(),
        )
    assert result is False


@pytest.mark.asyncio
async def test_persist_user_profile_snapshot_ignore_failures_without_logger():
    """Should still return False when logger is omitted and failures are ignored."""
    mock_db = MagicMock()
    with patch(
        "app.services.profile_persistence.user_profile_service.update_user_profile",
        side_effect=Exception("DB error"),
    ):
        result = await persist_user_profile_snapshot(
            db=mock_db,
            user_id="u",
            field_name="f",
            payload={},
            ignore_failures=True,
            logger=None,
        )
    assert result is False
