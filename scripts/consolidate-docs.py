#!/usr/bin/env python3
"""Consolidate scattered markdown files into docs/ structure per strategy."""

import os
import shutil
import json
from pathlib import Path

CONSOLIDATION_MAP = {
    # Backend API docs → docs/api/
    'backend/docs/': 'docs/api/backend-docs/',
    'backend/app/api/': 'docs/api/backend-api/',
    'tools/api/': 'docs/api/tools-api/',
    'api/': 'docs/api/contracts/',

    # Frontend architecture → docs/frontend-architecture/
    'frontend/docs/': 'docs/frontend-architecture/',

    # AI prompts → docs/ai-prompts/
    'tools/ai/prompts/': 'docs/ai-prompts/',

    # Automation docs → docs/automation/
    'tools/scripts/': 'docs/automation/scripts/',
    'tools/workflows/': 'docs/automation/workflows/',

    # Decision logs
    'decisions/': 'docs/decisions/',
    'decision-logs/': 'docs/decisions/decision-logs/',
}

# Root-level docs (non-consolidatable, stay at root)
NON_CONSOLIDATABLE = {
    'TASKS.md', 'SPRINT_BRIEF.md', 'DECISIONS.md', 'SPRINT_LOG.md',
    'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'README.md', 'GOVERNANCE.md'
}

EXCLUDE_DIRS = {'.git', 'node_modules', '.next', 'dist', '.venv', '.worktrees', 'build', '__pycache__'}


def find_scattered_markdown():
    """Find markdown files outside docs/ that should be consolidated."""
    scattered = []

    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        # Skip docs/ itself
        if 'docs' in root.split(os.sep):
            continue

        for file in files:
            if file.endswith('.md'):
                path = os.path.join(root, file)

                # Skip root-level governance docs
                if root == '.' and file in NON_CONSOLIDATABLE:
                    continue

                scattered.append(path)

    return scattered


def determine_destination(path):
    """Determine destination for a markdown file based on consolidation map."""
    for source_pattern, dest_dir in CONSOLIDATION_MAP.items():
        if source_pattern in path:
            filename = os.path.basename(path)
            return os.path.join(dest_dir, filename)

    # Default: docs/other/
    filename = os.path.basename(path)
    return os.path.join('docs/other/', filename)


def consolidate():
    """Execute consolidation: move files per map, create destination dirs."""
    scattered = find_scattered_markdown()

    if not scattered:
        print("No scattered markdown files to consolidate.")
        return

    print(f"Found {len(scattered)} scattered markdown files to consolidate.\n")

    moves = {}
    for src_path in scattered:
        dest_path = determine_destination(src_path)

        # Avoid duplicates in destination
        if dest_path in moves.values():
            print(f"⚠️  COLLISION: {src_path} and another file map to {dest_path}")
            print(f"   Skipping {src_path}")
            continue

        moves[src_path] = dest_path

    # Create destination directories and move files
    for src, dest in moves.items():
        dest_dir = os.path.dirname(dest)

        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir, exist_ok=True)
            print(f"Created: {dest_dir}")

        if os.path.exists(dest):
            print(f"⚠️  EXISTS: {dest} already exists, skipping {src}")
            continue

        shutil.move(src, dest)
        print(f"Moved: {src} → {dest}")

    print(f"\n✓ Consolidated {len(moves)} files")

    # Write consolidation log
    with open('.claude/reports/consolidation-log-2026-04-22.json', 'w') as f:
        json.dump({
            'total_files_moved': len(moves),
            'moves': moves
        }, f, indent=2)

    print("Consolidation log saved to .claude/reports/consolidation-log-2026-04-22.json")


if __name__ == '__main__':
    consolidate()
