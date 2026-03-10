# PR Plan

## PR-1: Governance + Enforcement

- Land `MIGRATION_GUARDRAILS.md`, `MIGRATION_TRACKER.md`, and this PR plan
- Implement ESLint migration rules and deterministic tests
- Implement the design-audit package and CLI
- Lock audit include and exclude globs plus boundary-check semantics

## PR-2: Routing + Flags + /login

- Add `featureFlags.ts`, `RouteGate.tsx`, `FeaturesRouter.tsx`, `ScreensRouter.tsx`, `App.tsx`, and `routes.tsx`
- Keep `/login` on `LoginLegacy` by default
- Add `LoginScreen.tsx` as the first migrated screen

## PR-3: CI + Hooks + Runbook

- Wire `lint`, `type-check`, `design-audit`, and `test` into `.github/workflows/design-compliance.yml`
- Update `.husky/pre-commit` to run kit-local validation
- Confirm the tracker reflects `/login` readiness and rollback state

## PR-4: Optional Custom Skills

- Add `.claude/skills/migration-audit/SKILL.md`
- Add `.claude/skills/route-migration/SKILL.md`
- Add `.claude/skills/token-enforcement/SKILL.md`
- Keep them optional so the migration still runs without skills

## PR-5: Factory Sprint 1 - `migrate:screen`

- Add `tools/migrate-screen.js` as the first factory primitive
- Generate new screen shells from the current `LoginScreen.tsx` pattern
- Keep generation neutral and token-safe; do not invent feature-specific business UI
- Fail safely when target screens already exist
- Queue `audit:legacy` and `generate:wireframe` for later sprints

## PR-6: Factory Sprint 2 - `audit:legacy`

- Extend the existing design-audit package with a legacy-pattern mode
- Add `tools/design-audit/bin/audit-legacy.ts`
- Add `npm run audit:legacy`
- Scan for legacy aliases and style markers such as `pebbleSurge01`, `scaffoldSlab01`, `#1A1714`, `Inter`, and `Roboto`
- Keep `generate:wireframe` deferred until its output contract is defined

## PR-7: Factory Sprint 3 - `generate:wireframe`

- Add `tools/generate-wireframe.js` as a kit-local wireframe artifact generator
- Write JSON artifacts to `docs/design-system/wireframes/`
- Derive stable screen metadata from existing `apps/web/src/screens/*Screen.tsx` files
- Keep the output documentation-only; it must not affect route behavior or runtime bundles
- Preserve KR Solidarity constraints in the generated contract: semantic-token-only, zero-flora, and deprecated token bans

## PR-8: Routing + Flags + /register

- Add `register` to the typed feature-flag contract with default `false`
- Route `/register` through `RouteGate` using the same reversible fallback model as `/login`
- Replace the register placeholder screen with a tokenized migrated implementation
- Keep `RegisterLegacy` available until the flag flips
- Export a `register` wireframe JSON artifact from the current migrated screen

## PR-9: Factory Testing and Regression Coverage

- Add a factory-specific test entrypoint with `npm run test:factory`
- Lock in the current `migrate:screen` contract: neutral placeholder output and refusal to overwrite existing screens like `DashboardScreen.tsx`
- Validate generated output for local UI imports, renamed screen exports, semantic-token-safe structure, and absence of banned legacy terms or hardcoded color literals
- Keep the manual verification recipe aligned to current kit behavior rather than rich dashboard generation assumptions

## PR-10: Routing + Flags + /dashboard

- Add `dashboard` to the typed feature-flag contract with default `false`
- Route `/dashboard` through `RouteGate` using the same reversible fallback model as `/login` and `/register`
- Replace the placeholder dashboard screen with a tokenized migrated implementation
- Keep `DashboardLegacy` available until the flag flips
- Export a `dashboard` wireframe JSON artifact from the current migrated screen

## /login Cutover Runbook

### Preflight

- `node ../node_modules/eslint/bin/eslint.js apps/web/src apps/web/vite.config.ts tools/design-audit/bin packages/design-audit/src packages/eslint-plugin-kerala-rage --config eslint.config.mjs`
- `node ../node_modules/typescript/bin/tsc -p apps/web/tsconfig.json --noEmit`
- `node ../node_modules/typescript/bin/tsc -p packages/design-audit/tsconfig.json --noEmit`
- `node --import ../node_modules/tsx/dist/loader.mjs tools/design-audit/bin/audit-design-compliance.ts --root .`
- `node ../node_modules/vitest/vitest.mjs run --config vitest.config.ts`

### Staging Flag-On

- Keep `DEFAULT_FEATURE_FLAGS.login = false` in the committed baseline
- Validate staging by passing `flags={{ login: true }}` into `App` or `RouteGate`
- Confirm `/login` renders `LoginScreen` and still navigates to `/register`

### Production Rollout

- Flip only the `login` feature flag source
- Verify `/login` renders the migrated screen
- Re-run audit and smoke tests
- Confirm the JSON audit reports zero violations

### Rollback

- Set the `login` flag back to `false`
- Verify `/login` renders `LoginLegacy`
- Record the rollback event in `MIGRATION_TRACKER.md`

## Optional Custom Skills

- `.claude/skills/migration-audit/SKILL.md`
- `.claude/skills/route-migration/SKILL.md`
- `.claude/skills/token-enforcement/SKILL.md`

These skills are optional accelerators. Core migration remains executable without them.
