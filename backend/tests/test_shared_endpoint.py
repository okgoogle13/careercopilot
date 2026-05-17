import pytest
from fastapi import HTTPException

from app.api.endpoints._shared import run_endpoint


@pytest.mark.asyncio
async def test_run_endpoint_passthroughs_http_exception() -> None:
    async def operation() -> dict[str, str]:
        raise HTTPException(status_code=418, detail="teapot")

    with pytest.raises(HTTPException) as exc_info:
        await run_endpoint(operation, "fallback")

    assert exc_info.value.status_code == 418
    assert exc_info.value.detail == "teapot"


@pytest.mark.asyncio
async def test_run_endpoint_maps_bad_request_exception() -> None:
    async def operation() -> dict[str, str]:
        raise ValueError("invalid payload")

    with pytest.raises(HTTPException) as exc_info:
        await run_endpoint(
            operation,
            "fallback",
            bad_request_exceptions=(ValueError,),
        )

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "invalid payload"


@pytest.mark.asyncio
async def test_run_endpoint_maps_unhandled_exception_to_500_with_message_only() -> None:
    async def operation() -> dict[str, str]:
        raise RuntimeError("boom")

    with pytest.raises(HTTPException) as exc_info:
        await run_endpoint(operation, "Career ingestion failed")

    assert exc_info.value.status_code == 500
    assert exc_info.value.detail == "Career ingestion failed"


@pytest.mark.asyncio
async def test_run_endpoint_can_include_exception_detail() -> None:
    async def operation() -> dict[str, str]:
        raise RuntimeError("boom")

    with pytest.raises(HTTPException) as exc_info:
        await run_endpoint(
            operation,
            "Operation failed",
            include_exception_detail=True,
        )

    assert exc_info.value.status_code == 500
    assert exc_info.value.detail == "Operation failed: boom"
