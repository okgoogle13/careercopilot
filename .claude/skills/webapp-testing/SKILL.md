---
name: webapp-testing
description: Runs or writes Playwright tests for the 'careercopilot' webapp. Use when
  asked to 'run playwright' or 'write a new e2e test'.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

## Purpose

Runs or writes Playwright E2E tests for the CareerCopilot webapp, ensuring frontend stability and functionality.

## When to Use

- When asked to "run playwright" or "run e2e tests".
- When writing a new E2E test for a feature or user flow.
- When debugging frontend regressions via automated testing.

## Process

1. **User Intent**: Ask whether to "run" existing tests or "write" a new one.
2. **If "Run"**:
   - Confirm command (default: `yarn playwright test`).
   - Execute and report output.
3. **If "Write"**:
   - Define test scope and file name.
   - Use stable `data-testid` selectors from `references/careercopilot-selectors.md`.
   - Implement test in `e2e/`.
