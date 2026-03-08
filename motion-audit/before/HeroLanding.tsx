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

const SLOT_DEFS: SlotDef[] = [  { name: 'hero_background', zLayer: 'Z-0', token: '--sys-color-charcoalBackground-base', assetCompat: 'KR-SOLID-SUBSTRATE' },
  { name: 'hero_overlay', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-ATMOS' },
  { name: 'hero_accent', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-ATMOS' },
  { name: 'auto_kr_solid_002', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_solid_036', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_ui_008', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_ui_021', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_ui_017', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_solid_030', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_ui_031', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_icon_001', zLayer: 'Z-3', token: '--sys-color-worker-ash-base', assetCompat: 'KR-SOLID-UIKIT' },
  { name: 'exp_hero_kr_solid_045', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
  { name: 'exp_hero_kr_solid_046', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
  { name: 'exp_hero_kr_solid_078', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
];
const DEFAULT_SLOT_ASSETS: Partial<Record<string, string>> = {
  'hero_background': 'KR-SOLID-002',
  'hero_overlay': 'KR-SOLID-003',
  'hero_accent': 'KR-SOLID-004',
  'auto_kr_solid_002': 'KR-SOLID-005',
  'auto_kr_solid_036': 'KR-SOLID-006',
  'auto_kr_ui_008': 'KR-SOLID-007',
  'auto_kr_ui_021': 'KR-SOLID-008',
  'auto_kr_ui_017': 'KR-SOLID-009',
  'auto_kr_solid_030': 'KR-SOLID-021',
  'auto_kr_ui_031': 'KR-SOLID-022',
  'auto_kr_icon_001': 'KR-SOLID-023',
  'exp_hero_kr_solid_045': 'KR-SOLID-024',
  'exp_hero_kr_solid_046': 'KR-SOLID-025',
  'exp_hero_kr_solid_078': 'KR-SOLID-026',
};

export interface HeroLandingProps {
  className?: ClassValue;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  slotAssets?: Partial<Record<string, string>>;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const springHero = { type: 'spring', stiffness: 280, damping: 26 } as const;
const springCard = { type: 'spring', stiffness: 220, damping: 24 } as const;
const springButton = { type: 'spring', stiffness: 320, damping: 28 } as const;

export const HeroLanding = memo(function HeroLanding({
  className,
  title = "Career Applications, Perfected",
  subtitle = "ATS-optimized resumes, compelling cover letters, and strategic job discovery.",
  primaryLabel = "Get Started",
  secondaryLabel = "Learn More",
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: HeroLandingProps) {
  const mode = useModeStore((state) => state.mode);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };
  const isKrDark = mode === 'KrDark';

  return (
    <motion.section
      role="main"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springHero}
      className={clsx(
        "relative overflow-hidden rounded-[var(--sys-shape-blockRiot03)] p-6 md:p-8 font-['Work_Sans'] text-base",
        className
      )}
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-base)',
        color: 'var(--sys-color-worker-ash-base)',
        border: '1px solid var(--sys-color-concreteGrey-base)',
      }}
      data-mode={mode}
      data-testid="herolanding"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
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
        transition={{ ...springCard, delay: 0.04 }}
        className="relative z-10"
      >
        <h1
          className="font-['Fraunces'] font-black text-6xl md:text-7xl tracking-[-0.02em]"
          style={{ fontFamily: 'var(--sys-type-font-fraunces)', color: 'var(--sys-color-paperWhite)' }}
        >
          {title}
        </h1>
        <p
          className="mt-3 max-w-3xl font-['Work_Sans'] font-normal text-xl md:text-2xl opacity-90"
          style={{ fontFamily: 'var(--sys-type-font-work-sans)', color: 'var(--sys-color-worker-ash-base)' }}
        >
          {subtitle}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springCard, delay: 0.08 }}
        className="relative z-10 mt-6 flex flex-wrap gap-3"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springButton}
          onClick={onPrimaryAction}
          className="rounded-[var(--sys-shape-blockRiot03)] font-['Work_Sans'] font-semibold text-lg px-8 py-4"
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
        transition={{ ...springCard, delay: 0.12 }}
        className="relative z-10 mt-6 font-['JetBrains_Mono'] text-sm opacity-80"
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
      >
        Slots: {SLOT_DEFS.length} | Motion: spring-only | Tokens: --sys-* | Zustand: useModeStore
      </motion.p>
    </motion.section>
  );
});

export default HeroLanding;
