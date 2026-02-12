import { HeroComposition, HeroRegistry } from '../design/hero/heroTypes';

export type AbVariant = 'A' | 'B';

export interface AbTestConfig {
  testId: string;
  variants: {
    A: string; // heroId for variant A
    B: string; // heroId for variant B
  };
}

const STORAGE_KEY_PREFIX = 'kr_hero_ab_';

/**
 * Gets or assigns a variant (A or B) for a specific test ID.
 * Persists the choice in localStorage.
 */
export function getAssignedVariant(testId: string): AbVariant {
  const storageKey = `${STORAGE_KEY_PREFIX}${testId}`;
  const saved = localStorage.getItem(storageKey);

  if (saved === 'A' || saved === 'B') {
    return saved as AbVariant;
  }

  const assigned: AbVariant = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem(storageKey, assigned);
  return assigned;
}

/**
 * Retrieves the appropriate hero composition based on the assigned A/B variant.
 */
export function getHeroForVariant(
  registry: HeroRegistry,
  config: AbTestConfig
): HeroComposition | undefined {
  const variant = getAssignedVariant(config.testId);
  const heroId = config.variants[variant];
  return registry.compositions.find((c) => c.id === heroId);
}

/**
 * Default A/B test configuration for the landing page hero.
 * Compares 'Defiance' (Resistance) vs 'Reflection' (Spiritual).
 */
export const LANDING_HERO_AB_CONFIG: AbTestConfig = {
  testId: 'landing_hero_register',
  variants: {
    A: 'bhagat-singh-resistance', // Defiance
    B: 'shiva-monolith-spiritual', // Reflection
  },
};
