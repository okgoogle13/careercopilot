import json

from app.core.prompt_service import format_prompt
from app.genkit_flows.flow_decorator import simple_genkit_flow
from app.ai.model_dispatcher import dispatch_llm_call
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

    # Generate the response using the AI dispatcher for cost optimization
    response = dispatch_llm_call(
        task_type="resume_optimization",  # KSC responses are medium complexity
        prompt=prompt,
        response_format="json",
        temperature=0.5,
    )

    # Parse and return structured response
    import json

    content = response.get("content", "{}")
    try:
        parsed_data = json.loads(content)
        return STAR_Response(**parsed_data)
    except (json.JSONDecodeError, TypeError):
        # Fallback for malformed responses
        return STAR_Response(
            situation="Error parsing response",
            task="Error parsing response",
            action="Error parsing response",
            result="Error parsing response",
        )


# Flow is automatically registered by the @simple_genkit_flow decorator
