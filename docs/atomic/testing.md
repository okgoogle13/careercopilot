# Testing (Canonical)

**Goal:** Single reference for test commands + coverage expectations.

## Quick Commands

- Frontend tests: `pnpm -C frontend test`
- Frontend coverage: `pnpm -C frontend test:coverage`
- Backend tests: `pytest backend/app/tests/`
- E2E (Playwright): `pnpm -C frontend playwright test`
- Storybook: `pnpm -C frontend storybook`
- Build Storybook: `pnpm -C frontend build-storybook`

## Coverage Targets

- Frontend Components: 50%
- Backend APIs: 95%
- E2E Flows: 95%
- Storybook coverage: 40%

## Notes

- Prefer `pnpm -C frontend` commands to keep workspace aligned.
- Use Playwright MCP for UI regression checks.

