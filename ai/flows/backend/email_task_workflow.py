"""
Email Scanning & Task Generation Workflow using Firebase Genkit

Provides a proactive, manually-triggered workflow that finds and manages job
opportunities from email, ranks them, and creates calendar tasks for the best matches.
"""

from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel, Field

from app.core.ai_config import get_ai_config
from app.core.ai_error_handling import with_ai_error_handling
from app.core.database import SessionLocal
from app.core.input_validation import InputSanitizer, InputValidationError
from app.models.database import User

from .advanced_job_matching import analyze_job_match_detailed
from .calendar_manager import createCalendarEvent

# Import required flows
from .email_scanner import scanEmailsForJobOpportunities

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


class OpportunityTaskResult(BaseModel):
    """Result structure for processed opportunities"""

    opportunity_id: str = Field(description="ID of the opportunity")
    job_title: str = Field(description="Job title")
    company: str = Field(description="Company name")
    match_score: int = Field(description="Compatibility score (0-100)", ge=0, le=100)
    task_created: bool = Field(description="Whether a calendar task was created")
    calendar_event_id: str = Field(default="", description="Calendar event ID if created")
    processing_status: str = Field(description="success, failed, or skipped")
    error_message: str = Field(default="", description="Error message if processing failed")


class WorkflowResult(BaseModel):
    """Overall workflow result structure"""

    success: bool = Field(description="Whether the workflow completed successfully")
    total_opportunities_found: int = Field(description="Total opportunities found in email")
    opportunities_processed: int = Field(description="Number of opportunities processed")
    high_scoring_opportunities: int = Field(description="Opportunities with score > 80")
    tasks_created: int = Field(description="Number of calendar tasks created")
    processing_results: List[OpportunityTaskResult] = Field(
        description="Individual processing results"
    )
    workflow_timestamp: str = Field(description="Workflow execution timestamp")
    execution_time_seconds: float = Field(description="Total execution time")
    error_message: str = Field(default="", description="Error message if workflow failed")


@genkit_flow(output_schema=WorkflowResult)
@with_ai_error_handling()
async def scan_inbox_for_opportunities(user_id: str) -> WorkflowResult:
    """
    Proactive workflow that scans emails for job opportunities, ranks them using
    advanced matching, and creates calendar tasks for high-scoring matches.

    Workflow Steps:
    1. Run email_scanner flow to get potential job opportunities
    2. For each opportunity, run advanced_job_matching to get compatibility score
    3. If score > 80, create a calendar task using calendar_manager flow
    4. Return comprehensive results with processing details

    Args:
        user_id: User identifier for email scanning and task creation

    Returns:
        WorkflowResult: Comprehensive workflow results including processing details
    """
    start_time = datetime.now()

    try:
        # Input validation
        if not user_id or not isinstance(user_id, str):
            raise InputValidationError("User ID is required and must be a string")

        # Sanitize user_id
        sanitized_user_id = InputSanitizer.sanitize_text_input(user_id).sanitized_content

        # Initialize workflow result
        workflow_result = WorkflowResult(
            success=False,
            total_opportunities_found=0,
            opportunities_processed=0,
            high_scoring_opportunities=0,
            tasks_created=0,
            processing_results=[],
            workflow_timestamp=start_time.isoformat(),
            execution_time_seconds=0.0,
        )

        # Step 1: Scan emails for job opportunities
        print(f"Starting email scan for user: {sanitized_user_id}")
        email_scan_result = await scanEmailsForJobOpportunities(sanitized_user_id)

        if not email_scan_result.get("success", False):
            workflow_result.error_message = (
                f"Email scanning failed: {email_scan_result.get('error', 'Unknown error')}"
            )
            workflow_result.execution_time_seconds = (datetime.now() - start_time).total_seconds()
            return workflow_result

        opportunities = email_scan_result.get("opportunities", [])
        workflow_result.total_opportunities_found = len(opportunities)

        if not opportunities:
            print("No job opportunities found in emails")
            workflow_result.success = True
            workflow_result.execution_time_seconds = (datetime.now() - start_time).total_seconds()
            return workflow_result

        # Get user profile for job matching
        user_profile = await _get_user_profile(sanitized_user_id)

        # Step 2 & 3: Process each opportunity
        for opportunity in opportunities:
            opportunity_result = await _process_opportunity(
                sanitized_user_id, opportunity, user_profile
            )

            workflow_result.processing_results.append(opportunity_result)
            workflow_result.opportunities_processed += 1

            if opportunity_result.match_score > 80:
                workflow_result.high_scoring_opportunities += 1

            if opportunity_result.task_created:
                workflow_result.tasks_created += 1

        # Workflow completed successfully
        workflow_result.success = True
        workflow_result.execution_time_seconds = (datetime.now() - start_time).total_seconds()

        print("Workflow completed successfully:")
        print(f"- Opportunities found: {workflow_result.total_opportunities_found}")
        print(f"- High-scoring opportunities: {workflow_result.high_scoring_opportunities}")
        print(f"- Calendar tasks created: {workflow_result.tasks_created}")

        return workflow_result

    except Exception as e:
        workflow_result.success = False
        workflow_result.error_message = str(e)
        workflow_result.execution_time_seconds = (datetime.now() - start_time).total_seconds()

        print(f"Workflow failed for user {user_id}: {str(e)}")
        return workflow_result


async def _process_opportunity(
    user_id: str, opportunity: Dict, user_profile: Dict
) -> OpportunityTaskResult:
    """
    Process a single opportunity: analyze match score and create calendar task if high-scoring.

    Args:
        user_id: User identifier
        opportunity: Job opportunity data
        user_profile: User profile for matching

    Returns:
        OpportunityTaskResult: Processing result for this opportunity
    """
    opportunity_result = OpportunityTaskResult(
        opportunity_id=opportunity.get("id", ""),
        job_title=opportunity.get("title", "Unknown Job"),
        company=opportunity.get("company", "Unknown Company"),
        match_score=0,
        task_created=False,
        processing_status="failed",
    )

    try:
        # Create a comprehensive job description for matching
        job_description = _create_job_description_text(opportunity)

        print(
            f"Analyzing job match for: {opportunity_result.job_title} at {opportunity_result.company}"
        )

        # Step 2: Run advanced job matching
        match_analysis = await analyze_job_match_detailed(job_description, user_profile)
        opportunity_result.match_score = match_analysis.overall_match_score

        print(f"Match score: {opportunity_result.match_score}")

        # Step 3: Create calendar task if high-scoring (> 80)
        if opportunity_result.match_score > 80:
            print("High-scoring opportunity detected! Creating calendar task...")

            # Only create calendar task if there's a deadline
            if opportunity.get("deadline"):
                try:
                    calendar_event_id = await createCalendarEvent(user_id, opportunity)
                    opportunity_result.task_created = True
                    opportunity_result.calendar_event_id = calendar_event_id
                    print(f"Calendar task created with ID: {calendar_event_id}")
                except Exception as calendar_error:
                    print(f"Failed to create calendar task: {str(calendar_error)}")
                    opportunity_result.error_message = (
                        f"Calendar task creation failed: {str(calendar_error)}"
                    )
            else:
                print("No deadline found - skipping calendar task creation")
                opportunity_result.error_message = "No deadline available for calendar task"

        opportunity_result.processing_status = "success"

    except Exception as e:
        opportunity_result.error_message = str(e)
        opportunity_result.processing_status = "failed"
        print(f"Failed to process opportunity {opportunity_result.job_title}: {str(e)}")

    return opportunity_result


async def _get_user_profile(user_id: str) -> Dict:
    """
    Retrieve user profile from Database for job matching.
    """
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            print(f"User profile not found for {user_id}, using default profile")
            return _get_default_user_profile()

        user_data = user.to_dict()

        # Extract relevant profile information for job matching
        profile = {
            "current_role": user_data.get("career_transition_from", ""),
            "years_experience": 5, # Default since we don't have years_of_experience in User anymore
            "skills": user_data.get("target_roles", []),
            "education": [],
            "preferred_location": user_data.get("location", ""),
            "work_preferences": [],
            "achievements": [],
            "career_goals": user_data.get("career_transition_to", ""),
        }

        return profile

    except Exception as e:
        print(f"Failed to retrieve user profile: {str(e)}")
        return _get_default_user_profile()
    finally:
        db.close()


def _get_default_user_profile() -> Dict:
    """
    Return a default user profile structure for matching.

    Returns:
        Dict: Default profile structure
    """
    return {
        "current_role": "Professional",
        "years_experience": 5,
        "skills": [],
        "education": [],
        "preferred_location": "Remote",
        "work_preferences": ["remote work", "flexible hours"],
        "achievements": [],
        "career_goals": "Career advancement",
    }


def _create_job_description_text(opportunity: Dict) -> str:
    """
    Create a comprehensive job description text from opportunity data.

    Args:
        opportunity: Job opportunity data

    Returns:
        str: Formatted job description for matching analysis
    """
    job_text = f"""
Job Title: {opportunity.get('title', 'Not specified')}
Company: {opportunity.get('company', 'Not specified')}
Application Deadline: {opportunity.get('deadline', 'Not specified')}
Source URL: {opportunity.get('source_url', 'Not specified')}

{opportunity.get('description', 'No job description available.')}
"""

    return job_text.strip()


# Export main functions
__all__ = ["scan_inbox_for_opportunities", "WorkflowResult", "OpportunityTaskResult"]
