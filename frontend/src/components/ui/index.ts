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

export { Signal } from './Signal';
export type { SignalProps, SignalSeverity } from './Signal';

export { Vessel } from './Vessel';
export type { VesselProps } from './Vessel';

export { StatusBadge } from './StatusBadge';
export type { StatusBadgeProps, StatusBadgeVariant } from './StatusBadge';

export { KeralaRageButton } from './KeralaRageButton';
export type { KeralaRageButtonProps } from './KeralaRageButton';
export { KrIcon } from './KrIcon';
export type { KrIconName, KrIconProps } from './KrIcon';

export { AuroraHeader } from './AuroraHeader';
export { Mark } from './Mark';
export { SplitHeader } from './SplitHeader';
export { Valve } from './Valve';
export { NativeAnchor } from './NativeAnchor';
export type { NativeAnchorProps, AnchorRegister } from './NativeAnchor';

// =============================================================================
// @deprecated BACKWARD COMPATIBILITY EXPORTS
// These re-export from new archetype files. Migrate to the new names above.
// Will be removed in KR Solidarity v7.0.
// =============================================================================

/** @deprecated Use Strike instead */
export { Strike as Pebble } from './Strike';
export type { StrikeProps as PebbleProps } from './Strike';

/** @deprecated Use Placard instead */
export { Placard as Stone } from './Placard';
export type { PlacardProps as StoneProps } from './Placard';

/** @deprecated Use ScaffoldInput instead */
export {
  ScaffoldInput as Lens,
  ScaffoldArea as LensArea,
  ScaffoldArea as M3TextArea,
} from './ScaffoldInput';
export type {
  ScaffoldInputProps as LensProps,
  ScaffoldInputVariant as LensVariant,
  ScaffoldInputSize as LensSize,
} from './ScaffoldInput';

/** @deprecated Use March instead */
export { March as Jar } from './March';
export type { MarchProps as JarProps, MarchOption as JarOption } from './March';

/** @deprecated Use Megaphone instead */
export { Megaphone as Cabinet, Megaphone as M3Modal } from './Megaphone';
export type { MegaphoneProps as CabinetProps } from './Megaphone';

/** @deprecated Use Signal instead (Seed was a notification badge — now Signal) */
export { Signal as Seed } from './Signal';
