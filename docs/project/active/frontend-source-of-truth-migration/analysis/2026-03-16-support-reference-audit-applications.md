# Support Reference Audit — Applications (`/tracker`)

**Route row:** `tracker` in `control/route-matrix.json`
**Canonical screen:** `frontend/src/screens/07_kanban/07_kanban.wireframe.xml` + `frontend/src/screens/07_kanban/KanbanTracker.tsx`
**Runtime owner:** `frontend/src/features/applications/ApplicationTracker.tsx`
**Support candidate:** `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/KanbanBoard.tsx`

## Decision

- **Approved reuse mode:** `keep_behavior_extend_tokens`
- **Why:** the support candidate already captures the core column/card cadence for the applications board and uses semantic-token references in many places, but it remains support-only because the runtime route owns CRUD, status changes, and detail behavior, and local environment readiness still blocks final `/tracker` closure.
- **Archetype mapping:** `Scaffold`-driven kanban shell with `Placard` card stacks and `Strike` CTA entrypoints.
- **Generic SaaS risk:** `medium` — the board structure is useful, but naïve reuse would still land in a conventional kanban SaaS pattern without stronger KR card pressure and route-owned detail flows.

## Reuse Allowed

- column sequencing and count-badge hierarchy
- app-card metadata density and score/priority rhythm
- drag-board structural decomposition

## Rewrite Required

- keep current runtime ownership on `ApplicationTracker` and current API/capability mapping
- preserve routed detail and status behavior from canonical runtime truth, not from support mock data
- normalize any non-canonical token names or comments before downstream reuse
- keep shell ownership separate from board ownership; sidebar/layout remain shared-shell reference only

## Exclusions

- no direct promotion of `KanbanBoard.tsx`
- no assumption that Figma board structure closes `/tracker`; environment closeout still required
- no backend contract inference from board-card text
- no shell or auth ownership changes
