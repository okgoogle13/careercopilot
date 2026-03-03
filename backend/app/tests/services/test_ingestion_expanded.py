"""Expanded unit tests for the ingestion service."""

from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

import app.services.ingestion as ingestion_module
from app.services.ingestion import IngestionService


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


@pytest.fixture
def mock_vector_store(monkeypatch):
    """Provide a mocked vector store instance."""
    store = MagicMock()
    monkeypatch.setattr(ingestion_module, "VectorStore", MagicMock(return_value=store))
    return store


@pytest.fixture
def ingestion_service(mock_vector_store):
    """Create the service with a mocked vector store."""
    return IngestionService()


def test_ingestion_service_initializes_vector_store(ingestion_service, mock_vector_store):
    """The service should construct and retain a vector store instance."""
    assert ingestion_service.vector_store is mock_vector_store


def test_process_file_uses_txt_content_and_skips_short_chunks(ingestion_service, mock_vector_store):
    """TXT uploads should be chunked and tiny chunks should not be ingested."""
    long_chunk = "A" * 80
    short_chunk = "short"
    ingestion_service._semantic_chunking = MagicMock(return_value=[long_chunk, short_chunk])

    ingestion_service.process_file(b"ignored", "resume.txt", "resume", user_id="user-1")

    added_artifact = mock_vector_store.add_artifact.call_args.args[0]
    assert added_artifact.content == long_chunk
    assert added_artifact.source_type == "resume"
    assert added_artifact.source_filename == "resume.txt"
    mock_vector_store.add_artifact.assert_called_once_with(added_artifact, user_id="user-1")


def test_process_file_routes_pdf_and_docx_to_parsers(ingestion_service):
    """PDF and DOCX inputs should call the appropriate parser."""
    ingestion_service._parse_pdf = MagicMock(return_value="A" * 80)
    ingestion_service._parse_docx = MagicMock(return_value="B" * 80)
    ingestion_service._semantic_chunking = MagicMock(return_value=["A" * 80])

    ingestion_service.process_file(b"%PDF", "resume.pdf", "resume")
    ingestion_service._parse_pdf.assert_called_once_with(b"%PDF")

    ingestion_service._semantic_chunking.return_value = ["B" * 80]
    ingestion_service.process_file(b"DOCX", "cover.docx", "cover_letter")
    ingestion_service._parse_docx.assert_called_once_with(b"DOCX")


def test_process_file_rejects_unsupported_extensions(ingestion_service):
    """Unsupported file types should be rejected immediately."""
    with pytest.raises(ValueError, match="Unsupported file type: png"):
        ingestion_service.process_file(b"bytes", "image.png", "resume")


def test_process_file_rejects_empty_extracted_text(ingestion_service):
    """Empty parser output should fail before ingestion."""
    ingestion_service._parse_pdf = MagicMock(return_value="")

    with pytest.raises(ValueError, match="Extracted text is empty."):
        ingestion_service.process_file(b"%PDF", "resume.pdf", "resume")


def test_parse_pdf_requires_pdfminer(monkeypatch, ingestion_service):
    """The PDF parser should fail clearly when pdfminer is unavailable."""
    monkeypatch.setattr(ingestion_module, "extract_text", None)

    with pytest.raises(RuntimeError, match="pdfminer.six not installed"):
        ingestion_service._parse_pdf(b"%PDF")


def test_parse_pdf_uses_pdfminer(monkeypatch, ingestion_service):
    """The PDF parser should delegate to pdfminer.extract_text."""
    extractor = MagicMock(return_value="Parsed PDF text")
    monkeypatch.setattr(ingestion_module, "extract_text", extractor)

    assert ingestion_service._parse_pdf(b"%PDF") == "Parsed PDF text"
    extractor.assert_called_once()


def test_parse_docx_requires_python_docx(monkeypatch, ingestion_service):
    """The DOCX parser should fail clearly when python-docx is unavailable."""
    monkeypatch.setattr(ingestion_module, "docx", None)

    with pytest.raises(RuntimeError, match="python-docx not installed"):
        ingestion_service._parse_docx(b"docx")


def test_parse_docx_reads_paragraph_text(monkeypatch, ingestion_service):
    """The DOCX parser should join paragraph text with newlines."""
    fake_docx = SimpleNamespace(
        Document=MagicMock(
            return_value=SimpleNamespace(
                paragraphs=[SimpleNamespace(text="Line 1"), SimpleNamespace(text="Line 2")]
            )
        )
    )
    monkeypatch.setattr(ingestion_module, "docx", fake_docx)

    assert ingestion_service._parse_docx(b"docx") == "Line 1\nLine 2"


def test_semantic_chunking_groups_paragraphs_until_limit(ingestion_service):
    """Chunking should respect paragraph boundaries and max size."""
    text = "Alpha\nBeta\n\nGamma is longer\nDelta"

    chunks = ingestion_service._semantic_chunking(text, max_chunk_size=10)

    assert chunks == ["Alpha\nBeta", "Gamma is longer", "Delta"]
