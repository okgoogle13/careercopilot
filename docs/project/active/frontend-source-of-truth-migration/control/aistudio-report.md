# Google AI Studio Prompt-Driven Prototype Strategy (Support-Reference Mode)

> [!IMPORTANT]
> **CONSISTENCY NOTE**: The `prototype_v2.0` prompt pack is the operational source for Comet execution. This control document is a governance mirror and must remain synchronized. If any divergence occurs, it must be reconciled immediately to the `prototype_v2.0` standard.

## Executive Summary
This report defines the strategy for using Google AI Studio’s **Build apps** mode and the **Comet** controller to maintain the `prototype_v2.0` repository. It shifts framing from "greenfield development" to **in-place modification of a support-reference prototype**.

The goal is to maximize the harvestability of feature internals, hooks, and interaction patterns while strictly quarantining the prototype's non-canonical shell and navigation architecture.

---

## 1. Safety & Operating Model (Guardrails)
To prevent architectural drift and preserve the value of harvested code, all AI Studio/Comet operations must adhere to these non-negotiable rules:

1. **In-Place Modification**: The prototype is an existing app. Do not resynthesize the shell or regenerate the project structure from scratch.
2. **Quarantined Shell**: The top-level shell (`App.tsx`, `AppShell.tsx`) is support-only and does NOT imply canonical route ownership.
3. **No Routing Drift**: Do not introduce `react-router-dom`, URL-based routes, or new navigation systems. Maintain local state (`activeTab`) for navigation.
4. **Dependency Lockdown**: Do not add, remove, or upgrade dependencies unless explicitly named in a batch.
5. **React 18 Compatibility**: Even if the prototype runs React 19, all component patterns must remain React 18-compatible to ensure safe harvest into the main repository.
6. **Local Stub Logic**: Use local stub data and mock handlers only. Do not connect to real backends or APIs.

---

## 2. Design & Portability Layers
Every generation batch must apply these three layers to ensure "Harvest-Ready" code:

| Layer | Requirement |
| :--- | :--- |
| **UX Copy** | Use plain-language, action-oriented microcopy. Include realistic states for empty, loading, and success views. |
| **M3 Expressive** | Use strong hierarchy, distinct sectioning, and expressive state contrast. Avoid flat or generic dashboard visuals. |
| **KR Token Alignment** | Avoid hardcoded hex colors. Use local constants or semantic variables that can map to KR Solidarity tokens. |

### Workspace Feature Patterns
The prototype should prioritize the development of **rich, in-page tabs and task-specific workspace flows** (e.g., Analysis Quadrants, Workbench Steppers, Kanban Detail views). These internal patterns are high-value harvest targets, regardless of the non-canonical status of the top-level prototype tabs.

---

## 3. Workflow & Model Selection
1. **Model Orchestration**:
   - **Gemini Flash**: Default for structural edits and rapid scaffolding. (2-minute timeout).
   - **Gemini Pro**: Required for batches involving complex logic, dense state, or large file contexts. (15-minute timeout).
2. **Incremental Batching**: Send 1–2 tightly scoped changes per prompt. Do not merge multiple batches.
3. **Checkpoint & Verify**: After every 4 batches, pause automation for a manual export and diff. Verify that no "Shell Drift" or "Dependency Leak" occurred before continuing.

---

## 4. Feature Backlog Strategy
The backlog is designed to build out the "Support Surfaces" of the CareerCopilot journey (Find -> Generate -> Track) as isolated feature containers:

- **Lookout (Find)**: Rich empty states and job-scout list patterns.
- **Analysis (Analyze)**: 4-Quadrant ATS visualization logic.
- **Workbench (Generate)**: Multi-step document tailoring and inline suggestion UX.
- **Kanban (Track)**: Application detail workspaces and status transition patterns.

These surfaces provide the visual and logical "blueprint" for the canonical feature implementation without claiming authority over the product's final routing structure.
