# Frontend Source-Of-Truth Migration Implementation Backlog

**Date:** 2026-03-22
**Status:** Syncing with Phase 6 Completion
**Canonical planning inputs:**
- `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
- `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md` (Consolidated AI Strategy)

## Objective

Convert the migration plan into a feature-first, component-aware backlog that can be implemented without re-deciding route ownership, component ownership, or backend capability mapping.

## Recommended Task Assignment

| Priority | Action | Backlog anchor | Recommended agent |
| --- | --- | --- | --- |
| `P0` | Finalize /tracker verification (Firebase blocked) | `MIG-101`, `MIG-102` | `Claude` |
| `P0` | Resolve Firebase Environment (FIREBASE_PROJECT_ID) | `ENV-001` | `Human` |
| `P1` | Complete Phase 3 Build Contracts | `MIG-007`, `MIG-008` | `Claude` |
| `P2` | Execute Route Cleanup post-Step 6 | `MIG-402`, `MIG-404` | `Codex` |

## Current Review Snapshot

- **Current phase:** Phase 3/4 Execution and Phase 6 Cleanup
- **Overall Progress:** ~95%
- **Critical Blocker:** Firebase Environment (Step 3a/3c)
- **Recently Completed:** Step 6 (Route Cleanup & Feature Migration)

## Milestones

### M1: Phase 1 and Phase 1A - Planning Inputs and Migration Support Review

**Status:** Completed
**Acceptance:**
- Governance inputs are trustworthy and guiding implementation.
- Wireframe workflow is deterministic.

| ID | Title | Status |
| --- | --- | --- |
| MIG-001 | Fix capability matrix completeness | `completed` |
| MIG-002 | Align governance validator with tests | `completed` |
| MIG-003 | Review migration skills for fit-for-purpose | `completed` |
| MIG-004 | Review migration scripts for fit-for-purpose | `completed` |
| MIG-005 | Define token-enforcement gate for touched routes | `completed` |
| MIG-006 | Document and validate the wireframe workflow | `completed` |
| MIG-007 | Generate route-level wireframe build contracts | `in_progress` |
| MIG-008 | Derive tokens-first gap-fill plans | `in_progress` |

### M2: Phase 2.1 and Phase 2.2 - Applications and Smart Ingestion

**Status:** Completed (Execution) / Verification Blocked
**Acceptance:**
- `/tracker` uses real CRUD-backed behavior.
- `/career/ingest` owns one canonical upload-to-save flow.

| ID | Title | Status |
| --- | --- | --- |
| MIG-101 | Replace mock-backed applications flow in /tracker | `completed_deferred_verif` |
| MIG-102 | Add application detail, edit, and status flows | `completed_deferred_verif` |
| MIG-103 | Converge ingestion on /api/v1/ingest | `completed` |
| MIG-104 | Build the routed smart-ingestion flow | `completed` |

### M3: Phase 2.3 and Phase 2.4 - Voice Profile and Documents Redline

**Status:** Partially Unblocked
**Acceptance:**
- `/documents` owns redline workflow.
- `/profile` owns voice profile workflow.

| ID | Title | Status |
| --- | --- | --- |
| MIG-201 | Add redline workflow ownership to /documents | `completed` |
| MIG-202 | Add voice profile management to /profile | `in_progress` |

### M4: Phase 2.5 and Phase 3 Support - Resume Audit, Jobs, and Explicit Deferrals

**Status:** Partially Completed
**Acceptance:**
- `/analysis` supports minimum viable resume audit flow.
- Jobs family has a clear place for job analysis results.

| ID | Title | Status |
| --- | --- | --- |
| MIG-301 | Decide and wire the minimum viable resume audit flow | `completed` |
| MIG-302 | Add the canonical job analysis results surface | `completed` |
| MIG-303 | Keep workflow orchestration explicitly deferred | `completed` |

### M5: Phase 3 and Phase 4 - Route and Component-Library Cleanup

**Status:** Partially Completed
**Acceptance:**
- `/kr/*` routes are no longer part of product truth.
- Reference-only components are clearly distinguished.

| ID | Title | Status |
| --- | --- | --- |
| MIG-401 | Retire prototype /kr/* routes from live product routing | `completed` |
| MIG-402A| Add route preflight inventory checks | `completed` |
| MIG-402 | Mark reference-only components and cleanup candidates | `planned` |
| MIG-403 | Verify token and dependency integrity after route cleanup | `planned` |
| MIG-404 | Sanitize frontend structure after route-family migration | `planned` |

### M6: Phase 6 - Legacy Routes and Orphaned Screens

**Status:** Completed
**Acceptance:**
- 0 unrouted screens in orphans.json.
- 0 non-feature routes remaining.
- Legacy routes moved to features/.

| ID | Title | Status |
| --- | --- | --- |
| MIG-601 | Opportunities & Job Queue Migration | `completed` |
| MIG-602 | Workbench & KSC Implementation | `completed` |
| MIG-603 | Finalization & Cover Letter Implementation | `completed` |
| MIG-604 | Settings Integration | `completed` |
| MIG-605 | Analysis & Apply Quick Refactor | `completed` |
| MIG-607 | Retire Prototypes and Test Tokens | `completed` |

## Dependency Map

- `M1 -> M2`
- `M1 -> M3`
- `M1 -> M4`
- `M2 + M3 + M4 -> M5`
- `M5 -> M6`

## Suggested Implementation Order

1. **ENV-001:** Resolve Firebase Environment Variables (**URGENT**)
2. **MIG-007 / MIG-008:** Finalize Build Contracts & Gap Plans
3. **MIG-202:** Complete Voice Profile UI
4. **MIG-402 / MIG-404:** Execute Final Structural Sanitization

## Readiness Score

- **Formula:** `(completed_milestones / 6) * 80 + blocker_bonus`
- **Current Stats:** 4 complete, 2 in progress.
- **Score:** ~73/100 (Yellow Band)
- **Note:** Blocker bonus (20) withheld due to Firebase/Firestore environment issues.

## Known Blockers

- **Firebase/Firestore Environment:** `FIREBASE_PROJECT_ID` missing; blocks `/tracker` (3a) and `/profile` (3c).
- **Validation Pipeline:** Completion check for Step 3 is deferred until environment is stable.
- **Structural Cleanup:** Must stay bounded to route-family alignment to avoid high-churn refactor.
