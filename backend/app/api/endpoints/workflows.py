"""
Workflows API Endpoints

FastAPI endpoints for orchestrated workflow operations including
the one-click application package generation and email task workflows.
"""

import traceback
from typing import Dict, Optional

# Import workflow functions
from app.genkit_flows.career_application_workflow import (
    ApplicationPackageResult,
    generate_application_package,
)
from app.genkit_flows.email_task_workflow import WorkflowResult as EmailWorkflowResult
from app.genkit_flows.email_task_workflow import scan_inbox_for_opportunities
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# Import middleware for authentication (if available)
try:
    from app.api.middleware.firebase_auth import verify_firebase_token
except ImportError:
    verify_firebase_token = None

router = APIRouter()


# Request/Response Models
class GenerateApplicationRequest(BaseModel):
    """Request model for application package generation"""

    job_description: str = Field(description="Complete job description/posting text", min_length=50)
    user_profile: Dict = Field(
        description="Comprehensive user profile data including resume content", min_items=1
    )


class GenerateApplicationResponse(BaseModel):
    """Response model for application package generation"""

    success: bool = Field(description="Whether the generation was successful")
    data: Optional[ApplicationPackageResult] = Field(description="Generated application package")
    message: str = Field(description="Success or error message")
    processing_time_seconds: float = Field(description="Total processing time")


class ScanEmailRequest(BaseModel):
    """Request model for email scanning workflow"""

    user_id: str = Field(description="User identifier for email scanning", min_length=1)


class ScanEmailResponse(BaseModel):
    """Response model for email scanning workflow"""

    success: bool = Field(description="Whether the scanning was successful")
    data: Optional[EmailWorkflowResult] = Field(description="Email scanning results")
    message: str = Field(description="Success or error message")


@router.post(
    "/generate-application",
    response_model=GenerateApplicationResponse,
    summary="Generate Complete Application Package",
    description="""
    One-Click Application Workflow: Generates a complete job application package
    including tailored resume, personalized cover letter, and KSC responses.

    This endpoint orchestrates multiple AI services to create:
    - Resume intelligence analysis and tailored resume optimization
    - Smart cover letter with company research integration
    - Key Selection Criteria (KSC) responses using STAR methodology
    - Application strategy and interview preparation recommendations

    The process typically takes 30-60 seconds depending on the complexity
    of the job description and user profile.
    """,
)
async def create_application_package(request: GenerateApplicationRequest):
    """
    Generate a complete job application package using AI-powered workflows.

    This endpoint chains together multiple specialized AI flows:
    1. Resume Intelligence Pipeline - analyzes and optimizes resume
    2. Smart Cover Letter System - generates personalized cover letter
    3. KSC Generator - creates STAR responses for selection criteria
    4. Application Strategy - provides strategic recommendations

    Args:
        request: Job description and user profile data

    Returns:
        Complete application package with all generated components

    Raises:
        HTTPException: If validation fails or generation encounters errors
    """
    try:
        # Input validation
        if not request.job_description or len(request.job_description.strip()) < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job description must be at least 50 characters long",
            )

        if not request.user_profile or not isinstance(request.user_profile, dict):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User profile must be a non-empty dictionary",
            )

        # Check for required profile fields
        required_fields = ["resume_content", "skills", "experience"]
        missing_fields = [
            field
            for field in required_fields
            if field not in request.user_profile or not request.user_profile[field]
        ]

        if len(missing_fields) == len(required_fields):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User profile must contain at least one of: resume_content, skills, or experience",
            )

        # Generate application package
        print(f"Starting application package generation...")
        result = await generate_application_package(
            job_description=request.job_description, user_profile=request.user_profile
        )

        # Prepare response
        if result.success:
            response = GenerateApplicationResponse(
                success=True,
                data=result,
                message=f"Application package generated successfully with {len(result.components_generated)} components",
                processing_time_seconds=result.processing_time_seconds,
            )
            print(f"✓ Application package generated successfully")
        else:
            response = GenerateApplicationResponse(
                success=False,
                data=result,
                message=f"Partial generation completed. Errors: {'; '.join(result.error_details)}",
                processing_time_seconds=result.processing_time_seconds,
            )
            print(f"⚠ Partial application package generated with errors")

        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"✗ Application package generation failed: {str(e)}")
        print(traceback.format_exc())

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Application package generation failed: {str(e)}",
        )


@router.post(
    "/scan-email-opportunities",
    response_model=ScanEmailResponse,
    summary="Scan Email for Job Opportunities",
    description="""
    Email Scanning & Task Generation Workflow: Scans user's email for job opportunities,
    analyzes job matches, and creates calendar tasks for high-scoring opportunities.

    This endpoint orchestrates:
    - Email scanning for job opportunities from common recruiting platforms
    - Advanced job matching analysis against user profile
    - Calendar task creation for opportunities scoring above 80%
    - Comprehensive reporting of processing results

    Requires user to have Google OAuth credentials configured for email and calendar access.
    """,
)
async def scan_email_for_opportunities(request: ScanEmailRequest):
    """
    Scan user's email for job opportunities and create tasks for high-scoring matches.

    This workflow:
    1. Scans unread emails from job platforms (Greenhouse, Lever, etc.)
    2. Extracts job details using AI analysis
    3. Scores job compatibility against user profile
    4. Creates calendar tasks for jobs scoring above 80%
    5. Returns comprehensive workflow results

    Args:
        request: User ID for email scanning

    Returns:
        Email scanning results with opportunity processing details

    Raises:
        HTTPException: If validation fails or scanning encounters errors
    """
    try:
        # Input validation
        if not request.user_id or not request.user_id.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User ID is required"
            )

        # Execute email scanning workflow
        print(f"Starting email scanning for user: {request.user_id}")
        result = await scan_inbox_for_opportunities(request.user_id)

        # Prepare response
        if result.success:
            response = ScanEmailResponse(
                success=True,
                data=result,
                message=f"Email scan completed. Found {result.total_opportunities_found} opportunities, created {result.tasks_created} tasks",
            )
            print(f"✓ Email scanning completed successfully")
        else:
            response = ScanEmailResponse(
                success=False, data=result, message=f"Email scanning failed: {result.error_message}"
            )
            print(f"✗ Email scanning failed: {result.error_message}")

        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"✗ Email scanning failed: {str(e)}")
        print(traceback.format_exc())

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email scanning failed: {str(e)}",
        )


@router.get(
    "/health",
    summary="Workflow Service Health Check",
    description="Check the health and availability of workflow services",
)
async def workflow_health_check():
    """
    Check the health of workflow services and dependencies.

    Returns:
        Health status of workflow components
    """
    try:
        # Check if Genkit flows are available
        genkit_available = True
        try:
            from app.genkit_flows.career_application_workflow import generate_application_package
            from app.genkit_flows.email_task_workflow import scan_inbox_for_opportunities
        except Exception as e:
            genkit_available = False

        # Check AI model availability
        ai_available = True
        try:
            from app.core.ai_config import get_ai_config

            get_ai_config().get_model_config("gemini-1.5-pro")
        except Exception as e:
            ai_available = False

        health_status = {
            "service": "workflows",
            "status": "healthy" if genkit_available and ai_available else "degraded",
            "components": {
                "genkit_flows": "available" if genkit_available else "unavailable",
                "ai_models": "available" if ai_available else "unavailable",
            },
            "endpoints": [
                "/workflows/generate-application",
                "/workflows/scan-email-opportunities",
                "/workflows/health",
            ],
        }

        return health_status

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Health check failed: {str(e)}"
        )


# Optional: Workflow status endpoint for long-running operations
@router.get(
    "/status/{workflow_id}",
    summary="Get Workflow Status",
    description="Get the status of a running or completed workflow (future enhancement)",
)
async def get_workflow_status(workflow_id: str):
    """
    Get the status of a workflow by ID.

    This is a placeholder for future implementation of async workflow tracking.
    Currently returns a not implemented response.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Workflow status tracking not yet implemented",
    )


# Error handlers could be added here for specific workflow exceptions
# @router.exception_handler(SpecificWorkflowException)
# async def workflow_exception_handler(request: Request, exc: SpecificWorkflowException):
#     return JSONResponse(
#         status_code=422,
#         content={"message": f"Workflow error: {str(exc)}"}
#     )
