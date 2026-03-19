# AI Studio Prototype Staging & Harvest Plan

## Prototype-First Lens (Revision 3.0)

> **Current gate:** Run the prototype stabilization prompt in `AI_STUDIO_CLOSE_OUT_PROMPTS.md` first. Do not begin physical harvest until the stabilization gate passes.

**Prototype source:** `https://github.com/okgoogle13/prototype_v2.0`
**Deprecated local checkout:** `/Users/okgoogle13/Downloads/careercopilot-aistud` (deleted; invalid)

**Date:** 2026-03-20
**Analysis ref:** `STRUCTURE_MAP.prototype.md`
**Core Strategy:** Keep the AI Studio prototype useful as a staging environment while preventing it from redefining canonical routing, shell ownership, or route-family truth in the main repository.

---

## 1 · Current Phase

**Phase:** `Pre-Harvest Stabilization`
**Sprint Status:** `blocked`
**Readiness Score:** `58/100`

### Why We Are Blocked

- The latest Gemini-generated implementation plan treated the prototype as implementation truth.
- The prior close-out prompt instructed AI Studio to normalize shell and routing behavior that belongs to canonical runtime authority.
- The prior handover advanced directly to physical harvest before stabilization was verified.
- The prototype still carries tab-driven pseudo-routing that can mislead downstream harvest work.
- The old local prototype checkout was deleted, so all prototype-facing instructions must target the GitHub repository instead.

### Exit Criteria For This Phase

- Prototype route/navigation ambiguity is removed or explicitly annotated as prototype-only.
- Support-reference file names are aligned to canonical target-state ownership.
- Prototype-to-canonical mapping artifact is created.
- Imports are updated after renames.
- No unauthorized route or shell ownership drift is introduced.

---

## 2 · Governing Constraints

Prototype work must obey these rules:

- Prototype is `support_reference` only.
- Canonical runtime routing authority remains `frontend/src/App.tsx` in the main repo.
- Canonical route ownership remains `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.md`.
- Do not promote prototype tabs, labels, or shell behavior into product truth.
- Do not recommence physical harvest until the stabilization gate passes.

---

## 3 · Completed Work

- Harvest planning docs were migrated into `docs/project/active/ai-studio-prototype-harvest/`.
- `STRUCTURE_MAP.prototype.md` documents the prototype structure and its support-only role.
- `AI_STUDIO_CLOSE_OUT_PROMPTS.md` now contains the corrected prototype-only stabilization prompt.
- `CLAUDE_HANDOVER.md` now instructs Claude to invoke `project-manager` and hold at the stabilization gate.
- Review of the broken Gemini plan is complete; its route and shell assumptions are rejected.

---

## 4 · Active Next Step

Run the stabilization prompt in `AI_STUDIO_CLOSE_OUT_PROMPTS.md` against the prototype only.

Source repository for that work:
- `https://github.com/okgoogle13/prototype_v2.0`

Expected deliverables from AI Studio:
- required file renames completed
- imports/exports updated
- top-level prototype comments stating canonical routing belongs to the main repo
- no canonical route claims introduced
- `docs/prototype-to-canonical-mapping.md` created inside the prototype
- final file tree and deletion audit reported

Do not harvest any component into the main repository until those deliverables are verified.

---

## 5 · Phase Sequence

### Phase A: Prototype Stabilization

**Owner:** Gemini / AI Studio
**Status:** `active`
**Goal:** Remove route ambiguity and align support-reference naming to target-state ownership.

**Acceptance criteria:**
- all stabilization exit criteria satisfied
- explicit proof that deleted files had zero remaining imports
- no main-repo runtime route changes proposed or made

### Phase B: Physical Harvest Planning

**Owner:** Claude via `project-manager`
**Status:** `blocked on Phase A`

**Goal:** Reopen harvest planning only after the stabilized prototype output is verified.

**Phase B can start only when Phase A is `PASS`.**

### Phase C: Physical Harvest Execution

**Owner:** implementation agents
**Status:** `not started`

**Goal:** Move approved support-reference patterns into canonical repo surfaces according to the migration authority stack.

---

## 6 · Explicit Non-Goals

- Do not convert the prototype to `react-router-dom`.
- Do not invent `/workspace`, `/past`, `/library`, or `/studio` as canonical product routes.
- Do not treat prototype shell/navigation patterns as runtime authority.
- Do not begin component-by-component harvesting from AI Studio output until stabilization is verified.

---

## 7 · Active File List

| Role | Final Path |
| --- | --- |
| Strategy and phase tracking | `AI_STUDIO_HARVEST_PLAN.updated.md` |
| Prototype stabilization prompt | `AI_STUDIO_CLOSE_OUT_PROMPTS.md` |
| Claude restart handover | `CLAUDE_HANDOVER.md` |
| Prototype structure map | `STRUCTURE_MAP.prototype.md` |
| Prototype source repository | `https://github.com/okgoogle13/prototype_v2.0` |

---

## 8 · Immediate Operator Instruction

Run the corrected AI Studio prompt first. Then review the output against the stabilization gate. Only after a verified `PASS` should Claude recommence harvest planning through the `project-manager` skill.
