# Remaining Route Plan
**Date:** 2026-03-24
**Phase:** Migration closeout
**Execution truth:** `control/blueprint.md`

---

## 1. Remaining Open Routes

| Route | Status | Blocker | Owner | Next Action |
|-------|--------|---------|-------|-------------|
| `/tracker` | `COMPLETE_DEFERRED_VERIF` | Firebase/Firestore env | `ApplicationTracker` | Restore env, verify authenticated `GET /api/applications/`, confirm populated Kanban runtime, capture evidence |
| `/profile` | `COMPLETE_DEFERRED_VERIF` | Firebase/auth env | `ProfileView` | Restore env, verify authenticated `GET/POST /api/v1/auth/voice-profile`, confirm `/profile` remains the visible owner |
| `/welcome` | `PLANNED` | merge-surface planning only | `WelcomeScreen` | Keep as a planned merge surface; do not expand migration scope during closeout |
| `/asset-library` | `SUPPORT_ONLY` | intentional non-canonical holdout | support analysis surface | Keep support-only; do not treat as a competing product owner |

## 2. Recently Closed or Reclassified

| Route / Surface | Status | Evidence |
|-----------------|--------|----------|
| `/documents` | `COMPLETE` | Redline workspace is implemented and route-owned; see `contracts/build-contract-documents.xml` |
| `/opportunities` | `COMPLETE` | Route-specific identity gate and canonical gap-fill plan are checked in |
| `/profile` planning layer | `COMPLETE` | `contracts/build-contract-profile.xml` added; route ownership no longer depends on `/settings` contract inference |

## 3. Build-Contract and Gap-Fill Coverage

### Governed build contracts

- 13/13 governed build contracts now validate against `docs/schema/build_contract.xsd`.
- New coverage added for `/profile`:
  - `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-profile.xml`

### Canonical gap-fill outputs

- `tmp/migration/tracker-gap-fill-plan.json`
- `tmp/migration/opportunities-gap-fill-plan.json`
- `tmp/migration/analysis-gap-fill-plan.json`
- `tmp/migration/dashboard-gap-fill-plan.json`
- `tmp/migration/root-gap-fill-plan.json`
- `tmp/migration/profile-gap-fill-plan.json`

### Current wireframe-validator state

- Command:

```bash
python3 scripts/validate-wireframe-workflow.py --json-out tmp/migration/wireframe-workflow-report.json
```

- Current result:
  - status: `fail`
  - schema failures: `0`
  - build-contract XSD failures: `0`
  - remaining issue class: warning burn-down (`79` warnings)

Interpretation: build-contract and planner governance are complete enough for closeout; warning cleanup remains a separate documentation-quality task.

## 4. Shared Primitive / Cleanup Notes

| Primitive | Status | Notes |
|-----------|--------|-------|
| `Logo` | `CANONICAL` | Already mounted in `Sidebar` |
| `Sidebar` | `TOKEN_COMPLIANT` | Permanent nav labels locked |
| `Footer` | `CANONICAL` | Already adopted by `MigratedRouteLayout` |
| `AuthGuard` | `DEFERRED_FIX` | `App.tsx:72` still uses `bg-[#1A1714]`; keep as bounded cleanup |
| `KrDarkDock` | `CANONICAL` | Authoritative nav shell component |

## 5. Environment Verification Packet

> **Critical blocker**: do not mark the program fully complete until both `/tracker` and `/profile` have fresh env-backed verification evidence.

### Required local backend config

```bash
FIREBASE_PROJECT_ID=careercopilot-468811
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

### Verification sequence

1. Start backend with the restored Firebase/auth environment.
2. Verify `/tracker`:
   - authenticated `GET /api/applications/`
   - runtime `/tracker` loads real data
3. Verify `/profile`:
   - authenticated `GET /api/v1/auth/voice-profile`
   - authenticated `POST /api/v1/auth/voice-profile`
   - runtime `/profile` remains the only visible voice-profile owner
4. Re-run route-focused tests and token-enforcement for touched surfaces.
5. Update `control/status.md` with the evidence or keep both routes blocked if the env still fails.

## 6. Next Agent Instructions

### Task A: `/tracker` closeout

- Requires Firebase/Firestore env and authenticated backend access
- Output evidence:
  - successful authenticated API response
  - runtime proof of real data on `/tracker`
  - status artifact update

### Task B: `/profile` closeout

- Requires the same Firebase/auth env
- Output evidence:
  - successful authenticated `GET/POST /api/v1/auth/voice-profile`
  - runtime proof that `/profile` owns the voice workflow
  - status artifact update

### Task C: bounded cleanup only

- Keep cleanup limited to:
  - `AuthGuard` semantic token fix
  - explicit reference-only labeling where needed
  - no repo-wide frontend restructure
