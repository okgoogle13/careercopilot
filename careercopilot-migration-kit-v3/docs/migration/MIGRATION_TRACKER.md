# Migration Tracker

| route | status | legacy_route_active | screen_available | flag_default | hardcoded_style_violations | banned_term_violations | lint | typecheck | audit | rollback_ready | notes |
|---|---|---|---|---|---:|---:|---|---|---|---|---|
| /login | migrated-ready | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate owns cutover; legacy fallback remains the committed default until the flag flips. Verified on March 10, 2026. |
| /register | migrated-ready | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate now owns /register cutover as the second migration slice. Legacy fallback remains the committed default until the flag flips. Verified on March 10, 2026. |
| /dashboard | migrated-ready | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate now owns /dashboard cutover as the next migration slice. Legacy fallback remains the committed default until the flag flips. Benchmarked against `dashboard-benchmark-v1`. Verified on March 10, 2026. |

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
