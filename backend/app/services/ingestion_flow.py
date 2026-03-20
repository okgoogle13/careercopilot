"""
Service orchestration for Career History Ingestion (Deep STAR).
"""

import logging

from app.genkit_flows.ingestion_flow import ingest_career_history
from app.schemas.career_master import CareerDatabase

logger = logging.getLogger(__name__)


async def process_career_ingestion(text_content: str) -> CareerDatabase:
    """
    Orchestrate the unified career history ingestion flow.

    This service calls the Genkit 'Master Career Database' flow which
    performs de-duplication, achievement optimization, and DEEP STAR
    critique on provided text.
    """
    logger.info("Starting Deep STAR career ingestion process")

    try:
        # The Genkit flow is currently defined as a regular function in ingestion_flow.py
        # but the decorator might make it async. Checking backend/app/genkit_flows/ingestion_flow.py
        # revealed it is a standard function, but we wrap it in async for service consistency.
        result = ingest_career_history(text_content)

        logger.info("Deep STAR career ingestion completed successfully")
        return result

    except Exception as exc:
        logger.error("Deep STAR ingestion service failed: %s", exc, exc_info=True)
        raise
