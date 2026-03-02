import logging
import json
from app.core.prompt_service import format_prompt, get_prompt_service
from app.core.genkit import get_model
from app.genkit_flows.flow_decorator import async_genkit_flow
from ai.schemas.backend.document_models import CareerDatabase
from app.core.monitoring import monitor_performance
from app.core.ai_response_validation import KSCResponseComplete, STARResponse

logger = logging.getLogger(__name__)

# ── Detail level constants (loaded from prompt_config.json) ───────────────────

def _get_detail_instruction(level: str = "simple") -> str:
    """Return the canonical detail_instruction string for the given level."""
    config = get_prompt_service()._config
    return config.get("ksc_detail_levels", {}).get(
        level,
        'Return a JSON object with exactly four string keys: "situation", "task", "action", "result".',
    )

@async_genkit_flow(output_schema=STARResponse)
@monitor_performance("ksc_generator")
async def generateKscResponse(
    profile: CareerDatabase,
    ksc_statement: str,
    detail_level: str = "simple",
) -> STARResponse:
    """
    Generate a STAR response for a Key Selection Criterion.
    """
    prompt = format_prompt(
        "ksc_response",
        ksc_statement=ksc_statement,
        user_profile_data=profile.model_dump_json(exclude={"job_context", "selection_criteria"}),
        detail_instruction=_get_detail_instruction(detail_level),
    )

    model = get_model()
    response = await model.generate(
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.5,
        },
        output_schema=STARResponse,
    )

    return response.output

@async_genkit_flow(output_schema=KSCResponseComplete)
@monitor_performance("ksc_complete_generator")
async def generateCompleteKscResponse(
    profile: CareerDatabase,
    ksc_statement: str,
    response_length: str = "comprehensive",
) -> KSCResponseComplete:
    """
    Generate a complete KSC response including analysis, experience selection, and STAR.
    """
    prompt = format_prompt(
        "ksc_star_response",
        ksc_statement=ksc_statement,
        user_profile=profile.model_dump_json(),
        focus_achievements="",
        length_instruction=get_prompt_service().get_length_instruction(response_length),
    )

    model = get_model()
    response = await model.generate(
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.6,
        },
        output_schema=KSCResponseComplete,
    )

    return response.output
