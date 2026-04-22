#!/usr/bin/env python3
"""Audit script to find and categorize all markdown files in the codebase."""

import os
import json
from pathlib import Path


def find_markdown_files():
    """Find all .md files in repo, categorize by location."""
    md_files = {}
    exclude_dirs = {'.git', 'node_modules', '.next', 'dist', '.venv', '.worktrees'}

    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.md'):
                path = os.path.join(root, file)
                location = 'docs' if path.startswith('./docs') else 'scattered'
                if location not in md_files:
                    md_files[location] = []
                md_files[location].append(path)

    return md_files


def categorize_by_type(files):
    """Categorize markdown by content type (API, UX, decisions, etc)."""
    categories = {
        'api': [],
        'architecture': [],
        'ux': [],
        'decisions': [],
        'development': [],
        'other': []
    }

    for file in files:
        try:
            with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().lower()
        except Exception:
            content = ''

        if any(x in file.lower() for x in ['api', 'endpoint', 'contract']):
            categories['api'].append(file)
        elif any(x in file.lower() for x in ['arch', 'design', 'system']):
            categories['architecture'].append(file)
        elif any(x in file.lower() for x in ['ux', 'workflow', 'process']):
            categories['ux'].append(file)
        elif any(x in file.lower() for x in ['decision', 'adr']):
            categories['decisions'].append(file)
        elif any(x in file.lower() for x in ['dev', 'setup', 'development']):
            categories['development'].append(file)
        else:
            categories['other'].append(file)

    return categories


if __name__ == '__main__':
    md_files = find_markdown_files()
    all_files = sum(md_files.values(), [])
    categories = categorize_by_type(all_files)

    result = {
        'locations': md_files,
        'categories': categories,
        'total_files': len(all_files)
    }

    print(json.dumps(result, indent=2))
