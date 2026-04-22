# Templating Architecture Refactoring Plan

This plan aims to execute the "CareerCopilot Templating Architecture (1).md" doc, bringing its schema-first, block-oriented architecture to life. It consolidates the fragmented PDF renderers, hardcoded Jinja strings, and Genkit generation flows into a single unified `DocumentPipeline` backed by explicitly configured JSON/YAML templates and tokens.

> [!IMPORTANT]
> **Codex Phase 1 Review Integrated**
> This version reflects the feedback from the initial structural audit (M1 readiness): defining `CareerProfile` as the canonical renderer contract, requiring explicit adapters from existing profile schemas, separating `visual_profile` from `ats_profile`, and clarifying the Genkit vs. Prompt separation.

## Milestones

### M1 — Schema & ATS Foundation Sync (Batch 1)
**Readiness gate**: Canonical Schema & ID alignment.
**Items**: System-wide Schema Alignment and `format_rules.json` / `ats_rules.py` decoupling.

#### M1.0 Contract Decisions
- **Canonical Renderer Contract**: Adopt **`CareerProfile`** as the single renderer-facing source of truth for document generation. It is a normalized contract, not a direct alias for any current runtime model.
- **Required Adapters**: Implement explicit adapters into `CareerProfile` for the incompatible existing sources: `MasterCareerProfile`, `CareerDatabase` / existing `CareerProfile`, Genkit flow outputs, and renderer-specific dictionaries. No flow or renderer should bypass this adapter layer once M1 is complete.
- **ATS Rules Source of Truth**: Preserve the current runtime artifact path, `ai/prompts/backend/format_rules.json`, loaded through `backend/app/core/ats_rules.py`. Do not introduce `ats_rules.json` in M1 unless the same task migrates every runtime reference and test fixture.
- **Doc Type Canonicalization**: Normalize external/API names to template-registry names before template lookup or ATS validation: `resume` -> `resume`, `cover_letter` -> `full_letter`, and `ksc_response` -> `ksc_star`.
- **ATS Fallback Policy**: ATS fallback is always single-column/plain-safe regardless of visual theme. Visual themes may use richer layout only outside ATS-strict output paths.

- **Canonical Schema**: Define **`CareerProfile`** as the normalized renderer contract, with `MasterCareerProfile` (from `backend/app/models/master_profile_schema.py`) treated as the gold-standard ingestion adapter source rather than the renderer contract itself.
- **Doc Type Alignment & Normalization**: Implement a normalization table to map API inputs to Registry IDs:
  - `resume` -> `resume`
  - `cover_letter` -> `full_letter`
  - `ksc_response` -> `ksc_star`
  - All callers share a central lookup to prevent registry-specific ID leak.
- **Template Lookup Stabilization**: Update `DocumentPipeline`, `TemplateRepository`, and `document_export_service.py` call sites so `cover_letter` / `ksc_response` and empty `template_id` values cannot produce unstable registry lookups.
- **ATS Logic Decoupling**: Keep enforcement in `backend/app/core/ats_rules.py`, backed by `ai/prompts/backend/format_rules.json`, and add explicit mode handling for `ats_strict` vs `visual` validation.
- **Adapter Layer**: Implement contract adapters to map `MasterCareerProfile`, `CareerDatabase` / existing `CareerProfile`, Genkit output payloads, and renderer dictionaries into canonical sections (`basics`, `summary`, `work`, `education`, `skills`, `certifications`).

### M2 — Template Extraction & Renderer Decoupling (Batch 2)
**Readiness gate**: M1 complete.
**Items**: Externalize `ThemedDocumentRenderer` layout strings and normalize theme selection.
- Extract monolithic Jinja html/css structures in `themed_document_renderer.py` into `backend/app/templates/` folders.
- Update `DOCX`/HTML render hooks to accept the tuple `(document, template, theme)`.
- **Theme Mapping**:
  - **`professional`**: Layout `single_column`; headings/name `Libre Bodoni`; body `Work Sans`; token IDs: body `--kr-color-charcoal-background-steps-0`, header `--kr-color-asphalt-black-base`, name `--kr-color-charcoal-background-base`, accent `--kr-color-concrete-grey-steps-1`, divider `--kr-color-concrete-grey-steps-3`, bg `--kr-color-paper-white-base`.
  - **`modern`**: Layout `single_column` by default; optional `two_column_sidebar` only for non-ATS visual export; headings/name `Fraunces`; body `Work Sans`; token IDs: body `--kr-color-charcoal-background-steps-1`, header `--kr-color-protest-metal-blue-steps-1`, name `--kr-color-protest-metal-blue-base`, accent `--kr-color-signal-green-steps-1`, divider `--kr-color-concrete-grey-steps-3`, bg `--kr-color-paper-white-steps-3`.
  - **`creative`**: Visual export may use `two_column_sidebar`; ATS export is forced to `single_column`; headings `Fraunces`; name `Libre Bodoni`; body `Work Sans`; token IDs: body `--kr-color-charcoal-background-steps-1`, header `--kr-color-solidarity-red-steps-1`, name `--kr-color-solidarity-red-base`, accent `--kr-color-ink-gold-base`, divider `--kr-color-solidarity-smoke-orange-steps-4`, bg `--kr-color-paper-white-base`.
  - Theme config stores token IDs only. Renderers resolve token IDs to concrete values at render time; do not hardcode hex values in theme files.

### M3 — Block Prompts Migration (Batch 3)
**Readiness gate**: M2 complete.
**Items**: Decouple `TemplateService.py` and modularize prompt text.
- **Note**: Genkit flows remain typed Python functions; only the prompt text and block definitions move into `backend/app/prompts/prompt_templates.json`.
- Implement the "block-oriented" prompt builder to swap prompt blocks based on the active schema segment.

### M4 — Generation Pipeline Unification (Batch 4)
**Readiness gate**: M3 complete.
**Items**: `DocumentPipeline` normalization.
- Refactor existing `DocumentPipeline` (in `backend/app/core/document_pipeline.py:22`) from a partial renderer wrapper into the full schema-driven generator.
- Integrate the `document_export_service.py` to stop passing empty `template_id` and instead use the unified registry.

## ATS Fallback Rule
Regardless of the selected visual theme, the **ATS Fallback export** always forces:
- Single column layout (no sidebars).
- Zero images, tables, or text boxes.
- Standard heading order.
- Standard ATS-safe fonts. Theme typography and accent colors are applied only after ATS structural constraints are satisfied; no Comic Sans/cursive fallback is allowed in ATS output.

## Verification Plan

### Automated Tests
- Validate that `MasterCareerProfile` instances are correctly adapted for each renderer block.
- Validate that `CareerDatabase` / existing `CareerProfile`, Genkit output payloads, and renderer dictionaries adapt into the same `CareerProfile` contract.
- Ensure `ats_rules.py` with `format_rules.json` flags sidebar templates *only* when in ATS-strict mode.
- Ensure `cover_letter` and `ksc_response` normalize before template lookup, and empty `template_id` calls receive deterministic defaults.

### Manual Verification
- Verify high-fidelity exports for `creative` (sidebar) vs. `professional` (single column) using the same input profile.
