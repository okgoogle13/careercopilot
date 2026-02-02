# CI Coverage Audit

**Last Updated:** 2026-01-19  
**Scope:** `.github/workflows/*` coverage vs required test strategy.

## Present Coverage

### Frontend
- **Tests:** `ci.yml` runs `yarn workspace careercopilot-frontend test`
- **Build:** `ci.yml` runs `yarn workspace careercopilot-frontend build`
- **E2E:** `ci.yml` runs Playwright (cached browser deps)
- **UAT/Visual:** `automated-uat.yml` runs targeted Playwright and visual updates

### Functions
- **Lint/Build/Test:** `ci.yml` runs `yarn workspace functions lint/build/test:ci`

### Backend
- **Static checks/tests:** `ci.yml` includes backend static checks + tests (pytest/mypy)

### Firestore Rules / Extension
- **Firestore rules tests:** `ci.yml` includes rules tests
- **Chrome extension:** `ci.yml` includes build job

## Gaps

- **Storybook build/test** is not part of CI. Only `auto-fix.yml` checks for missing stories, not build or tests.

## Recommended Additions

1) Add a `storybook-build` job to `ci.yml`:
   - `yarn workspace careercopilot-frontend build-storybook`
2) Optional: add `storybook-test` job using `@storybook/test` runner.

## Workflow Files Reviewed

- `.github/workflows/ci.yml`
- `.github/workflows/automated-uat.yml`
- `.github/workflows/auto-fix.yml`
- `.github/workflows/unit-test.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/docker-publish.yml`

