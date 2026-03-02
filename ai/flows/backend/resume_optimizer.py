"""
resume_optimizer.py

Genkit flow for optimizing resumes by naturally integrating missing keywords
from ATS analysis without fabricating experience or skills.

Modernized to use async patterns and current Genkit architecture.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from ai.flows.backend.flow_decorator import async_genkit_flow
from app.core.genkit import get_model
from app.core.prompt_service import format_prompt
from ai.schemas.backend.document_models import CareerProfile, TailoredResumeResult
import logging
import json

logger = logging.getLogger(__name__)


@async_genkit_flow(
    name="optimize_resume",
    output_schema=TailoredResumeResult
)
async def optimize_resume(
    profile: CareerProfile,
    missing_keywords: List[str],
) -> TailoredResumeResult:
    """
    Analyzes a CareerProfile and a list of missing keywords, then rewrites the resume
    to naturally incorporate those keywords in the context of the job description.

    This flow enhances ATS scores by integrating relevant keywords while maintaining
    authenticity and avoiding fabrication of experience.

    Args:
        profile: Unified CareerProfile which includes job context
        missing_keywords: List of keywords identified as missing by ATS analysis

    Returns:
        OptimizedResume: The enhanced resume with keywords naturally integrated
    """

    if not missing_keywords:
        resume_text = profile.raw_resume_text or profile.summary or "Resume content not provided"
        logger.info("No missing keywords to integrate, returning original resume")
        return TailoredResumeResult(
            tailored_text=resume_text,
            original_score=0,
            tailored_score=0,
            improvements_made=[],
            keywords_integrated=[],
            competitive_advantages=[]
        )

    keywords_str = ", ".join(missing_keywords)
    job_desc = profile.job_context.description if profile.job_context else "Target job description not provided"

    prompt = format_prompt(
        "resume_optimize",
        job_description=job_desc,
        career_profile=profile.model_dump_json(exclude={"job_context", "selection_criteria"}),
        missing_keywords=keywords_str,
    )

    try:
        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        # Generate optimized resume using the model
        response = await model.generate(
            prompt=prompt,
            config={
                "temperature": 0.2,  # Lower temperature for focused, less creative output
                "response_mime_type": "application/json"
            },
            output_schema=TailoredResumeResult
        )

        # Parse the response
        return await response.output()

    except Exception as e:
        logger.error(f"Resume optimization failed: {str(e)}", exc_info=True)
        # Return original resume summary/raw text on failure
        return TailoredResumeResult(
            tailored_text=profile.raw_resume_text or profile.summary or "Optimization failed",
            original_score=0,
            tailored_score=0,
            improvements_made=[],
            keywords_integrated=[],
            competitive_advantages=[]
        )
