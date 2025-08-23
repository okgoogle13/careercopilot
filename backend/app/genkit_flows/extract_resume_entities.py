from typing import Any, Dict, List

from pydantic import BaseModel, Field

from .shared import create_extraction_flow


# Define the structured output model for resume entities
class ResumeEntities(BaseModel):
    skills: List[str] = Field(
        description="A comprehensive list of all skills mentioned in the resume."
    )
    experience: List[Dict[str, Any]] = Field(
        description="A list of job experiences, including titles, companies, and durations."
    )
    education: List[Dict[str, Any]] = Field(
        description="A list of educational qualifications, including degrees and institutions."
    )


# Define the prompt template
RESUME_PROMPT_TEMPLATE = """
Analyze the following resume text and extract the key entities as a structured JSON object.
Focus on skills, work experience, and education history.

Resume Text:
---
{input_text}
---
"""

# Create the flow
extractResumeEntities = create_extraction_flow(
    name="extractResumeEntities",
    prompt_template=RESUME_PROMPT_TEMPLATE,
    output_schema=ResumeEntities,
)
