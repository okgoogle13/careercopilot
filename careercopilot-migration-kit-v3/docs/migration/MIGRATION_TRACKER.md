# Migration Tracker

| route | status | benchmark_defined | copy_cleared | visual_ready | benchmark_id | legacy_route_active | screen_available | flag_default | hardcoded_style_violations | banned_term_violations | lint | typecheck | audit | rollback_ready | notes |
|---|---|---|---|---|---|---|---|---|---:|---:|---|---|---|---|---|
| /login | migrated-ready | true | true | true | auth-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate owns cutover; legacy fallback remains the committed default until the flag flips. Benchmarked against `auth-benchmark-v1`, derived from the style-guide rubric. Copy is now cleared of developer meta-language and bureaucratic auth framing. Verified on March 11, 2026. Commit: 706be993 with audit:copy 0 violations. |
| /register | migrated-ready | true | true | true | auth-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate now owns /register cutover as the second migration slice. Legacy fallback remains the committed default until the flag flips. Benchmarked against `auth-benchmark-v1`, derived from the style-guide rubric. Copy is now cleared of developer meta-language and bureaucratic auth framing. Verified on March 11, 2026. Commit: 706be993 with audit:copy 0 violations. |
| /dashboard | migrated-ready | true | true | true | dashboard-benchmark-v1 | true | true | false | 0 | 0 | passed | passed | passed | true | RouteGate now owns /dashboard cutover as the next migration slice. Legacy fallback remains the committed default until the flag flips. Benchmarked against `dashboard-benchmark-v1`. Dashboard copy is now cleared of developer meta-language and placeholder status messaging. Verified on March 11, 2026. Commit: 706be993 with audit:copy 0 violations. |

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

## Readiness States

- `draft-generated`: scaffold exists but still uses neutral generated copy
- `benchmark-defined`: route benchmark and wireframe exist
- `copy-cleared`: route passes vocabulary and user-facing copy checks
- `visual-ready`: screenshots and shell are stable enough for benchmark comparison
- `migrated-ready`: route passes benchmarked audit and regression checks
