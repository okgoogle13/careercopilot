import { Link, useLocation } from 'react-router';
import {
  Home, Briefcase, FileText, BarChart3, Search,
  Settings, Menu, X, BookOpen, LayoutDashboard,
  Sparkles, FolderOpen,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

// ============================================================================
// SIDEBAR — KERALA RAGE / SOLIDARITY MODE
// Charcoal nav surface, Fraunces display title, Pebble shapes,
// M3 Expressive micro-interactions, JetBrains Mono data labels.
// ============================================================================

const COLORS = {
  canvas: '#0F0F0F',
  surface1: '#1A1A1A',
  surface2: '#242424',
  surface3: '#2A2A2A',
  surface4: '#323232',
  surface5: '#3A3A3A',
  surface6: '#444444',
  solidarityRed: '#F14714',
  inkGold: '#DAF674',
  stencilYellow: '#F6E748',
  signalGreen: '#48F0E5',
  workerAsh: '#DAF6B3',
  workerAshMuted: '#9AAF7D',
  workerAshDim: '#7A8A6D',
  smokeOrange: '#DA8B48',
  metalBlue: '#48B3DA',
};

const FONTS = {
  primary: "'Work Sans', system-ui, sans-serif",
  display: "'Fraunces', serif",
  mono: "'JetBrains Mono', monospace",
  curator: "'Caveat', cursive",
};

const SHAPES = {
  pebble: '16px 8px 12px 20px',
};

const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;

const mainNavItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard', sublabel: 'THE COLLECTIVE' },
  { path: '/kanban', icon: LayoutDashboard, label: 'Command Center', sublabel: 'KANBAN BOARD' },
  { path: '/documents', icon: FileText, label: 'The Archive', sublabel: 'DOCUMENTS' },
  { path: '/analysis', icon: BarChart3, label: 'The Audit', sublabel: 'PERFORMANCE' },
  { path: '/feed', icon: Search, label: 'The Lookout', sublabel: 'OPPORTUNITIES' },
  { path: '/ksc-generator', icon: Sparkles, label: 'The Workshop', sublabel: 'KSC STUDIO' },
  { path: '/asset-library', icon: FolderOpen, label: 'Assets', sublabel: 'LIBRARY' },
];

const bottomNavItems = [
  { path: '/settings', icon: Settings, label: 'Settings', sublabel: 'VAULT' },
  { path: '/style-guide', icon: BookOpen, label: 'Style Guide', sublabel: 'CODEX' },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
        className="fixed top-6 left-6 z-50 lg:hidden p-3"
        style={{
          background: COLORS.surface2,
          borderRadius: SHAPES.pebble,
          border: `1px solid ${COLORS.surface4}`,
          color: COLORS.workerAsh,
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

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col z-40
          fixed inset-y-0 left-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[280px]
          md:relative md:translate-x-0 md:w-[72px]
          lg:w-[280px]
        `}
        style={{
          background: COLORS.surface1,
          borderRight: `1px solid ${COLORS.surface3}`,
          transition: `transform 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
        }}
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 noise-texture pointer-events-none" style={{ background: 'transparent' }}>
          <div className="absolute inset-0" />
        </div>

        {/* Logo Area */}
        <div className="p-8 pb-6 md:p-4 lg:p-8 md:pb-4 lg:pb-6 flex-shrink-0 relative z-10 mt-4 lg:mt-8">
          {/* Logo mark — Solidarity Red slab */}
          <motion.div
            className="w-12 h-12 flex items-center justify-center md:mx-auto lg:mx-0"
            style={{
              background: COLORS.solidarityRed,
              borderRadius: SHAPES.pebble,
              boxShadow: `0 0 12px ${COLORS.solidarityRed}66`,
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
          >
            <span
              style={{
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: '20px',
                color: COLORS.canvas,
              }}
            >
              CC
            </span>
          </motion.div>

          {/* Title — Fraunces display */}
          <h4
            className="mt-5 md:hidden lg:block"
            style={{
              fontFamily: FONTS.display,
              fontVariationSettings: "'wght' 800, 'wdth' 110",
              fontSize: '18px',
              color: COLORS.workerAsh,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            Career{' '}
            <span style={{ color: COLORS.stencilYellow }}>Copilot</span>
          </h4>

          {/* Sublabel */}
          <p
            className="mt-2 md:hidden lg:block"
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: COLORS.solidarityRed,
            }}
          >
            SOLIDARITY MODE
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 md:px-2 lg:px-4 overflow-y-auto relative z-10 space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center gap-4 px-5 py-3.5 group md:justify-center lg:justify-start md:px-3 lg:px-5"
                  style={{
                    borderRadius: SHAPES.pebble,
                    background: isActive ? `${COLORS.solidarityRed}15` : 'transparent',
                    borderLeft: isActive ? `3px solid ${COLORS.solidarityRed}` : '3px solid transparent',
                    transition: `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                  }}
                  title={item.label}
                >
                  <Icon
                    size={20}
                    style={{
                      color: isActive ? COLORS.solidarityRed : COLORS.workerAshMuted,
                      flexShrink: 0,
                      transition: `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                    }}
                    className="group-hover:rotate-12"
                  />
                  <div className="md:hidden lg:block flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: FONTS.primary,
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '13px',
                        color: isActive ? COLORS.workerAsh : COLORS.workerAshMuted,
                        letterSpacing: '0.02em',
                        transition: `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                      }}
                      className="group-hover:!text-[#DAF6B3]"
                    >
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          className="mx-6 md:mx-3 lg:mx-6 relative z-10"
          style={{
            height: '1px',
            background: COLORS.surface3,
          }}
        />

        {/* Bottom Nav */}
        <div className="px-4 md:px-2 lg:px-4 py-3 relative z-10 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center gap-4 px-5 py-3 group md:justify-center lg:justify-start md:px-3 lg:px-5"
                  style={{
                    borderRadius: SHAPES.pebble,
                    background: isActive ? `${COLORS.solidarityRed}15` : 'transparent',
                    borderLeft: isActive ? `3px solid ${COLORS.solidarityRed}` : '3px solid transparent',
                  }}
                  title={item.label}
                >
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? COLORS.solidarityRed : COLORS.workerAshMuted,
                      flexShrink: 0,
                    }}
                    className="group-hover:rotate-12"
                  />
                  <p
                    className="md:hidden lg:block"
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: isActive ? 800 : 500,
                      fontSize: '12px',
                      color: isActive ? COLORS.workerAsh : COLORS.workerAshMuted,
                    }}
                  >
                    {item.label}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* User Profile */}
        <div
          className="p-4 m-4 md:p-2 md:m-2 lg:p-4 lg:m-4 flex-shrink-0 relative z-10 noise-texture overflow-hidden"
          style={{
            background: COLORS.surface2,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <div className="flex items-center gap-3 md:flex-col lg:flex-row relative z-10">
            {/* Avatar — Sentry shape (98%, NOT 50%) */}
            <div
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${COLORS.solidarityRed}, ${COLORS.smokeOrange})`,
                borderRadius: '98%',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.primary,
                  fontWeight: 800,
                  fontSize: '14px',
                  color: COLORS.canvas,
                }}
              >
                N
              </span>
            </div>
            <div className="flex-1 md:hidden lg:block min-w-0">
              <p
                style={{
                  fontFamily: FONTS.primary,
                  fontWeight: 800,
                  fontSize: '13px',
                  color: COLORS.workerAsh,
                }}
              >
                Nishant
              </p>
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '9px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  color: COLORS.inkGold,
                  marginTop: '2px',
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