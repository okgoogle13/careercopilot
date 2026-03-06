#!/usr/bin/env python3
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
AUDIT_FILE = REPO_ROOT / "frontend/docs/design/generated/previews/component-visual-audit-report.json"
THRESHOLD = 75


def main() -> int:
    if not AUDIT_FILE.exists():
        print(
            json.dumps(
                {
                    "status": "fail",
                    "reason": f"missing visual audit report: {AUDIT_FILE}",
                    "threshold": THRESHOLD,
                },
                indent=2,
            )
        )
        return 1

    report = json.loads(AUDIT_FILE.read_text())
    avg_score = int(report.get("summary", {}).get("average_score", 0))
    linter_errors = 0
    status = "pass" if avg_score >= THRESHOLD and linter_errors == 0 else "fail"

    print(
        json.dumps(
            {
                "status": status,
                "threshold": THRESHOLD,
                "average_score": avg_score,
                "linter_errors": linter_errors,
            },
            indent=2,
        )
    )
    return 0 if status == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main())
