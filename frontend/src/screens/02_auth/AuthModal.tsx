import { KrDarkSpring } from '@/design/tokens/motion-presets';
import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import clsx, { type ClassValue } from 'clsx';
import { useModeStore } from '../../stores/useModeStore';
import { useAuth } from '../../context/AuthContext';

type SlotDef = {
  name: string;
  zLayer: 'Z-0' | 'Z-1' | 'Z-2' | 'Z-3';
  token: `--kr-${string}`;
  assetCompat: `KR-${string}`;
};

const SLOT_DEFS: SlotDef[] = [
  {
    name: 'background',
    zLayer: 'Z-0',
    token: '--kr-color-charcoal-background-base',
    assetCompat: 'KR-SOLID-SUBSTRATE',
  },
  {
    name: 'background_accent',
    zLayer: 'Z-1',
    token: '--kr-color-protest-metal-blue-base',
    assetCompat: 'KR-SOLID-ATMOS',
  },
  {
    name: 'cta_icon',
    zLayer: 'Z-3',
    token: '--kr-color-worker-ash-base',
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
  /** Initial tab. Defaults to 'login'. User can switch via the tab switcher. */
  mode?: AuthModalMode;
  slotAssets?: Partial<Record<string, string>>;
  onPrimaryAction?: (email: string, password: string) => void;
}

const springHero = KrDarkSpring;
const springButton = KrDarkSpring;

export const AuthModal = memo(function AuthModal({
  className,
  mode = 'login',
  slotAssets,
  onPrimaryAction,
}: AuthModalProps) {
  const themeMode = useModeStore((state) => state.mode);
  const { login, register } = useAuth();
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };
  const [activeTab, setActiveTab] = useState<AuthModalMode>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

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

      {/* Centered auth card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springHero, delay: 0.04 }}
        className="relative z-10 w-full max-w-md overflow-hidden"
        style={{
          backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
          border: '1px solid var(--kr-color-concrete-grey-steps-1)',
          borderRadius: 'var(--kr-shape-march-open01)',
        }}
      >
        {/* Red top accent bar — Figma node 1:203 */}
        <div
          className="h-[3px] w-full"
          style={{ backgroundColor: 'var(--kr-color-solidarity-red-base)' }}
        />

        <div className="p-10">
          {/* Tab switcher — Figma node 1:168 */}
          <div
            className="flex items-center p-[4px] mb-6"
            style={{
              backgroundColor: 'var(--kr-color-charcoal-background-steps-2)',
              border: '1px solid var(--kr-color-concrete-grey-steps-1)',
              borderRadius: 'var(--kr-shape-march-open01)',
            }}
          >
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 font-['Work_Sans'] text-[13px] font-extrabold uppercase tracking-[0.03em] transition-colors"
                style={{
                  borderRadius: 'var(--kr-shape-march-open01)',
                  backgroundColor:
                    activeTab === tab
                      ? 'var(--kr-color-charcoal-background-steps-3)'
                      : 'transparent',
                  color:
                    activeTab === tab
                      ? 'var(--kr-color-worker-ash-base)'
                      : 'var(--kr-color-worker-ash-muted)',
                }}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Context blurb — Figma node 1:173 */}
          <p
            className="text-sm leading-relaxed mb-6 px-1 opacity-80"
            style={{ color: 'var(--kr-color-worker-ash-base)' }}
          >
            {activeTab === 'register'
              ? 'Create an account to start building your evidence archive and find aligned opportunities.'
              : 'Sign in to access your dashboard and continue your job search.'}
          </p>

          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (activeTab === 'register') {
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
                style={{ color: 'var(--kr-color-worker-ash-muted)' }}
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="you@solidarity.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--kr-color-charcoal-background-steps-2)',
                  border: '1px solid var(--kr-color-concrete-grey-steps-1)',
                  borderRadius: 'var(--kr-shape-march-open01)',
                  color: 'var(--kr-color-worker-ash-base)',
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="auth-password"
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--kr-color-worker-ash-muted)' }}
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={activeTab === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--kr-color-charcoal-background-steps-2)',
                  border: '1px solid var(--kr-color-concrete-grey-steps-1)',
                  borderRadius: 'var(--kr-shape-march-open01)',
                  color: 'var(--kr-color-worker-ash-base)',
                }}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={springButton}
              className="mt-2 w-full px-8 py-4 font-['Work_Sans'] font-extrabold uppercase tracking-[0.04em] text-sm"
              style={{
                backgroundColor: 'var(--kr-color-solidarity-red-base)',
                color: 'var(--kr-color-charcoal-background-base)',
                borderRadius: 'var(--kr-shape-march-open01)',
              }}
            >
              {activeTab === 'login' ? 'Sign In →' : 'Create Account →'}
            </motion.button>
          </form>

          {/* Toggle link */}
          <p
            className="mt-5 text-center text-[13px]"
            style={{ color: 'var(--kr-color-worker-ash-muted)' }}
          >
            {activeTab === 'login' ? (
              <>
                Do not have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold transition-opacity hover:opacity-100"
                  style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold transition-opacity hover:opacity-100"
                  style={{ color: 'var(--kr-color-protest-metal-blue-base)' }}
                >
                  Sign In
                </button>
              </>
            )}
          </p>

          {/* Figma tagline — node 1:202 */}
          <p
            className="mt-6 text-center font-proclamation text-[16px] opacity-50 -rotate-1 uppercase tracking-[0.08em]"
            style={{ color: 'var(--kr-color-stencil-yellow-base)' }}
          >
            no neutral canvas.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
});

export default AuthModal;
