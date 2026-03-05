import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkAuth (Hi-Fi)
 *
 * Secure entry to the Kerala Rage ecosystem.
 * Features atmospheric security motifs and federation typography.
 */
export const KrDarkAuth: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <div className="relative z-20 w-full min-h-[80vh] flex flex-col items-center justify-center p-8">
      {/* SECTION 1: The Secure Vault */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative"
      >
        {/* TODO[asset]: Authentication Shield Motif behind form (Z-1) */}

        <SolidarityCard className="p-10 flex flex-col items-center gap-8 relative overflow-hidden">
          {/* Security Scanning Line (Atmospheric) */}
          {!shouldReduceMotion && (
            <motion.div
              animate={{ y: [0, 400, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-gold/20 to-transparent z-10 pointer-events-none"
            />
          )}

          <div className="text-center space-y-2">
            <h2 className="font-proclamation text-4xl uppercase text-paper-white tracking-widest">
              Secure Station
            </h2>
            <p className="font-annotation text-[10px] uppercase tracking-[0.3em] text-paper-white/40">
              Identity Verification Required
            </p>
          </div>

          <div className="w-full space-y-6">
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase text-paper-white/30 ml-2">
                ID_STRING
              </label>
              <input
                type="text"
                placeholder="PROX_IDENTIFIER"
                className="w-full bg-asphalt-black/50 border border-surface-KrDark-concrete-grey-high/20 rounded-stone px-6 py-4 font-mono text-sm text-paper-white focus:outline-none focus:border-ink-gold/40 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase text-paper-white/30 ml-2">
                KEY_TOKEN
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-asphalt-black/50 border border-surface-KrDark-concrete-grey-high/20 rounded-stone px-6 py-4 font-mono text-sm text-paper-white focus:outline-none focus:border-ink-gold/40 transition-colors"
              />
            </div>

            <ActionButton
              variant="primary"
              label="ESTABLISH CONNECTION"
              className="w-full py-4 text-xs tracking-[0.2em]"
            />
          </div>

          <div className="pt-6 border-t border-surface-KrDark-concrete-grey-high/20 w-full text-center">
            <p className="font-body text-xs text-paper-white/30 italic">
              &quot;Collective security through individual defiance.&quot;
            </p>
          </div>
        </SolidarityCard>
      </motion.div>

      {/* SECTION 2: Technical Footer */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <span className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/40">
          ENCRYPTION: KERALA_RAGE_v4 // STATUS: SHIELD_ACTIVE
        </span>
      </motion.div>
    </div>
  );
};
