# Templates

Reserved for future UI template assets in the KR Solidarity v6.1 design system.

## Governance Rules

- Do **not** commit production assets here without first:
  1. Registering the asset in `frontend/public/assets/kr-solidarity-manifest.json`
  2. Creating a corresponding package entry in `asset-packages/KR-SOLID-{ID}/`
  3. Updating `docs/development/ASSET_GOVERNANCE.md`
- File naming must follow the canonical pattern: `{system-id}__{category}__template--{slug}--{version}.{ext}`
- All assets in this directory are considered **active** and will be served in production.
