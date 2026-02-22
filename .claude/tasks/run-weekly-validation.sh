#!/bin/bash

# Weekly Asset Path Validation Script
# Runs automated checks on all asset references across the codebase
# Output: asset-path-validation-report.json

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORT_FILE="$SCRIPT_DIR/asset-path-validation-report-$(date +%Y%m%d).json"

echo "🔍 Running Weekly Asset Path Validation..."
echo "   Date: $(date)"
echo "   Project: $PROJECT_ROOT"
echo ""

cd "$PROJECT_ROOT"

python3 << 'PYTHON_EOF'
import json
import re
from pathlib import Path
from datetime import datetime

print("1️⃣  Scanning React components...")
component_refs = []
react_dirs = ["frontend/src/components", "frontend/src/features", "frontend/src/layouts"]

for directory in react_dirs:
    if Path(directory).exists():
        react_files = list(Path(directory).rglob("*.tsx")) + list(Path(directory).rglob("*.ts"))
        for file in react_files:
            try:
                content = file.read_text()
                patterns = [
                    r'import\s+.*from\s+["\'].*assets',
                    r'src\s*=\s*["\'].*assets',
                    r'backgroundImage.*assets',
                    r'require\(["\'].*assets'
                ]
                for pattern in patterns:
                    for match in re.finditer(pattern, content, re.IGNORECASE):
                        line_num = content[:match.start()].count('\n') + 1
                        component_refs.append({
                            "file": str(file.relative_to(".")),
                            "line": line_num,
                            "type": "react",
                            "match": match.group()[:100]
                        })
            except Exception as e:
                pass

print(f"   ✅ Found {len(component_refs)} references\n")

print("2️⃣  Scanning markdown files...")
markdown_refs = []
for markdown_file in Path(".").rglob("*.md"):
    try:
        if ".git" in str(markdown_file) or "node_modules" in str(markdown_file):
            continue
        content = markdown_file.read_text()
        asset_pattern = r'[\!\]?\[.*?\]\(.*?/assets/.*?\)'
        for match in re.finditer(asset_pattern, content):
            line_num = content[:match.start()].count('\n') + 1
            markdown_refs.append({
                "file": str(markdown_file.relative_to(".")),
                "line": line_num,
                "type": "markdown",
                "match": match.group()[:100]
            })
    except:
        pass

print(f"   ✅ Found {len(markdown_refs)} references\n")

print("3️⃣  Verifying asset paths...")
broken_refs = []
for ref in component_refs + markdown_refs:
    # Extract path
    match_str = ref['match']
    paths = re.findall(r'["\']([^"\']*assets[^"\']*)["\']', match_str)
    for path in paths:
        clean_path = path.lstrip('/')
        possible_paths = [
            Path(clean_path),
            Path("frontend/public") / clean_path,
            Path("frontend/src") / clean_path,
        ]
        if not any(p.exists() for p in possible_paths):
            broken_refs.append({
                "file": ref['file'],
                "line": ref['line'],
                "reference": path,
                "type": ref['type']
            })

print(f"   ✅ Found {len(broken_refs)} broken references\n")

# Generate report
report = {
    "scan_date": datetime.now().isoformat(),
    "summary": {
        "total_component_refs": len(component_refs),
        "total_markdown_refs": len(markdown_refs),
        "broken_references": len(broken_refs),
        "status": "PASSED ✅" if len(broken_refs) == 0 else "FAILED ❌"
    },
    "broken_refs": broken_refs,
    "recommendations": [
        "All asset paths valid - no action required" if len(broken_refs) == 0 else
        f"Fix {len(broken_refs)} broken references - see broken_refs array"
    ]
}

print(f"📊 Validation Report:")
print(f"   Status: {report['summary']['status']}")
print(f"   Component references: {report['summary']['total_component_refs']}")
print(f"   Markdown references: {report['summary']['total_markdown_refs']}")
print(f"   Broken paths: {report['summary']['broken_references']}")

# Output report
report_file = Path(".claude/tasks/asset-path-validation-report.json")
with open(report_file, "w") as f:
    json.dump(report, f, indent=2)

print(f"\n✅ Report saved: {report_file}")
exit(0 if len(broken_refs) == 0 else 1)

PYTHON_EOF

echo ""
echo "✅ Weekly validation complete!"
