# Phase 6 Staging Observability Report (2026-03-09)

## Task
- ID: `P6-T4-observability-check`
- Environment: `staging`

## Critical Errors Check
- Query window A (deploy+recovery period): `2026-03-09T04:30:00Z` onward
  - Observed `ERROR` entries tied to Cloud Build / Cloud Functions deployment failures during recovery.
- Query window B (post-fix steady-state): `2026-03-09T05:09:30Z` onward
  - Observed `ERROR` entries: `0`

## Latency Baseline (route reachability sampling)
Sampled from `https://careercopilot-staging.web.app`:
- `/cover-letter-generator?demo=true` -> `200`, `0.045712s`
- `/ksc-generator?demo=true` -> `200`, `0.050944s`
- `/design-sidekick` -> `200`, `0.044169s`
- `/dashboard?demo=true` -> `200`, `0.052166s`

Approximate baseline:
- p50 (sample): ~`0.048s`
- p95 (sample proxy): ~`0.052s`

## Error Rate Baseline
- Post-fix window shows no `ERROR` logs in sampled period.
- Baseline set to: `0 observed critical errors` immediately after deploy stabilization.

## Notes
- Earlier `ERROR` logs were deployment-time failures that were resolved by:
  - enabling `compute.googleapis.com`
  - fixing `firebase.json` functions ignore to include compiled `lib/` output.
