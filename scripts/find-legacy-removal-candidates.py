#!/usr/bin/env python3
"""Identify likely legacy files that may be safe to remove.

This script scans frontend/backend code and scores candidates using:
- legacy naming patterns (legacy, deprecated, old, backup, archive, etc.)
- low/zero test coverage (if coverage reports are present)
- low inbound textual references (coarse static signal)
- presence of nearby replacement file names

It outputs a ranked list and can emit JSON for automation.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]

LEGACY_NAME_PATTERNS = [
    re.compile(p, re.IGNORECASE)
    for p in [
        r"legacy",
        r"deprecated",
        r"archive",
        r"backup",
        r"old",
        r"_bak",
        r"copy",
        r"main_simple",
        r"__tests__-legacy",
        r"_legacy",
    ]
]

IGNORE_GLOBS = {
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "dist",
    "build",
    "coverage",
    "htmlcov",
    "__pycache__",
    ".pytest_cache",
}

TEXT_EXTS = {
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".css",
    ".scss",
    ".sh",
}


@dataclass
class Candidate:
    path: Path
    score: int
    risk: str
    reasons: List[str]
    inbound_refs: int
    coverage_pct: Optional[float]


def run_cmd(args: Sequence[str], cwd: Path = ROOT) -> Tuple[int, str, str]:
    proc = subprocess.run(
        args,
        cwd=str(cwd),
        text=True,
        capture_output=True,
        check=False,
    )
    return proc.returncode, proc.stdout, proc.stderr


def list_files(scope_dir: Path) -> List[Path]:
    code, out, _ = run_cmd(["git", "ls-files", str(scope_dir)])
    if code == 0:
        return [ROOT / line.strip() for line in out.splitlines() if line.strip()]

    code, out, _ = run_cmd(["rg", "--files", str(scope_dir)])
    if code == 0:
        return [ROOT / line.strip() for line in out.splitlines() if line.strip()]

    files: List[Path] = []
    for p in scope_dir.rglob("*"):
        if p.is_file():
            files.append(p)
    return files


def should_skip(path: Path) -> bool:
    parts = set(path.parts)
    return any(ignored in parts for ignored in IGNORE_GLOBS)


def has_legacy_name(path: Path) -> bool:
    target = str(path).replace("\\", "/")
    return any(p.search(target) for p in LEGACY_NAME_PATTERNS)


def load_backend_coverage() -> Dict[str, float]:
    coverage_file = ROOT / "backend" / "coverage.json"
    if not coverage_file.exists():
        return {}

    try:
        data = json.loads(coverage_file.read_text())
    except Exception:
        return {}

    out: Dict[str, float] = {}
    for fp, item in data.get("files", {}).items():
        pct = item.get("summary", {}).get("percent_statements_covered")
        if pct is None:
            continue
        norm = str(Path("backend") / fp).replace("\\", "/")
        out[norm] = float(pct)
    return out


def load_frontend_coverage() -> Dict[str, float]:
    lcov_file = ROOT / "frontend" / "coverage" / "lcov.info"
    if not lcov_file.exists():
        return {}

    out: Dict[str, float] = {}
    current: Optional[str] = None
    found = 0
    hit = 0

    for raw in lcov_file.read_text(errors="ignore").splitlines():
        line = raw.strip()
        if line.startswith("SF:"):
            current = line[3:]
            found = 0
            hit = 0
        elif line.startswith("DA:") and current:
            found += 1
            count = int(line.split(",", 1)[1])
            if count > 0:
                hit += 1
        elif line == "end_of_record" and current:
            pct = (hit * 100.0 / found) if found else 0.0
            norm = current.replace("\\", "/")
            for marker in ["/frontend/", "frontend/"]:
                if marker in norm:
                    norm = "frontend/" + norm.split(marker, 1)[1]
                    break
            out[norm] = pct
            current = None

    return out


def nearest_replacement(path: Path) -> Optional[Path]:
    stem = path.stem
    replaced = stem
    for token in ["Legacy", "legacy", "Deprecated", "deprecated", "Old", "old", "_legacy", "-legacy", "_old", "-old"]:
        replaced = replaced.replace(token, "")
    replaced = replaced.strip("_-")
    if not replaced or replaced == stem:
        return None

    candidate = path.with_name(replaced + path.suffix)
    return candidate if candidate.exists() else None


def inbound_reference_count(path: Path, scope_dir: Path) -> int:
    rel = path.relative_to(ROOT).as_posix()
    stem = path.stem
    # Keep pattern simple and coarse; this is triage, not proof.
    pattern = rf"({re.escape(rel)}|{re.escape(stem)})"
    code, out, _ = run_cmd(
        [
            "rg",
            "-n",
            "-g",
            "!**/node_modules/**",
            "-g",
            "!**/dist/**",
            "-g",
            "!**/build/**",
            "-g",
            "!**/coverage/**",
            "-e",
            pattern,
            str(scope_dir),
        ]
    )
    if code not in (0, 1):
        return 0

    refs = 0
    for line in out.splitlines():
        if not line.strip():
            continue
        src = line.split(":", 1)[0]
        src_path = (ROOT / src).resolve()
        if src_path == path.resolve():
            continue
        refs += 1
    return refs


def classify(score: int) -> str:
    if score >= 7:
        return "high"
    if score >= 4:
        return "medium"
    return "low"


def evaluate_scope(scope_name: str, scope_dir: Path, coverage_map: Dict[str, float]) -> List[Candidate]:
    files = [p for p in list_files(scope_dir) if p.is_file() and not should_skip(p)]

    candidates: List[Candidate] = []
    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        suffix = path.suffix.lower()
        if suffix not in TEXT_EXTS:
            continue

        reasons: List[str] = []
        score = 0

        if has_legacy_name(path):
            reasons.append("legacy/deprecated naming pattern")
            score += 4

        coverage_pct = coverage_map.get(rel)
        if coverage_pct is not None and coverage_pct == 0.0:
            reasons.append("0% coverage")
            score += 2
        elif coverage_pct is not None and coverage_pct < 20.0:
            reasons.append(f"low coverage ({coverage_pct:.1f}%)")
            score += 1

        refs = inbound_reference_count(path, scope_dir)
        if refs == 0:
            reasons.append("no inbound textual references")
            score += 2
        elif refs <= 2:
            reasons.append(f"very low references ({refs})")
            score += 1

        replacement = nearest_replacement(path)
        if replacement is not None:
            reasons.append(
                f"possible replacement exists: {replacement.relative_to(ROOT).as_posix()}"
            )
            score += 1

        if score <= 0:
            continue

        candidates.append(
            Candidate(
                path=path,
                score=score,
                risk=classify(score),
                reasons=reasons,
                inbound_refs=refs,
                coverage_pct=coverage_pct,
            )
        )

    candidates.sort(key=lambda c: (c.score, -c.inbound_refs), reverse=True)
    return candidates


def print_report(cands: Iterable[Candidate], limit: int) -> None:
    rows = list(cands)[:limit]
    if not rows:
        print("No candidates found.")
        return

    print("risk\tscore\trefs\tcoverage\tpath\treasons")
    for c in rows:
        cov = "n/a" if c.coverage_pct is None else f"{c.coverage_pct:.1f}%"
        print(
            f"{c.risk}\t{c.score}\t{c.inbound_refs}\t{cov}\t"
            f"{c.path.relative_to(ROOT).as_posix()}\t"
            f"{' | '.join(c.reasons)}"
        )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Identify legacy code likely removable in frontend/backend."
    )
    parser.add_argument(
        "--scope",
        choices=["frontend", "backend", "all"],
        default="all",
        help="Which area to scan.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=200,
        help="Max rows to print.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit machine-readable JSON instead of table output.",
    )
    args = parser.parse_args()

    frontend_cov = load_frontend_coverage()
    backend_cov = load_backend_coverage()

    all_candidates: List[Candidate] = []

    if args.scope in ("frontend", "all"):
        all_candidates.extend(
            evaluate_scope("frontend", ROOT / "frontend", frontend_cov)
        )
    if args.scope in ("backend", "all"):
        all_candidates.extend(
            evaluate_scope("backend", ROOT / "backend", backend_cov)
        )

    all_candidates.sort(key=lambda c: (c.score, -c.inbound_refs), reverse=True)

    if args.json:
        payload = [
            {
                "path": c.path.relative_to(ROOT).as_posix(),
                "risk": c.risk,
                "score": c.score,
                "inbound_refs": c.inbound_refs,
                "coverage_pct": c.coverage_pct,
                "reasons": c.reasons,
            }
            for c in all_candidates[: args.limit]
        ]
        print(json.dumps(payload, indent=2))
    else:
        print_report(all_candidates, args.limit)

    return 0


if __name__ == "__main__":
    sys.exit(main())
