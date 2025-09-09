import os

from app.core.genkit_init import get_model, is_genkit_enabled, register_flow_function
from pydantic import BaseModel

# Try to import Genkit for decorators, with fallback
try:
    import genkit

    GENKIT_AVAILABLE = True
except ImportError:
    genkit = None
    GENKIT_AVAILABLE = False


# Define the structured output model using Pydantic
class STAR_Response(BaseModel):
    situation: str
    task: str
    action: str
    result: str


def _generate_ksc_response_impl(user_profile_data: dict, ksc_statement: str) -> STAR_Response:
    """
    Acts as an expert career coach to generate a STAR response for a KSC statement.
    """

    prompt = f"""
    As an expert career coach and a master of the STAR interview technique,
    your task is to generate a response for a Key Selection Criterion (KSC).

    **Objective:**
    1.  Analyze the following Key Selection Criterion: "{ksc_statement}".
    2.  Search through the provided user profile data to find the most relevant
        real-world example of this skill or experience.
    3.  Using that single, most relevant example, write a comprehensive response
        that is strictly formatted using the STAR methodology (Situation, Task, Action, Result).
    4.  The final output must be a JSON object with four keys: "situation",
        "task", "action", and "result".

    **User Profile Data:**
    ```json
    {user_profile_data}
    ```

    Now, generate the STAR response based on the user's experience.
    """

    # Generate the response using the centralized model
    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available for KSC generation")

    response = model.generate(
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
        },
    )

    return response.output()


# Register the flow with conditional decorator
if GENKIT_AVAILABLE and is_genkit_enabled():
    generateKscResponse = genkit.flow(output_schema=STAR_Response)(_generate_ksc_response_impl)
else:
    generateKscResponse = _generate_ksc_response_impl

# Register the flow for tracking
register_flow_function(generateKscResponse, "generateKscResponse")
