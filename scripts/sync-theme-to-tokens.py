#!/usr/bin/env python3
"""
Sync Kerala Rage theme artifacts from frontend token source-of-truth.

Source of truth:
  - frontend/src/design/tokens/tokens.json

Generated outputs:
  - frontend/src/design/styles/design-tokens.css
  - frontend/tailwind-m3-patch.ts
  - frontend/src/styles/design-tokens.css (legacy Storybook compatibility file)
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TOKENS_FILE = PROJECT_ROOT / "frontend" / "src" / "design" / "tokens" / "tokens.json"
LEGACY_CSS_FILE = PROJECT_ROOT / "frontend" / "src" / "styles" / "design-tokens.css"
BUILD_SCRIPT = PROJECT_ROOT / "scripts" / "build-m3-tokens.py"

LEGACY_SHAPE_ALIASES = {
    "pebbleSurge01": "marchSurge01",
    "pebbleSurge01-expanded": "marchSurge01-expanded",
    "scaffoldSlab01": "scaffoldFrame01",
    "scaffoldSlab01-focus": "scaffoldFrame01-focus",
    "radius-pebble": "radius-marchOpen",
    "radius-stone": "radius-megaphoneBase",
    "radius-slab": "radius-placardBase",
}

LEGACY_SHADOW_ALIASES = {
    "elevation1Pebble": "elevation1Strike",
    "elevation2Stone": "elevation2Placard",
}

REQUIRED_BRAND_COLORS = {
    "charcoalBackground.base": "#1A1714",
    "solidarityRed.base": "#F14714",
    "inkGold.base": "#DAF674",
}
REQUIRED_FONT_FAMILIES = {"Work Sans", "Fraunces", "Caveat"}
BANNED_FONT_NAMES = {"inter", "roboto", "arial"}


def _get_path(tree: dict[str, Any], path: str) -> Any:
    node: Any = tree
    for part in path.split("."):
        if not isinstance(node, dict) or part not in node:
            return None
        node = node[part]
    return node


def _value(node: Any) -> Any:
    if isinstance(node, dict) and "$value" in node:
        return node["$value"]
    return node


def load_tokens() -> dict[str, Any]:
    if not TOKENS_FILE.exists():
        raise FileNotFoundError(f"Missing token source: {TOKENS_FILE}")
    return json.loads(TOKENS_FILE.read_text())


def validate_brand_identity(tokens: dict[str, Any]) -> None:
    sys_tokens = tokens.get("sys", tokens)
    color_root = sys_tokens.get("color", {})
    type_root = sys_tokens.get("type", {})
    font_root = type_root.get("fontFamilies", {})

    violations: list[str] = []

    for rel_path, expected in REQUIRED_BRAND_COLORS.items():
        actual = _value(_get_path(color_root, rel_path))
        if not isinstance(actual, str):
            violations.append(f"Missing required color token: sys.color.{rel_path}")
            continue
        if actual.upper() != expected.upper():
            violations.append(
                f"Brand color mismatch sys.color.{rel_path}: expected {expected}, found {actual}"
            )

    font_values = []
    for key, node in font_root.items():
        value = _value(node)
        if isinstance(value, str):
            font_values.append(value)
            lowered = value.lower()
            if any(bad in lowered for bad in BANNED_FONT_NAMES):
                violations.append(f"Banned font detected in sys.type.fontFamilies.{key}: {value}")

    missing_required_fonts = sorted(f for f in REQUIRED_FONT_FAMILIES if f not in font_values)
    if missing_required_fonts:
        violations.append(
            "Missing required brand fonts in sys.type.fontFamilies: "
            + ", ".join(missing_required_fonts)
        )

    if violations:
        details = "\n - ".join(violations)
        raise ValueError(f"Brand identity validation failed:\n - {details}")


def write_legacy_css(tokens: dict[str, Any]) -> None:
    """Generate compact legacy CSS from current color base tokens."""
    sys_tokens = tokens.get("sys", tokens)
    color_root = sys_tokens.get("color", {})

    lines = [
        ":root {\n",
        "  /* Design tokens generated from frontend/src/design/tokens/tokens.json */\n",
        "\n",
    ]

    for name in sorted(color_root.keys()):
        base = _value(_get_path(color_root, f"{name}.base"))
        if isinstance(base, str):
            lines.append(f"  --sys-color-{name}-base: {base};\n")

    lines.extend(
        [
            "\n",
            "  /* One-release legacy archetype aliases */\n",
            "  --shape-pebbleSurge01: var(--shape-marchSurge01);\n",
            "  --shape-pebbleSurge01-expanded: var(--shape-marchSurge01-expanded);\n",
            "  --shape-scaffoldSlab01: var(--shape-scaffoldFrame01);\n",
            "  --shape-scaffoldSlab01-focus: var(--shape-scaffoldFrame01-focus);\n",
            "  --radius-pebble: var(--shape-radius-marchOpen);\n",
            "  --radius-stone: var(--shape-radius-megaphoneBase);\n",
            "  --radius-slab: var(--shape-radius-placardBase);\n",
            "  --sys-shadow-elevation1Pebble: var(--sys-shadow-elevation1Strike);\n",
            "  --sys-shadow-elevation2Stone: var(--sys-shadow-elevation2Placard);\n",
        ]
    )

    lines.append("}\n")
    LEGACY_CSS_FILE.parent.mkdir(parents=True, exist_ok=True)
    LEGACY_CSS_FILE.write_text("".join(lines))


def run_build() -> None:
    subprocess.run([sys.executable, str(BUILD_SCRIPT)], cwd=PROJECT_ROOT, check=True)


def main() -> int:
    try:
        tokens = load_tokens()
        validate_brand_identity(tokens)
        run_build()
        write_legacy_css(tokens)
        print("✅ Theme/token sync complete.")
        print(f"   Source: {TOKENS_FILE}")
        print(f"   Updated: frontend/src/design/styles/design-tokens.css")
        print(f"   Updated: frontend/tailwind-m3-patch.ts")
        print(f"   Updated: {LEGACY_CSS_FILE}")
        print("✅ Kerala Rage brand identity checks passed.")
        return 0
    except Exception as exc:  # pragma: no cover - CLI failure path
        print(f"❌ {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
