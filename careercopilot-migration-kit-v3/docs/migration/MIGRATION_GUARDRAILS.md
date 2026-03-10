# Migration Guardrails

## Canonical Sources

The migration kit may only reference these parent-repo token sources:

- `frontend/src/design/tokens/tokens.json`
- `frontend/src/design/styles/design-tokens.css`

No second token source of truth may be introduced inside `careercopilot-migration-kit-v3`.

## Boundary Contract

- `careercopilot-migration-kit-v3` is intentionally isolated for implementation, testing, and rollout rehearsal.
- `frontend/` remains the source of truth for KR Solidarity canon and current `/login` behavior.
- `/login` must preserve legacy fallback until `DEFAULT_FEATURE_FLAGS.login` is flipped.
- `RouteGate` is the only cutover mechanism for `/login`.
- The migration remains executable without custom skills.

## KR Solidarity Enforcement

- Use semantic tokens only: `--sys-color-*`, `--sys-shape-*`, `--sys-type-*`
- No hardcoded `#hex`, `rgb(a)`, or `hsl(a)` values in migrated screen code
- Zero-flora enforcement:
  - no botanical references
  - no flora-related identifiers
  - no gum leaf references
- Deprecated tokens are banned:
  - `labWrenMetalBlue`
  - `GumLeafGreen`
  - `WattleGold`
  - `inkGreen`
- Deprecated archetype names are banned in new migration code:
  - `Jar`
  - `Cabinet`
  - `Seed`
  - `Leaf`

## Audit Scope

Default include globs:

- `apps/web/src/**/*.{ts,tsx,js,jsx}`
- `packages/eslint-plugin-kerala-rage/**/*.js`
- `packages/design-audit/src/**/*.ts`
- `tools/design-audit/bin/**/*.ts`

Default exclude globs:

- `**/node_modules/**`
- `**/dist/**`
- `**/build/**`
- `**/.turbo/**`
- `**/coverage/**`
- `**/*.stories.*`
- `**/*.snap`
- `**/tests/**`
- `**/*.test.*`
- `**/*.spec.*`
- `packages/eslint-plugin-kerala-rage/tests/**/*.js`
- `frontend/src/design/tokens/tokens.json`
- `frontend/src/design/styles/design-tokens.css`
- `docs/archive/**`
- `docs/reports/archive/**`

Optional boundary-check mode may inspect referenced parent-repo files, but it must not widen the default migration scope into unrelated history or archive paths.

## Route Fallback Rule

- `/login` renders `LoginLegacy` while `DEFAULT_FEATURE_FLAGS.login` is `false`
- `/login` renders `LoginScreen` when the `login` flag is enabled
- The route path must not change
- Rollback must be one flag change, not a code revert

## Runbook Reference

The `/login` cutover and rollback runbook is maintained in `docs/migration/PR_PLAN.md`.

## Optional Custom Skills

Optional accelerators live in the parent repo:

- `.claude/skills/migration-audit/SKILL.md`
- `.claude/skills/route-migration/SKILL.md`
- `.claude/skills/token-enforcement/SKILL.md`

These skills assist consistency but are not required to execute the migration.
