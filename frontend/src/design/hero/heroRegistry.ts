import type { HeroRegistry, HeroComposition } from './heroTypes';

const FALLBACK_REGISTRY: HeroRegistry = {
  version: '1.0.0',
  registry_name: 'kerala-rage-hero-compositions',
  last_updated: '2026-02-12',
  compositions: [
    {
      id: 'fallback-hero',
      name: 'Fallback Hero',
      layers: [
        {
          type: 'substrate',
          asset_id: 'KR-SOLID-033',
          z_index: 1,
          opacity: 0.6,
          blend_mode: 'normal',
          position: 'cover',
        },
      ],
      typography: {
        headline: 'Solidarity Across Borders',
        supporting: 'First Nations, Kerala, Global Resistance',
        pressure_state: { wght: 900, wdth: 75 },
        solidarity_state: { wght: 800, wdth: 120 },
        melancholy_state: { wght: 475, wdth: 97.5 },
      },
      motion: {
        bezier: [0.34, 1.56, 0.64, 1],
        parallax: false,
        scroll_behavior: 'weight_shift',
        transition_duration: 400,
      },
    },
  ],
};

let cachedRegistry: HeroRegistry | null = null;

export async function loadHeroRegistry(): Promise<HeroRegistry> {
  if (cachedRegistry) {
    return cachedRegistry;
  }

  try {
    const response = await fetch('/assets/kr-solidarity-hero-registry.json');
    if (!response.ok) {
      console.warn('Hero registry fetch failed, using fallback');
      cachedRegistry = FALLBACK_REGISTRY;
      return FALLBACK_REGISTRY;
    }
    const registry = (await response.json()) as HeroRegistry;
    cachedRegistry = registry;
    return registry;
  } catch (error) {
    console.error('Error loading hero registry:', error);
    cachedRegistry = FALLBACK_REGISTRY;
    return FALLBACK_REGISTRY;
  }
}


