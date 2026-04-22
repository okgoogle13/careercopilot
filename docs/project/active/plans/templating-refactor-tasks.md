# Task List: M1 — Schema & ATS Foundation Sync

## 0. M1.0 Contract Decisions
- [ ] Define renderer-facing `CareerProfile` as the canonical normalized contract for M1.
- [ ] Treat `MasterCareerProfile` as an ingestion source adapter, not as the direct renderer contract.
- [ ] Preserve `ai/prompts/backend/format_rules.json` as the ATS policy artifact loaded by `backend/app/core/ats_rules.py`; do not add `ats_rules.json` in M1.
- [ ] Lock ATS fallback behavior: always `single_column` and plain-safe regardless of selected visual theme.

## 1. Schema Adaptation (CareerProfile Adapters)
- [ ] Create `backend/app/utils/profile_adapter.py`.
- [ ] Implement `map_master_to_career_profile(profile: MasterCareerProfile) -> CareerProfile`.
- [ ] Implement adapters from `CareerDatabase` / existing `CareerProfile`, Genkit output payloads, and renderer dictionaries into the same `CareerProfile` contract.
- [ ] Map canonical profile sections to renderer keys:
    - [ ] `basics`
    - [ ] `summary`
    - [ ] `work` (Professional Experience)
    - [ ] `education`
    - [ ] `skills`
    - [ ] `certifications` (C&D)
- [ ] Map contact info explicitly (phone, email, linkedin).

## 2. ID Normalization Table
- [ ] Create `backend/app/core/doc_normalization.py`.
- [ ] Define `INPUT_TO_REGISTRY_MAP`:
    - `resume` -> `resume`
    - `cover_letter` -> `full_letter`
    - `ksc_response` -> `ksc_star`
- [ ] Implement `normalize_doc_id(id: str) -> str`.
- [ ] Implement deterministic default template IDs so empty `template_id` calls cannot reach `TemplateRepository.get(...)`.
- [ ] Update document pipeline and export service call sites to normalize before lookup.

## 3. ATS & Visual Mode Decoupling
- [ ] Update `backend/app/core/ats_rules.py`.
- [ ] Add `mode` parameter to validation functions: `validate_template_schema(template, doc_type, mode="ats_strict")`.
- [ ] Keep `FORMAT_RULES_PATH` pointed at `ai/prompts/backend/format_rules.json` unless this same task migrates every runtime reference and test fixture.
- [ ] Modify `column` and `sidebar` check:
    - If `mode == "ats_strict"`, multi-column/sidebar -> RAISE ERROR.
    - If `mode == "visual"`, multi-column/sidebar -> ALLOW (with warning log).
- [ ] Ensure ATS fallback path always forces `single_column`, even for `creative` and optional visual `modern` sidebar layouts.

## 4. Stability & Verification (M1 Closeout)
- [ ] Create `backend/app/tests/core/test_ats_rules_modes.py`.
- [ ] Test: `professional` theme (single) passes in both modes.
- [ ] Test: `creative` theme (sidebar) fails in `ats_strict`.
- [ ] Test: `creative` theme (sidebar) passes in `visual`.
- [ ] Test: `cover_letter` normalizes to `full_letter` and `ksc_response` normalizes to `ksc_star` before template lookup.
- [ ] Test: empty `template_id` calls use deterministic defaults.
- [ ] Ensure all profile adapters handle missing optional sections gracefully (no KeyError).
