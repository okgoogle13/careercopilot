from unittest.mock import MagicMock, patch

import pytest

from app.services.document_extractor import (
    detect_document_links,
    download_document,
    extract_documents_from_page,
    extract_text_from_pdf,
)


@pytest.fixture
def mock_pdf_content():
    return b"%PDF-1.4\ntest content"


@pytest.fixture
def mock_docx_content():
    return b"not a real docx but bytes"


def test_extract_text_from_pdf_success(mock_pdf_content):
    mock_reader = MagicMock()
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "Extracted PDF Text"
    mock_reader.pages = [mock_page]

    with (
        patch("app.services.document_extractor.PdfReader", return_value=mock_reader),
        patch("app.services.document_extractor.PYPDF_AVAILABLE", True),
    ):

        result = extract_text_from_pdf(mock_pdf_content)
        assert "Extracted PDF Text" in result


def test_detect_document_links():
    html = """
    <html>
        <a href="resume.pdf">Download Resume</a>
        <a href="/docs/criteria.docx">Selection Criteria</a>
        <a href="image.png">Other</a>
    </html>
    """
    base_url = "https://example.com/job"
    links = detect_document_links(html, base_url)

    assert len(links) == 2
    assert ("https://example.com/resume.pdf", "pdf") in links
    assert ("https://example.com/docs/criteria.docx", "docx") in links


def test_download_document_success():
    mock_response = MagicMock()
    mock_response.content = b"file content"
    mock_response.raise_for_status.return_value = None

    with patch("requests.get", return_value=mock_response):
        result = download_document("https://example.com/file.pdf")
        assert result == b"file content"


def test_extract_documents_from_page_none():
    result = extract_documents_from_page("<html>no links</html>", "https://example.com")
    assert result == ""


@patch("app.services.document_extractor.download_document")
@patch("app.services.document_extractor.extract_text_from_pdf")
def test_extract_documents_from_page_success(mock_extract, mock_download):
    mock_download.return_value = b"bytes"
    mock_extract.return_value = "Content of PDF"

    html = '<a href="test.pdf">PDF</a>'
    result = extract_documents_from_page(html, "https://example.com")

    assert "Content of PDF" in result
    assert "--- Document: https://example.com/test.pdf ---" in result
