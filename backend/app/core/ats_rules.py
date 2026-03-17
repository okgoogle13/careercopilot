import json
from pathlib import Path
from typing import Any

# Path to format_rules.json
FORMAT_RULES_PATH = (
    Path(__file__).parent.parent.parent.parent / "ai" / "prompts" / "backend" / "format_rules.json"
)


def load_ats_rules() -> dict[str, Any]:
    with open(FORMAT_RULES_PATH, encoding="utf-8") as f:
        return json.load(f)


ATS_RULES = load_ats_rules()


def validate_template_schema(template: dict, doc_type: str) -> None:
    """
    Validates a template configuration against ATS safety rules.
    """
    ats_profile = template.get("atsProfile", {})

    # 1. Structural checks
    if ats_profile.get("columns", 1) != 1:
        raise ValueError("Multi-column layouts are not ATS-safe")

    if ats_profile.get("allowsTables", False):
        raise ValueError("Tables are disabled for ATS-safe templates")

    if ats_profile.get("allowsImages", False):
        raise ValueError("Images are disabled for ATS-safe templates")

    # 2. Heading and section checks
    rules_for_type = ATS_RULES.get(doc_type, {})
    required_headings = rules_for_type.get("required_sections", [])

    # Assuming template["blocks"] contains the layout structure
    present_headings = {
        b.get("title", "").lower() for b in template.get("blocks", []) if b.get("kind") == "section"
    }

    # We do a loose check or exact check based on lowercase
    missing = set(h.lower() for h in required_headings) - present_headings

    if missing:
        raise ValueError(
            f"Missing required ATS headings for {doc_type}: {missing}. Present: {present_headings}"
        )

    # 3. Prevent prohibited elements defined in format_rules.json
    prohibited_elements = rules_for_type.get("prohibited", [])
    if "tables" in prohibited_elements and ats_profile.get("allowsTables", False):
        raise ValueError(f"Tables are prohibited for {doc_type} by format rules")
    if "columns" in prohibited_elements and ats_profile.get("columns", 1) > 1:
        raise ValueError(f"Multiple columns are prohibited for {doc_type} by format rules")
    if "images" in prohibited_elements and ats_profile.get("allowsImages", False):
        raise ValueError(f"Images are prohibited for {doc_type} by format rules")
