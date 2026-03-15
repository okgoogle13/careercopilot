#!/usr/bin/env python3
"""
scan-endpoints.py — Phase 1.4: Backend Endpoint Scanner

Statically parses backend/app/api/router.py and backend/app/main.py
to extract all mounted routers and their prefixes, then scans each
endpoint file for route decorators.

Emits docs/manifests/backend-endpoints.json.

Usage:  python3 tools/scripts/scan-endpoints.py
"""

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
ROUTER_FILE = ROOT / "backend" / "app" / "api" / "router.py"
MAIN_FILE = ROOT / "backend" / "app" / "main.py"
ENDPOINTS_DIR = ROOT / "backend" / "app" / "api" / "endpoints"
OUT = ROOT / "docs" / "manifests" / "backend-endpoints.json"


def extract_routers_from_main(src: str) -> list[dict]:
    """Extract directly mounted routers from main.py."""
    routers = []
    pattern = r'app\.include_router\(\s*(\w+(?:\.\w+)*)\s*,\s*prefix\s*=\s*["\']([^"\']+)["\']'
    for m in re.finditer(pattern, src):
        routers.append({"router_ref": m.group(1), "prefix": m.group(2)})
    return routers


def extract_routers_from_api_router(src: str) -> list[dict]:
    """Extract routers mounted in router.py tuple list."""
    routers = []
    pattern = r'\(\s*(\w+)\.router\s*,\s*["\']([^"\']+)["\']\s*,\s*["\']([^"\']+)["\']\s*\)'
    for m in re.finditer(pattern, src):
        routers.append({
            "module": m.group(1),
            "prefix": m.group(2),
            "tag": m.group(3),
        })
    return routers


def scan_endpoint_file(filepath: Path) -> list[dict]:
    """Scan a single endpoint file for @router.method decorators."""
    endpoints = []
    src = filepath.read_text()

    # Match @router.get("/path"), @router.post("/path"), etc.
    pattern = r'@\w+\.(get|post|put|patch|delete)\s*\(\s*["\']([^"\']+)["\']'
    for m in re.finditer(pattern, src):
        endpoints.append({
            "method": m.group(1).upper(),
            "path": m.group(2),
            "file": filepath.name,
        })
    return endpoints


def main():
    # Parse main.py for directly mounted routers
    main_routers = extract_routers_from_main(MAIN_FILE.read_text())

    # Parse router.py for the api_router sub-routers
    api_routers = extract_routers_from_api_router(ROUTER_FILE.read_text())

    # Scan all endpoint files
    all_endpoints = []
    endpoint_files = sorted(ENDPOINTS_DIR.glob("*.py"))
    for ep_file in endpoint_files:
        if ep_file.name.startswith("_"):
            continue
        eps = scan_endpoint_file(ep_file)
        all_endpoints.extend(eps)

    # Build full path for each endpoint based on router prefix mapping
    prefix_map = {}
    for r in api_routers:
        prefix_map[r["module"]] = f"/api{r['prefix']}"
    for r in main_routers:
        # These are directly on app, prefix is already absolute
        prefix_map[r["router_ref"].replace(".router", "").split(".")[-1]] = r["prefix"]

    resolved = []
    for ep in all_endpoints:
        module = ep["file"].replace(".py", "")
        prefix = prefix_map.get(module, f"/api/???/{module}")
        full_path = f"{prefix}{ep['path']}" if ep["path"] != "/" else prefix
        resolved.append({
            "method": ep["method"],
            "localPath": ep["path"],
            "fullPath": full_path,
            "module": module,
            "file": ep["file"],
        })

    result = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "mainRouters": main_routers,
        "apiRouters": api_routers,
        "endpointCount": len(resolved),
        "filesScanned": len(endpoint_files),
        "endpoints": resolved,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2))

    print(f"✅ Scanned {len(endpoint_files)} endpoint files, found {len(resolved)} endpoints → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
