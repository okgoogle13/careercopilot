/**
 * KeralaRage KrSolidarity: MOTION PRESETS
 *
 * Framer Motion configuration presets for the KeralaRage KrSolidarity
 * design system physics.
 */

import type { Transition, Variants } from 'framer-motion';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

/**
 * PHYSICS 1: TACTILE PRESS
 * Used for Cards and Buttons. Elements press *in* instead of lifting up.
 */
export const tactilePress: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 0.98, // Fallback if missing in tokens
    transition: KrDarkSpring,
  },
  tap: {
    scale: 0.95,
  },
};

/**
 * PHYSICS 2: POP-OUT (Parallax)
 * Used for Hero Graphics and Floating Elements.
 */
export const popOut: Variants = {
  rest: {
    y: 0,
    rotate: 0,
    scale: 1,
  },
  hover: {
    y: -4,
    rotate: 1,
    scale: 1.02,
    transition: KrDarkSpring,
  },
};

/**
 * Spring Transition Presets using sys patterns if available
 */
export const springs = {
  tactile: KrDarkSpring,
  popOut: KrDarkSpring,
  m3Expressive: KrDarkSpring,
} satisfies Record<string, Transition>;
