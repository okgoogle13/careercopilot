import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Load environment variables
load_dotenv()

# Initialize Google AI plugin if needed
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

# Define the model to use
gemini_pro = googleai.gemini_pro

# Define the structured output model for resume entities
class ResumeEntities(BaseModel):
    skills: List[str] = Field(description="A comprehensive list of all skills mentioned in the resume.")
    experience: List[Dict[str, Any]] = Field(description="A list of job experiences, including titles, companies, and durations.")
    education: List[Dict[str, Any]] = Field(description="A list of educational qualifications, including degrees and institutions.")

@genkit.flow(output_schema=ResumeEntities)
def extractResumeEntities(resumeText: str) -> ResumeEntities:
    """
    Extracts structured entities (skills, experience, education) from a resume text.
    """
    prompt = f"""
    Analyze the following resume text and extract the key entities as a structured JSON object.
    Focus on skills, work experience, and education history.

    Resume Text:
    ---
    {resumeText}
    ---
    """
    
    response = gemini_pro.generate(
        prompt=prompt,
        config=googleai.GenerationConfig(
            response_mime_type="application/json",
        ),
        output_schema=ResumeEntities
    )
    
    return response.output()
