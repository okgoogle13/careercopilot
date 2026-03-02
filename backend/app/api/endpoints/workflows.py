"""
Workflows API Endpoints (Revised for Supabase Alignment)

FastAPI endpoints for orchestrated workflow operations.
Legcay Genkit workflows are currently disabled due to 0.4.0 migration.
"""

<<<<<<< HEAD
import traceback
from typing import Any, Dict, Optional, Union
from typing_extensions import TypedDict
=======
from typing import Any
>>>>>>> restoration-KR-Rage-Figma-v2.0

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
<<<<<<< HEAD
=======
from typing_extensions import TypedDict
>>>>>>> restoration-KR-Rage-Figma-v2.0

# Legacy Genkit flows disabled
# from app.genkit_flows.career_application_workflow import (
#     ApplicationPackageResult,
#     generate_application_package,
# )

class ApplicationPackageResult(BaseModel):
    success: bool
    components_generated: list
    processing_time_seconds: float
    error_details: list

# Temporarily disabled due to syntax error in email_task_workflow.py
# from app.genkit_flows.email_task_workflow import WorkflowResult as EmailWorkflowResult
# from app.genkit_flows.email_task_workflow import scan_inbox_for_opportunities

class EmailWorkflowResult(TypedDict, total=False):
    success: bool
    total_opportunities_found: int
    tasks_created: int
    error_message: str
<<<<<<< HEAD
    details: Dict[str, Any]


scan_inbox_for_opportunities: Optional[Any] = None  # Placeholder for async function
=======
    details: dict[str, Any]


scan_inbox_for_opportunities: Any | None = None  # Placeholder for async function
>>>>>>> restoration-KR-Rage-Figma-v2.0


# Authentication handled by get_current_user dependency in main router

router = APIRouter()


# Request/Response Models
class GenerateApplicationRequest(BaseModel):
    """Request model for application package generation"""

    job_description: str = Field(description="Complete job description/posting text", min_length=50)
<<<<<<< HEAD
    user_profile: Dict[str, Any] = Field(
=======
    user_profile: dict[str, Any] = Field(
>>>>>>> restoration-KR-Rage-Figma-v2.0
        default=...,
        description="Comprehensive user profile data including resume content",
        min_length=1,
    )


class GenerateApplicationResponse(BaseModel):
    """Response model for application package generation"""

    success: bool = Field(description="Whether the generation was successful")
<<<<<<< HEAD
    data: Optional[ApplicationPackageResult] = Field(description="Generated application package")
=======
    data: ApplicationPackageResult | None = Field(description="Generated application package")
>>>>>>> restoration-KR-Rage-Figma-v2.0
    message: str = Field(description="Success or error message")
    processing_time_seconds: float = Field(description="Total processing time")


class ScanEmailRequest(BaseModel):
    """Request model for email scanning workflow"""

    user_id: str = Field(description="User identifier for email scanning", min_length=1)


class ScanEmailResponse(BaseModel):
    """Response model for email scanning workflow"""

    success: bool = Field(description="Whether the scanning was successful")
<<<<<<< HEAD
    data: Optional[EmailWorkflowResult] = Field(description="Email scanning results")
=======
    data: EmailWorkflowResult | None = Field(description="Email scanning results")
>>>>>>> restoration-KR-Rage-Figma-v2.0
    message: str = Field(description="Success or error message")


@router.post(
    "/generate-application",
    response_model=GenerateApplicationResponse,
    summary="Generate Complete Application Package",
)
async def create_application_package(request: GenerateApplicationRequest) -> GenerateApplicationResponse:
    """
    Generate a complete job application package using AI-powered workflows.
    DISABLED: Currently unavailable during Genkit 0.4.0 migration.
    """
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Application package generation is temporarily disabled for upgrade.",
    )


@router.post(
    "/scan-email-opportunities",
    response_model=ScanEmailResponse,
    summary="Scan Email for Job Opportunities",
)
async def scan_email_for_opportunities(request: ScanEmailRequest) -> ScanEmailResponse:
    """
    Scan user's email for job opportunities.
    DISABLED: Layout placeholder.
    """
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Email scanning is temporarily disabled.",
    )


@router.get(
    "/health",
    summary="Workflow Service Health Check",
    description="Check the health and availability of workflow services",
)
<<<<<<< HEAD
async def workflow_health_check() -> Dict[str, Any]:
=======
async def workflow_health_check() -> dict[str, Any]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
    """
    Check the health of workflow services and dependencies.
    """
    return {
        "service": "workflows",
        "status": "maintenance",
        "components": {
            "genkit_flows": "disabled",
            "ai_models": "available",
        }
    }


# Optional: Workflow status endpoint for long-running operations
@router.get(
    "/status/{workflow_id}",
    summary="Get Workflow Status",
    description="Get the status of a running or completed workflow (future enhancement)",
)
async def get_workflow_status(workflow_id: str) -> JSONResponse:
    """Get the status of a workflow by ID."""
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content={"detail": "Workflow status tracking not yet implemented"},
    )
