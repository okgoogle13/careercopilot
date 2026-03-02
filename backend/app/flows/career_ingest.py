<<<<<<< HEAD
from genkit.ai import Genkit
from pydantic import BaseModel, ConfigDict
=======
from pydantic import BaseModel, ConfigDict

>>>>>>> restoration-KR-Rage-Figma-v2.0
from app.core.genkit import ai
from app.schemas.career import CareerDatabase

# --- THE ARCHITECT PROMPT ---
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

import os

# ... imports ...

# ... prompt ...

class IngestInput(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    raw_text: str

# Conditional Decorator Logic
def conditional_flow(name):
    def decorator(func):
        if os.environ.get("ENABLE_GENKIT_FLOWS", "true").lower() == "false":
            return func
        return ai.flow(name=name)(func)
    return decorator

@conditional_flow(name="ingest_career_docs")
async def ingest_career_docs(input_data: IngestInput) -> CareerDatabase:
    """
    Ingests raw text and returns a structured CareerDatabase.
    """
    # If in test mode, we might not have ai initialized or configured,
    # Get the Gemini 3.0 Pro model constants anyway.
    # However, if called without mock in strict mode, ensure we use ai.generate safely

    response = await ai.generate(
        prompt=INGESTION_PROMPT.replace("{{raw_text}}", input_data.raw_text),
        output_schema=CareerDatabase,
        config={
            "temperature": 0.1, # Precise extraction
        }
    )
    return response.output
