#!/usr/bin/env python3
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = REPO_ROOT / "frontend" / "public"
TARGET_DIRS = [
    REPO_ROOT / "frontend" / "src" / "components",
    REPO_ROOT / "frontend" / "src" / "features",
    REPO_ROOT / "frontend" / "src" / "layouts",
    REPO_ROOT / "frontend" / "src" / "pages",
]

ASSET_PATTERN = re.compile(r"/assets/[A-Za-z0-9_./-]+")
IGNORED_TOKENS = ("NNN", "*", "icons--")


def iter_source_files() -> list[Path]:
    files: list[Path] = []
    for base in TARGET_DIRS:
        if not base.exists():
            continue
        files.extend(base.rglob("*.ts"))
        files.extend(base.rglob("*.tsx"))
        files.extend(base.rglob("*.css"))
    return files


def main() -> int:
    missing: dict[str, list[str]] = {}
    seen = set()

    for file in iter_source_files():
        text = file.read_text(encoding="utf-8", errors="ignore")
        for match in ASSET_PATTERN.findall(text):
            if any(token in match for token in IGNORED_TOKENS):
                continue
            if match in seen:
                continue
            seen.add(match)
            asset_path = PUBLIC_ROOT / match.lstrip("/")
            if not asset_path.exists():
                missing.setdefault(str(file.relative_to(REPO_ROOT)), []).append(match)

    result = {
        "total_asset_refs": len(seen),
        "missing_count": sum(len(v) for v in missing.values()),
        "missing": missing,
    }
    print(json.dumps(result, indent=2))
    return 0 if result["missing_count"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
