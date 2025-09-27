import json
from typing import Optional

from app.core.genkit_init import get_model
from app.core.prompt_service import format_prompt
from app.genkit_flows.flow_decorator import simple_genkit_flow


@simple_genkit_flow()
def generate_tailored_cover_letter(
    base_profile_data: dict,
    job_analysis_data: dict,
    voice_profile: Optional[dict] = None,
) -> str:
    """
    Acts as an expert career coach to write a tailored cover letter,
    adapting to the user's unique writing style.
    """

    # Build voice profile section if it exists
    voice_profile_section = ""
    if voice_profile:
        voice_profile_section = f"""**Applicant's Voice Profile (for style matching):**
    ---
    - **Tone:** {voice_profile.get('tone', 'N/A')}
    - **Common Phrases to consider using:**
        {', '.join(voice_profile.get('common_phrases', []))}
    - **Key Vocabulary to include:**
        {', '.join(voice_profile.get('professional_vocabulary', []))}
    ---
        """

    # Use the prompt service to format the template
    prompt = format_prompt(
        "tailored_cover_letter_simple",
        base_profile_data=json.dumps(base_profile_data, indent=2),
        job_analysis_data=json.dumps(job_analysis_data, indent=2),
        voice_profile_section=voice_profile_section,
    )

    # Generate the cover letter using the AI model
    # Model availability is guaranteed by the decorator
    model = get_model()

    response = model.generate(prompt)

    return response.text()


# Flow is automatically registered by the @simple_genkit_flow decorator
