"""Comprehensive endpoint-level tests for documents API module."""

import io
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.api.endpoints import documents as module


@pytest.mark.asyncio
async def test_get_documents_returns_serialized_assets():
    db = MagicMock()
    asset_one = MagicMock()
    asset_one.to_dict.return_value = {"id": "a1"}
    asset_two = MagicMock()
    asset_two.to_dict.return_value = {"id": "a2"}
    db.query.return_value.filter.return_value.all.return_value = [asset_one, asset_two]

    result = await module.get_documents(current_user=MagicMock(id="u1"), db=db)

    assert result == [{"id": "a1"}, {"id": "a2"}]


@pytest.mark.asyncio
async def test_get_documents_returns_empty_list_on_db_error():
    db = MagicMock()
    db.query.side_effect = RuntimeError("db fail")

    result = await module.get_documents(current_user=MagicMock(id="u1"), db=db)

    assert result == []


@pytest.mark.asyncio
async def test_redline_document_rejects_invalid_edits_json():
    upload = UploadFile(filename="test.docx", file=io.BytesIO(b"docx bytes"))

    with pytest.raises(HTTPException) as exc_info:
        await module.redline_document(file=upload, edits="not-json")

    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_redline_document_raises_500_when_service_returns_false():
    upload = UploadFile(filename="test.docx", file=io.BytesIO(b"docx bytes"))

    with patch("app.api.endpoints.documents.DocumentIntelligenceService") as svc:
        svc.return_value.apply_redlines_to_docx.return_value = False
        with pytest.raises(HTTPException) as exc_info:
            await module.redline_document(file=upload, edits='[{"original":"a","replacement":"b"}]')

    assert exc_info.value.status_code == 500


@pytest.mark.asyncio
async def test_redline_document_returns_file_response_on_success():
    upload = UploadFile(filename="test.docx", file=io.BytesIO(b"docx bytes"))

    with (
        patch("app.api.endpoints.documents.DocumentIntelligenceService") as svc,
        patch(
            "app.api.endpoints.documents.FileResponse", wraps=FileResponse
        ) as wrapped_file_response,
    ):
        svc.return_value.apply_redlines_to_docx.return_value = True
        response = await module.redline_document(
            file=upload, edits='[{"original":"a","replacement":"b"}]'
        )

    assert isinstance(response, FileResponse)
    assert wrapped_file_response.called
