# Prompt: Sprint Open

**Purpose:** Create a Linear cycle + Notion sprint page when a new sprint branch is created.

**Setup:** Enable filesystem, Linear, and Notion connectors before running.

**Trigger:** First commit on a `sprint/*` branch.

---

## Step 1 — Read four canonical files

Use filesystem connector to read all of these:
```
/Users/okgoogle13/Projects/careercopilot/TASKS.md
/Users/okgoogle13/Projects/careercopilot/SPRINT_BRIEF.md
/Users/okgoogle13/Projects/careercopilot/DECISIONS.md
/Users/okgoogle13/Projects/careercopilot/SPRINT_LOG.md
```

Extract:
- Sprint name and heading from TASKS.md **Active** section (e.g., "Sprint 4: Pipeline State Wiring")
- Sprint goal from SPRINT_BRIEF.md **Objective** section (1-sentence, use verbatim)
- All tasks under TASKS.md **Active** section (only top-level tasks, no subtasks)
- Last row from SPRINT_LOG.md (previous sprint velocity)
- Any DECISIONS.md entries from the last 7 days (context-relevant)

---

## Step 2 — Create a Linear cycle

**Search first:** Check if a cycle with the sprint name already exists in CareerCopilot project.

If not found, create:
- **Name:** sprint name from TASKS.md heading (exact)
- **Description:** sprint goal from SPRINT_BRIEF.md + one sentence of context
- **Status:** Open

Then, for each task from TASKS.md **Active** section (top-level only):
1. **Search Linear** for an existing issue with that title
2. If found: add it to the cycle (status: Todo)
3. If not found: create a new issue
   - Title: exact task title from TASKS.md
   - Description: task body text from TASKS.md (if present)
   - Status: **Todo**
   - Project: CareerCopilot
   - Cycle: the cycle just created
   - Assignee: leave unassigned

---

## Step 3 — Create a Notion sprint page

**Search first:** Check if a page with the sprint name already exists under Notion > CareerCopilot > Sprints.

If not found, create a new page with this structure:

```markdown
# Sprint [N]: [Name]

**Dates:** [date from git branch creation or today] → TBD
**Goal:** [goal from SPRINT_BRIEF.md, verbatim]

## Tasks

[Copy the exact task list from TASKS.md Active section, preserving markdown formatting]

## Context

### Related Decisions
[List any recent decisions from DECISIONS.md that affect this sprint]

### Previous Sprint Velocity
[Last row from SPRINT_LOG.md: what was planned, what was done, notes]
```

**Location:** Notion > CareerCopilot > Sprints folder

---

## Step 4 — Report

Print a summary:
```
✅ Sprint [N] opened
- Created Linear cycle: [name]
- Created Notion page: Sprint [N]: [Name]
- Added N tasks to cycle
```

---

## Rules (Non-Negotiable)

- **No invention:** Only use data from TASKS.md, SPRINT_BRIEF.md, DECISIONS.md, SPRINT_LOG.md
- **No paraphrasing:** Use sprint name and goal verbatim from source files
- **Search before create:** Check Linear and Notion for duplicates before creating
- **Top-level tasks only:** Ignore subtasks and nested bullets
- **Exact formatting:** Preserve markdown in task descriptions
- **Ignore metadata:** Do not create pages for commit SHAs, dates, or internal paths
- **Do not modify source files:** This prompt only writes to Linear and Notion
