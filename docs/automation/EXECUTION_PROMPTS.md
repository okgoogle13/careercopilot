# Execution Prompts — Copy-Paste Ready

Prompts for invoking automation across IDE, Perplexity, Notion, Linear, and CI environments.

## Claude Code (IDE)

### Sync docs to Notion
```
/Sync documentation to Notion

Export all markdown files from docs/ and create/update Notion pages
using NOTION_API_TOKEN and NOTION_DATABASE_ID environment variables.

Dry-run first:
python3 scripts/docs-to-notion.py --dry-run

Then live:
python3 scripts/docs-to-notion.py
```

### Sync TASKS to Linear + Notion
```
/Sync tasks to Linear and Notion

Parse TASKS.md and create/update issues in Linear (TASK-N keys) and
pages in Notion database. Use environment variables:
- LINEAR_API_TOKEN
- LINEAR_TEAM_ID
- NOTION_API_TOKEN
- NOTION_DATABASE_ID

python3 backend/scripts/sync_tasks_to_linear_notion.py \
  --linear-token $LINEAR_API_TOKEN \
  --linear-team-id $LINEAR_TEAM_ID \
  --notion-token $NOTION_API_TOKEN \
  --notion-database-id $NOTION_DATABASE_ID
```

### Consolidate scattered docs
```
/Consolidate documentation

Audit and move 1,300+ scattered markdown files into docs/ directory structure:
- backend/docs/* → docs/api/backend-docs/
- tools/ai/prompts/* → docs/ai-prompts/
- tools/scripts/* → docs/automation/

Run:
python3 scripts/consolidate-docs.py
```

## Perplexity (with Notion Plugin)

### Ask about a task
```
Using the Notion connector, fetch TASKS.md or task "N" from the Notion database.

What are the current blockers for [Task Name]?
Based on the synced task from Notion, identify any blocking issues.
```

### Summarize a document
```
Using the Notion connector, fetch document "[Document Title]" from the database.

Summarize this document in 2-3 bullet points and identify key next steps.
```

### Find related tasks
```
Using the Notion connector, query the task database for all tasks with status
"in_progress" or "pending" related to [keyword].

Show title, status, and assignee for each.
```

### Generate sprint summary
```
Using the Notion connector, fetch all completed tasks from this sprint.

Generate a one-paragraph sprint summary with:
- Completed deliverables
- Remaining blockers
- Velocity vs planned
```

## Linear (Web UI + CLI)

### Create task from Notion
```bash
# List tasks synced from Notion
linear team --output=list | grep TASK

# Open task in browser
linear open TASK-5
```

### Update task status
```bash
# Change status to "In Progress"
linear update TASK-5 --status="In Progress"

# Change status to "Done"
linear update TASK-5 --status="Done"
```

## Notion (Web UI)

### Database query
```
// Saved filter: "All Pending Tasks"
Database view: TASK Sync
Filter: Status = Pending
Sort: Updated At (newest first)

Click to refresh synced data from Git.
```

### Create linked page
```
In any task page, click "+ Link" and select:
- Document: "Spec for Feature X"
- Decision: "Architecture Decision ADR-005"
- Note: "Migration Blocker Report"
```

### View task → Linear mapping
```
Hover over TASK-N link in Notion page.
Click to open the corresponding Linear issue in new tab.
```

## GitHub Actions (CI/CD)

### Manual trigger: Sync docs
```bash
gh workflow run sync-docs-to-notion.yml --repo careercopilot
```

### Manual trigger: Sync tasks
```bash
# Add this workflow: .github/workflows/sync-tasks-to-linear-notion.yml

name: Sync TASKS to Linear/Notion
on:
  workflow_dispatch:  # Manual trigger
  push:
    paths:
      - 'TASKS.md'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
      - run: pip install requests
      - run: python3 backend/scripts/sync_tasks_to_linear_notion.py \
          --linear-token ${{ secrets.LINEAR_API_TOKEN }} \
          --linear-team-id ${{ secrets.LINEAR_TEAM_ID }} \
          --notion-token ${{ secrets.NOTION_API_TOKEN }} \
          --notion-database-id ${{ secrets.NOTION_DATABASE_ID }}
```

## Terminal (Local Dev)

### Dry-run all syncs
```bash
# Test everything before committing
python3 scripts/docs-to-notion.py --dry-run
python3 backend/scripts/sync_tasks_to_linear_notion.py \
  --linear-token $LINEAR_API_TOKEN \
  --linear-team-id $LINEAR_TEAM_ID \
  --notion-token $NOTION_API_TOKEN \
  --notion-database-id $NOTION_DATABASE_ID \
  --dry-run
```

### Export Notion for backup
```bash
python3 << 'EOF'
import requests
import json

headers = {
    "Authorization": f"Bearer {os.getenv('NOTION_API_TOKEN')}",
    "Notion-Version": "2022-06-28"
}

response = requests.post(
    "https://api.notion.com/v1/databases/NOTION_DATABASE_ID/query",
    headers=headers
)

with open("notion_backup.json", "w") as f:
    json.dump(response.json(), f, indent=2)

print(f"Exported {len(response.json()['results'])} pages to notion_backup.json")
EOF
```

## Environment Setup

Add to `.env.local` or GitHub Secrets:
```bash
NOTION_API_TOKEN=ntn_...
NOTION_DATABASE_ID=abc123...
LINEAR_API_TOKEN=lin_...
LINEAR_TEAM_ID=team_abc...
DATABASE_URL=postgres://user:pass@host/dbname  # For PostgreSQL migration
PERPLEXITY_API_KEY=pplx_...  # For AI summarization
```

## Workflow Integration Checklist

- [ ] Sync docs on `git push` (CI via `.github/workflows/sync-docs-to-notion.yml`)
- [ ] Create Linear issue from Notion task (manual: Linear UI)
- [ ] Link Notion task to document (manual: Notion UI + keyboard shortcut)
- [ ] Ask Perplexity about synced task (via Notion plugin)
- [ ] Update TASKS.md → Linear issue reflects new status (manual: `linear update TASK-N`)
- [ ] Export to Notion weekly (via `docs-to-notion.py`)
- [ ] Backup Notion database monthly (via export script above)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "NOTION_API_TOKEN not set" | `export NOTION_API_TOKEN=ntn_...` or add to GitHub Secrets |
| "Linear API error: unauthorized" | Regenerate token at linear.app/settings/api |
| "Notion database not found" | Verify NOTION_DATABASE_ID in database URL |
| Perplexity can't see Notion | Enable Notion plugin in Perplexity settings |
| Docs not syncing | Check `.github/workflows/sync-docs-to-notion.yml` trigger path (`docs/**/*.md`) |

## References

- [Claude Code CLI](https://claude.com/claude-code)
- [Perplexity Plugins](https://www.perplexity.ai/settings/extensions)
- [Linear CLI](https://docs.linear.app/cli)
- [Notion API](https://developers.notion.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
