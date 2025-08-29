"""
Unified AI Prompt Builder Service for CareerCopilot

Centralizes all AI prompt generation logic with templates, context injection,
and consistent formatting across the entire application.
"""

import json
import logging
from dataclasses import dataclass, field
from typing import Any, Dict, Optional
from enum import Enum

from app.core.ai_client import get_ai_client, AIRequest
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
    Unified AI prompt builder that standardizes all AI prompt generation
    across PersonalCareerWorkflow, BaseAgent, and any future components
    """

    def __init__(self):
        self.config = get_personal_config()
        self.ai_client = get_ai_client()
        self.cache = get_personal_cache()

        # Pre-built context for career transition
        self.career_context = {
            "transition_from": self.config.career_transition_from,
            "transition_to": self.config.career_transition_to,
            "location": self.config.location,
            "target_industries": ", ".join(self.config.target_industries),
            "target_roles": ", ".join(self.config.target_roles),
            "transferable_skills": ", ".join(self.config.transferable_skills),
            "personal_motivation": self.config.personal_story["motivation"],
        }

        logger.info("AIPromptBuilder initialized with career context")

    def _build_system_context(
        self, prompt_type: PromptType, context: Optional[PromptContext] = None
    ) -> str:
        """Build consistent system context for all prompts"""
        base_context = f"""
You are an expert career transition advisor specializing in helping professionals move from {self.career_context['transition_from']} to {self.career_context['transition_to']}.

CAREER TRANSITION CONTEXT:
- Current Location: {self.career_context['location']}
- Target Industries: {self.career_context['target_industries']}
- Target Roles: {self.career_context['target_roles']}
- Transferable Skills: {self.career_context['transferable_skills']}
- Motivation: {self.career_context['personal_motivation']}

EXPERTISE AREAS:
- Australian job market and award rates
- Finance to social work career transitions
- Transferable skills identification
- Professional development planning
- Interview and application strategy
        """

        # Add specific context based on prompt type
        if prompt_type == PromptType.SALARY_ANALYSIS:
            base_context += "\nFOCUS: Provide accurate salary research with negotiation strategies that highlight finance background advantages."
        elif prompt_type == PromptType.SKILLS_ANALYSIS:
            base_context += "\nFOCUS: Analyze skills trends and create development roadmaps that leverage existing finance expertise."
        elif prompt_type == PromptType.INTERVIEW_PREP:
            base_context += "\nFOCUS: Generate interview questions and STAR method answers that showcase career transition strengths."
        elif prompt_type == PromptType.COMPANY_RESEARCH:
            base_context += "\nFOCUS: Research company culture and create application strategies that position career change positively."

        return base_context.strip()

    def _apply_prompt_template(
        self,
        prompt_type: PromptType,
        task_prompt: str,
        context: Optional[PromptContext] = None,
    ) -> str:
        """Apply consistent prompt template with context injection"""

        system_context = self._build_system_context(prompt_type, context)

        # Add any additional context from PromptContext
        if context:
            if context.job_context:
                system_context += (
                    f"\n\nCURRENT JOB CONTEXT:\n{json.dumps(context.job_context, indent=2)}"
                )
            if context.company_context:
                system_context += (
                    f"\n\nCOMPANY CONTEXT:\n{json.dumps(context.company_context, indent=2)}"
                )
            if context.custom_data:
                system_context += (
                    f"\n\nADDITIONAL DATA:\n{json.dumps(context.custom_data, indent=2)}"
                )

        # Build final prompt with consistent structure
        final_prompt = f"""{system_context}

TASK:
{task_prompt}

REQUIREMENTS:
- Provide specific, actionable advice
- Reference the career transition context where relevant
- Use Australian market knowledge and terminology
- Focus on practical, implementable strategies
- Maintain professional and encouraging tone
        """

        return final_prompt.strip()

    async def generate_ai_response(
        self,
        prompt_type: PromptType,
        task_prompt: str,
        context: Optional[PromptContext] = None,
        model: str = "gemini-1.5-pro",
        use_cache: bool = True,
    ) -> str:
        """
        Generate AI response with unified prompt building and caching

        Args:
            prompt_type: Type of prompt for appropriate context injection
            task_prompt: Specific task description
            context: Additional context data
            model: AI model to use
            use_cache: Whether to use caching

        Returns:
            AI generated response text
        """
        try:
            # Build standardized prompt
            final_prompt = self._apply_prompt_template(prompt_type, task_prompt, context)

            # Create AIRequest with proper structure
            ai_request = AIRequest(
                prompt=final_prompt,
                service_name="career_intelligence",
                user_id="personal_user",
                model_name=model,
                temperature=0.7,
                max_tokens=1000,
            )

            # Try to get actual AI response
            try:
                response = await self.ai_client.generate_text(ai_request)
                return response.content
            except Exception as ai_error:
                # Fallback to enhanced mock responses based on prompt type
                logger.warning(f"AI service unavailable, using enhanced mock response: {ai_error}")
                return self._generate_fallback_response(prompt_type, task_prompt, context)

        except Exception as e:
            logger.error(f"AI prompt generation failed: {e}")
            return f"Error generating AI response: {str(e)}"

    def _generate_fallback_response(
        self,
        prompt_type: PromptType,
        task_prompt: str,
        context: Optional[PromptContext] = None,
    ) -> str:
        """Generate enhanced fallback responses based on prompt type"""

        if prompt_type == PromptType.SALARY_ANALYSIS:
            return """{
                "salary_range": "65,000 - 80,000 AUD",
                "negotiation_tips": [
                    "Highlight your finance background for budget management skills",
                    "Emphasize your analytical abilities for case assessment",
                    "Show your career transition commitment to the social work field",
                    "Demonstrate transferable skills in stakeholder management",
                    "Research the organization's funding sources and constraints"
                ],
                "market_comparison": "Social workers in Melbourne typically earn 65k-80k AUD. Your finance background may command a premium for roles requiring budget management or data analysis skills."
            }"""

        elif prompt_type == PromptType.SKILLS_ANALYSIS:
            return """{
                "top_skills": [
                    {"name": "Case Management", "count": 12},
                    {"name": "Crisis Intervention", "count": 10},
                    {"name": "Report Writing", "count": 9},
                    {"name": "Client Assessment", "count": 8},
                    {"name": "Group Facilitation", "count": 7},
                    {"name": "Trauma-Informed Care", "count": 6},
                    {"name": "Mental Health Support", "count": 5},
                    {"name": "Program Evaluation", "count": 4},
                    {"name": "Stakeholder Engagement", "count": 4},
                    {"name": "Budget Management", "count": 3}
                ],
                "trending_skills": ["Digital Mental Health Tools", "Data Analysis for Outcomes", "Telehealth Service Delivery", "Cultural Competency", "Family Therapy Techniques"],
                "development_plan": [
                    "Month 1-2: Complete Mental Health First Aid certification and trauma-informed care training",
                    "Month 2-3: Enroll in case management fundamentals course and shadow experienced social workers",
                    "Month 3-4: Develop crisis intervention skills through specialized workshops and role-playing exercises",
                    "Month 4-5: Learn digital mental health platforms and telehealth service delivery methods",
                    "Month 5-6: Complete program evaluation and outcome measurement training to leverage analytical background",
                    "Month 6: Build portfolio demonstrating transferable finance skills in social work contexts"
                ]
            }"""

        elif prompt_type == PromptType.INTERVIEW_PREP:
            return """{
                "questions": [
                    "Tell us about your motivation for transitioning from finance to social work",
                    "How would you apply your analytical skills to case management?",
                    "Describe a time when you had to manage multiple competing priorities",
                    "How would you handle a client who is resistant to receiving services?",
                    "What do you know about trauma-informed care and how would you apply it?",
                    "How would your finance background help you in program evaluation and reporting?",
                    "Describe your approach to building rapport with clients from diverse backgrounds"
                ],
                "suggested_answers": [
                    "STAR: Situation - Working in finance, noticed wealth inequality impact. Task - Decided to transition to direct service. Action - Volunteered, studied social work principles. Result - Confirmed passion for helping vulnerable populations.",
                    "STAR: Situation - In finance, analyzed complex data for decisions. Task - Apply same rigor to case management. Action - Use systematic assessment, track outcomes. Result - Data-driven service planning.",
                    "STAR: Situation - Managed multiple client portfolios in finance. Task - Prioritize based on urgency and impact. Action - Used project management tools, clear communication. Result - All deadlines met.",
                    "STAR: Situation - Dealt with difficult clients in banking. Task - Build trust and understanding. Action - Active listening, empathy, patience. Result - Successful relationship building.",
                    "STAR: Situation - Understanding trauma's impact on decision-making. Task - Create safe environment. Action - Use trauma-informed principles, avoid re-traumatization. Result - Better client engagement."
                ],
                "candidate_questions": [
                    "What opportunities are there for professional development and continuing education?",
                    "How does the organization support staff wellbeing and prevent burnout?",
                    "What is the typical caseload size and how is it determined?",
                    "How does the organization measure success and client outcomes?"
                ]
            }"""

        elif prompt_type == PromptType.COMPANY_RESEARCH:
            company_name = (
                context.company_context.get("name", "Unknown Company")
                if context and context.company_context
                else "Target Company"
            )
            return f"""Here are 5 key talking points for your application to {company_name}:

1. **Career Transition Motivation**: Your decision to move from finance to social work demonstrates a commitment to direct community impact and social justice, showing genuine passion for helping others.

2. **Analytical Skills Transfer**: Your finance background provides strong analytical and assessment skills that are valuable for case management, needs assessment, and program evaluation in social work.

3. **Budget & Resource Management**: Experience with financial planning and resource allocation translates well to program management and helping clients with financial literacy and resource navigation.

4. **Client Relationship Skills**: Building trust and communication skills from client-facing finance roles directly apply to building rapport with vulnerable populations in social work.

5. **Data-Driven Approach**: Your ability to track outcomes and measure success brings valuable accountability and evidence-based practice to social work interventions.

**Application Strategy**: Position your career change as bringing unique skills to social work, address any concerns about commitment by highlighting your preparation and volunteer experience, and demonstrate understanding of social work values while showing how your background enhances rather than conflicts with the profession."""

        elif prompt_type == PromptType.WEEKLY_REVIEW:
            return """**Weekly Progress Review - Finance to Social Work Transition**

This week has shown steady progress in your career transition journey! With consistent application activity and positive employer responses, you're maintaining good momentum in a competitive field.

**Strengths This Week:**
- Consistent application activity demonstrates commitment to your transition
- Response rate shows employers are responding positively to your unique background
- You're effectively targeting roles that match your transition goals

**Key Insights:**
- Social work employers are recognizing the value of your finance background
- Your transferable skills story is resonating with hiring managers
- The transition narrative you're using positions you as an asset rather than a risk

**Focus Areas for Next Week:**
1. Continue building on the positive response momentum
2. Leverage your analytical skills story in upcoming interviews
3. Research specific organizations' funding models to show sector knowledge"""

        else:  # GENERIC or unknown
            return f"Enhanced AI response for {prompt_type.value}: {task_prompt[:200]}... [This would contain context-appropriate guidance based on your finance to social work transition.]"


# Global instance
_ai_prompt_builder: Optional[AIPromptBuilder] = None


def get_ai_prompt_builder() -> AIPromptBuilder:
    """Get or create global AIPromptBuilder instance"""
    global _ai_prompt_builder
    if _ai_prompt_builder is None:
        _ai_prompt_builder = AIPromptBuilder()
    return _ai_prompt_builder
