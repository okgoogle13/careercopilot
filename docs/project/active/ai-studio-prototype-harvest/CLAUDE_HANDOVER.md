# System Core: Project Manager Re-boot

> **@claude**: Invoke your `project-manager` skill and process this state-snapshot. Acknowledge receipt natively in your persona. Do not re-summarize this file; simply confirm readiness to execute Track A/B/C.

## 1. Project Context
We are conducting an "AI Studio Prototype Harvest." We used Google AI Studio as a staging environment to decompose and skin our complex UI before migrating it into the main `careercopilot` repo.

**Design System Enforcement:** KR Solidarity v6.0 (Strict). Dark mode only (`--sys-color-charcoalBackground-base`). Zero-Flora. No perfect circles (`border-radius: 50%` banned).

## 2. Harvest Progress Snapshot
The following prototype adjustments have been **COMPLETED and VERIFIED**:
- `ingestion_prompts.md` (PT-2): Harvest-ready snake_case alignment injected.
- `ATSScoreCard.tsx` (B1): Reskinned with KR Solidarity CSS tokens. Typings fixed.
- `AuditDisplay.tsx` (B2): Reskinned with KR Solidarity CSS tokens. 
- `ValidationDashboard.tsx` (PT-5): 1,200-line monolith successfully decomposed into 4 compliant sub-components (`DashboardContainer`, `CareerEntryList`, `KSCResponseList`, `AISuggestionPanel`). Barrel export created.
- Prototype Layout (PT-6): Global navigation and hero sections optimized for "Solidarity Mode" and architectural aesthetics.

## 3. Active Documentation (Source of Truth)
Read these files to understand your execution mandate:
1. `docs/project/active/ai-studio-prototype-harvest/AI_STUDIO_HARVEST_PLAN.updated.md` (Strategy & Tracking)
2. `docs/project/active/ai-studio-prototype-harvest/STRUCTURE_MAP.prototype.md` (Component Anatomy)

## 4. Next Immediate Action
Read the two documents linked above. Our immediate next step is the **physical harvest** of the decomposed prototype components from AI Studio into `frontend/src/features/analysis/components/`. 

I have the AI Studio code ready to paste. Ask me for the first component (`DashboardContainer`).
