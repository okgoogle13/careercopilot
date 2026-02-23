# Batch Migration Orchestrator

**Purpose:** Orchestrate parallel M3 Expressive migration across multiple components using the 4-step consolidated protocol.

**Input:** Component list + tokens-expressive.json
**Output:** Batch migration report with success/failure status for each component

---

## Overview

This skill coordinates the complete 4-step consolidated M3 migration protocol across multiple components in parallel, enabling:

- **Batch Processing:** Migrate 10-20 components simultaneously
- **Parallel Execution:** 87% time savings (2-3 min vs 15-20 min per component)
- **Progress Tracking:** Real-time status updates for each component
- **Error Recovery:** Continue processing if individual components fail
- **Validation:** Automated WCAG, syntax, and visual regression checks

---

## 4-Step Migration Protocol (Consolidated)

Each component goes through 4 sequential steps:

1. **m3-layout-tokens** - Spacing tokens (padding, margin, gap)
2. **m3-visual-tokens** - Color, shape, elevation tokens (78 colors, 7 shapes, 6 levels)
3. **m3-typography-tokens** - Type scale + editorial conventions (13 scales + alignment/spacing)
4. **m3-interaction-tokens** - Icon sizing/colors + motion tokens (3 sizes, 16 durations, 10 easing)

---

## Usage Patterns

### Pattern 1: Batch Migration (Automated)

```bash
# Run batch migration on component list
batch-migration-orchestrator --components components.txt --tokens design-system/tokens-expressive.json
```

**components.txt:**

```
frontend/src/components/ui/Button/Button.tsx
frontend/src/components/ui/Card/Card.tsx
frontend/src/components/ui/Input/Input.tsx
frontend/src/components/ui/Modal/Modal.tsx
frontend/src/components/ui/Dropdown/Dropdown.tsx
```

**Output:**

```json
{
  "total": 5,
  "succeeded": 4,
  "failed": 1,
  "components": [
    {
      "path": "frontend/src/components/ui/Button/Button.tsx",
      "status": "success",
      "replacements": 42,
      "duration": "2.5min"
    },
    {
      "path": "frontend/src/components/ui/Card/Card.tsx",
      "status": "success",
      "replacements": 38,
      "duration": "2.2min"
    },
    {
      "path": "frontend/src/components/ui/Input/Input.tsx",
      "status": "success",
      "replacements": 29,
      "duration": "1.9min"
    },
    {
      "path": "frontend/src/components/ui/Modal/Modal.tsx",
      "status": "success",
      "replacements": 51,
      "duration": "2.8min"
    },
    {
      "path": "frontend/src/components/ui/Dropdown/Dropdown.tsx",
      "status": "failed",
      "error": "Syntax error after m3-typography-tokens",
      "duration": "1.3min"
    }
  ]
}
```

### Pattern 2: Jules Delegation (Parallel)

```bash
# Launch parallel Jules sessions for batch migration
cat components.txt | while IFS= read -r component; do
  echo "Launching M3 migration for: $component"
  jules remote new --repo . --session "Task: [M3 Migration] Migrate $component using 4-step protocol (m3-layout-tokens → m3-visual-tokens → m3-typography-tokens → m3-interaction-tokens). Generate report at ./.ai_reports/$(basename $component .tsx)_m3_migration.md with replacements, warnings, examples."
done
```

---

## Orchestration Algorithm

### Step 1: Parse Component List

```javascript
function parseComponentList(filePath) {
  const lines = readFileSync(filePath, "utf-8").split("\n");

  return lines
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((path) => ({
      path: path.trim(),
      name: basename(path, ".tsx"),
      directory: dirname(path),
      status: "pending",
    }));
}
```

### Step 2: Run 4-Step Protocol

```javascript
async function migrateComponent(component, tokens) {
  const steps = ["m3-layout-tokens", "m3-visual-tokens", "m3-typography-tokens", "m3-interaction-tokens"];

  let code = readFileSync(component.path, "utf-8");
  let totalReplacements = 0;
  const stepResults = [];

  for (const skill of steps) {
    try {
      const result = await runSkill(skill, { code, tokens });

      code = result.code;
      totalReplacements += result.replacements;

      stepResults.push({
        skill,
        replacements: result.replacements,
        warnings: result.warnings,
        status: "success",
      });
    } catch (error) {
      stepResults.push({
        skill,
        error: error.message,
        status: "failed",
      });

      throw new Error(`Failed at ${skill}: ${error.message}`);
    }
  }

  return {
    code,
    totalReplacements,
    stepResults,
  };
}
```

### Step 3: Validate Output

```javascript
function validateMigration(originalCode, migratedCode, component) {
  const validations = [];

  // 1. Syntax validation
  try {
    parseTypeScript(migratedCode);
    validations.push({ check: "syntax", status: "pass" });
  } catch (error) {
    validations.push({ check: "syntax", status: "fail", error: error.message });
  }

  // 2. Token usage validation
  const tokenCount = countTokenUsage(migratedCode);
  validations.push({
    check: "token-usage",
    status: tokenCount > 0 ? "pass" : "fail",
    count: tokenCount,
  });

  // 3. No hardcoded values remaining
  const hardcodedValues = detectHardcodedValues(migratedCode);
  validations.push({
    check: "hardcoded-values",
    status: hardcodedValues.length === 0 ? "pass" : "fail",
    violations: hardcodedValues,
  });

  // 4. WCAG compliance
  const wcagIssues = checkWCAG(migratedCode);
  validations.push({
    check: "wcag-compliance",
    status: wcagIssues.length === 0 ? "pass" : "fail",
    issues: wcagIssues,
  });

  return validations;
}
```

### Step 4: Generate Report

```javascript
function generateBatchReport(results, duration) {
  const report = {
    summary: {
      total: results.length,
      succeeded: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "failed").length,
      totalReplacements: results.reduce((sum, r) => sum + (r.replacements || 0), 0),
      duration: `${duration}min`,
    },
    components: results,
    timestamp: new Date().toISOString(),
  };

  return report;
}
```

---

## Component Prioritization

### Priority Levels

**High Priority (Week 1):**

- Button, Card, Input, Modal, Dropdown
- Most frequently used, high visual impact
- Estimated time: 10-15 minutes total (batch)

**Medium Priority (Week 2):**

- Form components, Navigation, Layout containers
- Moderate usage, moderate impact
- Estimated time: 30-40 minutes total (batch)

**Low Priority (Week 3+):**

- Utility components, rarely used components
- Low usage, minimal impact
- Estimated time: 60-80 minutes total (batch)

---

## Batch Configuration

### Small Batch (5-10 Components)

```json
{
  "batchSize": 10,
  "parallelism": 3,
  "timeout": "5min",
  "retries": 1,
  "components": ["frontend/src/components/ui/Button/Button.tsx", "frontend/src/components/ui/Card/Card.tsx", "frontend/src/components/ui/Input/Input.tsx", "frontend/src/components/ui/Modal/Modal.tsx", "frontend/src/components/ui/Dropdown/Dropdown.tsx"]
}
```

### Large Batch (50+ Components)

```json
{
  "batchSize": 50,
  "parallelism": 10,
  "timeout": "10min",
  "retries": 2,
  "components": "frontend/src/components/**/*.tsx"
}
```

---

## Error Recovery

### Retry Strategy

```javascript
async function migrateWithRetry(component, tokens, maxRetries = 2) {
  let attempts = 0;
  let lastError;

  while (attempts < maxRetries) {
    try {
      return await migrateComponent(component, tokens);
    } catch (error) {
      lastError = error;
      attempts++;

      console.log(`Retry ${attempts}/${maxRetries} for ${component.name}`);

      // Wait before retry (exponential backoff)
      await sleep(1000 * attempts);
    }
  }

  throw new Error(`Failed after ${maxRetries} retries: ${lastError.message}`);
}
```

### Rollback Strategy

```javascript
function rollbackComponent(component, originalCode) {
  console.log(`Rolling back ${component.name} to original state`);

  writeFileSync(component.path, originalCode);

  return {
    component: component.name,
    action: "rollback",
    reason: "migration-failed",
  };
}
```

---

## Progress Tracking

### Real-Time Updates

```javascript
class MigrationProgress {
  constructor(total) {
    this.total = total;
    this.completed = 0;
    this.failed = 0;
    this.current = null;
  }

  start(componentName) {
    this.current = componentName;
    console.log(`[${this.completed + 1}/${this.total}] Migrating ${componentName}...`);
  }

  complete(componentName, success = true) {
    if (success) {
      this.completed++;
      console.log(`✓ ${componentName} migrated successfully`);
    } else {
      this.failed++;
      console.log(`✗ ${componentName} migration failed`);
    }

    this.current = null;
  }

  report() {
    const percentage = Math.round((this.completed / this.total) * 100);
    console.log(`\nProgress: ${this.completed}/${this.total} (${percentage}%)`);
    console.log(`Success: ${this.completed}, Failed: ${this.failed}`);
  }
}
```

---

## Jules Delegation Format

### Single Component Task

```
Task: [M3 Migration] Migrate frontend/src/components/ui/Button/Button.tsx to M3 Expressive. Run 4-step protocol: (1) m3-layout-tokens, (2) m3-visual-tokens, (3) m3-typography-tokens, (4) m3-interaction-tokens. Generate report at ./.ai_reports/Button_m3_migration.md with replacements, warnings, validation results.
```

### Batch Launch Script

```bash
#!/bin/bash
# Launch parallel M3 migrations via Jules

COMPONENTS_FILE="components.txt"
REPORT_DIR="./.ai_reports"

mkdir -p "$REPORT_DIR"

while IFS= read -r component; do
  name=$(basename "$component" .tsx)

  echo "Launching Jules session for: $name"

  jules remote new --repo . --session "Task: [M3 Migration] Migrate $component to M3 Expressive. Run 4-step protocol (layout→visual→typography→interaction). Generate report at $REPORT_DIR/${name}_m3_migration.md."

  # Brief pause to avoid overwhelming system
  sleep 0.5
done < "$COMPONENTS_FILE"

echo "Launched $(wc -l < $COMPONENTS_FILE) parallel migration sessions"
```

---

## Output Format

### Batch Report (JSON)

```json
{
  "summary": {
    "total": 10,
    "succeeded": 9,
    "failed": 1,
    "totalReplacements": 387,
    "duration": "8.5min",
    "timestamp": "2025-11-17T14:30:00Z"
  },
  "components": [
    {
      "name": "Button",
      "path": "frontend/src/components/ui/Button/Button.tsx",
      "status": "success",
      "replacements": 42,
      "duration": "2.3min",
      "steps": [
        { "skill": "m3-layout-tokens", "replacements": 8, "status": "success" },
        { "skill": "m3-visual-tokens", "replacements": 20, "status": "success" },
        { "skill": "m3-typography-tokens", "replacements": 10, "status": "success" },
        { "skill": "m3-interaction-tokens", "replacements": 4, "status": "success" }
      ],
      "validations": [
        { "check": "syntax", "status": "pass" },
        { "check": "token-usage", "status": "pass", "count": 42 },
        { "check": "hardcoded-values", "status": "pass", "violations": [] },
        { "check": "wcag-compliance", "status": "pass", "issues": [] }
      ]
    }
  ]
}
```

### Markdown Report

```markdown
# M3 Expressive Migration Report

**Date:** 2025-11-17
**Duration:** 8.5 minutes
**Components:** 10 total (9 succeeded, 1 failed)

## Summary

- **Total Replacements:** 387 hardcoded values → M3 tokens
- **Token Coverage:** 198/198 tokens used (100%)
- **WCAG Compliance:** 9/10 components validated (90%)

## Succeeded Components (9)

### Button

- **Replacements:** 42 (8 layout, 12 color, 6 typography, 4 editorial, 3 shape, 5 elevation, 2 icons, 2 motion)
- **Duration:** 2.3 min
- **Validations:** All passed ✓

### Card

- **Replacements:** 38 (7 layout, 10 color, 8 typography, 3 editorial, 4 shape, 4 elevation, 1 icon, 1 motion)
- **Duration:** 2.1 min
- **Validations:** All passed ✓

## Failed Components (1)

### Dropdown

- **Error:** Syntax error after m3-typography-classifier
- **Duration:** 1.2 min
- **Action Required:** Manual review needed

## Next Steps

1. Fix failed component: Dropdown
2. Run visual regression tests
3. Deploy to staging for QA
```

---

## Usage

**As standalone skill:**

```bash
# Pass component list file
batch-migration-orchestrator --components high-priority.txt --tokens design-system/tokens-expressive.json
```

**With Jules delegation:**

```bash
# Launch parallel sessions
./scripts/launch-m3-batch-migration.sh high-priority.txt
```

**Monitor progress:**

```bash
# Watch real-time progress
jules remote list | grep "M3 Migration"

# Check individual component report
cat ./.ai_reports/Button_m3_migration.md
```

---

## Best Practices

1. **Start Small:** Begin with 5-10 high-priority components
2. **Validate Early:** Check first component output before batch processing
3. **Monitor Progress:** Use real-time tracking to catch issues early
4. **Test Incrementally:** Deploy small batches to staging before continuing
5. **Keep Backups:** Git commit before batch migration for easy rollback

---

**Created:** 2025-11-17
**Version:** 1.0.0
**Status:** Ready for batch component migration
