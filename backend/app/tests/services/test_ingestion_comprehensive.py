"""
Comprehensive tests for the ingestion service.
"""

from unittest.mock import MagicMock, patch

import pytest

from app.services.ingestion import IngestionService
from app.services.vector_store import VectorStore


# Mocking dependencies
@pytest.fixture
def mock_vector_store():
    return MagicMock(spec=VectorStore)


@pytest.fixture
def ingestion_service(mock_vector_store):
    service = IngestionService()
    service.vector_store = mock_vector_store
    return service


class TestPdfParsing:
    def test_parse_pdf_success(self, ingestion_service):
        pdf_content = b"This is a PDF file."
        content = (
            "PDF text content that is long enough to pass the 50 character limit check easily."
        )
        with patch("app.services.ingestion.extract_text", return_value=content):
            text = ingestion_service._parse_pdf(pdf_content)
            assert text == content

    def test_parse_pdf_no_pdfminer(self, ingestion_service):
        with patch("app.services.ingestion.extract_text", None):
            with pytest.raises(RuntimeError, match="pdfminer.six not installed"):
                ingestion_service._parse_pdf(b"some pdf content")


class TestDocxParsing:
    def test_parse_docx_success(self, ingestion_service):
        docx_content = b"This is a DOCX file."
        mock_doc = MagicMock()
        content = (
            "Paragraph content that is long enough to pass the 50 character limit check easily."
        )
        mock_doc.paragraphs = [MagicMock(text=content)]
        with patch("app.services.ingestion.docx.Document", return_value=mock_doc):
            text = ingestion_service._parse_docx(docx_content)
            assert text == content

    def test_parse_docx_no_python_docx(self, ingestion_service):
        with patch("app.services.ingestion.docx", None):
            with pytest.raises(RuntimeError, match="python-docx not installed"):
                ingestion_service._parse_docx(b"some docx content")


class TestTxtParsing:
    def test_parse_txt_success(self, ingestion_service):
        txt_content = (
            b"This is a TXT file content that is long enough to pass the 50 character limit check."
        )
        with patch.object(ingestion_service.vector_store, "add_artifact") as mock_add:
            ingestion_service.process_file(txt_content, "resume.txt", "resume", user_id="test_user")
            mock_add.assert_called()


class TestSemanticChunking:
    def test_semantic_chunking_basic(self, ingestion_service):
        text = (
            "This is the first sentence.\nThis is the second sentence.\nThis is the third sentence."
        )
        chunks = ingestion_service._semantic_chunking(text)
        assert len(chunks) == 1
        assert "This is the first sentence." in chunks[0]

    def test_semantic_chunking_long_paragraph(self, ingestion_service):
        long_text = "This is a very long sentence. " * 100
        chunks = ingestion_service._semantic_chunking(long_text, max_chunk_size=200)
        assert len(chunks) > 1


class TestProcessFile:
    def test_process_file_pdf_success(self, ingestion_service, mock_vector_store):
        pdf_content = b"This is a PDF file."
        content = (
            "PDF text content that is long enough to pass the 50 character limit check easily."
        )
        with patch("app.services.ingestion.extract_text", return_value=content):
            ingestion_service.process_file(pdf_content, "resume.pdf", "resume", user_id="test_user")
            mock_vector_store.add_artifact.assert_called()

    def test_process_file_docx_success(self, ingestion_service, mock_vector_store):
        docx_content = b"This is a DOCX file."
        mock_doc = MagicMock()
        content = (
            "Paragraph content that is long enough to pass the 50 character limit check easily."
        )
        mock_doc.paragraphs = [MagicMock(text=content)]
        with patch("app.services.ingestion.docx.Document", return_value=mock_doc):
            ingestion_service.process_file(
                docx_content, "resume.docx", "resume", user_id="test_user"
            )
            mock_vector_store.add_artifact.assert_called()

    def test_process_file_txt_success(self, ingestion_service, mock_vector_store):
        txt_content = (
            b"This is a TXT file content that is long enough to pass the 50 character limit check."
        )
        ingestion_service.process_file(txt_content, "resume.txt", "resume", user_id="test_user")
        mock_vector_store.add_artifact.assert_called()

    def test_process_file_unsupported_type(self, ingestion_service):
        with pytest.raises(ValueError, match="Unsupported file type:"):
            ingestion_service.process_file(b"some content", "resume.xyz", "resume")

    def test_process_file_empty_text(self, ingestion_service):
        with patch("app.services.ingestion.extract_text", return_value=""):
            with pytest.raises(ValueError, match="Extracted text is empty."):
                ingestion_service.process_file(b"some pdf content", "resume.pdf", "resume")
