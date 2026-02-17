#!/usr/bin/env python3

"""
kr-solidarity v3.0.0 Cultural Significance Scorer
Scores political/cultural assets across 4 weighted dimensions for kr-solidarity system.

Usage:
    from score_cultural_significance import score_asset
    score = score_asset(analysis, validation)
    print(score)

Dependencies:
    Requires analyze_political_asset.py and validate_kr_solidarity_governance.py
"""

import json
from dataclasses import dataclass, asdict
from typing import List, Optional
from analyze_political_asset import PoliticalAssetAnalysis
from validate_kr_solidarity_governance import GovernanceValidation


# ============================================================================
# SCORING DIMENSIONS
# ============================================================================

POLITICAL_REPRESENTATION_WEIGHT = 0.25
GOVERNANCE_COMPLIANCE_WEIGHT = 0.30
CULTURAL_APPROPRIATENESS_WEIGHT = 0.25
AESTHETIC_QUALITY_WEIGHT = 0.20

# Political significance tier values
POLITICAL_SIGNIFICANCE_SCORES = {
    "resistance-history": 100,      # Highest: direct anti-colonial/resistance
    "cultural-anchor": 95,           # Deep cultural grounding
    "activist": 90,                  # Contemporary activism/solidarity
    "devotional": 85,                # Spiritual/reverent political significance
    "solidarity": 80,                # General solidarity expression
}

# Style prestige (kr-solidarity aesthetic quality)
STYLE_PRESTIGE = {
    "screenprint": 95,               # Primary kr-solidarity technique
    "wheat-paste": 90,               # Street art authenticity
    "etching": 85,                   # Classical craft
    "painting": 80,                  # Fine art
    "photograph": 75,                # Documentary
    "mixed": 70,                     # Hybrid approaches
    "ink-drip": 85,                  # Abstract technique
    "texture-scan": 80,              # Texture/found
    "layered-silhouette": 85,        # Design technique
    "letterform-fragments": 75,      # Typography
    "screenprint-poster": 90,        # Poster tradition
}

# ============================================================================
# DATA CLASS
# ============================================================================

@dataclass
class CulturalSignificanceScore:
    """Comprehensive scoring result for a political asset."""
    overall_score: float             # 0-100 weighted
    political_representation: float  # 0-100 (25% weight)
    governance_compliance: float     # 0-100 (30% weight)
    cultural_appropriateness: float  # 0-100 (25% weight)
    aesthetic_quality: float         # 0-100 (20% weight)

    recommendations: List[str]       # Actionable improvements
    approval_status: str             # approved, conditional-approval, needs-review, rejected
    confidence: float                # 0.0-1.0
    notes: str


# ============================================================================
# SCORER
# ============================================================================

def score_asset(
    analysis: PoliticalAssetAnalysis,
    validation: GovernanceValidation
) -> CulturalSignificanceScore:
    """
    Score a political asset across 4 weighted dimensions.

    Args:
        analysis: PoliticalAssetAnalysis from analyze_political_asset()
        validation: GovernanceValidation from validate_governance()

    Returns:
        CulturalSignificanceScore with weighted dimensions and recommendations
    """

    print(f"\n🎯 Scoring cultural significance for: {analysis.category} / {analysis.political_significance}")

    # ========================================================================
    # DIMENSION 1: POLITICAL REPRESENTATION (25%)
    # ========================================================================
    print("  • Scoring political representation...")

    # Base score from significance category
    base_political_score = POLITICAL_SIGNIFICANCE_SCORES.get(
        analysis.political_significance, 70
    )

    # Boost for historical reference (resistance/historical figures)
    historical_boost = 0
    if analysis.historical_reference:
        historical_boost = 10
        print(f"    - Historical reference present: +10")

    # Boost for detected symbols (deeper cultural meaning)
    symbol_boost = min(len(analysis.detected_symbols) * 5, 15)
    if symbol_boost > 0:
        print(f"    - {len(analysis.detected_symbols)} cultural symbols detected: +{symbol_boost}")

    # Penalty for weak intended context
    context_penalty = 0
    if not analysis.intended_context or len(analysis.intended_context) < 20:
        context_penalty = -5
        print(f"    - Weak/missing intended context: -5")

    political_representation = min(
        100,
        base_political_score + historical_boost + symbol_boost + context_penalty
    )
    print(f"    → Political Representation Score: {political_representation:.0f}/100")

    # ========================================================================
    # DIMENSION 2: GOVERNANCE COMPLIANCE (30%)
    # ========================================================================
    print("  • Scoring governance compliance...")

    # Start at validation score
    governance_base = validation.score

    # Violations are hard stops
    violation_penalty = 0
    if validation.violations:
        violation_penalty = -50
        print(f"    - {len(validation.violations)} governance violations: -50")

    # Warnings reduce compliance
    warning_penalty = 0
    for warning in validation.warnings:
        warning_penalty -= 5
    if warning_penalty < 0:
        print(f"    - {len(validation.warnings)} governance warnings: {warning_penalty}")

    # Bonus for approval level
    approval_bonus = 0
    if validation.approval_level == "auto-approved":
        approval_bonus = 10
        print(f"    - Auto-approved status: +10")
    elif validation.approval_level == "human-review":
        approval_bonus = 0
        print(f"    - Requires human review (neutral)")

    governance_compliance = max(
        0,
        min(100, governance_base + violation_penalty + warning_penalty + approval_bonus)
    )
    print(f"    → Governance Compliance Score: {governance_compliance:.0f}/100")

    # ========================================================================
    # DIMENSION 3: CULTURAL APPROPRIATENESS (25%)
    # ========================================================================
    print("  • Scoring cultural appropriateness...")

    appropriateness_score = 85  # Start optimistic

    # Text content check (activist/street art should have strong messaging)
    text_boost = 0
    if analysis.text_content:
        text_length = len(analysis.text_content)
        if text_length >= 15:
            text_boost = 10
            print(f"    - Strong text content present ({text_length} chars): +10")
        elif text_length >= 5:
            text_boost = 5
            print(f"    - Text present ({text_length} chars): +5")

    # Category-specific appropriateness
    category_check = 0
    if analysis.category == "devotional":
        if analysis.style in ["screenprint", "painting", "etching", "photograph"]:
            category_check = 5
            print(f"    - Devotional with reverent style: +5")
        else:
            category_check = -10
            print(f"    - Devotional with non-reverent style: -10")

    elif analysis.category == "street":
        if analysis.intended_context and "in situ" in analysis.intended_context.lower():
            category_check = 10
            print(f"    - Street art with in-situ context: +10")
        elif analysis.text_content:
            category_check = 5
            print(f"    - Street art with text content: +5")

    elif analysis.category in ["portrait", "symbol"]:
        if analysis.confidence >= 0.85:
            category_check = 5
            print(f"    - High confidence analysis: +5")

    # Color palette diversity
    palette_check = 0
    if analysis.color_palette and len(analysis.color_palette) >= 3:
        palette_check = 5
        print(f"    - Rich color palette ({len(analysis.color_palette)} colors): +5")

    cultural_appropriateness = max(
        50,
        min(100, appropriateness_score + text_boost + category_check + palette_check)
    )
    print(f"    → Cultural Appropriateness Score: {cultural_appropriateness:.0f}/100")

    # ========================================================================
    # DIMENSION 4: AESTHETIC QUALITY (20%)
    # ========================================================================
    print("  • Scoring aesthetic quality...")

    # Style prestige
    style_score = STYLE_PRESTIGE.get(analysis.style, 70)
    print(f"    - Style '{analysis.style}' prestige: {style_score}/100")

    # Analysis confidence (higher = better metadata)
    confidence_boost = 0
    if analysis.confidence >= 0.9:
        confidence_boost = 10
        print(f"    - High analysis confidence (≥0.9): +10")
    elif analysis.confidence >= 0.75:
        confidence_boost = 5
        print(f"    - Moderate analysis confidence: +5")

    # Composition completeness (has all key metadata fields)
    completeness_bonus = 0
    metadata_fields = [
        analysis.category,
        analysis.political_significance,
        analysis.intended_context,
        analysis.style,
        analysis.color_palette
    ]
    complete_fields = sum(1 for f in metadata_fields if f)
    if complete_fields >= 4:
        completeness_bonus = 8
        print(f"    - Complete metadata ({complete_fields}/5 fields): +8")

    aesthetic_quality = min(
        100,
        style_score + confidence_boost + completeness_bonus
    )
    print(f"    → Aesthetic Quality Score: {aesthetic_quality:.0f}/100")

    # ========================================================================
    # WEIGHTED OVERALL SCORE
    # ========================================================================
    overall_score = (
        (political_representation * POLITICAL_REPRESENTATION_WEIGHT) +
        (governance_compliance * GOVERNANCE_COMPLIANCE_WEIGHT) +
        (cultural_appropriateness * CULTURAL_APPROPRIATENESS_WEIGHT) +
        (aesthetic_quality * AESTHETIC_QUALITY_WEIGHT)
    )

    # ========================================================================
    # APPROVAL STATUS & RECOMMENDATIONS
    # ========================================================================
    recommendations = []
    approval_status = "rejected"
    avg_confidence = (
        (analysis.confidence +
         (1.0 if validation.passed else 0.0)) / 2
    )

    if overall_score >= 90:
        approval_status = "approved"
        recommendations.append("✅ Strong asset - ready for production integration")
    elif overall_score >= 75:
        approval_status = "conditional-approval"
        recommendations.append("⚠️  Good asset - monitor for cultural sensitivity feedback")
    elif overall_score >= 60:
        approval_status = "needs-review"
        recommendations.append("🔍 Schedule human review before approval")
    else:
        approval_status = "rejected"
        recommendations.append("❌ Does not meet kr-solidarity standards - recommend revisions")

    # Specific improvement recommendations
    if political_representation < 80:
        recommendations.append(f"📍 Strengthen political significance framing (current: {political_representation:.0f})")
        if not analysis.historical_reference:
            recommendations.append("   → Add historical reference or movement context")
        if len(analysis.detected_symbols) < 2:
            recommendations.append("   → Enhance visual symbolism or cultural markers")

    if governance_compliance < 85:
        recommendations.append(f"⚖️  Address governance issues (current: {governance_compliance:.0f})")
        for violation in validation.violations:
            recommendations.append(f"   → VIOLATION: {violation}")
        for warning in validation.warnings:
            recommendations.append(f"   → Warning: {warning}")

    if cultural_appropriateness < 80:
        recommendations.append(f"🎭 Enhance cultural appropriateness (current: {cultural_appropriateness:.0f})")
        if analysis.category == "street" and not analysis.text_content:
            recommendations.append("   → Add strong text/slogan")
        if analysis.category == "devotional" and analysis.style not in ["screenprint", "painting", "etching", "photograph"]:
            recommendations.append("   → Use more reverent artistic style")

    if aesthetic_quality < 75:
        recommendations.append(f"🎨 Refine aesthetic quality (current: {aesthetic_quality:.0f})")
        if analysis.confidence < 0.75:
            recommendations.append("   → Provide clearer visual composition for analysis")
        if not analysis.color_palette or len(analysis.color_palette) < 3:
            recommendations.append("   → Develop richer kr-solidarity color palette")

    # Log results
    print(f"\n  📊 WEIGHTED SCORES:")
    print(f"     Political Representation: {political_representation:.0f}/100 ({POLITICAL_REPRESENTATION_WEIGHT*100:.0f}% weight)")
    print(f"     Governance Compliance:   {governance_compliance:.0f}/100 ({GOVERNANCE_COMPLIANCE_WEIGHT*100:.0f}% weight)")
    print(f"     Cultural Appropriateness: {cultural_appropriateness:.0f}/100 ({CULTURAL_APPROPRIATENESS_WEIGHT*100:.0f}% weight)")
    print(f"     Aesthetic Quality:       {aesthetic_quality:.0f}/100 ({AESTHETIC_QUALITY_WEIGHT*100:.0f}% weight)")
    print(f"\n  🎯 OVERALL SCORE: {overall_score:.1f}/100 [{approval_status.upper()}]")

    if recommendations:
        print(f"\n  📋 RECOMMENDATIONS:")
        for rec in recommendations:
            print(f"     {rec}")

    return CulturalSignificanceScore(
        overall_score=overall_score,
        political_representation=political_representation,
        governance_compliance=governance_compliance,
        cultural_appropriateness=cultural_appropriateness,
        aesthetic_quality=aesthetic_quality,
        recommendations=recommendations,
        approval_status=approval_status,
        confidence=avg_confidence,
        notes=f"Overall: {overall_score:.1f}/100 | Approval: {approval_status}"
    )


# ============================================================================
# CLI USAGE
# ============================================================================

if __name__ == "__main__":
    import sys
    from analyze_political_asset import analyze_political_asset
    from validate_kr_solidarity_governance import validate_governance

    if len(sys.argv) < 2:
        print("Usage: python score_cultural_significance.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    # Phase 1: Analyze
    print("Step 1: Analyzing asset...")
    analysis = analyze_political_asset(image_path)

    # Phase 1: Validate governance
    print("\nStep 2: Validating governance...")
    validation = validate_governance(analysis)

    # Phase 2: Score
    print("\nStep 3: Scoring cultural significance...")
    score = score_asset(analysis, validation)

    print("\n" + "=" * 80)
    print("CULTURAL SIGNIFICANCE SCORING RESULT")
    print("=" * 80)
    print(json.dumps(asdict(score), indent=2))
