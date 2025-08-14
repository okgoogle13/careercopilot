import genkit
from genkit.plugins import googleai
import os
import json
from typing import Optional

# Initialize Genkit and the Gemini Pro model
if not genkit.get_plugin("googleai"):
    # Attempt to get the API key from environment variables
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    genkit.init(plugins=[googleai.init(api_key=api_key)])

gemini_pro = googleai.gemini_pro

@genkit.flow()
def generate_tailored_cover_letter(
    base_profile_data: dict, 
    job_analysis_data: dict, 
    voice_profile: Optional[dict] = None
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
    1.  **Use the Applicant's Profile:** Base the cover letter on the applicant's provided profile data. Highlight 2-3 of their most relevant experiences and skills that align with the job.
    2.  **Address the Job's Needs:** Directly reference the key requirements and skills mentioned in the job analysis data. Show how the applicant is a strong match for this specific role.
    3.  **Maintain Authenticity:** It is crucial that the cover letter sounds like it was written by the applicant. Adapt your writing style to match the provided voice profile.

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
    - **Common Phrases to consider using:** {', '.join(voice_profile.get('common_phrases', []))}
    - **Key Vocabulary to include:** {', '.join(voice_profile.get('professional_vocabulary', []))}
    ---
        """
    
    # Final instruction to the model
    prompt += "\\n\\nNow, write the cover letter. The output should be only the full text of the letter itself."

    # Generate the cover letter using the AI model
    response = gemini_pro.generate(prompt)
    
    return response.text()
