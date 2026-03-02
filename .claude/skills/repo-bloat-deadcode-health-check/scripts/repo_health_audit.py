#!/usr/bin/env python3
"""Scan a repository for bloat, dead-code signals, and quick health indicators."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any

IGNORE_DIRS = {
    ".git",
    ".hg",
    ".svn",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".venv",
    "venv",
    "__pycache__",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    "coverage",
    ".idea",
    ".vscode",
}

SOURCE_EXTS_JS = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}
SUSPECT_NAME_RE = re.compile(r"(copy|backup|old|tmp|temp|draft|final-final)", re.IGNORECASE)
ARTIFACT_TOKEN_RE = re.compile(
    r"(^|/)(dist|build|coverage|tmp|temp|logs?|artifacts?|generated|out)(/|$)",
    re.IGNORECASE,
)
IMPORT_RE = re.compile(
    r"""from\s+["']([^"']+)["']|"""
    r"""import\(\s*["']([^"']+)["']\s*\)|"""
    r"""require\(\s*["']([^"']+)["']\s*\)"""
)


@dataclass
class FileInfo:
    rel_path: str
    abs_path: Path
    size_bytes: int
    mtime_epoch: float


def format_bytes(size: int) -> str:
    units = ["B", "KB", "MB", "GB", "TB"]
    current = float(size)
    for unit in units:
        if current < 1024.0 or unit == units[-1]:
            return f"{current:.2f}{unit}"
        current /= 1024.0
    return f"{size}B"


def iter_files(root: Path) -> list[FileInfo]:
    files: list[FileInfo] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        base = Path(dirpath)
        for filename in filenames:
            full_path = base / filename
            try:
                stat = full_path.stat()
            except OSError:
                continue
            if not full_path.is_file():
                continue
            rel_path = full_path.relative_to(root).as_posix()
            files.append(
                FileInfo(
                    rel_path=rel_path,
                    abs_path=full_path,
                    size_bytes=stat.st_size,
                    mtime_epoch=stat.st_mtime,
                )
            )
    return files


def top_level_sizes(files: list[FileInfo]) -> list[dict[str, Any]]:
    buckets: dict[str, int] = defaultdict(int)
    for file_info in files:
        top = file_info.rel_path.split("/", 1)[0]
        buckets[top] += file_info.size_bytes
    entries = [{"path": path, "size_bytes": size} for path, size in buckets.items()]
    return sorted(entries, key=lambda x: x["size_bytes"], reverse=True)


def sha1_for_file(path: Path) -> str:
    digest = hashlib.sha1()
    with path.open("rb") as handle:
        while True:
            chunk = handle.read(1024 * 1024)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def duplicate_files(files: list[FileInfo], max_file_mb: float) -> list[dict[str, Any]]:
    limit = int(max_file_mb * 1024 * 1024)
    by_size: dict[int, list[FileInfo]] = defaultdict(list)
    for file_info in files:
        if 0 < file_info.size_bytes <= limit:
            by_size[file_info.size_bytes].append(file_info)

    duplicates: list[dict[str, Any]] = []
    for size, group in by_size.items():
        if len(group) < 2:
            continue
        by_hash: dict[str, list[str]] = defaultdict(list)
        for file_info in group:
            try:
                digest = sha1_for_file(file_info.abs_path)
            except OSError:
                continue
            by_hash[digest].append(file_info.rel_path)
        for digest, paths in by_hash.items():
            if len(paths) > 1:
                duplicates.append(
                    {"sha1": digest, "size_bytes": size, "paths": sorted(paths)}
                )
    return sorted(
        duplicates,
        key=lambda x: (x["size_bytes"], len(x["paths"])),
        reverse=True,
    )


def stale_files(files: list[FileInfo], stale_days: int, limit: int) -> list[dict[str, Any]]:
    cutoff = time.time() - stale_days * 86400
    stale = [f for f in files if f.mtime_epoch < cutoff]
    stale.sort(key=lambda x: x.mtime_epoch)
    return [
        {"path": file_info.rel_path, "size_bytes": file_info.size_bytes}
        for file_info in stale[:limit]
    ]


def artifact_candidates(files: list[FileInfo]) -> list[dict[str, Any]]:
    matches = []
    for file_info in files:
        if ARTIFACT_TOKEN_RE.search(file_info.rel_path):
            matches.append(
                {"path": file_info.rel_path, "size_bytes": file_info.size_bytes}
            )
    matches.sort(key=lambda x: x["size_bytes"], reverse=True)
    return matches


def suspicious_name_candidates(files: list[FileInfo]) -> list[dict[str, Any]]:
    matches = []
    for file_info in files:
        if SUSPECT_NAME_RE.search(Path(file_info.rel_path).name):
            matches.append(
                {"path": file_info.rel_path, "size_bytes": file_info.size_bytes}
            )
    matches.sort(key=lambda x: x["size_bytes"], reverse=True)
    return matches


def parse_package_json(path: Path) -> dict[str, Any] | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def js_external_imports(root: Path, files: list[FileInfo]) -> set[str]:
    imports: set[str] = set()
    for file_info in files:
        ext = Path(file_info.rel_path).suffix.lower()
        if ext not in SOURCE_EXTS_JS:
            continue
        if file_info.size_bytes > 2 * 1024 * 1024:
            continue
        try:
            text = file_info.abs_path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for match in IMPORT_RE.finditer(text):
            spec = next((part for part in match.groups() if part), "")
            spec = spec.strip()
            if not spec:
                continue
            if spec.startswith(".") or spec.startswith("/"):
                continue
            imports.add(spec.split("?")[0])
    return imports


def dependency_used(dep: str, imports: set[str]) -> bool:
    for spec in imports:
        if spec == dep or spec.startswith(f"{dep}/"):
            return True
    return False


def find_unused_runtime_dependencies(
    root: Path, files: list[FileInfo], imports: set[str]
) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    package_files = [f for f in files if f.rel_path.endswith("package.json")]
    for file_info in package_files:
        package_json = file_info.abs_path
        data = parse_package_json(package_json)
        if not data:
            continue
        dependencies = data.get("dependencies", {})
        if not isinstance(dependencies, dict):
            continue
        unused = [
            dep
            for dep in sorted(dependencies.keys())
            if not dependency_used(dep, imports)
        ]
        if unused:
            findings.append(
                {
                    "package_json": package_json.relative_to(root).as_posix(),
                    "unused_runtime_dependencies": unused,
                }
            )
    return findings


def run_command(
    command: list[str], cwd: Path, timeout_sec: int
) -> dict[str, Any]:
    try:
        result = subprocess.run(
            command,
            cwd=str(cwd),
            text=True,
            capture_output=True,
            timeout=timeout_sec,
            check=False,
        )
        output = (result.stdout + "\n" + result.stderr).strip()
        return {
            "command": " ".join(command),
            "cwd": cwd.as_posix(),
            "exit_code": result.returncode,
            "output_excerpt": "\n".join(output.splitlines()[:30]),
        }
    except subprocess.TimeoutExpired:
        return {
            "command": " ".join(command),
            "cwd": cwd.as_posix(),
            "exit_code": 124,
            "output_excerpt": f"Timed out after {timeout_sec} seconds.",
        }
    except OSError as error:
        return {
            "command": " ".join(command),
            "cwd": cwd.as_posix(),
            "exit_code": 127,
            "output_excerpt": str(error),
        }


def detect_js_package_manager(project_dir: Path) -> str | None:
    if (project_dir / "yarn.lock").exists() and shutil.which("yarn"):
        return "yarn"
    if (project_dir / "pnpm-lock.yaml").exists() and shutil.which("pnpm"):
        return "pnpm"
    if shutil.which("npm"):
        return "npm"
    return None


def discover_health_commands(root: Path, include_tests: bool) -> list[dict[str, Any]]:
    planned: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()

    js_scripts = ["type-check", "lint"]
    if include_tests:
        js_scripts.append("test")

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        if "package.json" not in filenames:
            continue
        project_dir = Path(dirpath)
        data = parse_package_json(project_dir / "package.json")
        if not data:
            continue
        scripts = data.get("scripts", {})
        if not isinstance(scripts, dict):
            continue
        package_manager = detect_js_package_manager(project_dir)
        if not package_manager:
            continue

        for script_name in js_scripts:
            if script_name not in scripts:
                continue
            if package_manager == "yarn":
                command = ["yarn", script_name]
            elif package_manager == "pnpm":
                command = ["pnpm", script_name]
            else:
                command = ["npm", "run", script_name]

            key = (project_dir.as_posix(), " ".join(command))
            if key in seen:
                continue
            seen.add(key)
            planned.append(
                {
                    "label": f"js:{script_name}",
                    "cwd": project_dir,
                    "command": command,
                }
            )

    python_dirs = [root]
    if (root / "backend").is_dir():
        python_dirs.append(root / "backend")

    for project_dir in python_dirs:
        if not project_dir.exists():
            continue
        if shutil.which("ruff"):
            command = ["ruff", "check", "."]
            key = (project_dir.as_posix(), " ".join(command))
            if key not in seen:
                seen.add(key)
                planned.append(
                    {"label": "py:ruff", "cwd": project_dir, "command": command}
                )
        if shutil.which("mypy") and (
            (project_dir / "mypy.ini").exists()
            or (project_dir / "pyproject.toml").exists()
        ):
            command = ["mypy", "."]
            key = (project_dir.as_posix(), " ".join(command))
            if key not in seen:
                seen.add(key)
                planned.append(
                    {"label": "py:mypy", "cwd": project_dir, "command": command}
                )
        if include_tests and shutil.which("pytest"):
            command = ["pytest", "-q", "--maxfail=1"]
            key = (project_dir.as_posix(), " ".join(command))
            if key not in seen:
                seen.add(key)
                planned.append(
                    {"label": "py:pytest", "cwd": project_dir, "command": command}
                )
    return planned


def collect_git_health(root: Path) -> dict[str, Any]:
    git_bin = shutil.which("git")
    if not git_bin:
        return {"git_available": False}

    inside = run_command(
        [git_bin, "rev-parse", "--is-inside-work-tree"], cwd=root, timeout_sec=10
    )
    if inside["exit_code"] != 0:
        return {"git_available": True, "inside_work_tree": False}

    status = run_command([git_bin, "status", "--porcelain"], cwd=root, timeout_sec=10)
    branch = run_command(
        [git_bin, "rev-parse", "--abbrev-ref", "HEAD"], cwd=root, timeout_sec=10
    )
    dirty_count = len([line for line in status["output_excerpt"].splitlines() if line])
    return {
        "git_available": True,
        "inside_work_tree": True,
        "branch": branch["output_excerpt"].strip(),
        "dirty_entries_visible": dirty_count,
    }


def broken_symlinks(root: Path) -> list[str]:
    broken: list[str] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for name in filenames + dirnames:
            candidate = Path(dirpath) / name
            if candidate.is_symlink() and not candidate.exists():
                broken.append(candidate.relative_to(root).as_posix())
    return sorted(broken)


def report_human(report: dict[str, Any]) -> None:
    summary = report["summary"]
    print(f"Root: {report['root']}")
    print(
        f"Scanned files: {summary['file_count']} | Total size: {format_bytes(summary['total_size_bytes'])}"
    )
    print()

    print("Top files:")
    for item in report["bloat"]["top_files"]:
        print(f"  - {item['path']} ({format_bytes(item['size_bytes'])})")
    print()

    print("Top directories:")
    for item in report["bloat"]["top_dirs"]:
        print(f"  - {item['path']} ({format_bytes(item['size_bytes'])})")
    print()

    print("Large files above threshold:")
    for item in report["bloat"]["large_files"]:
        print(f"  - {item['path']} ({format_bytes(item['size_bytes'])})")
    print()

    print("Duplicate file groups:")
    for dup in report["dead_code"]["duplicate_files"][:10]:
        print(f"  - {format_bytes(dup['size_bytes'])}: {', '.join(dup['paths'])}")
    if not report["dead_code"]["duplicate_files"]:
        print("  - none")
    print()

    print("Unused runtime dependencies:")
    for item in report["dead_code"]["unused_runtime_dependencies"]:
        deps = ", ".join(item["unused_runtime_dependencies"])
        print(f"  - {item['package_json']}: {deps}")
    if not report["dead_code"]["unused_runtime_dependencies"]:
        print("  - none")
    print()

    print("Artifact candidates:")
    for item in report["bloat"]["artifact_candidates"][:20]:
        print(f"  - {item['path']} ({format_bytes(item['size_bytes'])})")
    if not report["bloat"]["artifact_candidates"]:
        print("  - none")
    print()

    print("Suspicious file names:")
    for item in report["bloat"]["suspicious_name_candidates"][:20]:
        print(f"  - {item['path']} ({format_bytes(item['size_bytes'])})")
    if not report["bloat"]["suspicious_name_candidates"]:
        print("  - none")
    print()

    print("Stale files:")
    for item in report["bloat"]["stale_files"]:
        print(f"  - {item['path']} ({format_bytes(item['size_bytes'])})")
    if not report["bloat"]["stale_files"]:
        print("  - none")
    print()

    print("Health:")
    print(f"  - Git: {report['health']['git']}")
    if report["health"]["broken_symlinks"]:
        print("  - Broken symlinks:")
        for path in report["health"]["broken_symlinks"]:
            print(f"    - {path}")
    else:
        print("  - Broken symlinks: none")
    if report["health"]["command_results"]:
        print("  - Health command results:")
        for result in report["health"]["command_results"]:
            print(
                f"    - {result['label']}: exit={result['exit_code']} cmd={result['command']}"
            )
    else:
        print("  - Health command results: skipped")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Audit a repository for bloat, dead-code signals, and health checks."
    )
    parser.add_argument("--root", default=".", help="Repository root path.")
    parser.add_argument("--top-files", type=int, default=20)
    parser.add_argument("--top-dirs", type=int, default=15)
    parser.add_argument("--large-file-mb", type=float, default=2.0)
    parser.add_argument("--stale-days", type=int, default=180)
    parser.add_argument("--stale-limit", type=int, default=25)
    parser.add_argument("--max-duplicate-file-mb", type=float, default=25.0)
    parser.add_argument("--run-health-checks", action="store_true")
    parser.add_argument("--include-tests", action="store_true")
    parser.add_argument("--command-timeout-sec", type=int, default=180)
    parser.add_argument("--json", action="store_true", help="Output JSON.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f"Invalid root directory: {root}", file=sys.stderr)
        return 2

    started = time.time()
    files = iter_files(root)
    total_size = sum(file_info.size_bytes for file_info in files)
    top_files = sorted(files, key=lambda x: x.size_bytes, reverse=True)[: args.top_files]
    top_dirs = top_level_sizes(files)[: args.top_dirs]
    large_threshold = int(args.large_file_mb * 1024 * 1024)

    imports = js_external_imports(root, files)
    report = {
        "root": root.as_posix(),
        "summary": {
            "file_count": len(files),
            "total_size_bytes": total_size,
            "duration_sec": round(time.time() - started, 2),
        },
        "bloat": {
            "top_files": [
                {"path": file_info.rel_path, "size_bytes": file_info.size_bytes}
                for file_info in top_files
            ],
            "top_dirs": top_dirs,
            "large_files": [
                {"path": file_info.rel_path, "size_bytes": file_info.size_bytes}
                for file_info in top_files
                if file_info.size_bytes >= large_threshold
            ],
            "artifact_candidates": artifact_candidates(files),
            "suspicious_name_candidates": suspicious_name_candidates(files),
            "stale_files": stale_files(files, args.stale_days, args.stale_limit),
        },
        "dead_code": {
            "duplicate_files": duplicate_files(files, args.max_duplicate_file_mb),
            "unused_runtime_dependencies": find_unused_runtime_dependencies(
                root, files, imports
            ),
        },
        "health": {
            "git": collect_git_health(root),
            "broken_symlinks": broken_symlinks(root),
            "command_results": [],
        },
    }

    if args.run_health_checks:
        planned = discover_health_commands(root, include_tests=args.include_tests)
        results = []
        for item in planned:
            result = run_command(
                item["command"], cwd=item["cwd"], timeout_sec=args.command_timeout_sec
            )
            results.append({"label": item["label"], **result})
        report["health"]["command_results"] = results

    report["summary"]["duration_sec"] = round(time.time() - started, 2)

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        report_human(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
