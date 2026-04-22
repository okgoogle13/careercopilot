/**
 * KR Solidarity v6.1 — Archetypes Configuration
 *
 * Canonical mapping of semantic action archetypes to:
 * - Shape token palette (base + morph states)
 * - Motion coupling
 *
 * ALL shape tokens emit as CSS custom properties: `--shape-{tokenName}`
 * Use `shapeVar()` or `shapeOf()` to reference them safely in React.
 *
 * @see docs/design/02_SYSTEM.md §3.3 Semantic Action Archetypes
 * @see src/design/tokens/tokens.json → sys.shape
 */

// ─── Shape Token Registry ────────────────────────────────────────────────────

/**
 * Every v6.1 shape token name. These map 1:1 to CSS vars `--shape-{name}`.
 * DO NOT add `50%` or uniform 4-corner values here.
 */
export const SHAPE_TOKENS = [
  // Core UI — Block Riot series (Strike + Scaffold)
  'blockRiot01',
  'blockRiot01-pressed',
  'blockRiot02',
  'blockRiot03',
  'blockRiot03-pressed',
  'blockRiot03-loading',
  // Core UI — Pill March series (March)
  'pillMarch01',
  'pillMarch01-pressed',
  // Core UI — March Surge series (March open)
  'marchSurge01',
  'marchSurge01-expanded',
  // Core UI — Alert Shard (Strike error/selected)
  'alertShard01',
  'alertShard01-pressed',
  // Kinetic Morph series (v6.1 strategy)
  'strikePuff01',
  'marchOrganic01',
  'waveTectonic01',
  'waveTectonic02',
  'toggleSlide01',
  'maskAsymmetric01',
  // Core UI — Scaffold Frame (Scaffold — immutable)
  'scaffoldFrame01',
  'scaffoldFrame01-focus',
  // Core UI — Megaphone Cut (Megaphone modal)
  'megaphoneCut01',
  'megaphoneCut01-loading',
  // Core UI — Placard Torn (Placard content cards)
  'placardTorn01',
  'placardTorn01-selected',
  'placardTorn01-loading',
  // Decorative — Substrate Tile (Substrate/hero only)
  'substrateTile01',
  'substrateTile01-hover',
  'substrateTile02',
  // Tension shapes (high drama, selective)
  'tearBanner01',
  'brickWall01',
  // Utility
  'sentryAvatar',
  'tornEdgeClipPath',
] as const;

export type ShapeToken = (typeof SHAPE_TOKENS)[number];

// ─── Archetype Config ─────────────────────────────────────────────────────────

/**
 * Archetype → shape palette + motion coupling.
 *
 * `shapes` keys are semantic state names; the values are ShapeToken names.
 * `motion` maps to a motion preset in motion-presets.ts.
 */
export const archetypes = {
  Strike: {
    shapes: {
      base: 'blockRiot03', // 32px 4px 4px 32px — CTA default
      pressed: 'strikePuff01', // 48px 12px 12px 48px 'puff' morph
      active: 'blockRiot02', // 20px 4px 12px 2px hover
      selected: 'alertShard01', // 32px 2px 2px 32px error/selected
      loading: 'blockRiot03-loading', // pill collapse during async
    },
    motion: 'typeSpringSlam',
    motionDuration: '600ms',
  },
  March: {
    shapes: {
      base: 'pillMarch01', // 9999px 8px 9999px 8px notch
      pressed: 'pillMarch01-pressed', // 9999px 24px 9999px 24px expand
      selected: 'marchOrganic01', // 9999px 48px 4px 9999px organic morph
      open: 'marchSurge01', // 48px 12px 12px 48px open
      expanded: 'marchSurge01-expanded', // 0px fully open (snapped)
    },
    motion: 'dragSettle',
    motionDuration: '800ms',
  },
  Megaphone: {
    shapes: {
      base: 'megaphoneCut01', // 64px 0px 64px 0px tension cut
      loading: 'megaphoneCut01-loading', // 32px 32px 32px 32px relaxed shape
      ambient: 'substrateTile01', // ambient background layer
    },
    motion: 'typeSpringSlam',
    motionDuration: '600ms',
  },
  Placard: {
    shapes: {
      base: 'placardTorn01', // 48px 4px 48px 4px structural tension
      selected: 'placardTorn01-selected', // 12px 32px 12px 32px invert
      loading: 'placardTorn01-loading', // 24px relaxed load
    },
    motion: 'dragSettle',
    motionDuration: '800ms',
  },
  Scaffold: {
    shapes: {
      base: 'scaffoldFrame01', // 8px 2px 8px 2px — IMMUTABLE
      focus: 'scaffoldFrame01-focus', // Unchanged — Scaffold invariance
    },
    motion: 'none',
    motionDuration: '0ms',
  },
  Substrate: {
    shapes: {
      base: 'waveTectonic02', // base tectonic canvas
      ambient: 'waveTectonic01', // ambient plate drift
      hover: 'substrateTile01-hover', // normalized plate
    },
    motion: 'waterRipple',
    motionDuration: '3000ms',
  },
  Avatar: {
    shapes: {
      base: 'maskAsymmetric01', // branded silhouette
      presence: 'substrateTile01-hover', // morphing presence indicator
    },
    motion: 'dragSettle',
    motionDuration: '400ms',
  },
} as const;

export type ArchetypeName = keyof typeof archetypes;
export type ArchetypeConfig = (typeof archetypes)[ArchetypeName];

// ─── Token Helpers ────────────────────────────────────────────────────────────

/**
 * Returns the CSS custom property reference for a shape token.
 * @example shapeVar('blockRiot03') → 'var(--shape-blockRiot03)'
 */
export const shapeVar = (token: ShapeToken | string): string => `var(--shape-${token})`;

/**
 * Returns the CSS custom property reference for a named archetype + state.
 * Defaults to 'base' state if state is not found.
 * @example shapeOf('Strike') → 'var(--shape-blockRiot03)'
 * @example shapeOf('Strike', 'loading') → 'var(--shape-blockRiot03-loading)'
 */
export const shapeOf = (archetype: ArchetypeName, state: string = 'base'): string => {
  const config = archetypes[archetype];
  const shapes = config.shapes as Record<string, string>;
  const token = shapes[state] ?? shapes['base'];
  return shapeVar(token);
};

/**
 * Returns the motion preset string for an archetype.
 * @example motionOf('Strike') → 'typeSpringSlam'
 */
export const motionOf = (archetype: ArchetypeName): string => archetypes[archetype].motion;

// ─── Docs Table ───────────────────────────────────────────────────────────────
/**
 * Shape token → archetype assignment (for documentation and validators).
 *
 * | Token              | Primary    | Secondary  | Tier       |
 * |--------------------|------------|------------|------------|
 * | blockRiot01        | Strike     | Scaffold   | Core UI    |
 * | blockRiot02        | Strike     | March      | Core UI    |
 * | blockRiot03        | Strike     | —          | Core UI    |
 * | pillMarch01        | March      | Strike     | Core UI    |
 * | marchSurge01       | March      | —          | Core UI    |
 * | alertShard01       | Strike     | Signal     | Core UI    |
 * | scaffoldFrame01    | Scaffold   | —          | Core UI    |
 * | megaphoneCut01     | Megaphone  | —          | Core UI    |
 * | placardTorn01      | Placard    | —          | Core UI    |
 * | substrateTile01    | Substrate  | Megaphone  | Decorative |
 * | substrateTile02    | Substrate  | —          | Decorative |
 * | tearBanner01       | Tension    | —          | Tension    |
 * | brickWall01        | Tension    | —          | Tension    |
 */
export const SHAPE_ARCHETYPE_MAP: Record<
  string,
  {
    primary: ArchetypeName | 'Tension';
    secondary?: ArchetypeName | 'Signal';
    tier: 'Core UI' | 'Decorative' | 'Tension';
  }
> = {
  blockRiot01: { primary: 'Strike', secondary: 'Scaffold', tier: 'Core UI' },
  blockRiot02: { primary: 'Strike', secondary: 'March', tier: 'Core UI' },
  blockRiot03: { primary: 'Strike', tier: 'Core UI' },
  pillMarch01: { primary: 'March', secondary: 'Strike', tier: 'Core UI' },
  marchSurge01: { primary: 'March', tier: 'Core UI' },
  alertShard01: { primary: 'Strike', secondary: 'Signal', tier: 'Core UI' },
  scaffoldFrame01: { primary: 'Scaffold', tier: 'Core UI' },
  megaphoneCut01: { primary: 'Megaphone', tier: 'Core UI' },
  placardTorn01: { primary: 'Placard', tier: 'Core UI' },
  substrateTile01: { primary: 'Substrate', secondary: 'Megaphone', tier: 'Decorative' },
  substrateTile02: { primary: 'Substrate', tier: 'Decorative' },
  tearBanner01: { primary: 'Tension', tier: 'Tension' },
  brickWall01: { primary: 'Tension', tier: 'Tension' },
};
