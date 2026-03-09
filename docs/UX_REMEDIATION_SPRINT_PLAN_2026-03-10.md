# CareerCopilot UX Voice Remediation Plan (Frontend TSX/Copy)

Date: March 10, 2026
Source Review: `docs/UX_PROCESS_MAP.md` (UX Priorities & Open Issues, Enhancement, Open UX Design Questions)
Planning Mode: `sprint-coordinator`

## 1) Sprint Frame

- Objective: implement specific **frontend UX voice and microcopy** changes in active TSX flows, with measurable improvements in clarity, trust, and conversion.
- Scope boundary: this plan is intentionally constrained to `frontend/src/**/*.tsx` user-facing text and interaction labels. It excludes docs, legacy archives, token internals, and broad refactors unrelated to UX voice.
- Program window: March 11, 2026 to April 8, 2026 (two 2-week sprints).
- Owners:
- Product/UX: Design + PM
- Frontend Delivery: FE squad
- QA/Research: QA + UX research

## 2) Current Frontend Baseline (UX Voice Edits Already Completed)

The following frontend fixes are already implemented and should be treated as baseline, not backlog:

| Area | Implemented change | Files |
|---|---|---|
| UX voice normalization | Removed botanical/legacy growth metaphors from core journey copy | `features/applications/ApplicationTracker.tsx`, `features/onboarding/OnboardingPage.tsx` |
| Tracker language clarity | Stage model renamed to status-native terms (`Queued`, `Screening`, `Interview`, `Offer`, `Closed`) | `features/applications/ApplicationTracker.tsx` |
| Generator clarity | Cover letter and KSC flows renamed from `Genius/Wizard` framing to `Workbench` framing | `features/applications/CoverLetterGenerator.tsx`, `features/ksc-generator/KSCGenerator.tsx` |
| UX progress feedback | Added step + estimated-time copy blocks to both generation flows | `features/applications/CoverLetterGenerator.tsx`, `features/ksc-generator/KSCGenerator.tsx` |
| Shape compliance support | Updated shape semantics in key voice-touched flows where copy changes were made | `features/settings/Settings.tsx`, `features/applications/CoverLetterGenerator.tsx`, `features/ksc-generator/KSCGenerator.tsx`, `features/applications/ApplicationTracker.tsx` |

Status note:
- The above covers a high-impact first pass only. Remaining legacy UX voice remnants in active TSX screens are included in remaining scope.

## 3) What UX Voice Changes We Are Shipping (Clear Scope)

This section is the source of truth for exactly what will change in product behavior.

| Issue ID | User-facing change to ship | Screens |
|---|---|---|
| UX-01 | Add generator header with `Step X of Y` and `Estimated time remaining` | Cover Letter Generator, KSC Generator |
| UX-02 | Add dismissible `Getting Started` checklist and persistent progress state | Dashboard |
| UX-03 | Rename navigation and headers to `Key Selection Criteria (KSC)` and add explanatory helper text | Sidebar, KSC page |
| UX-04 | Add actionable empty states with primary CTA (`Run Scout` / `Scan Email`) and secondary help copy | Opportunities, Job Queue |
| UX-05 | Add `Your Documents in Context` summary card with document count/types + freshness | Analysis |
| UX-06 | Add `Context used: N documents` badge + details popover on generated outputs | Cover Letter Generator, KSC Generator |
| UX-07 | Add document linkage per application (resume, cover letter, KSC) from tracker card | Tracker |
| UX-08 | Add Integrations panel copy with clear connection state and `last scan` timestamp messaging | Settings |
| UX-09 | Add `ATS trend (last 5 applications)` mini chart widget | Dashboard |
| UX-10 | Mobile nav prioritization for `Find`, `Generate`, `Track` actions | Global mobile nav |
| UX-11 | Add quick action `Regenerate with different style` without full form reset | Cover Letter Generator |
| UX-12 | Add testimonial/social-proof module tailored to target cohort | Landing |

## 4) Strategic Priority: Onboarding & Profile Setup Quality Voice

### Why this is critical

Onboarding + profile/document setup quality is the strongest predictor of downstream output quality.
If users upload complete, high-quality inputs and have a positive early experience, generated ATS analysis, cover letters, and KSC responses improve substantially.

### Strategy

1. Make setup quality visible:
- Add `Profile Readiness` and `Context Completeness` indicators during onboarding and on dashboard.
- Show clear reason: "Better context = better AI output quality."

2. Guide thorough uploads:
- Add step-by-step upload guidance (what to upload, preferred formats, examples of strong inputs).
- Add quality nudges when uploads are too thin (for example: missing resume chronology, missing role context).

3. Preserve momentum:
- Save in-progress onboarding state with clear resume points.
- Keep friction low with progressive completion (user can continue, but sees quality impact).

4. Reinforce value quickly:
- After first successful upload, show immediate quality feedback preview (what the system extracted and how it improves generation).
- Provide one-click next action into Analysis with the loaded context summary.

5. Protect trust:
- Add plain-language privacy and usage explanation at upload moments.
- Show users exactly what artifacts are being used in generated outputs.

### Success metrics

- Onboarding completion rate (register → first dashboard session with at least one validated artifact)
- Document completeness score at first analysis
- Generation success/edit distance reduction (less manual rewriting needed)
- 7-day retention for users who completed onboarding thoroughly vs minimally

## 5) Milestones

| Milestone | Target Date | Issues Covered | Acceptance Criteria (Delivery Signals) | Dependencies |
|---|---|---|---|---|
| M1: UX Decision Lock | March 13, 2026 | Open Q1–Q5 + onboarding quality stance | Written decisions approved for onboarding depth, setup quality rubric, KSC surfacing rules, voice profile timing, dashboard primary CTA, tracker drill-down pattern | None |
| M2: Core Loop Clarity | March 20, 2026 | UX-01, UX-03, UX-04 | Multi-step generators show step + ETA; KSC labeling clarified in nav and page copy; empty states are present on Opportunities + Job Queue and include clear action prompts | M1 |
| M3: Onboarding & Setup Quality Foundation | March 24, 2026 | UX-02, UX-05 + onboarding strategy | Dashboard includes dismissible Getting Started checklist copy; Analysis shows “Your Documents” context summary copy; onboarding includes setup-quality explanation and guidance copy | M1 |
| M4: Context Transparency & Traceability | March 28, 2026 | UX-06, UX-07, UX-08 | Generators display “Context used” indicator; Tracker cards link to source docs (or Application Detail if chosen in M1); Settings shows integration status + last scan time | M1, M3 |
| M5: Insight & Mobility Enhancements | April 3, 2026 | UX-09, UX-10, UX-11 | Dashboard exposes ATS trend for last 5 applications; mobile nav prioritizes Find/Generate/Track actions; cover-letter flow supports one-click regenerate with alternate style | M2, M4 |
| M6: Trust & Conversion Enhancement | April 8, 2026 | UX-12 | Landing includes validated social proof block for target cohort and passes design/content QA checks | M1 |

### Milestone progress snapshot (as of March 10, 2026)

- `M2` is **partially complete** on frontend: step/ETA and generator voice updates are implemented.
- `M3` is **partially complete** on frontend: onboarding messaging has improved, but checklist/completeness indicators are not yet implemented.
- `M4–M6` remain pending.

## 6) Implementation Sequence (Execution Order)

1. Decision lock (M1)
2. Critical clarity fixes (M2: UX-01/03/04)
3. Onboarding/setup quality foundation (M3)
4. Context traceability and integration visibility (M4)
5. Enhancements for trending/mobile/regeneration (M5)
6. Landing trust uplift (M6)

## 7) Dependency Map

1. M1 blocks all downstream implementation because the open design questions affect navigation, onboarding gate behavior, and tracker interaction model.
2. M2 should complete before M5, because mobile and regeneration enhancements depend on finalized generator and navigation semantics.
3. M3 should complete before M4, because context transparency depends on shared onboarding/analysis context model.
4. M4 should complete before M5 KPI validation, because ATS trend and mobile priorities are evaluated inside the end-to-end application loop.

## 8) Prioritization and Sprint Allocation

### Sprint 1 (March 11 to March 24, 2026) — Commit
- M1: UX Decision Lock
- M2: Core Loop Clarity
- M3: Onboarding & Setup Quality Foundation

### Sprint 2 (March 25 to April 8, 2026) — Commit
- M4: Context Transparency & Traceability
- M5: Insight & Mobility Enhancements
- M6: Trust & Conversion Enhancement

## 9) Readiness Scoring

Use a 100-point readiness score at the end of each sprint.

- Milestone completion: 60 points
- UX issue closure evidence (mapped to UX-01..UX-12): 25 points
- QA/UAT pass rate for affected journeys: 15 points

### Penalties
- -10 for each unresolved Critical issue (UX-01..UX-04)
- -5 for each unresolved High issue (UX-05..UX-08)
- -3 for each unresolved Enhancement issue (UX-09..UX-12)
- -10 if any M1 decision is still pending

### Release Gates
- Green: 85–100 (proceed)
- Yellow: 70–84 (proceed with mitigations)
- Red: <70 (hold and replan)

## 10) Tracking Artifact (Daily Cadence)

Daily update template:

- Date:
- Milestones in progress:
- Milestones completed (with evidence link):
- Blockers (owner + ETA):
- Risks to current sprint goal:
- Readiness score snapshot:

## 11) Risks and Early Escalations

- Decision latency risk: unresolved open questions can stall all implementation milestones.
- Data dependency risk: context-used badge, tracker linkage, and integration status depend on backend payload consistency.
- Setup quality risk: if onboarding guidance is weak, users will progress with low-quality context and perceive poor AI quality.
- UX drift risk: KR Solidarity compliance may regress during rapid UX fixes; visual QA gates must run before closeout.
- Scope creep risk: enhancement items can overrun critical/high items; enforce strict sprint commit boundaries.

## 12) Issue-to-Milestone Traceability

| Issue ID | Milestone |
|---|---|
| UX-01 | M2 |
| UX-02 | M3 |
| UX-03 | M2 |
| UX-04 | M2 |
| UX-05 | M3 |
| UX-06 | M4 |
| UX-07 | M4 |
| UX-08 | M4 |
| UX-09 | M5 |
| UX-10 | M5 |
| UX-11 | M5 |
| UX-12 | M6 |

## 13) Immediate Next Actions (This Week)

1. Close remaining `M2` frontend items: KSC nav relabel and Opportunities/Job Queue empty-state CTA quality pass.
2. Build `M3` checklist/completeness UI on Dashboard + Analysis context summary (`UX-02`, `UX-05`).
3. Run a frontend copy + shape sweep on remaining high-traffic routes (`Dashboard`, `Analysis`, `Documents`, `Tracker` detail surfaces).
4. Define baseline frontend metrics now for onboarding completion, context completeness visibility, and generation flow completion.
