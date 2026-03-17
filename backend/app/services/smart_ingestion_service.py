"""Shared service helpers for smart-ingestion endpoint orchestration."""

from __future__ import annotations

import logging
import os
from datetime import datetime
from typing import Any

from fastapi import HTTPException, UploadFile, status

from app.core.cloud_storage import cloud_storage_client
from app.genkit_flows.smart_ingestion import (
    kscExtractorFlow,
    resumeExtractorFlow,
    skillsExtractorFlow,
    voiceProfileExtractorFlow,
)
from app.models.asset_library_schema import AssetDocument, AssetMetadata
from app.models.ingestion_schemas import ExtractAndSaveRequest

logger = logging.getLogger(__name__)


def _dedupe_non_empty_values(values: list[str]) -> list[str]:
    """Preserve order while removing blank or duplicate skill values."""
    deduped: list[str] = []
    seen: set[str] = set()
    for value in values:
        cleaned = value.strip()
        if not cleaned or cleaned in seen:
            continue
        deduped.append(cleaned)
        seen.add(cleaned)
    return deduped


def _build_confirmed_tags_dict(confirmed_tags: Any) -> dict[str, Any]:
    """Normalize tag payloads for flow calls."""
    return {
        "roleType": getattr(confirmed_tags, "roleType", None),
        "subsectors": getattr(confirmed_tags, "subsectors", []),
    }


async def upload_document_to_storage(
    file: UploadFile,
    user_id: str,
    *,
    folder: str = "uploads",
) -> tuple[str, int]:
    """Upload a file to cloud storage and return the storage URI and size."""
    try:
        timestamp = int(datetime.now().timestamp())
        filename = f"{folder}/{user_id}/{timestamp}_{file.filename}"

        await file.seek(0)
        file_content = await file.read()
        file_size = len(file_content)

        storage_uri = cloud_storage_client.upload_file(
            file_content=file_content,
            destination_blob_name=filename,
            content_type=file.content_type or "application/octet-stream",
        )

        logger.info("File uploaded successfully to %s, size: %s bytes", storage_uri, file_size)
        return storage_uri, file_size
    except Exception as exc:
        logger.error("Failed to upload file to storage: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {exc!s}",
        ) from exc


async def read_document_from_storage(storage_uri: str) -> str:
    """Read and decode text content from cloud storage."""
    try:
        uri_parts = storage_uri.replace("storage://", "").split("/", 1)
        if len(uri_parts) < 2:
            raise ValueError(f"Invalid storage URI: {storage_uri}")

        _, file_path = uri_parts
        content, _ = cloud_storage_client.download_file(file_path)
        text_content = content.decode("utf-8")
        logger.info("Successfully read %s characters from %s", len(text_content), storage_uri)
        return text_content
    except Exception as exc:
        logger.error("Failed to read file from storage: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read file from storage: {exc!s}",
        ) from exc


async def upload_and_read_document(
    file: UploadFile,
    user_id: str,
    *,
    folder: str = "uploads",
) -> tuple[str, int, str]:
    """Upload a document, then immediately read its extracted text back."""
    storage_uri, file_size = await upload_document_to_storage(file, user_id, folder=folder)
    document_text = await read_document_from_storage(storage_uri)
    return storage_uri, file_size, document_text


async def move_document_to_permanent_storage(source_uri: str, user_id: str) -> str:
    """Move a staged file from temporary storage to its permanent location."""
    try:
        uri_parts = source_uri.replace("storage://", "").split("/", 1)
        if len(uri_parts) < 2:
            return source_uri

        bucket_name, source_path = uri_parts
        filename = os.path.basename(source_path)
        dest_path = f"permanent/{user_id}/{filename}"

        bucket = cloud_storage_client.bucket
        if bucket is None:
            logger.error("Storage bucket not available for move operation")
            return source_uri

        blob = bucket.blob(source_path)
        bucket.copy_blob(blob, bucket, dest_path)
        blob.delete()

        new_uri = f"storage://{bucket_name}/{dest_path}"
        logger.info("File moved from %s to %s", source_uri, new_uri)
        return new_uri
    except Exception as exc:
        logger.error("Failed to move file in storage: %s", exc, exc_info=True)
        logger.warning("File will remain in temporary location")
        return source_uri


async def _extract_resume_data(
    *,
    document_text: str,
    confirmed_tags: Any,
    user_id: str,
) -> dict[str, Any]:
    """Extract the canonical resume payload and merge supplemental skills."""
    confirmed_tags_dict = _build_confirmed_tags_dict(confirmed_tags)

    logger.info("Running Resume Extractor flow for user %s", user_id)
    master_profile = await resumeExtractorFlow.run(
        resumeText=document_text,
        confirmedTags=confirmed_tags_dict,
        user_id=user_id,
    )

    logger.info("Running supplemental Skills Extractor flow for user %s", user_id)
    try:
        skills_result = await skillsExtractorFlow.run(
            resumeText=document_text,
            confirmedTags=confirmed_tags_dict,
            user_id=user_id,
        )
        if skills_result.technical:
            master_profile.skills.technical.extend(skills_result.technical)
        if skills_result.tools:
            master_profile.skills.tools.extend(skills_result.tools)
        if skills_result.soft:
            master_profile.skills.soft.extend(skills_result.soft)
        if skills_result.methodologies:
            master_profile.skills.methodologies.extend(skills_result.methodologies)

        master_profile.skills.technical = _dedupe_non_empty_values(master_profile.skills.technical)
        master_profile.skills.tools = _dedupe_non_empty_values(master_profile.skills.tools)
        master_profile.skills.soft = _dedupe_non_empty_values(master_profile.skills.soft)
        master_profile.skills.methodologies = _dedupe_non_empty_values(
            master_profile.skills.methodologies
        )
    except Exception as exc:
        logger.warning("Skills extraction failed (non-critical): %s", exc)

    return master_profile.model_dump(mode="json")


async def extract_document_data(
    *,
    document_type: str,
    document_text: str,
    confirmed_tags: Any,
    user_id: str,
) -> tuple[dict[str, Any], str]:
    """Extract the document payload and return the saved-label for the response."""
    confirmed_tags_dict = _build_confirmed_tags_dict(confirmed_tags)

    if document_type == "resume":
        return (
            await _extract_resume_data(
                document_text=document_text,
                confirmed_tags=confirmed_tags,
                user_id=user_id,
            ),
            "Resume",
        )

    if document_type == "ksc":
        logger.info("Running KSC Extractor flow for user %s", user_id)
        ksc_result = await kscExtractorFlow.run(
            kscText=document_text,
            confirmedTags=confirmed_tags_dict,
            user_id=user_id,
        )
        return {
            "keySelectionCriteriaExamples": [
                example.model_dump(mode="json") for example in ksc_result.examples
            ]
        }, "Key Selection Criteria"

    if document_type == "voice":
        logger.info("Running Voice Profile Extractor flow for user %s", user_id)
        voice_profile = await voiceProfileExtractorFlow.run(
            writingSample=document_text,
            confirmedTags=confirmed_tags_dict,
            user_id=user_id,
        )
        return voice_profile.model_dump(mode="json"), "Voice Profile"

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Invalid document type: {document_type}. Must be one of: resume, ksc, voice",
    )


def build_asset_document(
    *,
    request: ExtractAndSaveRequest,
    user_id: str,
    file_name: str,
    storage_uri: str,
    extracted_data: dict[str, Any],
    file_size: int = 0,
) -> AssetDocument:
    """Build the persisted asset document record."""
    timestamp = datetime.now()
    detected_mime_type = (
        "application/pdf" if ".pdf" in storage_uri.lower() else "application/octet-stream"
    )

    return AssetDocument(
        documentType=request.documentType,
        extractedData=extracted_data,
        tags=request.confirmedTags,
        metadata=AssetMetadata(
            fileName=file_name,
            fileType=detected_mime_type,
            uploadDate=timestamp,
            storageUri=storage_uri,
            fileSizeBytes=file_size,
        ),
        schemaVersion="v4",
        createdAt=timestamp,
        updatedAt=timestamp,
        userId=user_id,
    )


async def save_asset_document(asset_doc: AssetDocument, user_id: str) -> str:
    """Persist an extracted asset to Firestore."""
    try:
        from app.core.firebase import get_firestore

        db = get_firestore()
        col = db.collection("user_assets")
        doc_ref = col.document()

        asset_data = {
            "id": doc_ref.id,
            "user_id": user_id,
            "document_type": asset_doc.documentType,
            "extracted_data": asset_doc.extractedData,
            "role_type": asset_doc.tags.roleType,
            "subsectors": asset_doc.tags.subsectors,
            "file_name": asset_doc.metadata.fileName,
            "file_type": asset_doc.metadata.fileType,
            "storage_uri": asset_doc.metadata.storageUri,
            "file_size_bytes": asset_doc.metadata.fileSizeBytes,
            "schema_version": asset_doc.schemaVersion,
        }

        doc_ref.set(asset_data)

        logger.info("Asset saved to Firestore: id=%s", doc_ref.id)
        return doc_ref.id
    except Exception as exc:
        logger.error("Failed to save to Firestore: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save asset to Firestore: {exc!s}",
        ) from exc


async def extract_and_store_document(
    request: ExtractAndSaveRequest,
    user_id: str,
) -> tuple[str, str]:
    """Run the extract-and-save workflow and return ``(asset_id, document_label)``."""
    document_text = await read_document_from_storage(request.fileId)
    file_name = os.path.basename(request.fileId)
    extracted_data, document_label = await extract_document_data(
        document_type=request.documentType,
        document_text=document_text,
        confirmed_tags=request.confirmedTags,
        user_id=user_id,
    )
    permanent_uri = await move_document_to_permanent_storage(request.fileId, user_id)
    asset_doc = build_asset_document(
        request=request,
        user_id=user_id,
        file_name=file_name,
        storage_uri=permanent_uri,
        extracted_data=extracted_data,
    )
    asset_id = await save_asset_document(asset_doc, user_id)
    return asset_id, document_label
