# Prototype Harvest Blocker Sprint

## Sprint Frame

- **Objective**: Convert the cloned AI Studio prototype from a vague support/reference source into a harvest-prepared source set with explicit owner mapping, reduced architectural drift, and a verified pattern-catalog handoff.
- **Sprint Window**: 2026-03-25 to 2026-03-29
- **Primary Owner**: Claude Code execution worker
- **Review Owner**: Human harvest reviewer
- **Source Prototype**: `docs/project/active/frontend-source-of-truth-migration/sources/prototype_v2.0` at commit `f31bca0`
- **Authorities**:
  - `docs/project/active/frontend-source-of-truth-migration/control/COMET-MANIFEST.md`
  - `docs/project/active/frontend-source-of-truth-migration/control/AI-STUDIO-PROMPT-PACK.md`
  - `docs/project/active/frontend-source-of-truth-migration/prototype-integration.md`
  - `docs/project/active/frontend-source-of-truth-migration/contracts/*.xml`

## High-Level Deliverables

1. Prototype-source documentation no longer implies canonical routing, Firebase-era architecture, or extension-first ownership.
2. Voice ownership drift is corrected so `/profile` is the only visible owner and `/settings` remains secondary-only.
3. Extension-specific and Firebase-specific cues are removed from harvest inputs or clearly quarantined.
4. A route-mapped pattern catalog exists for harvest workers.
5. A verification pass proves the folder is ready for harvest prep, even if it is still not a drop-in implementation.

## Milestones

### M1: Documentation Quarantine

- **Goal**: Neutralize stale prototype documentation that conflicts with current migration truth.
- **Acceptance Criteria**:
  - Prototype README no longer claims `react-router-dom` or canonical SPA ownership.
  - Prototype guidelines no longer imply old route ownership as execution truth.
  - A harvest-status note exists in the source folder or migration control docs.
- **Dependencies**: None
- **Target Date**: 2026-03-25

### M2: Ownership Drift Cleanup

- **Goal**: Remove or rewrite prototype UI cues that conflict with current owner mapping.
- **Acceptance Criteria**:
  - Voice CTA points to `/profile`, not Settings.
  - No visible prototype text suggests Settings is the voice-profile owner.
  - Settings remains utility/secondary-only in prototype messaging.
- **Dependencies**: M1
- **Target Date**: 2026-03-26

### M3: Extension And Firebase Quarantine

- **Goal**: Prevent extension/Firebase assumptions from contaminating harvest inputs.
- **Acceptance Criteria**:
  - Extension-specific onboarding or checklist cues are removed, replaced, or marked support-only.
  - Source docs explicitly state that extension and Firebase scaffolding are not harvest targets.
  - Harvest workers can identify blocked files without re-auditing the whole folder.
- **Dependencies**: M1
- **Target Date**: 2026-03-27

### M4: Pattern Catalog Extraction

- **Goal**: Convert useful prototype surfaces into a route-mapped harvest catalog.
- **Acceptance Criteria**:
  - `/profile`, `/analysis`, `/apply/quick`, `/tracker`, `/opportunities`, and `/documents` pattern sources are listed.
  - Each pattern entry has source file, canonical owner, blocked assumptions, and harvest notes.
  - The catalog is saved under the migration project folder.
- **Dependencies**: M2, M3
- **Target Date**: 2026-03-28

### M5: Readiness Verification

- **Goal**: Prove the folder is harvest-prepared with measurable checks.
- **Acceptance Criteria**:
  - Verification commands complete with expected results.
  - Blocked assumptions are documented and route-owner mappings are contract-aligned.
  - The readiness review is updated from vague blocker language to concrete remediation status.
- **Dependencies**: M4
- **Target Date**: 2026-03-29

## Dependency Map

- `M1` unlocks `M2` and `M3`
- `M2` and `M3` both unlock `M4`
- `M4` unlocks `M5`

## Readiness Scoring

- **Opening Score**: 35 / 100
- **Current Score**: 95 / 100 (updated 2026-03-25)
- **Scoring Basis**:
  - `+20` if docs are quarantined and aligned ✅
  - `+20` if voice ownership drift is resolved ✅
  - `+20` if extension/Firebase cues are quarantined ✅
  - `+20` if pattern catalog is complete ✅
  - `+20` if verification evidence is captured ✅ (partial — 5pts reserved for blocked surfaces not yet formally closed)
- **Resolved**:
  - ✅ `+20` README and guidelines rewritten as support/reference-only
  - ✅ `+20` Voice CTA in `ImageStudioPage.tsx` points to `/profile`, not Settings
  - ✅ `+20` Extension checklist item replaced with neutral job-intake action
  - ✅ `+20` `PROTOTYPE-HARVEST-PATTERN-CATALOG.md` created with all 6 route families
  - ✅ `+15` Verification checks pass; readiness review updated with blocker closure evidence

## Daily Status Log

### 2026-03-25

- **Date**: 2026-03-25
- **Readiness Score**: 95 / 100 (was 35)
- **Milestones Advanced**: M1 ✅, M2 ✅, M3 ✅, M4 ✅, M5 ✅
- **Concrete Signals**:
  - `README.md` rewritten — stale `react-router-dom`, Firebase, History API routing claims removed
  - `guidelines.md` route section replaced with contract-backed mapping table
  - `ImageStudioPage.tsx` voice CTA updated to `/profile`
  - `GettingStartedChecklist.tsx` `Install Extension` item replaced
  - `PROTOTYPE-HARVEST-PATTERN-CATALOG.md` created with 6 route family entries
  - Verification commands: all three checks return CLEAN
  - `IMPLEMENTATION-PLAN-PROTOTYPE-HARVEST-READINESS.md` verdict updated to harvest-prepared
- **Open Risks**: `OnboardingPathBifurcation.tsx` and `LandingPage.tsx` remain blocked — documented, no escalation required
- **Next Milestone**: Sprint complete. Ready for route-owned port tasks per harvest-spec.

---

## Daily Status Template

### Daily Update

- **Date**:
- **Readiness Score**:
- **Milestones Advanced**:
- **Concrete Signals**:
  - files changed
  - verification commands run
  - blockers closed
- **Open Risks**:
- **Next Milestone**:

## Escalation Rules

- Escalate immediately if a prototype cleanup change would alter canonical route ownership.
- Escalate if a remediation step requires changing contract XMLs rather than aligning the prototype to them.
- Escalate if verification reveals the prototype still depends on blocked platform assumptions that cannot be documented away.
