# Screen: /login

- Legacy implementation: `apps/web/src/features/LoginLegacy.tsx`
- Migrated implementation: `apps/web/src/screens/LoginScreen.tsx`
- Cutover mechanism: `apps/web/src/router/RouteGate.tsx`
- Default flag state: `DEFAULT_FEATURE_FLAGS.login = false`
- Wireframe artifact: `docs/design-system/wireframes/login.json`

Current migrated shell:

- eyebrow: `Worker Access`
- title: `Step Back Into The Worker Portal`
- primary action: `Enter The Workspace`
- secondary action: `Open Registration`

The migrated screen preserves the route URL and login interaction surface while replacing presentation with canonical semantic tokens and the newer expressive auth shell.
