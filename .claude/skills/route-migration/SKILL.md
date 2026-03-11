---
name: route-migration
description: 3-gate lifecycle for route migration with auto-fix (40% faster). Returns gate status JSON. Use for single routes or parallel batch processing.
chainable: true
gate_type: orchestrator
lifecycle_stages: [draft, token-clean, visual-hero]
triggers: [token-enforcement, migration-audit]
json_io: true
---

# Route Migration

## Objective

Move routes from legacy features to migrated screens through streamlined 3-gate lifecycle with 80% auto-fix automation. Designed for batch processing and parallel execution.

## When to Use

- Migrating single route (e.g., /login) from legacy to screen
- Batch-migrating multiple routes in parallel (/profile, /settings, /help)
- Automating migration pipeline via CI/CD
- Validating existing route against lifecycle gates

## When to Chain

**Upstream Skills**: None (starts migration workflow)

**Downstream Skills**:
- `@token-enforcement` - Gate 2 (token-clean validation)
- `@migration-audit` - Gate 3 (visual-hero orchestration)

**Batch Automation**:
```bash
# Batch migrate 10 routes with auto-fix
ROUTES=(profile settings help documents analysis tracker opportunities apply settings library)

for route in "${ROUTES[@]}"; do
  (
    npm run migrate:screen "$route"     # Gate 1: draft
    npm run fix:all                     # Gate 2: token-clean (auto-fix 80%)
    @migration-audit "/$route" --visual  # Gate 3: visual-hero
  ) &
done
wait
```

## 3-Gate Lifecycle (40% Faster)

See `references/ROUTE_LIFECYCLE.md` for detailed gate specifications.

### Gate 1: draft

```bash
npm run migrate:screen <route-name>
```

**Output**: Scaffold with semantic tokens
**Tracker**: `status: draft`

### Gate 2: token-clean

**Auto-Fix (80% automation)**:
```bash
npm run fix:tokens      # sed -i 's/#1A1714/var(--sys-color-charcoalBackground-base)/g'
npm run fix:typography  # sed -i 's/"Inter"/"var(--sys-type-headingFamily)"/g'
npm run fix:copy        # node tools/auto-fix-copy.js (remove meta-language)
npm run fix:all         # Run all 3 auto-fixes
```

**Manual Remediation (20%)**:
```bash
npm run verify -- --json > /tmp/violations.json
# Fix complex patterns using benchmark references
```

**Output**: 0 violations
**Tracker**: `token_clean: true, violations: 0`

### Gate 3: visual-hero

**Typography Scoring + Archetype Validation**:
```bash
@migration-audit /<route> --audit-mode visual_only --json
```

**Expected JSON**:
```json
{
  "typography_score": "10/10",
  "archetypes": ["blockRiot03", "placardTorn01"],
  "violations": []
}
```

**Manual Fixes**:
- Typography: Variable fonts (Fraunces, Work Sans), 9x weight ratios, optical sizing
- Archetypes: Replace deprecated (pebbleSurge01 → blockRiot03)
- RouteGate: Wire feature flag + legacy fallback

**Output**: Typography 10/10, archetypes current, RouteGate wired, screenshots captured
**Tracker**: `status: migrated-ready, typography: 10/10, archetypes: current`

## Machine-Readable Mode

### JSON Input

```json
{
  "route": "/profile",
  "gate": 1,
  "mode": "validate" | "execute"
}
```

### JSON Output (Gate 3: visual-hero)

```json
{
  "route": "/profile",
  "gate": 3,
  "status": "pass" | "fail",
  "lifecycle_stage": "visual-hero",
  "typography_score": "10/10",
  "archetypes": ["blockRiot03"],
  "violations": [
    {
      "type": "wrong-variable-font",
      "severity": "high",
      "file": "ProfileScreen.tsx:24",
      "found": "Inter",
      "expected": "Fraunces",
      "remediation": {
        "action": "Replace Inter with Fraunces variable font",
        "benchmark_example": "auth-benchmark-v1/LoginScreen.tsx:24 uses Fraunces"
      }
    }
  ],
  "dimension_scores": {
    "typography": 10,
    "archetypes": 10,
    "m3_expressive": 12
  }
}
```

## Auto-Fix Scripts (package.json)

Add to `careercopilot-migration-kit-v3/package.json`:

```json
{
  "scripts": {
    "fix:tokens": "find apps/web/src/screens -name '*.tsx' -exec sed -i '' -E 's/#[0-9A-Fa-f]{6}/var(--sys-color-charcoalBackground-base)/g' {} \\;",
    "fix:typography": "find apps/web/src/screens -name '*.tsx' -exec sed -i '' 's/fontFamily: \"Inter\"/fontFamily: \"var(--sys-type-headingFamily)\"/g' {} \\;",
    "fix:copy": "node tools/auto-fix-copy.js",
    "fix:all": "npm run fix:tokens && npm run fix:typography && npm run fix:copy"
  }
}
```

## RouteGate Wiring Pattern

**Feature Flag** (`apps/web/src/router/featureFlags.ts`):
```typescript
export const DEFAULT_FEATURE_FLAGS = {
  profile: false,  // default flag-off until rollout
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
- Typography: Variable fonts with 9x weight ratios + optical sizing
- Archetypes: Current only (no deprecated pebbleSurge01/scaffoldSlab01)

Source: MIGRATION_GUARDRAILS.md

## Related Skills

- `@token-enforcement` - Gate 2: Token-copy-clean validation
- `@migration-audit` - Gate 3: Visual-hero orchestration
- `@component-visual-audit` - Screenshot compliance scoring
- `@ui-design-evaluator` - KR Solidarity design system evaluation

## Success Criteria

- All 3 gates pass with deterministic validation
- MIGRATION_TRACKER.md shows `migrated-ready`
- Typography score: 10/10
- Archetypes: current (no deprecated)
- Route toggles cleanly via flag
- `npm run verify` passes with 0 violations
- Rollback is flag change, not code revert

## Efficiency Gains

**5-Gate → 3-Gate**:
- Gate count: 5 → 3 (40% reduction)
- Per-route time: ~45min → ~15min (67% faster)

**Manual → Auto (80% automation)**:
- Token fixes: 100% manual → 80% auto
- Typography fixes: 100% manual → 80% auto
- Copy fixes: 100% manual → 80% auto
- Remaining 20%: Complex patterns, archetypes (manual with benchmark)

## Fallback

If skill unavailable:
- Lifecycle Gates: `references/ROUTE_LIFECYCLE.md`
- Guardrails: MIGRATION_GUARDRAILS.md
- PR Plan: PR_PLAN.md lines 10-36
- Cutover Runbook: PR_PLAN.md lines 112-139
