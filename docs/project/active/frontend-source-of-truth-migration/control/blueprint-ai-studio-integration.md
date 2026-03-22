# AI Studio Harvest Blueprint — Support-Reference Model

**Date:** 2026-03-22 (Reconciled)
**Status:** Active — Support-Reference Mode
**Parent initiative:** PR126 Frontend Source-of-Truth Migration
**Branch:** `feat/prototype-harvest-prep`

---

## 1. Context & Framing

This blueprint defines the "Harvest" relationship between the external **Support Prototype** (`prototype_v2.0`) and the **Canonical Main Repository**.

Contrary to earlier "Integration" models, this is a **one-way harvest** of patterns, logic, and isolated UI components. The prototype remains a quarantined "Support-Reference" and its top-level shell or navigation architecture must **never** be promoted into the main project.

### Value Targets for Harvest:
1. **AI Prompt Heuristics**: Capturing the DEEP STAR CRITIQUE logic from the prototype's prompts (Vague Language Audit, Quantification Gap, per-field suggestions).
2. **UI Component Patterns**: Logic and interaction patterns for `ATSScoreCard.tsx`, `AuditDisplay.tsx`, and `ValidationDashboard.tsx` to fill the `/analysis` feature gaps.
3. **Task-Specific Workspaces**: Harvesting internal tabbed workspace patterns (Analysis Quadrants, Workbench Steppers) rather than the top-level app tabs.

### Governance Documents:
- [Comet Execution Mirror](comet-backlog.md) — Shorthand mirror of the operational prototype backlog.
- [AI Studio Strategy Report](aistudio-report.md) — High-level strategy for support-reference prototyping.

---

## 2. Architecture: The Harvest Pipeline

Instead of a direct "Component Transformation Pipeline," we maintain a **Harvest Pipeline**:

```
External Prototype (Reference)         Canonical Main Repo (Target)
──────────────────────────────────     ────────────────────────────────────
[Logic Pattern] B1: Analysis Logic  →  [Implementation] Analysis Feature
[UI Pattern]    B5: Audit UX        →  [Implementation] Audit Component
[Interaction]   B9: Stepper Flow    →  [Implementation] Workbench Feature
           ↓                                      ↑
      AI Studio (Refine)            →        Manual Integration
```

**Stack Compatibility Layer**: All harvested code must be adapted from the prototype's React 19 / Vite environment to the canonical React 18 / Vite / KR Solidarity v6.1 system during integration.

---

## 3. Track A — Backend Prompt Harvest

The Goal: Bring the prototype's high-fidelity "Deep STAR" and "ATS Scan Simulation" logic into the canonical Genkit flows.

### A1 — Logic Mapping: DEEP STAR fields
Map prototype heuristic logic to `backend/app/genkit_flows/types.py`:
- `AchievementSuggestions` (action_verb, noun_task, metric, strategy, outcome)
- `DocumentAudit` (overall_score, scan_simulation, violations)

### A2 — Prompt Consolidation: Ingestion Flow
Consolidate prototype audit logic into `backend/app/genkit_flows/ingestion_flow.py`:
- **Vague Language Audit**: Strong verb replacement pool (orchestrated, pioneered, implemented).
- **Quantification Gap**: Outcome placeholder logic.
- **STAR Critique**: Field-level feedback (Situation, Task, Action, Result).

---

## 4. Track B — UI Harvest (Pattern Adoption)

We use AI Studio to generate "Harvest-Ready" versions of prototype components, applying the KR Solidarity v6.1 tokens and M3 Expressive layers before manual integration.

### B1 — Pattern: ATSScoreCard
**Reference**: `ATSScoreCard.tsx` (Prototype)
**Target**: `frontend/src/features/analysis/components/ATSScoreCard.tsx`

**Harvest Rule**: Cleanse hardcoded Tailwind colors. Apply `var(--sys-color-*)` semantic tokens. Preserve the frame-motion logic and circular progress ring patterns.

### B2 — Pattern: AuditDisplay
**Reference**: `AuditDisplay.tsx` (Prototype)
**Target**: `frontend/src/features/analysis/components/AuditDisplay.tsx`

**Harvest Rule**: Preserve the "10-Second Recruiter Scan" UX and italic scan simulation text. Ensure severity logic maps to `solidarityRed`, `solidarityYellow`, and `activistSmokeGreen`.

---

## 5. Track C — Canonical Feature Wiring

### C1 — Surface Readiness: AnalysisPage
Before wiring, the canonical `AnalysisPage.tsx` must be sanitized of deprecated archetypes (`Lens`, `Pebble`, `Stone`) and updated to `Placard`, `Strike`, and `March`.

### C2 — Logic Wiring: Mutative Integration
Wire the harvested logic and components using TanStack Query `useMutation` patterns. Avoid direct "Sync" of prototype state; instead, implement canonical state handling that consumes the new backend audit fields.

---

## 6. Verification & Gates

1. **Token Gate**: `grep` for hardcoded Tailwind colors in harvested feature folders.
2. **Type Gate**: `tsc --noEmit` validation of integrated components against canonical types.
3. **Compliance Gate**: Vision-Scorer audit of the integrated feature against KR Solidarity v6.1 standards.
4. **Governance Mirror Gate**: Verify that the integration does not violate any guardrails defined in the [Prototype Safety Audit](../prototype-safety-audit.md).
