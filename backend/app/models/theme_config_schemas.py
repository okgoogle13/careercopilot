"""
Theme configuration schemas for PDF template styling extraction.

These models separate styling concerns (theme config) from document content.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


def _timestamp() -> str:
    """Return an ISO 8601 UTC timestamp string."""

    return datetime.now(timezone.utc).isoformat()


class TypographyConfig(BaseModel):
    """Typography configuration extracted from a PDF."""

    fontFamily: str = Field(
        default="Source Sans Pro",
        description="Primary body font as extracted from the source PDF.",
    )
    baseFontSizePt: int = Field(
        default=11,
        ge=10,
        le=14,
        description="Body text size in points.",
    )
    headingFontSizePt: int = Field(
        default=14,
        ge=12,
        le=18,
        description="Section heading size in points.",
    )
    nameFontSizePt: int = Field(
        default=18,
        ge=16,
        le=24,
        description="Applicant name size in points.",
    )
    headingFontWeight: int = Field(
        default=700,
        description="Font weight for headings (400 = normal, 700 = bold).",
    )
    bodyFontWeight: int = Field(
        default=400,
        description="Font weight for body text (400 = normal, 700 = bold).",
    )


class ColorConfig(BaseModel):
    """Color configuration extracted from a PDF."""

    bodyText: str = Field(
        default="#000000",
        pattern=r"^#[0-9A-Fa-f]{6}$",
        description="Primary body text color as a hex value.",
    )
    headerText: str = Field(
        default="#2E5B4A",
        pattern=r"^#[0-9A-Fa-f]{6}$",
        description="Primary heading color as a hex value.",
    )
    nameColor: str = Field(
        default="#000000",
        pattern=r"^#[0-9A-Fa-f]{6}$",
        description="Applicant name color as a hex value.",
    )
    divider: str = Field(
        default="#E0E0E0",
        pattern=r"^#[0-9A-Fa-f]{6}$",
        description="Divider or rule color as a hex value.",
    )
    accent: str = Field(
        default="#C55A3B",
        pattern=r"^#[0-9A-Fa-f]{6}$",
        description="Accent color as a hex value.",
    )
    backgroundColor: str = Field(
        default="#FFFFFF",
        pattern=r"^#[0-9A-Fa-f]{6}$",
        description="Page background color as a hex value.",
    )


class LayoutConfig(BaseModel):
    """Layout configuration extracted from a PDF."""

    spacingScale: Literal["compact", "default", "spacious"] = Field(
        default="default",
        description="Section spacing density based on measured vertical gaps.",
    )
    order: list[str] = Field(
        default_factory=lambda: [
            "career_summary",
            "skills",
            "professional_experience",
            "education",
            "certifications_and_development",
        ],
        description="Canonical document section order.",
    )
    variant: Literal["single_column", "two_column_sidebar"] = Field(
        default="single_column",
        description="Detected layout variant.",
    )
    sidebarSections: list[str] = Field(
        default_factory=list,
        description="Sections rendered in a sidebar for two-column layouts.",
    )
    marginsPt: dict[str, int] = Field(
        default_factory=lambda: {
            "top": 72,
            "bottom": 72,
            "left": 72,
            "right": 72,
        },
        description="Page margins in points.",
    )


class AtsComplianceInfo(BaseModel):
    """ATS compliance scoring metadata for a theme."""

    score: int = Field(
        default=10,
        ge=0,
        le=10,
        description="ATS safety score where 10 is safest.",
    )
    issues: list[str] = Field(
        default_factory=list,
        description="Human-readable ATS caveats and references.",
    )


class ResumeThemeConfig(BaseModel):
    """Theme configuration for resume rendering."""

    id: str = Field(
        ...,
        pattern=r"^[a-z0-9_]+$",
        description="Stable theme identifier.",
    )
    label: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Human-readable theme name.",
    )
    description: str = Field(
        ...,
        min_length=10,
        max_length=200,
        description="Short description of the theme and ATS profile.",
    )
    colors: ColorConfig
    typography: TypographyConfig
    layout: LayoutConfig
    ats_compliance: AtsComplianceInfo
    source_pdf: str | None = Field(
        default=None,
        description="Original PDF filename, if applicable.",
    )
    created_at: str = Field(
        default_factory=_timestamp,
        description="ISO 8601 timestamp when the theme was created.",
    )
    target_sector: str | None = Field(
        default=None,
        description="Optional target sector hint for downstream UX.",
    )


class CoverLetterThemeConfig(BaseModel):
    """Theme configuration for cover letter rendering."""

    id: str = Field(..., pattern=r"^[a-z0-9_]+$")
    label: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=10, max_length=200)
    colors: ColorConfig
    typography: TypographyConfig
    layout: dict[str, object] = Field(
        default_factory=dict,
        description="Simplified layout configuration for cover letters.",
    )
    ats_compliance: AtsComplianceInfo
    source_pdf: str | None = None
    created_at: str = Field(default_factory=_timestamp)
