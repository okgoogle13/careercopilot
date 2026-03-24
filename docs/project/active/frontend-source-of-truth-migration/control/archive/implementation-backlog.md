# Frontend Source-Of-Truth Migration Implementation Backlog

**Date:** 2026-03-24
**Status:** Prototype-first sequence sync refreshed after AI Studio prompt-order update
**Canonical planning inputs:**
- `docs/project/active/frontend-source-of-truth-migration/control/blueprint.md`
- `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
- `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md` (Consolidated AI Strategy)

## Objective

Convert the migration plan into a feature-first, component-aware backlog that can be implemented without re-deciding route ownership, component ownership, or backend capability mapping.

## Recommended Task Assignment

| Priority | Action | Backlog anchor | Recommended agent |
| --- | --- | --- | --- |
| `P0` | Complete prototype-wide AI Studio batch pass (`B1-B19`) before harvest | `COMET` | `Google AI Studio` |
| `P0` | Preserve `MIG-202` as the `/profile` voice-ownership lock during later prototype batches | `MIG-202` | `Google AI Studio` |
| `P0` | Finalize /tracker verification (Firebase blocked) after prototype harvest | `MIG-101`, `MIG-102` | `Claude` |
| `P0` | Finalize /profile verification (Firebase/auth blocked) after prototype harvest | `MIG-202` | `Claude` |
| `P0` | Resolve Firebase Environment (FIREBASE_PROJECT_ID) | `ENV-001` | `Human` |
| `P1` | Maintain Phase 3 Build Contracts & Gap Plans | `MIG-007`, `MIG-008` | `Claude` |
| `P2` | Execute bounded route cleanup post-verification | `MIG-402`, `MIG-404` | `Codex` |

## Current Review Snapshot

- **Current phase:** Prototype-first AI Studio completion, then canonical harvest and verification
- **Overall Progress:** ~97%
- **Critical Blocker:** Firebase/auth environment for `/tracker` and `/profile`
- **Recently Completed:** Governed build-contract coverage and canonical gap-fill regeneration
- **Sequence lock:** Finish the selected prototype-wide AI Studio pass before starting any new harvest work

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
| MIG-007 | Generate route-level wireframe build contracts | `completed` |
| MIG-008 | Derive tokens-first gap-fill plans | `completed` |

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

**Status:** Implemented / Verification Blocked
**Acceptance:**
- `/documents` owns redline workflow.
- `/profile` owns voice profile workflow.

| ID | Title | Status |
| --- | --- | --- |
| MIG-201 | Add redline workflow ownership to /documents | `completed` |
| MIG-202 | Add voice profile management to /profile | `completed_deferred_verif` |

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
| MIG-602 | Submitted Docs & KSC Implementation | `completed` |
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

1. **COMET B1-B4:** Complete shell and discovery foundations across the prototype
2. **COMET B5-B13:** Complete jobs, ATS, Submitted Docs, and voice CTA surfaces
3. **MIG-202 lock:** Reconfirm `/profile` voice ownership before any later settings-oriented batch work
4. **COMET B14-B19:** Complete extended prototype features, keeping `B18` utility-only and secondary to `/profile`
5. **Prototype-wide alignment sweep:** Normalize naming, ownership, tone, and harvest readiness across the prototype
6. **Canonical harvest:** Harvest the aligned prototype output into the runtime repo
7. **ENV-001 + verification:** Resolve environment and capture live verification for `/tracker` and `/profile`
8. **MIG-402 / MIG-404:** Execute final bounded structural sanitization
9. **MIG-403:** Re-run token/dependency integrity after cleanup

## Readiness Score

- **Formula:** `(completed_milestones / 6) * 80 + blocker_bonus`
- **Current Stats:** 5 complete, 1 in progress.
- **Score:** ~86/100 (Yellow Band)
- **Note:** Blocker bonus (20) withheld due to Firebase/Firestore environment issues.

## Known Blockers

- **Firebase/Firestore Environment:** `FIREBASE_PROJECT_ID` missing; blocks `/tracker` and `/profile` live verification.
- **Prototype-first sequence discipline:** Harvest must not begin before the prototype-wide AI Studio pass and alignment sweep are complete.
- **Verification Pipeline:** Final closeout for `/tracker` and `/profile` is deferred until environment is stable.
- **Structural Cleanup:** Must stay bounded to route-family alignment to avoid high-churn refactor.
