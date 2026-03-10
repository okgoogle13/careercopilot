"""User-centric utility endpoints."""

from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.database import MasterVersion, User

router = APIRouter()


class MasterStatusResponse(BaseModel):
    has_master: bool
    active_version: int | None = None
    updated_at: datetime | None = None


@router.get("/master-status", response_model=MasterStatusResponse)
async def get_master_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MasterStatusResponse:
    active_master = (
        db.query(MasterVersion)
        .filter(MasterVersion.user_id == current_user.id, MasterVersion.is_active.is_(True))
        .order_by(MasterVersion.version_number.desc())
        .first()
    )

    if active_master is None:
        return MasterStatusResponse(has_master=False, active_version=None, updated_at=None)

    return MasterStatusResponse(
        has_master=True,
        active_version=active_master.version_number,
        updated_at=active_master.updated_at,
    )
