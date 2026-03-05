"""
Career Application Workflow using Firebase Genkit

High-level orchestrator flow that creates a complete job application package
by chaining resume intelligence pipeline, smart cover letter system, and KSC generator.
"""

import json
from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from app.core.ai_config import get_ai_config
from app.core.ai_error_handling import with_ai_error_handling
from app.core.input_validation import InputSanitizer, InputValidationError

from app.genkit_flows.flow_decorator import async_genkit_flow
from app.core.monitoring import monitor_performance
from .ksc_generator import STARResponse, generateKscResponse
from .resume_optimizer import optimize_resume
from ai.schemas.backend.document_models import CareerProfile, TailoredResumeResult

# Import required flows
from .resume_intelligence_pipeline import (
    ResumeIntelligenceReport,
    generate_resume_intelligence_report,
)
from .smart_cover_letter_system import (
    CompanyResearchInsights,
    SmartCoverLetter,
    generate_smart_cover_letter,
    research_company_for_application,
)

try:
    import genkit
    from genkit.ai import flow as genkit_flow

    GENKIT_AVAILABLE = True
except ImportError:
    genkit = None  # type: ignore[assignment]
    GENKIT_AVAILABLE = False

    def _noop_flow(*args, **kwargs):
        def _decorator(fn):
            return fn

        return _decorator

    genkit_flow = _noop_flow

gemini_pro = get_ai_config().get_model_config("gemini-3.0-flash")


# ... TailoredResumeResult now imported from document_models ...


class KSCResponsesResult(BaseModel):
    """Result structure for KSC responses generation"""

    generated_responses: List[Dict[str, STARResponse]] = Field(
        default_factory=list, description="Generated KSC STAR responses"
    )
    total_criteria_addressed: int = Field(default=0, description="Number of criteria addressed")
    coverage_completeness: str = Field(default="minimal", description="full, partial, or minimal coverage")
    response_quality_score: int = Field(
        default=0, description="Overall response quality (0-100)", ge=0, le=100
    )


class ApplicationPackageResult(BaseModel):
    """Complete application package result"""

    success: bool = Field(description="Whether package generation succeeded")

    # Core components
    tailored_resume: Optional[TailoredResumeResult] = Field(default=None, description="Tailored resume result")
    cover_letter: Optional[SmartCoverLetter] = Field(default=None, description="Generated cover letter")
    ksc_responses: Optional[KSCResponsesResult] = Field(default=None, description="KSC responses if applicable")

    # Supporting analysis
    resume_intelligence: Optional[ResumeIntelligenceReport] = Field(
        default=None,
        description="Resume intelligence analysis"
    )
    company_research: Optional[CompanyResearchInsights] = Field(
        default=None,
        description="Company research insights"
    )

    # Package metadata
    job_match_score: int = Field(default=0, description="Overall job match score (0-100)", ge=0, le=100)
    application_strength: str = Field(default="weak", description="excellent, strong, good, fair, or weak")
    competitive_positioning: List[str] = Field(default_factory=list, description="Key competitive advantages")
    success_probability: int = Field(
        default=0, description="Estimated application success probability", ge=0, le=100
    )

    # Recommendations
    application_strategy: List[str] = Field(default_factory=list, description="Strategic recommendations for application")
    interview_prep_focus: List[str] = Field(default_factory=list, description="Key areas for interview preparation")
    follow_up_recommendations: List[str] = Field(default_factory=list, description="Follow-up strategy recommendations")

    # Processing details
    generation_timestamp: str = Field(default_factory=lambda: datetime.now().isoformat(), description="When package was generated")
    processing_time_seconds: float = Field(default=0.0, description="Total processing time")
    components_generated: List[str] = Field(default_factory=list, description="Successfully generated components")
    error_details: List[str] = Field(default_factory=list, description="Any errors encountered")


@async_genkit_flow(output_schema=ApplicationPackageResult)
@monitor_performance("career_application_workflow")
async def generate_application_package(
    job_description: str, user_profile: Dict
) -> ApplicationPackageResult:
    """
    One-Click Application Workflow: Generate a complete job application package
    by orchestrating resume intelligence, cover letter generation, and KSC responses.

    Args:
        job_description: Full job posting description
        user_profile: Comprehensive user profile data including resume content

    Returns:
        ApplicationPackageResult: Complete application package with all components
    """
    start_time = datetime.now()

    # Initialize result structure
    result = ApplicationPackageResult(
        success=False,
        job_match_score=0,
        application_strength="weak",
        competitive_positioning=[],
        success_probability=0,
        application_strategy=[],
        interview_prep_focus=[],
        follow_up_recommendations=[],
        generation_timestamp=start_time.isoformat(),
        processing_time_seconds=0.0,
        components_generated=[],
    )

    try:
        # Input validation
        if not job_description or not isinstance(job_description, str):
            raise InputValidationError("Job description is required and must be a string")

        if not user_profile or not isinstance(user_profile, dict):
            raise InputValidationError("User profile is required and must be a dictionary")

        # Sanitize inputs
        sanitized_job_desc = InputSanitizer.sanitize_text_input(job_description)
        sanitized_profile_dict = InputSanitizer.sanitize_dict_input(user_profile)

        # Build unified CareerProfile
        profile = CareerProfile.from_legacy_dict(
            sanitized_profile_dict,
            sanitized_job_desc.sanitized_content
        )

        print("Starting application package generation...")

        # Step 1: Resume Intelligence Analysis
        print("Step 1: Analyzing resume and generating intelligence report...")
        try:
            resume_content = sanitized_profile_dict.get("resume_content", "")
            if not resume_content:
                # Try alternative profile fields
                resume_content = (
                    sanitized_profile_dict.get("profile_summary", "")
                    + "\n"
                    + str(sanitized_profile_dict.get("experience", []))
                    + "\n"
                    + str(sanitized_profile_dict.get("skills", []))
                )

            if resume_content:
                result.resume_intelligence = await generate_resume_intelligence_report(
                    resume_content=resume_content,
                    target_industry=sanitized_profile_dict.get("target_industry"),
                    career_goals=sanitized_profile_dict.get("career_goals"),
                    experience_level=sanitized_profile_dict.get("experience_level", "mid_level"),
                )
                result.components_generated.append("resume_intelligence")
                print("✓ Resume intelligence analysis completed")
            else:
                print("⚠ No resume content found in profile, skipping resume intelligence")

        except Exception as e:
            result.error_details.append(f"Resume intelligence failed: {str(e)}")
            print(f"✗ Resume intelligence failed: {str(e)}")

        # Step 2: Company Research (if company info is available)
        print("Step 2: Conducting company research...")
        try:
            company_name = _extract_company_name(sanitized_job_desc.sanitized_content)
            industry = sanitized_profile_dict.get("target_industry", "Technology")
            job_role = _extract_job_role(sanitized_job_desc.sanitized_content)

            if company_name:
                result.company_research = await research_company_for_application(
                    company_name=company_name, industry=industry, job_role=job_role
                )
                result.components_generated.append("company_research")
                print(f"✓ Company research completed for {company_name}")
            else:
                print("⚠ Company name not identified, skipping company research")

        except Exception as e:
            result.error_details.append(f"Company research failed: {str(e)}")
            print(f"✗ Company research failed: {str(e)}")

        # Step 3: Generate Tailored Resume
        print("Step 3: Creating tailored resume...")
        try:
            if result.resume_intelligence:
                # Use missing keywords from intelligence report if available
                missing_keywords = result.resume_intelligence.resume_analysis.missing_elements or []
                result.tailored_resume = await optimize_resume(
                    profile=profile,
                    missing_keywords=missing_keywords
                )
                result.components_generated.append("tailored_resume")
                print("✓ Tailored resume generated via optimize_resume flow")
            else:
                print("⚠ Skipping tailored resume (no resume intelligence)")

        except Exception as e:
            result.error_details.append(f"Resume tailoring failed: {str(e)}")
            print(f"✗ Resume tailoring failed: {str(e)}")

        # Step 4: Generate Smart Cover Letter
        print("Step 4: Generating smart cover letter...")
        try:
            company_info = result.company_research.dict() if result.company_research else None

            result.cover_letter = await generate_smart_cover_letter(
                profile=profile,
                job_description=sanitized_job_desc.sanitized_content,
                company_info=company_info,
                style="professional",
                format_type="full_letter",
            )
            result.components_generated.append("cover_letter")
            print("✓ Smart cover letter generated")

        except Exception as e:
            result.error_details.append(f"Cover letter generation failed: {str(e)}")
            print(f"✗ Cover letter generation failed: {str(e)}")

        # Step 5: Generate KSC Responses (if KSC criteria are detected)
        print("Step 5: Generating KSC responses...")
        try:
            ksc_criteria = _detect_ksc_criteria(sanitized_job_desc.sanitized_content)

            if ksc_criteria:
                result.ksc_responses = await _generate_ksc_responses(ksc_criteria, profile)
                result.components_generated.append("ksc_responses")
                print(f"✓ Generated {len(ksc_criteria)} KSC responses")
            else:
                print("⚠ No KSC criteria detected in job description")

        except Exception as e:
            result.error_details.append(f"KSC generation failed: {str(e)}")
            print(f"✗ KSC generation failed: {str(e)}")

        # Step 6: Generate Application Strategy and Recommendations
        print("Step 6: Generating application strategy...")
        try:
            _generate_application_strategy(result, sanitized_job_desc.sanitized_content)
            print("✓ Application strategy generated")

        except Exception as e:
            result.error_details.append(f"Strategy generation failed: {str(e)}")
            print(f"✗ Strategy generation failed: {str(e)}")

        # Determine overall success
        result.success = len(result.components_generated) >= 2  # At least 2 components must succeed
        result.processing_time_seconds = (datetime.now() - start_time).total_seconds()

        print("Application package generation completed:")
        print(f"- Success: {result.success}")
        print(f"- Components generated: {result.components_generated}")
        print(f"- Processing time: {result.processing_time_seconds:.2f}s")

        return result

    except Exception as e:
        result.success = False
        result.error_details.append(f"Workflow failed: {str(e)}")
        result.processing_time_seconds = (datetime.now() - start_time).total_seconds()

        print(f"Application package generation failed: {str(e)}")
        return result


async def _generate_ksc_responses(
    criteria: List[str], profile: CareerProfile
) -> KSCResponsesResult:
    """Generate STAR responses for all identified KSC criteria."""
    responses = []

    for criterion in criteria:
        try:
            star_response = await generateKscResponse(
                profile=profile, ksc_statement=criterion
            )
            responses.append({criterion: star_response})
        except Exception as e:
            print(f"  ⚠ Failed to generate response for criterion: {criterion[:30]}... ({str(e)})")

    return KSCResponsesResult(
        generated_responses=responses,
        total_criteria_addressed=len(responses),
        coverage_completeness="full" if len(responses) == len(criteria) else "partial",
        response_quality_score=85 if responses else 0,
    )


def _generate_application_strategy(result: ApplicationPackageResult, job_description: str):
    """Generate comprehensive application strategy and recommendations."""

    # Calculate overall match score based on available components
    match_score: float = 50.0  # Base score

    if result.resume_intelligence:
        match_score += result.resume_intelligence.resume_analysis.overall_score * 0.3

    if result.cover_letter:
        match_score += result.cover_letter.analysis.compelling_score * 0.2

    if result.tailored_resume:
        match_score += result.tailored_resume.tailored_score * 0.2

    if result.ksc_responses:
        match_score += result.ksc_responses.response_quality_score * 0.3

    result.job_match_score = min(int(match_score), 100)

    # Determine application strength
    if result.job_match_score >= 85:
        result.application_strength = "excellent"
    elif result.job_match_score >= 75:
        result.application_strength = "strong"
    elif result.job_match_score >= 65:
        result.application_strength = "good"
    elif result.job_match_score >= 50:
        result.application_strength = "fair"
    else:
        result.application_strength = "weak"

    # Generate strategy recommendations
    result.application_strategy = [
        "Submit application within 48 hours for maximum visibility",
        "Follow up with hiring manager or recruiter after 1 week",
        "Leverage network connections if available at the company",
        "Prepare for behavioral interviews focusing on relevant experience",
    ]

    result.interview_prep_focus = [
        "Practice STAR method responses for key competencies",
        "Research company culture and recent developments",
        "Prepare specific examples demonstrating job requirements",
        "Review technical skills mentioned in job posting",
    ]

    result.follow_up_recommendations = [
        "Send personalized thank you email within 24 hours of application",
        "Connect with team members on LinkedIn with personalized message",
        "Follow up every 2 weeks if no response received",
        "Express continued interest and provide additional relevant information",
    ]

    # Set competitive positioning
    result.competitive_positioning = [
        "Strong alignment between experience and job requirements",
        "Demonstrated track record of relevant achievements",
        "Cultural fit with company values and mission",
    ]

    # Calculate success probability
    base_probability = result.job_match_score
    if result.cover_letter and result.cover_letter.analysis.personalization_score > 80:
        base_probability += 10
    if result.tailored_resume:
        base_probability += 10
    if result.ksc_responses and result.ksc_responses.coverage_completeness == "full":
        base_probability += 15

    result.success_probability = min(base_probability, 95)


def _extract_company_name(job_description: str) -> Optional[str]:
    """Extract company name from job description using simple heuristics."""
    # This is a simplified implementation - could be enhanced with NLP
    lines = job_description.split("\n")[:10]  # Check first 10 lines
    keywords = ["company:", "employer:", "organization:"]

    for line in lines:
        line_lower = line.lower()
        # Check which keyword is present and extract immediately
        for keyword in keywords:
            if keyword in line_lower:
                company = line_lower.split(keyword, 1)[1].strip()
                return company.split()[0].title() if company else None

    return None


def _extract_job_role(job_description: str) -> str:
    """Extract job role/title from job description."""
    lines = job_description.split("\n")[:5]  # Check first 5 lines
    keywords = ["position:", "role:", "title:"]

    for line in lines:
        line_lower = line.lower()
        # Check which keyword is present and extract immediately
        for keyword in keywords:
            if keyword in line_lower:
                role = line_lower.split(keyword, 1)[1].strip()
                return role.title() if role else "Software Engineer"

    # Default fallback
    return "Professional Role"


def _detect_ksc_criteria(job_description: str) -> List[str]:
    """Detect Key Selection Criteria from job description."""
    ksc_keywords = [
        "key selection criteria",
        "selection criteria",
        "essential criteria",
        "required criteria",
        "must have",
        "essential requirements",
    ]

    criteria = []
    job_desc_lower = job_description.lower()

    # Simple detection - look for numbered lists or bullet points after KSC keywords
    if any(keyword in job_desc_lower for keyword in ksc_keywords):
        lines = job_description.split("\n")
        in_criteria_section = False

        for line in lines:
            line_stripped = line.strip()
            line_lower = line_stripped.lower()

            # Start of criteria section
            if any(keyword in line_lower for keyword in ksc_keywords):
                in_criteria_section = True
                continue

            # End of criteria section (empty line or new section)
            if in_criteria_section and (not line_stripped or line_lower.startswith("desirable")):
                break

            # Extract criteria (numbered or bulleted items)
            if in_criteria_section and line_stripped:
                if line_stripped[0].isdigit() or line_stripped.startswith(("•", "-", "*")):
                    criterion = line_stripped.lstrip("0123456789.-•* ").strip()
                    if len(criterion) > 20:  # Filter out very short items
                        criteria.append(criterion)

    return criteria[:5]  # Limit to 5 criteria


# Export main functions
__all__ = [
    "generate_application_package",
    "ApplicationPackageResult",
    "TailoredResumeResult",
    "KSCResponsesResult",
]
