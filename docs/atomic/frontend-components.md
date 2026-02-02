# Frontend Components

**Goal:** Maintain an accurate component inventory and safe migration workflow.

## Inventory

- Generate: `cd frontend && npx ts-node scripts/component-inventory.ts`
- Output: `frontend/component-inventory.json`
- Queue: `docs/development/FRONTEND_MIGRATION_QUEUE.md`

## Migration Workflow

- Dry run: `npx ts-node scripts/safe-migrate-component.ts <Component> --dry-run`
- Migrate: `npx ts-node scripts/safe-migrate-component.ts <Component>`
- Verify tests + Storybook after each component.

## Storybook

- Run: `pnpm -C frontend storybook`
- Build: `pnpm -C frontend build-storybook`

## Claude Desktop Prompt (Token-Efficient)

“Review component migration queue and missing tests/stories. Use filesystem MCP to read:
`docs/development/FRONTEND_MIGRATION_QUEUE.md` and `docs/development/FRONTEND_MIGRATION_STATUS.md`.
Return: prioritized actions + missing coverage list.”

