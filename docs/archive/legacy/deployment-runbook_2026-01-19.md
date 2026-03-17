# Deployment Runbook (Concise)

**Goal:** Clean build + green CI + production deploy.

## Preflight

1) Ensure working tree is clean or changes are scoped to a deploy branch.
2) Install deps:
   - `yarn install --immutable`
   - `pnpm -C frontend install` (if using pnpm for frontend)
3) Backend env: activate venv and install requirements.

## Local Verification

- Frontend:
  - `pnpm -C frontend test`
  - `pnpm -C frontend build`
- Functions:
  - `yarn workspace functions lint`
  - `yarn workspace functions build`
  - `yarn workspace functions test:ci`
- Backend:
  - `pytest` (from `backend/`)
  - `mypy` (if configured)

## CI

- Trigger CI:
  - `gh workflow run ci.yml --ref develop`
- Monitor:
  - `gh run list --workflow ci.yml --limit 5`
  - `gh run view <run-id> --log`

## Deploy

- Confirm `.env.example` + deployment workflows are current:
  - `.github/workflows/deploy.yml`
  - `.github/workflows/_reusable_deploy.yml`
- Tag + push:
  - `git tag -a vX.Y.Z -m "release: vX.Y.Z"`
  - `git push origin vX.Y.Z`
