"""
Extract theme configuration data from ATS-focused PDF templates.
"""

from __future__ import annotations

import re
from collections import Counter
from pathlib import Path
from statistics import median
from typing import Any

from app.core.ats_rules import ATS_RULES
from app.models.theme_config_schemas import (
    AtsComplianceInfo,
    ColorConfig,
    CoverLetterThemeConfig,
    LayoutConfig,
    ResumeThemeConfig,
    TypographyConfig,
)

try:
    import fitz
except ImportError:  # pragma: no cover - guarded at runtime
    fitz = None  # type: ignore[assignment]

try:
    import pdfplumber
except ImportError:  # pragma: no cover - guarded at runtime
    pdfplumber = None  # type: ignore[assignment]

DEFAULT_SECTION_ORDER = [
    "career_summary",
    "skills",
    "professional_experience",
    "education",
    "certifications_and_development",
]

SECTION_ALIASES = {
    "summary": "career_summary",
    "professional summary": "career_summary",
    "profile": "career_summary",
    "about": "career_summary",
    "about me": "career_summary",
    "skills": "skills",
    "technical skills": "skills",
    "core skills": "skills",
    "experience": "professional_experience",
    "work experience": "professional_experience",
    "employment history": "professional_experience",
    "professional experience": "professional_experience",
    "work history": "professional_experience",
    "education": "education",
    "qualifications": "education",
    "certifications": "certifications_and_development",
    "certifications and development": "certifications_and_development",
    "professional development": "certifications_and_development",
    "licenses": "certifications_and_development",
}

ATS_SECTION_MAP = {
    "career_summary": "summary",
    "professional_experience": "experience",
    "certifications_and_development": "certifications",
}

CONTACT_PATTERN = re.compile(
    r"(@)|(\+?\d[\d\s().-]{6,})|(linkedin\.com)|(www\.)",
    re.IGNORECASE,
)


def _require_pdf_dependencies() -> None:
    """Raise a clear runtime error if required PDF libraries are missing."""

    missing = []
    if pdfplumber is None:
        missing.append("pdfplumber")
    if fitz is None:
        missing.append("PyMuPDF")
    if missing:
        missing_list = ", ".join(missing)
        raise RuntimeError(f"Missing PDF extraction dependency: {missing_list}")


def _ensure_path(pdf_path: str | Path) -> Path:
    """Validate and normalize a PDF path."""

    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {path}")
    if path.suffix.lower() != ".pdf":
        raise ValueError(f"Expected a PDF file, received: {path}")
    return path


def _normalize_font_name(raw_font_name: str | None) -> str:
    """Strip subset prefixes and style suffixes from PDF font names."""

    if not raw_font_name:
        return "Source Sans Pro"
    font_name = raw_font_name.split("+")[-1]
    font_name = font_name.split(",")[0]
    font_name = font_name.split("-")[0]
    return font_name.strip() or "Source Sans Pro"


def _looks_bold(raw_font_name: str | None) -> bool:
    """Best-effort check for bold styling encoded in a font name."""

    if not raw_font_name:
        return False
    lowered = raw_font_name.lower()
    return "bold" in lowered or "black" in lowered or "demi" in lowered


def _safe_int(value: float, fallback: int) -> int:
    """Round a float to a positive integer with a fallback."""

    try:
        rounded = int(round(float(value)))
    except (TypeError, ValueError):
        return fallback
    return max(0, rounded)


def _slugify(value: str) -> str:
    """Convert arbitrary text into a task-safe identifier."""

    lowered = value.lower()
    normalized = re.sub(r"[^a-z0-9]+", "_", lowered)
    return normalized.strip("_") or "theme_extract"


def _titleize_slug(value: str) -> str:
    """Convert a file stem into a human-friendly label."""

    words = [word for word in re.split(r"[_\s-]+", value) if word]
    return " ".join(word.capitalize() for word in words) or "Theme Extract"


def _iter_pdf_chars(path: Path) -> list[dict[str, Any]]:
    """Collect all non-whitespace character records from a PDF."""

    _require_pdf_dependencies()
    characters: list[dict[str, Any]] = []
    with pdfplumber.open(path) as pdf:  # type: ignore[union-attr]
        for page in pdf.pages:
            for char in page.chars:
                if str(char.get("text", "")).strip():
                    characters.append(char)
    return characters


def _iter_pdf_words(path: Path) -> list[dict[str, Any]]:
    """Collect all word records from a PDF."""

    _require_pdf_dependencies()
    words: list[dict[str, Any]] = []
    with pdfplumber.open(path) as pdf:  # type: ignore[union-attr]
        for page in pdf.pages:
            words.extend(page.extract_words())
    return words


def _collect_pdf_text(path: Path) -> str:
    """Extract plain text from a PDF for heading and contact analysis."""

    _require_pdf_dependencies()
    pages: list[str] = []
    with pdfplumber.open(path) as pdf:  # type: ignore[union-attr]
        for page in pdf.pages:
            pages.append(page.extract_text() or "")
    return "\n".join(pages)


def rgb_to_hex(r: float | int, g: float | int, b: float | int) -> str:
    """Convert 0-1 floats or 0-255 ints to a canonical hex color."""

    channels: list[int] = []
    for value in (r, g, b):
        numeric = float(value)
        if 0 <= numeric <= 1:
            numeric *= 255
        channels.append(max(0, min(255, int(round(numeric)))))
    return "#{:02X}{:02X}{:02X}".format(*channels)


def _color_value_to_hex(value: Any) -> str | None:
    """Normalize PyMuPDF color values into hex strings."""

    if value is None:
        return None
    if isinstance(value, int):
        red = (value >> 16) & 255
        green = (value >> 8) & 255
        blue = value & 255
        return rgb_to_hex(red, green, blue)
    if isinstance(value, (list, tuple)) and len(value) >= 3:
        return rgb_to_hex(value[0], value[1], value[2])
    return None


def extract_fonts(pdf_path: str | Path) -> TypographyConfig:
    """Extract the dominant font family, sizes, and approximate weights."""

    path = _ensure_path(pdf_path)
    characters = _iter_pdf_chars(path)
    if not characters:
        return TypographyConfig()

    font_counter: Counter[str] = Counter()
    body_sizes: list[float] = []
    heading_sizes: list[float] = []
    name_sizes: list[float] = []
    body_font_names: list[str] = []
    heading_font_names: list[str] = []

    raw_sizes = [float(char.get("size", 0.0)) for char in characters if char.get("size")]
    size_cutoff = median(raw_sizes) if raw_sizes else 11.0
    top_size = max(raw_sizes) if raw_sizes else 18.0

    for char in characters:
        raw_font_name = str(char.get("fontname", ""))
        font_name = _normalize_font_name(raw_font_name)
        font_counter[font_name] += 1

        size = float(char.get("size", 0.0))
        if size <= size_cutoff + 0.5:
            body_sizes.append(size)
            body_font_names.append(raw_font_name)
        if size >= size_cutoff + 2:
            heading_sizes.append(size)
            heading_font_names.append(raw_font_name)
        if size >= top_size - 0.5:
            name_sizes.append(size)

    primary_font = font_counter.most_common(1)[0][0]
    base_font = _safe_int(median(body_sizes) if body_sizes else size_cutoff, 11)
    heading_font = _safe_int(
        median(heading_sizes) if heading_sizes else max(base_font + 3, 14),
        14,
    )
    name_font = _safe_int(max(name_sizes) if name_sizes else max(heading_font + 4, 18), 18)

    return TypographyConfig(
        fontFamily=primary_font,
        baseFontSizePt=max(10, min(14, base_font)),
        headingFontSizePt=max(12, min(18, heading_font)),
        nameFontSizePt=max(16, min(24, name_font)),
        headingFontWeight=700 if any(_looks_bold(name) for name in heading_font_names) else 400,
        bodyFontWeight=700 if any(_looks_bold(name) for name in body_font_names) else 400,
    )


def extract_colors(pdf_path: str | Path) -> ColorConfig:
    """Extract the dominant colors from PDF text spans without token mapping."""

    path = _ensure_path(pdf_path)
    _require_pdf_dependencies()

    color_weights: Counter[str] = Counter()
    heading_weights: Counter[str] = Counter()
    first_page_name_color: str | None = None
    largest_size_on_first_page = 0.0
    span_sizes: list[float] = []

    document = fitz.open(path)  # type: ignore[union-attr]
    try:
        blocks = document[0].get_text("dict").get("blocks", []) if document.page_count else []
        for block in blocks:
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    span_sizes.append(float(span.get("size", 0.0)))

        heading_cutoff = (median(span_sizes) + 2.0) if span_sizes else 13.0

        for page_index, page in enumerate(document):
            blocks = page.get_text("dict").get("blocks", [])
            for block in blocks:
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        text = str(span.get("text", "")).strip()
                        if not text:
                            continue

                        color = _color_value_to_hex(span.get("color"))
                        if not color:
                            continue

                        text_weight = max(len(text), 1)
                        color_weights[color] += text_weight

                        size = float(span.get("size", 0.0))
                        if size >= heading_cutoff:
                            heading_weights[color] += text_weight

                        if page_index == 0 and size >= largest_size_on_first_page:
                            largest_size_on_first_page = size
                            first_page_name_color = color
    finally:
        document.close()

    palette = [color for color, _ in color_weights.most_common()]
    body_color = palette[0] if palette else "#000000"
    header_color = (
        heading_weights.most_common(1)[0][0]
        if heading_weights
        else (palette[1] if len(palette) > 1 else body_color)
    )
    name_color = first_page_name_color or header_color or body_color

    divider = "#E0E0E0"
    accent = "#C55A3B"
    for candidate in palette[1:]:
        if candidate not in {body_color, header_color}:
            accent = candidate
            break
    for candidate in palette[1:]:
        if candidate not in {body_color, header_color, accent}:
            divider = candidate
            break

    return ColorConfig(
        bodyText=body_color,
        headerText=header_color,
        nameColor=name_color,
        divider=divider,
        accent=accent,
        backgroundColor="#FFFFFF",
    )


def extract_layout(pdf_path: str | Path) -> LayoutConfig:
    """Estimate margins, section spacing, and column layout from a PDF."""

    path = _ensure_path(pdf_path)
    _require_pdf_dependencies()

    with pdfplumber.open(path) as pdf:  # type: ignore[union-attr]
        if not pdf.pages:
            return LayoutConfig()

        page = pdf.pages[0]
        words = page.extract_words()
        if not words:
            return LayoutConfig()

        page_width = float(page.width)
        page_height = float(page.height)

        left_margin = min(float(word.get("x0", 72.0)) for word in words)
        right_margin = page_width - max(float(word.get("x1", page_width - 72.0)) for word in words)
        top_margin = min(float(word.get("top", 72.0)) for word in words)
        bottom_margin = page_height - max(
            float(word.get("bottom", page_height - 72.0)) for word in words
        )

        left_words = [word for word in words if float(word.get("x0", 0.0)) < page_width * 0.42]
        right_words = [word for word in words if float(word.get("x0", 0.0)) > page_width * 0.58]
        variant = "single_column"
        if words and right_words and len(right_words) / len(words) >= 0.15:
            left_lines = {round(float(word.get("top", 0.0))) for word in left_words}
            right_lines = {round(float(word.get("top", 0.0))) for word in right_words}
            if left_lines and right_lines and len(left_lines.intersection(right_lines)) >= 2:
                variant = "two_column_sidebar"

        unique_tops = sorted({round(float(word.get("top", 0.0)), 1) for word in words})
        vertical_gaps = [
            current - previous
            for previous, current in zip(unique_tops, unique_tops[1:])
            if current - previous > 4
        ]
        average_gap = sum(vertical_gaps) / len(vertical_gaps) if vertical_gaps else 12.0
        if average_gap < 10:
            spacing_scale = "compact"
        elif average_gap > 15:
            spacing_scale = "spacious"
        else:
            spacing_scale = "default"

    sidebar_sections: list[str] = []
    if variant == "two_column_sidebar":
        sidebar_sections = ["skills", "education", "certifications_and_development"]

    return LayoutConfig(
        spacingScale=spacing_scale,
        variant=variant,
        sidebarSections=sidebar_sections,
        marginsPt={
            "top": _safe_int(top_margin, 72),
            "bottom": _safe_int(bottom_margin, 72),
            "left": _safe_int(left_margin, 72),
            "right": _safe_int(right_margin, 72),
        },
    )


def extract_section_order(pdf_path: str | Path) -> list[str]:
    """Map detected PDF headings to canonical section identifiers."""

    path = _ensure_path(pdf_path)
    text = _collect_pdf_text(path)
    lines = [line.strip(" :.-").lower() for line in text.splitlines() if line.strip()]

    detected: list[str] = []
    for line in lines:
        if line in SECTION_ALIASES:
            mapped = SECTION_ALIASES[line]
            if mapped not in detected:
                detected.append(mapped)
            continue

        if len(line.split()) > 4:
            continue
        for alias, mapped in SECTION_ALIASES.items():
            if alias in line and mapped not in detected:
                detected.append(mapped)
                break

    if not detected:
        return list(DEFAULT_SECTION_ORDER)
    return detected


def calculate_ats_score(
    extracted_data: dict[str, Any],
    doc_type: str = "resume",
) -> tuple[int, list[str]]:
    """
    Score ATS safety for a style extraction payload.

    This intentionally allows some degraded but usable layouts such as a
    two-column sidebar. The score expresses risk rather than an absolute ban.
    """

    effective_doc_type = "full_letter" if doc_type == "cover_letter" else doc_type
    rules = ATS_RULES.get(effective_doc_type, {})
    prohibited = set(rules.get("prohibited", []))
    score = 10
    issues: list[str] = []

    if extracted_data.get("has_tables"):
        score -= 2
        issues.append(
            "table_detected: Tables reduce parser accuracy and are prohibited "
            "by format_rules.json (KB Section 6)."
        )

    columns = int(extracted_data.get("columns", 1) or 1)
    if columns > 1:
        penalty = 1 if "columns" in prohibited else 0
        score -= penalty
        issues.append(
            "two_column_layout: Two-column layouts are usable but less reliable "
            "for ATS parsing than single-column formats (KB Section 6)."
        )

    if extracted_data.get("has_images"):
        score -= 2
        issues.append(
            "image_detected: Embedded images can be skipped by ATS parsers " "(KB Section 6)."
        )

    if extracted_data.get("uses_text_boxes"):
        score -= 1
        issues.append(
            "text_box_detected: Text boxes can disrupt linear text extraction " "(KB Section 6)."
        )

    body_font_size = int(extracted_data.get("body_font_size_pt", 11) or 11)
    if body_font_size < 10:
        score -= 1
        issues.append(
            "small_body_text: Body text under 10pt hurts readability and ATS "
            "review quality (KB Section 3)."
        )

    detected_sections = set(extracted_data.get("detected_sections", []))
    ats_sections = {ATS_SECTION_MAP.get(section, section) for section in detected_sections}
    if extracted_data.get("has_contact_info"):
        ats_sections.add("contact")

    for required in rules.get("required_sections", []):
        if required not in ats_sections:
            score -= 1
            issues.append(
                f"missing_section: Expected '{required}' section for {effective_doc_type} "
                "based on format_rules.json."
            )

    if extracted_data.get("nonstandard_headings"):
        score -= 1
        issues.append(
            "nonstandard_heading: Uncommon section labels can weaken heading "
            "recognition in ATS systems (KB Section 6)."
        )

    return max(0, min(10, score)), issues


def extract_theme_from_pdf(
    pdf_path: str | Path,
    label: str | None = None,
    doc_type: str = "resume",
    target_sector: str | None = None,
) -> ResumeThemeConfig | CoverLetterThemeConfig:
    """Extract a concrete theme configuration from a PDF file."""

    path = _ensure_path(pdf_path)
    typography = extract_fonts(path)
    colors = extract_colors(path)
    layout = extract_layout(path)
    section_order = extract_section_order(path)
    layout.order = section_order

    text = _collect_pdf_text(path)
    canonical_label = label or _titleize_slug(path.stem)
    inferred_id = _slugify(canonical_label)
    has_contact_info = bool(CONTACT_PATTERN.search(text))

    known_headings = set(SECTION_ALIASES)
    nonstandard_headings = False
    for raw_line in [item.strip(" :.-") for item in text.splitlines() if item.strip()]:
        if len(raw_line.split()) <= 4 and raw_line.isupper():
            lowered = raw_line.lower()
            if lowered not in known_headings:
                nonstandard_headings = True
                break

    ats_score, ats_issues = calculate_ats_score(
        {
            "columns": 2 if layout.variant == "two_column_sidebar" else 1,
            "has_tables": False,
            "has_images": False,
            "uses_text_boxes": False,
            "body_font_size_pt": typography.baseFontSizePt,
            "detected_sections": section_order,
            "has_contact_info": has_contact_info,
            "nonstandard_headings": nonstandard_headings,
        },
        doc_type=doc_type,
    )

    description = (
        f"Extracted from {path.name} with ATS score {ats_score}/10 " f"and preserved PDF styling."
    )
    ats_info = AtsComplianceInfo(score=ats_score, issues=ats_issues)

    if doc_type == "cover_letter":
        cover_layout = {
            "spacingScale": layout.spacingScale,
            "marginsPt": layout.marginsPt,
            "variant": "single_column",
        }
        return CoverLetterThemeConfig(
            id=inferred_id,
            label=canonical_label,
            description=description,
            colors=colors,
            typography=typography,
            layout=cover_layout,
            ats_compliance=ats_info,
            source_pdf=path.name,
        )

    return ResumeThemeConfig(
        id=inferred_id,
        label=canonical_label,
        description=description,
        colors=colors,
        typography=typography,
        layout=layout,
        ats_compliance=ats_info,
        source_pdf=path.name,
        target_sector=target_sector,
    )
