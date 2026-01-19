# Deployment Runbook

**Goal:** Clean build, green CI, production-ready deploy.

## Local Build Checklist

1) Install deps:
   - `yarn install --immutable`
   - `pnpm -C frontend install`
2) Frontend:
   - `pnpm -C frontend test`
   - `pnpm -C frontend build`
3) Functions:
   - `yarn workspace functions lint`
   - `yarn workspace functions build`
   - `yarn workspace functions test:ci`
4) Backend:
   - `pytest` (from `backend/`)
   - `mypy` (if configured)

## CI Trigger + Monitor

- Trigger: `gh workflow run ci.yml --ref develop`
- Monitor:
  - `gh run list --workflow ci.yml --limit 5`
  - `gh run view <run-id> --log`

## Deployment Readiness

- Verify `.env.example` is current.
- Check deploy workflows:
  - `.github/workflows/deploy.yml`
  - `.github/workflows/_reusable_deploy.yml`

## Release Tag

- `git tag -a vX.Y.Z -m "release: vX.Y.Z"`
- `git push origin vX.Y.Z`

## Claude Desktop Prompt (Token-Efficient)

“Confirm deployment readiness. Use filesystem MCP to read:
`docs/development/MASTER_MIGRATION_PLAN.md`, `docs/development/CI_COVERAGE_AUDIT.md`, `docs/deployment/DEPLOYMENT_STATUS.md` if present. Provide blockers and a short approval checklist.”

