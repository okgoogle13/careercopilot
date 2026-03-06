import type { HeroRegistry, HeroComposition } from './heroTypes';

const FALLBACK_REGISTRY: HeroRegistry = {
  version: '3.1.0',
  registry_name: 'kerala-rage-hero-compositions',
  last_updated: '2026-03-05',
  compositions: [
    {
      id: 'fallback-hero',
      name: 'Fallback Hero',
      landing_default: true,
      layers: [
        {
          type: 'substrate',
          asset_id: 'KR-SOLID-038',
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

export async function loadHeroRegistry(forceReload: boolean = false): Promise<HeroRegistry> {
  if (cachedRegistry && !forceReload) {
    return cachedRegistry;
  }

  const base = (import.meta as any).env?.BASE_URL || '';
  const url = `${base}/assets/kr-solidarity-hero-registry.json`.replace(/\/+/g, '/');

  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      console.warn('Hero registry fetch failed, using fallback');
      cachedRegistry = FALLBACK_REGISTRY;
      return FALLBACK_REGISTRY;
    }
    const registry = (await response.json()) as HeroRegistry;

    // Runtime validation
    if (
      !registry.version ||
      !registry.registry_name ||
      !Array.isArray(registry.compositions) ||
      registry.compositions.length === 0
    ) {
      console.error('Invalid registry format detected', registry);
      cachedRegistry = FALLBACK_REGISTRY;
      return FALLBACK_REGISTRY;
    }

    cachedRegistry = registry;
    return registry;
  } catch (error) {
    console.error('Error loading hero registry:', error);
    cachedRegistry = FALLBACK_REGISTRY;
    return FALLBACK_REGISTRY;
  }
}
