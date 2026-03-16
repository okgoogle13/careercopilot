# TSX Identity Gate — `/` (landing)

**Filename:** `2026-03-16-tsx-identity-gate-root.md`

## Route Metadata

- **Route id:** `root`
- **Runtime owner:** `HeroLanding` (`frontend/src/screens/01_landing/HeroLanding.tsx`)
- **Implemented TSX path:** `frontend/src/screens/01_landing/HeroLanding.tsx`
- **Build contract:** `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-root.xml`
- **Support-reference audit:** `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-landing.md`

## Inputs Reviewed

- `frontend/src/screens/01_landing/HeroLanding.tsx`
- `docs/project/active/frontend-source-of-truth-migration/analysis/2026-03-16-support-reference-audit-landing.md`
- `frontend/src/screens/01_landing/01_landing.wireframe.xml`
- `docs/project/active/frontend-source-of-truth-migration/contracts/build-contract-root.xml`

## Identity Review

- **Archetype mapping:** Slot-based `KrDarkShell` canonical wrapper with `HeroLanding` as the primary screen component; `SLOT_DEFS` drives Z-layer asset composition
- **Generic SaaS risk:** `low` — HeroLanding is built around a `SLOT_DEFS` / `slotAssets` system explicitly typed to `KR-SOLID-*` asset IDs. No generic hero banner or landing page scaffolding.

### `design-orchestration`

- **Finding:** HeroLanding is a slot-composition component, not a static page. Each visual layer (`hero_background`, `hero_accent`, `cta_icon`) is typed to `--sys-${string}` tokens and `KR-${string}` asset IDs, preventing non-KR asset injection at the type level. `useModeStore` drives dark-only rendering. Spring animations (`springHero`, `springCard`, `springButton`) are M3 Expressive compliant with high stiffness / controlled damping. Component accepts `onPrimaryAction` / `onSecondaryAction` props, keeping CTA behavior route-owned in `App.tsx` rather than baking in navigation assumptions.
- **Required rewrite:** none — slot architecture is purpose-built for KR Solidarity asset injection.

### `kerala-rage-brand-enforcer`

- **Finding:** Token enforcement gate passed 0 violations (2026-03-16). All color tokens use `--sys-color-*` semantic form (`--sys-color-charcoalBackground-base`, `--sys-color-protestMetalBlue-base`, `--sys-color-worker-ash-base`). Z-layer opacity values are defined as a typed constant table (`slotOpacity`) — not hardcoded per instance. No hardcoded hex/rgb values present. No flora or non-human mascot motifs. `useModeStore` ensures dark-only territory is enforced at the component root.
- **Zero-Flora / anti-generic status:** `clean` — KR asset IDs (`KR-SOLID-002`, `KR-SOLID-004`, `KR-SOLID-023`) are used as defaults; no flora-named or generic stock-art references.

### `m3-expressive-token-orchestrator`

- **Finding:** All three slot tokens reference the `--sys-color-*` canonical namespace directly in `SLOT_DEFS`. Asset compatibility is constrained to the `KR-SOLID-*` manifest via TypeScript template literal types (`assetCompat: \`KR-\${string}\``). The token chain from `tokens.json` → CSS variables → component is unbroken.
- **Token wiring status:** `pass` — no orphaned token references; slot system enforces KR-namespace at compile time.

### `kerala-rage-typography-strategy`

- **Finding:** HeroLanding accepts `title` and `subtitle` as props — typography rendering is delegated to the calling context or child composition, not hardcoded in the component. The wireframe's `emotional_register: Defiance` is expressed through the M3 spring animation profile and slot-driven asset layering rather than font-class overrides in this file. Typography is composed at the page-shell level, consistent with the KR Solidarity separation of concerns.
- **Voice / hierarchy status:** `pass` — defiance register is carried by animation profile and asset layering; typography ownership is correctly pushed to the route shell.

## Outcome

- **Gate result:** `identity_pass`
- **Blocking rewrites:** none
- **Closure decision:** route may close — Figma-informed closure evidence is satisfied for `/` (landing)
