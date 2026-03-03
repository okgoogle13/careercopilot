"""Unit tests for the document extraction helpers."""

from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

from app.services import document_extractor


def test_detect_document_links_resolves_relative_and_absolute_urls():
    """Document links should be normalized against the provided page URL."""
    html = """
    <a href="/files/brief.pdf">PDF</a>
    <a href="attachments/criteria.docx">DOCX</a>
    <a href="https://cdn.example.com/forms/app.doc">DOC</a>
    """

    links = document_extractor.detect_document_links(html, "https://jobs.example.com/openings/123")

    assert links == [
        ("https://jobs.example.com/files/brief.pdf", "pdf"),
        ("https://jobs.example.com/openings/attachments/criteria.docx", "docx"),
        ("https://cdn.example.com/forms/app.doc", "docx"),
    ]


def test_download_document_returns_response_content(monkeypatch):
    """Successful downloads should return raw bytes and use the configured headers."""
    response = MagicMock()
    response.content = b"payload"
    response.raise_for_status.return_value = None
    request_get = MagicMock(return_value=response)

    monkeypatch.setattr(document_extractor.requests, "get", request_get)

    content = document_extractor.download_document("https://example.com/file.pdf", timeout=12)

    assert content == b"payload"
    request_get.assert_called_once()
    _, kwargs = request_get.call_args
    assert kwargs["timeout"] == 12
    assert "JobAnalyzer/1.0" in kwargs["headers"]["User-Agent"]


def test_extract_text_from_pdf_falls_back_to_pdfminer(monkeypatch):
    """When pypdf fails, the pdfminer fallback should be used."""
    reader_factory = MagicMock(side_effect=ValueError("bad pdf"))
    fallback_extract = MagicMock(return_value="Recovered PDF text")

    monkeypatch.setattr(document_extractor, "PYPDF_AVAILABLE", True)
    monkeypatch.setattr(document_extractor, "PDFMINER_AVAILABLE", True)
    monkeypatch.setattr(document_extractor, "PdfReader", reader_factory, raising=False)
    monkeypatch.setattr(document_extractor, "pdfminer_extract", fallback_extract, raising=False)

    text = document_extractor.extract_text_from_pdf(b"fake-pdf")

    assert text == "Recovered PDF text"
    reader_factory.assert_called_once()
    fallback_extract.assert_called_once()


def test_extract_text_from_docx_raises_when_dependency_missing(monkeypatch):
    """The service should fail fast when python-docx is unavailable."""
    monkeypatch.setattr(document_extractor, "DOCX_AVAILABLE", False)

    with pytest.raises(RuntimeError, match="python-docx not installed"):
        document_extractor.extract_text_from_docx(b"docx-bytes")


def test_extract_documents_from_page_combines_successful_extractions(monkeypatch):
    """Failed documents should be skipped while successful ones are retained."""
    monkeypatch.setattr(
        document_extractor,
        "detect_document_links",
        MagicMock(
            return_value=[
                ("https://example.com/brief.pdf", "pdf"),
                ("https://example.com/criteria.docx", "docx"),
            ]
        ),
    )
    monkeypatch.setattr(document_extractor, "download_document", MagicMock(return_value=b"content"))
    monkeypatch.setattr(document_extractor, "extract_text_from_pdf", MagicMock(return_value="PDF body"))
    monkeypatch.setattr(
        document_extractor,
        "extract_text_from_docx",
        MagicMock(side_effect=RuntimeError("docx failure")),
    )

    text = document_extractor.extract_documents_from_page("<html />", "https://example.com")

    assert "--- Document: https://example.com/brief.pdf ---" in text
    assert "PDF body" in text
    assert "criteria.docx" not in text
