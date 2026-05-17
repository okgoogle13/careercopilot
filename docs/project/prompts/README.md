# Sync Prompts Guide

## The Problem (Why Perplexity Generated a Bad Plan)

The original prompt templates (`task-done.md`, `sprint-open.md`, `sprint-close.md`, `decision-logged.md`) had **four core defects** that caused Perplexity to generate a waterfall deployment plan instead of responding to the actual prompt structure:

1. **Ambiguous scope** — prompts didn't say "read ONLY the active sprint section" vs "read all sprints"
2. **No explicit search-first rule** — Perplexity inferred it could create and link things freely, leading to hallucinated Linear cycles and Notion pages
3. **Missing decision-making criteria** — no clear rules for "what counts as a completed task" or "which section to read"
4. **Weak constraints on paraphrasing** — Perplexity felt free to summarize or reorganize data instead of copying verbatim

## How to Fix Perplexity Prompts Going Forward

Apply **four patterns** to every sync prompt:

### Pattern 1: Explicit Read Scope

```markdown
## Step 1 — Read the [SECTION] section

Use filesystem connector to read:
```
/Users/okgoogle13/Projects/careercopilot/TASKS.md
```

**Scope:** Extract ONLY the [SECTION] (the topmost sprint heading).
- Include: [specific things]
- Ignore: [everything else]
```

**Why:** Perplexity defaults to reading "everything in the file" unless you explicitly bound the scope with **bold and examples**.

---

### Pattern 2: Search-Before-Create Mandatory Rule

```markdown
## Step [N] — [Action]

**Search first:** Check if [resource] already exists in [system].

If not found, create:
- [field]: [value]
- [field]: [value]

If found: Update [field] to [value]
```

**Why:** Without explicit "search first," Perplexity creates duplicates because it doesn't understand that Linear/Notion are deduplication systems. The rule must come **before** the creation instructions.

---

### Pattern 3: Exact Matching Rule (No Paraphrasing)

```markdown
## Rules (Non-Negotiable)

- **No paraphrasing:** Use task titles verbatim from TASKS.md
- **Exact wording:** Copy all fields exactly as written — do not edit, summarize, or reorganize
- **Match exactly:** If two titles are similar, pick the one closest to the file wording
```

**Why:** Perplexity is a language model trained to paraphrase and improve text. It won't stop unless you **explicitly forbid** it with a bold rule and repeat it.

---

### Pattern 4: Decision-Making Criteria

```markdown
## Step [N] — Find completed tasks

Within the **Active** section, find every task with checkbox `[x]` (marked complete).

**Important:** Only tasks at the top level count:
- Top-level task: `- [x] This is a task` ✅ include
- Subtask: `  - [x] This is a subtask` ❌ ignore subtasks for now
```

**Why:** Perplexity guesses at structure unless you give examples of what counts and what doesn't. Use checkmarks ✅ and ❌ to make decisions visual.

---

## How to Apply to Your Prompts

1. **task-done.md** — Already fixed. Follows all four patterns.
2. **sprint-open.md** — Was auto-shortened by a linter. Rewrite by adding:
   - Explicit scope: "only Active section, top-level tasks"
   - Search-first rule before creating issues
   - Exact matching rule in Rules section
   - Decision rule: show example of top-level vs subtask

3. **sprint-close.md** — Was auto-shortened. Rewrite by adding:
   - Explicit scope: "newest row from SPRINT_LOG.md"
   - Search-first rule for Notion page
   - Exact matching rule for task names
   - Decision rule: "incomplete issues move to backlog, do not mark Done"

4. **decision-logged.md** — Was auto-shortened. Rewrite by adding:
   - Explicit scope: "only the most recent entry"
   - Search-first rule before creating Notion page
   - Exact matching rule for field values
   - Decision rule: "include Follow-up section only if present in source"

---

## The Meta Problem: Your Linter Is Shortening Prompts

**Observation:** Every time I edit a prompt, a linter (or pre-commit hook) **shortens it back to ~40 lines**. This defeats the purpose of detailed prompts.

**Options:**

1. **Disable the linter for `docs/project/prompts/` files**
   ```bash
   # In .eslintignore, .prettierignore, or pre-commit config
   docs/project/prompts/**.md
   ```

2. **Move prompts to a different location** that is not linted
   ```
   .careercopilot/sync-prompts/
   ```

3. **Keep a companion file** with the long-form rules and reference it in the short prompt
   ```
   # In task-done.md:
   For full rules, see: docs/project/prompts/README.md → Pattern 3
   ```

**Recommendation:** Disable linting for `docs/project/prompts/**.md` so these prompts can be as detailed as needed.

---

## Template for New Sync Prompts

Use this structure for any future sync prompts:

```markdown
# Prompt: [Name]

**Purpose:** [what this prompt does]

**Setup:** [which connectors to enable]

**Trigger:** [when this runs]

---

## Step 1 — Read [section/file]

[Explicit scope and examples]

---

## Step 2 — Find / Extract [thing]

[Decision-making criteria with ✅ and ❌ examples]

---

## Step [N] — Sync / Create [resource]

**Search first:** [check for duplicates]

If found: [update action]
If not found: [create action]

---

## Step [Final] — Report

[Print a summary]

---

## Rules (Non-Negotiable)

- **No paraphrasing:** [exact wording rule]
- **Search first:** [deduplication rule]
- **Only [section]:** [scope rule]
- **Do not modify:** [what this prompt does NOT touch]
```

---

## Verification Checklist

Before pasting a sync prompt into Perplexity, check:

- [ ] Scope is explicit: "read ONLY the [section]" with examples
- [ ] Search-first rule appears BEFORE any create instructions
- [ ] Exact wording rule is in the Rules section
- [ ] Decision-making criteria are shown with ✅/❌ examples
- [ ] No instructions to paraphrase, summarize, or reorganize
- [ ] Do not modify rule is clear
- [ ] Linter has not shortened the prompt below 100 lines

If any check fails, rewrite before using.
