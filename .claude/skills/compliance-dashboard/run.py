#!/usr/bin/env python3
"""
Compliance Dashboard CLI - Tracks kerala-rage kr-solidarity design system compliance.

Usage:
  python run.py                                    # Full report
  python run.py --json                             # JSON output only
  python run.py --component ManifestoCard          # Single component
  python run.py --component ManifestoCard --json   # Single component as JSON
"""

import argparse
import json
import sys
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import yaml


def get_repo_root() -> Path:
    """Get repository root path."""
    script_path = Path(__file__).resolve()
    return script_path.parent.parent.parent.parent


def load_component_plan() -> List[Dict[str, Any]]:
    """Load component definitions from component-batch-plan.yaml."""
    root = get_repo_root()
    plan_file = root / "docs" / "design" / "component-batch-plan.yaml"

    if not plan_file.exists():
        raise FileNotFoundError(f"Component plan not found: {plan_file}")

    with open(plan_file, "r") as f:
        data = yaml.safe_load(f)

    return data.get("components", [])


def load_audit_data(component_name: str) -> Optional[Dict[str, Any]]:
    """Load visual audit data for a component if it exists."""
    root = get_repo_root()
    audit_file = root / "docs" / "design" / "audits" / f"{component_name}.json"

    if not audit_file.exists():
        return None

    try:
        with open(audit_file, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        print(f"Warning: Failed to load audit for {component_name}: {e}", file=sys.stderr)
        return None


def load_inventory_data() -> Dict[str, Any]:
    """Load hardcoded values and duplicates from inventory script."""
    root = get_repo_root()
    script_path = root / "scripts" / "simple-component-inventory.sh"

    if not script_path.exists():
        print("Warning: Inventory script not found, skipping hardcoded values detection", file=sys.stderr)
        return {"duplicates": [], "hardcoded_colors": 0, "hardcoded_spacing": 0, "hardcoded_shadows": 0}

    try:
        result = subprocess.run(
            ["bash", str(script_path), "--json"],
            capture_output=True,
            text=True,
            timeout=30,
            cwd=str(root)
        )
        if result.returncode == 0:
            return json.loads(result.stdout)
    except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Warning: Failed to run inventory script: {e}", file=sys.stderr)

    return {"duplicates": [], "hardcoded_colors": 0, "hardcoded_spacing": 0, "hardcoded_shadows": 0}


def file_exists(path: Path) -> bool:
    """Check if a file exists."""
    return path.is_file()


def check_file_exists_variants(patterns: List[Path]) -> bool:
    """Check if any of the given file patterns exist."""
    return any(file_exists(p) for p in patterns)


def check_component_files(component_name: str, root: Path) -> Dict[str, bool]:
    """Check existence of component-related files."""
    # Spec
    has_spec = file_exists(root / "docs" / "design" / "generated" / "specs" / f"{component_name}.md")

    # Mockup (PNG or JPG)
    has_mockup = check_file_exists_variants([
        root / "docs" / "design" / "generated" / "mockups" / f"{component_name}.png",
        root / "docs" / "design" / "generated" / "mockups" / f"{component_name}.jpg",
    ])

    # Component code (either in subfolder or ui folder)
    has_component_code = check_file_exists_variants([
        root / "frontend" / "src" / "components" / component_name / "index.tsx",
        root / "frontend" / "src" / "components" / "ui" / f"{component_name}.tsx",
    ])

    # Tests
    has_tests = file_exists(root / "frontend" / "src" / "components" / "__tests__" / f"{component_name}.test.tsx")

    return {
        "has_spec": has_spec,
        "has_mockup": has_mockup,
        "has_component_code": has_component_code,
        "has_tests": has_tests,
    }


def parse_audit_scores(audit_data: Dict[str, Any]) -> Dict[str, float]:
    """Parse scores from audit JSON."""
    if not audit_data:
        return {
            "overall": None,
            "typography": None,
            "color": None,
            "layout": None,
            "[DEPRECATED_STYLE]": None,
        }

    def status_to_score(status: str) -> float:
        """Convert status string to normalized score (0-1)."""
        if status == "pass":
            return 1.0
        elif status == "needs_refinement":
            return 0.7
        elif status == "fail":
            return 0.3
        return None

    audit = audit_data.get("audit", {})
    dimensions = audit.get("dimensions", {})

    # Use compliance_score if available, otherwise compute from dimensions
    overall = audit.get("compliance_score")
    if overall is not None:
        overall = overall / 100.0  # Normalize 0-100 to 0-1

    return {
        "overall": overall,
        "typography": status_to_score(dimensions.get("typography", {}).get("status")),
        "color": status_to_score(dimensions.get("color", {}).get("status")),
        "layout": status_to_score(dimensions.get("layout", {}).get("status")),
        "[DEPRECATED_STYLE]": status_to_score(dimensions.get("botanical_elements", {}).get("status")),
    }


def get_audit_metadata(audit_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract audit metadata (date, iterations)."""
    if not audit_data:
        return {"last_audit": None, "iterations": 0}

    audit = audit_data.get("audit", {})
    return {
        "last_audit": audit.get("audit_date"),
        "iterations": audit.get("iterations", 1),  # Default to 1 if not tracked
    }


def check_hardcoded_values(component_name: str, inventory_data: Dict[str, Any]) -> bool:
    """Check if component has hardcoded values."""
    # Simple check: if there are any hardcoded values in the entire project
    # For now, we'll use a global flag (could be enhanced per-component)
    # This is a limitation - the inventory script provides global counts
    has_hc = (
        inventory_data.get("hardcoded_colors", 0) > 0
        or inventory_data.get("hardcoded_spacing", 0) > 0
        or inventory_data.get("hardcoded_shadows", 0) > 0
    )
    return has_hc


def is_duplicate(component_name: str, inventory_data: Dict[str, Any]) -> bool:
    """Check if component is listed as duplicate."""
    duplicates = inventory_data.get("duplicates", [])
    return component_name in duplicates


def derive_status(
    component_def: Dict[str, Any],
    scores: Dict[str, float],
    file_flags: Dict[str, bool],
    hardcoded_values: bool,
) -> str:
    """Derive component status: 'aligned' or 'needs_refinement'."""
    target = component_def.get("target", {})

    # Check existence requirements
    if not file_flags["has_spec"]:
        return "needs_refinement"

    if not file_flags["has_component_code"]:
        return "needs_refinement"

    # Check test requirement
    if target.get("tests") != "none" and not file_flags["has_tests"]:
        return "needs_refinement"

    # Check token/migration requirement
    if target.get("tokens") == "strict" and hardcoded_values:
        return "needs_refinement"

    # Check stage2 requirement
    if target.get("stage2") == "complete" and not file_flags["has_component_code"]:
        return "needs_refinement"

    # Check audit scores (if available)
    if scores["typography"] is not None:
        if scores["typography"] < 0.8 or scores["color"] < 0.8 or scores["layout"] < 0.8:
            return "needs_refinement"

    # All checks passed
    return "aligned"


def generate_needs(
    component_def: Dict[str, Any],
    scores: Dict[str, float],
    file_flags: Dict[str, bool],
    hardcoded_values: bool,
) -> List[str]:
    """Generate needs[] array based on gaps."""
    needs = []
    target = component_def.get("target", {})

    # Audit-based needs
    if scores["typography"] is not None and scores["typography"] < 0.8:
        needs.append("needs_typography_fix")
    if scores["color"] is not None and scores["color"] < 0.8:
        needs.append("needs_color_fix")
    if scores["layout"] is not None and scores["layout"] < 0.8:
        needs.append("needs_layout_refine")
    if scores["[DEPRECATED_STYLE]"] is not None and scores["[DEPRECATED_STYLE]"] < 0.7:
        needs.append("needs_botanical_integration")

    # Migration needs
    if component_def.get("mode") == "migrate" and hardcoded_values:
        needs.append("needs_migration_cleanup")

    # Test needs
    if target.get("tests") != "none" and not file_flags["has_tests"]:
        needs.append("needs_tests")

    # Stage2 needs
    if target.get("stage2") == "complete" and (not file_flags["has_mockup"] or not file_flags["has_component_code"]):
        needs.append("needs_stage2")

    # Spec needs
    if not file_flags["has_spec"]:
        needs.append("needs_spec")

    return needs


def analyze_component(
    component_def: Dict[str, Any],
    audit_data: Optional[Dict[str, Any]],
    inventory_data: Dict[str, Any],
    root: Path,
) -> Dict[str, Any]:
    """Analyze a single component and return comprehensive assessment."""
    name = component_def["name"]

    # Check file existence
    file_flags = check_component_files(name, root)

    # Parse audit scores
    scores = parse_audit_scores(audit_data)

    # Get audit metadata
    audit_meta = get_audit_metadata(audit_data)

    # Check for hardcoded values and duplicates
    hardcoded_values = check_hardcoded_values(name, inventory_data)
    duplicate = is_duplicate(name, inventory_data)

    # Derive status and needs
    status = derive_status(component_def, scores, file_flags, hardcoded_values)
    needs = generate_needs(component_def, scores, file_flags, hardcoded_values)

    return {
        "name": name,
        "mode": component_def.get("mode"),
        "priority": component_def.get("priority"),
        "scores": scores,
        "status": status,
        "needs": needs,
        **file_flags,
        "hardcoded_values": hardcoded_values,
        "duplicate": duplicate,
        **audit_meta,
    }


def compute_summary(components: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute global summary metrics."""
    if not components:
        return {
            "overall_compliance": 0.0,
            "typography": 0.0,
            "color": 0.0,
            "layout": 0.0,
            "[DEPRECATED_STYLE]": 0.0,
            "migration": 0.0,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

    # Overall compliance: % of aligned components
    aligned_count = sum(1 for c in components if c["status"] == "aligned")
    overall_compliance = aligned_count / len(components) if components else 0.0

    # Per-dimension averages (only from components with audit data)
    def avg_score(dimension: str) -> float:
        scores = [c["scores"][dimension] for c in components if c["scores"][dimension] is not None]
        return sum(scores) / len(scores) if scores else 0.0

    typography = avg_score("typography")
    color = avg_score("color")
    layout = avg_score("layout")
    [DEPRECATED_STYLE] = avg_score("[DEPRECATED_STYLE]")

    # Migration: % of non-M3* named components
    m3_count = sum(1 for c in components if c["name"].startswith("M3"))
    migration = (len(components) - m3_count) / len(components) if components else 0.0

    return {
        "overall_compliance": round(overall_compliance, 2),
        "typography": round(typography, 2),
        "color": round(color, 2),
        "layout": round(layout, 2),
        "[DEPRECATED_STYLE]": round([DEPRECATED_STYLE], 2),
        "migration": round(migration, 2),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def format_json(summary: Dict[str, Any], components: List[Dict[str, Any]]) -> str:
    """Format output as JSON."""
    output = {
        "summary": summary,
        "components": components,
    }
    return json.dumps(output, indent=2)


def format_human(summary: Dict[str, Any], components: List[Dict[str, Any]]) -> str:
    """Format output as human-readable text."""
    lines = []

    lines.append("Kerala Rage Compliance Dashboard")
    lines.append("================================")
    lines.append(f"Generated: {summary['generated_at'][:19]}")
    lines.append("")

    # Overall compliance
    compliance_pct = int(summary["overall_compliance"] * 100)
    threshold_status = "✓" if compliance_pct >= 80 else "⚠" if compliance_pct >= 70 else "✗"
    lines.append(f"Overall Compliance: {compliance_pct}% {threshold_status} (Target: 80%)")

    # Per-dimension metrics
    dims = {
        "Typography": summary["typography"],
        "Color": summary["color"],
        "Layout": summary["layout"],
        "[DEPRECATED_STYLE]": summary["[DEPRECATED_STYLE]"],
        "Migration": summary["migration"],
    }
    for dim_name, score in dims.items():
        pct = int(score * 100)
        check = "✓" if score >= 0.8 else "▼" if score >= 0.6 else "✗"
        lines.append(f"  {dim_name:15} {pct:3}% {check}")

    lines.append("")

    # Status summary
    aligned = sum(1 for c in components if c["status"] == "aligned")
    needs_refinement = len(components) - aligned
    if needs_refinement == 0:
        lines.append("Status: All components aligned ✓")
    elif compliance_pct >= 80:
        lines.append("Status: Approaching production-ready threshold")
    else:
        lines.append(f"Status: {needs_refinement} components need refinement")

    # Top components needing refinement
    needs_components = [c for c in components if c["status"] == "needs_refinement"]
    if needs_components:
        lines.append("")
        lines.append("Top Components Needing Refinement:")
        for i, comp in enumerate(sorted(needs_components, key=lambda x: x["priority"].count("high"), reverse=True)[:3], 1):
            lines.append(f"  {i}. {comp['name']} ({comp['priority']} priority)")
            if comp["needs"]:
                for need in comp["needs"]:
                    lines.append(f"     - {need}")

    return "\n".join(lines)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Kerala Rage Compliance Dashboard - Track design system compliance"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output as JSON only (no human summary)",
    )
    parser.add_argument(
        "--component",
        type=str,
        help="Limit analysis to a specific component",
    )

    args = parser.parse_args()

    try:
        root = get_repo_root()

        # Load component plan
        component_plan = load_component_plan()

        # Load inventory data (global)
        inventory_data = load_inventory_data()

        # Filter by component if specified
        if args.component:
            matching = [c for c in component_plan if c["name"] == args.component]
            if not matching:
                print(f"Error: Component '{args.component}' not found in plan", file=sys.stderr)
                sys.exit(1)
            component_plan = matching

        # Analyze each component
        components = []
        for comp_def in component_plan:
            audit_data = load_audit_data(comp_def["name"])
            result = analyze_component(comp_def, audit_data, inventory_data, root)
            components.append(result)

        # Compute summary
        summary = compute_summary(components)

        # Output
        if args.json:
            print(format_json(summary, components))
        else:
            print(format_human(summary, components))

        sys.exit(0)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
