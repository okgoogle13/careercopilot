import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkDesigner (Hi-Fi)
 *
 * Creative assembly canvas.
 * Features an asset reservoir, assembly canvas with parallax grid motifs, and bold command logic.
 */
export const KrDarkDesigner: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <div className="relative z-20 w-full h-[90vh] flex flex-col overflow-hidden bg-asphalt-black">
      {/* SECTION 1: The Design Command Bar */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-20 bg-asphalt-black border-b border-[var(--kr-color-charcoal-background-steps-3)]/20 flex items-center px-10 gap-6 shadow-viscous"
      >
        <div className="flex gap-3 pr-6 border-r border-[var(--kr-color-charcoal-background-steps-3)]/20">
          <ActionButton
            variant="secondary"
            label="SELECT"
            size="sm"
            className="px-4 py-2 text-[9px] tracking-widest"
          />
          <ActionButton
            variant="secondary"
            label="LAYOUT"
            size="sm"
            className="px-4 py-2 text-[9px] tracking-widest"
          />
          <ActionButton
            variant="secondary"
            label="PREVIEW"
            size="sm"
            className="px-4 py-2 text-[9px] tracking-widest"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-white/30">
            PROJECT_ID: KR_SOLIDARITY_01
          </span>
          <div className="w-1.5 h-1.5 rounded-march bg-ink-gold animate-pulse" />
        </div>

        <div className="ml-auto flex gap-4">
          <ActionButton
            variant="primary"
            label="EXPORT MANIFEST"
            size="sm"
            className="px-8 py-2 text-[9px] tracking-widest"
          />
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden">
        {/* SECTION 2: The Asset Reservoir */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-80 bg-asphalt-black border-r border-[var(--kr-color-charcoal-background-steps-3)]/20 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-paper-white/40">
              Asset Reservoir
            </h4>
            <div className="h-px w-full bg-[var(--kr-color-charcoal-background-steps-3)]/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                className="aspect-square bg-[var(--kr-color-charcoal-background-steps-3)]/10 rounded-megaphone border border-[var(--kr-color-charcoal-background-steps-3)]/20 hover:border-ink-gold/30 flex items-center justify-center cursor-move transition-all duration-300 group shadow-viscous"
              >
                <div className="w-10 h-10 bg-[var(--kr-color-charcoal-background-steps-3)]/15 rounded-pebble group-hover:bg-ink-gold/10 transition-colors flex items-center justify-center">
                  <span className="font-mono text-[8px] text-paper-white/20 select-none">
                    M_0{i}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-[var(--kr-color-charcoal-background-steps-3)]/20">
            <p className="font-body text-[10px] text-paper-white/20 italic">
              &quot;Drag elements onto the assembly canvas for tactical registration.&quot;
            </p>
          </div>
        </motion.div>

        {/* SECTION 3: The Assembly Canvas */}
        <div className="flex-1 bg-asphalt-black p-16 overflow-hidden flex items-center justify-center relative group">
          {/* TODO[asset]: Studio Grid Motif overlay (Z-1, parallax enabled on mouse move) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-paper-white/[0.02] via-transparent to-transparent pointer-events-none" />

          <SolidarityCard className="w-full h-full max-w-5xl max-h-[90%] border-dashed border-[var(--kr-color-charcoal-background-steps-3)]/25 flex flex-col items-center justify-center bg-asphalt-black/40 backdrop-blur-[2px] relative cursor-crosshair">
            <div className="absolute inset-4 border border-[var(--kr-color-charcoal-background-steps-3)]/20 rounded-megaphone border-dashed pointer-events-none opacity-40" />

            <div className="text-center space-y-6">
              <span className="font-proclamation text-6xl uppercase tracking-tighter text-paper-white/5 select-none">
                ASSEMBLY_CANVAS
              </span>
              <div className="flex justify-center gap-12 text-paper-white/10 font-mono text-[10px] uppercase tracking-[0.5em]">
                <span>X: 0.00</span>
                <span>Y: 0.00</span>
                <span>Z: 1.00</span>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 pointer-events-none">
              <span className="font-mono text-[8px] uppercase tracking-widest text-paper-white/10">
                STATION_V4_CORE
              </span>
            </div>
          </SolidarityCard>
        </div>
      </div>
    </div>
  );
};
