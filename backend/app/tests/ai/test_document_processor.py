"""Focused tests for the document processor."""

from unittest.mock import AsyncMock, patch

import pytest

from app.ai.document_processor import DocumentChunk, DocumentProcessor
from app.core.ai_error_handling import AIError, AIErrorType


@pytest.fixture
def document_processor():
    """DocumentProcessor with a small custom chunk config."""
    return DocumentProcessor(config={"chunk_size": 100, "chunk_overlap": 10})


def test_document_processor_init_with_default_config():
    """Default configuration should use the documented defaults."""
    processor = DocumentProcessor()
    assert processor.chunk_size == 1000
    assert processor.chunk_overlap == 200
    assert processor.max_chunk_size == 1500


def test_document_processor_init_with_custom_config(document_processor):
    """Custom configuration should override the defaults."""
    assert document_processor.chunk_size == 100
    assert document_processor.chunk_overlap == 10
    assert document_processor.max_chunk_size == 1500


def test_document_processor_init_invalid_config():
    """Overlap must be smaller than the chunk size."""
    with pytest.raises(ValueError):
        DocumentProcessor(config={"chunk_size": 100, "chunk_overlap": 100})


@pytest.mark.asyncio
async def test_process_document_pdf(document_processor, tmp_path):
    """PDF files should be routed to the PDF processor."""
    pdf_file = tmp_path / "test.pdf"
    pdf_file.write_bytes(b"%PDF-1.7")
    expected = [DocumentChunk(text="chunk", metadata={"source": "pdf"})]

    with patch.object(document_processor, "_process_pdf", new=AsyncMock(return_value=expected)):
        chunks = await document_processor.process_document(pdf_file)

    assert chunks == expected


@pytest.mark.asyncio
async def test_process_document_text(document_processor):
    """Plain-text bytes should be decoded and chunked."""
    chunks = await document_processor.process_document(
        b"This is a test document.",
        content_type="text/plain",
    )

    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)


@pytest.mark.asyncio
async def test_process_document_html(document_processor):
    """HTML bytes should be converted to text and chunked."""
    html_content = b"<html><body><h1>Test</h1><p>This is a test document.</p></body></html>"

    chunks = await document_processor.process_document(
        html_content,
        content_type="text/html",
    )

    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)


@pytest.mark.asyncio
async def test_process_document_unsupported_content_type(document_processor):
    """Unsupported content types should be wrapped as AI errors."""
    with pytest.raises(AIError) as exc_info:
        await document_processor.process_document(b"test", content_type="image/jpeg")

    assert "Failed to process document" in str(exc_info.value)
    assert exc_info.value.error_type == AIErrorType.DOCUMENT_PROCESSING_ERROR


@pytest.mark.asyncio
async def test_process_document_error_handling(document_processor):
    """Bad file paths should be wrapped as document-processing errors."""
    with pytest.raises(AIError) as exc_info:
        await document_processor.process_document("invalid_path")

    assert "Failed to process document" in str(exc_info.value)
    assert exc_info.value.error_type == AIErrorType.DOCUMENT_PROCESSING_ERROR


def test_chunk_text(document_processor):
    """Chunking should produce DocumentChunk instances."""
    text = "This is a long text that needs to be chunked."
    chunks = document_processor._chunk_text(text, {})

    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)


def test_detect_content_type(document_processor, tmp_path):
    """Content type detection should map common file extensions."""
    pdf_file = tmp_path / "test.pdf"
    pdf_file.write_bytes(b"%PDF-1.7")
    assert document_processor._detect_content_type(pdf_file) == "application/pdf"

    text_file = tmp_path / "test.txt"
    text_file.write_text("This is a test.", encoding="utf-8")
    assert document_processor._detect_content_type(text_file) == "text/plain"
