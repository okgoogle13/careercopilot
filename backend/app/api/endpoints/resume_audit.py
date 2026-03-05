import hashlib
import time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user_optional
from app.genkit_flows.resume_audit import resumeAuditRKL
from app.models.database import ResumeAudit, User
from app.models.resume_audit_schemas import AuditRequest, AuditResponse, AuditResult

router = APIRouter()


@router.post("/evaluate", response_model=AuditResponse)
async def evaluate_resume(
    request: AuditRequest,
    current_user: User | None = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
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

        audit_record = ResumeAudit(
            user_id=current_user.id if current_user else None,
            resume_hash=resume_hash,
            audit_result=result.model_dump(),
            strictness_mode=request.strictnessMode,
            processing_time_ms=processing_time,
        )
        db.add(audit_record)
        db.commit()

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
