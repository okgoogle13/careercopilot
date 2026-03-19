# AI Studio Integration Blueprint — Option 3: Full Stack Combined

**Date:** 2026-03-18
**Status:** Active — Sprint 1 Ready
**Parent initiative:** PR126 Frontend Source-of-Truth Migration (93% complete)
**IP gate:** Cleared
**Branch:** `feat/migration-cleanup-jobs-opportunities` (or new branch per task)

---

## Context

The external `prototype_v2.0` repository (`https://github.com/okgoogle13/prototype_v2.0`) contains two categories of harvestable value absent from the current project:

1. **AI Prompt Heuristics** — `ingestion_prompts.md` contains a DEEP STAR CRITIQUE system (Vague Language Audit, Quantification Gap, per-field Improvement_Suggestions) more detailed than the current `ingestion_flow.py` and `career_ingest.py`.
2. **UI Component Patterns** — `ATSScoreCard.tsx`, `AuditDisplay.tsx` (including the "10-Second Recruiter Scan" UX), and eventually `ValidationDashboard.tsx` fill the known `/analysis` blocker: *"analysis workflow handoff remains partially cosmetic."*

Track A (backend) and Track B (UI pipeline) are **independent** and can run in parallel. Track C (wiring) depends on both.

**Critical pre-flight finding:** `AnalysisPage.tsx` imports `Lens`, `LensArea`, `Pebble`, `Stone` — all **deprecated** in KR Solidarity v6.1. These must be replaced before new components are wired in (Task C1).

---

## Architecture

```
Track A (Backend)                     Track B (UI Pipeline — AI Studio)
─────────────────                     ──────────────────────────────────
ingestion_flow.py  ←── DEEP STAR     tr  ATSScoreCard.tsx  ← Gemini re-skin
types.py (Pydantic)←── ANMOS/Needs_Review  AuditDisplay.tsx  ← Gemini re-skin
ats_scoring.py     ←── DocumentAudit  (ValidationDashboard → Sprint 2)
analysis.py        ←── new endpoint
                              ↓
                   Track C (Wiring — depends on A + B)
                   ─────────────────────────────────────
                   AnalysisPage.tsx  ← deprecated archetype fix
                                     + ATSScoreCard wired
                                     + AuditDisplay wired
```

**Stack:** FastAPI + Python Genkit · React 18 + Vite + Tailwind v4 + Zustand + framer-motion@12 · KR Solidarity v6.1

---

## Track A — Backend Prompt Harvest

### A1 — Extend Pydantic types with ANMOS + DEEP STAR fields

**File:** `backend/app/genkit_flows/types.py`

- [ ] Add to `StructuredAchievement`:
  ```python
  class AchievementSuggestions(BaseModel):
      action_verb: Optional[str] = None
      noun_task: Optional[str] = None
      metric: Optional[str] = None
      strategy: Optional[str] = None
      outcome: Optional[str] = None

  # Fields to add to StructuredAchievement:
  needs_review_flag: bool = False
  improvement_suggestions: Optional[AchievementSuggestions] = None
  ```
- [ ] Add `star_feedback: Optional[str] = None` to `KSCResponse` (or STAR response equivalent)
- [ ] Add new models:
  ```python
  class AuditViolation(BaseModel):
      rule_id: str
      severity: Literal['error', 'warning', 'info']
      message: str
      location: Optional[str] = None

  class DocumentAudit(BaseModel):
      overall_score: int  # 0-100
      scan_simulation: str
      violations: List[AuditViolation]
      recommendations: List[str]
  ```

**Verification:**
```bash
cd backend && python3 -m pytest app/tests/test_types.py -v
```
Add 3 new tests: new fields present, default values correct, `DocumentAudit` serializes cleanly.

---

### A2 — Upgrade ingestion_flow.py with DEEP STAR CRITIQUE

**File:** `backend/app/genkit_flows/ingestion_flow.py`

Append to the existing `INGESTION_PROMPT` numbered instruction list (after current step 4):

- [ ] **Vague Language Audit:**
  > For every StructuredAchievement and KSC Response, scan Action_Verb and full text for weak verbs: "assisted," "helped," "involved in," "handled," "worked on," "supported," "participated in." If found, set `needs_review_flag: true` and add a corrected power verb in `improvement_suggestions.action_verb`. Replacement pool: orchestrated, standardized, mitigated, pioneered, spearheaded, implemented, delivered, reduced, increased, designed, led.

- [ ] **Quantification Gap:**
  > If a StructuredAchievement `outcome` or KSC `result` contains no numbers, percentages, dollar amounts, timeframes, or team sizes, set `needs_review_flag: true`. Add a realistic placeholder in `improvement_suggestions.outcome`: e.g. "reduced processing time by [X]%", "managed a team of [N]", "saved $[X] annually."

- [ ] **Detail Deficiency (STAR audit):**
  > For KSC Responses, audit each component — Situation (is project scale present?), Task (is the specific business problem named?), Action (are specific tools/steps named?), Result (is quantitative or qualitative impact present?). If any component fails, set `needs_review_flag: true`, populate `star_feedback` with a critical professional explanation, and populate `improvement_suggestions` with draft rewrites containing `[Insert X here]` placeholders.

- [ ] **Achievement Field Optimization:**
  > For EVERY StructuredAchievement, populate `improvement_suggestions` regardless of `needs_review_flag`. Suggest the strongest possible version of each ANMOS field. If metric is missing, suggest: "reduced [process] time by [X]%."

**Verification:**
```bash
cd backend && python3 -m pytest app/tests/genkit_flows/test_ingestion_flow.py -v
```
Write 5 new tests:
1. Vague verb → `needs_review_flag=True`, `improvement_suggestions.action_verb` populated
2. No metric in outcome → `needs_review_flag=True`, `improvement_suggestions.outcome` has placeholder
3. Strong verb + quantified outcome → `needs_review_flag=False`, `improvement_suggestions` still populated
4. KSC missing tool names → `needs_review_flag=True`, `star_feedback` not empty
5. Full STAR with metrics → `star_feedback` empty or None

---

### A3 — Extend ats_scoring.py to return DocumentAudit

**File:** `backend/app/genkit_flows/ats_scoring.py`

- [ ] Extend output schema to include `DocumentAudit`
- [ ] Add to scoring prompt:
  > Generate a `scan_simulation` paragraph (2–3 sentences, first-person recruiter voice) describing what stands out, what is confusing, and whether this document advances to the next round. Be specific to the document content.
  > Generate `violations` list: (error) critical keyword mismatches, (warning) missing metrics or vague language, (info) stylistic suggestions. Each violation: `rule_id` (e.g. "ATS-001"), severity, message, optional location.
- [ ] Return type: combined model wrapping existing score fields + `DocumentAudit audit`

**Verification:**
```bash
cd backend && python3 -m pytest app/tests/genkit_flows/test_ats_scoring.py -v
```
Add 3 new tests: non-null `scan_simulation`, at least one violation for a weak document, `overall_score` is 0–100.

---

### A4 — Add scan-simulation REST endpoint

**File:** `backend/app/api/routes/analysis.py` (create or extend)

- [ ] `POST /api/v1/analysis/scan-simulation`
  - Request: `{ resume_text: str, job_description: str }`
  - Response: `DocumentAudit`
  - Calls `ats_scoring.py` flow internally
- [ ] Register route in `backend/app/main.py`

**Verification:**
```bash
cd backend && python3 -m pytest app/tests/api/test_analysis.py::test_scan_simulation -v
curl -X POST http://localhost:8000/api/v1/analysis/scan-simulation \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "test", "job_description": "test"}' | jq .
```

---

## Track B — LLM-Mediated UI Component Pipeline

### How to use these prompts

Open **Google AI Studio** → new chat → **Gemini 2.5 Pro**. For each task:
1. Paste the source component text first
2. Paste the transformation prompt
3. Copy the output → save to the destination file
4. Run the token-enforcement gate before proceeding

**Token-enforcement gate** (run after saving each component):
```bash
grep -rn "bg-\|text-\|border-\|stroke-\|fill-" \
  frontend/src/features/analysis/components/ \
  | grep -v "sys-color\|sys-shape\|//\|data-"
# Zero matches required
```

---

### B1 — ATSScoreCard → KR Solidarity v6.1

**Source:** `prototype_v2.0/components/ATSScoreCard.tsx` from `https://github.com/okgoogle13/prototype_v2.0`
**Destination:** `frontend/src/features/analysis/components/ATSScoreCard.tsx`

#### Google AI Studio Prompt

```
You are a senior React/TypeScript developer working within the KR Solidarity v6.1 design system.

Transform the component below to be KR Solidarity v6.1 compliant. Follow these rules exactly:

RULES:
1. Replace ALL hardcoded Tailwind color utilities with CSS variable references:
   - bg-gray-800, bg-gray-900 → var(--sys-color-charcoalBackground-steps-1) or var(--sys-color-charcoalBackground-base)
   - text-white → var(--sys-color-paperWhite-base)
   - text-gray-400, text-gray-500 → var(--sys-color-worker-ash-base)
   - text-emerald-500, stroke-emerald-500, stroke-emerald-400 → var(--sys-color-kr-activistSmokeGreen-base)
   - text-amber-500, stroke-amber-500 → var(--sys-color-solidarityYellow-base)
   - text-rose-500, stroke-rose-500 → var(--sys-color-solidarityRed-base)
   - text-cyan-400, border-cyan-500 → var(--sys-color-paperWhite-base)
   Use pattern: className="text-[var(--sys-color-{name}-base)]" or style={{ color: 'var(--sys-color-{name}-base)' }}

2. Replace border-radius:
   - rounded-xl → style={{ borderRadius: 'var(--sys-shape-blockRiot03)' }}
   - rounded-lg → style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
   - rounded-full → keep (intentional circle)

3. Keep the framer-motion animation exactly as-is.
4. Keep the SVG circular progress ring exactly as-is but use CSS variables for stroke colors.
5. Keep all props, logic (getScoreColor, getScoreBg), and behavior unchanged.
6. Add import: import type { ATSScoreResult, DocumentType } from '../../../types/analysis';
7. Export as named export: export function ATSScoreCard(...)

OUTPUT ONLY the transformed TypeScript/TSX code. No explanation.

[PASTE ATSScoreCard.tsx SOURCE HERE]
```

**After AI Studio output:**
- [ ] Save to `frontend/src/features/analysis/components/ATSScoreCard.tsx`
- [ ] Run token-enforcement gate (zero matches required)
- [ ] `cd frontend && yarn tsc --noEmit` — zero errors

---

### B2 — AuditDisplay → KR Solidarity v6.1

**Source:** `prototype_v2.0/components/AuditDisplay.tsx` from `https://github.com/okgoogle13/prototype_v2.0`
**Destination:** `frontend/src/features/analysis/components/AuditDisplay.tsx`

#### Google AI Studio Prompt

```
You are a senior React/TypeScript developer working within the KR Solidarity v6.1 design system.

Transform the component below to be KR Solidarity v6.1 compliant. Follow these rules exactly:

RULES:
1. Replace ALL hardcoded Tailwind color utilities with CSS variable references:
   - bg-gray-900/50, bg-gray-800 → var(--sys-color-charcoalBackground-steps-1)
   - text-white → var(--sys-color-paperWhite-base)
   - text-gray-300, text-gray-500 → var(--sys-color-worker-ash-base)
   - border-gray-700 → var(--sys-color-worker-ash-base) with low opacity
   - text-red-400, border-red-500/30, bg-red-900/10 → var(--sys-color-solidarityRed-base)
   - text-amber-400, border-amber-500/30, bg-amber-900/10 → var(--sys-color-solidarityYellow-base)
   - text-blue-400, border-blue-500/30, bg-blue-900/10 → var(--sys-color-paperWhite-base) with opacity
   - text-green-400 → var(--sys-color-kr-activistSmokeGreen-base)
   - text-cyan-500 → var(--sys-color-paperWhite-base)
   - border-cyan-500 (left-4 border accent on scan simulation block) → var(--sys-color-solidarityRed-base)
   - bg-cyan-900/10 → var(--sys-color-charcoalBackground-steps-2)
   Use pattern: className="text-[var(--sys-color-{name}-base)]" or style={{ color: 'var(--sys-color-{name}-base)' }}

2. Replace border-radius:
   - rounded-xl → style={{ borderRadius: 'var(--sys-shape-blockRiot03)' }}
   - rounded-lg, rounded-r-lg → style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}

3. CRITICAL: The "10-Second Recruiter Scan" section header and italic scan simulation text are key UX. Keep this label and content exactly. Only change colors/radius.
4. Keep all severity logic, violation rendering, recommendation rendering unchanged.
5. Import types: import type { DocumentAudit } from '../../../types/analysis';
6. Export as: export const AuditDisplay: React.FC<AuditDisplayProps>
7. Ensure ruleId <code> element has font-mono class.

OUTPUT ONLY the transformed TypeScript/TSX code. No explanation.

[PASTE AuditDisplay.tsx SOURCE HERE]
```

**After AI Studio output:**
- [ ] Save to `frontend/src/features/analysis/components/AuditDisplay.tsx`
- [ ] Run token-enforcement gate (zero matches required)
- [ ] `cd frontend && yarn tsc --noEmit` — zero errors

---

### B3 — Create TypeScript analysis types

**File to create:** `frontend/src/types/analysis.ts`

- [ ] Create file with interfaces mirroring Track A Pydantic models (camelCase):
  ```typescript
  export interface AuditViolation {
    ruleId: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    location?: string;
  }

  export interface DocumentAudit {
    overallScore: number;
    scanSimulation: string;
    violations: AuditViolation[];
    recommendations: string[];
  }

  export type DocumentType = 'resume' | 'coverLetter';

  export interface ATSScoreBreakdown {
    keywordMatch: number;
    skillsAlignment: number;
    jobTitleMatch: number;
    experienceRelevance: number;
    formatCompliance: number;
    narrativeQuality?: number;
    personalizationScore?: number;
    toneProfessionalism?: number;
  }

  export interface ATSScoreResult {
    overallScore: number;
    breakdown: ATSScoreBreakdown;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
    keywordDensity: Record<string, number>;
    audit?: DocumentAudit;
  }
  ```
- [ ] `cd frontend && yarn tsc --noEmit` — zero errors

---

## Track C — AnalysisPage Wiring

> Depends on: Track A (A3/A4) for live data and Track B (B1/B2) for components.
> Can begin with mock data before Track A backend is deployed.

### C1 — Fix deprecated archetypes in AnalysisPage.tsx

**File:** `frontend/src/features/analysis/AnalysisPage.tsx`

Current deprecated imports to remove: `Lens`, `LensArea`, `Pebble`, `Stone`, `StatusBadge`

Replacements:
- `Lens` / `LensArea` → `Placard` (`shape.placardTorn01`) — import from `@/components/ui/Placard`
- `Stone` → `div` with `style={{ background: 'var(--sys-color-charcoalBackground-steps-1)', borderRadius: 'var(--sys-shape-blockRiot02)' }}`
- `Pebble` → `span` with `style={{ borderRadius: 'var(--sys-shape-pebbleSurge01)', padding: '2px 8px' }}`
- `StatusBadge` → check `frontend/src/components/ui/` for v6.1 equivalent first

**Verify component exists before importing:**
```bash
ls frontend/src/components/ui/ | grep -i "placard\|march\|scaffold"
```

**Verification:**
```bash
grep -n "Lens\|LensArea\|Pebble\|Stone\|StatusBadge" \
  frontend/src/features/analysis/AnalysisPage.tsx
# Must return zero matches
```

#### Google AI Studio Prompt — AnalysisPage deprecated archetype fix

```
You are a senior React/TypeScript developer working within the KR Solidarity v6.1 design system.

The canonical KR Solidarity v6.1 archetypes are:
- Strike (shape.blockRiot03) — primary action buttons
- Placard (shape.placardTorn01) — content containers, cards
- Scaffold / ScaffoldInput / ScaffoldArea (shape.blockRiot02) — layout framing, inputs
- March (shape.blockRiot01 → pebbleSurge01) — sequential flows, tags, progress
- Megaphone (shape.megaphoneCut01) — modals, announcements

DEPRECATED (must be replaced):
- Lens, LensArea → Placard (import from '@/components/ui/Placard')
- Stone → div with style={{ background: 'var(--sys-color-charcoalBackground-steps-1)', borderRadius: 'var(--sys-shape-blockRiot02)' }}
- Pebble → span with style={{ borderRadius: 'var(--sys-shape-pebbleSurge01)', padding: '2px 8px' }}
- StatusBadge → span styled with the appropriate --sys-color-* semantic color variable

Replace all deprecated archetype usages with their v6.1 equivalents. Keep all logic, hooks, and non-deprecated components unchanged. Preserve the framer-motion animation. Preserve the LayeredHero integration.

OUTPUT ONLY the transformed TypeScript/TSX code. No explanation.

[PASTE AnalysisPage.tsx SOURCE HERE]
```

---

### C2 — Wire ATSScoreCard into AnalysisPage

**File:** `frontend/src/features/analysis/AnalysisPage.tsx`

- [ ] `import { ATSScoreCard } from './components/ATSScoreCard';`
- [ ] `import type { ATSScoreResult } from '../../types/analysis';`
- [ ] Add state: `const [atsResult, setAtsResult] = useState<ATSScoreResult | null>(null);`
- [ ] Add state: `const [isAtsCalculating, setIsAtsCalculating] = useState(false);`
- [ ] Trigger ATS calculation via TanStack Query `useMutation` calling `POST /api/v1/analysis/scan-simulation` when resume + job data available — follow existing `useMutation` patterns in the file
- [ ] Render `<ATSScoreCard score={atsResult} isCalculating={isAtsCalculating} documentType="resume" />` below skill breakdown, above export actions
- [ ] Dev mock (use while backend pending):
  ```typescript
  const MOCK_ATS: ATSScoreResult = {
    overallScore: 72,
    breakdown: { keywordMatch: 68, skillsAlignment: 75, jobTitleMatch: 80, experienceRelevance: 70, formatCompliance: 65 },
    matchedKeywords: ['leadership', 'communication'],
    missingKeywords: ['agile', 'stakeholder management'],
    suggestions: ['Add quantified metrics to achievements'],
    keywordDensity: {},
  };
  ```

**Verification:**
```bash
cd frontend && yarn dev
# Navigate to /analysis — ATSScoreCard renders, no console errors
grep -n "bg-\|text-\|border-" frontend/src/features/analysis/AnalysisPage.tsx \
  | grep -v "sys-color\|//\|data-"
# Zero matches
```

---

### C3 — Wire AuditDisplay into AnalysisPage

**File:** `frontend/src/features/analysis/AnalysisPage.tsx`

- [ ] `import { AuditDisplay } from './components/AuditDisplay';`
- [ ] `import type { DocumentAudit } from '../../types/analysis';`
- [ ] Add state: `const [documentAudit, setDocumentAudit] = useState<DocumentAudit | null>(null);`
- [ ] Populate `documentAudit` from the same `/api/v1/analysis/scan-simulation` response (same call as C2)
- [ ] Render `{documentAudit && <AuditDisplay audit={documentAudit} title="Resume" />}` below ATSScoreCard
- [ ] Add show/hide toggle using `March` archetype button (`shape.blockRiot01`)
- [ ] Dev mock:
  ```typescript
  const MOCK_AUDIT: DocumentAudit = {
    overallScore: 72,
    scanSimulation: "Strong service background evident. Missing quantified results — no numbers stand out. Would not advance without metrics added to the leadership achievements.",
    violations: [
      { ruleId: 'ATS-001', severity: 'error', message: 'Critical keywords missing: agile, stakeholder', location: 'Skills section' },
      { ruleId: 'ATS-002', severity: 'warning', message: 'Vague action verb detected: "assisted with"', location: 'Work Experience 2019' },
    ],
    recommendations: ['Quantify at least 3 achievements with specific numbers', 'Add "agile" and "stakeholder management" to skills'],
  };
  ```

**Verification:**
```bash
cd frontend && yarn dev
# Navigate to /analysis — toggle works, AuditDisplay renders
# "10-Second Recruiter Scan" section visible with italic scan text
# Violations list renders with correct severity colors
```

---

### C4 — AppState FSM enum (optional)

**File:** `frontend/src/features/analysis/AnalysisPage.tsx` or shared types

- [ ] Add enum if boolean loading flags can be consolidated:
  ```typescript
  export enum AppState {
    IDLE = 'IDLE',
    PROCESSING = 'PROCESSING',
    VALIDATING = 'VALIDATING',
    JOB_EXTRACTION = 'JOB_EXTRACTION',
    ERROR = 'ERROR',
  }
  ```
- [ ] Skip if refactoring to use this requires changes beyond the `/analysis` surface

---

## Deferred — ValidationDashboard (Sprint 2)

`ValidationDashboard.tsx` (1,238 lines) deferred until ATSScoreCard + AuditDisplay are validated in production. Sprint 2 prompt scaffolded below.

#### Google AI Studio Prompt — ValidationDashboard decomposition (Sprint 2)

```
You are a senior React/TypeScript architect working within the KR Solidarity v6.1 design system.

I will give you a 1,238-line monolithic React component called ValidationDashboard. Your task:

1. DECOMPOSE into 4–6 focused sub-components. Each must:
   - Have single responsibility
   - Be ≤200 lines
   - Accept typed props (no `any`)

2. APPLY KR Solidarity v6.1 tokens:
   - Replace bg-gray-*, text-emerald-*, text-amber-*, border-cyan-*, text-white, text-gray-* with CSS variables
   - Color mapping: gray-800/900 → charcoalBackground-base or steps-1 | white → paperWhite-base | gray-400 → worker-ash-base | emerald → kr-activistSmokeGreen-base | amber → solidarityYellow-base | red/rose → solidarityRed-base | cyan → paperWhite-base
   - Border radius: rounded-xl → var(--sys-shape-blockRiot03) | rounded-lg → var(--sys-shape-blockRiot02)

3. ADAPT state management:
   - Replace geminiService calls → useMutation from TanStack Query → POST /api/v1/analysis/suggestions
   - Replace Firebase save calls → useMutation → POST /api/v1/profile/save
   - Replace boolean loading flags with AppState enum: IDLE | PROCESSING | VALIDATING | ERROR

4. KEEP: EditableField pattern (already has some correct tokens) | framer-motion imports | all field types and logic

5. OUTPUT format:
   // === FILE: frontend/src/features/analysis/components/[ComponentName].tsx ===
   [code]
   // === FILE: frontend/src/features/analysis/components/index.ts ===
   [barrel exports]

OUTPUT ONLY code. No explanation.

[PASTE ValidationDashboard.tsx SOURCE HERE]
```

---

## Gates & Verification Sequence

### Gate 1 — Token Enforcement (after each Track B component)
```bash
grep -rn "bg-\|text-\|border-\|stroke-\|fill-" \
  frontend/src/features/analysis/components/ \
  | grep -v "sys-color\|sys-shape\|//\|data-\|\.test\."
# Zero matches required
```

### Gate 2 — TypeScript compilation (after Track B + C)
```bash
cd frontend && yarn tsc --noEmit
# Exit 0 required
```

### Gate 3 — Backend tests (after Track A)
```bash
cd backend && python3 -m pytest app/tests/ -v --tb=short
# All pass; A1–A4 new tests must exist and pass
```

### Gate 4 — Design critique
- Run `/careercopilot-design-critique` skill against `/analysis` route
- Must score ≥90/100
- Any deprecated archetype, hardcoded color, or KR Solidarity v6.1 violation = blocking failure

### Gate 5 — Route matrix update
**File:** `docs/project/active/frontend-source-of-truth-migration/control/route-matrix.json`
- [ ] Update `analysis.blockers`: remove `"analysis workflow handoff remains partially cosmetic"` once gates 1–4 pass
- [ ] Set `implementation_status` to `"shell_promoted"` only after gate 4 passes

---

## Execution Order

```
Sprint 1 (parallel):
  Track A: A1 → A2 → A3 → A4   (~2 days, backend only)
  Track B: B3 → B1 → B2         (~1 day, AI Studio pipeline)

Sprint 1 closeout (sequential):
  Track C: C1 → C2 → C3 → [C4] (~1 day, wiring)
  Gates 1 → 2 → 3 → 4 → 5

Sprint 2 (deferred):
  ValidationDashboard decomposition via AI Studio prompt above
```

---

## Files Summary

| Track | File | Action |
|---|---|---|
| A1 | `backend/app/genkit_flows/types.py` | Extend Pydantic models |
| A2 | `backend/app/genkit_flows/ingestion_flow.py` | Extend DEEP STAR CRITIQUE prompt |
| A3 | `backend/app/genkit_flows/ats_scoring.py` | Add DocumentAudit output |
| A4 | `backend/app/api/routes/analysis.py` | New scan-simulation endpoint |
| B1 | `frontend/src/features/analysis/components/ATSScoreCard.tsx` | New via AI Studio |
| B2 | `frontend/src/features/analysis/components/AuditDisplay.tsx` | New via AI Studio |
| B3 | `frontend/src/types/analysis.ts` | New TypeScript interfaces |
| C1 | `frontend/src/features/analysis/AnalysisPage.tsx` | Fix deprecated archetypes |
| C2 | `frontend/src/features/analysis/AnalysisPage.tsx` | Wire ATSScoreCard |
| C3 | `frontend/src/features/analysis/AnalysisPage.tsx` | Wire AuditDisplay |
| C4 | `frontend/src/features/analysis/AnalysisPage.tsx` | AppState enum (optional) |
| Gate 5 | `control/route-matrix.json` | Update analysis entry |
