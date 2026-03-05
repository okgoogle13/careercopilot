import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkProfile (Hi-Fi)
 *
 * Tactical identity record.
 * Features station ID cards, extracted mastery summaries, and profile substrates.
 */
export const KrDarkProfile: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const stats = [
    { label: 'Tactical Missions', value: '24', color: 'text-ink-gold' },
    { label: 'Defiance Tier', value: 'Level 08', color: 'text-solidarity-red' },
    { label: 'Collective Ties', value: '342', color: 'text-solidarity-green' },
  ];

  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto p-8 md:p-16 flex flex-col items-center gap-16 overflow-hidden">
      {/* SECTION 1: The Identity Shield */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center gap-8"
      >
        <div className="relative group">
          {/* TODO[asset]: Profile Bio-Data Motif overlay (Z-1, 10% opacity) */}
          <div className="w-56 h-56 rounded-full bg-asphalt-black border-4 border-surface-KrDark-concrete-grey-high/20 flex items-center justify-center overflow-hidden shadow-viscous group-hover:border-ink-gold/20 transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-tr from-ink-gold/5 via-transparent to-solidarity-red/5 opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="font-proclamation text-7xl text-paper-white/10 group-hover:text-ink-gold/20 transition-colors">
              NAT
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-stone bg-ink-gold flex items-center justify-center shadow-ink-glow">
            <span className="font-mono text-xs font-bold text-asphalt-black">08</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="font-proclamation text-5xl md:text-7xl uppercase text-paper-white tracking-tighter">
            Archive_Naturalist_01
          </h1>
          <p className="font-annotation text-[10px] uppercase tracking-[0.5em] text-paper-white/30">
            REGISTERED: 2024.01.12 // SECTOR: NORTHCOTE_PR_7
          </p>
        </div>
      </motion.div>

      {/* SECTION 2: Tactical Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
          >
            <SolidarityCard className="p-10 flex flex-col items-center gap-4 group hover:border-surface-KrDark-concrete-grey-high/30 transition-colors">
              <span className="font-annotation text-[9px] uppercase tracking-[0.4em] text-paper-white/30 group-hover:text-paper-white/50 transition-colors">
                {stat.label}
              </span>
              <span className={`text-5xl font-bloom ${stat.color} tracking-tight`}>
                {stat.value}
              </span>
              <div className="mt-2 h-0.5 w-8 rounded-full bg-surface-KrDark-concrete-grey-high/25" />
            </SolidarityCard>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3: Mastery Matrix & Badges */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full"
      >
        <SolidarityCard className="w-full p-12 flex flex-col gap-10">
          <div className="flex justify-between items-center border-b border-surface-KrDark-concrete-grey-high/20 pb-8">
            <h3 className="font-proclamation text-2xl uppercase text-paper-white/80">
              Extracted Achievement Tokens
            </h3>
            <span className="font-mono text-[10px] text-paper-white/20 uppercase tracking-widest">
              Archive Integrity: 98.4%
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.05 }}
                className="aspect-square rounded-stone bg-surface-KrDark-concrete-grey-high/10 border border-surface-KrDark-concrete-grey-high/20 flex items-center justify-center hover:border-ink-gold/30 hover:shadow-ink-glow transition-all duration-500 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-surface-KrDark-concrete-grey-high/15 rounded-pebble group-hover:bg-ink-gold/20 transition-colors flex items-center justify-center">
                  <div
                    className={`w-4 h-4 rounded-full ${i % 2 === 0 ? 'bg-ink-gold/40' : 'bg-solidarity-red/40'} border border-surface-KrDark-concrete-grey-high/25`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </SolidarityCard>
      </motion.div>

      <div className="flex gap-6 mt-8">
        <ActionButton
          variant="secondary"
          label="DOWNLOAD MANIFESTO"
          className="px-10 py-4 text-[10px] tracking-widest"
        />
        <ActionButton
          variant="primary"
          label="MODIFY RECORD"
          className="px-16 py-4 text-[10px] tracking-[0.2em] shadow-viscous"
        />
      </div>
    </div>
  );
};
