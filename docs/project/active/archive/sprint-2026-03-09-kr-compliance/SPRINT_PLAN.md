# Sprint Plan: KR Compliance Hardening

- Sprint ID: `SPRINT-2026-03-09-KR-COMPLIANCE`
- Objective: Ship a stable Kerala Rage baseline with enforced token/brand guardrails and improved visual quality on key routes.
- Window: March 9, 2026 to March 20, 2026
- Owners:
  - Frontend Lead
  - Design Systems Lead
  - QA Lead

## Milestones

### M1: Guardrails Locked (Due: March 10, 2026)
- Acceptance Criteria:
  - `python3 scripts/design-validation/validate-tokens.py` passes.
  - Legacy brand sweep has no banned matches.
  - Baseline visual audit JSON exists and is referenced.
- Progress Signal:
  - CI job `Frontend Brand Compliance` added to `.github/workflows/ci.yml`.

### M2: Route-Level UI Refinements (Due: March 13, 2026)
- Acceptance Criteria:
  - Landing readability improved.
  - Ingestion hero/layout balance improved.
  - Job Queue empty/error state improved.
  - No regression in token/brand checks.

### M3: Visual Audit Reliability (Due: March 17, 2026)
- Acceptance Criteria:
  - Screenshot and audit workflow runs in approved environment.
  - JSON report artifact generated each run.

### M4: Release Readiness (Due: March 20, 2026)
- Acceptance Criteria:
  - Average visual score >= 85 on target routes.
  - Touched-area tests/type/lint checks pass.
  - Sprint close summary published.

## Dependencies
- `M1 -> M2`
- `M1 -> M3`
- `M2 + M3 -> M4`

## Readiness Score
- Formula: `(completed_milestones / 4) * 70 + blocker_bonus`
- `blocker_bonus = 30` when no critical blockers, else `0`
- Bands:
  - Green: `85-100`
  - Yellow: `60-84`
  - Red: `<60`

## Baseline Artifacts
- Visual report: `frontend/docs/design/generated/previews/component-visual-audit-report.json`
- Screenshot set: `frontend/docs/design/generated/previews/*.png`
