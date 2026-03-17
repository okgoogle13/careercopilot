# CI Workflows Cheat Sheet

**Goal:** Fast reference for triggering and diagnosing CI.

## Workflows

- `.github/workflows/ci.yml`
- `.github/workflows/automated-uat.yml`
- `.github/workflows/auto-fix.yml`
- `.github/workflows/unit-test.yml`
- `.github/workflows/deploy.yml`

## Trigger + Monitor

- Trigger CI: `gh workflow run ci.yml --ref develop`
- List runs: `gh run list --workflow ci.yml --limit 5`
- View logs: `gh run view <run-id> --log`

## Common Jobs

- Frontend test/build
- Backend checks (pytest/mypy)
- Functions lint/build/test
- Playwright E2E
