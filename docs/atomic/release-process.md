# Release Process Cheat Sheet

**Goal:** Tag, deploy, and validate releases safely.

## Steps

1) Ensure CI is green on `develop`.
2) Tag release:
   - `git tag -a vX.Y.Z -m "release: vX.Y.Z"`
   - `git push origin vX.Y.Z`
3) Run deployment workflow:
   - `.github/workflows/deploy.yml`
4) Post-deploy smoke check:
   - key routes, core flows, no runtime errors

## Rollback

- Revert tag if needed: `git tag -d vX.Y.Z` (local) and delete remote tag if required.

