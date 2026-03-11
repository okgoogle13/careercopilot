# Screen: /dashboard

`/dashboard` is now migrated behind `RouteGate` with the committed default flag still set to `false`.

Current implementation:

- migrated screen: `apps/web/src/screens/DashboardScreen.tsx`
- legacy fallback: `apps/web/src/features/DashboardLegacy.tsx`
- wireframe artifact: `docs/design-system/wireframes/dashboard.json`

Current expectations:

- keep the `/dashboard` URL unchanged
- preserve legacy fallback until explicit flag flip
- keep the migrated dashboard in the same expressive visual family as `/login` and `/register`
- audit `/dashboard` against `dashboard-benchmark-v1`

Current migrated shell:

- eyebrow: `Movement Overview`
- title: `Hold The Movement In One View`
- primary action: `Review Active Roles`
- secondary action: `Open Draft Queue`

Copy posture:

- keep user-facing status updates concrete and task-oriented
- remove rollout, rollback, migration, and placeholder language from rendered strings
- keep the dashboard framed as a coordinated movement overview rather than an administrative board
