from __future__ import annotations

import io
import sys
import types

import pytest

if "weasyprint" not in sys.modules:
    weasyprint_mod = types.ModuleType("weasyprint")
    setattr(weasyprint_mod, "HTML", object)
    sys.modules["weasyprint"] = weasyprint_mod

if "docx" not in sys.modules:
    docx_mod = types.ModuleType("docx")
    shared_mod = types.ModuleType("docx.shared")
    enum_mod = types.ModuleType("docx.enum")
    text_mod = types.ModuleType("docx.enum.text")

    class _WDAlign:
        LEFT = 0
        JUSTIFY = 3
        CENTER = 1

    setattr(shared_mod, "Pt", lambda x: x)
    setattr(shared_mod, "RGBColor", lambda r, g, b: (r, g, b))
    setattr(text_mod, "WD_ALIGN_PARAGRAPH", _WDAlign)
    setattr(docx_mod, "Document", object)

    sys.modules["docx"] = docx_mod
    sys.modules["docx.shared"] = shared_mod
    sys.modules["docx.enum"] = enum_mod
    sys.modules["docx.enum.text"] = text_mod


from app.core import document_pipeline, docx_renderer, pdf_renderer


class _FakeRun:
    def __init__(self, text: str):
        self.text = text
        self.bold = False
        self.italic = False


class _FakeParagraph:
    def __init__(self, text: str = "", style: str | None = None):
        self.text = text
        self.style = style
        self.alignment = None
        self.runs: list[_FakeRun] = []

    def add_run(self, text: str) -> _FakeRun:
        run = _FakeRun(text)
        self.runs.append(run)
        return run


class _FakeFont:
    def __init__(self):
        self.name = None
        self.size = None


class _FakeStyle:
    def __init__(self):
        self.font = _FakeFont()


class _FakeDocument:
    def __init__(self):
        self.styles = {"Normal": _FakeStyle()}
        self.headings: list[tuple[str, int, _FakeParagraph]] = []
        self.paragraphs: list[_FakeParagraph] = []

    def add_heading(self, text: str, level: int = 0) -> _FakeParagraph:
        p = _FakeParagraph(text=text)
        self.headings.append((text, level, p))
        self.paragraphs.append(p)
        return p

    def add_paragraph(self, text: str = "", style: str | None = None) -> _FakeParagraph:
        p = _FakeParagraph(text=text, style=style)
        self.paragraphs.append(p)
        return p

    def save(self, stream: io.BytesIO) -> None:
        stream.write(b"fake-docx")


class _FakeHTML:
    captured: list[str] = []

    def __init__(self, *, string: str):
        self.string = string
        _FakeHTML.captured.append(string)

    def write_pdf(self) -> bytes:
        return self.string.encode("utf-8")


@pytest.mark.asyncio
async def test_document_pipeline_routes_to_cover_letter_docx(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(document_pipeline.template_repo, "get", lambda *args, **kwargs: {})
    monkeypatch.setattr(
        document_pipeline, "render_cover_letter_docx", lambda *args, **kwargs: b"docx-bytes"
    )

    result = await document_pipeline.document_pipeline.generate_document(
        doc_type="cover_letter",
        content="Hello",
        file_format="docx",
        candidate_name="A",
    )

    assert result == b"docx-bytes"


@pytest.mark.asyncio
async def test_document_pipeline_routes_to_cover_letter_pdf(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(document_pipeline.template_repo, "get", lambda *args, **kwargs: {})
    monkeypatch.setattr(
        document_pipeline, "render_cover_letter_pdf", lambda *args, **kwargs: b"pdf-bytes"
    )

    result = await document_pipeline.document_pipeline.generate_document(
        doc_type="cover_letter",
        content="Hello",
        file_format="pdf",
        candidate_name="A",
    )

    assert result == b"pdf-bytes"


@pytest.mark.asyncio
async def test_document_pipeline_routes_to_resume_pdf(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(document_pipeline.template_repo, "get", lambda *args, **kwargs: {})
    monkeypatch.setattr(
        document_pipeline, "render_resume_pdf", lambda *args, **kwargs: b"pdf-bytes"
    )

    result = await document_pipeline.document_pipeline.generate_document(
        doc_type="resume",
        content={"basics": {"name": "A"}},
        file_format="pdf",
    )

    assert result == b"pdf-bytes"


@pytest.mark.asyncio
async def test_document_pipeline_routes_to_resume_docx(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(document_pipeline.template_repo, "get", lambda *args, **kwargs: {})
    monkeypatch.setattr(
        document_pipeline, "render_resume_docx", lambda *args, **kwargs: b"resume-docx"
    )

    result = await document_pipeline.document_pipeline.generate_document(
        doc_type="resume",
        content={"basics": {"name": "A"}},
        file_format="docx",
    )

    assert result == b"resume-docx"


@pytest.mark.asyncio
async def test_document_pipeline_routes_to_ksc_docx(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(document_pipeline.template_repo, "get", lambda *args, **kwargs: {})
    monkeypatch.setattr(document_pipeline, "render_ksc_docx", lambda *args, **kwargs: b"ksc-docx")

    result = await document_pipeline.document_pipeline.generate_document(
        doc_type="ksc_response",
        content=[{"criterion": "Communication", "response": "Strong"}],
        file_format="docx",
    )

    assert result == b"ksc-docx"


@pytest.mark.asyncio
async def test_document_pipeline_routes_to_ksc_pdf(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(document_pipeline.template_repo, "get", lambda *args, **kwargs: {})
    monkeypatch.setattr(document_pipeline, "render_ksc_pdf", lambda *args, **kwargs: b"ksc-pdf")

    result = await document_pipeline.document_pipeline.generate_document(
        doc_type="ksc_response",
        content=[{"criterion": "Communication", "response": "Strong"}],
        file_format="pdf",
    )

    assert result == b"ksc-pdf"


@pytest.mark.asyncio
async def test_document_pipeline_raises_for_unsupported_doc_type(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(document_pipeline.template_repo, "get", lambda *args, **kwargs: {})

    with pytest.raises(ValueError, match="Unsupported document type"):
        await document_pipeline.document_pipeline.generate_document(
            doc_type="unknown",
            content="x",
            file_format="pdf",
        )


def test_generate_html_from_content_embeds_title_and_body() -> None:
    html = pdf_renderer._generate_html_from_content("My Title", "<p>Hello</p>")
    assert "<title>My Title</title>" in html
    assert "<p>Hello</p>" in html


def test_render_cover_letter_pdf_renders_candidate_and_paragraphs(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _FakeHTML.captured = []
    monkeypatch.setattr(pdf_renderer, "HTML", _FakeHTML)

    out = pdf_renderer.render_cover_letter_pdf(
        "First paragraph\n\nSecond paragraph",
        candidate_name="Jane Doe",
    )

    rendered = out.decode("utf-8")
    assert "Jane Doe" in rendered
    assert "<p>First paragraph</p>" in rendered
    assert "<p>Second paragraph</p>" in rendered


def test_render_resume_pdf_renders_sections(monkeypatch: pytest.MonkeyPatch) -> None:
    _FakeHTML.captured = []
    monkeypatch.setattr(pdf_renderer, "HTML", _FakeHTML)

    out = pdf_renderer.render_resume_pdf(
        {
            "basics": {"name": "Alex", "email": "alex@example.com", "phone": "0400"},
            "summary": "Summary text",
            "work": [{"role": "Engineer", "company": "Acme", "bullets": ["Did X"]}],
        }
    )

    rendered = out.decode("utf-8")
    assert "Professional Summary" in rendered
    assert "Engineer" in rendered
    assert "Did X" in rendered


def test_render_ksc_pdf_splits_paragraphs(monkeypatch: pytest.MonkeyPatch) -> None:
    _FakeHTML.captured = []
    monkeypatch.setattr(pdf_renderer, "HTML", _FakeHTML)

    out = pdf_renderer.render_ksc_pdf(
        [{"criterion": "Communication", "response": "Strong response\n\nMore detail"}],
        job_title="Role A",
    )

    rendered = out.decode("utf-8")
    assert "Selection Criteria: Role A" in rendered
    assert "Communication" in rendered
    assert "<p>Strong response</p>" in rendered
    assert "<p>More detail</p>" in rendered


def test_render_cover_letter_docx_builds_header_and_body(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(docx_renderer, "Document", _FakeDocument)
    monkeypatch.setattr(docx_renderer, "Pt", lambda x: x)
    monkeypatch.setattr(
        docx_renderer,
        "get_theme_tokens",
        lambda _theme: {
            "font": {"name": "Calibri", "size_pt": 11},
            "alignment": {"heading": 1, "body": 0, "contact": 0},
        },
    )

    output = docx_renderer.render_cover_letter_docx(
        "Intro\n\nBody",
        candidate_name="Jane Doe",
    )

    assert output == b"fake-docx"


def test_render_resume_docx_builds_main_sections(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(docx_renderer, "Document", _FakeDocument)
    monkeypatch.setattr(docx_renderer, "Pt", lambda x: x)
    monkeypatch.setattr(
        docx_renderer,
        "get_theme_tokens",
        lambda _theme: {
            "font": {"name": "Calibri", "size_pt": 11},
            "alignment": {"heading": 1, "body": 0, "contact": 0},
        },
    )

    output = docx_renderer.render_resume_docx(
        {
            "basics": {"name": "Alex", "email": "alex@example.com"},
            "summary": "Summary",
            "work": [{"role": "Engineer", "company": "Acme", "bullets": ["Built system"]}],
            "education": [{"qualification": "BSc", "institution": "Uni", "endDate": "2020"}],
            "skills": ["Python", "FastAPI"],
        }
    )

    assert output == b"fake-docx"


def test_render_resume_docx_supports_grouped_skills(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(docx_renderer, "Document", _FakeDocument)
    monkeypatch.setattr(docx_renderer, "Pt", lambda x: x)
    monkeypatch.setattr(
        docx_renderer,
        "get_theme_tokens",
        lambda _theme: {
            "font": {"name": "Calibri", "size_pt": 11},
            "alignment": {"heading": 1, "body": 0, "contact": 0},
        },
    )

    output = docx_renderer.render_resume_docx(
        {
            "basics": {"name": "Alex"},
            "skills": {"Technical": ["Python", "FastAPI"], "Soft": ["Communication"]},
        }
    )
    assert output == b"fake-docx"


def test_render_ksc_docx_accepts_theme_id_and_renders(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(docx_renderer, "Document", _FakeDocument)
    monkeypatch.setattr(docx_renderer, "Pt", lambda x: x)
    monkeypatch.setattr(
        docx_renderer,
        "get_theme_tokens",
        lambda _theme: {
            "font": {"name": "Calibri", "size_pt": 11},
            "alignment": {"heading": 1, "body": 0, "contact": 0},
        },
    )

    output = docx_renderer.render_ksc_docx(
        [{"criterion": "Criterion A", "response": "S\n\nT\n\nA\n\nR"}],
        job_title="Case Manager",
        theme_id="minimal",
    )

    assert output == b"fake-docx"
