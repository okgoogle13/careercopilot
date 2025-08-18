gemini_pro = googleai.gemini_pro
import genkit
import os
from dotenv import load_dotenv

# The googleai plugin may not be installed in all environments; import
# defensively so tests and static analysis can import this module.
try:
    from genkit.plugins import googleai
except Exception:
    googleai = None

# Load environment variables from .env file
load_dotenv()

# Initialize the Google AI plugin if available
gemini_pro = None
if googleai is not None:
    if not genkit.get_plugin("googleai"):
        genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])
    gemini_pro = googleai.gemini_pro

@genkit.flow()
def generate_tailored_resume(base_profile_data: dict, comparison_analysis: dict) -> str:
    """
    Acts as an expert resume writer to generate a tailored resume.
    """
    
    prompt = f"""
    As an expert resume writer, your task is to rewrite the provided base profile data into a new, tailored resume.
    You must use the provided comparison analysis to guide your writing.

    Your rewritten resume should:
    1.  Emphasize the "matching_skills" from the analysis.
    2.  Subtly integrate keywords from the job description and address the "missing_skills" by rephrasing experience and responsibilities.
    3.  Incorporate the "improvement_suggestions" from the analysis.
    4.  The final output should be a single string containing the full text of the newly generated, optimized resume.

    Base Profile Data:
    ---
    {base_profile_data}
    ---

    Comparison Analysis:
    ---
    {comparison_analysis}
    ---
    """
    
    response = gemini_pro.generate(prompt)
    
    return response.text()
