from __future__ import annotations

import sys
import types
from typing import Any

import pytest

from app.core.template_loader import TemplateLoader


class FakeHTML:
    def __init__(self, string: str) -> None:
        self.string = string

    def write_pdf(self) -> bytes:
        return b"fake-pdf"


if "weasyprint" not in sys.modules:
    fake_weasyprint = types.ModuleType("weasyprint")
    fake_weasyprint.HTML = FakeHTML  # type: ignore[attr-defined]
    sys.modules["weasyprint"] = fake_weasyprint

from app.renderers.themed_document_renderer import ThemedDocumentRenderer

MINIMAL_RESUME_THEME = {
    "id": "minimal_resume",
    "label": "Minimal Resume",
    "description": "Minimal resume theme for renderer tests.",
    "typography": {
        "fontFamily": "Arial",
        "baseFontSizePt": 11,
        "headingFontSizePt": 13,
        "nameFontSizePt": 18,
        "headingFontWeight": 700,
        "bodyFontWeight": 400,
    },
    "colors": {
        "bodyText": "#333333",
        "headerText": "#111111",
        "nameColor": "#000000",
        "divider": "#cccccc",
        "accent": "#555555",
        "backgroundColor": "#ffffff",
    },
    "layout": {
        "variant": "single_column",
        "marginsPt": {"top": 72, "bottom": 72, "left": 72, "right": 72},
        "spacingScale": "default",
        "order": ["career_summary", "professional_experience", "education", "skills"],
        "sidebarSections": [],
    },
    "ats_compliance": {"score": 9, "issues": []},
}

MINIMAL_RESUME_DATA = {
    "basics": {"name": "Jane Doe", "email": "jane@example.com", "phone": "0400000000"},
    "summary": "Experienced professional.",
    "work": [
        {
            "title": "Engineer",
            "company": "Acme",
            "startDate": "2020-01",
            "endDate": "Present",
            "achievements": ["Built things"],
        }
    ],
    "education": [{"institution": "UniMelb", "degree": "BEng", "endDate": "2019"}],
    "skills": {"technical": ["Python"], "tools": [], "soft": [], "methodologies": []},
    "certifications": [],
}

MINIMAL_COVER_LETTER_THEME = {
    "id": "minimal_cover_letter",
    "label": "Minimal Cover Letter",
    "description": "Minimal cover-letter theme for renderer tests.",
    "typography": {
        "fontFamily": "Arial",
        "baseFontSizePt": 11,
        "headingFontSizePt": 13,
        "nameFontSizePt": 16,
        "headingFontWeight": 600,
        "bodyFontWeight": 400,
    },
    "colors": {
        "bodyText": "#333333",
        "headerText": "#111111",
        "nameColor": "#000000",
        "divider": "#cccccc",
        "accent": "#555555",
        "backgroundColor": "#ffffff",
    },
    "layout": {
        "marginsPt": {"top": 72, "bottom": 72, "left": 72, "right": 72},
        "spacingScale": "default",
    },
    "ats_compliance": {"score": 9, "issues": []},
}

MINIMAL_COVER_LETTER_DATA = {
    "candidate_name": "Jane Doe",
    "basics": {"email": "jane@example.com"},
    "greeting": "Dear Hiring Manager,",
    "body": "I am applying for the role.",
    "closing": "Sincerely,",
    "signature_name": "Jane Doe",
}


class RecordingTemplate:
    def __init__(self, name: str) -> None:
        self.name = name

    def render(self, **context: Any) -> str:
        return f"{self.name}:{context['title']}:{context.get('name') or context.get('sender_name')}"


class RecordingLoader:
    def __init__(self) -> None:
        self.names: list[str] = []

    def get(self, name: str) -> RecordingTemplate:
        self.names.append(name)
        return RecordingTemplate(name)


def test_template_loader_loads_resume() -> None:
    template = TemplateLoader().get("resume")
    assert template.name == "resume.jinja2"


def test_template_loader_loads_cover_letter() -> None:
    template = TemplateLoader().get("cover_letter")
    assert template.name == "cover_letter.jinja2"


def test_template_loader_raises_on_unknown() -> None:
    with pytest.raises(ValueError, match="Unknown template"):
        TemplateLoader().get("unknown_doc_type")


def test_render_resume_html_uses_injected_template_loader() -> None:
    loader = RecordingLoader()
    html = ThemedDocumentRenderer(template_loader=loader).render_resume_html(
        MINIMAL_RESUME_THEME,
        MINIMAL_RESUME_DATA,
    )

    assert loader.names == ["resume"]
    assert html == "resume:Resume:Jane Doe"


def test_render_cover_letter_html_uses_injected_template_loader() -> None:
    loader = RecordingLoader()
    html = ThemedDocumentRenderer(template_loader=loader).render_cover_letter_html(
        MINIMAL_COVER_LETTER_THEME,
        MINIMAL_COVER_LETTER_DATA,
    )

    assert loader.names == ["cover_letter"]
    assert html == "cover_letter:Cover Letter:Jane Doe"
