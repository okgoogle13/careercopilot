from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from app.models.theme_config_schemas import (
    ColorConfig,
    LayoutConfig,
    TypographyConfig,
)
from app.tools.pdf_theme_extractor import (
    _color_value_to_hex,
    _ensure_path,
    _looks_bold,
    _normalize_font_name,
    _require_pdf_dependencies,
    _safe_int,
    _slugify,
    _titleize_slug,
    calculate_ats_score,
    extract_colors,
    extract_fonts,
    extract_layout,
    extract_section_order,
    extract_theme_from_pdf,
    rgb_to_hex,
)


def test_normalize_font_name():
    assert _normalize_font_name("ABCDEF+Arial-Bold") == "Arial"
    assert _normalize_font_name("Arial,Bold") == "Arial"
    assert _normalize_font_name("") == "Source Sans Pro"
    assert _normalize_font_name(None) == "Source Sans Pro"


def test_looks_bold():
    assert _looks_bold("Arial-Bold") is True
    assert _looks_bold("Roboto-Black") is True
    assert _looks_bold("Helvetica") is False
    assert _looks_bold(None) is False


def test_safe_int():
    assert _safe_int(10.6, 5) == 11
    assert _safe_int("invalid", 5) == 5
    assert _safe_int(-10, 5) == 0


def test_slugify():
    assert _slugify("My Cool Theme") == "my_cool_theme"
    assert _slugify("!!!") == "theme_extract"


def test_titleize_slug():
    assert _titleize_slug("my_cool_theme") == "My Cool Theme"
    assert _titleize_slug("") == "Theme Extract"


def test_rgb_to_hex():
    assert rgb_to_hex(1.0, 1.0, 1.0) == "#FFFFFF"
    assert rgb_to_hex(255, 255, 255) == "#FFFFFF"
    assert rgb_to_hex(0, 0, 0) == "#000000"


def test_color_value_to_hex():
    assert _color_value_to_hex(0xFFFFFF) == "#FFFFFF"
    assert _color_value_to_hex((1.0, 0, 0)) == "#FF0000"
    assert _color_value_to_hex(None) is None


@patch("app.tools.pdf_theme_extractor.Path.exists")
def test_ensure_path(mock_exists):
    mock_exists.return_value = True
    assert _ensure_path("test.pdf") == Path("test.pdf")

    with pytest.raises(ValueError):
        _ensure_path("test.txt")

    mock_exists.return_value = False
    with pytest.raises(FileNotFoundError):
        _ensure_path("nonexistent.pdf")


@patch("app.tools.pdf_theme_extractor.fitz", MagicMock())
@patch("app.tools.pdf_theme_extractor.pdfplumber")
@patch("app.tools.pdf_theme_extractor._ensure_path")
def test_extract_fonts(mock_ensure, mock_pdf):
    mock_ensure.return_value = Path("test.pdf")

    # Mocking characters
    mock_char = {"text": "A", "size": 12.0, "fontname": "Arial"}
    mock_page = MagicMock()
    mock_page.chars = [mock_char for _ in range(10)]
    mock_pdf.open.return_value.__enter__.return_value.pages = [mock_page]

    config = extract_fonts("test.pdf")
    assert config.fontFamily == "Arial"
    assert config.baseFontSizePt == 12


@patch("app.tools.pdf_theme_extractor.pdfplumber", MagicMock())
@patch("app.tools.pdf_theme_extractor.fitz")
@patch("app.tools.pdf_theme_extractor._ensure_path")
def test_extract_colors(mock_ensure, mock_fitz):
    mock_ensure.return_value = Path("test.pdf")

    mock_doc = MagicMock()
    mock_page = MagicMock()
    mock_doc.__getitem__.return_value = mock_page
    mock_doc.__iter__.return_value = [mock_page]
    mock_doc.page_count = 1

    mock_span = {"text": "Hello", "color": 0x000000, "size": 12.0}
    mock_page.get_text.return_value = {"blocks": [{"lines": [{"spans": [mock_span]}]}]}
    mock_fitz.return_value = mock_doc

    colors = extract_colors("test.pdf")
    assert colors.bodyText == "#000000"


@patch("app.tools.pdf_theme_extractor.fitz", MagicMock())
@patch("app.tools.pdf_theme_extractor.pdfplumber")
@patch("app.tools.pdf_theme_extractor._ensure_path")
def test_extract_layout(mock_ensure, mock_pdf):
    mock_ensure.return_value = Path("test.pdf")

    mock_page = MagicMock()
    mock_page.width = 600
    mock_page.height = 800
    mock_page.extract_words.return_value = [
        {"text": "Hello", "x0": 50, "x1": 100, "top": 50, "bottom": 60}
    ]
    mock_pdf.open.return_value.__enter__.return_value.pages = [mock_page]

    layout = extract_layout("test.pdf")
    assert layout.variant == "single_column"
    assert layout.marginsPt["left"] == 50


@patch(
    "app.tools.pdf_theme_extractor.ATS_RULES",
    {
        "resume": {
            "required_sections": ["summary", "experience", "education"],
            "prohibited": ["tables", "columns", "images"],
        }
    },
)
def test_calculate_ats_score():
    data = {
        "columns": 1,
        "has_tables": False,
        "has_images": False,
        "uses_text_boxes": False,
        "body_font_size_pt": 11,
        "detected_sections": ["career_summary", "professional_experience", "education"],
        "has_contact_info": True,
    }
    score, issues = calculate_ats_score(data)
    assert score == 10
    assert len(issues) == 0

    data["columns"] = 2
    score, issues = calculate_ats_score(data, doc_type="resume")
    assert score < 10
    assert any("column" in i for i in issues)


@patch("app.tools.pdf_theme_extractor.extract_fonts")
@patch("app.tools.pdf_theme_extractor.extract_colors")
@patch("app.tools.pdf_theme_extractor.extract_layout")
@patch("app.tools.pdf_theme_extractor._collect_pdf_text")
@patch("app.tools.pdf_theme_extractor._ensure_path")
def test_extract_theme_from_pdf(mock_ensure, mock_text, mock_layout, mock_colors, mock_fonts):
    mock_ensure.return_value = Path("test.pdf")
    mock_text.return_value = "NAME\nCONTACT info@example.com"
    mock_fonts.return_value = TypographyConfig()
    mock_colors.return_value = ColorConfig()
    mock_layout.return_value = LayoutConfig()

    theme = extract_theme_from_pdf("test.pdf")
    assert theme.id == "test"
    assert theme.source_pdf == "test.pdf"


@patch("app.tools.pdf_theme_extractor.pdfplumber", None)
def test_require_pdf_dependencies_missing_pdfplumber():
    with pytest.raises(RuntimeError) as excinfo:
        _require_pdf_dependencies()
    assert "pdfplumber" in str(excinfo.value)


@patch("app.tools.pdf_theme_extractor.fitz", None)
@patch("app.tools.pdf_theme_extractor.pdfplumber", MagicMock())
def test_require_pdf_dependencies_missing_fitz():
    with pytest.raises(RuntimeError) as excinfo:
        _require_pdf_dependencies()
    assert "PyMuPDF" in str(excinfo.value)
