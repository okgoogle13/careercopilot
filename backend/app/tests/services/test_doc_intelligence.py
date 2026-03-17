"""Unit tests for the document intelligence service."""

from pathlib import Path
from unittest.mock import MagicMock
from zipfile import ZipFile

import pytest

import app.services.doc_intelligence as doc_intelligence_module
from app.services.doc_intelligence import DocumentIntelligenceService, _DocxXmlEditor


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for these isolated tests."""
    return None


def _write_minimal_docx(path: Path, body_text: str) -> None:
    """Create a minimal DOCX-like zip with a Word document XML payload."""
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        "<w:body><w:p><w:r><w:t>"
        f"{body_text}"
        "</w:t></w:r></w:p></w:body></w:document>"
    )
    with ZipFile(path, "w") as archive:
        archive.writestr("word/document.xml", xml)


def test_document_intelligence_service_creates_working_directory(tmp_path):
    """The constructor should create the configured working directory."""
    working_dir = tmp_path / "docs" / "nested"

    service = DocumentIntelligenceService(working_dir=str(working_dir))

    assert service.working_dir == working_dir
    assert working_dir.exists()


def test_apply_redlines_to_docx_updates_document_xml(tmp_path):
    """Tracked changes should be written into the output DOCX payload."""
    input_path = tmp_path / "input.docx"
    output_path = tmp_path / "output.docx"
    _write_minimal_docx(input_path, "Replace this text")
    service = DocumentIntelligenceService(working_dir=str(tmp_path / "work"))

    result = service.apply_redlines_to_docx(
        str(input_path),
        str(output_path),
        [{"original": "Replace this text", "replacement": "Updated text"}],
        author="Codex",
    )

    assert result is True
    with ZipFile(output_path) as archive:
        document_xml = archive.read("word/document.xml").decode("utf-8")
    assert "w:delText" in document_xml
    assert "Replace this text" in document_xml
    assert "Updated text" in document_xml
    assert 'w:author="Codex"' in document_xml


def test_apply_redlines_to_docx_returns_false_for_invalid_docx(tmp_path):
    """Invalid DOCX payloads should fail gracefully."""
    input_path = tmp_path / "broken.docx"
    output_path = tmp_path / "unused.docx"
    with ZipFile(input_path, "w") as archive:
        archive.writestr("not-word.txt", "oops")
    service = DocumentIntelligenceService(working_dir=str(tmp_path / "work"))

    assert (
        service.apply_redlines_to_docx(
            str(input_path),
            str(output_path),
            [{"original": "Old", "replacement": "New"}],
        )
        is False
    )


def test_docx_xml_editor_finds_runs_and_saves_changes(tmp_path, monkeypatch):
    """The XML editor should find target runs and persist tracked changes."""
    xml_path = tmp_path / "document.xml"
    xml_path.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        "<w:body><w:p><w:r><w:t>Original</w:t></w:r></w:p></w:body></w:document>",
        encoding="utf-8",
    )
    monkeypatch.setattr(doc_intelligence_module.random, "randint", lambda _a, _b: 123456)
    editor = _DocxXmlEditor(xml_path, author="Tester")

    run_node = editor.find_run_containing_text("Original")

    assert run_node is not None
    editor.apply_tracked_change(run_node, "Original", "Replacement")
    editor.save()
    saved_xml = xml_path.read_text(encoding="utf-8")
    assert "Replacement" in saved_xml
    assert "Original" in saved_xml
    assert 'w:id="123456"' in saved_xml


def test_fill_pdf_form_returns_false_without_pypdf(monkeypatch, tmp_path):
    """The service should refuse PDF filling when pypdf is unavailable."""
    monkeypatch.setattr(doc_intelligence_module, "PdfReader", None)
    monkeypatch.setattr(doc_intelligence_module, "PdfWriter", None)
    service = DocumentIntelligenceService(working_dir=str(tmp_path / "work"))

    assert service.fill_pdf_form("input.pdf", "output.pdf", {"name": "Test"}) is False


def test_fill_pdf_form_returns_false_when_no_fields(monkeypatch, tmp_path):
    """Non-form PDFs should fail cleanly."""
    reader = MagicMock()
    reader.get_fields.return_value = {}
    writer = MagicMock()
    writer.pages = []
    monkeypatch.setattr(doc_intelligence_module, "PdfReader", MagicMock(return_value=reader))
    monkeypatch.setattr(doc_intelligence_module, "PdfWriter", MagicMock(return_value=writer))
    service = DocumentIntelligenceService(working_dir=str(tmp_path / "work"))

    assert (
        service.fill_pdf_form(
            str(tmp_path / "input.pdf"),
            str(tmp_path / "output.pdf"),
            {"name": "Test"},
        )
        is False
    )


def test_fill_pdf_form_updates_checkbox_and_text_fields(monkeypatch, tmp_path):
    """The writer should receive normalized updates for supported form fields."""
    reader = MagicMock()
    reader.get_fields.return_value = {
        "full_name": {"/FT": "/Tx"},
        "accepted_terms": {"/FT": "/Btn"},
        "ignored": {"/FT": "/Tx"},
    }
    writer = MagicMock()
    page = MagicMock()
    writer.pages = [page]
    monkeypatch.setattr(doc_intelligence_module, "PdfReader", MagicMock(return_value=reader))
    monkeypatch.setattr(doc_intelligence_module, "PdfWriter", MagicMock(return_value=writer))
    service = DocumentIntelligenceService(working_dir=str(tmp_path / "work"))
    output_path = tmp_path / "filled.pdf"

    result = service.fill_pdf_form(
        str(tmp_path / "input.pdf"),
        str(output_path),
        {"full_name": "Alex Smith", "accepted_terms": True, "unknown": "skip"},
    )

    assert result is True
    writer.append.assert_called_once_with(reader)
    writer.update_page_form_field_values.assert_called_once_with(
        page,
        {"full_name": "Alex Smith", "accepted_terms": "/Yes"},
    )
    writer.write.assert_called_once()
