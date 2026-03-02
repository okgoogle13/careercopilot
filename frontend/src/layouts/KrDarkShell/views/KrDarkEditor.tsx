import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkEditor (Hi-Fi)
 * 
 * Tactical blueprint development.
 * Features dual-pane "Archive vs. Edit" logic, monospaced metadata, and the JETBRAINS_MONO code core.
 */
export const KrDarkEditor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <div className="relative z-20 w-full h-[85vh] flex flex-col overflow-hidden p-4 md:p-8 gap-6">
      {/* SECTION 1: The Command Bar */}
      <motion.div 
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-asphalt-black border border-surface-KrDark-concrete-grey-high/20 p-4 rounded-stone shadow-viscous"
      >
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-solidarity-red/60" />
            <div className="w-3 h-3 rounded-full bg-ink-gold/60" />
            <div className="w-3 h-3 rounded-full bg-paper-white/10" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-white/40">
            BLUEPRINT_V4.0 // delta-7.yaml
          </span>
        </div>
        <div className="flex gap-4">
          <ActionButton variant="secondary" label="VALIDATE" size="sm" className="px-6 py-2 text-[9px]" />
          <ActionButton variant="primary" label="COMMIT_ARCHIVE" size="sm" className="px-8 py-2 text-[9px]" />
        </div>
      </motion.div>

      {/* SECTION 2: The Dual-Pane Sanctuary */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Pane Left: The Source */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 overflow-hidden"
        >
          <SolidarityCard className="w-full h-full p-0 flex flex-col bg-asphalt-black overflow-hidden relative">
            <div className="bg-surface-KrDark-concrete-grey-high/10 px-6 py-3 border-b border-surface-KrDark-concrete-grey-high/20 flex justify-between">
              <span className="font-annotation text-[9px] uppercase tracking-widest text-paper-white/30">Source Architecture</span>
              <span className="font-mono text-[9px] text-paper-white/20">UTF-8</span>
            </div>
            {/* TODO[asset]: Code Matrix motif overlay (Z-1, 5% opacity) */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed text-paper-white/80">
              <pre>
{`# Solidarity Blueprint v1.0
mission:
  id: "delta-7"
  objective: "Refactor root infrastructure"
  priority: "CRITICAL"
  status: "ACTIVE_EXTRACTION"
  
tactics:
  - type: "code-injection"
    path: "/src/core"
    payload: "optimized-mesh-routing"
    stamina: 0.85
  - type: "signal-shift"
    alignment: "SOLIDARITY_RED"
    
governance:
  rule: "ANTI_SLOP"
  threshold: 0.95`}
              </pre>
            </div>
          </SolidarityCard>
        </motion.div>

        {/* Pane Right: The Evolution */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 overflow-hidden"
        >
          <SolidarityCard className="w-full h-full p-0 flex flex-col bg-asphalt-black overflow-hidden group">
            <div className="bg-ink-gold/5 px-6 py-3 border-b border-surface-KrDark-concrete-grey-high/20 group-hover:bg-ink-gold/10 transition-colors flex justify-between">
              <span className="font-annotation text-[9px] uppercase tracking-widest text-ink-gold/60">Extracted Preview</span>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-ink-gold animate-pulse" />
                <span className="font-mono text-[9px] text-ink-gold/40">SYNC_ACTIVE</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-8 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ink-gold/5 via-transparent to-transparent pointer-events-none" />
              <div className="w-24 h-24 rounded-full border border-ink-gold/20 flex items-center justify-center">
                {!shouldReduceMotion && <div className="w-16 h-16 rounded-full border border-ink-gold animate-ping opacity-20" />}
              </div>
              <p className="font-proclamation text-xl uppercase tracking-tighter text-paper-white/20">
                Awaiting Commit Sequence...
              </p>
            </div>
          </SolidarityCard>
        </motion.div>
      </div>

      {/* SECTION 3: Technical Metadata Footer */}
      <div className="flex justify-between items-center opacity-30 mt-2">
         <span className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/40">BRANCH: feature/kerala-rage</span>
         <div className="h-px w-32 bg-surface-KrDark-concrete-grey-high/20 mx-4 shrink" />
         <span className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/40">LOC: 48 // CRC: 0xA4F2</span>
      </div>

    </div>
  );
};
