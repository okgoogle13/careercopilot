"""
KSC (Key Selection Criteria) Generator Operations

Generate STAR methodology responses for key selection criteria
using the centralized AI configuration system.
"""

import json
import logging
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

from app.core.ai_client import AIRequest, get_ai_client
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.cache_decorators import cached_ai_operation
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.monitoring import monitor_performance
from app.core.prompt_service import format_prompt, get_system_prompt, get_prompt_service

# Import the new validation utilities
from app.core.ai_response_validation import (
    AIResponseValidator,
    KSCResponseComplete,
    STARResponse as ValidatedSTARResponse,
    KSCAnalysis,
    ExperienceSelection,
    ValidationResult,
    default_validator
)
from app.core.ai_flow_integration import extract_validated_data

logger = logging.getLogger(__name__)


@dataclass
class STARResponse:
    """Structured STAR methodology response"""

    situation: str
    task: str
    action: str
    result: str


class KSCGenerator:
    """KSC generation operations using centralized AI system"""

    def __init__(self):
        self.ai_client = get_ai_client()

    @monitor_performance("ksc_star_generation")
    @cached_ai_operation("ksc_generation", user_id_param="user_id")
    async def generate_star_response(
        self,
        user_id: str,
        user_profile_data: Dict[str, Any],
        ksc_statement: str,
        response_length: str = "comprehensive",
        focus_achievements: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate a STAR methodology response for a Key Selection Criterion.

        Args:
            user_id: User identifier for tracking and caching
            user_profile_data: User's profile with experiences and achievements
            ksc_statement: The key selection criterion to address
            response_length: Response length preference (concise/standard/comprehensive)
            focus_achievements: Optional specific achievements to prioritize

        Returns:
            dict: STAR response with analysis and metadata
        """
        try:
            # Input validation
            if not user_profile_data or not isinstance(user_profile_data, dict):
                raise InputValidationError("User profile data is required and must be a dictionary")

            if not ksc_statement or not isinstance(ksc_statement, str):
                raise InputValidationError("KSC statement is required and must be a string")

            # Sanitize inputs
            sanitized_profile = InputSanitizer.sanitize_dict_input(user_profile_data)
            sanitized_ksc = InputSanitizer.sanitize_text_input(ksc_statement)

            # Create focus achievements context
            achievements_context = ""
            if focus_achievements:
                sanitized_achievements = [
                    InputSanitizer.sanitize_text_input(ach).sanitized_content
                    for ach in focus_achievements
                ]
                achievements_context = (
                    f"\n\nPrioritize these achievements if relevant: "
                    f"{', '.join(sanitized_achievements)}"
                )

            # Adjust length instructions based on preference
            length_instructions = {
                "concise": (
                    "Keep each section concise (2-3 sentences each). "
                    "Total response should be 200-300 words."
                ),
                "standard": (
                    "Provide detailed but focused responses (3-4 sentences each). "
                    "Total response should be 300-450 words."
                ),
                "comprehensive": (
                    "Provide comprehensive, detailed responses (4-6 sentences each). "
                    "Total response should be 450-600 words."
                ),
            }

            # Get the length instruction from the prompt service
            prompt_service = get_prompt_service()
            length_instruction = prompt_service.get_length_instruction(response_length)

            # Get the system prompt from the template
            system_prompt = get_system_prompt("ksc_star_response")

            # Format the main prompt using the template
            prompt = format_prompt(
                "ksc_star_response",
                ksc_statement=sanitized_ksc.sanitized_content,
                user_profile=json.dumps(sanitized_profile, indent=2),
                focus_achievements=achievements_context,
                length_instruction=length_instruction
            )
            request = AIRequest(
                prompt=prompt,
                service_name="ksc_generation",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=3500,
                temperature=0.6,
            )

            response = await self.ai_client.generate_text(request)

            # Use the new validation system instead of manual JSON parsing
            fallback_data = {
                "ksc_analysis": {
                    "ksc_interpretation": "Analysis temporarily unavailable due to processing limitations.",
                    "key_competencies": ["Communication", "Problem-solving", "Leadership"],
                    "success_factors": ["Specific examples", "Quantifiable results", "Clear structure"]
                },
                "experience_selection": {
                    "chosen_experience": "Unable to select specific experience from profile data.",
                    "relevance_score": 50.0,
                    "selection_rationale": "Selection process temporarily unavailable.",
                    "alternative_experiences": []
                },
                "star_response": {
                    "situation": "Unable to analyze specific situation due to processing limitations.",
                    "task": "Could not identify specific task requirements from available data.",
                    "action": "Unable to determine specific actions from the provided information.",
                    "result": "Could not extract measurable results. Please provide more detailed information."
                }
            }
            
            # Validate AI response using the new validation utility
            validation_result = default_validator.validate_response(
                response.content.strip(),
                "ksc_complete",
                fallback_data
            )
            
            if not validation_result.is_valid and not validation_result.parsed_data:
                raise AIError(
                    message=f"AI response validation failed: {validation_result.error_message}",
                    error_type=AIErrorType.INVALID_REQUEST,
                    original_error=Exception(validation_result.error_message)
                )
            
            # Extract validated data
            validated_response = validation_result.parsed_data
            
            # Convert to dictionary format for backward compatibility
            parsed_result = {
                "ksc_analysis": validated_response.ksc_analysis.dict() if hasattr(validated_response.ksc_analysis, 'dict') else validated_response.ksc_analysis,
                "experience_selection": validated_response.experience_selection.dict() if hasattr(validated_response.experience_selection, 'dict') else validated_response.experience_selection,
                "star_response": validated_response.star_response.dict() if hasattr(validated_response.star_response, 'dict') else validated_response.star_response,
                "response_enhancement": getattr(validated_response, 'response_enhancement', None),
                "interview_preparation": getattr(validated_response, 'interview_preparation', None)
            }

            # Add metadata including validation info
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "provider": response.provider,
                "tokens_used": response.tokens_used,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
                "generation_timestamp": response.request_id,
                "response_length": response_length,
                "ksc_statement": ksc_statement,
                # Validation metadata
                "validation_successful": validation_result.is_valid,
                "validation_warnings": validation_result.validation_warnings,
                "fallback_used": validation_result.metadata.get("fallback_used", False)
            }

            # Extract relevance score safely from validated data
            relevance_score = 0
            if hasattr(validated_response.experience_selection, 'relevance_score'):
                relevance_score = validated_response.experience_selection.relevance_score
            elif isinstance(parsed_result.get("experience_selection"), dict):
                relevance_score = parsed_result["experience_selection"].get("relevance_score", 0)
            
            logger.info(
                f"KSC STAR response generated for user {user_id}",
                extra={
                    "user_id": user_id,
                    "model_used": response.model_used,
                    "response_length": response_length,
                    "cached": response.cached,
                    "relevance_score": relevance_score,
                    "validation_successful": validation_result.is_valid,
                    "fallback_used": validation_result.metadata.get("fallback_used", False)
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in KSC generation for user {user_id}: {str(e)}")
            raise AIError(
                message=f"KSC generation failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("ksc_multiple_responses")
    @cached_ai_operation("ksc_batch", user_id_param="user_id")
    async def generate_multiple_ksc_responses(
        self,
        user_id: str,
        user_profile_data: Dict[str, Any],
        ksc_statements: List[str],
        response_preferences: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Generate STAR responses for multiple KSC statements efficiently.

        Args:
            user_id: User identifier
            user_profile_data: User's profile data
            ksc_statements: List of KSC statements to address
            response_preferences: Optional preferences for responses

        Returns:
            dict: Multiple STAR responses with cross-analysis
        """
        try:
            if not ksc_statements or len(ksc_statements) == 0:
                raise InputValidationError("At least one KSC statement is required")

            if len(ksc_statements) > 10:
                raise InputValidationError("Maximum 10 KSC statements can be processed at once")

            sanitized_profile = InputSanitizer.sanitize_dict_input(user_profile_data)
            sanitized_kscs = [
                InputSanitizer.sanitize_text_input(ksc).sanitized_content for ksc in ksc_statements
            ]

            preferences_context = ""
            if response_preferences:
                prefs = InputSanitizer.sanitize_dict_input(response_preferences)
                preferences_context = f"\\n\\nResponse Preferences: {json.dumps(prefs, indent=2)}"

            system_prompt = (
                "You are an expert career coach specializing in comprehensive KSC "
                "response strategies. You excel at selecting diverse experiences to "
                "avoid repetition while maximizing the impact of each response."
            )

            json_structure = """{
"strategy_analysis": {
    "experience_mapping": {
        "<ksc_1>": "<experience selected for KSC 1>",
        "<ksc_2>": "<experience selected for KSC 2>"
    },
    "diversity_score": "<0-100 score for experience diversity>",
    "coverage_analysis": "<how well the responses cover user's full experience range>",
    "narrative_coherence": "<how responses work together to tell a complete story>"
},
"ksc_responses": [
    {
        "ksc_statement": "<KSC statement>",
        "ksc_priority": "<high/medium/low based on common importance>",
        "experience_selection": {
            "chosen_experience": "<selected experience>",
            "relevance_score": "<0-100>",
            "uniqueness_factor": "<what makes this experience unique among responses>"
        },
        "star_response": {
            "situation": "<situation details>",
            "task": "<task details>",
            "action": "<action details>",
            "result": "<result details>",
            "full_response": "<complete narrative response>"
        },
        "response_analysis": {
            "key_competencies_shown": ["<competencies demonstrated>"],
            "quantified_achievements": ["<numbers and metrics>"],
            "differentiating_factors": ["<what makes this response stand out>"]
        }
    }
],
"cross_response_analysis": {
    "experience_overlap_check": ["<any concerning overlaps between responses>"],
    "competency_coverage": ["<full range of competencies covered>"],
    "narrative_gaps": ["<any important experiences not utilized>"],
    "strengthening_opportunities": ["<ways to enhance the overall set>"]
},
"presentation_strategy": {
    "response_ordering": ["<recommended order for presenting responses>"],
    "transition_strategies": ["<how to connect responses in interviews>"],
    "backup_experiences": ["<alternative experiences to mention if asked>"],
    "interview_flow_tips": ["<tips for smooth interview delivery>"]
}
}"""

            prompt = f"""Generate STAR methodology responses for multiple Key Selection Criteria,
                ensuring diverse experience selection and avoiding repetition across responses.

STRATEGIC REQUIREMENTS:
- Select different experiences for each KSC to showcase breadth of skills
- Ensure no significant overlap in situations or achievements used
- Maintain high relevance for each individual KSC
- Create a cohesive narrative across all responses
- Prioritize strongest, most quantifiable examples

Required JSON structure:
{json_structure}{preferences_context}

KSC Statements:
{json.dumps(sanitized_kscs, indent=2)}

User Profile Data:
---
{json.dumps(sanitized_profile, indent=2)}
---

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="ksc_batch",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=4500,
                temperature=0.5,
            )

            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "ksc_count": len(ksc_statements),
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
            }

            return parsed_result

        except Exception as e:
            logger.error(f"Error in multiple KSC generation for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Multiple KSC generation failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("ksc_response_optimization")
    async def optimize_star_response(
        self,
        user_id: str,
        existing_response: str,
        ksc_statement: str,
        feedback_areas: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Optimize an existing STAR response for better impact and alignment.

        Args:
            user_id: User identifier
            existing_response: Current STAR response text
            ksc_statement: The KSC statement being addressed
            feedback_areas: Optional areas to focus improvement on

        Returns:
            dict: Optimized STAR response with improvement analysis
        """
        try:
            sanitized_response = InputSanitizer.sanitize_text_input(existing_response)
            sanitized_ksc = InputSanitizer.sanitize_text_input(ksc_statement)

            feedback_context = ""
            if feedback_areas:
                sanitized_feedback = [
                    InputSanitizer.sanitize_text_input(area).sanitized_content
                    for area in feedback_areas
                ]
                feedback_context = f"\\n\\nFocus improvement on: {', '.join(sanitized_feedback)}"

            system_prompt = (
                "You are a STAR response optimization expert who can identify "
                "weaknesses in existing responses and provide specific, actionable "
                "improvements while maintaining authenticity."
            )

            prompt = (
                "Analyze and optimize the existing STAR response to better address "
                "the KSC statement with improved impact, specificity, and "
                "persuasiveness.\n\n"
                "Required JSON structure:\n"
                "{\n"
                '  "current_analysis": {\n'
                '    "star_structure_assessment": {\n'
                '      "situation_strength": <0-10 score>,\n'
                '      "task_clarity": <0-10 score>,\n'
                '      "action_specificity": <0-10 score>,\n'
                '      "result_quantification": <0-10 score>\n'
                "    },\n"
                '    "improvement_areas": [<specific areas needing enhancement>],\n'
                '    "current_strengths": [<elements that are working well>],\n'
                '    "ksc_alignment_score": <0-100 current alignment score>\n'
                "  },\n"
                '  "optimized_response": {\n'
                '    "improved_situation": "<enhanced situation section>",\n'
                '    "improved_task": "<enhanced task section>",\n'
                '    "improved_action": "<enhanced action section>",\n'
                '    "improved_result": "<enhanced result section>",\n'
                '    "full_optimized_response": "<complete enhanced STAR response>"\n'
                "  },\n"
                '  "optimization_details": [\n'
                "    {\n"
                '      "section": "<situation/task/action/result>",\n'
                '      "original_text": "<original text snippet>",\n'
                '      "optimized_text": "<improved text snippet>",\n'
                '      "improvement_reason": "<why this change improves the response>",\n'
                '      "impact_assessment": "<expected impact of this change>"\n'
                "    }\n"
                "  ],\n"
                '  "enhancement_metrics": {\n'
                '    "specificity_improvement": <0-100 score>,\n'
                '    "quantification_improvement": <0-100 score>,\n'
                '    "impact_enhancement": <0-100 score>,\n'
                '    "overall_improvement_score": <0-100 score>\n'
                "  },\n"
                '  "interview_delivery_tips": [\n'
                '    "<tips for delivering the optimized response effectively>"\n'
                "  ]\n"
                "} "
                + f"{feedback_context}\n\n"
                + "KSC Statement:\n"
                + '"{sanitized_ksc.sanitized_content}"\n\n'
                + "Current STAR Response:\n---\n"
                + f"{sanitized_response.sanitized_content}\n"
                + "---\n\n"
                + "Respond with ONLY the JSON object:"
            )
            request = AIRequest(
                prompt=prompt,
                service_name="ksc_generation",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=2500,
                temperature=0.4,
            )

            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "optimization_focus": feedback_areas,
                "response_time_ms": response.response_time_ms,
            }

            logger.info(
                f"KSC response optimization completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "feedback_areas": feedback_areas,
                    "improvement_score": parsed_result.get("enhancement_metrics", {}).get(
                        "overall_improvement_score", 0
                    ),
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in KSC optimization for user {user_id}: {str(e)}")
            raise AIError(
                message=f"KSC optimization failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )


# Global instance
ksc_generator = KSCGenerator()
