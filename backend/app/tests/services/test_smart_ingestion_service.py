"""Tests for shared smart-ingestion service helpers."""

import io
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException, UploadFile

from app.models.asset_library_schema import ContextTags
from app.models.ingestion_schemas import ExtractAndSaveRequest, SuggestedTags
from app.services import smart_ingestion_service as module


def test_dedupe_non_empty_values_preserves_order():
    """Skill deduplication should keep the first occurrence and strip blanks."""
    result = module._dedupe_non_empty_values([" Python ", "", "Python", "SQL", "SQL", "  "])

    assert result == ["Python", "SQL"]


def test_build_confirmed_tags_dict_handles_missing_attributes():
    payload = module._build_confirmed_tags_dict(SimpleNamespace())

    assert payload == {"roleType": None, "subsectors": []}


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
async def test_upload_document_to_storage_success(monkeypatch):
    upload = UploadFile(filename="resume.txt", file=io.BytesIO(b"hello"))

    mock_client = SimpleNamespace(
        upload_file=MagicMock(return_value="storage://bucket/uploads/u1/f.txt")
    )
    monkeypatch.setattr(module, "cloud_storage_client", mock_client)

    storage_uri, file_size = await module.upload_document_to_storage(upload, "u1")

    assert storage_uri.startswith("storage://")
    assert file_size == 5
    mock_client.upload_file.assert_called_once()


@pytest.mark.asyncio
async def test_upload_document_to_storage_failure_raises_http_exception(monkeypatch):
    upload = UploadFile(filename="resume.txt", file=io.BytesIO(b"hello"))

    mock_client = SimpleNamespace(upload_file=MagicMock(side_effect=RuntimeError("upload failed")))
    monkeypatch.setattr(module, "cloud_storage_client", mock_client)

    with pytest.raises(HTTPException) as exc_info:
        await module.upload_document_to_storage(upload, "u1")

    assert exc_info.value.status_code == 500
    assert "Failed to upload file" in exc_info.value.detail


@pytest.mark.asyncio
async def test_read_document_from_storage_success(monkeypatch):
    mock_client = SimpleNamespace(download_file=MagicMock(return_value=(b"resume text", {})))
    monkeypatch.setattr(module, "cloud_storage_client", mock_client)

    result = await module.read_document_from_storage("storage://bucket/path/to/file.txt")

    assert result == "resume text"
    mock_client.download_file.assert_called_once_with("path/to/file.txt")


@pytest.mark.asyncio
async def test_read_document_from_storage_invalid_uri_raises_http_exception():
    with pytest.raises(HTTPException) as exc_info:
        await module.read_document_from_storage("not-a-storage-uri")

    assert exc_info.value.status_code == 500
    assert "Invalid storage URI" in exc_info.value.detail


@pytest.mark.asyncio
async def test_upload_and_read_document_returns_all_parts(monkeypatch):
    monkeypatch.setattr(
        module,
        "upload_document_to_storage",
        AsyncMock(return_value=("storage://bucket/f.txt", 9)),
    )
    monkeypatch.setattr(module, "read_document_from_storage", AsyncMock(return_value="decoded"))

    upload = UploadFile(filename="resume.txt", file=io.BytesIO(b"content"))
    result = await module.upload_and_read_document(upload, "u1")

    assert result == ("storage://bucket/f.txt", 9, "decoded")


@pytest.mark.asyncio
async def test_move_document_to_permanent_storage_success(monkeypatch):
    blob = MagicMock()
    bucket = MagicMock()
    bucket.blob.return_value = blob
    mock_client = SimpleNamespace(bucket=bucket)
    monkeypatch.setattr(module, "cloud_storage_client", mock_client)

    moved = await module.move_document_to_permanent_storage(
        "storage://bucket/uploads/user/file.pdf", "user-1"
    )

    assert moved == "storage://bucket/permanent/user-1/file.pdf"
    bucket.copy_blob.assert_called_once()
    blob.delete.assert_called_once()


@pytest.mark.asyncio
async def test_move_document_to_permanent_storage_returns_source_when_bucket_missing(monkeypatch):
    monkeypatch.setattr(module, "cloud_storage_client", SimpleNamespace(bucket=None))

    source = "storage://bucket/uploads/user/file.pdf"
    moved = await module.move_document_to_permanent_storage(source, "user-1")

    assert moved == source


@pytest.mark.asyncio
async def test_extract_resume_data_dedupes_skills(monkeypatch):
    class MockProfile:
        def __init__(self):
            self.skills = SimpleNamespace(
                technical=["Python", "Python"],
                tools=["Git"],
                soft=["Empathy"],
                methodologies=["STAR"],
            )

        def model_dump(self, mode="json"):
            return {
                "skills": {
                    "technical": self.skills.technical,
                    "tools": self.skills.tools,
                    "soft": self.skills.soft,
                    "methodologies": self.skills.methodologies,
                }
            }

    monkeypatch.setattr(
        module,
        "resumeExtractorFlow",
        SimpleNamespace(run=AsyncMock(return_value=MockProfile())),
    )
    monkeypatch.setattr(
        module,
        "skillsExtractorFlow",
        SimpleNamespace(
            run=AsyncMock(
                return_value=SimpleNamespace(
                    technical=["Python", "SQL"],
                    tools=["Git", "Docker"],
                    soft=["Empathy", "Communication"],
                    methodologies=["STAR", "Agile"],
                )
            )
        ),
    )

    result = await module._extract_resume_data(
        document_text="resume text",
        confirmed_tags=SuggestedTags(roleType="Engineer", subsectors=["Tech"]),
        user_id="u1",
    )

    assert result["skills"]["technical"] == ["Python", "SQL"]
    assert result["skills"]["tools"] == ["Git", "Docker"]


@pytest.mark.asyncio
async def test_extract_resume_data_tolerates_skills_flow_failure(monkeypatch):
    profile = SimpleNamespace(
        skills=SimpleNamespace(technical=["Python"], tools=[], soft=[], methodologies=[]),
        model_dump=lambda mode="json": {"skills": {"technical": ["Python"]}},
    )
    monkeypatch.setattr(
        module,
        "resumeExtractorFlow",
        SimpleNamespace(run=AsyncMock(return_value=profile)),
    )
    monkeypatch.setattr(
        module,
        "skillsExtractorFlow",
        SimpleNamespace(run=AsyncMock(side_effect=RuntimeError("boom"))),
    )

    result = await module._extract_resume_data(
        document_text="resume text",
        confirmed_tags=SuggestedTags(roleType="Engineer", subsectors=["Tech"]),
        user_id="u1",
    )

    assert result["skills"]["technical"] == ["Python"]


@pytest.mark.asyncio
async def test_extract_document_data_resume_path(monkeypatch):
    monkeypatch.setattr(module, "_extract_resume_data", AsyncMock(return_value={"r": 1}))

    payload, label = await module.extract_document_data(
        document_type="resume",
        document_text="sample",
        confirmed_tags=SuggestedTags(roleType="Engineer", subsectors=[]),
        user_id="user-1",
    )

    assert payload == {"r": 1}
    assert label == "Resume"


@pytest.mark.asyncio
async def test_extract_document_data_ksc_path(monkeypatch):
    ksc_result = SimpleNamespace(
        examples=[SimpleNamespace(model_dump=lambda mode="json": {"id": "k1"})]
    )
    monkeypatch.setattr(
        module,
        "kscExtractorFlow",
        SimpleNamespace(run=AsyncMock(return_value=ksc_result)),
    )

    payload, label = await module.extract_document_data(
        document_type="ksc",
        document_text="sample",
        confirmed_tags=SuggestedTags(roleType="Engineer", subsectors=[]),
        user_id="user-1",
    )

    assert payload == {"keySelectionCriteriaExamples": [{"id": "k1"}]}
    assert label == "Key Selection Criteria"


@pytest.mark.asyncio
async def test_extract_document_data_voice_path(monkeypatch):
    voice = SimpleNamespace(model_dump=lambda mode="json": {"tone": "Professional"})
    monkeypatch.setattr(
        module,
        "voiceProfileExtractorFlow",
        SimpleNamespace(run=AsyncMock(return_value=voice)),
    )

    payload, label = await module.extract_document_data(
        document_type="voice",
        document_text="sample",
        confirmed_tags=SuggestedTags(roleType="Engineer", subsectors=[]),
        user_id="user-1",
    )

    assert payload == {"tone": "Professional"}
    assert label == "Voice Profile"


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


@pytest.mark.asyncio
async def test_save_asset_document_success():
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
        file_size=10,
    )

    db = MagicMock()

    def _refresh(asset):
        asset.id = 42

    db.refresh.side_effect = _refresh

    asset_id = await module.save_asset_document(asset_doc, "user-1", db)

    assert asset_id == "42"
    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once()


@pytest.mark.asyncio
async def test_save_asset_document_db_error_raises_http_exception():
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
        file_size=10,
    )

    db = MagicMock()
    db.commit.side_effect = RuntimeError("db failed")

    with pytest.raises(HTTPException) as exc_info:
        await module.save_asset_document(asset_doc, "user-1", db)

    assert exc_info.value.status_code == 500
    assert "Failed to save asset to database" in exc_info.value.detail


@pytest.mark.asyncio
async def test_extract_and_store_document_orchestrates_steps(monkeypatch):
    request = ExtractAndSaveRequest(
        fileId="storage://bucket/temp/file.pdf",
        documentType="resume",
        confirmedTags=ContextTags(roleType="Engineer", subsectors=["Tech"]),
    )

    monkeypatch.setattr(module, "read_document_from_storage", AsyncMock(return_value="text"))
    monkeypatch.setattr(
        module, "extract_document_data", AsyncMock(return_value=({"ok": True}, "Resume"))
    )
    monkeypatch.setattr(
        module,
        "move_document_to_permanent_storage",
        AsyncMock(return_value="storage://bucket/permanent/user-1/file.pdf"),
    )
    monkeypatch.setattr(module, "save_asset_document", AsyncMock(return_value="asset-1"))

    asset_id, label = await module.extract_and_store_document(request, "user-1", MagicMock())

    assert asset_id == "asset-1"
    assert label == "Resume"
