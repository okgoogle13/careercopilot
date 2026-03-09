from __future__ import annotations

import importlib
import sys
import types
from dataclasses import dataclass
from typing import Any, cast

import pytest

from app.models.theme_config_schemas import CoverLetterThemeConfig, ResumeThemeConfig


@pytest.fixture
def resume_theme_dict() -> dict[str, object]:
    return {
        "id": "theme_one",
        "label": "Theme One",
        "description": "A valid ATS-friendly resume theme config.",
        "colors": {
            "bodyText": "#111111",
            "headerText": "#222222",
            "nameColor": "#333333",
            "divider": "#444444",
            "accent": "#555555",
            "backgroundColor": "#FFFFFF",
        },
        "typography": {
            "fontFamily": "Work Sans",
            "baseFontSizePt": 11,
            "headingFontSizePt": 14,
            "nameFontSizePt": 18,
            "headingFontWeight": 700,
            "bodyFontWeight": 400,
        },
        "layout": {
            "spacingScale": "default",
            "order": [
                "career_summary",
                "skills",
                "professional_experience",
                "education",
                "certifications_and_development",
            ],
            "variant": "single_column",
            "sidebarSections": [],
            "marginsPt": {"top": 72, "bottom": 72, "left": 72, "right": 72},
        },
        "ats_compliance": {"score": 9, "issues": []},
    }


@pytest.fixture
def cover_letter_theme_dict() -> dict[str, object]:
    return {
        "id": "cover_one",
        "label": "Cover One",
        "description": "A valid ATS-friendly cover letter theme config.",
        "colors": {
            "bodyText": "#111111",
            "headerText": "#222222",
            "nameColor": "#333333",
            "divider": "#444444",
            "accent": "#555555",
            "backgroundColor": "#FFFFFF",
        },
        "typography": {
            "fontFamily": "Work Sans",
            "baseFontSizePt": 11,
            "headingFontSizePt": 14,
            "nameFontSizePt": 18,
            "headingFontWeight": 700,
            "bodyFontWeight": 400,
        },
        "layout": {
            "spacingScale": "compact",
            "marginsPt": {"top": 70, "bottom": 70, "left": 70, "right": 70},
        },
        "ats_compliance": {"score": 9, "issues": []},
    }


@dataclass
class ModelLike:
    payload: dict[str, object]

    def model_dump(self) -> dict[str, object]:
        return self.payload


class FakeHTML:
    def __init__(self, string: str):
        self.string = string

    def write_pdf(self) -> bytes:
        return b"fake-pdf"


if "weasyprint" not in sys.modules:
    fake_weasyprint = types.ModuleType("weasyprint")
    fake_weasyprint.HTML = FakeHTML  # type: ignore[attr-defined]
    sys.modules["weasyprint"] = fake_weasyprint

from app.renderers import themed_document_renderer as renderer


def test_ensure_mapping_accepts_mapping() -> None:
    data = {"a": 1}
    assert renderer._ensure_mapping(data) is data


def test_ensure_mapping_accepts_model_dump() -> None:
    model = ModelLike({"k": "v"})
    assert renderer._ensure_mapping(model) == {"k": "v"}


def test_ensure_mapping_rejects_invalid() -> None:
    with pytest.raises(TypeError, match="mapping-like"):
        renderer._ensure_mapping("nope")


def test_coerce_resume_theme_from_mapping(resume_theme_dict: dict[str, object]) -> None:
    theme = renderer._coerce_resume_theme(resume_theme_dict)
    assert isinstance(theme, ResumeThemeConfig)
    assert theme.id == "theme_one"


def test_coerce_resume_theme_from_instance(resume_theme_dict: dict[str, object]) -> None:
    instance = ResumeThemeConfig.model_validate(resume_theme_dict)
    assert renderer._coerce_resume_theme(instance) is instance


def test_coerce_cover_letter_theme_from_mapping(
    cover_letter_theme_dict: dict[str, object],
) -> None:
    theme = renderer._coerce_cover_letter_theme(cover_letter_theme_dict)
    assert isinstance(theme, CoverLetterThemeConfig)
    assert theme.id == "cover_one"


def test_coerce_cover_letter_theme_from_instance(
    cover_letter_theme_dict: dict[str, object],
) -> None:
    instance = CoverLetterThemeConfig.model_validate(cover_letter_theme_dict)
    assert renderer._coerce_cover_letter_theme(instance) is instance


@pytest.mark.parametrize(
    ("scale", "expected"),
    [("compact", 10), ("default", 14), ("spacious", 18), ("unknown", 14)],
)
def test_spacing_to_gap(scale: str, expected: int) -> None:
    assert renderer._spacing_to_gap(scale) == expected


def test_normalize_contact_line_prefers_personal_info() -> None:
    data = {
        "personal_info": {"email": "a@b.com", "phone": "123", "website": "example.org"},
        "basics": {"email": "c@d.com"},
    }
    assert renderer._normalize_contact_line(data) == "a@b.com | 123 | example.org"


def test_normalize_contact_line_escapes_html() -> None:
    data = {"email": "<x@y.com>", "location": "A&B"}
    assert renderer._normalize_contact_line(data) == "&lt;x@y.com&gt; | A&amp;B"


def test_normalize_name_resolution_order() -> None:
    data = {"personal_info": {"name": "Top"}, "basics": {"name": "Mid"}, "name": "Low"}
    assert renderer._normalize_name(data) == "Top"


def test_normalize_name_default() -> None:
    assert renderer._normalize_name({}) == "Candidate"


def test_normalize_headline_reads_supported_keys() -> None:
    assert renderer._normalize_headline({"title": "Analyst"}) == "Analyst"
    assert renderer._normalize_headline({"target_role": "Engineer"}) == "Engineer"


def test_normalize_headline_empty() -> None:
    assert renderer._normalize_headline({}) == ""


@pytest.mark.parametrize(
    ("value", "expected"),
    [(None, []), ([1, 2], [1, 2]), ((1, 2), [1, 2]), ("x", ["x"])],
)
def test_listify(value: object, expected: list[object]) -> None:
    assert renderer._listify(value) == expected


def test_paragraphs_to_html_none() -> None:
    assert renderer._paragraphs_to_html(None) == ""


def test_paragraphs_to_html_list_and_escape() -> None:
    html = renderer._paragraphs_to_html(["A", "", "B < C"])
    assert html == "<p>A</p><p>B &lt; C</p>"


def test_paragraphs_to_html_splits_on_double_newline() -> None:
    html = renderer._paragraphs_to_html("Para1\n\nPara2")
    assert html == "<p>Para1</p><p>Para2</p>"


def test_bullets_to_html_empty() -> None:
    assert renderer._bullets_to_html([]) == ""


def test_bullets_to_html_renders_list_and_escapes() -> None:
    html = renderer._bullets_to_html(["A", "B < C"])
    assert html == "<ul><li>A</li><li>B &lt; C</li></ul>"


def test_render_experience_supports_multiple_shapes() -> None:
    entries = [
        {
            "role": "Dev",
            "organization": "Org",
            "startDate": "2022",
            "current": True,
            "achievements": ["Delivered X"],
        },
        {"position": "Tester", "description": "Validated cases"},
    ]
    html = renderer._render_experience(entries)
    assert "Dev" in html
    assert "Org | 2022 - Present" in html
    assert "Validated cases" in html


def test_render_education_uses_fallback_fields() -> None:
    html = renderer._render_education(
        [{"qualification": "BSc", "field": "CS", "school": "Uni", "graduation_year": "2020"}]
    )
    assert "BSc, CS" in html
    assert "Uni | 2020" in html


def test_render_certifications_supports_mapping_and_scalar() -> None:
    html = renderer._render_certifications(
        [
            {"title": "AWS", "provider": "Amazon", "date": "2023"},
            "Plain Cert",
        ]
    )
    assert "AWS" in html
    assert "Amazon | 2023" in html
    assert "Plain Cert" in html


def test_render_skills_mapping() -> None:
    html = renderer._render_skills({"Languages": ["Python", "TS"]})
    assert "Languages" in html
    assert "Python, TS" in html


def test_render_skills_list() -> None:
    html = renderer._render_skills(["Python", "TS"])
    assert html == "<ul><li>Python</li><li>TS</li></ul>"


def test_render_skills_none() -> None:
    assert renderer._render_skills(None) == ""


def test_build_section_empty_body() -> None:
    assert renderer._build_section("Title", "") == ""


def test_build_section_wraps_and_escapes_title() -> None:
    html = renderer._build_section("A&B", "<p>x</p>")
    assert "<h2 class='section-title'>A&amp;B</h2>" in html


def test_collect_resume_sections_includes_aliases() -> None:
    sections = renderer._collect_resume_sections(
        {
            "summary": "Summary text",
            "skills": ["X"],
            "work": [{"title": "Dev"}],
            "education": [{"degree": "BSc"}],
            "professional_development": ["Cert"],
        }
    )
    assert "Summary text" in sections["career_summary"]
    assert "<li>X</li>" in sections["skills"]
    assert "Dev" in sections["professional_experience"]


def test_render_resume_html_single_column(resume_theme_dict: dict[str, object]) -> None:
    renderer_instance = renderer.ThemedDocumentRenderer()
    html = renderer_instance.render_resume_html(
        resume_theme_dict,
        {
            "name": "Jane",
            "headline": "Engineer",
            "email": "jane@example.com",
            "career_summary": "Built things",
            "skills": ["Python"],
        },
        title="My Resume",
    )
    assert "<title>My Resume</title>" in html
    assert "Jane" in html
    assert "Engineer" in html
    assert "Professional Summary" in html
    assert "display: none" in html


def test_render_resume_html_two_column_sidebar(resume_theme_dict: dict[str, object]) -> None:
    theme = dict(resume_theme_dict)
    layout = cast(dict[str, Any], theme["layout"])
    theme["layout"] = {
        **layout,
        "variant": "two_column_sidebar",
        "sidebarSections": ["skills"],
        "spacingScale": "spacious",
    }
    renderer_instance = renderer.ThemedDocumentRenderer()
    html = renderer_instance.render_resume_html(
        theme,
        {
            "name": "Jane",
            "skills": ["Python"],
            "career_summary": "Summary",
        },
    )
    assert "display: table" in html
    assert 'class="sidebar"' in html
    assert "Skills" in html


def test_render_resume_html_appends_sections_not_in_order(
    resume_theme_dict: dict[str, object],
) -> None:
    theme = dict(resume_theme_dict)
    layout = cast(dict[str, Any], theme["layout"])
    theme["layout"] = {
        **layout,
        "order": ["skills"],
    }
    renderer_instance = renderer.ThemedDocumentRenderer()
    html = renderer_instance.render_resume_html(
        theme,
        {
            "skills": ["Python"],
            "career_summary": "Late summary",
        },
    )
    assert "Late summary" in html


def test_render_resume_pdf_uses_html_writer(
    monkeypatch: pytest.MonkeyPatch,
    resume_theme_dict: dict[str, object],
) -> None:
    monkeypatch.setattr(renderer, "HTML", FakeHTML)
    output = renderer.ThemedDocumentRenderer().render_resume_pdf(
        resume_theme_dict,
        {"name": "Jane", "career_summary": "Summary"},
    )
    assert output == b"fake-pdf"


def test_render_cover_letter_html_with_body_and_recipient(
    cover_letter_theme_dict: dict[str, object],
) -> None:
    html = renderer.ThemedDocumentRenderer().render_cover_letter_html(
        cover_letter_theme_dict,
        {
            "candidate_name": "Jane",
            "recipient_lines": ["Hiring Manager", "Acme Corp"],
            "greeting": "Dear Team",
            "body": "Paragraph 1\n\nParagraph 2",
            "closing": "Kind regards",
            "signature_name": "Jane D",
            "email": "jane@example.com",
        },
        title="CL",
    )
    assert "<title>CL</title>" in html
    assert "Hiring Manager" in html
    assert "<p>Paragraph 1</p><p>Paragraph 2</p>" in html
    assert "Kind regards" in html
    assert "Jane D" in html


def test_render_cover_letter_html_fallbacks(cover_letter_theme_dict: dict[str, object]) -> None:
    html = renderer.ThemedDocumentRenderer().render_cover_letter_html(
        cover_letter_theme_dict,
        {
            "name": "Jane",
            "company_address": ["Line 1"],
            "paragraphs": ["One", "Two"],
            "content": None,
        },
    )
    assert "Line 1" in html
    assert "<p>One</p><p>Two</p>" in html
    assert "Jane" in html


def test_render_cover_letter_pdf_uses_html_writer(
    monkeypatch: pytest.MonkeyPatch,
    cover_letter_theme_dict: dict[str, object],
) -> None:
    monkeypatch.setattr(renderer, "HTML", FakeHTML)
    output = renderer.ThemedDocumentRenderer().render_cover_letter_pdf(
        cover_letter_theme_dict,
        {"name": "Jane", "body": "Hello"},
    )
    assert output == b"fake-pdf"


def test_weasyprint_can_be_mocked_via_sys_modules(
    resume_theme_dict: dict[str, object],
) -> None:
    fake_weasyprint = types.SimpleNamespace(HTML=FakeHTML)
    original = sys.modules.get("weasyprint")

    try:
        with pytest.MonkeyPatch.context() as mp:
            mp.setitem(sys.modules, "weasyprint", fake_weasyprint)
            reloaded = importlib.reload(renderer)
            output = reloaded.ThemedDocumentRenderer().render_resume_pdf(
                resume_theme_dict,
                {"name": "Jane", "career_summary": "Summary"},
            )
            assert output == b"fake-pdf"
    finally:
        if original is not None:
            sys.modules["weasyprint"] = original
        else:
            sys.modules.pop("weasyprint", None)
        importlib.reload(renderer)
