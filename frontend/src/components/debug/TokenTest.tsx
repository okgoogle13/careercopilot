import { useMode } from '@/hooks/use-mode';

export const TokenTest = () => {
  const { mode, isKrDarkMode } = useMode();
  const colorTokens = [
    '--sys-color-charcoalBackground-base',
    '--sys-color-inkGold-base',
    '--sys-color-solidarityRed-base',
    '--sys-color-worker-ash-base',
    '--sys-color-concreteGrey-base',
    '--sys-color-kr-activistSmokeGreen-base',
  ];
  const typeScale = [
    { label: 'micro', value: 'var(--sys-type-scale-micro)' },
    { label: 'small', value: 'var(--sys-type-scale-small)' },
    { label: 'body', value: 'var(--sys-type-scale-body)' },
    { label: 'subhead', value: 'var(--sys-type-scale-subhead)' },
    { label: 'headline', value: 'var(--sys-type-scale-headline)' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 space-y-6">
      <section className="rounded-megaphone border border-concrete-grey/30 bg-concrete-grey/10 p-6 md:p-8 shadow-viscous">
        <h2 className="font-display text-4xl md:text-5xl text-ink-gold mb-3">Token System Test</h2>

        <div className="space-y-2 font-primary text-paper-white/90 mb-6">
          <p>
            Current Mode: <span className="font-mono text-ink-gold">{mode}</span>
          </p>
          <p>KrDark Mode: {isKrDarkMode ? '✅' : '❌'}</p>
        </div>

        <div className="rounded-march border border-concrete-grey/30 bg-asphalt-black/25 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-gold mb-3">
            Pebble Action Pair
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-march px-5 py-2.5 font-primary font-semibold transition-all shadow-glow-gold"
              style={{
                backgroundColor: 'var(--sys-color-inkGold-base)',
                color: 'var(--sys-color-charcoalBackground-base)',
              }}
            >
              Primary Button
            </button>

            <button
              className="rounded-march px-4 py-2 font-primary font-medium transition-all"
              style={{
                backgroundColor: 'var(--sys-color-solidarityRed-base)',
                color: 'var(--sys-color-worker-ash-base)',
              }}
            >
              Tertiary Button
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-placard border border-concrete-grey/20 bg-asphalt-black/30 p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-gold mb-4">
          Semantic Color Registry
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {colorTokens.map((token) => (
            <div
              key={token}
              className="rounded-march border border-concrete-grey/20 p-3 bg-asphalt-black/40"
            >
              <div
                className="h-10 rounded-march border border-concrete-grey/20 mb-2"
                style={{ backgroundColor: `var(${token})` }}
              />
              <p className="text-[10px] font-mono text-worker-ash break-all">{token}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-placard border border-concrete-grey/20 bg-asphalt-black/30 p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-gold mb-4">
          Type Scale Ladder
        </p>
        <div className="space-y-3">
          {typeScale.map((item) => (
            <div
              key={item.label}
              className="rounded-march border border-concrete-grey/20 p-3"
            >
              <p className="font-mono text-[10px] text-concrete-grey uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p
                className="font-primary text-worker-ash"
                style={{ fontSize: item.value }}
              >
                Kerala Rage typography calibration
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-placard border border-concrete-grey/20 bg-asphalt-black/30 p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-ink-gold mb-4">
          Archetype Matrix
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Strike', 'March', 'Megaphone', 'Placard', 'Scaffold', 'Substrate'].map((name) => (
            <div
              key={name}
              className="rounded-march border border-concrete-grey/20 p-4 bg-asphalt-black/40"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-worker-ash">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-[11px] text-concrete-grey font-mono uppercase tracking-wide">
        Debug surface for token verification only.
      </div>
    </div>
  );
};
