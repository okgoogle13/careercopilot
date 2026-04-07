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
    name: 'background',
    zLayer: 'Z-0',
    token: '--sys-color-charcoalBackground-base',
    assetCompat: 'KR-SOLID-SUBSTRATE',
  },
  {
    name: 'background_accent',
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
  background: 'KR-SOLID-027',
  background_accent: 'KR-SOLID-028',
  cta_icon: 'KR-SOLID-029',
};

const slotOpacity: Record<SlotDef['zLayer'], number> = {
  'Z-0': 0.3,
  'Z-1': 0.26,
  'Z-2': 0.24,
  'Z-3': 0.22,
};

/** Controls which auth flow is surfaced. Drives default title/subtitle when
 *  explicit props are not provided. LoginPage passes mode="login";
 *  RegisterPage passes mode="register". */
export type AuthModalMode = 'login' | 'register';

export interface AuthModalProps {
  className?: ClassValue;
  /** @default 'login' */
  mode?: AuthModalMode;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  slotAssets?: Partial<Record<string, string>>;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const springHero = KrDarkSpring;
const springButton = KrDarkSpring;

export const AuthModal = memo(function AuthModal({
  className,
  mode = 'login',
  title,
  subtitle,
  primaryLabel = 'Continue',
  secondaryLabel = 'Use OAuth',
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: AuthModalProps) {
  const themeMode = useModeStore((state) => state.mode);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };

  const resolvedTitle = title ?? (mode === 'register' ? 'Create Account' : 'Sign In');
  const resolvedSubtitle =
    subtitle ??
    (mode === 'register'
      ? 'Join the vanguard and build your portfolio.'
      : 'Secure access to your CareerCopilot workspace.');

  return (
    <motion.section
      role="main"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={undefined}
      className={clsx(
        'font-primary relative overflow-hidden rounded-[var(--sys-shape-blockRiot03)] p-8 text-base min-h-[75vh] flex flex-col justify-center',
        className
      )}
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-base)',
        color: 'var(--sys-color-worker-ash-base)',
        border: '1px solid var(--sys-color-concreteGrey-base)',
      }}
      data-mode={themeMode}
      data-testid="authmodal"
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
          className="font-display text-5xl md:text-6xl font-black"
          style={{ color: 'var(--sys-color-paperWhite)' }}
        >
          {resolvedTitle}
        </h1>
        <p
          className="mt-4 max-w-2xl text-base md:text-xl"
          style={{ color: 'var(--sys-color-worker-ash-base)' }}
        >
          {resolvedSubtitle}
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
            backgroundColor: 'var(--sys-color-inkGold-base)',
            color: 'var(--sys-color-charcoalBackground-base)',
          }}
        >
          {primaryLabel}
        </motion.button>

        <button
          type="button"
          onClick={onSecondaryAction}
          className="font-mono text-sm opacity-80 px-2 py-1"
          style={{ color: 'var(--sys-color-worker-ash-base)', backgroundColor: 'transparent' }}
        >
          {secondaryLabel}
        </button>
      </motion.div>
    </motion.section>
  );
});

export default AuthModal;
