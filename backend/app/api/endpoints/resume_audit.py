import hashlib
import time
from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_current_user, get_current_user_optional
from app.core.firebase import get_firestore
from app.genkit_flows.resume_audit import resumeAuditRKL
from app.models.database import User
from app.models.resume_audit_schemas import AuditRequest, AuditResponse, AuditResult

router = APIRouter()
COLLECTION_NAME = "resume_audits"


@router.post("/evaluate", response_model=AuditResponse)
async def evaluate_resume(
    request: AuditRequest,
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Evaluates a resume against the Resume Knowledge Library (RKL) using Gemini.
    """
    start_time = time.time()

    try:
        # Run the Genkit Flow
        result: AuditResult = await resumeAuditRKL(
            resume_text=request.resumeText,
            job_description=request.jobDescription,
            strictness_mode=request.strictnessMode,
        )

        processing_time = round((time.time() - start_time) * 1000)

        # Save to database
        resume_hash = hashlib.sha256(request.resumeText.encode("utf-8")).hexdigest()

        audit_record = {
            "user_id": current_user.id if current_user else None,
            "resume_hash": resume_hash,
            "audit_result": result.model_dump(),
            "strictness_mode": request.strictnessMode,
            "processing_time_ms": processing_time,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        }

        db = get_firestore()
        col = db.collection(COLLECTION_NAME)
        doc_ref = col.document()
        audit_record["id"] = doc_ref.id
        doc_ref.set(audit_record)

        return AuditResponse(
            success=True,
            data=result,
            meta={
                "processingTime": processing_time,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_audit_history(
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """
    Return persisted resume audit records for the authenticated user,
    ordered by creation time descending. Limit 50.
    """
    try:
        db = get_firestore()
        col = db.collection(COLLECTION_NAME)
        docs = (
            col.where("user_id", "==", current_user.id)
            .order_by("created_at", direction="DESCENDING")
            .limit(50)
            .stream()
        )
        records = [doc.to_dict() for doc in docs]
        return {"success": True, "data": records, "count": len(records)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
