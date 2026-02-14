---
name: compliance-dashboard
description: Real-time compliance tracking for kerala-rage kr-solidarity design system.
  Monitors component migration progress (Material 3 to kerala-rage metaphors), visual
  audit pass rates, typography distinctiveness, [DEPRECATED_STYLE] palette adherence,
  and overall design system maturity. Feeds data from visual audits and component
  inventories into health metrics.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

# Compliance Dashboard Skill

## Purpose

Real-time compliance tracking CLI for kerala-rage kr-solidarity design system. Aggregates data from component specs, audit results, inventory analysis, and design token compliance to provide instant visibility into design system health.

Run the tool to get:
- **Overall compliance %** (target: 80%)
- **Per-dimension metrics** (typography, color, layout, [DEPRECATED_STYLE])
- **Component-level status** (aligned vs needs refinement)
- **Prioritized work queues** (which components to focus on next)

## Quick Start

```bash
# Full report (human-readable)
python3 .claude/skills/compliance-dashboard/run.py

# JSON output (for CI/CD integration)
python3 .claude/skills/compliance-dashboard/run.py --json

# Single component analysis
python3 .claude/skills/compliance-dashboard/run.py --component LoginCard

# Component + JSON
python3 .claude/skills/compliance-dashboard/run.py --component LoginCard --json
```

## Data Sources

The tool aggregates from multiple sources to compute component health:

1. **docs/design/component-batch-plan.yaml**
   - Component metadata (name, mode, priority)
   - Target state (stage1, stage2, tests, tokens)

2. **docs/design/audits/<ComponentName>.json**
   - Visual audit results (if exist)
   - Dimension scores (typography, color, layout, [DEPRECATED_STYLE])
   - Overall compliance score

3. **docs/design/generated/specs/**
   - Component specifications (existence check)

4. **frontend/src/components/**
   - Component code (existence check)
   - Located in `components/<Name>/index.tsx` or `ui/<Name>.tsx`

5. **frontend/src/components/__tests__/**
   - Unit/integration tests (existence check)

6. **scripts/simple-component-inventory.sh --json**
   - Hardcoded values detection (colors, spacing, shadows)
   - Duplicate component detection

## Output Schema

### JSON Mode (`--json`)

Complete structured output:

```json
{
  "summary": {
    "overall_compliance": 0.78,
    "typography": 0.85,
    "color": 0.82,
    "layout": 0.74,
    "[DEPRECATED_STYLE]": 0.68,
    "migration": 0.92,
    "generated_at": "2026-02-10T02:07:37.749610+00:00"
  },
  "components": [
    {
      "name": "LoginCard",
      "mode": "new",
      "priority": "high",
      "scores": {
        "overall": null,
        "typography": null,
        "color": null,
        "layout": null,
        "[DEPRECATED_STYLE]": null
      },
      "status": "aligned|needs_refinement",
      "needs": [
        "needs_typography_fix",
        "needs_color_fix",
        "needs_layout_refine",
        "needs_botanical_integration",
        "needs_migration_cleanup",
        "needs_tests",
        "needs_stage2",
        "needs_spec"
      ],
      "has_spec": true,
      "has_mockup": false,
      "has_component_code": true,
      "has_tests": true,
      "hardcoded_values": false,
      "duplicate": false,
      "last_audit": "2026-02-10T00:00:00Z",
      "iterations": 2
    }
  ]
}
```

### Human-Readable Output (default)

```
Kerala Rage Compliance Dashboard
================================
Generated: 2026-02-10T02:07:37

Overall Compliance: 78% ▲ (Target: 80%)
  Typography        85% ✓
  Color             82% ✓
  Layout            74% ▼
  [DEPRECATED_STYLE]         68% ▲
  Migration        100% ✓

Status: Approaching production-ready threshold

Top Components Needing Refinement:
  1. Lens (high priority)
     - needs_typography_fix
     - needs_tests
     - needs_migration_cleanup

  2. Jar (high priority)
     - needs_color_fix
     - needs_tests

  3. NewModule (high priority)
     - needs_stage2
```

## Per-Component Logic

### Status Derivation

A component is **"aligned"** when:
- ✅ Spec exists (docs/design/generated/specs/<Name>.md)
- ✅ Component code exists (frontend/src/components/<Name>/index.tsx)
- ✅ Tests exist (if target.tests ≠ "none")
- ✅ All dimension scores ≥ 0.8 (if audit exists)
- ✅ No hardcoded values (if target.tokens = "strict")
- ✅ Stage 2 complete (if target.stage2 = "complete")

Otherwise: **"needs_refinement"**

### Needs Flags

Computed from gaps:

| Flag | Condition |
|------|-----------|
| `needs_typography_fix` | typography score < 0.8 |
| `needs_color_fix` | color score < 0.8 |
| `needs_layout_refine` | layout score < 0.8 |
| `needs_botanical_integration` | [DEPRECATED_STYLE] score < 0.7 |
| `needs_migration_cleanup` | mode = "migrate" AND hardcoded_values = true |
| `needs_tests` | target.tests ≠ "none" AND no test file |
| `needs_stage2` | target.stage2 = "complete" AND (no mockup OR no code) |
| `needs_spec` | spec file missing |

### Dimension Scores

If audit JSON exists:
- **Score source**: `audit.dimensions.<dimension>.status`
- **Mapping**: pass=1.0, needs_refinement=0.7, fail=0.3
- **Alternative**: `audit.compliance_score / 100`

If no audit JSON:
- **All scores**: `null`
- **Iterations**: 0
- **Last audit**: `null`

## Global Metrics

### Overall Compliance
Percentage of components with `status = "aligned"`

```
overall_compliance = count(status = "aligned") / total_components
```

### Per-Dimension Averages
Average score across components with audit data:

```
typography_avg = mean(comp.scores.typography for comp in components if score exists)
color_avg = mean(comp.scores.color for comp in components if score exists)
layout_avg = mean(comp.scores.layout for comp in components if score exists)
botanical_avg = mean(comp.scores.[DEPRECATED_STYLE] for comp in components if score exists)
```

### Migration Compliance
Percentage of components using kerala-rage naming (not M3*):

```
migration = count(not name.startswith("M3")) / total_components
```

## Use Cases

### 1. Daily Status Check
```bash
python3 .claude/skills/compliance-dashboard/run.py
```

Get instant health snapshot. Identify which components need attention today.

### 2. CI/CD Integration
```bash
python3 .claude/skills/compliance-dashboard/run.py --json > compliance-report.json
```

Export JSON for automated dashboards, slack notifications, or PR comments.

### 3. Component Deep Dive
```bash
python3 .claude/skills/compliance-dashboard/run.py --component Lens --json
```

Analyze single component: what's missing? What audit scores exist? What needs to be done?

### 4. Compliance Thresholds
- 🟢 **Green** (≥80%): Production-ready
- 🟡 **Yellow** (60-79%): Approaching threshold
- 🔴 **Red** (<60%): Significant work needed

## Error Handling

| Error | Behavior |
|-------|----------|
| Missing `component-batch-plan.yaml` | Exit code 1 |
| `--component <Name>` not found | Exit code 1 |
| Missing audit JSON | Scores = null, no error |
| Missing component code/tests/specs | Flags = false, status = needs_refinement |
| Inventory script fails | Continue with empty inventory data |

## Integration with Other Skills

### With kerala-rage-visual-audit
After running `kerala-rage-visual-audit` on components, the tool automatically picks up audit JSON files from `docs/design/audits/` and includes scores in output.

### With simple-component-inventory.sh
Tool runs this script automatically to detect:
- Hardcoded colors/spacing/shadows
- Duplicate component names

### With component-batch-plan.yaml
Uses target state to determine:
- Whether tests are required
- Whether stage 2 is complete
- Token strictness level
- Component priority

## Example: Full Workflow

```bash
# 1. Run compliance dashboard
python3 .claude/skills/compliance-dashboard/run.py

# Output shows Lens needs refinement with needs_typography_fix

# 2. Run visual audit on Lens
python3 .claude/skills/kerala-rage-visual-audit/run.py --component Lens

# 3. Review audit results, create docs/design/audits/Lens.json

# 4. Re-run compliance dashboard
python3 .claude/skills/compliance-dashboard/run.py

# Output now includes Lens audit scores + status update
```

## Implementation

- **Language**: Python 3
- **Location**: `.claude/skills/compliance-dashboard/run.py`
- **Dependencies**: PyYAML, standard library
- **Runtime**: < 5 seconds (all components)

## Exit Codes

- **0**: Success (even if compliance is low)
- **1**: Error (missing files, invalid input)

## Limitations

✅ Tracks compliance across all components
✅ Integrates audit data automatically
✅ Detects hardcoded values and duplicates
✅ Validates against target state

❌ Cannot fix components (only identifies gaps)
❌ Requires manual audit JSON creation (can use kerala-rage-visual-audit skill)
❌ Metrics are relative to your standards, not benchmarks

## Next Steps

After running the dashboard:

1. **Review top-priority needs** (high priority + needs_refinement)
2. **Run visual audits** on components missing scores
3. **Create audit JSON files** (docs/design/audits/<Name>.json)
4. **Re-run dashboard** to track progress
5. **Celebrate milestones** (80% compliance reached!)

---

_Design systems are measured by their ability to guide consistent, excellent work. This dashboard shows whether you're achieving that._
