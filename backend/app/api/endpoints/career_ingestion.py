"""
Career history ingestion endpoint.

Handles one-shot ingestion of career documents using Genkit flows.
"""

import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.endpoints._shared import collect_uploaded_text, run_endpoint_operation
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.genkit_flows.ingestion_flow import ingest_career_history
from app.models import User
from app.models.database import MasterVersion
from app.schemas.career_master import CareerDatabase
from app.services.profile_persistence import persist_user_profile_snapshot

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/ingest", response_model=CareerDatabase, status_code=status.HTTP_200_OK)
async def ingest_career_documents(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload career documents and extract a master career database."""

    async def operation() -> CareerDatabase:
        full_text = await collect_uploaded_text(
            files,
            empty_detail="No readable text found in uploaded files. Please upload PDF, DOCX, or TXT files.",
            logger=logger,
        )
        logger.info("Combined text length: %s characters", len(full_text))

        career_db = ingest_career_history(full_text)

        # Persist a versioned master snapshot for fast "has master" checks and quick-apply retrieval.
        latest_version = (
            db.query(MasterVersion)
            .filter(MasterVersion.user_id == current_user.id)
            .order_by(MasterVersion.version_number.desc())
            .first()
        )
        next_version = (latest_version.version_number + 1) if latest_version else 1

        db.query(MasterVersion).filter(MasterVersion.user_id == current_user.id).update(
            {MasterVersion.is_active: False}, synchronize_session=False
        )
        db.add(
            MasterVersion(
                user_id=current_user.id,
                version_number=next_version,
                is_active=True,
                source="career_ingestion",
                content_snapshot=career_db.model_dump(by_alias=True),
            )
        )
        db.commit()

        await persist_user_profile_snapshot(
            db=None,
            user_id=current_user.id,
            field_name="career_database",
            payload=career_db.model_dump(by_alias=True),
            logger=logger,
            ignore_failures=True,
        )

        return career_db

    try:
        return await run_endpoint_operation(
            operation,
            "Career ingestion failed",
            logger=logger,
        )
    except HTTPException as exc:
        if exc.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI processing failed: Career ingestion failed",
            ) from exc
        raise
