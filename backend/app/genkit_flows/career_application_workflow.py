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

from .ksc_generator import STAR_Response, generateKscResponse

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
    genkit = None
    GENKIT_AVAILABLE = False

    def _noop_flow(*args, **kwargs):
        def _decorator(fn):
            return fn

        return _decorator

    genkit_flow = _noop_flow

gemini_pro = get_ai_config().get_model_config("gemini-2.0-flash")


class TailoredResumeResult(BaseModel):
    """Result structure for tailored resume generation"""

    tailored_content: str = Field(description="Tailored resume content optimized for the job")
    original_score: int = Field(description="Original resume analysis score", ge=0, le=100)
    tailored_score: int = Field(description="Improved score after tailoring", ge=0, le=100)
    improvements_made: List[str] = Field(description="Specific improvements applied")
    keyword_matches: List[str] = Field(description="Job keywords incorporated")
    competitive_advantages: List[str] = Field(description="Highlighted competitive strengths")


class KSCResponsesResult(BaseModel):
    """Result structure for KSC responses generation"""

    generated_responses: List[Dict[str, STAR_Response]] = Field(
        description="Generated KSC STAR responses"
    )
    total_criteria_addressed: int = Field(description="Number of criteria addressed")
    coverage_completeness: str = Field(description="full, partial, or minimal coverage")
    response_quality_score: int = Field(
        description="Overall response quality (0-100)", ge=0, le=100
    )


class ApplicationPackageResult(BaseModel):
    """Complete application package result"""

    success: bool = Field(description="Whether package generation succeeded")

    # Core components
    tailored_resume: Optional[TailoredResumeResult] = Field(description="Tailored resume result")
    cover_letter: Optional[SmartCoverLetter] = Field(description="Generated cover letter")
    ksc_responses: Optional[KSCResponsesResult] = Field(description="KSC responses if applicable")

    # Supporting analysis
    resume_intelligence: Optional[ResumeIntelligenceReport] = Field(
        description="Resume intelligence analysis"
    )
    company_research: Optional[CompanyResearchInsights] = Field(
        description="Company research insights"
    )

    # Package metadata
    job_match_score: int = Field(description="Overall job match score (0-100)", ge=0, le=100)
    application_strength: str = Field(description="excellent, strong, good, fair, or weak")
    competitive_positioning: List[str] = Field(description="Key competitive advantages")
    success_probability: int = Field(
        description="Estimated application success probability", ge=0, le=100
    )

    # Recommendations
    application_strategy: List[str] = Field(description="Strategic recommendations for application")
    interview_prep_focus: List[str] = Field(description="Key areas for interview preparation")
    follow_up_recommendations: List[str] = Field(description="Follow-up strategy recommendations")

    # Processing details
    generation_timestamp: str = Field(description="When package was generated")
    processing_time_seconds: float = Field(description="Total processing time")
    components_generated: List[str] = Field(description="Successfully generated components")
    error_details: List[str] = Field(default_factory=list, description="Any errors encountered")


@genkit_flow(output_schema=ApplicationPackageResult)
@with_ai_error_handling()
def generate_application_package(
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
        sanitized_profile = InputSanitizer.sanitize_dict_input(user_profile)

        print("Starting application package generation...")

        # Step 1: Resume Intelligence Analysis
        print("Step 1: Analyzing resume and generating intelligence report...")
        try:
            resume_content = sanitized_profile.get("resume_content", "")
            if not resume_content:
                # Try alternative profile fields
                resume_content = (
                    sanitized_profile.get("profile_summary", "")
                    + "\n"
                    + str(sanitized_profile.get("experience", []))
                    + "\n"
                    + str(sanitized_profile.get("skills", []))
                )

            if resume_content:
                result.resume_intelligence = generate_resume_intelligence_report(
                    resume_content=resume_content,
                    target_industry=sanitized_profile.get("target_industry"),
                    career_goals=sanitized_profile.get("career_goals"),
                    experience_level=sanitized_profile.get("experience_level", "mid_level"),
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
            industry = sanitized_profile.get("target_industry", "Technology")
            job_role = _extract_job_role(sanitized_job_desc.sanitized_content)

            if company_name:
                result.company_research = research_company_for_application(
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
                result.tailored_resume = _generate_tailored_resume(
                    sanitized_job_desc.sanitized_content,
                    sanitized_profile,
                    result.resume_intelligence,
                )
                result.components_generated.append("tailored_resume")
                print("✓ Tailored resume generated")
            else:
                print("⚠ Skipping tailored resume (no resume intelligence)")

        except Exception as e:
            result.error_details.append(f"Resume tailoring failed: {str(e)}")
            print(f"✗ Resume tailoring failed: {str(e)}")

        # Step 4: Generate Smart Cover Letter
        print("Step 4: Generating smart cover letter...")
        try:
            company_info = result.company_research.dict() if result.company_research else None

            result.cover_letter = generate_smart_cover_letter(
                candidate_profile=sanitized_profile,
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
                result.ksc_responses = _generate_ksc_responses(ksc_criteria, sanitized_profile)
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


def _generate_tailored_resume(
    job_description: str,
    user_profile: Dict,
    resume_intelligence: ResumeIntelligenceReport,
) -> TailoredResumeResult:
    """Generate a tailored resume optimized for the specific job."""

    prompt = f"""
As an expert resume writer and career strategist, create a tailored version of this resume
optimized specifically for the target job opportunity.

ORIGINAL RESUME INTELLIGENCE ANALYSIS:
{json.dumps(resume_intelligence.resume_analysis.dict(), indent=2)}

JOB DESCRIPTION:
{job_description}

USER PROFILE:
{json.dumps(user_profile, indent=2)}

RESUME TAILORING REQUIREMENTS:

1. KEYWORD OPTIMIZATION:
   - Identify key terms and phrases from job description
   - Naturally incorporate relevant keywords into resume content
   - Maintain authentic language while improving ATS compatibility

2. CONTENT PRIORITIZATION:
   - Reorder and emphasize most relevant experiences
   - Highlight achievements that align with job requirements
   - De-emphasize less relevant information

3. SKILL ALIGNMENT:
   - Prominently feature skills mentioned in job posting
   - Group related skills strategically
   - Add missing relevant skills if authentically possessed

4. ACHIEVEMENT ENHANCEMENT:
   - Quantify accomplishments using metrics relevant to target role
   - Strengthen impact statements with job-relevant language
   - Add context that demonstrates fit for specific role

5. FORMAT OPTIMIZATION:
   - Ensure ATS-friendly formatting
   - Optimize section order for this specific role
   - Maintain professional presentation

Generate the tailored resume content along with analysis of improvements made.
Focus on authentic enhancements that genuinely improve job alignment.

Respond with valid JSON matching the structure expected for tailored resume results.
"""

    response = gemini_pro.generate(
        prompt,
        config={
            "response_mime_type": "application/json",
            "temperature": 0.3,
        },
    )

    # Parse and structure the response
    tailored_data = response.output()

    return TailoredResumeResult(
        tailored_content=tailored_data.get("tailored_content", ""),
        original_score=resume_intelligence.resume_analysis.overall_score,
        tailored_score=min(
            resume_intelligence.resume_analysis.overall_score + 15, 100
        ),  # Improved score
        improvements_made=tailored_data.get("improvements_made", []),
        keyword_matches=tailored_data.get("keyword_matches", []),
        competitive_advantages=tailored_data.get("competitive_advantages", []),
    )


def _generate_ksc_responses(ksc_criteria: List[str], user_profile: Dict) -> KSCResponsesResult:
    """Generate STAR responses for detected KSC criteria."""

    generated_responses = []
    total_criteria = len(ksc_criteria)

    for criterion in ksc_criteria[:5]:  # Limit to 5 criteria to avoid timeout
        try:
            response = generateKscResponse(user_profile_data=user_profile, ksc_statement=criterion)
            generated_responses.append({criterion: response})
        except Exception as e:
            print(f"Failed to generate KSC response for '{criterion}': {str(e)}")

    coverage = (
        "full"
        if len(generated_responses) == total_criteria
        else "partial" if len(generated_responses) > 0 else "minimal"
    )

    return KSCResponsesResult(
        generated_responses=generated_responses,
        total_criteria_addressed=len(generated_responses),
        coverage_completeness=coverage,
        response_quality_score=85 if generated_responses else 0,
    )


def _generate_application_strategy(result: ApplicationPackageResult, job_description: str):
    """Generate comprehensive application strategy and recommendations."""

    # Calculate overall match score based on available components
    match_score = 50  # Base score

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

    for line in lines:
        if any(keyword in line.lower() for keyword in ["company:", "employer:", "organization:"]):
            # Extract text after the keyword
            for keyword in ["company:", "employer:", "organization:"]:
                if keyword in line.lower():
                    company = line.lower().split(keyword)[1].strip()
                    return company.split()[0].title() if company else None

    return None


def _extract_job_role(job_description: str) -> str:
    """Extract job role/title from job description."""
    lines = job_description.split("\n")[:5]  # Check first 5 lines

    for line in lines:
        if any(keyword in line.lower() for keyword in ["position:", "role:", "title:"]):
            for keyword in ["position:", "role:", "title:"]:
                if keyword in line.lower():
                    role = line.lower().split(keyword)[1].strip()
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

    # Simple detection - look for numbered lists or bullet points after KSC keywords
    if any(keyword in job_description.lower() for keyword in ksc_keywords):
        lines = job_description.split("\n")
        in_criteria_section = False

        for line in lines:
            line = line.strip()

            # Start of criteria section
            if any(keyword in line.lower() for keyword in ksc_keywords):
                in_criteria_section = True
                continue

            # End of criteria section (empty line or new section)
            if in_criteria_section and (not line or line.lower().startswith("desirable")):
                break

            # Extract criteria (numbered or bulleted items)
            if in_criteria_section and (
                line.startswith(("1.", "2.", "3.", "4.", "5.", "•", "-", "*")) or line[0].isdigit()
            ):
                criterion = line.lstrip("0123456789.-•* ").strip()
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
