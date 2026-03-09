import { useMode } from '@/hooks/use-mode';

export const TokenTest = () => {
  const { mode, isKrDarkMode } = useMode();

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10">
      <section className="rounded-stone border border-concrete-grey/30 bg-concrete-grey/10 p-6 md:p-8 shadow-viscous">
        <h2 className="font-proclamation text-4xl md:text-5xl text-ink-gold mb-6">
          Token System Test
        </h2>

        <div className="space-y-2 font-field-note text-paper-white/90">
          <p>
            Current Mode: <span className="font-annotation text-ink-gold">{mode}</span>
          </p>
          <p>KrDark Mode: {isKrDarkMode ? '✅' : '❌'}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-pebble px-5 py-2.5 font-field-note font-semibold transition-all shadow-glow-gold"
            style={{
              backgroundColor: 'var(--sys-color-inkGold-base)',
              color: 'var(--sys-color-charcoalBackground-base)',
            }}
          >
            Primary Button
          </button>

          <button
            className="rounded-pebble px-4 py-2 font-field-note font-medium transition-all"
            style={{
              backgroundColor: 'var(--sys-color-solidarityRed-base)',
              color: 'var(--sys-color-worker-ash-base)',
            }}
          >
            Tertiary Button
          </button>
        </div>
      </section>
      <div className="mt-4 text-[11px] text-concrete-grey font-annotation uppercase tracking-wide">
        Debug surface for token verification only.
      </div>
    </div>
  );
};
