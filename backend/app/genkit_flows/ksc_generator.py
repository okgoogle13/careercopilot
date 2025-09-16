import json

from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt
from app.genkit_flows.flow_decorator import simple_genkit_flow
from pydantic import BaseModel


# Define the structured output model using Pydantic
class STAR_Response(BaseModel):
    situation: str
    task: str
    action: str
    result: str


@simple_genkit_flow(output_schema=STAR_Response)
def generateKscResponse(user_profile_data: dict, ksc_statement: str) -> STAR_Response:
    """
    Acts as an expert career coach to generate a STAR response for a KSC statement.
    """

    # Use the centralized prompt service
    prompt = format_prompt(
        "ksc_simple_response",
        ksc_statement=ksc_statement,
        user_profile_data=json.dumps(user_profile_data, indent=2),
    )

    # Generate the response using the centralized model
    # Model availability is guaranteed by the decorator
    model = get_model()

    response = model.generate(
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
        },
    )

    return response.output()


# Flow is automatically registered by the @simple_genkit_flow decorator
