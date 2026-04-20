import { KrDarkSpring } from '@/design/tokens/motion-presets';
import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import clsx, { type ClassValue } from 'clsx';
import { useModeStore } from '../../stores/useModeStore';
import { useAuth } from '../../context/AuthContext';

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
  onPrimaryAction?: (email: string, password: string) => void;
  onSecondaryAction?: () => void;
}

const springHero = KrDarkSpring;
const springButton = KrDarkSpring;

export const AuthModal = memo(function AuthModal({
  className,
  mode = 'login',
  title,
  subtitle,
  primaryLabel,
  secondaryLabel = 'Continue with OAuth',
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: AuthModalProps) {
  const themeMode = useModeStore((state) => state.mode);
  const { login, register } = useAuth();
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resolvedTitle = title ?? (mode === 'register' ? 'Create Account' : 'Sign In');
  const resolvedSubtitle =
    subtitle ??
    (mode === 'register'
      ? 'Join the vanguard and build your portfolio.'
      : 'Secure access to your CareerCopilot workspace.');
  const resolvedPrimaryLabel = primaryLabel ?? 'Continue';

  return (
    <motion.section
      role="main"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={undefined}
      className={clsx(
        'relative overflow-hidden rounded-[var(--kr-shape-block-riot03)] text-base min-h-screen flex flex-col items-center justify-center p-8 bg-solidarity-charcoal-base',
        className
      )}
      style={{
        color: 'var(--kr-color-semantic-parchment)',
        border: '1px solid var(--kr-color-concrete-grey-steps-0)',
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

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
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

      {/* Centered auth card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springHero, delay: 0.04 }}
        className="relative z-10 w-full max-w-md"
        style={{
          backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
          border: '1px solid var(--kr-color-concrete-grey-steps-1)',
          borderRadius: 'var(--kr-shape-march-open01)',
          padding: '2.5rem',
        }}
      >
        <header className="mb-8">
          <h1
            className="font-display text-4xl font-black mb-2"
            style={{
              color: 'var(--kr-color-semantic-parchment)',
              fontVariationSettings: "'wght' 800, 'wdth' 120",
              fontSize: '28px',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {resolvedTitle}
          </h1>
          <p
            className="text-sm opacity-70"
            style={{ color: 'var(--kr-color-semantic-parchment)' }}
          >
            {resolvedSubtitle}
          </p>
        </header>

        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (mode === 'register') {
              await register(email, password, '');
            } else {
              await login(email, password);
            }
            onPrimaryAction?.(email, password);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="auth-email"
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--kr-color-semantic-parchment)', opacity: 0.6 }}
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--kr-color-charcoal-background-steps-2)',
                border: '1px solid var(--kr-color-concrete-grey-steps-1)',
                borderRadius: 'var(--kr-shape-block-riot01)',
                color: 'var(--kr-color-semantic-parchment)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="auth-password"
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--kr-color-semantic-parchment)', opacity: 0.6 }}
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--kr-color-charcoal-background-steps-2)',
                border: '1px solid var(--kr-color-concrete-grey-steps-1)',
                borderRadius: 'var(--kr-shape-block-riot01)',
                color: 'var(--kr-color-semantic-parchment)',
              }}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={springButton}
            className="mt-2 w-full px-8 py-4 font-semibold text-base"
            style={{
              backgroundColor: 'var(--kr-color-ink-gold-base)',
              color: 'var(--kr-color-charcoal-background-base)',
              borderRadius: 'var(--kr-shape-block-riot03)',
            }}
          >
            {resolvedPrimaryLabel}
          </motion.button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--kr-color-concrete-grey-steps-0)' }} />
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--kr-color-concrete-grey-steps-0)' }} />
        </div>

        <button
          type="button"
          onClick={onSecondaryAction}
          className="mt-4 w-full px-8 py-3 font-mono text-sm font-semibold tracking-wider transition-opacity hover:opacity-100 opacity-70"
          style={{
            border: '1px solid var(--kr-color-concrete-grey-steps-1)',
            borderRadius: 'var(--kr-shape-block-riot01)',
            color: 'var(--kr-color-semantic-parchment)',
            backgroundColor: 'transparent',
          }}
        >
          {secondaryLabel}
        </button>
      </motion.div>
    </motion.section>
  );
});

export default AuthModal;
