# ELECTRIC ALCHEMIST MIGRATION PLAN
## Divide & Conquer Strategy

**Status:** Option A Complete ✅ (Global background applied)
**Next:** Parallel agent execution across 5 batches

---

## BATCH 1: CORE PRIMITIVES (Foundation Components)
**Agent:** `component-migration-primitives`
**Priority:** CRITICAL (blocks other batches)
**Est. Components:** 12

### Components to Create:
1. `ElectricBadge` - Migrate from M3Badge
2. `ElectricInput` - Migrate from M3Input
3. `ElectricTextarea` - Migrate from M3Textarea
4. `ElectricCheckbox` - Migrate from M3Checkbox
5. `ElectricSwitch` - Migrate from M3Switch
6. `ElectricRadioGroup` - Migrate from M3RadioGroup
7. `ElectricSelect` - Migrate from M3Select
8. `ElectricSlider` - Migrate from M3Slider
9. `ElectricProgress` - Migrate from M3Progress
10. `ElectricDivider` - Migrate from M3Divider
11. `ElectricSkeleton` - Migrate from M3Skeleton
12. `ElectricSearchInput` - Migrate from M3SearchInput

### Specifications:
- Use Tactile Press physics where interactive
- Apply Poly-Body typography (AI tier for labels)
- Deep Violet Void color palette
- 24px button radius, 8px small elements
- Spring animations (stiffness: 400, damping: 25)

### Acceptance Criteria:
- [ ] All 12 components created in `src/components/electric/`
- [ ] Barrel exports in `src/components/electric/index.ts`
- [ ] TypeScript interfaces with VariantProps
- [ ] Basic Storybook stories (optional)

---

## BATCH 2: LAYOUT & CONTAINERS (Structural Components)
**Agent:** `component-migration-layout`
**Priority:** HIGH (enables page refactors)
**Est. Components:** 8

### Components to Create:
1. `ElectricDialog` - Migrate from M3Dialog (with backdrop, Tactile Press dismiss)
2. `ElectricDrawer` - Asymmetric drawer (0 28px 28px 0 radius)
3. `ElectricTabs` - With sliding pill animation (layoutId="active-pill")
4. `ElectricBreadcrumb` - Data tier typography
5. `ElectricContainer` - Grid container with proper spacing
6. `ElectricGrid` - Bento grid system
7. `ElectricAlert` - Status alerts with variants
8. `ElectricEmptyState` - Empty state cards

### Specifications:
- Asymmetric drawer: border-radius: 0 28px 28px 0
- Active tab pill: Framer Motion layoutId animation
- Grid: 24px spacing base
- Modals: z-index: 50, backdrop blur

### Acceptance Criteria:
- [ ] All 8 components created
- [ ] Layout components support responsive breakpoints
- [ ] Framer Motion animations implemented
- [ ] Proper z-index layering

---

## BATCH 3: DATA DISPLAY (Content Components)
**Agent:** `component-migration-data`
**Priority:** MEDIUM
**Est. Components:** 6

### Components to Create:
1. `ElectricDatePicker` - Date selection with calendar pop-out
2. `ElectricTable` - Data table with Data tier typography
3. `ElectricPagination` - Page navigation
4. `ElectricTooltip` - Hover tooltips
5. `ElectricPopover` - Contextual popovers
6. `ElectricAvatar` - User avatars

### Specifications:
- Tables use Data tier (.text-data) for headers/metadata
- DatePicker with Pop-Out graphic animation
- Tooltips: z-index: 30, no blur effects (solid shapes)

### Acceptance Criteria:
- [ ] All 6 components created
- [ ] Data typography tier applied to tables/metadata
- [ ] Pop-out animations for interactive elements

---

## BATCH 4: PAGE MIGRATIONS (Business Logic Pages)
**Agent:** `page-migration-specialist`
**Priority:** HIGH (user-facing)
**Est. Pages:** 10

### Pages to Migrate (in order):
1. **DashboardPage** - Replace all M3 components with Electric
2. **KscGeneratorPage** - Forms + buttons migration
3. **DocumentsPage** - Card layouts + file upload
4. **AnalysisPage** - Data tables + charts
5. **OpportunitiesPage** - Card grids
6. **AssetLibraryPage** - Card + search
7. **SettingsPage** - Forms + switches
8. **LoginPage** - Forms + buttons (keep minimal styling)
9. **RegisterPage** - Forms + validation
10. **ATSAnalysisPage** - Data visualization

### Migration Steps (per page):
1. Replace `<M3Button>` → `<ElectricButton>`
2. Replace `<M3Card>` → `<ElectricCard>`
3. Replace `<M3Input>` → `<ElectricInput>`
4. Apply typography classes:
   - Page titles: `.text-hero`
   - Descriptions: `.text-human`
   - Labels: `.text-ai`
   - Metadata: `.text-data`
5. Test Tactile Press interactions
6. Verify responsive behavior

### Acceptance Criteria:
- [ ] All 10 pages use Electric components exclusively
- [ ] No M3 component imports remaining
- [ ] Typography hierarchy applied
- [ ] Interactive physics working (hover/tap)
- [ ] Visual QA passed

---

## BATCH 5: UTILITIES & POLISH (Enhancement Layer)
**Agent:** `migration-utilities-specialist`
**Priority:** LOW (nice-to-have)
**Est. Tasks:** 5

### Tasks:
1. **Storybook Stories** - Create stories for all Electric components
2. **Unit Tests** - Jest tests for core components
3. **Documentation** - Component API docs in markdown
4. **Migration Helpers** - Codemod scripts for automated migration
5. **Performance Audit** - Optimize bundle size, lazy loading

### Specifications:
- Storybook stories showcase all variants
- Tests cover interaction states (hover, tap, disabled)
- Docs include copy-paste examples
- Codemod: `npx migrate-to-electric src/`

### Acceptance Criteria:
- [ ] Storybook stories for 20+ components
- [ ] >80% test coverage on Electric components
- [ ] API documentation complete
- [ ] Migration helper scripts working

---

## AGENT COORDINATION PROTOCOL

### Parallel Execution Order:
```
START
  ├─ BATCH 1 (Primitives) ───────────────────┐
  ├─ BATCH 2 (Layout) ────────────────────────┤
  └─ BATCH 3 (Data Display) ─────────────────┤
                                              ▼
                            Wait for BATCH 1 completion
                                              ▼
                            BATCH 4 (Pages) ──┐
                                              ▼
                            BATCH 5 (Polish) ─┘
                                              ▼
                                            DONE
```

### Dependencies:
- **BATCH 4** depends on **BATCH 1** completion (needs primitives)
- **BATCH 2, 3** can run in parallel with BATCH 1
- **BATCH 5** runs after all pages migrated

### Handover Format (Jules/Agent Delegation):
```
Task: [BATCH X: Component Name] - Migrate M3Component to ElectricComponent following Electric Alchemist Design System v4.2 specs (tokens.json, Tactile Press physics, Poly-Body typography). Create component in ./src/components/electric/[name]/, export in index.ts, apply spring animations (stiffness: 400, damping: 25), use Deep Violet Void palette. Generate handover report in ./.ai_reports/[ComponentName]_migration_report.md
```

---

## QUICK REFERENCE: DESIGN TOKENS

### Colors:
- Background: `bg-surface` (#141218)
- Cards: `bg-surface-container-low` (#1D1B20)
- Primary: `bg-primary-container` (#EADDFF)
- Accent: `bg-tertiary-container` (#FFD8E4)
- Borders: `border-outline-variant` (#49454F)

### Typography:
- Titles: `.text-hero` (Roboto Flex, wdth:150, wght:800)
- Content: `.text-human` (Roboto Serif, wdth:100)
- Labels: `.text-ai` (Roboto Flex, wdth:92, wght:450)
- Metadata: `.text-data` (Roboto Flex, opsz:8, wght:500)

### Motion:
- Tactile Press: `variants={tactilePress}` (hover: 0.98, tap: 0.95)
- Pop-Out: `variants={popOut}` (y: -15, rotate: 5, scale: 1.1)
- Springs: `spring(400, 25)` or `spring(300, 20)`

### Shape:
- Cards: `rounded-card` (28px)
- Buttons: `rounded-button` (24px)
- Badges: `rounded-badge` (8px)

---

## MIGRATION METRICS

### Current State (Post Option A):
- ✅ Global background applied (architectural-shell)
- ✅ 3 Electric components (Button, Card, PopOutGraphic)
- ⏳ 65 M3 components remaining
- ⏳ 10 pages to migrate

### Success Criteria:
- [ ] 0 M3 component imports in pages
- [ ] 100% Electric component coverage
- [ ] All pages use Poly-Body typography
- [ ] Tactile Press physics on all interactions
- [ ] Deep Violet Void aesthetic throughout

---

## ROLLBACK PLAN

If migration fails:
1. Remove `architectural-shell` wrapper from AppWrapper.tsx
2. Keep Electric components in `src/components/electric/` (isolated)
3. Revert page imports to M3 components
4. No data loss (components coexist)

---

**READY FOR AGENT DEPLOYMENT**
**Estimated Total Time:** 3-5 days (with 5 parallel agents)
**Priority:** BATCH 1 → BATCH 4 → BATCH 5
