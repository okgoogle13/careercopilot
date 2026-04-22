### 1. Namespace Inventory
- **Discovered `--sys-*` Names in phase3 donor-reference and archive exports**:
  - `--sys-color-charcoalBackground-base`
  - `--sys-color-concreteGrey-base`
  - `--sys-color-inkGold-base`
  - `--sys-color-paperWhite`
  - `--sys-color-protestMetalBlue-base`
  - `--sys-color-worker-ash-base`
  - `--sys-shape-blockRiot01`
  - `--sys-shape-blockRiot03`
  - `--sys-type-font-fraunces`
  - `--sys-type-font-mono`
  - `--sys-type-font-work-sans`

- **Discovered Archive Donor Variable Families**:
  - Surface: `--surface-bright`, `--surface-container`, `--surface-container-high`, `--surface-container-low`, `--surface-dim`
  - Primary: `--primary-sage`
  - Action: `--action-terracotta`
  - On-Surface: `--on-surface-variant`
  - Outline: (None detected specifically as --outline, but archive CSS uses direct non-token hexes frequently)

### 2. Drift Clusters

- **Runtime Production Files with Hardcoded Hex**:
  - `frontend/src/components/KanbanCard/index.tsx`
  - `frontend/src/components/shared/IconBadge.tsx`
  - `frontend/src/components/shared/PlasmaBackground.tsx`
  - `frontend/src/components/ui/WorkflowDiagram.tsx`
  - `frontend/src/config/resume-constants.ts`
  - `frontend/src/design/styles/kerala-rage.css`
  - `frontend/src/features/analysis/Analysis.tsx`
  - `frontend/src/features/landing/LandingPage.module.css`
  - `frontend/src/features/landing/LandingPage.tsx`
  - `frontend/src/features/profile/components/ProfileEditor.tsx`
  - `frontend/src/features/style-guide/StyleGuide.tsx`
  - `frontend/src/layouts/Layout.tsx`
  - `frontend/src/layouts/shared/Sidebar.tsx`
  - `frontend/src/screens/06_opportunities/OpportunitiesDiscovery.tsx`
  - `frontend/src/stories/button.css`
  - `frontend/src/stories/header.css`
  - `frontend/src/stories/page.css`
  - `frontend/src/styles/design-tokens.css`
  - `frontend/src/utils/exportEngine.ts`

- **Reference/Archive Files with Hardcoded Hex**:
  - `frontend/src/services/mockData.ts`
  - Various structural files inside `docs/archive_legacy_reports/root_legacy/...`

### 3. Migration Candidates

- **Phase3 `--sys-*` mappings**:
  - `--sys-color-charcoalBackground-base` -> `--kr-color-charcoal-background-base`
  - `--sys-color-concreteGrey-base` -> `--kr-color-concrete-grey-base`
  - `--sys-color-inkGold-base` -> `--kr-color-ink-gold-base`
  - `--sys-color-paperWhite` -> `--kr-color-paper-white-base`
  - `--sys-color-protestMetalBlue-base` -> `--kr-color-protest-metal-blue-base`
  - `--sys-color-worker-ash-base` -> `--kr-color-worker-ash-base`
  - `--sys-shape-blockRiot01` -> `--kr-shape-block-riot01`
  - `--sys-shape-blockRiot03` -> `--kr-shape-block-riot03`
  - `--sys-type-font-fraunces` -> `--kr-type-font-families-display`
  - `--sys-type-font-mono` -> `--kr-type-font-families-mono`
  - `--sys-type-font-work-sans` -> `--kr-type-font-families-primary`

- **Archive donor vars mappings**:
  - `--surface-container` -> `--kr-color-charcoal-background-steps-1`
  - `--surface-container-high` -> `--kr-color-charcoal-background-steps-2`
  - `--surface-container-low` -> `--kr-color-asphalt-black-base`
  - `--surface-bright` -> `--kr-color-charcoal-background-steps-4`
  - `--primary-sage` -> `--kr-color-kr-activist-smoke-green-base`
  - `--action-terracotta` -> `--kr-color-solidarity-smoke-orange-base`
  - `--on-surface-variant` -> `--kr-color-concrete-grey-base`

### 4. Ambiguities

- The semantic translation of archive material design variables (`--surface-*`) into the Solidarity design system is inherently ambiguous. MDCs use `--surface-dim`, `--surface-container` etc. in a purely elevation/structural sense, whereas Solidarity anchors around intentional charcoal and asphalt bases.
- `--action-terracotta` vs `--kr-color-solidarity-red-base` vs `--kr-color-solidarity-smoke-orange-base`: Translating user intention without visuals. `terracotta` suggests earthy orange, matching smoke-orange, but the action might necessitate the higher saliency crimson red.
- `--primary-sage` doesn't exist. Translated to `--kr-color-kr-activist-smoke-green-base` due to similar earthy/green tones, but might require validation.

### 5. Exclusions

- All files within `docs/archive_legacy_reports/root_legacy/...` are archive-only and should act as donor referential materials.
- `frontend/src/_reference/migration/phase3/**/*.tsx` are purely reference elements and should not be edited during this migration effort.
- `frontend/src/services/mockData.ts` contains hardcoded hex values acting as raw data rather than UI presentation tokens and should not be modified.
