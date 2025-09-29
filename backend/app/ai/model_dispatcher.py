# backend/app/ai/model_dispatcher.py

from typing import Dict, List, Optional
from .llm_service import get_llm_response
from app.core.loguru_config import get_logger
import os

logger = get_logger(__name__)

# Define models by cost/capability (from cheapest to most expensive)
MODEL_ULTRAFAST = "gemini-1.5-flash-8b"     # Ultra-fast, minimal cost
MODEL_FAST = "gemini-1.5-flash"             # Fast, low cost
MODEL_BALANCED = "gemini-1.5-pro"           # Balanced cost/capability
MODEL_PREMIUM = "gemini-1.5-pro-002"        # Premium capability

# Task complexity mapping
TASK_COMPLEXITY_MAP = {
    # Simple tasks - use fastest/cheapest models
    "keyword_extraction": MODEL_ULTRAFAST,
    "simple_classification": MODEL_ULTRAFAST,
    "basic_formatting": MODEL_ULTRAFAST,
    "spell_check": MODEL_ULTRAFAST,

    # Medium complexity tasks
    "resume_parsing": MODEL_FAST,
    "job_matching": MODEL_FAST,
    "skill_assessment": MODEL_FAST,
    "content_summarization": MODEL_FAST,

    # Complex tasks - require more sophisticated models
    "cover_letter_generation": MODEL_BALANCED,
    "resume_optimization": MODEL_BALANCED,
    "interview_preparation": MODEL_BALANCED,
    "career_advice": MODEL_BALANCED,

    # Premium tasks - highest capability needed
    "complex_reasoning": MODEL_PREMIUM,
    "code_generation": MODEL_PREMIUM,
    "detailed_analysis": MODEL_PREMIUM,
    "strategic_planning": MODEL_PREMIUM,
}

# Cost estimation (tokens per dollar - approximate)
MODEL_COSTS = {
    MODEL_ULTRAFAST: {"input": 0.000075, "output": 0.0003},    # Ultra-cheap
    MODEL_FAST: {"input": 0.00015, "output": 0.0006},          # Low cost
    MODEL_BALANCED: {"input": 0.00125, "output": 0.005},       # Medium cost
    MODEL_PREMIUM: {"input": 0.0025, "output": 0.01},          # Premium cost
}

def dispatch_llm_call(
    task_type: str,
    prompt: str,
    force_model: Optional[str] = None,
    temperature: float = 0.5,
    max_tokens: Optional[int] = None
) -> Dict:
    """
    Selects an appropriate LLM based on the task type to optimize cost.

    Args:
        task_type: Type of task to determine model complexity needs
        prompt: The input prompt for the LLM
        force_model: Override automatic model selection
        temperature: Model temperature (0.0-1.0)
        max_tokens: Maximum tokens to generate

    Returns:
        Dictionary containing the LLM response with cost information
    """
    # Select model based on task complexity or use forced model
    if force_model and force_model in MODEL_COSTS:
        selected_model = force_model
        selection_reason = "forced_override"
    else:
        selected_model = TASK_COMPLEXITY_MAP.get(task_type, MODEL_BALANCED)
        selection_reason = "task_complexity"

    logger.info(
        "Model selected for LLM call",
        task_type=task_type,
        model=selected_model,
        reason=selection_reason,
        prompt_length=len(prompt)
    )

    # Prepare model parameters
    model_params = {
        "model": selected_model,
        "temperature": temperature,
        "task_type": task_type
    }

    if max_tokens:
        model_params["max_tokens"] = max_tokens

    # Make the LLM call through the caching service
    response = get_llm_response(prompt, model_params)

    # Add cost estimation to response
    response["cost_info"] = estimate_cost(selected_model, prompt, response.get("response", ""))
    response["model_selection"] = {
        "selected_model": selected_model,
        "task_type": task_type,
        "selection_reason": selection_reason
    }

    return response

def estimate_cost(model: str, input_text: str, output_text: str) -> Dict:
    """
    Estimate the cost of an LLM call.

    Args:
        model: Model used for the call
        input_text: Input prompt text
        output_text: Generated response text

    Returns:
        Dictionary with cost estimation details
    """
    if model not in MODEL_COSTS:
        return {"error": "Unknown model for cost estimation"}

    # Rough token estimation (1 token ≈ 0.75 words)
    input_tokens = len(input_text.split()) / 0.75
    output_tokens = len(output_text.split()) / 0.75

    costs = MODEL_COSTS[model]
    input_cost = input_tokens * costs["input"] / 1000  # API pricing per 1K tokens
    output_cost = output_tokens * costs["output"] / 1000
    total_cost = input_cost + output_cost

    return {
        "model": model,
        "input_tokens": int(input_tokens),
        "output_tokens": int(output_tokens),
        "input_cost_usd": round(input_cost, 6),
        "output_cost_usd": round(output_cost, 6),
        "total_cost_usd": round(total_cost, 6)
    }

def get_model_recommendations(task_types: List[str]) -> Dict:
    """
    Get model recommendations for multiple task types.

    Args:
        task_types: List of task types to analyze

    Returns:
        Dictionary with recommendations and potential savings
    """
    recommendations = {}
    total_premium_cost = 0
    total_optimized_cost = 0

    for task_type in task_types:
        recommended_model = TASK_COMPLEXITY_MAP.get(task_type, MODEL_BALANCED)
        premium_model = MODEL_PREMIUM

        # Calculate potential savings vs always using premium model
        sample_prompt = "Sample prompt for cost estimation"
        sample_response = "Sample response for cost estimation"

        optimized_cost = estimate_cost(recommended_model, sample_prompt, sample_response)
        premium_cost = estimate_cost(premium_model, sample_prompt, sample_response)

        savings = premium_cost["total_cost_usd"] - optimized_cost["total_cost_usd"]
        savings_percent = (savings / premium_cost["total_cost_usd"]) * 100 if premium_cost["total_cost_usd"] > 0 else 0

        recommendations[task_type] = {
            "recommended_model": recommended_model,
            "cost_per_call": optimized_cost["total_cost_usd"],
            "savings_vs_premium": savings,
            "savings_percent": round(savings_percent, 1)
        }

        total_optimized_cost += optimized_cost["total_cost_usd"]
        total_premium_cost += premium_cost["total_cost_usd"]

    overall_savings = total_premium_cost - total_optimized_cost
    overall_savings_percent = (overall_savings / total_premium_cost) * 100 if total_premium_cost > 0 else 0

    return {
        "task_recommendations": recommendations,
        "overall_savings": {
            "total_optimized_cost": round(total_optimized_cost, 6),
            "total_premium_cost": round(total_premium_cost, 6),
            "total_savings": round(overall_savings, 6),
            "savings_percent": round(overall_savings_percent, 1)
        }
    }

# Convenience functions for common task types
def generate_cover_letter(job_description: str, user_profile: str) -> Dict:
    """Generate a cover letter using optimal model selection."""
    prompt = f"Generate a cover letter for this job:\n{job_description}\n\nUser profile:\n{user_profile}"
    return dispatch_llm_call("cover_letter_generation", prompt, temperature=0.7)

def optimize_resume(resume_content: str, job_description: str) -> Dict:
    """Optimize resume content using optimal model selection."""
    prompt = f"Optimize this resume for the job:\n{job_description}\n\nResume:\n{resume_content}"
    return dispatch_llm_call("resume_optimization", prompt, temperature=0.3)

def extract_keywords(job_description: str) -> Dict:
    """Extract keywords using the most cost-effective model."""
    prompt = f"Extract key skills and requirements from this job description:\n{job_description}"
    return dispatch_llm_call("keyword_extraction", prompt, temperature=0.1)