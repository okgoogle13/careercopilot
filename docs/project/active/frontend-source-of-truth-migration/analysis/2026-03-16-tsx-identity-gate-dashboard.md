# TSX Identity Gate — `/dashboard`

**Filename:** `2026-03-16-tsx-identity-gate-dashboard.md`

## Route Metadata

- **Route id:** `dashboard`
- **Runtime owner:** `Dashboard` (`frontend/src/features/dashboard/Dashboard.tsx`)
- **Implemented TSX path:** `frontend/src/features/dashboard/Dashboard.tsx`
- **Build contract:** `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-dashboard.xml`
- **Support-reference audit:** `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-dashboard.md`

## Inputs Reviewed

- `frontend/src/features/dashboard/Dashboard.tsx`
- `frontend/src/features/dashboard/components/JobCard.tsx`
- `frontend/src/features/dashboard/components/TimelineView.tsx`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-dashboard.md`
- `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-dashboard.xml`

## Identity Review

- **Archetype mapping:** `LayeredHero` composition + `Placard`-based metric strip + `Strike` action buttons + `OnboardingChecklist` overlay
- **Generic SaaS risk:** `medium-high` — "Solidarity Hub" framing and mock PROFILES array risk reading as a polished recruitment portal if token chain is broken; 5 token violations were found and remediated during Phase 4 gating.

### `design-orchestration`

- **Finding:** Dashboard uses `LayeredHero` (KR-specific hero composition backed by `heroRegistry` + `composeHero`) as the primary surface framing — this is not a generic SaaS pattern. PROFILES mock data uses uppercase company names and career-rank framing consistent with KR Solidarity voice. `OnboardingChecklist` overlay adds progressive disclosure without generic "welcome wizard" scaffolding. 2x2 KrMotif Grid pattern is expressly non-standard.
- **Required rewrite:** none — composition is route-specific and intentional. Mock data must be replaced with real backend data in Step 3a closeout, but structure is not a generic template.

### `kerala-rage-brand-enforcer`

- **Finding:** Token enforcement gate passed 0 violations after 5 remediations (2026-03-16):
  1. `shadow-[0_0_10px_rgba(var(--color-ink-gold),0.5)]` removed
  2. `bg-ink-gold text-asphalt-black` → `--sys-color-inkGold-base` / `--sys-color-charcoalBackground-base`
  3. `rgba(241,71,20,0.36)` → `color-mix(in srgb, var(--sys-color-solidarityRed-base) 36%, transparent)`
  4. `rgba(255,255,255,0.02)` in JobCard → `color-mix(in srgb, var(--sys-color-paperWhite-base) 2%, transparent)`
  5. `--bg-leaf-base` (Zero-Flora violation) in TimelineView → `--sys-color-inkGold-base`
  All violations are remediated. Dark-only territory maintained. No flora or non-human mascot motifs remain.
- **Zero-Flora / anti-generic status:** `clean after remediations` — `--bg-leaf-base` leaf/flora prefix eliminated. No white backgrounds.

### `m3-expressive-token-orchestrator`

- **Finding:** Post-remediation token chain is intact. `Strike`, `StatusBadge`, `Placard` are imported from `@/components/ui` (canonical KR archetypes). LayeredHero uses slot-based `--sys-color-*` tokens with z-layer opacity scaling. All color references now flow through `--sys-color-*` semantic variables.
- **Token wiring status:** `pass after remediations` — remediation log documented in build-contract-dashboard.xml.

### `kerala-rage-typography-strategy`

- **Finding:** Dashboard uses `font-display` (Fraunces) for hero metric labels and `font-mono` (JetBrains Mono) for score values. PROFILES names use `uppercase tracking-tight` consistent with KR Solidarity v6.1 extreme contrast rules. No generic body-copy weight regression.
- **Voice / hierarchy status:** `pass` — "Solidarity Hub" heading register matches emotional tone; score display maintains 9x weight contrast.

## Outcome

- **Gate result:** `identity_pass_with_rewrites`
- **Blocking rewrites:** none remaining — all 5 violations remediated prior to this gate artifact
- **Closure decision:** route may close — Figma-informed closure evidence is satisfied for `/dashboard`
