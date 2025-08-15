import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List

# Load environment variables and initialize Genkit
load_dotenv()
if genkit.get_plugin("googleai") is None:
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

gemini_pro = googleai.gemini_pro

class OptimizedResume(BaseModel):
    """The full, optimized resume text."""
    resume_text: str = Field(description="The complete and updated resume text, with keywords naturally integrated.")

@genkit.flow(output_schema=OptimizedResume)
def optimizeResume(resumeText: str, missingKeywords: List[str], jobDescription: str) -> OptimizedResume:
    """
    Analyzes a resume and a list of missing keywords, then rewrites the resume
    to naturally incorporate those keywords in the context of the job description.
    """

    keywords_str = ", ".join(missingKeywords)

    prompt = f"""
    You are an expert resume editor. Your task is to revise the provided resume to seamlessly integrate a list of missing keywords.
    The goal is to make the resume a stronger match for the target job description without inventing new experiences or skills.

    **Target Job Description:**
    ---
    {jobDescription}
    ---

    **Original Resume:**
    ---
    {resumeText}
    ---

    **Keywords to Integrate:**
    - {keywords_str}

    **Instructions:**
    1.  **Analyze Context:** Read the job description and the original resume to understand the candidate's experience and the employer's needs.
    2.  **Integrate Naturally:** Weave the keywords into the existing text of the resume. Rephrase bullet points or summaries where appropriate. For example, if a keyword is "Project Management" and the resume says "Led a team," you could change it to "Applied strong Project Management skills to lead a team."
    3.  **Do Not Fabricate:** You must not add new job roles, invent new skills, or create experiences the candidate does not have. Your role is to edit and enhance, not to create fiction.
    4.  **Preserve Formatting:** Maintain the overall structure and formatting of the original resume.
    5.  **Return Full Text:** The final output should be the complete, revised resume text.

    Now, please generate the optimized resume.
    """

    response = gemini_pro.generate(
        prompt=prompt,
        config=googleai.GenerationConfig(
            temperature=0.2, # Lower temperature for more focused and less creative output
            response_mime_type="application/json"
        ),
        output_schema=OptimizedResume
    )

    optimized_resume = response.output()
    if not optimized_resume:
        raise ValueError("Failed to generate an optimized resume from the model.")

    return optimized_resume
