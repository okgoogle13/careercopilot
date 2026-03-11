# Migration Tracker

| route | status | benchmark_defined | copy_cleared | visual_ready | benchmark_id | legacy_route_active | screen_available | flag_default | hardcoded_style_violations | banned_term_violations | lint | typecheck | audit | rollback_ready | notes |
|---|---|---|---|---|---|---|---|---|---:|---:|---|---|---|---|---|
| /login | migrated-ready | true | true | true | auth-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate owns cutover; legacy fallback remains the committed default until the flag flips. Benchmarked against `auth-benchmark-v1`, derived from the style-guide rubric. Copy is now cleared of developer meta-language and bureaucratic auth framing. Verified on March 11, 2026. Commit: 706be993 with audit:copy 0 violations. |
| /register | migrated-ready | true | true | true | auth-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate now owns /register cutover as the second migration slice. Legacy fallback remains the committed default until the flag flips. Benchmarked against `auth-benchmark-v1`, derived from the style-guide rubric. Copy is now cleared of developer meta-language and bureaucratic auth framing. Verified on March 11, 2026. Commit: 706be993 with audit:copy 0 violations. |
| /dashboard | migrated-ready | true | true | true | dashboard-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate now owns /dashboard cutover as the next migration slice. Legacy fallback remains the committed default until the flag flips. Benchmarked against `dashboard-benchmark-v1`. Dashboard copy is now cleared of developer meta-language and placeholder status messaging. Verified on March 11, 2026. Commit: 706be993 with audit:copy 0 violations. |
| /profile | migrated-ready | true | true | true | profile-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate now owns /profile cutover with legacy fallback still committed by default. Benchmark bundle, wireframe, and Playwright screenshot evidence were captured on March 11, 2026 using the runtime feature-flag override path via `?ff=profile`. Local migration-audit now produces a scored `pass` report at 90/100 with zero route violations. |
| /onboarding | visual-ready | true | true | true | onboarding-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | pending | true | RouteGate now owns /onboarding cutover with legacy fallback still committed by default. Benchmark bundle, wireframe, and Playwright screenshot evidence were captured on March 11, 2026 using the runtime feature-flag override path via `?ff=onboarding`. Final migration-audit remains pending before `migrated-ready`. |
| /welcome | visual-ready | true | true | true | welcome-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | pending | true | RouteGate now owns /welcome cutover with legacy fallback still committed by default. Benchmark bundle, wireframe, and Playwright screenshot evidence were captured on March 11, 2026 using the runtime feature-flag override path via `?ff=welcome`. Final migration-audit remains pending before `migrated-ready`. |

## Factory Status

- Sprint 1 generator: `migrate:screen`
- Source template: `apps/web/src/screens/LoginScreen.tsx`
- Safety rule: generator refuses to overwrite existing screens such as `DashboardScreen.tsx`
- Sprint 2 legacy audit: `audit:legacy`
- Current baseline: zero legacy violations in migration scope on March 10, 2026
- Sprint 3 wireframe export: `generate:wireframe`
- Wireframe artifact path: `docs/design-system/wireframes/*.json`
- Sprint 4 factory testing: `test:factory`
- Generator regression locked: `migrate:screen dashboard` must fail because `DashboardScreen.tsx` already exists

## Sprint Board: March 11-18, 2026

Sprint objective:
- Keep `/login`, `/register`, and `/dashboard` green as benchmark-bearing routes
- Promote `/profile` from `visual-ready` to `migrated-ready`
- Move the remaining product routes through the migration queue in milestone order

Single owner:
- Route migration, audit, validation, and cutover tracking all remain in one execution lane for this sprint

Out of scope for this sprint:
- `/`
- `/design-sidekick`
- `/style-guide`
- `/kr/landing`
- `/kr/auth`
- `/kr/onboarding`
- `/kr/analysis`
- `/kr/dashboard`

### In-Scope Route Queue

| route | sprint milestone | current state | target date | notes |
|---|---|---|---|---|
| /login | Milestone 2 | migrated-ready | 2026-03-12 | Keep benchmark baseline green and rollback-ready |
| /register | Milestone 2 | migrated-ready | 2026-03-12 | Keep benchmark baseline green and rollback-ready |
| /dashboard | Milestone 2 | migrated-ready | 2026-03-12 | Keep benchmark baseline green and rollback-ready |
| /profile | Milestone 3 | migrated-ready | 2026-03-13 | Routed behind RouteGate with benchmark bundle, wireframe, captured screenshot evidence, and a local migration-audit pass report |
| /onboarding | Milestone 4 | visual-ready | 2026-03-15 | Routed behind RouteGate with benchmark bundle, wireframe, and captured screenshot evidence; final migration-audit still pending |
| /welcome | Milestone 4 | visual-ready | 2026-03-15 | Routed behind RouteGate with benchmark bundle, wireframe, and captured screenshot evidence; final migration-audit still pending |
| /tracker | Milestone 4 | not-started | 2026-03-15 | Core workflow batch |
| /documents | Milestone 4 | not-started | 2026-03-15 | Core workflow batch |
| /analysis | Milestone 4 | not-started | 2026-03-15 | Core workflow batch |
| /career/ingest | Milestone 4 | not-started | 2026-03-15 | Core workflow batch |
| /job-queue | Milestone 4 | not-started | 2026-03-15 | Core workflow batch |
| /opportunities | Milestone 5 | not-started | 2026-03-17 | Specialist productivity batch |
| /ksc-generator | Milestone 5 | not-started | 2026-03-17 | Specialist productivity batch |
| /cover-letter-generator | Milestone 5 | not-started | 2026-03-17 | Specialist productivity batch |
| /apply/quick | Milestone 5 | not-started | 2026-03-17 | Specialist productivity batch |
| /settings | Milestone 6 | not-started | 2026-03-18 | Support batch |
| /asset-library | Milestone 6 | not-started | 2026-03-18 | Support batch |
| /test-tokens | Milestone 6 | not-started | 2026-03-18 | Support batch |

### Readiness Score

- `100`: all 18 in-scope product routes are `migrated-ready`
- `75`: milestones 1 through 4 complete
- `55`: milestones 1 through 3 complete
- `25`: milestone 2 complete
- `0`: sprint scope or benchmark baseline not yet locked

Scoring rule:
- Increase the score only when a milestone completes in full
- Partial route completion inside a batch does not advance the score

### Daily Status Template

Use one update per day:

```markdown
## Daily Status - YYYY-MM-DD

- readiness score: <0|25|55|75|100>
- completed milestones: <list or none>
- newly migrated-ready routes: <list or none>
- blocked routes: <route + cause, or none>
- deferred routes: <route + reason, or none>
- next target: <next milestone>
```

### Escalation Rules

- If `/profile` is not `migrated-ready` by 2026-03-13, mark the sprint `at risk`
- If the Milestone 4 core workflow batch is incomplete by 2026-03-15, mark Milestones 5 and 6 `at risk`
- If any target date is missed, record the exact blocked or deferred routes the same day

## Readiness States

- `draft-generated`: scaffold exists but still uses neutral generated copy
- `not-started`: route is in sprint scope but has not entered the migration lifecycle yet
- `benchmark-defined`: route benchmark and wireframe exist
- `copy-cleared`: route passes vocabulary and user-facing copy checks
- `visual-ready`: screenshots and shell are stable enough for benchmark comparison
- `migrated-ready`: route passes benchmarked audit and regression checks
- `blocked`: route is actively in scope but cannot advance because of a named blocker
- `deferred`: route remains out of the current execution path by explicit sprint decision
