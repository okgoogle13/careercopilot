import json
import logging
from typing import Dict, Any

from app.core.genkit import get_model
from app.core.prompt_service import format_prompt
from app.genkit_flows.flow_decorator import async_genkit_flow

logger = logging.getLogger(__name__)

@async_genkit_flow()
async def compare_resume_to_job(resume_text: str, job_analysis_data: dict) -> str:
    """
    Acts as an expert career coach to compare a resume to a job analysis using Genkit.
    """
    logger.info("Running compare_resume_to_job flow")

    # Use the centralized prompt service
    prompt = format_prompt(
        "resume_job_comparison",
        resume_text=resume_text,
        job_analysis_data=json.dumps(job_analysis_data, separators=(',', ':')),
    )

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

    output = response.output()
    if isinstance(output, str):
        return output
    return json.dumps(output)
