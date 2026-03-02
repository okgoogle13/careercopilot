"""
Unified Template Service for CareerCopilot

Centralizes all template generation and management including cover letters,
emails, follow-ups, and application materials with career transition context.
"""

import json
import logging
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
<<<<<<< HEAD
from typing import Any, Dict, List, Optional
=======
from typing import Any
>>>>>>> restoration-KR-Rage-Figma-v2.0

from app.core.config import get_personal_config
from app.services.ai_prompt_builder import PromptContext, PromptType, get_ai_prompt_builder

logger = logging.getLogger(__name__)


class TemplateType(Enum):
    """Types of templates available"""

    COVER_LETTER = "cover_letter"
    EMAIL_APPLICATION = "email_application"
    FOLLOW_UP_EMAIL = "follow_up_email"
    NETWORKING_EMAIL = "networking_email"
    INTERVIEW_THANK_YOU = "interview_thank_you"
    REFERENCE_REQUEST = "reference_request"


@dataclass
class TemplateContext:
    """Context data for template generation"""

<<<<<<< HEAD
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    contact_name: Optional[str] = None
    job_description: Optional[str] = None
    company_research: Optional[Dict[str, Any]] = None
    personal_notes: Optional[str] = None
    custom_data: Dict[str, Any] = field(default_factory=dict)
=======
    company_name: str | None = None
    job_title: str | None = None
    contact_name: str | None = None
    job_description: str | None = None
    company_research: dict[str, Any] | None = None
    personal_notes: str | None = None
    custom_data: dict[str, Any] = field(default_factory=dict)
>>>>>>> restoration-KR-Rage-Figma-v2.0


@dataclass
class GeneratedTemplate:
    """A generated template with metadata"""

    template_type: TemplateType
    content: str
<<<<<<< HEAD
    subject_line: Optional[str] = None
    placeholders: Dict[str, str] = field(default_factory=dict)
    customization_tips: List[str] = field(default_factory=list)
=======
    subject_line: str | None = None
    placeholders: dict[str, str] = field(default_factory=dict)
    customization_tips: list[str] = field(default_factory=list)
>>>>>>> restoration-KR-Rage-Figma-v2.0
    generated_at: str = field(default_factory=lambda: datetime.now().isoformat())


class TemplateService:
    """
    Unified template service that handles all template generation
    including emails, cover letters, and application materials
    """

    def __init__(self):
        self.config = get_personal_config()
        self.ai_prompt_builder = get_ai_prompt_builder()

        # Career transition context for all templates
        self.career_context = {
            "transition_from": self.config.career_transition_from,
            "transition_to": self.config.career_transition_to,
            "location": self.config.location,
            "target_industries": ", ".join(self.config.target_industries),
            "target_roles": ", ".join(self.config.target_roles),
            "transferable_skills": ", ".join(self.config.transferable_skills),
            "personal_motivation": self.config.personal_story["motivation"],
        }

        logger.info("TemplateService initialized with career context")

    async def generate_template(
<<<<<<< HEAD
        self, template_type: TemplateType, context: Optional[TemplateContext] = None
=======
        self, template_type: TemplateType, context: TemplateContext | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> GeneratedTemplate:
        """
        Generate a template of specified type with career transition context

        Args:
            template_type: Type of template to generate
            context: Additional context for template generation

        Returns:
            Generated template with content and metadata
        """
        try:
            # Build template-specific prompt
            prompt = self._build_template_prompt(template_type, context)

            # Create prompt context for AI generation
            prompt_context = PromptContext(
                job_context=(
                    {
                        "title": context.job_title if context else None,
                        "company": context.company_name if context else None,
                        "description": context.job_description if context else None,
                    }
                    if context
                    else None
                ),
                company_context=(
                    context.company_research if context and context.company_research else None
                ),
                custom_data={
                    "template_type": template_type.value,
                    "contact_name": context.contact_name if context else None,
                    "personal_notes": context.personal_notes if context else None,
                    **(context.custom_data if context else {}),
                },
            )

            # Try to generate template content with AI
            try:
                ai_response = await self.ai_prompt_builder.generate_ai_response(
                    PromptType.GENERIC,  # Templates use generic prompt type
                    prompt,
                    prompt_context,
                )

                # If response looks like a generic fallback, use our enhanced templates instead
                if "Enhanced AI response for generic" in ai_response:
                    logger.info(f"Using enhanced template fallback for {template_type.value}")
                    return self._generate_fallback_template(template_type, context)

                # Parse successful AI response
                return self._parse_template_response(template_type, ai_response, context)

            except Exception as ai_error:
                logger.info(f"AI generation failed, using enhanced template fallback: {ai_error}")
                return self._generate_fallback_template(template_type, context)

        except Exception as e:
            logger.error(f"Template generation failed for {template_type.value}: {e}")
            return self._generate_fallback_template(template_type, context)

    def _build_template_prompt(
<<<<<<< HEAD
        self, template_type: TemplateType, context: Optional[TemplateContext] = None
=======
        self, template_type: TemplateType, context: TemplateContext | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> str:
        """Build template-specific generation prompt"""

        base_context = f"""
Career Transition Context:
- Transitioning from {self.career_context['transition_from']} to {self.career_context['transition_to']}
- Location: {self.career_context['location']}
- Target Industries: {self.career_context['target_industries']}
- Transferable Skills: {self.career_context['transferable_skills']}
- Motivation: {self.career_context['personal_motivation']}
"""

        if template_type == TemplateType.EMAIL_APPLICATION:
            return f"""{base_context}

<<<<<<< HEAD
Generate a professional job application email template for someone transitioning from finance to social work.
=======
Generate a professional job application email template for someone transitioning from {self.career_context['transition_from']} to {self.career_context['transition_to']}.
>>>>>>> restoration-KR-Rage-Figma-v2.0

Requirements:
- Professional subject line with placeholders
- Compelling opening that addresses career transition positively
<<<<<<< HEAD
- Body that highlights transferable finance skills relevant to social work
=======
- Body that highlights transferable {self.career_context['transition_from']} skills relevant to {self.career_context['transition_to']}
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Clear call to action
- Professional closing
- Include placeholder system: [COMPANY_NAME], [JOB_TITLE], [CONTACT_NAME], [SPECIFIC_SKILL], [RELEVANT_EXPERIENCE]

Format as JSON with: subject_line, email_body, placeholders (dict), customization_tips (list)
"""

        elif template_type == TemplateType.FOLLOW_UP_EMAIL:
            return f"""{base_context}

Generate a professional follow-up email template for job applications.

Requirements:
- Polite subject line for following up
- Reference to original application
- Reiterate interest and unique value proposition from career transition
- Professional but not pushy tone
- Include placeholder system

Format as JSON with: subject_line, email_body, placeholders, customization_tips
"""

        elif template_type == TemplateType.NETWORKING_EMAIL:
            return f"""{base_context}

<<<<<<< HEAD
Generate a networking email template for career transition outreach.
=======
Generate a networking email template for career transition from {self.career_context['transition_from']} to {self.career_context['transition_to']}.
>>>>>>> restoration-KR-Rage-Figma-v2.0

Requirements:
- Engaging subject line
- Brief introduction with career transition story
- Specific ask (informational interview, advice, etc.)
<<<<<<< HEAD
- Value proposition of finance background in social work
=======
- Value proposition of {self.career_context['transition_from']} background in {self.career_context['transition_to']}
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Professional closing

Format as JSON with: subject_line, email_body, placeholders, customization_tips
"""

        elif template_type == TemplateType.INTERVIEW_THANK_YOU:
            return f"""{base_context}

Generate a post-interview thank you email template.

Requirements:
- Appreciative subject line
- Thank interviewer for time
<<<<<<< HEAD
- Reiterate interest and key qualifications from finance background
=======
- Reiterate interest and key qualifications from {self.career_context['transition_from']} background
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Address any concerns about career transition
- Professional closing

Format as JSON with: subject_line, email_body, placeholders, customization_tips
"""

        elif template_type == TemplateType.REFERENCE_REQUEST:
            return f"""{base_context}

Generate a professional reference request email template.

Requirements:
- Clear subject line
- Context about career transition and why their reference matters
- Specific role and company information
- Make it easy for them to say yes
- Offer to provide materials

Format as JSON with: subject_line, email_body, placeholders, customization_tips
"""

        elif template_type == TemplateType.COVER_LETTER:
            return f"""{base_context}

<<<<<<< HEAD
Generate a cover letter template for career transition from finance to social work.
=======
Generate a cover letter template for career transition from {self.career_context['transition_from']} to {self.career_context['transition_to']}.
>>>>>>> restoration-KR-Rage-Figma-v2.0

Requirements:
- Strong opening paragraph addressing career change
- 2-3 body paragraphs highlighting transferable skills
<<<<<<< HEAD
- Specific examples of finance skills relevant to social work
=======
- Specific examples of {self.career_context['transition_from']} skills relevant to {self.career_context['transition_to']}
>>>>>>> restoration-KR-Rage-Figma-v2.0
- Compelling closing with call to action
- Professional format

Format as JSON with: cover_letter_content, placeholders, customization_tips
"""

        else:
            return f"{base_context}\n\nGenerate a professional {template_type.value} template with career transition context."

    def _parse_template_response(
        self,
        template_type: TemplateType,
        ai_response: str,
<<<<<<< HEAD
        context: Optional[TemplateContext],
=======
        context: TemplateContext | None,
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> GeneratedTemplate:
        """Parse AI response into structured template"""
        try:
            # Try to parse JSON response
            if ai_response.strip().startswith("{"):
                response_data = json.loads(ai_response)

                # Extract content based on template type
                if template_type in [
                    TemplateType.EMAIL_APPLICATION,
                    TemplateType.FOLLOW_UP_EMAIL,
                    TemplateType.NETWORKING_EMAIL,
                    TemplateType.INTERVIEW_THANK_YOU,
                    TemplateType.REFERENCE_REQUEST,
                ]:
                    content = response_data.get("email_body", ai_response)
                    subject_line = response_data.get("subject_line")
                elif template_type == TemplateType.COVER_LETTER:
                    content = response_data.get("cover_letter_content", ai_response)
                    subject_line = None
                else:
                    content = response_data.get("content", ai_response)
                    subject_line = response_data.get("subject_line")

                return GeneratedTemplate(
                    template_type=template_type,
                    content=content,
                    subject_line=subject_line,
                    placeholders=response_data.get("placeholders", {}),
                    customization_tips=response_data.get("customization_tips", []),
                )
            else:
                # Use raw response if not JSON
                return GeneratedTemplate(
                    template_type=template_type,
                    content=ai_response,
                    placeholders=self._extract_placeholders(ai_response),
                    customization_tips=[
                        "Customize with specific details about the role and company"
                    ],
                )

        except Exception as e:
            logger.error(f"Error parsing template response: {e}")
            return GeneratedTemplate(
                template_type=template_type,
                content=ai_response,
                placeholders={},
                customization_tips=["Review and customize before using"],
            )

<<<<<<< HEAD
    def _extract_placeholders(self, content: str) -> Dict[str, str]:
=======
    def _extract_placeholders(self, content: str) -> dict[str, str]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """Extract placeholder patterns from template content"""
        import re

        placeholders = {}

        # Find all [PLACEHOLDER] patterns
        placeholder_pattern = r"\[([A-Z_]+)\]"
        matches = re.findall(placeholder_pattern, content)

        for match in matches:
            placeholder_key = f"[{match}]"
            # Generate description based on placeholder name
            if "COMPANY" in match:
                placeholders[placeholder_key] = "Company name"
            elif "JOB" in match or "ROLE" in match:
                placeholders[placeholder_key] = "Job title or role"
            elif "NAME" in match:
                placeholders[placeholder_key] = "Contact person's name"
            elif "SKILL" in match:
                placeholders[placeholder_key] = "Relevant skill or experience"
            else:
                placeholders[placeholder_key] = f"Customize {match.lower().replace('_', ' ')}"

        return placeholders

    def _generate_fallback_template(
<<<<<<< HEAD
        self, template_type: TemplateType, context: Optional[TemplateContext]
=======
        self, template_type: TemplateType, context: TemplateContext | None
>>>>>>> restoration-KR-Rage-Figma-v2.0
    ) -> GeneratedTemplate:
        """Generate fallback templates when AI service is unavailable"""

        fallback_templates = {
            TemplateType.EMAIL_APPLICATION: {
                "subject_line": "Application for [JOB_TITLE] Position - [YOUR_NAME]",
                "content": """Dear [CONTACT_NAME],

<<<<<<< HEAD
I am writing to express my strong interest in the [JOB_TITLE] position at [COMPANY_NAME]. As a finance professional transitioning into social work, I bring a unique combination of analytical skills, client relationship experience, and genuine passion for community impact.

My background in [RELEVANT_EXPERIENCE] has equipped me with valuable transferable skills including [SPECIFIC_SKILL], budget management, and stakeholder engagement - all directly applicable to social work practice. I am particularly drawn to [COMPANY_NAME] because of [COMPANY_VALUE].

I would welcome the opportunity to discuss how my finance background can bring fresh perspective and analytical rigor to your social work team. Thank you for considering my application.
=======
I am writing to express my strong interest in the [JOB_TITLE] position at [COMPANY_NAME]. As a {self.career_context['transition_from']} professional transitioning into {self.career_context['transition_to']}, I bring a unique combination of skills and genuine passion for [TARGET_DOMAIN].

My background in [RELEVANT_EXPERIENCE] has equipped me with valuable transferable skills including [SPECIFIC_SKILL] and stakeholder engagement - all directly applicable to {self.career_context['transition_to']} practice. I am particularly drawn to [COMPANY_NAME] because of [COMPANY_VALUE].

I would welcome the opportunity to discuss how my {self.career_context['transition_from']} background can bring fresh perspective to your {self.career_context['transition_to']} team. Thank you for considering my application.
>>>>>>> restoration-KR-Rage-Figma-v2.0

Best regards,
[YOUR_NAME]""",
                "tips": [
                    "Research the organization's funding model",
<<<<<<< HEAD
                    "Highlight specific finance skills relevant to the role",
=======
                    "Highlight specific {self.career_context['transition_from']} skills relevant to the role",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    "Address the career transition positively",
                ],
            },
            TemplateType.FOLLOW_UP_EMAIL: {
                "subject_line": "Following up on [JOB_TITLE] Application - [YOUR_NAME]",
                "content": """Dear [CONTACT_NAME],

I hope this email finds you well. I wanted to follow up on my application for the [JOB_TITLE] position submitted on [DATE].

<<<<<<< HEAD
My transition from finance to social work reflects my commitment to direct community impact, and I believe my analytical background would bring valuable perspective to [COMPANY_NAME]'s mission.
=======
My transition from {self.career_context['transition_from']} to {self.career_context['transition_to']} reflects my commitment to this field, and I believe my background would bring valuable perspective to [COMPANY_NAME]'s mission.
>>>>>>> restoration-KR-Rage-Figma-v2.0

I remain very interested in this opportunity and would appreciate any updates on the hiring timeline. Please let me know if you need any additional information.

Thank you for your time and consideration.

Best regards,
[YOUR_NAME]""",
                "tips": [
                    "Wait 1-2 weeks before following up",
                    "Keep it brief and professional",
                    "Reiterate your unique value proposition",
                ],
            },
            TemplateType.NETWORKING_EMAIL: {
<<<<<<< HEAD
                "subject_line": "Finance to Social Work Transition - Seeking Guidance",
                "content": """Dear [CONTACT_NAME],

I hope this message finds you well. I am [YOUR_NAME], currently transitioning from a finance career to social work, and I came across your profile through [CONNECTION_SOURCE].

Your experience at [COMPANY_NAME] particularly resonates with me as I navigate this career change. I would be grateful for 15-20 minutes of your time to learn about your journey and gain insights about the social work field from your perspective.

My finance background has given me strong analytical and client relationship skills that I'm excited to apply in a social work context. I'd love to hear your thoughts on how these skills might translate to community service work.
=======
                "subject_line": f"{self.career_context['transition_from']} to {self.career_context['transition_to']} Transition - Seeking Guidance",
                "content": """Dear [CONTACT_NAME],

I hope this message finds you well. I am [YOUR_NAME], currently transitioning from a {self.career_context['transition_from']} career to {self.career_context['transition_to']}, and I came across your profile through [CONNECTION_SOURCE].

Your experience at [COMPANY_NAME] particularly resonates with me as I navigate this career change. I would be grateful for 15-20 minutes of your time to learn about your journey and gain insights about the social work field from your perspective.

My {self.career_context['transition_from']} background has given me strong skills that I'm excited to apply in a {self.career_context['transition_to']} context. I'd love to hear your thoughts on how these skills might translate to this field.
>>>>>>> restoration-KR-Rage-Figma-v2.0

Would you be available for a brief coffee chat or phone call in the coming weeks? I'm happy to work around your schedule.

Thank you for considering my request.

Best regards,
[YOUR_NAME]""",
                "tips": [
                    "Personalize with specific connection",
                    "Be specific about what you're asking for",
                    "Show genuine interest in their work",
                ],
            },
            TemplateType.COVER_LETTER: {
                "content": """Dear Hiring Manager,

<<<<<<< HEAD
I am writing to express my strong interest in the [JOB_TITLE] position at [COMPANY_NAME]. As a finance professional making a purposeful transition into social work, I am excited to bring my analytical skills, client relationship experience, and genuine commitment to community impact to your team.

Throughout my career in finance, I have developed strong transferable skills that directly apply to social work practice. My experience in [RELEVANT_EXPERIENCE] has given me excellent client assessment abilities, budget management expertise, and stakeholder engagement skills. I have consistently demonstrated my ability to build trust with diverse clients, manage complex cases, and work collaboratively with multidisciplinary teams.

What draws me to social work is my passion for directly supporting vulnerable populations and addressing systemic inequalities I observed in my finance career. My analytical background enables me to approach case management with data-driven decision making while maintaining the empathy and cultural sensitivity essential to effective social work practice.
=======
I am writing to express my strong interest in the [JOB_TITLE] position at [COMPANY_NAME]. As a {self.career_context['transition_from']} professional making a purposeful transition into {self.career_context['transition_to']}, I am excited to bring my skills and genuine commitment to your team.

Throughout my career in {self.career_context['transition_from']}, I have developed strong transferable skills that directly apply to {self.career_context['transition_to']} practice. My experience in [RELEVANT_EXPERIENCE] has given me excellent assessment abilities and stakeholder engagement skills. I have consistently demonstrated my ability to build trust with diverse clients and work collaboratively with multidisciplinary teams.

What draws me to {self.career_context['transition_to']} is my passion for this field. My background enables me to approach challenges with a fresh perspective while maintaining the sensitivity essential to effective practice.
>>>>>>> restoration-KR-Rage-Figma-v2.0

I am particularly drawn to [COMPANY_NAME] because of [COMPANY_VALUE]. Your commitment to [SPECIFIC_PROGRAM] aligns perfectly with my values and career goals. I would welcome the opportunity to discuss how my unique background can contribute to your team's mission.

Thank you for considering my application. I look forward to the possibility of contributing to your important work.

Sincerely,
[YOUR_NAME]""",
                "tips": [
                    "Research the organization's specific programs",
<<<<<<< HEAD
                    "Highlight transferable skills from finance",
                    "Address the career transition positively",
                    "Show understanding of social work values",
=======
                    "Highlight transferable skills from {self.career_context['transition_from']}",
                    "Address the career transition positively",
                    "Show understanding of {self.career_context['transition_to']} values",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                ],
            },
        }

        template_data = fallback_templates.get(
            template_type,
            {
                "subject_line": f"Professional {template_type.value.replace('_', ' ').title()}",
<<<<<<< HEAD
                "content": f"Professional {template_type.value} template for career transition from finance to social work.",
=======
                "content": f"Professional {template_type.value} template for career transition from {self.career_context['transition_from']} to {self.career_context['transition_to']}.",
>>>>>>> restoration-KR-Rage-Figma-v2.0
                "tips": ["Customize with specific details", "Review before sending"],
            },
        )

        return GeneratedTemplate(
            template_type=template_type,
            content=template_data["content"],
            subject_line=template_data.get("subject_line"),
            placeholders=self._extract_placeholders(template_data["content"]),
            customization_tips=template_data.get("tips", []),
        )

    async def generate_application_materials(
        self,
        job_title: str,
        company_name: str,
<<<<<<< HEAD
        job_description: Optional[str] = None,
        company_research: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, GeneratedTemplate]:
=======
        job_description: str | None = None,
        company_research: dict[str, Any] | None = None,
    ) -> dict[str, GeneratedTemplate]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Generate complete application materials package

        Returns:
            Dictionary with all application templates
        """
        try:
            context = TemplateContext(
                company_name=company_name,
                job_title=job_title,
                job_description=job_description,
                company_research=company_research,
            )

            # Generate all relevant application templates
            materials = {}

            # Core application materials
            materials["email_application"] = await self.generate_template(
                TemplateType.EMAIL_APPLICATION, context
            )

            materials["cover_letter"] = await self.generate_template(
                TemplateType.COVER_LETTER, context
            )

            materials["follow_up_email"] = await self.generate_template(
                TemplateType.FOLLOW_UP_EMAIL, context
            )

            materials["interview_thank_you"] = await self.generate_template(
                TemplateType.INTERVIEW_THANK_YOU, context
            )

            return materials

        except Exception as e:
            logger.error(f"Error generating application materials: {e}")
            return {}


# Global instance
<<<<<<< HEAD
_template_service: Optional[TemplateService] = None
=======
_template_service: TemplateService | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


def get_template_service() -> TemplateService:
    """Get or create global TemplateService instance"""
    global _template_service
    if _template_service is None:
        _template_service = TemplateService()
    return _template_service
