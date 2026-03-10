#!/usr/bin/env python3
"""
Fail if legacy archetype terms appear outside approved compatibility zones.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

SCAN_ROOTS = [
    PROJECT_ROOT / "frontend" / "src" / "design",
    PROJECT_ROOT / "frontend" / "src" / "styles" / "design-tokens.css",
    PROJECT_ROOT / "frontend" / "tailwind.config.ts",
    PROJECT_ROOT / "frontend" / "tailwind-m3-patch.ts",
    PROJECT_ROOT / "docs" / "design" / "01_CANON.md",
    PROJECT_ROOT / "docs" / "design" / "02_SYSTEM.md",
    PROJECT_ROOT / "docs" / "design" / "03_COMPONENTS.md",
    PROJECT_ROOT / "docs" / "design" / "04_ASSETS.md",
    PROJECT_ROOT / "docs" / "design" / "05_FLOWS.md",
    PROJECT_ROOT / "docs" / "DESIGN_TOKEN_MAINTENANCE.md",
    PROJECT_ROOT / "docs" / "DOC-009_Token_Gap_Analysis.md",
]

EXCLUDE_PARTS = {
    "node_modules",
    "Archive",
    "archive",
    "reports",
    "generated",
    "hifi",
    "coverage",
}

ALLOWED_FILES = {
    PROJECT_ROOT / "frontend" / "src" / "design" / "tokens" / "tokens.json",
    PROJECT_ROOT / "frontend" / "src" / "design" / "tokens" / "tokens.tokensstudio.json",
    PROJECT_ROOT / "frontend" / "src" / "design" / "styles" / "design-tokens.css",
    PROJECT_ROOT / "frontend" / "src" / "styles" / "design-tokens.css",
    PROJECT_ROOT / "frontend" / "tailwind-m3-patch.ts",
    PROJECT_ROOT / "frontend" / "src" / "components" / "ui" / "Pebble.tsx",
    PROJECT_ROOT / "frontend" / "src" / "components" / "ui" / "Stone.tsx",
    PROJECT_ROOT / "frontend" / "src" / "components" / "ui" / "Jar.tsx",
    PROJECT_ROOT / "frontend" / "src" / "components" / "ui" / "Lens.tsx",
    PROJECT_ROOT / "frontend" / "src" / "components" / "ui" / "Cabinet.tsx",
    PROJECT_ROOT / "frontend" / "src" / "components" / "ui" / "Seed.tsx",
    PROJECT_ROOT / "frontend" / "src" / "components" / "ui" / "index.ts",
    PROJECT_ROOT / "docs" / "design" / "03_COMPONENTS.md",
}

PATTERNS = [
    re.compile(r"\bSeed\b"),
    re.compile(r"\bPebble\b"),
    re.compile(r"\bLens\b"),
    re.compile(r"\bJar\b"),
    re.compile(r"\bCabinet\b"),
    re.compile(r"\bpebbleSurge01(?:-expanded)?\b"),
    re.compile(r"\bscaffoldSlab01(?:-focus)?\b"),
    re.compile(r"\bradius-pebble\b"),
    re.compile(r"\bradius-stone\b"),
    re.compile(r"\bradius-slab\b"),
    re.compile(r"\belevation1Pebble\b"),
    re.compile(r"\belevation2Stone\b"),
]

TEXT_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".css",
    ".md",
}


def should_skip(path: Path) -> bool:
    return any(part in EXCLUDE_PARTS for part in path.parts)


def allowed_line(path: Path, line: str) -> bool:
    if path in ALLOWED_FILES:
        return True
    if "Old deprecated archetype names in code or docs" in line:
        return True
    if "LEGACY ARCHETYPE ALIASES" in line:
        return True
    return False


def iter_files() -> list[Path]:
    files: list[Path] = []
    for root in SCAN_ROOTS:
        if root.is_file():
            files.append(root)
            continue
        for path in root.rglob("*"):
            if not path.is_file() or should_skip(path):
                continue
            if path.suffix not in TEXT_EXTENSIONS:
                continue
            files.append(path)
    return files


def main() -> int:
    violations: list[str] = []
    for path in iter_files():
        try:
            lines = path.read_text().splitlines()
        except UnicodeDecodeError:
            continue
        for idx, line in enumerate(lines, start=1):
            if allowed_line(path, line):
                continue
            if any(pattern.search(line) for pattern in PATTERNS):
                violations.append(f"{path.relative_to(PROJECT_ROOT)}:{idx}: {line.strip()}")

    if violations:
        print("Legacy archetype terms detected outside approved compatibility zones:")
        for violation in violations:
            print(f"  - {violation}")
        return 1

    print("No forbidden legacy archetype terms found outside approved compatibility zones.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
