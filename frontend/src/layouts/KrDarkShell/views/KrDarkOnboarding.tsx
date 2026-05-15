import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton } from '../../../components/kerala-rage';

/**
 * KrDarkOnboarding (Hi-Fi)
 *
 * Guided sequence to initialize the user profile.
 * High-stasis transitions with bold proclamation typography.
 */
export const KrDarkOnboarding: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const steps = [
    {
      title: 'Define Identity',
      desc: 'Establish your unique designation within the collective archive.',
    },
    { title: 'Audit History', desc: 'Extract and verify tactical experience from legacy sources.' },
    { title: 'Secure Reach', desc: 'Configure broadcast parameters for mission discovery.' },
  ];

  return (
    <div className="relative z-20 w-full min-h-[80vh] flex flex-col items-center justify-center p-8 md:p-16">
      {/* SECTION 1: The Induction Header */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16 space-y-4"
      >
        <h1 className="font-proclamation text-5xl md:text-7xl uppercase text-paper-white tracking-widest">
          Welcome, Field Agent.
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-solidarity-red/80">
          Initializing Induction Protocol
        </p>
      </motion.div>

      {/* SECTION 2: The Step Matrix */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.2, duration: 0.8 }}
          >
            <SolidarityCard className="p-8 h-full flex flex-col gap-6 relative group border-[var(--kr-color-charcoal-background-steps-3)]/20 hover:border-ink-gold/20 transition-colors">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-[10px] text-paper-white/20">STEP_0{idx + 1}</span>
                <div className="mx-4 h-px flex-1 bg-[var(--kr-color-charcoal-background-steps-3)]/20" />
                <div
                  className={`w-2 h-2 rounded-march ${idx === 0 ? 'bg-ink-gold shadow-ink-glow' : 'bg-[var(--kr-color-charcoal-background-steps-3)]/30'}`}
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-proclamation text-2xl uppercase text-paper-white/90 group-hover:text-ink-gold transition-colors">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-paper-white/40 leading-relaxed">{step.desc}</p>
              </div>
            </SolidarityCard>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3: Action Primary */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-20 flex flex-col items-center gap-6"
      >
        <ActionButton
          variant="primary"
          label="BEGIN AUDIT"
          className="px-16 py-4 text-xs tracking-widest"
        />
        <p className="font-mono text-[9px] uppercase tracking-tighter text-paper-white/20">
          Estimated completion: 240 seconds
        </p>
      </motion.div>
    </div>
  );
};
