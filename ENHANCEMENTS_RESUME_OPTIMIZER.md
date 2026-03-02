# Enhancements: Resume Optimizer

**Branch:** `feat/resume-optimizer-upgrade`
**Date:** 2026-03-02

---

## Summary

Extended the Resume Optimizer with two new capabilities:

1. **Bullet Metrics Enhancement** – AI rewrites of resume bullets using the Google XYZ formula, each tagged with a metric type (number / percentage / timeframe / scale) and a rationale.
2. **Skills Gap Analysis** – Structured comparison of resume skills against job requirements, returning matched, missing, and adjacent skills with an overall match score.

---

## New Endpoint

### `POST /api/analysis/enhance-resume`

| Field | Value |
|---|---|
| Method | `POST` |
| Path | `/api/analysis/enhance-resume` |
| Auth | Bearer token (existing `get_current_user`) |
| Content-Type | `application/json` |

#### Request Body

```json
{
  "resume_text": "string",       // Raw resume text to analyse
  "job_description": "string"   // Target job description
}
```

#### Response Body

```json
{
  "improved_bullets": [
    {
      "original":    "Led development of REST APIs",
      "improved":    "Led development of 12 REST API endpoints serving 50K daily requests",
      "metric_type": "number",
      "rationale":   "Concrete scale demonstrates technical impact."
    }
  ],
  "skills_gap": {
    "matched":     ["Python", "React"],
    "missing":     ["Docker", "FastAPI"],
    "adjacent":    ["Django"],
    "match_score": 67
  }
}
```

#### Error Responses

| Code | Condition |
|---|---|
| `400` | `resume_text` or `job_description` is empty |
| `500` | Unexpected error in Genkit flow |

---

## Data Shapes

### `ImprovedBullet`

| Field | Type | Description |
|---|---|---|
| `original` | `str` | Original bullet text |
| `improved` | `str` | Rewritten bullet with quantifiable metric |
| `metric_type` | `"number" \| "percentage" \| "timeframe" \| "scale"` | Category of metric added |
| `rationale` | `str` | One-sentence explanation of why this metric is persuasive |

### `SkillsGap`

| Field | Type | Description |
|---|---|---|
| `matched` | `List[str]` | Skills present in both resume and job description |
| `missing` | `List[str]` | Required/preferred skills not on the resume |
| `adjacent` | `List[str]` | Resume skills closely related to missing requirements |
| `match_score` | `int` (0–100) | % of required skills already in the resume |

---

## Backend Changes

| File | Change |
|---|---|
| `backend/app/genkit_flows/resume_optimizer.py` | Added `ImprovedBullet`, `SkillsGap`, `EnhancedResumeResult` Pydantic models; added `_compute_skills_gap()` pure helper; added `enhance_resume_with_metrics` async Genkit flow |
| `backend/app/api/endpoints/analysis.py` | Added `EnhanceResumeRequest`, `EnhanceResumeResponse`, `ImprovedBulletResponse`, `SkillsGapResponse` DTOs; added `POST /enhance-resume` endpoint |

### Flow Architecture

```
enhance_resume_with_metrics(resume_text, job_description)
  ├── extractJobRequirements(job_description)   # existing helper
  ├── extractResumeEntities(resume_text)         # existing helper
  ├── _compute_skills_gap()                      # pure local logic
  └── Gemini generate() → improved_bullets[]     # Google XYZ prompt
```

Fallbacks: if entity extraction or Gemini fails, the flow catches exceptions and returns empty lists / zero scores — it never propagates a 500 to the client due to an AI transient error.

---

## Frontend Changes

| File | Change |
|---|---|
| `frontend/src/services/aiInterface.ts` | Added `ImprovedBullet`, `SkillsGap`, `EnhanceResumeResult` interfaces; added `enhanceResumeWithMetrics()` fetch function |
| `frontend/src/hooks/useAnalysis.ts` | Added `improvedBullets`, `skillsGap`, `enhancing` state; added `enhanceResume()` callback; re-exports types |
| `frontend/src/features/analysis/BulletMetricsSuggestor.tsx` | **[NEW]** Per-bullet "Suggest Metrics" UI component |
| `frontend/src/features/analysis/SkillsMatchPanel.tsx` | **[NEW]** Skills gap panel with match-score gauge and chip-lists |
| `frontend/src/features/analysis/Analysis.tsx` | Imports new components; renders `<SkillsMatchPanel>` after Keyword Analysis; renders `<BulletMetricsSuggestor>` after Impact Enhancements |

### Component: `<BulletMetricsSuggestor>`

```tsx
<BulletMetricsSuggestor
  bullets={improvedBullets}         // ImprovedBullet[]
  onSuggestMetrics={enhanceResume}  // () => void
  loading={enhancing}               // boolean
/>
```

- Shows a **Suggest Metrics** CTA button when no bullets have been generated.
- Once bullets are returned, renders per-bullet cards:
  - Original bullet (strikethrough)
  - Improved rewrite (bold)
  - Rationale callout block
  - Metric-type badge (NUMBER / PERCENTAGE / TIMEFRAME / SCALE)

### Component: `<SkillsMatchPanel>`

```tsx
<SkillsMatchPanel skillsGap={skillsGap} />  // SkillsGap
```

- match_score percentage badge + progress bar (colour-coded: green ≥70, amber ≥40, red <40)
- Three chip-lists with item counts: Matched (green), Missing (red), Adjacent (tertiary)

---

## Tests Added

| File | Type | Coverage |
|---|---|---|
| `backend/app/tests/genkit_flows/test_enhance_resume_metrics.py` | Unit | `_compute_skills_gap` pure function (6 cases), `enhance_resume_with_metrics` (4 async mocked flows) |
| `frontend/src/features/analysis/BulletMetricsSuggestor.test.tsx` | Component | Empty state, button click, loading state, bullet card content, metric badges |
| `frontend/src/features/analysis/SkillsMatchPanel.test.tsx` | Component | Score display, chip lists, empty states, progress bar accessibility |

---

## Design Decisions

- **No new AI call for skills gap** — computed locally via set operations on the output of the two existing extraction flows (`extractJobRequirements` + `extractResumeEntities`), keeping latency low.
- **Single endpoint, two concerns** — bullets and skills gap are returned together from one request, since both require the same extracted entities. Avoids a second round-trip.
- **Graceful degradation** — the flow catches AI errors and returns empty arrays; the UI handles this with a prompt to retry.
- **Reuse existing patterns** — `@async_genkit_flow` decorator, `get_model()`, and the two extraction helpers are unchanged.
