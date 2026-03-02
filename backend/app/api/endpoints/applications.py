<<<<<<< HEAD
from typing import List, Optional
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.application_schemas import ApplicationCreate, ApplicationResponse
<<<<<<< HEAD
from app.models.database import User, Application
=======
from app.models.database import Application, User
>>>>>>> restoration-KR-Rage-Figma-v2.0

router = APIRouter()


@router.post(
    "/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED
)
async def create_application(
<<<<<<< HEAD
    application: ApplicationCreate, 
=======
    application: ApplicationCreate,
>>>>>>> restoration-KR-Rage-Figma-v2.0
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job application for the current user."""
<<<<<<< HEAD
    
    application_data = application.model_dump(by_alias=True, exclude_unset=True)
    
=======

    application_data = application.model_dump(by_alias=True, exclude_unset=True)

>>>>>>> restoration-KR-Rage-Figma-v2.0
    new_application = Application(
        user_id=current_user.id,
        job_title=application.job_title,
        company_name=application.company_name,
        job_description=application.job_description,
        status="draft",
        source="manual",
        applied_date=datetime.now(timezone.utc)
    )
<<<<<<< HEAD
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
=======

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

>>>>>>> restoration-KR-Rage-Figma-v2.0
    return new_application.to_dict()


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def get_application(
<<<<<<< HEAD
    application_id: str, 
=======
    application_id: str,
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

    return application.to_dict()


@router.get(
    "/",
<<<<<<< HEAD
    response_model=List[ApplicationResponse],
=======
    response_model=list[ApplicationResponse],
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

    return [app.to_dict() for app in applications]


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
    return db_application.to_dict()


@router.delete(
    "/{application_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_application(
<<<<<<< HEAD
    application_id: str, 
=======
    application_id: str,
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
