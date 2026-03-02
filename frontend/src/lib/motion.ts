/**
 * KeralaRage KrSolidarity: MOTION PRESETS
 *
 * Framer Motion configuration presets for the KeralaRage KrSolidarity
 * design system physics.
 */

import type { Transition, Variants } from 'framer-motion';

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
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
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
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Spring Transition Presets using sys patterns if available
 */
export const springs = {
  tactile: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  popOut: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
  },
  m3Expressive: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
    mass: 1,
  },
} satisfies Record<string, Transition>;
