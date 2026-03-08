import React, { useEffect, useState } from 'react';
import { KrDarkShell } from '../../layouts/KrDarkShell/KrDarkShell';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import type { SolidarityManifest } from '../../design/hero/heroTypes';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { resolvePageHeroComposition } from '../../design/hero/pageHeroMap';
import { composeHero } from '../../lib/composeHero';
import type { CompositionResult } from '../../lib/composeHero';

export const LandingPage: React.FC = () => {
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    safeZones?: any;
    renderHints?: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(
          manifest as SolidarityManifest,
          registry,
          resolvePageHeroComposition('landing-page')
        );

        if (!result.valid) {
          console.warn('[LandingPage] ComposeHero failed:', result.error);
        }

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation ?? result.motion,
            safeZones: result.safeZones,
            renderHints: result.renderHints,
          });
        }
      } catch (error) {
        console.error('Failed to load hero:', error);
      }
    }
    loadHero();
  }, []);

  if (!heroData) {
    return <KrDarkShell />;
  }

  return (
    <KrDarkShell>
      <LayeredHero
        layers={heroData.layers}
        typography={heroData.typography}
        animation={heroData.animation}
        safeZones={heroData.safeZones}
        renderHints={heroData.renderHints}
      />
    </KrDarkShell>
  );
};

export default LandingPage;
