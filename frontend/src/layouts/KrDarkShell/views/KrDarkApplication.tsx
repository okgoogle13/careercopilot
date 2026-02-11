import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ManifestoSlab, SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkApplication (Hi-Fi)
 * 
 * Formal engagement submission flow.
 * Features multi-step induction logic, drafting aesthetics, and botanical motivation prompts.
 */
export const KrDarkApplication: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto p-8 md:p-16 flex flex-col gap-12">
      {/* SECTION 1: The Engagement Header */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ManifestoSlab 
          title="Submit Engagement"
          subtitle="Induction Sequence: Step 01 // Motivation & Alignment"
          className="w-full"
        />
      </motion.div>

      {/* SECTION 2: The Drafting Core */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <SolidarityCard className="p-12 flex flex-col gap-10 relative overflow-hidden group hover:border-ink-gold/20 transition-colors">
          {/* TODO[asset]: Application Seal motif overlay (Z-1, 3% opacity) */}
          
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="font-annotation text-[10px] uppercase tracking-[0.4em] text-paper-white/40">Statement of Collective Intent</label>
              <span className="font-mono text-[9px] text-paper-white/20 uppercase">Word Count: 0/500</span>
            </div>
            
            <div className="relative">
              <textarea 
                className="w-full h-64 bg-asphalt-black/50 border border-white/5 rounded-stone p-8 font-body text-lg leading-relaxed text-paper-white placeholder:text-paper-white/10 focus:outline-none focus:border-ink-gold/40 focus:ring-1 focus:ring-ink-gold/10 transition-all duration-500 resize-none shadow-viscous"
                placeholder="Declare why your extracted mastery aligns with this specific tactical front line..."
              />
              <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
                <span className="font-mono text-[10px] uppercase tracking-widest">SUBSTRATE_V4.0</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-paper-white/30 uppercase tracking-widest mr-4">SEQUENCE:</span>
              <div className="flex gap-3">
                <div className="w-5 h-1 bg-ink-gold rounded-full shadow-ink-glow" />
                <div className="w-5 h-1 bg-white/10 rounded-full" />
                <div className="w-5 h-1 bg-white/10 rounded-full" />
              </div>
              <span className="font-mono text-[10px] text-paper-white/40 ml-4 group-hover:text-ink-gold transition-colors">01 / 03</span>
            </div>

            <div className="flex gap-4">
              <ActionButton 
                variant="secondary" 
                label="SAVE DRAFT" 
                className="px-8 py-4 text-[10px] tracking-widest" 
              />
              <ActionButton 
                variant="primary" 
                label="PROPOSE ENGAGEMENT" 
                className="px-12 py-4 text-[10px] tracking-[0.2em] shadow-viscous" 
              />
            </div>
          </div>
        </SolidarityCard>
      </motion.div>

      {/* SECTION 3: Contextual Sidebar Info (Desktop Only) */}
      <motion.div 
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center italic"
      >
        <p className="font-body text-xs text-paper-white/40">
          "Your statement will be audited by the collective station within 48 mission cycles."
        </p>
      </motion.div>
    </div>
  );
};
