#!/usr/bin/env python3
"""
M3 Design System Recovery Verification Script

This script verifies the completeness of the M3 Design System implementation
by checking file existence, sizes, and content quality.
"""

import os
import json
from pathlib import Path
from typing import Dict, List, Tuple
import re

# ANSI color codes
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

# Project root
PROJECT_ROOT = Path(__file__).parent.parent

# Expected file specifications
EXPECTED_FILES = {
    "design_token_system": {
        "files": [
            {
                "path": "frontend/src/design/tokens/tokens.json",
                "min_size": 500,
                "type": "json",
                "required_keys": ["color", "spacing", "shape", "elevation", "typography"],
                "description": "Design token source file"
            },
            {
                "path": "frontend/src/styles/design-tokens.css",
                "min_size": 200,
                "type": "css",
                "required_patterns": [r"--sys-color-", r"--sys-space-", r":root"],
                "description": "Generated CSS variables"
            },
            {
                "path": "scripts/validate-design-tokens.py",
                "min_size": 100,
                "type": "python",
                "required_patterns": [r"def.*validate", r"import"],
                "description": "Token validation script"
            },
            {
                "path": "scripts/build-design-tokens.py",
                "min_size": 100,
                "type": "python",
                "required_patterns": [r"def.*build", r"import"],
                "description": "Token build script"
            },
            {
                "path": "scripts/update-design-system.sh",
                "min_size": 50,
                "type": "bash",
                "required_patterns": [r"#!/bin/bash", r"python"],
                "description": "Token system update orchestrator"
            }
        ]
    },
    "agents": {
        "files": [
            {
                "path": ".claude/agents/design-project-manager.md",
                "min_size": 500,
                "min_lines": 50,
                "required_patterns": [r"system_prompt", r"m3-migration"],
                "description": "Design workflow orchestrator agent"
            },
            {
                "path": ".claude/agents/m3-migration-architect.md",
                "min_size": 300,
                "min_lines": 20,
                "required_patterns": [r"m3-layout", r"m3-color", r"m3-typography"],
                "description": "M3 migration orchestrator agent"
            },
            {
                "path": ".claude/agents/frontend-specialist.md",
                "min_size": 500,
                "v2_required": True,
                "required_patterns": [r"component-builder", r"token", r"var\(--sys-"],
                "description": "Frontend specialist agent (V2)"
            },
            {
                "path": ".claude/agents/code-reviewer.md",
                "min_size": 500,
                "v2_required": True,
                "required_patterns": [r"M3", r"hardcoded", r"token"],
                "description": "Code reviewer agent (V2)"
            },
            {
                "path": ".claude/agents/debugger.md",
                "min_size": 300,
                "v2_required": True,
                "required_patterns": [r"token", r"design"],
                "description": "Debugger agent (V2)"
            }
        ]
    },
    "m3_migration_skills": {
        "files": [
            {
                "path": ".claude/skills/frontend-migration/m3-layout-refactor.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 550,
                "required_patterns": [
                    r"spacing.*token",
                    r"padding|margin|gap",
                    r"var\(--sys-space-",
                    r"hardcoded"
                ],
                "description": "Layout spacing token refactoring skill"
            },
            {
                "path": ".claude/skills/frontend-migration/m3-color-themer.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 600,
                "required_patterns": [
                    r"color.*token",
                    r"var\(--sys-color-",
                    r"#[0-9a-fA-F]{6}",
                    r"semantic.*role"
                ],
                "description": "Color system token refactoring skill"
            },
            {
                "path": ".claude/skills/frontend-migration/m3-typography-classifier.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 500,
                "required_patterns": [
                    r"typography|font",
                    r"display|headline|body|label",
                    r"var\(--sys-type-"
                ],
                "description": "Typography scale token refactoring skill"
            },
            {
                "path": ".claude/skills/frontend-migration/m3-editorial-stylist.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 480,
                "required_patterns": [
                    r"letter-spacing|text-decoration",
                    r"editorial"
                ],
                "description": "Editorial styling token refactoring skill"
            },
            {
                "path": ".claude/skills/frontend-migration/m3-shape-refactor.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 520,
                "required_patterns": [
                    r"border-radius|borderRadius",
                    r"shape.*token",
                    r"var\(--sys-shape-"
                ],
                "description": "Shape/border radius token refactoring skill"
            },
            {
                "path": ".claude/skills/frontend-migration/m3-elevation-refactor.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 540,
                "required_patterns": [
                    r"box-shadow|elevation",
                    r"var\(--sys-elevation-"
                ],
                "description": "Elevation/shadow token refactoring skill"
            },
            {
                "path": ".claude/skills/frontend-migration/m3-icon-replacer.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 450,
                "required_patterns": [
                    r"icon",
                    r"Material.*Icons|Material.*Symbols"
                ],
                "description": "Icon system migration skill"
            },
            {
                "path": ".claude/skills/frontend-migration/m3-motion-applier.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 500,
                "required_patterns": [
                    r"motion|animation|transition",
                    r"duration|easing",
                    r"var\(--sys-motion-"
                ],
                "description": "Motion/animation token refactoring skill"
            }
        ]
    },
    "v2_skills": {
        "files": [
            {
                "path": ".claude/skills/component-builder/SKILL.md",
                "min_size": 500,
                "required_patterns": [r"token", r"var\(--sys-", r"reject.*hardcoded"],
                "description": "Component builder skill (V2)"
            },
            {
                "path": ".claude/skills/react-component-scaffolder/SKILL.md",
                "min_size": 500,
                "required_patterns": [r"token", r"var\(--sys-"],
                "description": "React component scaffolder (V2)"
            },
            {
                "path": ".claude/skills/react-page-scaffolder/SKILL.md",
                "min_size": 500,
                "required_patterns": [r"token", r"M3.*layout"],
                "description": "React page scaffolder (V2)"
            },
            {
                "path": ".claude/skills/storybook-scaffolder/SKILL.md",
                "min_size": 500,
                "required_patterns": [r"design-tokens.css", r"import"],
                "description": "Storybook scaffolder (V2)"
            }
        ]
    },
    "orchestrator_skills": {
        "files": [
            {
                "path": ".claude/skills/batch-migration-orchestrator/SKILL.md",
                "min_size": 5000,
                "min_lines": 100,
                "expected_size": 539,
                "required_patterns": [
                    r"batch",
                    r"parallel",
                    r"migrate.*component"
                ],
                "description": "Batch migration orchestrator skill",
                "optional": True
            }
        ]
    },
    "documentation": {
        "files": [
            {
                "path": "AGENT_MODEL_REFERENCE.md",
                "min_size": 1000,
                "required_patterns": [r"agent", r"design"],
                "description": "Agent reference documentation"
            },
            {
                "path": "SKILL_AGENT_MATRIX.md",
                "min_size": 1000,
                "required_patterns": [r"skill", r"agent"],
                "description": "Skill-Agent matrix documentation"
            },
            {
                "path": "M3_EXPRESSIVE_ENHANCEMENT_PLAN.md",
                "min_size": 10000,
                "required_patterns": [r"M3.*Expressive", r"token"],
                "description": "M3 enhancement plan"
            },
            {
                "path": "HANDOVER_TODO.md",
                "min_size": 5000,
                "required_patterns": [r"Phase", r"M3"],
                "description": "Handover TODO checklist"
            }
        ]
    }
}


def check_file_exists(file_path: Path) -> Tuple[bool, str]:
    """Check if file exists and return status."""
    if file_path.exists():
        return True, f"{GREEN}✓{RESET} EXISTS"
    else:
        return False, f"{RED}✗{RESET} MISSING"


def check_file_size(file_path: Path, min_size: int) -> Tuple[bool, str, int]:
    """Check if file meets minimum size requirement."""
    if not file_path.exists():
        return False, f"{RED}✗{RESET} N/A (file missing)", 0

    size = file_path.stat().st_size
    if size >= min_size:
        return True, f"{GREEN}✓{RESET} {size:,} bytes", size
    else:
        return False, f"{RED}✗{RESET} {size:,} bytes (< {min_size:,})", size


def check_line_count(file_path: Path, min_lines: int) -> Tuple[bool, str, int]:
    """Check if file has minimum number of lines."""
    if not file_path.exists():
        return False, f"{RED}✗{RESET} N/A (file missing)", 0

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = len(f.readlines())

        if lines >= min_lines:
            return True, f"{GREEN}✓{RESET} {lines} lines", lines
        else:
            return False, f"{RED}✗{RESET} {lines} lines (< {min_lines})", lines
    except Exception as e:
        return False, f"{RED}✗{RESET} Error: {e}", 0


def check_content_patterns(file_path: Path, patterns: List[str]) -> Tuple[bool, str, List[str]]:
    """Check if file contains required content patterns."""
    if not file_path.exists():
        return False, f"{RED}✗{RESET} N/A (file missing)", []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        missing_patterns = []
        for pattern in patterns:
            if not re.search(pattern, content, re.IGNORECASE):
                missing_patterns.append(pattern)

        if not missing_patterns:
            return True, f"{GREEN}✓{RESET} All patterns found", []
        else:
            return False, f"{YELLOW}⚠{RESET} {len(missing_patterns)}/{len(patterns)} patterns missing", missing_patterns
    except Exception as e:
        return False, f"{RED}✗{RESET} Error: {e}", []


def check_json_keys(file_path: Path, required_keys: List[str]) -> Tuple[bool, str, List[str]]:
    """Check if JSON file contains required top-level keys."""
    if not file_path.exists():
        return False, f"{RED}✗{RESET} N/A (file missing)", []

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        missing_keys = [key for key in required_keys if key not in data]

        if not missing_keys:
            return True, f"{GREEN}✓{RESET} All keys present", []
        else:
            return False, f"{RED}✗{RESET} {len(missing_keys)}/{len(required_keys)} keys missing", missing_keys
    except json.JSONDecodeError:
        return False, f"{RED}✗{RESET} Invalid JSON", required_keys
    except Exception as e:
        return False, f"{RED}✗{RESET} Error: {e}", required_keys


def is_stub_file(file_path: Path) -> Tuple[bool, str]:
    """Detect if file is a stub (1-2 lines with minimal content)."""
    if not file_path.exists():
        return False, "N/A"

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Check for stub patterns
        if len(lines) <= 2:
            content = ''.join(lines).strip()
            if len(content) < 50 or content.endswith('...'):
                return True, f"{RED}STUB{RESET} ({len(lines)} lines, {len(content)} chars)"

        return False, f"{GREEN}FULL{RESET}"
    except Exception:
        return False, "UNKNOWN"


def print_header(text: str):
    """Print formatted section header."""
    print(f"\n{BOLD}{BLUE}{'=' * 80}{RESET}")
    print(f"{BOLD}{BLUE}{text.center(80)}{RESET}")
    print(f"{BOLD}{BLUE}{'=' * 80}{RESET}\n")


def print_category_header(category: str):
    """Print category header."""
    print(f"\n{BOLD}{category}{RESET}")
    print(f"{'-' * 80}")


def verify_file(file_spec: Dict, category: str) -> Dict:
    """Verify a single file against its specification."""
    file_path = PROJECT_ROOT / file_spec["path"]
    result = {
        "path": file_spec["path"],
        "category": category,
        "description": file_spec.get("description", "N/A"),
        "exists": False,
        "size_ok": False,
        "lines_ok": True,
        "patterns_ok": True,
        "json_ok": True,
        "is_stub": False,
        "issues": []
    }

    # Check existence
    exists, status = check_file_exists(file_path)
    result["exists"] = exists

    print(f"\n{BOLD}File:{RESET} {file_spec['path']}")
    print(f"  Description: {file_spec.get('description', 'N/A')}")
    print(f"  Exists: {status}")

    if not exists:
        result["issues"].append("File does not exist")
        if not file_spec.get("optional", False):
            print(f"  {RED}✗ CRITICAL: Required file missing{RESET}")
        else:
            print(f"  {YELLOW}⚠ OPTIONAL: File missing but not critical{RESET}")
        return result

    # Check for stub
    is_stub, stub_status = is_stub_file(file_path)
    result["is_stub"] = is_stub
    print(f"  File Type: {stub_status}")

    if is_stub:
        result["issues"].append("File is a stub (minimal content)")

    # Check size
    if "min_size" in file_spec:
        size_ok, size_status, actual_size = check_file_size(file_path, file_spec["min_size"])
        result["size_ok"] = size_ok
        result["actual_size"] = actual_size
        print(f"  Size: {size_status}")

        if not size_ok:
            result["issues"].append(f"File too small ({actual_size} < {file_spec['min_size']} bytes)")

        if "expected_size" in file_spec:
            expected = file_spec["expected_size"] * 50  # Approximate chars per line
            if actual_size < expected * 0.1:  # Less than 10% of expected
                print(f"  {RED}⚠ WARNING: Expected ~{file_spec['expected_size']} lines ({expected:,} bytes){RESET}")

    # Check line count
    if "min_lines" in file_spec:
        lines_ok, lines_status, actual_lines = check_line_count(file_path, file_spec["min_lines"])
        result["lines_ok"] = lines_ok
        result["actual_lines"] = actual_lines
        print(f"  Lines: {lines_status}")

        if not lines_ok:
            result["issues"].append(f"Too few lines ({actual_lines} < {file_spec['min_lines']})")

    # Check content patterns
    if "required_patterns" in file_spec:
        patterns_ok, patterns_status, missing = check_content_patterns(
            file_path, file_spec["required_patterns"]
        )
        result["patterns_ok"] = patterns_ok
        print(f"  Content: {patterns_status}")

        if missing:
            result["issues"].append(f"Missing patterns: {', '.join(missing)}")
            for pattern in missing:
                print(f"    {RED}✗{RESET} Missing: {pattern}")

    # Check JSON keys
    if "required_keys" in file_spec and file_spec.get("type") == "json":
        json_ok, json_status, missing = check_json_keys(file_path, file_spec["required_keys"])
        result["json_ok"] = json_ok
        print(f"  JSON Keys: {json_status}")

        if missing:
            result["issues"].append(f"Missing JSON keys: {', '.join(missing)}")
            for key in missing:
                print(f"    {RED}✗{RESET} Missing key: {key}")

    # Overall status
    if result["issues"]:
        print(f"  {RED}✗ ISSUES FOUND ({len(result['issues'])}){RESET}")
    else:
        print(f"  {GREEN}✓ ALL CHECKS PASSED{RESET}")

    return result


def generate_summary(results: List[Dict]):
    """Generate summary report."""
    print_header("VERIFICATION SUMMARY")

    # Group by category
    by_category = {}
    for result in results:
        category = result["category"]
        if category not in by_category:
            by_category[category] = []
        by_category[category].append(result)

    total_files = len(results)
    total_exists = sum(1 for r in results if r["exists"])
    total_stubs = sum(1 for r in results if r["is_stub"])
    total_issues = sum(len(r["issues"]) for r in results)
    critical_missing = [r for r in results if not r["exists"]]

    print(f"Total Files Checked: {total_files}")
    print(f"Files Exist: {total_exists}/{total_files} ({total_exists/total_files*100:.1f}%)")
    print(f"Stub Files: {RED}{total_stubs}{RESET}")
    print(f"Total Issues: {RED}{total_issues}{RESET}")
    print(f"Critical Missing: {RED}{len(critical_missing)}{RESET}")

    # Category breakdown
    print(f"\n{BOLD}By Category:{RESET}")
    for category, cat_results in sorted(by_category.items()):
        cat_exists = sum(1 for r in cat_results if r["exists"])
        cat_stubs = sum(1 for r in cat_results if r["is_stub"])
        cat_issues = sum(len(r["issues"]) for r in cat_results)

        status = f"{GREEN}✓{RESET}" if cat_issues == 0 else f"{RED}✗{RESET}"
        print(f"  {status} {category}: {cat_exists}/{len(cat_results)} exist, "
              f"{cat_stubs} stubs, {cat_issues} issues")

    # Critical issues
    if critical_missing:
        print(f"\n{BOLD}{RED}CRITICAL: Missing Required Files{RESET}")
        for result in critical_missing:
            print(f"  • {result['path']}")
            print(f"    {result['description']}")

    # Stub files
    stub_files = [r for r in results if r["is_stub"]]
    if stub_files:
        print(f"\n{BOLD}{RED}WARNING: Stub Files (Need Full Implementation){RESET}")
        for result in stub_files:
            print(f"  • {result['path']}")
            if "expected_size" in [f for f in EXPECTED_FILES.get(result['category'], {}).get('files', []) if f['path'] == result['path']][0]:
                expected_lines = [f["expected_size"] for f in EXPECTED_FILES.get(result['category'], {}).get('files', []) if f['path'] == result['path']][0]
                print(f"    Expected: ~{expected_lines} lines")

    # Files with issues
    files_with_issues = [r for r in results if r["issues"] and not r["is_stub"]]
    if files_with_issues:
        print(f"\n{BOLD}{YELLOW}Files With Issues (Exist but Incomplete){RESET}")
        for result in files_with_issues:
            print(f"  • {result['path']}")
            for issue in result["issues"]:
                print(f"    - {issue}")

    # Success rate
    success_rate = ((total_files - len(critical_missing) - total_stubs) / total_files) * 100
    print(f"\n{BOLD}Overall Completion Rate: {success_rate:.1f}%{RESET}")

    if success_rate == 100:
        print(f"{GREEN}✓ ALL FILES COMPLETE AND VERIFIED{RESET}")
    elif success_rate >= 80:
        print(f"{YELLOW}⚠ MOSTLY COMPLETE - Minor issues to fix{RESET}")
    elif success_rate >= 50:
        print(f"{YELLOW}⚠ PARTIALLY COMPLETE - Significant work needed{RESET}")
    else:
        print(f"{RED}✗ INCOMPLETE - Major recovery needed{RESET}")


def main():
    """Main verification function."""
    print_header("M3 DESIGN SYSTEM RECOVERY VERIFICATION")
    print(f"Project Root: {PROJECT_ROOT}")

    all_results = []

    for category, spec in EXPECTED_FILES.items():
        print_category_header(category.replace('_', ' ').title())

        for file_spec in spec["files"]:
            result = verify_file(file_spec, category)
            all_results.append(result)

    # Generate summary
    generate_summary(all_results)

    # Export results as JSON
    results_file = PROJECT_ROOT / ".m3-recovery-verification.json"
    with open(results_file, 'w') as f:
        json.dump(all_results, f, indent=2)

    print(f"\n{BOLD}Detailed results exported to:{RESET} {results_file}")

    # Exit code based on critical issues
    critical_issues = sum(1 for r in all_results if not r["exists"])
    if critical_issues > 0:
        print(f"\n{RED}Exit Code: 1 (Critical issues found){RESET}")
        return 1
    else:
        print(f"\n{GREEN}Exit Code: 0 (No critical issues){RESET}")
        return 0


if __name__ == "__main__":
    exit(main())
