import { KrDarkSpring } from '@/design/tokens/motion-presets';
import { memo } from 'react';
import { motion } from 'framer-motion';
import clsx, { type ClassValue } from 'clsx';
import { useModeStore } from '../../stores/useModeStore';

type SlotDef = {
  name: string;
  zLayer: 'Z-0' | 'Z-1' | 'Z-2' | 'Z-3';
  token: `--kr-color-${string}`;
  assetCompat: `KR-${string}`;
};

const SLOT_DEFS: SlotDef[] = [
  {
    name: 'auto_kr_solid_005',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_012',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_027',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_022',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_001',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_015',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_027',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_ui_038',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
  {
    name: 'auto_kr_solid_046',
    zLayer: 'Z-3',
    token: '--kr-color-ink-gold-base',
    assetCompat: 'KR-SOLID-GENERAL',
  },
];

const DEFAULT_SLOT_ASSETS: Partial<Record<string, string>> = {
  auto_kr_solid_005: 'KR-SOLID-031',
  auto_kr_solid_012: 'KR-SOLID-032',
  auto_kr_solid_027: 'KR-SOLID-033',
  auto_kr_solid_022: 'KR-SOLID-034',
  auto_kr_ui_001: 'KR-SOLID-035',
  auto_kr_ui_015: 'KR-SOLID-036',
  auto_kr_ui_027: 'KR-SOLID-037',
  auto_kr_ui_038: 'KR-SOLID-038',
  auto_kr_solid_046: 'KR-SOLID-039',
};

export interface DocumentWorkbenchProps {
  children?: React.ReactNode;
  className?: ClassValue;
  title?: string;
  subtitle?: string;
  slotAssets?: Partial<Record<string, string>>;
}

const springHero = KrDarkSpring;

export const DocumentWorkbench = memo(function DocumentWorkbench({
  children,
  className,
  title = 'Document Workbench',
  subtitle = 'Edit resume/cover letter and preview export output.',
  slotAssets,
}: DocumentWorkbenchProps) {
  const mode = useModeStore((state) => state.mode);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };

  return (
    <motion.section
      role="main"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }} // v7.0 overshoot
      className={clsx('relative overflow-hidden rounded-blockRiot03 p-6 md:p-8', className)}
      style={{
        backgroundColor: 'var(--kr-color-charcoal-background-base)',
        color: 'var(--kr-color-worker-ash-base)',
        border: '1px solid var(--kr-color-concrete-grey-base)',
      }}
      data-mode={mode}
      data-testid="documentworkbench"
    >
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
            fontFamily: 'var(--kr-type-font-fraunces)',
            color: 'var(--kr-color-paper-white-base)',
          }}
        >
          {title}
        </h1>
        <p
          className="mt-3 max-w-4xl text-base md:text-lg"
          style={{
            fontFamily: 'var(--kr-type-font-work-sans)',
            color: 'var(--kr-color-worker-ash-base)',
          }}
        >
          {subtitle}
        </p>
      </motion.header>

      <div className="relative z-10">{children}</div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-6 text-xs"
        style={{
          fontFamily: 'var(--kr-type-font-mono)',
          color: 'var(--kr-color-concrete-grey-base)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        WORKBENCH.v7 // DNA ARCHIVE // GOLD STANDARD
      </motion.p>
    </motion.section>
  );
});

export default DocumentWorkbench;
