import json
import logging

from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt, get_prompt_service
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.models.resume_audit_schemas import AuditResult

logger = logging.getLogger(__name__)


@async_genkit_flow()
async def resumeAuditRKL(
    resume_text: str, job_description: str | None = None, strictness_mode: str = "moderate"
) -> AuditResult:
    """
    Performs a specialized Australian resume audit based on Resume Knowledge Library (RKL) rules.
    """
    logger.info(f"Starting RKL resume audit (strictness: {strictness_mode})")

    try:
        # Prepare job description section if provided
        job_description_section = ""
        if job_description:
            job_description_section = f"<job_description>\n{job_description}\n</job_description>"

        # Format the prompt using the centralized service
        prompt = format_prompt(
            "resume_audit_rkl",
            resume_text=resume_text,
            job_description_section=job_description_section,
            strictness_mode=strictness_mode,
        )

        # Get the system prompt
        system_prompt = get_prompt_service().get_system_prompt("resume_audit_rkl")

        # Generate the response using the centralized model
        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available for resume audit")

        # Include system prompt in the request
        response = await model.generate(
            prompt=prompt,
            system_prompt=system_prompt,
            config={"response_mime_type": "application/json", "temperature": 0.3},
            output_schema=AuditResult,
        )

        output = response.output()
        if not output:
            raise ValueError("Empty response from AI model")

        # If model returned a string, parse it. If using output_schema, it might already be an object.
        if isinstance(output, str):
            data = json.loads(output)
            return AuditResult(**data)

        # If it's already a dict/object matching AuditResult
        if isinstance(output, dict):
            return AuditResult(**output)

        return output

    except Exception as e:
        logger.error(f"Error in resumeAuditRKL flow: {e}", exc_info=True)
        # Return a pessimistic fallback
        return AuditResult(
            overallScore=0,
            scanSimulation="Audit failed due to system error.",
            violations=[],
            recommendations=["Please try again later or contact support if the issue persists."],
        )
