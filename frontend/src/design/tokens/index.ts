/**
 * Design Token Exports
 *
 * Northcote Curio design tokens for the CareerCopilot application.
 * Imported from tokens.json and re-exported for type-safe usage.
 */

import tokensData from './tokens.json';

export type TokenData = typeof tokensData;

/**
 * Complete design token object
 * Includes colors, typography, spacing, motion, and more
 */
export const tokens: TokenData = tokensData;

/**
 * Color tokens
 */
export const colors = tokens.color;

/**
 * Typography tokens (families, sizes, weights, line heights, letter spacing)
 */
export const typography = tokens.typography;

/**
 * Shape/Border radius tokens
 */
export const shape = tokens.shape;

/**
 * Spacing scale tokens
 */
export const spacing = tokens.spacing;

/**
 * Motion (easing, duration, patterns, springs)
 */
export const motion = tokens.motion;

/**
 * Texture (noise, dot grids)
 */
export const texture = tokens.texture;

/**
 * Elevation (shadows, z-index, borders)
 */
export const elevation = tokens.elevation;

/**
 * Component state layer opacity values
 */
export const state = tokens.state;

/**
 * Responsive breakpoints
 */
export const breakpoints = tokens.breakpoint;

/**
 * Utility: Get color by path
 * Example: getColor('primary.DEFAULT') → '#B4D8AE'
 */
export function getColor(path: string): string | undefined {
  const keys = path.split('.');
  let value: any = colors;

  for (const key of keys) {
    value = value?.[key];
    if (!value) return undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

/**
 * Utility: Get typography size by scale
 * Example: getTypographySize('bodyLarge') → { fontSize: '16px', lineHeight: '24px', ... }
 */
export function getTypographySize(scale: string) {
  return {
    fontSize: typography.size[scale as keyof typeof typography.size],
    lineHeight: typography.lineHeight[scale as keyof typeof typography.lineHeight],
    letterSpacing: typography.letterSpacing[scale as keyof typeof typography.letterSpacing],
  };
}

/**
 * Utility: Get motion easing curve
 * Example: getEasing('spring') → 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
 */
export function getEasing(curve: string): string | undefined {
  return motion.easing[curve as keyof typeof motion.easing];
}

/**
 * Utility: Get motion duration
 * Example: getDuration('medium2') → '300ms'
 */
export function getDuration(duration: string): string | undefined {
  return motion.duration[duration as keyof typeof motion.duration];
}

export default tokens;
