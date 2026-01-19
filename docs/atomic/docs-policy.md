# Documentation Policy

**Goal:** Standardize doc naming, location, and lifecycle across all agents.

## Locations

- **Canonical, current docs:** `docs/atomic/`
- **Active project work / queues:** `docs/development/`
- **Historical or superseded docs:** `docs/archive/`

## Naming Conventions

- Use **kebab-case** filenames.
- Add date suffix only when needed: `topic_YYYY-MM-DD.md`
- No spaces, no camelCase in filenames.

## Required Header

Every new doc must start with:

```
Title
Last Updated: YYYY-MM-DD
Owner: <agent or owner>
Scope: <area>
```

## Lifecycle Rules

- If a new doc supersedes an older one, **move the old doc to** `docs/archive/`.
- Avoid creating duplicate “status” or “summary” docs; update the canonical doc instead.

## Agent Guidance

- Claude Desktop, Antigravity, Gemini, or any agent must follow this policy.
- If unsure where a doc belongs, default to `docs/development/` and link from `docs/atomic/README.md`.

