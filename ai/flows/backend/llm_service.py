from typing import Any

from app.core.genkit import get_model
from app.core.monitoring import monitor_performance
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.schemas.ai import LlmRequest, LlmResponse


def _extract_response_text(response: Any) -> str:
    if hasattr(response, "text"):
        return response.text
    if isinstance(response, dict) and "candidates" in response:
        return response["candidates"][0]["content"]["parts"][0]["text"]
    return str(response)


@async_genkit_flow(output_schema=LlmResponse)
@monitor_performance("llm_service_flow")
async def generate_llm_response(request: LlmRequest) -> LlmResponse:
    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not initialized")

    prompt = request.prompt
    if request.system_prompt:
        prompt = f"{request.system_prompt}\n\n{request.prompt}"

    response = await model.generate(prompt)
    content = _extract_response_text(response)
    operation_type = request.service_name or request.task_type or "llm_generic"

    return LlmResponse(
        content=content,
        model_used=getattr(model, "model_name", request.model_name),
        tokens_used=len(content.split()) * 1.3,
        cached=False,
        metadata={"operation_type": operation_type},
    )
