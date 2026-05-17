# Prompt: Sprint Close

**Purpose:** Create a sprint handover in Notion and close the Linear cycle at sprint end.

**Setup:** Enable filesystem, Linear, and Notion connectors before running.

**Trigger:** Change to SPRINT_LOG.md (user adds a new sprint summary row).

---

## Step 1 — Read three canonical files

Use filesystem connector to read:
```
/Users/okgoogle13/Projects/careercopilot/SPRINT_LOG.md
/Users/okgoogle13/Projects/careercopilot/TASKS.md
/Users/okgoogle13/Projects/careercopilot/DECISIONS.md
```

Extract:
- The newest row added to SPRINT_LOG.md (sprint [N], dates, planned, done, notes)
- All tasks from TASKS.md **Done** section for this sprint
- All tasks from TASKS.md **Active** section that are still incomplete (marked `[ ]`)
- All tasks from TASKS.md **Waiting On** section
- DECISIONS.md entries from this sprint's date range

---

## Step 2 — Create a Notion handover page

**Search first:** Check Notion > CareerCopilot > Handovers for existing page matching the sprint/date.

If not found, create a new page with this structure:

```markdown
# Sprint [N] Handover — [date from SPRINT_LOG.md]

## Velocity

**Planned:** [X tasks]
**Done:** [Y tasks]
**Ratio:** [Y/X]
**Notes:** [notes from SPRINT_LOG.md]

## Completed Tasks

- [task 1 from TASKS.md Done section]
- [task 2 from TASKS.md Done section]
...

## Not Completed / Deferred

- [incomplete tasks from TASKS.md Active section]
- [tasks from TASKS.md Waiting On]

## Decisions Made

[DECISIONS.md entries dated within this sprint]

## Next Sprint Seeds

[tasks from TASKS.md Waiting On that should start next]
```

**Location:** Notion > CareerCopilot > Handovers

---

## Step 3 — Close the Linear cycle

**Find:** The active Linear cycle matching this sprint name (from SPRINT_LOG.md).

**Actions:**
1. Mark the cycle **Complete** (close it)
2. For any incomplete issues in the cycle:
   - Do NOT mark them Done
   - Move them to the **Backlog** (unassign from cycle)
   - Leave status as-is (Todo/In Progress)

---

## Step 4 — Report

Print a summary:
```
✅ Sprint [N] closed
- Notion handover created: Sprint [N] Handover — [date]
- Linear cycle closed: [cycle name]
- X tasks completed, Y deferred to backlog
```

---

## Rules (Non-Negotiable)

- **Use SPRINT_LOG.md as source of truth:** Dates, planned vs done, and notes come from the new row added
- **Exact task names:** Copy task titles verbatim from TASKS.md
- **Do not mark Linear issues Done:** Only move incomplete issues to backlog; the sync comes from TASKS.md changes
- **Search before create:** Never duplicate a handover page in Notion
- **Do not modify TASKS.md or SPRINT_LOG.md:** This prompt only writes to Notion and Linear
- **Preserve structure:** Keep the markdown formatting from TASKS.md sections
