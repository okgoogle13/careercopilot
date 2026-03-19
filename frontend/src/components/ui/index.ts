// =============================================================================
// KR SOLIDARITY v6.0 — SEMANTIC ACTION ARCHETYPES (canonical exports)
// Six archetypes define emotional/political role. Use these. See 01_CANON.md §2.C
// =============================================================================

/** Strike — Primary action, decisive CTA. Defiance. shape.block03 → shape.block02 active */
export { Strike } from './Strike';
export type { StrikeProps } from './Strike';

/** Placard — Content container, framing. Solidarity structure. shape.placardBase01 */
export { Placard } from './Placard';
export type { PlacardProps } from './Placard';

/** ScaffoldInput / ScaffoldArea — Structural form element. Immutable shape. shape.block02 */
export { ScaffoldInput, ScaffoldArea } from './ScaffoldInput';
export type {
  ScaffoldInputProps,
  ScaffoldAreaProps,
  ScaffoldInputVariant,
  ScaffoldInputSize,
} from './ScaffoldInput';

/** March — Sequential selection, collective flow. shape.block01 → shape.marchOpen01 morphs on open */
export { March } from './March';
export type { MarchProps, MarchOption } from './March';

/** Megaphone — Focal interruption, announcement. shape.megaphoneBase01 → typeSpringSlam */
export { Megaphone } from './Megaphone';
export type { MegaphoneProps } from './Megaphone';

// =============================================================================
// SHARED / UTILITY COMPONENTS (no archetype role)
// =============================================================================

export { Vessel } from './Vessel';
export type { VesselProps } from './Vessel';

export { StatusBadge } from './StatusBadge';
export type { StatusBadgeProps, StatusBadgeVariant } from './StatusBadge';

export { KeralaRageButton } from './KeralaRageButton';
export type { KeralaRageButtonProps } from './KeralaRageButton';
export { KrIcon } from './KrIcon';
export type { KrIconName, KrIconProps } from './KrIcon';

export { AuroraHeader } from './AuroraHeader';
export { Footer } from './Footer';
export type { FooterProps } from './Footer';
export { Mark } from './Mark';
export { SplitHeader } from './SplitHeader';
export { Valve } from './Valve';
export { NativeAnchor } from './NativeAnchor';
export type { NativeAnchorProps, AnchorRegister } from './NativeAnchor';
