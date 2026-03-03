"""Unit tests for the PDF upload parser utility."""

import asyncio
import sys
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

pypdf_module = sys.modules.setdefault("pypdf", ModuleType("pypdf"))
pypdf_module.PdfReader = getattr(pypdf_module, "PdfReader", object)

import app.utils.pdf_parser as pdf_parser_module
from app.utils.pdf_parser import extract_text_from_upload


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


def test_extract_text_from_upload_decodes_plain_text():
    """Plain-text uploads should be decoded directly."""
    upload = SimpleNamespace(
        content_type="text/plain",
        filename="notes.txt",
        read=AsyncMock(return_value=b"hello world"),
    )

    assert asyncio.run(extract_text_from_upload(upload)) == "hello world"


def test_extract_text_from_upload_reads_pdf_pages(monkeypatch):
    """PDF uploads should be passed through PdfReader and page text joined."""
    reader = SimpleNamespace(
        pages=[
            SimpleNamespace(extract_text=MagicMock(return_value="Page one")),
            SimpleNamespace(extract_text=MagicMock(return_value="Page two")),
        ]
    )
    monkeypatch.setattr(pdf_parser_module, "PdfReader", MagicMock(return_value=reader))
    upload = SimpleNamespace(
        content_type="application/pdf",
        filename="resume.pdf",
        read=AsyncMock(return_value=b"%PDF-1.4"),
    )

    assert asyncio.run(extract_text_from_upload(upload)) == "Page one\nPage two"


def test_extract_text_from_upload_returns_error_marker_for_bad_pdf(monkeypatch):
    """Reader failures should return a stable, debuggable error message."""
    monkeypatch.setattr(
        pdf_parser_module,
        "PdfReader",
        MagicMock(side_effect=RuntimeError("corrupt file")),
    )
    upload = SimpleNamespace(
        content_type="application/pdf",
        filename="broken.pdf",
        read=AsyncMock(return_value=b"%PDF-1.4"),
    )

    assert (
        asyncio.run(extract_text_from_upload(upload))
        == "[Error reading PDF broken.pdf: corrupt file]"
    )


def test_extract_text_from_upload_returns_empty_string_for_unsupported_file():
    """Unsupported upload types should be ignored."""
    upload = SimpleNamespace(
        content_type="image/png",
        filename="photo.png",
        read=AsyncMock(return_value=b"image-bytes"),
    )

    assert asyncio.run(extract_text_from_upload(upload)) == ""
