#!/usr/bin/env python3
"""Sync TASKS.md to Linear issues and Notion pages.

Parses TASKS.md task structure, creates/updates Linear issues and Notion pages
to keep issue tracking synchronized with source-of-truth task board.

Usage:
  python3 backend/scripts/sync_tasks_to_linear_notion.py \
    --linear-token <token> \
    --linear-team-id <team-id> \
    --notion-token <token> \
    --notion-database-id <database-id> \
    [--dry-run]
"""

import os
import re
import argparse
import json
from typing import Optional, List
from pathlib import Path
import requests


class TaskParser:
    """Parse TASKS.md to extract task structure."""

    def __init__(self, tasks_file: str):
        self.tasks_file = tasks_file
        self.tasks: List[dict] = []

    def parse(self):
        """Parse TASKS.md and extract all tasks."""
        try:
            with open(self.tasks_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Simple regex-based parsing: find "## Task N: Title" patterns
            task_pattern = r'## Task (\d+): (.+?)(?:\n|$)'
            for match in re.finditer(task_pattern, content):
                task_num = int(match.group(1))
                task_title = match.group(2).strip()

                self.tasks.append({
                    'number': task_num,
                    'title': task_title,
                    'status': 'pending'  # Default status
                })

            return self.tasks
        except Exception as e:
            print(f"Error parsing TASKS.md: {e}")
            return []


class LinearSync:
    """Sync tasks to Linear issues."""

    def __init__(self, api_token: str, team_id: str):
        self.api_url = 'https://api.linear.app/graphql'
        self.api_token = api_token
        self.team_id = team_id

    def create_or_update_issue(self, task: dict, dry_run: bool = False) -> Optional[str]:
        """Create or update a Linear issue for a task."""
        issue_key = f"TASK-{task['number']}"

        query = """
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            issue {
              id
              key
            }
          }
        }
        """

        variables = {
            "input": {
                "teamId": self.team_id,
                "title": task['title'],
                "description": f"Automated sync from TASKS.md\nTask #{task['number']}",
                "priority": 2  # High priority
            }
        }

        if dry_run:
            print(f"[DRY RUN] Would create Linear issue: {issue_key} - {task['title']}")
            return f"linear_{task['number']}"

        try:
            response = requests.post(
                self.api_url,
                headers={
                    'Authorization': f'Bearer {self.api_token}',
                    'Content-Type': 'application/json'
                },
                json={"query": query, "variables": variables}
            )

            if response.status_code == 200:
                result = response.json()
                if result.get('data', {}).get('issueCreate', {}).get('issue'):
                    issue_id = result['data']['issueCreate']['issue']['id']
                    print(f"✓ Created Linear issue: {issue_key} ({issue_id})")
                    return issue_id
                else:
                    print(f"✗ Failed to create Linear issue: {result.get('errors')}")
                    return None
            else:
                print(f"✗ Linear API error: {response.status_code}")
                return None
        except Exception as e:
            print(f"✗ Error creating Linear issue: {e}")
            return None


class NotionSync:
    """Sync tasks to Notion pages."""

    def __init__(self, api_token: str, database_id: str):
        self.api_url = 'https://api.notion.com/v1'
        self.api_token = api_token
        self.database_id = database_id

    def create_or_update_page(self, task: dict, dry_run: bool = False) -> Optional[str]:
        """Create or update a Notion page for a task."""
        page_title = f"Task {task['number']}: {task['title']}"

        payload = {
            "parent": {"database_id": self.database_id},
            "properties": {
                "Name": {
                    "title": [
                        {
                            "text": {"content": page_title[:100]}  # Notion limit
                        }
                    ]
                },
                "Status": {
                    "select": {"name": task['status']}
                }
            }
        }

        if dry_run:
            print(f"[DRY RUN] Would create Notion page: {page_title}")
            return f"notion_{task['number']}"

        try:
            response = requests.post(
                f"{self.api_url}/pages",
                headers={
                    'Authorization': f'Bearer {self.api_token}',
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                json=payload
            )

            if response.status_code in (200, 201):
                result = response.json()
                page_id = result.get('id')
                print(f"✓ Created Notion page: {page_title} ({page_id})")
                return page_id
            else:
                print(f"✗ Notion API error: {response.status_code}")
                return None
        except Exception as e:
            print(f"✗ Error creating Notion page: {e}")
            return None


def main():
    parser = argparse.ArgumentParser(
        description='Sync TASKS.md to Linear issues and Notion pages'
    )
    parser.add_argument('--linear-token', required=True, help='Linear API token')
    parser.add_argument('--linear-team-id', required=True, help='Linear team ID')
    parser.add_argument('--notion-token', required=True, help='Notion API token')
    parser.add_argument('--notion-database-id', required=True, help='Notion database ID')
    parser.add_argument('--dry-run', action='store_true', help='Dry run (no changes)')
    parser.add_argument('--tasks-file', default='TASKS.md', help='Path to TASKS.md')

    args = parser.parse_args()

    print("Syncing TASKS.md to Linear and Notion...\n")

    # Parse TASKS.md
    task_parser = TaskParser(args.tasks_file)
    tasks = task_parser.parse()

    if not tasks:
        print("No tasks found in TASKS.md")
        return

    print(f"Found {len(tasks)} tasks\n")

    # Initialize sync clients
    linear_sync = LinearSync(args.linear_token, args.linear_team_id)
    notion_sync = NotionSync(args.notion_token, args.notion_database_id)

    # Sync each task
    results = {
        'total': len(tasks),
        'synced_linear': 0,
        'synced_notion': 0,
        'failed': 0
    }

    for task in tasks:
        print(f"\n--- Task {task['number']}: {task['title']} ---")

        # Sync to Linear
        linear_id = linear_sync.create_or_update_issue(task, dry_run=args.dry_run)
        if linear_id:
            results['synced_linear'] += 1
        else:
            results['failed'] += 1

        # Sync to Notion
        notion_id = notion_sync.create_or_update_page(task, dry_run=args.dry_run)
        if notion_id:
            results['synced_notion'] += 1
        else:
            results['failed'] += 1

    # Summary
    print(f"\n{'='*50}")
    print("Sync Summary:")
    print(f"  Total tasks: {results['total']}")
    print(f"  Synced to Linear: {results['synced_linear']}")
    print(f"  Synced to Notion: {results['synced_notion']}")
    print(f"  Failed: {results['failed']}")
    print(f"{'='*50}")


if __name__ == '__main__':
    main()
