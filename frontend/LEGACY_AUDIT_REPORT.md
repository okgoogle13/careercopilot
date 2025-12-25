# 🔍 Legacy Audit Report

## 📊 Summary Statistics

- **Total Files**: 661
- **✅ Modern**: 36 (5.4%)
- **💀 Legacy**: 190 (28.7%)
- **❓ Unknown**: 317 (48.0%)
- **🧪 Tests**: 118 (17.9%)
- **⚠️ Errors**: 0 (0.0%)

## 🎯 Audit Configuration

```json
{
  "legacy_markers": [
    "@mui",
    "styles.module.css",
    "styled-components",
    "React.createClass"
  ],
  "modern_markers": [
    "class-variance-authority",
    "tailwind-merge",
    "framer-motion"
  ]
}
```

## 📂 Detailed Analysis

### 📁 `src/components/_deprecated`

**Stats**: 18 legacy, 0 modern, 1 unknown

| File                              | Status     | Action         | Markers Found |
| :-------------------------------- | :--------- | :------------- | :------------ |
| `ATSScoreCircle-Analysis.tsx`     | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ActionCard-common.tsx`           | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ActionCard-main.tsx`             | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `CreateProfileCard-profiles.tsx`  | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `InterviewPrep-career.tsx`        | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `InterviewPrep-opportunities.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `JobCard-jobs.tsx`                | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `LoadingStates-unused.tsx`        | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ProfileCard-profiles.tsx`        | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-AnimatedComponents.tsx`     | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-AnimatedShowcase.tsx`       | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-CardShowcase.tsx`           | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-ComponentLibrary.tsx`       | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-ComponentUsageGuide.tsx`    | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-MUITest.tsx`                | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-StateDemoShowcase.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `demo-fix-icon-fontsize.ts`       | ❓ UNKNOWN | REVIEW         | None          |
| `dropdown-menu.tsx`               | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `scroll-area.tsx`                 | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/mui-components`

**Stats**: 16 legacy, 0 modern, 4 unknown

| File                            | Status     | Action         | Markers Found |
| :------------------------------ | :--------- | :------------- | :------------ |
| `AnalysisView.tsx`              | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `AppShell.tsx`                  | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ApplicationsView.tsx`          | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `CreateProfileCard.stories.tsx` | ❓ UNKNOWN | REVIEW         | None          |
| `CreateProfileCard.tsx`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DashboardMUI.tsx`              | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DataTable.stories.tsx`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DataTable.tsx`                 | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DocumentsView.tsx`             | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ExampleIllustratedCard.tsx`    | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `FormField.stories.tsx`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `FormField.tsx`                 | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `OpportunitiesView.tsx`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ProfileCard.stories.tsx`       | ❓ UNKNOWN | REVIEW         | None          |
| `ProfileCardMUI.tsx`            | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ProfileEditorMUI.tsx`          | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `SettingsMUI.tsx`               | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `UploadResumeMUI.tsx`           | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`                      | ❓ UNKNOWN | REVIEW         | None          |
| `types.ts`                      | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/library`

**Stats**: 13 legacy, 0 modern, 2 unknown

| File                               | Status     | Action         | Markers Found |
| :--------------------------------- | :--------- | :------------- | :------------ |
| `ATSScoreCircle.tsx`               | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ButtonComponentsSection.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `CardComponentsSection.tsx`        | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ComponentDemo.tsx`                | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DemoLinksSection.tsx`             | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DisplayComponentsSection.tsx`     | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `FormComponentsSection.tsx`        | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `InteractiveComponentsSection.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `KeywordTag.tsx`                   | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `LayoutComponentsSection.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ProfileVariationCard.tsx`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `TemplateCard.tsx`                 | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `UsageGuidelinesSection.tsx`       | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `fix-document-type-selector.ts`    | ❓ UNKNOWN | REVIEW         | None          |
| `fix-storybook-imports.ts`         | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/pages`

**Stats**: 8 legacy, 0 modern, 4 unknown

| File                               | Status     | Action         | Markers Found |
| :--------------------------------- | :--------- | :------------- | :------------ |
| `ATSAnalysisPage.tsx`              | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `AnalysisPage.tsx`                 | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `AssetLibraryPage.tsx`             | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DashboardPage.tsx`                | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `DocumentsPage.tsx`                | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `ElectricAlchemistTestKitchen.tsx` | ❓ UNKNOWN | REVIEW         | None          |
| `ExamplePage.tsx`                  | ❓ UNKNOWN | REVIEW         | None          |
| `KscGeneratorPage.tsx`             | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `LoginPage.tsx`                    | ❓ UNKNOWN | REVIEW         | None          |
| `OpportunitiesPage.tsx`            | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `RegisterPage.tsx`                 | ❓ UNKNOWN | REVIEW         | None          |
| `SettingsPage.tsx`                 | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/m3`

**Stats**: 7 legacy, 0 modern, 1 unknown

| File                  | Status     | Action         | Markers Found             |
| :-------------------- | :--------- | :------------- | :------------------------ |
| `ErrorCard.tsx`       | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui                   |
| `FullPageLoading.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui                   |
| `LoadingCard.tsx`     | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui                   |
| `LoadingSkeleton.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui                   |
| `LoadingSpinner.tsx`  | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui                   |
| `LoadingSpinners.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui, ✅ framer-motion |
| `LoadingState.tsx`    | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui                   |
| `divider.tsx`         | ❓ UNKNOWN | REVIEW         | None                      |

### 📁 `src/stories`

**Stats**: 7 legacy, 0 modern, 0 unknown

| File                           | Status    | Action         | Markers Found             |
| :----------------------------- | :-------- | :------------- | :------------------------ |
| `ATSScoreCircle.stories.tsx`   | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui                   |
| `AnimatedButton.stories.tsx`   | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui, ✅ framer-motion |
| `AnimatedDropdown.stories.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui                   |
| `AnimatedProgress.stories.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui                   |
| `LoadingSpinners.stories.tsx`  | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui, ✅ framer-motion |
| `SkeletonLoaders.stories.tsx`  | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui                   |
| `StaggeredList.stories.tsx`    | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui, ✅ framer-motion |

### 📁 `src/components/layout/__tests__`

**Stats**: 6 legacy, 0 modern, 0 unknown

| File                      | Status    | Action         | Markers Found |
| :------------------------ | :-------- | :------------- | :------------ |
| `AppLayout.test.tsx`      | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `AppShell.test.tsx`       | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `Navbar.test.tsx`         | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `NavigationItem.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `PageHeader.test.tsx`     | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `Sidebar.test.tsx`        | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/ui`

**Stats**: 5 legacy, 3 modern, 41 unknown

| File                        | Status     | Action         | Markers Found    |
| :-------------------------- | :--------- | :------------- | :--------------- |
| `ATSScoreCircle.tsx`        | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui          |
| `Alert.tsx`                 | ❓ UNKNOWN | REVIEW         | None             |
| `AnimatedButton.tsx`        | ❓ UNKNOWN | REVIEW         | None             |
| `AnimatedDropdown.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui          |
| `AnimatedProgress.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui          |
| `Button.tsx`                | ❓ UNKNOWN | REVIEW         | None             |
| `Card.tsx`                  | ✅ MODERN  | KEEP           | ✅ framer-motion |
| `ElectricCard.tsx`          | ✅ MODERN  | KEEP           | ✅ framer-motion |
| `LoadingSpinners.tsx`       | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui          |
| `M3ActionCard.stories.tsx`  | ❓ UNKNOWN | REVIEW         | None             |
| `M3ActionCard.tsx`          | ❓ UNKNOWN | REVIEW         | None             |
| `M3Alert.stories.tsx`       | ❓ UNKNOWN | REVIEW         | None             |
| `M3Alert.tsx`               | ❓ UNKNOWN | REVIEW         | None             |
| `M3Avatar.stories.tsx`      | ❓ UNKNOWN | REVIEW         | None             |
| `M3Avatar.tsx`              | ❓ UNKNOWN | REVIEW         | None             |
| `M3Breadcrumb.stories.tsx`  | ❓ UNKNOWN | REVIEW         | None             |
| `M3Breadcrumb.tsx`          | ❓ UNKNOWN | REVIEW         | None             |
| `M3Chip.stories.tsx`        | ❓ UNKNOWN | REVIEW         | None             |
| `M3Chip.tsx`                | ❓ UNKNOWN | REVIEW         | None             |
| `M3DatePicker.stories.tsx`  | ❓ UNKNOWN | REVIEW         | None             |
| `M3DatePicker.tsx`          | ❓ UNKNOWN | REVIEW         | None             |
| `M3EmptyState.stories.tsx`  | ❓ UNKNOWN | REVIEW         | None             |
| `M3EmptyState.tsx`          | ❓ UNKNOWN | REVIEW         | None             |
| `M3JobCard.stories.tsx`     | ❓ UNKNOWN | REVIEW         | None             |
| `M3JobCard.tsx`             | ❓ UNKNOWN | REVIEW         | None             |
| `M3Label.stories.tsx`       | ❓ UNKNOWN | REVIEW         | None             |
| `M3Label.tsx`               | ❓ UNKNOWN | REVIEW         | None             |
| `M3Menu.stories.tsx`        | ❓ UNKNOWN | REVIEW         | None             |
| `M3Menu.tsx`                | ❓ UNKNOWN | REVIEW         | None             |
| `M3Popover.stories.tsx`     | ❓ UNKNOWN | REVIEW         | None             |
| `M3Popover.tsx`             | ❓ UNKNOWN | REVIEW         | None             |
| `M3ProfileCard.stories.tsx` | ❓ UNKNOWN | REVIEW         | None             |
| `M3ProfileCard.tsx`         | ❓ UNKNOWN | REVIEW         | None             |
| `M3Select.stories.tsx`      | ❓ UNKNOWN | REVIEW         | None             |
| `M3Select.tsx`              | ❓ UNKNOWN | REVIEW         | None             |
| `M3Separator.stories.tsx`   | ❓ UNKNOWN | REVIEW         | None             |
| `M3Separator.tsx`           | ❓ UNKNOWN | REVIEW         | None             |
| `M3Sidebar.stories.tsx`     | ❓ UNKNOWN | REVIEW         | None             |
| `M3Sidebar.tsx`             | ❓ UNKNOWN | REVIEW         | None             |
| `M3Skeleton.stories.tsx`    | ❓ UNKNOWN | REVIEW         | None             |
| `M3Skeleton.tsx`            | ❓ UNKNOWN | REVIEW         | None             |
| `M3Tabs.stories.tsx`        | ❓ UNKNOWN | REVIEW         | None             |
| `M3Tabs.tsx`                | ❓ UNKNOWN | REVIEW         | None             |
| `M3Tooltip.stories.tsx`     | ❓ UNKNOWN | REVIEW         | None             |
| `M3Tooltip.tsx`             | ❓ UNKNOWN | REVIEW         | None             |
| `SkeletonLoaders.tsx`       | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui          |
| `StaggeredList.tsx`         | ✅ MODERN  | KEEP           | ✅ framer-motion |
| `badge.tsx`                 | ❓ UNKNOWN | REVIEW         | None             |
| `index.ts`                  | ❓ UNKNOWN | REVIEW         | None             |

### 📁 `src/components/career/__tests__`

**Stats**: 5 legacy, 0 modern, 0 unknown

| File                          | Status    | Action         | Markers Found |
| :---------------------------- | :-------- | :------------- | :------------ |
| `ApplicationCard.test.tsx`    | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ApplicationTracker.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `InterviewPrep.test.tsx`      | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `JobSearch.test.tsx`          | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `TimelineView.test.tsx`       | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/common`

**Stats**: 5 legacy, 0 modern, 0 unknown

| File                            | Status    | Action         | Markers Found |
| :------------------------------ | :-------- | :------------- | :------------ |
| `CareerCopilotLogo.tsx`         | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ErrorCard.tsx`                 | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `LoadingCard.tsx`               | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `StandardizedLoadingStates.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `StyledComponents.tsx`          | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/profile`

**Stats**: 5 legacy, 0 modern, 0 unknown

| File                    | Status    | Action         | Markers Found |
| :---------------------- | :-------- | :------------- | :------------ |
| `CreateProfileCard.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ImportWizard.tsx`      | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileCard.tsx`       | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileComparison.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileEditor.tsx`     | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/Documents`

**Stats**: 5 legacy, 0 modern, 0 unknown

| File                       | Status    | Action         | Markers Found |
| :------------------------- | :-------- | :------------- | :------------ |
| `DocumentPreview.tsx`      | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `DocumentTypeSelector.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ResumeBuilder.tsx`        | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `TemplateSelector.tsx`     | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `UploadResume.tsx`         | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/main/__tests__`

**Stats**: 5 legacy, 0 modern, 0 unknown

| File                           | Status    | Action         | Markers Found |
| :----------------------------- | :-------- | :------------- | :------------ |
| `ActionCard.test.tsx`          | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `FeatureHighlights.test.tsx`   | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `HeroBanner.test.tsx`          | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `JobSearchStatus.test.tsx`     | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `TestimonialCarousel.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/library/__tests__`

**Stats**: 4 legacy, 0 modern, 0 unknown

| File                            | Status    | Action         | Markers Found |
| :------------------------------ | :-------- | :------------- | :------------ |
| `ATSScoreCircle.test.tsx`       | 🧪 TEST   | REVIEW         | None          |
| `ComponentDemo.test.tsx`        | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `KeywordTag.test.tsx`           | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileVariationCard.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `TemplateCard.test.tsx`         | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/main`

**Stats**: 4 legacy, 0 modern, 0 unknown

| File                      | Status    | Action         | Markers Found |
| :------------------------ | :-------- | :------------- | :------------ |
| `FeatureHighlights.tsx`   | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `HeroBanner.tsx`          | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `JobSearchStatus.tsx`     | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `TestimonialCarousel.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src`

**Stats**: 3 legacy, 0 modern, 4 unknown

| File                 | Status     | Action         | Markers Found |
| :------------------- | :--------- | :------------- | :------------ |
| `App.tsx`            | ❓ UNKNOWN | REVIEW         | None          |
| `AppRouter.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `AppWrapper.tsx`     | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `firebase-config.ts` | ❓ UNKNOWN | REVIEW         | None          |
| `main.tsx`           | ❓ UNKNOWN | REVIEW         | None          |
| `setupTests.ts`      | ❓ UNKNOWN | REVIEW         | None          |
| `test-utils.tsx`     | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components`

**Stats**: 3 legacy, 0 modern, 0 unknown

| File                            | Status    | Action         | Markers Found |
| :------------------------------ | :-------- | :------------- | :------------ |
| `ApplicationGeneratorModal.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ErrorBoundary.tsx`             | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `SmartUploadModal.tsx`          | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/ui/loading/__tests__`

**Stats**: 3 legacy, 0 modern, 0 unknown

| File                       | Status    | Action         | Markers Found |
| :------------------------- | :-------- | :------------- | :------------ |
| `FullPageLoading.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `LoadingSkeleton.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `LoadingSpinner.test.tsx`  | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/features/opportunities/__tests__`

**Stats**: 3 legacy, 0 modern, 0 unknown

| File                   | Status    | Action         | Markers Found |
| :--------------------- | :-------- | :------------- | :------------ |
| `FeatureCard.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `JobCard.test.tsx`     | 🧪 TEST   | REVIEW         | None          |
| `JobInput.test.tsx`    | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `JobMatching.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/features/dashboard/dashboard`

**Stats**: 3 legacy, 0 modern, 0 unknown

| File                  | Status    | Action         | Markers Found |
| :-------------------- | :-------- | :------------- | :------------ |
| `DashboardHeader.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `DashboardStats.tsx`  | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileGrid.tsx`     | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/ui/feedback/__tests__`

**Stats**: 2 legacy, 0 modern, 0 unknown

| File                    | Status    | Action         | Markers Found |
| :---------------------- | :-------- | :------------- | :------------ |
| `Dialog.test.tsx`       | 🧪 TEST   | REVIEW         | None          |
| `EmptyState.test.tsx`   | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `Toast.test.tsx`        | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ToastContext.test.tsx` | 🧪 TEST   | REVIEW         | None          |

### 📁 `src/components/layout`

**Stats**: 2 legacy, 1 modern, 3 unknown

| File                           | Status     | Action         | Markers Found    |
| :----------------------------- | :--------- | :------------- | :--------------- |
| `AppShell.tsx`                 | ✅ MODERN  | KEEP           | ✅ framer-motion |
| `M3NavigationItem.stories.tsx` | ❓ UNKNOWN | REVIEW         | None             |
| `M3NavigationItem.tsx`         | ❓ UNKNOWN | REVIEW         | None             |
| `fix-button-variants.ts`       | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui          |
| `index.ts`                     | ❓ UNKNOWN | REVIEW         | None             |
| `layout.tsx`                   | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui          |

### 📁 `src/components/features/auth`

**Stats**: 2 legacy, 0 modern, 0 unknown

| File            | Status    | Action         | Markers Found |
| :-------------- | :-------- | :------------- | :------------ |
| `Auth.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `Auth.tsx`      | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/features/dashboard`

**Stats**: 2 legacy, 0 modern, 0 unknown

| File            | Status    | Action         | Markers Found |
| :-------------- | :-------- | :------------- | :------------ |
| `Dashboard.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `Settings.tsx`  | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/features/dashboard/dashboard/__tests__`

**Stats**: 2 legacy, 0 modern, 0 unknown

| File                       | Status    | Action         | Markers Found |
| :------------------------- | :-------- | :------------- | :------------ |
| `DashboardHeader.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `DashboardStats.test.tsx`  | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileGrid.test.tsx`     | 🧪 TEST   | REVIEW         | None          |

### 📁 `src/components/PageHeader`

**Stats**: 2 legacy, 0 modern, 1 unknown

| File                     | Status     | Action         | Markers Found |
| :----------------------- | :--------- | :------------- | :------------ |
| `PageHeader.stories.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `PageHeader.tsx`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`               | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/profiles/__tests__`

**Stats**: 2 legacy, 0 modern, 0 unknown

| File                         | Status    | Action         | Markers Found |
| :--------------------------- | :-------- | :------------- | :------------ |
| `CreateProfileCard.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileCard.test.tsx`       | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/AppLayout`

**Stats**: 2 legacy, 0 modern, 1 unknown

| File                    | Status     | Action         | Markers Found |
| :---------------------- | :--------- | :------------- | :------------ |
| `AppLayout.stories.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `AppLayout.tsx`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`              | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/theme`

**Stats**: 2 legacy, 0 modern, 1 unknown

| File               | Status     | Action         | Markers Found |
| :----------------- | :--------- | :------------- | :------------ |
| `ThemeWrapper.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `fonts.ts`         | ❓ UNKNOWN | REVIEW         | None          |
| `theme.ts`         | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/ProtectedRoute`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                 | Status     | Action         | Markers Found |
| :------------------- | :--------- | :------------- | :------------ |
| `ProtectedRoute.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`           | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/app/style-guide`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File       | Status    | Action         | Markers Found |
| :--------- | :-------- | :------------- | :------------ |
| `page.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/config`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File             | Status    | Action         | Markers Found |
| :--------------- | :-------- | :------------- | :------------ |
| `navigation.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/SkeletonLoader`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                 | Status     | Action         | Markers Found |
| :------------------- | :--------- | :------------- | :------------ |
| `SkeletonLoader.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`           | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/test-autofix`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                | Status    | Action         | Markers Found |
| :------------------ | :-------- | :------------- | :------------ |
| `TestComponent.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/styles`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File          | Status    | Action         | Markers Found |
| :------------ | :-------- | :------------- | :------------ |
| `m3-theme.ts` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/ui/ToastContext`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File               | Status     | Action         | Markers Found |
| :----------------- | :--------- | :------------- | :------------ |
| `ToastContext.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`         | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ui/loading`

**Stats**: 1 legacy, 0 modern, 7 unknown

| File                            | Status     | Action         | Markers Found |
| :------------------------------ | :--------- | :------------- | :------------ |
| `M3FullPageLoading.stories.tsx` | ❓ UNKNOWN | REVIEW         | None          |
| `M3FullPageLoading.tsx`         | ❓ UNKNOWN | REVIEW         | None          |
| `M3LoadingSkeleton.stories.tsx` | ❓ UNKNOWN | REVIEW         | None          |
| `M3LoadingSkeleton.tsx`         | ❓ UNKNOWN | REVIEW         | None          |
| `M3LoadingSpinner.stories.tsx`  | ❓ UNKNOWN | REVIEW         | None          |
| `M3LoadingSpinner.tsx`          | ❓ UNKNOWN | REVIEW         | None          |
| `index.ts`                      | ❓ UNKNOWN | REVIEW         | None          |
| `variants.tsx`                  | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/ui/LoadingSkeleton`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                  | Status     | Action         | Markers Found |
| :-------------------- | :--------- | :------------- | :------------ |
| `LoadingSkeleton.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`            | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ui/Skeleton`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File           | Status     | Action         | Markers Found |
| :------------- | :--------- | :------------- | :------------ |
| `Skeleton.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`     | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ui/Toast`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File        | Status     | Action         | Markers Found |
| :---------- | :--------- | :------------- | :------------ |
| `Toast.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`  | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ui/FullPageLoading`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                  | Status     | Action         | Markers Found |
| :-------------------- | :--------- | :------------- | :------------ |
| `FullPageLoading.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`            | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ui/EmptyState`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File             | Status     | Action         | Markers Found |
| :--------------- | :--------- | :------------- | :------------ |
| `EmptyState.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`       | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ui/Button/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File              | Status    | Action         | Markers Found |
| :---------------- | :-------- | :------------- | :------------ |
| `Button.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/ui/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                          | Status    | Action         | Markers Found |
| :---------------------------- | :-------- | :------------- | :------------ |
| `.!89590!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!89608!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!89610!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!89994!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!90017!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!90019!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!90420!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!90443!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!90445!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!90814!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!90838!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!90840!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!91210!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!91236!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!91238!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!91607!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!91635!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!91637!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!92008!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!92039!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!92041!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!92411!breadcrumb.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `.!92445!label.test.tsx`      | 🧪 TEST   | REVIEW         | None          |
| `.!92447!EmptyState.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `ATSScoreCircle.test.tsx`     | 🧪 TEST   | REVIEW         | None          |
| `Alert.test.tsx`              | 🧪 TEST   | REVIEW         | None          |
| `AnimatedButton.test.tsx`     | 🧪 TEST   | REVIEW         | None          |
| `AnimatedDropdown.test.tsx`   | 🧪 TEST   | REVIEW         | None          |
| `AnimatedProgress.test.tsx`   | 🧪 TEST   | REVIEW         | None          |
| `EmptyState.test.tsx`         | 🧪 TEST   | REVIEW         | None          |
| `GridCompat.test.tsx`         | 🧪 TEST   | REVIEW         | None          |
| `LoadingState.test.tsx`       | 🧪 TEST   | REVIEW         | None          |
| `M3Menu.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `M3Tooltip.test.tsx`          | 🧪 TEST   | REVIEW         | None          |
| `StatCard.test.tsx`           | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `alert-dialog.test.tsx`       | 🧪 TEST   | REVIEW         | None          |
| `avatar.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `badge.test.tsx`              | 🧪 TEST   | REVIEW         | None          |
| `breadcrumb.test.tsx`         | 🧪 TEST   | REVIEW         | None          |
| `button.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `card.test.tsx`               | 🧪 TEST   | REVIEW         | None          |
| `checkbox.test.tsx`           | 🧪 TEST   | REVIEW         | None          |
| `date-picker.test.tsx`        | 🧪 TEST   | REVIEW         | None          |
| `dialog.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `input.test.tsx`              | 🧪 TEST   | REVIEW         | None          |
| `label.test.tsx`              | 🧪 TEST   | REVIEW         | None          |
| `layout.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `popover.test.tsx`            | 🧪 TEST   | REVIEW         | None          |
| `progress.test.tsx`           | 🧪 TEST   | REVIEW         | None          |
| `radio-group.test.tsx`        | 🧪 TEST   | REVIEW         | None          |
| `search-input.test.tsx`       | 🧪 TEST   | REVIEW         | None          |
| `select.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `separator.test.tsx`          | 🧪 TEST   | REVIEW         | None          |
| `sidebar.test.tsx`            | 🧪 TEST   | REVIEW         | None          |
| `skeleton.test.tsx`           | 🧪 TEST   | REVIEW         | None          |
| `slider.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `switch.test.tsx`             | 🧪 TEST   | REVIEW         | None          |
| `tabs.test.tsx`               | 🧪 TEST   | REVIEW         | None          |
| `textarea.test.tsx`           | 🧪 TEST   | REVIEW         | None          |
| `toast.test.tsx`              | 🧪 TEST   | REVIEW         | None          |
| `tooltip.test.tsx`            | 🧪 TEST   | REVIEW         | None          |

### 📁 `src/components/ui/LoadingSpinner`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                 | Status     | Action         | Markers Found |
| :------------------- | :--------- | :------------- | :------------ |
| `LoadingSpinner.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`           | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/Navbar`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File         | Status     | Action         | Markers Found |
| :----------- | :--------- | :------------- | :------------ |
| `Navbar.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`   | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/NavigationItem`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                 | Status     | Action         | Markers Found |
| :------------------- | :--------- | :------------- | :------------ |
| `NavigationItem.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`           | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/JobSearch`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File            | Status     | Action         | Markers Found |
| :-------------- | :--------- | :------------- | :------------ |
| `JobSearch.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`      | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/TimelineView`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File               | Status     | Action         | Markers Found |
| :----------------- | :--------- | :------------- | :------------ |
| `TimelineView.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`         | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/SkeletonLoader/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                      | Status    | Action         | Markers Found |
| :------------------------ | :-------- | :------------- | :------------ |
| `SkeletonLoader.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/features/JobInput`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File           | Status     | Action         | Markers Found |
| :------------- | :--------- | :------------- | :------------ |
| `JobInput.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`     | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/features/Analysis/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                            | Status    | Action         | Markers Found |
| :------------------------------ | :-------- | :------------- | :------------ |
| `ATSAnalysisDashboard.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ATSScoreCircle.test.tsx`       | 🧪 TEST   | REVIEW         | None          |

### 📁 `src/components/features/JobMatching`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File              | Status     | Action         | Markers Found |
| :---------------- | :--------- | :------------- | :------------ |
| `JobMatching.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`        | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/features/FeatureCard`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File              | Status     | Action         | Markers Found |
| :---------------- | :--------- | :------------- | :------------ |
| `FeatureCard.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`        | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/features/dashboard/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                 | Status    | Action         | Markers Found |
| :------------------- | :-------- | :------------- | :------------ |
| `Dashboard.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `Settings.test.tsx`  | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/features/ATSAnalysisDashboard`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                       | Status     | Action         | Markers Found |
| :------------------------- | :--------- | :------------- | :------------ |
| `ATSAnalysisDashboard.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`                 | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/features/CareerGrowthHub`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                       | Status     | Action         | Markers Found |
| :------------------------- | :--------- | :------------- | :------------ |
| `CareerGrowthHub.test.tsx` | 🧪 TEST    | REVIEW         | None          |
| `CareerGrowthHub.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`                 | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/features/JobCard`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File          | Status     | Action         | Markers Found |
| :------------ | :--------- | :------------- | :------------ |
| `JobCard.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`    | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/features/CareerIntelligence`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                          | Status     | Action         | Markers Found |
| :---------------------------- | :--------- | :------------- | :------------ |
| `CareerIntelligence.test.tsx` | 🧪 TEST    | REVIEW         | None          |
| `CareerIntelligence.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`                    | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/features/FilterPanel`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                   | Status     | Action         | Markers Found |
| :--------------------- | :--------- | :------------- | :------------ |
| `FilterPanel.test.tsx` | 🧪 TEST    | REVIEW         | None          |
| `FilterPanel.tsx`      | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`             | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ApplicationCard`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                  | Status     | Action         | Markers Found |
| :-------------------- | :--------- | :------------- | :------------ |
| `ApplicationCard.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`            | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/SmartUploadModal/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                        | Status    | Action         | Markers Found |
| :-------------------------- | :-------- | :------------- | :------------ |
| `SmartUploadModal.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/AppShell`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File           | Status     | Action         | Markers Found |
| :------------- | :--------- | :------------- | :------------ |
| `AppShell.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`     | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/dashboard`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                | Status    | Action         | Markers Found |
| :------------------ | :-------- | :------------- | :------------ |
| `WelcomeBanner.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/common/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                            | Status    | Action         | Markers Found |
| :------------------------------ | :-------- | :------------- | :------------ |
| `ActionCard.test.tsx`           | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `CareerCopilotLogo.test.tsx`    | 🧪 TEST   | REVIEW         | None          |
| `ErrorCard.enhanced.test.tsx`   | 🧪 TEST   | REVIEW         | None          |
| `ErrorCard.test.tsx`            | 🧪 TEST   | REVIEW         | None          |
| `LoadingCard.enhanced.test.tsx` | 🧪 TEST   | REVIEW         | None          |
| `LoadingCard.test.tsx`          | 🧪 TEST   | REVIEW         | None          |

### 📁 `src/components/NotificationCenter/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                          | Status    | Action         | Markers Found |
| :---------------------------- | :-------- | :------------- | :------------ |
| `NotificationCenter.test.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/figma`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                    | Status    | Action         | Markers Found |
| :---------------------- | :-------- | :------------- | :------------ |
| `ImageWithFallback.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/components/LoadingState`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File               | Status     | Action         | Markers Found |
| :----------------- | :--------- | :------------- | :------------ |
| `LoadingState.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`         | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/GridCompat`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File             | Status     | Action         | Markers Found |
| :--------------- | :--------- | :------------- | :------------ |
| `GridCompat.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`       | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/ApplicationTracker`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                     | Status     | Action         | Markers Found |
| :----------------------- | :--------- | :------------- | :------------ |
| `ApplicationTracker.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`               | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/components/style-guide`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File              | Status    | Action         | Markers Found |
| :---------------- | :-------- | :------------- | :------------ |
| `ColorSwatch.tsx` | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |

### 📁 `src/NotificationCenter`

**Stats**: 1 legacy, 0 modern, 1 unknown

| File                     | Status     | Action         | Markers Found |
| :----------------------- | :--------- | :------------- | :------------ |
| `NotificationCenter.tsx` | 💀 LEGACY  | MIGRATE/DELETE | 💀 @mui       |
| `index.ts`               | ❓ UNKNOWN | REVIEW         | None          |

### 📁 `src/mui-components/__tests__`

**Stats**: 1 legacy, 0 modern, 0 unknown

| File                   | Status    | Action         | Markers Found |
| :--------------------- | :-------- | :------------- | :------------ |
| `DataTable.test.tsx`   | 💀 LEGACY | MIGRATE/DELETE | 💀 @mui       |
| `ProfileCard.test.tsx` | 🧪 TEST   | REVIEW         | None          |

### 📁 `src/__mocks__`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File                 | Status     | Action | Markers Found |
| :------------------- | :--------- | :----- | :------------ |
| `firebase-config.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/__mocks__/@/api`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File            | Status     | Action | Markers Found |
| :-------------- | :--------- | :----- | :------------ |
| `aiServices.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/test-utils`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File             | Status     | Action | Markers Found |
| :--------------- | :--------- | :----- | :------------ |
| `test-utils.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/types`

**Stats**: 0 legacy, 0 modern, 4 unknown

| File            | Status     | Action | Markers Found |
| :-------------- | :--------- | :----- | :------------ |
| `ai.ts`         | ❓ UNKNOWN | REVIEW | None          |
| `api.ts`        | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`      | ❓ UNKNOWN | REVIEW | None          |
| `test-types.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/context`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File              | Status     | Action | Markers Found |
| :---------------- | :--------- | :----- | :------------ |
| `AuthContext.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/app`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `layout.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/app/test-system`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File       | Status     | Action | Markers Found |
| :--------- | :--------- | :----- | :------------ |
| `page.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/features/design-system-test`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File           | Status     | Action | Markers Found |
| :------------- | :--------- | :----- | :------------ |
| `TestPage.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/features/design-system`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                      | Status     | Action | Markers Found    |
| :------------------------ | :--------- | :----- | :--------------- |
| `DesignSystemPreview.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `Preview.tsx`             | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/stores`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File                 | Status     | Action | Markers Found |
| :------------------- | :--------- | :----- | :------------ |
| `useExampleStore.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/utils`

**Stats**: 0 legacy, 0 modern, 4 unknown

| File               | Status     | Action | Markers Found |
| :----------------- | :--------- | :----- | :------------ |
| `accessibility.ts` | ❓ UNKNOWN | REVIEW | None          |
| `animations.ts`    | ❓ UNKNOWN | REVIEW | None          |
| `apiClient.ts`     | ❓ UNKNOWN | REVIEW | None          |
| `dateUtils.ts`     | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/schemas`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File              | Status     | Action | Markers Found |
| :---------------- | :--------- | :----- | :------------ |
| `api.schema.ts`   | ❓ UNKNOWN | REVIEW | None          |
| `asset.schema.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/tabs`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File       | Status     | Action | Markers Found |
| :--------- | :--------- | :----- | :------------ |
| `index.ts` | ❓ UNKNOWN | REVIEW | None          |
| `tabs.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/tabs/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File            | Status  | Action | Markers Found |
| :-------------- | :------ | :----- | :------------ |
| `tabs.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/sidebar`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File          | Status     | Action | Markers Found |
| :------------ | :--------- | :----- | :------------ |
| `index.ts`    | ❓ UNKNOWN | REVIEW | None          |
| `sidebar.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/sidebar/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File               | Status  | Action | Markers Found |
| :----------------- | :------ | :----- | :------------ |
| `sidebar.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/ui/ToastContext/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                    | Status  | Action | Markers Found |
| :---------------------- | :------ | :----- | :------------ |
| `ToastContext.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/ui/Toast/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                      | Status  | Action | Markers Found |
| :------------------------ | :------ | :----- | :------------ |
| `Toast.enhanced.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/ui/Dialog`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `Dialog.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/ui/Dialog/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                       | Status  | Action | Markers Found |
| :------------------------- | :------ | :----- | :------------ |
| `Dialog.enhanced.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/ui/Button`

**Stats**: 0 legacy, 2 modern, 3 unknown

🎉 **This folder is fully modern!**

| File                            | Status     | Action | Markers Found                                 |
| :------------------------------ | :--------- | :----- | :-------------------------------------------- |
| `Button (old.tsx`               | ✅ MODERN  | KEEP   | ✅ class-variance-authority, ✅ framer-motion |
| `Button.stories.tsx`            | ❓ UNKNOWN | REVIEW | None                                          |
| `Button.test.tsx`               | 🧪 TEST    | REVIEW | None                                          |
| `Button.tsx`                    | ✅ MODERN  | KEEP   | ✅ class-variance-authority, ✅ framer-motion |
| `fix-templateselector-props.ts` | ❓ UNKNOWN | REVIEW | None                                          |
| `index.ts`                      | ❓ UNKNOWN | REVIEW | None                                          |

### 📁 `src/components/ui/animations`

**Stats**: 0 legacy, 1 modern, 0 unknown

🎉 **This folder is fully modern!**

| File       | Status    | Action | Markers Found    |
| :--------- | :-------- | :----- | :--------------- |
| `index.ts` | ✅ MODERN | KEEP   | ✅ framer-motion |

### 📁 `src/components/Navbar/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File              | Status  | Action | Markers Found |
| :---------------- | :------ | :----- | :------------ |
| `Navbar.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/career`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File       | Status     | Action | Markers Found |
| :--------- | :--------- | :----- | :------------ |
| `types.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/career/TimelineView`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File               | Status     | Action | Markers Found |
| :----------------- | :--------- | :----- | :------------ |
| `TimelineView.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`         | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/pagination`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File             | Status     | Action | Markers Found |
| :--------------- | :--------- | :----- | :------------ |
| `index.ts`       | ❓ UNKNOWN | REVIEW | None          |
| `pagination.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/footer`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `footer.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Checkbox`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                     | Status     | Action | Markers Found |
| :----------------------- | :--------- | :----- | :------------ |
| `M3Checkbox.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Checkbox.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Select`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                   | Status     | Action | Markers Found |
| :--------------------- | :--------- | :----- | :------------ |
| `M3Select.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Select.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/tooltip`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File          | Status     | Action | Markers Found |
| :------------ | :--------- | :----- | :------------ |
| `index.ts`    | ❓ UNKNOWN | REVIEW | None          |
| `tooltip.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/ingestion/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                        | Status  | Action | Markers Found |
| :-------------------------- | :------ | :----- | :------------ |
| `ConfirmTagsModal.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/M3Breadcrumb`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                       | Status     | Action | Markers Found |
| :------------------------- | :--------- | :----- | :------------ |
| `M3Breadcrumb.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Breadcrumb.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`                 | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/card`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File            | Status     | Action | Markers Found |
| :-------------- | :--------- | :----- | :------------ |
| `card.test.tsx` | 🧪 TEST    | REVIEW | None          |
| `card.tsx`      | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`      | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/card/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                     | Status  | Action | Markers Found |
| :----------------------- | :------ | :----- | :------------ |
| `card.enhanced.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/progress`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File           | Status     | Action | Markers Found |
| :------------- | :--------- | :----- | :------------ |
| `index.ts`     | ❓ UNKNOWN | REVIEW | None          |
| `progress.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/alert-dialog`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File                    | Status     | Action | Markers Found |
| :---------------------- | :--------- | :----- | :------------ |
| `alert-dialog.test.tsx` | 🧪 TEST    | REVIEW | None          |
| `alert-dialog.tsx`      | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`              | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3SearchInput`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                        | Status     | Action | Markers Found |
| :-------------------------- | :--------- | :----- | :------------ |
| `M3SearchInput.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3SearchInput.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`                  | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Skeleton`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                     | Status     | Action | Markers Found |
| :----------------------- | :--------- | :----- | :------------ |
| `M3Skeleton.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Skeleton.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/input`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File             | Status     | Action | Markers Found |
| :--------------- | :--------- | :----- | :------------ |
| `index.ts`       | ❓ UNKNOWN | REVIEW | None          |
| `input.test.tsx` | 🧪 TEST    | REVIEW | None          |
| `input.tsx`      | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Progress`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                     | Status     | Action | Markers Found |
| :----------------------- | :--------- | :----- | :------------ |
| `M3Progress.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Progress.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Button`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                   | Status     | Action | Markers Found |
| :--------------------- | :--------- | :----- | :------------ |
| `M3Button.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Button.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/Alert`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File        | Status     | Action | Markers Found |
| :---------- | :--------- | :----- | :------------ |
| `Alert.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`  | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/ConfirmTagsModal`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File                   | Status     | Action | Markers Found |
| :--------------------- | :--------- | :----- | :------------ |
| `ConfirmTagsModal.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/skeleton`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File           | Status     | Action | Markers Found |
| :------------- | :--------- | :----- | :------------ |
| `index.ts`     | ❓ UNKNOWN | REVIEW | None          |
| `skeleton.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Alert`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                  | Status     | Action | Markers Found |
| :-------------------- | :--------- | :----- | :------------ |
| `M3Alert.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Alert.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`            | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Input`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File          | Status     | Action | Markers Found |
| :------------ | :--------- | :----- | :------------ |
| `M3Input.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`    | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/separator`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File            | Status     | Action | Markers Found |
| :-------------- | :--------- | :----- | :------------ |
| `index.ts`      | ❓ UNKNOWN | REVIEW | None          |
| `separator.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/toast`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File        | Status     | Action | Markers Found |
| :---------- | :--------- | :----- | :------------ |
| `index.ts`  | ❓ UNKNOWN | REVIEW | None          |
| `toast.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/toast/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File             | Status  | Action | Markers Found |
| :--------------- | :------ | :----- | :------------ |
| `toast.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/features/KSC`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File       | Status     | Action | Markers Found |
| :--------- | :--------- | :----- | :------------ |
| `index.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/features/KSC/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                        | Status  | Action | Markers Found |
| :-------------------------- | :------ | :----- | :------------ |
| `KscCriteriaInput.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/features/opportunities`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                     | Status  | Action | Markers Found |
| :----------------------- | :------ | :----- | :------------ |
| `InterviewPrep.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/features/Analysis`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File       | Status     | Action | Markers Found |
| :--------- | :--------- | :----- | :------------ |
| `index.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/features/auth/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                 | Status  | Action | Markers Found |
| :------------------- | :------ | :----- | :------------ |
| `LoginForm.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/M3Tabs`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                 | Status     | Action | Markers Found |
| :------------------- | :--------- | :----- | :------------ |
| `M3Tabs.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Tabs.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Dialog`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File           | Status     | Action | Markers Found |
| :------------- | :--------- | :----- | :------------ |
| `M3Dialog.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`     | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3EmptyState`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                       | Status     | Action | Markers Found |
| :------------------------- | :--------- | :----- | :------------ |
| `M3EmptyState.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3EmptyState.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`                 | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/checkbox`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File                | Status     | Action | Markers Found |
| :------------------ | :--------- | :----- | :------------ |
| `checkbox.test.tsx` | 🧪 TEST    | REVIEW | None          |
| `checkbox.tsx`      | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`          | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/label`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File        | Status     | Action | Markers Found |
| :---------- | :--------- | :----- | :------------ |
| `index.ts`  | ❓ UNKNOWN | REVIEW | None          |
| `label.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/slider`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |
| `slider.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/stepper`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File          | Status     | Action | Markers Found |
| :------------ | :--------- | :----- | :------------ |
| `index.ts`    | ❓ UNKNOWN | REVIEW | None          |
| `stepper.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Switch`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                   | Status     | Action | Markers Found |
| :--------------------- | :--------- | :----- | :------------ |
| `M3Switch.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Switch.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Divider`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                    | Status     | Action | Markers Found |
| :---------------------- | :--------- | :----- | :------------ |
| `M3Divider.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Divider.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`              | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Card`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                 | Status     | Action | Markers Found |
| :------------------- | :--------- | :----- | :------------ |
| `M3Card.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Card.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Card/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File              | Status  | Action | Markers Found |
| :---------------- | :------ | :----- | :------------ |
| `M3Card.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/dialog`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `dialog.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/popover`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File          | Status     | Action | Markers Found |
| :------------ | :--------- | :----- | :------------ |
| `index.ts`    | ❓ UNKNOWN | REVIEW | None          |
| `popover.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/dashboard/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                     | Status  | Action | Markers Found |
| :----------------------- | :------ | :----- | :------------ |
| `WelcomeBanner.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/StatCard`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File           | Status     | Action | Markers Found |
| :------------- | :--------- | :----- | :------------ |
| `StatCard.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`     | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/textarea`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File           | Status     | Action | Markers Found |
| :------------- | :--------- | :----- | :------------ |
| `index.ts`     | ❓ UNKNOWN | REVIEW | None          |
| `textarea.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/button`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `button.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/figma/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                         | Status  | Action | Markers Found |
| :--------------------------- | :------ | :----- | :------------ |
| `ImageWithFallback.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                                 | Status  | Action | Markers Found |
| :----------------------------------- | :------ | :----- | :------------ |
| `ApplicationGeneratorModal.test.tsx` | 🧪 TEST | REVIEW | None          |
| `ErrorBoundary.test.tsx`             | 🧪 TEST | REVIEW | None          |
| `ProtectedRoute.test.tsx`            | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/date-picker`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File              | Status     | Action | Markers Found |
| :---------------- | :--------- | :----- | :------------ |
| `date-picker.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`        | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/profile/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                         | Status  | Action | Markers Found |
| :--------------------------- | :------ | :----- | :------------ |
| `CreateProfileCard.test.tsx` | 🧪 TEST | REVIEW | None          |
| `ImportWizard.test.tsx`      | 🧪 TEST | REVIEW | None          |
| `ProfileCard.test.tsx`       | 🧪 TEST | REVIEW | None          |
| `ProfileComparison.test.tsx` | 🧪 TEST | REVIEW | None          |
| `ProfileEditor.test.tsx`     | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/M3DatePicker`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                       | Status     | Action | Markers Found |
| :------------------------- | :--------- | :----- | :------------ |
| `M3DatePicker.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3DatePicker.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`                 | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Grid`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                 | Status     | Action | Markers Found |
| :------------------- | :--------- | :----- | :------------ |
| `M3Grid.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Grid.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/menu`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File       | Status     | Action | Markers Found |
| :--------- | :--------- | :----- | :------------ |
| `index.ts` | ❓ UNKNOWN | REVIEW | None          |
| `menu.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/avatar`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `avatar.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Slider`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                   | Status     | Action | Markers Found |
| :--------------------- | :--------- | :----- | :------------ |
| `M3Slider.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Slider.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/switch`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |
| `switch.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Container`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                      | Status     | Action | Markers Found |
| :------------------------ | :--------- | :----- | :------------ |
| `M3Container.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Container.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`                | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Container/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                   | Status  | Action | Markers Found |
| :--------------------- | :------ | :----- | :------------ |
| `M3Container.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/electric`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File       | Status     | Action | Markers Found |
| :--------- | :--------- | :----- | :------------ |
| `index.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/electric/tabs`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File               | Status     | Action | Markers Found    |
| :----------------- | :--------- | :----- | :--------------- |
| `ElectricTabs.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`         | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/drawer`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                 | Status     | Action | Markers Found    |
| :------------------- | :--------- | :----- | :--------------- |
| `ElectricDrawer.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/pagination`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                     | Status     | Action | Markers Found    |
| :----------------------- | :--------- | :----- | :--------------- |
| `ElectricPagination.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/tooltip`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                  | Status     | Action | Markers Found    |
| :-------------------- | :--------- | :----- | :--------------- |
| `ElectricTooltip.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`            | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/card`

**Stats**: 0 legacy, 2 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                | Status     | Action | Markers Found                                 |
| :------------------ | :--------- | :----- | :-------------------------------------------- |
| `ElectricCard.tsx`  | ✅ MODERN  | KEEP   | ✅ class-variance-authority, ✅ framer-motion |
| `PopOutGraphic.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion                              |
| `index.ts`          | ❓ UNKNOWN | REVIEW | None                                          |

### 📁 `src/components/electric/progress`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                   | Status     | Action | Markers Found               |
| :--------------------- | :--------- | :----- | :-------------------------- |
| `ElectricProgress.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/input`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                | Status     | Action | Markers Found               |
| :------------------ | :--------- | :----- | :-------------------------- |
| `ElectricInput.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`          | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/alert`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                | Status     | Action | Markers Found               |
| :------------------ | :--------- | :----- | :-------------------------- |
| `ElectricAlert.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`          | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/skeleton`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                   | Status     | Action | Markers Found               |
| :--------------------- | :--------- | :----- | :-------------------------- |
| `ElectricSkeleton.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/checkbox`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                   | Status     | Action | Markers Found    |
| :--------------------- | :--------- | :----- | :--------------- |
| `ElectricCheckbox.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/slider`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File                 | Status     | Action | Markers Found |
| :------------------- | :--------- | :----- | :------------ |
| `ElectricSlider.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/electric/empty-state`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File                     | Status     | Action | Markers Found |
| :----------------------- | :--------- | :----- | :------------ |
| `ElectricEmptyState.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/electric/dialog`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                 | Status     | Action | Markers Found    |
| :------------------- | :--------- | :----- | :--------------- |
| `ElectricDialog.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/popover`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                  | Status     | Action | Markers Found    |
| :-------------------- | :--------- | :----- | :--------------- |
| `ElectricPopover.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`            | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/container`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                    | Status     | Action | Markers Found               |
| :---------------------- | :--------- | :----- | :-------------------------- |
| `ElectricContainer.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`              | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/textarea`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                   | Status     | Action | Markers Found               |
| :--------------------- | :--------- | :----- | :-------------------------- |
| `ElectricTextarea.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`             | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/button`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                 | Status     | Action | Markers Found                                 |
| :------------------- | :--------- | :----- | :-------------------------------------------- |
| `ElectricButton.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority, ✅ framer-motion |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None                                          |

### 📁 `src/components/electric/date-picker`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                     | Status     | Action | Markers Found               |
| :----------------------- | :--------- | :----- | :-------------------------- |
| `ElectricDatePicker.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/table`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File                | Status     | Action | Markers Found |
| :------------------ | :--------- | :----- | :------------ |
| `ElectricTable.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`          | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/electric/divider`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                  | Status     | Action | Markers Found               |
| :-------------------- | :--------- | :----- | :-------------------------- |
| `ElectricDivider.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`            | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/avatar`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                 | Status     | Action | Markers Found               |
| :------------------- | :--------- | :----- | :-------------------------- |
| `ElectricAvatar.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/switch`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                 | Status     | Action | Markers Found    |
| :------------------- | :--------- | :----- | :--------------- |
| `ElectricSwitch.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/radio-group`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                     | Status     | Action | Markers Found    |
| :----------------------- | :--------- | :----- | :--------------- |
| `ElectricRadioGroup.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/select`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                 | Status     | Action | Markers Found               |
| :------------------- | :--------- | :----- | :-------------------------- |
| `ElectricSelect.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`           | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/breadcrumb`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File                     | Status     | Action | Markers Found |
| :----------------------- | :--------- | :----- | :------------ |
| `ElectricBreadcrumb.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/electric/search-input`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                      | Status     | Action | Markers Found    |
| :------------------------ | :--------- | :----- | :--------------- |
| `ElectricSearchInput.tsx` | ✅ MODERN  | KEEP   | ✅ framer-motion |
| `index.ts`                | ❓ UNKNOWN | REVIEW | None             |

### 📁 `src/components/electric/grid`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File               | Status     | Action | Markers Found               |
| :----------------- | :--------- | :----- | :-------------------------- |
| `ElectricGrid.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`         | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/electric/badge`

**Stats**: 0 legacy, 1 modern, 1 unknown

🎉 **This folder is fully modern!**

| File                | Status     | Action | Markers Found               |
| :------------------ | :--------- | :----- | :-------------------------- |
| `ElectricBadge.tsx` | ✅ MODERN  | KEEP   | ✅ class-variance-authority |
| `index.ts`          | ❓ UNKNOWN | REVIEW | None                        |

### 📁 `src/components/radio-group`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File              | Status     | Action | Markers Found |
| :---------------- | :--------- | :----- | :------------ |
| `index.ts`        | ❓ UNKNOWN | REVIEW | None          |
| `radio-group.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/Documents/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                        | Status  | Action | Markers Found |
| :-------------------------- | :------ | :----- | :------------ |
| `DocumentPreview.test.tsx`  | 🧪 TEST | REVIEW | None          |
| `TemplateSelector.test.tsx` | 🧪 TEST | REVIEW | None          |
| `UploadResume.test.tsx`     | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/select`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |
| `select.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/breadcrumb`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File             | Status     | Action | Markers Found |
| :--------------- | :--------- | :----- | :------------ |
| `breadcrumb.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`       | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/breadcrumb/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                  | Status  | Action | Markers Found |
| :-------------------- | :------ | :----- | :------------ |
| `breadcrumb.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/jobs/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File               | Status  | Action | Markers Found |
| :----------------- | :------ | :----- | :------------ |
| `JobCard.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/components/M3Modal`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File          | Status     | Action | Markers Found |
| :------------ | :--------- | :----- | :------------ |
| `M3Modal.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`    | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Sidebar`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                    | Status     | Action | Markers Found |
| :---------------------- | :--------- | :----- | :------------ |
| `M3Sidebar.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Sidebar.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`              | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Textarea`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                     | Status     | Action | Markers Found |
| :----------------------- | :--------- | :----- | :------------ |
| `M3Textarea.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3Textarea.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`               | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/search-input`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File               | Status     | Action | Markers Found |
| :----------------- | :--------- | :----- | :------------ |
| `index.ts`         | ❓ UNKNOWN | REVIEW | None          |
| `search-input.tsx` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/header`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File         | Status     | Action | Markers Found |
| :----------- | :--------- | :----- | :------------ |
| `header.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`   | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3Badge`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File          | Status     | Action | Markers Found |
| :------------ | :--------- | :----- | :------------ |
| `M3Badge.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`    | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/M3RadioGroup`

**Stats**: 0 legacy, 0 modern, 3 unknown

| File                       | Status     | Action | Markers Found |
| :------------------------- | :--------- | :----- | :------------ |
| `M3RadioGroup.stories.tsx` | ❓ UNKNOWN | REVIEW | None          |
| `M3RadioGroup.tsx`         | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`                 | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/components/badge`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File             | Status     | Action | Markers Found |
| :--------------- | :--------- | :----- | :------------ |
| `badge.test.tsx` | 🧪 TEST    | REVIEW | None          |
| `badge.tsx`      | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`       | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/__tests__/integration`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                        | Status  | Action | Markers Found |
| :-------------------------- | :------ | :----- | :------------ |
| `DocumentWorkflow.test.tsx` | 🧪 TEST | REVIEW | None          |

### 📁 `src/hooks`

**Stats**: 0 legacy, 0 modern, 2 unknown

| File               | Status     | Action | Markers Found |
| :----------------- | :--------- | :----- | :------------ |
| `index.ts`         | ❓ UNKNOWN | REVIEW | None          |
| `useFileUpload.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/lib`

**Stats**: 0 legacy, 3 modern, 1 unknown

🎉 **This folder is fully modern!**

| File            | Status     | Action | Markers Found     |
| :-------------- | :--------- | :----- | :---------------- |
| `cn.ts`         | ✅ MODERN  | KEEP   | ✅ tailwind-merge |
| `index.ts`      | ❓ UNKNOWN | REVIEW | None              |
| `motion.ts`     | ✅ MODERN  | KEEP   | ✅ framer-motion  |
| `utils.test.ts` | 🧪 TEST    | REVIEW | None              |
| `utils.ts`      | ✅ MODERN  | KEEP   | ✅ tailwind-merge |

### 📁 `src/api`

**Stats**: 0 legacy, 0 modern, 20 unknown

| File                       | Status     | Action | Markers Found |
| :------------------------- | :--------- | :----- | :------------ |
| `aiServices.ts`            | ❓ UNKNOWN | REVIEW | None          |
| `analysisService.ts`       | ❓ UNKNOWN | REVIEW | None          |
| `analyticsService.ts`      | ❓ UNKNOWN | REVIEW | None          |
| `apiClient.ts`             | ❓ UNKNOWN | REVIEW | None          |
| `applicationService.ts`    | ❓ UNKNOWN | REVIEW | None          |
| `authService.ts`           | ❓ UNKNOWN | REVIEW | None          |
| `calendarService.ts`       | ❓ UNKNOWN | REVIEW | None          |
| `documentCRUDService.ts`   | ❓ UNKNOWN | REVIEW | None          |
| `documentService.ts`       | ❓ UNKNOWN | REVIEW | None          |
| `emailService.ts`          | ❓ UNKNOWN | REVIEW | None          |
| `index.ts`                 | ❓ UNKNOWN | REVIEW | None          |
| `ingestion.service.ts`     | ❓ UNKNOWN | REVIEW | None          |
| `jobService.ts`            | ❓ UNKNOWN | REVIEW | None          |
| `notificationService.ts`   | ❓ UNKNOWN | REVIEW | None          |
| `profileService.ts`        | ❓ UNKNOWN | REVIEW | None          |
| `settingsService.ts`       | ❓ UNKNOWN | REVIEW | None          |
| `smartIngestionService.ts` | ❓ UNKNOWN | REVIEW | None          |
| `storageService.ts`        | ❓ UNKNOWN | REVIEW | None          |
| `templateService.ts`       | ❓ UNKNOWN | REVIEW | None          |
| `workflowService.ts`       | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/api/__mocks__`

**Stats**: 0 legacy, 0 modern, 1 unknown

| File            | Status     | Action | Markers Found |
| :-------------- | :--------- | :----- | :------------ |
| `aiServices.ts` | ❓ UNKNOWN | REVIEW | None          |

### 📁 `src/pages/__tests__`

**Stats**: 0 legacy, 0 modern, 0 unknown

| File                         | Status  | Action | Markers Found |
| :--------------------------- | :------ | :----- | :------------ |
| `AnalysisPage.test.tsx`      | 🧪 TEST | REVIEW | None          |
| `DashboardPage.test.tsx`     | 🧪 TEST | REVIEW | None          |
| `DocumentsPage.test.tsx`     | 🧪 TEST | REVIEW | None          |
| `OpportunitiesPage.test.tsx` | 🧪 TEST | REVIEW | None          |
| `SettingsPage.test.tsx`      | 🧪 TEST | REVIEW | None          |

## 🚀 Recommendations

### High Priority (Legacy Heavy)

1. Focus on folders with the most legacy files first
2. Migrate Material-UI components to Electric design system
3. Replace CSS modules with Tailwind classes

### Medium Priority (Mixed)

1. Update components that have both legacy and modern markers
2. Standardize on one approach per component

### Low Priority (Clean)

1. Modern folders can be used as reference
2. Test files should be updated alongside components
