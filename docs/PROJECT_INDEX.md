# Project Index

**Purpose:** Minimal, high-signal map of the repo for quick orientation.

## Core Areas

- `frontend/` React app (Vite) + UI components + assets
- `backend/` FastAPI + Genkit flows + workers
- `functions/` Firebase functions (Node/TS)
- `docs/development/` Migration status, QA plans, CI audits
- `servers/` MCP servers (flash-sidekick, docker)

## Primary Entry Points

- Frontend app: `frontend/src/main.tsx`, `frontend/src/App.tsx`
- Backend app: `backend/app/main.py`
- Functions entry: `functions/src/index.ts`

## Atomic Docs (Single Source)

- `docs/atomic/README.md`
- `docs/atomic/deployment.md`
- `docs/atomic/frontend-components.md`
- `docs/atomic/security.md`
- `docs/atomic/backend-ai-genkit.md`
- `docs/atomic/qa-ui-testing.md`
- `docs/atomic/mcp-tooling.md`
- `docs/atomic/architecture.md`
- `docs/atomic/design-tokens.md`
- `docs/atomic/known-issues.md`
- `docs/atomic/testing.md`
- `docs/atomic/ci-workflows.md`
- `docs/atomic/deployment-status.md`
- `docs/atomic/data-models.md`
- `docs/atomic/api-contracts.md`
- `docs/atomic/release-process.md`
- `docs/atomic/observability.md`
- `docs/atomic/env-config.md`
- `docs/atomic/docs-policy.md`

## Current Plans/Queues

- `docs/development/MASTER_MIGRATION_PLAN.md`
- `docs/development/FRONTEND_MIGRATION_QUEUE.md`
- `docs/development/GENKIT_MIGRATION_QUEUE.md`
- `docs/development/CI_COVERAGE_AUDIT.md`

## Quick Commands

- Frontend build: `pnpm -C frontend build`
- Frontend tests: `pnpm -C frontend test`
- Functions build: `yarn workspace functions build`
- Backend tests: `pytest` (from `backend/`)
