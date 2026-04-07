import { KrDarkSpring } from '@/design/tokens/motion-presets';
import { memo } from 'react';
import { motion } from 'framer-motion';
import clsx, { type ClassValue } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useModeStore } from '../../stores/useModeStore';

type SlotDef = {
  name: string;
  zLayer: 'Z-0' | 'Z-1' | 'Z-2' | 'Z-3';
  token: `--sys-${string}`;
  assetCompat: `KR-${string}`;
};

const SLOT_DEFS: SlotDef[] = [
  {
    name: 'hero_background',
    zLayer: 'Z-0',
    token: '--sys-color-charcoalBackground-base',
    assetCompat: 'KR-SOLID-SUBSTRATE',
  },
  {
    name: 'hero_accent',
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
  hero_background: 'KR-SOLID-002',
  hero_accent: 'KR-SOLID-004',
  cta_icon: 'KR-SOLID-023',
};

const slotOpacity: Record<SlotDef['zLayer'], number> = {
  'Z-0': 0.3,
  'Z-1': 0.26,
  'Z-2': 0.24,
  'Z-3': 0.22,
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

const springHero = KrDarkSpring;
const springButton = KrDarkSpring;

export const HeroLanding = memo(function HeroLanding({
  className,
  title = 'Career Applications, Perfected',
  subtitle = 'ATS-optimized resumes, compelling cover letters, and strategic job discovery.',
  primaryLabel = 'Get Started',
  secondaryLabel = 'Learn More',
  slotAssets,
  onPrimaryAction,
  onSecondaryAction,
}: HeroLandingProps) {
  const navigate = useNavigate();
  const mode = useModeStore((state) => state.mode);
  const resolvedSlotAssets = { ...DEFAULT_SLOT_ASSETS, ...slotAssets };

  const handlePrimary = onPrimaryAction ?? (() => navigate('/auth'));
  const handleSecondary = onSecondaryAction ?? (() => navigate('/docs'));

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
      data-mode={mode}
      data-testid="herolanding"
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
          className="font-display font-black text-6xl md:text-7xl tracking-[-0.02em]"
          style={{ color: 'var(--sys-color-paperWhite)' }}
        >
          {title}
        </h1>
        <p
          className="mt-4 max-w-2xl font-normal text-xl md:text-2xl opacity-90"
          style={{ color: 'var(--sys-color-worker-ash-base)' }}
        >
          {subtitle}
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
          onClick={handlePrimary}
          className="rounded-[var(--sys-shape-blockRiot03)] font-semibold text-lg px-8 py-4"
          style={{
            backgroundColor: 'var(--sys-color-inkGold-base)',
            color: 'var(--sys-color-charcoalBackground-base)',
          }}
        >
          {primaryLabel}
        </motion.button>

        <button
          type="button"
          onClick={handleSecondary}
          className="font-mono text-sm opacity-80 px-2 py-1"
          style={{ color: 'var(--sys-color-worker-ash-base)', backgroundColor: 'transparent' }}
        >
          {secondaryLabel}
        </button>
      </motion.div>
    </motion.section>
  );
});

export default HeroLanding;
