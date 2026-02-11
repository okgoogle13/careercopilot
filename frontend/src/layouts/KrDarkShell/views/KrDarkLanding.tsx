import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ManifestoSlab, 
  ManifestoCard, 
  ActionButton 
} from '../../../components/kerala-rage';
import { LayeredHero } from '../../../components/kerala-rage/LayeredHero';
import type { SolidarityManifest } from '../../../design/hero/heroTypes';
import { loadHeroRegistry } from '../../../design/hero/heroRegistry';
import { composeHero } from '../../../utils/heroComposer';

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
    motion: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(manifest as SolidarityManifest, registry, 'layered-solidarity-hero');

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            motion: result.motion,
          });
        }
      } catch (error) {
        console.error('Failed to load hero:', error);
      }
    }
    loadHero();
  }, []);

  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center gap-24 p-8 md:p-24 overflow-hidden">
      {/* SECTION 1: The Layered Hero */}
      {heroData && (
        <LayeredHero
          layers={heroData.layers}
          typography={heroData.typography}
          motion={heroData.motion}
          className="mb-12"
        />
      )}

      {/* SECTION 2: The Manifesto Core */}
      <div className="grid lg:grid-cols-5 gap-16 items-center w-full">
        {/* Visual Anchor */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="lg:col-span-2 relative group"
        >
          {/* TODO[asset]: Elephant Motif overlay (Z-1) */}
          <div className="absolute inset-0 bg-ink-gold/5 blur-[120px] rounded-full scale-150" />
          <div className="relative aspect-[3/4] bg-asphalt-black rounded-stone border border-white/5 overflow-hidden shadow-viscous group-hover:border-ink-gold/20 transition-colors duration-700">
             <img 
               src="/src/assets/KrMotifs/the-sentry.png" 
               alt="The Sentry" 
               className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-asphalt-black/40 to-transparent" />
             <div className="absolute bottom-6 left-6">
               <span className="font-mono text-[10px] uppercase tracking-widest text-paper-white/30">
                 REF: SENTRY_ARCHIVE_01
               </span>
             </div>
          </div>
        </motion.div>

        {/* The Manifesto Card */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="lg:col-span-3"
        >
          <ManifestoCard 
            title="Career Resurrection"
            content="Your professional history is a KrMotif awaiting audit. Secure the past to claim the future through botanical precision and street-print defiance. Join the collective front line today."
            actionLabel="SECURE ACCESS"
            onAction={() => window.location.href = '/login'}
            className="w-full"
          />
        </motion.div>
      </div>

      {/* SECTION 3: Technical Context Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2 }}
        className="text-center space-y-6 pt-12 border-t border-white/5 w-full max-w-xs"
      >
         <div className="flex justify-between items-center px-4">
           <span className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/40">EST. 2026</span>
           <div className="h-px flex-1 bg-white/10 mx-4" />
           <span className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/40">SYS_V4.0</span>
         </div>
      </motion.div>

    </div>
  );
};
