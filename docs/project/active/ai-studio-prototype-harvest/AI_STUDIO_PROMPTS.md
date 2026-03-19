# AI_STUDIO_PROMPTS.md
## Single Source of Truth — Human-Paste Prompts for Google AI Studio

> Run these steps IN ORDER on the `careercopilot-aistud` prototype branch before beginning Track A/B/C execution in the main repo.

---

## Prompt Routing Table

| Prompt type | Where it lives | How it's used |
|---|---|---|
| UI component tweaks (B1, B2, PT-5) | `AI_STUDIO_PROMPTS.md` (this file) | Paste manually into Google AI Studio |
| Backend ingestion prompts (DEEP STAR etc.) | `careercopilot-aistud/backend/prompts/ingestion_prompts.md` | Already in prototype — copy logic into main repo `ingestion_flow.py` as Track A2. Never paste into AI Studio. |
| IDE analysis prompts | `AI_STUDIO_HARVEST_PLAN.updated.md` | Run in Antigravity / Gemini IDE only |

---

## Step 1 — ATSScoreCard token re-skin (B1)

**File to open in AI Studio:** `components/ATSScoreCard.tsx`
**What this does:** Replaces all raw Tailwind colour utilities and hardcoded hex values with KR Solidarity CSS variable tokens, and fixes the import path to the canonical types location.

```
In the existing ATSScoreCard.tsx in this project, make only these changes:

1. Import change: Replace `import { ATSScoreResult, DocumentType } from '../types';`
   with `import type { ATSScoreResult, DocumentType } from '../../../types/analysis';`

2. Main wrapper: Find `<div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">`
   and replace `bg-gray-800`, `border-gray-700`, and `rounded-xl` with:
   `style={{ background: 'var(--sys-color-charcoalBackground-steps-1)', borderColor: 'var(--sys-color-concreteGrey-steps-0)', borderRadius: 'var(--sys-shape-blockRiot03)', borderWidth: 1, borderStyle: 'solid', padding: '1.5rem' }}`

3. Typography:
   - Replace `<h3 className="text-lg font-bold text-white">` by changing `text-white` to `text-[var(--sys-color-paperWhite-base)]`.
   - Replace `<span className="text-xs text-cyan-400 animate-pulse">` by changing `text-cyan-400` to `text-[var(--sys-color-inkGold-base)]`.
   - Replace `text-gray-400` anywhere it appears with `text-[var(--sys-color-worker-ash-base)]`.
   - Replace the remaining `text-white` instances with `text-[var(--sys-color-paperWhite-base)]`.

4. Stat cards: Find `<div key={key} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">`
   and replace the class string entirely with:
   `className="p-3 shadow-sm" style={{ background: 'color-mix(in srgb, var(--sys-color-charcoalBackground-base) 85%, transparent)', borderColor: 'var(--sys-color-concreteGrey-steps-0)', borderRadius: 'var(--sys-shape-blockRiot02)', borderWidth: 1, borderStyle: 'solid' }}`

5. getScoreColor values:
   - return 'text-emerald-500' AND 'text-emerald-400' → return 'text-[var(--sys-color-kr-activistSmokeGreen-base)]'
   - return 'text-amber-500' → return 'text-[var(--sys-color-stencilYellow-base)]'
   - return 'text-rose-500' → return 'text-[var(--sys-color-solidarityRed-base)]'

6. getScoreBg values (modify the function to return CSS variables instead of classes, and apply to SVG `stroke` style):
   - Replace `stroke-emerald-500` / `stroke-emerald-400` → `var(--sys-color-kr-activistSmokeGreen-base)`
   - Replace `stroke-amber-500` → `var(--sys-color-stencilYellow-base)`
   - Replace `stroke-rose-500` → `var(--sys-color-solidarityRed-base)`
   - In `<circle cx="50" cy="50" r="45" fill="none" className={...getScoreBg()}`, replace `className` injection with `style={{ stroke: getScoreBg(score.overallScore) }}`.

7. SVG static circle: Find `<circle cx="50" cy="50" r="45" fill="none" stroke="#374151"`
   and replace `stroke="#374151"` with `stroke="var(--sys-color-charcoalBackground-steps-2)"`.

Do not change framer-motion animations, component logic, props, or the named export.
```

---

## Step 2 — AuditDisplay token re-skin (B2)

**File to open in AI Studio:** `components/AuditDisplay.tsx`
**What this does:** Replaces all raw Tailwind colour utilities with KR Solidarity CSS variable tokens across violations, scan block, and header areas, and fixes the import path to the canonical types location.

```
In the existing AuditDisplay.tsx in this project, make only these changes:

1. Import change: Replace `import { DocumentAudit } from '../types';`
   with `import type { DocumentAudit } from '../../../types/analysis';`

2. Outer wrapper: Find `<div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">`
   and replace `bg-gray-900/50`, `rounded-xl`, `border-gray-700` with:
   `style={{ background: 'color-mix(in srgb, var(--sys-color-charcoalBackground-base) 80%, transparent)', borderRadius: 'var(--sys-shape-blockRiot03)', borderColor: 'var(--sys-color-concreteGrey-steps-0)', borderWidth: 1, borderStyle: 'solid', overflow: 'hidden' }}`

3. Header area: Find `<div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">`
   and replace it with:
   `<div className="p-4 flex justify-between items-center" style={{ background: 'var(--sys-color-charcoalBackground-steps-1)', borderBottomColor: 'var(--sys-color-concreteGrey-steps-0)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}>`

4. Typography globals:
   - `<h3 className="text-lg font-bold text-white">` → change `text-white` to `text-[var(--sys-color-paperWhite-base)]`.
   - `<span className="text-xs font-bold text-red-400">` → change `text-red-400` to `text-[var(--sys-color-solidarityRed-base)]`.
   - `<span className="text-xs font-bold text-amber-400">` → change `text-amber-400` to `text-[var(--sys-color-stencilYellow-base)]`.
   - `<span className="text-xs font-bold text-blue-400">` → change `text-blue-400` to `text-[var(--sys-color-protestMetalBlue-base)]`.
   - `overallScore >= 80 ? 'text-green-400'` → change `text-green-400` to `text-[var(--sys-color-kr-activistSmokeGreen-base)]`.
   - `overallScore >= 60 ? 'text-amber-400'` → change `text-amber-400` to `text-[var(--sys-color-stencilYellow-base)]`.
   - `else 'text-red-400'` → change `text-red-400` to `text-[var(--sys-color-solidarityRed-base)]`.
   - Replace any `text-gray-300` instances with `text-[var(--sys-color-worker-ash-base)]`.
   - Replace any `text-gray-500` instances with `text-[var(--sys-color-concreteGrey-base)]`.

5. Scan Simulation block: Find `<div className="bg-cyan-900/10 border-l-4 border-cyan-500 p-4 rounded-r-lg">`
   and replace the class string entirely with:
   `className="p-4" style={{ background: 'color-mix(in srgb, var(--sys-color-solidarityRed-base) 10%, transparent)', borderLeftColor: 'var(--sys-color-solidarityRed-base)', borderLeftWidth: 4, borderLeftStyle: 'solid', borderRadius: 'var(--sys-shape-blockRiot02)' }}`
   - Find `<h4 className="... text-cyan-400 ...">` inside it and change `text-cyan-400` to `text-[var(--sys-color-inkGold-base)]`.

6. Violations styles object: Find the `styles` object inside the `audit.violations.map`. Modify it as follows:
   `error: 'text-[var(--sys-color-solidarityRed-base)]'` (and add `style={{ borderColor: 'color-mix(in srgb, var(--sys-color-solidarityRed-base) 30%, transparent)', background: 'color-mix(in srgb, var(--sys-color-solidarityRed-base) 10%, transparent)' }}` to the returned div wrapper)
   `warning: 'text-[var(--sys-color-stencilYellow-base)]'` (and add similar style logic using stencilYellow-base)
   `info: 'text-[var(--sys-color-protestMetalBlue-base)]'` (and add similar style logic using protestMetalBlue-base)
   - Remove the Tailwind border/bg classes like `border-red-500/30` from the styles string mapping.

7. Recommendations block: Find `<span className="text-cyan-500 font-bold">→</span>`
   and change `text-cyan-500` to `text-[var(--sys-color-inkGold-base)]`.

Do not change the "10-Second Recruiter Scan" text, violation logic, audit structure, or named export.
```

---

## Step 3 — ValidationDashboard decomposition proposal (PT-5a)

**File to open in AI Studio:** `components/ValidationDashboard.tsx`
**What this does:** Analyses the 1,200-line monolith and proposes a split into ≤4 harvestable sub-components, returning a JSON spec — no code generated yet.

> ⛔ **STOP after this step.** Review the JSON output before continuing to Step 4. Confirm the split satisfies all constraints (≤4 components, each ≤200 lines, no direct service calls) before proceeding.

```
In the existing ValidationDashboard.tsx in this project, analyse the full component and respond with ONLY a JSON array. Do not generate any code yet.

For each proposed sub-component, output:
{
  "name": "ComponentName",
  "file": "components/ComponentName.tsx",
  "responsibility": "one sentence",
  "props": ["propName: PropType"],
  "stateOwned": ["stateVar: type"],
  "callbacksRequired": ["callbackName(args): ReturnType"],
  "linesEstimated": 0
}

Constraints:
- Maximum 4 sub-components
- Each must be ≤200 lines
- No sub-component may call geminiService or Firebase directly
- All geminiService calls become: onRequestAI(type: string, payload: unknown): Promise<unknown>
- All Firebase saves become: onSaveProfile(data: unknown): Promise<void>
```

---

## Step 4 — ValidationDashboard sub-component generation (PT-5b)

**Run once per sub-component confirmed in Step 3.**
**What this does:** Generates a single fully-typed, token-compliant sub-component file from the JSON spec confirmed in Step 3.

> Substitute `[COMPONENT_NAME]` and `[COMPONENT_JSON]` only — nothing else. Run this prompt once for each entry in the Step 3 JSON array.

```
In this project, generate a new file components/[COMPONENT_NAME].tsx.

Use this spec:
[COMPONENT_JSON]

Rules:
- TypeScript strict mode; no `any` types — infer all types from types.ts
- Props must be fully typed as a named interface: interface [COMPONENT_NAME]Props { ... }
- Replace geminiService.* calls with: onRequestAI(type: string, payload: unknown): Promise<unknown>
- Replace Firebase save calls with: onSaveProfile(data: unknown): Promise<void>
- Apply KR Solidarity tokens using these exact, unambiguous substitutions contextually:
    bg-gray-800 OR bg-gray-900 → style={{ background: 'var(--sys-color-charcoalBackground-steps-1)' }}
    text-white      → className={{ text-[var(--sys-color-paperWhite-base)] }}
    text-gray-400 OR text-gray-500 → text-[var(--sys-color-worker-ash-base)]
    text-emerald-*  → text-[var(--sys-color-kr-activistSmokeGreen-base)]
    text-amber-*    → text-[var(--sys-color-stencilYellow-base)]
    text-red-* OR text-rose-* → text-[var(--sys-color-solidarityRed-base)]
    text-cyan-*     → text-[var(--sys-color-inkGold-base)]
    rounded-xl      → style={{ borderRadius: 'var(--sys-shape-blockRiot03)' }}
    rounded-lg      → style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
- Named export only (no default export)

Output: the complete file contents only.
```

---

## Step 5 — Barrel export (PT-5c)

**Run after all Step 4 components are confirmed.**
**File to create:** `components/index.ts`
**What this does:** Generates a barrel export file that re-exports all sub-components generated in Step 4 as named exports.

> Update the export list to match the actual component names confirmed in Step 3 before pasting.

```
In this project, generate a new file components/index.ts.

Export every sub-component generated in the previous step. Use named re-exports only:
export { AchievementEditor } from './AchievementEditor';
export { KSCEditor } from './KSCEditor';
export { DocumentGenerator } from './DocumentGenerator';
export { ProfileSummaryPanel } from './ProfileSummaryPanel';

Output: the complete file contents only. No commentary.
```

---

## Step 6 — Global Polish & Layout (Batch 4)

**File to open in AI Studio:** None specifically (this is a global instruction for multiple core layout components like `App.tsx`, `Layout.tsx`, or the Dashboard Landing page).
**What this does:** Enforces the KR Solidarity v6.0 dark mode, proper typographic hierarchy, and safe component shapes for navigational elements while strictly preventing non-canon assets.

```
Do a global pass on the application layout to establish the persistent visual hierarchy, strictly enforcing the "KR Solidarity v6.0" (Dark-mode only) design system.

1.  **Navigation / Top Bar**: Add a persistent top application bar.
    -   Left side: A clean typographic placeholder for the "CareerCopilot" logo using large, expressive display typography.
    -   Right side: A user profile avatar placeholder. *CRITICAL: Do NOT use a circle. Perfect geometry (border-radius: 50%) is banned.* Use a harsh, asymmetric cut via `style={{ borderRadius: 'var(--sys-shape-cutoutRiot01)' }}`.
    -   Top Bar background must explicitly use `style={{ background: 'var(--sys-color-charcoalBackground-steps-1)' }}` and border bottom using `var(--sys-color-concreteGrey-steps-0)`.

2.  **Dashboard Hero Section**: On the main Landing/Dashboard screen, add a high-impact hero section.
    -   Include a massive, bold Display typography header (`color: var(--sys-color-paperWhite-base)`).
    -   Create a clearly marked placeholder block for a hero illustration. The block must be a "Placard" or "Scaffold" archetype: hard architectural lines, asymmetric radii. Use `style={{ borderRadius: 'var(--sys-shape-blockRiot03)' }}`. No playful/organic blobs.
    -   *CRITICAL RULE:* Zero-Flora lockdown. The placeholder text/instructions must explicitly forbid any Australian flora, eucalyptus, or wattle concepts in the ultimate imagery.

3.  **Strict Token Governance (Harvest Rules)**:
    -   NO raw Tailwind colors (`bg-gray-900`, `text-white`).
    -   Use the bridge syntax for text: `text-[var(--sys-color-worker-ash-base)]`, `text-[var(--sys-color-inkGold-base)]`, `text-[var(--sys-color-solidarityRed-base)]`.
    -   Use `style={{ ... }}` injection for backgrounds, borders, and radii utilizing `var(--sys-color-*)` and `var(--sys-shape-*)`.
    -   Ensure ample whitespace using standard Tailwind `p-`, `m-`, and `gap-` utilities.
```
