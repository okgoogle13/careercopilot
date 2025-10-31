"""
Document Processing Service

This module handles document processing for RAG, including:
- PDF extraction
- Text chunking
- Metadata extraction
- Content normalization
"""

import io
import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import pdfplumber
import pypdfium2
from bs4 import BeautifulSoup

from app.ai.base_service import BaseAIService
from app.core.ai_error_handling import AIError, AIErrorType

logger = logging.getLogger(__name__)


@dataclass
class DocumentChunk:
    """A chunk of document text with metadata."""

    text: str
    metadata: Dict[str, str]
    page_number: Optional[int] = None
    chunk_number: Optional[int] = None


class DocumentProcessor(BaseAIService):
    """Service for processing documents for RAG.

    Handles:
    - PDF text extraction
    - Document chunking
    - Metadata extraction
    - Content cleaning and normalization
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the document processor.

        Args:
            config: Configuration dictionary with optional keys:
                - chunk_size: Target size for text chunks (default: 1000)
                - chunk_overlap: Overlap between chunks (default: 200)
                - max_chunk_size: Maximum allowed chunk size (default: 1500)
        """
        super().__init__(config or {})
        self.chunk_size = self.config.get("chunk_size", 1000)
        self.chunk_overlap = self.config.get("chunk_overlap", 200)
        self.max_chunk_size = self.config.get("max_chunk_size", 1500)

        if self.chunk_overlap >= self.chunk_size:
            raise ValueError("Chunk overlap must be smaller than chunk size")

    async def process_document(
        self,
        file_path: Union[str, Path, bytes],
        metadata: Optional[Dict[str, str]] = None,
        content_type: Optional[str] = None,
    ) -> List[DocumentChunk]:
        """Process a document into chunks with metadata.

        Args:
            file_path: Path to the document or bytes content
            metadata: Additional metadata to include with each chunk
            content_type: MIME type of the document (optional)

        Returns:
            List of document chunks with metadata
        """
        if not metadata:
            metadata = {}

        try:
            # Handle different input types
            if isinstance(file_path, (str, Path)):
                file_path = Path(file_path)
                content = file_path.read_bytes()
                if not content_type:
                    content_type = self._detect_content_type(file_path)
            else:
                content = file_path

            # Process based on content type
            if content_type == "application/pdf":
                return await self._process_pdf(content, metadata)
            elif content_type in ["text/plain", "text/markdown"]:
                text = content.decode("utf-8")
                return await self._process_text(text, metadata)
            elif content_type == "text/html":
                return await self._process_html(content, metadata)
            else:
                raise ValueError(f"Unsupported content type: {content_type}")

        except Exception as e:
            logger.error(f"Error processing document: {str(e)}")
            raise AIError(
                f"Failed to process document: {str(e)}",
                error_type=AIErrorType.DOCUMENT_PROCESSING_ERROR,
            )

    async def _process_pdf(self, content: bytes, metadata: Dict[str, str]) -> List[DocumentChunk]:
        """Process a PDF document into chunks."""
        chunks = []

        try:
            # First try with pypdfium2 for better text extraction
            try:
                pdf = pypdfium2.PdfDocument(content)
                for page_num in range(len(pdf)):
                    page = pdf[page_num]
                    text = page.get_text()
                    if not text.strip():
                        continue

                    page_metadata = metadata.copy()
                    page_metadata["page_number"] = str(page_num + 1)

                    # Chunk the page text
                    page_chunks = self._chunk_text(text, page_metadata)
                    for i, chunk in enumerate(page_chunks):
                        chunk.metadata["chunk_number"] = i + 1
                        chunk.page_number = page_num + 1
                        chunks.append(chunk)

                return chunks

            except Exception as e:
                logger.warning(
                    f"pypdfium2 extraction failed, falling back to pdfplumber: {e} "
                    "- Some formatting may be lost"
                )

                # Fall back to pdfplumber
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    for i, page in enumerate(pdf.pages):
                        text = page.extract_text()
                        if not text.strip():
                            continue

                        page_metadata = metadata.copy()
                        page_metadata["page_number"] = str(i + 1)

                        # Chunk the page text
                        page_chunks = self._chunk_text(text, page_metadata)
                        for j, chunk in enumerate(page_chunks):
                            chunk.metadata["chunk_number"] = j + 1
                            chunk.page_number = i + 1
                            chunks.append(chunk)

                return chunks

        except Exception as e:
            logger.error(f"PDF processing failed: {str(e)}")
            raise AIError(
                f"Failed to process PDF: {str(e)}",
                error_type=AIErrorType.DOCUMENT_PROCESSING_ERROR,
            )

    async def _process_text(self, text: str, metadata: Dict[str, str]) -> List[DocumentChunk]:
        """Process plain text into chunks."""
        chunks = []
        text_chunks = self._chunk_text(text, metadata)

        for i, chunk in enumerate(text_chunks):
            chunk.metadata["chunk_number"] = i + 1
            chunks.append(chunk)

        return chunks

    async def _process_html(self, content: bytes, metadata: Dict[str, str]) -> List[DocumentChunk]:
        """Process HTML content into chunks."""
        try:
            soup = BeautifulSoup(content, "html.parser")

            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()

            # Get text with proper spacing
            text = soup.get_text(separator="\n", strip=True)

            # Clean up whitespace
            text = re.sub(r"\s+", " ", text).strip()

            return await self._process_text(text, metadata)

        except Exception as e:
            logger.error(f"HTML processing failed: {str(e)}")
            raise AIError(
                f"Failed to process HTML: {str(e)}",
                error_type=AIErrorType.DOCUMENT_PROCESSING_ERROR,
            )

    def _chunk_text(self, text: str, metadata: Dict[str, str]) -> List[DocumentChunk]:
        """Split text into chunks with overlap."""
        if not text.strip():
            return []

        # Normalize whitespace
        text = " ".join(text.split())

        chunks = []
        start = 0
        chunk_num = 1

        while start < len(text):
            # Find the end of the chunk
            end = start + self.chunk_size

            # Don't go past the end of the text
            if end >= len(text):
                end = len(text)
            else:
                # Try to split at a sentence boundary
                sentence_end = text.rfind(". ", start, end)
                if sentence_end > start + (self.chunk_size // 2):
                    end = sentence_end + 1  # Include the period

            # Extract the chunk
            chunk_text = text[start:end].strip()
            if not chunk_text:
                break

            # Create chunk with metadata
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_number"] = str(chunk_num)

            chunks.append(
                DocumentChunk(text=chunk_text, metadata=chunk_metadata, chunk_number=chunk_num)
            )

            # Move to the next chunk with overlap
            start = end - self.chunk_overlap
            if start <= 0:
                start = end

            chunk_num += 1

        return chunks

    def _detect_content_type(self, file_path: Path) -> str:
        """Detect the content type based on file extension."""
        ext = file_path.suffix.lower()

        if ext == ".pdf":
            return "application/pdf"
        elif ext in [".txt", ".md", ".markdown"]:
            return "text/plain"
        elif ext in [".html", ".htm"]:
            return "text/html"
        else:
            # Default to text for unknown types
            return "text/plain"
