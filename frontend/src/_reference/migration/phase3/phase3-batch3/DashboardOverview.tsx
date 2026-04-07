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
    name: 'auto_kr_solid_008',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_022',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_035',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_007',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_020',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_030',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_logo_003',
    zLayer: 'Z-3',
    token: '--sys-color-inkGold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
];
const DEFAULT_SLOT_ASSETS: Partial<Record<string, string>> = {
  auto_kr_solid_008: 'KR-SOLID-024',
  auto_kr_solid_022: 'KR-SOLID-025',
  auto_kr_solid_035: 'KR-SOLID-026',
  auto_kr_ui_007: 'KR-SOLID-027',
  auto_kr_ui_020: 'KR-SOLID-028',
  auto_kr_ui_030: 'KR-SOLID-029',
  auto_kr_logo_003: 'KR-SOLID-030',
};

export interface DashboardOverviewProps {
  className?: ClassValue;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  slotAssets?: Partial<Record<string, string>>;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const springHero = KrDarkSpring;
const _springCard = KrDarkSpring;
const springButton = KrDarkSpring;

export const DashboardOverview = memo(function DashboardOverview({
  className,
  title = 'Dashboard Home',
  subtitle = 'Monitor stats, actions, and recent activity.',
  primaryLabel = 'New Application',
  secondaryLabel = 'Open Settings',
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: DashboardOverviewProps) {
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
      data-testid="dashboardoverview"
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

export default DashboardOverview;
