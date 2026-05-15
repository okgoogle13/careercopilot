# Codex Handover: Figma-to-Code Parity Remediation

**Date:** 2026-04-20
**Authority:** `.claude/reports/2026-04-19-figma-code-parity-audit.md` and `TASKS.md` triage notes.
**Assigned Agent:** `Codex` or Equivalent Executor
**Scope:** Remediation of visual parity violations identified during the Gemini browser audit.

## Task Objective
Execute the prioritized fixes highlighted in the visual parity audit triage. Note: The P0 structural layout missing-sidebar issue has been identified in `TASKS.md` as a **false positive** (caused by mobile viewport rendering during the audit; `md:flex` handles desktop). Leave P0 closed. Do not reopen shell routing work in `App.tsx` unless a desktop-width rerun reproduces the issue.

Instead, execute the concrete runtime fixes for P1 (Green Drift in specific components), P2 (Auth full-card implementation), and P3 (Dev overlay gating) to fully unblock code extraction.

## Execution Rules
- **Authority**: Follow the recommendations outlined in `TASKS.md` sub-tasks under the visual audit section.
- **Governance**: Adhere strictly to KR Solidarity v6.1 selective flora/fauna design system rules. DO NOT use generic Tailwind "green" tokens; rely solely on canonical CSS variables (`--kr-color-*`).
- **Verification**: Run `yarn type-check` and `yarn lint` after making changes. You MUST perform a specific **desktop-width manual verification** (at least 1440px viewport) across `/auth`, `/opportunities`, `/documents`, `/onboarding`, and `/` to ensure fixes hold on the correct form factor. Update `TASKS.md` with completion marks *only after* this desktop verification succeeds.
- **Assumptions**: This is runtime remediation only. No Figma node, mapping.json, screen-map, or route-matrix edits are part of this packet. Shared components are in scope when they are the actual cause of route-local drift.

## Writable File Set
You are authorized to modify ONLY these explicit component owners and supporting shared components:
- `frontend/src/screens/02_auth/AuthModal.tsx`
- `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`
- `frontend/src/features/documents/Documents.tsx`
- `frontend/src/components/shared/PageHeader.tsx`
- `frontend/src/screens/03_onboarding/OnboardFlow.tsx`
- `frontend/src/features/onboarding/OnboardingPage.tsx`
- `frontend/src/features/landing/LandingPage.tsx`

---

## Action Plan

### 1. Execute P1: Resolve Token "Green Drift"
Address token drift directly at the source component layers:
- **`/opportunities`**: Active filter chips in `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx:147`. Replace any signal-green logic with canonical KR styles (e.g., ink-gold or charcoal active states).
  *Evidence: `/Users/okgoogle13/.gemini/antigravity/brain/76f9fd41-3480-4d32-b2f1-27ad7e0ba33c/opportunities_1776591239542.png`*

- **`/documents`**: Shared header highlight and tab tokens in `frontend/src/components/shared/PageHeader.tsx:39` and `frontend/src/features/documents/Documents.tsx:296`. Ensure `--kr-color-parchment-*` tokens are driving the copy, not legacy lime greens.
  *Evidence: `/Users/okgoogle13/.gemini/antigravity/brain/76f9fd41-3480-4d32-b2f1-27ad7e0ba33c/documents_audit_1776591450318.png`*

- **`/onboarding`**: Text and shell tokens in `frontend/src/screens/03_onboarding/OnboardFlow.tsx:78` and feature-layer card text in `frontend/src/features/onboarding/OnboardingPage.tsx:108`. Use canonical `--kr-color-parchment-*`.
  *Evidence: `/Users/okgoogle13/.gemini/antigravity/brain/76f9fd41-3480-4d32-b2f1-27ad7e0ba33c/onboarding_audit_1776591620722.png`*

### 2. Execute P2: Rebuild `/auth` page layout
- **Target Fix**: Replace the current stubbed `frontend/src/screens/02_auth/AuthModal.tsx:69` with the canonical centered auth card. The new implementation must include standard email/password inputs and a Strike-archetype CTA, while strictly preserving the existing mode query handling from `App.tsx`. Do not change routing context; just replace the stub rendering with the correct layout content.
  *Evidence: `/Users/okgoogle13/.gemini/antigravity/brain/76f9fd41-3480-4d32-b2f1-27ad7e0ba33c/auth_audit_capture_1776592292687.png`*

### 3. Execute P3: Gate Dev Overlays
- **`/onboarding`**: Ensure the debug bar ("Slots: 3 | Density ratio... ") is conditionally gated behind a production environment check.
  *Evidence: `/Users/okgoogle13/.gemini/antigravity/brain/76f9fd41-3480-4d32-b2f1-27ad7e0ba33c/onboarding_audit_1776591620722.png`*

- **Landing (`/`)**: Exact grep target is `ANTI-SLOP ACTIVE` located in `frontend/src/features/landing/LandingPage.tsx:229`. Gate this specific debug tag conditionally.
  *Evidence: `/Users/okgoogle13/.gemini/antigravity/brain/76f9fd41-3480-4d32-b2f1-27ad7e0ba33c/landing_audit_1776591695225.png`*

## Handoff & Review Workflow
Once the above scope is completed, verify via desktop-width UI assessment, then check off items P1, P2, and P3 in `TASKS.md`, generating the final patch summary.
