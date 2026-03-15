import json
import logging
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field

from app.core.genkit_init import get_model
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

    # Default fallback data
    fallback_data = {
        "title": "Unknown Title",
        "company": "Unknown Company",
        "location": "Unknown Location",
        "summary": "AI analysis unavailable",
        "key_requirements": [],
        "technical_skills": [],
        "soft_skills": [],
        "experience_level": "Unknown",
    }

    try:
        # Use the centralized prompt service
        prompt = format_prompt("job_description_analysis", job_description=job_description)

        # Generate the response using the centralized model
        model = get_model()
        if not model:
            logger.warning("Genkit model not available, using fallback")
            return json.dumps(fallback_data)

        response = await model.generate(
            prompt=prompt,
            config={
                "response_mime_type": "application/json",
            },
        )

        # Return as JSON string to maintain compatibility with legacy callers like JobsService
        output = response.output()
        if not output:
            return json.dumps(fallback_data)

        if isinstance(output, str):
            return output
        return json.dumps(output)

    except Exception as e:
        logger.error(f"Error in analyze_job_description: {e}")
        return json.dumps(fallback_data)
