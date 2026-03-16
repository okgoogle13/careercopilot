# `/tracker` Live Session Closeout — 2026-03-16

## Outcome

Step 3a remains `in_progress`.

The route now reaches the real mounted applications endpoint through the canonical frontend API path, and the frontend-side route work is no longer the blocker. The remaining blocker is local environment convergence: the default backend on `:8000` lacks Firebase project config, while a backend started with explicit Firebase project vars on `:8001` verifies real tokens but the applications read path still does not complete.

## Environment Used

- frontend target: `http://localhost:5173`
- backend target: `http://127.0.0.1:8000`
- browser runner: headless Chromium via local Playwright
- route used for browser capture: `/tracker?demo=true`

## Evidence Captured

Evidence folder:

- `docs/project/active/frontend-source-of-truth-migration/analysis/evidence/run-2026-03-16-tracker-closeout/`

Key files:

- `tracker-browser-closeout.json`
- `tracker-browser-closeout.png`
- `tracker-localhost-5173.json`
- `tracker-localhost-5173.png`
- `tracker-localhost-5173-after-api-fix.json`
- `tracker-localhost-5173-after-api-fix.png`
- `tracker-localhost-5173-after-retry-fix.json`
- `tracker-localhost-5173-after-retry-fix.png`

## Verified Results

- `/tracker` is mounted to `ApplicationTracker` in runtime truth.
- Local backend health is reachable at `http://127.0.0.1:8000/health`.
- The frontend route now calls the real mounted endpoint `http://localhost:8000/api/applications/`.
- The route no longer hangs in the loading state after API failure; it now surfaces the error + empty state promptly.
- A real Firebase token was generated successfully against the production-linked project `careercopilot-468811`.
- Direct backend verification shows:
  - the default backend on `:8000` rejects real Firebase tokens because Firebase project config is missing from that local process
  - a backend started on `:8001` with explicit Firebase project vars accepts token verification, but `GET /api/applications/` still stalls before returning application data
- Route-level deterministic checks remain green:
  - `bash .claude/skills/token-enforcement/scripts/run-token-enforcement.sh /tracker`
  - `bash .claude/skills/migration-audit/scripts/run-migration-audit.sh /tracker`
  - `cd frontend && yarn test src/features/applications/__tests__/ApplicationTracker.test.tsx src/api/__tests__/applicationService.test.ts --runInBand`

## Changes Made During Closeout

### 1. Canonical API client path restored

`frontend/src/api/applicationService.ts` now uses the shared `axiosInstance` instead of a route-local axios client.

Impact:

- requests now go to `/api/applications/` instead of the stale root-path `/applications/`
- auth now follows the shared API client path rather than reading `localStorage.auth_token`

### 2. Unauthorized API state now fails fast in the tracker UI

`frontend/src/features/applications/ApplicationTracker.tsx` now sets `retry: false` on the tracker query.

Impact:

- unauthorized or backend-failure states no longer sit in a misleading long loading state
- the browser now reaches the user-visible error + empty state within the closeout window

## Remaining Blocker

### Local Firebase/Firestore environment still not converged

Observed results after the API-path fix and real-token verification:

- request to `GET http://localhost:8000/api/applications/` with a real Firebase token still returns `401` because that local backend process has no Firebase project config
- token verification succeeds when the backend is started on `:8001` with explicit Firebase project vars
- the authenticated applications read on `:8001` still does not complete, which points to local Firestore connectivity rather than tracker route logic

Meaning:

- route wiring is correct
- real-token auth can be verified when local backend config is correct
- remaining blocker is backend environment convergence, not missing tracker implementation

## Findings from Gemini Figma-Sync Review

The valid gap in Gemini's plan was the shared-primitive audit for route-adjacent chrome (`Logo`, `Sidebar`, `TopNav`, `Footer`, `AuthGuard`, `KrDarkDock`). That concern has now been folded into the migration workflow/blueprint.

The proposed `/tracker` move into the legacy sidebar shell was **not** adopted because it would treat Figma shell structure as authority over current runtime/design/capability truth.

## Next Action Required

1. Restore one execution-ready local backend for `/tracker` that has both Firebase project config and working Firestore access in the same run.
2. Rerun the authenticated browser pass against that backend and capture:
   - populated board state
   - detail panel state
   - one mutation/refresh state if possible
3. If that pass is clean, move Step 3a from `in_progress` to `COMPLETE`; otherwise keep Step 3a blocked on local environment readiness and continue the wider migration workflow.
