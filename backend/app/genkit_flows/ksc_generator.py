import json

from pydantic import BaseModel

from app.core.prompt_service import format_prompt
from app.core.genkit_init import get_model
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.core.monitoring import monitor_performance


# Define the structured output model using Pydantic
class STAR_Response(BaseModel):
    situation: str
    task: str
    action: str
    result: str


@async_genkit_flow(output_schema=STAR_Response)
@monitor_performance("ksc_generator")
async def generateKscResponse(user_profile_data: dict, ksc_statement: str) -> STAR_Response:
    """
    Acts as an expert career coach to generate a STAR response for a KSC statement.
    """

    # Use the centralized prompt service
    prompt = format_prompt(
        "ksc_simple_response",
        ksc_statement=ksc_statement,
        user_profile_data=json.dumps(user_profile_data, indent=2),
    )

    # Generate the response using Genkit model
    model = get_model()
    response = await model.generate(
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.5,
        },
        output_schema=STAR_Response
    )

    # Return structured response
    return await response.output()


# Flow is automatically registered by the @async_genkit_flow decorator
