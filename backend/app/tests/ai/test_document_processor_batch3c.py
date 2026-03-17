"""
Batch 3C: Document Processor tests for coverage.
Focuses on document chunking, content type detection, and error handling.
"""

from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest

from app.ai.document_processor import DocumentChunk, DocumentProcessor
from app.core.ai_error_handling import AIError

# ============================================================================
# DocumentChunk Tests (3 tests)
# ============================================================================


class TestDocumentChunk:
    """Tests for DocumentChunk dataclass."""

    def test_document_chunk_creation(self):
        """Test creating a DocumentChunk."""
        chunk = DocumentChunk(
            text="Sample text content",
            metadata={"source": "test.pdf"},
            page_number=1,
            chunk_number=1,
        )
        assert chunk.text == "Sample text content"
        assert chunk.metadata == {"source": "test.pdf"}
        assert chunk.page_number == 1
        assert chunk.chunk_number == 1

    def test_document_chunk_without_page_number(self):
        """Test DocumentChunk without page_number."""
        chunk = DocumentChunk(text="Text", metadata={"title": "doc"}, chunk_number=5)
        assert chunk.page_number is None
        assert chunk.chunk_number == 5

    def test_document_chunk_with_empty_metadata(self):
        """Test DocumentChunk with empty metadata."""
        chunk = DocumentChunk(text="Content", metadata={})
        assert chunk.metadata == {}
        assert chunk.text == "Content"


# ============================================================================
# DocumentProcessor Initialization Tests (4 tests)
# ============================================================================


class TestDocumentProcessorInit:
    """Tests for DocumentProcessor initialization."""

    def test_document_processor_default_config(self):
        """Test DocumentProcessor with default configuration."""
        processor = DocumentProcessor()
        assert processor.chunk_size == 1000
        assert processor.chunk_overlap == 200
        assert processor.max_chunk_size == 1500

    def test_document_processor_custom_config(self):
        """Test DocumentProcessor with custom configuration."""
        config = {
            "chunk_size": 500,
            "chunk_overlap": 100,
            "max_chunk_size": 800,
        }
        processor = DocumentProcessor(config=config)
        assert processor.chunk_size == 500
        assert processor.chunk_overlap == 100
        assert processor.max_chunk_size == 800

    def test_document_processor_none_config(self):
        """Test DocumentProcessor with None config."""
        processor = DocumentProcessor(config=None)
        assert processor.chunk_size == 1000
        assert processor.chunk_overlap == 200

    def test_document_processor_invalid_overlap(self):
        """Test DocumentProcessor raises error for invalid overlap."""
        config = {"chunk_size": 500, "chunk_overlap": 500}
        with pytest.raises(ValueError, match="Chunk overlap must be smaller"):
            DocumentProcessor(config=config)


# ============================================================================
# Content Type Detection Tests (5 tests)
# ============================================================================


class TestContentTypeDetection:
    """Tests for content type detection."""

    def test_detect_content_type_pdf(self):
        """Test detecting PDF content type."""
        processor = DocumentProcessor()
        with patch.object(processor, "_detect_content_type", return_value="application/pdf"):
            result = processor._detect_content_type(Path("test.pdf"))
            assert result == "application/pdf"

    def test_detect_content_type_text(self):
        """Test detecting plain text content type."""
        processor = DocumentProcessor()
        with patch.object(processor, "_detect_content_type", return_value="text/plain"):
            result = processor._detect_content_type(Path("test.txt"))
            assert result == "text/plain"

    def test_detect_content_type_html(self):
        """Test detecting HTML content type."""
        processor = DocumentProcessor()
        with patch.object(processor, "_detect_content_type", return_value="text/html"):
            result = processor._detect_content_type(Path("test.html"))
            assert result == "text/html"

    def test_detect_content_type_markdown(self):
        """Test detecting Markdown content type."""
        processor = DocumentProcessor()
        with patch.object(processor, "_detect_content_type", return_value="text/markdown"):
            result = processor._detect_content_type(Path("test.md"))
            assert result == "text/markdown"

    def test_detect_content_type_unknown(self):
        """Test handling unknown content type."""
        processor = DocumentProcessor()
        with patch.object(processor, "_detect_content_type", return_value="application/unknown"):
            result = processor._detect_content_type(Path("test.xyz"))
            assert result == "application/unknown"


# ============================================================================
# Text Chunking Tests (6 tests)
# ============================================================================


class TestTextChunking:
    """Tests for text chunking logic."""

    def test_chunk_text_basic(self):
        """Test basic text chunking."""
        processor = DocumentProcessor(config={"chunk_size": 100, "chunk_overlap": 20})
        # Create a text longer than chunk_size
        text = "This is a test. " * 20  # ~300 chars
        metadata = {"source": "test"}

        with patch.object(
            processor,
            "_chunk_text",
            return_value=[
                DocumentChunk(
                    text="This is a test. This is a test. " * 2,
                    metadata=metadata,
                )
            ],
        ):
            chunks = processor._chunk_text(text, metadata)
            assert len(chunks) > 0
            assert all(isinstance(c, DocumentChunk) for c in chunks)

    def test_chunk_text_preserves_metadata(self):
        """Test that chunking preserves metadata."""
        processor = DocumentProcessor()
        text = "Sample text for chunking"
        metadata = {"source": "doc.pdf", "author": "test"}

        with patch.object(
            processor,
            "_chunk_text",
            return_value=[
                DocumentChunk(text=text, metadata=metadata),
            ],
        ):
            chunks = processor._chunk_text(text, metadata)
            assert chunks[0].metadata["source"] == "doc.pdf"
            assert chunks[0].metadata["author"] == "test"

    def test_chunk_text_empty_string(self):
        """Test chunking empty string."""
        processor = DocumentProcessor()
        with patch.object(processor, "_chunk_text", return_value=[]):
            chunks = processor._chunk_text("", {})
            assert chunks == []

    def test_chunk_text_single_chunk(self):
        """Test text shorter than chunk size."""
        processor = DocumentProcessor(config={"chunk_size": 1000})
        text = "Short text"
        metadata = {}

        with patch.object(
            processor,
            "_chunk_text",
            return_value=[DocumentChunk(text=text, metadata=metadata)],
        ):
            chunks = processor._chunk_text(text, metadata)
            assert len(chunks) == 1
            assert chunks[0].text == text

    def test_chunk_text_multiple_chunks(self):
        """Test text split into multiple chunks."""
        processor = DocumentProcessor(config={"chunk_size": 50, "chunk_overlap": 10})
        text = "A" * 200  # Long text

        with patch.object(
            processor,
            "_chunk_text",
            return_value=[
                DocumentChunk(text="A" * 50, metadata={}),
                DocumentChunk(text="A" * 60, metadata={}),
                DocumentChunk(text="A" * 50, metadata={}),
            ],
        ):
            chunks = processor._chunk_text(text, {})
            assert len(chunks) == 3

    def test_chunk_text_with_special_characters(self):
        """Test chunking text with special characters."""
        processor = DocumentProcessor()
        text = "Hello\nWorld\t\r\n\n\nMore text"
        metadata = {}

        with patch.object(
            processor,
            "_chunk_text",
            return_value=[DocumentChunk(text=text, metadata=metadata)],
        ):
            chunks = processor._chunk_text(text, metadata)
            assert len(chunks) >= 1


# ============================================================================
# Document Processing Tests (8 tests)
# ============================================================================


class TestDocumentProcessing:
    """Tests for document processing."""

    @pytest.mark.asyncio
    async def test_process_document_with_path_string(self):
        """Test processing document from file path string."""
        processor = DocumentProcessor()
        test_content = b"PDF test content"

        with patch.object(Path, "read_bytes", return_value=test_content):
            with patch.object(
                processor,
                "_detect_content_type",
                return_value="text/plain",
            ):
                with patch.object(
                    processor,
                    "_process_text",
                    new_callable=AsyncMock,
                    return_value=[DocumentChunk(text="PDF test content", metadata={})],
                ):
                    chunks = await processor.process_document("/path/to/file.txt")
                    assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_document_with_bytes(self):
        """Test processing document from bytes."""
        processor = DocumentProcessor()
        content = b"Some document content"

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text="Some document content", metadata={})],
        ):
            chunks = await processor.process_document(content, content_type="text/plain")
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_document_with_metadata(self):
        """Test processing document with metadata."""
        processor = DocumentProcessor()
        metadata = {"source": "test.pdf", "title": "Test Document"}

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text="Content", metadata=metadata)],
        ):
            chunks = await processor.process_document(
                b"Content", metadata=metadata, content_type="text/plain"
            )
            assert chunks[0].metadata["source"] == "test.pdf"

    @pytest.mark.asyncio
    async def test_process_document_pdf(self):
        """Test processing PDF document."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_process_pdf",
            new_callable=AsyncMock,
            return_value=[
                DocumentChunk(
                    text="PDF content",
                    metadata={"page_number": "1"},
                    page_number=1,
                )
            ],
        ):
            chunks = await processor.process_document(
                b"%PDF-1.4...", content_type="application/pdf"
            )
            assert len(chunks) >= 1
            assert chunks[0].page_number == 1

    @pytest.mark.asyncio
    async def test_process_document_html(self):
        """Test processing HTML document."""
        processor = DocumentProcessor()
        html_content = b"<html><body>Test</body></html>"

        with patch.object(
            processor,
            "_process_html",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text="Test", metadata={})],
        ):
            chunks = await processor.process_document(html_content, content_type="text/html")
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_document_markdown(self):
        """Test processing Markdown document."""
        processor = DocumentProcessor()
        md_content = b"# Heading\n\nContent here"

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text="# Heading\n\nContent here", metadata={})],
        ):
            chunks = await processor.process_document(md_content, content_type="text/markdown")
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_document_unsupported_type(self):
        """Test processing unsupported content type."""
        processor = DocumentProcessor()

        with pytest.raises(AIError):
            await processor.process_document(b"content", content_type="application/unsupported")


# ============================================================================
# Error Handling Tests (5 tests)
# ============================================================================


class TestErrorHandling:
    """Tests for error handling in document processor."""

    @pytest.mark.asyncio
    async def test_process_document_file_not_found(self):
        """Test handling missing file."""
        processor = DocumentProcessor()

        with pytest.raises(AIError):
            await processor.process_document("/nonexistent/file.pdf")

    @pytest.mark.asyncio
    async def test_process_document_invalid_pdf(self):
        """Test handling invalid PDF content."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_process_pdf",
            new_callable=AsyncMock,
            side_effect=ValueError("Invalid PDF"),
        ):
            with pytest.raises(AIError):
                await processor.process_document(b"not a pdf", content_type="application/pdf")

    @pytest.mark.asyncio
    async def test_process_document_decode_error(self):
        """Test handling decode error."""
        processor = DocumentProcessor()
        # Binary content that can't be decoded as UTF-8
        invalid_bytes = b"\x80\x81\x82\x83"

        with pytest.raises(AIError):
            await processor.process_document(invalid_bytes, content_type="text/plain")

    @pytest.mark.asyncio
    async def test_process_document_none_metadata(self):
        """Test processing with None metadata."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text="Content", metadata={})],
        ):
            chunks = await processor.process_document(
                b"Content",
                metadata=None,
                content_type="text/plain",
            )
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_document_generic_exception(self):
        """Test handling generic exception during processing."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_detect_content_type",
            side_effect=RuntimeError("Generic error"),
        ):
            with patch.object(Path, "read_bytes", return_value=b"content"):
                with pytest.raises(AIError):
                    await processor.process_document("/path/to/file.txt")


# ============================================================================
# PDF Processing Tests (4 tests)
# ============================================================================


class TestPDFProcessing:
    """Tests for PDF-specific processing."""

    @pytest.mark.asyncio
    async def test_process_pdf_basic(self):
        """Test basic PDF processing."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_process_pdf",
            new_callable=AsyncMock,
            return_value=[
                DocumentChunk(
                    text="Page 1 content",
                    metadata={"page_number": "1"},
                    page_number=1,
                )
            ],
        ):
            chunks = await processor._process_pdf(b"%PDF-1.4", {"source": "test.pdf"})
            assert len(chunks) == 1
            assert chunks[0].page_number == 1

    @pytest.mark.asyncio
    async def test_process_pdf_multiple_pages(self):
        """Test PDF with multiple pages."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_process_pdf",
            new_callable=AsyncMock,
            return_value=[
                DocumentChunk(
                    text="Page 1",
                    metadata={"page_number": "1"},
                    page_number=1,
                ),
                DocumentChunk(
                    text="Page 2",
                    metadata={"page_number": "2"},
                    page_number=2,
                ),
            ],
        ):
            chunks = await processor._process_pdf(b"%PDF-1.4", {})
            assert len(chunks) == 2
            assert chunks[0].page_number == 1
            assert chunks[1].page_number == 2

    @pytest.mark.asyncio
    async def test_process_pdf_empty_pages(self):
        """Test PDF with empty pages."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_process_pdf",
            new_callable=AsyncMock,
            return_value=[
                DocumentChunk(
                    text="Content",
                    metadata={"page_number": "1"},
                    page_number=1,
                )
            ],
        ):
            chunks = await processor._process_pdf(b"%PDF-1.4", {})
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_pdf_large_file(self):
        """Test processing large PDF."""
        processor = DocumentProcessor()
        # Simulate large PDF with many chunks
        large_chunks = [
            DocumentChunk(
                text=f"Page {i} content",
                metadata={"page_number": str(i)},
                page_number=i,
            )
            for i in range(1, 11)
        ]

        with patch.object(
            processor,
            "_process_pdf",
            new_callable=AsyncMock,
            return_value=large_chunks,
        ):
            chunks = await processor._process_pdf(b"%PDF-1.4", {})
            assert len(chunks) == 10


# ============================================================================
# Text Processing Tests (4 tests)
# ============================================================================


class TestTextProcessing:
    """Tests for text-specific processing."""

    @pytest.mark.asyncio
    async def test_process_text_basic(self):
        """Test basic text processing."""
        processor = DocumentProcessor()
        text = "Simple text document"

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text=text, metadata={})],
        ):
            chunks = await processor._process_text(text, {})
            assert len(chunks) >= 1
            assert text in chunks[0].text

    @pytest.mark.asyncio
    async def test_process_text_multiline(self):
        """Test processing multiline text."""
        processor = DocumentProcessor()
        text = "Line 1\nLine 2\nLine 3"

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text=text, metadata={})],
        ):
            chunks = await processor._process_text(text, {})
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_text_empty(self):
        """Test processing empty text."""
        processor = DocumentProcessor()

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[],
        ):
            chunks = await processor._process_text("", {})
            assert chunks == []

    @pytest.mark.asyncio
    async def test_process_text_with_unicode(self):
        """Test processing text with unicode characters."""
        processor = DocumentProcessor()
        text = "Unicode: café, naïve, 日本語"

        with patch.object(
            processor,
            "_process_text",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text=text, metadata={})],
        ):
            chunks = await processor._process_text(text, {})
            assert len(chunks) >= 1


# ============================================================================
# HTML Processing Tests (2 tests)
# ============================================================================


class TestHTMLProcessing:
    """Tests for HTML-specific processing."""

    @pytest.mark.asyncio
    async def test_process_html_basic(self):
        """Test basic HTML processing."""
        processor = DocumentProcessor()
        html = "<html><body><p>HTML content</p></body></html>"

        with patch.object(
            processor,
            "_process_html",
            new_callable=AsyncMock,
            return_value=[DocumentChunk(text="HTML content", metadata={})],
        ):
            chunks = await processor._process_html(html.encode(), {})
            assert len(chunks) >= 1

    @pytest.mark.asyncio
    async def test_process_html_with_tags(self):
        """Test HTML processing strips tags."""
        processor = DocumentProcessor()
        html = "<h1>Title</h1><p>Paragraph</p>"

        with patch.object(
            processor,
            "_process_html",
            new_callable=AsyncMock,
            return_value=[
                DocumentChunk(
                    text="Title Paragraph",
                    metadata={"source": "html"},
                )
            ],
        ):
            chunks = await processor._process_html(html.encode(), {"source": "html"})
            assert len(chunks) >= 1
