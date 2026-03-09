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
      <div className="relative">
        <LayeredHero
          layers={heroData.layers}
          typography={heroData.typography}
          animation={heroData.animation}
          safeZones={heroData.safeZones}
          renderHints={heroData.renderHints}
        />

        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[min(90vw,860px)] rounded-placard border border-concrete-grey/35 bg-asphalt-black/70 backdrop-blur-md p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="font-primary text-paper-white text-sm md:text-base leading-relaxed">
              Transition from manifesto to action: capture your strongest role evidence and start
              the archive flow.
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-pebble px-5 py-2.5 font-primary font-semibold uppercase tracking-wide bg-ink-gold text-asphalt-black"
            >
              Begin Archive
            </a>
          </div>
        </div>
      </div>
    </KrDarkShell>
  );
};

export default LandingPage;
