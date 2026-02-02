"""
Unified AI Prompt Builder Service for CareerCopilot (Bridged to Genkit)

Centralizes all AI prompt generation logic with templates, context injection,
and consistent formatting across the entire application by delegating to Genkit flows.
"""

import json
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, Optional

from app.genkit_flows.career_intelligence import careerIntelligenceFlow
from app.schemas.ai import CareerIntelligenceRequest
from app.core.config import get_personal_config
from app.core.personal_cache import get_personal_cache

logger = logging.getLogger(__name__)


class PromptType(Enum):
    """Enum for different types of AI prompts"""

    SALARY_ANALYSIS = "salary_analysis"
    SKILLS_ANALYSIS = "skills_analysis"
    INTERVIEW_PREP = "interview_prep"
    COMPANY_RESEARCH = "company_research"
    APPLICATION_STRATEGY = "application_strategy"
    WEEKLY_REVIEW = "weekly_review"
    GENERIC = "generic"


@dataclass
class PromptContext:
    """Context data for AI prompt generation"""

    user_config: Optional[Dict[str, Any]] = None
    career_context: Optional[Dict[str, str]] = None
    location_context: Optional[str] = None
    job_context: Optional[Dict[str, Any]] = None
    company_context: Optional[Dict[str, Any]] = None
    custom_data: Dict[str, Any] = field(default_factory=dict)


class AIPromptBuilder:
    """
    Bridged AI prompt builder that standardizes all AI prompt generation
    by delegating to modern Genkit flows.
    """

    def __init__(self):
        self.config = get_personal_config()
        self.cache = get_personal_cache()

        # Pre-built context for career transition
        self.career_context = {
            "transition_from": self.config.career_transition_from,
            "transition_to": self.config.career_transition_to,
            "location": self.config.location,
            "target_industries": ", ".join(self.config.target_industries),
            "target_roles": ", ".join(self.config.target_roles),
            "transferable_skills": ", ".join(self.config.transferable_skills),
            "personal_motivation": self.config.personal_story.get("motivation", ""),
        }

        logger.info("AIPromptBuilder (Bridged) initialized")

    async def generate_ai_response(
        self,
        prompt_type: PromptType,
        task_prompt: str,
        context: Optional[PromptContext] = None,
        model: str = "gemini-3.0-flash",
        use_cache: bool = True,
    ) -> str:
        """
        Generate AI response by delegating to careerIntelligenceFlow.
        """
        try:
            # Prepare context data for the flow
            context_data = {
                "career_context": self.career_context
            }

            if context:
                if context.job_context:
                    context_data["job_context"] = context.job_context
                if context.company_context:
                    context_data["company_context"] = context.company_context
                if context.custom_data:
                    context_data["custom_data"] = context.custom_data

            request = CareerIntelligenceRequest(
                prompt_type=prompt_type.value,
                task_prompt=task_prompt,
                user_id="personal_user",
                context_data=context_data
            )

            # Execute Genkit Flow
            response = await careerIntelligenceFlow(request)
            return response.content

        except Exception as e:
            logger.error(f"Bridged AI prompt generation failed: {e}")
            return f"Error generating AI response: {str(e)}"


# Global instance
_ai_prompt_builder: Optional[AIPromptBuilder] = None


def get_ai_prompt_builder() -> AIPromptBuilder:
    """Get or create global AIPromptBuilder instance"""
    global _ai_prompt_builder
    if _ai_prompt_builder is None:
        _ai_prompt_builder = AIPromptBuilder()
    return _ai_prompt_builder
