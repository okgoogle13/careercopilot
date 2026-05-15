import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton, ManifestoSlab } from '../../../components/kerala-rage';

/**
 * KrDarkFeed (Hi-Fi)
 *
 * Strategic opportunity broadcast stream.
 * Features growth motifs, tactical result cards, and match-score pulse logic.
 * Standardized on SolidarityCard and ActionButton for ecosystem cohesion.
 */
export const KrDarkFeed: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const feed = [
    {
      id: 'OPP_01',
      title: 'Infrastructure Strategist',
      company: 'Collective Reach',
      timestamp: '2m ago',
      match: 98,
      desc: 'Coordinate the deployment of essential substrate across the KeralaRage sector. High-stacy involvement required.',
    },
    {
      id: 'OPP_02',
      title: 'Data Architect',
      company: 'Archive Prime',
      timestamp: '15m ago',
      match: 94,
      desc: 'Audit and consolidate legacy records into the active substrate. Requires mastery in extraction tactics.',
    },
    {
      id: 'OPP_03',
      title: 'Security Lead',
      company: 'Sentry Core',
      timestamp: '1h ago',
      match: 89,
      desc: 'Defend the collective perimeter against lower-tier probes. Direct action protocol authorized.',
    },
  ];

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto p-8 md:p-16 flex flex-col gap-12 overflow-hidden">
      {/* SECTION 1: The Broadcast Header */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-end"
      >
        <ManifestoSlab
          title="Opportunity Feed"
          subtitle="Strategic broadcast of mission-critical roles."
          className="w-full"
        />
        <div className="flex items-center gap-3 pb-4">
          <div className="w-2 h-2 rounded-march bg-ink-gold animate-pulse shadow-ink-glow" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-white/30">
            Live_Broadcast
          </span>
        </div>
      </motion.div>

      {/* SECTION 2: The Stream */}
      <div className="space-y-8">
        {feed.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
          >
            <SolidarityCard className="p-10 group relative border-[var(--kr-color-charcoal-background-steps-3)]/20 hover:border-ink-gold/20 transition-all duration-500 overflow-hidden">
              {/* TODO[asset]: Growth Motif overlay (Z-1, 5% opacity) */}

              <div className="flex flex-col md:flex-row gap-10 relative z-10">
                {/* Visual Anchor */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-march border border-[var(--kr-color-charcoal-background-steps-3)]/20 bg-asphalt-black flex items-center justify-center group-hover:border-ink-gold/30 transition-colors">
                    <span className="font-mono text-[10px] text-paper-white/20">{item.match}%</span>
                  </div>
                </div>

                {/* Content Core */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-proclamation text-3xl uppercase text-paper-white group-hover:text-ink-gold transition-colors duration-500">
                        {item.title}
                      </h3>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-paper-white/30">
                        {item.company} · {item.timestamp}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[8px] text-paper-white/20 uppercase">
                        ID: {item.id}
                      </span>
                    </div>
                  </div>

                  <p className="font-body text-base text-paper-white/50 leading-relaxed italic max-w-2xl">
                    &quot;{item.desc}&quot;
                  </p>

                  <div className="flex gap-4 pt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <ActionButton
                      variant="secondary"
                      label="DISMISS"
                      className="px-8 py-3 text-[10px] tracking-widest"
                    />
                    <ActionButton
                      variant="primary"
                      label="INVESTIGATE"
                      className="px-14 py-3 text-[10px] tracking-[0.2em] shadow-viscous"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Scan Lines */}
              <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ink-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </SolidarityCard>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3: Stream Metadata */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-12 text-center"
      >
        <span className="font-mono text-[8px] uppercase tracking-tighter text-paper-white/40">
          Showing 3 of 152 tactical matches // Filter: KERALA-RAGE_PR_7
        </span>
      </motion.div>
    </div>
  );
};
