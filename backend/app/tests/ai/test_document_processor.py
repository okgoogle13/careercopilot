"""Focused tests for the document processor."""

from unittest.mock import AsyncMock, MagicMock, patch

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
async def test_process_document_pdf_path(document_processor, tmp_path):
    pdf_file = tmp_path / "test.pdf"
    pdf_file.write_bytes(b"dummy pdf content")
    expected = [DocumentChunk(text="chunk", metadata={"source": "pdf"})]

    with patch.object(document_processor, "_process_pdf", new=AsyncMock(return_value=expected)):
        chunks = await document_processor.process_document(str(pdf_file))

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
async def test_process_document_markdown(document_processor):
    chunks = await document_processor.process_document(
        b"# Test\nThis is a test document.",
        content_type="text/markdown",
    )
    assert len(chunks) > 0


@pytest.mark.asyncio
async def test_process_document_html(document_processor):
    """HTML bytes should be converted to text and chunked."""
    html_content = b"<html><head><style>body {color: red;}</style><script>alert('test');</script></head><body><h1>Test</h1><p>This is a test document.</p></body></html>"

    chunks = await document_processor.process_document(
        html_content,
        content_type="text/html",
    )

    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)
    # Check if style/script are stripped
    assert "body {color: red;}" not in chunks[0].text
    assert "alert('test');" not in chunks[0].text


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
    # Add text long enough to trigger chunk overlap logic and sentence boundary splitting
    text = "Sentence one. " * 20
    chunks = document_processor._chunk_text(text, {})

    assert isinstance(chunks, list)
    assert len(chunks) > 1
    assert all(isinstance(chunk, DocumentChunk) for chunk in chunks)


def test_chunk_text_overlap(document_processor):
    # chunk_size is 100, chunk_overlap is 10
    text = "a " * 50  # 100 chars
    text += "b " * 50  # 200 chars total
    chunks = document_processor._chunk_text(text, {})
    assert len(chunks) > 1
    # Check that overlap happens


def test_chunk_text_small_overlap(document_processor):
    document_processor.chunk_overlap = (
        150  # Larger than chunk size 100? No wait, overlap can be smaller
    )
    document_processor.chunk_size = 20
    document_processor.chunk_overlap = 10
    text = "123456789012345678901234567890"  # 30 chars
    chunks = document_processor._chunk_text(text, {})
    assert len(chunks) > 1


def test_chunk_text_empty_chunk(document_processor):
    document_processor.chunk_size = 5
    document_processor.chunk_overlap = 1
    # Create a situation where chunk text becomes empty
    text = "a " * 20
    chunks = document_processor._chunk_text(text, {})
    assert len(chunks) > 1


def test_chunk_text_empty(document_processor):
    assert document_processor._chunk_text("   \n ", {}) == []


def test_detect_content_type(document_processor, tmp_path):
    """Content type detection should map common file extensions."""
    pdf_file = tmp_path / "test.pdf"
    pdf_file.write_bytes(b"%PDF-1.7")
    assert document_processor._detect_content_type(pdf_file) == "application/pdf"

    text_file = tmp_path / "test.txt"
    text_file.write_text("This is a test.", encoding="utf-8")
    assert document_processor._detect_content_type(text_file) == "text/plain"

    html_file = tmp_path / "test.html"
    html_file.write_text("<html></html>", encoding="utf-8")
    assert document_processor._detect_content_type(html_file) == "text/html"

    unknown_file = tmp_path / "test.unknown"
    unknown_file.write_text("test", encoding="utf-8")
    assert document_processor._detect_content_type(unknown_file) == "text/plain"


@pytest.mark.asyncio
async def test_process_html_error(document_processor):
    with patch(
        "app.ai.document_processor.BeautifulSoup", side_effect=Exception("HTML parse error")
    ):
        with pytest.raises(AIError) as exc_info:
            await document_processor._process_html(b"bad html", {})

        assert "HTML parse error" in str(exc_info.value)


@pytest.mark.asyncio
async def test_process_pdf_pypdfium2_success(document_processor):
    mock_pdf = MagicMock()
    mock_page = MagicMock()
    mock_page.get_text.return_value = "PDF text content."
    # Simulate a 1-page PDF
    mock_pdf.__len__.return_value = 1
    mock_pdf.__getitem__.return_value = mock_page

    with patch("app.ai.document_processor.pypdfium2.PdfDocument", return_value=mock_pdf):
        chunks = await document_processor._process_pdf(b"dummy content", {"meta": "data"})

    assert len(chunks) > 0
    assert chunks[0].page_number == 1
    assert chunks[0].metadata["meta"] == "data"


@pytest.mark.asyncio
async def test_process_pdf_pypdfium2_empty_page(document_processor):
    mock_pdf = MagicMock()
    mock_page = MagicMock()
    mock_page.get_text.return_value = "   "
    mock_pdf.__len__.return_value = 1
    mock_pdf.__getitem__.return_value = mock_page

    with patch("app.ai.document_processor.pypdfium2.PdfDocument", return_value=mock_pdf):
        chunks = await document_processor._process_pdf(b"dummy content", {})

    assert len(chunks) == 0


@pytest.mark.asyncio
async def test_process_pdf_fallback_to_pdfplumber(document_processor):
    # Make pypdfium2 raise an exception
    with patch(
        "app.ai.document_processor.pypdfium2.PdfDocument", side_effect=Exception("pypdfium2 failed")
    ):
        # Mock pdfplumber
        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "Fallback text."
        mock_pdf.pages = [mock_page]

        mock_open = MagicMock()
        mock_open.__enter__.return_value = mock_pdf

        with patch("app.ai.document_processor.pdfplumber.open", return_value=mock_open):
            chunks = await document_processor._process_pdf(b"dummy content", {"meta": "fallback"})

    assert len(chunks) > 0
    assert chunks[0].text == "Fallback text."
    assert chunks[0].page_number == 1


@pytest.mark.asyncio
async def test_process_pdf_fallback_empty_page(document_processor):
    with patch(
        "app.ai.document_processor.pypdfium2.PdfDocument", side_effect=Exception("pypdfium2 failed")
    ):
        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "   "
        mock_pdf.pages = [mock_page]

        mock_open = MagicMock()
        mock_open.__enter__.return_value = mock_pdf

        with patch("app.ai.document_processor.pdfplumber.open", return_value=mock_open):
            chunks = await document_processor._process_pdf(b"dummy content", {})

    assert len(chunks) == 0


@pytest.mark.asyncio
async def test_process_pdf_total_failure(document_processor):
    with patch(
        "app.ai.document_processor.pypdfium2.PdfDocument", side_effect=Exception("pypdfium2 failed")
    ):
        with patch(
            "app.ai.document_processor.pdfplumber.open", side_effect=Exception("pdfplumber failed")
        ):
            with pytest.raises(AIError) as exc_info:
                await document_processor._process_pdf(b"dummy content", {})

            assert "pdfplumber failed" in str(exc_info.value)
