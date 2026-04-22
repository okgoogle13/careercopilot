# Tasks

Figma site audit board re-audited against current runtime files on 2026-04-21. Most original Sprint 2 findings were already fixed in code; this board now tracks only the items that are still genuinely open.

## Active

- [ ] **Sprint 3: Notion + Linear + Perplexity Automation** — 7-day sprint (2026-04-22 → 2026-04-28) to consolidate fragmented docs, build modular automation layer (DocumentStore + IssueTracker abstractions), integrate Perplexity reasoning with hallucination guards, enable Task→Linear→Notion sync, and provide self-hosted PostgreSQL migration path. Execution: subagent-driven via superpowers:executing-plans.
  - [ ] **Phase 1 (Days 1-2):** Doc consolidation + sync infrastructure
    - [ ] **Task 1:** Audit + inventory fragmented docs (scripts/doc-audit.py)
    - [ ] **Task 2:** Consolidate fragmented docs into docs/ structure
    - [ ] **Task 3:** Create doc sync infrastructure (git → Notion CI job)
  - [ ] **Phase 2 (Days 3-5):** Notion + Linear automation + abstraction layer
    - [ ] **Task 4:** Create abstraction layer interfaces (DocumentStore, IssueTracker)
    - [ ] **Task 5:** Implement NotionDocumentStore with CRUD
    - [ ] **Task 6:** Implement LinearIssueTracker with GraphQL
  - [ ] **Phase 3 (Days 6-7):** Perplexity integration + self-hosted path
    - [ ] **Task 7:** Implement hallucination guard (guardAgainstHallucinations)
    - [ ] **Task 8:** Implement PerplexityDocumentStore decorator
    - [ ] **Task 9:** Create Task → Linear → Notion sync automation
    - [ ] **Task 10:** Create self-hosted PostgreSQL migration guide
    - [ ] **Task 11:** Create execution prompts for all tools (IDE, Perplexity, Notion, Linear, CI)
    - [ ] **Task 12:** Sprint handoff summary + final documentation

## Waiting On

- None.

## Someday

## Done

- [x] ~~**Control-surface cleanup**~~ — completed 2026-04-21: `TASKS.md` has one authoritative section set and now agrees with `DECISIONS.md`.
- [x] ~~**Final KR hygiene sweep**~~ — completed 2026-04-21: active-surface residue removed from `LandingPage.tsx`, `Dashboard.tsx`, and `OnboardFlow.tsx`; verified with focused tests, lint, type-check, residue grep, and drift check.
- [x] ~~**Auth decision follow-through**~~ — completed 2026-04-21: `AuthModal` callers verified, inline tab-switcher tests updated, lint debt cleared, and `DECISIONS.md` follow-up closed.
- [x] ~~**[F-07a] Replace remaining `bg-white/20` token drift in `OpportunitiesDiscovery.tsx`**~~ — completed 2026-04-21: `DECRYPT_BUTTON_COLORS.SAVED` now uses `bg-[var(--kr-color-charcoal-background-steps-2)]`; verified with targeted test + drift check.
- [x] ~~**[F-01/F-02] Record donor landing-copy decision**~~ — completed 2026-04-21 in `DECISIONS.md`; runtime copy consistency verified in the final KR hygiene sweep.
- [x] ~~**[F-06] Record inline auth tab-switcher decision**~~ — completed 2026-04-21 in `DECISIONS.md`; runtime follow-through verified in the auth decision cleanup.
- [x] ~~**[F-11] Change landing feature card archetype from `rounded-placard` → `march`**~~ — completed 2026-04-21: landing feature cards now render with `rounded-march`; verified with focused landing tests, type-check, and drift check.
- [x] ~~**[F-13] Add Dashboard "THE COLLECTIVE" stat section**~~ — completed 2026-04-21: dashboard hero metric bar now includes the collective stat section with `font-nabla-hero` heading and `font-display-ultra` count; verified with focused dashboard tests, type-check, and drift check.
- [x] ~~**[F-14] Fix `--shape-blockRiot*` token aliases in `AuthModal.tsx`**~~ — current runtime uses `--kr-shape-block-riot*` tokens.
- [x] ~~**[F-09] Remove `font-trunk`, `font-leaf`, `bg-terracotta`, `rounded-pebble` from `JobCard.tsx`**~~ — current runtime uses canonical typography/color/shape classes.
- [x] ~~**[F-10] Replace `bg-white` in `KSCResponsesView.tsx`**~~ — current runtime uses `bg-canvas`.
- [x] ~~**[F-05] Resolve auth card shape token**~~ — auth card now uses canonical shape tokens and `--kr-shape-march-open01`.
- [x] ~~**[F-07] Replace raw white text/borders in `OpportunitiesDiscovery.tsx`**~~ — hero summary, stat row, filters, and title styling now use KR semantic tokens.
- [x] ~~**[F-12] Replace hardcoded CTA radius in `LandingPage.tsx`**~~ — landing CTAs now use `var(--kr-archetypes-strike-shape-base)`.
- [x] ~~**[F-02b] Remove `--kr-color-ink-bronze-base` from landing stat color**~~ — landing stats now use direct `var(--kr-color-ink-gold-base)`.
- [x] ~~**[F-15] Change landing hero subtext font from Caveat → Fraunces**~~ — hero subtext now uses `font-display` styling.
- [x] ~~**[F-03] Register `font-display-ultra` and apply to landing stat numbers**~~ — utility exists and is applied to the stat bar.
- [x] ~~**[F-04] Fix auth card h1 typography**~~ — current heading uses the audited `wght/wdth/size/spacing` treatment.
- [x] ~~**[F-08] Change `InterceptCard` job title from `font-mono` to `font-primary`**~~ — opportunities card title now uses `font-primary`.

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
