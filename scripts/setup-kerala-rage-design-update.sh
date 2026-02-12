#!/usr/bin/env bash
set -euo pipefail

echo "🌾 Northcote Contemporary Australian Design System – Setup"
echo "--------------------------------------------------------"

# 1. Ensure Python env
if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ python3 not found. Please install Python 3.10+ and re-run."
  exit 1
fi

# 2. Ensure scripts directory
mkdir -p scripts

# 3. Write updated tokens.json (contemporary Australian)
cat > design-system/tokens.json << 'EOF'
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "version": "3.0.0",
  "system": "Northcote - Contemporary Australian Design Tokens",
  "$description": "Material 3 Expressive structure with Peter Drew street art aesthetic and Australian endemic species symbolism",
  "color": {
    "asphaltBlack": "#1A1714",
    "paperWhite": "#F5F0E8",
    "wattleGold": "#D4A84B",
    "waratahRed": "#C45C4B",
    "ochreEarth": "#B8733D",
    "concreteGrey": "#A39B8F",
    "gumLeafGreen": "#6B7F6E",
    "primary": {
      "DEFAULT": "#D4A84B",
      "container": "#8B7A35",
      "onContainer": "#F5DDAA",
      "on": "#1A1714",
      "0": "#000000",
      "10": "#2A1F0B",
      "20": "#453819",
      "30": "#5F4E27",
      "40": "#8B7A35",
      "50": "#D4A84B",
      "60": "#E8C963",
      "70": "#F5DDAA",
      "80": "#FBF0D6",
      "90": "#FFF8EB",
      "95": "#FFFCF5",
      "99": "#FFFEFA",
      "100": "#FFFFFF"
    },
    "secondary": {
      "DEFAULT": "#C45C4B",
      "container": "#7A3A2E",
      "onContainer": "#F5A89A",
      "on": "#F5F0E8",
      "0": "#000000",
      "10": "#2B1410",
      "20": "#47241E",
      "30": "#62362D",
      "40": "#7A3A2E",
      "50": "#C45C4B",
      "60": "#E07865",
      "70": "#F5A89A",
      "80": "#FFCFC4",
      "90": "#FFE6DD",
      "95": "#FFF3EF",
      "99": "#FFFBFE",
      "100": "#FFFFFF"
    },
    "tertiary": {
      "DEFAULT": "#B8733D",
      "container": "#7A4A26",
      "onContainer": "#E8C5A3",
      "on": "#1A1714",
      "0": "#000000",
      "10": "#1F150A",
      "20": "#3A2615",
      "30": "#553720",
      "40": "#7A4A26",
      "50": "#B8733D",
      "60": "#D49358",
      "70": "#E8C5A3",
      "80": "#F5E3CF",
      "90": "#FBF3E8",
      "95": "#FEF9F3",
      "99": "#FFFCFA",
      "100": "#FFFFFF"
    },
    "error": {
      "DEFAULT": "#FF6B9D",
      "container": "#FFD9E2",
      "on": "#3E001D",
      "0": "#000000",
      "10": "#3E001D",
      "20": "#5C1134",
      "30": "#7A1C48",
      "40": "#99295D",
      "50": "#B73773",
      "60": "#D5468A",
      "70": "#F365A3",
      "80": "#FF6B9D",
      "90": "#FFB4C7",
      "95": "#FFD9E2",
      "99": "#FFFBFA",
      "100": "#FFFFFF"
    },
    "surface": {
      "DEFAULT": "#1A1714",
      "container": "#2C2723",
      "containerLow": "#211F1C",
      "containerHigh": "#36332F",
      "containerHighest": "#41403B",
      "dim": "#141211",
      "bright": "#23211E",
      "on": "#F5F0E8",
      "onVariant": "#A39B8F",
      "variant": "#49454F"
    },
    "outline": {
      "DEFAULT": "#A39B8F",
      "variant": "#49454F"
    },
    "background": "#1A1714",
    "onBackground": "#F5F0E8",
    "shadow": "#6B7F6E",
    "scrim": "#000000",
    "inverseSurface": "#F5F0E8",
    "inverseOnSurface": "#1A1714",
    "inversePrimary": "#D4A84B",
    "disabled": {
      "text": "rgba(245, 240, 232, 0.38)",
      "surface": "rgba(245, 240, 232, 0.12)"
    },
    "neutral": {
      "0": "#000000",
      "10": "#1A1714",
      "20": "#2F2D2A",
      "30": "#46443F",
      "40": "#5D5B56",
      "50": "#78756F",
      "60": "#938F88",
      "70": "#AEA9A2",
      "80": "#C9C4BC",
      "90": "#E5DFD7",
      "95": "#F3EDE5",
      "99": "#FDFAF7",
      "100": "#FFFFFF"
    },
    "neutralVariant": {
      "0": "#000000",
      "10": "#191716",
      "20": "#2E2C2A",
      "30": "#444240",
      "40": "#5C5957",
      "50": "#74716E",
      "60": "#8E8B88",
      "70": "#A8A5A2",
      "80": "#C4C0BC",
      "90": "#E0DCD7",
      "95": "#EEEAE5",
      "99": "#FAF8F5",
      "100": "#FFFFFF"
    }
  }
}
EOF

echo "✅ Updated design-system/tokens.json"

# 4. Write quick-token-update.py
cat > scripts/quick-token-update.py << 'EOF'
#!/usr/bin/env python3
"""
Northcote Token Migration Script
Automatically updates old token names to new contemporary Australian naming.
"""

import os
import sys
from pathlib import Path
from typing import List, Tuple, Dict

TOKEN_MAPPINGS = {
    "[DEPRECATED_STYLE] Night": "Asphalt Black",
    "[DEPRECATED_STYLE]-night": "asphalt-black",
    "specimen_night": "asphalt_black",
    "Parchment": "Paper White",
    "parchment": "paper-white",
    "[DEPRECATED_STYLE] Crimson": "[DEPRECATED_STYLE] Red",
    "[DEPRECATED_STYLE]-crimson": "[DEPRECATED_STYLE]-red",
    "waratah_crimson": "waratah_red",
    "Eucalypt Smoke": "Concrete Grey",
    "eucalypt-smoke": "concrete-grey",
    "eucalypt_smoke": "concrete_grey",
    "Flannel Flower": "Concrete Grey",
    "flannel-flower": "concrete-grey",
    "flannel_flower": "concrete_grey",
    "#141218": "#1A1714",
    "#E6E0E9": "#F5F0E8"
}

SCAN_PATTERNS = [
    "**/*.md",
    "**/*.css",
    "**/*.json",
    "**/*.tsx",
    "**/*.ts",
    "**/*.jsx",
    "**/*.js"
]

EXCLUDE_DIRS = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "__pycache__",
    "venv",
    ".venv"
]

def find_files(root_dir: str = ".") -> List[Path]:
    root = Path(root_dir)
    files: List[Path] = []
    for pattern in SCAN_PATTERNS:
        for file_path in root.glob(pattern):
            if any(excluded in file_path.parts for excluded in EXCLUDE_DIRS):
                continue
            if file_path.is_file():
                files.append(file_path)
    return files

def scan_file(file_path: Path):
    matches = []
    try:
        content = file_path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, PermissionError):
        return matches

    lines = content.split("\n")
    for line_num, line in enumerate(lines, 1):
        for old_token, new_token in TOKEN_MAPPINGS.items():
            if old_token in line:
                matches.append((line_num, old_token, new_token, line.strip()))
    return matches

def update_file(file_path: Path, dry_run: bool = True) -> int:
    try:
        content = file_path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, PermissionError):
        return 0

    original_content = content
    for old_token, new_token in TOKEN_MAPPINGS.items():
        content = content.replace(old_token, new_token)

    if not dry_run and content != original_content:
        file_path.write_text(content, encoding="utf-8")
    return 0 if content == original_content else 1

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Migrate Northcote design tokens from [DEPRECATED_STYLE] [DEPRECATED_STYLE] to Contemporary Australian naming"
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without applying them")
    parser.add_argument("--apply", action="store_true", help="Apply all changes")
    parser.add_argument("--root", default=".", help="Root directory to scan")

    args = parser.parse_args()

    if not args.dry_run and not args.apply:
        print("⚠️  Please specify --dry-run or --apply")
        sys.exit(1)

    print("🔍 Scanning for old token references...\n")
    files = find_files(args.root)
    print(f"📁 Found {len(files)} files to check\n")

    all_matches: Dict[Path, list] = {}
    for file_path in files:
        matches = scan_file(file_path)
        if matches:
            all_matches[file_path] = matches

    if not all_matches:
        print("✅ No old token references found!")
        return

    print(f"📝 Found references in {len(all_matches)} files:\n")
    for file_path, matches in all_matches.items():
        print(f"  {file_path}:")
        for line_num, old_token, new_token, line_content in matches[:3]:
            print(f"    Line {line_num}: {old_token} → {new_token}")
        if len(matches) > 3:
            print(f"    ... and {len(matches) - 3} more")
        print()

    if args.apply:
        print("🔧 Applying changes...\n")
        updated_files = 0
        for file_path in all_matches.keys():
            changed = update_file(file_path, dry_run=False)
            if changed:
                print(f"  ✓ Updated: {file_path}")
                updated_files += 1
        print(f"\n✅ Updated {updated_files} files")
    else:
        print("💡 Run with --apply to make these changes")
        print("   Example: python scripts/quick-token-update.py --apply")

if __name__ == "__main__":
    main()
EOF

chmod +x scripts/quick-token-update.py
echo "✅ Wrote scripts/quick-token-update.py"

# 5. Write validate-asset-generation.py
cat > scripts/validate-asset-generation.py << 'EOF'
#!/usr/bin/env python3
"""
Northcote Asset Generation Validator
Ensures AI-generated image prompts match the contemporary Australian design system.
"""

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict

@dataclass
class ValidationResult:
    passed: bool
    score: float
    errors: List[str]
    warnings: List[str]
    recommendations: List[str]

FORBIDDEN_TERMS = [
    "[DEPRECATED_STYLE]",
    "vintage",
    "sepia",
    "[DEPRECATED_STYLE]",
    "cabinet",
    "museum",
    "preserved",
    "fig.",
    "[DEPRECATED_STYLE]",
    "federation",
    "colonial"
]

REQUIRED_TERMS = [
    "contemporary",
    "bold",
    "street art",
    "melbourne",
    "living",
    "graphic"
]

FORBIDDEN_COLORS_OLD = [
    "#141218",
    "#E6E0E9"
]

def load_tokens(tokens_path: str = "design-system/tokens.json") -> Dict:
    try:
        return json.loads(Path(tokens_path).read_text())
    except FileNotFoundError:
        return {
            "color": {
                "asphaltBlack": "#1A1714",
                "paperWhite": "#F5F0E8",
                "wattleGold": "#D4A84B",
                "waratahRed": "#C45C4B",
                "ochreEarth": "#B8733D",
                "concreteGrey": "#A39B8F",
                "gumLeafGreen": "#6B7F6E"
            }
        }

def validate_prompt_text(prompt: str) -> ValidationResult:
    errors: List[str] = []
    warnings: List[str] = []
    recommendations: List[str] = []
    score = 100.0

    lower = prompt.lower()

    for term in FORBIDDEN_TERMS:
        if term in lower:
            errors.append(f"❌ Forbidden term found: '{term}'")
            score -= 15

    missing = [t for t in REQUIRED_TERMS if t not in lower]
    if missing:
        warnings.append(f"⚠️ Missing recommended terms: {', '.join(missing)}")
        score -= 5 * len(missing)

    tokens = load_tokens()
    palette = tokens.get("color", {})
    found_colors = []
    for name, value in palette.items():
        if isinstance(value, str) and value in prompt:
            found_colors.append(f"{name} ({value})")

    if not found_colors:
        warnings.append("⚠️ No explicit color tokens found in prompt")
        recommendations.append("Include hex like #1A1714 (Asphalt Black) or #D4A84B (Wattle Gold)")
        score -= 10

    for old in FORBIDDEN_COLORS_OLD:
        if old in prompt:
            errors.append(f"❌ Old deprecated color found: {old}")
            score -= 20

    if "peter drew" not in lower and "street art" not in lower:
        warnings.append("⚠️ Missing 'Peter Drew' or 'street art' aesthetic reference")
        score -= 10

    if "asphalt black" not in lower and "#1A1714" not in prompt:
        warnings.append("⚠️ Background should specify 'Asphalt Black (#1A1714)'")
        score -= 5

    if "urban" not in lower and "melbourne" not in lower:
        recommendations.append("Consider adding 'urban Melbourne' or 'living context' framing")

    if score < 80:
        recommendations.append("Review the Northcote Image Generator system prompt for full template")

    passed = len(errors) == 0 and score >= 70
    return ValidationResult(passed, max(0, score), errors, warnings, recommendations)

def print_result(result: ValidationResult, name: str = "Prompt") -> None:
    print("\n" + "="*60)
    print(f"  {name}")
    print("="*60 + "\n")
    print(f"📊 Score: {result.score:.1f}/100")
    print(f"✓ Status: {'PASSED' if result.passed else 'FAILED'}\n")
    if result.errors:
        print("❌ ERRORS:")
        for e in result.errors:
            print(f"  {e}")
        print()
    if result.warnings:
        print("⚠️ WARNINGS:")
        for w in result.warnings:
            print(f"  {w}")
        print()
    if result.recommendations:
        print("💡 RECOMMENDATIONS:")
        for r in result.recommendations:
            print(f"  • {r}")
        print()

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Validate Northcote asset generation prompts")
    parser.add_argument("prompt_file", nargs="?", help="Prompt file to validate")
    parser.add_argument("--batch", help="Validate all prompts in a directory")
    args = parser.parse_args()

    if args.batch:
        dir_path = Path(args.batch)
        files = list(dir_path.glob("*.txt")) + list(dir_path.glob("*.md"))
        print(f"🔍 Found {len(files)} prompt files\n")
        results = []
        for f in files:
            text = f.read_text(encoding="utf-8")
            res = validate_prompt_text(text)
            print_result(res, f.name)
            results.append(res)
        if results:
            avg = sum(r.score for r in results) / len(results)
            passed = sum(1 for r in results if r.passed)
            print("="*60)
            print("📊 BATCH SUMMARY")
            print("="*60)
            print(f"Passed: {passed}/{len(results)}")
            print(f"Average Score: {avg:.1f}/100")
        return

    if args.prompt_file:
        text = Path(args.prompt_file).read_text(encoding="utf-8")
        res = validate_prompt_text(text)
        print_result(res, args.prompt_file)
        sys.exit(0 if res.passed else 1)

    print("Paste your prompt, then Ctrl+D (Unix) or Ctrl+Z (Windows):\n")
    text = sys.stdin.read()
    res = validate_prompt_text(text)
    print_result(res, "Your Prompt")
    sys.exit(0 if res.passed else 1)

if __name__ == "__main__":
    main()
EOF

chmod +x scripts/validate-asset-generation.py
echo "✅ Wrote scripts/validate-asset-generation.py"

# 6. Print Antigravity instructions snippet
cat << 'EOF'

--------------------------------------------------------
🧠 Antigravity + Gemini 3 Pro – Project Instructions
--------------------------------------------------------

Copy this into your Antigravity project instructions:

[Antigravity Project Instructions]

You are Gemini 3 Pro inside Antigravity, working on the Northcote repo.

Use these as authoritative design files:
- design-system/tokens.json
- design-system/northcote.css
- design-system/01-tokens.md
- design-system/image-generator-prompt.md

Core rules:
- Dark UI base: Asphalt Black #1A1714, text Paper White #F5F0E8.
- Primary: Wattle Gold #D4A84B; Secondary: [DEPRECATED_STYLE] Red #C45C4B; Tertiary: Ochre Earth #B8733D; neutrals Concrete Grey #A39B8F and Gum Leaf Green #6B7F6E.
- Use tokens, not raw hex, in UI code.
- No [DEPRECATED_STYLE] museum/[DEPRECATED_STYLE]/sepia/colonial nostalgia.
- Species graphics: Peter Drew street art, contemporary Melbourne, living not preserved.

Migration rules:
- [DEPRECATED_STYLE] Night → Asphalt Black
- Parchment → Paper White
- [DEPRECATED_STYLE] Crimson → [DEPRECATED_STYLE] Red
- Eucalypt Smoke → Concrete Grey
- Flannel Flower → Concrete Grey
- #141218 → #1A1714
- #E6E0E9 → #F5F0E8

When asked to update a file:
- Read it, apply these rules, keep structure/tone, return full updated content.

EOF

echo "✅ Setup complete."
echo
echo "Next steps:"
echo "  1) Run: python scripts/quick-token-update.py --dry-run"
echo "  2) If it looks good: python scripts/quick-token-update.py --apply"
echo "  3) Use scripts/validate-asset-generation.py to sanity-check new image prompts."
