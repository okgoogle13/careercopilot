import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ManifestoSlab, SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkIngestion (Hi-Fi)
 * 
 * Tactical data entry station.
 * High-stasis dropzone with blueprint grid substrate and bold proclamation typography.
 */
export const KrDarkIngestion: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto p-8 md:p-16 flex flex-col gap-16">
      {/* SECTION 1: The Feed Proclamation */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <ManifestoSlab 
          title="Feed the Archive"
          subtitle="Secure Data Ingestion Station"
          className="w-full"
        />
      </motion.div>

      {/* SECTION 2: The Tactical Dropzone */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <div className="relative group cursor-pointer">
          {/* Z-0: TODO[asset]: Blueprint Grid Substrate overlay (12% opacity) */}
          <div className="absolute inset-0 bg-solidarity-red/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="flex flex-col items-center justify-center p-24 border-2 border-dashed border-white/10 rounded-stone bg-asphalt-black/40 backdrop-blur-sm group-hover:border-solidarity-red/40 transition-all duration-700 shadow-viscous group-hover:shadow-ink-glow">
            <div className="mb-8 relative">
              <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center text-paper-white/20 group-hover:text-solidarity-red group-hover:border-solidarity-red/40 transition-colors duration-500">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>

            <p className="text-paper-white/60 mb-8 font-body text-2xl tracking-tight text-center max-w-sm">
              DEPOSIT RESUME OR DATA SUBSTRATE FOR AUDIT
            </p>

            <ActionButton variant="secondary" label="BROWSE ARCHIVE_01" className="px-10 py-3 text-[10px] tracking-[0.3em]" />

            <div className="absolute bottom-6 right-8">
              <span className="font-mono text-[8px] uppercase tracking-widest text-paper-white/20 group-hover:text-solidarity-red/40 transition-colors">
                STATUS: READY_FOR_FEED
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 3: The Command Link */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex justify-center"
      >
        <ActionButton variant="primary" label="PROCESS INGESTION" className="px-16 py-5 text-sm tracking-widest shadow-viscous" />
      </motion.div>

      {/* Footer Info */}
      <div className="mt-12 text-center opacity-20">
        <p className="font-mono text-[9px] uppercase tracking-tighter">
          Supported Formats: PDF / YAML / JSON / COLLECTIVE_FRAGMENTS
        </p>
      </div>
    </div>
  );
};
