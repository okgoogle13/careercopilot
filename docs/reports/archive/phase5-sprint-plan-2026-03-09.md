# Phase 5 Sprint Plan - KR/M3 Higher-order Organisms

## Sprint Frame
- Sprint: `Phase5-Execution-S1`
- Window: `2026-03-10` to `2026-03-23`
- Objective: Deliver expressive KR/M3 upgrades for `CoverLetterGenerator`, `KSCGenerator`, and `DesignSidekick` with deterministic gate evidence.
- Input Gate: Phase 4 pipeline `PASS` (2026-03-09)

## Milestones and Tasks

### Milestone M1 - CoverLetterGenerator expressive conversion
- Owner: `frontend-feature-squad`
- Target date: `2026-03-13`
- Acceptance criteria:
  - Uses semantic KR tokens only (`--sys-*`), no hardcoded hex.
  - Expressive motion behavior present and review-approved.
  - Keyboard/focus accessibility checks pass.
  - Story/demo evidence captured.

### Milestone M2 - KSCGenerator expressive conversion
- Owner: `frontend-feature-squad`
- Target date: `2026-03-18`
- Depends on: `M1`
- Acceptance criteria:
  - Same token and motion rules as M1.
  - No regressions in STAR workflow interactions.
  - Accessibility checks pass.

### Milestone M3 - DesignSidekick hero conversion
- Owner: `frontend-platform`
- Target date: `2026-03-23`
- Depends on: `M2`
- Acceptance criteria:
  - Placard-based floating structure integrated.
  - KeralaRageButton expressive trigger behavior integrated.
  - LayeredHero + substrate overlays integrated.
  - Visual baseline snapshots approved.

## Task-Router Payload (execution order + ownership)
1. `P5-T1-coverletter-migration`
- assigned_to: `codex-cli`
- priority: `high`
- depends_on: none
- done_when: M1 acceptance criteria satisfied.

2. `P5-T2-ksc-migration`
- assigned_to: `codex-cli`
- priority: `high`
- depends_on: `P5-T1-coverletter-migration`
- done_when: M2 acceptance criteria satisfied.

3. `P5-T3-designsidekick-hero`
- assigned_to: `gemini-design-sidekick`
- priority: `high`
- depends_on: `P5-T2-ksc-migration`
- done_when: M3 acceptance criteria satisfied.

4. `P5-T4-visual-regression-baselines`
- assigned_to: `gemini-code-executor`
- priority: `high`
- depends_on: `P5-T1-coverletter-migration`, `P5-T2-ksc-migration`, `P5-T3-designsidekick-hero`
- done_when: snapshots approved and CI gate green.

5. `P5-T5-phase5-gate-audit`
- assigned_to: `codebase-orchestrator`
- priority: `high`
- depends_on: `P5-T4-visual-regression-baselines`
- done_when: phase5 gate report generated with pass/fail.

## Standup/Blocker Rules
- Recompute sprint ETA daily from completed milestone count.
- Escalation clocks:
  - critical: 1 day
  - high: 2 days
  - medium: 3 days
  - low: 5 days
- Current blocker at sprint kickoff: none blocking start.

## Readiness View (for Phase 5 kickoff)
- Decision: `GO`
- Reason: Phase 4 entry gate is fully passed; no critical blockers prevent starting Phase 5.
- Condition: keep `P5-T4` baseline work as mandatory before Phase 5 close.
