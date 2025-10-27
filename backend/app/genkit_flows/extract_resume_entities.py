from .shared import create_extraction_flow
from app.models.schemas import ResumeEntities # Import from centralized schema


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
