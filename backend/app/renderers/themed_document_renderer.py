"""
Theme-aware HTML and PDF rendering for resume and cover-letter documents.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from html import escape
from typing import Any

from jinja2 import Template
from weasyprint import HTML

from app.models.theme_config_schemas import CoverLetterThemeConfig, ResumeThemeConfig

RESUME_TEMPLATE = Template(
    """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>
  <style>
    @page {
      margin: {{ margins.top }}pt {{ margins.right }}pt {{ margins.bottom }}pt {{ margins.left }}pt;
    }
    body {
      font-family: '{{ typography.fontFamily }}', sans-serif;
      color: {{ colors.bodyText }};
      background: {{ colors.backgroundColor }};
      font-size: {{ typography.baseFontSizePt }}pt;
      line-height: 1.45;
      margin: 0;
    }
    h1, h2, h3, p, ul {
      margin: 0;
    }
    .page {
      width: 100%;
    }
    .header {
      margin-bottom: {{ section_gap }}pt;
      border-bottom: 1px solid {{ colors.divider }};
      padding-bottom: 10pt;
    }
    .name {
      color: {{ colors.nameColor }};
      font-size: {{ typography.nameFontSizePt }}pt;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 4pt;
    }
    .headline {
      color: {{ colors.headerText }};
      font-size: {{ typography.headingFontSizePt }}pt;
      font-weight: {{ typography.headingFontWeight }};
      margin-bottom: 6pt;
    }
    .contact {
      color: {{ colors.bodyText }};
      font-size: {{ contact_font_size }}pt;
    }
    .layout {
      display: {% if has_sidebar %}table{% else %}block{% endif %};
      width: 100%;
      table-layout: fixed;
    }
    .main {
      display: {% if has_sidebar %}table-cell{% else %}block{% endif %};
      width: {% if has_sidebar %}70%{% else %}100%{% endif %};
      vertical-align: top;
      padding-right: {% if has_sidebar %}16pt{% else %}0{% endif %};
    }
    .sidebar {
      display: {% if has_sidebar %}table-cell{% else %}none{% endif %};
      width: 30%;
      vertical-align: top;
      padding-left: 12pt;
      border-left: 1px solid {{ colors.divider }};
    }
    .section {
      margin-bottom: {{ section_gap }}pt;
    }
    .section-title {
      color: {{ colors.headerText }};
      font-size: {{ typography.headingFontSizePt }}pt;
      font-weight: {{ typography.headingFontWeight }};
      margin-bottom: 6pt;
    }
    .section-body p + p {
      margin-top: 6pt;
    }
    .entry {
      margin-bottom: 8pt;
    }
    .entry-title {
      font-weight: 700;
    }
    .entry-meta {
      color: {{ colors.accent }};
      font-size: {{ meta_font_size }}pt;
    }
    ul {
      padding-left: 16pt;
      margin-top: 4pt;
    }
    li + li {
      margin-top: 2pt;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="name">{{ name }}</div>
      {% if headline %}<div class="headline">{{ headline }}</div>{% endif %}
      {% if contact_line %}<div class="contact">{{ contact_line }}</div>{% endif %}
    </div>
    <div class="layout">
      <div class="main">{{ main_html | safe }}</div>
      {% if has_sidebar %}<div class="sidebar">{{ sidebar_html | safe }}</div>{% endif %}
    </div>
  </div>
</body>
</html>
"""
)

COVER_LETTER_TEMPLATE = Template(
    """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>
  <style>
    @page {
      margin: {{ margins.top }}pt {{ margins.right }}pt {{ margins.bottom }}pt {{ margins.left }}pt;
    }
    body {
      font-family: '{{ typography.fontFamily }}', sans-serif;
      color: {{ colors.bodyText }};
      background: {{ colors.backgroundColor }};
      font-size: {{ typography.baseFontSizePt }}pt;
      line-height: 1.55;
      margin: 0;
    }
    .header {
      margin-bottom: {{ section_gap }}pt;
    }
    .name {
      color: {{ colors.nameColor }};
      font-size: {{ typography.nameFontSizePt }}pt;
      font-weight: 700;
      margin-bottom: 4pt;
    }
    .contact {
      font-size: {{ contact_font_size }}pt;
    }
    .recipient {
      margin-bottom: {{ section_gap }}pt;
    }
    .greeting {
      margin-bottom: 10pt;
      color: {{ colors.headerText }};
      font-weight: {{ typography.headingFontWeight }};
    }
    p {
      margin: 0 0 10pt 0;
    }
    .signature {
      margin-top: {{ section_gap }}pt;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">{{ sender_name }}</div>
    {% if contact_line %}<div class="contact">{{ contact_line }}</div>{% endif %}
  </div>
  {% if recipient_block %}<div class="recipient">{{ recipient_block | safe }}</div>{% endif %}
  {% if greeting %}<div class="greeting">{{ greeting }}</div>{% endif %}
  {{ body_html | safe }}
  {% if closing %}<p class="signature">{{ closing }}</p>{% endif %}
  {% if signature_name %}<p>{{ signature_name }}</p>{% endif %}
</body>
</html>
"""
)

SECTION_TITLES = {
    "career_summary": "Professional Summary",
    "skills": "Skills",
    "professional_experience": "Professional Experience",
    "education": "Education",
    "certifications_and_development": "Certifications and Development",
}


def _ensure_mapping(value: Mapping[str, Any] | Any) -> Mapping[str, Any]:
    """Convert a pydantic model or mapping to a plain mapping."""

    if isinstance(value, Mapping):
        return value
    if hasattr(value, "model_dump"):
        return value.model_dump()
    raise TypeError("Expected a mapping-like document payload")


def _coerce_resume_theme(
    theme_config: ResumeThemeConfig | Mapping[str, Any],
) -> ResumeThemeConfig:
    """Normalize a resume theme config input."""

    if isinstance(theme_config, ResumeThemeConfig):
        return theme_config
    return ResumeThemeConfig.model_validate(theme_config)


def _coerce_cover_letter_theme(
    theme_config: CoverLetterThemeConfig | Mapping[str, Any],
) -> CoverLetterThemeConfig:
    """Normalize a cover letter theme config input."""

    if isinstance(theme_config, CoverLetterThemeConfig):
        return theme_config
    return CoverLetterThemeConfig.model_validate(theme_config)


def _spacing_to_gap(spacing_scale: str) -> int:
    """Map semantic spacing labels to printable point values."""

    return {"compact": 10, "default": 14, "spacious": 18}.get(spacing_scale, 14)


def _normalize_contact_line(data: Mapping[str, Any]) -> str:
    """Build a single contact line from any common resume structure."""

    personal = _ensure_mapping(data.get("personal_info", {})) if data.get("personal_info") else {}
    basics = _ensure_mapping(data.get("basics", {})) if data.get("basics") else {}
    source = personal or basics or data

    parts = []
    for key in ("email", "phone", "location", "linkedin", "website"):
        value = source.get(key)
        if value:
            parts.append(escape(str(value)))
    return " | ".join(parts)


def _normalize_name(data: Mapping[str, Any]) -> str:
    """Read the candidate name from common document shapes."""

    personal = _ensure_mapping(data.get("personal_info", {})) if data.get("personal_info") else {}
    basics = _ensure_mapping(data.get("basics", {})) if data.get("basics") else {}
    for source in (personal, basics, data):
        name = source.get("name")
        if name:
            return escape(str(name))
    return "Candidate"


def _normalize_headline(data: Mapping[str, Any]) -> str:
    """Read the top-line role/title from common document shapes."""

    personal = _ensure_mapping(data.get("personal_info", {})) if data.get("personal_info") else {}
    basics = _ensure_mapping(data.get("basics", {})) if data.get("basics") else {}
    for source in (personal, basics, data):
        for key in ("headline", "title", "target_role"):
            value = source.get(key)
            if value:
                return escape(str(value))
    return ""


def _listify(value: Any) -> list[Any]:
    """Coerce optional list-like values to a plain list."""

    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    return [value]


def _paragraphs_to_html(value: Any) -> str:
    """Render plain text or paragraph lists to simple HTML paragraphs."""

    if value is None:
        return ""
    if isinstance(value, list):
        paragraphs = [str(item).strip() for item in value if str(item).strip()]
    else:
        text = str(value)
        paragraphs = [part.strip() for part in text.split("\n\n") if part.strip()]
    return "".join(f"<p>{escape(paragraph)}</p>" for paragraph in paragraphs)


def _bullets_to_html(items: Sequence[str]) -> str:
    """Render bullet items to HTML."""

    clean_items = [escape(str(item)) for item in items if str(item).strip()]
    if not clean_items:
        return ""
    rendered = "".join(f"<li>{item}</li>" for item in clean_items)
    return f"<ul>{rendered}</ul>"


def _render_experience(entries: list[Any]) -> str:
    """Render experience items from multiple possible data shapes."""

    chunks: list[str] = []
    for raw_entry in entries:
        entry = _ensure_mapping(raw_entry)
        title = entry.get("title") or entry.get("role") or entry.get("position") or "Role"
        company = entry.get("company") or entry.get("organization") or entry.get("employer")
        start = entry.get("start_date") or entry.get("startDate")
        end = (
            entry.get("end_date")
            or entry.get("endDate")
            or ("Present" if entry.get("current") else None)
        )

        meta_parts = []
        if company:
            meta_parts.append(str(company))
        if start or end:
            if start and end:
                meta_parts.append(f"{start} - {end}")
            else:
                meta_parts.append(str(start or end))

        bullets = _listify(entry.get("bullets") or entry.get("achievements"))
        if not bullets and entry.get("description"):
            bullets = [entry["description"]]

        meta_html = ""
        if meta_parts:
            meta_html = f"<div class='entry-meta'>{escape(' | '.join(meta_parts))}</div>"

        chunks.append(
            "<div class='entry'>"
            f"<div class='entry-title'>{escape(str(title))}</div>"
            f"{meta_html}"
            f"{_bullets_to_html([str(item) for item in bullets])}"
            "</div>"
        )
    return "".join(chunks)


def _render_education(entries: list[Any]) -> str:
    """Render education items from multiple possible data shapes."""

    chunks: list[str] = []
    for raw_entry in entries:
        entry = _ensure_mapping(raw_entry)
        degree = (
            entry.get("degree")
            or entry.get("qualification")
            or entry.get("title")
            or "Qualification"
        )
        field = entry.get("field")
        institution = entry.get("institution") or entry.get("school") or entry.get("provider")
        year = entry.get("year") or entry.get("graduation_year")

        title = str(degree)
        if field:
            title = f"{title}, {field}"

        meta_parts = [str(item) for item in (institution, year) if item]
        meta_html = ""
        if meta_parts:
            meta_html = f"<div class='entry-meta'>{escape(' | '.join(meta_parts))}</div>"

        chunks.append(
            "<div class='entry'>"
            f"<div class='entry-title'>{escape(title)}</div>"
            f"{meta_html}"
            "</div>"
        )
    return "".join(chunks)


def _render_certifications(entries: list[Any]) -> str:
    """Render certification items."""

    chunks: list[str] = []
    for raw_entry in entries:
        entry = (
            _ensure_mapping(raw_entry)
            if isinstance(raw_entry, Mapping) or hasattr(raw_entry, "model_dump")
            else {"name": raw_entry}
        )
        name = entry.get("name") or entry.get("title") or "Certification"
        issuer = entry.get("issuer") or entry.get("provider")
        year = entry.get("year") or entry.get("date")
        meta_parts = [str(item) for item in (issuer, year) if item]
        meta_html = ""
        if meta_parts:
            meta_html = f"<div class='entry-meta'>{escape(' | '.join(meta_parts))}</div>"
        chunks.append(
            "<div class='entry'>"
            f"<div class='entry-title'>{escape(str(name))}</div>"
            f"{meta_html}"
            "</div>"
        )
    return "".join(chunks)


def _render_skills(value: Any) -> str:
    """Render skills whether stored as a flat list or grouped mapping."""

    if value is None:
        return ""
    if isinstance(value, Mapping):
        parts = []
        for category, skills in value.items():
            skills_list = [str(item) for item in _listify(skills) if str(item).strip()]
            if skills_list:
                parts.append(
                    f"<p><strong>{escape(str(category))}:</strong> "
                    f"{escape(', '.join(skills_list))}</p>"
                )
        return "".join(parts)
    skills = [str(item) for item in _listify(value) if str(item).strip()]
    return _bullets_to_html(skills)


def _build_section(title: str, body_html: str) -> str:
    """Wrap a section in the shared section chrome."""

    if not body_html:
        return ""
    return (
        "<section class='section'>"
        f"<h2 class='section-title'>{escape(title)}</h2>"
        f"<div class='section-body'>{body_html}</div>"
        "</section>"
    )


def _collect_resume_sections(document: Mapping[str, Any]) -> dict[str, str]:
    """Normalize resume content into canonical section HTML blocks."""

    summary_value = (
        document.get("career_summary")
        or document.get("summary")
        or document.get("professional_summary")
    )
    skills_value = document.get("skills")
    experience_value = (
        document.get("professional_experience")
        or document.get("experience")
        or document.get("work")
    )
    education_value = document.get("education")
    certification_value = (
        document.get("certifications_and_development")
        or document.get("certifications")
        or document.get("professional_development")
    )

    return {
        "career_summary": _build_section(
            SECTION_TITLES["career_summary"],
            _paragraphs_to_html(summary_value),
        ),
        "skills": _build_section(
            SECTION_TITLES["skills"],
            _render_skills(skills_value),
        ),
        "professional_experience": _build_section(
            SECTION_TITLES["professional_experience"],
            _render_experience(_listify(experience_value)),
        ),
        "education": _build_section(
            SECTION_TITLES["education"],
            _render_education(_listify(education_value)),
        ),
        "certifications_and_development": _build_section(
            SECTION_TITLES["certifications_and_development"],
            _render_certifications(_listify(certification_value)),
        ),
    }


class ThemedDocumentRenderer:
    """Render HTML and PDF documents using extracted theme configurations."""

    def render_resume_html(
        self,
        theme_config: ResumeThemeConfig | Mapping[str, Any],
        resume_data: Mapping[str, Any] | Any,
        title: str = "Resume",
    ) -> str:
        """Render resume data to themed HTML."""

        theme = _coerce_resume_theme(theme_config)
        document = _ensure_mapping(resume_data)
        sections = _collect_resume_sections(document)

        ordered_keys = theme.layout.order or list(SECTION_TITLES)
        sidebar_keys = set(theme.layout.sidebarSections or [])

        main_html_parts: list[str] = []
        sidebar_html_parts: list[str] = []
        for key in ordered_keys:
            html = sections.get(key, "")
            if not html:
                continue
            if key in sidebar_keys and theme.layout.variant == "two_column_sidebar":
                sidebar_html_parts.append(html)
            else:
                main_html_parts.append(html)

        for key, html in sections.items():
            if html and key not in ordered_keys:
                main_html_parts.append(html)

        section_gap = _spacing_to_gap(theme.layout.spacingScale)
        return RESUME_TEMPLATE.render(
            title=title,
            margins=theme.layout.marginsPt,
            typography=theme.typography,
            colors=theme.colors,
            section_gap=section_gap,
            contact_font_size=max(theme.typography.baseFontSizePt - 1, 9),
            meta_font_size=max(theme.typography.baseFontSizePt - 1, 9),
            name=_normalize_name(document),
            headline=_normalize_headline(document),
            contact_line=_normalize_contact_line(document),
            has_sidebar=bool(sidebar_html_parts),
            main_html="".join(main_html_parts),
            sidebar_html="".join(sidebar_html_parts),
        )

    def render_resume_pdf(
        self,
        theme_config: ResumeThemeConfig | Mapping[str, Any],
        resume_data: Mapping[str, Any] | Any,
        title: str = "Resume",
    ) -> bytes:
        """Render resume data to PDF bytes."""

        html = self.render_resume_html(
            theme_config=theme_config, resume_data=resume_data, title=title
        )
        return HTML(string=html).write_pdf()

    def render_cover_letter_html(
        self,
        theme_config: CoverLetterThemeConfig | Mapping[str, Any],
        cover_letter_data: Mapping[str, Any] | Any,
        title: str = "Cover Letter",
    ) -> str:
        """Render cover-letter data to themed HTML."""

        theme = _coerce_cover_letter_theme(theme_config)
        document = _ensure_mapping(cover_letter_data)
        layout = theme.layout if isinstance(theme.layout, Mapping) else {}
        margins = layout.get("marginsPt", {"top": 72, "bottom": 72, "left": 72, "right": 72})
        spacing_scale = str(layout.get("spacingScale", "default"))

        sender_name = (
            document.get("candidate_name") or document.get("name") or _normalize_name(document)
        )
        contact_line = _normalize_contact_line(document)
        recipient_lines = [
            str(item).strip()
            for item in _listify(
                document.get("recipient_lines")
                or document.get("recipient")
                or document.get("company_address")
            )
            if str(item).strip()
        ]
        recipient_block = "".join(f"<p>{escape(line)}</p>" for line in recipient_lines)

        body_value = document.get("body") or document.get("content") or document.get("letter")
        if body_value is None:
            paragraphs = _listify(document.get("paragraphs"))
            body_value = "\n\n".join(str(item) for item in paragraphs if str(item).strip())

        return COVER_LETTER_TEMPLATE.render(
            title=title,
            margins=margins,
            typography=theme.typography,
            colors=theme.colors,
            section_gap=_spacing_to_gap(spacing_scale),
            contact_font_size=max(theme.typography.baseFontSizePt - 1, 9),
            sender_name=escape(str(sender_name)),
            contact_line=contact_line,
            recipient_block=recipient_block,
            greeting=escape(str(document.get("greeting", ""))),
            body_html=_paragraphs_to_html(body_value),
            closing=escape(str(document.get("closing", ""))),
            signature_name=escape(str(document.get("signature_name") or sender_name)),
        )

    def render_cover_letter_pdf(
        self,
        theme_config: CoverLetterThemeConfig | Mapping[str, Any],
        cover_letter_data: Mapping[str, Any] | Any,
        title: str = "Cover Letter",
    ) -> bytes:
        """Render cover-letter data to PDF bytes."""

        html = self.render_cover_letter_html(
            theme_config=theme_config,
            cover_letter_data=cover_letter_data,
            title=title,
        )
        return HTML(string=html).write_pdf()
