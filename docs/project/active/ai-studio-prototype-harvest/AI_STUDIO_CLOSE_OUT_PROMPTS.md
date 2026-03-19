# AI Studio Prototype Stabilization Prompt

## Status

- This document supersedes the prior close-out prompt that pushed adaptive shell and route normalization.
- The prototype is a `support_reference`, not runtime truth.
- The old local checkout at `/Users/okgoogle13/Downloads/careercopilot-aistud` was deleted and must not be referenced.
- Do not edit the main CareerCopilot repo from AI Studio.

## Gemini / AI Studio Prompt

```text
Role: Technical Project Manager and UI Architect

Mission:
Normalize the Google AI Studio prototype at `/Users/okgoogle13/Projects/prototype_v2.0` so it becomes a clean `support_reference` package for the PR126 migration workflow. Gemini has previously misunderstood routes. This prompt is intentionally strict: do not invent or modify canonical product routing.

Hard scope:
- Work only inside `/Users/okgoogle13/Projects/prototype_v2.0`
- The deleted local path `/Users/okgoogle13/Downloads/careercopilot-aistud` is invalid and must not appear in output or instructions
- Do not modify `/Users/okgoogle13/Projects/careercopilot/frontend/src/App.tsx`
- Do not modify any file in the main CareerCopilot repo
- Do not create or rename canonical product routes
- Treat the prototype as `support_reference` only

Non-negotiable routing rules:
- Canonical runtime routing authority lives in `/Users/okgoogle13/Projects/careercopilot/frontend/src/App.tsx`
- Canonical route ownership lives in `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`
- The prototype must not redefine top-level navigation
- The prototype must not introduce `/workspace`, `/past`, `/library`, or `/studio` as canonical product routes
- In the main repo, `/studio` is only a redirect, not a canonical standalone owner
- Keep shared shell ownership separate from page/content ownership

Canonical route mapping that must be respected:
- `/apply/quick` = canonical owner for application workbench flow
- `/tracker` = canonical owner for application history / CRUD
- `/profile` = canonical owner for profile management
- `/asset-library` = support-only route, not a product pillar
- `/ksc-generator` and `/cover-letter-generator` = canonical generation routes

What to change in the prototype:
1. Rename misleading prototype files so they read as support-reference artifacts aligned to the target state:
   - `src/pages/ApplicationWorkspacePage.tsx` -> `ApplyQuickWorkspaceReference.tsx`
   - `src/pages/ProfileEditorPage.tsx` -> `ProfileView.tsx`
   - `src/pages/PastApplicationsPage.tsx` -> `PastApplicationsReference.tsx`
   - `src/pages/ComponentLibraryPage.tsx` -> `LibraryReferencePage.tsx`
   - `components/MatchDashboard.tsx` -> `StudioMatchPanel.tsx`

2. Update imports and exports for those renames everywhere in the prototype.

3. Reduce or neutralize misleading route semantics:
   - Do not convert the prototype to `react-router-dom`
   - Do not create product-like route paths
   - If `activeTab` remains, explicitly mark it as prototype-only navigation state
   - Add a code comment near the top-level shell/router area that canonical routing is owned by the main repo router

4. Sidebar cleanup:
   - Keep labels as prototype/support labels only
   - Do not imply these are canonical product routes
   - If labels are retained, use this exact sequence for support labeling only:
     `WORKSPACE`, `PROFILE`, `PAST`, `STUDIO`, `LIBRARY`
   - Also add a nearby comment stating:
     `Prototype-only labels. Canonical runtime routing lives in the main CareerCopilot repo App.tsx and route matrix.`

5. Component classification:
   - `StudioMatchPanel` is a support component, not a route-level view
   - Do not rename components in a way that implies standalone route ownership unless that ownership exists in the canonical mapping above
   - Use `Reference` suffix for support-only pages
   - Use `Panel` for support components

6. Cleanup rules:
   - Search for imports before deleting any file
   - Do not delete `Dashboard.tsx`, `ValidationDashboard.tsx`, or any similarly named file unless you prove it has zero remaining imports and is redundant
   - If uncertain, retain the file and record it under `Files Reviewed But Not Deleted`
   - Ignore any request to delete files by broad pattern only

7. Create a mapping artifact:
   - Create `docs/prototype-to-canonical-mapping.md` inside the prototype
   - Include this exact mapping:
     - `ApplyQuickWorkspaceReference` -> `/apply/quick`
     - `PastApplicationsReference` -> `/tracker`
     - `ProfileView` -> `/profile`
     - `LibraryReferencePage` -> `/asset-library` (support-only analog)
     - `StudioMatchPanel` -> generation/analysis support component only, not a canonical route

Acceptance criteria:
- All required renames completed
- All imports updated with no stale paths
- No canonical route changes introduced
- Prototype comments explicitly say routing authority belongs to the main repo
- Any deleted file is justified by zero remaining imports
- A mapping doc is created
- Final file tree is reported

Output format:
Return exactly these sections:
1. `Summary`
2. `Files Renamed`
3. `Imports Updated`
4. `Files Deleted`
5. `Files Reviewed But Not Deleted`
6. `Prototype To Canonical Mapping`
7. `Final File Tree`
8. `Notes`

Execution reminder:
This is a prototype stabilization task only. Do not modify canonical runtime routing or harvest code into the main repo.
```

## Verification Checklist

- Confirm the AI Studio output is limited to the prototype directory.
- Confirm no `react-router-dom` conversion or new route path creation was introduced.
- Confirm the top-level prototype shell explicitly states that routing authority belongs to the main repo.
- Confirm the mapping artifact exists and uses the canonical route ownership defined above.
- Confirm any file deletion includes proof of zero remaining imports.
