"""Focused tests for shared endpoint helpers."""

from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.api.endpoints import _shared as module


@pytest.mark.asyncio
async def test_run_genkit_endpoint_returns_503_when_disabled():
    """The helper should short-circuit before invoking the operation."""

    async def operation():
        raise AssertionError("operation should not run")

    with pytest.raises(HTTPException) as exc_info:
        await module.run_genkit_endpoint(
            operation,
            "operation failed",
            enabled_check=lambda: False,
        )

    assert exc_info.value.status_code == 503


@pytest.mark.asyncio
async def test_collect_uploaded_text_uses_canonical_extractor(mock_uploaded_text):
    """Uploads should be combined through the shared extraction path."""
    mock_uploaded_text.side_effect = ["Resume body", None]
    files = [
        SimpleNamespace(filename="resume.txt"),
        SimpleNamespace(filename="empty.txt"),
    ]

    result = await module.collect_uploaded_text(files)

    assert "--- SOURCE: resume.txt ---" in result
    assert "Resume body" in result
    assert "empty.txt" not in result


@pytest.mark.asyncio
async def test_run_endpoint_operation_maps_value_error_to_400():
    """Generic endpoint operations should convert declared input errors to 400."""

    async def operation():
        raise ValueError("bad input")

    with pytest.raises(HTTPException) as exc_info:
        await module.run_endpoint_operation(
            operation,
            "operation failed",
            bad_request_exceptions=(ValueError,),
        )

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "bad input"
