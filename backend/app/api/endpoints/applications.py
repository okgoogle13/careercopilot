from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.application_schemas import ApplicationCreate, ApplicationResponse
from app.models.database import Application, User

router = APIRouter()


@router.post(
    "/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED
)
async def create_application(
    application: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job application for the current user."""

    app_data = application.model_dump(by_alias=False)
    
    new_application = Application(
        user_id=current_user.id,
        status="draft",
        source="manual"
    )

    for key, value in app_data.items():
        if hasattr(new_application, key):
            setattr(new_application, key, value)

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def get_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve a specific job application by its ID."""
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    return application


@router.get(
    "/",
    response_model=list[ApplicationResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """Retrieve all job applications for the current user with pagination."""
    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).offset(skip).limit(limit).all()

    return applications


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def update_application(
    application_id: str,
    application: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing job application."""
    db_application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found.")

    update_data = application.model_dump(by_alias=True, exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(db_application, key):
            setattr(db_application, key, value)

    db.commit()
    db.refresh(db_application)
    return db_application


@router.delete(
    "/{application_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a job application."""
    db_application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found.")

    db.delete(db_application)
    db.commit()
    return None
