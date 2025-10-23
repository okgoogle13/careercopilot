# Handover: E2E Tests Hanging/Failing in CI

## Summary
- The E2E Tests job in workflow `CI - Build and Test` previously hung ~17 minutes during Playwright execution.
- We implemented guardrails and configuration fixes. The latest rerun no longer hangs; it fails cleanly within ~8m20s with actionable artifacts.
- Current primary failure is `net::ERR_CONNECTION_REFUSED` when navigating to `http://127.0.0.1:3000` (frontend not reachable at test time).

## Current Status (Run 18745042298)
- All jobs passed except:
  - E2E Tests: failure (completed in ~8m20s)
  - Quality Gate: failure (blocked by E2E)
- Artifacts are available and include Playwright HTML report, JSON results, screenshots/videos, and docker-compose diagnostics.

## Root Cause (Latest)
- Frontend service appears not to be accepting connections when Playwright starts (connection refused on base URL).
- Contributing factors identified previously:
  - Playwright dev server competing with Nginx on port 3000 in CI (now fixed).
  - Frontend container healthcheck pointed at host-mapped port rather than container port (now fixed).

## Fixes Implemented
- .github/workflows/ci.yml
  - Added service readiness checks before tests (curl base URL and backend `/health`).
  - Capped Playwright step to 10 minutes using `timeout` to prevent hangs.
  - Added diagnostics on failure (docker-compose ps/logs to artifact).
  - Ensured artifact paths match Playwright config for easy analysis.
  - Use reporters from Playwright config instead of CLI override.
- frontend/playwright.config.ts
  - Disabled `webServer` on CI to avoid port conflicts with Nginx.
  - `baseURL` is sourced from `PLAYWRIGHT_BASE_URL` (default `http://localhost:3000`).
  - Added `globalTimeout: 600000`, kept per-test `timeout: 120000`.
  - Lowered `navigationTimeout` and `actionTimeout`; set `expect.timeout` to 10s to surface issues faster.
- docker-compose.e2e.yml
  - Frontend healthcheck fixed to use container-internal port (80 via `http://localhost`).
- Tests
  - `frontend/tests/ksc-generation-workflow.spec.js` uses relative navigation (`/ksc-generator`).
  - `frontend/tests/test-utils.js` respects `PLAYWRIGHT_BASE_URL`.
- Added `frontend/nginx.e2e.conf` for SPA routing (optional; not yet mounted in compose).

## Evidence (Latest Rerun)
- Repro run: 18745042298 (branch `develop`, commit `8f93b478`)
- E2E failing specs (titles and error cause):
  - Dashboard: `page.goto: net::ERR_CONNECTION_REFUSED http://127.0.0.1:3000/`
  - Document Upload Success (2 tests): `net::ERR_CONNECTION_REFUSED`
  - KSC Generation Workflow (multiple): `net::ERR_CONNECTION_REFUSED` on `/ksc-generator`
  - KSC Generator Flow (2 tests): `net::ERR_CONNECTION_REFUSED` on `/ksc-generator`
  - Settings: `net::ERR_CONNECTION_REFUSED` on `/settings`
- Artifacts uploaded:
  - `frontend/playwright-report/` (HTML report with traces)
  - `frontend/test-results/` (screenshots, videos, results.json)
  - `docker-compose-e2e-logs.txt` (currently minimal; see Next Steps for improved capture)

## Immediate Next Steps
- Enforce readiness failure in CI:
  - If frontend/backend are not ready after the curl loops, `exit 1` and capture docker logs immediately. This avoids running tests against a closed port and gives clear diagnostics.
- Improve diagnostics when readiness fails:
  - Capture: `docker ps`, `docker-compose ps`, `docker-compose logs`, and `ss -ltn` for listening ports.
- Inspect Playwright report to confirm if any tests progressed after server was up.
  - If all failures are connection refused from the start, focus on bringing frontend up reliably.
- Optionally mount `frontend/nginx.e2e.conf` in `docker-compose.e2e.yml` to ensure SPA routing consistency once the port is listening.

## Proposed Follow-up (after enforcing readiness failure)
- If frontend remains unreachable:
  - Verify `frontend/dist` exists before compose (CI step already builds; double-check).
  - Confirm compose maps `3000:80` and container is healthy.
  - Add `depends_on` with `condition: service_healthy` if needed to coordinate service readiness.
- If specific tests fail beyond connectivity:
  - Stabilize selectors using `data-testid`.
  - Align UI expectations with mock backend responses (`/api/v1/user/settings`, `/api/v1/ksc/generate`).

## Temporary Mitigation (if deployment is blocked)
- Mark `e2e-tests` as `continue-on-error: true` or adjust `quality-gate` to ignore E2E temporarily.
- Keep E2E running and uploading artifacts to avoid blind spots, but do not block staging/production deploys while we fix connectivity.

## How to Verify
- Push commit with readiness-enforced failure logic.
- Confirm E2E either:
  - Fails fast before Playwright with docker logs attached (if services down), or
  - Proceeds and passes/produces actionable test failures (if services up).

## Points of Contact
- CI / E2E Owner (session): responsible for recent changes in `ci.yml`, `playwright.config.ts`, and `docker-compose.e2e.yml`.
