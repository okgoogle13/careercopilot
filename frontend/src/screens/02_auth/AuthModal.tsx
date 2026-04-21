import { KrDarkSpring } from '@/design/tokens/motion-presets';
import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import clsx, { type ClassValue } from 'clsx';
import { useAuth } from '@/context/AuthContext';
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
const FIELD_CLASSNAME =
  'w-full rounded-[var(--sys-shape-blockRiot02)] border bg-[var(--sys-color-charcoalBackground-steps-1)] px-4 py-3 text-sm outline-none transition-colors';
const FIELD_STYLE = {
  borderColor: 'var(--sys-color-concreteGrey-base)',
  color: 'var(--sys-color-worker-ash-base)',
} satisfies React.CSSProperties;

export const AuthModal = memo(function AuthModal({
  className,
  mode = 'login',
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: AuthModalProps) {
  const themeMode = useModeStore((state) => state.mode);
  const { login, register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };
  const isRegisterMode = mode === 'register';
  const resolvedPrimaryLabel = primaryLabel ?? (isRegisterMode ? 'Create Account' : 'Sign In');
  const resolvedSecondaryLabel =
    secondaryLabel ?? (isRegisterMode ? 'Back to Sign In' : 'Create Account');

  const resolvedTitle = title ?? (isRegisterMode ? 'Create Account' : 'Sign In');
  const resolvedSubtitle =
    subtitle ??
    (isRegisterMode
      ? 'Join the vanguard and build your portfolio.'
      : 'Secure access to your CareerCopilot workspace.');
  const footerCopy = useMemo(
    () =>
      isRegisterMode
        ? 'Already have a collective ID?'
        : 'Need a collective ID to start your archive?',
    [isRegisterMode]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isRegisterMode) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
      onPrimaryAction?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={undefined}
        onSubmit={handleSubmit}
        className="relative z-10 mt-8 w-full max-w-xl space-y-5"
      >
        {isRegisterMode && (
          <label className="block space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sys-color-concreteGrey-base)]">
              Display Name
            </span>
            <input
              type="text"
              name="displayName"
              autoComplete="name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className={FIELD_CLASSNAME}
              style={FIELD_STYLE}
              required={isRegisterMode}
            />
          </label>
        )}

        <label className="block space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sys-color-concreteGrey-base)]">
            Email
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={FIELD_CLASSNAME}
            style={FIELD_STYLE}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sys-color-concreteGrey-base)]">
            Password
          </span>
          <input
            type="password"
            name="password"
            autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={FIELD_CLASSNAME}
            style={FIELD_STYLE}
            required
          />
        </label>

        {errorMessage && (
          <p
            role="alert"
            className="font-mono text-xs uppercase tracking-[0.15em]"
            style={{ color: 'var(--sys-color-solidarityRed-base)' }}
          >
            {errorMessage}
          </p>
        )}

        <div className="flex flex-wrap gap-4 items-center">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={springButton}
            disabled={isSubmitting}
            className="rounded-[var(--sys-shape-blockRiot03)] px-8 py-4 font-semibold text-lg disabled:opacity-60"
            style={{
              backgroundColor: 'var(--sys-color-inkGold-base)',
              color: 'var(--sys-color-charcoalBackground-base)',
            }}
          >
            {isSubmitting ? 'Working...' : resolvedPrimaryLabel}
          </motion.button>

          <button
            type="button"
            onClick={onSecondaryAction}
            className="font-mono text-sm opacity-80 px-2 py-1"
            style={{ color: 'var(--sys-color-worker-ash-base)', backgroundColor: 'transparent' }}
          >
            {resolvedSecondaryLabel}
          </button>
        </div>

        <p
          className="font-mono text-xs uppercase tracking-[0.14em]"
          style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        >
          {footerCopy}
        </p>
      </motion.form>
    </motion.section>
  );
});

export default AuthModal;
