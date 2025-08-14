import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List

# Load environment variables
load_dotenv()

# Initialize Google AI plugin if needed
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

# Define the model to use
gemini_pro = googleai.gemini_pro

# Define the structured output model for job requirements
class JobRequirements(BaseModel):
    requiredSkills: List[str] = Field(description="A list of essential skills explicitly mentioned as required.")
    preferredSkills: List[str] = Field(description="A list of skills mentioned as preferred, desired, or 'a plus'.")
    experienceLevel: str = Field(description="The required experience level (e.g., 'Entry-level', 'Mid-level', 'Senior', '5+ years').")

@genkit.flow(output_schema=JobRequirements)
def extractJobRequirements(jobDescription: str) -> JobRequirements:
    """
    Extracts structured information from a job description string.
    """
    prompt = f"""
    Analyze the following job description and extract the specified entities.
    Your output MUST be a valid JSON object matching the defined schema.

    Job Description:
    ---
    {jobDescription}
    ---
    """
    
    response = gemini_pro.generate(
        prompt=prompt,
        config=googleai.GenerationConfig(
            response_mime_type="application/json",
        ),
        output_schema=JobRequirements
    )
    
    return response.output()
