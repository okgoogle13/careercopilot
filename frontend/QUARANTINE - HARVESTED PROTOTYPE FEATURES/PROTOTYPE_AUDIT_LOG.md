# Prototype Integration Audit Log

**Target Repository:** `prototype_v2.0`
**Location:** `/Users/okgoogle13/Projects/prototype_v2.0/src/`
**Classification Framework:** Triangular Triage System (`[HARVEST]`, `[IGNORE]`, `[REQUIRES REVIEW]`)

This document serves as the permanent architectural tracker for the `prototype_v2.0` repository audit, ensuring that all subsequent extraction tasks are deterministically gated.

`[HARVEST]` in this log means behavior or pattern harvest only after canonical
owner binding. It does not authorize direct promotion of raw prototype files
into runtime truth.

## 🟩 [HARVEST] - High-Value Patterns for Canonical Integration

Files that contain valuable business logic, feature components, or established workflows that align with the canonical roadmap. These must pass KR Solidarity v6.1 compliance checks before full integration.

**Features & Views:**
- `src/components/feature/AiOutputsTabs.tsx` [Owner: `/analysis`] [Mode: Transcribe logic only] [Gate: TSX Identity]
- `src/components/feature/KanbanTracker.tsx` [Owner: `/tracker`] [Mode: Behavior reference] [Gate: TSX Identity]
- `src/components/feature/SaveApplicationBar.tsx` [Owner: `/apply/quick`] [Mode: Behavior reference] [Gate: TSX Identity]

**State, Hooks, & Logic:**
- `src/hooks/useAiOutputs.ts` [Owner: `/analysis`] [Mode: Transcribe logic only] [Gate: Data Seams Review]

*(Note: `SettingsView.tsx`, `M3ExpressiveComponents.tsx`, `PageHeader.tsx`, `LibraryReferencePage.tsx`, and `ImageStudioPage.tsx` were already harvested in Phase 1).*

---

## 🟨 [REQUIRES REVIEW] - Ambiguous or Complex Logic

Files that encompass complex architectural boundaries, routing logic, or potential overlaps with existing canonical components. These require human or specialized AI agent validation (via `design-orchestration`) before deciding on harvest or discard.

- `src/components/layout/AppNavDrawer.tsx` (Canonical navigation authority check required)
- `src/components/layout/AppShell.tsx` (Likely clashes with canonical shell routes)
- `src/components/layout/LayeredHero.tsx` (Compare against existing canonical `<LayeredHero />`)
- `src/components/layout/SolidarityPageLayout.tsx`
- `src/components/layout/WorkspaceLayout.tsx`
- `src/components/feature/DashboardOverview.tsx` (Prototype store dependency and reference-only dashboard composition; check against canonical `/dashboard` owner)
- `src/components/feature/GettingStartedChecklist.tsx` (Contains extension-first onboarding and integration cues; clear blocker plan first)
- `src/components/feature/JobInputPanel.tsx` (Contains extension CTA, external texture URL, legacy UI primitives, and hook coupling)
- `src/pages/OnboardingPathBifurcation.tsx`
- `src/pages/ProfileView.tsx` (VoiceProfileSection already extracted, check remaining logic)
- `src/pages/ApplyQuickWorkspaceReference.tsx` (Crosses layout, store, and prototype-shell seams)
- `src/pages/JobsWorklist.tsx` (Unresolved split between `/opportunities` and `/job-queue`; includes calendar-service assumptions)
- `src/pages/PastApplicationsReference.tsx` (Crosses layout-shell and archive/tracker-detail seams)
- `src/pages/QuickApply.tsx` (Uses prototype store and mock-data workflow; overlaps canonical `/apply/quick` owner)
- `src/hooks/useApplyWorkspace.ts` (Imports Firebase Auth directly and relies on prototype mock-profile fallback)
- `src/hooks/useJobInput.ts` (Depends on Chrome extension)
- `src/genkit/jobParser.ts` (Conflicts with runtime-configured backend model policy)
- `src/genkit/matchAnalysis.ts` (Conflicts with backend Genkit wiring)
- `src/components/ui/AuditDial.tsx`
- `src/components/ui/MetricCard.tsx`

---

## 🟥 [IGNORE] - Obsolete, Non-Compliant, or Replaced

Boilerplate code, legacy Material Design primitives, generic hooks, and mock data that are entirely superseded by the current canonical KR Solidarity v6.1 design system and backend architecture. These will NOT be migrated.

**Non-Compliant UI Primitives & Retired Routes:**
- `src/pages/LandingPage.tsx` (Retired; canonical landing owned by `App.tsx`)
- `src/components/ui/AutocompleteInput.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Checkbox.tsx`
- `src/components/ui/Loader.tsx`
- `src/components/ui/M3Button.tsx`
- `src/components/ui/M3Card.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/PrimaryButton.tsx`
- `src/components/ui/Primitives.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/ui/StatusSpecificLoadingState.tsx`
- `src/components/ui/TextInput.tsx`
- `src/components/ui/Textarea.tsx`

**Utilities, Mocks, & Configs:**
- `src/hooks/useChromeExtension.ts`
- `src/hooks/useUserStore.ts`
- `src/lib/utils.ts`
- `src/pages/StyleGuide.tsx`
- `src/services/calendarService.ts`
- `src/theme/typography.ts`
- `src/utils/mockData.ts`
- `src/utils/skills.ts`
- `src/background.ts`
- `src/content.ts`
- `src/.DS_Store`
- `src/components/.DS_Store`
