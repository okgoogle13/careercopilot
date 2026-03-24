# COMET Prompt Pack — Profile Voice Ownership

**Date:** 2026-03-24
**Status:** Active prompt pack
**Canonical strategy anchor:** `control/COMET-MANIFEST.md`
**Backlog anchor:** `MIG-202`

## Purpose

This prompt pack operationalizes `MIG-202` for AI Studio / Comet in **Support-Reference Mode**.

Use it to modify the existing prototype in-place so `/profile` visibly owns the voice-profile workflow during the prototype-wide AI Studio pass and remains locked before later harvest into the canonical repo.

## Source-of-Truth Inputs

- `control/COMET-MANIFEST.md`
- `control/archive/implementation-backlog.md`
- `control/requirements-audit-checklist.md`
- `contracts/build-contract-profile.xml`
- `contracts/build-contract-settings.xml`
- `analysis/2026-03-16-support-reference-audit-account.md`

## Locked Decisions

- Target route: `/profile`
- Route family: `account`
- Data mode in prototype: `local UI state only`
- `/settings` stays secondary-only
- `/profile` ownership follows `contracts/build-contract-profile.xml`
- `/settings` remains secondary-only per `contracts/build-contract-settings.xml`
- No routing drift: keep `activeTab`, no `react-router-dom`
- No backend calls, no new packages, no shell rewrite

## Shared Allowed / Banned File Scope

**Allowed files**

- `App.tsx`
- `types.ts`
- `constants.ts`
- `src/**/*Profile*`
- `src/**/*Settings*`
- `src/**/profile/**`
- `src/**/settings/**`
- `components/**/*Profile*`
- `components/**/*Settings*`
- `hooks/**/*profile*`
- `services/**/*profile*`

**Banned files**

- `package.json`
- `backend/**`
- `docs/**`
- `.env*`
- `firebase.json`
- `src/routes/**`

## Shared Preamble

You are a Lead React 18 + TypeScript Frontend Engineer working on the existing "CareerCopilot" prototype app.

Your primary directive is IN-PLACE MODIFICATION. This is a batch update workflow on an established prototype, not a fresh scaffold.

### 1. Architecture & Navigation (LOCKED)

- **No Routing Drift:** The app uses a strict tab-based navigation pattern in `App.tsx` via an `activeTab` state. DO NOT introduce `react-router-dom`, window.location, or URL-based routing.
- **Allowed User-Facing Nav Tabs:** `Dashboard`, `Jobs`, `ATS Check`, `Applications`, `Submitted Docs`, `Profile`. (`Settings` is a utility-only view accessible from the profile/avatar area).
- **Structure Preservation:** The prototype uses a hybrid `root` + `src/` layout. `App.tsx`, `index.tsx`, `constants.ts`, and `types.ts` may live at the project root. Additional pages, hooks, and services may live under `src/**` or root-level directories. DO NOT create duplicate shadow structures, move files, or resynthesize the shell unless explicitly requested.

### 2. Operational & Execution Rules

- **Local Stubs Only:** Rely strictly on local mock data and stub logic. DO NOT invent real backend API connections, Axios layers, or database calls.
- **Dependency Freeze:** DO NOT introduce new npm packages. Work within the existing React 18 + TS environment.
- **State Handling:** Rely on local component state (`useState`, `useEffect`) or existing React Context. Do not invent global stores (like Redux or Zustand) for this prototype.
- **Routing Non-Goal:** DO NOT introduce React Router framework-mode concepts such as route modules, loaders, actions, or URL-based navigation.

### 3. Harvest Readiness

- **Component Naming:** Use plain, generic UI naming conventions first (e.g., `Button`, `Card`, `Dialog`, `Input`, `Select`, `Surface`).
- **Structure First:** Focus on mount point, section hierarchy, interaction states, and support-component boundaries that can survive harvest.
- **Ownership Lock:** `/profile` is the visible owner of voice-profile management. `/settings` must remain secondary-only.

## Batch A — Route Ownership and Section Placement

**Goal:** make `/profile` visibly own the voice-profile workflow inside the existing profile surface.

**Completion signal**

- `✅ MIG-202-A COMPLETE — /profile owns the voice-profile entry surface.`

**Prompt body**

```text
Task: MIG-202 Batch A — Route Ownership and Section Placement

Goal:
Make /profile the visible and canonical owner of voice profile management. Do not move this workflow to /settings and do not create a separate top-level route.

Implement or refine the /profile surface so it includes a dedicated voice-profile section using VoiceProfileManagementSection or an equivalent clearly named boundary.

Requirements:
1. /profile must visibly own the voice-profile workflow inside the page body.
2. /settings must remain a secondary account/configuration surface only.
3. Do not create a detached modal-first workflow or a new route.
4. Preserve the existing shell and activeTab behavior.
5. Keep the implementation harvest-friendly:
   - no backend edits
   - no package changes
   - no file moves unless absolutely necessary
6. Use plain user-facing copy that makes ownership and actions clear.

Verification target in Preview:
- open /profile
- confirm voice-profile UI is clearly present on /profile
- confirm Settings is not the primary owner
- confirm navigation still depends on activeTab only

At the end of your response, output exactly:
✅ MIG-202-A COMPLETE — /profile owns the voice-profile entry surface.
```

## Batch B — Interaction States and Stubbed Behavior

**Goal:** implement the voice-profile flow using local state only.

**Completion signal**

- `✅ MIG-202-B COMPLETE — voice-profile states are implemented with local stub logic.`

**Prompt body**

```text
Task: MIG-202 Batch B — Interaction States and Stubbed Behavior

Goal:
Implement the actual voice-profile interaction flow on /profile using local UI state only.

Use these support-component boundaries or equivalent:
- VoiceProfileCreationPanel
- VoiceSampleSubmissionForm
- VoiceProfileStatusCard

Behavior requirements:
1. The user can see whether a voice profile exists.
2. The user can paste or enter a writing sample.
3. The user can submit the sample and see loading, success, and error states.
4. The user can return to an update or replace state after a successful save.
5. Use local stub save/read behavior only:
   - no real API calls
   - no auth integration
   - no backend assumptions
6. Keep all interaction boundaries inside /profile.
7. Keep status changes and component boundaries explicit so they are easy to harvest later.

Verification target in Preview:
- open /profile
- demonstrate empty state
- demonstrate input state
- demonstrate loading state
- demonstrate saved/success state
- demonstrate update/re-submit path
- demonstrate error state without backend access

At the end of your response, output exactly:
✅ MIG-202-B COMPLETE — voice-profile states are implemented with local stub logic.
```

## Batch C — Polish and Harvest Readiness

**Goal:** make the prototype output portable for harvest without reopening ownership decisions.

**Completion signal**

- `✅ MIG-202-C COMPLETE — prototype is harvest-ready for /profile voice ownership.`

**Prompt body**

```text
Task: MIG-202 Batch C — Polish and Harvest Readiness

Goal:
Refine the /profile voice-profile implementation so it is harvest-ready for the canonical repo without re-deciding ownership.

Polish requirements:
1. Tighten section hierarchy, helper text, CTA labels, and component naming so the interaction flow is easy to harvest.
2. Keep /settings secondary-only in effect and presentation.
3. Keep the output harvest-friendly:
   - no duplicate shadow structure
   - no backend or schema assumptions
   - no package changes
   - no route changes
4. Do not collapse account/profile/settings into one generic settings page.
5. Keep component naming plain and portable.

Required self-audit in the response:
- confirm /profile is the visible owner
- confirm /settings remains secondary-only
- confirm activeTab routing model is unchanged
- confirm all logic is still local stub state only

Verification target in Preview:
- open /profile
- confirm the section is clearly route-owned
- confirm the interaction states are easy to identify
- confirm the shell and nav remain unchanged

At the end of your response, output exactly:
✅ MIG-202-C COMPLETE — prototype is harvest-ready for /profile voice ownership.
```

## Review Gate Between Batches

After each batch:

1. Preview `/profile`.
2. Check `control/requirements-audit-checklist.md` section `2. Profile, Documents, and Ingestion`.
3. Confirm `/settings` is still secondary-only.
4. Confirm no routing drift and no real backend integration.
5. Only continue to the next batch if ownership and shell behavior still hold.

## Placement in the Prototype-Wide Sequence

- Run this pack after the generic `B9-B13` sequence has established the Submitted Docs to Profile voice CTA.
- Treat the completed `MIG-202` pack as an ownership lock before running later prototype batches that touch account or settings surfaces, especially `B18`.
- If a later generic batch drifts voice ownership away from `/profile`, repair the prototype back to the `MIG-202` outcome before continuing.

## Harvest Notes

- Do not harvest immediately after Batch C.
- Harvest only after the full selected prototype batch pass and the prototype-wide alignment sweep are complete.
- Treat prototype logic as support-reference input, not backend contract truth.
- Preserve these boundaries during harvest:
  - `VoiceProfileManagementSection`
  - `VoiceProfileCreationPanel`
  - `VoiceSampleSubmissionForm`
  - `VoiceProfileStatusCard`
