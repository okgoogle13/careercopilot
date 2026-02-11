#!/usr/bin/env python3
"""
Asset Purge & Triage Script
Sorts assets in frontend/public/assets/ into categorized buckets:
  - keep/       → Genuine Kerala Rage solidarity assets
  - quarantine/ → Ambiguous, needs manual review
  - legacy/     → Northcote Curio / botanical / Victorian science
  - discard/    → Storybook screenshots, test images, tool artifacts

Inspired by legacy kerala-rage-asset-cataloger triage patterns.
"""

import json
import hashlib
import shutil
import sys
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# ============================================================================
# CLASSIFICATION PATTERNS
# ============================================================================

# Northcote Curio / botanical / Victorian science theme
LEGACY_PATTERNS = [
    'haeckel', 'fossil', 'starfish', 'fern', 'leaf-fern', 'coral',
    'beetle', 'wattle', 'echidna', 'flying-fox', 'sea-urchin',
    'radiolaria', 'stromatolite', 'waratah', 'canopy', 'grinding-stone',
    'skeleton', 'compass', 'kr-leafus', 'kr-flower', 'kr-dark',
    'firefly', 'nocturnal', 'temporal-still', 'bone-cage',
    'anatomical', 'victorian', 'botanical', 'curio', 'northcote',
    'labyrinth', 'organic-labyr', 'brain-coral', 'pod.jpg',
    'spine.png', 'icon-fossil', 'icon-haeckel',
]

# Storybook/dev/test artifacts
DISCARD_PATTERNS = [
    'testing', 'theming', 'styling', 'accessibility', 'storybook',
    'cover', 'share', 'figma-plugin', 'addon-library', 'sentry',
    'docs', 'context', 'assets', 'paper-grain', 'motif-reference',
    'test-image', 'logo', 'bg__v1', 'file-mgjyrlfbzt',
    'nav-icons', 'verification-stamp',
]

# Genuine Kerala Rage solidarity patterns (things to KEEP)
KEEP_PATTERNS = [
    'shiva', 'trishula', 'damru', 'elephant', 'bhagat', 'tipu',
    'solidarity', 'protest', 'placard', 'graffiti', 'street',
    'wheat-paste', 'screenprint', 'agitprop', 'fist', 'resistance',
    'martyr', 'inquilab', 'treaty', 'always-was',
    'laneway', 'melbourne', 'kerala', 'charcoal',
    'devotional', 'portrait', 'symbol', 'texture',
    'paint-splash', 'ink-drip',
]

# Folders to skip entirely
SKIP_DIRS = [
    'node_modules', '.storybook', 'mockups', 'placeholders', 'templates',
]

# ============================================================================
# TRIAGE ENGINE
# ============================================================================

def file_hash(filepath: Path) -> str:
    """SHA-256 content hash for duplicate detection."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()


def classify_asset(filepath: Path) -> dict:
    """
    Classify a single asset file into a triage category.
    Returns dict with category, confidence, and reason.
    """
    name = filepath.name.lower()
    rel = str(filepath).lower()
    size = filepath.stat().st_size

    # Check if in a skip directory
    for skip in SKIP_DIRS:
        if f'/{skip}/' in rel:
            return {
                'category': 'discard',
                'confidence': 'HIGH',
                'reason': f'In excluded directory: {skip}',
            }

    # Check legacy patterns (Northcote Curio)
    for pattern in LEGACY_PATTERNS:
        if pattern in name or pattern in rel:
            return {
                'category': 'legacy',
                'confidence': 'HIGH',
                'reason': f'Northcote Curio pattern match: {pattern}',
            }

    # Check discard patterns (storybook/dev)
    for pattern in DISCARD_PATTERNS:
        if pattern in name:
            return {
                'category': 'discard',
                'confidence': 'HIGH',
                'reason': f'Dev/test artifact pattern: {pattern}',
            }

    # Very small files are likely icons/screenshots, not generated art
    if size < 50_000:  # < 50KB
        return {
            'category': 'discard',
            'confidence': 'MEDIUM',
            'reason': f'Very small file ({size} bytes) — likely icon/screenshot',
        }

    # Check keep patterns
    for pattern in KEEP_PATTERNS:
        if pattern in name or pattern in rel:
            return {
                'category': 'keep',
                'confidence': 'HIGH',
                'reason': f'Kerala Rage pattern match: {pattern}',
            }

    # Files in haeckel-grid subfolder
    if 'haeckel-grid' in rel:
        return {
            'category': 'legacy',
            'confidence': 'HIGH',
            'reason': 'In haeckel-grid directory',
        }

    # Large Gemini/ChatGPT generated images default to quarantine for review
    if 'gemini_generated' in name or 'chatgpt' in name:
        if size > 1_000_000:
            return {
                'category': 'quarantine',
                'confidence': 'MEDIUM',
                'reason': 'AI-generated, large file — needs visual review',
            }

    # Generic large images in kr-solidarity → likely genuine, quarantine for review
    if 'kr-solidarity' in rel and size > 500_000:
        return {
            'category': 'quarantine',
            'confidence': 'LOW',
            'reason': 'In kr-solidarity folder, large file — needs visual review',
        }

    # Default: quarantine
    return {
        'category': 'quarantine',
        'confidence': 'LOW',
        'reason': 'No pattern match — needs manual review',
    }


def find_duplicates(file_hashes: dict) -> dict:
    """Find files with identical content hashes."""
    hash_to_files = defaultdict(list)
    for filepath, h in file_hashes.items():
        hash_to_files[h].append(filepath)
    return {h: files for h, files in hash_to_files.items() if len(files) > 1}


# ============================================================================
# MAIN
# ============================================================================

def run_purge(assets_dir: str, dry_run: bool = True):
    """
    Scan assets directory and sort into triage buckets.
    If dry_run=True, only reports — does not move files.
    """
    assets_path = Path(assets_dir)
    if not assets_path.exists():
        print(f"❌ Directory not found: {assets_dir}")
        sys.exit(1)

    # Create output directories
    output_base = assets_path / '_triage'
    buckets = ['keep', 'quarantine', 'legacy', 'discard']

    if not dry_run:
        for bucket in buckets:
            (output_base / bucket).mkdir(parents=True, exist_ok=True)

    # Find all images
    supported = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}
    all_images = []
    for ext in supported:
        all_images.extend(assets_path.rglob(f'*{ext}'))
        all_images.extend(assets_path.rglob(f'*{ext.upper()}'))

    # Filter out _triage directory itself
    all_images = [f for f in all_images if '_triage' not in str(f)]
    all_images = list(set(all_images))

    print(f"\n{'='*70}")
    print(f"ASSET PURGE {'(DRY RUN)' if dry_run else '(LIVE)'}")
    print(f"{'='*70}")
    print(f"📁 Scanning: {assets_dir}")
    print(f"📊 Total images found: {len(all_images)}")
    print()

    # Phase 1: Classify each file
    results = {}
    file_hashes = {}

    for img in sorted(all_images):
        classification = classify_asset(img)
        results[img] = classification

        # Compute hash for duplicate detection
        try:
            file_hashes[img] = file_hash(img)
        except Exception:
            pass

    # Phase 2: Detect duplicates
    duplicates = find_duplicates(file_hashes)

    # Phase 3: Report
    counts = defaultdict(int)
    for r in results.values():
        counts[r['category']] += 1

    print(f"📈 TRIAGE DISTRIBUTION")
    print(f"  ✅ keep:       {counts['keep']}")
    print(f"  ⚠️  quarantine: {counts['quarantine']}")
    print(f"  📦 legacy:     {counts['legacy']}")
    print(f"  🗑️  discard:    {counts['discard']}")
    print()

    if duplicates:
        total_dupes = sum(len(files) - 1 for files in duplicates.values())
        print(f"🔄 DUPLICATES FOUND: {total_dupes} duplicate files across {len(duplicates)} groups")
        for h, files in list(duplicates.items())[:5]:
            print(f"  Hash: {h[:12]}...")
            for f in files:
                print(f"    → {f.relative_to(assets_path)}")
        if len(duplicates) > 5:
            print(f"  ... and {len(duplicates) - 5} more groups")
        print()

    # Detailed listing per category
    for category in buckets:
        items = [(p, r) for p, r in results.items() if r['category'] == category]
        if items:
            print(f"\n{'─'*70}")
            emoji = {'keep': '✅', 'quarantine': '⚠️', 'legacy': '📦', 'discard': '🗑️'}
            print(f"{emoji[category]} {category.upper()} ({len(items)} files)")
            print(f"{'─'*70}")
            for filepath, classification in sorted(items, key=lambda x: str(x[0])):
                rel = filepath.relative_to(assets_path)
                size_kb = filepath.stat().st_size / 1024
                conf = classification['confidence']
                reason = classification['reason']
                print(f"  [{conf}] {rel} ({size_kb:.0f}KB) — {reason}")

    # Phase 4: Execute moves (if not dry run)
    if not dry_run:
        print(f"\n{'='*70}")
        print(f"EXECUTING MOVES...")
        print(f"{'='*70}")

        moved = defaultdict(int)
        for filepath, classification in results.items():
            category = classification['category']
            dest = output_base / category / filepath.name

            # Handle name collisions
            counter = 1
            while dest.exists():
                stem = filepath.stem
                dest = output_base / category / f"{stem}_dup{counter}{filepath.suffix}"
                counter += 1

            try:
                shutil.move(str(filepath), str(dest))
                moved[category] += 1
            except Exception as e:
                print(f"  ❌ Failed to move {filepath}: {e}")

        print(f"\n✅ MOVES COMPLETE:")
        for cat, count in moved.items():
            print(f"  {cat}: {count} files moved")

    # Save triage report
    report = {
        'metadata': {
            'scan_date': datetime.now().isoformat(),
            'source_directory': str(assets_dir),
            'total_scanned': len(all_images),
            'dry_run': dry_run,
        },
        'summary': dict(counts),
        'duplicates': {
            'total_groups': len(duplicates),
            'total_duplicate_files': sum(len(f) - 1 for f in duplicates.values()),
        },
        'triage_actions': [
            {
                'file': str(fp.relative_to(assets_path)),
                'category': r['category'],
                'confidence': r['confidence'],
                'reason': r['reason'],
                'size_bytes': fp.stat().st_size if fp.exists() else 0,
            }
            for fp, r in sorted(results.items(), key=lambda x: str(x[0]))
        ],
    }

    report_path = Path('./asset-triage-report.json')
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)

    print(f"\n📋 Report saved: {report_path}")
    return report


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Asset Purge & Triage')
    parser.add_argument('directory', help='Assets directory to scan')
    parser.add_argument('--execute', action='store_true',
                        help='Actually move files (default: dry run)')
    args = parser.parse_args()

    run_purge(args.directory, dry_run=not args.execute)
