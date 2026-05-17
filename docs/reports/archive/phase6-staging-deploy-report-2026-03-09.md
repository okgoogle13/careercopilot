# Phase 6 Staging Deploy Report (2026-03-09)

## Task
- ID: `P6-T2-staging-deploy`
- Assignee: `deployment-manager`
- Target: `staging`

## Command Executed
- `./scripts/deploy.sh staging --skip-tests --skip-lint`

## Result Summary
- Frontend build: PASS
- Functions build: PASS
- Hosting deploy: PASS
- Functions deploy: FAIL (infrastructure/billing constraint)

## Verified Outputs
- Hosting URL deployed: `https://careercopilot-staging.web.app`
- Firebase console: `https://console.firebase.google.com/project/careercopilot-staging/overview`

## Blocking Error
```
Error: Extensions require the Blaze plan, but project careercopilot-staging is not on the Blaze plan.
```

## Impact
- Staging frontend candidate is live.
- Full scripted staging deploy path did not complete due to functions/extensions billing gate.
- `P6-T2-staging-deploy` cannot be marked complete until billing plan is upgraded or deploy scope is explicitly reduced.

## Recommended Resolution
1. Upgrade `careercopilot-staging` to Blaze plan, then rerun `./scripts/deploy.sh staging --skip-tests --skip-lint`.
2. If Blaze upgrade is not desired, explicitly accept a reduced scope (`frontend`-only deploy) and update Phase 6 gate criteria accordingly.

## External Reachability Check
- Command: `curl -I -m 10 https://careercopilot-staging.web.app`
- Result: `HTTP/2 200`
- Date header: `Mon, 09 Mar 2026 04:24:18 GMT`

## Route Reachability (Phase 6 Smoke Precheck)
- `GET/HEAD /cover-letter-generator?demo=true` -> `HTTP/2 200`
- `GET/HEAD /ksc-generator?demo=true` -> `HTTP/2 200`
- `GET/HEAD /design-sidekick` -> `HTTP/2 200`
- `GET/HEAD /dashboard?demo=true` -> `HTTP/2 200`

Note: These checks validate staging host + SPA route serving. They do not replace full interactive browser smoke and backend observability validation in `P6-T3`/`P6-T4`.

## Re-Execution After Blaze Upgrade
- Reclaimed `P6-T2-staging-deploy` and reran staging deployment.
- Initial rerun progressed through hosting but functions failed in non-interactive deletion mode, then in function build pipeline.

## Root Cause and Fix Applied
- Root cause for repeated function deploy failures:
  - Cloud Build error: `lib/index.js does not exist`
  - Configuration issue: `firebase.json` functions ignore list incorrectly excluded `lib`.
- Fix applied:
  - Updated `firebase.json` to remove `"lib"` from `functions[0].ignore`.

## Post-Fix Verification
- Functions redeployed successfully after config fix.
- Verified all Gen2 functions are `ACTIVE` in `us-central1` for `careercopilot-staging`:
  - bulkUpdateApplications, createApplication, deleteApplication, enqueueJobProcessing,
    exportApplications, extractAndSave, extractJobListing, findSimilarListings,
    getApplication, healthCheck, listApplications, processJobListing,
    scheduleInterview, updateApplication, uploadAndTag.
- Firestore deploy completed:
  - `firestore.rules` released.
  - `firestore.indexes.json` deployed.

## Final Status
- `P6-T2-staging-deploy`: READY TO CLOSE as `completed`.
- Remaining note: Node.js 20 runtime deprecation warning (advisory, non-blocking for this deploy).
