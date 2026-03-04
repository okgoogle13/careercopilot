from pydantic import BaseModel, ConfigDict

from app.core.genkit import ai, is_genkit_enabled
from app.schemas.career import CareerDatabase

INGESTION_PROMPT = """
You are the CareerCopilot Data Architect.
Analyze the provided raw career documents.
Extract, merge, and structure the data into a strict JSON database.

CORE INSTRUCTIONS:
1. **Deduplication**: If the same role appears in multiple file segments, merge them into one entry.
2. **Achievement Structuring**:
   - Rewrite EVERY bullet point into the "Action + Noun + Metric + Strategy + Outcome" format.
   - If a metric is missing, use 'X' (e.g., "improved efficiency by X%").
   - Set 'needs_review_flag' to True if you used 'X'.
3. **High-Impact Audit**:
   - For every achievement, populate 'improvement_suggestions'.
   - Suggest a POWER VERB to replace weak words like "helped" or "handled".
   - Suggest a specific STRATEGY/TOOL if one is implied but not named.
   - Tag entries with Australian Community Services tags (NDIS, Trauma-Informed) if applicable.

RAW CONTENT:
{{raw_text}}
"""


class IngestInput(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    raw_text: str


def conditional_flow(name: str):
    def decorator(func):
        if not is_genkit_enabled():
            return func
        return ai.flow(name=name)(func)

    return decorator


@conditional_flow(name="ingest_career_docs")
async def ingest_career_docs(input_data: IngestInput) -> CareerDatabase:
    """Ingest raw text and return a structured CareerDatabase."""
    if not is_genkit_enabled():
        raise RuntimeError("Genkit flows are disabled")

    response = await ai.generate(
        prompt=INGESTION_PROMPT.replace("{{raw_text}}", input_data.raw_text),
        output_schema=CareerDatabase,
        config={"temperature": 0.1},
    )

    output = getattr(response, "output", None)
    if callable(output):
        return CareerDatabase.model_validate(output())
    if output is None:
        raise RuntimeError("Genkit flow returned no output")
    return CareerDatabase.model_validate(output)
