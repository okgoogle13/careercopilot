"""
Career history ingestion endpoint.

Handles one-shot ingestion of career documents using Genkit flows.
"""

import logging
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.endpoints._shared import collect_uploaded_text, run_endpoint_operation
from app.core.dependencies import get_current_user
from app.core.firebase import get_firestore
from app.genkit_flows.ingestion_flow import ingest_career_history
from app.models import User
from app.schemas.career_master import CareerDatabase
from app.services.profile_persistence import persist_user_profile_snapshot

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/ingest", response_model=CareerDatabase, status_code=status.HTTP_200_OK)
async def ingest_career_documents(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
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
        firestore_db = get_firestore()
        col = firestore_db.collection("master_versions")

        # In Firestore we manually find the latest and active
        docs = col.where("user_id", "==", current_user.id).stream()
        latest_version = 0
        active_doc_ids = []
        for doc in docs:
            d = doc.to_dict()
            v = d.get("version_number", 0)
            if v > latest_version:
                latest_version = v
            if d.get("is_active"):
                active_doc_ids.append(doc.id)

        next_version = latest_version + 1

        for doc_id in active_doc_ids:
            col.document(doc_id).update({"is_active": False})

        new_doc_ref = col.document()
        new_doc_ref.set(
            {
                "id": new_doc_ref.id,
                "user_id": current_user.id,
                "version_number": next_version,
                "is_active": True,
                "source": "career_ingestion",
                "content_snapshot": career_db.model_dump(by_alias=True),
                "updated_at": datetime.utcnow().isoformat(),
            }
        )

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
