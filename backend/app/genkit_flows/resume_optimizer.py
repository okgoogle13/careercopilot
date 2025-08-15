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
def optimizeResume(
    resumeText: str,
    missingKeywords: List[str],
    jobDescription: str,
    company_keywords: List[str] = None,
    company_tone: str = None
) -> OptimizedResume:
    """
    Analyzes a resume, job description, and optional company insights, then rewrites the resume
    to naturally incorporate keywords and match the company's tone.
    """

    keywords_str = ", ".join(missingKeywords)

    company_insights_prompt = ""
    if company_keywords and company_tone:
        company_keywords_str = ", ".join(company_keywords)
        company_insights_prompt = f"""
    **Company Insights:**
    - **Company-Specific Keywords to Integrate:** {company_keywords_str}
    - **Company Tone to Emulate:** {company_tone}

    When revising, also weave in the company-specific keywords and adjust the language to reflect the company's tone.
    """

    prompt = f"""
    You are an expert resume editor. Your task is to revise the provided resume to make it a stronger match for the target job description and company culture.

    **Target Job Description:**
    ---
    {jobDescription}
    ---

    **Original Resume:**
    ---
    {resumeText}
    ---

    **Job-Specific Keywords to Integrate:**
    - {keywords_str}
    {company_insights_prompt}
    **Instructions:**
    1.  **Analyze Context:** Read all provided information to understand the candidate's experience, the employer's needs, and the company's character.
    2.  **Integrate Naturally:** Weave all specified keywords (both job-specific and company-specific) into the existing text. Rephrase bullet points or summaries where appropriate. For example, if a keyword is "Project Management" and the resume says "Led a team," you could change it to "Applied strong Project Management skills to lead a team."
    3.  **Match the Tone:** Adjust the resume's language and style to align with the company's described tone.
    4.  **Do Not Fabricate:** You must not add new job roles, invent new skills, or create experiences the candidate does not have. Your role is to edit and enhance, not to create fiction.
    5.  **Preserve Formatting:** Maintain the overall structure and formatting of the original resume.
    6.  **Return Full Text:** The final output should be the complete, revised resume text.

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
