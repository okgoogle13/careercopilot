"""
Tests for the document_processor module.
"""

import pytest
from fastapi.testclient import TestClient
from pathlib import Path
import io
from typing import Dict, Any
from app.ai.document_processor import DocumentProcessor, DocumentChunk
from app.core.ai_error_handling import AIError, AIErrorType
from unittest.mock import patch

@pytest.fixture
def document_processor():
    """Fixture for DocumentProcessor instance."""
    return DocumentProcessor(config={"chunk_size": 100, "chunk_overlap": 10})

def test_document_processor_init_with_default_config(document_processor):
    """Test DocumentProcessor initialization with default config."""
    assert document_processor.chunk_size == 1000
    assert document_processor.chunk_overlap == 200
    assert document_processor.max_chunk_size == 1500

def test_document_processor_init_with_custom_config(document_processor):
    """Test DocumentProcessor initialization with custom config."""
    assert document_processor.chunk_size == 100
    assert document_processor.chunk_overlap == 10

def test_document_processor_init_invalid_config():
    """Test DocumentProcessor initialization with invalid config (overlap >= chunk_size)."""
    with pytest.raises(ValueError):
        DocumentProcessor(config={"chunk_size": 100, "chunk_overlap": 100})

def test_process_document_pdf(document_processor, tmp_path):
    """Test processing a PDF document."""
    pdf_file = tmp_path / "test.pdf"
    pdf_file.write_bytes(b"%PDF-1.7\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000107 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n158\n%%EOF")

    chunks = document_processor.process_document(pdf_file)
    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)

def test_process_document_text(document_processor):
    """Test processing a text document."""
    text_content = "This is a test document."
    chunks = document_processor.process_document(io.BytesIO(text_content.encode("utf-8")), content_type="text/plain")
    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)

def test_process_document_html(document_processor):
    """Test processing an HTML document."""
    html_content = "<html><body><h1>Test</h1><p>This is a test document.</p></body></html>"
    chunks = document_processor.process_document(io.BytesIO(html_content.encode("utf-8")), content_type="text/html")
    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)

def test_process_document_unsupported_content_type(document_processor):
    """Test processing a document with an unsupported content type."""
    with pytest.raises(ValueError):
        document_processor.process_document(io.BytesIO(b"test"), content_type="image/jpeg")

def test_process_document_error_handling(document_processor):
    """Test error handling during document processing."""
    with pytest.raises(AIError) as exc_info:
        document_processor.process_document("invalid_path")
    assert "Failed to process document" in str(exc_info.value)
    assert exc_info.value.error_type == AIErrorType.DOCUMENT_PROCESSING_ERROR

def test_chunk_text(document_processor):
    """Test the _chunk_text method."""
    text = "This is a long text that needs to be chunked."
    chunks = document_processor._chunk_text(text, {})
    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)

def test_detect_content_type(document_processor, tmp_path):
    """Test the _detect_content_type method."""
    pdf_file = tmp_path / "test.pdf"
    pdf_file.write_bytes(b"%PDF-1.7\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj")
    content_type = document_processor._detect_content_type(pdf_file)
    assert content_type == "application/pdf"

    text_file = tmp_path / "test.txt"
    text_file.write_text("This is a test.")
    content_type = document_processor._detect_content_type(text_file)
    assert content_type == "text/plain"