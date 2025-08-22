"""
ATS Scoring Operations

Comprehensive ATS analysis system using the centralized AI configuration
with keyword matching, semantic analysis, and formatting compliance scoring.
"""

import json
import logging
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

from app.core.ai_client import get_ai_client, AIRequest
from app.core.input_validation import InputSanitizer, InputValidationError
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.cache_decorators import cached_ai_operation
from app.core.monitoring import monitor_performance

logger = logging.getLogger(__name__)

@dataclass
class ATSScoreBreakdown:
    """Structured breakdown of ATS scoring components"""
    keyword_score: float
    semantic_score: float
    formatting_score: float
    overall_score: float

@dataclass
class ATSResult:
    """Complete ATS analysis result"""
    overall_score: float
    breakdown: ATSScoreBreakdown
    matched_keywords: List[str]
    missing_keywords: List[str]
    recommendations: List[str]
    keyword_placement_suggestions: Optional[List[Dict[str, Any]]] = None

class ATSScorer:
    """ATS scoring operations using centralized AI system"""
    
    def __init__(self):
        self.ai_client = get_ai_client()
    
    @monitor_performance('ats_comprehensive_scoring')
    @cached_ai_operation('ats_scoring', user_id_param='user_id')
    async def comprehensive_ats_analysis(
        self,
        user_id: str,
        resume_text: str,
        job_description: str,
        profile_keywords: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Perform comprehensive ATS analysis combining keyword matching,
        semantic analysis, and formatting compliance.
        
        Args:
            user_id: User identifier for tracking and caching
            resume_text: Raw resume content
            job_description: Job description text
            profile_keywords: Optional additional keywords to consider
            
        Returns:
            dict: Complete ATS analysis with scores and recommendations
        """
        try:
            # Input validation
            if not resume_text or not isinstance(resume_text, str):
                raise InputValidationError("Resume text is required and must be a string")
            
            if not job_description or not isinstance(job_description, str):
                raise InputValidationError("Job description is required and must be a string")
            
            # Sanitize inputs
            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
            sanitized_job_desc = InputSanitizer.sanitize_text_input(job_description)
            
            # Include profile keywords if provided
            keywords_context = ""
            if profile_keywords:
                sanitized_keywords = [
                    InputSanitizer.sanitize_text_input(kw).sanitized_content 
                    for kw in profile_keywords
                ]
                keywords_context = f"\n\nAdditional Profile Keywords: {', '.join(sanitized_keywords)}"
            
            system_prompt = """You are an expert ATS (Applicant Tracking System) analyst with deep knowledge of resume parsing, keyword optimization, and hiring manager preferences. Provide comprehensive scoring and actionable recommendations."""
            
            prompt = f"""Perform a comprehensive ATS analysis of the resume against the job description. Analyze keyword matching, semantic relevance, and formatting compliance.

Required JSON structure:
{{
    "keyword_analysis": {{
        "required_skills_found": [<list of required skills found in resume>],
        "preferred_skills_found": [<list of preferred skills found in resume>],
        "missing_required_skills": [<list of missing required skills>],
        "missing_preferred_skills": [<list of missing preferred skills>],
        "keyword_score": <0-100 score based on keyword matching>
    }},
    "semantic_analysis": {{
        "relevance_score": <0-100 score for semantic relevance>,
        "content_alignment": <0-100 score for content alignment>,
        "experience_match": <0-100 score for experience relevance>,
        "semantic_score": <0-100 overall semantic score>,
        "explanation": "<brief explanation of semantic analysis>"
    }},
    "formatting_analysis": {{
        "structure_score": <0-100 score for resume structure>,
        "completeness_score": <0-100 score for section completeness>,
        "readability_score": <0-100 score for ATS readability>,
        "formatting_score": <0-100 overall formatting score>,
        "missing_sections": [<list of missing important sections>]
    }},
    "overall_scoring": {{
        "keyword_weight": 0.45,
        "semantic_weight": 0.35,
        "formatting_weight": 0.20,
        "weighted_score": <calculated weighted average>,
        "final_score": <final ATS score 0-100>
    }},
    "recommendations": {{
        "high_priority": [<list of high priority improvements>],
        "medium_priority": [<list of medium priority improvements>],
        "low_priority": [<list of low priority improvements>]
    }},
    "keyword_placement_suggestions": [
        {{
            "keyword": "<missing keyword>",
            "suggested_section": "<section to add keyword>",
            "context_suggestion": "<how to naturally incorporate keyword>",
            "priority": "<high/medium/low>"
        }}
    ],
    "ats_compatibility": {{
        "parsing_likelihood": <0-100 score for ATS parsing success>,
        "keyword_density": "<optimal/low/high>",
        "formatting_issues": [<list of potential ATS parsing issues>],
        "improvement_impact": "<estimated score improvement with fixes>"
    }}
}}{keywords_context}

Resume Text:
---
{sanitized_resume.sanitized_content}
---

Job Description:
---
{sanitized_job_desc.sanitized_content}
---

Respond with ONLY the JSON object:"""
            
            request = AIRequest(
                prompt=prompt,
                service_name="ats_scoring",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=3000,
                temperature=0.4
            )
            
            response = await self.ai_client.generate_text(request)
            
            # Parse JSON response
            try:
                parsed_result = json.loads(response.content.strip())
            except json.JSONDecodeError as e:
                raise AIError(
                    message=f"AI returned invalid JSON: {str(e)}",
                    error_type=AIErrorType.INVALID_REQUEST,
                    original_error=e
                )
            
            # Validate structure
            required_sections = [
                "keyword_analysis", "semantic_analysis", "formatting_analysis",
                "overall_scoring", "recommendations", "ats_compatibility"
            ]
            
            missing_sections = [section for section in required_sections if section not in parsed_result]
            if missing_sections:
                raise AIError(
                    message=f"AI response missing required sections: {missing_sections}",
                    error_type=AIErrorType.INVALID_REQUEST
                )
            
            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "provider": response.provider,
                "tokens_used": response.tokens_used,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached,
                "analysis_timestamp": response.request_id,
                "profile_keywords_used": bool(profile_keywords)
            }
            
            logger.info(
                f"ATS analysis completed for user {user_id}",
                extra={
                    'user_id': user_id,
                    'model_used': response.model_used,
                    'final_score': parsed_result.get('overall_scoring', {}).get('final_score', 0),
                    'cached': response.cached,
                    'keywords_count': len(profile_keywords) if profile_keywords else 0
                }
            )
            
            return parsed_result
            
        except Exception as e:
            logger.error(f"Error in ATS analysis for user {user_id}: {str(e)}")
            raise AIError(
                message=f"ATS analysis failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e
            )
    
    @monitor_performance('ats_keyword_optimization')
    @cached_ai_operation('keyword_optimization', user_id_param='user_id')
    async def optimize_keywords(
        self,
        user_id: str,
        resume_text: str,
        target_keywords: List[str],
        focus_sections: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Provide targeted keyword optimization recommendations.
        
        Args:
            user_id: User identifier
            resume_text: Resume content
            target_keywords: Keywords to optimize for
            focus_sections: Optional sections to focus optimization on
            
        Returns:
            dict: Keyword optimization recommendations
        """
        try:
            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
            sanitized_keywords = [
                InputSanitizer.sanitize_text_input(kw).sanitized_content 
                for kw in target_keywords
            ]
            
            focus_instruction = ""
            if focus_sections:
                focus_instruction = f"\nFocus optimization on these sections: {', '.join(focus_sections)}"
            
            system_prompt = """You are a keyword optimization specialist with expertise in ATS systems and resume enhancement. Provide specific, actionable keyword placement recommendations."""
            
            prompt = f"""Analyze the resume and provide targeted keyword optimization recommendations for the specified keywords.{focus_instruction}

Required JSON structure:
{{
    "current_keyword_analysis": {{
        "keywords_present": [<keywords already in resume>],
        "keywords_missing": [<keywords not found in resume>],
        "keyword_density": {{<keyword>: <count in resume>}},
        "placement_quality": [
            {{
                "keyword": "<keyword>",
                "current_usage": "<how it's currently used>",
                "quality_score": <0-10 score>,
                "improvement_needed": <true/false>
            }}
        ]
    }},
    "optimization_recommendations": [
        {{
            "keyword": "<keyword to add/improve>",
            "target_section": "<best section for placement>",
            "placement_strategy": "<natural/technical/achievement>",
            "example_implementation": "<specific example of how to add>",
            "context_suggestions": [<list of context options>],
            "priority": "<high/medium/low>",
            "impact_estimate": "<estimated improvement>"
        }}
    ],
    "section_improvements": {{
        "professional_summary": [<keyword improvements for summary>],
        "skills_section": [<keyword improvements for skills>],
        "experience_section": [<keyword improvements for experience>],
        "education_section": [<keyword improvements for education>]
    }},
    "density_optimization": {{
        "current_density": "<low/optimal/high>",
        "recommended_changes": [<list of density adjustments>],
        "keyword_variations": {{<keyword>: [<list of variations>]}},
        "natural_integration_tips": [<tips for natural keyword usage>]
    }}
}}

Target Keywords: {', '.join(sanitized_keywords)}

Resume Text:
---
{sanitized_resume.sanitized_content}
---

Respond with ONLY the JSON object:"""
            
            request = AIRequest(
                prompt=prompt,
                service_name="keyword_optimization",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=2500,
                temperature=0.3
            )
            
            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())
            
            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "target_keywords": target_keywords,
                "focus_sections": focus_sections,
                "response_time_ms": response.response_time_ms,
                "cached": response.cached
            }
            
            return parsed_result
            
        except Exception as e:
            logger.error(f"Error in keyword optimization for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Keyword optimization failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e
            )
    
    @monitor_performance('ats_formatting_analysis')
    async def analyze_formatting_compliance(
        self,
        user_id: str,
        resume_text: str
    ) -> Dict[str, Any]:
        """
        Analyze resume formatting for ATS compliance.
        
        Args:
            user_id: User identifier
            resume_text: Resume content
            
        Returns:
            dict: Formatting analysis and recommendations
        """
        try:
            sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
            
            system_prompt = """You are an ATS formatting expert who understands how different ATS systems parse and interpret resume formats. Provide detailed formatting compliance analysis."""
            
            prompt = f"""Analyze the resume formatting for ATS compliance and parsing success.

Required JSON structure:
{{
    "parsing_analysis": {{
        "structure_clarity": <0-100 score>,
        "section_identification": <0-100 score>,
        "data_extraction": <0-100 score>,
        "overall_parsability": <0-100 score>
    }},
    "formatting_issues": [
        {{
            "issue": "<specific formatting problem>",
            "impact": "<how it affects ATS parsing>",
            "fix_recommendation": "<how to fix it>",
            "priority": "<high/medium/low>"
        }}
    ],
    "section_analysis": {{
        "contact_info": {{
            "present": <true/false>,
            "ats_friendly": <true/false>,
            "issues": [<list of issues>]
        }},
        "professional_summary": {{
            "present": <true/false>,
            "ats_friendly": <true/false>,
            "issues": [<list of issues>]
        }},
        "skills": {{
            "present": <true/false>,
            "ats_friendly": <true/false>,
            "issues": [<list of issues>]
        }},
        "experience": {{
            "present": <true/false>,
            "ats_friendly": <true/false>,
            "issues": [<list of issues>]
        }},
        "education": {{
            "present": <true/false>,
            "ats_friendly": <true/false>,
            "issues": [<list of issues>]
        }}
    }},
    "optimization_recommendations": [
        {{
            "category": "<formatting/structure/content>",
            "recommendation": "<specific improvement>",
            "implementation": "<how to implement>",
            "impact": "<expected improvement>"
        }}
    ],
    "ats_best_practices": [
        "<list of best practices for ATS optimization>"
    ]
}}

Resume Text:
---
{sanitized_resume.sanitized_content}
---

Respond with ONLY the JSON object:"""
            
            request = AIRequest(
                prompt=prompt,
                service_name="ats_scoring",
                user_id=user_id,
                system_prompt=system_prompt,
                max_tokens=2000,
                temperature=0.3
            )
            
            response = await self.ai_client.generate_text(request)
            parsed_result = json.loads(response.content.strip())
            
            # Add metadata
            parsed_result["metadata"] = {
                "model_used": response.model_used,
                "analysis_type": "formatting_compliance",
                "response_time_ms": response.response_time_ms
            }
            
            return parsed_result
            
        except Exception as e:
            logger.error(f"Error in formatting analysis for user {user_id}: {str(e)}")
            raise AIError(
                message=f"Formatting analysis failed: {str(e)}",
                error_type=AIErrorType.UNKNOWN,
                original_error=e
            )

# Global instance
ats_scorer = ATSScorer()