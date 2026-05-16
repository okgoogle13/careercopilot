"""Shared helpers for backend endpoint implementations."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

from fastapi import HTTPException, UploadFile, status

from app.core.genkit_init import is_genkit_enabled

T = TypeVar("T")


async def extract_text_from_upload(file: UploadFile) -> str | None:
    """Resolve the upload parser lazily so optional parser deps are not import-time hard requirements."""
    from app.utils.pdf_parser import extract_text_from_upload as parser_extract_text_from_upload

    return await parser_extract_text_from_upload(file)


async def run_genkit_endpoint(
    operation: Callable[[], Awaitable[T]],
    failure_message: str,
    *,
    enabled_check: Callable[[], bool] = is_genkit_enabled,
) -> T:
    """Run a Genkit-backed operation with consistent availability and error handling."""
    if not enabled_check():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Genkit flows are disabled.",
        )

    try:
        return await operation()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{failure_message}: {exc!s}",
        ) from exc


async def run_endpoint_operation(
    operation: Callable[[], Awaitable[T]],
    failure_message: str,
    *,
    bad_request_exceptions: tuple[type[Exception], ...] = (),
    logger: Any | None = None,
) -> T:
    """Run a non-Genkit endpoint operation with consistent exception mapping."""
    try:
        return await operation()
    except HTTPException:
        raise
    except bad_request_exceptions as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        if logger is not None:
            logger.error("%s: %s", failure_message, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{failure_message}: {exc!s}",
        ) from exc


async def run_endpoint(
    operation: Callable[[], Awaitable[T]],
    failure_message: str,
    *,
    bad_request_exceptions: tuple[type[Exception], ...] = (),
    bad_request_detail: Callable[[Exception], str] | None = None,
    logger: Any | None = None,
    include_exception_detail: bool = False,
) -> T:
    """Run an endpoint operation with shared exception mapping and HTTPException passthrough."""
    try:
        return await operation()
    except HTTPException:
        raise
    except bad_request_exceptions as exc:
        detail = bad_request_detail(exc) if bad_request_detail else str(exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        ) from exc
    except Exception as exc:
        if logger is not None:
            logger.error("%s: %s", failure_message, exc, exc_info=True)
        detail = f"{failure_message}: {exc!s}" if include_exception_detail else failure_message
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
        ) from exc


async def collect_uploaded_text(
    files: list[UploadFile],
    *,
    include_source_headers: bool = True,
    empty_detail: str = "No readable text found.",
    logger: Any | None = None,
) -> str:
    """Extract and concatenate uploaded file text using the app's canonical parser."""
    combined_text_parts: list[str] = []

    for file in files:
        if logger is not None:
            logger.info("Processing file: %s", file.filename)

        text = await extract_text_from_upload(file)
        if not text:
            if logger is not None:
                logger.warning("No text extracted from %s", file.filename)
            continue

        if include_source_headers:
            combined_text_parts.append(f"--- SOURCE: {file.filename} ---\n{text}")
        else:
            combined_text_parts.append(text)

    if not combined_text_parts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=empty_detail,
        )

    return "\n\n".join(combined_text_parts)
