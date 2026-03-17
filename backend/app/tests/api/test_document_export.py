"""Contract tests for document export endpoint helpers."""

import pytest
from fastapi import HTTPException

from app.api.endpoints.document_export import (
    _convert_export_result_to_response,
    export_cover_letter,
)
from app.core.document_export_service import DocumentExportResult
from app.models.document_export_schemas import CoverLetterExportRequest


def test_convert_export_result_to_response():
    result = DocumentExportResult(
        success=True,
        document_type="cover_letter",
        file_format="txt",
        download_url="https://example.test/file",
        file_size_bytes=123,
        storage_path="gs://bucket/path",
        expires_at="2026-03-05T00:00:00Z",
        message="ok",
    )
    response = _convert_export_result_to_response(result, type("Resp", (result.__class__,), {}))
    assert response.success is True
    assert response.file_format == "txt"


@pytest.mark.asyncio
async def test_export_cover_letter_invalid_format(monkeypatch):
    async def _raise_value_error(**_kwargs):
        raise ValueError("Unsupported format")

    from app.api.endpoints import document_export as module

    monkeypatch.setattr(module.document_export_service, "export_cover_letter", _raise_value_error)

    request = CoverLetterExportRequest(
        format="pdf",
        expiration_hours=2,
        job_title="Case Worker",
        company_name="Org",
    )

    with pytest.raises(HTTPException) as exc:
        await export_cover_letter(request=request, content="hello", user_id="u1")
    assert exc.value.status_code == 400
