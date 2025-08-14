import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Google AI plugin if not already initialized
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

# Define the Gemini Pro model
gemini_pro = googleai.gemini_pro

@genkit.flow()
def compare_resume_to_job(resume_text: str, job_analysis_data: dict) -> dict:
    """
    Acts as an expert career coach to compare a resume to a job analysis.
    """
    
    prompt = f"""
    As an expert career coach, analyze the provided resume against the structured job analysis data.
    Your goal is to provide a detailed comparison and actionable feedback.

    The output must be a valid JSON object with the following structure:
    - "match_score": An integer between 0 and 100 representing how well the resume matches the job.
    - "matching_skills": A list of skills found in both the resume and the job's key skills.
    - "missing_skills": A list of key skills required for the job that are not found in the resume.
    - "improvement_suggestions": A list of specific, actionable suggestions for the user to improve their resume for this job.

    Resume Text:
    ---
    {resume_text}
    ---

    Job Analysis Data:
    ---
    {job_analysis_data}
    ---
    """
    
    response = gemini_pro.generate(prompt)
    
    # The output from the model is expected to be a string representation of a JSON object.
    # We will return it as such, and the API endpoint will parse it.
    return response.text()
