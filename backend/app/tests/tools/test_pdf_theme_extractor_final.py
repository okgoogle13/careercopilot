from __future__ import annotations

from pathlib import Path
from types import SimpleNamespace

import pytest

from app.models.theme_config_schemas import ColorConfig, LayoutConfig, TypographyConfig
from app.tools import pdf_theme_extractor as extractor


class _PdfCtx:
    def __init__(self, pages):
        self.pages = pages

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False


class FakePage:
    def __init__(self, words=None, chars=None, text="", width=600, height=800):
        self._words = words if words is not None else []
        self.chars = chars if chars is not None else []
        self._text = text
        self.width = width
        self.height = height

    def extract_words(self):
        return self._words

    def extract_text(self):
        return self._text


def _mock_path(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(extractor, "_ensure_path", lambda _: Path("sample_theme.pdf"))


def test_require_pdf_dependencies_reports_both_missing(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(extractor, "pdfplumber", None)
    monkeypatch.setattr(extractor, "fitz", None)
    with pytest.raises(RuntimeError) as exc:
        extractor._require_pdf_dependencies()
    assert "pdfplumber" in str(exc.value)
    assert "PyMuPDF" in str(exc.value)


def test_iter_pdf_chars_filters_whitespace(monkeypatch: pytest.MonkeyPatch) -> None:
    chars = [{"text": "A", "size": 11}, {"text": " ", "size": 11}, {"text": "B", "size": 12}]
    fake_pdfplumber = SimpleNamespace(open=lambda _: _PdfCtx([FakePage(chars=chars)]))
    monkeypatch.setattr(extractor, "pdfplumber", fake_pdfplumber)
    monkeypatch.setattr(extractor, "fitz", object())

    out = extractor._iter_pdf_chars(Path("ok.pdf"))
    assert [item["text"] for item in out] == ["A", "B"]


def test_iter_pdf_words_collects_all_pages(monkeypatch: pytest.MonkeyPatch) -> None:
    p1 = FakePage(words=[{"text": "Hello"}])
    p2 = FakePage(words=[{"text": "World"}])
    fake_pdfplumber = SimpleNamespace(open=lambda _: _PdfCtx([p1, p2]))
    monkeypatch.setattr(extractor, "pdfplumber", fake_pdfplumber)
    monkeypatch.setattr(extractor, "fitz", object())

    assert extractor._iter_pdf_words(Path("ok.pdf")) == [{"text": "Hello"}, {"text": "World"}]


def test_collect_pdf_text_joins_pages(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_pdfplumber = SimpleNamespace(
        open=lambda _: _PdfCtx([FakePage(text="One"), FakePage(text="Two")])
    )
    monkeypatch.setattr(extractor, "pdfplumber", fake_pdfplumber)
    monkeypatch.setattr(extractor, "fitz", object())

    assert extractor._collect_pdf_text(Path("ok.pdf")) == "One\nTwo"


def test_extract_fonts_defaults_when_no_characters(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "_iter_pdf_chars", lambda _: [])

    cfg = extractor.extract_fonts("ignored")
    assert cfg == TypographyConfig()


def test_extract_fonts_detects_weights_and_clamps(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    chars = [
        {"text": "a", "size": 9.0, "fontname": "ABC+WorkSans-Regular"},
        {"text": "b", "size": 9.2, "fontname": "ABC+WorkSans-Regular"},
        {"text": "H", "size": 20.0, "fontname": "WorkSans-Bold"},
        {"text": "N", "size": 30.0, "fontname": "WorkSans-Black"},
    ]
    monkeypatch.setattr(extractor, "_iter_pdf_chars", lambda _: chars)

    cfg = extractor.extract_fonts("ignored")
    assert cfg.fontFamily == "WorkSans"
    assert cfg.baseFontSizePt == 10
    assert cfg.headingFontSizePt == 18
    assert cfg.nameFontSizePt == 24
    assert cfg.headingFontWeight == 700


def test_extract_colors_with_empty_document_uses_defaults(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)

    class EmptyDoc:
        page_count = 0

        def __getitem__(self, idx):
            return SimpleNamespace(get_text=lambda mode: {"blocks": []})

        def __iter__(self):
            return iter([])

        def close(self):
            return None

    monkeypatch.setattr(extractor, "pdfplumber", object())
    monkeypatch.setattr(extractor, "fitz", SimpleNamespace(open=lambda _: EmptyDoc()))

    colors = extractor.extract_colors("ignored")
    assert colors.bodyText == "#000000"
    assert colors.backgroundColor == "#FFFFFF"


def test_extract_colors_chooses_accent_and_divider(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)

    class Doc:
        page_count = 1

        def __init__(self):
            self.page = SimpleNamespace(
                get_text=lambda mode: {
                    "blocks": [
                        {
                            "lines": [
                                {
                                    "spans": [
                                        {"text": "Body text", "color": 0x000000, "size": 11},
                                        {"text": "Head", "color": (1.0, 0.0, 0.0), "size": 15},
                                        {"text": "Accent", "color": 0x00FF00, "size": 11},
                                        {"text": "Divider", "color": 0x0000FF, "size": 11},
                                    ]
                                }
                            ]
                        }
                    ]
                }
            )

        def __getitem__(self, idx):
            return self.page

        def __iter__(self):
            return iter([self.page])

        def close(self):
            return None

    monkeypatch.setattr(extractor, "pdfplumber", object())
    monkeypatch.setattr(extractor, "fitz", SimpleNamespace(open=lambda _: Doc()))

    colors = extractor.extract_colors("ignored")
    assert colors.bodyText == "#000000"
    assert colors.headerText == "#FF0000"
    assert colors.accent in {"#00FF00", "#0000FF"}
    assert colors.divider in {"#00FF00", "#0000FF"}
    assert colors.accent != colors.divider


def test_extract_layout_defaults_when_no_pages(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "fitz", object())
    monkeypatch.setattr(extractor, "pdfplumber", SimpleNamespace(open=lambda _: _PdfCtx([])))

    assert extractor.extract_layout("ignored") == LayoutConfig()


def test_extract_layout_defaults_when_no_words(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "fitz", object())
    monkeypatch.setattr(
        extractor, "pdfplumber", SimpleNamespace(open=lambda _: _PdfCtx([FakePage(words=[])]))
    )

    assert extractor.extract_layout("ignored") == LayoutConfig()


def test_extract_layout_detects_two_column_sidebar_and_compact(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "fitz", object())
    words = [
        {"x0": 50, "x1": 200, "top": 100, "bottom": 110, "text": "L1"},
        {"x0": 400, "x1": 520, "top": 100, "bottom": 110, "text": "R1"},
        {"x0": 55, "x1": 210, "top": 106, "bottom": 116, "text": "L2"},
        {"x0": 405, "x1": 525, "top": 106, "bottom": 116, "text": "R2"},
        {"x0": 60, "x1": 220, "top": 112, "bottom": 122, "text": "L3"},
        {"x0": 410, "x1": 530, "top": 112, "bottom": 122, "text": "R3"},
    ]
    monkeypatch.setattr(
        extractor, "pdfplumber", SimpleNamespace(open=lambda _: _PdfCtx([FakePage(words=words)]))
    )

    layout = extractor.extract_layout("ignored")
    assert layout.variant == "two_column_sidebar"
    assert layout.spacingScale == "compact"
    assert "skills" in layout.sidebarSections


def test_extract_layout_detects_spacious(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "fitz", object())
    words = [
        {"x0": 60, "x1": 220, "top": 10, "bottom": 20, "text": "A"},
        {"x0": 60, "x1": 220, "top": 30, "bottom": 40, "text": "B"},
        {"x0": 60, "x1": 220, "top": 60, "bottom": 70, "text": "C"},
    ]
    monkeypatch.setattr(
        extractor, "pdfplumber", SimpleNamespace(open=lambda _: _PdfCtx([FakePage(words=words)]))
    )

    layout = extractor.extract_layout("ignored")
    assert layout.spacingScale == "spacious"


def test_extract_section_order_exact_and_fuzzy(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    text = "SUMMARY\nWork Experience\nCertifications and development\nTechnical Skills"
    monkeypatch.setattr(extractor, "_collect_pdf_text", lambda _: text)

    order = extractor.extract_section_order("ignored")
    assert order[0] == "career_summary"
    assert "professional_experience" in order
    assert "skills" in order


def test_extract_section_order_defaults_when_nothing_detected(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(
        extractor, "_collect_pdf_text", lambda _: "Random line\nAnother random section title"
    )

    assert extractor.extract_section_order("ignored") == list(extractor.DEFAULT_SECTION_ORDER)


def test_calculate_ats_score_cover_letter_maps_type(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        extractor,
        "ATS_RULES",
        {
            "full_letter": {
                "required_sections": ["contact"],
                "prohibited": ["tables"],
            }
        },
    )
    score, issues = extractor.calculate_ats_score(
        {
            "columns": 1,
            "has_tables": True,
            "has_images": False,
            "uses_text_boxes": False,
            "body_font_size_pt": 11,
            "detected_sections": [],
            "has_contact_info": False,
            "nonstandard_headings": False,
        },
        doc_type="cover_letter",
    )
    assert score <= 7
    assert any("missing_section" in issue for issue in issues)


def test_calculate_ats_score_penalties_stack(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        extractor,
        "ATS_RULES",
        {
            "resume": {
                "required_sections": ["summary", "experience", "education", "contact"],
                "prohibited": ["columns"],
            }
        },
    )
    score, issues = extractor.calculate_ats_score(
        {
            "columns": 2,
            "has_tables": True,
            "has_images": True,
            "uses_text_boxes": True,
            "body_font_size_pt": 9,
            "detected_sections": ["skills"],
            "has_contact_info": False,
            "nonstandard_headings": True,
        }
    )
    assert score < 5
    assert len(issues) >= 6


def test_extract_theme_from_pdf_resume_with_nonstandard_heading(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "extract_fonts", lambda _: TypographyConfig())
    monkeypatch.setattr(extractor, "extract_colors", lambda _: ColorConfig())
    monkeypatch.setattr(extractor, "extract_layout", lambda _: LayoutConfig())
    monkeypatch.setattr(
        extractor,
        "extract_section_order",
        lambda _: ["career_summary", "professional_experience", "education"],
    )
    monkeypatch.setattr(
        extractor,
        "_collect_pdf_text",
        lambda _: "CONTACT\nUNIQUEHEADER\nemail@example.com",
    )

    theme = extractor.extract_theme_from_pdf("ignored", target_sector="community")
    assert theme.id == "sample_theme"
    assert theme.target_sector == "community"
    assert theme.ats_compliance.score <= 10


def test_extract_theme_from_pdf_cover_letter(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "extract_fonts", lambda _: TypographyConfig())
    monkeypatch.setattr(extractor, "extract_colors", lambda _: ColorConfig())
    monkeypatch.setattr(extractor, "extract_layout", lambda _: LayoutConfig())
    monkeypatch.setattr(extractor, "extract_section_order", lambda _: ["career_summary"])
    monkeypatch.setattr(extractor, "_collect_pdf_text", lambda _: "CONTACT\ninfo@example.com")

    theme = extractor.extract_theme_from_pdf("ignored", label="My Label", doc_type="cover_letter")
    assert theme.id == "my_label"
    assert theme.layout["variant"] == "single_column"


def test_extract_fonts_propagates_corrupt_pdf_error(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(
        extractor, "_iter_pdf_chars", lambda _: (_ for _ in ()).throw(ValueError("corrupt"))
    )
    with pytest.raises(ValueError, match="corrupt"):
        extractor.extract_fonts("ignored")


def test_extract_layout_propagates_encrypted_pdf_error(monkeypatch: pytest.MonkeyPatch) -> None:
    _mock_path(monkeypatch)
    monkeypatch.setattr(extractor, "fitz", object())
    monkeypatch.setattr(
        extractor,
        "pdfplumber",
        SimpleNamespace(open=lambda _: (_ for _ in ()).throw(RuntimeError("encrypted"))),
    )
    with pytest.raises(RuntimeError, match="encrypted"):
        extractor.extract_layout("ignored")
