"""Unit tests for the scan emails worker."""

from unittest.mock import patch

import pytest

from app.workers.scan_emails_worker import process_scan_emails_task


@pytest.mark.asyncio
async def test_process_scan_emails_task_logs_start_message():
    with patch("app.workers.scan_emails_worker.logger.info") as mock_info:
        await process_scan_emails_task("user1")

    mock_info.assert_called_once_with("Email scan started for user user1")


@pytest.mark.asyncio
async def test_process_scan_emails_task_logs_error_on_failure():
    with (
        patch("app.workers.scan_emails_worker.logger.info", side_effect=RuntimeError("boom")),
        patch("app.workers.scan_emails_worker.logger.error") as mock_error,
    ):
        await process_scan_emails_task("user2")

    assert mock_error.call_count == 1
    assert "Background email scan failed for user user2" in mock_error.call_args.args[0]
