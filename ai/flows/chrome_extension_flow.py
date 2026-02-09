import logging
import json
from typing import Optional

from app.core.genkit_init import get_model
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.schemas.chrome_extension import JobPostingData, JobAnalysisOutput

logger = logging.getLogger(__name__)

@async_genkit_flow(output_schema=JobAnalysisOutput)
async def analyzeJobPostingFlow(job_data: JobPostingData) -> JobAnalysisOutput:
    """
    Genkit flow for analyzing a job posting from the Chrome Extension.
    """
    logger.info(f"Analyzing job posting: {job_data.title} at {job_data.company}")
    
    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available")

    resume_context = ""
    if job_data.resume_text:
        resume_context = f"\n\nCANDIDATE RESUME:\n{job_data.resume_text}\n"

    prompt = f"""
You are an expert Career Coach and AI Analyst. Analyze the following job posting{ " based on the candidate's resume" if job_data.resume_text else "" }.

JOB TITLE: {job_data.title}
COMPANY: {job_data.company or "Unknown"}
LOCATION: {job_data.location or "Unknown"}
SOURCE URL: {job_data.url}

JOB DESCRIPTION:
{job_data.description[:8000]}

{resume_context}

Provide a comprehensive analysis. 
Return structured data including:
1. Overall Fit Score (0-100)
2. Matching Qualifications
3. Gaps & Development Areas
4. Key Selling Points
5. Application Strategy
6. Metadata: deadline (YYYY-MM-DD or null), is_remote (bool), match_score (0-100)
"""

    try:
        response = await model.generate(
            prompt=prompt,
            output_schema=JobAnalysisOutput,
            config={"response_mime_type": "application/json"}
        )
        
        output = response.output()
        # Use model_validate if it's already a model, but Genkit usually returns the instance
        return output

    except Exception as e:
        logger.error(f"Job analysis flow failed: {e}")
        raise
