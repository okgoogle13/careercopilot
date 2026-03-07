"""
Comprehensive tests for document_extractor.py service.
Target coverage: 57% → 85% (20-25 tests)
"""

from io import BytesIO
from unittest.mock import MagicMock, Mock, call, patch

import pytest

from app.services.document_extractor import (
    DOCX_AVAILABLE,
    PDFMINER_AVAILABLE,
    PYPDF_AVAILABLE,
    detect_document_links,
    download_document,
    extract_documents_from_page,
    extract_text_from_docx,
    extract_text_from_pdf,
)

# ==================== PDF EXTRACTION TESTS ====================


@pytest.mark.skipif(not PYPDF_AVAILABLE, reason="pypdf not installed")
def test_extract_text_from_pdf_success_pypdf():
    """Test successful PDF text extraction using pypdf."""
    mock_pdf_content = b"%PDF-1.4 fake content"

    with patch("app.services.document_extractor.PdfReader") as mock_reader:
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "Extracted text from page 1\n"
        mock_reader.return_value.pages = [mock_page]

        result = extract_text_from_pdf(mock_pdf_content)

        assert "Extracted text from page 1" in result
        assert mock_reader.called


@pytest.mark.skipif(not PYPDF_AVAILABLE, reason="pypdf not installed")
def test_extract_text_from_pdf_multiple_pages():
    """Test PDF extraction with multiple pages."""
    mock_pdf_content = b"%PDF-1.4"

    with patch("app.services.document_extractor.PdfReader") as mock_reader:
        page1 = MagicMock()
        page1.extract_text.return_value = "Page 1 content\n"
        page2 = MagicMock()
        page2.extract_text.return_value = "Page 2 content\n"
        mock_reader.return_value.pages = [page1, page2]

        result = extract_text_from_pdf(mock_pdf_content)

        assert "Page 1 content" in result
        assert "Page 2 content" in result


@pytest.mark.skipif(not PYPDF_AVAILABLE or not PDFMINER_AVAILABLE, reason="Libraries not installed")
def test_extract_text_from_pdf_fallback_to_pdfminer():
    """Test fallback from pypdf to pdfminer on extraction failure."""
    mock_pdf_content = b"%PDF-1.4"

    with patch("app.services.document_extractor.PdfReader") as mock_pypdf:
        with patch("app.services.document_extractor.pdfminer_extract") as mock_pdfminer:
            # Pypdf fails with empty text
            mock_page = MagicMock()
            mock_page.extract_text.return_value = ""
            mock_pypdf.return_value.pages = [mock_page]

            # Pdfminer succeeds
            mock_pdfminer.return_value = "Extracted via pdfminer"

            result = extract_text_from_pdf(mock_pdf_content)

            assert result == "Extracted via pdfminer"
            assert mock_pdfminer.called


@pytest.mark.skipif(not PYPDF_AVAILABLE, reason="pypdf not installed")
def test_extract_text_from_pdf_pypdf_exception_fallback():
    """Test pypdf exception triggers pdfminer fallback."""
    mock_pdf_content = b"%PDF-1.4"

    with patch("app.services.document_extractor.PdfReader", side_effect=Exception("pypdf failed")):
        with patch("app.services.document_extractor.pdfminer_extract") as mock_pdfminer:
            mock_pdfminer.return_value = "Fallback text"

            result = extract_text_from_pdf(mock_pdf_content)

            assert result == "Fallback text"


def test_extract_text_from_pdf_all_methods_fail():
    """Test RuntimeError when both pypdf and pdfminer fail."""
    mock_pdf_content = b"%PDF-1.4"

    with patch("app.services.document_extractor.PYPDF_AVAILABLE", False):
        with patch("app.services.document_extractor.PDFMINER_AVAILABLE", False):
            with pytest.raises(RuntimeError, match="PDF extraction failed"):
                extract_text_from_pdf(mock_pdf_content)


@pytest.mark.skipif(not PDFMINER_AVAILABLE, reason="pdfminer not installed")
def test_extract_text_from_pdf_pdfminer_only():
    """Test PDF extraction when only pdfminer is available."""
    mock_pdf_content = b"%PDF-1.4"

    with patch("app.services.document_extractor.PYPDF_AVAILABLE", False):
        with patch("app.services.document_extractor.pdfminer_extract") as mock_pdfminer:
            mock_pdfminer.return_value = "Pdfminer only extraction"

            result = extract_text_from_pdf(mock_pdf_content)

            assert result == "Pdfminer only extraction"


# ==================== DOCX EXTRACTION TESTS ====================


@pytest.mark.skipif(not DOCX_AVAILABLE, reason="python-docx not installed")
def test_extract_text_from_docx_success():
    """Test successful Word document text extraction."""
    mock_docx_content = b"PK fake docx"

    with patch("app.services.document_extractor.Document") as mock_doc:
        mock_para1 = MagicMock()
        mock_para1.text = "Paragraph 1"
        mock_para2 = MagicMock()
        mock_para2.text = "Paragraph 2"

        mock_doc.return_value.paragraphs = [mock_para1, mock_para2]
        mock_doc.return_value.tables = []

        result = extract_text_from_docx(mock_docx_content)

        assert "Paragraph 1" in result
        assert "Paragraph 2" in result


@pytest.mark.skipif(not DOCX_AVAILABLE, reason="python-docx not installed")
def test_extract_text_from_docx_with_tables():
    """Test DOCX extraction including table data."""
    mock_docx_content = b"PK fake docx"

    with patch("app.services.document_extractor.Document") as mock_doc:
        mock_para = MagicMock()
        mock_para.text = "Main text"

        # Create mock table
        mock_cell = MagicMock()
        mock_cell.text = "Cell data"
        mock_row = MagicMock()
        mock_row.cells = [mock_cell]
        mock_table = MagicMock()
        mock_table.rows = [mock_row]

        mock_doc.return_value.paragraphs = [mock_para]
        mock_doc.return_value.tables = [mock_table]

        result = extract_text_from_docx(mock_docx_content)

        assert "Main text" in result
        assert "Cell data" in result


def test_extract_text_from_docx_library_not_available():
    """Test RuntimeError when python-docx is not installed."""
    mock_docx_content = b"PK fake docx"

    with patch("app.services.document_extractor.DOCX_AVAILABLE", False):
        with pytest.raises(RuntimeError, match="python-docx not installed"):
            extract_text_from_docx(mock_docx_content)


@pytest.mark.skipif(not DOCX_AVAILABLE, reason="python-docx not installed")
def test_extract_text_from_docx_extraction_exception():
    """Test RuntimeError on DOCX extraction failure."""
    mock_docx_content = b"corrupted docx"

    with patch("app.services.document_extractor.Document", side_effect=Exception("Corrupted file")):
        with pytest.raises(RuntimeError, match="Failed to extract Word document"):
            extract_text_from_docx(mock_docx_content)


# ==================== DOCUMENT LINK DETECTION TESTS ====================


def test_detect_document_links_pdf():
    """Test detection of PDF links in HTML."""
    html = """
    <a href="/files/document.pdf">Download PDF</a>
    <a href="https://example.com/report.PDF">External PDF</a>
    """
    base_url = "https://example.com"

    result = detect_document_links(html, base_url)

    assert len(result) == 2
    assert any(url.endswith(".pdf") or url.endswith(".PDF") for url, _ in result)
    assert all(doc_type == "pdf" for _, doc_type in result)


def test_detect_document_links_docx():
    """Test detection of Word document links."""
    html = """
    <a href="/files/resume.docx">Download DOCX</a>
    <a href="report.doc">Legacy DOC</a>
    """
    base_url = "https://example.com"

    result = detect_document_links(html, base_url)

    assert len(result) == 2
    assert all(doc_type == "docx" for _, doc_type in result)


def test_detect_document_links_mixed_formats():
    """Test detection of both PDF and DOCX links."""
    html = """
    <a href="file1.pdf">PDF</a>
    <a href="file2.docx">DOCX</a>
    <a href="file3.doc">DOC</a>
    """
    base_url = "https://example.com"

    result = detect_document_links(html, base_url)

    assert len(result) == 3
    doc_types = [doc_type for _, doc_type in result]
    assert "pdf" in doc_types
    assert "docx" in doc_types


def test_detect_document_links_relative_urls():
    """Test conversion of relative URLs to absolute."""
    html = '<a href="../docs/file.pdf">PDF</a>'
    base_url = "https://example.com/jobs/listing"

    result = detect_document_links(html, base_url)

    assert len(result) == 1
    url, doc_type = result[0]
    assert url.startswith("https://")
    assert "example.com" in url


def test_detect_document_links_no_documents():
    """Test no document links found."""
    html = """
    <a href="/page.html">HTML page</a>
    <a href="/image.png">Image</a>
    """
    base_url = "https://example.com"

    result = detect_document_links(html, base_url)

    assert len(result) == 0


# ==================== DOCUMENT DOWNLOAD TESTS ====================


def test_download_document_success():
    """Test successful document download."""
    with patch("app.services.document_extractor.requests.get") as mock_get:
        mock_response = Mock()
        mock_response.content = b"file content"
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        result = download_document("https://example.com/file.pdf")

        assert result == b"file content"
        mock_get.assert_called_once()
        assert "User-Agent" in mock_get.call_args[1]["headers"]


def test_download_document_custom_timeout():
    """Test download with custom timeout."""
    with patch("app.services.document_extractor.requests.get") as mock_get:
        mock_response = Mock()
        mock_response.content = b"content"
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        download_document("https://example.com/file.pdf", timeout=60)

        assert mock_get.call_args[1]["timeout"] == 60


def test_download_document_http_error():
    """Test RuntimeError on HTTP error (404, 500, etc)."""
    with patch("app.services.document_extractor.requests.get") as mock_get:
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = Exception("404 Not Found")
        mock_get.return_value = mock_response

        with pytest.raises(RuntimeError, match="Document download failed"):
            download_document("https://example.com/missing.pdf")


def test_download_document_network_error():
    """Test RuntimeError on network failure."""
    with patch(
        "app.services.document_extractor.requests.get", side_effect=Exception("Connection timeout")
    ):
        with pytest.raises(RuntimeError, match="Document download failed"):
            download_document("https://example.com/file.pdf")


# ==================== FULL PIPELINE TESTS ====================


def test_extract_documents_from_page_no_documents():
    """Test extraction returns empty string when no documents found."""
    html = "<a href='/page.html'>Link</a>"
    base_url = "https://example.com"

    result = extract_documents_from_page(html, base_url)

    assert result == ""


def test_extract_documents_from_page_pdf_extraction():
    """Test full pipeline: detect PDF, download, extract."""
    html = '<a href="file.pdf">PDF</a>'
    base_url = "https://example.com"

    with patch("app.services.document_extractor.download_document") as mock_download:
        with patch("app.services.document_extractor.extract_text_from_pdf") as mock_extract:
            mock_download.return_value = b"pdf bytes"
            mock_extract.return_value = "Extracted PDF text"

            result = extract_documents_from_page(html, base_url)

            assert "Extracted PDF text" in result
            assert "file.pdf" in result


def test_extract_documents_from_page_docx_extraction():
    """Test full pipeline with DOCX extraction."""
    html = '<a href="resume.docx">Resume</a>'
    base_url = "https://example.com"

    with patch("app.services.document_extractor.download_document") as mock_download:
        with patch("app.services.document_extractor.extract_text_from_docx") as mock_extract:
            mock_download.return_value = b"docx bytes"
            mock_extract.return_value = "Resume content"

            result = extract_documents_from_page(html, base_url)

            assert "Resume content" in result


def test_extract_documents_from_page_multiple_documents():
    """Test extraction from multiple documents."""
    html = """
    <a href="doc1.pdf">PDF 1</a>
    <a href="doc2.docx">DOCX 2</a>
    """
    base_url = "https://example.com"

    with patch("app.services.document_extractor.download_document") as mock_download:
        with patch("app.services.document_extractor.extract_text_from_pdf") as mock_pdf:
            with patch("app.services.document_extractor.extract_text_from_docx") as mock_docx:
                mock_download.return_value = b"bytes"
                mock_pdf.return_value = "PDF text"
                mock_docx.return_value = "DOCX text"

                result = extract_documents_from_page(html, base_url)

                assert "PDF text" in result
                assert "DOCX text" in result
                assert mock_download.call_count == 2


def test_extract_documents_from_page_partial_failure():
    """Test extraction continues when one document fails."""
    html = """
    <a href="good.pdf">Good</a>
    <a href="bad.pdf">Bad</a>
    """
    base_url = "https://example.com"

    with patch("app.services.document_extractor.download_document") as mock_download:
        with patch("app.services.document_extractor.extract_text_from_pdf") as mock_extract:
            # First document succeeds, second fails
            mock_download.side_effect = [b"good bytes", Exception("Download failed")]
            mock_extract.return_value = "Good PDF text"

            result = extract_documents_from_page(html, base_url)

            # Should contain text from successful extraction only
            assert "Good PDF text" in result


def test_extract_documents_from_page_unknown_document_type():
    """Test handling of unknown document types (should skip)."""
    html = '<a href="file.xyz">Unknown</a>'
    base_url = "https://example.com"

    # Manually inject unknown type to simulate edge case
    with patch("app.services.document_extractor.detect_document_links") as mock_detect:
        mock_detect.return_value = [("https://example.com/file.xyz", "xyz")]

        result = extract_documents_from_page(html, base_url)

        # Should return empty or minimal result since type is unknown
        assert result == ""
