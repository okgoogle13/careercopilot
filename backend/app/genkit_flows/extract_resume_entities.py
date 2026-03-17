from typing import Any

from pydantic import BaseModel, Field

from .shared import create_extraction_flow


# Define the structured output model for resume entities
class ResumeEntities(BaseModel):
    skills: list[str] = Field(
        description="A comprehensive list of all skills mentioned in the resume."
    )
    experience: list[dict[str, Any]] = Field(
        description="A list of job experiences, including 'title', 'company', 'start_year', and 'end_year'. For current jobs, end_year should be the current year."
    )
    education: list[dict[str, Any]] = Field(
        description="A list of educational qualifications, including 'degree_type' (e.g. Bachelor, Master) and 'institution'."
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
