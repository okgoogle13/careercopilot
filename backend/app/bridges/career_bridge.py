import logging
from enum import Enum
from typing import Any

from app.core.config import get_personal_config
from app.genkit_flows.career_intelligence import careerIntelligenceFlow
from app.schemas.ai import CareerIntelligenceRequest

logger = logging.getLogger(__name__)

class PromptType(Enum):
    SALARY_ANALYSIS = "salary_analysis"
    SKILLS_ANALYSIS = "skills_analysis"
    INTERVIEW_PREP = "interview_prep"
    COMPANY_RESEARCH = "company_research"
    APPLICATION_STRATEGY = "application_strategy"
    WEEKLY_REVIEW = "weekly_review"
    GENERIC = "generic"

class AIPromptBuilderBridge:
    """
    Bridge for legacy AIPromptBuilder calls.
    Maintains compatibility while using Genkit flows internally.
    """

    def __init__(self):
        self.config = get_personal_config()
        self.career_context = {
            "transition_from": self.config.career_transition_from,
            "transition_to": self.config.career_transition_to,
            "location": self.config.location,
            "target_industries": ", ".join(self.config.target_industries),
            "target_roles": ", ".join(self.config.target_roles),
            "transferable_skills": ", ".join(self.config.transferable_skills),
            "personal_motivation": self.config.personal_story.get("motivation", ""),
        }

    async def generate_ai_response(
        self,
        prompt_type: PromptType,
        task_prompt: str,
        context: Any | None = None,
        model: str = "gemini-3.0-flash",
        use_cache: bool = True
    ) -> str:
        """Bridge method matching AIPromptBuilder.generate_ai_response"""

        # Prepare context data for the flow
        context_data = {
            "career_context": self.career_context
        }

        if context:
            if hasattr(context, "job_context"):
                context_data["job_context"] = context.job_context
            if hasattr(context, "company_context"):
                context_data["company_context"] = context.company_context
            if hasattr(context, "custom_data"):
                context_data["custom_data"] = context.custom_data

        request = CareerIntelligenceRequest(
            prompt_type=prompt_type.value,
            task_prompt=task_prompt,
            user_id="personal_user",
            context_data=context_data
        )

        try:
            response = await careerIntelligenceFlow(request)
            return response.content
        except Exception as e:
            logger.error(f"Bridge failed to execute flow: {e}")
            return f"Error: {e!s}"

# Global instance for easy replacement
_builder_bridge = AIPromptBuilderBridge()

def get_ai_prompt_builder():
    return _builder_bridge
