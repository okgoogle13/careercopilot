/**
 * NORTHCOTE CURIO: MOTION PRESETS
 *
 * Framer Motion configuration presets for the Northcote Curio
 * design system physics.
 */

import tokens from '@/design/tokens/tokens.json';
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
    scale: tokens.motion.tactilePress.hover.scale,
    transition: {
      type: 'spring',
      stiffness: tokens.motion.tactilePress.hover.stiffness,
      damping: tokens.motion.tactilePress.hover.damping,
    },
  },
  tap: {
    scale: tokens.motion.tactilePress.tap.scale,
  },
};

/**
 * PHYSICS 2: POP-OUT (Parallax)
 * Used for Hero Graphics and Floating Elements.
 */
export const popOut: Variants = {
  rest: {
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
    },
  },
};

/**
 * Spring Transition Presets
 */
export const springs = {
  tactile: {
    type: 'spring' as const,
    stiffness: tokens.motion.springs.tactile.stiffness,
    damping: tokens.motion.springs.tactile.damping,
  },
  popOut: {
    type: 'spring' as const,
    stiffness: tokens.motion.springs.popOut.stiffness,
    damping: tokens.motion.springs.popOut.damping,
  },
} satisfies Record<string, Transition>;
