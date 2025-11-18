#!/usr/bin/env python3
"""
M3 Expressive Component Migration Script

This script automates the migration of components to M3 Expressive design system:
- Scans components for Material-UI styling patterns
- Generates migration recommendations
- Tracks migration progress
- Validates M3 token usage
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Project paths
FRONTEND_DIR = Path("frontend/src")
COMPONENTS_DIR = FRONTEND_DIR / "components"
MIGRATION_TRACKER = Path("design-system/migration-tracker.json")

# M3 token patterns to look for in migrated components
M3_TOKEN_PATTERNS = [
    r"--md-sys-color-",
    r"--md-sys-motion-",
    r"--md-sys-shape-",
    r"--md-sys-spacing-",
    r"--md-sys-elevation-",
    r"--md-sys-typescale-",
]

# Material-UI patterns that need migration
MUI_PATTERNS = [
    (r"theme\.palette\.primary", "--md-sys-color-primary-50"),
    (r"theme\.palette\.secondary", "--md-sys-color-secondary-50"),
    (r"theme\.palette\.error", "--md-sys-color-error-50"),
    (r"theme\.spacing\((\d+)\)", r"var(--md-sys-spacing-\1)"),
    (r"borderRadius:\s*theme\.spacing", "var(--md-sys-shape-corner-medium)"),
]


class ComponentScanner:
    """Scans components and identifies migration candidates."""

    def __init__(self):
        self.components = []
        self.mui_components = []
        self.m3_components = []

    def scan_directory(self, directory: Path) -> List[Path]:
        """Recursively scan directory for .tsx/.ts component files."""
        components = []
        for path in directory.rglob("*.tsx"):
            # Skip test files and stories
            if any(skip in str(path) for skip in ["test", "stories", "spec"]):
                continue
            components.append(path)
        return components

    def analyze_component(self, file_path: Path) -> Dict:
        """Analyze a single component file."""
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for MUI usage
        uses_mui = any(
            pattern in content
            for pattern in ["@mui/material", "styled(", "useTheme()"]
        )

        # Check for M3 token usage
        uses_m3_tokens = any(
            re.search(pattern, content) for pattern in M3_TOKEN_PATTERNS
        )

        # Count MUI patterns
        mui_pattern_count = sum(
            len(re.findall(pattern, content)) for pattern, _ in MUI_PATTERNS
        )

        # Determine migration status
        if uses_m3_tokens:
            status = "migrated"
        elif uses_mui:
            status = "needs_migration"
        else:
            status = "unknown"

        return {
            "path": str(file_path.relative_to(FRONTEND_DIR)),
            "name": file_path.stem,
            "uses_mui": uses_mui,
            "uses_m3_tokens": uses_m3_tokens,
            "mui_pattern_count": mui_pattern_count,
            "status": status,
            "size_lines": len(content.splitlines()),
        }

    def scan_all(self) -> Dict:
        """Scan all components and return analysis."""
        print("🔍 Scanning components...")
        components = self.scan_directory(COMPONENTS_DIR)
        print(f"   Found {len(components)} component files")

        results = {
            "total_components": len(components),
            "migrated": [],
            "needs_migration": [],
            "unknown": [],
            "statistics": {},
        }

        for comp_path in components:
            analysis = self.analyze_component(comp_path)
            results[analysis["status"]].append(analysis)

        # Calculate statistics
        results["statistics"] = {
            "total": len(components),
            "migrated": len(results["migrated"]),
            "needs_migration": len(results["needs_migration"]),
            "unknown": len(results["unknown"]),
            "migration_percentage": round(
                len(results["migrated"]) / len(components) * 100, 1
            )
            if len(components) > 0
            else 0,
        }

        return results


class MigrationTracker:
    """Tracks component migration progress."""

    def __init__(self):
        self.tracker_file = MIGRATION_TRACKER
        self.data = self.load()

    def load(self) -> Dict:
        """Load migration tracker data."""
        if self.tracker_file.exists():
            with open(self.tracker_file, "r") as f:
                return json.load(f)
        return {
            "version": "1.0.0",
            "last_updated": "",
            "components": {},
            "batches": [],
        }

    def save(self):
        """Save migration tracker data."""
        from datetime import datetime

        self.data["last_updated"] = datetime.now().isoformat()

        os.makedirs(self.tracker_file.parent, exist_ok=True)
        with open(self.tracker_file, "w") as f:
            json.dump(self.data, f, indent=2)

        print(f"✅ Migration tracker saved to {self.tracker_file}")

    def update_component(self, component_path: str, status: str, notes: str = ""):
        """Update component migration status."""
        self.data["components"][component_path] = {
            "status": status,
            "notes": notes,
        }

    def create_batch(self, batch_name: str, components: List[str]):
        """Create a migration batch."""
        batch = {
            "name": batch_name,
            "components": components,
            "status": "pending",
            "created": "",
        }
        self.data["batches"].append(batch)

    def get_progress(self) -> Dict:
        """Get migration progress statistics."""
        total = len(self.data["components"])
        if total == 0:
            return {"total": 0, "migrated": 0, "pending": 0, "percentage": 0}

        migrated = sum(
            1 for c in self.data["components"].values() if c["status"] == "migrated"
        )

        return {
            "total": total,
            "migrated": migrated,
            "pending": total - migrated,
            "percentage": round(migrated / total * 100, 1),
        }


def generate_migration_report(scan_results: Dict, output_path: str = None):
    """Generate a markdown migration report."""
    report = [
        "# M3 Expressive Component Migration Report\n",
        f"**Total Components:** {scan_results['statistics']['total']}\n",
        f"**Migrated:** {scan_results['statistics']['migrated']} "
        f"({scan_results['statistics']['migration_percentage']}%)\n",
        f"**Needs Migration:** {scan_results['statistics']['needs_migration']}\n",
        f"**Unknown Status:** {scan_results['statistics']['unknown']}\n\n",
        "---\n\n",
        "## 🎯 Migration Priorities\n\n",
        "### High Priority (MUI Components with >10 patterns)\n\n",
    ]

    # Sort by MUI pattern count
    high_priority = sorted(
        scan_results["needs_migration"],
        key=lambda x: x["mui_pattern_count"],
        reverse=True,
    )[:10]

    for comp in high_priority:
        report.append(
            f"- **{comp['name']}** (`{comp['path']}`) - "
            f"{comp['mui_pattern_count']} MUI patterns, "
            f"{comp['size_lines']} lines\n"
        )

    report.append("\n### ✅ Already Migrated\n\n")
    for comp in scan_results["migrated"][:10]:
        report.append(f"- {comp['name']} (`{comp['path']}`)\n")

    report.append("\n### 📋 Needs Migration\n\n")
    for comp in scan_results["needs_migration"][:20]:
        report.append(
            f"- {comp['name']} (`{comp['path']}`) - "
            f"{comp['mui_pattern_count']} patterns\n"
        )

    report_content = "".join(report)

    if output_path:
        with open(output_path, "w") as f:
            f.write(report_content)
        print(f"📄 Migration report saved to {output_path}")

    return report_content


def main():
    """Main migration script execution."""
    print("=" * 60)
    print("M3 Expressive Component Migration Tool")
    print("=" * 60)

    # Scan components
    scanner = ComponentScanner()
    results = scanner.scan_all()

    # Display statistics
    stats = results["statistics"]
    print(f"\n📊 Migration Statistics:")
    print(f"   Total: {stats['total']} components")
    print(f"   Migrated: {stats['migrated']} ({stats['migration_percentage']}%)")
    print(f"   Needs Migration: {stats['needs_migration']}")
    print(f"   Unknown: {stats['unknown']}")

    # Generate report
    report_path = "design-system/MIGRATION_REPORT.md"
    generate_migration_report(results, report_path)

    # Initialize tracker
    tracker = MigrationTracker()

    # Update tracker with scan results
    for comp in results["migrated"]:
        tracker.update_component(comp["path"], "migrated", "M3 tokens detected")

    for comp in results["needs_migration"]:
        tracker.update_component(
            comp["path"], "pending", f"{comp['mui_pattern_count']} MUI patterns"
        )

    tracker.save()

    # Display progress
    progress = tracker.get_progress()
    print(f"\n✨ Migration Progress: {progress['percentage']}%")
    print(f"   ({progress['migrated']}/{progress['total']} components migrated)")

    print("\n" + "=" * 60)
    print("Next Steps:")
    print("  1. Review: design-system/MIGRATION_REPORT.md")
    print("  2. Track: design-system/migration-tracker.json")
    print("  3. Migrate high-priority components first")
    print("=" * 60)


if __name__ == "__main__":
    main()
