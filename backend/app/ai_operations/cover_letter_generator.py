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
        """
        try:
            if not base_profile_data or not isinstance(base_profile_data, dict):
                raise InputValidationError(
                    "Base profile data is required and must be a dictionary"
                )
            if not job_analysis_data or not isinstance(job_analysis_data, dict):
                raise InputValidationError(
                    "Job analysis data is required and must be a dictionary"
                )

            sanitized_profile = InputSanitizer.sanitize_dict_input(base_profile_data)
            sanitized_job_data = InputSanitizer.sanitize_dict_input(job_analysis_data)

            # Optional voice profile
            voice_section = ""
            if voice_profile:
                sanitized_voice = InputSanitizer.sanitize_dict_input(voice_profile)
                common_phrases = ", ".join(
                    sanitized_voice.get("common_phrases", [])[:10]
                )
                professional_vocab = ", ".join(
                    sanitized_voice.get("professional_vocabulary", [])[:15]
                )
                voice_section = (
                    "\n\nVoice Profile for Style Matching:\n"
                    f"- Tone: {sanitized_voice.get('tone', 'Professional')}\n"
                    f"- Writing Style: {sanitized_voice.get('writing_style', 'Clear and concise')}\n"
                    f"- Common Phrases: {common_phrases}\n"
                    f"- Professional Vocabulary: {professional_vocab}\n"
                    f"- Sentence Structure Preference: {sanitized_voice.get('sentence_preference', 'Balanced')}\n"
                )

            # Optional customization preferences
            customization_section = ""
            if customization_preferences:
                prefs = InputSanitizer.sanitize_dict_input(customization_preferences)
                customization_section = (
                    "\n\nCustomization Preferences:\n"
                    f"- Desired Length: {prefs.get('length', 'Standard (300-400 words)')}\n"
                    f"- Tone Preference: {prefs.get('tone', 'Professional and enthusiastic')}\n"
                    f"- Focus Areas: {prefs.get('focus_areas', 'Experience alignment and value proposition')}\n"
                    f"- Industry Approach: {prefs.get('industry_approach', 'Standard professional approach')}\n"
                )

            system_prompt = (
                "You are an expert career coach and professional writer with 15+ "
                "years of experience crafting compelling cover letters that land "
                "interviews. You understand how to match writing styles, highlight "
                "relevant experience, and create persuasive value propositions."
            )

            header = (
                "Create a compelling, tailored cover letter that showcases the "
                "applicant as an ideal candidate for the specific role. The letter "
                "must sound authentic to the applicant's voice and directly address "
                "the job requirements.\n\n"
            )

            requirements = (
                "REQUIREMENTS:\n"
                "- Write in the applicant's authentic voice and style\n"
                "- Address 2-3 most relevant experiences that align with job requirements\n"
                "- Include specific achievements and quantifiable results when possible\n"
                "- Reference the company and role specifically\n"
                "- Create a strong opening that captures attention\n"
                "- End with a compelling call to action\n"
                "- Maintain professional standards while matching the applicant's voice\n"
                "- Length should be 300-500 words unless specified otherwise\n\n"
            )

            structure = (
                "STRUCTURE:\n"
                "1. Professional header with contact information\n"
                "2. Compelling opening paragraph that hooks the reader\n"
                "3. 2-3 body paragraphs showcasing relevant experience and achievements\n"
                "4. Strong closing paragraph with call to action\n"
                "5. Professional sign-off\n\n"
            )

            json_structure = (
                "Return ONLY a JSON object with this structure:\n"
                "{\n"
                '  "cover_letter": {\n'
                '    "header": "{\\"applicant_name\\": \\"<name from profile>\\", \n'
                '               \\"contact_info\\": \\"<formatted contact information>\\", \n'
                '               \\"date\\": \\"<current date>\\", \n'
                '               \\"employer_info\\": \\"<hiring manager/company information>\\" }",\n'
                '    "opening_paragraph": "<compelling opening that references the role>",\n'
                '    "body_paragraphs": [\n'
                '      "<paragraph 1: most relevant experience/achievement>",\n'
                '      "<paragraph 2: additional relevant experience/skills>",\n'
                '      "<paragraph 3: value proposition and cultural fit (optional)>"\n'
                "    ],\n"
                '    "closing_paragraph": "<strong closing with call to action>",\n'
                '    "sign_off": "<professional sign-off with name>",\n'
                '    "full_letter": "<complete formatted cover letter>"\n'
                "  },\n"
                '  "letter_analysis": {\n'
                '    "word_count": <number of words>,\n'
                '    "key_strengths_highlighted": [<list of key strengths emphasized>],\n'
                '    "job_requirements_addressed": [<list of job requirements directly addressed>],\n'
                '    "achievements_mentioned": [<list of specific achievements included>],\n'
                '    "tone_assessment": "<assessment of letter tone and style>",\n'
                '    "improvement_suggestions": [<optional minor improvements>]\n'
                "  },\n"
                '  "customization_details": {\n'
                '    "voice_matching_elements": [<elements that match the voice profile>],\n'
                '    "job_specific_elements": [<elements specifically tailored to this job>],\n'
                '    "company_research_elements": [<elements showing company knowledge>],\n'
                '    "differentiating_factors": [<what makes this letter stand out>]\n'
                "  }\n"
                "}\n\n"
            )

            prompt = (
                header
                + requirements
                + structure
                + json_structure
                + "Applicant's Profile Data:\n---\n"
                + f"{json.dumps(sanitized_profile, indent=2)}\n"
                + "---\n\n"
                + "Target Job Analysis:\n---\n"
                + f"{json.dumps(sanitized_job_data, indent=2)}\n"
                + f"---{voice_section}{customization_section}\n\n"
                + "Generate the tailored cover letter as a JSON object:"
            )

            request = AIRequest(
                prompt=prompt,
                service_name="cover_letter",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=3500,
                temperature=0.7,
            )

            response = await self.ai_client.generate_text(request)

            try:
                parsed_result = json.loads(response.content.strip())
            except json.JSONDecodeError as e:
                raise AIError(
                    message=f"AI returned invalid JSON: {str(e)}",
                    error_type=AIErrorType.INVALID_REQUEST,
                    original_error=e,
                )

            required_sections = [
                "cover_letter",
                "letter_analysis",
                "customization_details",
            ]
            missing_sections = [
                section for section in required_sections if section not in parsed_result
            ]
            if missing_sections:
                raise AIError(
                    message=f"AI response missing required sections: {missing_sections}",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

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
                    "word_count": parsed_result.get("letter_analysis", {}).get(
                        "word_count", 0
                    ),
                    "cached": response.cached,
                    "voice_profile_used": bool(voice_profile),
                    "company": job_analysis_data.get("company_name", "Unknown"),
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(
                f"Error in cover letter generation for user {user_id}: {str(e)}"
            )
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
                goals_section = (
                    f"\\n\\nOptimization Focus Areas: {', '.join(sanitized_goals)}"
                )

            system_prompt = (
                "You are a cover letter optimization specialist with expertise in "
                "ATS optimization, keyword enhancement, and persuasive writing. "
                "Provide specific improvements while maintaining the original voice "
                "and authenticity."
            )

            prompt = (
                "Analyze and optimize the existing cover letter to better align with "
                "the job requirements while maintaining authenticity and improving impact.\n\n"
                "Required JSON structure:\n"
                "{\n"
                '  "optimization_analysis": {\n'
                '    "current_strengths": [<current strong points in the letter>],\n'
                '    "improvement_areas": [<areas that need enhancement>],\n'
                '    "job_alignment_score": <0-100 current alignment score>,\n'
                '    "keyword_optimization_needed": [<missing important keywords>],\n'
                '    "structure_assessment": "<assessment of current structure>"\n'
                "  },\n"
                '  "optimized_cover_letter": {\n'
                '    "improved_opening": "<enhanced opening paragraph>",\n'
                '    "enhanced_body": [<improved body paragraphs>],\n'
                '    "stronger_closing": "<improved closing paragraph>",\n'
                '    "full_optimized_letter": "<complete optimized cover letter>"\n'
                "  },\n"
                '  "optimization_changes": [\n'
                "    {\n"
                '      "section": "<section changed>",\n'
                '      "original": "<original text snippet>",\n'
                '      "optimized": "<improved text snippet>",\n'
                '      "reason": "<why this change was made>",\n'
                '      "impact": "<expected impact of change>"\n'
                "    }\n"
                "  ],\n"
                '  "keyword_enhancements": [\n'
                "    {\n"
                '      "keyword": "<added keyword>",\n'
                '      "placement": "<where it was added>",\n'
                '      "context": "<how it was naturally integrated>",\n'
                '      "importance": "<why this keyword matters>"\n'
                "    }\n"
                "  ],\n"
                '  "performance_metrics": {\n'
                '    "original_word_count": <original word count>,\n'
                '    "optimized_word_count": <new word count>,\n'
                '    "keyword_density_improvement": <percentage improvement>,\n'
                '    "alignment_score_improvement": <expected score improvement>,\n'
                '    "readability_score": <1-10 readability assessment>\n'
                "  }\n"
                "}\n"
                f" {goals_section}\n\n"
                "Current Cover Letter:\n---\n"
                f"{sanitized_letter.sanitized_content}\n"
                "---\n\n"
                "Target Job Analysis:\n---\n"
                f"{json.dumps(sanitized_job_data, indent=2)}\n"
                "---\n\n"
                "Respond with ONLY the JSON object:"
            )

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

            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "optimization_goals": optimization_goals,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
            }

            return parsed_result

        except Exception as e:
            logger.error(
                f"Error in cover letter optimization for user {user_id}: {str(e)}"
            )
            raise AIError(
                message=f"Cover letter optimization failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("cover_letter_templates")
    async def generate_cover_letter_templates(
        self,
        user_id: str,
        industry: str,
        experience_level: str,
        template_count: int = 3,
    ) -> Dict[str, Any]:
        """
        Generate customizable cover letter templates for an industry and experience level.
        """
        try:
            sanitized_industry = InputSanitizer.sanitize_text_input(industry)
            sanitized_level = InputSanitizer.sanitize_text_input(experience_level)

            system_prompt = (
                "You are a template creation expert specializing in professional "
                "cover letters across various industries and experience levels. "
                "Create versatile, customizable templates that maintain "
                "professional standards."
            )

            prompt = (
                f"Generate {template_count} professional cover letter templates "
                f"tailored to the {sanitized_industry.sanitized_content} industry "
                f"for {sanitized_level.sanitized_content} level professionals.\n\n"
                "Required JSON structure:\n"
                "{\n"
                '  "templates": [\n'
                "    {\n"
                '      "template_name": "<descriptive template name>",\n'
                '      "style_description": "<description of template style/approach>",\n'
                '      "template_structure": {\n'
                '        "opening_template": "<opening paragraph with placeholders>",\n'
                '        "body_templates": [\n'
                '          "<body paragraph 1 template>",\n'
                '          "<body paragraph 2 template>"\n'
                "        ],\n"
                '        "closing_template": "<closing paragraph template>"\n'
                "      },\n"
                '      "placeholder_guide": {\n'
                '        "[COMPANY_NAME]": "Company you\'re applying to",\n'
                '        "[ROLE_TITLE]": "Specific job title",\n'
                '        "[RELEVANT_EXPERIENCE]": "Your most relevant experience",\n'
                '        "[SPECIFIC_ACHIEVEMENT]": "Quantifiable achievement",\n'
                '        "[COMPANY_VALUE]": "Something you value about the company"\n'
                "      },\n"
                '      "customization_tips": [<tips for personalizing this template>],\n'
                '      "best_for": "<what types of roles/companies this works best for>"\n'
                "    }\n"
                "  ],\n"
                '  "industry_specific_guidance": {\n'
                '    "key_industry_terms": [<important industry terminology>],\n'
                '    "common_requirements": [<typical requirements for this industry>],\n'
                '    "value_propositions": [<what employers in this industry value>],\n'
                '    "formatting_preferences": "<industry-specific formatting preferences>"\n'
                "  },\n"
                '  "experience_level_guidance": {\n'
                '    "focus_areas": [<what to emphasize at this experience level>],\n'
                '    "tone_recommendations": "<appropriate tone for this level>",\n'
                '    "common_challenges": [<typical challenges at this level>],\n'
                '    "differentiation_strategies": [<how to stand out>]\n'
                "  }\n"
                "}\n\n"
                "Generate the templates as a JSON object:"
            )

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
