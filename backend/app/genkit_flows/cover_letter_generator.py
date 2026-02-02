import json
from typing import Optional

from app.core.ai.model_dispatcher import dispatch_llm_call
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
        base_profile_data=json.dumps(base_profile_data, separators=(',', ':')),
        job_analysis_data=json.dumps(job_analysis_data, separators=(',', ':')),
        voice_profile_section=voice_profile_section,
    )

    # Generate the cover letter using the AI dispatcher for cost optimization
    response = dispatch_llm_call(
        task_type="cover_letter_generation", prompt=prompt, temperature=0.7
    )

    return response.get("content", "")


# Flow is automatically registered by the @simple_genkit_flow decorator
