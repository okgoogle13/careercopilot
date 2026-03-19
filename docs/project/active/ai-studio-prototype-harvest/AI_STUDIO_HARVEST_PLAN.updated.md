# AI Studio Prototype Staging & Harvest Plan

### Prototype-First Lens (Revision 2.0)

> **All AI Studio prompts are in `AI_STUDIO_PROMPTS.md`. Run those first, then return here for Track A/B/C execution.**

**Date:** 2026-03-18  
**Analysis ref:** `STRUCTURE_MAP.prototype.md`  
**Core Strategy:** Shift complexity from the main repo migration to the prototype staging environment. **Edit in AI Studio while it's cheap, then harvest clean code.**

---

## 1 · What Changed (Prototype-First Lens)

This strategy treats the AI Studio prototype as a **staging environment**, not just a static source. By fixing "upstream" in the prototype, we eliminate several high-friction tasks in the migration blueprint.

| Migration Task | Impact of Prototype-First Tweak | Outcome |
|:---:|---|---|
| **B1/B2 (Re-skins)** | Props/imports/hex-codes are pre-cleaned in AI Studio. | Blueprint tasks become simple "copy results" gates. |
| **B3 (Types)** | Verified matching schemas in `types.ts`. | **DELETED**; replaced with 5-minute direct copy. |
| **A2 (Prompts)** | PascalCase field names fixed to snake_case in proto. | Eliminates transcription errors during Python conversion. |
| **Sprint 2 (Monolith)** | Decomposition + tokenization happen in AI Studio. | No 70KB monoliths ever enter the main repo PRs. |

---

## 2 · TWEAK_FIRST DETAILS (AI Studio Prompts)

Execute these prompts in AI Studio on the prototype branch `careercopilot-aistud` BEFORE beginning the migration tracks.

### PT-2: `ingestion_prompts.md` Casing Alignment
**Goal:** Align data fields with Python Pydantic naming conventions.

**Prompt:**
```
In the file ingestion_prompts.md, find every reference to a structured data field name
and rewrite it in snake_case. Apply these replacements exactly:
  Needs_Review_Flag → needs_review_flag
  STAR_Feedback → star_feedback
  Improvement_Suggestions → improvement_suggestions
  Action_Verb → action_verb
  Noun_Task → noun_task
  Master_Skills_Inventory → (leave as-is)

Add this comment on line 1: "# Python-harvest-ready — snake_case aligned 2026-03-18"
Output the full revised file contents only.
```


### PT-3: `ATSScoreCard.tsx` Token Re-Skin

**Goal:** Clean imports and replace raw Tailwind with KR Solidarity CSS variables using context-aware replacements instead of static line numbers.

→ See `AI_STUDIO_PROMPTS.md`, Step 1


### PT-4: `AuditDisplay.tsx` Token Re-Skin

**Goal:** Clean imports and apply Solidarity tokens to violations and scan block with context-aware precision.

→ See `AI_STUDIO_PROMPTS.md`, Step 2


### PT-5: `ValidationDashboard.tsx` Decomposition (Sprint 2 Pre-flight)

**Goal:** Split the 1,200-line monolith into harvestable sub-components over three sequential prompted steps.

**Step A** (decomposition JSON) → See `AI_STUDIO_PROMPTS.md`, Step 3
**Step B** (per sub-component generation) → See `AI_STUDIO_PROMPTS.md`, Step 4
**Step C** (barrel export) → See `AI_STUDIO_PROMPTS.md`, Step 5

*Wait for AI Studio to return the Step 3 JSON and confirm the split before proceeding to Step 4.*


### PT-6: Global Polish & Layout (Batch 4)

**Goal:** Enforce the KR Solidarity v6.0 dark mode, proper typographic hierarchy, and safe component shapes for navigational elements while strictly preventing non-canon assets.

→ See `AI_STUDIO_PROMPTS.md`, Step 6


### PT-7: Final Close-Out (Adaptive M3 + Layout)

**Goal:** Implement the definitive M3 Adaptive Window Size Classes (360dp/80dp/BottomNav) across the 16 canonical product routes.

→ See `AI_STUDIO_CLOSE_OUT_PROMPTS.md`

---

## 3 · UX Insights ( Conceptual Patterns to Keep)

While the `App.tsx` navigation code is `IGNORE` for harvest, do not lose these two logic patterns:

1. **Workspace-First Entry:** The prototype bypasses onboarding to land directly on the analysis UI. We should consider `/analysis` as the primary post-login landing for power users.
2. **Simplified Role-Based Navigation:** The 4 prototype tabs map perfectly to the 4 key user jobs. We should use this to evaluate simplifying the main repo's sidebar navigation.

---

## 4 · Final File List

| Role | Final Path |
|---|---|
| **Structure Map** | `STRUCTURE_MAP.prototype.md` |
| **latest Plan / Prompts** | `AI_STUDIO_HARVEST_PLAN.updated.md` |
| **Claude Response Doc** | `claude_analysis_responses.md` |
| **Logic Verification** | `jobscan_final_report.md` |
