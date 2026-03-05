import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ManifestoSlab, SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkDashboard (Hi-Fi)
 *
 * Tactical central command.
 * Features high-stasis metric cards, a simulated "Live Archive" feed, and heartbeat motifs.
 */

const ValueReveal = ({
  value,
  shouldReduceMotion,
}: {
  value: string;
  shouldReduceMotion: boolean;
}) => {
  if (shouldReduceMotion) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {value}
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.5, ease: 'circOut' }}
    >
      {value}
    </motion.span>
  );
};

export const KrDarkDashboard: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const metrics = [
    { label: 'RESUME_ALIGNMENT', value: '85%', color: 'text-ink-gold', ref: 'ALGN_01' },
    { label: 'MISSION_READY', value: '12', color: 'text-solidarity-red', ref: 'RDY_02' },
    { label: 'OPPORTUNITY_SCORE', value: '74', color: 'text-solidarity-green', ref: 'SCR_03' },
    { label: 'NETWORK_STRENGTH', value: 'LOW', color: 'text-clinical-alert', ref: 'NET_04' },
  ];

  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto p-8 md:p-16 flex flex-col gap-16 overflow-hidden">
      {/* SECTION 1: Command Header */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ManifestoSlab
          title="Command Center"
          subtitle="Tactical Dashboard v4.1 // Station: KERALA_RAGE_v4"
          className="w-full"
        />
      </motion.div>

      {/* SECTION 2: Metric Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
          >
            <SolidarityCard className="flex flex-col justify-between aspect-square p-10 group hover:border-ink-gold/20 transition-all duration-500 relative overflow-hidden shadow-viscous">
              <div className="space-y-1">
                <span className="font-annotation text-xs uppercase tracking-[0.4em] text-paper-white/30 group-hover:text-paper-white/50 transition-colors">
                  {m.label}
                </span>
                <p className="font-mono text-[10px] text-paper-white/10 uppercase tracking-widest">
                  {m.ref}
                </p>
              </div>

              <div
                className={`text-5xl font-bloom ${m.color} tracking-tighter group-hover:scale-105 transition-transform duration-700 relative z-10`}
              >
                <ValueReveal
                  value={m.value}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>

              {/* Substrate Pulse: Subtle radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ink-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

              <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-10 transition-opacity">
                <div className="w-12 h-12 rounded-full border border-current" />
              </div>
            </SolidarityCard>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3: Live Archive Feed */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-full"
      >
        <SolidarityCard className="w-full p-12 relative overflow-hidden bg-asphalt-black group">
          <div className="flex justify-between items-center mb-8 border-b border-surface-KrDark-concrete-grey-high/20 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-ink-gold animate-pulse" />
              <h3 className="font-proclamation text-2xl uppercase text-paper-white/80">
                Live Archive Stream
              </h3>
            </div>
            <span className="font-mono text-[10px] text-paper-white/20 uppercase tracking-widest">
              SUBSTRATE_FEED_ACTV
            </span>
          </div>

          {/* TODO[asset]: Heartbeat motif pulse center (Z-0, 5% opacity) */}

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-8 items-center border-b border-surface-KrDark-concrete-grey-high/20 pb-4 last:border-0 opacity-40 hover:opacity-100 transition-opacity"
              >
                <span className="font-mono text-[10px] text-ink-gold">0{i}_REG</span>
                <p className="font-body text-base text-paper-white/60 italic">
                  "Historical resistance record {i} successfully extracted and aligned with current
                  mission parameters."
                </p>
                <span className="ml-auto font-mono text-[9px] text-paper-white/20">2m ago</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <ActionButton
              variant="secondary"
              label="OPEN FULL ARCHIVE"
              className="px-12 py-4 text-[10px] tracking-widest"
            />
          </div>
        </SolidarityCard>
      </motion.div>

      {/* Deployment Metadata */}
      <div className="flex flex-col items-center gap-4 opacity-10">
        <div className="h-px w-64 bg-surface-KrDark-concrete-grey-high/20" />
        <span className="font-mono text-[8px] uppercase tracking-[0.5em]">
          KERALA_RAGE_CORE // CMD_CTR_ENABLE
        </span>
      </div>
    </div>
  );
};
