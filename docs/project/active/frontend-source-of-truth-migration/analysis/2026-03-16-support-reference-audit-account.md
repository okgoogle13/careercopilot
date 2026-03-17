# Support Reference Audit — Account (`/settings`, `/profile`)

**Route family:** `account` in `control/route-matrix.json`
**Canonical screen:** `frontend/src/screens/10_settings/10_settings.wireframe.xml` + `frontend/src/screens/10_settings/SettingsControl.tsx`
**Runtime owners:** `frontend/src/features/settings/Settings.tsx`, `frontend/src/features/profile/ProfileView.tsx`
**Support candidate:** `docs/project/active/frontend-source-of-truth-migration/sources/consolidated-reference/components/Settings.tsx`

## Decision

- **Approved reuse mode:** `reference_only`
- **Why:** the support candidate has useful tab grouping and account-information architecture, but it is heavily hardcoded with hex colors, legacy aesthetic assumptions, and a single-surface settings framing that should not override the current split between `/settings` and `/profile`.
- **Archetype mapping:** `Placard` account shell with `March` tab groupings and form-control clusters.
- **Generic SaaS risk:** `medium-high` — the page is coherent, but it reads like a conventional enterprise settings surface without enough route-specific KR pressure.

## Reuse Allowed

- tab grouping and section ordering
- account-family IA for profile / alerts / security / display clustering
- spacing rhythm for form sections and action footer placement

## Rewrite Required

- keep `/profile` as the voice-profile owner and `/settings` as the secondary account surface
- rewrite all color and font assumptions to canonical runtime tokens and stacks
- preserve current runtime shells and route split instead of collapsing into one settings page

## Exclusions

- no direct promotion of `Settings.tsx`
- no shell or route-family ownership override
- no backend or profile-schema inference from field labels
- no hardcoded hex values in runtime truth
