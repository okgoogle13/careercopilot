# Supercharged Claude Code Session Guide

> **Purpose**: Drop-in reference for starting any high-leverage Claude Code session on CareerCopilot.
> Tells Claude how to invoke the right skills, chain the right MCPs, use the task infrastructure, and report status — without you having to re-explain it every time.

---

## Model Ladder (from `CLAUDE.md`)

| Phase | Model | Flag |
|---|---|---|
| Audit · Architecture · Planning | `claude-opus-4-5` | `--permission-mode readonly` |
| Implementation · Multi-file edits | `claude-sonnet-4-5` | Default |
| Mechanical cleanup · Token sweeps | `claude-haiku-4-5` | Fast + cheap |

**Rule**: New session per phase. Don't let the planning session drift into write mode.

---

## Canonical Task Infrastructure

| Surface | File | Rule |
|---|---|---|
| Task queue | `TASKS.md` | Single source of truth. No shadow trackers. |
| Status view | `dashboard.html` | Open locally. Reads/writes `TASKS.md`. |
| Sprint brief | `SPRINT_BRIEF.md` | Current scope + handoff rules. |
| Decision log | `DECISIONS.md` | One entry per architectural call. |
| Plans | `docs/project/active/plans/` | All implementation plans saved here. |
| Reports | `docs/project/active/handovers/` | All session handover and output reports saved here. |

---

## Skill Chain (from `SPRINT_BRIEF.md`)

Run skills in this order. Do not collapse stages.

```
design-orchestration
    ↓
brainstorming
    ↓ (if ambiguity remains)
sequential-thinking
    ↓
sprint-coordinator
    ↓
writing-plans
    ↓
implementation
    ↓
validation + closeout
```

**Hard rule**: `writing-plans` only runs after design and route targeting are approved. It does not resolve uncertainty — brainstorming and sequential-thinking do.

---

## MCP Routing (quick reference)

| Situation | Tool |
|---|---|
| Hidden slop · token sweep across many files | `flash-sidekick.batch_file_analysis` |
| One large file needs orientation | `flash-sidekick.quick_summarize` |
| Component structure + symbol extraction | `flash-sidekick.generate_idf` |
| Repo implementation richer than Figma | `flash-sidekick.consult_pro` |
| Minimal diff not practical | `flash-sidekick.suggest_refactoring` |
| Route ownership ambiguous | `sequential-thinking` |
| Figma design extraction | `figma-mcp.get_design_context` |
| Compliance score for modified canonical views | `design-system-sidekick.validate_asset_compliance` |

---

## Session Startup Checklist

Before starting any implementation session:

- [ ] `TASKS.md` reflects current active items
- [ ] `dashboard.html` opened locally - status is current
- [ ] `SPRINT_BRIEF.md` read - scope and handoff rules confirmed
- [ ] Model chosen and launch command confirmed (see above)
- [ ] Permission mode set appropriately (readonly for planning)

---

## The Drop-in Prompt

See `SUPERCHARGED_SESSION_PROMPT.md` in this folder for the paste-ready version.
