"""
Workflows API Endpoints

Synchronous MVP: delegates to the analyzeJobFromUrl pipeline, stores a
Firestore status record, and returns the full result inline so /apply/quick
can display it without a separate polling round-trip.
"""

import time
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.endpoints.flows import (
    AnalyzeJobFromUrlRequest,
    AnalyzeJobFromUrlResponse,
    analyzeJobFromUrl,
)
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.firebase import get_firestore
from app.models.database import User

router = APIRouter()
COLLECTION_NAME = "workflow_runs"


# --- Request / Response models ---


class GenerateApplicationRequest(BaseModel):
    job_description: str = Field(min_length=50)
    url: str | None = Field(default=None)
    job_title: str | None = Field(default=None)
    company_name: str | None = Field(default=None)
    user_profile: dict[str, Any] = Field(default_factory=dict)


class GenerateApplicationResponse(BaseModel):
    success: bool
    workflow_id: str
    status: str
    message: str
    processing_time_seconds: float
    result: AnalyzeJobFromUrlResponse | None = None


class WorkflowStatusResponse(BaseModel):
    workflow_id: str
    status: str
    created_at: str
    updated_at: str
    result: dict[str, Any] | None = None
    error: str | None = None


# --- Firestore helpers ---


def _store_workflow(workflow_id: str, payload: dict[str, Any]) -> None:
    db = get_firestore()
    db.collection(COLLECTION_NAME).document(workflow_id).set(payload)


def _update_workflow(workflow_id: str, updates: dict[str, Any]) -> None:
    db = get_firestore()
    db.collection(COLLECTION_NAME).document(workflow_id).update(updates)


# --- Routes ---


@router.post(
    "/generate-application",
    response_model=GenerateApplicationResponse,
    summary="Generate Application Package",
)
async def create_application_package(
    request: GenerateApplicationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> GenerateApplicationResponse:
    """
    Orchestrate a complete application package for /apply/quick.
    Delegates to the analyzeJobFromUrl pipeline, persists a workflow run
    record in Firestore, and returns the full result inline.
    """
    start = time.time()
    workflow_id = str(uuid.uuid4())
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    record: dict[str, Any] = {
        "workflow_id": workflow_id,
        "user_id": current_user.id,
        "type": "generate_application",
        "status": "running",
        "created_at": now,
        "updated_at": now,
        "result": None,
        "error": None,
    }

    try:
        _store_workflow(workflow_id, record)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initialise workflow: {e}",
        )

    payload = AnalyzeJobFromUrlRequest(
        url=request.url,
        job_description=request.job_description,
        job_title=request.job_title,
        company_name=request.company_name,
    )

    try:
        result: AnalyzeJobFromUrlResponse = await analyzeJobFromUrl(payload, current_user, db)
        elapsed = round(time.time() - start, 2)
        _update_workflow(
            workflow_id,
            {
                "status": "complete",
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "result": result.model_dump(),
            },
        )
        return GenerateApplicationResponse(
            success=True,
            workflow_id=workflow_id,
            status="complete",
            message="Application package generated.",
            processing_time_seconds=elapsed,
            result=result,
        )
    except Exception as e:
        elapsed = round(time.time() - start, 2)
        _update_workflow(
            workflow_id,
            {
                "status": "failed",
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "error": str(e),
            },
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get(
    "/status/{workflow_id}",
    response_model=WorkflowStatusResponse,
    summary="Get Workflow Status",
)
async def get_workflow_status(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
) -> WorkflowStatusResponse:
    """Return the persisted status record for a workflow run."""
    try:
        doc = get_firestore().collection(COLLECTION_NAME).document(workflow_id).get()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    if not doc.exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found.")

    data = doc.to_dict()
    if data.get("user_id") != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised.")

    return WorkflowStatusResponse(
        workflow_id=data["workflow_id"],
        status=data["status"],
        created_at=data["created_at"],
        updated_at=data["updated_at"],
        result=data.get("result"),
        error=data.get("error"),
    )


@router.get("/health", summary="Workflow Service Health Check")
async def workflow_health_check() -> dict[str, Any]:
    return {
        "service": "workflows",
        "status": "available",
        "components": {
            "genkit_flows": "available",
            "firestore": "available",
        },
    }
