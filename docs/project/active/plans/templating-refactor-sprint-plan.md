# Sprint Plan: Templating Architecture Refactor

**Phase**: P10 Architecture Stabilization
**Status**: DRAFT (Proposed for Execution)
**Targets**: Unified Document Generation Pipeline (Schema-First)

---

## Milestones

### M1 — Schema & ATS Foundation (Current)
**Readiness gate**: `CareerProfile` contract parity across all current schema sources.
**Scope**:
- **M1.0 Contract Decisions**: Lock `CareerProfile` as the renderer-facing contract; require adapters from `MasterCareerProfile`, `CareerDatabase` / existing `CareerProfile`, Genkit outputs, and renderer dictionaries.
- **ATS Rules Source**: Keep `ai/prompts/backend/format_rules.json` as the canonical rules artifact loaded by `backend/app/core/ats_rules.py`; do not introduce `ats_rules.json` during M1.
- **CareerProfile Adapters**: Map each existing schema source to renderer-safe segments (basics, summary, work, education, skills, certifications).
- **ID Normalization**: API Input (`resume`, `cover_letter`, `ksc_response`) -> Registry (`resume`, `full_letter`, `ksc_star`).
- **Template Lookup Stabilization**: Normalize `doc_type` and replace empty `template_id` calls before `TemplateRepository.get(...)`.
- **ATS Strict vs Visual Mode**: Decouple layout rules in `ats_rules.py` while preserving `format_rules.json` as the loaded policy.
- **ATS Fallback Policy**: Always force single-column/plain-safe output for ATS fallback, independent of `professional`, `modern`, or `creative` visual theme.
- **Validation Tests**: Unit tests confirming sidebar rejection in `ats_strict` and acceptance in `visual`.
- **Blocked By**: None.

### M2 — Template Extraction (Batch 2)
**Readiness gate**: M1 complete.
**Items**: Migration of `ThemedDocumentRenderer` to `backend/app/templates/`.
- User consultation on design tokens for `professional`, `modern`, and `creative`.
- Decoupling style from structure via new rendering DSL hooks.
- Theme configs must store token IDs and typography choices only; render-time code resolves tokens to concrete values. `creative` and optional `modern` sidebars are visual-export only and never used for ATS fallback.
- **Parallelisable**: Yes, per theme.

### M3 — Block Prompts Migration (Batch 3)
**Readiness gate**: M2 complete.
**Items**: Externalization of prompt text to `prompt_templates.json`.
- Refactor `TemplateService.py` to use modular prompt building.
- Preservation of Genkit flows as typed Python logic.

### M4 — Generation Pipeline Unification (Batch 4)
**Readiness gate**: M3 complete.
**Items**: Core `DocumentPipeline` refactor.
- Centralize all flows into a single schema-driven generator.
- Integrate `document_export_service.py` with the unified template registry.

---

## Evidence Requirements (M1)

| Task | Required Artifact |
|-------|------------------|
| Adapter Implementation | `app/utils/profile_adapter.py` |
| ID Normalization | `app/core/doc_normalization.py` |
| Template Lookup Stabilization | `app/core/document_pipeline.py`, `app/core/templates_repo.py`, `app/core/document_export_service.py` |
| ATS Logic Update | `app/core/ats_rules.py` (multi-mode check backed by `ai/prompts/backend/format_rules.json`) |
| Verification | `tests/core/test_ats_rules_modes.py` |
