from app.core.ai_config import get_ai_config

gemini_pro = get_ai_config().get_model_config("gemini-1.5-pro")


# Define the Job Analyzer Genkit flow
@genkit.flow()
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
