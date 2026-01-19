# Known Issues

**Purpose:** Current blockers and items to watch during QA/deploy.

## Build/CI

- Storybook build/test is not currently part of CI. See `docs/development/CI_COVERAGE_AUDIT.md`.

## MCP

- Ensure MCP servers are running after config changes:
  - `flash-sidekick-fast`
  - `flash-sidekick`
  - `filesystem`
  - `playwright`

## Frontend

- Component migration coverage is incomplete. See `docs/development/FRONTEND_MIGRATION_QUEUE.md`.

## Backend

- Legacy AI logic still exists in `backend/app/core` and `backend/app/services`.
  - Migration queue: `docs/development/GENKIT_MIGRATION_QUEUE.md`.

