from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from google.cloud.firestore import CollectionReference, DocumentReference

from app.core.db import db
from app.core.dependencies import get_current_user
from app.models.application_schemas import ApplicationCreate, ApplicationResponse
from app.models.user import User

router = APIRouter()


def get_applications_collection(user_id: str) -> CollectionReference:
    return db.collection("users").document(user_id).collection("job_applications")


@router.post(
    "/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED
)
async def create_application(
    application: ApplicationCreate, current_user: User = Depends(get_current_user)
):
    """Create a new job application for the current user."""
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized.")

    applications_ref = get_applications_collection(current_user.uid)
    new_application_ref = applications_ref.document()

    application_data = application.model_dump(by_alias=True, exclude_unset=True)
    application_data["id"] = new_application_ref.id
    application_data["userId"] = current_user.uid
    application_data["createdAt"] = application_data["updatedAt"] = datetime.now()
    application_data["source"] = "manual"  # Default source
    application_data["status"] = "draft"  # Default status

    await new_application_ref.set(application_data)
    return ApplicationResponse(**application_data)


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def get_application(
    application_id: str, current_user: User = Depends(get_current_user)
):
    """Retrieve a specific job application by its ID."""
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized.")

    application_ref = get_applications_collection(current_user.uid).document(application_id)
    application_doc = await application_ref.get()

    if not application_doc.exists:
        raise HTTPException(status_code=404, detail="Application not found.")

    return ApplicationResponse(**application_doc.to_dict())


@router.get(
    "/",
    response_model=List[ApplicationResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_applications(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    """Retrieve all job applications for the current user with pagination."""
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized.")

    applications_ref = get_applications_collection(current_user.uid)
    query = applications_ref.order_by("createdAt").offset(skip).limit(limit)
    applications = []
    for doc in query.stream():
        applications.append(ApplicationResponse(**doc.to_dict()))

    return applications


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def update_application(
    application_id: str,
    application: ApplicationCreate,  # Using ApplicationCreate for update for simplicity
    current_user: User = Depends(get_current_user),
):
    """Update an existing job application."""
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized.")

    application_ref = get_applications_collection(current_user.uid).document(application_id)
    existing_application = await application_ref.get()

    if not existing_application.exists:
        raise HTTPException(status_code=404, detail="Application not found.")

    update_data = application.model_dump(by_alias=True, exclude_unset=True)
    update_data["updatedAt"] = datetime.now()

    await application_ref.update(update_data)
    updated_application = await application_ref.get()
    return ApplicationResponse(**updated_application.to_dict())


@router.delete(
    "/{application_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_application(
    application_id: str, current_user: User = Depends(get_current_user)
):
    """Delete a job application."""
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized.")

    application_ref = get_applications_collection(current_user.uid).document(application_id)
    existing_application = await application_ref.get()

    if not existing_application.exists:
        raise HTTPException(status_code=404, detail="Application not found.")

    await application_ref.delete()
    return None
