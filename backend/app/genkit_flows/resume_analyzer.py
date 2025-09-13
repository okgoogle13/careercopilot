import json

from app.genkit_flows.flow_decorator import simple_genkit_flow
from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt


@simple_genkit_flow()
def compare_resume_to_job(resume_text: str, job_analysis_data: dict) -> dict:
    """
    Acts as an expert career coach to compare a resume to a job analysis.

    Args:
        resume_text: Raw resume content from user
        job_analysis_data: Structured job analysis data

    Returns:
        dict: Structured analysis with match score and recommendations
    """
    
    # Use the centralized prompt service
    prompt = format_prompt(
        "resume_job_comparison",
        resume_text=resume_text,
        job_analysis_data=json.dumps(job_analysis_data, indent=2)
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
