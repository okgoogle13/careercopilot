import React, { useEffect, useState } from 'react';
import { KrDarkShell } from '../../layouts/KrDarkShell/KrDarkShell';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import type { SolidarityManifest } from '../../design/hero/heroTypes';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { composeHero } from '../../utils/heroComposer';

export const LandingPage: React.FC = () => {
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(manifest as SolidarityManifest, registry, 'devotional-anchor-hero');

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation ?? result.motion,
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
    <>
      <LayeredHero
        layers={heroData.layers}
        typography={heroData.typography}
        animation={heroData.animation}
      />
      <KrDarkShell />
    </>
  );
};

export default LandingPage;
