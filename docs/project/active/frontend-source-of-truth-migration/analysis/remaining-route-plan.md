# Remaining Route Plan
**Date:** 2026-03-17
**Phase:** M1 Final Closeout
**Execution truth:** `control/blueprint.md`

---

## 1. Route List and Gap Summary

### Remaining Open Routes

| Route | Status | Blocker | Owner | Next Action |
|-------|--------|---------|-------|-------------|
| `/tracker` | `IN_PROGRESS` | Firebase/Firestore env | Step 3a | Restore env; verify `GET /api/applications/`; capture Kanban screenshot ≥90 |
| `/documents` | `WAITING` | Step 3d not started | Step 3d | Locate redline endpoints; build workspace panel; run gates |
| `/welcome` | `DEFERRED` | No gate record | — | Determine if canonical or retire candidate |
| `/asset-library` | `DEFERRED` | Support-route ownership still ambiguous | Analysis / Ingestion support | Keep as support-only; remove orphan/parallel-tree ambiguity during Step 5 cleanup |

### Recently Closed Route

| Route | Status | Evidence |
|-------|--------|----------|
| `/opportunities` | `COMPLETE` | Archetype cleanup applied, gap-fill rerun is clean, route-specific identity gate added, route matrix aligned |

### Routes Now on `MigratedRouteLayout` (Shell Promoted 2026-03-17)

| Route | Previous Shell | Gate Evidence |
|-------|---------------|---------------|
| `/onboarding` | ProtectedLayout | 6B: token-enforcement pass, migration-audit pass |
| `/ksc-generator` | ProtectedLayout | 6B: token-enforcement pass, migration-audit pass |
| `/cover-letter-generator` | ProtectedLayout | 6B: token-enforcement pass, migration-audit pass |
| `/job-queue` | ProtectedLayout | 6B: token-enforcement pass, migration-audit pass |

**Current layout breakdown (2026-03-17):** public: 4 · migrated: 12 · protected: 3

### Capability blockers still open

| Blocker | Current Truth | Required Closeout |
|---------|---------------|-------------------|
| `workflow_orchestration` | ~~placeholder-only~~ | ✅ RESOLVED 2026-03-17 — `POST /api/workflows/generate-application` + `GET /api/workflows/status/{id}` implemented. |
| `resume_audit` history | ~~history missing~~ | ✅ RESOLVED 2026-03-17 — `GET /api/resume-audit/history` added. |
| `/analysis` vs `/asset-library` | ~~scope drift~~ | ✅ RESOLVED 2026-03-17 — confirmed support-only; no ambiguity in runtime or docs. |
| ingestion convergence | ~~fragmented~~ | ✅ RESOLVED 2026-03-17 — `ResumeUploader.tsx` → `/api/v1/ingest`; artifact upload specialized. |

---

## 2. Shared Primitive & Visual Gate Audit

### Audit Results

| Primitive | Status | Issues | Action Required |
|-----------|--------|--------|-----------------|
| `Logo` | `CANONICAL` | Standalone `Logo.tsx` exists and `Sidebar` already uses it. | No action. |
| `Sidebar` | `TOKEN_COMPLIANT` | Zero-Flora violations removed in prior session. | No action. Monitor for drift. |
| `AuthGuard` | `TOKEN_VIOLATION` | `App.tsx:72` uses hardcoded `bg-[#1A1714]`. Blocked B3. | Replace with `bg-[--sys-color-charcoalBackground-base]` or semantic equiv. |
| `KrDarkDock` | `CANONICAL` | Authoritative nav component. | No action. |
| `Footer` | `CANONICAL_NOT_ADOPTED` | Canonical `Footer.tsx` exists but is not yet mounted in the authoritative shell. | Adopt during the next shared-shell pass; do not silently redefine. |

### Zero-Flora Compliance
- `Sidebar`: ✅ Clean
- `Logo`: ✅ Canonical compass emblem is present

### AuthGuard Token Violation (B3)
**File:** `frontend/src/App.tsx:72`
**Violation:** `bg-[#1A1714]` — hardcoded hex color
**Fix:** Replace with `bg-[var(--sys-color-charcoalBackground-base)]`
**Severity:** Medium — deferred. Does not block M1 closeout.

---

## 3. Identity Gate Evidence

### Completed (2026-03-16)

| Route | Outcome | Artifact |
|-------|---------|----------|
| `/analysis` | `identity_pass` | `analysis/2026-03-16-tsx-identity-gate-analysis.md` |
| `/dashboard` | `identity_pass_with_rewrites` | `analysis/2026-03-16-tsx-identity-gate-dashboard.md` |
| `/` (landing) | `identity_pass` | `analysis/2026-03-16-tsx-identity-gate-root.md` |

### Pending / Deferred

| Route | Blocker |
|-------|---------|
| `/tracker` | BLOCKED on Firebase/Firestore env |
| `/opportunities` | Complete — `identity_pass_with_rewrites` recorded |

---

## 3c. Shell Promotion Record

**Action taken 2026-03-17:** Replaced `ProtectedLayout` with `MigratedRouteLayout` for 4 routes in `App.tsx`.

**Promoted routes:** `/onboarding`, `/ksc-generator`, `/cover-letter-generator`, `/job-queue`

**Remaining on `ProtectedLayout`:**
- `/welcome` — no gate record
- `/documents` — Step 3d not started
- `/asset-library` — retained support surface; still needs ownership cleanup

**Shell authority:** `KrDarkDock` is the authoritative nav component for all `MigratedRouteLayout` routes.

**`MigratedRouteLayout.tsx` viewMap** extended to include:
- `KrDark-feed` → `/opportunities`
- `overview` → `/job-queue`

---

## 4. Firebase/Firestore Blocker Diagnostic Packet

> **CRITICAL BLOCKER — B1**: `/tracker` closeout is fully blocked by local Firebase/Firestore environment. Do NOT attempt Step 3a acceptance without resolving this first.

### Error Evidence

| Error | Source | Description |
|-------|--------|-------------|
| `401 Unauthorized` | `:8000` (FastAPI) | Missing `FIREBASE_PROJECT_ID` env var in local backend process |
| `Stalled Read / Timeout` | `:8001` (Firestore emulator) | Firestore connectivity timeout — project config absent |
| `GET /api/applications/` | Both ports | Returns empty or 401; CRUD data not reachable |

### Required Environment Config

```bash
# Required in backend process (backend/.env or shell)
FIREBASE_PROJECT_ID=careercopilot-468811
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
# The service account must have Firestore read/write permissions
```

### Validation Steps for Next Agent

1. Start backend: `cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000`
2. Verify token: generate a fresh Firebase ID token for project `careercopilot-468811`
3. Run: `curl -H "Authorization: Bearer <token>" http://localhost:8000/api/applications/`
4. Confirm: JSON array response (not 401, not empty)
5. Open browser at `http://localhost:5173/tracker`
6. Capture screenshot of populated Kanban board
7. Run `vision-scorer-mcp` on screenshot — score must be ≥90

### Reference Evidence
- Session closeout: `analysis/2026-03-16-tracker-live-session-closeout.md`
- Step 3a execution packet: `control/tracker-step-3a-execution-packet.md`

---

## 5. Delegation Instructions (Next Agent)

### Task A: `/tracker` closeout
- **Requires**: Firebase env (project `careercopilot-468811`) + Firestore service account
- **Tests to rerun**: `node --import tsx tools/ci/check-route-integrity.ts`, `bash .claude/skills/token-enforcement/scripts/run-token-enforcement.sh tracker`
- **Output artifacts**: Kanban screenshot (score ≥90), updated `control/status.md`

### Task B: `/opportunities` archetype swaps
- **Status**: Completed 2026-03-17
- **Action**: Swap `Pebble` → `Strike`, extend token coverage per gap-fill plan
- **Gap-fill plan**: `tmp/migration/opportunities-gap-fill-plan.json`
- **Tests**: token-enforcement pass, migration-audit pass
- **Output artifacts**: Updated `Opportunities.tsx`, updated route-matrix entry

### Task C: `Logo.tsx` + `Footer.tsx` creation
- **Status**: Logo already existed; canonical `Footer.tsx` created 2026-03-17
- **Action**: Use the canonical shared primitives and adopt `Footer` during the next shell pass
- **Rules**: Zero-Flora enforced; semantic tokens only; KR Solidarity v6.1
- **Audit**: Run `vision-scorer-mcp` on Logo render (score ≥90)

### Task D: `/documents` redline workspace (Step 3d)
- **Prerequisite**: Step 3d not started; confirm `backend/app/api/endpoints/documents.py` is accessible
- **Action**: Add redline entry point + review workspace panel to `/documents`
- **Shell**: Now on `ProtectedLayout` — promote to `MigratedRouteLayout` after design-parity gate
