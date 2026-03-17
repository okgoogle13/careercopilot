#!/usr/bin/env python3

"""
kr-solidarity v3.0.0 Asset Packager
Bundles analysis + validation + score into production-ready metadata package.

Usage:
    from package_kr_solidarity_asset import package_asset
    package = package_asset(analysis, validation, score, image_path)
    print(package)

Creates:
    - Manifest entry JSON (ready for manifest.json)
    - context.md (documentation)
    - metadata.json (complete metadata)
    - usage.md (deployment instructions)
"""

import json
import os
from dataclasses import dataclass, asdict
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any, List
from analyze_political_asset import PoliticalAssetAnalysis
from validate_kr_solidarity_governance import GovernanceValidation
from score_cultural_significance import CulturalSignificanceScore


# ============================================================================
# ASSET NAMING CONVENTION
# ============================================================================

NAMING_CONVENTION = "kr-solidarity__[category]__[asset-name]__[variant].png"
MIN_RESOLUTION = 2048  # pixels on shortest edge


# ============================================================================
# DATA CLASS
# ============================================================================

@dataclass
class AssetPackage:
    """Complete metadata package for kr-solidarity asset."""
    asset_id: str                    # KR-SOLID-XXX auto-assigned
    file_path: str                   # Canonical asset path
    manifest_entry: Dict[str, Any]   # Entry for manifest.json
    metadata: Dict[str, Any]         # Complete metadata object
    context_md: str                  # Markdown documentation
    usage_md: str                    # Deployment guide
    validation_summary: Dict[str, Any]  # Quick validation overview
    packaging_timestamp: str
    target_width: Optional[int] = None
    target_height: Optional[int] = None


# ============================================================================
# PACKAGER
# ============================================================================

def generate_asset_id(category: str, existing_count: int = 12) -> str:
    """Generate next KR-SOLID-XXX ID."""
    next_id = existing_count + 1
    return f"KR-SOLID-{next_id:03d}"


def generate_canonical_path(
    category: str,
    asset_name: str,
    variant: str = "v1"
) -> str:
    """Generate canonical asset path following kr-solidarity convention."""
    # Convert asset name to slug
    slug = asset_name.lower().replace(" ", "-").replace("_", "-")
    slug = "".join(c for c in slug if c.isalnum() or c == "-")

    return f"/assets/kr-solidarity/{category}/{NAMING_CONVENTION.replace('[category]', category).replace('[asset-name]', slug).replace('[variant]', variant)}"


def validate_image_dimensions(image_path: str) -> tuple:
    """Check image meets minimum resolution."""
    try:
        from PIL import Image
        img = Image.open(image_path)
        width, height = img.size
        shortest_edge = min(width, height)
        return width, height, shortest_edge >= MIN_RESOLUTION
    except Exception as e:
        print(f"  ⚠️  Could not validate dimensions: {e}")
        return 0, 0, None


def assess_placement_fit(category: str, significance: str) -> List[str]:
    """
    Assess which pages an asset is allowed on based on 06b-asset-placement.md.
    """
    allowed_pages = []

    # Global categories (substrate, grid, etc.) are used everywhere but usually
    # handled by the system. Here we focus on symbolic anchors.

    if significance in ["resistance-history", "activist", "solidarity"]:
        allowed_pages.extend(["Landing", "Dashboard Overview"])

    if category == "devotional" or significance == "cultural-anchor":
        allowed_pages.append("Analysis Dashboard")

    # First Nations rule: Placards only on Dashboard Overview or Landing
    if "first-nations" in significance.lower():
        allowed_pages = ["Landing", "Dashboard Overview"]

    return allowed_pages


def resize_image(image_path: str, output_path: str, target_width: Optional[int] = None, target_height: Optional[int] = None) -> bool:
    """Resize image following legacy cataloger constraints."""
    try:
        from PIL import Image
        with Image.open(image_path) as img:
            if target_width or target_height:
                # Use thumbnail to maintain aspect ratio within bounding box
                # If only one dimension is provided, we use a very large value for the other
                tw = target_width or 10000
                th = target_height or 10000
                img.thumbnail((tw, th), Image.LANCZOS)

            # Always ensure RGBA for consistency in Solidarity mode
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            img.save(output_path, 'PNG', optimize=True)
            return True
    except Exception as e:
        print(f"  ❌ Error resizing image: {e}")
        return False


def package_asset(
    analysis: PoliticalAssetAnalysis,
    validation: GovernanceValidation,
    score: CulturalSignificanceScore,
    image_path: str,
    asset_name: Optional[str] = None,
    asset_id: Optional[str] = None,
    target_width: Optional[int] = None,
    target_height: Optional[int] = None
) -> AssetPackage:
    """
    Package analysis + validation + score into production bundle.

    Args:
        analysis: PoliticalAssetAnalysis from analyze_political_asset()
        validation: GovernanceValidation from validate_governance()
        score: CulturalSignificanceScore from score_asset()
        image_path: Path to source image
        asset_name: Optional friendly name (auto-derived from category if not provided)

    Returns:
        AssetPackage with manifest entry + documentation
    """

    print(f"\n📦 Packaging kr-solidarity asset...")

    # Auto-derive asset name if not provided
    if not asset_name:
        # Build from category + political significance + original filename snippet for uniqueness
        file_slug = Path(image_path).stem.lower().replace(" ", "-")[:15]
        asset_name = f"{analysis.category.title()} - {analysis.political_significance.replace('-', ' ').title()} ({file_slug})"

    print(f"  • Asset: {asset_name}")
    print(f"  • Category: {analysis.category}")
    print(f"  • Political Significance: {analysis.political_significance}")

    # Generate or use provided asset ID and canonical path
    if not asset_id:
        asset_id = generate_asset_id(analysis.category)

    canonical_path = generate_canonical_path(
        analysis.category,
        asset_name,
        variant="v1"
    )

    print(f"  • ID: {asset_id}")
    print(f"  • Path: {canonical_path}")

    # Validate image dimensions
    width, height, meets_min = validate_image_dimensions(image_path)
    if meets_min is not None:
        status_icon = "✅" if meets_min else "⚠️ "
        print(f"  {status_icon} Resolution: {width}×{height} (min: {MIN_RESOLUTION}px)")

    # Determine priority based on score
    if score.overall_score >= 90:
        priority = "CRITICAL"
    elif score.overall_score >= 80:
        priority = "HIGH"
    else:
        priority = "MEDIUM"

    # Assess placement fit
    placement_fit = assess_placement_fit(analysis.category, analysis.political_significance)

    # ========================================================================
    # MANIFEST ENTRY
    # ========================================================================
    manifest_entry = {
        "id": asset_id,
        "name": asset_name,
        "category": analysis.category,
        "file_path": canonical_path,
        "priority": priority,
        "status": "ready" if score.overall_score >= 75 else "needs-review",
        "intended_context": analysis.intended_context,
        "components_allowed": [],
        "specs": {
            "aspect_ratio": f"{width}:{height}" if width and height else "unknown",
            "style": analysis.style,
            "text_content": analysis.text_content,
            "visual_anchors": analysis.visual_anchor_details
        }
    }

    # Add optional fields if present
    if analysis.color_palette:
        manifest_entry["specs"]["color_palette"] = analysis.color_palette
    if analysis.detected_symbols:
        manifest_entry["specs"]["symbols"] = analysis.detected_symbols

    # ========================================================================
    # COMPLETE METADATA OBJECT
    # ========================================================================
    metadata = {
        "asset_id": asset_id,
        "name": asset_name,
        "created_at": datetime.now().isoformat(),
        "asset_path": canonical_path,
        "source_image": image_path,
        "analysis": {
            "category": analysis.category,
            "political_significance": analysis.political_significance,
            "text_content": analysis.text_content,
            "detected_symbols": analysis.detected_symbols,
            "style": analysis.style,
            "color_palette": analysis.color_palette,
            "intended_context": analysis.intended_context,
            "historical_reference": analysis.historical_reference,
            "analysis_confidence": analysis.confidence,
            "analysis_notes": analysis.analysis_notes,
        },
        "governance": {
            "passed": validation.passed,
            "approval_level": validation.approval_level,
            "violations": validation.violations,
            "warnings": validation.warnings,
            "governance_score": validation.score,
            "governance_notes": validation.notes,
        },
        "scoring": {
            "overall_score": score.overall_score,
            "political_representation": score.political_representation,
            "governance_compliance": score.governance_compliance,
            "cultural_appropriateness": score.cultural_appropriateness,
            "aesthetic_quality": score.aesthetic_quality,
            "approval_status": score.approval_status,
            "confidence": score.confidence,
        },
        "specifications": {
            "dimensions": {"width": width, "height": height, "meets_minimum": meets_min},
            "priority": priority,
            "manifest_status": manifest_entry["status"],
        },
        "placement_assessment": {
            "allowed_pages": placement_fit,
            "rationale": "Based on 06b-asset-placement.md governance rules"
        },
        "recommendations": score.recommendations,
    }

    # ========================================================================
    # CONTEXT MARKDOWN
    # ========================================================================
    context_md = f"""# {asset_name}

**Asset ID:** {asset_id}
**Category:** {analysis.category}
**Political Significance:** {analysis.political_significance}
**Created:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Governance Status
- **Approval Level:** {validation.approval_level.upper()}
- **Passed Validation:** {'✅ Yes' if validation.passed else '❌ No'}
- **Governance Score:** {validation.score:.0f}/100

{f'**Violations:**' if validation.violations else ''}
{chr(10).join(f'- {v}' for v in validation.violations) if validation.violations else ''}

{f'**Warnings:**' if validation.warnings else ''}
{chr(10).join(f'- {w}' for w in validation.warnings) if validation.warnings else ''}

## Scoring Summary

| Dimension | Score | Weight |
|-----------|-------|--------|
| Political Representation | {score.political_representation:.0f}/100 | 25% |
| Governance Compliance | {score.governance_compliance:.0f}/100 | 30% |
| Cultural Appropriateness | {score.cultural_appropriateness:.0f}/100 | 25% |
| Aesthetic Quality | {score.aesthetic_quality:.0f}/100 | 20% |
| **OVERALL** | **{score.overall_score:.1f}/100** | **100%** |

**Approval Status:** {score.approval_status.upper()}

## Asset Details

**Text Content:** {analysis.text_content or '(none)'}

**Historical Reference:** {analysis.historical_reference or '(none)'}

**Detected Symbols:**
{chr(10).join(f'- {symbol}' for symbol in analysis.detected_symbols) if analysis.detected_symbols else '(none)'}

**Artistic Style:** {analysis.style}

**Color Palette:**
{chr(10).join(f'- {key}: {value}' for key, value in analysis.color_palette.items()) if analysis.color_palette else '(none)'}

**Intended Context:**
{analysis.intended_context}

## Implementation Notes

{chr(10).join(f'- {rec}' for rec in score.recommendations)}

---

**Confidence Score:** {score.confidence:.2f}/1.0
**Analysis Notes:** {analysis.analysis_notes}
"""

    # ========================================================================
    # USAGE MARKDOWN
    # ========================================================================
    usage_md = f"""# Deployment Guide: {asset_name}

## Quick Facts
- **Asset ID:** {asset_id}
- **Canonical Path:** `{canonical_path}`
- **Approval Status:** {score.approval_status}
- **Overall Score:** {score.overall_score:.1f}/100

## Integration Steps

### 1. File Placement
Place the asset at the canonical path:
```
{canonical_path.replace('/assets/', '')}
```

### 2. Manifest Entry
Add this entry to `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`:

```json
{json.dumps(manifest_entry, indent=2)}
```

### 3. Component Usage (React)
```tsx
import {{ asset_id }} from '@/components/kr-solidarity/AssetLibrary';

export const MyComponent = () => {{
  return (
    <div className="kr-solidarity-asset">
      <img
        src="{canonical_path}"
        alt="{asset_name}"
        className="w-full h-auto"
      />
    </div>
  );
}};
```

### 4. CSS Token Integration
If using color palette, add to design tokens:

```css
{chr(10).join(f'--kr-{key.lower().replace(" ", "-")}: {value};' for key, value in (analysis.color_palette.items() if analysis.color_palette else []))}
```

## Validation Checklist

- [{'x' if validation.passed else ' '}] Passes governance validation
- [{'x' if score.overall_score >= 90 else ' '}] Overall score ≥ 90
- [{'x' if not validation.violations else ' '}] No governance violations
- [{'x' if len(validation.warnings) == 0 else ' '}] No governance warnings
- [{'x' if meets_min else ' '}] Image meets minimum resolution ({MIN_RESOLUTION}px)

## Recommendations

{chr(10).join(f'- {rec}' for rec in score.recommendations)}

## Support

For questions about this asset's cultural significance or governance status, refer to:
- Analysis Notes: {analysis.analysis_notes}
- Placement Fit: {', '.join(placement_fit) if placement_fit else 'Global / Structural Only'}
- Governance Notes: {validation.notes}
- Scoring Details: See `metadata.json`

---

Generated: {datetime.now().isoformat()}
"""

    # ========================================================================
    # VALIDATION SUMMARY
    # ========================================================================
    validation_summary = {
        "asset_id": asset_id,
        "quick_status": "✅ APPROVED" if score.overall_score >= 90 else "⚠️  CONDITIONAL" if score.overall_score >= 75 else "🔍 NEEDS REVIEW",
        "score": score.overall_score,
        "approval_status": score.approval_status,
        "governance_passed": validation.passed,
        "priority": priority,
        "ready_for_manifest": score.overall_score >= 75,
        "ready_for_production": score.overall_score >= 90,
    }

    # ========================================================================
    # CREATE PACKAGE
    # ========================================================================
    print(f"\n  📝 Generated manifest entry, metadata, and documentation")
    print(f"  ✅ Package ready for integration")

    return AssetPackage(
        asset_id=asset_id,
        file_path=canonical_path,
        manifest_entry=manifest_entry,
        metadata=metadata,
        context_md=context_md,
        usage_md=usage_md,
        validation_summary=validation_summary,
        target_width=target_width,
        target_height=target_height,
        packaging_timestamp=datetime.now().isoformat()
    )


def export_package(package: AssetPackage, output_dir: str = "./asset-packages") -> Dict[str, str]:
    """
    Export asset package to files.

    Creates:
        - {output_dir}/{asset_id}/metadata.json
        - {output_dir}/{asset_id}/context.md
        - {output_dir}/{asset_id}/usage.md
        - {output_dir}/{asset_id}/manifest-entry.json

    Returns:
        Dict with file paths of exported files
    """
    output_path = Path(output_dir) / package.asset_id
    output_path.mkdir(parents=True, exist_ok=True)

    files = {}

    # Write metadata.json
    metadata_file = output_path / "metadata.json"
    with open(metadata_file, "w") as f:
        json.dump(package.metadata, f, indent=2)
    files["metadata"] = str(metadata_file)
    print(f"  📄 Written: {metadata_file}")

    # Write context.md
    context_file = output_path / "context.md"
    with open(context_file, "w") as f:
        f.write(package.context_md)
    files["context"] = str(context_file)
    print(f"  📄 Written: {context_file}")

    # Write usage.md
    usage_file = output_path / "usage.md"
    with open(usage_file, "w") as f:
        f.write(package.usage_md)
    files["usage"] = str(usage_file)
    print(f"  📄 Written: {usage_file}")

    # Write manifest-entry.json
    entry_file = output_path / "manifest-entry.json"
    with open(entry_file, "w") as f:
        json.dump(package.manifest_entry, f, indent=2)
    files["manifest_entry"] = str(entry_file)
    print(f"  📄 Written: {entry_file}")

    return files


# ============================================================================
# CLI USAGE
# ============================================================================

if __name__ == "__main__":
    import sys
    from analyze_political_asset import analyze_political_asset
    from validate_kr_solidarity_governance import validate_governance
    from score_cultural_significance import score_asset

    if len(sys.argv) < 2:
        print("Usage: python package_kr_solidarity_asset.py <image_path> [asset_name]")
        sys.exit(1)

    image_path = sys.argv[1]
    asset_name = sys.argv[2] if len(sys.argv) > 2 else None

    # Phase 1: Analyze
    print("Step 1: Analyzing asset...")
    analysis = analyze_political_asset(image_path)

    # Phase 1: Validate
    print("\nStep 2: Validating governance...")
    validation = validate_governance(analysis)

    # Phase 2: Score
    print("\nStep 3: Scoring cultural significance...")
    score = score_asset(analysis, validation)

    # Phase 3: Package
    print("\nStep 4: Packaging asset...")
    package = package_asset(analysis, validation, score, image_path, asset_name)

    # Export to files
    print("\nStep 5: Exporting package files...")
    exported_files = export_package(package)

    print("\n" + "=" * 80)
    print("ASSET PACKAGING COMPLETE")
    print("=" * 80)
    print(json.dumps(package.validation_summary, indent=2))
    print(f"\n📁 Files exported to: ./asset-packages/{package.asset_id}/")
    print(f"   {chr(10).join('   - ' + Path(f).name for f in exported_files.values())}")
