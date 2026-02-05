# CODEBASE_PURGE_AUDIT

## Scope & Constraints
- Audit focus: redundant code, orphaned files, migration remnants, dead dependencies, and unreachable logic after Firebase/GCP -> Supabase migration.
- Exclusions honored: `frontend/src/assets/specimens` not scanned; `backend/app/models/**` excluded to protect BaseMixin and Supabase-aligned SQLAlchemy models.
- Note: flash-sidekick MCP was unavailable in this session; analysis used local ripgrep + heuristic import graphing.

## Orphaned Components (frontend/src/components)
Potentially unused in main application flow (no import references outside tests/stories based on static import scan).

| Path | Redundancy Type | Impact | Rationale |
| --- | --- | --- | --- |
| `frontend/src/components/TestCard/TestCard.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/atomic/tabs/Tabs.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/core/Leaf.figma.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/figma/ImageWithFallback.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/index.ts` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/northcote/tabs/NorthcoteTabs.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/shared/CodePreview.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/shared/JobCard 2.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/shared/PlasmaBackground.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/shared/SplitHeader.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/shared/TechCard.figma.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/shared/index.ts` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/HaeckelIcon.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/M3Alert.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/M3Card.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/M3Checkbox.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/M3Select.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/M3TextField.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/Pebble.figma 2.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/Pebble.figma.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/StatusBadge/StatusBadge.test.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/Stone.figma 2.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/Stone.figma.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/chart.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/collapsible.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/form/test-imports.ts` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/icon-badge.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/metric-card.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/table.tsx` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |
| `frontend/src/components/ui/use-mobile.ts` | Orphaned Component | Low | No import references detected in non-test application code; candidate for removal or consolidation. |

## Orphaned Files (backend/app)
Potentially unused in main application flow (not reachable from `backend/app/main.py` import graph).

| Path | Redundancy Type | Impact | Rationale |
| --- | --- | --- | --- |
| `backend/app/__init__.py` | Orphaned Backend Module | Low | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/agents/__init__.py` | Orphaned Backend Module | Low | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/agents/ghostwriter.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/agents/orchestrator.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/agents/test_automation_specialist.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/__init__.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/endpoints/auth.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/endpoints/document_export.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/endpoints/job_listings.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/ingest 2.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/ingest.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/routers/ingestion.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/routes/career.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/api/routes/ingestion.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/bridges/__init__.py` | Orphaned Backend Module | Low | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/bridges/career_bridge.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/bridges/legacy_wrapper.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/config/production.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/__init__.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/ai/__init__.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/ai/llm_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/ai_client.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/ai_config.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/ai_error_handling.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/ai_flow_integration.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/ai_response_validation.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/base_agent.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/cache_decorators.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/cached_ai_operations.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/cloud_storage.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/config.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/document_export_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/document_processing.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/enhanced_ai_error_handling.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/file_upload_decorators.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/genkit.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/input_validation.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/limiter.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/logging_config.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/monitoring_middleware.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/nlp_model_manager.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/prompts/__init__.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/prompts/ci_auditor.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/prompts/schemas.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/security.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/core/supabase.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/examples/validation_demo.py` | Orphaned Backend Module | Low | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/flows/career_ingest.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/flows/ingestion_flow.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/__init__.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/advanced_job_matching.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/application_preparation_workflow.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/application_strategy_workflow.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/ats_scoring.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/career_application_workflow.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/career_intelligence.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/company_analyzer.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/corporate_intelligence.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/cover_letter_generator.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/document_generator.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/email_scanner.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/email_task_workflow.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/extract_job_requirements.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/extract_resume_entities.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/gap_hunter.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/job_analyzer.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/keyword_placer.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/llm_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/notifier.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/resume_analyzer.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/resume_intelligence_pipeline.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/shared.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/shared_fixed.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/smart_content_optimizer.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/smart_ingestion.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/genkit_flows/types.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/ml/__init__.py` | Orphaned Backend Module | Low | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/monitoring/nlp_metrics.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/monitoring/nlp_metrics_service.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/monitoring/nlp_monitor.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/schemas/ai.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/schemas/career.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/schemas/career_master.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/schemas/legacy_migration.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/schemas/resume.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/__init__.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/ai_prompt_builder.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/email_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/google_workspace.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/job_store.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/jobs_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/search_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/template_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/user_profile_service.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/services/web_search.py` | Orphaned Backend Module | High | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/templates/__init__.py` | Orphaned Backend Module | Low | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/utils/pdf_parser.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/utils/resume_parser.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/workers/__init__.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/workers/ats_score_worker.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/workers/scan_emails_worker.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/workflows/__init__.py` | Orphaned Backend Module | Low | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |
| `backend/app/workflows/personal_career_workflow.py` | Orphaned Backend Module | Medium | Not reachable from main FastAPI entrypoint import graph; candidate for removal or re-wiring. |

## Duplicate / Versioned Files

| Path | Redundancy Type | Impact | Rationale |
| --- | --- | --- | --- |
| `.claude-plugin/validate-manifest 2.js` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `.claude/settings.local.json.backup` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `.claude/settings.local.json.bak` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `backend/app/genkit_flows/job_listing_extractor.py.backup` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `backend/app/genkit_flows/job_listing_extractor.py.bak` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/__tests__/integration/DocumentWorkflow.test 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/__tests__/integration/DocumentWorkflow.test 3.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/components/shared/JobCard 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/components/ui/Pebble.figma 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/components/ui/Stone.figma 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/config/firebase 2.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/config/firebase 3.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/features/documents/components/ResumeBuilder 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/legacy/ui/button 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/legacy/ui/button.figma 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/legacy/ui/form 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/legacy/ui/table 2.tsx` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/lib/utils.test 2.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/src/lib/utils.test 3.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/tailwind.config 2.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/tailwind.config 3.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/tailwind.config 4.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `frontend/tailwind.config 5.ts` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |
| `functions/lib/src/mcp_server 2.js` | Duplicate/Versioned File | Low | Versioned/backup duplicate; likely leftover from manual copy or merge. |

## Migration Remnants (Firebase / GCP)
Active logic still importing Firebase Admin or GCP Secret Manager / Storage.

| Path | Redundancy Type | Impact | Rationale |
| --- | --- | --- | --- |
| `functions/src/index.ts` | Migration Remnant | High | Imports firebase-admin and firebase-functions; uses Firestore task queue and auth. |
| `functions/src/api/applications.controller.ts` | Migration Remnant | High | Uses firebase-admin Firestore and Firebase auth middleware. |
| `functions/src/auth.functions.ts` | Migration Remnant | High | Firebase Functions auth + admin usage. |
| `functions/src/firebase.ts` | Migration Remnant | High | Initializes firebase-admin and exports Firestore/Auth/Storage. |
| `functions/src/middleware/auth.middleware.ts` | Migration Remnant | High | Verifies Firebase ID tokens via firebase-admin. |
| `functions/src/services/job_listing_extractor.ts` | Migration Remnant | High | Imports firebase-admin and Firebase vector search. |
| `functions/src/types/job_listing.ts` | Migration Remnant | Medium | Type definitions reference firebase-admin FieldValue/Timestamp. |
| `functions/src/utils/secretManager.ts` | Migration Remnant | Medium | Uses @google-cloud/secret-manager client. |
| `backend/app/core/security.py` | Migration Remnant | High | Imports firebase_admin for token verification (Firebase auth). |
| `backend/app/core/secrets.py` | Migration Remnant | Medium | Uses google.cloud.secretmanager client for secrets retrieval. |
| `backend/requirements.in` | Legacy Dependency | Medium | Still lists google-cloud-storage and google-cloud-secret-manager. |

## Dead Imports (Dependencies Not Referenced in Source)
These packages are declared but no import/use was found in application source (comments excluded). Some may be CLI-only; verify before removal.

### Backend (backend/pyproject.toml)
| Package | Redundancy Type | Impact | Rationale |
| --- | --- | --- | --- |
| `alembic` | Dead Dependency | Medium | No imports detected; only needed for CLI migrations if still used. |
| `anthropic` | Dead Dependency | Medium | No imports detected; AI client uses raw HTTP, not SDK. |
| `celery` | Dead Dependency | Medium | No imports detected (only mentioned in README). |
| `email-validator` | Dead Dependency | Low | No imports detected (email_validator). |
| `genkit-plugin-google-genai` | Dead Dependency (verify) | Medium | No direct imports detected; may be indirectly used via genkit.plugins.google_genai. |
| `jinja2` | Dead Dependency | Low | No imports detected. |
| `numpy` | Dead Dependency | Low | No imports detected. |
| `pandas` | Dead Dependency | Low | No imports detected. |
| `passlib[bcrypt]` | Dead Dependency | Medium | No imports detected; password hashing may be unused. |
| `pdfplumber` | Dead Dependency | Low | No imports detected. |
| `psycopg2-binary` | Dead Dependency | Medium | No direct imports; SQLAlchemy may still use driver implicitly. |
| `pypdfium2` | Dead Dependency | Low | No imports detected. |
| `python-multipart` | Dead Dependency | Low | No direct imports; FastAPI might require it implicitly for file uploads. |
| `scikit-learn` | Dead Dependency | Low | No imports detected. |
| `uvicorn[standard]` | Dead Dependency | Low | No imports detected; typically used via CLI. |

### Frontend (frontend/package.json)
| Package | Redundancy Type | Impact | Rationale |
| --- | --- | --- | --- |
| `@radix-ui/react-dialog` | Dead Dependency | Low | No imports detected in frontend source. |
| `@types/react-router-dom` | Dead Dependency | Low | No imports detected; React Router v6 ships types. |
| `date-fns` | Dead Dependency | Low | No imports detected. |
| `react-dropzone` | Dead Dependency | Low | No imports detected; DropZone component appears custom. |
| `react-is` | Dead Dependency | Low | No imports detected. |
| `react-resizable-panels` | Dead Dependency | Low | No imports detected. |

### Functions (functions/package.json)
| Package | Redundancy Type | Impact | Rationale |
| --- | --- | --- | --- |
| `@genkit-ai/firebase` | Dead Dependency | Medium | Only referenced in comments; no active imports. |
| `@google-cloud/firestore` | Dead Dependency | Medium | No imports detected; firebase-admin is used instead. |
| `@google-cloud/storage` | Dead Dependency | Medium | No imports detected; storage operations appear via firebase-admin. |
| `@types/pdfkit` | Dead Dependency | Low | Types package in runtime deps; no direct imports. |

## Unreachable Logic
No explicit unreachable branches (e.g., `if False`, post-`return` statements) were detected via lightweight grep heuristics. Consider a stricter static-analysis pass (ruff/pyright/tsc) if deeper control-flow validation is required.
