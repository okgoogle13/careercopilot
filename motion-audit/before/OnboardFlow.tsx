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

const SLOT_DEFS: SlotDef[] = [  { name: 'step1_background', zLayer: 'Z-0', token: '--sys-color-charcoalBackground-base', assetCompat: 'KR-SOLID-SUBSTRATE' },
  { name: 'step1_accent', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-ATMOS' },
  { name: 'role_icons', zLayer: 'Z-3', token: '--sys-color-worker-ash-base', assetCompat: 'KR-SOLID-UIKIT' },
  { name: 'skill_icons', zLayer: 'Z-3', token: '--sys-color-worker-ash-base', assetCompat: 'KR-SOLID-UIKIT' },
  { name: 'auto_kr_solid_004', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_solid_038', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_ui_010', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_ui_009', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_solid_032', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_ui_033', zLayer: 'Z-3', token: '--sys-color-inkGold-base', assetCompat: 'KR-SOLID-GENERAL' },
  { name: 'auto_kr_icon_003', zLayer: 'Z-3', token: '--sys-color-worker-ash-base', assetCompat: 'KR-SOLID-UIKIT' },
  { name: 'exp_onboard_kr_solid_112', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
  { name: 'exp_onboard_kr_solid_113', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
  { name: 'exp_onboard_kr_solid_114', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
  { name: 'exp_onboard_kr_solid_115', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
  { name: 'exp_onboard_kr_solid_116', zLayer: 'Z-1', token: '--sys-color-protestMetalBlue-base', assetCompat: 'KR-SOLID-EXPAND' },
];
const DEFAULT_SLOT_ASSETS: Partial<Record<string, string>> = {
  'step1_background': 'KR-SOLID-042',
  'step1_accent': 'KR-SOLID-043',
  'role_icons': 'KR-SOLID-044',
  'skill_icons': 'KR-SOLID-045',
  'auto_kr_solid_004': 'KR-SOLID-046',
  'auto_kr_solid_038': 'KR-UI-008',
  'auto_kr_ui_010': 'KR-UI-009',
  'auto_kr_ui_009': 'KR-UI-010',
  'auto_kr_solid_032': 'KR-UI-011',
  'auto_kr_ui_033': 'KR-UI-016',
  'auto_kr_icon_003': 'KR-UI-017',
  'exp_onboard_kr_solid_112': 'KR-UI-021',
  'exp_onboard_kr_solid_113': 'KR-UI-022',
  'exp_onboard_kr_solid_114': 'KR-UI-023',
  'exp_onboard_kr_solid_115': 'KR-UI-024',
  'exp_onboard_kr_solid_116': 'KR-UI-025',
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

const springHero = { type: 'spring', stiffness: 280, damping: 26 } as const;
const springCard = { type: 'spring', stiffness: 220, damping: 24 } as const;
const springButton = { type: 'spring', stiffness: 320, damping: 28 } as const;

export const OnboardFlow = memo(function OnboardFlow({
  className,
  title = "Onboarding Flow",
  subtitle = "Set role preferences and skills to personalize guidance.",
  primaryLabel = "Next Step",
  secondaryLabel = "Back",
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: OnboardFlowProps) {
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
      data-testid="onboardflow"
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
          className="text-4xl font-black md:text-5xl"
          style={{ fontFamily: 'var(--sys-type-font-fraunces)', color: 'var(--sys-color-paperWhite)' }}
        >
          {title}
        </h1>
        <p
          className="mt-3 max-w-3xl text-base md:text-lg"
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
        transition={{ ...springCard, delay: 0.12 }}
        className="relative z-10 mt-6 font-['JetBrains_Mono'] text-sm opacity-80"
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
      >
        Slots: {SLOT_DEFS.length} | Motion: spring-only | Tokens: --sys-* | Zustand: useModeStore
      </motion.p>
    </motion.section>
  );
});

export default OnboardFlow;
