# Routing

The migration kit preserves the route URL and changes only the rendered implementation.

- `/login` is routed through `ScreensRouter`
- `ScreensRouter` delegates to `RouteGate`
- `RouteGate` chooses `LoginLegacy` or `LoginScreen`
- unknown routes redirect to `/login`

This keeps the migration incremental and reversible.
