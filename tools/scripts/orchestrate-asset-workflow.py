#!/usr/bin/env python3
"""
Asset Workflow Orchestrator
Chains: asset-generation-validator → asset-packager → kerala-rage-asset-cataloger → asset-placement-strategy

Usage:
    python orchestrate-asset-workflow.py --png <path-to-png> [--category kr-motifs|textures|patterns] [--force-package]
"""

import json
import os
import sys
import argparse
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Tuple, List

# ============================================================================
# CONFIGURATION
# ============================================================================

REPO_ROOT = Path(__file__).parent.parent
ASSETS_DIR = REPO_ROOT / "assets"
FRONTEND_PUBLIC_ASSETS = REPO_ROOT / "frontend" / "public" / "assets"
DOCS_DESIGN = REPO_ROOT / "docs" / "design" / "assets"

# Ensure directories exist
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
FRONTEND_PUBLIC_ASSETS.mkdir(parents=True, exist_ok=True)
DOCS_DESIGN.mkdir(parents=True, exist_ok=True)

UNCATEGORIZED_DIR = ASSETS_DIR / "uncategorized"
UNCATEGORIZED_DIR.mkdir(exist_ok=True)

# ============================================================================
# MOCK: asset-generation-validator
# ============================================================================

def validate_asset(png_path: str) -> Dict[str, Any]:
    """
    Mock asset-generation-validator
    In production: calls actual validator API with vision scoring
    """
    png_file = Path(png_path)
    if not png_file.exists():
        raise FileNotFoundError(f"PNG not found: {png_path}")

    file_size_mb = png_file.stat().st_size / (1024 * 1024)
    file_name = png_file.stem

    # Simple heuristic scoring (in production: vision API + 6-dimension scoring)
    score = 85  # Base score
    violations = []

    # File size check
    if file_size_mb > 5:
        score -= 5
        violations.append(f"File size {file_size_mb:.1f}MB exceeds recommended 5MB")
    elif file_size_mb < 0.1:
        score -= 10
        violations.append("File size too small; likely low resolution")

    # In production, these would be vision API checks:
    # - [DEPRECATED_STYLE] authenticity (Australian endemic flora)
    # - Translucency physics
    # - Scale hierarchy
    # - Density zones
    # - Background color
    # - Typography

    # For demo: assume reasonable score
    if "chatgpt" in file_name.lower():
        score = 78  # Slightly below threshold to show REGENERATE flow

    decision = "PACKAGE" if score >= 90 else "REGENERATE"

    validation_result = {
        "asset_id": f"ASSET-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        "overall_score": score,
        "decision": decision,
        "dimensions": {
            "geographic_authenticity": {"score": 15, "violations": []},
            "translucency_physics": {"score": 14, "violations": []},
            "scale_hierarchy": {"score": 18, "violations": []},
            "density_zones": {"score": 16, "violations": []},
            "background_color": {"score": 12, "violations": []},
            "typography": {"score": 10, "violations": violations},
        },
        "correction_prompt": (
            "Consider:\n"
            "- Ensure Australian endemic flora only\n"
            "- Add translucency for layered effect\n"
            "- Review scale hierarchy (1.5-2x primary to secondary)\n"
            "- Check density zones (upper-left ≤20%, central 60-80%)\n"
            "- Verify background is #1A1714 asphalt black\n"
            "- Add serif labels (max 6, cream color #F5F0E8)"
        ),
        "iteration_priority": "high" if decision == "REGENERATE" else "none",
    }

    return validation_result


# ============================================================================
# mock: asset-packager
# ============================================================================

def package_asset(
    png_path: str,
    validation_result: Dict[str, Any],
    category: str,
    descriptor: str,
) -> Tuple[Path, Dict[str, Any]]:
    """
    Mock asset-packager
    Creates: /assets/ASSET-[N]-[slug]/ with context.md, tokens.json, usage.md
    Copies: /frontend/public/assets/{category}/{filename}
    """
    png_file = Path(png_path)
    asset_id = validation_result["asset_id"]
    score = validation_result["overall_score"]

    # Create metadata directory: /assets/ASSET-N-slug/
    asset_slug = descriptor.lower().replace(" ", "-")
    asset_dir = ASSETS_DIR / f"{asset_id}-{asset_slug}"
    asset_dir.mkdir(exist_ok=True)

    # Generate context.md
    context_md = f"""# Asset {asset_id}: {descriptor}

## Narrative

This {category} asset exemplifies kerala-rage kr-solidarity aesthetics through strategic
placement of Australian endemic flora. The composition follows biological asymmetry principles,
creating a "found" rather than "built" aesthetic.

## kr-motifs

- Wattle (iconic Australian acacia)
- Leaf structures (native [DEPRECATED_STYLE] form)
- [DEPRECATED_STYLE] density zones (theatrical void + [DEPRECATED_STYLE] central)

## Mode Context

**Solidarity Mode**: Warm, emotional interpretation (user-facing)

## Purpose

Suitable for backgrounds, hero sections, or decorative elements in dashboard layouts.
Use with opacity 0.65-0.85 (Solidarity Mode standard).

## Compliance Score

**Overall**: {score}/100
**Decision**: {"PACKAGE ✅" if validation_result["decision"] == "PACKAGE" else "REGENERATE ⚠️"}

"""

    # Generate tokens.json
    tokens_json = {
        "asset_id": asset_id,
        "asset_name": descriptor,
        "category": category,
        "background": "#1A1714",
        "palette": {
            "primary": ["#D4A84B", "#C45C4B"],
            "secondary": ["#B8733D", "#7A9E82"],
        },
        "dimensions": {"width": 1024, "height": 1024, "format": "PNG"},
        "density_zones": {
            "upper_left": {"coverage": "18%", "empty_space": "200x200px"},
            "central": {"coverage": "65%", "density": "[DEPRECATED_STYLE]"},
            "lower_right": {"coverage": "20%", "empty_space": "150x150px"},
        },
        "kr_motifs": ["wattle", "leaf", "endemic_flora"],
        "mode": "kr-dark",
        "compliance_score": score,
        "validation_timestamp": datetime.now().isoformat(),
    }

    # Generate usage.md
    usage_md = f"""# Usage Guidelines: {descriptor}

## CSS Implementation

```css
.asset-{asset_slug} {{
  background-image: url('/assets/{category}/{descriptor.lower().replace(" ", "-")}-1024.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}}

/* Opacity by context */
.kr-dark-hero {{ opacity: 0.85; }}
.kr-dark-content {{ opacity: 0.70; }}
.solidarity-mode {{ opacity: 0.65; }}
```

## Responsive Behavior

- **Desktop**: Full resolution (1024x1024)
- **Tablet**: Scale to fit viewport
- **Mobile**: Reduce opacity to 0.50-0.60 to maintain readability

## Component Integration

**Recommended for**:
- Landing page hero sections
- Dashboard backgrounds
- Solidarity mode emotional moments
- Feature showcase areas

**Avoid for**:
- Dense text overlays (contrast issues)
- High-interaction elements
- Mobile-first designs (test opacity)

## Performance Notes

- File size: ~2.4MB (consider lazy loading)
- Format: PNG (lossless, supports transparency)
- Preload in critical paths for hero sections
- Use `background-attachment: fixed` for parallax depth

"""

    # Write metadata files
    (asset_dir / "context.md").write_text(context_md)
    (asset_dir / "tokens.json").write_text(json.dumps(tokens_json, indent=2))
    (asset_dir / "usage.md").write_text(usage_md)

    # Write README for iteration tracking
    readme = f"""# {descriptor}

**Asset ID**: {asset_id}
**Created**: {datetime.now().isoformat()}
**Score**: {score}/100
**Status**: {validation_result["decision"]}

## Generation History

- Attempt 1: {score}/100 → {validation_result["decision"]}
  - Violations: {', '.join(validation_result['dimensions']['typography']['violations']) or 'None'}

## Next Steps

{f"Run asset-placement-strategy with wireframe specs." if validation_result['decision'] == 'PACKAGE' else "Apply corrections and regenerate."}

"""
    (asset_dir / "README.md").write_text(readme)

    # Copy production file to /frontend/public/assets/{category}/
    category_dir = FRONTEND_PUBLIC_ASSETS / category
    category_dir.mkdir(exist_ok=True)

    # Standardized production filename
    production_filename = f"{category.rstrip('s')[:-1]}-kr-dark-{asset_slug}-1024.png"
    # Production path
    production_path = category_dir / production_filename

    # Move from triage/keep to triage/discard if applicable
    is_from_keep = "_triage/keep" in str(png_file.absolute())

    # In test mode: create a marker file instead of copying (to avoid duplicating large PNG)
    # But if we were doing a real copy/move:
    if is_from_keep:
        discard_dir = png_file.parent.parent / "discard"
        discard_dir.mkdir(exist_ok=True)
        discard_path = discard_dir / png_file.name

        # Real world would be shutil.copy2(png_path, production_path) then shutil.move(png_path, discard_path)
        # For this script's mock purpose, we will simulate the move by creating a marker in discard and production
        print(f"  📦 Triage Cleanup: Moving {png_file.name} to discard/")
        with open(discard_path, 'w') as f:
            f.write(f"[MOVED FROM KEEP] {datetime.now().isoformat()}\n")
            f.write(f"Integrated as: {production_filename}\n")

        # In this specific script's mock logic, it creates a placeholder in production
        with open(production_path, 'w') as f:
            f.write(f"[PRODUCTION ASSET] Link to {png_file.name}\n")
            f.write(f"Original: {png_path}\n")
            f.write(f"Status: MOVED TO DISCARD\n")

        # Optional: remove original if this weren't a mock-style script
        # png_file.unlink()
    else:
        with open(production_path, 'w') as f:
            f.write(f"[PLACEHOLDER] Link to {png_file.name}\n")
            f.write(f"Source: {png_path}\n")
            f.write(f"Size: {png_file.stat().st_size / (1024*1024):.1f}MB\n")

    packaging_result = {
        "asset_id": asset_id,
        "asset_dir": str(asset_dir),
        "production_file": str(production_path),
        "production_filename": production_filename,
        "asset_url": f"/assets/{category}/{production_filename}",
        "files_created": ["context.md", "tokens.json", "usage.md", "README.md"],
        "git_commit_message": f"feat(assets): Add {asset_id} {descriptor} - {score}/100",
    }

    return asset_dir, packaging_result


# ============================================================================
# mock: kerala-rage-asset-cataloger
# ============================================================================

def categorize_asset(
    asset_dir: Path,
    packaging_result: Dict[str, Any],
    inferred_category: str = "uncategorized"
) -> Dict[str, Any]:
    """
    Mock kerala-rage-asset-cataloger
    Analyzes asset and assigns category/variance labels
    """
    tokens_file = asset_dir / "tokens.json"
    tokens = json.loads(tokens_file.read_text())

    # Category inference logic
    category_map = {
        "kr-motifs": "kr-motif-variant",
        "textures": "texture-background",
        "patterns": "seamless-pattern",
        "backgrounds": "hero-banner",
    }

    variance_map = {
        "kr-motifs": "dark-mode",
        "textures": "lab-aesthetic",
        "patterns": "[DEPRECATED_STYLE]-tile",
        "backgrounds": "atmospheric-gradient",
    }

    category = category_map.get(inferred_category, "uncategorized")
    variance = variance_map.get(inferred_category, "unspecified")

    categorization_result = {
        "asset_id": packaging_result["asset_id"],
        "asset_name": tokens["asset_name"],
        "primary_category": category,
        "variance": variance,
        "tags": ["kerala-rage", "kr-dark", "authenticated-flora", "asymmetric"],
        "recommendations": [
            f"Place in /assets/{inferred_category}/ folder",
            "Link from design-system tokens",
            "Add to component library documentation",
        ],
        "compliance_score": tokens["compliance_score"],
        "ready_for_placement": tokens["compliance_score"] >= 85,
    }

    return categorization_result


# ============================================================================
# mock: asset-placement-strategy
# ============================================================================

def suggest_placement(
    asset_dir: Path,
    categorization: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Mock asset-placement-strategy
    Suggests [DEPRECATED_STYLE] placement based on asset category and principles
    """
    placement_guide = f"""# Placement Strategy: {categorization['asset_name']}

## Archetype Mapping

Based on category '{categorization['primary_category']}', recommend:
- **Archetype**: Stone (layered, heavy, foundational)
- **Z-index**: 1-5 (behind content, above base)
- **Opacity**: 0.65 (Solidarity Mode)

## [DEPRECATED_STYLE] Drift

Apply asymmetric positioning:
- Horizontal offset: 7.5% (not 8%)
- Vertical offset: 4.2% (not 5%)
- Border radius: 23px (not 20px or 24px)

## Density Zones

- **Upper-left**: 18% coverage, 200×200px empty space
- **Central**: 65% coverage ([DEPRECATED_STYLE] density)
- **Lower-right**: 20% coverage, 150×150px empty space

## Recommended Components

Suitable for use in:
- Dashboard hero sections
- Feature showcase backgrounds
- Landing page emotional moments
- Solidarity mode emphasis elements

## Validation Checklist

- [ ] Does the layout feel "found" rather than "built"?
- [ ] Are corner radii asymmetric and intentional?
- [ ] Is there a clear focal point (Seed/Lens)?
- [ ] Does the element respond to hover with tactile spring?

## CSS Implementation

See `/assets/{categorization['asset_id']}-*/usage.md` for detailed CSS guidelines.

---

*Generated by asset-placement-strategy*
*Requires wireframe annotation for final placement*
"""

    # Write placement guide
    placement_file = asset_dir / "placement-guide.md"
    placement_file.write_text(placement_guide)

    placement_result = {
        "asset_id": categorization["asset_id"],
        "placement_guide_created": True,
        "archetype": "Stone",
        "recommended_z_index": "1-5",
        "opacity": 0.65,
        "organic_drift": {"horizontal": 7.5, "vertical": 4.2},
        "requires_wireframe": True,
    }

    return placement_result


# ============================================================================
# MAIN ORCHESTRATOR
# ============================================================================

def orchestrate_workflow(png_path: str, category: str = "kr-motifs", force_package: bool = False):
    """
    Main orchestration: PNG → Validation → Packaging → Categorization → Placement
    """
    print("\n" + "="*80)
    print("ASSET WORKFLOW ORCHESTRATOR")
    print("="*80)

    png_file = Path(png_path)
    print(f"\n📦 Input PNG: {png_file.name}")
    print(f"   Size: {png_file.stat().st_size / (1024*1024):.1f}MB")
    print(f"   Path: {png_file.absolute()}")

    # ========================================================================
    # PHASE 1: VALIDATION
    # ========================================================================
    print("\n" + "-"*80)
    print("PHASE 1: VALIDATION (asset-generation-validator)")
    print("-"*80)

    validation = validate_asset(png_path)
    print(f"✅ Validation complete")
    print(f"   Score: {validation['overall_score']}/100")
    print(f"   Decision: {validation['decision']}")

    if validation['decision'] == "REGENERATE" and not force_package:
        print(f"\n⚠️  Score below 90. Correction prompt:")
        print(validation['correction_prompt'])
        return {
            "status": "REGENERATE",
            "validation": validation,
            "next_step": "Apply corrections and regenerate with Gemini"
        }

    # ========================================================================
    # PHASE 2: PACKAGING
    # ========================================================================
    print("\n" + "-"*80)
    print("PHASE 2: PACKAGING (asset-packager)")
    print("-"*80)

    descriptor = png_file.stem.replace("ChatGPT Image", "[DEPRECATED_STYLE] Canopy").title()
    asset_dir, packaging = package_asset(png_path, validation, category, descriptor)

    print(f"✅ Asset packaged")
    print(f"   ID: {packaging['asset_id']}")
    print(f"   Directory: {asset_dir}")
    print(f"   Files created: {', '.join(packaging['files_created'])}")
    print(f"   Production URL: {packaging['asset_url']}")

    # ========================================================================
    # PHASE 3: CATEGORIZATION
    # ========================================================================
    print("\n" + "-"*80)
    print("PHASE 3: CATEGORIZATION (kerala-rage-asset-cataloger)")
    print("-"*80)

    categorization = categorize_asset(asset_dir, packaging, category)
    print(f"✅ Asset categorized")
    print(f"   Primary: {categorization['primary_category']}")
    print(f"   Variance: {categorization['variance']}")
    print(f"   Tags: {', '.join(categorization['tags'])}")

    # ========================================================================
    # PHASE 4: PLACEMENT STRATEGY
    # ========================================================================
    print("\n" + "-"*80)
    print("PHASE 4: PLACEMENT STRATEGY (asset-placement-strategy)")
    print("-"*80)

    placement = suggest_placement(asset_dir, categorization)
    print(f"✅ Placement suggestions generated")
    print(f"   Archetype: {placement['archetype']}")
    print(f"   Recommended Z-index: {placement['recommended_z_index']}")
    print(f"   Opacity (Solidarity): {placement['opacity']}")
    print(f"   Guide: {asset_dir}/placement-guide.md")

    # ========================================================================
    # SUMMARY
    # ========================================================================
    print("\n" + "="*80)
    print("WORKFLOW COMPLETE ✅")
    print("="*80)

    summary = {
        "status": "PACKAGE_COMPLETE",
        "asset_id": packaging['asset_id'],
        "asset_dir": str(asset_dir),
        "production_file": packaging['production_file'],
        "production_url": packaging['asset_url'],
        "validation_score": validation['overall_score'],
        "category": categorization['primary_category'],
        "variance": categorization['variance'],
        "next_steps": [
            "1. Review placement-guide.md for layout suggestions",
            "2. Integrate asset URL into component",
            "3. Test opacity in Solidarity mode",
            "4. Verify responsiveness across breakpoints",
            "5. Commit changes and request design review"
        ]
    }

    print("\n📋 Next Steps:")
    for step in summary['next_steps']:
        print(f"   {step}")

    print("\n📁 Directory Structure Created:")
    print(f"""   /assets/{packaging['asset_id']}-{descriptor.lower().replace(' ', '-')}/
      ├── context.md (narrative & kr-motifs)
      ├── tokens.json (design tokens)
      ├── usage.md (CSS + responsive guidelines)
      ├── placement-guide.md (placement strategy)
      └── README.md (iteration history)

   /frontend/public/assets/{category}/
      └── {packaging['production_filename']} (production asset)
   """)

    return summary


# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Orchestrate asset workflow: validate → package → categorize → place"
    )
    parser.add_argument(
        "--png",
        required=True,
        help="Path to PNG file to process"
    )
    parser.add_argument(
        "--category",
        default="kr-motifs",
        choices=["kr-motifs", "textures", "patterns", "backgrounds"],
        help="Asset category (default: kr-motifs)"
    )
    parser.add_argument(
        "--force-package",
        action="store_true",
        help="Force packaging even if score < 90 (for testing)"
    )

    args = parser.parse_args()

    try:
        result = orchestrate_workflow(args.png, args.category, args.force_package)

        # Save result to JSON
        result_file = ASSETS_DIR / f"{result['asset_id']}-workflow-result.json"
        result_file.write_text(json.dumps(result, indent=2))
        print(f"\n💾 Workflow result saved: {result_file}")

        return 0
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
