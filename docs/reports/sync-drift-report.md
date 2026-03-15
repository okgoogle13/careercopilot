# Sync Drift Report
*Generated on 2026-03-15*

This report details the misalignments between the Three Truth Layers (Runtime, Design, Capability) found during the implementation of the Truth Enforcer CI checks.

## 1. Route Integrity Warnings (Runtime vs Capability)

The `check-route-integrity.ts` CI script found the following warnings where routes are sourced irregularly (not from the `features/` directory format).

*   `⚠️ [WARN] /onboarding`: Component "UNKNOWN" cannot be resolved. (non-features/ source — migration required)

## 2. Orphaned Screens (Design Truth)

The `detect-orphans.ts` scan revealed 6 screens in `frontend/src/screens/` that exist and have configurations, but are completely disconnected from `App.tsx` and the `route-registry`:

1.  `04_ingestion`
2.  `06_lookout`
3.  `07_kanban`
4.  `08_workbench`
5.  `09_finalization`
6.  `10_settings`

These currently have prototype routing logic mapping them to `/kr/*`, but they do not connect to the actual production routes.

## 3. Orphaned Feature Directories (Runtime Truth)

We have feature subdirectories that export components, but are disconnected from any active route in the registry:

1.  `frontend/src/features/KrDark`
2.  `frontend/src/features/editor`
3.  `frontend/src/features/gallery`
4.  `frontend/src/features/ingestion`
5.  `frontend/src/features/jobs`
6.  `frontend/src/features/sandbox`

## Next Steps to Align Layers

1.  **Resolve the `/onboarding` Route:** Update `route-registry.ts` to map `/onboarding` to its correct component path, replacing the `UNKNOWN` placeholder.
2.  **Reconnect Screens:** Promote the orphaned `04_ingestion`, `06_lookout`, etc. screens from prototypes to their canonical production routes, or remove them if deprecated.
3.  **Triage Feature Dirs:** Evaluate the 6 orphaned feature directories and delete them if dead, or map them to new routes.
