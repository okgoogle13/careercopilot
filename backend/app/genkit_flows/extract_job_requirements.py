from pydantic import BaseModel, Field

from .shared import create_extraction_flow


# Define the structured output model for job requirements
class JobRequirements(BaseModel):
    jobTitle: str = Field(
        description="The exact functional job title from the posting (e.g., 'Frontend Engineer').",
        default="Unknown Role",
    )
    requiredSkills: list[str] = Field(
        description="A list of essential skills explicitly mentioned as required."
    )
    preferredSkills: list[str] = Field(
        description="A list of skills mentioned as preferred, desired, or 'a plus'."
    )
    experienceLevel: str = Field(
        description="The required experience level (e.g., 'Entry-level', 'Mid-level', 'Senior', '5+ years')."
    )
    degreeRequirement: str = Field(
        description="The minimum degree required, if any (e.g., 'Bachelor', 'Master', 'High School'). Leave blank if not stated.",
        default="",
    )


# Define the prompt template
JOB_PROMPT_TEMPLATE = """
Analyze the following job description and extract the specified entities.
Your output MUST be a valid JSON object matching the defined schema.

Job Description:
---
{input_text}
---
"""

# Create the flow
extractJobRequirements = create_extraction_flow(
    name="extractJobRequirements",
    prompt_template=JOB_PROMPT_TEMPLATE,
    output_schema=JobRequirements,
)
