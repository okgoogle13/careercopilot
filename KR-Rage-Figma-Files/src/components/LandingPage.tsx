import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Archive, Shield, FileText } from 'lucide-react';

// ============================================================================
// LANDING PAGE — "THE SOLIDARITY MANIFESTO"
// Primary entry point and brand manifesto. Establish Solidarity Mode ethos.
// Kerala Rage / Solidarity Mode — hi-fi spec implementation.
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
  colorAccent: "'Nabla', sans-serif",
};

const SHAPES = {
  pebble: '16px 8px 12px 20px',
  stone: '42% 58% 45% 55% / 48% 62% 38% 52%',
};

const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

// ============================================================================
// ASSET PLACEHOLDER — Colored rectangle with ID label
// ============================================================================

function AssetPlaceholder({
  id,
  aspect,
  className,
  color,
  opacity = 0.25,
}: {
  id: string;
  aspect: string;
  className?: string;
  color?: string;
  opacity?: number;
}) {
  const [w, h] = aspect.split(':').map(Number);
  const ratio = (h / w) * 100;

  return (
    <div
      className={`relative overflow-hidden ${className || ''}`}
      style={{
        paddingBottom: `${ratio}%`,
        background: color || COLORS.surface3,
        borderRadius: SHAPES.pebble,
        border: `1px dashed ${COLORS.surface5}`,
        opacity,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: '10px',
            fontWeight: 700,
            color: COLORS.workerAshMuted,
            letterSpacing: '0.04em',
          }}
        >
          {id}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE CARD — Stone shape
// ============================================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_SETTLE, delay: 0.6 + index * 0.1 }}
      whileHover={{ y: -6, boxShadow: `0 8px 16px rgba(0,0,0,0.45)` }}
      className="relative overflow-hidden noise-texture cursor-default"
      style={{
        background: COLORS.surface1,
        borderRadius: SHAPES.pebble,
        border: `1px solid ${COLORS.surface3}`,
        padding: '32px',
      }}
    >
      {/* Accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: accent }}
      />

      <div
        className="mb-5 p-3 inline-flex"
        style={{
          background: `${accent}15`,
          borderRadius: SHAPES.pebble,
        }}
      >
        <Icon size={24} style={{ color: accent }} />
      </div>

      <h3
        style={{
          fontFamily: FONTS.display,
          fontVariationSettings: "'wght' 700, 'wdth' 100, 'SOFT' 20, 'WONK' 0",
          fontSize: '20px',
          textTransform: 'uppercase' as const,
          color: COLORS.workerAsh,
          marginBottom: '8px',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: FONTS.primary,
          fontWeight: 400,
          fontSize: '14px',
          color: COLORS.workerAsh,
          opacity: 0.65,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: COLORS.canvas }}>

      {/* ─── Z-0: SUBSTRATE PLACEHOLDER ─── */}
      <div className="fixed inset-0 -z-20" style={{ background: COLORS.canvas }}>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: COLORS.surface2,
            opacity: 0.25,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: '14px',
              fontWeight: 700,
              color: COLORS.workerAshDim,
              letterSpacing: '0.04em',
            }}
          >
            KR-SOLID-034 · MELBOURNE LANEWAY · SUBSTRATE
          </span>
        </div>
      </div>

      {/* ─── Z-1: Mesh gradient atmosphere ─── */}
      <div className="fixed inset-0 -z-10 mesh-gradient" />

      {/* ─── Z-2: ATMOSPHERE PLACEHOLDERS ─── */}
      {/* Wheat Paste Tear — top-right */}
      <div
        className="fixed top-0 right-0 -z-5 w-[200px] h-[300px]"
        style={{
          background: `${COLORS.smokeOrange}08`,
          borderRadius: '0 0 0 60%',
          border: `1px dashed ${COLORS.surface4}`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontFamily: FONTS.mono, fontSize: '9px', fontWeight: 700, color: COLORS.workerAshDim, letterSpacing: '0.04em', textAlign: 'center' as const }}>
            KR-UI-001{'\n'}WHEAT PASTE
          </span>
        </div>
      </div>

      {/* Halo Disk — bottom-left */}
      <div
        className="fixed bottom-20 left-10 -z-5 w-[180px] h-[180px]"
        style={{
          background: `radial-gradient(circle, ${COLORS.inkGold}12 0%, transparent 70%)`,
          borderRadius: '98%',
          border: `1px dashed ${COLORS.surface4}`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontFamily: FONTS.mono, fontSize: '9px', fontWeight: 700, color: COLORS.workerAshDim, letterSpacing: '0.04em' }}>
            KR-UI-002
          </span>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="relative z-10 px-8 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">

          {/* ═══════════════════════════════════════════
              HERO SECTION
              ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 lg:mb-32">

            {/* Left Column — Copy (7 cols) */}
            <div className="lg:col-span-7">
              {/* Micro label */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.1 }}
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: COLORS.solidarityRed,
                  marginBottom: '24px',
                }}
              >
                CAREER COPILOT // SOLIDARITY MODE
              </motion.p>

              {/* Hero Headline — Fraunces Energetic */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.15 }}
                style={{
                  fontFamily: FONTS.display,
                  fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1",
                  fontSize: 'clamp(3rem, 8vw, 9rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  color: COLORS.solidarityRed,
                  marginBottom: '32px',
                  textTransform: 'uppercase' as const,
                }}
              >
                THE<br />
                SOLIDARITY<br />
                MANIFESTO
              </motion.h1>

              {/* Subhead — Nabla for "collective", Caveat for rest */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.3 }}
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                  lineHeight: 1.3,
                  color: COLORS.inkGold,
                  marginBottom: '48px',
                  maxWidth: '600px',
                }}
              >
                <span style={{ fontFamily: FONTS.curator, fontWeight: 700 }}>
                  Your professional history, re-documented for the{' '}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.colorAccent,
                    fontSize: '1.15em',
                  }}
                >
                  collective
                </span>
                <span style={{ fontFamily: FONTS.curator, fontWeight: 700 }}>
                  {' '}future.
                </span>
              </motion.p>

              {/* CTA Buttons — Pebble shape */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    className="flex items-center gap-3 group"
                    style={{
                      background: COLORS.solidarityRed,
                      color: COLORS.canvas,
                      fontFamily: FONTS.primary,
                      fontWeight: 800,
                      fontSize: '14px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase' as const,
                      padding: '16px 36px',
                      borderRadius: SHAPES.pebble,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: `0 0 20px ${COLORS.solidarityRed}55`,
                    }}
                  >
                    BUILD YOUR STORY
                    <ArrowRight size={18} className="group-hover:translate-x-1" style={{ transition: `transform 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})` }} />
                  </motion.button>
                </Link>

                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    style={{
                      background: 'transparent',
                      color: COLORS.inkGold,
                      fontFamily: FONTS.primary,
                      fontWeight: 700,
                      fontSize: '14px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase' as const,
                      padding: '16px 36px',
                      borderRadius: SHAPES.pebble,
                      border: `1px solid ${COLORS.inkGold}40`,
                      cursor: 'pointer',
                    }}
                  >
                    VIEW THE COLLECTIVE
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Right Column — Resistance Anchor placeholder (5 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING_SETTLE, delay: 0.3 }}
              className="lg:col-span-5 relative"
            >
              {/* Main anchor placeholder */}
              <div
                className="relative overflow-hidden"
                style={{
                  background: COLORS.surface2,
                  borderRadius: SHAPES.pebble,
                  border: `1px dashed ${COLORS.surface4}`,
                  aspectRatio: '3/4',
                  maxHeight: '560px',
                }}
              >
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 30%, ${COLORS.canvas}ee 100%)`,
                    zIndex: 1,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p style={{ fontFamily: FONTS.mono, fontSize: '12px', fontWeight: 700, color: COLORS.workerAshDim, letterSpacing: '0.06em' }}>
                      KR-SOLID-025
                    </p>
                    <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, marginTop: '4px' }}>
                      BHAGAT SINGH V1
                    </p>
                    <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.workerAshMuted, marginTop: '2px' }}>
                      HEROIC · 3:4
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating accent card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SETTLE, delay: 0.5 }}
                className="absolute -bottom-4 -left-6 z-10 p-5 noise-texture overflow-hidden"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                  maxWidth: '220px',
                }}
              >
                <p style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: '32px', color: COLORS.inkGold, lineHeight: 1 }}>
                  127
                </p>
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.workerAshMuted, marginTop: '4px' }}>
                  STORIES ARCHIVED
                </p>
              </motion.div>
            </motion.div>
          </div>


          {/* ═══════════════════════════════════════════
              FEATURE GRID — 3 Stone Cards
              ══════════════════════════════════════════ */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SETTLE, delay: 0.5 }}
              className="mb-8"
            >
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: COLORS.workerAshMuted,
                  marginBottom: '8px',
                }}
              >
                THE SOLIDARITY TOOLKIT
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FeatureCard
                icon={FileText}
                title="Build Your Story"
                description="Upload your resume, parse your experience, and let the archive reconstruct your professional narrative with precision."
                accent={COLORS.solidarityRed}
                index={0}
              />
              <FeatureCard
                icon={Archive}
                title="Archive Evidence"
                description="Every skill, every role, every achievement — catalogued, cross-referenced, and ready for deployment at a moment's notice."
                accent={COLORS.inkGold}
                index={1}
              />
              <FeatureCard
                icon={Shield}
                title="Resist Slop"
                description="AI-powered responses that cut through generic templates. Your applications are weapons of specificity, not wallpaper."
                accent={COLORS.signalGreen}
                index={2}
              />
            </div>
          </section>


          {/* ═══════════════════════════════════════════
              FOOTER
              ═══════════════════════════════════════════ */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${COLORS.surface3}` }}
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
              BUILT WITH SOLIDARITY // CAREER COPILOT v1.0
            </p>
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
    </div>
  );
}