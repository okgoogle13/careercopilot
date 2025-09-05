import os

from app.core.ai_config import get_ai_config
from dotenv import load_dotenv

try:
    import genkit  # type: ignore
    from genkit.plugins import google_genai  # type: ignore
except Exception:  # pragma: no cover - makes module import-safe without genkit
    genkit = None  # type: ignore
    googleai = None  # type: ignore


def _noop_flow(*args, **kwargs):
    def _decorator(fn):
        return fn

    return _decorator


# Use real genkit.flow if available; otherwise a no-op
genkit_flow = getattr(genkit, "flow", _noop_flow)

# Load environment variables and initialize Genkit if needed
load_dotenv()
if genkit and getattr(genkit, "get_plugin", None) and not genkit.get_plugin("googleai"):
    genkit.init(plugins=[google_genai.init(api_key=os.getenv("GEMINI_API_KEY"))])

gemini_pro = get_ai_config().get_model_config("gemini-1.5-pro")


# Define the Job Analyzer Genkit flow
@genkit_flow()
def analyze_job_description(job_description: str) -> dict:
    """
    Analyzes a job description to extract key information.
    """

    prompt = f"""
    Analyze the following job description and extract the key information in a structured JSON format.
    The JSON object should include the following fields:
    - job_title (string)
    - key_skills (list of strings)
    - required_qualifications (list of strings)
    - company_culture_summary (string)

    Job Description:
    {job_description}
    """

    response = gemini_pro.generate(prompt)

    return response.text()
