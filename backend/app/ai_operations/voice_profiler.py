"""
Voice Profiling Operations

Analyze user documents to create comprehensive writing style profiles
using the centralized AI configuration system.
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


class VoiceProfiler:
    """Voice profiling operations using centralized AI system"""

    def __init__(self):
        self.ai_client = get_ai_client()

    @monitor_performance("voice_profile_generation")
    @cached_ai_operation("voice_analysis", user_id_param="user_id")
    async def generate_comprehensive_voice_profile(
        self,
        user_id: str,
        document_texts: List[str],
        document_types: Optional[List[str]] = None,
        focus_areas: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive voice profile from user documents.

        Args:
            user_id: User identifier for tracking and caching
            document_texts: List of document text content
            document_types: Optional list of document types (resume, cover_letter, etc.)
            focus_areas: Optional focus areas for analysis (tone, vocabulary, etc.)

        Returns:
            dict: Comprehensive voice profile with style analysis
        """
        try:
            # Input validation
            if not document_texts or not isinstance(document_texts, list):
                raise InputValidationError("Document texts must be a non-empty list")

            if not any(text.strip() for text in document_texts):
                raise InputValidationError(
                    "At least one document must contain text content"
                )

            # Sanitize all document texts
            sanitized_texts = []
            for text in document_texts:
                if text and text.strip():
                    sanitized = InputSanitizer.sanitize_text_input(text)
                    sanitized_texts.append(sanitized.sanitized_content)

            if len(sanitized_texts) == 0:
                raise InputValidationError(
                    "No valid document text found after sanitization"
                )

            # Combine texts with separators
            combined_text = "\n\n---DOCUMENT_SEPARATOR---\n\n".join(sanitized_texts)

            # Create document type context if provided
            doc_types_context = ""
            if document_types:
                doc_types_context = (
                    f"\n\nDocument Types: {', '.join(document_types[:10])}"
                )

            # Create focus areas context if provided
            focus_context = ""
            if focus_areas:
                sanitized_focus = [
                    InputSanitizer.sanitize_text_input(area).sanitized_content
                    for area in focus_areas
                ]
                focus_context = f"\n\nFocus Analysis On: {', '.join(sanitized_focus)}"

            system_prompt = """You are an expert linguist and communication analyst specializing in writing style analysis, voice identification, and professional communication patterns. Analyze text comprehensively to create detailed voice profiles."""

            prompt = f"""Analyze the provided document collection to create a comprehensive voice profile that captures the user's unique writing style, communication patterns, and professional voice.

ANALYSIS REQUIREMENTS:
- Analyze tone, vocabulary, sentence structure, and communication patterns
- Identify recurring phrases, expressions, and linguistic preferences
- Assess professional vocabulary and industry-specific terminology
- Determine formality levels and style consistency
- Note unique characteristics that make this voice distinctive

Required JSON structure:
{{
    "voice_profile": {{
        "overall_tone": {{
            "primary_tone": "<dominant tone across documents>",
            "secondary_tones": [<list of additional tones observed>],
            "tone_consistency": <0-100 score for consistency>,
            "formality_level": "<formal/semi-formal/casual/mixed>",
            "emotional_range": [<list of emotional expressions used>]
        }},
        "communication_style": {{
            "sentence_structure": {{
                "average_length": "<short/medium/long/varied>",
                "complexity": "<simple/moderate/complex/mixed>",
                "preferred_patterns": [<list of common sentence patterns>],
                "paragraph_style": "<concise/detailed/varied>"
            }},
            "writing_approach": {{
                "directness": "<direct/diplomatic/indirect>",
                "persuasion_style": "<logical/emotional/balanced>",
                "information_density": "<concise/detailed/verbose>",
                "personal_vs_professional": "<highly_professional/balanced/personal>"
            }}
        }},
        "vocabulary_analysis": {{
            "professional_vocabulary": [<15-20 key professional terms used>],
            "industry_terminology": [<industry-specific terms identified>],
            "power_words": [<strong action words and descriptors>],
            "unique_expressions": [<distinctive phrases or expressions>],
            "vocabulary_level": "<basic/intermediate/advanced/expert>",
            "technical_depth": <0-100 score for technical language use>
        }},
        "linguistic_patterns": {{
            "common_phrases": [<10-15 frequently used phrases>],
            "transition_words": [<preferred transition and connecting words>],
            "opening_patterns": [<common ways to start sentences/paragraphs>],
            "closing_patterns": [<common ways to end thoughts>],
            "repetitive_structures": [<recurring structural patterns>]
        }},
        "professional_voice": {{
            "confidence_level": <0-100 assessment of confidence in writing>,
            "authority_tone": <0-100 assessment of authoritative voice>,
            "approachability": <0-100 assessment of approachable tone>,
            "authenticity": <0-100 assessment of authentic voice>,
            "industry_alignment": "<how well voice aligns with professional standards>"
        }}
    }},
    "style_recommendations": {{
        "strengths": [<list of voice/style strengths identified>],
        "areas_for_enhancement": [<potential areas for improvement>],
        "consistency_improvements": [<suggestions for better consistency>],
        "professional_enhancement": [<ways to strengthen professional voice>],
        "authenticity_preservation": [<how to maintain authentic voice while improving>]
    }},
    "document_analysis": {{
        "document_count": {len(sanitized_texts)},
        "style_consistency_across_docs": <0-100 score>,
        "primary_document_purposes": [<identified purposes of documents>],
        "voice_evolution": "<any noticed changes in style across documents>",
        "context_adaptability": "<how well voice adapts to different contexts>"
    }},
    "application_guidance": {{
        "cover_letter_voice": {{
            "recommended_tone": "<tone to use in cover letters>",
            "key_phrases_to_include": [<authentic phrases for cover letters>],
            "formality_adjustment": "<any adjustments needed for cover letters>"
        }},
        "professional_communication": {{
            "email_style_guide": [<how to apply voice to emails>],
            "interview_preparation": [<how voice translates to verbal communication>],
            "networking_approach": [<how to apply voice in networking scenarios>]
        }},
        "brand_consistency": {{
            "linkedin_voice": [<how to maintain voice on professional platforms>],
            "resume_voice_elements": [<subtle ways to include voice in resume>],
            "portfolio_voice": [<how to extend voice to portfolio content>]
        }}
    }}
}}{doc_types_context}{focus_context}

Document Collection for Analysis:
---
{combined_text}
---

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="voice_analysis",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=4000,
                temperature=0.4,
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
            required_sections = [
                "voice_profile",
                "style_recommendations",
                "document_analysis",
                "application_guidance",
            ]

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
                "analysis_timestamp": response.request_id,
                "document_count": len(document_texts),
                "total_text_length": len(combined_text),
            }

            logger.info(
                f"Voice profile generated for user {user_id}",
                extra={
                    "user_id": user_id,
                    "model_used": response.model_used,
                    "document_count": len(document_texts),
                    "cached": response.cached,
                    "text_length": len(combined_text),
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(
                f"Error in voice profile generation for user {user_id}: {str(e)}"
            )
            raise AIError(
                message=f"Voice profile generation failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("voice_style_matching")
    @cached_ai_operation("style_analysis", user_id_param="user_id")
    async def analyze_style_consistency(
        self,
        user_id: str,
        target_text: str,
        voice_profile: Dict[str, Any],
        document_type: str = "general",
    ) -> Dict[str, Any]:
        """
        Analyze how well a text matches a user's voice profile.

        Args:
            user_id: User identifier
            target_text: Text to analyze for style consistency
            voice_profile: User's established voice profile
            document_type: Type of document being analyzed

        Returns:
            dict: Style consistency analysis and recommendations
        """
        try:
            sanitized_text = InputSanitizer.sanitize_text_input(target_text)
            sanitized_profile = InputSanitizer.sanitize_dict_input(voice_profile)
            sanitized_doc_type = InputSanitizer.sanitize_text_input(document_type)

            system_prompt = """You are a writing style consistency expert who can compare text against established voice profiles and identify alignment gaps and improvement opportunities."""

            prompt = f"""Compare the target text against the established voice profile to assess style consistency and provide recommendations for better alignment.

Required JSON structure:
{"consistency_analysis": {"overall_consistency_score": <0-100 score>,
        "tone_alignment": {"score": <0-100>,
            "current_tone": "<detected tone in target text>",
            "expected_tone": "<tone from voice profile>",
            "alignment_notes": "<explanation of alignment>"
        } ,
        "vocabulary_alignment": {"score": <0-100>,
            "matching_vocabulary": [<vocabulary that matches profile>],
            "missing_vocabulary": [<expected vocabulary not used>],
            "inconsistent_vocabulary": [<vocabulary that doesn't match style>]
        } ,
        "structure_alignment": {"score": <0-100>,
            "sentence_structure_match": "<assessment of sentence structure consistency>",
            "paragraph_style_match": "<assessment of paragraph style consistency>",
            "flow_consistency": "<assessment of information flow>"
        } ,
        "authenticity_assessment": {"score": <0-100>,
            "authentic_elements": [<elements that feel authentic to the voice>],
            "inauthentic_elements": [<elements that feel inconsistent>],
            "voice_confidence": "<assessment of voice confidence in text>"
        }
    } ,
    "improvement_recommendations": [
        {"category": "<tone/vocabulary/structure/authenticity>",
            "current_issue": "<specific issue identified>",
            "recommendation": "<specific improvement suggestion>",
            "example_improvement": "<example of how to fix it>",
            "priority": "<high/medium/low>"
        }
    ],
    "style_enhancements": {"phrases_to_add": [<phrases from profile that could be naturally added>],
        "vocabulary_substitutions": [
            {"current": "<current word/phrase>",
                "suggested": "<word/phrase from profile>",
                "reason": "<why this change helps>"
            }
        ],
        "tone_adjustments": [<specific tone adjustments to match profile>],
        "structure_improvements": [<structure changes to match profile>]
    } ,
    "document_type_optimization": {"type_specific_recommendations": [<recommendations specific to document type>],
        "voice_adaptation_for_context": [<how voice should adapt for this document type>],
        "professional_standards_alignment": [<how to maintain professionalism>]
    } }

Voice Profile:
---
{json.dumps(sanitized_profile, indent=2)}
---

Document Type: {sanitized_doc_type.sanitized_content}

Target Text to Analyze:
---
{sanitized_text.sanitized_content}
---

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="style_analysis",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=2500,
                temperature=0.3,
            )

            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())

            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "document_type": document_type,
                "text_length": len(target_text),
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
            }

            return parsed_result

        except Exception as e:
            logger.error(
                f"Error in style consistency analysis for user {user_id}: {str(e)}"
            )
            raise AIError(
                message=f"Style consistency analysis failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )

    @monitor_performance("voice_adaptation")
    async def adapt_voice_for_context(
        self,
        user_id: str,
        base_voice_profile: Dict[str, Any],
        target_context: str,
        adaptation_goals: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """
        Adapt a voice profile for specific contexts (formal, casual, industry-specific).

        Args:
            user_id: User identifier
            base_voice_profile: Original voice profile
            target_context: Context to adapt for (e.g., "tech_startup", "finance", "academic")
            adaptation_goals: Specific adaptation goals

        Returns:
            dict: Context-adapted voice profile
        """
        try:
            sanitized_profile = InputSanitizer.sanitize_dict_input(base_voice_profile)
            sanitized_context = InputSanitizer.sanitize_text_input(target_context)

            goals_context = ""
            if adaptation_goals:
                sanitized_goals = [
                    InputSanitizer.sanitize_text_input(goal).sanitized_content
                    for goal in adaptation_goals
                ]
                goals_context = f"\n\nAdaptation Goals: {', '.join(sanitized_goals)}"

            system_prompt = """You are a communication adaptation specialist who helps professionals adapt their authentic voice for different contexts while maintaining authenticity and effectiveness."""

            prompt = f"""Adapt the base voice profile for the specified target context while preserving authenticity and core voice characteristics.

Required JSON structure:
{
                "adapted_voice_profile": {
                    "context_specific_tone": {
                        "primary_tone": "<adapted primary tone>",
            "tone_adjustments": [<specific tone modifications for context>],
            "formality_level": "<adapted formality level>",
            "context_appropriateness": <0-100 score>
        } ,
        "vocabulary_adaptations": {
                        "context_specific_terms": [<terms appropriate for this context>],
            "retained_personal_vocabulary": [<personal terms to keep>],
            "terms_to_avoid": [<terms that may not fit context>],
            "professional_alternatives": [<professional alternatives for casual terms>]
        } ,
        "communication_adjustments": {
                        "sentence_structure_changes": [<structure adaptations needed>],
            "paragraph_style_adjustments": [<paragraph style changes>],
            "emphasis_patterns": [<how to emphasize points in this context>],
            "persuasion_approach": "<adapted persuasion style>"
        } ,
        "authenticity_preservation": {
                        "core_voice_elements_to_maintain": [<essential voice elements to keep>],
            "personal_phrases_adapted": [<how personal phrases fit the context>],
            "personality_integration": [<how personality shows through context>],
            "authenticity_score": <0-100 authenticity preservation score>
        }
    } ,
    "context_specific_guidance": {
                    "do_emphasize": [<things to emphasize in this context>],
        "do_avoid": [<things to avoid in this context>],
        "context_expectations": [<what this context typically expects>],
        "competitive_advantages": [<how adapted voice provides advantages>]
    } ,
    "application_examples": {
                    "cover_letter_adaptations": [<how to apply adaptations in cover letters>],
        "email_communication": [<email adaptations for this context>],
        "networking_approach": [<networking adaptations>],
        "interview_preparation": [<interview communication adaptations>]
    } ,
    "success_metrics": {
                    "context_alignment_score": <0-100 predicted success in context>,
        "authenticity_maintenance": <0-100 authenticity preservation>,
        "professional_impact": <0-100 predicted professional impact>,
        "adaptation_difficulty": "<easy/moderate/challenging>"
    }
} {goals_context}

Base Voice Profile:
---
{json.dumps(sanitized_profile, indent=2)}
---

Target Context: {sanitized_context.sanitized_content}

Respond with ONLY the JSON object:"""

            request = AIRequest(
                prompt=prompt,
                service_name="voice_analysis",
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
                "target_context": target_context,
                "adaptation_goals": adaptation_goals,
                "response_time_ms": response.response_time_ms,
            }

            logger.info(
                f"Voice adaptation completed for user {user_id}",
                extra={
                    "user_id": user_id,
                    "target_context": target_context,
                    "adaptation_goals": adaptation_goals,
                },
            )

            return parsed_result

        except Exception as e:
            logger.error(f"Error in voice adaptation for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Voice adaptation failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e,
            )


# Global instance
voice_profiler = VoiceProfiler()
