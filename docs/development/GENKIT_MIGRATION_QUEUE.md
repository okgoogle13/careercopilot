# Genkit Migration Queue

**Last Updated:** 2026-01-19
**Scope:** Backend AI logic still outside `backend/app/genkit_flows`.

## Findings

- No `backend/app/ai_operations` directory exists in the current repo.
- Legacy AI logic still lives in `backend/app/core` and `backend/app/services`.
- `ats_score_worker.py` already uses a bridge (`app.bridges.legacy_wrapper.ats_scorer`).

## Queue (Highest Priority First)

### P0: Legacy AI Core
1) `backend/app/core/ai/llm_service.py`
   - **Issue:** dict-based I/O; placeholder response
   - **Target:** Genkit flow in `backend/app/genkit_flows/`
   - **Required:** Pydantic input/output models
2) `backend/app/core/ai_client.py`
   - **Issue:** generic AI client with non-Genkit abstractions
   - **Target:** Flow-based interfaces; deprecate direct client calls
3) `backend/app/core/ai_flow_integration.py`
   - **Issue:** legacy glue logic
   - **Target:** Genkit flow orchestration

### P1: Services Using Legacy AI
1) `backend/app/services/ai_prompt_builder.py`
   - **Issue:** uses `get_ai_client()` and manual prompt building
   - **Target:** dedicated Genkit flow; Pydantic schemas
2) `backend/app/services/jobs_service.py`
   - **Note:** already calling Genkit flows (`job_analyzer`, `resume_analyzer`)
   - **Action:** verify schema consistency and tracing

## Existing Genkit Flows (Reference)

- `backend/app/genkit_flows/ats_scoring.py`
- `backend/app/genkit_flows/job_analyzer.py`
- `backend/app/genkit_flows/job_listing_extractor.py`
- `backend/app/genkit_flows/resume_analyzer.py`
- `backend/app/genkit_flows/ksc_generator.py`
- `backend/app/genkit_flows/smart_ingestion.py`
- `backend/app/genkit_flows/smart_content_optimizer.py`
- `backend/app/genkit_flows/smart_cover_letter_system.py`
- `backend/app/genkit_flows/cover_letter_generator.py`
- `backend/app/genkit_flows/advanced_job_matching.py`
- `backend/app/genkit_flows/extract_job_requirements.py`
- `backend/app/genkit_flows/extract_resume_entities.py`
- `backend/app/genkit_flows/resume_intelligence_pipeline.py`
- `backend/app/genkit_flows/application_preparation_workflow.py`
- `backend/app/genkit_flows/career_application_workflow.py`
- `backend/app/genkit_flows/calendar_manager.py`
- `backend/app/genkit_flows/document_generator.py`
- `backend/app/genkit_flows/email_scanner.py`
- `backend/app/genkit_flows/email_task_workflow.py`
- `backend/app/genkit_flows/notifier.py`
- `backend/app/genkit_flows/keyword_placer.py`

## Required Next Steps

1) Define Pydantic models in `backend/app/schemas/` for each legacy entry above.
2) Implement Genkit flows with tracing spans.
3) Add bridges in `backend/app/bridges/` if any workers use legacy paths.
4) Remove or deprecate legacy modules after bridge cutover.
