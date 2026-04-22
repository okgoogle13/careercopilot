# DOCX Export Workbench Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add narrow DOCX export support for real generated document content without widening route ownership or scraping placeholder card UI.

**Architecture:** Add a shared DOCX export service plus a thin `/documents` hook contract that supports resume, cover letter, and KSC documents. Wire the first live integrations only into content-bearing review workbenches that already hold real generated text, while keeping the service ready for future resume workbench input.

**Tech Stack:** React 18, TypeScript, Jest, `docx`, `file-saver`

---

## Chunk 1: Tests And Export Contract

### Task 1: Create the shared export contract and service tests

**Files:**
- Create: `frontend/src/features/documents/services/__tests__/docxExport.test.ts`
- Create: `frontend/src/features/documents/services/docxExport.ts`

- [ ] **Step 1: Write the failing test**

Add tests that prove:
- cover-letter export builds a `.docx` with expected filename
- KSC export builds a `.docx` with expected filename
- resume export is supported by the contract
- empty/unsupported content throws a clear error

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && yarn test src/features/documents/services/__tests__/docxExport.test.ts --runInBand`
Expected: FAIL because `docxExport.ts` does not exist yet

- [ ] **Step 3: Write minimal implementation**

Implement:
- discriminated input union for `resume`, `cover-letter`, `ksc`
- per-type document builders
- `exportDocumentAsDocx()` that writes a blob with `docx` and saves it

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && yarn test src/features/documents/services/__tests__/docxExport.test.ts --runInBand`
Expected: PASS

## Chunk 2: Hook And First Live Integrations

### Task 2: Add narrow hook wrapper and integrate with review workbenches

**Files:**
- Create: `frontend/src/features/documents/hooks/useDocumentExport.ts`
- Modify: `frontend/src/features/applications/CoverLetterGenerator.tsx`
- Modify: `frontend/src/features/ksc-generator/KSCGenerator.tsx`
- Create: `frontend/src/features/applications/__tests__/CoverLetterGenerator.docx.test.tsx`
- Create: `frontend/src/features/ksc-generator/__tests__/KSCGenerator.docx.test.tsx`

- [ ] **Step 1: Write failing integration tests**

Add tests that prove:
- cover-letter review step shows `Download DOCX` only when generated content exists and calls the hook
- KSC review step shows `Download DOCX` only when generated content exists and calls the hook

- [ ] **Step 2: Run tests to verify they fail**

Run:
- `cd frontend && yarn test src/features/applications/__tests__/CoverLetterGenerator.docx.test.tsx --runInBand`
- `cd frontend && yarn test src/features/ksc-generator/__tests__/KSCGenerator.docx.test.tsx --runInBand`

Expected: FAIL because the button/hook wiring does not exist yet

- [ ] **Step 3: Implement minimal code**

Add:
- `useDocumentExport()` wrapper that accepts the shared export contract and method
- `Download DOCX` actions in:
  - `CoverLetterGenerator` review step
  - `KSCGenerator` review step

Constraints:
- no DOM scraping
- no card-level DOCX export
- no markdown export
- no route-owner changes

- [ ] **Step 4: Run tests to verify they pass**

Run the two targeted tests again and confirm PASS

## Chunk 3: Verification And Tracker Update

### Task 3: Verify, then update governance docs

**Files:**
- Modify: `docs/project/active/frontend-source-of-truth-migration/control/PROTOTYPE-SALVAGE-TRACKER.md`

- [ ] **Step 1: Run verification**

Run:
- `cd frontend && yarn test src/features/documents/services/__tests__/docxExport.test.ts --runInBand`
- `cd frontend && yarn test src/features/applications/__tests__/CoverLetterGenerator.docx.test.tsx --runInBand`
- `cd frontend && yarn test src/features/ksc-generator/__tests__/KSCGenerator.docx.test.tsx --runInBand`
- `cd frontend && yarn type-check`
- `npx tsx tools/scripts/scan-routes.ts`
- `npx tsx tools/ci/check-route-integrity.ts`
- `npx tsx tools/ci/check-screen-pairs.ts`

- [ ] **Step 2: Update tracker truth**

Update D1 to reflect:
- false S3 type prerequisite removed
- DOCX dependency decision approved and implemented
- first live integrations are content-bearing review workbenches
- resume export contract exists but awaits a mounted structured resume workbench to surface UI

- [ ] **Step 3: Stop for review**

Do not start D2. Hand off to Codex review.
