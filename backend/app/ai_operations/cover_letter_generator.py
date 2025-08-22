"""
Cover Letter Generation Operations

Professional cover letter generation using the centralized AI configuration
with voice profile matching and job-specific customization.
"""

import json
import logging
from typing import Any, Dict, List, Optional

from app.core.ai_client import AIRequest, get_ai_client
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)


class CoverLetterGenerator:
    """Cover letter generation operations using centralized AI system"""

    def __init__(self):
        self.ai_client = get_ai_client()

    @monitor_performance("cover_letter_generation")
    @cached_ai_operation("cover_letter", user_id_param="user_id")
    async def generate_tailored_cover_letter(
        self,
        user_id: str,
        base_profile_data: Dict[str, Any],
        job_analysis_data: Dict[str, Any],
        voice_profile: Optional[Dict[str, Any]] = None,
        customization_preferences: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate a tailored cover letter based on profile data and job analysis.

        Args:
            user_id: User identifier for tracking and caching
            base_profile_data: User's profile information and experience
            job_analysis_data: Structured job analysis data
            voice_profile: Optional voice/style profile for personalization
            customization_preferences: Optional preferences (length, tone, focus)

        Returns:
            dict: Generated cover letter with metadata and analysis
        """
        try:
            # Input validation
            if not base_profile_data or not isinstance(base_profile_data, dict):
                raise InputValidationError("Base profile data is required and must be a dictionary")

            if not job_analysis_data or not isinstance(job_analysis_data, dict):
                raise InputValidationError("Job analysis data is required and must be a dictionary")

            # Sanitize inputs
            sanitized_profile = InputSanitizer.sanitize_dict_input(base_profile_data)
            sanitized_job_data = InputSanitizer.sanitize_dict_input(job_analysis_data)

            # Handle voice profile if provided
            voice_section = ""
            if voice_profile:
                sanitized_voice = InputSanitizer.sanitize_dict_input(voice_profile)
                voice_section = f"""

Voice Profile for Style Matching:
- Tone: {sanitized_voice.get('tone', 'Professional')}
- Writing Style: {sanitized_voice.get('writing_style', 'Clear and concise')}
- Common Phrases: {', '.join(sanitized_voice.get('common_phrases', [])[:10])}
- Professional Vocabulary: {', '.join(sanitized_voice.get('professional_vocabulary', [])[:15])}
- Sentence Structure Preference: {sanitized_voice.get('sentence_preference', 'Balanced')}
"""

            # Handle customization preferences
            customization_section = ""
            if customization_preferences:
                prefs = InputSanitizer.sanitize_dict_input(customization_preferences)
                customization_section = f"""

Customization Preferences:
- Desired Length: {prefs.get('length', 'Standard (300-400 words)')}
- Tone Preference: {prefs.get('tone', 'Professional and enthusiastic')}
- Focus Areas: {prefs.get('focus_areas', 'Experience alignment and value proposition')}
- Industry Approach: {prefs.get('industry_approach', 'Standard professional approach')}
"""

            system_prompt = """You are an expert career coach and professional writer with 15+ years of experience crafting compelling cover letters that land interviews. You understand how to match writing styles, highlight relevant experience, and create persuasive value propositions."""

            prompt = f"""Create a compelling, tailored cover letter that showcases the applicant as an ideal candidate for the specific role. The letter must sound authentic to the applicant's voice and directly address the job requirements.

REQUIREMENTS:
- Write in the applicant's authentic voice and style
- Address 2-3 most relevant experiences that align with job requirements
- Include specific achievements and quantifiable results when possible
- Reference the company and role specifically
- Create a strong opening that captures attention
- End with a compelling call to action
- Maintain professional standards while matching the applicant's voice
- Length should be 300-500 words unless specified otherwise

STRUCTURE:
1. Professional header with contact information
2. Compelling opening paragraph that hooks the reader
3. 2-3 body paragraphs showcasing relevant experience and achievements
4. Strong closing paragraph with call to action
5. Professional sign-off

Return ONLY a JSON object with this structure:
{"cover_letter": {"header": "{"applicant_name": "<name from profile>",
            "contact_info": "<formatted contact information>",
            "date": "<current date>",
            "employer_info": "<hiring manager/company information>"
        } ",
        "opening_paragraph": "<compelling opening that references the role>",
        "body_paragraphs": [
            "<paragraph 1: most relevant experience/achievement>",
            "<paragraph 2: additional relevant experience/skills>",
            "<paragraph 3: value proposition and cultural fit (optional)>"
        ],
        "closing_paragraph": "<strong closing with call to action>",
        "sign_off": "<professional sign-off with name>",
        "full_letter": "<complete formatted cover letter>"
    } ,
    "letter_analysis": {"word_count": <number of words>,
        "key_strengths_highlighted": [<list of key strengths emphasized>],
        "job_requirements_addressed": [<list of job requirements directly addressed>],
        "achievements_mentioned": [<list of specific achievements included>],
        "tone_assessment": "<assessment of letter tone and style>",
        "improvement_suggestions": [<optional minor improvements>]
    } ,
    "customization_details": {"voice_matching_elements": [<elements that match the voice profile>],
        "job_specific_elements": [<elements specifically tailored to this job>],
        "company_research_elements": [<elements showing company knowledge>],
        "differentiating_factors": [<what makes this letter stand out>]
    } }

Applicant's Profile Data:
---
{json.dumps(sanitized_profile, indent=2)}
---

Target Job Analysis:
---
{json.dumps(sanitized_job_data, indent=2)}
---{voice_section}{customization_section}

Generate the tailored cover letter as a JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="cover_letter",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=3500,
                temperature=0.7,
            )

            response = await self.ai_client.generate_text(request)

            # Parse JSON response
            try:
                parsed_result = json.loads(response.content.strip())
            except json.JSONDecodeError as e:
                raise AIError(
                    message=f"AI returned invalid JSON: {str(e)}",
                    error_type=AIErrorType.INVALID_REQUEST,
                    original_error=e,
                )

            # Validate structure
            required_sections = ["cover_letter", "letter_analysis", "customization_details"]
            missing_sections = [
                section for section in required_sections if section not in parsed_result
            ]

            if missing_sections:
                raise AIError(
                    message=f"AI response missing required sections: {missing_sections}",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "provider": response.provider,
                "tokens_used": response.tokens_used,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
                "generation_timestamp": response.request_id,
                "voice_profile_used": bool(voice_profile),
                "customization_applied": bool(customization_preferences),
            }

            logger.info(
                f"Cover letter generated for user {user_id}",
                extra={
                    "user_id": user_id,
                    "model_used": response.model_used,
                    "word_count": parsed_result.get("letter_analysis", {}).get("word_count", 0),
                    "cached": response.cached,
                    "voice_profile_used": bool(voice_profile),
                    "company": job_analysis_data.get("company_name", "Unknown"),
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in cover letter generation for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Cover letter generation failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("cover_letter_optimization")
    @cached_ai_operation("document_optimization", user_id_param="user_id")
    async def optimize_existing_cover_letter(
        self,
        user_id: str,
        existing_cover_letter: str,
        job_analysis_data: Dict[str, Any],
        optimization_goals: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Optimize an existing cover letter for better job alignment.

        Args:
            user_id: User identifier
            existing_cover_letter: Current cover letter text
            job_analysis_data: Job analysis data for optimization
            optimization_goals: Specific areas to focus on (e.g., ["keywords", "achievements"])

        Returns:
            dict: Optimized cover letter with analysis of changes
        """
        try:
            sanitized_letter = InputSanitizer.sanitize_text_input(existing_cover_letter)
            sanitized_job_data = InputSanitizer.sanitize_dict_input(job_analysis_data)

            goals_section = ""
            if optimization_goals:
                sanitized_goals = [
                    InputSanitizer.sanitize_text_input(goal).sanitized_content
                    for goal in optimization_goals
                ]
                goals_section = f"\n\nOptimization Focus Areas: {', '.join(sanitized_goals)}"

            system_prompt = """You are a cover letter optimization specialist with expertise in ATS optimization, keyword enhancement, and persuasive writing. Provide specific improvements while maintaining the original voice and authenticity."""

            prompt = f"""Analyze and optimize the existing cover letter to better align with the job requirements while maintaining authenticity and improving impact.

Required JSON structure:
{"optimization_analysis": {"current_strengths": [<current strong points in the letter>],
        "improvement_areas": [<areas that need enhancement>],
        "job_alignment_score": <0-100 current alignment score>,
        "keyword_optimization_needed": [<missing important keywords>],
        "structure_assessment": "<assessment of current structure>"
    } ,
    "optimized_cover_letter": {"improved_opening": "<enhanced opening paragraph>",
        "enhanced_body": [<improved body paragraphs>],
        "stronger_closing": "<improved closing paragraph>",
        "full_optimized_letter": "<complete optimized cover letter>"
    } ,
    "optimization_changes": [
        {"section": "<section changed>",
            "original": "<original text snippet>",
            "optimized": "<improved text snippet>",
            "reason": "<why this change was made>",
            "impact": "<expected impact of change>"
        }
    ],
    "keyword_enhancements": [
        {"keyword": "<added keyword>",
            "placement": "<where it was added>",
            "context": "<how it was naturally integrated>",
            "importance": "<why this keyword matters>"
        }
    ],
    "performance_metrics": {"original_word_count": <original word count>,
        "optimized_word_count": <new word count>,
        "keyword_density_improvement": <percentage improvement>,
        "alignment_score_improvement": <expected score improvement>,
        "readability_score": <1-10 readability assessment>
    } } {goals_section}

Current Cover Letter:
---
{sanitized_letter.sanitized_content}
---

Target Job Analysis:
---
{json.dumps(sanitized_job_data, indent=2)}
---

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="document_optimization",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=3000,
                temperature=0.5,
            )

            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "optimization_goals": optimization_goals,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
            }

            return parsed_result

        except Exception as e:
            logger.error(f"Error in cover letter optimization for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Cover letter optimization failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("cover_letter_templates")
    async def generate_cover_letter_templates(
        self, user_id: str, industry: str, experience_level: str, template_count: int = 3
    ) -> Dict[str, Any]:
        """
        Generate customizable cover letter templates for an industry and experience level.

        Args:
            user_id: User identifier
            industry: Target industry
            experience_level: Experience level (entry/mid/senior/executive)
            template_count: Number of templates to generate

        Returns:
            dict: Collection of cover letter templates with customization guidance
        """
        try:
            sanitized_industry = InputSanitizer.sanitize_text_input(industry)
            sanitized_level = InputSanitizer.sanitize_text_input(experience_level)

            system_prompt = """You are a template creation expert specializing in professional cover letters across various industries and experience levels. Create versatile, customizable templates that maintain professional standards."""

            prompt = f"""Generate {template_count} professional cover letter templates tailored to the {sanitized_industry.sanitized_content} industry for {sanitized_level.sanitized_content} level professionals.

Required JSON structure:
{
                "templates": [
        {
                    "template_name": "<descriptive template name>",
            "style_description": "<description of template style/approach>",
            "template_structure": {
                        "opening_template": "<opening paragraph with placeholders>",
                "body_templates": [
                    "<body paragraph 1 template>",
                    "<body paragraph 2 template>"
                ],
                "closing_template": "<closing paragraph template>"
            } ,
            "placeholder_guide": {
                        "[COMPANY_NAME]": "Company you're applying to",
                "[ROLE_TITLE]": "Specific job title",
                "[RELEVANT_EXPERIENCE]": "Your most relevant experience",
                "[SPECIFIC_ACHIEVEMENT]": "Quantifiable achievement",
                "[COMPANY_VALUE]": "Something you value about the company"
            } ,
            "customization_tips": [<tips for personalizing this template>],
            "best_for": "<what types of roles/companies this works best for>"
        }
    ],
    "industry_specific_guidance": {
                            "key_industry_terms": [<important industry terminology>],
        "common_requirements": [<typical requirements for this industry>],
        "value_propositions": [<what employers in this industry value>],
        "formatting_preferences": "<industry-specific formatting preferences>"
    } ,
    "experience_level_guidance": {
                    "focus_areas": [<what to emphasize at this experience level>],
        "tone_recommendations": "<appropriate tone for this level>",
        "common_challenges": [<typical challenges at this level>],
        "differentiation_strategies": [<how to stand out>]
    } }

Generate the templates as a JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="cover_letter",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=3000,
                temperature=0.6,
            )

            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "industry": industry,
                "experience_level": experience_level,
                "template_count": template_count,
                "response_time_ms": response.response_time_ms,
            }

            logger.info(
                f"Cover letter templates generated for user {user_id}",
                extra={
                    "user_id": user_id,
                    "industry": industry,
                    "experience_level": experience_level,
                    "template_count": template_count,
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in template generation for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Template generation failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )


# Global instance
cover_letter_generator = CoverLetterGenerator()
