import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ManifestoSlab, SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkAnalysis (Hi-Fi)
 *
 * Tactical capability audit.
 * Visualizes extracted mastery using staggered matrix and atmospheric radar elements.
 */
export const KrDarkAnalysis: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const skills = [
    { title: 'Strategic Logistics', mastery: 85, ref: 'LOG_ARCHIVE_A' },
    { title: 'Network Defense', mastery: 92, ref: 'DEF_ARCHIVE_B' },
    { title: 'Community Organizing', mastery: 74, ref: 'ORG_ARCHIVE_C' },
    { title: 'Data Architecture', mastery: 88, ref: 'ARC_ARCHIVE_D' },
    { title: 'Direct Action Tactics', mastery: 95, ref: 'TAC_ARCHIVE_E' },
    { title: 'Crisis Management', mastery: 68, ref: 'CRS_ARCHIVE_F' },
  ];

  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto p-8 md:p-16 flex flex-col gap-16 overflow-hidden">
      {/* SECTION 1: The Identified Core */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ManifestoSlab
          title="Identified Skill Sets"
          subtitle="Tactical extraction from the collective record."
          className="w-full"
        />
      </motion.div>

      {/* SECTION 2: The Skill Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.title}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
          >
            <SolidarityCard className="p-8 flex flex-col gap-8 relative group hover:border-ink-gold/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-proclamation text-2xl uppercase text-paper-white group-hover:text-ink-gold transition-colors">
                    {skill.title}
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/20">
                    SRC_ID: {skill.ref}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-march border border-[var(--kr-color-charcoal-background-steps-3)]/25 flex items-center justify-center">
                  <span className="font-mono text-[10px] text-ink-gold">{skill.mastery}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-paper-white/30">
                    Mastery Level
                  </span>
                  <span className="font-mono text-[9px] text-paper-white/30">{skill.mastery}%</span>
                </div>
                <div className="w-full bg-[var(--kr-color-charcoal-background-steps-3)]/20 h-1.5 rounded-march overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.mastery}%` }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { delay: 1 + i * 0.1, duration: 1.5, ease: 'circOut' }
                    }
                    className="bg-ink-gold h-full shadow-ink-glow"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--kr-color-charcoal-background-steps-3)]/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionButton
                  variant="secondary"
                  label="VIEW DETAILS"
                  size="sm"
                  className="w-full py-2 text-[9px] tracking-[0.2em]"
                />
              </div>
            </SolidarityCard>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3: The Radar Ambient Layer */}
      {/* TODO[asset]: Analysis Radar Motif overlay (Fixed position, Z-0, 5% opacity) */}

      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ delay: 2 }}
        className="mt-12 text-center"
      >
        <ActionButton
          variant="primary"
          label="GENERATE CONSOLIDATED REPORT"
          className="px-16 py-4 text-xs tracking-widest shadow-viscous"
        />
      </motion.div>
    </div>
  );
};
