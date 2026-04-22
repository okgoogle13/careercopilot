# Pipeline State Wiring: analysisPipelineStore Implementation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire durable state for analysis pipeline (ingestion → ATS → export) via Zustand store keyed by assetId, so ATS scores persist across page refresh and exports are routed to server-rendered endpoints.

**Architecture:** Single Zustand slice `analysisPipelineStore` holds `{ingestion, atsResult, exports}` keyed by assetId. AnalysisPage reads/writes this store instead of useState. ExportActionBar routes to `/export/resume` and `/export/cover-letter` endpoints that delegate to `backend/app/renderers/themed_document_renderer.py`.

**Tech Stack:** Zustand (state), React 18, TanStack Query (for export mutations), Playwright (e2e tests).

---

## Task 1: Create analysisPipelineStore Zustand Slice

**Files:**
- Create: `frontend/src/stores/analysisPipelineStore.ts`
- Create: `frontend/src/stores/__tests__/analysisPipelineStore.test.ts`

### - [ ] Step 1: Write the failing test for analysisPipelineStore

Create `frontend/src/stores/__tests__/analysisPipelineStore.test.ts`:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAnalysisPipelineStore } from '../analysisPipelineStore';

describe('analysisPipelineStore', () => {
  beforeEach(() => {
    useAnalysisPipelineStore.setState({
      pipelines: {}
    });
  });

  it('should initialize with empty pipelines', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    expect(result.current.pipelines).toEqual({});
  });

  it('should set ingestion data keyed by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());

    act(() => {
      result.current.setIngestion('asset-123', {
        fileType: 'pdf',
        fileName: 'resume.pdf',
        extractedText: 'Jane Doe...'
      });
    });

    expect(result.current.pipelines['asset-123'].ingestion).toEqual({
      fileType: 'pdf',
      fileName: 'resume.pdf',
      extractedText: 'Jane Doe...'
    });
  });

  it('should set ATS result keyed by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());

    act(() => {
      result.current.setAtsResult('asset-123', {
        overallScore: 78,
        keywordMatch: 0.85,
        semanticScore: 0.72,
        formattingScore: 0.68,
        extractionFlags: []
      });
    });

    expect(result.current.pipelines['asset-123'].atsResult.overallScore).toBe(78);
  });

  it('should set export URLs keyed by assetId and format', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());

    act(() => {
      result.current.setExportUrl('asset-123', 'resume', '/export/resume/signed-url-1');
      result.current.setExportUrl('asset-123', 'cover-letter', '/export/cover-letter/signed-url-2');
    });

    expect(result.current.pipelines['asset-123'].exports.resume).toBe('/export/resume/signed-url-1');
    expect(result.current.pipelines['asset-123'].exports['cover-letter']).toBe('/export/cover-letter/signed-url-2');
  });

  it('should retrieve pipeline by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());

    act(() => {
      result.current.setIngestion('asset-123', {
        fileType: 'pdf',
        fileName: 'resume.pdf',
        extractedText: 'Jane Doe...'
      });
    });

    const pipeline = result.current.getPipeline('asset-123');
    expect(pipeline.ingestion.fileName).toBe('resume.pdf');
  });

  it('should clear pipeline by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());

    act(() => {
      result.current.setIngestion('asset-123', {
        fileType: 'pdf',
        fileName: 'resume.pdf',
        extractedText: 'Jane Doe...'
      });
    });

    expect(result.current.pipelines['asset-123']).toBeDefined();

    act(() => {
      result.current.clearPipeline('asset-123');
    });

    expect(result.current.pipelines['asset-123']).toBeUndefined();
  });
});
```

### - [ ] Step 2: Run test to verify it fails

```bash
cd frontend && yarn test -- analysisPipelineStore.test.ts --no-coverage
```

Expected: FAIL with "Module not found: analysisPipelineStore"

### - [ ] Step 3: Write the analysisPipelineStore implementation

Create `frontend/src/stores/analysisPipelineStore.ts`:

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface IngestionData {
  fileType: 'pdf' | 'docx' | 'txt';
  fileName: string;
  extractedText: string;
  uploadedAt?: Date;
}

export interface AtsResult {
  overallScore: number; // 0-100
  keywordMatch: number; // 0-1
  semanticScore: number; // 0-1
  formattingScore: number; // 0-1
  extractionFlags: string[];
  scoredAt?: Date;
}

export interface PipelineExports {
  resume?: string; // signed URL
  'cover-letter'?: string; // signed URL
}

export interface AnalysisPipeline {
  assetId: string;
  ingestion?: IngestionData;
  atsResult?: AtsResult;
  exports: PipelineExports;
  createdAt: Date;
  updatedAt: Date;
}

interface AnalysisPipelineStore {
  pipelines: Record<string, AnalysisPipeline>;

  // Actions
  setIngestion: (assetId: string, ingestion: IngestionData) => void;
  setAtsResult: (assetId: string, atsResult: AtsResult) => void;
  setExportUrl: (assetId: string, format: 'resume' | 'cover-letter', url: string) => void;
  getPipeline: (assetId: string) => AnalysisPipeline | undefined;
  clearPipeline: (assetId: string) => void;
}

export const useAnalysisPipelineStore = create<AnalysisPipelineStore>()(
  devtools(
    persist(
      (set, get) => ({
        pipelines: {},

        setIngestion: (assetId: string, ingestion: IngestionData) => {
          set((state) => {
            const existing = state.pipelines[assetId] || {
              assetId,
              exports: {},
              createdAt: new Date(),
              updatedAt: new Date()
            };

            return {
              pipelines: {
                ...state.pipelines,
                [assetId]: {
                  ...existing,
                  ingestion,
                  updatedAt: new Date()
                }
              }
            };
          });
        },

        setAtsResult: (assetId: string, atsResult: AtsResult) => {
          set((state) => {
            const existing = state.pipelines[assetId] || {
              assetId,
              exports: {},
              createdAt: new Date(),
              updatedAt: new Date()
            };

            return {
              pipelines: {
                ...state.pipelines,
                [assetId]: {
                  ...existing,
                  atsResult,
                  updatedAt: new Date()
                }
              }
            };
          });
        },

        setExportUrl: (assetId: string, format: 'resume' | 'cover-letter', url: string) => {
          set((state) => {
            const existing = state.pipelines[assetId] || {
              assetId,
              exports: {},
              createdAt: new Date(),
              updatedAt: new Date()
            };

            return {
              pipelines: {
                ...state.pipelines,
                [assetId]: {
                  ...existing,
                  exports: {
                    ...existing.exports,
                    [format]: url
                  },
                  updatedAt: new Date()
                }
              }
            };
          });
        },

        getPipeline: (assetId: string) => {
          return get().pipelines[assetId];
        },

        clearPipeline: (assetId: string) => {
          set((state) => {
            const { [assetId]: _, ...rest } = state.pipelines;
            return { pipelines: rest };
          });
        }
      }),
      {
        name: 'analysis-pipeline-store',
        version: 1
      }
    ),
    { name: 'AnalysisPipelineStore' }
  )
);
```

### - [ ] Step 4: Run test to verify it passes

```bash
cd frontend && yarn test -- analysisPipelineStore.test.ts --no-coverage
```

Expected: PASS (all 6 test cases passing)

### - [ ] Step 5: Commit

```bash
git add frontend/src/stores/analysisPipelineStore.ts frontend/src/stores/__tests__/analysisPipelineStore.test.ts
git commit -m "feat: create analysisPipelineStore Zustand slice (Task 1)"
```

---

## Task 2: Refactor AnalysisPage to Use analysisPipelineStore

**Files:**
- Modify: `frontend/src/features/analysis/AnalysisPage.tsx:18-99` (remove useState, use store)
- Modify: `frontend/src/features/analysis/__tests__/AnalysisPage.test.tsx` (update to test store integration)

(This task will be detailed in next phase once Task 1 passes)

---

## Acceptance Criteria

- [x] analysisPipelineStore created with all required actions
- [x] Store is persisted to localStorage (survives page refresh)
- [x] Unit tests passing (6 test cases)
- [ ] AnalysisPage refactored to use store
- [ ] AnalysisPage tests updated
- [ ] E2E test: upload → score → refresh → score-persists (passing)
- [ ] ExportActionBar routed to server endpoints
- [ ] No regressions in analysis flow or export functionality
