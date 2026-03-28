# AI Studio Prompt Pack: MIG-202 & B14-B19 (Gemini 3 Flash Optimized)

**Date:** 2026-03-26
**Target Architecture:** Gemini 3 Flash (High-Density Context + Strict Instruction Following)
**Status:** Active Execution Plan
**Purpose:** Standalone, directive-heavy prompt sequence for MIG-202 (Voice Ownership Lock) and B14-B19 (Feature Pass).

---

## 🛠 REPLAY SEQUENCE RULES

1. **New Session**: Start a fresh Build conversation.
2. **Preamble**: Send the `<SYSTEM_INSTRUCTIONS_PREAMBLE>` once.
3. **Execution**: Run `<GEMINI_3_FLASH_PROMPT>` blocks in order:
   - `MIG-202-A` -> `MIG-202-B` -> `MIG-202-C`
   - **Gate**: Verify `/profile` voice ownership in Preview.
   - `B14` -> `B15` -> `B16` -> `B17` -> `B18` -> `B19`
   - **Sweep**: Run `POST_B19_ALIGNMENT_SWEEP`.
4. **Completion**: Harvest only after `✅ COMET-ALIGNMENT COMPLETE`.

---

## ⚡️ SYSTEM_INSTRUCTIONS_PREAMBLE (Send Once)

```text
[SYSTEM_CONTEXT]
Role: Senior React 18 + TypeScript Frontend Engineer.
App: CareerCopilot prototype.
Navigation: Tab-based (activeTab state in App.tsx). No react-router-dom.
Layout: Hybrid root + src/.

[ZERO_CHATTER_POLICY]
- Do not provide conversational background.
- Do not explain "why" unless error handling requires it.
- Output ONLY code diffs and file lists.

[MANDATORY_STYLING_STRICT_CONSTRAINTS]
- Tokens: Use only CSS variables from 'frontend/src/design/styles/design-tokens.css' (--sys-*).
- Zero-Flora: STRICT BAN on botanical/flora motifs.
- Geometry: Asymmetric radii only (--sys-shape-*).
- Archetypes:
  - Strike: Button geometry (--sys-shape-blockRiot03).
  - Placard: Content cards (--sys-shape-placardTorn01).
  - Scaffold: Structural containers.
- Typography: Work Sans (UI), Fraunces (Headers), JetBrains Mono (Technical/Metadata).

[RESPONSE_STRUCTURE]
At the end of EVERY response:
1. List files changed.
2. Confirm no routing drift (no react-router-dom).
3. Confirm Zero-Flora compliance.
```

---

## 🔒 MIG-202: Profile Voice Ownership Lock

<GEMINI_3_FLASH_PROMPT id="MIG-202-A">
### Task: MIG-202-A — /profile Section Placement

**Goal**: Establish /profile as the canonical owner of voice profile management.

```text
[STRICT_CONSTRAINTS]
- /profile must visibly own the voice-profile entry surface.
- /settings must remain secondary (security/account utils only).
- Do not create a new route; map to activeTab logic.
- Section: VoiceProfileManagementSection.

[ALLOWED_FILES]
- App.tsx, types.ts, constants.ts
- src/**/profile/**, src/**/settings/**
- components/**/*Profile*, components/**/*Settings*
- hooks/**/*profile*, services/**/*profile*

[VERIFICATION_TARGET]
- Open /profile in Preview.
- Confirm Voice Management is visible.
- Confirm Settings is not the primary entry.

[OUTPUT_SIGNAL]
✅ MIG-202-A COMPLETE — /profile owns the voice-profile entry surface.
```
</GEMINI_3_FLASH_PROMPT>

<GEMINI_3_FLASH_PROMPT id="MIG-202-B">
### Task: MIG-202-B — Interaction States and Stubbed Behavior

**Goal**: Implement local UI state for the voice-profile interaction flow.

```text
[STRICT_CONSTRAINTS]
- Components: VoiceProfileCreationPanel, VoiceSampleSubmissionForm, VoiceProfileStatusCard.
- Logic: Local stub save/read only. No backend integration.
- States: Empty, Input (writing sample), Loading, Success, Error, Update/Replace.
- Geometry: Submission form must use 'Placard' archetype.

[ALLOWED_FILES]
- [Same as MIG-202-A]

[VERIFICATION_TARGET]
- Demonstrate writing sample entry.
- Demonstrate loading -> success transition.
- Demonstrate re-submit/update path.

[OUTPUT_SIGNAL]
✅ MIG-202-B COMPLETE — voice-profile states are implemented with local stub logic.
```
</GEMINI_3_FLASH_PROMPT>

<GEMINI_3_FLASH_PROMPT id="MIG-202-C">
### Task: MIG-202-C — Polish and Harvest Readiness

**Goal**: Final refinement for portable, canonical-ready code.

```text
[STRICT_CONSTRAINTS]
- Normalize hierarchy, helper text, and CTA labels.
- Remove any "Test" or "Prototype" naming from component surface.
- Typography: Use JetBrains Mono for technical status/metadata.
- Ownership: Confirm /settings has ZERO voice-profile drift.

[ALLOWED_FILES]
- [Same as MIG-202-A]

[OUTPUT_SIGNAL]
✅ MIG-202-C COMPLETE — prototype is harvest-ready for /profile voice ownership.
```
</GEMINI_3_FLASH_PROMPT>

---

## 📂 B14-B19: Feature Prototype Pass

<GEMINI_3_FLASH_PROMPT id="B14">
### Task: B14 — Cover Letter Metrics

```text
[STRICT_CONSTRAINTS]
- Target: Submitted Docs -> Cover Letter subsection.
- Metrics: Keyword, Narrative, Personalization, Tone.
- UI: Use 'Placard' cards. Scores/metadata MUST use JetBrains Mono.
- Logic: Local stub data only.

[ALLOWED_FILES]
- Submitted Docs component and its direct children.

[OUTPUT_SIGNAL]
✅ COMET-B14 COMPLETE — cover letter metrics are ready for harvest review.
```
</GEMINI_3_FLASH_PROMPT>

<GEMINI_3_FLASH_PROMPT id="B15">
### Task: B15 — Image Studio Shell

```text
[STRICT_CONSTRAINTS]
- Label: 'Image Studio (Preview)' inside Submitted Docs.
- Features: Prompt input, 'Generate' preview btn, grid of placeholders.
- UI: Grid cards use 'Placard' geometry.
- Limits: No real API integration. No new nav items.

[ALLOWED_FILES]
- Submitted Docs component and children.
- App.tsx (if needed for entry exposure).

[OUTPUT_SIGNAL]
✅ COMET-B15 COMPLETE — Image Studio shell is implemented.
```
</GEMINI_3_FLASH_PROMPT>

<GEMINI_3_FLASH_PROMPT id="B16">
### Task: B16 — Applications Board and Detail

```text
[STRICT_CONSTRAINTS]
- Board: Kanban columns (Draft, Applied, Interviewing, Offer, Archived).
- Detail: Unified workspace showing JD, linked docs, and status.
- UI: Cards use 'Placard'. Columns use 'Scaffold'.
- Logic: Local state only.

[ALLOWED_FILES]
- Applications component and children.

[OUTPUT_SIGNAL]
✅ COMET-B16 COMPLETE — Applications board and detail workspace are implemented.
```
</GEMINI_3_FLASH_PROMPT>

<GEMINI_3_FLASH_PROMPT id="B17">
### Task: B17 — Dashboard ATS Trend Chart

```text
[STRICT_CONSTRAINTS]
- Model: Minimal SVG sparkline/bar chart (Last 5 mock applications).
- Colors: inkGold (positive) / solidarityRed (critical dips).
- Logic: Hard-coded sample data only. No external libs.

[ALLOWED_FILES]
- Dashboard component and children.

[OUTPUT_SIGNAL]
✅ COMET-B17 COMPLETE — Dashboard ATS trend chart is implemented.
```
</GEMINI_3_FLASH_PROMPT>

<GEMINI_3_FLASH_PROMPT id="B18">
### Task: B18 — Profile Settings Integrations

```text
[STRICT_CONSTRAINTS]
- Target: Settings -> Utility Integrations panel.
- Items: Gmail scan, Job Scout (Connection status, last sync, Manage button).
- UI: Panels use 'Scaffold'. Manage buttons use 'Strike' (--sys-shape-blockRiot03).
- DRIFT_LOCK: Do not move voice ownership to Settings. /profile remains owner.

[ALLOWED_FILES]
- Settings component and utility children.

[OUTPUT_SIGNAL]
✅ COMET-B18 COMPLETE — utility integrations panel is implemented without ownership drift.
```
</GEMINI_3_FLASH_PROMPT>

<GEMINI_3_FLASH_PROMPT id="B19">
### Task: B19 — Mobile Bottom Nav

```text
[STRICT_CONSTRAINTS]
- Primary Actions: Jobs, ATS Check, Submitted Docs, Applications.
- UI: worker-ash-base text/icons on charcoalBackground-base bar.
- Behavior: Hide desktop sidebar on small screens. Map taps to activeTab.

[ALLOWED_FILES]
- App.tsx, Navigation/Shell components.

[OUTPUT_SIGNAL]
✅ COMET-B19 COMPLETE — mobile bottom nav is implemented.
```
</GEMINI_3_FLASH_PROMPT>

---

## 🏁 POST_B19_ALIGNMENT_SWEEP

<GEMINI_3_FLASH_PROMPT id="ALIGNMENT_SWEEP">
```text
[STRICT_CONSTRAINTS]
- Normalize all naming, section hierarchy, and interaction labels across B1-B19 pass.
- Verification: Confirm /profile is the visible voice-profile owner.
- Audit: Strict Zero-Flora check. Ensure unique IDs for all interactives.

[OUTPUT_SIGNAL]
✅ COMET-ALIGNMENT COMPLETE — prototype-wide feature-spec alignment is ready for harvest planning.
```
</GEMINI_3_FLASH_PROMPT>
