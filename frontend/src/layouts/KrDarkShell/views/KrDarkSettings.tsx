import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkSettings (Hi-Fi)
 *
 * System parameter configuration.
 * Features categorical grouping, high-stasis toggle interactions, and federation typography.
 */
export const KrDarkSettings: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const categories = [
    {
      id: 'identity',
      title: 'Identity & Presence',
      settings: [
        {
          label: 'Broadcast Profile',
          desc: 'Make your solidarity record visible to the collective.',
          active: true,
        },
        {
          label: 'Tactical Anonymity',
          desc: 'Mask precise metadata from lower-tier probes.',
          active: false,
        },
      ],
    },
    {
      id: 'interface',
      title: 'Interface Substrate',
      settings: [
        {
          label: 'Dark Mode Substrate',
          desc: 'Use the deep charcoal aesthetic by default.',
          active: true,
        },
        {
          label: 'High-Contrast Defiance',
          desc: 'Enhance visibility for critical mission parameters.',
          active: false,
        },
      ],
    },
  ];

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto p-8 md:p-16 flex flex-col gap-16 overflow-hidden">
      {/* SECTION 1: The Parameters Header */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <h1 className="font-proclamation text-5xl md:text-7xl uppercase text-paper-white tracking-tighter">
          System Parameters
        </h1>
        <p className="font-annotation text-[10px] uppercase tracking-[0.4em] text-paper-white/30">
          STATION: KERALA_RAGE_v4 // CONFIG_CORE
        </p>
      </motion.div>

      {/* SECTION 2: The Settings Registry */}
      <div className="space-y-12">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-6">
              <h2 className="font-proclamation text-2xl uppercase text-paper-white/80 shrink-0">
                {cat.title}
              </h2>
              <div className="h-px flex-1 bg-surface-KrDark-concrete-grey-high/20" />
            </div>

            <div className="space-y-4">
              {cat.settings.map((setting) => (
                <SolidarityCard
                  key={setting.label}
                  className="p-10 group hover:border-surface-KrDark-concrete-grey-high/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-12">
                    <div className="space-y-2">
                      <h4 className="font-proclamation text-xl uppercase text-paper-white/90 group-hover:text-ink-gold transition-colors">
                        {setting.label}
                      </h4>
                      <p className="font-body text-sm text-paper-white/40 leading-relaxed italic max-w-lg">
                        {setting.desc}
                      </p>
                    </div>

                    {/* Toggle Interaction */}
                    <div
                      className={`w-14 h-7 rounded-full relative cursor-pointer transition-colors duration-500 pb-px ${setting.active ? 'bg-ink-gold' : 'bg-surface-KrDark-concrete-grey-high/10 border border-surface-KrDark-concrete-grey-high/20 shadow-inner'}`}
                    >
                      <motion.div
                        animate={setting.active ? { x: 28 } : { x: 4 }}
                        className={`absolute top-1 w-5 h-5 rounded-full shadow-viscous ${setting.active ? 'bg-asphalt-black' : 'bg-paper-white/20'}`}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 500, damping: 30 }
                        }
                      />
                    </div>
                  </div>
                </SolidarityCard>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Security Section */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SolidarityCard className="p-10 border-solidarity-red/10 bg-solidarity-red/[0.02]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="font-proclamation text-xl uppercase text-solidarity-red">
                  Crucial Security Rotation
                </h4>
                <p className="font-body text-sm text-paper-white/40 italic">
                  Invalidate current session tokens and rotate encryption seeds.
                </p>
              </div>
              <ActionButton
                variant="secondary"
                label="ROTATE ENCRYPTION KEYS"
                className="border-solidarity-red text-solidarity-red hover:bg-solidarity-red hover:text-paper-white transition-all px-10 py-3 text-[10px]"
              />
            </div>
          </SolidarityCard>
        </motion.div>
      </div>

      {/* SECTION 3: The Command Linkage */}
      <div className="flex justify-end items-center gap-8 mt-12 py-10 border-t border-surface-KrDark-concrete-grey-high/20">
        <ActionButton
          variant="secondary"
          label="RESET DEFAULTS"
          className="px-10 py-4 text-[10px] tracking-widest text-paper-white/20"
        />
        <ActionButton
          variant="primary"
          label="COMMIT CHANGES"
          className="px-16 py-4 text-[10px] tracking-[0.2em] shadow-viscous"
        />
      </div>

      {/* Deployment Metadata */}
      <div className="text-center opacity-10">
        <span className="font-mono text-[8px] uppercase tracking-[0.5em]">
          SYSTEM_VERSION: 4.0.12 // SUBSTRATE_HASH: 0x82C7
        </span>
      </div>
    </div>
  );
};
