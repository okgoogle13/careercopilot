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
