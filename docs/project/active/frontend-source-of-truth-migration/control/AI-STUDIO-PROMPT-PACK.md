# AI-STUDIO-PROMPT-PACK.md

**Date:** 2026-03-24
**Status:** Active detailed prompt source
**Purpose:** Provide one canonical, expanded single-file replay pack for Google AI Studio / Comet when executing the prototype-first frontend feature-spec update pass, including the full `MIG-202` route-lock workflow inline.

## Replay Inputs And Reference Files

- [COMET-MANIFEST.md](file:///Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md)
- [archive/implementation-backlog.md](file:///Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-source-of-truth-migration/control/archive/implementation-backlog.md)
- [archive/route-matrix.md](file:///Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.md)
- [route-matrix.json](file:///Users/okgoogle13/Projects/careercopilot/docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json)
- `docs/project/active/frontend-source-of-truth-migration/control/requirements-audit-checklist.md`
- `docs/project/active/frontend-source-of-truth-migration/control/comet-profile-voice-ownership-prompt-pack.md` (provenance/source only; fully inlined below)
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-account.md`
- `docs/project/active/frontend-source-of-truth-migration/contracts/*.xml` when present

Contract-reference note:
- In this prompt pack, `build-contract-*.xml` names are governance identifiers for route ownership and harvest locks.
- If a referenced build-contract XML is not currently materialized under `contracts/`, use `COMET-MANIFEST.md` plus `route-matrix.json` as the operational source of truth for that route lock.
- Missing local XML files do not authorize route remapping, owner collapse, or support-reference drift.

Replay note:
- This file is intended to be sufficient on its own for replaying the full prototype harvest sequence in AI Studio.
- `control/comet-profile-voice-ownership-prompt-pack.md` remains a provenance/source document, but the full `MIG-202` workflow is inlined below so replay does not depend on a second prompt pack.

## Source Material Used To Build This Pack

- `docs/project/active/frontend-source-of-truth-migration/control/comet-profile-voice-ownership-prompt-pack.md`
- `docs/project/active/frontend-source-of-truth-migration/control/archive/route-matrix.md`
- `docs/project/active/frontend-source-of-truth-migration/control/archive/implementation-backlog.md`
- `docs/project/active/frontend-source-of-truth-migration/control/pm/dashboard.md`

Use those planning docs and contracts as source material only. This file is the canonical expanded prompt source for the active migration program.

## Canonical Route Mapping

When a prompt uses the locked user-facing labels, preserve these canonical route owners:

- `Dashboard` → `/dashboard` → `contracts/build-contract-dashboard.xml`
- `Jobs` → `/opportunities` → `contracts/build-contract-opportunities.xml`
- `ATS Check` → `/analysis` → `contracts/build-contract-analysis.xml`
- `Applications` → `/tracker` → `contracts/build-contract-tracker.xml`
- `Submitted Docs` → `/documents` → `contracts/build-contract-documents.xml`
- `Profile` → `/profile` → `contracts/build-contract-profile.xml`
- `Settings` utility surface → `/settings` → `contracts/build-contract-settings.xml`

Support-reference ownership rule:
- Any prototype-only `Submitted Docs` composite must not reassign canonical generation ownership away from `/documents`, `/ksc-generator`, or `/cover-letter-generator`.
- Treat any referenced `build-contract-*.xml` path as a governed route-lock label first, and as a local file path only when that XML is actually present in `contracts/`.

## Sequence Rules

1. Run `B1-B4`.
2. Run `B5-B8`.
3. Run `B9-B13`.
4. Run the inlined `MIG-202` route-lock sequence to lock `/profile` voice ownership.
5. Run `B14-B19`.
6. Run one prototype-wide alignment sweep.
7. Only then begin harvest into the canonical repo.

Rule: `MIG-202` is an ownership lock inside the prototype pass. It is not an immediate harvest trigger.

## Full Replay Order

Use this exact replay sequence in AI Studio:

1. Start a fresh Build conversation.
2. Send the shared session preamble from this file once.
3. Run `B1` through `B13` in order.
4. Run the full inlined `MIG-202` workflow in this file:
   - `MIG-202-A`
   - `MIG-202-B`
   - `MIG-202-C`
5. Confirm the `MIG-202` review gate is holding in Preview.
6. Run `B14` through `B19` in order.
7. Run the prototype-wide alignment sweep from this file.
8. Only after the full replay pass and alignment sweep are complete, begin harvest planning in the canonical repo.

## MIG-202 Replay Bundle

This section consolidates the full `/profile` voice-ownership workflow into the main replay packet.

### MIG-202 Source-Of-Truth Inputs

- `control/COMET-MANIFEST.md`
- `control/archive/implementation-backlog.md`
- `control/requirements-audit-checklist.md`
- `contracts/build-contract-profile.xml`
- `contracts/build-contract-settings.xml`
- `analysis/2026-03-16-support-reference-audit-account.md`

### MIG-202 Locked Decisions

- Target route: `/profile`
- Route family: `account`
- Data mode in prototype: `local UI state only`
- `/settings` stays secondary-only
- `/profile` is the visible owner of voice-profile management
- No routing drift: keep `activeTab`, no `react-router-dom`
- No backend calls, no new packages, no shell rewrite

### MIG-202 Shared Allowed / Banned File Scope

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

### MIG-202 Replay Constraints

These apply in addition to the shared session preamble:

- Preserve `/profile` as the visible owner of voice-profile management.
- Keep `/settings` secondary-only in navigation, copy, and placement.
- Work with local stub state only; do not introduce backend assumptions.
- Keep component naming plain and portable for harvest.
- Do not create a detached modal-first flow or a new top-level route.
- Do not collapse profile/settings/account surfaces into a generic settings page.

## Shared Session Preamble

Use this once at the start of each new AI Studio Build conversation:

```text
You are a senior React 18 + TypeScript frontend engineer working on an existing CareerCopilot prototype app. This is an in-place modification workflow, not a fresh scaffold. Modify only the requested files and sections for each instruction. The app currently uses a tab-based navigation pattern in App.tsx (activeTab state) and does not use react-router-dom.

Structure note:
- The prototype uses a hybrid root + src/ layout.
- App.tsx, index.tsx, constants.ts, and types.ts may live at project root.
- Additional pages, hooks, and layout internals may live under src/**.
- Root-level components/, hooks/, and services/ may also exist.
- Do not create duplicate shadow structure or move files unless the prompt explicitly requires it.

Locked user-facing nav:
- Dashboard
- Jobs
- ATS Check
- Applications
- Submitted Docs
- Profile
- Settings is utility-only from the profile/avatar area.

Technical Rules:
- In-place modification only. Do not resynthesize the shell or regenerate project structure.
- The top-level shell in App.tsx is support-only. Do not invent a new navigation architecture.
- No routing drift. No react-router-dom, React Router framework-mode patterns, route modules, loaders, actions, or URL-based navigation. Maintain activeTab local state only.
- No new npm packages.
- Keep everything React 18 compatible.
- Local stub logic only. No real backend connections.
- Focus on mounting location, interaction flow, local state changes, and harvest-safe component boundaries.
- Use plain UI naming first: Button, Card, Dialog, Input, Select, Surface.

At the end of each response:
- list the files changed
- confirm no other files were modified
- confirm no dependencies were changed unless explicitly requested

Shared stub state slots (use these exact names in all batches):
- pendingJobUrl: string | null  — set by B6, read by B7
- isGovernmentJob: boolean      — set by B8 stub, read by B8 CTA and B12 KSC section
- hasGeneratedDocument: boolean — set by B9-B12, read by B13 CTA bridge

### 🚨 KR Solidarity v6.1 Aesthetics & Mechanics (MANDATORY)

When generating or modifying UI code, apply the following KR Solidarity v6.1 "No-Slop" rules exclusively:

1. **Tokens Over Hardcoding**: Use CSS variables from `frontend/src/design/styles/design-tokens.css` (`--sys-*`). Never use hex codes, generic Tailwind colors (e.g., `text-blue-500`), or raw pixel values.
2. **Zero-Flora Lockdown**: Strict ban on any botanical, flora, or endemic-species motifs (no gum leaves, flowers, or vines).
3. **Archetype Geometry**: Use asymmetric radii (`--sys-shape-*`) for containers. Use the `dominant_archetypes` metadata in `route-matrix.json` to select the primary shape and interaction patterns (e.g., `Placard` for card-heavy flows, `Scaffold` for structured forms).
   - `Strike` (Button): High-energy, sharp/blocky morphing.
   - `Placard` (Card): Torn/asymmetric edges.
   - `Scaffold` (Shell/Internal): Structural, immutable geometry.
   - `March` (Select/Dropdown): Viscous, organic transitions.
   - `Megaphone` (Dialogue): Proclamatory, asymmetrical frames.
4. **Typography**: Use `Work Sans` for UI, `Fraunces` for display headers, and `JetBrains Mono` for all technical metadata/scores.
5. **Color Hierarchy**: `charcoalBackground` is the only valid canvas. Use `solidarityRed` and `inkGold` as meaning-rich highlights only.
```

## Review Gate Between Batches

After each batch or tightly-coupled batch group:

1. review the prototype in Preview.
2. apply relevant route-family/cross-cutting checks from `docs/project/active/frontend-source-of-truth-migration/control/requirements-audit-checklist.md`:
   - B1-B4: `### 1. Auth & Onboarding`
   - B5, B6: `### 4. Applications & Jobs`
   - B7: `### 3. Generation & Analysis`
   - B8: `### 2. Profile, Documents, and Ingestion`
   - B9-B13: `### 2. Profile, Documents, and Ingestion` and `### 3. Generation & Analysis`
   - MIG-202: `### 2. Profile, Documents, and Ingestion`
   - B14-B19: `### 3. Generation & Analysis` and `### 4. Applications & Jobs`
3. confirm:
   - `activeTab` navigation is still intact
   - no URL routing or shell drift was introduced
   - no real backend assumptions were added
   - no capability gained a competing visible owner
   - cross-surface state handoffs (URL paste stub → ATS Check, government CTA → Submitted Docs) navigate correctly using activeTab only
4. if a batch fails review, fix that batch before continuing.

### Batch Recovery Protocol

If a batch fails review:

1. Start a fresh Build conversation.
2. Re-send the shared session preamble.
3. Re-run only the failing prompt. Do not re-run passing batches.
4. If the same batch fails twice, open a targeted fix prompt scoped to the specific failing requirement only.
5. Do not advance to the next batch until the failing batch passes all review gate checks.

Additional mandatory checks after `B13`, `MIG-202`, and `B18`:

- `/profile` remains the visible voice-profile owner
- `/settings` remains secondary-only
- no generic account-page collapse is introduced

## Checkpoints

- Checkpoint 1: after `B1-B4`
- Checkpoint 2: after `B5-B8`
- Checkpoint 3: after `B9-B13` and `MIG-202`
- Checkpoint 4: after `B14-B19`

At each checkpoint:

- export/download the current AI Studio build
- review diffs in the prototype repo
- restart a fresh Build conversation
- re-send the shared session preamble before the next batch group

## Batch Prompts

### B1 — Global Shell & Locked Navigation

<!-- contract-alignment: preview locked nav only; preserve canonical owners /dashboard,/opportunities,/analysis,/tracker,/documents,/profile and utility /settings -->

**Completion signal**

- `✅ COMET-B1 COMPLETE — locked shell and primary navigation are in place.`

```text
Task: B1 — Global Shell & Locked Navigation

Goal:
Refine the global layout shell and primary navigation so the visible app structure follows the locked strategy:
- Dashboard
- Jobs
- ATS Check
- Applications
- Submitted Docs
- Profile

Requirements:
1. Keep activeTab in App.tsx as the navigation mechanism.
2. Do not introduce react-router-dom or any other routing system.
3. Settings must not appear as a primary top-level nav item; keep it utility-only from the profile/avatar area.
4. Ensure each primary destination renders a clearly labeled placeholder or existing content section matching the locked labels.
5. Preserve unrelated logic, state, and imports.

Allowed files only:
- App.tsx
- Any new shell or presentational components under src/components/ or root components/ that are imported by App.tsx

At the end of your response, output exactly:
✅ COMET-B1 COMPLETE — locked shell and primary navigation are in place.
```

### B2 — Navigation Labels, Ordering, and Settings Utility

<!-- contract-alignment: label-only refinement for /dashboard,/opportunities,/analysis,/tracker,/documents,/profile with utility /settings -->

**Completion signal**

- `✅ COMET-B2 COMPLETE — navigation labels and Settings utility placement are aligned.`

```text
Task: B2 — Navigation Labels, Ordering, and Settings Utility

Goal:
Update the navigation UI so it uses the locked labels consistently and places Settings in the correct utility position.

Requirements:
1. The visible primary nav must read exactly:
   - Dashboard
   - Jobs
   - ATS Check
   - Applications
   - Submitted Docs
   - Profile
2. Settings must remain visible only from the profile/avatar area and must not appear in the primary nav list.
3. Ensure the selected state is accurate for each locked label.
4. Preserve unrelated logic and existing component structure.
5. Do not restructure navigation. Only change visible label text strings and the position/visibility of the Settings entry. B1 has already established the correct structure — do not rewrite it.

Allowed files only:
- App.tsx
- Navigation-related components already imported by App.tsx (no new components)

At the end of your response, output exactly:
✅ COMET-B2 COMPLETE — navigation labels and Settings utility placement are aligned.
```

### B3 — Onboarding Choose Your Path

<!-- contract-alignment: onboarding preview only; canonical owner /onboarding per build-contract-onboarding.xml -->

**Completion signal**

- `✅ COMET-B3 COMPLETE — onboarding path choice is implemented.`

```text
Task: B3 — Onboarding Choose Your Path

Goal:
Implement or refine a first-time onboarding screen that appears before the main Dashboard view.

Requirements:
1. Present two primary choices:
   - Set up profile and upload resume
   - Jump straight into a quick application
2. After the user chooses, hide the onboarding screen and show the main tabbed app shell.
3. Use existing local state patterns only; do not add auth or persistence beyond local state.
4. Keep the flow consistent with the rest of the prototype and avoid shell changes.

Allowed files only:
- App.tsx
- Existing user state hook/store files already used by the prototype
- Existing onboarding-related components imported by App.tsx

At the end of your response, output exactly:
✅ COMET-B3 COMPLETE — onboarding path choice is implemented.
```

### B4 — Dashboard Getting Started Checklist

<!-- contract-alignment: dashboard checklist preview; canonical owner /dashboard -->

**Completion signal**

- `✅ COMET-B4 COMPLETE — dashboard checklist is implemented.`

```text
Task: B4 — Dashboard Getting Started Checklist

Goal:
Add or refine a dismissible Getting Started checklist on the Dashboard when resume/profile data is missing.

Requirements:
1. Render a card titled Getting Started.
2. Include 3 checklist items with mock checkboxes:
   - Upload master resume
   - Paste a job URL
   - Browse jobs
3. Include a Dismiss for now control using local or existing store state.
4. Use stub booleans only; no real backend calls.

Allowed files only:
- The component that currently renders the Dashboard content
- App.tsx only if necessary to pass state or props

At the end of your response, output exactly:
✅ COMET-B4 COMPLETE — dashboard checklist is implemented.
```

### B5 — Jobs List and Empty State

<!-- contract-alignment: Jobs nav label previews /opportunities; related queue patterns may inform /job-queue without changing nav ownership -->

**Completion signal**

- `✅ COMET-B5 COMPLETE — Jobs list and empty state are in place.`

```text
Task: B5 — Jobs List and Empty State

Goal:
Implement or refine the Jobs destination to show a job queue list and a rich empty state.

Requirements:
1. In the Jobs destination, display stub job cards with title, company, location, and simple match score.
2. When there are no jobs, show an empty state with actions like:
   - Run a job search
   - Paste a job URL
3. Use stub data only.
4. Preserve the locked user-facing label Jobs.

Allowed files only:
- The component responsible for Jobs content
- App.tsx only if necessary to pass state or props

At the end of your response, output exactly:
✅ COMET-B5 COMPLETE — Jobs list and empty state are in place.
```

### B6 — Dashboard Paste Job URL Quick Action

<!-- contract-alignment: dashboard quick action hands off to /analysis only; do not imply a new canonical route -->

**Completion signal**

- `✅ COMET-B6 COMPLETE — Dashboard quick URL action is implemented.`

```text
Task: B6 — Dashboard Paste Job URL Quick Action

Goal:
Add a high-visibility Paste Job URL quick action to Dashboard.

Requirements:
1. Add a prominent quick-action card or button on Dashboard.
2. Clicking it should open a small modal or inline form where the user can paste a job URL.
3. Wire it to a local stub handler that sets `pendingJobUrl` in shared state and lands the user in ATS Check.
4. Do not implement real scraping or network calls.

Allowed files only:
- Dashboard component
- App.tsx only if necessary to coordinate state

At the end of your response, output exactly:
✅ COMET-B6 COMPLETE — Dashboard quick URL action is implemented.
```

### B7 — ATS Check 4-Quadrant Layout

<!-- contract-alignment: ATS Check preview aligns to /analysis per build-contract-analysis.xml -->

**Completion signal**

- `✅ COMET-B7 COMPLETE — ATS Check quadrants are implemented.`

```text
Task: B7 — ATS Check 4-Quadrant Layout

Goal:
Implement the ATS Check page as a four-quadrant audit layout.

Requirements:
1. Show four cards:
   - Hard Skills Match
   - Soft Skills and Verbs
   - Quantifiable Impact
   - ATS Readability
2. Each card should display a mock score and 2-3 bullet insights.
3. Arrange them in a responsive 2x2 desktop grid and stacked mobile layout.
4. Keep all scores and text stubbed locally.

Allowed files only:
- The component responsible for ATS Check content
- App.tsx only if necessary to coordinate state

At the end of your response, output exactly:
✅ COMET-B7 COMPLETE — ATS Check quadrants are implemented.
```

### B8 — Your Documents Widget and Government CTA

<!-- contract-alignment: CTA lands in /documents support hub only; KSC ownership remains /ksc-generator -->

**Completion signal**

- `✅ COMET-B8 COMPLETE — provenance widget and government CTA are implemented.`

```text
Task: B8 — Your Documents Widget and Government CTA

Goal:
Enhance ATS Check with input provenance and a contextual government CTA.

Requirements:
1. Add a Your Documents summary widget listing which mock documents are being used.
2. Add a conditional banner when a stub isGovernmentJob flag is true:
   - Government application detected: Generate KSC responses
3. The CTA should take the user to Submitted Docs hub. Do not implement actual tab-selection logic here; stub the CTA destination as Submitted Docs only. Tab preselection will be handled in B12.
4. No backend logic.

Allowed files only:
- The ATS Check component
- App.tsx only if necessary

At the end of your response, output exactly:
✅ COMET-B8 COMPLETE — provenance widget and government CTA are implemented.
```

### B9 — Submitted Docs Hub and Stepper

<!-- contract-alignment: support-reference composite for /documents, /ksc-generator, and /cover-letter-generator; do not collapse canonical ownership -->

**Completion signal**

- `✅ COMET-B9 COMPLETE — Submitted Docs hub and stepper are implemented.`

```text
Task: B9 — Submitted Docs Hub and Stepper

Goal:
Create the Submitted Docs hub with a multi-step document-hub flow.

Requirements:
1. The Submitted Docs surface must act as a support-reference document hub.
Note: This surface will be harvested into separate canonical routes (`/documents`, `/cover-letter-generator`, `/ksc-generator`). Design subsections as isolated components with no shared internal state between tabs.
2. Include sections or tabs for:
   - Tailor
   - Templates
   - Review
3. Add a multi-step layout with three steps:
   - Tailor resume
   - Generate cover letter or KSC
   - Review and export
4. Show estimated time labels per step.
5. No real export logic.

Allowed files only:
- The component responsible for Submitted Docs content
- App.tsx only if necessary

At the end of your response, output exactly:
✅ COMET-B9 COMPLETE — Submitted Docs hub and stepper are implemented.
```

### B10 — Inline Bullet Suggestions

<!-- contract-alignment: Tailor subsection informs /documents and /analysis support flows only -->

**Completion signal**

- `✅ COMET-B10 COMPLETE — inline bullet suggestions are implemented.`

```text
Task: B10 — Inline Bullet Suggestions

Goal:
Add inline AI suggestion UI with Apply and Discard controls inside the Tailor flow.

Requirements:
1. Show example resume bullets with paired Suggested rewrite UI.
2. Provide Apply and Discard buttons for each suggestion that update local state.
3. Clearly distinguish original versus suggested text.
4. Use placeholder content only.

Allowed files only:
- The Submitted Docs component or its Tailor subsection
- Any local child components used by that surface

At the end of your response, output exactly:
✅ COMET-B10 COMPLETE — inline bullet suggestions are implemented.
```

### B11 — Context Badge and Regenerate Control

<!-- contract-alignment: generation preview only; do not infer generator route ownership changes -->

**Completion signal**

- `✅ COMET-B11 COMPLETE — context badge and style cycle are implemented.`

```text
Task: B11 — Context Badge and Regenerate Control

Goal:
Add context provenance badges and a regenerate-with-different-style control for generated text.

Requirements:
1. Add a Context used: X documents badge to generated sections.
2. Add a Regenerate with different style button beneath outputs.
3. Cycle between mock style labels such as Formal and Conversational using local state.
4. Swap stubbed text variations only; no external calls.

Allowed files only:
- The Submitted Docs generation-related components

At the end of your response, output exactly:
✅ COMET-B11 COMPLETE — context badge and style cycle are implemented.
```

### B12 — KSC Tab and STAR Tooltip

<!-- contract-alignment: KSC preview supports /ksc-generator contract; /documents remains hub only -->

**Completion signal**

- `✅ COMET-B12 COMPLETE — KSC tab and STAR guidance are implemented.`

```text
Task: B12 — KSC Tab and STAR Tooltip

Goal:
Build a KSC-specific view with AU/NZ public-sector context.

Requirements:
1. Add a dedicated tab or subsection for Key Selection Criteria (KSC) — Government Applications.
2. Include a brief explanatory tooltip or info panel about KSC and STAR.
3. Present a simple text area or list of stub KSC prompts and responses.
4. No backend integration.

Allowed files only:
- The Submitted Docs generation-related components

At the end of your response, output exactly:
✅ COMET-B12 COMPLETE — KSC tab and STAR guidance are implemented.
```

### B13 — Voice Profile CTA Bridge

<!-- contract-alignment: voice CTA bridge points to /profile only; /settings remains secondary -->

**Completion signal**

- `✅ COMET-B13 COMPLETE — voice-profile CTA bridge is implemented.`

```text
Task: B13 — Voice Profile CTA Bridge

Goal:
Surface a Teach the AI your voice CTA after first successful document generation.

Requirements:
1. Show a non-intrusive banner or callout after the first successful generation, simulated via local state.
2. The CTA must direct the user to Profile, not Settings.
3. Treat this as a bridge into the dedicated voice-profile owner, not as voice-profile ownership itself.
4. No real profile storage or backend logic.

Allowed files only:
- The Submitted Docs generation-related components
- App.tsx only if necessary to coordinate the handoff into Profile

At the end of your response, output exactly:
✅ COMET-B13 COMPLETE — voice-profile CTA bridge is implemented.
```

### MIG-202 — Profile Voice Ownership Lock

<!-- contract-alignment: preserve /profile over /settings; inline replay for MIG-202 -->

Run this full route-lock workflow immediately after `B13`. Do not continue to `B14-B19` until the `MIG-202` ownership lock is holding in Preview.

#### MIG-202-A — Route Ownership and Section Placement

**Completion signal**

- `✅ MIG-202-A COMPLETE — /profile owns the voice-profile entry surface.`

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

Allowed files only:
- App.tsx
- types.ts
- constants.ts
- src/**/*Profile*
- src/**/*Settings*
- src/**/profile/**
- src/**/settings/**
- components/**/*Profile*
- components/**/*Settings*
- hooks/**/*profile*
- services/**/*profile*

Verification target in Preview:
- open /profile
- confirm voice-profile UI is clearly present on /profile
- confirm Settings is not the primary owner
- confirm navigation still depends on activeTab only

At the end of your response, output exactly:
✅ MIG-202-A COMPLETE — /profile owns the voice-profile entry surface.
```

#### MIG-202-B — Interaction States and Stubbed Behavior

**Completion signal**

- `✅ MIG-202-B COMPLETE — voice-profile states are implemented with local stub logic.`

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

Allowed files only:
- App.tsx
- types.ts
- constants.ts
- src/**/*Profile*
- src/**/*Settings*
- src/**/profile/**
- src/**/settings/**
- components/**/*Profile*
- components/**/*Settings*
- hooks/**/*profile*
- services/**/*profile*

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

#### MIG-202-C — Polish and Harvest Readiness

**Completion signal**

- `✅ MIG-202-C COMPLETE — prototype is harvest-ready for /profile voice ownership.`

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

Allowed files only:
- App.tsx
- types.ts
- constants.ts
- src/**/*Profile*
- src/**/*Settings*
- src/**/profile/**
- src/**/settings/**
- components/**/*Profile*
- components/**/*Settings*
- hooks/**/*profile*
- services/**/*profile*

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

#### MIG-202 Review Gate

After each `MIG-202` batch:

1. Preview `/profile`.
2. Check `control/requirements-audit-checklist.md` section `2. Profile, Documents, and Ingestion`.
3. Confirm `/settings` is still secondary-only.
4. Confirm no routing drift and no real backend integration.
5. Only continue to the next `MIG-202` batch if ownership and shell behavior still hold.

#### MIG-202 Placement In Replay Sequence

- Run this inlined workflow after `B9-B13` has established the Submitted Docs to Profile voice CTA.
- Treat the completed `MIG-202` sequence as an ownership lock before running later prototype batches that touch account or settings surfaces, especially `B18`.
- If a later generic batch drifts voice ownership away from `/profile`, repair the prototype back to the `MIG-202` outcome before continuing.

#### MIG-202 Harvest Notes

- Do not harvest immediately after `MIG-202-C`.
- Harvest only after the full selected prototype batch pass and the prototype-wide alignment sweep are complete.
- Treat prototype logic as support-reference input, not backend contract truth.
- Preserve these boundaries during harvest:
  - `VoiceProfileManagementSection`
  - `VoiceProfileCreationPanel`
  - `VoiceSampleSubmissionForm`
  - `VoiceProfileStatusCard`

### B14 — Cover Letter Metrics

<!-- contract-alignment: support-reference only for /cover-letter-generator; do not transfer canonical ownership into /documents -->

**Completion signal**

- `✅ COMET-B14 COMPLETE — cover letter metrics are ready for harvest review.`

```text
Task: B14 — Cover Letter Metrics

Goal:
Add a cover-letter evaluation surface that shows four clear metrics:
- Keyword
- Narrative
- Personalization
- Tone

Requirements:
1. Implement this as an in-place enhancement to the cover-letter subsection inside the Submitted Docs support-reference composite.
2. Each metric should have a label, score or gauge, and short explanatory note.
3. The four metrics must feel distinct.
4. Use local stub data only.
5. Do not add backend scoring logic.
6. Keep /profile as the voice owner and do not alter settings ownership while making this change.
7. UI Architecture: Use `--sys-shape-placardTorn01` shapes for metric cards. All score values and technical metadata MUST use `JetBrains Mono` (`--sys-type-fontFamilies-mono`).

Allowed files only:
- The Submitted Docs component or its cover-letter subsection
- Any local child components used by that surface

At the end of your response, output exactly:
✅ COMET-B14 COMPLETE — cover letter metrics are ready for harvest review.
```

### B15 — Image Studio Shell

<!-- contract-alignment: experimental support section only; no canonical route ownership implied -->

**Completion signal**

- `✅ COMET-B15 COMPLETE — Image Studio shell is implemented.`

```text
Task: B15 — Image Studio Shell

Goal:
Create an Image Studio section accessible from Submitted Docs.

Requirements:
1. Include:
   - a prompt input for describing the desired image
   - a Generate preview button
   - a grid of placeholder image cards showing sample results
2. Mount as a collapsible section or tertiary tab inside Submitted Docs, labelled 'Image Studio (Preview)'.
3. Do not integrate real image generation APIs.
4. Do not create a new top-level nav item.
5. UI Architecture: The preview grid cards must use the `Placard` archetype (`--sys-shape-placardTorn01`).

Allowed files only:
- Submitted Docs component
- Any new local child components imported by that surface
- App.tsx only if necessary to expose an existing support-only entry point

At the end of your response, output exactly:
✅ COMET-B15 COMPLETE — Image Studio shell is implemented.
```

### B16 — Applications Board and Application Detail

<!-- contract-alignment: Applications preview aligns to /tracker per build-contract-tracker.xml -->

**Completion signal**

- `✅ COMET-B16 COMPLETE — Applications board and detail workspace are implemented.`

```text
Task: B16 — Applications Board and Application Detail

Goal:
Implement the Applications destination as a basic board with a unified application detail workspace.

Requirements:
1. Show columns such as:
   - Draft
   - Applied
   - Interviewing
   - Offer
   - Archived
2. Use stub applications only.
3. Each card should show job title, company, and status.
4. Clicking a card should open an application detail workspace showing:
   - job description
   - linked documents
   - current status
5. Use local state only.
6. UI Architecture: Application cards must use `Placard` geometry (`--sys-shape-placardTorn01`). Board columns and the Detail Workspace must use `Scaffold` tokens for structural consistency.

Allowed files only:
- The Applications content component
- Any local child components imported by that surface
- App.tsx only if necessary

At the end of your response, output exactly:
✅ COMET-B16 COMPLETE — Applications board and detail workspace are implemented.
```

### B17 — Dashboard ATS Trend Chart

<!-- contract-alignment: dashboard metric preview aligns to /dashboard -->

**Completion signal**

- `✅ COMET-B17 COMPLETE — Dashboard ATS trend chart is implemented.`

```text
Task: B17 — Dashboard ATS Trend Chart

Goal:
Enhance Dashboard with a small trend chart showing ATS scores for the last five mock applications.

Requirements:
1. Use a minimal sparkline, bar chart, or simple SVG approach.
2. Use hard-coded sample data only.
3. Place it near other performance summaries.
4. Keep the chart lightweight and readable without changing the surrounding shell structure.
5. Do not introduce heavy charting dependencies. Use SVG elements or plain HTML/CSS only — no third-party chart library.
6. UI Architecture: Use `--sys-color-inkGold-base` for positive trends and `--sys-color-solidarityRed-base` for critical score dips. The chart container itself must follow the `Placard` archetype.

Allowed files only:
- The Dashboard component
- Any lightweight local chart component imported by it

At the end of your response, output exactly:
✅ COMET-B17 COMPLETE — Dashboard ATS trend chart is implemented.
```

### B18 — Profile Settings Integrations

<!-- contract-alignment: settings utility preview aligns to /settings while preserving /profile voice ownership -->

**Completion signal**

- `✅ COMET-B18 COMPLETE — utility integrations panel is implemented without ownership drift.`

```text
Task: B18 — Profile Settings Integrations

Goal:
Add a Settings utility-only integrations section that shows placeholders for Gmail scan and Job Scout.

Requirements:
1. Add an Integrations section listing items like Gmail scan and Job Scout.
2. For each integration, show:
   - connection status
   - last sync time
   - a Manage button
3. Keep all values mocked.
4. Do not add OAuth flows or real integrations.
5. Settings must remain utility-only.
6. Do not move, duplicate, or reframe voice-profile ownership here; /profile remains the canonical voice owner.
7. UI Architecture: Use `Scaffold` structural tokens for integration panels and the `Strike` archetype (`--sys-shape-blockRiot03`) for 'Manage' buttons.

Allowed files only:
- The Settings component or utility account surface
- Any local child components imported by it

At the end of your response, output exactly:
✅ COMET-B18 COMPLETE — utility integrations panel is implemented without ownership drift.
```

### B19 — Mobile Bottom Nav

<!-- contract-alignment: mobile nav previews locked labels only; canonical owners remain unchanged -->

**Completion signal**

- `✅ COMET-B19 COMPLETE — mobile bottom nav is implemented.`

```text
Task: B19 — Mobile Bottom Nav

Goal:
Add a mobile-only bottom navigation bar for the locked primary loop actions.

Requirements:
1. On small screens, show four primary actions using the locked labels:
   - Jobs
   - ATS Check
   - Submitted Docs
   - Applications
2. Map them to the existing locked destinations using activeTab.
3. Use icons and labels with clear tap targets.
4. Hide or reduce the desktop sidebar on small screens so the bottom nav becomes the main mobile navigation mechanism.
5. Do not change desktop behavior.
6. UI Architecture: Icons and text must use `--sys-color-worker-ash-base` on a `--sys-color-charcoalBackground-base` bar. Tap targets should emulate `Strike` interaction physics.

Allowed files only:
- App.tsx
- Existing shell/navigation components already imported by App.tsx

At the end of your response, output exactly:
✅ COMET-B19 COMPLETE — mobile bottom nav is implemented.
```

## Post-B19 Alignment Sweep Prompt

Use this after `B14-B19` are complete and before any harvest:

**Completion signal**

- `✅ COMET-ALIGNMENT COMPLETE — prototype-wide feature-spec alignment is ready for harvest planning.`

```text
Task: Prototype-Wide Alignment Sweep

Goal:
Refine the existing prototype so the completed B1-B19 pass reads as one coherent, harvest-ready support-reference application.

Requirements:
1. Normalize naming, section hierarchy, interaction labels, and component boundaries across Dashboard, Jobs, ATS Check, Applications, Submitted Docs, Profile, and Settings utility surfaces.
2. Preserve the locked nav labels and activeTab architecture.
3. Preserve MIG-202 ownership:
   - /profile remains the visible voice-profile owner
   - /settings remains secondary-only
4. Do not introduce backend assumptions.
5. Do not add dependencies.
6. Do not start harvest or rewrite the shell.
7. Focus on portability, ownership clarity, and consistency rather than new feature scope.

At the end of your response, output exactly:
✅ COMET-ALIGNMENT COMPLETE — prototype-wide feature-spec alignment is ready for harvest planning.
```

## Contract Alignment Summary

Reference note:
- Contract references below are governed route-lock identifiers from the active migration controls.
- Some identifiers may not yet exist as local XML files under `contracts/`; when absent, defer to `COMET-MANIFEST.md` and `route-matrix.json` for the same ownership rule.

| Batch | Support-Reference Surface | Canonical Owners Preserved | Contract References |
| --- | --- | --- | --- |
| B1-B2 | Locked nav shell | `/dashboard`, `/opportunities`, `/analysis`, `/tracker`, `/documents`, `/profile`, utility `/settings` | `build-contract-dashboard.xml`, `build-contract-opportunities.xml`, `build-contract-analysis.xml`, `build-contract-tracker.xml`, `build-contract-documents.xml`, `build-contract-profile.xml`, `build-contract-settings.xml` |
| B3-B4 | Onboarding, dashboard checklist | `/onboarding`, `/dashboard` | `build-contract-onboarding.xml`, `build-contract-dashboard.xml` |
| B5-B8 | Jobs, ATS, government CTA | `/opportunities`, `/job-queue`, `/analysis`, `/documents`, `/ksc-generator` | `build-contract-opportunities.xml`, `build-contract-job_queue.xml`, `build-contract-analysis.xml`, `build-contract-documents.xml`, `build-contract-ksc_generator.xml` |
| B9-B15 | Submitted Docs support-reference composite | `/documents`, `/ksc-generator`, `/cover-letter-generator`, `/profile` | `build-contract-documents.xml`, `build-contract-ksc_generator.xml`, `build-contract-cover_letter_generator.xml`, `build-contract-profile.xml` |
| B16-B19 | Applications, dashboard, settings, mobile | `/tracker`, `/dashboard`, `/settings`, `/profile` | `build-contract-tracker.xml`, `build-contract-dashboard.xml`, `build-contract-settings.xml`, `build-contract-profile.xml` |

---

## Harvest Boundary Reminder

- Do not harvest before the full prototype pass and the alignment sweep are complete.
- Treat prototype outputs as support-reference only.
- Preserve `MIG-202` route ownership during and after harvest planning.
