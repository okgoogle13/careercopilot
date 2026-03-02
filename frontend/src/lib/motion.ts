/**
<<<<<<< HEAD
 * NORTHCOTE CURIO: MOTION PRESETS
 *
 * Framer Motion configuration presets for the 
 * design system physics.
 */

import tokens from '@/design/tokens/tokens.json';
=======
 * KeralaRage KrSolidarity: MOTION PRESETS
 *
 * Framer Motion configuration presets for the KeralaRage KrSolidarity
 * design system physics.
 */

>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
    scale: tokens.motion.tactilePress.hover.scale,
    transition: {
      type: 'spring',
      stiffness: tokens.motion.tactilePress.hover.stiffness,
      damping: tokens.motion.tactilePress.hover.damping,
    },
  },
  tap: {
    scale: tokens.motion.tactilePress.tap.scale,
=======
    scale: 0.98, // Fallback if missing in tokens
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.95,
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },
};

/**
 * PHYSICS 2: POP-OUT (Parallax)
 * Used for Hero Graphics and Floating Elements.
 */
export const popOut: Variants = {
  rest: {
<<<<<<< HEAD
    y: tokens.motion.popOut.rest.y,
    rotate: tokens.motion.popOut.rest.rotate,
    scale: tokens.motion.popOut.rest.scale,
  },
  hover: {
    y: tokens.motion.popOut.hover.y,
    rotate: tokens.motion.popOut.hover.rotate,
    scale: tokens.motion.popOut.hover.scale,
    transition: {
      type: 'spring',
      stiffness: tokens.motion.popOut.hover.stiffness,
      damping: tokens.motion.popOut.hover.damping,
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
    },
  },
};

/**
<<<<<<< HEAD
 * Spring Transition Presets
=======
 * Spring Transition Presets using sys patterns if available
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export const springs = {
  tactile: {
    type: 'spring' as const,
<<<<<<< HEAD
    stiffness: tokens.motion.springs.tactile.stiffness,
    damping: tokens.motion.springs.tactile.damping,
  },
  popOut: {
    type: 'spring' as const,
    stiffness: tokens.motion.springs.popOut.stiffness,
    damping: tokens.motion.springs.popOut.damping,
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },
} satisfies Record<string, Transition>;
