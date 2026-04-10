# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other agentic assistants when working with this repository.

> **Output**: Code first. No preamble.

<output_constraints>
- NO PREAMBLE: Skip all introductory phrases, conversational fillers, and verbose status updates. Lead with direct action verbs.
- NO UNNECESSARY REPORTS: Status updates must be kept strictly under 2 sentences. Only generate markdown reports if explicitly requested.
- TOKEN GUARDIAN ACTIVE: Adhere to `.claude/TOKEN_GUARDIAN.md`. Track usage and mandate sidekick routing if session usage exceeds 80%.
- PLAN LOCATION: **ALWAYS** save implementation plans to `.claude/plans/`.
- REPORT LOCATION: Save reports and documentation to `.claude/reports/`.
</output_constraints>

---

## Technical Stack

- **Frontend**: React 18 + TS + Vite + Tailwind v4 + Zustand + TanStack Query
- **Backend**: FastAPI + SQLAlchemy + Genkit + Python 3.10+
- **Cloud**: GCP (us-central1) · Firebase · Cloud Run
- **Design**: **KR Solidarity v6.1** (M3 Expressive)
- **Tests**: Jest, Playwright (e2e), pytest
- **IDE**: Antigravity IDE (antigravity.google) — VS Code-compatible; default for all edits.

---

## Active Initiative: Frontend Source-of-Truth Migration

**Current Phase**: M1 (Planning Gates)
**Control Plan**: `docs/project/active/frontend-source-of-truth-migration/`

### Critical M1 Gates (In Progress)
- [ ] MIG-001: Fix capability matrix (`resolution_status`, `blocked_by`, `resolved_commit`)
- [ ] MIG-002: Align `validate-governance-artifacts.mjs` with Python tests
- [ ] MIG-003: Approve 5 migration skills (sprint-coordinator, frontend-backend-mapper, api-contract-validator, migration-audit, verification-before-completion)
- [ ] MIG-004: Ad-hoc component-inventory review
- [ ] MIG-005: Define token-enforcement gate (regex scan hardcoded colors)

---

## Branch Override Context: feat/prototype-harvest-prep

**Current focus**: Harvesting AI Studio prototype logic into `frontend/src/prototype-features/`.

### Quarantine Rules (STRICT ENFORCEMENT)
| Rule | Detail |
|---|---|
| Quarantine boundary | All logic confined to `frontend/src/prototype-features/` only. |
| Protected paths | **DO NOT TOUCH** `src/features/`, `src/components/ui/`, or `src/api/`. |
| UI imports | Must resolve to `@/components/PrototypeAdapter` — **never** `@/components/ui`. |
| Lint suppression | `/* eslint-disable */` at top of every harvested `.ts` / `.tsx` file. |
| Routes | All prototype routes under `/prototype/*` with `prototype: true`. |

---

## Task Delegation & Token Efficiency ⚡

**RULE: Default to lean local execution plus targeted MCP offload. Use `task-router` for orchestration sesssions.**

- **Efficiency Mandates**:
  - **MCP-First**: Never read files > 300 lines or search directly. Use `flash-sidekick.quick_summarize`.
  - **Distill Pipeline**: CRITICAL: Pipe every non-interactive shell command through `distill` unless raw output is explicitly required.
  - **Thinking Bursts**: Use Thinking Mode ONLY for architecture (Phase 4) and identity gates.
  - **Persistent Session Status**: End every session with a `status.md` update.
- **Delegate Heavy Tasks (>15K tokens)**:
  - Scaffolding, test generation (>50 lines), security/coverage analysis, refactoring.
  - Route to `flash-sidekick` first, then escalate to `task-router` for multi-worker handoffs.
- **Keep Local**:
  - Code review, architectural decisions, git operations, critical integration fixes.

---

### Token Preservation Strategy (3-Layer Defense)

**Layer 1: Written Rules (Self-Enforced by Claude)**

- Always ask `flash-sidekick.quick_summarize` before reading files > 300 lines
- Never sequential grep + read workflows — batch with `batch_file_analysis` instead
- Route all visual/screenshot analysis to `design-system-sidekick` (never read as text)
- When token usage approaches 60% of session budget, warn before each expensive operation
- Mandatory sidekick routing when usage ≥ 80% (see TOKEN_GUARDIAN.md)

## Distill Rule (ENFORCED)
CRITICAL: Pipe every non-interactive shell command through `distill` unless raw output is explicitly required.
Examples:
- `pytest output`     → `| distill "Did tests pass? Return PASS/FAIL + failing test names only."`
- `tsc --noEmit`      → `| distill "TypeScript errors? Return PASS/FAIL + file:line:error only."`
- `yarn lint` / `ruff`  → `| distill "Lint errors? Return PASS/FAIL + file:line:rule only."`
- `yarn build`        → `| distill "Build succeeded? Return PASS/FAIL + errors only."`
- `git diff`          → `| distill "What changed? Return file path + one-line summary per file."`
This single rule applied consistently eliminates ~95% of token cost from command output in every Claude Code session on this repo.

**Layer 2: MCP Budget Check (Call Before Expansion)**

- `flash-sidekick` includes `check_token_budget` tool (to be implemented):
  - Input: current token usage %, operation type, estimated cost
  - Output: safe-to-proceed (bool), recommended routing (sidekick vs direct)
  - Call this before large file reads, multi-file analysis, or document generation

**Layer 3: max_tokens API Parameter (Programmatic Limits)**

- Remote calls and agent invocations set `max_tokens=<budget>` to enforce hard ceiling
- Prevents single operation from consuming entire session budget
- Example: `Agent(description, prompt, max_tokens=40000)` caps completion to 40K tokens max

## Claude Model Ladder

- Use **Haiku** for:
  - Inventory, classification, presence checks, PM/status reshaping.
- Use **Sonnet** for:
  - Most implementation work (multi-file token fixes, script edits, per-screen parity updates, validation scripts).
- Use **Opus** only for:
  - Architectural decisions, route-promotion decisions, and final go/no-go review.

## MCP Health Check — flash-sidekick and vision-scorer-mcp

Goal: Confirm that `flash-sidekick` and `vision-scorer-mcp` are available, behaving correctly, and actually saving Claude tokens.

### Step 1 — Server Presence and Status
- Run: `claude mcp list`
- Expect an entry for `flash-sidekick` and `vision-scorer-mcp` with status ✓ or `Connected`.

### Step 2 — flash-sidekick Functional Test (Text-Only)
- Run `flash-sidekick.quick_summarize`. Validate the output is succinct.

### Step 3 — flash-sidekick Batch Test (Context Savings)
- Run `flash-sidekick.batch_file_analysis` on 5–10 representative files and inspect JSON size.

### Step 4 — vision-scorer-mcp Functional Test (Scoped Vision)
- Pick a single, known-good Figma frame and invoke `/vision-scorer-mcp` to get KR Solidarity score.

### Step 5 — Token-Saving Behaviour Check
- Compare tokens used per turn with and without MCP assistance.

---

## Workspace Structure & Quick Commands

- **Frontend**: `cd frontend` -> `yarn dev`, `yarn test`, `yarn build`.
  - UI Primitives: `src/components/ui/`
  - Design Tokens: `src/design/tokens/tokens.json` (**Source of Truth**)
- **Backend**: `cd backend && source venv/bin/activate` -> `uvicorn app.main:app --reload --port 8000`, `pytest`.
- **Rebuild Tokens**: `python3 scripts/build-m3-tokens.py` (rebuilds CSS variables from `tokens.json`).

---

## Design System: KR Solidarity v6.1 (M3 Expressive)

**Strict Rules**:
- **Zero-Flora Lockdown**: Absolutely **NO** flora or Australian endemic fauna.
- **Dark-only**: No white backgrounds. All backgrounds use `--sys-color-charcoalBackground-base`.
- **No generic shapes**: Use asymmetric `shape.*` tokens (e.g., `shape.blockRiot03`).
- **Semantic Colors Only**: Use `--sys-color-{name}-base` CSS variables.
- **Extreme Contrast**: Variable fonts (`Work Sans`, `Fraunces`, `Libre Bodoni`, `JetBrains Mono`) with 9x weight ratios.

### Active v6.1 Archetypes
| Archetype | Component | Shape Token | Role |
| --- | --- | --- | --- |
| **Strike** | `Strike.tsx` | `shape.blockRiot03` | Primary active buttons. |
| **Placard** | `Placard.tsx` | `shape.placardTorn01` | Content containers/feeds. |
| **Scaffold** | `ScaffoldInput.tsx` | `shape.blockRiot02` | Immutable structural framing. |
| **March** | `March.tsx` | `shape.blockRiot01` | Sequential select flows. |
| **Megaphone** | `Megaphone.tsx` | `shape.megaphoneCut01` | High-intensity modals/focus parts. |

---

## Hooks
**Status**: Not yet configured. Known gap for future automation:
- `PreToolUse(Read)` → route to `flash-sidekick` if file >300 lines
- `PostToolUse(Edit)` → run `ruff` for `.py`, `tsc --noEmit` for `.ts`
- Configure via `.claude/settings.local.json` when ready.

---

## Code Review Standards
- Functions > 30 lines: Likely doing too much.
- Logic duplicated > 2×: Extract to utility.
- No `any` type in TypeScript: Use strict types.
- Missing error handling: Async operations must have catch/error handling.
- Grouping props: Components with > 3 props should group them into an object if logical.

Run `/simplify` before presenting code results.

---
*Tokens are law. Semantic CSS variables are truth. Zero-Flora enforced.*
