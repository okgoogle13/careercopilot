# COMET EXECUTION SCRIPT: GOOGLE AI STUDIO BUILD MODE (IN‑PLACE EDITS)

> [!IMPORTANT]
> **CONSISTENCY NOTE**: The `prototype_v2.0` prompt pack is the operational source for Comet execution. This backlog is a governance mirror and must remain synchronized. If any divergence occurs, it must be reconciled immediately to the `prototype_v2.0` standard.

## 1.0 COMET SYSTEM CONFIGURATION

- **Target UI:** Google AI Studio “Build” mode chat input for the **existing** CareerCopilot prototype app (current baseline commit: `4535a6b` in local repo).
- **Model Configuration:**
  - **Default Model:** Gemini 3 Flash (for rapid structural scaffolding).
  - **Complex Model:** Gemini 3.1 Pro (only when explicitly requested by a batch action).
- **Action Sequence (per batch):**
  1. Read Batch definition and execute any pre-batch model changes.
  2. Paste Batch prompt into Build chat.
  3. Click “Submit” / Run.
  4. Enter Wait State and monitor results.
- **Wait State Trigger:**
  - Standard Timeout (Gemini 3 Flash): 2 minutes.
  - Extended Timeout (Gemini 3.1 Pro): 15 minutes.
  - **Wait until:**
    - Code view updates AND Preview pane refreshes AND No error banners.
- **Error Triggers (HALT):**
  - “Generation failed”, “Error”, or “Timeout”.
  - Modification **outside Allowed files**.
  - **Un-named dependency changes** in `package.json`.
  - **Navigation shell resynthesis** (no `react-router-dom` allowed).
- **Verification (per batch):**
  - Parse the model’s “files changed” list.
  - Confirm compliance with Allowed files and Dependency lockdown.

---

## 2.0 INITIALIZATION (PREAMBLE)

**Batch Instruction Preamble:**
> You are a senior React 18 + TypeScript frontend engineer working on an **existing** CareerCopilot prototype app. This is an in-place modification workflow, not a fresh scaffold. Modify only the requested files and sections for each instruction. The app currently uses a tab-based navigation pattern in `src/App.tsx` (`activeTab` state) and does NOT use `react-router-dom`.
>
> **CRITICAL RULES:**
> - No `react-router-dom` or new navigation frameworks.
> - No dependency drift in `package.json`.
> - No shell resynthesis or project restructuring.
> - Apply **UX Copy**, **M3 Expressive**, and **KR Token-Alignment** layers to all generations.
> - Use local stub data only.

---

## 3.0 THE DRIP-FEED BACKLOG (FULL MIRROR)

### Batch Group 1: Shell & Core Navigation
- **B1: Global Shell & Tab Routing**: Define tabs (Dashboard, Lookout, Analysis, Workbench, Kanban, Settings). Keep `activeTab` pattern.
- **B2: Navigation Labels**: Highlight "Find" (Lookout), "Generate" (Workbench), "Track" (Kanban).
- **B3: Onboarding "Choose Your Path"**: First-time user flow for profile vs quick application.
- **B4: Dashboard Checklist**: dismissible "Getting Started" card.
- **Checkpoint 1**: Export, Sync, Verify (B1-B4).

### Batch Group 2: Discovery & Analysis Patterns
- **B5: Lookout List & Empty State**: Stub job card list + rich empty state ("Run search", "Paste URL").
- **B6: Dashboard "Paste Job URL"**: Quick action leading to Analysis view.
- **B7: Analysis 4-Quadrant Layout**: Map scores/insights to "Hard Skills", "Soft Skills", "Impact", "Readability".
- **B8: "Your Documents" & Government CTA**: Metadata provenance + KSC trigger banner.
- **Checkpoint 2**: Export, Sync, Verify (B5-B8).

### Batch Group 3: Document Workbench & AI Feedback
- **B9: Workbench Shell & Stepper**: Multi-step flow labels (Tailor, Generate, Review).
- **B10: Inline Bullet Suggestions**: "Original" vs "Suggested" text with Apply/Discard controls.
- **B11: Context Badge & Style Cycle**: Show doc-count provenance + "Formal/Conversational" variants.
- **B12: KSC Tab & STAR Tooltip**: Dedicated KSC logic and government-role explanations.
- **B13: Voice Profile CTA**: Transition from Workbench successes to Settings → Voice Profile.
- **Checkpoint 3**: Export, Sync, Verify (B9-B13).

### Batch Group 4: Extended Feedback & Tracking
- **B14: Cover Letter Metrics**: Keyword, Narrative, Personalization, Tone gauges.
- **B15: Image Studio Shell**: Prompt input + preview grid (stub only).
- **B16: Kanban Board & Application Detail**: Status columns + overlay workspace for individual apps.
- **B17: Dashboard ATS Trend**: SVG sparkline of recent scores.
- **B18: Settings Integrations**: Gmail Scan / Job Scout connection placeholders.
- **B19: Mobile Bottom Nav**: responsive-only bar (Find, Generate, Track).
- **Final Checkpoint**: Full build verification & prototype commit.

---

## 4.0 PORTABILITY & HARVEST NOTES (INTERNAL USE)
While the prototype (B1-B19) builds a complete horizontal journey, the **canonical promotion** targets only specific components (Track B) and backend logic (Track A) as defined in the [Harvest Blueprint](blueprint-ai-studio-integration.md).
