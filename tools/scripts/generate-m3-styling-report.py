#!/usr/bin/env python3
"""
M3 Styling Consistency Report Generator
Analyzes M3 component CSS files and generates a detailed styling report
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple

# Color codes for terminal output
GREEN = '\033[0;32m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

COMPONENT_DIR = Path("frontend/src/components/m3-expressive")
TOKENS_FILE = Path("frontend/src/styles/m3-design-tokens.css")

# Token categories
TOKEN_CATEGORIES = {
    'color': r'--md-sys-color-',
    'spacing': r'--md-sys-spacing-',
    'shape': r'--md-sys-shape-',
    'typography': r'--md-sys-typescale-',
    'elevation': r'--md-sys-elevation-',
    'motion': r'--md-sys-motion-',
}

# Patterns to detect hardcoded values
HARDCODED_PATTERNS = {
    'colors': [
        r'#[0-9a-fA-F]{3,6}',
        r'rgb\([^)]+\)',
        r'rgba\([^)]+\)',
    ],
    'spacing': [
        r'\b([4-9]|[1-9][0-9]+)px\b',  # Exclude 0-3px (common for borders)
    ],
    'shadows': [
        r'box-shadow:\s*[0-9]',  # Hardcoded shadow values
    ],
}


def find_css_files() -> List[Path]:
    """Find all CSS files in M3 components directory"""
    if not COMPONENT_DIR.exists():
        return []
    return list(COMPONENT_DIR.rglob("*.css"))


def analyze_css_file(css_file: Path) -> Dict:
    """Analyze a single CSS file for styling consistency"""
    results = {
        'file': str(css_file.relative_to(COMPONENT_DIR)),
        'token_usage': defaultdict(int),
        'hardcoded_values': defaultdict(list),
        'issues': [],
        'token_count': 0,
    }

    try:
        content = css_file.read_text()

        # Count token usage by category
        for category, pattern in TOKEN_CATEGORIES.items():
            matches = re.findall(pattern, content)
            results['token_usage'][category] = len(matches)
            results['token_count'] += len(matches)

        # Detect hardcoded colors
        for pattern in HARDCODED_PATTERNS['colors']:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                results['hardcoded_values']['colors'].extend(matches[:5])  # Limit to 5 examples

        # Detect hardcoded spacing
        for pattern in HARDCODED_PATTERNS['spacing']:
            matches = re.findall(pattern, content)
            if matches:
                results['hardcoded_values']['spacing'].extend(matches[:5])

        # Detect hardcoded shadows
        for pattern in HARDCODED_PATTERNS['shadows']:
            matches = re.findall(pattern, content)
            if matches:
                results['hardcoded_values']['shadows'].extend(matches[:5])

        # Identify issues
        if results['token_count'] == 0 and len(content.strip()) > 0:
            results['issues'].append('No design tokens found')

        if results['hardcoded_values']['colors']:
            results['issues'].append(f"{len(results['hardcoded_values']['colors'])} hardcoded color(s)")

        if results['hardcoded_values']['spacing']:
            results['issues'].append(f"{len(results['hardcoded_values']['spacing'])} hardcoded spacing value(s)")

        if results['hardcoded_values']['shadows']:
            results['issues'].append(f"{len(results['hardcoded_values']['shadows'])} hardcoded shadow(s)")

    except Exception as e:
        results['issues'].append(f"Error reading file: {e}")

    return results


def generate_report() -> Dict:
    """Generate comprehensive styling report"""
    css_files = find_css_files()

    report = {
        'total_files': len(css_files),
        'components': [],
        'summary': {
            'total_tokens': 0,
            'total_hardcoded_colors': 0,
            'total_hardcoded_spacing': 0,
            'total_hardcoded_shadows': 0,
            'files_with_issues': 0,
        },
        'token_usage': defaultdict(int),
    }

    for css_file in sorted(css_files):
        analysis = analyze_css_file(css_file)
        report['components'].append(analysis)

        # Update summary
        report['summary']['total_tokens'] += analysis['token_count']
        report['summary']['total_hardcoded_colors'] += len(analysis['hardcoded_values']['colors'])
        report['summary']['total_hardcoded_spacing'] += len(analysis['hardcoded_values']['spacing'])
        report['summary']['total_hardcoded_shadows'] += len(analysis['hardcoded_values']['shadows'])

        if analysis['issues']:
            report['summary']['files_with_issues'] += 1

        # Aggregate token usage
        for category, count in analysis['token_usage'].items():
            report['token_usage'][category] += count

    return report


def print_report(report: Dict):
    """Print formatted report to console"""
    print(f"\n{BLUE}{'='*60}{NC}")
    print(f"{BLUE}M3 Styling Consistency Report{NC}")
    print(f"{BLUE}{'='*60}{NC}\n")

    print(f"Total CSS Files Analyzed: {report['total_files']}")
    print(f"Total Token Usage: {report['summary']['total_tokens']}")
    print(f"Files with Issues: {report['summary']['files_with_issues']}\n")

    print(f"{BLUE}Token Usage by Category:{NC}")
    for category, count in sorted(report['token_usage'].items()):
        print(f"  • {category.capitalize()}: {count}")

    print(f"\n{BLUE}Issues Summary:{NC}")
    print(f"  • Hardcoded colors: {report['summary']['total_hardcoded_colors']}")
    print(f"  • Hardcoded spacing: {report['summary']['total_hardcoded_spacing']}")
    print(f"  • Hardcoded shadows: {report['summary']['total_hardcoded_shadows']}")

    # Components with issues
    components_with_issues = [c for c in report['components'] if c['issues']]
    if components_with_issues:
        print(f"\n{YELLOW}Components Requiring Review:{NC}")
        for component in components_with_issues[:10]:  # Show first 10
            print(f"  • {component['file']}")
            for issue in component['issues']:
                print(f"    - {issue}")

    # Components with no issues
    clean_components = [c for c in report['components'] if not c['issues']]
    if clean_components:
        print(f"\n{GREEN}Components with No Issues ({len(clean_components)}):{NC}")
        for component in clean_components[:5]:  # Show first 5
            print(f"  ✅ {component['file']}")


def main():
    """Main execution"""
    if not COMPONENT_DIR.exists():
        print(f"{RED}Error: M3 components directory not found{NC}")
        return 1

    report = generate_report()
    print_report(report)

    # Save JSON report
    output_file = Path("m3-styling-report.json")
    with open(output_file, 'w') as f:
        json.dump(report, f, indent=2)

    print(f"\n{BLUE}Detailed report saved to: {output_file}{NC}\n")

    # Return exit code based on issues
    if report['summary']['files_with_issues'] == 0:
        return 0
    elif report['summary']['files_with_issues'] < 5:
        return 0  # Minor issues, non-blocking
    else:
        return 1  # Significant issues


if __name__ == "__main__":
    exit(main())
