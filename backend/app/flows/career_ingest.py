"""Compatibility wrapper for the canonical genkit flow implementation."""

from app.genkit_flows.career_ingest import IngestInput, ingest_career_docs

__all__ = ["IngestInput", "ingest_career_docs"]
