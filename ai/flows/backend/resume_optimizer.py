"""
resume_optimizer.py

Genkit flow for optimizing resumes by naturally integrating missing keywords
from ATS analysis without fabricating experience or skills.

Modernized to use async patterns and current Genkit architecture.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.core.genkit_init import get_model
import logging
import json

logger = logging.getLogger(__name__)


class OptimizedResume(BaseModel):
    """The full, optimized resume text with keywords naturally integrated."""

    resume_text: str = Field(
        description="The complete and updated resume text, with keywords naturally integrated."
    )
    keywords_integrated: List[str] = Field(
        default_factory=list,
        description="List of keywords that were successfully integrated into the resume."
    )


@async_genkit_flow(
    name="optimize_resume",
    output_schema=OptimizedResume
)
async def optimize_resume(
    resume_text: str,
    missing_keywords: List[str],
    job_description: str
) -> OptimizedResume:
    """
    Analyzes a resume and a list of missing keywords, then rewrites the resume
    to naturally incorporate those keywords in the context of the job description.

    This flow enhances ATS scores by integrating relevant keywords while maintaining
    authenticity and avoiding fabrication of experience.

    Args:
        resume_text: The original resume text
        missing_keywords: List of keywords identified as missing by ATS analysis
        job_description: The target job description for context

    Returns:
        OptimizedResume: The enhanced resume with keywords naturally integrated

    Example:
        result = await optimize_resume(
            resume_text="Software Engineer with 5 years experience...",
            missing_keywords=["Project Management", "Agile", "Python"],
            job_description="We're looking for a Senior Software Engineer..."
        )
    """

    if not missing_keywords:
        logger.info("No missing keywords to integrate, returning original resume")
        return OptimizedResume(
            resume_text=resume_text,
            keywords_integrated=[]
        )

    keywords_str = ", ".join(missing_keywords)

    prompt = f"""
You are an expert resume editor. Your task is to revise the provided resume to seamlessly integrate a list of missing keywords.
The goal is to make the resume a stronger match for the target job description without inventing new experiences or skills.

**Target Job Description:**
---
{job_description}
---

**Original Resume:**
---
{resume_text}
---

**Keywords to Integrate:**
- {keywords_str}

**Instructions:**
1. **Analyze Context:** Read the job description and the original resume to understand the candidate's experience and the employer's needs.
2. **Integrate Naturally:** Weave the keywords into the existing text of the resume. Rephrase bullet points or summaries where appropriate. For example, if a keyword is "Project Management" and the resume says "Led a team," you could change it to "Applied strong Project Management skills to lead a team."
3. **Do Not Fabricate:** You must not add new job roles, invent new skills, or create experiences the candidate does not have. Your role is to edit and enhance, not to create fiction.
4. **Preserve Formatting:** Maintain the overall structure and formatting of the original resume.
5. **Track Integration:** Note which keywords you successfully integrated.

**Output Format:**
Return a JSON object with:
- resume_text: The complete, revised resume text
- keywords_integrated: Array of keywords that were successfully integrated

Now, please generate the optimized resume.
"""

    try:
        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        # Generate optimized resume using the model
        response = model.generate(
            prompt=prompt,
            generation_config={
                "temperature": 0.2,  # Lower temperature for focused, less creative output
                "response_mime_type": "application/json"
            }
        )

        # Parse the response
        if hasattr(response, 'text'):
            result_data = json.loads(response.text)

            return OptimizedResume(
                resume_text=result_data.get("resume_text", resume_text),
                keywords_integrated=result_data.get("keywords_integrated", missing_keywords)
            )
        else:
            raise ValueError("Failed to generate an optimized resume from the model")

    except Exception as e:
        logger.error(f"Resume optimization failed: {str(e)}", exc_info=True)
        # Return original resume on failure
        return OptimizedResume(
            resume_text=resume_text,
            keywords_integrated=[]
        )
