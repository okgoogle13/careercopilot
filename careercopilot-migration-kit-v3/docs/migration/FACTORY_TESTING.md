# Factory Testing

## Current Contract

- `migrate:screen` generates a neutral placeholder screen from `apps/web/src/screens/LoginScreen.tsx`
- Generated screens import local UI primitives from `apps/web/src/components/ui/*`
- Generated output must not include hardcoded hex, rgb, or hsl color literals
- Generated output must not include banned legacy aliases or deprecated archetype names
- The generator refuses to overwrite existing screens such as `DashboardScreen.tsx`

## Correct Manual Verification

Use a non-existent route id for successful generation, such as `job-board`.

```bash
cd careercopilot-migration-kit-v3
npm run migrate:screen -- job-board
npm run test:factory
npm run verify
```

Expected success checks:

- `apps/web/src/screens/JobBoardScreen.tsx` exists
- file exports `JobBoardScreen`
- file imports `March`, `Placard`, and `Strike` from local `../components/ui/*` paths
- file contains no `LoginScreen` export, no `#1A1714`, no `rgb(...)`, no `hsl(...)`
- file contains no `pebbleSurge01`, `scaffoldSlab01`, `Seed`, `Leaf`, `Jar`, or `Cabinet`

## Collision Regression

Use `dashboard` to verify non-overwrite behavior:

```bash
cd careercopilot-migration-kit-v3
npm run migrate:screen -- dashboard
```

Expected result:

- command exits non-zero
- error states that the target screen already exists

This collision check remains valid even after dashboard migration:
- `DashboardScreen.tsx` is now a real migrated route target
- the generator must still refuse overwrite so factory usage cannot clobber an active route implementation

## Notes

- Do not expect feature-complete dashboard generation in this sprint
- Do not expect `@careercopilot/design-tokens` or `@careercopilot/ui` imports in generated files
- Do not use `npm run dev` as proof that a new generated route is active unless routing has been explicitly wired for that route
