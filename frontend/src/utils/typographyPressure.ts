import type { TypographyPressureProfile } from '../design/hero/heroTypes';

export interface CalculatedPressure {
  weight: number;
  tracking: number;
  contrast: number;
}

/**
 * Calculates variable typography settings based on scroll progress and a pressure profile.
 *
 * @param scrollProgress A value between 0 and 1 representing the scroll position.
 * @param profile The typography pressure profile to apply.
 * @returns An object containing calculated weight, tracking (as a fraction of width), and contrast factor.
 */
export function calculatePressure(
  scrollProgress: number,
  profile?: TypographyPressureProfile
): CalculatedPressure {
  // Safe clamped progress
  const progress = Math.max(0, Math.min(1, scrollProgress));

  // Fallback to a neutral state if no profile is provided
  if (!profile) {
    return {
      weight: 400 + progress * 300, // Default range 400->700
      tracking: 100, // Default width
      contrast: 1,
    };
  }

  const { weight_range, tracking_range, register, contrast_ratio } = profile;

  let weight = weight_range[0] + (weight_range[1] - weight_range[0]) * progress;
  let tracking = tracking_range[0] + (tracking_range[1] - tracking_range[0]) * progress;

  // Handle specific register behaviors if needed (e.g., oscillating for 'reflection')
  if (register === 'reflection') {
    // 4s period breathing effect could be added here, but for scroll-driven:
    // We add a subtle sine wave on top of the linear transition
    const breathing = Math.sin(progress * Math.PI * 4) * 25;
    weight += breathing;
  }

  return {
    weight: Math.round(weight),
    tracking: parseFloat(tracking.toFixed(2)),
    contrast: contrast_ratio,
  };
}

/**
 * Common emotional profiles based on the design brief.
 */
export const DEFAULT_PROFILES: Record<string, TypographyPressureProfile> = {
  defiance: {
    register: 'defiance',
    weight_range: [900, 800],
    tracking_range: [75, 120],
    contrast_ratio: 9,
  },
  reflection: {
    register: 'reflection',
    weight_range: [475, 500],
    tracking_range: [97.5, 97.5],
    contrast_ratio: 3,
  },
  discovery: {
    register: 'discovery',
    weight_range: [300, 700],
    tracking_range: [100, 100],
    contrast_ratio: 5,
  },
  control: {
    register: 'control',
    weight_range: [800, 900],
    tracking_range: [75, 75],
    contrast_ratio: 7,
  },
  craft: {
    register: 'craft',
    weight_range: [600, 700],
    tracking_range: [100, 100],
    contrast_ratio: 4,
  },
};
