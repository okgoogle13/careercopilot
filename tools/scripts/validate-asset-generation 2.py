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

def load_tokens(tokens_path: str = "frontend/src/design/tokens/tokens.json") -> Dict:
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
