from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt
from app.genkit_flows.flow_decorator import simple_genkit_flow


# Define the Job Analyzer Genkit flow
@simple_genkit_flow()
def analyze_job_description(job_description: str) -> dict:
    """
    Analyzes a job description to extract key information.
    """

    # Use the centralized prompt service
    prompt = format_prompt("job_description_analysis", job_description=job_description)

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
