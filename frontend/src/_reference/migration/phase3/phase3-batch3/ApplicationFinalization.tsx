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
    name: 'auto_kr_solid_006',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_013',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_028',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_033',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_002',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_018',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_028',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_041',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
];
const DEFAULT_SLOT_ASSETS: Partial<Record<string, string>> = {
  auto_kr_solid_006: 'KR-SOLID-012',
  auto_kr_solid_013: 'KR-SOLID-013',
  auto_kr_solid_028: 'KR-SOLID-014',
  auto_kr_solid_033: 'KR-SOLID-019',
  auto_kr_ui_002: 'KR-SOLID-020',
  auto_kr_ui_018: 'KR-SOLID-021',
  auto_kr_ui_028: 'KR-SOLID-022',
  auto_kr_solid_041: 'KR-SOLID-023',
};

export interface ApplicationFinalizationProps {
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

export const ApplicationFinalization = memo(function ApplicationFinalization({
  className,
  title = 'Application Finalization',
  subtitle = 'Run checklist and submit with confidence.',
  primaryLabel = 'Submit Application',
  secondaryLabel = 'Save Draft',
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: ApplicationFinalizationProps) {
  const mode = useModeStore((state) => state.mode);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };
  const isKrDark = mode === 'KrDark';

  return (
    <motion.section
      role="main"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={undefined}
      className={clsx(
        'relative overflow-hidden rounded-[var(--sys-shape-blockRiot03)] p-6 md:p-8',
        className
      )}
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-base)',
        color: 'var(--sys-color-worker-ash-base)',
        border: '1px solid var(--sys-color-concreteGrey-base)',
      }}
      data-mode={mode}
      data-testid="applicationfinalization"
      data-motion-audit="true"
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
            style={{ color: `var(${slot.token})` }}
          />
        ))}
      </div>

      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springHero, delay: 0.04 }}
        className="relative z-10"
      >
        <h1
          className="text-3xl font-black md:text-5xl"
          style={{
            fontFamily: 'var(--sys-type-font-fraunces)',
            color: 'var(--sys-color-paperWhite)',
          }}
        >
          {title}
        </h1>
        <p
          className="mt-3 max-w-4xl text-base md:text-lg"
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
        className="relative z-10 mt-6 flex flex-wrap gap-3"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springButton}
          onClick={onPrimaryAction}
          className="rounded-[var(--sys-shape-blockRiot03)] px-5 py-3 font-semibold"
          style={{
            fontFamily: 'var(--sys-type-font-work-sans)',
            backgroundColor: 'var(--sys-color-inkGold-base)',
            color: 'var(--sys-color-charcoalBackground-base)',
          }}
        >
          {primaryLabel}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springButton}
          onClick={onSecondaryAction}
          className="rounded-[var(--sys-shape-blockRiot01)] border px-5 py-3 font-medium"
          style={{
            fontFamily: 'var(--sys-type-font-work-sans)',
            borderColor: 'var(--sys-color-protestMetalBlue-base)',
            color: isKrDark ? 'var(--sys-color-worker-ash-base)' : 'var(--sys-color-paperWhite)',
            backgroundColor: 'transparent',
          }}
        >
          {secondaryLabel}
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={undefined}
        className="relative z-10 mt-6 text-xs"
        style={{
          fontFamily: 'var(--sys-type-font-mono)',
          color: 'var(--sys-color-concreteGrey-base)',
        }}
      >
        Slots: {SLOT_DEFS.length} | Motion: spring-only | Tokens: --sys-* | Zustand: useModeStore
      </motion.p>
    </motion.section>
  );
});

export default ApplicationFinalization;
