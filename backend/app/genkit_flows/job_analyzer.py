import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Google AI plugin
genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

# Define the Gemini Pro model
gemini_pro = googleai.gemini_pro

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
