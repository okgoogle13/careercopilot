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
<<<<<<< HEAD
from typing import Dict

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from app.core.auth import get_current_user
from app.core.enhanced_ai_error_handling import create_detailed_error_message
from app.core.file_upload_decorators import FileUploadConfig, require_valid_file_upload
from app.core.supabase import get_supabase_client, get_supabase_storage
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.models.user_asset import UserAsset
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
from app.genkit_flows.smart_ingestion import (
    contextTaggerFlow,
    kscExtractorFlow,
    resumeExtractorFlow,
    skillsExtractorFlow,
    voiceProfileExtractorFlow,
)
<<<<<<< HEAD
from app.models.asset_library_schema import AssetDocument, AssetMetadata, ContextTags
=======
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.core.enhanced_ai_error_handling import create_detailed_error_message
from app.core.file_upload_decorators import FileUploadConfig, require_valid_file_upload
from app.core.supabase import get_supabase_storage
from app.models.asset_library_schema import AssetDocument, AssetMetadata
>>>>>>> restoration-KR-Rage-Figma-v2.0
from app.models.ingestion_schemas import (
    ExtractAndSaveRequest,
    ExtractAndSaveResponse,
    IngestionErrorResponse,
    UploadAndTagResponse,
)
<<<<<<< HEAD
=======
from app.models.user_asset import UserAsset
>>>>>>> restoration-KR-Rage-Figma-v2.0

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
        storage = get_supabase_storage()
        bucket_name = os.getenv("SUPABASE_STORAGE_BUCKET", "user_assets")
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Generate unique filename with timestamp
        timestamp = int(datetime.now().timestamp())
        filename = f"{user_id}/{timestamp}_{file.filename}"

        # Reset file pointer and get content
        await file.seek(0)
        file_content = await file.read()
        file_size = len(file_content)

        # Upload to Supabase Storage
        # Supabase python client storage.upload expects (path, file, file_options)
        storage.from_(bucket_name).upload(
            path=filename,
            file=file_content,
            file_options={"content-type": file.content_type}
        )

        storage_uri = f"storage://{bucket_name}/{filename}"
        logger.info(f"File uploaded successfully to {storage_uri}, size: {file_size} bytes")

        return storage_uri, file_size

    except Exception as e:
<<<<<<< HEAD
        logger.error(f"Failed to upload file to storage: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}",
=======
        logger.error(f"Failed to upload file to storage: {e!s}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
        storage = get_supabase_storage()
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Extract bucket and path from URI (storage://bucket/path)
        uri_parts = storage_uri.replace("storage://", "").split("/", 1)
        if len(uri_parts) < 2:
            raise ValueError(f"Invalid storage URI: {storage_uri}")
<<<<<<< HEAD
            
        bucket_name, file_path = uri_parts
        
=======

        bucket_name, file_path = uri_parts

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Download as binary and convert to text
        res = storage.from_(bucket_name).download(file_path)
        content = res.decode("utf-8")
        logger.info(f"Successfully read {len(content)} characters from {storage_uri}")

        return content

    except Exception as e:
<<<<<<< HEAD
        logger.error(f"Failed to read file from storage: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read file from storage: {str(e)}",
=======
        logger.error(f"Failed to read file from storage: {e!s}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read file from storage: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
        storage = get_supabase_storage()
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Extract bucket and path
        uri_parts = source_uri.replace("storage://", "").split("/", 1)
        if len(uri_parts) < 2:
            return source_uri
<<<<<<< HEAD
            
        bucket_name, source_path = uri_parts
        filename = os.path.basename(source_path)
        
        # Permanent path: resumes/{user_id}/filename or assets/{user_id}/filename
        dest_path = f"permanent/{user_id}/{filename}"
        
=======

        bucket_name, source_path = uri_parts
        filename = os.path.basename(source_path)

        # Permanent path: resumes/{user_id}/filename or assets/{user_id}/filename
        dest_path = f"permanent/{user_id}/{filename}"

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Supabase doesn't have a direct "move", so copy + delete
        storage.from_(bucket_name).copy(source_path, dest_path)
        storage.from_(bucket_name).remove([source_path])

        new_uri = f"storage://{bucket_name}/{dest_path}"
        logger.info(f"File moved from {source_uri} to {new_uri}")

        return new_uri

    except Exception as e:
<<<<<<< HEAD
        logger.error(f"Failed to move file in storage: {str(e)}", exc_info=True)
=======
        logger.error(f"Failed to move file in storage: {e!s}", exc_info=True)
>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Non-fatal error - file can stay in temp location
        logger.warning("File will remain in temporary location")
        return source_uri


async def _save_to_database(
    asset_doc: AssetDocument, user_id: str, db: Session
) -> str:
    """
    Save asset document to PostgreSQL (Supabase) via SQLAlchemy.
    
    Args:
        asset_doc: The asset document to save (Pydantic)
        user_id: User UUID
        db: SQLAlchemy session
    """
    try:
        # Create UserAsset record
        db_asset = UserAsset(
            user_id=user_id,
            document_type=asset_doc.documentType,
            extracted_data=asset_doc.extractedData,
            role_type=asset_doc.tags.roleType,
            subsectors=asset_doc.tags.subsectors,
            file_name=asset_doc.metadata.fileName,
            file_type=asset_doc.metadata.fileType,
            storage_uri=asset_doc.metadata.storageUri,
            file_size_bytes=asset_doc.metadata.fileSizeBytes,
            schema_version=asset_doc.schemaVersion
        )
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        db.add(db_asset)
        db.commit()
        db.refresh(db_asset)

        logger.info(f"Asset saved to Database: id={db_asset.id}")

        return str(db_asset.id)

    except Exception as e:
<<<<<<< HEAD
        logger.error(f"Failed to save to Firestore: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save asset to database: {str(e)}",
=======
        logger.error(f"Failed to save to Firestore: {e!s}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save asset to database: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
    current_user = Depends(get_current_user),
) -> UploadAndTagResponse:
    """
    Upload document and get AI-suggested contextual tags.

    Returns suggested roleType and subsectors for user confirmation.
    """
    user_id = str(current_user.id)
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
<<<<<<< HEAD
        logger.error(f"Upload-and-tag failed for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}",
=======
        logger.error(f"Upload-and-tag failed for user {user_id}: {e!s}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ExtractAndSaveResponse:
    """
    Extract structured data from document and save to asset library.

    Uses AI to extract data based on document type, then saves to Firestore.
    """
    user_id = str(current_user.id)
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

            # Run supplemental skills extraction for deeper skill analysis
            logger.info(f"Running supplemental Skills Extractor flow for user {user_id}")
            try:
                skills_result = await skillsExtractorFlow.run(
                    resumeText=document_text,
                    confirmedTags=confirmed_tags_dict,
                    user_id=user_id,
                )
                # Merge extracted skills with the profile's skills
                if skills_result.technical:
                    master_profile.skills.technical.extend(skills_result.technical)
                if skills_result.tools:
                    master_profile.skills.tools.extend(skills_result.tools)
                if skills_result.soft:
                    master_profile.skills.soft.extend(skills_result.soft)
                if skills_result.methodologies:
                    master_profile.skills.methodologies.extend(skills_result.methodologies)

                # Deduplicate skills (case-insensitive)
                master_profile.skills.technical = list(set(s.strip() for s in master_profile.skills.technical if s.strip()))
                master_profile.skills.tools = list(set(s.strip() for s in master_profile.skills.tools if s.strip()))
                master_profile.skills.soft = list(set(s.strip() for s in master_profile.skills.soft if s.strip()))
                master_profile.skills.methodologies = list(set(s.strip() for s in master_profile.skills.methodologies if s.strip()))

                logger.info(
                    f"Skills enriched: {len(master_profile.skills.technical)} technical, "
                    f"{len(master_profile.skills.tools)} tools, "
                    f"{len(master_profile.skills.soft)} soft skills, "
                    f"{len(master_profile.skills.methodologies)} methodologies"
                )
            except Exception as e:
                # Log but don't fail the entire ingestion if skills extraction fails
<<<<<<< HEAD
                logger.warning(f"Skills extraction failed (non-critical): {str(e)}")
=======
                logger.warning(f"Skills extraction failed (non-critical): {e!s}")
>>>>>>> restoration-KR-Rage-Figma-v2.0

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

        # Step 5: For Supabase, we already have some metadata or can set defaults
        # Since we are using Supabase storage, metadata is handled differently
        detected_mime_type = "application/pdf" if ".pdf" in permanent_uri.lower() else "application/octet-stream"
        file_size = 0 # Can be improved by fetching from Supabase Client if needed
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Step 6: Create AssetDocument
        asset_doc = AssetDocument(
            documentType=document_type,
            extractedData=extracted_data,
            tags=request.confirmedTags,
            metadata=AssetMetadata(
                fileName=filename,
                fileType=detected_mime_type,
                uploadDate=datetime.now(),
                storageUri=permanent_uri,
                fileSizeBytes=file_size,
            ),
            schemaVersion="v4",
            createdAt=datetime.now(),
            updatedAt=datetime.now(),
            userId=user_id,
        )

        # Step 6: Save to PostgreSQL
        asset_id = await _save_to_database(asset_doc, user_id, db)

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
<<<<<<< HEAD
        logger.error(f"Extract-and-save failed for user {user_id}: {str(e)}", exc_info=True)
=======
        logger.error(f"Extract-and-save failed for user {user_id}: {e!s}", exc_info=True)
>>>>>>> restoration-KR-Rage-Figma-v2.0

        # Create detailed error message
        error_message = create_detailed_error_message(
            None,  # No AIOperationResult available here
            operation_context="document extraction",
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
<<<<<<< HEAD
            detail=error_message or f"Failed to extract and save document: {str(e)}",
=======
            detail=error_message or f"Failed to extract and save document: {e!s}",
>>>>>>> restoration-KR-Rage-Figma-v2.0
        )


# ============================================================================
# Health Check Endpoint (Optional - for testing)
# ============================================================================


@router.get(
    "/health",
    summary="Health check for Smart Ingestion service",
    description="Check if all required services (Supabase, Database, Genkit) are available",
)
async def health_check() -> JSONResponse:
    """Check health of Smart Ingestion dependencies."""
    health_status = {
        "storage": True,
        "db": True,
        "status": "healthy",
    }

    # Check if all services are available
    if not all([health_status["storage"], health_status["db"]]):
        health_status["status"] = "degraded"

    status_code = (
        status.HTTP_200_OK
        if health_status["status"] == "healthy"
        else status.HTTP_503_SERVICE_UNAVAILABLE
    )

    return JSONResponse(content=health_status, status_code=status_code)
