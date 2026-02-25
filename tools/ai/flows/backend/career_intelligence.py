import logging
import json
from typing import Any, Dict, Optional, List
from pydantic import BaseModel, Field

from app.core.genkit import get_model
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.schemas.ai import (
    CareerIntelligenceRequest,
    AIResponseModel,
    SalaryAnalysisResponse,
    SkillsAnalysisResponse,
    InterviewPrepResponse,
    CompanyResearchResponse
)

logger = logging.getLogger(__name__)

def _build_system_context(request: CareerIntelligenceRequest) -> str:
    """Build standardized system context from request data"""
    career_context = request.context_data.get("career_context", {})

    trans_from = career_context.get("transition_from", "Finance")
    trans_to = career_context.get("transition_to", "Social Work")
    location = career_context.get("location", "Australia")
    target_industries = career_context.get("target_industries", "")
    target_roles = career_context.get("target_roles", "")
    transferable_skills = career_context.get("transferable_skills", "")
    motivation = career_context.get("personal_motivation", "")

    base_context = f"""
You are an expert career transition advisor specializing in helping professionals move from {trans_from} to {trans_to}.

CAREER TRANSITION CONTEXT:
- Current Location: {location}
- Target Industries: {target_industries}
- Target Roles: {target_roles}
- Transferable Skills: {transferable_skills}
- Motivation: {motivation}

EXPERTISE AREAS:
- Australian job market and award rates
- Career transitions
- Transferable skills identification
- Professional development planning
- Interview and application strategy
    """

    ptype = request.prompt_type
    if ptype == "salary_analysis":
        base_context += "\nFOCUS: Provide accurate salary research with negotiation strategies."
    elif ptype == "skills_analysis":
        base_context += "\nFOCUS: Analyze skills trends and create development roadmaps."
    elif ptype == "interview_prep":
        base_context += "\nFOCUS: Generate interview questions and STAR method answers."
    elif ptype == "company_research":
        base_context += "\nFOCUS: Research company culture and create application strategies."

    return base_context.strip()

@async_genkit_flow(output_schema=AIResponseModel)
async def careerIntelligenceFlow(request: CareerIntelligenceRequest) -> AIResponseModel:
    """
    Unified AI flow for career intelligence operations.
    Replaces legacy AIPromptBuilder and LLMService direct calls.
    """
    logger.info(f"Executing careerIntelligenceFlow for user {request.user_id}, type {request.prompt_type}")

    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not initialized")

    system_context = _build_system_context(request)

    # Inject additional context
    context_str = ""
    if job_ctx := request.context_data.get("job_context"):
        context_str += f"\n\nCURRENT JOB CONTEXT:\n{json.dumps(job_ctx)}"
    if comp_ctx := request.context_data.get("company_context"):
        context_str += f"\n\nCOMPANY CONTEXT:\n{json.dumps(comp_ctx)}"
    if custom := request.context_data.get("custom_data"):
        context_str += f"\n\nADDITIONAL DATA:\n{json.dumps(custom)}"

    final_prompt = f"""{system_context}
{context_str}

TASK:
{request.task_prompt}

REQUIREMENTS:
- Provide specific, actionable advice
- Reference the career transition context where relevant
- Use local market knowledge and terminology
- Focus on practical, implementable strategies
- Maintain professional and encouraging tone
    """

    # Determine desired output schema based on prompt_type if possible
    output_schema = None
    if request.prompt_type == "salary_analysis":
        output_schema = SalaryAnalysisResponse
    elif request.prompt_type == "skills_analysis":
        output_schema = SkillsAnalysisResponse
    elif request.prompt_type == "interview_prep":
        output_schema = InterviewPrepResponse
    elif request.prompt_type == "company_research":
        output_schema = CompanyResearchResponse

    import time
    start_time = time.time()

    try:
        if output_schema:
            response = await model.generate(
                prompt=final_prompt,
                output_schema=output_schema,
                config={"response_mime_type": "application/json"}
            )
            content = json.dumps(response.output().model_dump())
        else:
            response = await model.generate(final_prompt)
            if hasattr(response, "text"):
                content = response.text
            else:
                content = str(response)

        duration = (time.time() - start_time) * 1000

        return AIResponseModel(
            content=content,
            model_used=getattr(model, "model_name", "gemini-3.0-flash"),
            response_time_ms=duration,
            metadata={"prompt_type": request.prompt_type}
        )

    except Exception as e:
        logger.error(f"Career intelligence flow failed: {e}")
        raise
