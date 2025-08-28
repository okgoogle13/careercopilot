import pytest
from unittest.mock import AsyncMock, patch
from app.workers.scan_emails_worker import process_scan_emails_task

@pytest.mark.asyncio
async def test_process_scan_emails_task_logs_and_handles():
    # Just ensure it runs and logs (no real scan logic yet)
    await process_scan_emails_task("user1")
