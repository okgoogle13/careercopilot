"""
Smart Ingestion API Router

FastAPI endpoints for AI-powered document ingestion with structured data extraction.

This router implements the Smart Ingestion workflow:
1. POST /upload-and-tag - Upload document, get AI-suggested tags
2. POST /extract-and-save - Extract structured data, save to Firestore

All endpoints require Firebase authentication.
"""

import logging
import os
from datetime import datetime
from typing import Dict

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from app.api.middleware.firebase_auth import get_current_user
from app.core.enhanced_ai_error_handling import create_detailed_error_message
from app.core.file_upload_decorators import FileUploadConfig, require_valid_file_upload
from app.core.firebase import get_firestore, get_storage
from app.genkit_flows.smart_ingestion import (
    contextTaggerFlow,
    kscExtractorFlow,
    resumeExtractorFlow,
    voiceProfileExtractorFlow,
)
from app.models.asset_library_schema import AssetDocument, AssetMetadata, ContextTags
from app.models.ingestion_schemas import (
    ExtractAndSaveRequest,
    ExtractAndSaveResponse,
    IngestionErrorResponse,
    UploadAndTagResponse,
)

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(tags=["Smart Ingestion"])


# ============================================================================
# Helper Functions
# ============================================================================


async def _upload_to_storage(
    file: UploadFile, user_id: str, folder: str = "temp_ingestions"
) -> tuple[str, int]:
    """
    Upload file to Google Cloud Storage.

    Args:
        file: The uploaded file
        user_id: Firebase UID of the user
        folder: Storage folder (default: temp_ingestions)

    Returns:
        Tuple of (storage_uri, file_size_bytes)

    Raises:
        HTTPException: If upload fails
    """
    try:
        bucket = get_storage()
        if not bucket:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Cloud Storage service is not available",
            )

        # Generate unique filename with timestamp
        timestamp = int(datetime.now().timestamp())
        filename = f"{folder}/{user_id}/{timestamp}_{file.filename}"

        # Upload file
        blob = bucket.blob(filename)

        # Reset file pointer and get content
        await file.seek(0)
        file_content = await file.read()
        file_size = len(file_content)

        # Upload to GCS
        blob.upload_from_string(
            file_content,
            content_type=file.content_type,
        )

        storage_uri = f"gs://{bucket.name}/{filename}"
        logger.info(f"File uploaded successfully to {storage_uri}, size: {file_size} bytes")

        return storage_uri, file_size

    except Exception as e:
        logger.error(f"Failed to upload file to storage: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}",
        )


async def _read_file_from_storage(storage_uri: str) -> str:
    """
    Read text content from Google Cloud Storage.

    Args:
        storage_uri: GCS URI (gs://bucket-name/path/to/file)

    Returns:
        File content as text

    Raises:
        HTTPException: If read fails
    """
    try:
        bucket = get_storage()
        if not bucket:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Cloud Storage service is not available",
            )

        # Extract blob name from URI
        blob_name = storage_uri.replace(f"gs://{bucket.name}/", "")
        blob = bucket.blob(blob_name)

        # Download as text
        content = blob.download_as_text()
        logger.info(f"Successfully read {len(content)} characters from {storage_uri}")

        return content

    except Exception as e:
        logger.error(f"Failed to read file from storage: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read file from storage: {str(e)}",
        )


async def _move_file_in_storage(source_uri: str, user_id: str) -> str:
    """
    Move file from temp_ingestions to permanent user_assets folder.

    Args:
        source_uri: Source GCS URI
        user_id: Firebase UID of the user

    Returns:
        New permanent GCS URI

    Raises:
        HTTPException: If move fails
    """
    try:
        bucket = get_storage()
        if not bucket:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Cloud Storage service is not available",
            )

        # Extract blob name and filename
        source_blob_name = source_uri.replace(f"gs://{bucket.name}/", "")
        filename = os.path.basename(source_blob_name)

        # Create destination path
        dest_blob_name = f"user_assets/{user_id}/{filename}"

        # Copy and delete (GCS doesn't have rename)
        source_blob = bucket.blob(source_blob_name)
        bucket.copy_blob(source_blob, bucket, dest_blob_name)
        source_blob.delete()

        new_uri = f"gs://{bucket.name}/{dest_blob_name}"
        logger.info(f"File moved from {source_uri} to {new_uri}")

        return new_uri

    except Exception as e:
        logger.error(f"Failed to move file in storage: {str(e)}", exc_info=True)
        # Non-fatal error - file can stay in temp location
        logger.warning("File will remain in temporary location")
        return source_uri


async def _save_to_firestore(asset_doc: AssetDocument, user_id: str) -> str:
    """
    Save asset document to Firestore.

    Args:
        asset_doc: The asset document to save
        user_id: Firebase UID of the user

    Returns:
        Firestore document ID

    Raises:
        HTTPException: If save fails
    """
    try:
        db = get_firestore()
        if not db:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Firestore service is not available",
            )

        # Create document in users/{user_id}/assetLibrary collection
        collection_ref = db.collection("users").document(user_id).collection("assetLibrary")

        # Convert Pydantic model to dict
        asset_data = asset_doc.model_dump(mode="json")

        # Add document and get reference
        doc_ref = collection_ref.add(asset_data)[1]

        logger.info(f"Asset saved to Firestore: users/{user_id}/assetLibrary/{doc_ref.id}")

        return doc_ref.id

    except Exception as e:
        logger.error(f"Failed to save to Firestore: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save asset to database: {str(e)}",
        )


# ============================================================================
# Endpoint 1: Upload and Tag
# ============================================================================


@router.post(
    "/upload-and-tag",
    response_model=UploadAndTagResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload document and get AI-suggested tags",
    description="""
    Upload a career document (resume, KSC, writing sample) and receive AI-suggested
    contextual tags (roleType, subsectors).

    This is step 1 of the Smart Ingestion workflow. The frontend will display the
    suggested tags for user confirmation before proceeding to extract-and-save.

    **Workflow:**
    1. User uploads document
    2. Backend saves to temporary Cloud Storage location
    3. AI analyzes content and suggests tags
    4. Frontend displays confirmation modal with suggested tags

    **Authentication Required:** Yes (Firebase ID token)
    """,
)
@require_valid_file_upload(
    config=FileUploadConfig(
        allowed_extensions={".pdf", ".doc", ".docx", ".txt", ".md", ".rtf"},
        max_file_size_mb=10,
        max_files=1,
    ),
    single_file=True,
)
async def upload_and_tag(
    file: UploadFile = File(..., description="Career document to upload (PDF, DOCX, TXT, etc.)"),
    current_user: Dict = Depends(get_current_user),
) -> UploadAndTagResponse:
    """
    Upload document and get AI-suggested contextual tags.

    Returns suggested roleType and subsectors for user confirmation.
    """
    user_id = current_user.get("uid")
    logger.info(f"Upload-and-tag request from user {user_id}: {file.filename}")

    try:
        # Step 1: Upload file to Cloud Storage (temp location)
        storage_uri, file_size = await _upload_to_storage(file, user_id, folder="temp_ingestions")

        # Step 2: Read file content for AI analysis
        document_text = await _read_file_from_storage(storage_uri)

        # Step 3: Run Context Tagger flow
        logger.info(f"Running Context Tagger flow for user {user_id}")
        suggested_tags = await contextTaggerFlow.run(documentText=document_text, user_id=user_id)

        # Step 4: Return response with suggested tags and file ID
        return UploadAndTagResponse(
            suggestedTags=suggested_tags,
            fileId=storage_uri,  # Use GCS URI as fileId for next step
            fileName=file.filename,
            fileType=file.content_type or "application/octet-stream",
            fileSizeBytes=file_size,
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Upload-and-tag failed for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}",
        )


# ============================================================================
# Endpoint 2: Extract and Save
# ============================================================================


@router.post(
    "/extract-and-save",
    response_model=ExtractAndSaveResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Extract structured data and save to asset library",
    description="""
    Extract structured career data from uploaded document and save to user's asset library.

    This is step 2 of the Smart Ingestion workflow, called after user confirms tags.

    **Workflow:**
    1. Frontend sends fileId, confirmed tags, and document type
    2. Backend reads document from Cloud Storage
    3. AI extracts structured data based on document type:
       - "resume": Full MasterCareerProfile (all fields)
       - "ksc": Key Selection Criteria examples
       - "voice": Writing style profile
    4. Structured data saved to Firestore: users/{user_id}/assetLibrary/{asset_id}
    5. File moved to permanent storage location

    **Authentication Required:** Yes (Firebase ID token)
    """,
    responses={
        201: {"description": "Asset successfully created"},
        400: {"model": IngestionErrorResponse, "description": "Invalid request"},
        500: {"model": IngestionErrorResponse, "description": "Internal server error"},
    },
)
async def extract_and_save(
    request: ExtractAndSaveRequest,
    current_user: Dict = Depends(get_current_user),
) -> ExtractAndSaveResponse:
    """
    Extract structured data from document and save to asset library.

    Uses AI to extract data based on document type, then saves to Firestore.
    """
    user_id = current_user.get("uid")
    logger.info(
        f"Extract-and-save request from user {user_id}: "
        f"type={request.documentType}, fileId={request.fileId}"
    )

    try:
        # Step 1: Read document content from storage
        document_text = await _read_file_from_storage(request.fileId)

        # Step 2: Extract filename from storage URI for metadata
        filename = os.path.basename(request.fileId)

        # Step 3: Run appropriate extractor flow based on document type
        extracted_data = None
        document_type = request.documentType

        confirmed_tags_dict = {
            "roleType": request.confirmedTags.roleType,
            "subsectors": request.confirmedTags.subsectors,
        }

        if document_type == "resume":
            logger.info(f"Running Resume Extractor flow for user {user_id}")
            master_profile = await resumeExtractorFlow.run(
                resumeText=document_text,
                confirmedTags=confirmed_tags_dict,
                user_id=user_id,
            )
            extracted_data = master_profile.model_dump(mode="json")

        elif document_type == "ksc":
            logger.info(f"Running KSC Extractor flow for user {user_id}")
            ksc_result = await kscExtractorFlow.run(
                kscText=document_text,
                confirmedTags=confirmed_tags_dict,
                user_id=user_id,
            )
            # Convert KSC examples to dict format
            extracted_data = {
                "keySelectionCriteriaExamples": [
                    example.model_dump(mode="json") for example in ksc_result.examples
                ]
            }

        elif document_type == "voice":
            logger.info(f"Running Voice Profile Extractor flow for user {user_id}")
            voice_profile = await voiceProfileExtractorFlow.run(
                writingSample=document_text,
                confirmedTags=confirmed_tags_dict,
                user_id=user_id,
            )
            extracted_data = voice_profile.model_dump(mode="json")

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid document type: {document_type}. "
                f"Must be one of: resume, ksc, voice",
            )

        # Step 4: Move file to permanent storage
        permanent_uri = await _move_file_in_storage(request.fileId, user_id)

        # Step 5: Create AssetDocument
        asset_doc = AssetDocument(
            documentType=document_type,
            extractedData=extracted_data,
            tags=request.confirmedTags,
            metadata=AssetMetadata(
                fileName=filename,
                fileType="application/pdf",  # TODO: Detect actual MIME type from file
                uploadDate=datetime.now(),
                storageUri=permanent_uri,
                fileSizeBytes=None,  # Could be retrieved from storage metadata
            ),
            schemaVersion="v4",
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
            userId=user_id,
        )

        # Step 6: Save to Firestore
        asset_id = await _save_to_firestore(asset_doc, user_id)

        # Step 7: Return success response
        document_type_labels = {
            "resume": "Resume",
            "ksc": "Key Selection Criteria",
            "voice": "Voice Profile",
        }
        label = document_type_labels.get(document_type, "Document")

        return ExtractAndSaveResponse(
            status="success",
            assetId=asset_id,
            message=f"{label} successfully extracted and saved to your asset library",
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Extract-and-save failed for user {user_id}: {str(e)}", exc_info=True)

        # Create detailed error message
        error_message = create_detailed_error_message(
            None,  # No AIOperationResult available here
            operation_context="document extraction",
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_message or f"Failed to extract and save document: {str(e)}",
        )


# ============================================================================
# Health Check Endpoint (Optional - for testing)
# ============================================================================


@router.get(
    "/health",
    summary="Health check for Smart Ingestion service",
    description="Check if all required services (Cloud Storage, Firestore, Genkit) are available",
)
async def health_check() -> JSONResponse:
    """Check health of Smart Ingestion dependencies."""
    health_status = {
        "storage": bool(get_storage()),
        "firestore": bool(get_firestore()),
        "status": "healthy",
    }

    # Check if all services are available
    if not all([health_status["storage"], health_status["firestore"]]):
        health_status["status"] = "degraded"

    status_code = (
        status.HTTP_200_OK
        if health_status["status"] == "healthy"
        else status.HTTP_503_SERVICE_UNAVAILABLE
    )

    return JSONResponse(content=health_status, status_code=status_code)
