import logging
import json
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

from app.core.genkit import get_model
from app.core.prompt_service import format_prompt
from app.genkit_flows.flow_decorator import async_genkit_flow

logger = logging.getLogger(__name__)

class JobAnalysisSchema(BaseModel):
    title: str
    company: str
    location: str
    summary: str
    key_requirements: list[str]
    technical_skills: list[str]
    soft_skills: list[str]
    experience_level: str
    match_score: Optional[int] = None

@async_genkit_flow()
async def analyze_job_description(job_description: str) -> str:
    """
    Analyzes a job description to extract key information using Genkit.
    """
    logger.info("Running analyze_job_description flow")

    # Use the centralized prompt service
    prompt = format_prompt("job_description_analysis", job_description=job_description)

    # Generate the response using the centralized model
    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available")

    response = await model.generate(
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
        },
    )

    # Return as JSON string to maintain compatibility with legacy callers like JobsService
    output = response.output()
    if isinstance(output, str):
        return output
    return json.dumps(output)
