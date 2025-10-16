# Copilot instructions for CareerCopilot

Purpose: give coding agents the minimal, actionable knowledge to be productive in this repo.

- Big picture
  - Frontend: React + TypeScript (Vite) in `frontend/`. Dev server: `yarn dev` (from `frontend` or root `yarn dev`).
  - Functions: Firebase Functions (Node 20, TS) in `functions/` workspace.
  - Backend: FastAPI + Python in `backend/app/` — Genkit flows and AI logic live under `backend/app/genkit_flows/`.
  - AI orchestration: Google Genkit is the primary AI flow framework. Initialization and health checks are in
    `backend/app/core/genkit_init.py` and flow helpers/decorators are in `backend/app/genkit_flows/README_FLOW_DECORATOR.md`.

- Where to implement or change AI agents
  - Add or modify Genkit flows in `backend/app/genkit_flows/`. Prefer the provided decorators (`@simple_genkit_flow`,
    `@async_genkit_flow`) to register flows and reduce boilerplate. See `ats_scoring.py` and `advanced_job_matching.py` for examples.

- Key repo conventions (do not invent)
  - Use Genkit for AI operations. Toggle runtime with environment variable `ENABLE_GENKIT_FLOWS` (set to `true` to enable).
  - GEMINI / Google AI keys live in env (e.g. `GEMINI_API_KEY`) and Secret Manager in production. Don’t hard-code keys.
  - AI agent I/O follows a standardized schema (see `agents.md`): output should include `success`, `content`, `confidence_score`, `suggestions`, `metadata`, `error`.
  - Prefer async patterns for backend flows and avoid synchronous blocking calls in agents.
  - Frontend uses Firebase v9 modular SDK patterns (see `agents.md` guidance) and an API-first approach — frontend must call backend APIs, not Firestore directly.

- Common commands and quick examples
  - Root dev server (frontend): `yarn dev` (or `cd frontend && yarn dev`).
  - Start Functions emulator: `npm run serve` from `functions` or `yarn dev:functions` from root.
  - Builds: `yarn build` (root builds frontend then functions), or `yarn build:frontend` / `yarn build:functions`.
  - Type check / lint: `yarn lint`, `yarn format`, and `npx tsc --noEmit` in TS packages.
  - Run backend tests: `pytest backend/app/tests/` (or `npm run test:backend` via root script).
  - Verify Genkit locally: `ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py` (useful to validate plugins and keys).

- Testing & mocking notes useful for agents
  - Many python tests mock Genkit or `gemini_pro`. When adding tests, mock external Genkit calls (see tests under `backend/app/tests/genkit_flows/`).
  - Use `cached_ai_operations.py` helpers in tests where Genkit is unavailable.

- Important files to reference when making changes
  - AI + Genkit bootstrap: `backend/app/core/genkit_init.py`
  - Flow decorators/README: `backend/app/genkit_flows/README_FLOW_DECORATOR.md`
  - Example flows: `backend/app/genkit_flows/ats_scoring.py`, `advanced_job_matching.py`, `resume_intelligence_pipeline.py`
  - API endpoints that call flows: `backend/app/api/endpoints/analysis.py`, `workflows.py`
  - Frontend entry & components: `frontend/src/App.tsx`, `frontend/src/components/DocumentGeneration/*`
  - Scripts and helpers: `verify_genkit.py`, `scripts/*` for secrets and environment setup

- PR and change guidelines (short)
  - Small, focused diffs. Use commit format `feat(scope): description`.
  - Run relevant linters/tests for changed area (frontend tests for UI, pytest for backend flows).
  - If touching Genkit flows: ensure `ENABLE_GENKIT_FLOWS` behavior is maintained and add unit tests that mock Genkit.

- Quick debugging tips
  - If flows appear unavailable: check `ENABLE_GENKIT_FLOWS`, `GEMINI_API_KEY`, and `genkit_init` logs.
  - To reproduce failing Genkit-dependent logic in tests, inject a mock `genkit` module (see `backend/app/tests/test_resume_intelligence_pipeline.py`).

- Frontend readiness commands (use before deploy / when debugging build issues)
  - Validate build locally:
    - Install deps (root uses Yarn workspaces): `yarn install` then `yarn build:frontend` (or `cd frontend && yarn build`).
    - Verify `frontend/dist` (or `frontend/build` depending on config) contains `index.html` and assets.
  - Example helper scripts (added to repo):
    - `scripts/frontend-readiness.sh` — installs deps, runs `yarn build:frontend`, and verifies `frontend/dist/index.html`.
    - `scripts/prep-production-env.sh` — wraps `scripts/fetch-firebase-config.py` to create `frontend/.env.production.local` (requires `GOOGLE_CLOUD_PROJECT`).
  - Generate production env file for hosting (production config is stored in Secret Manager):
    - `python3 scripts/fetch-firebase-config.py --output frontend/.env.production.local` (requires `GOOGLE_CLOUD_PROJECT`).
  - Lint & Typecheck before deploy: `yarn lint && npx tsc --noEmit` from root or `cd frontend && yarn lint && npx tsc --noEmit`.
  - Preview production build locally: `cd frontend && yarn preview` (verifies routing and asset paths).
  - Run hosting emulator: `firebase emulators:start --only hosting` or use `firebase serve --only hosting` to replicate hosting behavior locally.

- Production troubleshooting (site: https://careercopilot-468811.web.app)
  - Quick triage checklist:
    1. Check Firebase Hosting status & deploy history in Firebase Console → Hosting (shows last deploy, recent errors).
    2. Confirm the latest build artifacts were uploaded to `frontend/dist` and the deploy used that directory (`firebase.json` -> `hosting.public`).
    3. Verify that `firebase.json` rewrites/headers are correct (single-page app should rewrite `**` to `/index.html`). See `firebase.json` in repo.
    4. Confirm environment variables used at build time (frontend `.env.production` / Secret Manager). If missing keys, the app may behave incorrectly.
    5. Inspect Cloud Functions / Cloud Run backends used by the frontend: check their logs in Google Cloud Console for 5xx errors.
  - Common causes & checks:
    - Stale CDN cache: Hosting uses long Cache-Control for `/static/**`. If a deploy didn't update file names, users may see old assets — try `firebase hosting:channel:deploy` for testing or invalidate cache by redeploying with new asset names.
    - Missing runtime config: If `frontend/.env.production.local` wasn't provided at build time, API endpoints may be misconfigured — re-run `scripts/fetch-firebase-config.py` and rebuild.
    - 404s on JS/CSS: Check that `index.html` references the correct hashed asset filenames; inspect network tab on a failing page.
    - Authentication failures: Ensure Firebase API keys and Auth config are correct in hosting environment; confirm Firebase project ID matches hosted site.
  - Logs & debug commands you can run locally:
    - Rebuild and serve locally to reproduce: (from repo root)

```bash
yarn build:frontend
cd frontend && yarn preview
```

    - Start full local stack (frontend + functions emulator):

```bash
yarn dev:functions   # runs functions emulator
yarn dev             # runs frontend dev server (Vite)
firebase emulators:start --only hosting,functions
```

    - Check hosting deploy status from CLI:

```bash
firebase deploy --only hosting --project=careercopilot-468811
firebase hosting:channel:deploy staging --project=careercopilot-468811
```

- Where to look for production diagnostics
  - Firebase Console (Hosting logs & deploy history)
    - Hosting -> Deploys shows the last deploy and any errors. Use the "View" link to open hosted site and logs.
  - Google Cloud Console
    - Cloud Functions logs: Console > Cloud Functions > select function > Logs. Filter for severity=ERROR and time range.
    - Cloud Run logs: Console > Cloud Run > service > Revisions > Logs; or use Cloud Logging with a query like `resource.type="cloud_run_revision" AND severity>=ERROR`.
    - Use Cloud Logging queries for cross-service errors; example query to find 5xx errors from functions:

```
resource.type="cloud_function"
severity>=ERROR
"status: 5"
```

    - Sentry/monitoring if configured (look for DSN in `scripts/` or `backend/app/core/secure_config.py`).
    - Browser devtools (console errors, network failures, CORS problems) — open the site, reproduce the problem, and check Console & Network tabs. Capture failing request details and timestamps to correlate with backend logs.

- Quick rollback / patch approach:
  1. If a deploy introduced regressions, deploy the previous release channel: `firebase hosting:clone <source-channel> <target-channel> --project=careercopilot-468811` or redeploy an earlier build artifact.
  2. Use `firebase hosting:channel:deploy` for temporary builds to test fixes without affecting production.
  3. If backend errors are from Cloud Functions, redeploy the function with `firebase deploy --only functions:functionName --project=careercopilot-468811` after patching the code.

If any of the above is unclear, tell me which section you want expanded or give a small example change and I will iterate.

If any of the above is unclear, tell me which section you want expanded or give a small example change and I will iterate.
`
