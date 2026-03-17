import { Link, useLocation } from 'react-router';
import {
  Home,
  LayoutGrid,
  Crosshair,
  GanttChart,
  ArrowDownToLine,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

// ============================================================================
// SIDEBAR — KERALA RAGE / SOLIDARITY MODE
// Scaffold layer — immutable layout container
// Token Sync v6.1 — Zero hardcoded hex values.
// Shape system v6.1 — march, block, scaffold, sentry archetypes.
// Active state: Ink Gold (#DAF674). Background: Solidarity Charcoal (#1A1714).
// Hover: KR Solidarity "Slam" — Spring stiffness 500 / damping 27 / overshoot.
// Icons: Industrial/geometric only. No flora, no botanicals.
// ============================================================================

// ── DIRECT COLOR TOKENS ──────────────────────────────────────────────────────
const COLORS = {
  // Sidebar background: Solidarity Charcoal #1A1714 (charcoalBackground-base)
  charcoalBase:  'var(--sys-color-charcoalBackground-base)',
  canvas:        'var(--sys-color-charcoalBackground-steps-0)',
  surface1:      'var(--sys-color-charcoalBackground-steps-1)',
  surface2:      'var(--sys-color-charcoalBackground-steps-2)',
  surface3:      'var(--sys-color-charcoalBackground-steps-3)',
  surface4:      'var(--sys-color-charcoalBackground-steps-4)',
  solidarityRed: 'var(--sys-color-solidarityRed-base)',
  inkGold:       'var(--sys-color-inkGold-base)',
  stencilYellow: 'var(--sys-color-stencilYellow-base)',
  signalGreen:   'var(--sys-color-signalGreen-base)',
  workerAsh:     'var(--sys-color-worker-ash-base)',
  workerAshMuted:'var(--sys-color-worker-ash-steps-1)',
  workerAshDim:  'var(--sys-color-worker-ash-steps-0)',
  smokeOrange:   'var(--sys-color-solidaritySmokeOrange-base)',
  metalBlue:     'var(--sys-color-protestMetalBlue-base)',
};

// ── RGB VALUES FOR ALPHA EXPRESSIONS ONLY ────────────────────────────────────
const RGB = {
  solidarityRed: '241, 71, 20',
  inkGold:       '218, 246, 116',
  workerAsh:     '218, 246, 179',
  canvas:        '15, 15, 15',
  smokeOrange:   '218, 139, 72',
};

// ── FONT FAMILY TOKENS ───────────────────────────────────────────────────────
const FONTS = {
  primary: 'var(--sys-type-fontFamilies-primary), system-ui, sans-serif',
  display: 'var(--sys-type-fontFamilies-display), serif',
  mono:    'var(--sys-type-fontFamilies-mono), monospace',
  curator: 'var(--sys-type-fontFamilies-curator), cursive',
};

// ── SHAPE TOKENS — v6.1 Archetype System ─────────────────────────────────────
const SHAPES = {
  // March archetype: interactive nav items
  march:    'var(--sys-shape-marchSurge01)',    // 20px 8px 12px 32px
  // Block archetype: surfaces / raised cards
  block:    'var(--sys-shape-blockRiot02)',     // 20px 4px 12px 2px
  // Scaffold archetype: layout containers (immutable)
  scaffold: 'var(--sys-shape-scaffoldFrame01)', // 8px 2px 8px 2px
  // Sentry archetype: avatars — NEVER 50%
  sentry:   'var(--sys-shape-sentryAvatar)',    // 98%
};

// ── MOTION — KR Solidarity Slam ──────────────────────────────────────────────
// "typeSpringSlam" 600ms — Spring stiffness 500, damping 27, overshoot enabled
const SLAM_SPRING = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 27,
} as const;

// M3 Expressive Viscous Breeze — for state transitions
const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;

// ── NAV ITEMS — Migration Plan v1.0 ──────────────────────────────────────────
// Order: Home → Operations Dashboard → The Lookout → Campaign Kanban
//        → Smart Ingestion → Analysis Workbench → Account Control
const mainNavItems = [
  {
    path:     '/',
    icon:     Home,
    label:    'Home',
    sublabel: 'LANDING',
  },
  {
    path:     '/dashboard',
    icon:     LayoutGrid,
    label:    'Operations Dashboard',
    sublabel: 'OVERVIEW',
  },
  {
    path:     '/opportunities',
    icon:     Crosshair,
    label:    'The Lookout',
    sublabel: 'INTELLIGENCE',
  },
  {
    path:     '/tracker',
    icon:     GanttChart,
    label:    'Campaign Kanban',
    sublabel: 'PIPELINE',
  },
  {
    path:     '/career/ingest',
    icon:     ArrowDownToLine,
    label:    'Smart Ingestion',
    sublabel: 'INGEST',
  },
  {
    path:     '/analysis',
    icon:     BarChart3,
    label:    'Analysis Workbench',
    sublabel: 'PERFORMANCE',
  },
  {
    path:     '/profile',
    icon:     ShieldCheck,
    label:    'Account Control',
    sublabel: 'PROFILE',
  },
];

const bottomNavItems = [
  { path: '/style-guide', icon: BookOpen, label: 'Style Guide', sublabel: 'CODEX' },
];

// ── SIDEBAR COMPONENT ─────────────────────────────────────────────────────────
export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={SLAM_SPRING}
        className="fixed top-6 left-6 z-50 lg:hidden p-3"
        style={{
          background:   COLORS.surface2,
          borderRadius: SHAPES.march,
          border:       `1px solid ${COLORS.surface4}`,
          color:        COLORS.workerAsh,
        }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR — Scaffold layer ─────────────────────────────────────── */}
      <aside
        className={`
          flex flex-col z-40
          fixed inset-y-0 left-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[280px]
          md:sticky md:top-0 md:h-screen md:translate-x-0 md:w-[72px]
          lg:w-[280px]
        `}
        style={{
          // Solidarity Charcoal #1A1714 — mandated sidebar background
          background:  COLORS.charcoalBase,
          borderRight: `1px solid ${COLORS.surface3}`,
          transition:  `transform 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
        }}
      >
        {/* Noise texture overlay — screenprint grain */}
        <div className="absolute inset-0 noise-texture pointer-events-none" style={{ background: 'transparent' }} />

        {/* Solidarity Red top bleed — 3px accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: COLORS.solidarityRed }}
        />

        {/* ── Logo Area ─────────────────────────────────────────────────── */}
        <div className="p-8 pb-6 md:p-4 lg:p-8 md:pb-4 lg:pb-6 flex-shrink-0 relative z-10 mt-4 lg:mt-8">
          <Link to="/dashboard" className="block">
            <div className="md:hidden lg:block">
              <Logo variant="horizontal" size={48} />
            </div>
            <div className="hidden md:block lg:hidden mx-auto w-12 h-12">
              <Logo variant="icon" size={48} className="mx-auto" />
            </div>
          </Link>
        </div>

        {/* ── Main Navigation ───────────────────────────────────────────── */}
        <nav
          className="flex-1 px-4 md:px-2 lg:px-4 overflow-y-auto relative z-10 space-y-1"
          aria-label="Main navigation"
        >
          {mainNavItems.map((item) => {
            // Exact match for root "/", prefix match for all others
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                {/* KR Solidarity "Slam" hover — Spring stiffness 500, damping 27 */}
                <motion.div
                  whileHover={{
                    scale: 1.04,
                    x: 6,
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={SLAM_SPRING}
                  className="flex items-center gap-4 px-5 py-3.5 group md:justify-center lg:justify-start md:px-3 lg:px-5"
                  style={{
                    // March archetype — interactive shape
                    borderRadius: SHAPES.march,
                    // Active: inkGold tint bg + left border
                    background:   isActive
                      ? `rgba(${RGB.inkGold}, 0.10)`
                      : 'transparent',
                    borderLeft:   isActive
                      ? `3px solid ${COLORS.inkGold}`
                      : '3px solid transparent',
                    // Shape morphs on active — explicit transition
                    transition: [
                      `background 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                      `border-color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                    ].join(', '),
                  }}
                  title={item.label}
                >
                  {/* Icon — inkGold when active, muted ash when idle */}
                  <Icon
                    size={20}
                    style={{
                      color:      isActive ? COLORS.inkGold : COLORS.workerAshMuted,
                      flexShrink: 0,
                      transition: `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                    }}
                  />

                  {/* Text block — hidden at md collapsed width */}
                  <div className="md:hidden lg:block flex-1 min-w-0">
                    {/* Label — wght 800 active (inkGold) vs wght 400 idle */}
                    <p
                      style={{
                        fontFamily:            FONTS.primary,
                        fontVariationSettings: isActive
                          ? "'wght' 800"
                          : "'wght' 400",
                        fontSize:     '13px',
                        // Active: inkGold. Idle: muted ash.
                        color:        isActive ? COLORS.inkGold : COLORS.workerAshMuted,
                        letterSpacing:'0.01em',
                        transition: [
                          `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                          `font-variation-settings 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                        ].join(', '),
                        margin:       0,
                        whiteSpace:   'nowrap',
                        overflow:     'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.label}
                    </p>

                    {/* Sublabel — mono wght 100, visible only when active */}
                    {isActive && (
                      <p
                        style={{
                          fontFamily:            FONTS.mono,
                          fontVariationSettings: "'wght' 100",
                          fontSize:     '9px',
                          letterSpacing:'0.10em',
                          textTransform:'uppercase' as const,
                          // Sublabel uses solidarityRed for contrast against inkGold label
                          color:        COLORS.solidarityRed,
                          marginTop:    '2px',
                          margin:       '2px 0 0',
                        }}
                      >
                        {item.sublabel}
                      </p>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Divider — ink bleed line */}
        <div
          className="mx-6 md:mx-3 lg:mx-6 relative z-10"
          style={{
            height:     '1px',
            background: `linear-gradient(90deg, rgba(${RGB.inkGold}, 0.20), ${COLORS.surface3} 60%, transparent)`,
          }}
        />

        {/* ── Bottom Nav ────────────────────────────────────────────────── */}
        <div className="px-4 md:px-2 lg:px-4 py-3 relative z-10 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <motion.div
                  whileHover={{ scale: 1.04, x: 6 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SLAM_SPRING}
                  className="flex items-center gap-4 px-5 py-3 group md:justify-center lg:justify-start md:px-3 lg:px-5"
                  style={{
                    borderRadius: SHAPES.march,
                    background:   isActive
                      ? `rgba(${RGB.inkGold}, 0.10)`
                      : 'transparent',
                    borderLeft:   isActive
                      ? `3px solid ${COLORS.inkGold}`
                      : '3px solid transparent',
                    transition: `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                  }}
                  title={item.label}
                >
                  <Icon
                    size={18}
                    style={{
                      color:      isActive ? COLORS.inkGold : COLORS.workerAshMuted,
                      flexShrink: 0,
                      transition: `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                    }}
                  />
                  <p
                    className="md:hidden lg:block"
                    style={{
                      fontFamily:            FONTS.primary,
                      fontVariationSettings: isActive ? "'wght' 800" : "'wght' 400",
                      fontSize:     '12px',
                      color:        isActive ? COLORS.inkGold : COLORS.workerAshMuted,
                      margin:       0,
                      transition:   `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                    }}
                  >
                    {item.label}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* ── User Profile — Scaffold archetype ────────────────────────── */}
        <div
          className="p-4 m-4 md:p-2 md:m-2 lg:p-4 lg:m-4 flex-shrink-0 relative z-10 noise-texture overflow-hidden"
          style={{
            // Step 2 elevation above sidebar base
            background:   COLORS.surface2,
            borderRadius: SHAPES.scaffold,
            border:       `1px solid ${COLORS.surface3}`,
          }}
        >
          <div className="flex items-center gap-3 md:flex-col lg:flex-row relative z-10">
            {/* Avatar — Sentry shape (98%, NEVER 50%) */}
            <div
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
              style={{
                background:   `linear-gradient(135deg, rgba(${RGB.solidarityRed}, 1), rgba(${RGB.smokeOrange}, 1))`,
                borderRadius: SHAPES.sentry,
              }}
            >
              <span
                style={{
                  fontFamily:            FONTS.primary,
                  fontVariationSettings: "'wght' 800",
                  fontSize:   '14px',
                  color:      COLORS.canvas,
                }}
              >
                N
              </span>
            </div>

            {/* Name + role — hidden at md collapsed width */}
            <div className="flex-1 md:hidden lg:block min-w-0">
              <p
                style={{
                  fontFamily:            FONTS.primary,
                  fontVariationSettings: "'wght' 800",
                  fontSize: '13px',
                  color:    COLORS.workerAsh,
                  margin:   0,
                }}
              >
                Nishant
              </p>
              <p
                style={{
                  fontFamily:            FONTS.mono,
                  fontVariationSettings: "'wght' 100",
                  fontSize:     '9px',
                  letterSpacing:'0.08em',
                  textTransform:'uppercase' as const,
                  color:        COLORS.inkGold,
                  marginTop:    '2px',
                  margin:       '2px 0 0',
                }}
              >
                SOLIDARITY MEMBER
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
