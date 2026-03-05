import { HeroComposition, HeroRegistry } from '../design/hero/heroTypes';

export type AbVariant = 'A' | 'B';

export interface AbTestConfig {
  testId: string;
  variants: {
    A: string; // heroId for variant A
    B: string; // heroId for variant B
  };
}

/**
 * Derives a stable default variant without using browser storage.
 */
export function getDefaultVariant(testId: string): AbVariant {
  const checksum = Array.from(testId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return checksum % 2 === 0 ? 'A' : 'B';
}

/**
 * Retrieves the appropriate hero composition based on the assigned A/B variant.
 */
export function getHeroForVariant(
  registry: HeroRegistry,
  config: AbTestConfig,
  variant?: AbVariant
): HeroComposition | undefined {
  const resolvedVariant = variant ?? getDefaultVariant(config.testId);
  const heroId = config.variants[resolvedVariant];
  return registry.compositions.find((c) => c.id === heroId);
}

/**
 * Default A/B test configuration for the landing page hero.
 * Compares 'Defiance' (Resistance) vs 'Reflection' (Spiritual).
 */
export const LANDING_HERO_AB_CONFIG: AbTestConfig = {
  testId: 'landing_hero_register',
  variants: {
    A: 'kr-hero-industrial-collective-005', // Industrial Collective
    B: 'kr-hero-digital-sovereignty-006', // Digital Sovereignty
  },
};
