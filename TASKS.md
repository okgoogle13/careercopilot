# Tasks

## Active

- [ ] **Execute delegated drift-cleanup batches** — use `docs/project/active/plans/2026-04-18-agent-delegation-execution-plan.md`; handoff packets are staged for Gemini inventory, Claude semantic review, Claude Code Workstreams A/B/D, and Codex Workstream C (2026-04-18)
  Claude Code semantic review is still pending; no completion memo is recorded yet in `docs/project/active/handovers/`.
- [x] ~~**Complete `/style-guide` Figma reference frame**~~ — rebuilt 2026-04-18: Route/StyleGuide (Desktop) 1440×900, node 372:2; sections: Shell Primitives, Archetypes, Governance Rules, Typography, Footer. Replaces 441px mobile-only frame.
- [x] ~~**Implement CI/CD checks for Token/Design drift**~~ — created `scripts/design-validation/check-design-drift.py`; wired into Husky pre-commit and CI `frontend-brand-compliance` job; ESLint `no-restricted-syntax` rule added for banned token strings (2026-04-18)
- [x] ~~**Execute Broad Code Extraction & Sync**~~ — structural shell-compliance verification pass complete 2026-04-18: all 12 routes (public/auth, workflow, desktop canonical) confirmed compliant; no PageCanvas violations; type-check clean; governance artifacts pass. Noted debt: hex drift in /opportunities, Tailwind aliases in /profile, `any` heroData types — tracked by drift checker.

## Waiting On

- [ ] **Collapse redirect-history pages** — for each alias: archive, fold into canonical state/tab, convert to annotation, or remove — *waiting on: canonical shell work per route family*

## Someday

## Done

- [x] ~~**Stage multi-agent cleanup handoffs**~~ — drafted the delegated execution plan, token translation table, external-agent packets, and copy-paste invocation index under `docs/project/active/` (2026-04-18)
- [x] ~~**Execute UI fixes for DOC-009 and enforce Zero-Flora governance**~~ — stripped banned motifs, patched metrics typography, and enforced geometric structural replacements over fauna (2026-04-18)
- [x] ~~**Extract remaining canonical node IDs from active Figma file**~~ — all routes confirmed 2026-04-18; see figma-sync-order.json batch 2
- [x] ~~**Define shared shell anchors**~~ — AppShell=216:3, Sidebar=216:4, PageChromeHeader=216:124, MainContent=216:123; reference page /generation (19:3); documented 2026-04-18
- [x] ~~**Redesign `/dashboard` frame**~~ — rebuilt 2026-04-18: Route/Dashboard 1440×900, PageBackground+AppShell+Sidebar+MainContent+DashboardContent; shell nodes 351:3–351:30
- [x] ~~**Decide `/opportunities` canonical form**~~ — mobile_reference_only (441px wide scroll frame); desktop frame needed before code sync (2026-04-18)
- [x] ~~**Create `/opportunities` desktop canonical frame**~~ — built 2026-04-18: Route/Opportunities (Desktop) 358:2, 1440×900, AppShell+FilterSidebar+JobFeed; code-target OpportunitiesContent 358:31
- [x] ~~**Confirm code-target nodes for near-ready screens**~~ — all 7 routes confirmed 2026-04-18; see figma-sync-order.json code_target_node_id fields. Note: /onboarding content is 431px wide (needs width audit), /profile is tall scroll (needs desktop width cleanup)
- [x] ~~**Rebuild `/applications` desktop frame**~~ — built 2026-04-18: Route/Applications 359:2, 1440×900, KanbanBoard 5 cols; code-target ApplicationsContent 359:31
- [x] ~~**Rebuild `/analysis` desktop frame**~~ — built 2026-04-18: Route/Analysis 360:2, 1440×900, ScoreCards+Tabs+Detail; code-target AnalysisContent 360:31
- [x] ~~**Rebuild `/documents` desktop frame**~~ — built 2026-04-18: Route/Documents 361:2, 1440×900, EditorPane+PreviewPane; code-target DocumentsContent 361:31
- [x] ~~**Design-system readiness pass**~~ — completed 2026-04-18: tokens valid, no flora/banned fonts; utility node IDs recorded; 2 token violations flagged (MatchScoreHeader.tsx hardcoded hex); style-guide Figma frame incomplete (mobile-only, no primitives documented)
- [x] ~~**Fix token violations in `MatchScoreHeader.tsx`**~~ — replaced hardcoded hex with `var(--kr-color-*)` references in `frontend/src/features/analysis/components/feature/MatchScoreHeader.tsx`; verified with `rg` + `yarn type-check` (2026-04-18)
- [x] ~~**Finish `/profile` canonical desktop cleanup**~~ — ProfileContent resized to 1100px wide 2026-04-18; MainContent has vertical auto-layout (40px padding is correct); inner content containers still ~361px — separate content-lane design pass needed before code extraction
- [x] ~~**Planning surface consolidation**~~ — archived ~40 stale docs, created SPRINT_BRIEF.md + DECISIONS.md, added governance rule to CLAUDE.md (2026-04-17)
- [x] ~~**Install andrej-karpathy-skills plugin**~~ (2026-04-17)
- [x] ~~**Repair Figma sync contract**~~ — updated `figma-sync-order.json` + `figma-agent-tasks.md`; active file now `eoNJnwvDZ64OUgSthE20WW`; canonical, redirect-history, and utility/internal pages are separated (2026-04-17)
- [x] ~~**Align donor-doc parity in active planning artifacts**~~ — updated implementation-plan, compliance-report, pr-summary, screen-map, and screens manifest to use donor IA/guideline parity while keeping active-file/runtime authority explicit (2026-04-18)
