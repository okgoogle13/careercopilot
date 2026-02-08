# Master Migration Plan Execution

## Phase 1: Freeze Sources of Truth
- [x] 1.1 Tokens
    - [x] Mark `src/design-tokens.json` as deprecated
    - [x] Verify root imports only `src/theme/design-tokens.css`
    - [x] Grep audit for `design-tokens.json` imports
- [x] 1.2 Mode Context
    - [x] Verify single `ModeContext` source
    - [x] Ensure correct `data-mode` attribute usage
    - [x] Verify Shells render children correctly
- [x] 1.3 Import Quarantine
    - [x] Create `src/legacy/ui/`
    - [x] Move generic/shadcn components to `legacy/ui`
    - [x] Retain `kerala-rageButton`, `StatusBadge`, `NativeAnchor` in `components/ui`
    - [x] Update imports for moved components

## Phase 2: Design System Facade
- [ ] 2.1 Create Facade Structure
    - [x] Create `src/design-system/` with `tokens`, `primitives`, `components`
    - [x] Create re-exports for `Leaf`, `Pebble`, `Stone`
    - [x] Create re-exports for `kerala-rageButton`
    - [x] Create re-exports for tokens

## Phase 3: Shell Stability
- [x] 3.1 Verify Shell Slots
    - [x] Check `kr-darkShell` slots
    - [x] Check `kr-darkShell` slots

## Phase 4: Feature-Sliced Migration
- [x] 4.1 Migrate Shared UI
    - [x] Move `ApplicationCard` to `features/applications`
    - [x] Move `MetricCard`, `TechCard` to `features/analysis`
    - [x] Move `GlassLeafCard`, `IconBadge` to `features/kr-dark` (+ check compliance)
- [x] 4.2 Migrate Auth
    - [x] Refactor `Login.tsx`
    - [x] Refactor `Register.tsx` (Completed)

## Phase 5: Navigation Contract
- [x] 5.1 Unified Nav Schema
    - [x] Create `src/config/navigation.schema.ts`
    - [x] Update `kr-darkDock` to consume schema
    - [x] Update `NavRail` to consume schema

## Phase 6: Cleanup
- [x] 6.1 Final Polish
    - [x] Remove dead legacy code (Removed `@careercopilot/ui` alias)
    - [x] Create `MIGRATION_STRATEGY.md` (Drafted and acted upon)
- [x] 6.2 Prevent Drift
    - [x] Check for legacy imports (Targeted grep confirmed clean)
    - [x] Remove alias from `package.json` & `tsconfig.json` (Effective guardrail)
    - [x] Add lint rule for `src/legacy` (Implemented in `eslint.config.js`)

## Phase 6: System Restoration (Current)
- [x] 6.0 Foundation Restoration
    - [x] Restore `package.json` & scripts
    - [x] Restore `tailwind.config.js` with kerala-rage tokens
    - [x] Restore `index.css` & Global Styles
    - [x] Restore Entry Points (`index.html`, `main.tsx`, `App.tsx`)
- [x] 6.1 Asset Injection
    - [x] Create Asset Manifest (`frontend/src/assets/ASSET_MANIFEST.md`)
    - [x] Create missing textures (paper-grain, scanlines, dusty-overlay, grid-mesh)
    - [x] Restore missing images (fern, beetle)
    - [x] **Haeckel Foundation**: Sliced 25 icons from Composite Grid (B2-03)
    - [x] **kr-motif Collection**: Extracted 13 jars from kerala-streetprint plate
    - [x] **Lab Instruments**: Extracted 12 gold tools from Anatomical plate
    - [x] **Hero kr-motifs**: Generated Waratah, Wattle, kr-flower, kr-leafus, Brass Key
    - [x] **Catalog**: Created Storybook stories for all assets
    - [x] **Batch 2 Integration**:
        - [x] Sliced 25 Haeckel Icons from Composite Grid
        - [x] Processed Lichen Texture for Lab Backgrounds
        - [x] Extracted Frill-Necked Lizard ("The Warning")
        - [x] Extracted Fossil Icons (Star, Spine, Pod)

## Phase 6.2: M3 Expressive Typography Refactor
- [x] 6.2.1 Core Infrastructure
    - [x] Integrate `Roboto Flex` (Variable `GRAD`, `XTRA`)
    - [x] Define Expressive Tokens (`authoritative`, `wistful`, `breathing`)
    - [x] Add CSS Variables for physics axes
- [x] 6.2.2 Component Updates
    - [x] `kerala-rageButton`: Implement layout-safe `GRAD` physics
    - [x] `StatusBadge`: Add "Breathing" animation support
    - [x] `JobQueue`: Apply Tabular Figures & Slashed Zeros

## Phase 7: Data Integration
- [x] 7.1 kr-dark Wiring
    - [x] Implement Analysis Dashboard (Mock Data Wiring)
    - [x] Implement Evidence Locker (Document Stack)
    - [x] Connect to real backend scoring API (Simulated Service)
- [x] 7.2 kr-dark Wiring
    - [x] Connect Feed to meaningful activity data (Mocked + Decor)
    - [x] Connect Kanban to application state (Mocked)
- [ ] 7.3 Genkit Embedding Integration (Functions)
    - [ ] Replace placeholder embeddings in `functions/src/services/job_listing_extractor.ts`
    - [ ] Configure Genkit embedder plugin (e.g., Google AI embedder)
    - [ ] Ensure Zod schemas remain enforced for flow inputs/outputs

## Phase 5.5: Stabilization & QA (Remediation)
- [ ] 5.5.1 Verification Tasks
    - [x] Build Gate (Ran `npm run build`; frontend + functions compile)
    - [ ] Preview Gate (Run `npm run preview`)
    - [ ] Navigation Regression Sweep (Transitions, `?tool=` routing, history)
    - [ ] Component Coverage Audit (Check `MetricCard`, `ImpactEnhancements`, etc.)
    - [ ] Design Token Health Check (Verify Tailwind tokens, global styles)
    - [ ] Smoke Tests (Expand UI suite to kr-dark/kr-dark views)
    - [x] Asset Path Stabilization (Resolved `/texture-pattern.png` runtime warning in Profile view)
- [ ] 5.5.2 Quality Gates
    - [ ] Performance Baseline (Capture Lighthouse metrics)
    - [ ] Accessibility Baseline (Audit contrast/focus/ARIA)
    - [ ] Stakeholder Review (UX/visual parity signoff)

## Phase 6: Performance Optimizations
- [ ] 6.1 Bundle & Runtime Optimization
    - [ ] Code Splitting (Route-level lazy loading)
    - [ ] Asset Optimization (Compress/fingerprint assets, lazy images)
    - [ ] Critical CSS (Minimize Tailwind output, tree-shaking)
    - [ ] Dependency Audit (Remove unused packages)
- [ ] 6.2 UX Performance Enhancements
    - [ ] Animation Budgeting (Optimize framer-motion)
    - [ ] Rendering Profiling (Identify re-render hot spots)
    - [ ] Skeletons & Prefetch (Add skeletons, prefetch critical data)
- [ ] 6.3 Verification & Monitoring
    - [ ] Lighthouse Regression Checks (Compare vs Phase 5.5 baseline)
    - [ ] Real-User Monitoring Hooks (Telemetry for nav/render timing)
    - [ ] Documentation Updates (Document optimization impact)
