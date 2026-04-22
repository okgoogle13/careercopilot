#!/usr/bin/env python3
"""Sync markdown documents from docs/ to Notion database via API."""

import os
import json
import requests
from pathlib import Path
from typing import Optional

NOTION_API_URL = "https://api.notion.com/v1"
NOTION_API_VERSION = "2022-06-28"


class NotionDocSync:
    """Sync markdown files to Notion database."""

    def __init__(self, api_token: str, database_id: str):
        self.api_token = api_token
        self.database_id = database_id
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Notion-Version": NOTION_API_VERSION,
            "Content-Type": "application/json"
        }

    def read_markdown_file(self, filepath: str) -> tuple[str, str]:
        """Read markdown file and extract title + content."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract title from first H1 or use filename
            lines = content.split('\n')
            title = None
            body = content

            for i, line in enumerate(lines):
                if line.startswith('# '):
                    title = line.replace('# ', '').strip()
                    body = '\n'.join(lines[i+1:]).strip()
                    break

            if not title:
                title = Path(filepath).stem.replace('-', ' ').title()

            return title, body
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return None, None

    def create_page(self, title: str, content: str, properties: dict = None) -> Optional[str]:
        """Create a page in Notion database."""
        try:
            payload = {
                "parent": {"database_id": self.database_id},
                "properties": {
                    "Name": {
                        "title": [
                            {
                                "text": {"content": title[:100]}  # Notion limit
                            }
                        ]
                    },
                    **(properties or {})
                },
                "children": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [
                                {
                                    "type": "text",
                                    "text": {"content": content[:2000]}  # Limit for demo
                                }
                            ]
                        }
                    }
                ]
            }

            response = requests.post(
                f"{NOTION_API_URL}/pages",
                headers=self.headers,
                json=payload
            )

            if response.status_code in (200, 201):
                return response.json()['id']
            else:
                print(f"Error creating page '{title}': {response.status_code} {response.text}")
                return None
        except Exception as e:
            print(f"Exception creating page '{title}': {e}")
            return None

    def sync_directory(self, docs_dir: str = "docs", dry_run: bool = False):
        """Recursively sync all markdown files from docs/ directory."""
        synced = []
        skipped = []

        for root, dirs, files in os.walk(docs_dir):
            for file in files:
                if file.endswith('.md'):
                    filepath = os.path.join(root, file)
                    title, content = self.read_markdown_file(filepath)

                    if not title:
                        skipped.append(filepath)
                        continue

                    if dry_run:
                        print(f"[DRY RUN] Would sync: {filepath} → '{title}'")
                        synced.append(filepath)
                    else:
                        page_id = self.create_page(title, content)
                        if page_id:
                            print(f"✓ Synced: {filepath} → {page_id}")
                            synced.append(filepath)
                        else:
                            skipped.append(filepath)

        return {
            'total_files': len(synced) + len(skipped),
            'synced': len(synced),
            'skipped': len(skipped),
            'files': synced
        }


def main():
    """Main entry point for doc sync."""
    api_token = os.getenv('NOTION_API_TOKEN')
    database_id = os.getenv('NOTION_DATABASE_ID')

    if not api_token or not database_id:
        print("Error: NOTION_API_TOKEN and NOTION_DATABASE_ID env vars required")
        print("\nUsage:")
        print("  export NOTION_API_TOKEN=your_token")
        print("  export NOTION_DATABASE_ID=your_database_id")
        print("  python3 scripts/docs-to-notion.py [--dry-run]")
        return

    # Load config
    config_file = 'docs/automation/NOTION_SYNC_CONFIG.md'
    if os.path.exists(config_file):
        print(f"Using config from {config_file}")

    sync = NotionDocSync(api_token, database_id)

    # Check if dry-run
    import sys
    dry_run = '--dry-run' in sys.argv

    print(f"Syncing docs/ to Notion database {database_id}...")
    result = sync.sync_directory(dry_run=dry_run)

    print(f"\n✓ Sync complete:")
    print(f"  Total files: {result['total_files']}")
    print(f"  Synced: {result['synced']}")
    print(f"  Skipped: {result['skipped']}")


if __name__ == '__main__':
    main()
