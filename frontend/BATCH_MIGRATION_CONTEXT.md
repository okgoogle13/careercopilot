# BATCH MIGRATION PLAN: VISUAL STABILITY & ANTIGRAVITY STANDARDS

## OBJECTIVE
Automate the propagation of visual stability fixes (Z-Index, Skeletons, Strict Dimensions) across the remaining application components.

## REFERENCE IMPLEMENTATIONS (THE "GOLDEN STANDARD")
* **Grid/Card Stability:** `src/components/applications/JobCard.tsx` (Reference for `relative`, `hover:z-10`, `scale`)
* **Loading States:** `src/components/ui/skeleton.tsx` (Reference for `rounded-[28px]` and "Electric Alchemist" tokens)
* **Charts/Layouts:** `src/components/analysis/ATSDashboard.tsx` (Reference for strict dimensioning and flex usage)

## BATCH 1: HIGH PRIORITY (Card-Based Components)
*Target: Components that likely suffer from Z-index clipping during hover/scale.*
1.  `src/components/dashboard/ActionCard.tsx`
2.  `src/components/dashboard/CreateProfileCard.tsx`
3.  `src/components/documents/DocumentCard.tsx`
4.  `src/components/opportunities/JobMatchCard.tsx`

## BATCH 2: MEDIUM PRIORITY (Layout Containers & Others)
*Target: Areas where layout shift/thrashing occurs on load.*
1.  `src/components/dashboard/WelcomeBanner.tsx`
2.  `src/components/dashboard/ProfileCard.tsx`

## PHASE 2: INTERACTIVE STABILITY & A11Y

## OBJECTIVE
Ensure that the visual stability established in Phase 1 extends to Keyboard (Focus) and Touch (Active) interactions.

## REFERENCE STANDARDS (The "Electric Alchemist" Interaction Token)
* **Focus State:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`
    * *Why:* Matches the accessible, high-contrast theme.
* **Active/Click State:** `active:scale-[0.98]`
    * *Why:* Provides "tactile" feedback that the click was registered (Antigravity physics).
* **Transitions:** `transition-[transform,shadow,ring] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]` (Aligned with Button physics)
    * *Why:* Unifies the speed of hover, focus, and active state changes.

## BATCH 3: INTERACTION & A11Y (Target List)
*Target: Components from Phase 1 that are interactive.*
1.  `src/components/applications/JobCard.tsx`
2.  `src/components/documents/DocumentCard.tsx`
3.  `src/components/dashboard/ActionCard.tsx`
4.  `src/components/dashboard/CreateProfileCard.tsx`

**Instructions for Batch 3:**
- [ ] **Focus:** Add the Reference Focus classes to the main interactive container.
- [ ] **Tactile:** Add the Reference Active classes.
- [ ] **Semantics:** If a card is clickable but implemented as a `div`, verify it has `role="button"` and `tabIndex={0}`, OR refactor it to a `<button>` tag if possible without breaking layout.
