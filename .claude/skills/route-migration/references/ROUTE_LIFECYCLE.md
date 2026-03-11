# Route Migration Lifecycle

## 5-Gate Model

Every migrated route must pass these gates in order. Each gate has deterministic validation.

### Gate 1: draft-generated

**Entry**: Route scaffold does not exist
**Exit**: Route scaffold exists with neutral copy

**Validation**:
```bash
cd careercopilot-migration-kit-v3
npm run migrate:screen <route-name>
# Exit 0 = scaffold created
# Exit 1 = scaffold already exists (safety check)

test -f "apps/web/src/screens/<RouteName>Screen.tsx"
```

**Status Field**: `draft-generated: true`
**Tracker Column**: `status: draft-generated`

---

### Gate 2: benchmark-defined

**Entry**: Scaffold exists, no benchmark assigned
**Exit**: Benchmark bundle + wireframe artifact exist

**Validation**:
```bash
# Check benchmark exists
test -d "docs/design-system/benchmarks/<benchmark-id>/"

# Check wireframe artifact
test -f "docs/design-system/wireframes/<route-name>.json"

# Verify tracker entry
grep "<benchmark-id>" docs/migration/MIGRATION_TRACKER.md
```

**Status Field**: `benchmark_defined: true`
**Tracker Column**: `benchmark_id: <benchmark-id>`

---

### Gate 3: copy-cleared

**Entry**: Route has placeholder/meta-language copy
**Exit**: Copy passes audit:copy with 0 violations

**Validation**:
```bash
cd careercopilot-migration-kit-v3
npm run audit:copy -- --json

# Check exit code
echo $?  # Must be 0

# Check JSON output
jq '.violations | length' audit-copy-output.json  # Must be 0
```

**Status Field**: `copy_cleared: true`
**Tracker Column**: `banned_term_violations: 0`

---

### Gate 4: visual-ready

**Entry**: Route renders but no screenshots captured
**Exit**: Screenshots exist in benchmark bundle

**Validation**:
```bash
cd careercopilot-migration-kit-v3
npm run screenshot:capture

# Check screenshots exist
test -f "docs/design-system/benchmarks/<benchmark-id>/<route>-desktop.png"
test -f "docs/design-system/benchmarks/<benchmark-id>/<route>-mobile.png"
```

**Status Field**: `visual_ready: true`
**Tracker Column**: Visual artifacts confirmed

---

### Gate 5: migrated-ready

**Entry**: All 4 gates passed, awaiting final validation
**Exit**: Route ready for flag flip and production rollout

**Validation**:
```bash
cd careercopilot-migration-kit-v3
npm run verify  # All 5 checks pass

# Visual benchmark audit (manual for now)
# Compare screenshots against benchmark rubric

# Update tracker
grep "migrated-ready" docs/migration/MIGRATION_TRACKER.md | grep "<route>"
```

**Status Field**: `status: migrated-ready`
**Tracker Columns**:
- `lint: passed`
- `typecheck: passed`
- `audit: passed`
- `rollback_ready: true`

---

## Gate Transitions

```
[no-scaffold] --migrate:screen--> [draft-generated]
                                        |
                      define benchmark + wireframe
                                        ↓
                                 [benchmark-defined]
                                        |
                            rewrite copy + audit:copy
                                        ↓
                                  [copy-cleared]
                                        |
                            implement + capture screenshots
                                        ↓
                                  [visual-ready]
                                        |
                          npm run verify + visual audit
                                        ↓
                                 [migrated-ready]
```

## Batch Automation Contract

Each gate can be validated independently:

```bash
# Gate 1
npm run migrate:screen <route> && echo "gate-1:pass" || echo "gate-1:fail"

# Gate 2
test -d "docs/design-system/benchmarks/<benchmark-id>" && echo "gate-2:pass" || echo "gate-2:fail"

# Gate 3
npm run audit:copy && echo "gate-3:pass" || echo "gate-3:fail"

# Gate 4
npm run screenshot:capture && echo "gate-4:pass" || echo "gate-4:fail"

# Gate 5
npm run verify && echo "gate-5:pass" || echo "gate-5:fail"
```
