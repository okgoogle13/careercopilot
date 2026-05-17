from fastapi import APIRouter, Depends, File, UploadFile

from app.api.endpoints._shared import collect_uploaded_text, run_endpoint
from app.core.dependencies import get_current_user
from app.genkit_flows.career_ingest import IngestInput, ingest_career_docs
from app.models import User
from app.schemas.career import CareerDatabase
from app.services.profile_persistence import persist_user_profile_snapshot

router = APIRouter()


@router.post("/ingest", response_model=CareerDatabase)
async def ingest_documents_endpoint(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload PDFs, extract text, and structure the user's career data."""

    async def operation() -> CareerDatabase:
        full_text = await collect_uploaded_text(files)

        result = await ingest_career_docs(IngestInput(raw_text=full_text))

        await persist_user_profile_snapshot(
            db=None,
            user_id=current_user.id,
            field_name="career_profile",
            payload=result.model_dump(),
        )
        return result

    return await run_endpoint(
        operation,
        "Career ingestion failed",
    )
