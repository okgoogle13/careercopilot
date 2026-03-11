# Route Migration Checklist: {ROUTE_NAME}

## Gate 1: draft-generated

- [ ] Run `npm run migrate:screen {route-name}`
- [ ] Verify scaffold exists: `apps/web/src/screens/{RouteName}Screen.tsx`
- [ ] Update MIGRATION_TRACKER.md: `status: draft-generated`

**Validation**: `test -f apps/web/src/screens/{RouteName}Screen.tsx`

---

## Gate 2: benchmark-defined

- [ ] Assign benchmark id: `{benchmark-id}`
- [ ] Create benchmark bundle: `docs/design-system/benchmarks/{benchmark-id}/`
- [ ] Copy style-guide rubric → `{benchmark-id}/rubric.json`
- [ ] Run `npm run generate:wireframe {route-name}`
- [ ] Verify wireframe: `docs/design-system/wireframes/{route-name}.json`
- [ ] Update MIGRATION_TRACKER.md: `benchmark_defined: true, benchmark_id: {benchmark-id}`

**Validation**: `test -d docs/design-system/benchmarks/{benchmark-id}`

---

## Gate 3: copy-cleared

- [ ] Rewrite all user-facing copy (JSX text, aria-labels, titles)
- [ ] Remove meta-language: `migration`, `feature flag`, `placeholder`
- [ ] Remove bureaucratic framing: `Worker Portal`, `Workspace`
- [ ] Add journey context to CTAs
- [ ] Run `npm run audit:copy`
- [ ] Verify 0 violations
- [ ] Update MIGRATION_TRACKER.md: `copy_cleared: true, banned_term_violations: 0`

**Validation**: `npm run audit:copy && echo $?` → Must be 0

---

## Gate 4: visual-ready

- [ ] Implement route in `apps/web/src/screens/{RouteName}Screen.tsx`
- [ ] Use semantic tokens only: `--sys-color-*`, `--sys-shape-*`, `--sys-type-*`
- [ ] Add feature flag in `apps/web/src/router/featureFlags.ts`
- [ ] Wire RouteGate in `apps/web/src/router/ScreensRouter.tsx`
- [ ] Test flag-off: renders legacy component
- [ ] Test flag-on: renders migrated screen
- [ ] Run `npm run screenshot:capture`
- [ ] Verify screenshots: `docs/design-system/benchmarks/{benchmark-id}/{route}-*.png`
- [ ] Update MIGRATION_TRACKER.md: `visual_ready: true`

**Validation**: `test -f docs/design-system/benchmarks/{benchmark-id}/{route}-desktop.png`

---

## Gate 5: migrated-ready

- [ ] Run `npm run verify` (lint + type-check + test + audit:copy + design-audit)
- [ ] All checks pass with 0 violations
- [ ] Run visual benchmark audit (manual: compare screenshots vs rubric)
- [ ] Visual audit score ≥ 90/100
- [ ] Update MIGRATION_TRACKER.md: `status: migrated-ready, audit: passed, rollback_ready: true`

**Validation**: `npm run verify && echo $?` → Must be 0

---

## Rollback Verification

- [ ] Set flag to false: `DEFAULT_FEATURE_FLAGS.{route} = false`
- [ ] Test: route renders legacy component
- [ ] Set flag to true: `DEFAULT_FEATURE_FLAGS.{route} = true`
- [ ] Test: route renders migrated screen
- [ ] Confirm: Rollback is flag change, not code revert

---

## Final Status

Route: `{ROUTE_NAME}`
Status: `{STATUS}`
Benchmark: `{BENCHMARK_ID}`
Ready for Rollout: `{YES/NO}`
