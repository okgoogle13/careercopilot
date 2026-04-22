# Notion Sync Configuration

Git → Notion continuous synchronization of documentation.

## Architecture

- **Source of truth**: `docs/` directory (markdown files)
- **Synced hub**: Notion database (interactive querying, Perplexity reasoning)
- **Trigger**: CI job on `docs/**/*.md` changes pushed to `develop` or `main`
- **Script**: `scripts/docs-to-notion.py` (idempotent, creates pages for new/changed files)

## Setup

### 1. Create Notion API Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create new integration with:
   - Name: `CareerCopilot Docs Sync`
   - Capabilities: Read, Update, Insert content
   - User association: Your workspace
3. Save the **Internal Integration Token** → store as `NOTION_API_TOKEN` secret

### 2. Create Notion Database

1. Create a new database in Notion called `Documentation`
2. Add property: `Name` (Title, required)
3. Copy the database ID from the URL (format: `123e4567e89b12d3a456426614174000`)
4. Store as `NOTION_DATABASE_ID` secret

### 3. Share Database with Integration

1. In Notion, open the Database
2. Click "Share" → "Integrations"
3. Select your integration (`CareerCopilot Docs Sync`)
4. Grant **Editor** access

### 4. Add GitHub Secrets

In your repository settings (`Settings` → `Secrets and variables` → `Actions`):

```
NOTION_API_TOKEN=<internal-integration-token>
NOTION_DATABASE_ID=<database-id>
```

## Usage

### Automatic Sync (CI)

Any commit that modifies `docs/**/*.md` on `develop` or `main` triggers the workflow:

```bash
git push origin develop  # CI job runs, syncs changed files to Notion
```

### Manual Sync (Local)

For dry-run or manual testing:

```bash
export NOTION_API_TOKEN=<your-token>
export NOTION_DATABASE_ID=<your-database-id>

# Dry run (no changes)
python3 scripts/docs-to-notion.py --dry-run

# Live sync
python3 scripts/docs-to-notion.py
```

## Sync Behavior

- **Per-file**: Each markdown file becomes a Notion page
- **Title extraction**: First H1 heading used as page title; filename used if no H1 present
- **Content**: Markdown content synced as Notion paragraph blocks
- **Idempotency**: Re-syncing same files updates existing pages (ID-based lookup)
- **Collision handling**: If two source files map to same title, first wins (log warning)

## Workflow Diagram

```
┌─────────────────────────────────────────┐
│  Developer commits docs/**/*.md changes  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Git push to develop/main                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  GitHub Actions triggers sync job        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  scripts/docs-to-notion.py runs:         │
│  - Reads changed markdown files          │
│  - Extracts title + content              │
│  - Creates/updates Notion pages via API  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Notion database updated                 │
│  ✓ Pages available for queries           │
│  ✓ Perplexity can read snapshots         │
│  ✓ Team can browse interactive docs      │
└─────────────────────────────────────────┘
```

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `Error: NOTION_API_TOKEN not set` | Secrets not configured | Add to GitHub Secrets (see Setup step 4) |
| `401 Unauthorized` | Invalid token | Regenerate integration token, update secret |
| `403 Forbidden` | Integration not shared with database | Share database with integration (Setup step 3) |
| `404 Not Found` | Wrong database ID | Verify ID in Notion URL |
| No pages created | Markdown files not in `docs/` path | Check file location matches CI trigger pattern |

## Next Steps

- [Perplexity Integration Guide](PERPLEXITY_INTEGRATION.md) — Enable Perplexity read/write
- [Task → Linear → Notion Sync](TASK_SYNC_WORKFLOW.md) — Connect TASKS.md to Linear and Notion
- [Self-Hosted Migration](SELF_HOSTED_MIGRATION.md) — Swap Notion for PostgreSQL

## References

- [Notion API Documentation](https://developers.notion.com/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Database Query Filtering](https://developers.notion.com/reference/database-query-filter)
