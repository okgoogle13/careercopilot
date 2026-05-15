# Figma-to-Code Visual Audit — Gemini Autonomous Browser Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use Gemini's autonomous agentic browser extension (Anti Gravity) to navigate the live dev server, capture screenshots of each canonical route, compare them against the Figma design frames, and produce a per-route parity audit report with annotated evidence screenshots.

**Architecture:** Gemini operates the browser directly — navigating routes, triggering states, capturing screenshots. For each canonical route it compares the live render against the Figma frame (fetched via Figma MCP using node IDs from `figma-sync-order.json`). Findings are written to a structured report at `.claude/reports/2026-04-19-figma-code-parity-audit.md`. No code changes in this plan — audit only.

**Tech Stack:** Gemini CLI + Anti Gravity browser extension, Figma MCP (`eoNJnwvDZ64OUgSthE20WW`), dev server at `http://localhost:5173`, `docs/project/active/figma-sync-order.json` as route/node authority.

**Figma file key:** `eoNJnwvDZ64OUgSthE20WW`

---

## Pre-flight: Dev Server State

Before dispatching Gemini, the dev server must be running and clean.

- [ ] **Step 1: Confirm cascade fix commits are present**

```bash
git log --oneline -8
```
Expected: commits `cf34ff92`, `31518676`, `3bfe3822`, `da905f94`, `65f4819b` all present.

- [ ] **Step 2: Start dev server**

```bash
cd frontend && yarn dev
```
Expected: `Local: http://localhost:5173/` — leave running.

- [ ] **Step 3: Confirm zero green-* drift**

```bash
grep -rn "bg-green\|text-green\|border-green" frontend/src --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v _reference | grep -v stories | grep -v "\.test\."
```
Expected: no output.

---

## Gemini Dispatch Packet

**Copy-paste this entire block as the Gemini prompt:**

```
You are an autonomous browser agent using the Anti Gravity extension.

## Your task

Audit the live CareerCopilot dev server at http://localhost:5173 against its Figma designs.
For each canonical route below, you will:
1. Navigate to the route in the browser.
2. Take a full-page screenshot.
3. Fetch the Figma frame screenshot using the Figma MCP tool `get_screenshot` with the provided node ID and file key `eoNJnwvDZ64OUgSthE20WW`.
4. Compare them visually. Score each criterion below.
5. Record your findings in the structured format at the bottom of this prompt.

## Canonical routes to audit (in order)

| Route | URL | Figma code_target_node_id | Priority |
|---|---|---|---|
| Shared Shell (Sidebar + AppShell) | http://localhost:5173/generation | 216:3 (AppShell), 216:4 (Sidebar) | CRITICAL |
| Generation | http://localhost:5173/generation | 228:2 | P1 |
| Dashboard | http://localhost:5173/dashboard | 351:30 | P1 |
| Profile | http://localhost:5173/profile | 1:4415 | P1 |
| Opportunities | http://localhost:5173/opportunities | 358:31 | P1 |
| Applications | http://localhost:5173/applications | 359:31 | P1 |
| Analysis | http://localhost:5173/analysis | 360:31 | P1 |
| Documents | http://localhost:5173/documents | 361:31 | P1 |
| Apply | http://localhost:5173/apply | 230:2 | P1 |
| Onboarding | http://localhost:5173/onboarding | 224:130 | P2 |
| Auth | http://localhost:5173/auth | 1:150 | P1 |
| Landing | http://localhost:5173/ | 1:6756 | P1 |

## Audit criteria (score each route)

For every route, assess and score PASS / PARTIAL / FAIL for each criterion:

1. **Background colour** — dark charcoal only (`--kr-color-charcoal-background-*`). FAIL if white, FAIL if green.
2. **Sidebar present and correct** — Sidebar at correct width, dark asphalt tone, Logo + NavSections + AccountCard visible, no SaaS-green active states.
3. **Typography** — Uses Work Sans / Fraunces / Libre Bodoni / JetBrains Mono. No system fallback fonts visible.
4. **Zero raw green** — No Tailwind lime-green anywhere. Signal-green (`#48da8b` family) is acceptable ONLY on "Strong" match indicators in /analysis. Lime-green is FAIL.
5. **Archetype components** — Buttons are Strike archetype (asymmetric), Cards are Placard, Inputs are Scaffold. No generic rounded-rectangle SaaS buttons.
6. **Structural layout match** — Content layout matches Figma frame (columns, card grid, panel positions). Major layout drift is FAIL.
7. **KR token colours** — Primary accents are ink-gold (`--kr-color-ink-gold-base`), not blue, not generic brand colour.

## Route-specific checks

In addition to general criteria, check these specific items:

- **/generation (Shell audit)**: Confirm Sidebar node IDs 216:4 — Logo visible, all 4 nav sections (Primary, Workflow, Profile, Utility link), SidebarAccountCard at bottom. Confirm no collapsed or missing NavSections.
- **/analysis**: "Strong" skill match dots should be signal-green (teal-green `~#48da8b`), NOT lime-green. Apply-suggestion buttons on resume panels should be charcoal background + ink-gold text.
- **/profile**: Upload success state (if reachable) — should show ink-gold checkmark on charcoal background, NOT green.
- **/landing**: Public layout — no AppShell/Sidebar. Full-width layout only.
- **/auth**: Auth card centred on dark background.

## Screenshot requirements

- Capture full viewport (1440px width preferred — resize browser if needed).
- For the shell audit at /generation, capture a second zoomed screenshot of the Sidebar only.
- Name screenshots using the route slug, e.g. `generation.png`, `sidebar-zoom.png`.
- Save all screenshots to `.claude/reports/audit-screenshots/` (create directory if needed).

## Output format

Write your findings to `.claude/reports/2026-04-19-figma-code-parity-audit.md`.

Use this exact structure for each route:

---
### Route: /[route]

**Screenshot:** `.claude/reports/audit-screenshots/[route].png`
**Figma node:** [node_id]

| Criterion | Score | Notes |
|---|---|---|
| Background colour | PASS/PARTIAL/FAIL | [observation] |
| Sidebar | PASS/PARTIAL/FAIL | [observation] |
| Typography | PASS/PARTIAL/FAIL | [observation] |
| Zero raw green | PASS/PARTIAL/FAIL | [observation] |
| Archetype components | PASS/PARTIAL/FAIL | [observation] |
| Structural layout match | PASS/PARTIAL/FAIL | [observation] |
| KR token colours | PASS/PARTIAL/FAIL | [observation] |

**Summary:** [1-2 sentences on overall parity. Flag any blockers for code extraction.]

**Recommended actions:** [Bullet list of specific fixes needed, or "None — ready for code extraction."]

---

After all routes, append a **Final Tally** section:

## Final Tally

| Route | Overall | Blockers? |
|---|---|---|
| /generation (Shell) | PASS/PARTIAL/FAIL | [yes/no + summary] |
| /generation | ... | ... |
| ... | ... | ... |

**Routes ready for code extraction:** [list]
**Routes blocked (need fixes first):** [list with blocker summary]
**Total PASS / PARTIAL / FAIL:** [counts]

## Constraints

- Do NOT modify any code files.
- Do NOT commit anything.
- Do NOT navigate to redirect-history routes (/tracker, /kanban, /docs, /editor, /studio, /lookout, /feed, /ingestion, /identity, /dossier).
- If a route 404s or redirects unexpectedly, record that as a FAIL under "Structural layout match" and note the redirect target.
- If the Figma MCP screenshot tool is unavailable, skip the Figma comparison and note "Figma screenshot unavailable — live-only assessment."
```

---

## Task 1: Dispatch Gemini audit agent

**Files:**
- Create: `.claude/reports/2026-04-19-figma-code-parity-audit.md` (Gemini writes this)
- Create: `.claude/reports/audit-screenshots/` (Gemini creates and populates)

- [ ] **Step 1: Open Gemini CLI**

```bash
gemini
```

- [ ] **Step 2: Paste the Gemini Dispatch Packet above verbatim**

Paste the full block between the triple backticks (starting with "You are an autonomous browser agent...").

- [ ] **Step 3: Wait for Gemini to complete all 12 routes**

Gemini will navigate each route, capture screenshots, fetch Figma frames, and write findings. This takes approximately 15–25 minutes. Do not interrupt.

- [ ] **Step 4: Confirm output files exist**

```bash
ls .claude/reports/audit-screenshots/
ls .claude/reports/2026-04-19-figma-code-parity-audit.md
```
Expected: 12+ screenshot files, one report file.

---

## Task 2: Review and triage the audit report

**Files:**
- Read: `.claude/reports/2026-04-19-figma-code-parity-audit.md`

- [ ] **Step 1: Read the report Final Tally**

```bash
grep -A 30 "## Final Tally" .claude/reports/2026-04-19-figma-code-parity-audit.md
```

- [ ] **Step 2: List all FAIL routes**

```bash
grep "FAIL" .claude/reports/2026-04-19-figma-code-parity-audit.md | grep "Route:"
```

- [ ] **Step 3: Triage blockers**

For each FAIL route, open the report section and read "Recommended actions". Determine whether the fix is:
- (a) A token/CSS change — create a follow-up plan task
- (b) A component structure mismatch — flag for design review
- (c) A Figma frame issue (not the code) — flag for Figma repair

- [ ] **Step 4: Update TASKS.md with audit outcome**

Open `TASKS.md`. Find the Figma audit task. Mark it done and add one line per FAIL route as a new sub-task with the recommended action.

- [ ] **Step 5: Commit the audit report**

```bash
git add .claude/reports/2026-04-19-figma-code-parity-audit.md .claude/reports/audit-screenshots/
git commit -m "audit(figma): code-to-Figma visual parity audit — $(date +%Y-%m-%d)"
```

---

## Scope Notes

- This plan is **audit only** — no code changes.
- Code extraction tasks for routes that PASS are a separate plan.
- Fixes for FAIL routes are a separate plan per-route.
- The Gemini browser agent reads from `figma-sync-order.json` implicitly via the node IDs embedded in the dispatch packet above; Gemini does not need to read the JSON file directly.
- If Gemini cannot reach Anti Gravity browser capabilities, fall back to: Claude Code reads Figma frames via Figma MCP `get_screenshot`, Claude Code reads the dev server visually if screenshot tool is available, and produces the same report format manually.
