"""Tests for shared endpoint helper functions."""

from io import BytesIO
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException, UploadFile

from app.api.endpoints import _shared


@pytest.mark.asyncio
async def test_run_genkit_endpoint_disabled():
    with pytest.raises(HTTPException) as exc:
        await _shared.run_genkit_endpoint(AsyncMock(), "failed", enabled_check=lambda: False)
    assert exc.value.status_code == 503


@pytest.mark.asyncio
async def test_run_genkit_endpoint_success():
    async def op():
        return {"ok": True}

    result = await _shared.run_genkit_endpoint(op, "failed", enabled_check=lambda: True)
    assert result == {"ok": True}


@pytest.mark.asyncio
async def test_run_endpoint_operation_maps_bad_request():
    class BadInputError(Exception):
        pass

    async def op():
        raise BadInputError("bad input")

    with pytest.raises(HTTPException) as exc:
        await _shared.run_endpoint_operation(op, "failed", bad_request_exceptions=(BadInputError,))
    assert exc.value.status_code == 400


@pytest.mark.asyncio
async def test_collect_uploaded_text(monkeypatch):
    async def _extract(_file):
        return "parsed"

    monkeypatch.setattr(_shared, "extract_text_from_upload", _extract)
    upload = UploadFile(filename="resume.txt", file=BytesIO(b"ignored"))

    text = await _shared.collect_uploaded_text([upload], include_source_headers=True)
    assert "SOURCE: resume.txt" in text
    assert "parsed" in text
