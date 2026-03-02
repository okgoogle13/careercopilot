
import os
import hashlib
import json
import re
import shlex

# --- Configuration ---
<<<<<<< HEAD
ROOT_DIR = '/Users/okgoogle13/Desktop/careercopilot'
DIRECTORIES = {
    'CANONICAL': os.path.join(ROOT_DIR, 'assets'),
    'NEW_SOURCE': os.path.join(ROOT_DIR, 'Curio images phase 3'),
    'LEGACY_PUBLIC': os.path.join(ROOT_DIR, 'frontend/public/assets'),
}

MANIFEST_PATH = os.path.join(ROOT_DIR, 'assets/northcote-curio-manifest.json')
=======
ROOT_DIR = '/Users/okgoogle13/Projects/careercopilot'
DIRECTORIES = {
    'CANONICAL': os.path.join(ROOT_DIR, 'assets'),
    'NEW_SOURCE': os.path.join(ROOT_DIR, '[DEPRECATED_STYLE] images phase 3'),
    'LEGACY_PUBLIC': os.path.join(ROOT_DIR, 'frontend/public/assets'),
}

MANIFEST_PATH = os.path.join(ROOT_DIR, 'assets/northcote-[DEPRECATED_STYLE]-manifest.json')
>>>>>>> restoration-KR-Rage-Figma-v2.0

# Known mappings from Legacy filenames to Manifest target filenames
# This enforces the "Naming Convention" requested by the user.
LEGACY_TO_MANIFEST_MAP = {
    # Asset 1: Wallpaper
<<<<<<< HEAD
    'texture-gallery-curio-wallpaper-2048.jpg': 'northcote-curio-wallpaper-v2.jpg',
    'gallery-nocturnal.png': 'northcote-curio-wallpaper-v2.png',
=======
    'texture-gallery-[DEPRECATED_STYLE]-wallpaper-2048.jpg': 'northcote-[DEPRECATED_STYLE]-wallpaper-v2.jpg',
    'gallery-nocturnal.png': 'northcote-[DEPRECATED_STYLE]-wallpaper-v2.png',
>>>>>>> restoration-KR-Rage-Figma-v2.0

    # Asset 2: Kookaburra
    'motif-gallery-sentry-kookaburra-1024.png': 'northcote-sentry-kookaburra.png',
    'sentry_kookaburra.png': 'northcote-sentry-kookaburra.png',

    # Asset 3: Canopy Pattern
    'texture-gallery-nocturnal-tile.png': 'northcote-canopy-pattern.png',
    'northcote-pattern-tile.png': 'northcote-canopy-pattern.png',

    # Asset 4: Wattle Beetle
    'northcote-vertical-beetle.png': 'northcote-wattle-beetle.png',
    'beetle-scarab.png': 'northcote-wattle-beetle.png',

    # Asset 5: Eucalyptus Echidna
    'northcote-vertical-echidna.png': 'northcote-eucalyptus-echidna.png',
<<<<<<< HEAD
    'motif-gallery-eucalyptus-specimen.png': 'northcote-eucalyptus-echidna.png',
=======
    'motif-gallery-eucalyptus-[DEPRECATED_STYLE].png': 'northcote-eucalyptus-echidna.png',
>>>>>>> restoration-KR-Rage-Figma-v2.0

    # Asset 6: Still Life
    'northcote-footer-still-life.png': 'northcote-temporal-still-life.png',

    # Asset 10: Spinner
    'northcote-banksia-spinner.png': 'northcote-banksia-spinner.png'
}

# Regex mapping for Categories
CATEGORY_RULES = [
    (r'wallpaper|plate|background', 'plates'),
    (r'kookaburra|sentry|fauna|bat|beetle|echidna', 'fauna'),
    (r'texture|pattern|canopy|grain|noise', 'textures'),
<<<<<<< HEAD
    (r'specimen|fossil|bone|coral|fungus|spine', 'specimens'),
=======
    (r'[DEPRECATED_STYLE]|fossil|bone|coral|fungus|spine', 'specimens'),
>>>>>>> restoration-KR-Rage-Figma-v2.0
    (r'icon|spinner|ui|logo|badge', 'ui'),
]

DEFAULT_CATEGORY = 'uncategorized'

def get_file_hash(filepath):
    """Calculates MD5 hash of a file."""
    try:
        hasher = hashlib.md5()
        with open(filepath, 'rb') as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        print(f"Error hashing {filepath}: {e}")
        return None

def categorize_file(filename):
    """Determines the target subdirectory based on filename."""
    lower_name = filename.lower()
    for pattern, category in CATEGORY_RULES:
        if re.search(pattern, lower_name):
            return category
    return DEFAULT_CATEGORY

def get_manifest_target(filename):
    """Returns the standardized filename if a known mapping exists."""
    return LEGACY_TO_MANIFEST_MAP.get(filename, filename)

def analyze_assets():
    """Scans directories, detects duplicates, and maps consolidation."""
    asset_map = {}  # hash -> { ... }

    # scan order: scan canonical FIRST to establish truth
    scan_order = [
         ('CANONICAL', DIRECTORIES['CANONICAL']),
         ('NEW_SOURCE', DIRECTORIES['NEW_SOURCE']),
         ('LEGACY_PUBLIC', DIRECTORIES['LEGACY_PUBLIC']),
    ]

    for source_label, source_path in scan_order:
        if not os.path.exists(source_path):
            print(f"Skipping missing directory: {source_path}")
            continue

        for root, _, files in os.walk(source_path):
            for file in files:
                if file.startswith('.'): continue # Skip hidden files

                filepath = os.path.join(root, file)
                file_hash = get_file_hash(filepath)
                if not file_hash: continue

                if file_hash not in asset_map:
                    asset_map[file_hash] = {
                        'hash': file_hash,
                        'original_filename': file,
                        'canonical_path': None,
                        'sources': [],
                        'proposed_dest': None
                    }

                asset_entry = asset_map[file_hash]
                asset_entry['sources'].append({'path': filepath, 'source_label': source_label})

                # If found in canonical, mark it
                if source_label == 'CANONICAL':
                    asset_entry['canonical_path'] = filepath
                    rel_path = os.path.relpath(root, DIRECTORIES['CANONICAL'])
                    if rel_path != '.':
                         asset_entry['category'] = rel_path
                    else:
                         asset_entry['category'] = categorize_file(file)

                # If not canonical, propose category
                if 'category' not in asset_entry:
                     asset_entry['category'] = categorize_file(file)

    # Generate Final Plan
    consolidation_plan = []

    for file_hash, data in asset_map.items():
        original_name = data['original_filename']
        category = data['category']

        # Determine Target Filename (Enforce Naming Convention)
        target_filename = get_manifest_target(original_name)

        # Determine Full Destination Path
        dest_path = os.path.join(DIRECTORIES['CANONICAL'], category, target_filename)

        if data['canonical_path']:
             # It's already in canonical.
             current_canon_name = os.path.basename(data['canonical_path'])
             if current_canon_name != target_filename:
                 # It's in canonical but wrong name. RENAME.
                 action = 'RENAME'
             else:
                 dest_path = data['canonical_path']
                 action = 'KEEP'
        else:
             # Not in canonical, move from source
             action = 'MOVE'

        plan_entry = {
            'filename': target_filename,
            'original_filename': original_name,
            'hash': file_hash,
            'action': action,
            'destination': dest_path,
            'sources': [s['path'] for s in data['sources']],
            'source_labels': [s['source_label'] for s in data['sources']],
            'current_canonical_path': data['canonical_path']
        }
        consolidation_plan.append(plan_entry)

    # Write Result
    output_file = os.path.join(ROOT_DIR, 'consolidation-analysis.json')
    with open(output_file, 'w') as f:
        json.dump(consolidation_plan, f, indent=2)

    print(f"Analysis complete. Found {len(consolidation_plan)} unique assets.")
    print(f"Renaming rules applied for {len(LEGACY_TO_MANIFEST_MAP)} legacy patterns.")
    print(f"Report saved to: {output_file}")

if __name__ == '__main__':
    analyze_assets()
