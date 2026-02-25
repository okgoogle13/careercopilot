"""
company_context.py

Genkit flow for generating company context using AI knowledge (no web scraping).
Provides insights for cover letters, KSC responses, and interview preparation.

This is a fresh implementation that replaces the fragile web scraping approaches
from the stale branches with a more reliable AI-based solution.
"""

from pydantic import BaseModel, Field
from typing import List
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.core.genkit import get_model
import logging
import json

logger = logging.getLogger(__name__)


class CompanyContext(BaseModel):
    """Company context for applications and interview prep"""

    recent_achievements: List[str] = Field(
        description="2-3 recent notable achievements or initiatives",
        default_factory=list
    )
    core_values: List[str] = Field(
        description="3-5 core company values",
        default_factory=list
    )
    recommended_tone: str = Field(
        description="Recommended tone: formal, conversational, or enthusiastic",
        default="conversational"
    )
    why_work_here_points: List[str] = Field(
        description="Key talking points for 'Why this company?'",
        default_factory=list
    )
    interview_questions: List[str] = Field(
        description="3 intelligent questions to ask the interviewer",
        default_factory=list
    )
    cultural_insights: str = Field(
        description="Work style and communication preferences",
        default=""
    )


@async_genkit_flow(
    name="generate_company_context",
    output_schema=CompanyContext
)
async def generate_company_context(
    company_name: str,
    job_description: str
) -> CompanyContext:
    """
    Generate company context using AI knowledge (no web scraping).
    Useful for cover letters, KSC responses, and interview prep.

    This flow provides:
    - Recent company achievements to reference in applications
    - Core values for alignment in cover letters and KSC responses
    - Recommended tone for authentic communication
    - Interview preparation insights

    Args:
        company_name: Name of the target company
        job_description: The job posting text for context

    Returns:
        CompanyContext: Comprehensive company insights

    Example:
        context = await generate_company_context(
            company_name="Google",
            job_description="Senior Software Engineer role..."
        )
        # Use context.recent_achievements in cover letter
        # Use context.interview_questions for interview prep
    """

    prompt = f"""
Based on your knowledge of {company_name}, provide comprehensive context for a job application.

Job Description Context:
{job_description[:800]}

Provide:

1. RECENT ACHIEVEMENTS (2-3 items):
   - Notable product launches, expansions, or milestones from the past year
   - Be specific with dates/details when possible
   - Focus on achievements relevant to the job role

2. CORE VALUES (3-5 keywords):
   - Company's stated or demonstrated values
   - Cultural priorities
   - What the company emphasizes in their mission

3. RECOMMENDED TONE:
   - Choose ONE: formal, conversational, or enthusiastic
   - Based on company culture and job level
   - Consider industry norms

4. "WHY THIS COMPANY?" TALKING POINTS (3-4 items):
   - Specific reasons someone would want to work there
   - Unique aspects of the company
   - Growth opportunities or impact potential

5. INTERVIEW QUESTIONS (3 items):
   - Intelligent questions to ask the interviewer
   - Show research and genuine interest
   - Relevant to the role and company

6. CULTURAL INSIGHTS (2-3 sentences):
   - Work style (collaborative, autonomous, fast-paced, etc.)
   - Communication preferences
   - What makes employees successful there

**Output Format:**
Return a JSON object with these exact fields:
- recent_achievements: array of strings
- core_values: array of strings
- recommended_tone: string (formal/conversational/enthusiastic)
- why_work_here_points: array of strings
- interview_questions: array of strings
- cultural_insights: string

Keep responses concise and relevant for job applications.
"""

    try:
        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        # Generate company context using the model
        response = model.generate(
            prompt=prompt,
            generation_config={
                "temperature": 0.3,  # Slightly higher for more varied insights
                "response_mime_type": "application/json"
            }
        )

        # Parse the response
        if hasattr(response, 'text'):
            result_data = json.loads(response.text)

            return CompanyContext(
                recent_achievements=result_data.get("recent_achievements", []),
                core_values=result_data.get("core_values", []),
                recommended_tone=result_data.get("recommended_tone", "conversational"),
                why_work_here_points=result_data.get("why_work_here_points", []),
                interview_questions=result_data.get("interview_questions", []),
                cultural_insights=result_data.get("cultural_insights", "")
            )
        else:
            raise ValueError("Failed to generate company context from the model")

    except Exception as e:
        logger.error(f"Company context generation failed: {str(e)}", exc_info=True)
        # Return minimal context on failure
        return CompanyContext(
            recent_achievements=[f"Unable to fetch recent achievements for {company_name}"],
            core_values=["Innovation", "Excellence", "Collaboration"],
            recommended_tone="conversational",
            why_work_here_points=[f"Opportunity to work at {company_name}"],
            interview_questions=[
                "What are the biggest challenges for this role?",
                "How does the team measure success?",
                "What opportunities exist for growth?"
            ],
            cultural_insights="Research the company's culture through their website and employee reviews."
        )
