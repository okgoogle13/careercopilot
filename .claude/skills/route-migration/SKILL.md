---
name: route-migration
description: 5-gate lifecycle for route migration with batch automation. Returns gate status JSON. Use for single routes or parallel batch processing.
chainable: true
gate_type: orchestrator
lifecycle_stages: [draft-generated, benchmark-defined, copy-cleared, visual-ready, migrated-ready]
triggers: [token-enforcement, visual-audit, migration-audit]
json_io: true
---

# Route Migration

## Objective

Move one route at a time from legacy feature to migrated screen through deterministic 5-gate lifecycle. Designed for batch processing and automated skill-chaining.

## When to Use

- Migrating a single route (e.g., /login) from legacy feature to screen
- Batch-migrating multiple routes in parallel (/profile, /settings, /help)
- Automating migration pipeline via CI/CD
- Validating existing route against lifecycle gates

## When to Chain

**Upstream Skills**: None (starts migration workflow)

**Downstream Skills**:
- `@token-enforcement` - Gate 3 (copy-cleared validation)
- `@visual-audit` - Gate 4 (visual-ready validation)
- `@migration-audit` - Gate 5 (migrated-ready orchestration)

**Batch Automation**:
```bash
# Migrate 3 routes in parallel
for route in profile settings help; do
  (
    @route-migration $route gate-1  # Generate scaffold
    @route-migration $route gate-2  # Define benchmark
    @token-enforcement $route       # Gate 3
    @visual-audit $route            # Gate 4
    @migration-audit $route         # Gate 5
  ) &
done
wait
```

## 5-Gate Lifecycle

See `references/ROUTE_LIFECYCLE.md` for detailed gate specifications.

### Gate 1: draft-generated

```bash
npm run migrate:screen <route-name>
```

**Output**: Scaffold in `apps/web/src/screens/<RouteName>Screen.tsx`
**Tracker**: `status: draft-generated`

### Gate 2: benchmark-defined

```bash
# Manual: Create benchmark bundle
mkdir -p docs/design-system/benchmarks/<benchmark-id>
npm run generate:wireframe <route-name>
```

**Output**: Wireframe in `docs/design-system/wireframes/<route>.json`
**Tracker**: `benchmark_defined: true, benchmark_id: <id>`

### Gate 3: copy-cleared

```bash
# Manual: Rewrite copy
npm run audit:copy
```

**Output**: 0 violations
**Tracker**: `copy_cleared: true, banned_term_violations: 0`

### Gate 4: visual-ready

```bash
# Manual: Implement route + wire RouteGate
npm run screenshot:capture
```

**Output**: Screenshots in `docs/design-system/benchmarks/<benchmark-id>/`
**Tracker**: `visual_ready: true`

### Gate 5: migrated-ready

```bash
npm run verify
# Manual: Visual benchmark audit
```

**Output**: All checks pass, visual score ≥ 90/100
**Tracker**: `status: migrated-ready, audit: passed, rollback_ready: true`

## Machine-Readable Mode

### JSON Input

```json
{
  "route": "/profile",
  "gate": 1,
  "benchmark_id": "auth-benchmark-v1",
  "mode": "validate" | "execute"
}
```

### JSON Output

```json
{
  "route": "/profile",
  "gate": 1,
  "status": "pass" | "fail",
  "lifecycle_stage": "draft-generated",
  "next_gate": 2,
  "artifacts": [
    "apps/web/src/screens/ProfileScreen.tsx"
  ],
  "commands": {
    "validate": "test -f apps/web/src/screens/ProfileScreen.tsx",
    "next_step": "npm run generate:wireframe profile"
  }
}
```

## Batch Processing

Use included checklist template for automation:

```bash
# Generate checklist for new route
cp .claude/skills/route-migration/assets/route-checklist-template.md \
   docs/migration/checklists/profile-checklist.md

# Replace placeholders
sed -i 's/{ROUTE_NAME}/profile/g' docs/migration/checklists/profile-checklist.md
sed -i 's/{benchmark-id}/auth-benchmark-v1/g' docs/migration/checklists/profile-checklist.md

# Track progress
grep -c "\[x\]" docs/migration/checklists/profile-checklist.md
```

## RouteGate Wiring Pattern

**Feature Flag** (`apps/web/src/router/featureFlags.ts`):
```typescript
export const DEFAULT_FEATURE_FLAGS = {
  profile: false,  // default to legacy until rollout
}
```

**Route** (`apps/web/src/router/ScreensRouter.tsx`):
```typescript
<RouteGate
  path="/profile"
  flagKey="profile"
  legacy={<ProfileLegacy />}
  migrated={<ProfileScreen />}
/>
```

**Rollback**: `profile: true` → `profile: false`, redeploy. No code revert.

## Guardrails

- Preserve route path (no URL changes)
- Preserve legacy fallback until flag flip
- RouteGate is only cutover switch
- Committed default flag-off until explicit rollout
- Semantic tokens only: `--sys-color-*`, `--sys-shape-*`, `--sys-type-*`
- Zero-flora and deprecated-token bans enforced

Source: MIGRATION_GUARDRAILS.md

## Related Skills

- `@token-enforcement` - Gate 3: Copy hygiene validation
- `@migration-audit` - Gate 5: Final readiness orchestration
- `@component-visual-audit` - Screenshot compliance scoring
- `@ui-design-evaluator` - KR Solidarity design system evaluation

## Success Criteria

- All 5 gates pass with deterministic validation
- MIGRATION_TRACKER.md shows `migrated-ready`
- Route toggles cleanly via flag (flag=false → legacy, flag=true → migrated)
- `npm run verify` passes with 0 violations
- Rollback is flag change, not code revert

## Fallback

If skill unavailable:
- Lifecycle Gates: `references/ROUTE_LIFECYCLE.md`
- Guardrails: MIGRATION_GUARDRAILS.md
- PR Plan: PR_PLAN.md lines 10-36
- Cutover Runbook: PR_PLAN.md lines 112-139
