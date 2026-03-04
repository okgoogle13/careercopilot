"""Compatibility wrapper for the canonical genkit flow implementation."""

from app.genkit_flows.ingestion_flow import SYSTEM_PROMPT, ingest_career_history

__all__ = ["SYSTEM_PROMPT", "ingest_career_history"]
