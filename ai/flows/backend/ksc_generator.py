import json

from pydantic import BaseModel

from app.core.prompt_service import format_prompt, get_prompt_service
from app.core.genkit_init import get_model
from app.genkit_flows.flow_decorator import async_genkit_flow
from ai.schemas.backend.document_models import CareerProfile
from app.core.monitoring import monitor_performance


# ── Output schemas ───────────────────────────────────────────────────────────

class STAR_Response(BaseModel):
    situation: str
    task: str
    action: str
    result: str


# ── Detail level constants (loaded from prompt_config.json) ───────────────────

def _get_detail_instruction(level: str = "simple") -> str:
    """Return the canonical detail_instruction string for the given level."""
    config = get_prompt_service()._config
    return config.get("ksc_detail_levels", {}).get(
        level,
        'Return a JSON object with exactly four string keys: "situation", "task", "action", "result".',
    )


# ── Flow ─────────────────────────────────────────────────────────────────────


# ... (other imports) ...

@async_genkit_flow(output_schema=STAR_Response)
@monitor_performance("ksc_generator")
async def generateKscResponse(
    profile: CareerProfile,
    ksc_statement: str,
    detail_level: str = "simple",
) -> STAR_Response:
    """
    Generate a STAR response for a Key Selection Criterion.

    Args:
        profile:       The user's career profile (CareerProfile model).
        ksc_statement: The KSC text to respond to.
        detail_level:  "simple" (default) returns 4 STAR fields.
                       "full" returns extended analysis.

    Returns:
        STAR_Response with situation, task, action, result fields.
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
        output_schema=STAR_Response,
    )

    return await response.output()


# Flow is automatically registered by the @async_genkit_flow decorator
