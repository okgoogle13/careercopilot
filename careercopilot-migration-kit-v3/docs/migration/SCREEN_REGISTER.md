# Screen: /register

- Legacy implementation: `apps/web/src/features/RegisterLegacy.tsx`
- Migrated implementation: `apps/web/src/screens/RegisterScreen.tsx`
- Cutover mechanism: `apps/web/src/router/RouteGate.tsx`
- Default flag state: `DEFAULT_FEATURE_FLAGS.register = false`
- Wireframe artifact: `docs/design-system/wireframes/register.json`

Current migrated shell:

- eyebrow: `New Worker Entry`
- title: `Claim Your Worker Portal`
- primary action: `Create The Worker Account`
- secondary action: `Back To Sign In`

The migrated screen preserves the route URL and register interaction surface while keeping legacy fallback as the committed baseline until the flag flips.
