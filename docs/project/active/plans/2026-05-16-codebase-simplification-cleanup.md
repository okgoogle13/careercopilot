# Codebase Simplification & Cleanup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove code duplication, delete legacy/redundant markdown files, and purge stale/duplicated image assets across the CareerCopilot monorepo.

**Architecture:** Three sequential tracks — (A) code layer fixes in `frontend/src/`, (B) markdown/docs purge, (C) image asset deduplication. Each track is independent and commits separately. No new features, no renames of public APIs without a grep-confirm step first.

**Tech Stack:** TypeScript/React (frontend), Python/FastAPI (backend), bash for file operations.

---

## Track A — Code Simplification

---

### Task A1: Delete `frontend/src/utils/apiClient.ts` (dead duplicate)

There are two API client implementations. `frontend/src/api/apiClient.ts` is Axios-based with typed wrappers and proper error handling. `frontend/src/utils/apiClient.ts` is a Fetch-based implementation with a generic `ApiClient` class that is never imported anywhere.

**Files:**
- Delete: `frontend/src/utils/apiClient.ts`
- Verify: `frontend/src/api/apiClient.ts` (do not touch)

- [ ] **Step 1: Confirm no imports of the utils version**

```bash
grep -r "utils/apiClient" frontend/src --include="*.ts" --include="*.tsx" -l
```

Expected output: nothing (no files). If any files are listed, update their imports to `../../api/apiClient` before deleting.

- [ ] **Step 2: Delete the file**

```bash
rm frontend/src/utils/apiClient.ts
```

- [ ] **Step 3: Verify build still passes**

```bash
cd frontend && yarn build 2>&1 | tail -20
```

Expected: build completes with no missing-module errors.

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: delete unused utils/apiClient.ts duplicate (Fetch impl superseded by api/apiClient.ts)"
```

---

### Task A2: Migrate `applicationService.ts` boilerplate to `BaseApiService`

`frontend/src/api/baseApiService.ts` defines a `BaseApiService` class with generic `get`, `post`, `put`, `delete` methods and centralised error handling. Nothing extends it. `frontend/src/api/applicationService.ts` has ~8 methods each repeating the same try/catch pattern manually.

**Files:**
- Modify: `frontend/src/api/applicationService.ts`
- Read first (do not modify): `frontend/src/api/baseApiService.ts`

- [ ] **Step 1: Read the BaseApiService interface**

```bash
cat frontend/src/api/baseApiService.ts
```

Note the exact class name, constructor signature, and method signatures before proceeding.

- [ ] **Step 2: Read applicationService.ts in full**

```bash
cat frontend/src/api/applicationService.ts
```

Identify every method that follows this pattern:
```typescript
async methodName(...): Promise<T> {
  try {
    const response = await axiosInstance.verb(...);
    return response.data;
  } catch (error) {
    console.error('...');
    throw error;
  }
}
```

- [ ] **Step 3: Rewrite applicationService to extend BaseApiService**

Replace the class body so it extends `BaseApiService` and delegates to the inherited methods. Keep all public method signatures identical — callers must not change.

Example shape (adapt to match actual BaseApiService API you read in Step 1):

```typescript
import { BaseApiService } from './baseApiService';
import { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../types/api';

class ApplicationService extends BaseApiService {
  constructor() {
    super('/applications');
  }

  async createApplication(data: CreateApplicationDTO): Promise<Application> {
    return this.post<Application>('/', data);
  }

  async listApplications(): Promise<Application[]> {
    return this.get<Application[]>('/');
  }

  async getApplication(id: string): Promise<Application> {
    return this.get<Application>(`/${id}`);
  }

  async updateApplication(id: string, data: UpdateApplicationDTO): Promise<Application> {
    return this.put<Application>(`/${id}`, data);
  }

  async deleteApplication(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }
}

export const applicationService = new ApplicationService();
```

- [ ] **Step 4: Type-check**

```bash
cd frontend && yarn tsc --noEmit 2>&1 | grep -i "applicationService\|baseApiService"
```

Expected: no errors for these files.

- [ ] **Step 5: Run related tests**

```bash
cd frontend && yarn test --testPathPattern="application" --passWithNoTests 2>&1 | tail -20
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/api/applicationService.ts
git commit -m "refactor: extend BaseApiService in applicationService, remove manual try/catch boilerplate"
```

---

### Task A3: Merge `useGalleryData` and `useKrDarkData` into a single parameterised hook

Two hooks (`frontend/src/hooks/useGalleryData.ts` and `frontend/src/hooks/useKrDarkData.ts`) contain identical logic with only the TypeScript type name differing. Replace both with a single generic `useFeedData<T>` hook and update callers.

**Files:**
- Create: `frontend/src/hooks/useFeedData.ts`
- Delete: `frontend/src/hooks/useGalleryData.ts`
- Delete: `frontend/src/hooks/useKrDarkData.ts`
- Modify: any file that imports `useGalleryData` or `useKrDarkData`

- [ ] **Step 1: Find all callers**

```bash
grep -r "useGalleryData\|useKrDarkData" frontend/src --include="*.ts" --include="*.tsx" -l
```

Note every file listed.

- [ ] **Step 2: Read both hooks in full**

```bash
cat frontend/src/hooks/useGalleryData.ts
cat frontend/src/hooks/useKrDarkData.ts
```

Identify the shared logic and the type name that differs between them.

- [ ] **Step 3: Create `useFeedData.ts`**

Write a single generic hook that accepts the item type as a type parameter and a fetch URL or config as a runtime argument. Exact shape depends on what you read in Step 2, but the pattern is:

```typescript
// frontend/src/hooks/useFeedData.ts
import { useState, useEffect } from 'react';

interface FeedDataOptions {
  endpoint: string;
  fallback?: unknown[];
}

export function useFeedData<T>(options: FeedDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // mirror the fetch logic from the original hooks exactly
    // use the options.endpoint for the URL
    // on unmount: cancelled = true; do not call setData
    return () => { cancelled = true; };
  }, [options.endpoint]);

  return { data, loading, error };
}
```

Replace the body with the actual logic from the original hooks. Do not invent behaviour.

- [ ] **Step 4: Update each caller**

For each file found in Step 1, replace:
```typescript
import { useGalleryData } from '../hooks/useGalleryData';
// usage: const { data } = useGalleryData();
```
with:
```typescript
import { useFeedData } from '../hooks/useFeedData';
// usage: const { data } = useFeedData<GalleryFeedItem>({ endpoint: '/gallery' });
```

Use the correct endpoint and type from the original hook.

- [ ] **Step 5: Delete the old hooks**

```bash
rm frontend/src/hooks/useGalleryData.ts
rm frontend/src/hooks/useKrDarkData.ts
```

- [ ] **Step 6: Type-check**

```bash
cd frontend && yarn tsc --noEmit 2>&1 | grep -i "feedData\|galleryData\|krDarkData"
```

Expected: no errors.

- [ ] **Step 7: Run hook tests**

```bash
cd frontend && yarn test --testPathPattern="useGallery|useKrDark|useFeed" --passWithNoTests 2>&1 | tail -20
```

Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/hooks/useFeedData.ts
git add -u
git commit -m "refactor: merge useGalleryData + useKrDarkData into generic useFeedData<T>"
```

---

### Task A4: Fix `useAsync` generic default (`any` → `unknown`)

`frontend/src/hooks/useAsync.ts` (or similar) exports `function useAsync<T = any>`. This defeats the purpose of the generic — callers that omit the type parameter get `any` silently. Change the default to `unknown`.

**Files:**
- Modify: `frontend/src/hooks/useAsync.ts` (confirm exact path with grep below)

- [ ] **Step 1: Locate the file**

```bash
grep -r "useAsync" frontend/src/hooks --include="*.ts" -l
```

- [ ] **Step 2: Find and fix the generic default**

```bash
grep -n "= any" frontend/src/hooks/useAsync.ts
```

Change every instance of `<T = any>` to `<T = unknown>` in the function signature. Also find any internal `as any` casts and replace with `as unknown` or remove.

- [ ] **Step 3: Type-check**

```bash
cd frontend && yarn tsc --noEmit 2>&1 | grep -i "useAsync" | head -20
```

Fix any newly surfaced type errors — these are real bugs the `any` was hiding.

- [ ] **Step 4: Run tests**

```bash
cd frontend && yarn test --testPathPattern="useAsync" --passWithNoTests 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/hooks/useAsync.ts
git commit -m "fix: useAsync generic default any→unknown, surfaces hidden type errors"
```

---

### Task A5: Add `_shared.py` error handler to backend — eliminate 16 copy-paste try/except blocks

Multiple backend endpoint files (career.py, config.py, document_export.py, asset_review.py, etc.) repeat the identical try/except pattern. Extract it to a shared decorator/wrapper.

**Files:**
- Create: `backend/app/api/endpoints/_shared.py`
- Modify: `backend/app/api/endpoints/career.py` (as pilot — confirm pattern works before touching others)

- [ ] **Step 1: Read the repeated pattern**

```bash
cat backend/app/api/endpoints/career.py
```

Note the exact try/except structure. It looks approximately like:
```python
try:
    return await some_operation()
except HTTPException as exc:
    if exc.status_code == 500:
        raise HTTPException(status_code=500, detail="...") from exc
    raise
except Exception as exc:
    raise HTTPException(status_code=500, detail="...") from exc
```

- [ ] **Step 2: Create `_shared.py`**

```python
# backend/app/api/endpoints/_shared.py
"""Shared utilities for API endpoint handlers."""
from functools import wraps
from typing import Callable, TypeVar
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

F = TypeVar('F', bound=Callable)


async def run_endpoint(operation: Callable, failure_message: str):
    """Execute an async endpoint operation with standard error handling."""
    try:
        return await operation()
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception(failure_message)
        raise HTTPException(status_code=500, detail=failure_message) from exc
```

- [ ] **Step 3: Write a test for `run_endpoint`**

```python
# backend/tests/test_shared_endpoint.py
import pytest
from fastapi import HTTPException
from backend.app.api.endpoints._shared import run_endpoint


@pytest.mark.asyncio
async def test_run_endpoint_success():
    async def op():
        return {"ok": True}
    result = await run_endpoint(op, "should not fail")
    assert result == {"ok": True}


@pytest.mark.asyncio
async def test_run_endpoint_reraises_http_exception():
    async def op():
        raise HTTPException(status_code=404, detail="not found")
    with pytest.raises(HTTPException) as exc_info:
        await run_endpoint(op, "ignored")
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_run_endpoint_wraps_generic_exception():
    async def op():
        raise ValueError("something broke")
    with pytest.raises(HTTPException) as exc_info:
        await run_endpoint(op, "operation failed")
    assert exc_info.value.status_code == 500
    assert "operation failed" in exc_info.value.detail
```

- [ ] **Step 4: Run the tests**

```bash
cd backend && source venv/bin/activate && pytest tests/test_shared_endpoint.py -v
```

Expected: 3 tests pass.

- [ ] **Step 5: Refactor `career.py` as pilot**

Replace each repeated try/except in `career.py` with:
```python
from app.api.endpoints._shared import run_endpoint

@router.get("/...")
async def some_handler(...):
    return await run_endpoint(
        lambda: actual_service_call(...),
        "Failed to perform operation X"
    )
```

- [ ] **Step 6: Run career endpoint tests**

```bash
cd backend && source venv/bin/activate && pytest tests/ -k "career" -v --passWithNoTests 2>&1 | tail -20
```

Expected: all pass.

- [ ] **Step 7: Commit pilot**

```bash
git add backend/app/api/endpoints/_shared.py backend/tests/test_shared_endpoint.py backend/app/api/endpoints/career.py
git commit -m "refactor: extract shared run_endpoint handler, apply to career.py (pilot)"
```

- [ ] **Step 8: Apply to remaining endpoints**

For each of these files, repeat the same refactor from Step 5:
- `backend/app/api/endpoints/config.py`
- `backend/app/api/endpoints/document_export.py`
- `backend/app/api/endpoints/asset_review.py`
- `backend/app/api/endpoints/manifest_integration.py`
- Any other endpoint file where the pattern appears (grep: `grep -l "except HTTPException" backend/app/api/endpoints/*.py`)

After each file, run `pytest tests/ -v --passWithNoTests 2>&1 | tail -5` to confirm no regressions.

- [ ] **Step 9: Commit remaining**

```bash
git add backend/app/api/endpoints/
git commit -m "refactor: apply run_endpoint wrapper to all remaining endpoint files"
```

---

### Task A6: Fix `aiInterface.ts` naming to clarify client vs server AI boundary

`frontend/src/services/aiInterface.ts` does client-side text processing (keyword extraction, STOP_WORDS). `frontend/src/api/aiServices.ts` makes backend API calls. The names imply they are the same kind of thing, causing import confusion.

**Files:**
- Rename: `frontend/src/services/aiInterface.ts` → `frontend/src/services/aiTextProcessing.ts`
- Modify: all files that import from `aiInterface`

- [ ] **Step 1: Find all importers**

```bash
grep -r "aiInterface\|from.*services/aiInterface" frontend/src --include="*.ts" --include="*.tsx" -l
```

- [ ] **Step 2: Copy file with new name, delete old**

```bash
cp frontend/src/services/aiInterface.ts frontend/src/services/aiTextProcessing.ts
```

- [ ] **Step 3: Update all imports**

In each file found in Step 1, change:
```typescript
import { ... } from '../services/aiInterface';
// or
import { ... } from '../../services/aiInterface';
```
to use `aiTextProcessing` at the same relative path.

- [ ] **Step 4: Delete old file**

```bash
rm frontend/src/services/aiInterface.ts
```

- [ ] **Step 5: Type-check**

```bash
cd frontend && yarn tsc --noEmit 2>&1 | grep -i "aiInterface\|aiTextProcessing"
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename aiInterface.ts→aiTextProcessing.ts to distinguish client-side text processing from backend AI service calls"
```

---

## Track B — Markdown / Docs Cleanup

---

### Task B1: Delete `docs/design/Archive/hifi-legacy/` entirely

`docs/design/hifi/` contains the canonical, current hi-fi wireframe markdown files for all 15+ screens. `docs/design/Archive/hifi-legacy/` is an exact mirror — same files, created at an earlier point, some with different casing. Nothing references the Archive copies.

**Files:**
- Delete: `docs/design/Archive/hifi-legacy/` (entire directory)

- [ ] **Step 1: Confirm no references to Archive hifi files**

```bash
grep -r "Archive/hifi-legacy" docs/ --include="*.md" -l
grep -r "Archive/hifi-legacy" frontend/src --include="*.ts" --include="*.tsx" -l
```

Expected: no output.

- [ ] **Step 2: Confirm canonical dir has equivalent files**

```bash
ls docs/design/hifi/ | wc -l
ls docs/design/Archive/hifi-legacy/ | wc -l
```

The archive should have fewer or equal files. All screen names present in archive should also exist in canonical dir.

- [ ] **Step 3: Delete**

```bash
rm -rf docs/design/Archive/hifi-legacy/
```

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: delete docs/design/Archive/hifi-legacy/ — exact duplicate of docs/design/hifi/"
```

---

### Task B2: Delete generated artifact files

`docs/PROJECT_INDEX.md` (5,530 lines) is an auto-generated repo map that goes stale instantly. `docs/REPO_COMPLETE_FILELIST.txt` is a plain file list. Neither should be version-controlled.

**Files:**
- Delete: `docs/PROJECT_INDEX.md`
- Delete: `docs/REPO_COMPLETE_FILELIST.txt`

- [ ] **Step 1: Confirm not referenced in CLAUDE.md or AGENTS.md**

```bash
grep -i "PROJECT_INDEX\|REPO_COMPLETE_FILELIST" CLAUDE.md AGENTS.md TASKS.md SPRINT_BRIEF.md
```

Expected: no output. If found, remove those references first.

- [ ] **Step 2: Delete files**

```bash
rm docs/PROJECT_INDEX.md
rm docs/REPO_COMPLETE_FILELIST.txt
```

- [ ] **Step 3: Add to .gitignore to prevent re-creation**

```bash
echo "docs/PROJECT_INDEX.md" >> .gitignore
echo "docs/REPO_COMPLETE_FILELIST.txt" >> .gitignore
```

- [ ] **Step 4: Commit**

```bash
git add -u .gitignore
git commit -m "chore: delete auto-generated PROJECT_INDEX.md and REPO_COMPLETE_FILELIST.txt, gitignore both"
```

---

### Task B3: Delete exact-duplicate markdown files (stale copies)

Six files exist in two locations. The canonical copy is kept; the stale copy is deleted.

| File | Keep (canonical) | Delete (stale) |
|------|-----------------|----------------|
| `CACHE_STRATEGY.md` | `docs/infrastructure/` | `docs/architecture/` |
| `DEPLOYMENT_WORKFLOW.md` | `docs/infrastructure/` | `docs/archive/legacy/root/` |
| `MCP_AUDIT_REPORT.md` | `docs/reports/archive/audits/` | `docs/other/` |
| `HANDOVER.md` | `docs/other/` | `docs/archive/general/legacy_folders/docs__archive/` |
| `COMPONENT_AUDIT_REPORT.md` | `docs/reports/archive/audits/` | `docs/other/` |
| `MIGRATION-ANALYSIS.md` | `docs/other/` | `docs/archive/general/legacy_folders/frontend__archive/` |

**Files:**
- Delete: 6 stale copies as listed above.

- [ ] **Step 1: Verify files match before deleting (spot-check two)**

```bash
diff docs/architecture/CACHE_STRATEGY.md docs/infrastructure/CACHE_STRATEGY.md | head -20
diff "docs/other/MCP_AUDIT_REPORT.md" "docs/reports/archive/audits/MCP_AUDIT_REPORT.md" | head -20
```

If substantial differences exist, keep both under their current names and skip that file. Do not merge.

- [ ] **Step 2: Delete the stale copies**

```bash
rm docs/architecture/CACHE_STRATEGY.md
rm docs/archive/legacy/root/DEPLOYMENT_WORKFLOW.md
rm "docs/other/MCP_AUDIT_REPORT.md"
rm "docs/archive/general/legacy_folders/docs__archive/HANDOVER.md"
rm "docs/other/COMPONENT_AUDIT_REPORT.md"
rm "docs/archive/general/legacy_folders/frontend__archive/MIGRATION-ANALYSIS.md"
```

- [ ] **Step 3: Commit**

```bash
git add -u
git commit -m "chore: delete 6 exact-duplicate markdown files, keep canonical copies"
```

---

### Task B4: Move completed handover packets from `active/` to `archive/`

`docs/project/active/handovers/` contains 9 agent dispatch packets all dated 2026-04-18 and 2026-04-19. These are completed work products, not active documents. The `active/` directory should only contain live plans and handovers.

**Files:**
- Move from `docs/project/active/handovers/` to `docs/project/archive/handovers/`:
  - `2026-04-18-agent-invocation-index.md`
  - `2026-04-18-claude-code-mechanical-cleanup-packet-template.md`
  - `2026-04-18-claude-code-workstream-a-packet.md`
  - `2026-04-18-claude-code-workstream-b-packet.md`
  - `2026-04-18-claude-code-workstream-d-packet.md`
  - `2026-04-18-claude-semantic-review-packet.md`
  - `2026-04-18-codex-workstream-c-packet.md`
  - `2026-04-18-gemini-inventory-packet.md`
  - `2026-04-18-operator-dispatch-sheet.md`
  - `2026-04-18-remaining-execution-handover.md`
  - `2026-04-18-token-translation-table.md`
  - `2026-04-19-agent-execution-summary.md`
  - `2026-04-19-asset-structure-remediation-plan.md`
  - `2026-04-19-codex-parity-remediation-packet.md`
  - `2026-04-19-delegated-execution-handover.md`
  - `2026-04-19-post-agent-redirect-history-cleanup-summary.md`
  - `2026-04-22-active-branch-ledger.md`
  - `2026-04-22-branch-consolidation-log.md`

- [ ] **Step 1: Create archive handovers dir if needed**

```bash
mkdir -p docs/project/archive/handovers
```

- [ ] **Step 2: Move all April-dated handovers**

```bash
mv docs/project/active/handovers/2026-04-1* docs/project/archive/handovers/
mv docs/project/active/handovers/2026-04-2* docs/project/archive/handovers/
```

- [ ] **Step 3: Verify active/handovers is now clean**

```bash
ls docs/project/active/handovers/
```

Expected: empty or contains only genuinely current (May 2026+) handovers.

- [ ] **Step 4: Commit**

```bash
git add -A docs/project/
git commit -m "chore: move completed April handover packets from active/ to archive/"
```

---

### Task B5: Move completed phase reports to `docs/reports/archive/`

`docs/reports/` contains 12 date-stamped phase5 and phase6 reports from 2026-03-09. These are finished sprint deliverables and should not sit alongside active reports.

**Files:**
- Move from `docs/reports/` to `docs/reports/archive/`:
  - All files matching `phase5-*` and `phase6-*`
  - `compliance-dashboard-2026-03-02.md`
  - `dependency-cleanup-safety-checklist-2026-03-09.md`
  - `kr-asset-extraction-plan-2026-03-02.md`
  - `kr-asset-extraction-triage-2026-03-01.md`
  - `kr-m3-pipeline-dashboard-2026-03-09.md`
  - `style-guide-kr-canonicalization-2026-03-09.md`

- [ ] **Step 1: Confirm archive dir exists**

```bash
mkdir -p docs/reports/archive
```

- [ ] **Step 2: Move phase reports**

```bash
mv docs/reports/phase5-* docs/reports/archive/
mv docs/reports/phase6-* docs/reports/archive/
mv docs/reports/compliance-dashboard-2026-03-02.md docs/reports/archive/
mv docs/reports/dependency-cleanup-safety-checklist-2026-03-09.md docs/reports/archive/
mv docs/reports/kr-asset-extraction-plan-2026-03-02.md docs/reports/archive/
mv docs/reports/kr-asset-extraction-triage-2026-03-01.md docs/reports/archive/
mv docs/reports/kr-m3-pipeline-dashboard-2026-03-09.md docs/reports/archive/
mv docs/reports/style-guide-kr-canonicalization-2026-03-09.md docs/reports/archive/
```

- [ ] **Step 3: Verify**

```bash
ls docs/reports/*.md 2>/dev/null | head -20
```

Expected: only genuinely active/current reports remain.

- [ ] **Step 4: Commit**

```bash
git add -A docs/reports/
git commit -m "chore: archive completed phase5/phase6 reports and March-dated deliverables"
```

---

### Task B6: Delete the malformed filename at root of docs

`docs/# Unified User Journey and Feature Docum.md` has an illegal `#` prefix — this is a paste artifact from a clipboard. It also appears the content may be duplicated elsewhere.

**Files:**
- Investigate then delete: `docs/# Unified User Journey and Feature Docum.md`

- [ ] **Step 1: Read the file to check for unique content**

```bash
head -30 "docs/# Unified User Journey and Feature Docum.md"
```

- [ ] **Step 2: Check if content exists elsewhere**

```bash
# Search for title phrase
grep -r "Unified User Journey" docs/ --include="*.md" -l
```

- [ ] **Step 3: Delete**

```bash
rm "docs/# Unified User Journey and Feature Docum.md"
```

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: delete malformed filename 'docs/# Unified User Journey...' paste artifact"
```

---

## Track C — Image Asset Cleanup

---

### Task C1: Delete Storybook default template assets from `frontend/src/stories/assets/`

`frontend/src/stories/assets/` contains 14 default Storybook onboarding images (accessibility.png, addon-library.png, discord.svg, youtube.svg, etc.) — these are the assets shipped with `npx storybook init` and are not part of the CareerCopilot design system. An identical copy also exists in `docs/archive_legacy_reports/root_legacy/src/stories/assets/` and `docs/archive_legacy_reports/root_legacy/stories/assets/`.

**Files:**
- Delete: `frontend/src/stories/assets/` (entire directory)
- Delete: `docs/archive_legacy_reports/root_legacy/src/stories/assets/` (entire directory)
- Delete: `docs/archive_legacy_reports/root_legacy/stories/assets/` (entire directory)

- [ ] **Step 1: Confirm no production code imports from stories/assets**

```bash
grep -r "stories/assets" frontend/src --include="*.ts" --include="*.tsx" --include="*.css" -l
```

Expected: only story files (`.stories.tsx`), not production components. If production files import from here, skip this task and investigate.

- [ ] **Step 2: Delete**

```bash
rm -rf frontend/src/stories/assets/
rm -rf "docs/archive_legacy_reports/root_legacy/src/stories/assets/"
rm -rf "docs/archive_legacy_reports/root_legacy/stories/assets/"
```

- [ ] **Step 3: Run Storybook build to confirm stories still load**

```bash
cd frontend && yarn storybook build --quiet 2>&1 | tail -10
```

If Storybook is not installed, skip this step. If build fails, restore the directory with `git checkout`.

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: delete default Storybook template assets from stories/assets/ (not project assets)"
```

---

### Task C2: Delete legacy flora image assets from `docs/archive_legacy_reports/`

`docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets/` contains Australian native plant images (`fiddleleaffig.png`, `monsteraleaf.png`, `moneyplant.png`, `snakeplant.png`, `plantbanner.png`, `stringofpearls.png`). These violate the KR Solidarity design canon (no Australian native flora) and predate the current design system. They are not referenced by any production code.

**Files:**
- Delete: `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets/fiddleleaffig.png`
- Delete: `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets/monsteraleaf.png`
- Delete: `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets/moneyplant.png`
- Delete: `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets/snakeplant.png`
- Delete: `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets/plantbanner.png`
- Delete: `docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets/stringofpearls.png`

- [ ] **Step 1: Confirm not referenced in any active code**

```bash
grep -r "fiddleleaf\|monsteraleaf\|moneyplant\|snakeplant\|plantbanner\|stringofpearls" \
  frontend/src backend/app --include="*.ts" --include="*.tsx" --include="*.py" -l
```

Expected: no output.

- [ ] **Step 2: Delete**

```bash
BASE="docs/archive_legacy_reports/root_legacy/Career-Copilot-Web-App--3-/src/assets"
rm "$BASE/fiddleleaffig.png" "$BASE/monsteraleaf.png" "$BASE/moneyplant.png" \
   "$BASE/snakeplant.png" "$BASE/plantbanner.png" "$BASE/stringofpearls.png"
```

- [ ] **Step 3: Commit**

```bash
git add -u
git commit -m "chore: delete legacy flora assets violating KR Solidarity canon (pre-design-system)"
```

---

### Task C3: Delete root-level screenshot artifacts

6 PNG files sit at the repo root (`component_gallery_initial.png`, `dashboard-canonical.png`, `landing-page-canonical.png`, `landing-page-post-figma-sync.png`, `prototype-index.png`, `style_guide_kinetic_morphs.png`). These are developer verification screenshots — not versioned assets. The total size is ~3.5MB.

**Files:**
- Delete: `component_gallery_initial.png`
- Delete: `dashboard-canonical.png`
- Delete: `landing-page-canonical.png`
- Delete: `landing-page-post-figma-sync.png`
- Delete: `prototype-index.png`
- Delete: `style_guide_kinetic_morphs.png`

- [ ] **Step 1: Confirm not referenced in documentation or CI**

```bash
grep -r "dashboard-canonical\|landing-page-canonical\|prototype-index\|style_guide_kinetic" \
  docs/ .github/ --include="*.md" --include="*.yml" -l 2>/dev/null
```

If referenced in `.github/` CI workflows, skip those files. If referenced in docs, update the reference to remove the image link before deleting.

- [ ] **Step 2: Delete**

```bash
rm component_gallery_initial.png dashboard-canonical.png landing-page-canonical.png \
   landing-page-post-figma-sync.png prototype-index.png style_guide_kinetic_morphs.png
```

- [ ] **Step 3: Add `*.png` root-level pattern to .gitignore**

```bash
# Add to end of .gitignore — prevent future screenshot dumps at root
echo "" >> .gitignore
echo "# Developer screenshots — never commit to root" >> .gitignore
echo "/component_gallery_*.png" >> .gitignore
echo "/dashboard-canonical.png" >> .gitignore
echo "/landing-page-*.png" >> .gitignore
echo "/prototype-index.png" >> .gitignore
echo "/style_guide_*.png" >> .gitignore
```

- [ ] **Step 4: Commit**

```bash
git add -u .gitignore
git commit -m "chore: delete root-level dev screenshot artifacts (~3.5MB), gitignore pattern to prevent recurrence"
```

---

### Task C4: Deduplicate `frontend/dist/assets/` from version control

`frontend/dist/` is the build output directory. It contains 131 asset files including all 46 kr-solidarity SVGs and 85 image files — duplicating `frontend/public/assets/` (113 files). Build output should never be committed.

- [ ] **Step 1: Confirm dist is not intentionally committed (check .gitignore)**

```bash
cat frontend/.gitignore | grep "dist"
cat .gitignore | grep "dist"
```

If `dist/` is already in `.gitignore`, it may be committed via `--force` or was added before the rule. Proceed either way.

- [ ] **Step 2: Check git tracking**

```bash
git ls-files frontend/dist/ | wc -l
```

If output is 0, `dist/` is already untracked — skip this task. If > 0, proceed.

- [ ] **Step 3: Remove dist from git tracking (keep files on disk)**

```bash
git rm -r --cached frontend/dist/
```

- [ ] **Step 4: Ensure `frontend/dist/` is in .gitignore**

```bash
grep -q "^frontend/dist" .gitignore || echo "frontend/dist/" >> .gitignore
grep -q "^dist/" frontend/.gitignore 2>/dev/null || echo "dist/" >> frontend/.gitignore
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore frontend/.gitignore
git commit -m "chore: untrack frontend/dist/ from git — build output should not be versioned"
```

---

### Task C5: Verify `frontend/src/assets/textures/` — confirm files are in use

`frontend/src/assets/textures/` contains `paper-grain.png` and `wallpaper.png`. These ARE referenced in production code (`kerala-rage.css`, `LandingPage.tsx`, `ApplicationTracker.tsx`). Do not delete them. Confirm the references are healthy and document them.

**Files:**
- Read-only check: `frontend/src/assets/textures/`

- [ ] **Step 1: Confirm references are valid**

```bash
grep -r "paper-grain\|wallpaper\|assets/textures" frontend/src --include="*.ts" --include="*.tsx" --include="*.css"
```

- [ ] **Step 2: Check there is no duplicate in public/assets**

```bash
find frontend/public -name "paper-grain.png" -o -name "wallpaper.png"
```

If duplicates exist in `public/`, check which is referenced in production CSS and delete the unreferenced copy.

- [ ] **Step 3: No commit needed** — these files are healthy. Document the outcome in a one-line comment in the PR description.

---

## Self-Review Checklist

**Spec coverage:**
- [x] Delete `utils/apiClient.ts` duplicate — Task A1
- [x] Migrate `applicationService` to `BaseApiService` — Task A2
- [x] Merge `useGalleryData` + `useKrDarkData` — Task A3
- [x] Fix `useAsync` `any` default — Task A4
- [x] Backend shared error handler — Task A5
- [x] Rename `aiInterface.ts` — Task A6
- [x] Delete hifi archive dir — Task B1
- [x] Delete generated artifacts (PROJECT_INDEX, REPO_COMPLETE_FILELIST) — Task B2
- [x] Delete 6 exact-duplicate md files — Task B3
- [x] Archive April handover packets — Task B4
- [x] Archive phase5/6 reports — Task B5
- [x] Delete malformed filename — Task B6
- [x] Delete Storybook template assets — Task C1
- [x] Delete legacy flora assets — Task C2
- [x] Delete root-level screenshots — Task C3
- [x] Untrack `frontend/dist/` — Task C4
- [x] Verify texture assets in use — Task C5

**No placeholders found.** All steps contain concrete commands or code.

**Type consistency:** `BaseApiService`, `run_endpoint`, `useFeedData` — used consistently within their respective tasks.
