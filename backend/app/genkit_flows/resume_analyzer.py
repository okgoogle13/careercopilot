import json
import logging
from typing import Any, Dict

from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt
from app.genkit_flows.flow_decorator import async_genkit_flow

logger = logging.getLogger(__name__)


@async_genkit_flow()
async def compare_resume_to_job(resume_text: str, job_analysis_data: dict) -> str:
    """
    Acts as an expert career coach to compare a resume to a job analysis using Genkit.
    """
    logger.info("Running compare_resume_to_job flow")

    fallback_data = {
        "match_score": 0,
        "matched_skills": [],
        "missing_skills": [],
        "overall_fit": "Analysis unavailable",
        "recommendations": "Please try again later.",
    }

    try:
        # Use the centralized prompt service
        prompt = format_prompt(
            "resume_job_comparison",
            resume_text=resume_text,
            job_analysis_data=json.dumps(job_analysis_data, separators=(",", ":")),
        )

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

        output = response.output()
        if not output:
            return json.dumps(fallback_data)

        if isinstance(output, str):
            return output
        return json.dumps(output)

    except Exception as e:
        logger.error(f"Error in compare_resume_to_job: {e}")
        return json.dumps(fallback_data)
