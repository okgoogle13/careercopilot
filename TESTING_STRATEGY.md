# CareerCopilot Frontend Testing Strategy

## Goals
- Ensure reliability, maintainability, and future-proofing of the frontend codebase.
- Catch regressions early via CI and pre-commit hooks.
- Provide actionable feedback to developers and maintainers.

## Key Practices

### 1. Pre-commit Checks
- Husky runs `lint-staged` to lint and type-check staged files before commit.
- Prevents code with lint/type errors from entering the repository.

### 2. CI Workflow
- **Lock File Consistency:** CI fails if `package-lock.json` is out of sync with `package.json`.
- **Dependency Audit:** `npm audit` runs in CI to catch vulnerabilities.
- **Linting & Type Checking:** CI runs `npm run lint` and `npm run tsc`.
- **Unit & Integration Tests:** CI runs `vitest` with jsdom and coverage reporting.
- **Coverage Artifacts:** Coverage reports are uploaded for review.
- **Fail-Fast:** Lint/type/test failures stop the workflow early.

### 3. Coverage & Reporting
- Coverage is generated in CI and uploaded as an artifact.
- Coverage thresholds can be enforced in `vitest.config.ts`.

### 4. Static Analysis
- ESLint and TypeScript catch code quality and type issues.
- Lint-staged ensures only staged files are checked pre-commit.

### 5. Dependency Health
- `npm audit` runs in CI and security scan jobs.
- Vulnerabilities are surfaced for remediation.

### 6. Documentation & Onboarding
- This strategy is documented for team adoption.
- New contributors should review this file and CI logs for guidance.

## Future Improvements
- Integrate CodeQL or similar for deeper static analysis.
- Enforce coverage thresholds in CI.
- Add visual regression and e2e tests as needed.

---
_Last updated: June 2024_
