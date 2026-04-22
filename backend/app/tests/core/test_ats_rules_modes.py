import pytest

from app.core.ats_rules import validate_template_schema

REQUIRED_BLOCKS = [
    {"kind": "section", "title": "Contact"},
    {"kind": "section", "title": "Summary"},
    {"kind": "section", "title": "Experience"},
    {"kind": "section", "title": "Skills"},
]

PROFESSIONAL_TEMPLATE = {
    "atsProfile": {
        "columns": 1,
        "hasSidebar": False,
        "allowsTables": False,
        "allowsImages": False,
    },
    "blocks": REQUIRED_BLOCKS,
}

CREATIVE_TEMPLATE = {
    "atsProfile": {
        "columns": 2,
        "hasSidebar": True,
        "allowsTables": False,
        "allowsImages": False,
    },
    "blocks": REQUIRED_BLOCKS,
}


def test_professional_passes_ats_strict():
    validate_template_schema(PROFESSIONAL_TEMPLATE, "resume", mode="ats_strict")


def test_professional_passes_visual():
    validate_template_schema(PROFESSIONAL_TEMPLATE, "resume", mode="visual")


def test_creative_rejected_in_ats_strict():
    with pytest.raises(ValueError, match="Multi-column layouts are not ATS-safe"):
        validate_template_schema(CREATIVE_TEMPLATE, "resume", mode="ats_strict")


def test_creative_accepted_in_visual():
    # Should not raise — visual mode permits multi-column/sidebar structures
    validate_template_schema(CREATIVE_TEMPLATE, "resume", mode="visual")


def test_invalid_mode_raises():
    with pytest.raises(ValueError, match="Invalid mode"):
        validate_template_schema(PROFESSIONAL_TEMPLATE, "resume", mode="unknown")
