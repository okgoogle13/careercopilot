#!/usr/bin/env python3
"""
check-design-drift.py — KR Solidarity v6.0 design drift detector.
Scans frontend/src/ for hardcoded hex colors, banned token patterns, and flora/fauna residue.
Exit 0 = clean. Exit 1 = violations found.
"""

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SCAN_ROOT = ROOT / "frontend" / "src"

EXCLUDE_PATH_FRAGMENTS = [
    "__tests__",
    ".test.",
    ".spec.",
    ".stories.",
    ".story.",
    "_reference/",
    "node_modules",
    "/design/tokens/",
    "/design/styles/design-tokens.css",
]

EXTENSIONS = {".ts", ".tsx", ".css"}

# Patterns: (name, compiled_regex, extensions_to_apply or None for all)
HEX_RE = re.compile(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{8}\b")
BANNED_TOKENS_RE = re.compile(r"text-parchment|surface-KrDark-|outline-variant")
FLORA_RE = re.compile(
    r"\b(wattle|eucalyptus|gum\s+leaf|fern|kookaburra)\b",
    re.IGNORECASE,
)

# Lines to skip: comment-only lines
COMMENT_LINE_RE = re.compile(r"^\s*(//|/\*|\*)")


def normalize_scan_path(raw_path: str) -> Path | None:
    candidate = Path(raw_path)
    if not candidate.is_absolute():
        candidate = (ROOT / candidate).resolve()
    else:
        candidate = candidate.resolve()

    try:
        candidate.relative_to(SCAN_ROOT)
    except ValueError:
        return None

    if candidate.suffix not in EXTENSIONS or is_excluded(candidate):
        return None
    return candidate


def is_excluded(path: Path) -> bool:
    path_str = str(path)
    for fragment in EXCLUDE_PATH_FRAGMENTS:
        if fragment in path_str:
            return True
    return False


def check_file(path: Path) -> list[str]:
    violations = []
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return violations

    for lineno, line in enumerate(text.splitlines(), 1):
        stripped = line.strip()
        is_comment = bool(COMMENT_LINE_RE.match(stripped))

        # Hex colors — skip comment lines
        if not is_comment and path.suffix in {".ts", ".tsx", ".css"}:
            for match in HEX_RE.finditer(line):
                violations.append(
                    f"{path}:{lineno}: hardcoded hex color: {match.group()!r}"
                )

        # Banned legacy tokens — skip comment lines
        if not is_comment:
            for match in BANNED_TOKENS_RE.finditer(line):
                violations.append(
                    f"{path}:{lineno}: banned legacy token: {match.group()!r}"
                )

        # Flora/fauna — skip comment lines
        if not is_comment:
            for match in FLORA_RE.finditer(line):
                violations.append(
                    f"{path}:{lineno}: flora/fauna residue: {match.group()!r}"
                )

    return violations


def main() -> int:
    all_violations: list[str] = []
    requested_paths = [normalize_scan_path(arg) for arg in sys.argv[1:]]
    scan_targets = [path for path in requested_paths if path is not None]

    if scan_targets:
        for filepath in scan_targets:
            all_violations.extend(check_file(filepath))
    else:
        for dirpath, dirnames, filenames in os.walk(SCAN_ROOT):
            # Prune excluded dirs in-place
            dirnames[:] = [
                d for d in dirnames
                if not any(frag in os.path.join(dirpath, d) for frag in EXCLUDE_PATH_FRAGMENTS)
            ]
            for filename in filenames:
                filepath = Path(dirpath) / filename
                if filepath.suffix not in EXTENSIONS:
                    continue
                if is_excluded(filepath):
                    continue
                all_violations.extend(check_file(filepath))

    for v in all_violations:
        print(v)

    count = len(all_violations)
    if count == 0:
        print("✅ No drift violations found")
        return 0
    else:
        print(f"\n{count} violation(s) found")
        return 1


if __name__ == "__main__":
    sys.exit(main())
