#!/usr/bin/env python3

"""
kr-solidarity v3.0.0 Governance Validator
Validates political/cultural assets against kr-solidarity governance rules.

Usage:
    from validate_kr_solidarity_governance import validate_governance
    result = validate_governance(analysis)
    print(result)

Governance Rules:
    - FORBIDDEN: monarchy symbols, bureaucracy (ID/passport), corporate logos,
      state authority, Aboriginal art styles (except in-situ placards)
    - REQUIRED: Respect for historical figures, cultural appropriateness
    - FIRST NATIONS: Aboriginal flag colors / imagery in-situ only
"""

from dataclasses import dataclass, asdict
from typing import List, Optional
from analyze_political_asset import PoliticalAssetAnalysis


# ============================================================================
# GOVERNANCE RULES
# ============================================================================

FORBIDDEN_KEYWORDS = [
    "crown", "monarchy", "king", "queen", "emperor", "passport", "visa", "id card",
    "border", "police badge", "corporate logo", "trademark", "state seal",
    "military insignia", "nuclear", "weapons"
]

FIRST_NATIONS_APPROVED_TEXT = [
    "ALWAYS WAS ALWAYS WILL BE",
    "TREATY NOW",
    "SOVEREIGNTY",
    "LAND BACK"
]

DEVOTIONAL_APPROVED_FIGURES = [
    "Shiva", "Buddha", "spiritual", "temple", "sacred"
]

RESISTANCE_APPROVED_FIGURES = [
    "Tipu Sultan", "Bhagat Singh", "independence", "rebellion", "resistance",
    "anti-colonial", "liberation"
]

# ============================================================================
# DATA CLASS
# ============================================================================

@dataclass
class GovernanceValidation:
    """Governance validation result."""
    passed: bool
    violations: List[str]
    warnings: List[str]
    approval_level: str  # auto-approved, human-review, rejected
    score: float  # 0-100
    notes: str


# ============================================================================
# VALIDATOR
# ============================================================================

def validate_governance(analysis: PoliticalAssetAnalysis) -> GovernanceValidation:
    """
    Validate political asset against kr-solidarity governance rules.

    Args:
        analysis: PoliticalAssetAnalysis from analyze_political_asset()

    Returns:
        GovernanceValidation with pass/fail and approval level
    """

    violations = []
    warnings = []
    approval_level = "auto-approved"
    score = 100.0

    print(f"🔐 Validating governance for: {analysis.category} / {analysis.political_significance}")

    # Check 1: Forbidden keywords in analysis
    print("  • Checking forbidden imagery...")
    combined_text = (
        f"{analysis.intended_context} {' '.join(analysis.detected_symbols)} "
        f"{analysis.text_content or ''} {analysis.historical_reference or ''}"
    ).lower()

    for keyword in FORBIDDEN_KEYWORDS:
        if keyword in combined_text:
            violations.append(f"Forbidden keyword detected: '{keyword}'")
            score -= 15

    # Check 2: First Nations policy
    if "first nations" in analysis.political_significance.lower() or \
       "aboriginal" in combined_text.lower():
        print("  • Checking First Nations in-situ policy...")
        if analysis.text_content:
            if not any(approved in analysis.text_content.upper()
                      for approved in FIRST_NATIONS_APPROVED_TEXT):
                warnings.append("First Nations imagery: text not in approved list")
                approval_level = "human-review"
                score -= 10
        else:
            warnings.append("First Nations imagery detected: requires text context")
            approval_level = "human-review"
            score -= 10

    # Check 3: Devotional reverence
    if analysis.category == "devotional" or \
       any(fig in combined_text for fig in DEVOTIONAL_APPROVED_FIGURES):
        print("  • Checking devotional reverence...")
        if analysis.style not in ["screenprint", "painting", "etching", "photograph"]:
            warnings.append("Devotional imagery: style should be reverent (screenprint/painting/etching)")
            approval_level = "human-review"
            score -= 10

    # Check 4: Resistance/historical accuracy
    if analysis.political_significance == "resistance-history":
        print("  • Checking historical accuracy...")
        if not analysis.historical_reference:
            warnings.append("Resistance history asset: missing historical reference")
            approval_level = "human-review"
            score -= 5
        approval_level = "human-review"  # Historical figures always need human verification

    # Check 5: Street art context
    if analysis.category == "street":
        print("  • Checking street art context...")
        if not analysis.text_content:
            warnings.append("Street art: generally includes text/slogan (check composition)")
        if analysis.intended_context and "in situ" not in analysis.intended_context.lower():
            warnings.append("Street art: should specify in-situ context")
            approval_level = "human-review"
            score -= 5

    # Violations are hard stops
    if violations:
        approval_level = "rejected"
        score = 0.0

    # Ensure score stays in 0-100 range
    score = max(0, min(100, score))

    passed = approval_level != "rejected"

    # Log results
    if violations:
        print(f"  ❌ VIOLATIONS ({len(violations)}):")
        for v in violations:
            print(f"     - {v}")

    if warnings:
        print(f"  ⚠️  WARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"     - {w}")

    if passed:
        print(f"  ✅ Passed governance check (approval: {approval_level}, score: {score:.0f}/100)")
    else:
        print(f"  ❌ REJECTED - Governance violations present")

    return GovernanceValidation(
        passed=passed,
        violations=violations,
        warnings=warnings,
        approval_level=approval_level,
        score=score,
        notes=f"{len(violations)} violations, {len(warnings)} warnings"
    )


# ============================================================================
# CLI USAGE
# ============================================================================

if __name__ == "__main__":
    import sys
    import json
    from analyze_political_asset import analyze_political_asset

    if len(sys.argv) < 2:
        print("Usage: python validate_kr_solidarity_governance.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    # Analyze first
    print("Step 1: Analyzing asset...")
    analysis = analyze_political_asset(image_path)

    # Validate governance
    print("\nStep 2: Validating governance...")
    validation = validate_governance(analysis)

    print("\n" + "=" * 80)
    print("GOVERNANCE VALIDATION RESULT")
    print("=" * 80)
    print(json.dumps(asdict(validation), indent=2))
