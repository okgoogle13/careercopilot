#!/usr/bin/env python3
"""
Manifest Reconciler: Kerala Rage Asset Synchronization Audit
Guarantees filesystem, manifest, and hero registry alignment.
"""
import json
import os
from pathlib import Path
from typing import Dict, List, Set, Tuple

# Configuration
ASSET_ROOT = Path("/Users/okgoogle13/Projects/careercopilot/frontend/public/assets/kr-solidarity")
MANIFEST_PATH = Path("/Users/okgoogle13/Projects/careercopilot/frontend/public/assets/kerala-rage-kr-solidarity-manifest.json")
HERO_REGISTRY_PATH = Path("/Users/okgoogle13/Projects/careercopilot/frontend/public/assets/kr-solidarity-hero-registry.json")

def load_json(path: Path) -> dict:
    """Load and parse JSON file."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Failed to parse {path}: {e}")
        return {}

def scan_filesystem(root: Path) -> Dict[str, Path]:
    """Scan filesystem and return mapping of file paths to absolute paths."""
    assets = {}
    for ext in ['*.png', '*.svg', '*.jpg', '*.jpeg']:
        for file_path in root.rglob(ext):
            # Normalize to relative path from public/
            rel_path = str(file_path.relative_to(root.parent.parent))
            # Convert to manifest-style path (leading slash)
            manifest_path = f"/{rel_path}"
            assets[manifest_path] = file_path
    return assets

def extract_manifest_paths(manifest: dict) -> Dict[str, str]:
    """Extract all file_path entries from manifest with their IDs."""
    paths = {}
    for asset in manifest.get('assets', []):
        file_path = asset.get('file_path')
        asset_id = asset.get('id')
        if file_path and asset_id:
            paths[file_path] = asset_id
    return paths

def extract_hero_asset_ids(hero_registry: dict) -> Set[str]:
    """Extract all asset_id references from hero compositions (excluding 'auto')."""
    asset_ids = set()
    for comp in hero_registry.get('compositions', []):
        for layer in comp.get('layers', []):
            asset_id = layer.get('asset_id')
            if asset_id and asset_id != 'auto':
                asset_ids.add(asset_id)
    return asset_ids

def reconcile() -> dict:
    """Perform full reconciliation audit."""

    # Load data sources
    manifest = load_json(MANIFEST_PATH)
    hero_registry = load_json(HERO_REGISTRY_PATH)
    filesystem_assets = scan_filesystem(ASSET_ROOT)
    manifest_paths = extract_manifest_paths(manifest)
    hero_asset_ids = extract_hero_asset_ids(hero_registry)

    # Build reverse lookup: ID -> file_path
    manifest_id_to_path = {v: k for k, v in manifest_paths.items()}

    # 1. Filesystem -> Manifest reconciliation
    orphans = []
    for fs_path in filesystem_assets.keys():
        if fs_path not in manifest_paths:
            orphans.append(fs_path)

    # 2. Manifest -> Filesystem reconciliation
    broken_references = []
    for manifest_path, asset_id in manifest_paths.items():
        if manifest_path not in filesystem_assets:
            broken_references.append({
                'id': asset_id,
                'missing_path': manifest_path
            })

    # 3. Hero -> Manifest reconciliation
    hero_missing_assets = []
    for hero_id in hero_asset_ids:
        if hero_id not in manifest_id_to_path:
            hero_missing_assets.append(hero_id)

    # 4. Calculate hero depth ratio
    total_compositions = len(hero_registry.get('compositions', []))
    deep_compositions = sum(
        1 for comp in hero_registry.get('compositions', [])
        if len(comp.get('layers', [])) >= 4
    )
    hero_depth_ratio = deep_compositions / total_compositions if total_compositions > 0 else 0

    # 5. Count unique hero assets used
    unique_hero_assets = len(hero_asset_ids)

    # 6. Per-layer counts
    layer_counts = {}
    for asset in manifest.get('assets', []):
        layer = asset.get('layer', 'unknown')
        layer_counts[layer] = layer_counts.get(layer, 0) + 1

    # Determine status
    status = "PASS" if (
        len(orphans) == 0 and
        len(broken_references) == 0 and
        len(hero_missing_assets) == 0
    ) else "FAIL"

    # Build report
    report = {
        "status": status,
        "manifest_total": len(manifest_paths),
        "filesystem_total": len(filesystem_assets),
        "orphans": orphans,
        "broken_references": broken_references,
        "hero_missing_assets": hero_missing_assets,
        "hero_depth_ratio": round(hero_depth_ratio, 2),
        "hero_compositions_total": total_compositions,
        "unique_hero_assets": unique_hero_assets,
        "layer_counts": layer_counts,
        "notes": []
    }

    # Add notes
    if orphans:
        report['notes'].append(f"{len(orphans)} orphaned files found on disk but not in manifest")
    if broken_references:
        report['notes'].append(f"{len(broken_references)} broken manifest references (files missing on disk)")
    if hero_missing_assets:
        report['notes'].append(f"{len(hero_missing_assets)} hero registry assets not found in manifest")
    if hero_depth_ratio < 0.5:
        report['notes'].append(f"Hero depth ratio {hero_depth_ratio:.0%} below 50% threshold")

    return report

def format_report(report: dict) -> str:
    """Format report for display."""
    lines = []
    lines.append("=" * 80)
    lines.append("KERALA RAGE MANIFEST RECONCILIATION REPORT")
    lines.append("=" * 80)
    lines.append(f"Status: {report['status']}")
    lines.append(f"Manifest entries: {report['manifest_total']}")
    lines.append(f"Filesystem assets: {report['filesystem_total']}")
    lines.append(f"Hero compositions: {report['hero_compositions_total']}")
    lines.append(f"Hero depth ratio: {report['hero_depth_ratio']:.0%} (layers >= 4)")
    lines.append(f"Unique hero assets: {report['unique_hero_assets']}")
    lines.append("")

    # Layer breakdown
    lines.append("Layer Distribution:")
    for layer, count in sorted(report['layer_counts'].items()):
        lines.append(f"  {layer}: {count}")
    lines.append("")

    # Issues
    if report['orphans']:
        lines.append(f"⚠️  ORPHANED FILES ({len(report['orphans'])}):")
        for path in sorted(report['orphans'])[:10]:  # Show first 10
            lines.append(f"  - {path}")
        if len(report['orphans']) > 10:
            lines.append(f"  ... and {len(report['orphans']) - 10} more")
        lines.append("")

    if report['broken_references']:
        lines.append(f"❌ BROKEN REFERENCES ({len(report['broken_references'])}):")
        for ref in report['broken_references'][:10]:
            lines.append(f"  - {ref['id']}: {ref['missing_path']}")
        if len(report['broken_references']) > 10:
            lines.append(f"  ... and {len(report['broken_references']) - 10} more")
        lines.append("")

    if report['hero_missing_assets']:
        lines.append(f"❌ HERO MISSING ASSETS ({len(report['hero_missing_assets'])}):")
        for asset_id in sorted(report['hero_missing_assets']):
            lines.append(f"  - {asset_id}")
        lines.append("")

    # Notes
    if report['notes']:
        lines.append("NOTES:")
        for note in report['notes']:
            lines.append(f"  • {note}")

    lines.append("=" * 80)

    return "\n".join(lines)

if __name__ == "__main__":
    report = reconcile()
    print(format_report(report))

    # Export JSON
    output_path = Path("/Users/okgoogle13/Projects/careercopilot/.temp-reconcile-report.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    print(f"\n✅ Full report exported to: {output_path}")
