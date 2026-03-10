# Feature Flags

`featureFlags.ts` is the kit-local contract for route migration switches.

- `DEFAULT_FEATURE_FLAGS.login` is `false`
- `getFeatureFlags()` merges deterministic defaults with local overrides
- `isScreenEnabled('login')` is the only supported cutover check in v1

The first cutover path is:

`/login` → `RouteGate` → `LoginLegacy` or `LoginScreen`
