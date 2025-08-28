import asyncio
from fastapi import BackgroundTasks
import logging

logger = logging.getLogger(__name__)

async def process_scan_emails_task(user_id):
    try:
        # await scan_user_emails(user_id)  # Uncomment when available
        logger.info(f"Email scan started for user {user_id}")
        # Save result to Firestore or notify user here
    except Exception as e:
        logger.error(f"Background email scan failed for user {user_id}: {e}")
