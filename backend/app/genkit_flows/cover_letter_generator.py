import json
from typing import Optional

from app.core.genkit_init import get_model, is_genkit_enabled, register_flow_function

# Try to import Genkit for decorators, with fallback
try:
    import genkit

    GENKIT_AVAILABLE = True
except ImportError:
    genkit = None
    GENKIT_AVAILABLE = False


# Removed @genkit.flow()
def generate_tailored_cover_letter(
    base_profile_data: dict,
    job_analysis_data: dict,
    voice_profile: Optional[dict] = None,
) -> str:
    """
    Acts as an expert career coach to write a tailored cover letter,
    adapting to the user's unique writing style.
    """

    # Construct the core prompt
    prompt = f"""
    As a professional career coach, your task is to write a compelling and professional cover letter
    from a job applicant to a potential employer.

    **Instructions:**
    1.  **Use the Applicant's Profile:** Base the cover letter on the applicant's provided profile data.
        Highlight 2-3 of their most relevant experiences and skills that align with the job.
    2.  **Address the Job's Needs:** Directly reference the key requirements and skills mentioned in the
        job analysis data. Show how the applicant is a strong match for this specific role.
    3.  **Maintain Authenticity:** It is crucial that the cover letter sounds like it was written by the
        applicant. Adapt your writing style to match the provided voice profile.

    **Applicant's Base Profile:**
    ---
    {json.dumps(base_profile_data, indent=2)}
    ---

    **Analysis of the Target Job:**
    ---
    {json.dumps(job_analysis_data, indent=2)}
    ---
    """

    # Append the voice profile to the prompt ONLY if it exists
    if voice_profile:
        prompt += f"""
    **Applicant's Voice Profile (for style matching):**
    ---
    - **Tone:** {voice_profile.get('tone', 'N/A')}
    - **Common Phrases to consider using:**
        {', '.join(voice_profile.get('common_phrases', []))}
    - **Key Vocabulary to include:**
        {', '.join(voice_profile.get('professional_vocabulary', []))}
    ---
        """

    # Final instruction to the model
    prompt += "\\n\\nNow, write the cover letter. The output should be only the full text of the letter itself."

    # Generate the cover letter using the AI model
    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available for cover letter generation")

    response = model.generate(prompt)

    return response.text()


# Register the flow for tracking
register_flow_function(generate_tailored_cover_letter, "generate_tailored_cover_letter")
