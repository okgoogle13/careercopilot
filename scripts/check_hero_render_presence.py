#!/usr/bin/env python3
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

TARGETS = {
    "landing-page": "frontend/src/features/landing/LandingPage.tsx",
    "lens-dashboard": "frontend/src/features/dashboard/Dashboard.tsx",
    "jar-flow": "frontend/src/features/ingestion/SmartIngestion.tsx",
    "applications-board": "frontend/src/features/applications/ApplicationTracker.tsx",
    "onboarding": "frontend/src/features/onboarding/OnboardingPage.tsx",
}

HERO_MAP_FILE = REPO_ROOT / "frontend/src/design/hero/pageHeroMap.ts"


def main() -> int:
    missing = []
    for page, rel in TARGETS.items():
        path = REPO_ROOT / rel
        if not path.exists():
            missing.append({"page": page, "reason": f"file missing: {rel}"})
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if "LayeredHero" not in text:
            missing.append({"page": page, "reason": "LayeredHero reference missing"})

    hero_map_missing = []
    if HERO_MAP_FILE.exists():
        hero_map_text = HERO_MAP_FILE.read_text(encoding="utf-8", errors="ignore")
        for key in TARGETS:
            if f"'{key}'" not in hero_map_text:
                hero_map_missing.append(key)
    else:
        hero_map_missing = list(TARGETS.keys())

    result = {
        "target_pages": list(TARGETS.keys()),
        "unrendered_hero_pages": len(missing),
        "render_issues": missing,
        "hero_map_missing_keys": hero_map_missing,
    }
    print(json.dumps(result, indent=2))
    return 0 if not missing and not hero_map_missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
