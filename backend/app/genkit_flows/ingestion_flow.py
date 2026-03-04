import logging
from typing import Any

from app.core.genkit_init import get_model
from app.schemas.career_master import CareerDatabase

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
### Master Career Database Ingestion
**System Role:** Career Database Pre-processor
**Input:** Raw file text content.

Analyze the following collection of career documents, provided as separate files.
Extract, analyze, de-duplicate, merge, and structure the information from ALL provided documents into a single, coherent JSON object.

**Core Instructions:**
1.  **De-duplication & Merging**: Identify identical roles across different documents and merge them.
2.  **Structured Achievements**: Rewrite text into "Action Verb + Noun + Metric + Strategy + Outcome".
3.  **KSC to STAR Method**: Structure narrative selection criteria responses into STAR format.

4.  **DEEP STAR CRITIQUE & VALIDATION**:
    For every KSC Response, perform a "High-Impact Audit". Set 'Needs_Review_Flag' to true if any of the following are detected.

5.  **Achievement Optimization**:
    For EVERY Structured Achievement, provide an "Improvement_Suggestions" object.

6.  **Subtype Tagging**: Apply relevant tags aligned with Australian Community Services best practices.
7.  **Unique IDs**: Generate IDs like 'work-1', 'ach-1', 'ksc-1'.
8.  **Skill Enrichment**: Infer proficiency and years of experience where possible.
9.  **Job Preferences**: Infer implicit and explicit job preferences.
"""


def _extract_output(response: Any) -> CareerDatabase:
    output = getattr(response, "output", None)
    if callable(output):
        return output()
    if output is None:
        raise RuntimeError("Genkit response did not include structured output")
    return output


def ingest_career_history(text_content: str) -> CareerDatabase:
    """Parse raw text into a structured CareerDatabase."""
    model = get_model()
    if model is None:
        raise RuntimeError("Genkit AI instance not available")

    response = model.generate(
        prompt=f"{SYSTEM_PROMPT}\n\nINPUT TEXT:\n{text_content}",
        output_schema=CareerDatabase,
    )
    return _extract_output(response)
