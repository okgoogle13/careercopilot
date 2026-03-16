# Figma Shared-Shell Audit

Date: 2026-03-16
Source: direct Figma MCP page inventory for file `YPDj0edchIDXykYChSmCUd`
Status: support/reference audit only

## Purpose

Record what the connected Figma pages contribute at the shared-shell layer so route work does not rediscover or silently redefine sidebar/logo/header/footer/layout ownership.

## Scope

Covered Figma pages:
- `Home` (`0:1`)
- `Dashboard` (`1:2`)
- `Opportunities` (`1:3`)
- `Applications` (`1:4`)
- `Ingestion` (`1:5`)
- `Analysis` (`1:6`)
- `Account Control` (`1:8`)

## Audit decisions

### Layout / Scaffold shell

- **Figma support candidates:** `components/Layout.tsx`, `components/ProtectedLayout.tsx`
- **Runtime owner:** `frontend/src/layouts/Sidebar.tsx` for the legacy sidebar shell and `frontend/src/layouts/KrDarkShell/components/KrDarkDock.tsx` for migrated-route shell navigation
- **Decision:** `shared_shell_reference_only`
- **Why:** the Figma shell is useful for page composition, sidebar/body spacing, and route-family grouping, but the support candidates still carry hardcoded hex values and mock-auth assumptions.

**Reuse allowed**
- sidebar/body proportions and shell layering
- route-family grouping and page-entry composition
- page-to-sidebar relationship patterns for pages that still use the sidebar shell

**Rewrite required**
- all colors and atmosphere layers must stay owned by canonical runtime tokens
- auth gating must stay owned by current runtime auth components
- migrated routes must keep `KrDarkDock` as the canonical shell owner unless an explicit route decision says otherwise

### Sidebar

- **Figma support candidates:** `components/Sidebar.tsx`, `components/ui/sidebar.tsx`
- **Runtime owner:** `frontend/src/layouts/Sidebar.tsx`
- **Decision:** `shared_shell_reference_only`
- **Why:** the Figma sidebar has useful nav IA, sublabel treatment, and mobile-collapse semantics, but it still uses alpha expressions, gradient treatment, and support-only route assumptions.

**Reuse allowed**
- nav ordering and sublabel hierarchy
- mobile collapse / drawer semantics
- active-state information architecture

**Rewrite required**
- all visuals must stay on current KR runtime shell tokens and shapes
- no support-only route links may become authority
- no gradient or support-only atmosphere effects may enter runtime shell code unchanged

### Logo

- **Figma support candidate:** `components/Logo.tsx`
- **Runtime owner:** none yet; runtime logo remains embedded inside `frontend/src/layouts/Sidebar.tsx`
- **Decision:** `blocked`
- **Why:** the support logo uses palm-tree imagery and hardcoded hex colors. That conflicts with current Zero-Flora and token rules.

**Allowed use**
- none for runtime promotion

**Blocked**
- direct reuse
- visual motif borrowing
- treating it as a canonical shared primitive

### Header / TopNav

- **Figma support candidates:** none as standalone primitives
- **Runtime owner:** none
- **Decision:** `reference_only`
- **Why:** the connected Figma pages do not expose a standalone top-nav pattern that should override current sidebar/dock navigation choices.

**Allowed use**
- page-local heading spacing and breadcrumb rhythm only

### Footer

- **Figma support signals:** page-local footer regions inside `Home` and `Applications`
- **Runtime owner:** none
- **Decision:** `reference_only`
- **Why:** there is no canonical runtime `Footer.tsx`, and the Figma pages show page-local footer treatments rather than a stable app-wide footer primitive.

**Allowed use**
- page-local footer copy rhythm and metadata strip ideas

**Blocked**
- inferring or inventing a global runtime footer from the Figma pages

## Structural notes

- Five of seven pages use the broad `Scaffold` + `Body` + `Sidebar` pattern.
- `Ingestion` is the outlier and should not be forced into the sidebar shell just because other pages use it.
- Shared-shell value is real, but it is structural only. No shell primitive from Figma is approved for direct promotion.

## Outcome

- Shared-shell audit requirement is now satisfied for the connected 7-page Figma inventory.
- Any route work that touches sidebar/logo/header/footer/layout must treat this artifact plus the runtime shared-primitive audit in `control/status.md` as the governing reference layer.
