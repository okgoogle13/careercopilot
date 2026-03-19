# AI Studio Prototype Harvest — Execution Blueprint

**Version:** 1.0
**Date:** 2026-03-18
**Source of Truth:** `AI_STUDIO_HARVEST_PLAN.updated.md` (Revision 3.0)
**Strategy:** Prototype-First Lens — edit upstream in AI Studio while cheap, then harvest clean code

---

## Objective

Extract tokenized UI components and Python-aligned backend artefacts from the AI Studio prototype at `/Users/okgoogle13/Projects/prototype_v2.0` into the main CareerCopilot repo. No monoliths. No hard-coded tokens. No transcription errors.

---

## Authority Order

1. **Source of Truth**: `AI_STUDIO_HARVEST_PLAN.updated.md`
2. **Execution**: This blueprint (`control/blueprint.md`)
3. **Progress**: `control/status.md` (observability only — never overrides blueprint)
4. **Prototype Path**: `/Users/okgoogle13/Projects/prototype_v2.0` (support/reference input; the deleted Downloads checkout is no longer valid)

---

## Dependency Graph

```
Phase 0 (COMPLETE)
├── PT-2: ingestion_prompts.md snake_case ──────────► Track A (Backend Py)
├── PT-3: ATSScoreCard.tsx re-skin ─────────────────► Track B (UI Components)
├── PT-4: AuditDisplay.tsx re-skin ──────────────────► Track B (UI Components)
└── PT-5: ValidationDashboard decomposition JSON ───► Track C (Data Wiring)

Track A ─────────────────────────────────────────────┐
                                                      ▼
Track B ─────────────────────────────────────────► Track C (BLOCKED until both complete)
```

**Parallel-safe**: Track A and Track B can execute concurrently.
**Sequential gate**: Track C cannot start until Track A AND Track B are COMPLETE.

---

## Phase 0 — Pre-Completed ✅

AI Studio prompts run against `/Users/okgoogle13/Projects/prototype_v2.0` before main tracks begin.

| Prompt | Component | Outcome |
|---|---|---|
| PT-2 | `ingestion_prompts.md` | snake_case field names aligned for Pydantic |
| PT-3 | `ATSScoreCard.tsx` | KR Solidarity tokens applied; import paths cleaned |
| PT-4 | `AuditDisplay.tsx` | KR Solidarity tokens applied; import paths cleaned |
| PT-5 Step A | `ValidationDashboard.tsx` | Sub-component decomposition JSON proposed |
| PT-5 Steps B+C | Sub-components + `index.ts` | Generated in AI Studio, ready for harvest |

---

## Track A — Backend Python Alignment

**Owner**: sprint-coordinator → pydantic-model-scaffolder
**Gate-in**: Phase 0 confirmed complete
**Gate-out**: pytest green; all 5 fields snake_case in backend

### Tasks

| ID | Task | Gate |
|---|---|---|
| A-001 | Verify PT-2 output in `/Users/okgoogle13/Projects/prototype_v2.0` — line 1 comment + 5 snake_case field names | comment present + all names confirmed |
| A-002 | `grep` backend/app for PascalCase variants → produce divergence map | map produced |
| A-003 | Patch divergent Pydantic model fields | zero PascalCase variants remain |
| A-004 | `cd backend && pytest app/tests/ -q` | exit 0, all green |

**Impact on migration blueprint**: Eliminates transcription errors during Sprint 2 API wiring. Task B3 (types) deleted — replaced with 5-minute direct copy.

---

## Track B — UI Component Harvest + KR Compliance

**Owner**: sprint-coordinator
**Mandatory skills** (non-negotiable):
- `before-and-after` — visual diff proving token swap did not break layout
- `web-design-guidelines` — semantic accessibility audit
- `design-orchestration` (Step 5 Readiness Check) — triggers `visual-design-director` + `migration-audit`

**Gate-in**: Phase 0 confirmed complete
**Gate-out**: token-enforcement PASS + design critique ≥90/100 + migration-audit PASS

### Tasks

| ID | Task | Gate |
|---|---|---|
| B-001 | Copy PT-3 output → `frontend/src/features/analysis/components/ATSScoreCard.tsx` | file at canonical path, no import errors |
| B-002 | Copy PT-4 output → `frontend/src/features/analysis/components/AuditDisplay.tsx` | file at canonical path, no import errors |
| B-003 | Run `token-enforcement` on both files | zero hex colors; zero raw Tailwind colour utilities |
| B-004 | **`before-and-after` skill** — visual diff on /analysis route | layout regression absent |
| B-005 | **`web-design-guidelines` skill** — accessibility audit | no HIGH severity issues |
| B-006 | **`design-orchestration` Step 5** — visual-design-director + migration-audit | ≥90/100; zero ZERO-FLORA violations; migration-audit PASS |

---

## Track C — ValidationDashboard Decomposition + API Wiring

**Owner**: sprint-coordinator
**Mandatory skills** (non-negotiable):
- `vercel-composition-patterns` — compound component architecture; KR Solidarity token override enforced
- `vercel-react-best-practices` — React 18 performance + TypeScript quality

**Gate-in**: Track A COMPLETE AND Track B COMPLETE
**Gate-out**: monolith decomposed + APIs wired + composition audit PASS

### Tasks

| ID | Task | Gate |
|---|---|---|
| C-001 | Confirm PT-5 Step A JSON from AI Studio (≤4 sub-components, each ≤200 lines, no direct service calls) | JSON valid + constraints satisfied |
| C-002 | Harvest sub-components (PT-5 Step B) → canonical paths; apply `vercel-composition-patterns` per file | each file ≤200 lines; typed props interface; no `any` |
| C-003 | Harvest `components/index.ts` (PT-5 Step C) | all sub-components named-exported |
| C-004 | Wire `onRequestAI` stubs → `analysisService` / `workflowService` (snake_case fields from Track A) | no stubs remain |
| C-005 | Wire `onSaveProfile` stubs → `profileService.update()` | no stubs remain |
| C-006 | **`vercel-react-best-practices` audit** on all Track C files | no HIGH violations |
| C-007 | `token-enforcement` on all Track C files | PASS |

### Composition Architecture Constraints (from vercel-composition-patterns CAREER COPILOT OVERRIDE)

Any compound component or context provider introduced in Track C must:
- Use `--sys-*` CSS variable tokens for all styling
- NOT introduce generic styling approaches that bypass the token system
- NOT use prop-based style overrides for anything covered by a semantic token

---

## Success Metrics

| Metric | Target |
|---|---|
| Ingestion prompt field names | 100% snake_case in backend |
| Hard-coded hex colors / raw Tailwind colour utilities | 0 in all harvested files |
| token-enforcement gate | PASS on all files |
| Design critique score | ≥90/100 |
| ZERO-FLORA violations | 0 |
| ValidationDashboard sub-component count | ≤4 |
| Max sub-component line count | ≤200 |
| Direct geminiService / Firebase calls in sub-components | 0 |
| vercel-react-best-practices HIGH violations | 0 |
| pytest regressions | 0 |

---

## UX Pattern Backlog (Advisory Only — No Track Dependency)

1. **Workspace-First Entry**: `/analysis` as primary post-login landing for power users (evaluate separately)
2. **Simplified Navigation**: Prototype's 4-tab model → evaluate sidebar consolidation
