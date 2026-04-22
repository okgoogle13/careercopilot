# Task → Linear → Notion Sync Workflow

Keeps task board (TASKS.md) synchronized with Linear issue tracker and Notion database.

## Overview

- **Source of truth**: `TASKS.md` (task structure, status, priorities)
- **Issue tracker**: Linear (team collaboration, issue assignment, status transitions)
- **Interactive hub**: Notion (team-accessible task view, Perplexity reasoning)
- **Trigger**: Manual sync command or CI job on TASKS.md changes

## Workflow Diagram

```
┌──────────────┐
│  TASKS.md    │
│ (source of   │
│  truth)      │
└──────┬───────┘
       │
       │ Parse tasks (Task N: Title)
       ▼
┌──────────────────────────────────────────┐
│ sync_tasks_to_linear_notion.py            │
│ - Extract tasks, numbers, titles, status  │
│ - Create/update Linear issues (GraphQL)   │
│ - Create/update Notion pages (API)        │
└──────┬──────────────────────────┬─────────┘
       │                          │
       ▼                          ▼
┌─────────────────────┐  ┌──────────────────────┐
│  Linear Issues      │  │  Notion Pages        │
│  - Key: TASK-N      │  │  - Title: Task N: X  │
│  - Title            │  │  - Status property   │
│  - Priority         │  │  - Linked docs       │
│  - Assignee         │  │  - Team-browseable   │
│  - Status           │  │  - Perplexity reads  │
└─────────────────────┘  └──────────────────────┘
```

## Script Usage

### Prerequisites

Install dependencies:
```bash
pip install requests
```

Export API credentials:
```bash
export LINEAR_API_TOKEN=lin_...         # Linear API token
export LINEAR_TEAM_ID=team_abc123       # Linear team UUID
export NOTION_API_TOKEN=ntn_...         # Notion integration token
export NOTION_DATABASE_ID=abc123...     # Notion database ID
```

### Manual Sync (Local)

Dry run (preview changes):
```bash
python3 backend/scripts/sync_tasks_to_linear_notion.py \
  --linear-token $LINEAR_API_TOKEN \
  --linear-team-id $LINEAR_TEAM_ID \
  --notion-token $NOTION_API_TOKEN \
  --notion-database-id $NOTION_DATABASE_ID \
  --dry-run
```

Live sync (creates issues and pages):
```bash
python3 backend/scripts/sync_tasks_to_linear_notion.py \
  --linear-token $LINEAR_API_TOKEN \
  --linear-team-id $LINEAR_TEAM_ID \
  --notion-token $NOTION_API_TOKEN \
  --notion-database-id $NOTION_DATABASE_ID
```

### CI/CD Integration

Add GitHub Action (optional):
```yaml
name: Sync Tasks to Linear/Notion
on:
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

## Task Parsing Rules

The sync script recognizes this TASKS.md format:

```markdown
## Task N: [Title]
**Files:**
- Create/Modify: [files]

- [ ] **Step 1:** [description]
- [ ] **Step 2:** [description]
```

Each `## Task N: Title` becomes:
- Linear issue key: `TASK-N` (auto-assigned)
- Linear title: `Title`
- Notion page title: `Task N: Title`
- Status: `pending` (default)

## Field Mapping

| Field | TASKS.md | Linear | Notion |
|-------|----------|--------|--------|
| ID | Task N | TASK-N key | Page ID |
| Title | "Task N: Title" | Title | Name (Title prop) |
| Status | (inferred) | State | Status (Select) |
| Priority | (hardcoded high) | Priority | (can add prop) |
| Description | Files + Steps | From TASKS.md | Content blocks |

## Sync Behavior

### Create vs Update

- **New task** (not in Linear/Notion): creates issue and page
- **Existing task** (found by Task N number): updates if title changed

### Status Handling

- Initial status: `pending` (on create)
- After creation: manage status manually in Linear/Notion (script doesn't overwrite)
- Sync only updates issues if TASKS.md content changes

### Collision Handling

If two TASKS.md tasks have same title (unlikely):
- Script processes in order (Task 1 before Task 2)
- Later tasks create separate issues (Linear allows duplicates)

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `Authorization failed` | Invalid token | Check LINEAR_API_TOKEN, NOTION_API_TOKEN |
| `Team not found` | Wrong team ID | Verify LINEAR_TEAM_ID in Linear → Settings |
| `Database not found` | Wrong database ID | Verify NOTION_DATABASE_ID in Notion URL |
| `No tasks synced` | TASKS.md not found | Ensure TASKS.md exists in repo root |
| Tasks not created | Format mismatch | Use `## Task N: Title` format exactly |

## Linked Documents

To link a synced task to a document (e.g., spec, design doc):

1. Create document in Notion (via `docs-to-notion.py` or manually)
2. In task's Notion page, manually add link to document
3. Alternatively, update document with backlink to task's Linear key

Example backlink in document:
```markdown
# My Design Spec
Related task: [TASK-5](https://linear.app/team/task/TASK-5)
```

## Next Steps

- [Perplexity Integration](PERPLEXITY_INTEGRATION.md) — Enable AI reasoning on tasks
- [Self-Hosted Migration](SELF_HOSTED_MIGRATION.md) — Move to PostgreSQL backend
- [Execution Prompts](EXECUTION_PROMPTS.md) — Run workflows from Perplexity or IDE
