#!/usr/bin/env python3
# scripts/audit_tailwind.py
import json
import os
import sys
import re

TAILWIND_CONFIG = 'frontend/tailwind.config.ts'
TOKEN_SOURCE_FILE = 'frontend/src/design/tokens/tokens.json'

def resolve_path(tokens: dict, path: str) -> tuple[bool, any, str]:
    """
    Resolve dot-notation path like 'color.semantic.primary.baruGold'
    Returns (success: bool, value: any, error_type: str)
    """
    keys = path.split('.')
    value = tokens

    for key in keys:
        if not isinstance(value, dict) or key not in value:
            return False, None, "Missing"
        value = value[key]

    # Extract $value if DTCG format
    if isinstance(value, dict) and '$value' in value:
        return True, value['$value'], None
    # For now, also support "value" as fallback to detect "incorrect nesting" issues later
    if isinstance(value, dict) and 'value' in value:
         return True, value['value'], "LegacyValue"

    return True, value, None

def main():
    print("🔍 TAILWIND getValue() AUDIT\n")

    if not os.path.exists(TAILWIND_CONFIG):
        print(f"❌ CRITICAL: Tailwind config not found at {TAILWIND_CONFIG}")
        sys.exit(1)

    if not os.path.exists(TOKEN_SOURCE_FILE):
        print(f"❌ CRITICAL: Token source file not found at {TOKEN_SOURCE_FILE}")
        sys.exit(1)

    with open(TOKEN_SOURCE_FILE, 'r') as f:
        try:
            tokens = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ CRITICAL: Invalid JSON in token file. {e}")
            sys.exit(1)

    with open(TAILWIND_CONFIG, 'r') as f:
        lines = f.readlines()

    critical_issues = []
    warnings = []
    total_calls = 0
    resolved_calls = 0

    # Regex to find getValue('path') or getValue("path")
    pattern = re.compile(r"getValue\(['\"]([^'\"]+)['\"]\)")

    for i, line in enumerate(lines, 1):
        matches = pattern.finditer(line)
        for match in matches:
            total_calls += 1
            path = match.group(1)

            success, value, err = resolve_path(tokens, path)

            if not success:
                # Check for case mismatch (camelCase vs kebab-case)
                # This is a bit complex to automate perfectly but we can try simple check
                critical_issues.append({
                    "type": "Missing Token Path",
                    "path": path,
                    "line": i,
                    "note": f"Found: undefined. Fix: Add token or remove getValue() call."
                })
            else:
                resolved_calls += 1

                # Check for "value" in path (Incorrect Nesting)
                if path.endswith(".value") or path.endswith(".$value"):
                    base_path = path.rsplit('.', 1)[0]
                    critical_issues.append({
                        "type": "Incorrect Nesting",
                        "path": path,
                        "line": i,
                        "note": f"Should be: getValue('{base_path}'). Note: $value extracted automatically by getValue()"
                    })

                # Type Mismatch check
                if "spacing" in path:
                    if isinstance(value, (int, float)):
                        warnings.append({
                            "type": "Type Mismatch",
                            "path": path,
                            "line": i,
                            "note": f"Expected: string (\"16px\"). Got: number ({value})"
                        })

    # Output Report
    if critical_issues:
        print(f"🔴 CRITICAL ISSUES ({len(critical_issues)}):\n")
        for i, issue in enumerate(critical_issues, 1):
            print(f"{i}. {issue['type']}")
            print(f"   Path: {issue['path']}")
            print(f"   Used in: tailwind.config.ts:{issue['line']}")
            print(f"   {issue['note']}\n")

    if warnings:
        print(f"🟡 WARNINGS ({len(warnings)}):\n")
        for i, warn in enumerate(warnings, 1):
            print(f"{i}. {warn['type']}")
            print(f"   Path: {warn['path']}")
            print(f"   Expected: {warn['note']}\n")

    coverage = (resolved_calls / total_calls * 100) if total_calls > 0 else 100
    print(f"📊 COVERAGE: {resolved_calls}/{total_calls} paths resolved ({coverage:.1f}%)")

    if critical_issues:
        sys.exit(1)
    if warnings:
        sys.exit(2)
    sys.exit(0)

if __name__ == "__main__":
    main()
