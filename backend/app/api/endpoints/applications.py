from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.core.firebase import get_firestore
from app.models.application_schemas import ApplicationCreate, ApplicationResponse, ApplicationUpdate
from app.models.database import User

router = APIRouter()
COLLECTION_NAME = "applications"


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    application: ApplicationCreate,
    current_user: User = Depends(get_current_user),
):
    """Create a new job application for the current user."""

    app_data = application.model_dump(by_alias=False)

    # Defaults
    app_data["user_id"] = current_user.id
    app_data["status"] = "draft"
    app_data["source"] = "manual"
    app_data["created_at"] = datetime.now(timezone.utc).isoformat()
    app_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    db = get_firestore()
    col = db.collection(COLLECTION_NAME)

    doc_ref = col.document()
    app_data["id"] = doc_ref.id

    doc_ref.set(app_data)

    return app_data


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def get_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
):
    """Retrieve a specific job application by its ID."""
    db = get_firestore()
    doc_ref = db.collection(COLLECTION_NAME).document(application_id)
    doc = doc_ref.get()

    if not doc.exists or doc.to_dict().get("user_id") != current_user.id:
        raise HTTPException(status_code=404, detail="Application not found.")

    app_data = doc.to_dict()
    app_data["id"] = doc.id
    return app_data


@router.get(
    "/",
    response_model=list[ApplicationResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_applications(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    db = get_firestore()
    query = db.collection(COLLECTION_NAME).where("user_id", "==", current_user.id)
    query = query.offset(skip).limit(limit)

    applications = []
    for doc in query.stream():
        app_data = doc.to_dict()
        app_data["id"] = doc.id
        applications.append(app_data)

    return applications


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
)
async def update_application(
    application_id: str,
    application: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
):
    """Update an existing job application."""
    db = get_firestore()
    doc_ref = db.collection(COLLECTION_NAME).document(application_id)
    doc = doc_ref.get()

    if not doc.exists or doc.to_dict().get("user_id") != current_user.id:
        raise HTTPException(status_code=404, detail="Application not found.")

    update_data = application.model_dump(by_alias=False, exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    doc_ref.update(update_data)

    updated_doc = doc_ref.get().to_dict()
    updated_doc["id"] = doc.id
    return updated_doc


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
):
    """Delete a job application."""
    db = get_firestore()
    doc_ref = db.collection(COLLECTION_NAME).document(application_id)
    doc = doc_ref.get()

    if not doc.exists or doc.to_dict().get("user_id") != current_user.id:
        raise HTTPException(status_code=404, detail="Application not found.")

    doc_ref.delete()
    return None
