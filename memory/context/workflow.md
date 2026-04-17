# Workflow Context

## Task Management
- `TASKS.md` is the low-burden task layer for the Productivity plugin
- Source-of-truth docs live in `docs/project/active/`
- Tasks scoped to route family or coordination phase, not individual files

## Figma-to-Code Rules
- Do NOT begin broad Figma-to-code generation until sync-doc repair + shared shell anchors are done
- Runtime truth decides canonical routes
- Redirect-history pages survive for traceability but must not read as peer surfaces
- Canonical shell = sidebar + page chrome header + content frame with stable node IDs

## Design System Rules
- Dark-only: all backgrounds → `--sys-color-charcoalBackground-base`
- Semantic colours only: `--sys-color-{name}-base` CSS variables
- Zero-Flora Lockdown: no flora or Australian endemic fauna
- No generic shapes: use asymmetric `shape.*` tokens

## Preferences
- Terse, action-first responses. No preamble.
- Code first. No summary after edits.
- PLAN LOCATION: `.claude/plans/`
- REPORT LOCATION: `.claude/reports/`
