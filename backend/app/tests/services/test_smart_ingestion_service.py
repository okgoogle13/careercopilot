"""Tests for shared smart-ingestion service helpers."""

import pytest
from fastapi import HTTPException

from app.models.asset_library_schema import ContextTags
from app.models.ingestion_schemas import ExtractAndSaveRequest, SuggestedTags
from app.services import smart_ingestion_service as module


def test_dedupe_non_empty_values_preserves_order():
    """Skill deduplication should keep the first occurrence and strip blanks."""
    result = module._dedupe_non_empty_values([" Python ", "", "Python", "SQL", "SQL", "  "])

    assert result == ["Python", "SQL"]


def test_build_asset_document_uses_request_metadata():
    """Asset documents should inherit the canonical request shape."""
    request = ExtractAndSaveRequest(
        fileId="storage://bucket/temp/file.pdf",
        documentType="resume",
        confirmedTags=ContextTags(roleType="Engineer", subsectors=["Tech"]),
    )

    asset_doc = module.build_asset_document(
        request=request,
        user_id="user-1",
        file_name="file.pdf",
        storage_uri="storage://bucket/permanent/file.pdf",
        extracted_data={"summary": "Test"},
        file_size=123,
    )

    assert asset_doc.documentType == "resume"
    assert asset_doc.metadata.fileName == "file.pdf"
    assert asset_doc.metadata.fileSizeBytes == 123
    assert asset_doc.tags.roleType == "Engineer"


@pytest.mark.asyncio
async def test_extract_document_data_rejects_unknown_document_types():
    """Unsupported document types should fail with a 400."""
    with pytest.raises(HTTPException) as exc_info:
        await module.extract_document_data(
            document_type="unknown",
            document_text="sample",
            confirmed_tags=SuggestedTags(roleType="Engineer", subsectors=["Tech"]),
            user_id="user-1",
        )

    assert exc_info.value.status_code == 400
