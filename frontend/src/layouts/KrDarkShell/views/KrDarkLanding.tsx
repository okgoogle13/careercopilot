import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ManifestoCard } from '../../../components/kerala-rage';
import { LayeredHero } from '../../../components/kerala-rage/LayeredHero';
import { NativeAnchor } from '../../../components/ui';
import type { SolidarityManifest } from '../../../design/hero/heroTypes';
import { composeHero } from '../../../lib/composeHero';
import { loadHeroRegistry } from '../../../design/hero/heroRegistry';
import {
  getDefaultVariant,
  getHeroForVariant,
  LANDING_HERO_AB_CONFIG,
  AbVariant,
} from '../../../utils/heroAbTesting';

/**
 * KrDarkLanding (Hi-Fi)
 *
 * The primary entrance to the Kerala Rage experience.
 * High-authority proclamation with tactile motion and federation typography.
 */
export const KrDarkLanding: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
    safeZones?: any;
    renderHints?: any;
  } | null>(null);
  const [variant, setVariant] = useState<AbVariant>(() =>
    getDefaultVariant(LANDING_HERO_AB_CONFIG.testId)
  );

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const assignedHero = getHeroForVariant(registry, LANDING_HERO_AB_CONFIG, variant);
        const result = composeHero(
          manifest as SolidarityManifest,
          registry,
          assignedHero?.id || 'layered-solidarity-hero'
        );

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation,
            zIndexMap: result.zIndexMap,
            safeZones: result.safeZones,
            renderHints: result.renderHints,
          });
        }
      } catch (error) {
        console.error('Failed to load hero:', error);
      }
    }
    loadHero();
  }, [variant]);

  const toggleVariant = () => {
    setVariant((currentVariant) => (currentVariant === 'A' ? 'B' : 'A'));
  };

  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center gap-24 p-8 md:p-24 overflow-hidden">
      {/* SECTION 1: The Layered Hero */}
      {heroData && (
        <div className="relative w-full">
          <LayeredHero
            layers={heroData.layers}
            typography={heroData.typography}
            animation={heroData.animation}
            zIndexMap={heroData.zIndexMap}
            safeZones={heroData.safeZones}
            renderHints={heroData.renderHints}
            className="mb-12"
          />
          {/* Debug Variant Toggle */}
          <button
            onClick={toggleVariant}
            className="absolute bottom-4 right-4 z-[100] rounded px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper-white/60 transition-all bg-surface-KrDark-slate-smoke-high/80 border border-ink-gold/20 hover:text-paper-white hover:bg-surface-KrDark-slate-smoke-highest/90"
          >
            Switch Register (Current: {variant})
          </button>
        </div>
      )}

      {/* SECTION 2: The Manifesto Core */}
      <div className="grid lg:grid-cols-5 gap-16 items-center w-full">
        {/* Visual Anchor */}
        <NativeAnchor
          assetId="KR-SOLID-033"
          register="Defiance"
          className="lg:col-span-2"
          zIndex={10}
        />

        {/* The Manifesto Card */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="lg:col-span-3"
        >
          <ManifestoCard
            title="Career Resurrection"
            content="Your professional history is a KrMotif awaiting audit. Secure the past to claim the future through deliberate craft and street-print defiance. Join the collective front line today."
            actionLabel="SECURE ACCESS"
            onAction={() => (window.location.href = '/login')}
            className="w-full"
          />
        </motion.div>
      </div>

      {/* SECTION 3: Technical Context Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2 }}
        className="text-center space-y-6 pt-12 border-t border-surface-KrDark-concrete-grey-high/20 w-full max-w-xs"
      >
        <div className="flex justify-between items-center px-4">
          <span className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/40">
            EST. 2026
          </span>
          <div className="h-px flex-1 bg-surface-KrDark-concrete-grey-high/25 mx-4" />
          <span className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/40">
            SYS_V4.0
          </span>
        </div>
      </motion.div>
    </div>
  );
};
