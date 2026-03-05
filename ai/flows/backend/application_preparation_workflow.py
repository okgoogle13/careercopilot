"""
Application Preparation Workflow using Firebase Genkit

High-level orchestrator flow that generates a complete, tailored job application
package by coordinating multiple specialized flows.
"""

import json
import os
from datetime import datetime
from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Any, Callable, Dict, List, Optional, Type, TypeVar, cast, Union, Protocol
from typing_extensions import ParamSpec

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from app.core.ai_config import get_ai_config
from app.core.ai_error_handling import AIError, AIErrorType, with_ai_error_handling
from app.core.input_validation import InputSanitizer, InputValidationError
from app.genkit_flows.ksc_generator import generateKscResponse
from app.genkit_flows.resume_intelligence_pipeline import generate_resume_intelligence_report
from app.genkit_flows.smart_cover_letter_system import generate_smart_cover_letter

# Type variables
P = ParamSpec('P')
R = TypeVar('R')

# Protocol for model configuration
class ModelConfigProtocol(Protocol):
    """Protocol for model configuration."""

    def generate(self, prompt: str, **kwargs: Any) -> Any:
        ...

# Type for genkit flow
def _noop_flow(*args: Any, **kwargs: Any) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """No-op flow decorator for when genkit is not available."""
    def _decorator(fn: Callable[P, R]) -> Callable[P, R]:
        return fn
    return _decorator

# Type stubs for genkit if not available
try:
    import genkit  # type: ignore[import-not-found]
    from genkit.plugins import google_genai  # type: ignore[import-not-found]
    GENKIT_AVAILABLE = True
except ImportError:
    class _DummyGenkit:
        def __getattr__(self, name: str) -> Any:
            return _noop_flow

    genkit = _DummyGenkit()  # type: ignore[assignment]
    google_genai = None  # type: ignore[assignment]
    GENKIT_AVAILABLE = False

# Initialize genkit flow decorator
genkit_flow: Any = getattr(genkit, "flow", _noop_flow)



# Load environment variables
load_dotenv()

# Initialize genkit with Google AI plugin if available
try:
    if GENKIT_AVAILABLE and hasattr(genkit, 'get_plugin'):
        if not genkit.get_plugin("googleai") and google_genai and hasattr(google_genai, 'init'):
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY environment variable is not set")
            genkit.init(plugins=[google_genai.init(api_key=api_key)])  # type: ignore[attr-defined]
except Exception as e:
    print(f"Warning: Failed to initialize genkit with Google AI plugin: {e}")

# Get model configuration
model_config = get_ai_config().get_model_config("gemini-3.0-flash")
if model_config is None:
    raise RuntimeError("Failed to load model configuration")

# Cast to our protocol type
gemini_pro = cast(ModelConfigProtocol, model_config)


# Data Models
class ApplicationPackage(BaseModel):
    """Represents a complete job application package."""

    tailored_resume: Dict[str, Any] = Field(
        default_factory=dict,
        description="Optimized resume content and analysis"
    )
    cover_letter: Dict[str, Any] = Field(
        default_factory=dict,
        description="Personalized cover letter with analysis"
    )
    ksc_responses: Optional[List[Dict[str, Any]]] = Field(
        default=None,
        description="Key Selection Criteria responses if applicable"
    )
    application_strategy: Dict[str, Any] = Field(
        default_factory=dict,
        description="Strategic guidance for this application"
    )
    submission_checklist: List[str] = Field(
        default_factory=list,
        description="Final submission checklist"
    )
    follow_up_plan: Dict[str, Any] = Field(
        default_factory=dict,
        description="Post-application follow-up strategy"
    )
    package_metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Package generation metadata"
    )


class KscDetectionResult(BaseModel):
    has_ksc_requirements: bool = Field(description="Whether KSC responses are required")
    detected_criteria: List[str] = Field(description="List of detected KSC statements")
    confidence_score: int = Field(description="Confidence in KSC detection (0-100)", ge=0, le=100)
    extraction_notes: List[str] = Field(description="Notes about the extraction process")


@genkit_flow  # type: ignore[call-arg]
@with_ai_error_handling()
def detect_ksc_requirements(job_description: str) -> KscDetectionResult:
    """
    Analyzes job description to detect Key Selection Criteria requirements.

    Args:
        job_description: Full job posting text

    Returns:
        KscDetectionResult: Analysis of KSC requirements
    """
    try:
        if not job_description or not isinstance(job_description, str):
            raise InputValidationError("Job description is required and must be a string")

        sanitized_job = InputSanitizer.sanitize_text_input(job_description)

        if not gemini_pro:
            raise RuntimeError("Model configuration not available")

        if not hasattr(gemini_pro, 'generate'):
            raise RuntimeError("Model configuration does not support generation")

        prompt = f"""
As a recruitment specialist, analyze this job description to identify if Key Selection
Criteria (KSC) responses are required and extract any specific criteria statements.

JOB DESCRIPTION:
{sanitized_job.sanitized_content}

KSC DETECTION ANALYSIS:

1. IDENTIFICATION INDICATORS:
   - Look for phrases like "Key Selection Criteria", "Essential Criteria",
     "Selection Criteria", "Assessment Criteria"
   - Numbered or bulleted lists of specific requirements
   - Statements beginning with "Demonstrate", "Evidence of", "Ability to"
   - Government/public sector language patterns
   - Academic or formal application requirements

2. CRITERIA EXTRACTION:
   - Extract each individual KSC statement as a separate item
   - Preserve the exact wording of each criterion
   - Identify essential vs desirable criteria if specified
   - Note any word limits or response requirements

3. CONFIDENCE ASSESSMENT:
   - High confidence (80-100): Clear KSC language and structure
   - Medium confidence (50-79): Implied criteria structure
   - Low confidence (20-49): Some criteria-like elements
   - Very low confidence (0-19): Standard job requirements only

4. EXTRACTION NOTES:
   - Document the reasoning for the confidence score
   - Note any ambiguities or unclear criteria
   - Identify if criteria are explicitly stated or inferred

Respond with valid JSON matching the KscDetectionResult schema.
"""

        response = gemini_pro.generate(
            prompt=prompt,
            config={"response_mime_type": "application/json"},
            output_schema=KscDetectionResult,
        )

        # Ensure the response has the expected output method
        if not hasattr(response, 'output') or not callable(response.output):
            raise RuntimeError("Invalid response from model: missing output method")

        result = response.output()
        if not isinstance(result, KscDetectionResult):
            raise TypeError(f"Expected KscDetectionResult, got {type(result).__name__}")

        return result

    except Exception as e:
        raise AIError(
            message=f"KSC detection failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


@genkit_flow  # type: ignore[call-arg]
@with_ai_error_handling()
def prepare_full_application(
    job_description: str,
    user_profile: Dict[str, Any],
    application_preferences: Optional[Dict[str, Any]] = None,
    company_research: Optional[Dict[str, Any]] = None,
) -> ApplicationPackage:
    """
    Orchestrates the complete application preparation process by coordinating
    multiple specialized flows to create a comprehensive, tailored application package.

    Args:
        job_description: Full job posting text
        user_profile: Complete user profile with experience, skills, etc.
        application_preferences: Optional preferences for style, format, etc.
        company_research: Optional company research data

    Returns:
        ApplicationPackage: Complete application package with all components
    """
    try:
        # Input validation
        if not all([job_description, user_profile]):
            raise InputValidationError("Job description and user profile are required")

        # Sanitize inputs
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)
        sanitized_profile = InputSanitizer.sanitize_dict_input(user_profile)

        preferences = application_preferences or {}
        company_info = company_research or {}

        package_start_time = datetime.now()

        # Step 1: Detect KSC requirements
        ksc_detection = detect_ksc_requirements(job_description)

        # Step 2: Generate resume intelligence report
        resume_content = user_profile.get("resume_content", "")
        target_industry = preferences.get("target_industry")
        career_goals = user_profile.get("career_goals")
        experience_level = user_profile.get("experience_level", "mid_level")

        resume_intelligence = generate_resume_intelligence_report(
            resume_content=resume_content,
            target_industry=target_industry,
            career_goals=career_goals,
            experience_level=experience_level,
        )

        # Step 3: Generate smart cover letter
        cover_letter_style = preferences.get("cover_letter_style", "professional")
        cover_letter_format = preferences.get("cover_letter_format", "full_letter")
        special_instructions = preferences.get("special_instructions")

        cover_letter = generate_smart_cover_letter(
            candidate_profile=sanitized_profile,
            job_description=job_description,
            company_info=company_info,
            style=cover_letter_style,
            format_type=cover_letter_format,
            special_instructions=special_instructions,
        )

        # Step 4: Generate KSC responses if required
        ksc_responses = None
        if ksc_detection.has_ksc_requirements and ksc_detection.detected_criteria:
            ksc_responses = []
            for criterion in ksc_detection.detected_criteria[:5]:  # Limit to 5 KSCs
                try:
                    ksc_response = generateKscResponse(
                        user_profile_data=sanitized_profile, ksc_statement=criterion
                    )
                    ksc_responses.append(
                        {
                            "ksc_statement": criterion,
                            "response": ksc_response,
                            "generation_status": "success",
                        }
                    )
                except Exception as e:
                    ksc_responses.append(
                        {
                            "ksc_statement": criterion,
                            "error": str(e),
                            "generation_status": "failed",
                        }
                    )

        # Step 5: Generate application strategy and guidelines
        strategy_prompt = f"""
As a senior career strategist, create a comprehensive application strategy
and submission plan based on the generated application materials.

JOB DESCRIPTION:
{sanitized_job.sanitized_content}

GENERATED MATERIALS SUMMARY:
- Resume Intelligence Score: {resume_intelligence.market_readiness}/100
- Cover Letter Style: {cover_letter_style}
- KSC Requirements: {'Yes' if ksc_detection.has_ksc_requirements else 'No'}
- KSC Count: {len(ksc_detection.detected_criteria) if ksc_detection.detected_criteria else 0}

USER PROFILE SUMMARY:
{json.dumps(sanitized_profile, separators=(",", ":"))[:1000]}...

Create a comprehensive application strategy including:

1. SUBMISSION STRATEGY:
   - Optimal timing for application submission
   - Application channel recommendations (direct, recruiter, networking)
   - Formatting and presentation guidelines
   - Document naming conventions

2. COMPETITIVE POSITIONING:
   - Key differentiators to emphasize
   - How to stand out among other candidates
   - Potential weaknesses and mitigation strategies
   - Unique value proposition summary

3. SUBMISSION CHECKLIST:
   - Final review items before submission
   - Document quality checks
   - Application completeness verification
   - Technical submission requirements

4. FOLLOW-UP STRATEGY:
   - Timeline for follow-up communications
   - Networking opportunities related to this role
   - Interview preparation priorities
   - Salary negotiation preparation points

Respond with a JSON object containing these strategic insights.
"""

        strategy_response = gemini_pro.generate(
            strategy_prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            },
        )

        try:
            application_strategy = json.loads(strategy_response.output())
        except json.JSONDecodeError:
            application_strategy = {
                "submission_strategy": ["Review all materials before submitting"],
                "competitive_positioning": ["Highlight unique qualifications"],
                "error": "Strategy generation failed - using fallback",
            }

        # Generate submission checklist
        submission_checklist = [
            "Review resume for job-specific keywords and achievements",
            "Proofread cover letter for personalization and company details",
            "Verify all contact information is current and professional",
            "Check document formatting and file naming conventions",
            "Ensure application addresses all stated requirements",
        ]

        if ksc_responses:
            submission_checklist.extend(
                [
                    "Review each KSC response for STAR methodology compliance",
                    "Verify word limits are met for all KSC responses",
                    "Check for experience overlap across KSC responses",
                ]
            )

        # Create follow-up plan
        follow_up_plan = {
            "immediate_actions": [
                "Save application confirmation and reference numbers",
                "Add application to job tracking system",
                "Set calendar reminder for follow-up",
            ],
            "one_week_follow_up": "Send brief follow-up email if no acknowledgment received",
            "two_week_follow_up": "Connect with hiring manager or team members on LinkedIn",
            "ongoing_strategy": "Continue networking and research about the company",
            "interview_preparation": "Begin preparing for potential interview questions based on job requirements",
        }

        package_end_time = datetime.now()
        processing_time = (package_end_time - package_start_time).total_seconds()

        # Create final package
        application_package = ApplicationPackage(
            tailored_resume=resume_intelligence.dict(),
            cover_letter=cover_letter.dict(),
            ksc_responses=ksc_responses,
            application_strategy=application_strategy,
            submission_checklist=submission_checklist,
            follow_up_plan=follow_up_plan,
            package_metadata={
                "generation_timestamp": package_start_time.isoformat(),
                "processing_time_seconds": processing_time,
                "ksc_detection": ksc_detection.dict(),
                "preferences_applied": preferences,
                "company_research_used": bool(company_info),
                "components_generated": {
                    "resume_intelligence": True,
                    "cover_letter": True,
                    "ksc_responses": bool(ksc_responses),
                    "application_strategy": True,
                },
                "total_ksc_count": len(ksc_responses) if ksc_responses else 0,
            },
        )

        return application_package

    except Exception as e:
        raise AIError(
            message=f"Application preparation workflow failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Utility function for quick application assessment
@genkit_flow  # type: ignore[call-arg]
@with_ai_error_handling()
def assess_application_readiness(
    user_profile: Dict[str, Any],
    job_description: str
) -> Dict[str, Any]:
    """
    Quick assessment of application readiness without full generation.

    Args:
        user_profile: User profile data
        job_description: Job posting text

    Returns:
        dict: Readiness assessment with recommendations
    """
    try:
        sanitized_profile = InputSanitizer.sanitize_dict_input(user_profile)
        sanitized_job = InputSanitizer.sanitize_text_input(job_description)

        prompt = f"""
As an application readiness consultant, assess how prepared this candidate
is to apply for this specific role and provide actionable recommendations.

JOB DESCRIPTION:
{sanitized_job.sanitized_content}

CANDIDATE PROFILE:
{json.dumps(sanitized_profile, separators=(",", ":"))}

READINESS ASSESSMENT:

1. QUALIFICATION ALIGNMENT:
   - Score alignment with job requirements (0-100)
   - Essential requirements coverage
   - Desirable requirements coverage
   - Experience level match

2. APPLICATION STRENGTH:
   - Resume competitiveness score (0-100)
   - Unique value proposition clarity
   - Achievement quantification quality
   - Skill demonstration evidence

3. PREPARATION GAPS:
   - Missing qualifications or experiences
   - Weak areas needing strengthening
   - Additional preparation required
   - Timeline for addressing gaps

4. SUCCESS PROBABILITY:
   - Likelihood of interview invitation (0-100)
   - Competitive positioning assessment
   - Key risk factors
   - Opportunity factors

5. IMMEDIATE ACTIONS:
   - Priority improvements before applying
   - Quick wins for application strength
   - Research and preparation tasks
   - Timeline recommendations

Respond with valid JSON containing the assessment results.
"""

        response = gemini_pro.generate(
            prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.3,
            },
        )

        return json.loads(response.output())

    except Exception as e:
        raise AIError(
            message=f"Application readiness assessment failed: {str(e)}",
            error_type=AIErrorType.GENERATION_FAILED,
            original_error=e,
        )


# Export main functions
__all__ = [
    "prepare_full_application",
    "detect_ksc_requirements",
    "assess_application_readiness",
    "ApplicationPackage",
    "KscDetectionResult",
]
