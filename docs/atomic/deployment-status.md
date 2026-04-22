# Deployment Status Cheat Sheet

**Goal:** Quick checks for deploy readiness and status.

## Local Readiness

- Clean tree: `git status -sb`
- Frontend build: `pnpm -C frontend build`
- Backend tests: `pytest backend/app/tests/`
- Functions build: `yarn workspace functions build`

## CI Status

- Trigger: `gh workflow run ci.yml --ref develop`
- Monitor: `gh run list --workflow ci.yml --limit 5`

## Deployment Workflows

- `.github/workflows/deploy.yml`
- `.github/workflows/_reusable_deploy.yml`

## Notes

- Ensure `.env.example` is current.
- Verify secrets are configured in GitHub.
