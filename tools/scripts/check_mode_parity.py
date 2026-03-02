#!/usr/bin/env python3
# scripts/check_mode_parity.py
import json
import os
import sys

TOKEN_SOURCE_FILE = 'frontend/src/design/tokens/tokens.json'

def extract_mode_tokens(tokens: dict, mode: str) -> set:
    """Extract all token paths containing the mode name."""
    paths = set()

    def walk(obj, path=""):
        if isinstance(obj, dict):
            # If it's a token
            if ("$value" in obj or "value" in obj) and mode in path:
                paths.add(path)

            for key, val in obj.items():
                if key not in ["$value", "value", "$type", "description", "role", "usage"]:
                    walk(val, f"{path}.{key}" if path else key)

    walk(tokens)
    return paths

def main():
    print("🔍 MODE PARITY CHECK\n")

    if not os.path.exists(TOKEN_SOURCE_FILE):
        print(f"❌ CRITICAL: Token source file not found at {TOKEN_SOURCE_FILE}")
        sys.exit(1)

    with open(TOKEN_SOURCE_FILE, 'r') as f:
        try:
            tokens = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ CRITICAL: Invalid JSON in token file. {e}")
            sys.exit(1)

    gallery_paths = extract_mode_tokens(tokens, "gallery")
    lab_paths = extract_mode_tokens(tokens, "laboratory")

    # Normalize for comparison
    gallery_base = {p.replace(".gallery.", ".MODE.") for p in gallery_paths}
    lab_base = {p.replace(".laboratory.", ".MODE.") for p in lab_paths}

    # Find missing equivalents
    # Since tokens might be named specifically, we map back to original path if possible or just show normalized
    missing_lab_base = gallery_base - lab_base
    missing_gallery_base = lab_base - gallery_base

    if not missing_lab_base and not missing_gallery_base:
        print("✅ PERFECT PARITY: Gallery and Laboratory modes are fully synchronized.\n")

    if missing_lab_base:
        print(f"⚠️  Missing Laboratory equivalents ({len(missing_lab_base)}):\n")
        for p in sorted(missing_lab_base):
            # Try to find original gallery path
            orig = [orig_p for orig_p in gallery_paths if orig_p.replace(".gallery.", ".MODE.") == p]
            print(f"  {orig[0] if orig else p}")
            print(f"  → Gallery has this, Laboratory needs equivalent\n")

    if missing_gallery_base:
        print(f"⚠️  Missing Gallery equivalents ({len(missing_gallery_base)}):\n")
        for p in sorted(missing_gallery_base):
            orig = [orig_p for orig_p in lab_paths if orig_p.replace(".laboratory.", ".MODE.") == p]
            print(f"  {orig[0] if orig else p}")
            print(f"  → Laboratory has this, Gallery needs equivalent\n")

    total_base = gallery_base | lab_base
    matched = gallery_base & lab_base
    parity = (len(matched) / len(total_base) * 100) if total_base else 100

    print(f"📊 PARITY: {parity:.0f}% ({len(matched)}/{len(total_base)} tokens matched)")

    if missing_lab_base or missing_gallery_base:
        sys.exit(2)
    sys.exit(0)

if __name__ == "__main__":
    main()
