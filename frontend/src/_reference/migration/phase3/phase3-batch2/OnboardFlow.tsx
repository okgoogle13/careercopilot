import { memo } from 'react';
import { motion } from 'framer-motion';
import clsx, { type ClassValue } from 'clsx';
import { useModeStore } from '../../stores/useModeStore';

type SlotDef = {
  name: string;
  zLayer: 'Z-0' | 'Z-1' | 'Z-2' | 'Z-3';
  token: `--sys-${string}`;
  assetCompat: `KR-${string}`;
};

const SLOT_DEFS: SlotDef[] = [
  {
    name: 'step1_background',
    zLayer: 'Z-0',
    token: '--sys-color-charcoalBackground-base',
    assetCompat: 'KR-SOLID-SUBSTRATE',
  },
  {
    name: 'step1_accent',
    zLayer: 'Z-1',
    token: '--sys-color-protestMetalBlue-base',
    assetCompat: 'KR-SOLID-ATMOS',
  },
  {
    name: 'cta_icon',
    zLayer: 'Z-3',
    token: '--sys-color-worker-ash-base',
    assetCompat: 'KR-SOLID-UIKIT',
  },
];

const DEFAULT_SLOT_ASSETS: Partial<Record<string, string>> = {
  step1_background: 'KR-SOLID-042',
  step1_accent: 'KR-SOLID-043',
  cta_icon: 'KR-SOLID-044',
};

const slotOpacity: Record<SlotDef['zLayer'], number> = {
  'Z-0': 0.3,
  'Z-1': 0.26,
  'Z-2': 0.24,
  'Z-3': 0.22,
};

export interface OnboardFlowProps {
  className?: ClassValue;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  slotAssets?: Partial<Record<string, string>>;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const springHero = { type: 'spring', stiffness: 450, damping: 28 } as const;
const _springCard = { type: 'spring', stiffness: 300, damping: 35 } as const;
const springButton = { type: 'spring', stiffness: 450, damping: 28 } as const;

export const OnboardFlow = memo(function OnboardFlow({
  className,
  title = 'Onboarding Flow',
  subtitle = 'Set role preferences and skills to personalize guidance.',
  primaryLabel = 'Next Step',
  secondaryLabel = 'Back',
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: OnboardFlowProps) {
  const mode = useModeStore((state) => state.mode);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };

  return (
    <motion.section
      role="main"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={undefined}
      className={clsx(
        "relative overflow-hidden rounded-[var(--sys-shape-blockRiot03)] p-8 font-['Work_Sans'] text-base min-h-[75vh] flex flex-col justify-center",
        className
      )}
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-base)',
        color: 'var(--sys-color-worker-ash-base)',
        border: '1px solid var(--sys-color-concreteGrey-base)',
      }}
      data-mode={mode}
      data-testid="onboardflow"
      data-motion-audit="true"
      data-density-ratio="0.36"
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [data-motion-audit="true"] *,
          [data-motion-audit="true"]::before,
          [data-motion-audit="true"]::after {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {SLOT_DEFS.map((slot) => (
          <div
            key={slot.name}
            data-slot={slot.name}
            data-asset-compat={slot.assetCompat}
            data-asset-id={resolvedSlotAssets[slot.name] ?? ''}
            data-z-layer={slot.zLayer}
            style={{ color: `var(${slot.token})`, opacity: slotOpacity[slot.zLayer] }}
          />
        ))}
      </div>

      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springHero, delay: 0.04 }}
        className="relative z-10 max-w-2xl"
      >
        <h1
          className="text-5xl md:text-6xl font-black"
          style={{
            fontFamily: 'var(--sys-type-font-fraunces)',
            color: 'var(--sys-color-paperWhite)',
          }}
        >
          {title}
        </h1>
        <p
          className="mt-4 max-w-2xl text-base md:text-xl"
          style={{
            fontFamily: 'var(--sys-type-font-work-sans)',
            color: 'var(--sys-color-worker-ash-base)',
          }}
        >
          {subtitle}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={undefined}
        className="relative z-10 mt-8 flex flex-wrap gap-4 items-center"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springButton}
          onClick={onPrimaryAction}
          className="rounded-[var(--sys-shape-blockRiot03)] px-8 py-4 font-semibold text-lg"
          style={{
            fontFamily: 'var(--sys-type-font-work-sans)',
            backgroundColor: 'var(--sys-color-inkGold-base)',
            color: 'var(--sys-color-charcoalBackground-base)',
          }}
        >
          {primaryLabel}
        </motion.button>

        <button
          type="button"
          onClick={onSecondaryAction}
          className="font-['JetBrains_Mono'] text-sm opacity-80 px-2 py-1"
          style={{ color: 'var(--sys-color-worker-ash-base)', backgroundColor: 'transparent' }}
        >
          {secondaryLabel}
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={undefined}
        className="relative z-10 mt-8 font-['JetBrains_Mono'] text-sm opacity-80"
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
      >
        Slots: {SLOT_DEFS.length} | Density ratio: 0.36 | Max focal CTA: 1
      </motion.p>
    </motion.section>
  );
});

export default OnboardFlow;
