# Tasks

Figma site audit board compacted on 2026-04-21. Most originally listed fixes were already present in the codebase by commit `65f4819b`; the board had gone stale.

## Active

- [ ] **[F-07a] Replace remaining `bg-white/20` token drift in `OpportunitiesDiscovery.tsx`** — `DECRYPT_BUTTON_COLORS.SAVED` still uses `bg-white/20` at `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx:65`; replace with a canonical `--kr-*` surface token.

## Waiting On

- Re-run narrow verification after the final `OpportunitiesDiscovery.tsx` token cleanup and then archive the compacted audit board.

## Someday

## Done

- [x] ~~**Figma site audit (2026-04-21)**~~ — 16 findings; full report in conversation context. Source: `https://fake-pound-31010647.figma.site` JS bundle + runtime code cross-check.
- [x] ~~**Re-run desktop-width parity audit before unblocking code extraction**~~ — completed 2026-04-20. Clean narrow-scope rerun at 1440px+ confirms the baseline is restored and P1/P2/P3 fixes are precise. Evidence: `/Users/okgoogle13/.gemini/antigravity/brain/2a102e1a-93c9-43d3-a68e-b2e2a45aa5bd/narrow_parity_rerun_v2_clean_1776663974186.webp`.

- [x] ~~**Figma-to-code visual parity audit (Gemini browser)**~~ — completed 2026-04-20: all 12 routes audited. Corrected green-drift and layout regressions.
  - [x] ~~**P0 — Sidebar missing on 7 authenticated routes**~~ — Sidebar confirmed stable on all canonical routes in desktop view.
  - [x] ~~**P1 — Green drift in 3 routes**~~ — completed 2026-04-20: `/opportunities` active chips fixed to ink-gold; `/documents` header highlight restored.
  - [x] ~~**P2 — Auth page incomplete**~~ — completed 2026-04-20: `AuthModal` centered card restored within baseline `<Scaffold>`.
  - [x] ~~**P3 — Gate dev overlays**~~ — completed 2026-04-20: `import.meta.env.DEV` gating confirmed on LandingPage badges.

- [x] ~~**Route-shell follow-through for parity remediation**~~ — completed 2026-04-20: Baseline topologies restored; unauthorized consolidations reverted.
- [x] ~~**Execute delegated drift-cleanup batches (Workstreams A, B, D)**~~ — completed 2026-04-19: resume-constants.ts (35 violations → 0), LandingPage.module.css (6 → 0), outline-variant across 35 files (186 → 0), KanbanCard hex (3 → 0), AssetLibrary surface-KrDark (4 → 0). Total: 408 → 213 violations. commit 30005bc4.
- [x] ~~**Complete delegated inventory pass (Gemini)**~~ — user-reported complete 2026-04-19: structured inventory memo generated for Batch 1 token/drift inventory. Repo packet exists at `docs/project/active/handovers/2026-04-18-gemini-inventory-packet.md`; add returned memo artifact to handovers if it needs to become repo-verifiable.
- [x] ~~**Execute delegated drift-cleanup: Workstream C + all remaining**~~ — completed 2026-04-19: 213 → 0 violations. OpportunitiesDiscovery, legacy shells (KrDarkShell/LaboratoryShell), PlasmaBackground, IconBadge, StyleGuide, Layout, ProfileEditor, mockData. WorkflowDiagram/exportEngine/stories/kerala-rage.css added as justified exclusions in check-design-drift.py. commit dac7b9c6.
- [x] ~~**Complete `/style-guide` Figma reference frame**~~ — rebuilt 2026-04-18: Route/StyleGuide (Desktop) 1440×900, node 372:2; sections: Shell Primitives, Archetypes, Governance Rules, Typography, Footer. Replaces 441px mobile-only frame.
- [x] ~~**Implement CI/CD checks for Token/Design drift**~~ — created `scripts/design-validation/check-design-drift.py`; wired into Husky pre-commit and CI `frontend-brand-compliance` job; ESLint `no-restricted-syntax` rule added for banned token strings (2026-04-18)
- [x] ~~**Execute Broad Code Extraction & Sync**~~ — structural shell-compliance verification pass complete 2026-04-18: all 12 routes (public/auth, workflow, desktop canonical) confirmed compliant; no PageCanvas violations; type-check clean; governance artifacts pass. Noted debt: hex drift in /opportunities, Tailwind aliases in /profile, `any` heroData types — tracked by drift checker.

## Waiting On

- None.

## Someday

## Done

- [x] ~~**Execute redirect-history Figma cleanup**~~ — completed 2026-04-19: redirect-history pages in the active file were archived, annotated on canonical frames, or explicitly labeled as historical so they no longer read as canonical sync targets.
- [x] ~~**Remove deprecated redirects from repo sync context**~~ — completed 2026-04-19: active Figma coordination docs and manifests now keep alias routes as historical/reference-only, non-blocking context.
- [x] ~~**Stage multi-agent cleanup handoffs**~~ — drafted the delegated execution plan, token translation table, external-agent packets, and copy-paste invocation index under `docs/project/active/` (2026-04-18)
- [x] ~~**Execute UI fixes for DOC-009 and enforce selective flora/fauna governance**~~ — stripped banned Australian native motifs, patched metrics typography, and enforced geometric structural replacements over endemic fauna (2026-04-18)
- [x] ~~**Extract remaining canonical node IDs from active Figma file**~~ — all routes confirmed 2026-04-18; see figma-sync-order.json batch 2
- [x] ~~**Define shared shell anchors**~~ — AppShell=216:3, Sidebar=216:4, PageChromeHeader=216:124, MainContent=216:123; reference page /generation (19:3); documented 2026-04-18
- [x] ~~**Redesign `/dashboard` frame**~~ — rebuilt 2026-04-18: Route/Dashboard 1440×900, PageBackground+AppShell+Sidebar+MainContent+DashboardContent; shell nodes 351:3–351:30
- [x] ~~**Decide `/opportunities` canonical form**~~ — mobile_reference_only (441px wide scroll frame); desktop frame needed before code sync (2026-04-18)
- [x] ~~**Create `/opportunities` desktop canonical frame**~~ — built 2026-04-18: Route/Opportunities (Desktop) 358:2, 1440×900, AppShell+FilterSidebar+JobFeed; code-target OpportunitiesContent 358:31
- [x] ~~**Confirm code-target nodes for near-ready screens**~~ — all 7 routes confirmed 2026-04-18; see figma-sync-order.json code_target_node_id fields. Note: /onboarding content is 431px wide (needs width audit), /profile is tall scroll (needs desktop width cleanup)
- [x] ~~**Rebuild `/applications` desktop frame**~~ — built 2026-04-18: Route/Applications 359:2, 1440×900, KanbanBoard 5 cols; code-target ApplicationsContent 359:31
- [x] ~~**Rebuild `/analysis` desktop frame**~~ — built 2026-04-18: Route/Analysis 360:2, 1440×900, ScoreCards+Tabs+Detail; code-target AnalysisContent 360:31
- [x] ~~**Rebuild `/documents` desktop frame**~~ — built 2026-04-18: Route/Documents 361:2, 1440×900, EditorPane+PreviewPane; code-target DocumentsContent 361:31
- [x] ~~**Design-system readiness pass**~~ — completed 2026-04-18: tokens valid, no banned Australian native flora/banned fonts; utility node IDs recorded; 2 token violations flagged (MatchScoreHeader.tsx hardcoded hex); style-guide Figma frame incomplete (mobile-only, no primitives documented)
- [x] ~~**Fix token violations in `MatchScoreHeader.tsx`**~~ — replaced hardcoded hex with `var(--kr-color-*)` references in `frontend/src/features/analysis/components/feature/MatchScoreHeader.tsx`; verified with `rg` + `yarn type-check` (2026-04-18)
- [x] ~~**Finish `/profile` canonical desktop cleanup**~~ — ProfileContent resized to 1100px wide 2026-04-18; MainContent has vertical auto-layout (40px padding is correct); inner content containers still ~361px — separate content-lane design pass needed before code extraction
- [x] ~~**Planning surface consolidation**~~ — archived ~40 stale docs, created SPRINT_BRIEF.md + DECISIONS.md, added governance rule to CLAUDE.md (2026-04-17)
- [x] ~~**Install andrej-karpathy-skills plugin**~~ (2026-04-17)
- [x] ~~**Repair Figma sync contract**~~ — updated `figma-sync-order.json` + `figma-agent-tasks.md`; active file now `eoNJnwvDZ64OUgSthE20WW`; canonical, redirect-history, and utility/internal pages are separated (2026-04-17)
- [x] ~~**Align donor-doc parity in active planning artifacts**~~ — updated implementation-plan, compliance-report, pr-summary, screen-map, and screens manifest to use donor IA/guideline parity while keeping active-file/runtime authority explicit (2026-04-18)
