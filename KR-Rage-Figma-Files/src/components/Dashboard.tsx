import { Plus, FileText, TrendingUp, Briefcase, ArrowUpRight, Clock, Zap, Eye } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import moodBoardImage from 'figma:asset/da39bad7e7d503f7160d5074e14edb60898d0276.png';

// ============================================================================
// KERALA RAGE — SOLIDARITY MODE — DASHBOARD
// Reference implementation for the Kerala Rage design system.
// ============================================================================

// --- DESIGN TOKENS (inline for portability) ---
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
  activistGreen: '#48DA8B',
  workerAsh: '#DAF6B3',
  workerAshMuted: '#9AAF7D',
  workerAshDim: '#7A8A6D',
  smokeOrange: '#DA8B48',
  metalBlue: '#48B3DA',
  charcoalRed: '#F14844',
};

const FONTS = {
  primary: "'Work Sans', system-ui, sans-serif",
  display: "'Fraunces', serif",
  proclamation: "'Libre Bodoni', serif",
  mono: "'JetBrains Mono', monospace",
  curator: "'Caveat', cursive",
};

const SHAPES = {
  pebble: '16px 8px 12px 20px',
  slab: '48% 52% 58% 42% / 55% 45% 60% 40%',
  stone: '42% 58% 45% 55% / 48% 62% 38% 52%',
  sentry: '98%',
};

// M3 Expressive — the ONLY allowed easing
const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Profile {
  role: string;
  org: string;
  score: number;
  status: string;
  daysAgo: number;
}

interface MetricItem {
  label: string;
  value: string;
  sublabel: string;
  color: string;
  icon: React.ElementType;
}

// ============================================================================
// MOCK DATA — Career Copilot for Social Workers
// ============================================================================

const PROFILES: Profile[] = [
  { role: 'Senior Case Manager', org: 'Berry Street', score: 94, status: 'STRONG', daysAgo: 2 },
  { role: 'Family Violence Practitioner', org: 'Safe Steps', score: 87, status: 'SOLID', daysAgo: 5 },
  { role: 'Youth Outreach Worker', org: 'Frontyard', score: 71, status: 'BUILDING', daysAgo: 8 },
  { role: 'AOD Counsellor', org: 'Uniting', score: 63, status: 'DEVELOPING', daysAgo: 12 },
];

const METRICS: MetricItem[] = [
  { label: 'ACTIVE APPLICATIONS', value: '8', sublabel: '+3 this week', color: COLORS.solidarityRed, icon: Briefcase },
  { label: 'INTERVIEWS PENDING', value: '3', sublabel: 'Next: Tomorrow 2pm', color: COLORS.stencilYellow, icon: Clock },
  { label: 'ATS MATCH AVG', value: '79%', sublabel: '↑12% from last month', color: COLORS.inkGold, icon: TrendingUp },
  { label: 'DOCS READY', value: '14', sublabel: '2 need updating', color: COLORS.signalGreen, icon: FileText },
];

// ============================================================================
// HELPER: Score → Color mapping
// ============================================================================
function scoreColor(score: number): string {
  if (score >= 90) return COLORS.inkGold;
  if (score >= 80) return COLORS.activistGreen;
  if (score >= 70) return COLORS.stencilYellow;
  return COLORS.smokeOrange;
}

function scoreGlow(score: number): string {
  const c = scoreColor(score);
  return `0 0 12px ${c}66`;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/** Acknowledgment of Country — in-situ, not decorative */
function AcknowledgmentStrip() {
  return (
    <div
      className="mb-8 px-4 py-3 border-l-2 opacity-80"
      style={{
        borderColor: COLORS.workerAsh,
        fontFamily: FONTS.mono,
        fontSize: '11px',
        letterSpacing: '0.04em',
        color: COLORS.workerAsh,
        lineHeight: 1.6,
      }}
    >
      We acknowledge the Traditional Owners of the land on which we work and live,
      and pay our respects to Elders past, present and emerging.
      Sovereignty was never ceded. This always was, always will be Aboriginal land.
    </div>
  );
}

/** Single metric card — Pebble shape, mono data */
function MetricCard({ metric, index }: { metric: MetricItem; index: number }) {
  const Icon = metric.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_SLAM, delay: 0.2 + index * 0.08 }}
      whileHover={{
        y: -4,
        boxShadow: `0 8px 16px rgba(0,0,0,0.45)`,
      }}
      className="relative overflow-hidden noise-texture"
      style={{
        background: COLORS.surface1,
        borderRadius: SHAPES.pebble,
        border: `1px solid ${COLORS.surface4}`,
        padding: '24px',
        cursor: 'default',
      }}
    >
      {/* Accent stripe at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: metric.color }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2"
          style={{
            background: `${metric.color}15`,
            borderRadius: SHAPES.pebble,
          }}
        >
          <Icon size={20} style={{ color: metric.color }} />
        </div>
        <ArrowUpRight size={14} style={{ color: COLORS.workerAshDim }} />
      </div>

      {/* Value — extreme weight, mono */}
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 800,
          fontSize: '36px',
          lineHeight: 1,
          color: COLORS.workerAsh,
          letterSpacing: '-0.02em',
          marginBottom: '4px',
        }}
      >
        {metric.value}
      </p>

      {/* Label — data label pattern */}
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: COLORS.workerAshMuted,
          marginBottom: '8px',
        }}
      >
        {metric.label}
      </p>

      {/* Sublabel */}
      <p
        style={{
          fontFamily: FONTS.primary,
          fontWeight: 400,
          fontSize: '12px',
          color: metric.color,
          opacity: 0.9,
        }}
      >
        {metric.sublabel}
      </p>
    </motion.div>
  );
}

/** ATS Profile Card — Slab shape, score-coded */
function ProfileCard({ profile, index }: { profile: Profile; index: number }) {
  const color = scoreColor(profile.score);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING_SETTLE, delay: 0.4 + index * 0.1 }}
      whileHover={{
        y: -6,
        boxShadow: `0 8px 16px rgba(0,0,0,0.45)`,
      }}
      className="relative overflow-hidden noise-texture group cursor-pointer"
      style={{
        background: COLORS.surface1,
        borderRadius: SHAPES.pebble,
        border: `1px solid ${COLORS.surface3}`,
        padding: '28px',
      }}
    >
      {/* Score bar at left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 pr-4">
          {/* Role — proclamation font */}
          <h4
            className="mb-1 group-hover:opacity-100 opacity-90"
            style={{
              fontFamily: FONTS.proclamation,
              fontWeight: 700,
              fontSize: '17px',
              color: COLORS.workerAsh,
              lineHeight: 1.3,
              transition: `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
            }}
          >
            {profile.role}
          </h4>

          {/* Org — mono data label */}
          <p
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 500,
              fontSize: '11px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              color: COLORS.workerAshMuted,
            }}
          >
            {profile.org}
          </p>
        </div>

        {/* Score — large mono number */}
        <div className="text-right">
          <p
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 800,
              fontSize: '32px',
              lineHeight: 1,
              color: color,
              textShadow: scoreGlow(profile.score),
            }}
          >
            {profile.score}
          </p>
          <p
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: color,
              opacity: 0.7,
              marginTop: '4px',
            }}
          >
            ATS SCORE
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Status badge */}
        <span
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 700,
            fontSize: '10px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: color,
            background: `${color}18`,
            padding: '4px 12px',
            borderRadius: SHAPES.pebble,
            border: `1px solid ${color}30`,
          }}
        >
          {profile.status}
        </span>

        {/* Time ago */}
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: '10px',
            color: COLORS.workerAshMuted,
            letterSpacing: '0.04em',
          }}
        >
          {profile.daysAgo}d ago
        </span>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Scroll-Pressure: hero headline weight shifts 300→900 as user scrolls
  const heroWeight = useTransform(scrollYProgress, [0, 0.15], [300, 900]);
  const heroWidth = useTransform(scrollYProgress, [0, 0.15], [100, 120]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      style={{ background: COLORS.canvas }}
    >
      {/* ─── ATMOSPHERE: Mesh gradient + noise ─── */}
      <div className="fixed inset-0 -z-10 mesh-gradient noise-texture" style={{ background: COLORS.canvas }} />

      <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">

        {/* ═══════════════════════════════════════════
            1. HERO — Wheat-paste wall proclamation
            ═══════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden mb-10 noise-texture"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
            minHeight: '320px',
          }}
        >
          {/* Mood board image — decorative backdrop, wheat-paste texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${moodBoardImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              opacity: 0.06,
              mixBlendMode: 'screen',
            }}
          />

          {/* Solidarity Red accent strip — top */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: COLORS.solidarityRed }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full" style={{ minHeight: '320px' }}>
            <div>
              {/* Micro label */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.1 }}
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: COLORS.solidarityRed,
                  marginBottom: '16px',
                }}
              >
                CAREER COPILOT // THE COLLECTIVE
              </motion.p>

              {/* Hero headline — Scroll Pressure emotional pattern */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.15 }}
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: heroWeight,
                  fontVariationSettings: `'wdth' ${heroWidth}`,
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                  color: COLORS.workerAsh,
                  marginBottom: '16px',
                  maxWidth: '700px',
                }}
              >
                THE COLLECTIVE IS{' '}
                <span style={{ color: COLORS.stencilYellow }}>
                  THRIVING
                </span>
              </motion.h1>

              {/* Sub-copy — melancholy longing pattern (reflective) */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.25 }}
                style={{
                  fontFamily: FONTS.primary,
                  fontVariationSettings: "'wght' 475, 'wdth' 98",
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: COLORS.workerAsh,
                  opacity: 0.7,
                  maxWidth: '500px',
                  marginBottom: '32px',
                }}
              >
                You have{' '}
                <span style={{ color: COLORS.signalGreen, fontWeight: 700 }}>
                  3 interviews
                </span>{' '}
                this week and{' '}
                <span style={{ color: COLORS.stencilYellow, fontWeight: 700 }}>
                  2 documents
                </span>{' '}
                that need updating.
              </motion.p>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SLAM, delay: 0.35 }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                style={{
                  background: COLORS.solidarityRed,
                  color: COLORS.canvas,
                  fontFamily: FONTS.primary,
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  padding: '12px 28px',
                  borderRadius: SHAPES.pebble,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 0 12px ${COLORS.solidarityRed}66`,
                }}
              >
                View Schedule
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                style={{
                  background: 'transparent',
                  color: COLORS.inkGold,
                  fontFamily: FONTS.primary,
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  padding: '12px 28px',
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.inkGold}40`,
                  cursor: 'pointer',
                }}
              >
                New Application
              </motion.button>
            </motion.div>
          </div>

          {/* Curator handwritten annotation — positioned like a sticky note */}
          <motion.div
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 0.6, rotate: -4 }}
            transition={{ ...SPRING_SETTLE, delay: 0.5 }}
            className="absolute bottom-6 right-8 hidden md:block pointer-events-none"
            style={{
              fontFamily: FONTS.curator,
              fontSize: '18px',
              color: COLORS.stencilYellow,
              transform: 'rotate(-4deg)',
              textShadow: `0 0 20px ${COLORS.stencilYellow}40`,
            }}
          >
            momentum is building...
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════
            2. ACKNOWLEDGMENT — In-situ, respectful
            ═══════════════════════════════════════════ */}
        <AcknowledgmentStrip />

        {/* ═══════════════════════════════════════════
            3. METRICS GRID — Asymmetric, data-dense
            ═══════════════════════════════════════════ */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m, i) => (
              <MetricCard key={m.label} metric={m} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            4. SPLIT: PROGRESS + QUICK ACTIONS
            ═══════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">

          {/* Career Momentum Panel — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SETTLE, delay: 0.3 }}
            className="lg:col-span-2 relative overflow-hidden noise-texture"
            style={{
              background: COLORS.surface1,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface3}`,
              padding: '32px',
            }}
          >
            {/* Section header — Solidarity Protest emotional pattern */}
            <h3
              style={{
                fontFamily: FONTS.display,
                fontVariationSettings: "'wght' 800, 'wdth' 120",
                fontSize: '24px',
                letterSpacing: '0.02em',
                textTransform: 'uppercase' as const,
                color: COLORS.workerAsh,
                marginBottom: '8px',
              }}
            >
              YOUR{' '}
              <span style={{ color: COLORS.stencilYellow }}>MOMENTUM</span>
            </h3>

            <p
              style={{
                fontFamily: FONTS.primary,
                fontWeight: 400,
                fontSize: '14px',
                color: COLORS.workerAsh,
                opacity: 0.6,
                marginBottom: '28px',
                lineHeight: 1.6,
              }}
            >
              Every application brings you closer. Track your progress across all active roles.
            </p>

            {/* Progress visualization — bar segments */}
            <div className="space-y-5">
              {[
                { label: 'Applications Sent', value: 82, color: COLORS.solidarityRed },
                { label: 'KSC Alignment', value: 71, color: COLORS.inkGold },
                { label: 'Interview Prep', value: 58, color: COLORS.signalGreen },
                { label: 'Network Growth', value: 45, color: COLORS.metalBlue },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontWeight: 600,
                        fontSize: '11px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase' as const,
                        color: COLORS.workerAsh,
                        opacity: 0.8,
                      }}
                    >
                      {bar.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontWeight: 800,
                        fontSize: '13px',
                        color: bar.color,
                      }}
                    >
                      {bar.value}%
                    </span>
                  </div>
                  <div
                    style={{
                      background: COLORS.surface3,
                      borderRadius: '4px',
                      height: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 1.2, ease: M3_EXPRESSIVE, delay: 0.5 }}
                      style={{
                        background: bar.color,
                        height: '100%',
                        borderRadius: '4px',
                        boxShadow: `0 0 8px ${bar.color}44`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SETTLE, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            {[
              { icon: Plus, label: 'NEW APPLICATION', color: COLORS.solidarityRed, filled: true },
              { icon: FileText, label: 'KSC GENERATOR', color: COLORS.inkGold, filled: false },
              { icon: Eye, label: 'VIEW ANALYTICS', color: COLORS.signalGreen, filled: false },
              { icon: Zap, label: 'AI RESUME SCAN', color: COLORS.stencilYellow, filled: false },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center gap-4 w-full text-left"
                  style={{
                    background: action.filled ? action.color : COLORS.surface1,
                    color: action.filled ? COLORS.canvas : COLORS.workerAsh,
                    fontFamily: FONTS.primary,
                    fontWeight: 800,
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    padding: '18px 20px',
                    borderRadius: SHAPES.pebble,
                    border: action.filled ? 'none' : `1px solid ${COLORS.surface3}`,
                    cursor: 'pointer',
                    boxShadow: action.filled ? `0 0 12px ${action.color}66` : 'none',
                  }}
                >
                  <div
                    style={{
                      background: action.filled ? `${COLORS.canvas}30` : `${action.color}15`,
                      padding: '8px',
                      borderRadius: SHAPES.pebble,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} style={{ color: action.filled ? COLORS.canvas : action.color }} />
                  </div>
                  {action.label}
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            5. ATS PROFILES — Slab editorial cards
            ═══════════════════════════════════════════ */}
        <section className="mb-10">
          {/* Section header — Identity Assertion pattern */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3
                style={{
                  fontFamily: FONTS.display,
                  fontVariationSettings: "'wght' 700, 'wdth' 110",
                  fontSize: '22px',
                  textTransform: 'uppercase' as const,
                  color: COLORS.workerAsh,
                  marginBottom: '4px',
                }}
              >
                YOUR PROFILES
              </h3>
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  color: COLORS.workerAshMuted,
                  textTransform: 'uppercase' as const,
                }}
              >
                ATS MATCH SCORES // {PROFILES.length} ACTIVE
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.04em',
                color: COLORS.signalGreen,
                background: 'transparent',
                border: `1px solid ${COLORS.signalGreen}30`,
                borderRadius: SHAPES.pebble,
                padding: '8px 16px',
                cursor: 'pointer',
                textTransform: 'uppercase' as const,
              }}
            >
              View All
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROFILES.map((p, i) => (
              <ProfileCard key={p.role} profile={p} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6. FOOTER STRIP — Solidarity, not decoration
            ═══════════════════════════════════════════ */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            borderTop: `1px solid ${COLORS.surface3}`,
          }}
        >
          <p
            style={{
              fontFamily: FONTS.mono,
              fontSize: '10px',
              letterSpacing: '0.06em',
              color: COLORS.workerAshMuted,
              textTransform: 'uppercase' as const,
            }}
          >
            CAREER COPILOT v1.0 // KERALA RAGE SOLIDARITY MODE
          </p>

          {/* Single slogan — NOT wallpaper, just one anchor */}
          <p
            style={{
              fontFamily: FONTS.curator,
              fontSize: '14px',
              color: COLORS.smokeOrange,
              opacity: 0.6,
            }}
          >
            no neutral canvas
          </p>
        </motion.footer>
      </div>
    </div>
  );
}