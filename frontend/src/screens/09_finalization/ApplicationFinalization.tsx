import { KrDarkSpring } from '@/design/tokens/motion-presets';
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
  children?: React.ReactNode;
  className?: ClassValue;
  title?: string;
  subtitle?: string;
  slotAssets?: Partial<Record<string, string>>;
}

const springHero = KrDarkSpring;

export const ApplicationFinalization = memo(function ApplicationFinalization({
  children,
  className,
  title = 'Application Finalization',
  subtitle = 'Run checklist and submit with confidence.',
  slotAssets,
}: ApplicationFinalizationProps) {
  const mode = useModeStore((state) => state.mode);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };

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
        className="relative z-10 mb-8"
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

      <div className="relative z-10">{children}</div>

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
