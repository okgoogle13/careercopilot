#!/bin/bash

# Jules M3 Expressive Migration Launcher (JADS v1.0 Format)
# 7 parallel batches covering 71 components

echo "🚀 Launching Jules M3 Expressive Migration Sessions..."
echo "Format: JADS v1.0 (Jules Autonomous Delegation Standard)"
echo ""

# Jules Batch A: Documents (7 components)
echo "📄 Launching Batch A: Documents (7 components)..."
jules remote new --repo /Applications/careercopilot --session "JADS_TASK: M3_MIG_A migrating 7 document management components (DocumentPreview, DocumentTypeSelector, ResumeBuilder, UploadResume, TemplateSelector, IngestionPipeline, SmartUploadModal) from MUI v5 to M3 Expressive with 150+ tokens (78 colors, 7 shapes, 6 elevation, 13 typography, 12 spacing, 16 motion) : Migrate each component using 4-step protocol: (1) m3-layout-tokens - replace padding/margin/gap with var(--sys-space-*) using 12-stop scale, transform theme.spacing(N) calls, (2) m3-visual-tokens - replace colors with var(--sys-color-*) 78 tokens, border-radius with var(--sys-shape-corner-*) 7 scales, box-shadow with var(--sys-elevation-level-*) 6 levels, (3) m3-typography-tokens - replace font-size/weight/line-height with var(--sys-type-*) 13 scales, apply editorial conventions, (4) m3-interaction-tokens - replace icon sizes (20px/24px/40px), transitions with var(--sys-motion-*) 16 durations 10 easings, add prefers-reduced-motion : Target files: frontend/src/components/Documents/DocumentPreview.tsx, frontend/src/components/Documents/DocumentTypeSelector.tsx, frontend/src/components/Documents/ResumeBuilder.tsx, frontend/src/components/Documents/UploadResume.tsx, frontend/src/components/Documents/TemplateSelector.tsx, frontend/src/components/ingestion/IngestionPipeline.tsx, frontend/src/components/SmartUploadModal.tsx. Validation: TypeScript compilation (yarn tsc --noEmit), no hardcoded color/spacing/size values, all var(--sys-*) tokens, component functionality unchanged, WCAG AA contrast. Reference: design-system/tokens-expressive.json, .claude/skills/frontend-migration/m3-*-tokens.md, M3Button/M3Card examples : Generate ./.ai_reports/documents_batch_m3_migration.md with total replacements per component (layout/color/typography/motion breakdown), validation results (TypeScript/token-usage/hardcoded-values/WCAG), warnings, before/after examples"

sleep 0.5

# Jules Batch B: Profiles (7 components)
echo "👤 Launching Batch B: Profiles (7 components)..."
jules remote new --repo /Applications/careercopilot --session "JADS_TASK: M3_MIG_B migrating 7 profile management components (ProfileCard, CreateProfileCard, ProfileEditor, ProfileComparison, ImportWizard, ProfilesPage, ui/ProfileCard duplicate) from MUI v5 to M3 Expressive with 150+ tokens : Migrate each component using 4-step protocol: (1) m3-layout-tokens - replace padding/margin/gap with var(--sys-space-*) using 12-stop scale, transform theme.spacing(N) calls, (2) m3-visual-tokens - replace colors with var(--sys-color-*) 78 tokens, border-radius with var(--sys-shape-corner-*) 7 scales, box-shadow with var(--sys-elevation-level-*) 6 levels, (3) m3-typography-tokens - replace font-size/weight/line-height with var(--sys-type-*) 13 scales, apply editorial conventions, (4) m3-interaction-tokens - replace icon sizes (20px/24px/40px), transitions with var(--sys-motion-*) 16 durations 10 easings, add prefers-reduced-motion : Target files: frontend/src/components/profile/ProfileCard.tsx, frontend/src/components/profile/CreateProfileCard.tsx, frontend/src/components/profile/ProfileEditor.tsx, frontend/src/components/profile/ProfileComparison.tsx, frontend/src/components/profile/ImportWizard.tsx, frontend/src/components/profiles/ProfilesPage.tsx, frontend/src/components/ui/ProfileCard.tsx. Consolidate duplicate ProfileCard if identical. Validation: TypeScript compilation, no hardcoded values, all var(--sys-*) tokens, unchanged functionality, WCAG AA. Reference: design-system/tokens-expressive.json, .claude/skills/frontend-migration/m3-*-tokens.md : Generate ./.ai_reports/profiles_batch_m3_migration.md with replacements per component (breakdown), validation results, warnings, before/after examples"

sleep 0.5

# Jules Batch C: Jobs/Career (10 components)
echo "💼 Launching Batch C: Jobs/Career (10 components)..."
jules remote new --repo /Applications/careercopilot --session "JADS_TASK: M3_MIG_C migrating 10 job/career feature components (JobCard, JobInput, JobMatching, JobSearch, JobsList, ApplicationCard, ApplicationTracker, CareerIntelligence, CareerGrowthHub, InterviewPrep) from MUI v5 to M3 Expressive with 150+ tokens : Migrate each component using 4-step protocol: (1) m3-layout-tokens - replace padding/margin/gap with var(--sys-space-*) 12-stop scale, (2) m3-visual-tokens - replace colors var(--sys-color-*) 78 tokens, shapes var(--sys-shape-corner-*) 7 scales, elevation var(--sys-elevation-level-*) 6 levels, (3) m3-typography-tokens - replace font properties var(--sys-type-*) 13 scales + editorial, (4) m3-interaction-tokens - icon sizes 20/24/40px, motion var(--sys-motion-*) 16 durations 10 easings, prefers-reduced-motion : Target files: frontend/src/components/features/JobCard/JobCard.tsx, frontend/src/components/features/JobInput/JobInput.tsx, frontend/src/components/features/JobMatching/JobMatching.tsx, frontend/src/components/JobSearch/JobSearch.tsx, frontend/src/components/jobs/JobsList.tsx, frontend/src/components/ApplicationCard/ApplicationCard.tsx, frontend/src/components/ApplicationTracker/ApplicationTracker.tsx, frontend/src/components/features/CareerIntelligence/CareerIntelligence.tsx, frontend/src/components/features/CareerGrowthHub/CareerGrowthHub.tsx, frontend/src/components/career/InterviewPrep.tsx. Validation: TypeScript, no hardcoded values, var(--sys-*) tokens, unchanged logic, WCAG AA. Reference: design-system/tokens-expressive.json : Generate ./.ai_reports/jobs_career_batch_m3_migration.md with replacements breakdown, validations, warnings, examples"

sleep 0.5

# Jules Batch D: Dashboard (6 components)
echo "📊 Launching Batch D: Dashboard (6 components)..."
jules remote new --repo /Applications/careercopilot --session "JADS_TASK: M3_MIG_D migrating 6 dashboard components (Dashboard, Settings, DashboardHeader, DashboardStats, ProfileGrid, DashboardPage) from MUI v5 to M3 Expressive with 150+ tokens : Migrate each component using 4-step protocol: (1) m3-layout-tokens spacing var(--sys-space-*), (2) m3-visual-tokens colors/shapes/elevation var(--sys-color-*|shape-corner-*|elevation-level-*), (3) m3-typography-tokens type scales var(--sys-type-*), (4) m3-interaction-tokens icons/motion var(--sys-motion-*) : Target files: frontend/src/components/features/dashboard/Dashboard.tsx, frontend/src/components/features/dashboard/Settings.tsx, frontend/src/components/features/dashboard/dashboard/DashboardHeader.tsx, frontend/src/components/features/dashboard/dashboard/DashboardStats.tsx, frontend/src/components/features/dashboard/dashboard/ProfileGrid.tsx, frontend/src/components/dashboard/DashboardPage.tsx. Validation: TypeScript compilation, token-only values, WCAG AA. Reference: design-system/tokens-expressive.json : Generate ./.ai_reports/dashboard_batch_m3_migration.md with replacements, validations, warnings, examples"

sleep 0.5

# Jules Batch E: Analysis (8 components)
echo "📈 Launching Batch E: Analysis/Visualization (8 components)..."
jules remote new --repo /Applications/careercopilot --session "JADS_TASK: M3_MIG_E migrating 8 analysis/visualization components (ATSAnalysisDashboard, ATSScoreCircle, ATSScoreCircle duplicate, StatCard, TimelineView, TimelineView duplicate, FilterPanel, AnalysisPage) from MUI v5 to M3 Expressive : Migrate using 4-step protocol (layout→visual→typography→interaction) per component : Target files: frontend/src/components/features/ATSAnalysisDashboard/ATSAnalysisDashboard.tsx, frontend/src/components/library/ATSScoreCircle.tsx, frontend/src/components/ui/ATSScoreCircle.tsx, frontend/src/components/StatCard/StatCard.tsx, frontend/src/components/TimelineView/TimelineView.tsx, frontend/src/components/career/TimelineView/TimelineView.tsx, frontend/src/components/features/FilterPanel/FilterPanel.tsx, frontend/src/components/features/Analysis/AnalysisPage.tsx. Validation: TypeScript, token usage, WCAG. Reference: design-system/tokens-expressive.json : Generate ./.ai_reports/analysis_batch_m3_migration.md"

sleep 0.5

# Jules Batch F: Loading/Error (7 components)
echo "⏳ Launching Batch F: Loading/Error States (7 components)..."
jules remote new --repo /Applications/careercopilot --session "JADS_TASK: M3_MIG_F migrating 7 loading/error state components (LoadingState, LoadingSpinners, LoadingSkeleton, LoadingSpinner, FullPageLoading, ErrorCard, LoadingCard) from MUI v5 to M3 Expressive : Migrate using 4-step protocol with special attention to CSS animations (motion tokens for durations/easing) and skeleton contrast (surface-variant tokens) : Target files: frontend/src/components/LoadingState/LoadingState.tsx, frontend/src/components/ui/LoadingSpinners.tsx, frontend/src/components/ui/LoadingSkeleton/LoadingSkeleton.tsx, frontend/src/components/ui/LoadingSpinner/LoadingSpinner.tsx, frontend/src/components/ui/FullPageLoading/FullPageLoading.tsx, frontend/src/components/common/ErrorCard.tsx, frontend/src/components/common/LoadingCard.tsx. Validation: TypeScript, token usage, WCAG. Reference: design-system/tokens-expressive.json : Generate ./.ai_reports/loading_error_batch_m3_migration.md"

sleep 0.5

# Jules Batch G: Library/Demo (18 components)
echo "📚 Launching Batch G: Library/Demo (18 components)..."
jules remote new --repo /Applications/careercopilot --session "JADS_TASK: M3_MIG_G migrating 18 library/demo/documentation components (ButtonComponentsSection, CardComponentsSection, ComponentDemo, DemoLinksSection, DisplayComponentsSection, FormComponentsSection, InteractiveComponentsSection, KeywordTag, LayoutComponentsSection, ProfileVariationCard, TemplateCard, UsageGuidelinesSection, ComponentLibrary, AppLayout, ColorSwatch, StyleGuide, ImageWithFallback, FigmaPage) from MUI v5 to M3 Expressive : Migrate using 4-step protocol. Low priority internal documentation components, can defer if needed : Target files: frontend/src/components/library/ButtonComponentsSection.tsx, frontend/src/components/library/CardComponentsSection.tsx, frontend/src/components/library/ComponentDemo.tsx, frontend/src/components/library/DemoLinksSection.tsx, frontend/src/components/library/DisplayComponentsSection.tsx, frontend/src/components/library/FormComponentsSection.tsx, frontend/src/components/library/InteractiveComponentsSection.tsx, frontend/src/components/library/KeywordTag.tsx, frontend/src/components/library/LayoutComponentsSection.tsx, frontend/src/components/library/ProfileVariationCard.tsx, frontend/src/components/library/TemplateCard.tsx, frontend/src/components/library/UsageGuidelinesSection.tsx, frontend/src/components/library/ComponentLibrary.tsx, frontend/src/components/AppLayout/AppLayout.tsx, frontend/src/components/style-guide/ColorSwatch.tsx, frontend/src/components/style-guide/StyleGuide.tsx, frontend/src/components/figma/ImageWithFallback.tsx, frontend/src/components/figma/FigmaPage.tsx. Validation: TypeScript, token usage, WCAG. Reference: design-system/tokens-expressive.json : Generate ./.ai_reports/library_demo_batch_m3_migration.md"

echo ""
echo "✅ Launched 7 parallel Jules migration sessions (JADS v1.0 format)"
echo ""
echo "📊 Migration Coverage:"
echo "   Batch A: Documents (7 components)"
echo "   Batch B: Profiles (7 components)"
echo "   Batch C: Jobs/Career (10 components)"
echo "   Batch D: Dashboard (6 components)"
echo "   Batch E: Analysis/Visualization (8 components)"
echo "   Batch F: Loading/Error States (7 components)"
echo "   Batch G: Library/Demo (18 components)"
echo "   ─────────────────────────────"
echo "   Total: 71 components"
echo ""
echo "🔍 Monitor progress:"
echo "   jules remote list | grep 'M3_MIG'"
echo ""
echo "📝 Check reports:"
echo "   ./.ai_reports/documents_batch_m3_migration.md"
echo "   ./.ai_reports/profiles_batch_m3_migration.md"
echo "   ./.ai_reports/jobs_career_batch_m3_migration.md"
echo "   ./.ai_reports/dashboard_batch_m3_migration.md"
echo "   ./.ai_reports/analysis_batch_m3_migration.md"
echo "   ./.ai_reports/loading_error_batch_m3_migration.md"
echo "   ./.ai_reports/library_demo_batch_m3_migration.md"
