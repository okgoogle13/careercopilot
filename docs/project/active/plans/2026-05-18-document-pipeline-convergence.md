# Document Pipeline Convergence Plan
**Sprint 4 — Continuation & Handover**
**Created:** 2026-05-18
**Status:** ACTIVE — Awaiting Execution
**Owner:** Engineering (Claude Code)
**Branch:** `copilot/update-sprint-plan-transition`

---

## ⚠️ Handover Notice

This is a critical handover of **half-done work**. The implementing agent is fully accountable for driving this to a production-ready, coherent baseline. The codebase is currently in a "split-state" across multiple dimensions:

1. **PDF is split-brain**: backend WeasyPrint (`pdf_renderer.py`) vs frontend screenshot-to-PDF (`exportEngine.ts`).
2. **State is split-brain**: `AnalysisPage.tsx` mixes legacy `useState` and the new Zustand `analysisPipelineStore`.
3. **Template types are drifted**: `cover_letter` vs `cover-letter`, `ksc` vs `selection-criteria` vs `ksc_star` across three layers.
4. **WeasyPrint is missing from the compiled lock file**: declared in `requirements.in` but absent from `requirements.txt`, meaning the backend PDF path silently fails in CI and production.

Do not leave this feature in a partial or drifted state. Own the outcome.

---

## Context & Background

### What Has Been Confirmed (Code-Verified as of 2026-05-18)

| Component | File | Status |
| :--- | :--- | :--- |
| Backend DOCX Renderer | `backend/app/core/docx_renderer.py` | ✅ Fully implemented (Resume, Cover Letter, KSC) |
| Backend PDF Renderer | `backend/app/core/pdf_renderer.py` | ✅ Implemented but WeasyPrint not in `requirements.txt` |
| Unified Pipeline Orchestrator | `backend/app/core/document_pipeline.py` | ✅ Implemented — routes `doc_type` + `file_format` to renderers |
| Template Repo & ATS Validation | `backend/app/core/templates_repo.py` + `ats_rules.py` | ✅ Implemented — loads JSON template manifests, validates ATS rules |
| Template Manifests | `ai/templates/backend/manifest.json` | ✅ Three templates exist: `minimal` (resume), `standard` (cover letter + KSC) |
| Frontend Export (Screenshot PDF) | `frontend/src/utils/exportEngine.ts` | ✅ Implemented — html2canvas + jsPDF rasterisation |
| Frontend Template API Client | `frontend/src/api/templateService.ts` | ✅ Implemented (client-side) — assumes backend endpoints exist |
| Zustand State Store | `frontend/src/stores/analysisPipelineStore.ts` | ✅ Implemented with `persist` middleware |
| AnalysisPage State Migration | `frontend/src/features/analysis/AnalysisPage.tsx` | 🟡 Partial — still mixing local `useState` with store |
| Backend `/templates` API Routes | (Not found in router) | ❌ Missing — `templateService.ts` calls unimplemented endpoints |
| WeasyPrint in requirements.txt | `backend/requirements.txt` | ❌ Missing from compiled lock — DEPLOYMENT BLOCKER |

### Key Architectural Decisions (Locked — Do Not Reverse)

1. **Backend is the canonical document render authority.** DOCX is the primary ATS-safe export format; PDF is derived via WeasyPrint. Frontend screenshot-PDF (`exportEngine.ts`) is a "Quick Export" convenience only — it must not be labelled "polished."
2. **ATS guardrails are non-negotiable.** All templates must pass `validate_template_schema()` before rendering. Single-column, no tables, no images.
3. **Unified schema is the data contract.** The JSON Resume-based Pydantic models in the backend are the source of truth. Frontend store shapes must mirror them exactly.
4. **Design tokens: KR Solidarity v6.1.** No raw hex codes. No deviation from `Strike`, `Placard`, `Scaffold` archetypes. Check `AGENTS.md` before every frontend file change.

---

## Problems to Solve (Ordered by Risk)

### P0 — DEPLOYMENT BLOCKER: WeasyPrint Missing from requirements.txt

**Root Cause:** `weasyprint` is declared in `backend/requirements.in` but was not resolved into the compiled `backend/requirements.txt`.

**Impact:** `backend/app/core/pdf_renderer.py` imports `from weasyprint import HTML` at the top level. Any environment running from `requirements.txt` (CI, staging, production) will fail to start if this module is imported, or will fail at call-time if import is deferred.

**Fix:** Re-compile the lock file or manually add `weasyprint` to `requirements.txt`.

> **Note (Copilot flagged):** WeasyPrint has significant system-level dependencies (Pango, Cairo, GLib). Verify these are present in the Docker base image / Cloud Run build layer before assuming it will work. If the deployment target is serverless (Cloud Run) with a slim base, a fallback strategy must be documented.

---

### P1 — TYPE DRIFT: Naming Inconsistency Across Layers

Three incompatible naming conventions currently co-exist:

| Layer | Doc Type Values |
| :--- | :--- |
| `frontend/src/types/index.ts` (`DocumentType`) | `resume`, `cover-letter`, `selection-criteria` |
| `frontend/src/api/templateService.ts` (`TemplateType`) | `resume`, `cover_letter`, `ksc` |
| `ai/templates/backend/manifest.json` (`docType`) | `resume`, `full_letter`, `ksc_star` |
| `backend/app/core/document_pipeline.py` | `resume`, `cover_letter`, `ksc_response` |

**Fix:** Establish a single `DocumentKind` canonical enum and create a mapping/alias layer so existing external surfaces keep working.

---

### P2 — MISSING BACKEND ROUTES: `/api/v1/templates/*`

`frontend/src/api/templateService.ts` makes calls to `${API_BASE_URL}/templates/*` endpoints.
None of these routes are registered in `backend/app/api/router.py` or any endpoint file. The frontend template picker is currently 100% non-functional against the real backend.

---

### P3 — STATE SPLIT: `AnalysisPage.tsx` Partial Migration

`frontend/src/features/analysis/AnalysisPage.tsx` is mid-migration. It writes to `analysisPipelineStore` in some places but retains legacy `useState` for analysis results. This means state does not survive page refreshes — a hard requirement for Sprint 4.

---

## Implementation Plan

### Phase 1: Fix the Deployment Blocker (P0)
**Estimated effort:** 30 minutes
**Files:** `backend/requirements.txt`, `Dockerfile` (if applicable)

#### Step 1.1 — Add WeasyPrint to `requirements.txt`
Re-run `pip-compile` from `requirements.in` **or** manually append the resolved version of `weasyprint` and its dependencies to `requirements.txt`.

```bash
# From backend/ directory, with venv active:
pip-compile requirements.in --output-file requirements.txt
```

If `pip-compile` is not available:
```bash
pip install weasyprint
pip freeze | grep -i weasyprint >> requirements.txt
```

#### Step 1.2 — Verify System Dependencies for WeasyPrint
Confirm the runtime environment has the required native libraries. On macOS (local dev), this is typically via Homebrew:
```bash
brew install pango gdk-pixbuf libffi
```
For Docker/Cloud Run, verify the base image (`python:3.11-slim` or equivalent) includes or can install:
- `libpango-1.0-0`
- `libcairo2`
- `libgdk-pixbuf-2.0-0`
- `shared-mime-info`

If the base image cannot support WeasyPrint (e.g., fully serverless with no build layer), **document this constraint explicitly** and propose `pypdf2` or `reportlab` as a fallback PDF path.

#### Step 1.3 — Add a Smoke Test for PDF Rendering
```python
# backend/app/tests/test_pdf_renderer.py
from app.core.pdf_renderer import render_cover_letter_pdf

def test_pdf_renderer_smoke():
    pdf_bytes = render_cover_letter_pdf("Hello World", candidate_name="Test User")
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    assert pdf_bytes[:4] == b"%PDF"  # PDF magic bytes
```

---

### Phase 2: Establish Canonical Document Types (P1)
**Estimated effort:** 1–2 hours
**Files:** `frontend/src/types/index.ts`, `frontend/src/api/templateService.ts`, `backend/app/core/document_pipeline.py`

#### Step 2.1 — Define Canonical `DocumentKind` Enum

**Backend (Python):**
```python
# backend/app/models/document_kind.py
from enum import Enum

class DocumentKind(str, Enum):
    RESUME = "resume"
    COVER_LETTER = "cover_letter"
    SELECTION_CRITERIA = "selection_criteria"  # canonical name

# Alias mapping for incoming strings from frontend or legacy calls
DOCUMENT_KIND_ALIASES = {
    "cover-letter": DocumentKind.COVER_LETTER,
    "ksc": DocumentKind.SELECTION_CRITERIA,
    "ksc_response": DocumentKind.SELECTION_CRITERIA,
    "ksc_star": DocumentKind.SELECTION_CRITERIA,
    "full_letter": DocumentKind.COVER_LETTER,
    "selection-criteria": DocumentKind.SELECTION_CRITERIA,
}
```

**Frontend (TypeScript):**
```typescript
// frontend/src/types/documentKind.ts
export type DocumentKind = 'resume' | 'cover_letter' | 'selection_criteria';

// Alias map to normalise legacy or hyphenated values
export const DOCUMENT_KIND_ALIASES: Record<string, DocumentKind> = {
  'cover-letter': 'cover_letter',
  'ksc': 'selection_criteria',
  'selection-criteria': 'selection_criteria',
};

export function resolveDocumentKind(raw: string): DocumentKind {
  return DOCUMENT_KIND_ALIASES[raw] ?? (raw as DocumentKind);
}
```

#### Step 2.2 — Update `templateService.ts` to Use Canonical Type
Replace `TemplateType = 'resume' | 'cover_letter' | 'ksc'` with `DocumentKind` import and `resolveDocumentKind()` where needed.

#### Step 2.3 — Update Template Manifest `docType` Values
In `ai/templates/backend/manifest.json`, rename `"docType": "full_letter"` → `"cover_letter"` and `"docType": "ksc_star"` → `"selection_criteria"`. Update `templates_repo.py` to use the canonical kind when filtering.

#### Step 2.4 — Update `DocumentPipeline.generate_document()` to Accept Aliases
Add an alias resolution step at the entry of `generate_document()`:
```python
from app.models.document_kind import DocumentKind, DOCUMENT_KIND_ALIASES

async def generate_document(self, doc_type: str, ...):
    # Normalise incoming doc_type
    kind = DOCUMENT_KIND_ALIASES.get(doc_type, doc_type)
    ...
    if kind == DocumentKind.COVER_LETTER:
        ...
    elif kind == DocumentKind.RESUME:
        ...
    elif kind == DocumentKind.SELECTION_CRITERIA:
        ...
```

---

### Phase 3: Implement Missing Backend `/templates` Routes (P2)
**Estimated effort:** 2–3 hours
**Files:** `backend/app/api/endpoints/templates.py` [NEW], `backend/app/api/router.py`

#### Step 3.1 — Create `templates.py` Endpoint
```python
# backend/app/api/endpoints/templates.py
from fastapi import APIRouter, HTTPException
from app.core.templates_repo import template_repo
from app.models.document_kind import DocumentKind

router = APIRouter()

@router.get("/")
async def list_templates(type: DocumentKind | None = None):
    templates = template_repo.list_templates(doc_type=type)
    return {"templates": templates}

@router.get("/{template_id}")
async def get_template(template_id: str):
    # Search manifest for template by id
    ...

@router.post("/{template_id}/preview")
async def get_template_preview(template_id: str, preview_data: dict):
    # Generate preview HTML from the template + preview_data
    # Uses pdf_renderer._generate_html_from_content() as the shared HTML generator
    ...
```

#### Step 3.2 — Register in Router
In `backend/app/api/router.py`, add:
```python
from .endpoints import templates
...
(templates.router, "/templates", "Templates"),
```

> **Note:** The `POST /templates/{id}/select` and CRUD custom template endpoints can be stubbed initially — they are not on the critical path for Sprint 4. The list + preview endpoints are required for the frontend template picker to function.

---

### Phase 4: Complete State Migration in `AnalysisPage.tsx` (P3)
**Estimated effort:** 2–3 hours
**Files:** `frontend/src/features/analysis/AnalysisPage.tsx`, `frontend/src/stores/analysisPipelineStore.ts`

#### Step 4.1 — Audit Existing Local State
Identify all `useState` hooks in `AnalysisPage.tsx` that hold analysis data:
- ATS result / score
- Career/job opportunity data
- Ingestion/upload state

#### Step 4.2 — Replace with Store Selectors
```typescript
const SESSION_ASSET_ID = 'current-session';
const { getPipeline, setIngestion, setAtsResult } = useAnalysisPipelineStore();
const pipeline = getPipeline(SESSION_ASSET_ID);
const atsResult = pipeline?.atsResult;
```

#### Step 4.3 — Update EvidenceUploader Callback
On successful file processing, call:
```typescript
setIngestion(SESSION_ASSET_ID, {
  fileType: detectedType,
  fileName: file.name,
  extractedText: extractedContent,
  uploadedAt: new Date(),
});
```

#### Step 4.4 — Update Calibration Check Handler
After the ATS score API call returns, call:
```typescript
setAtsResult(SESSION_ASSET_ID, {
  overallScore: response.overall_score,
  keywordMatch: response.keyword_match,
  semanticScore: response.semantic_score,
  formattingScore: response.formatting_score,
  extractionFlags: response.extraction_flags ?? [],
  breakdown: response.breakdown,
  scoredAt: new Date(),
});
```

#### Step 4.5 — Verify `AtsResult` Interface Matches Backend
Cross-reference `frontend/src/stores/analysisPipelineStore.ts` (`AtsResult` interface) against the Pydantic model returned by the backend audit endpoint. Fields must be a 1:1 match. Update either side if drift is found.

---

### Phase 5: Route `ExportActionBar` to Backend (Preparation)
**Estimated effort:** 1 hour (preparation only — full implementation is Sprint 5)
**Files:** `frontend/src/features/analysis/AnalysisPage.tsx` (or `ExportActionBar` component)

#### Step 5.1 — Label "Quick Export" Explicitly
In the export UI, rename the current `exportToPdf()` trigger to **"Quick Export (Screenshot)"**. Add a tooltip or label clarifying this is a visual snapshot, not an ATS-safe document.

#### Step 5.2 — Add "Polished Export" Stub
Add a second export action that calls the backend pipeline endpoint:
```typescript
const handlePolishedExport = async (format: 'pdf' | 'docx') => {
  const pipeline = getPipeline(SESSION_ASSET_ID);
  // POST to /api/documents/export with pipeline.ingestion data + format
  // Backend routes this through DocumentPipeline.generate_document()
  // Return blob and trigger browser download
};
```
This can be stubbed with a `console.log` and TODO for Sprint 5 if the backend `/documents/export` endpoint is not yet wired. The important thing is the architecture is clear and the plumbing is in place.

---

## Verification Checklist (Definition of Done)

Before this plan is considered complete, every item below must be checked:

### P0 — WeasyPrint
- [ ] `weasyprint` present in `requirements.txt`
- [ ] `pip install -r requirements.txt` succeeds without errors
- [ ] Smoke test `test_pdf_renderer.py` passes
- [ ] WeasyPrint system deps confirmed in deployment target (Docker/Cloud Run)

### P1 — Type Normalisation
- [ ] `DocumentKind` canonical enum exists in both Python and TypeScript
- [ ] Alias resolver tested with `cover-letter`, `ksc`, `selection-criteria`, `ksc_star`, `full_letter`
- [ ] Template manifest `docType` values updated to canonical names
- [ ] No `any` types introduced in TypeScript alias layer

### P2 — Backend Template Routes
- [ ] `GET /api/templates/` returns template list from manifest
- [ ] `GET /api/templates/{id}` returns template detail
- [ ] `POST /api/templates/{id}/preview` returns valid HTML string
- [ ] Frontend `templateService.listTemplates()` successfully fetches real data (not 404)

### P3 — State Migration
- [ ] No local `useState` remains for analysis results in `AnalysisPage.tsx`
- [ ] ATS score persists across browser refresh (verified manually)
- [ ] `AtsResult` shape in store matches backend Pydantic model exactly
- [ ] `validate-governance-artifacts.mjs` passes with zero errors

### P5 — Export Labels
- [ ] "Quick Export" label clearly communicates screenshot nature
- [ ] "Polished Export" stub present and wired to correct handler (even if stubbed)

---

## File Reference Map

| Purpose | File Path |
| :--- | :--- |
| Pipeline orchestrator | `backend/app/core/document_pipeline.py` |
| DOCX renderer | `backend/app/core/docx_renderer.py` |
| PDF renderer (WeasyPrint) | `backend/app/core/pdf_renderer.py` |
| ATS validation gate | `backend/app/core/ats_rules.py` |
| Template repo | `backend/app/core/templates_repo.py` |
| Template manifest | `ai/templates/backend/manifest.json` |
| Backend API router | `backend/app/api/router.py` |
| Backend main app | `backend/app/main.py` |
| Backend deps (source) | `backend/requirements.in` |
| Backend deps (compiled) | `backend/requirements.txt` |
| Frontend store | `frontend/src/stores/analysisPipelineStore.ts` |
| Frontend analysis page | `frontend/src/features/analysis/AnalysisPage.tsx` |
| Frontend template API client | `frontend/src/api/templateService.ts` |
| Frontend export engine | `frontend/src/utils/exportEngine.ts` |
| Frontend canonical types | `frontend/src/types/index.ts` |
| Governance authority | `AGENTS.md` |
| Decisions log | `DECISIONS.md` |

---

## Governance Constraints (Non-Negotiable)

- **Authority Order:** `AGENTS.md` > `DECISIONS.md` > this plan
- **Design System:** KR Solidarity v6.1 — use only `Strike`, `Placard`, `Scaffold` archetypes. No raw hex values.
- **ATS Guardrails:** All templates must pass `validate_template_schema()`. Single-column, no tables, no images.
- **No breaking changes to public interfaces** without a corresponding entry in `DECISIONS.md`.
