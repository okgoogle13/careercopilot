# Support Reference Audit — Ingestion (`/career/ingest`)

**Route row:** `career/ingest` in `control/route-matrix.json`
**Canonical screen:** `frontend/src/screens/04_ingestion/04_ingestion.wireframe.xml` + `frontend/src/screens/04_ingestion/IngestionFlow.tsx`
**Runtime owner:** `frontend/src/features/ingestion/SmartIngestion.tsx`
**Support candidate:** `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/Ingestion.tsx`

## Decision

- **Approved reuse mode:** `reference_only`
- **Why:** the support candidate has useful empty-state choreography, upload/paste mode sequencing, and processing-stage storytelling, but the ingestion route is already implementation-complete and the Figma page is structurally an outlier that should not re-drive route ownership or shell decisions.
- **Archetype mapping:** `Strike`-anchored ingestion intake with a `Placard` completion state and full-bleed drop-zone staging.
- **Generic SaaS risk:** `medium` — the upload choreography is stronger than a default uploader, but still trends toward familiar drop-zone patterns if copied without KR asymmetry and current runtime behavior.

## Reuse Allowed

- empty-state copy rhythm and upload/paste mode sequencing
- processing-stage progression and completion-state framing
- ideas for route-local progress storytelling

## Rewrite Required

- keep `/career/ingest` as the canonical owner of ingestion and `/api/v1/ingest`
- do not force the page back into the shared sidebar shell; the Figma page is intentionally different
- preserve current runtime/backend contract behavior over support mock sequencing

## Exclusions

- no direct promotion of `Ingestion.tsx`
- no shell normalization based on other sidebar pages
- no API/schema inference from Figma labels
- no route-family ownership changes
