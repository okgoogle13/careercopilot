import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Archive, Shield, FileText } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Logo } from './Logo';

// ============================================================================
// LANDING PAGE — "THE SOLIDARITY MANIFESTO"
// Token Sync v2.0 — Zero hardcoded hex values.
// Shape migration: pebble→march, stone→megaphone, slab→placard, sentry→avatar-sentry
// Kerala Rage / Solidarity Mode
// ============================================================================

// ── DIRECT COLOR TOKENS ──────────────────────────────────────────────────────
// For use in CSS `color:`, `background-color:`, `border-color:` etc.
// Source: /styles/design-tokens.css
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  canvas:        'var(--sys-color-charcoalBackground-steps-0)',
  surface1:      'var(--sys-color-charcoalBackground-steps-1)',
  surface2:      'var(--sys-color-charcoalBackground-steps-2)',
  surface3:      'var(--sys-color-charcoalBackground-steps-3)',
  surface4:      'var(--sys-color-charcoalBackground-steps-4)',
  surface5:      'var(--sys-color-charcoalBackground-steps-5)',
  solidarityRed: 'var(--sys-color-solidarityRed-base)',
  inkGold:       'var(--sys-color-inkGold-base)',
  stencilYellow: 'var(--sys-color-stencilYellow-base)',
  signalGreen:   'var(--sys-color-signalGreen-base)',
  activistGreen: 'var(--sys-color-kr-activistSmokeGreen-base)',
  workerAsh:     'var(--sys-color-worker-ash-base)',
  workerAshMuted:'var(--sys-color-worker-ash-steps-1)',  // #8DAF75
  workerAshDim:  'var(--sys-color-worker-ash-steps-0)',  // #627A4F
  smokeOrange:   'var(--sys-color-solidaritySmokeOrange-base)',
  metalBlue:     'var(--sys-color-protestMetalBlue-base)',
  charcoalRed:   'var(--sys-color-kr-charcoalRed-base)',
};

// ── RGB VALUES FOR ALPHA / GRADIENT EXPRESSIONS ONLY ────────────────────────
// Use ONLY when composing rgba() or gradient stop alpha.
// Hex source: design-tokens.css — keep in sync if tokens change.
// ─────────────────────────────────────────────────────────────────────────────
const RGB = {
  solidarityRed: '241, 71, 20',   // --sys-color-solidarityRed-base: #F14714
  inkGold:       '218, 246, 116', // --sys-color-inkGold-base:        #DAF674
  signalGreen:   '72, 240, 229',  // --sys-color-signalGreen-base:    #48F0E5
  activistGreen: '72, 218, 139',  // --sys-color-kr-activistSmokeGreen-base: #48DA8B
  smokeOrange:   '218, 139, 72',  // --sys-color-solidaritySmokeOrange-base: #DA8B48
  canvas:        '15, 15, 15',    // --sys-color-charcoalBackground-steps-0: #0F0F0F
};

// ── FONT FAMILY TOKENS ───────────────────────────────────────────────────────
// Source: /styles/design-tokens.css — --sys-type-fontFamilies-*
// ─────────────────────────────────────────────────────────────────────────────
const FONTS = {
  primary:      "var(--sys-type-fontFamilies-primary), system-ui, sans-serif",
  display:      "var(--sys-type-fontFamilies-display), serif",
  proclamation: "var(--sys-type-fontFamilies-proclamation), serif",
  mono:         "var(--sys-type-fontFamilies-mono), monospace",
  curator:      "var(--sys-type-fontFamilies-curator), cursive",
  colorAccent:  "var(--sys-type-fontFamilies-colorAccent), sans-serif",
};

// ── SHAPE TOKENS — v6.1 Archetype System ─────────────────────────────────────
// Migration map: pebble→march (marchSurge01), stone→megaphone (megaphoneCut01),
//               slab→placard (placardTorn01), sentry→avatar-sentry (sentryAvatar)
// Source: /styles/design-tokens.css — --sys-shape-*
// ─────────────────────────────────────────────────────────────────────────────
const SHAPES = {
  march:     'var(--sys-shape-marchSurge01)',   // 20px 8px 12px 32px  — interactive / buttons
  block:     'var(--sys-shape-blockRiot02)',    // 20px 4px 12px 2px   — surfaces / cards
  blockTight:'var(--sys-shape-blockRiot01)',    // 8px 2px 8px 2px     — chips / tight UI
  megaphone: 'var(--sys-shape-megaphoneCut01)', // 42% 58% 45% 55% / 48% 62% 38% 52% — blobs
  placard:   'var(--sys-shape-placardTorn01)',  // 48% 52% 58% 42% / 55% 45% 60% 40% — editorial
  sentry:    'var(--sys-shape-sentryAvatar)',   // 98% — avatars ONLY, NEVER 50%
};

const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM   = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

// ============================================================================
// FEATURE CARD — Placard archetype
// ============================================================================
function FeatureCard({
  icon: Icon,
  title,
  description,
  accentToken,
  accentRgb,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accentToken: string;  // CSS var for direct color props
  accentRgb: string;    // RGB tuple for rgba() alpha expressions only
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_SETTLE, delay: 0.6 + index * 0.15 }}
      whileHover={{ y: -6, boxShadow: 'var(--sys-shadow-elevation3HoverLift)' }}
      // .placard → border-radius: placardTorn01 | morphs to blockRiot02 on focus
      className="placard noise-texture relative overflow-hidden cursor-default"
      style={{
        background: COLORS.surface1,
        border: `1px solid ${COLORS.surface3}`,
        padding: '32px',
        transition: `all 800ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
      }}
    >
      {/* Accent stripe — top edge ink bleed */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: accentToken }}
      />

      {/* Icon container — march shape */}
      <div
        className="mb-5 p-3 inline-flex"
        style={{
          background: `rgba(${accentRgb}, 0.08)`,
          borderRadius: SHAPES.march,
        }}
      >
        <Icon size={24} style={{ color: accentToken }} />
      </div>

      {/* Override globals.css h3 (48px Fraunces) with explicit card heading size */}
      <h3
        style={{
          fontFamily: FONTS.display,
          fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1, 'wdth' 120",
          fontSize: '24px',
          lineHeight: 1.2,
          textTransform: 'uppercase',
          color: COLORS.workerAsh,
          marginBottom: '8px',
          // Override globals.css h3 font-size (48px headline) explicitly
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h3>

      {/* Override globals.css p (16px) with explicit card body size */}
      <p
        style={{
          fontFamily: FONTS.primary,
          fontWeight: 300,
          fontSize: '14px',
          color: COLORS.workerAsh,
          opacity: 0.65,
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ============================================================================
// STAT BADGE — used in the social-proof strip
// ============================================================================
function StatBadge({
  value,
  label,
  accentToken,
}: {
  value: string;
  label: string;
  accentToken: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-8">
      {/* Override globals.css p (16px body) with display number */}
      <p
        style={{
          fontFamily: FONTS.display,
          fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1, 'wdth' 125",
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          lineHeight: 1,
          color: accentToken,
          letterSpacing: '-0.03em',
          margin: 0,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 100,
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: COLORS.workerAshMuted,
          marginTop: '8px',
          margin: '8px 0 0',
          opacity: 0.75,
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================
export function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: COLORS.canvas }}
    >

      {/* ─── Z-0: SUBSTRATE (fixed background wash) ─── */}
      <div className="fixed inset-0 -z-20" style={{ background: COLORS.canvas }} />

      {/* ─── Z-1: Mesh gradient atmosphere — M3 radial gradients ─── */}
      <div className="fixed inset-0 -z-10 mesh-gradient" />

      {/* ─── Z-2: Atmospheric halo — InkGold bloom (bottom-left) ─── */}
      <div
        className="fixed bottom-16 -left-12 -z-5 pointer-events-none"
        style={{
          width: '420px',
          height: '420px',
          background: `radial-gradient(circle, rgba(${RGB.inkGold}, 0.07) 0%, transparent 65%)`,
          borderRadius: SHAPES.sentry, // 98% — blob, not circle
          filter: 'blur(40px)',
        }}
      />

      {/* ─── Z-2: Atmospheric bleed — Solidarity Red glow (top-right) ─── */}
      <div
        className="fixed top-0 right-0 -z-5 pointer-events-none"
        style={{
          width: '360px',
          height: '280px',
          background: `radial-gradient(circle at 85% 15%, rgba(${RGB.solidarityRed}, 0.10) 0%, transparent 60%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* ─── CONTENT ─── */}
      <div className="relative z-10 px-6 sm:px-8 py-14 md:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          {/* Header with Logo */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SLAM }}
            className="flex items-center justify-between mb-16"
          >
            <Logo variant="horizontal" size={56} />
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-micro font-mono tracking-widest uppercase px-6 py-2 border border-surface-3 rounded-full hover:bg-surface-2 transition-colors"
                style={{ color: COLORS.workerAshMuted }}
              >
                Sign In
              </motion.button>
            </Link>
          </motion.header>

          {/* ═══════════════════════════════════════════
              HERO SECTION
              ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center mb-16 lg:mb-28">

            {/* Left Column — Manifesto copy */}
            <div>

              {/* Micro label — mono stamp */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.1 }}
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 100,
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: COLORS.solidarityRed,
                  marginBottom: '20px',
                  margin: '0 0 20px',
                }}
              >
                CAREER COPILOT // SOLIDARITY MODE
              </motion.p>

              {/* Hero Headline — Libre Bodoni, Solidarity Protest pattern */}
              {/* Override globals.css h1 (144px Libre Bodoni) with responsive clamp */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.15 }}
                style={{
                  fontFamily: FONTS.proclamation,
                  fontWeight: 900,
                  fontSize: 'clamp(3.5rem, 8vw, 9rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.04em',
                  color: COLORS.solidarityRed,
                  marginBottom: '28px',
                  textTransform: 'uppercase',
                  // Ink-offset stencil shadow (solidarityRed on canvas)
                  textShadow: `4px 4px 0px rgba(${RGB.solidarityRed}, 0.22)`,
                }}
              >
                THE<br />
                SOLIDARITY<br />
                MANIFESTO
              </motion.h1>

              {/* Subhead — Caveat body + Nabla "collective" accent */}
              {/* Override globals.css p (16px) with display subhead */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.3 }}
                style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
                  lineHeight: 1.35,
                  color: COLORS.inkGold,
                  marginBottom: '44px',
                  maxWidth: '580px',
                  margin: '0 0 44px',
                }}
              >
                <span style={{ fontFamily: FONTS.curator, fontWeight: 400 }}>
                  Your professional history, re-documented for the{' '}
                </span>
                {/* Nabla: one word per view, icon-scale color glyph */}
                <span
                  style={{
                    fontFamily: FONTS.colorAccent,
                    fontSize: '1.1em',
                    lineHeight: 1,
                  }}
                >
                  collective
                </span>
                <span style={{ fontFamily: FONTS.curator, fontWeight: 900 }}>
                  {' '}future.
                </span>
              </motion.p>

              {/* CTA Buttons — march shape, strike archetypes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SLAM, delay: 0.42 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2, boxShadow: `0 0 28px rgba(${RGB.solidarityRed}, 0.45)` }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    // .strike .strike-defiance: solidarityRed bg, canvas text, blockRiot03 radius
                    className="strike strike-defiance flex items-center gap-3 group"
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 900,
                      fontSize: '16px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      padding: '16px 36px',
                      // march shape for interactive override (blockRiot03 from .strike is 32px 2px 2px 2px)
                      // Keep .strike default shape but override with march for this page
                      borderRadius: SHAPES.march,
                      border: 'none',
                      cursor: 'pointer',
                      color: COLORS.canvas,
                      background: COLORS.solidarityRed,
                    }}
                  >
                    BUILD YOUR STORY
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1"
                      style={{ transition: `transform 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})` }}
                    />
                  </motion.button>
                </Link>

                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    // .strike .strike-ghost: transparent bg, workerAsh text, concreteGrey border
                    className="strike strike-ghost"
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 700,
                      fontSize: '14px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      padding: '16px 36px',
                      borderRadius: SHAPES.march,
                      cursor: 'pointer',
                      background: 'transparent',
                      color: COLORS.inkGold,
                      border: `1px solid rgba(${RGB.inkGold}, 0.30)`,
                    }}
                  >
                    VIEW THE COLLECTIVE
                  </motion.button>
                </Link>
              </motion.div>

              {/* Acknowledgment — in-situ, placard text only per anti-slop protocol */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                style={{
                  fontFamily: FONTS.curator,
                  fontSize: '13px',
                  color: COLORS.workerAshDim,
                  marginTop: '36px',
                  lineHeight: 1.5,
                  maxWidth: '420px',
                }}
              >
                Always was, always will be — built on unceded Wurundjeri Country.
              </motion.p>
            </div>

            {/* Right Column — Resistance Anchor */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING_SETTLE, delay: 0.3 }}
              className="relative"
            >
              {/* Hero portrait — march shape frame (asymmetric pebble) */}
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: SHAPES.march,
                  aspectRatio: '3/4',
                  maxHeight: '560px',
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1555895254-9b020f5e28b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3RpdmlzdCUyMGhhbmRzJTIwcmFpc2VkJTIwY3Jvd2QlMjBzaWxob3VldHRlJTIwZGFyayUyMG1vb2R5fGVufDF8fHx8MTc3MzQ1NzkyM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Solidarity — raised fists in resistance"
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(30%) contrast(1.1) brightness(0.85)' }}
                />

                {/* Gradient fade to canvas at bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 30%, rgba(${RGB.canvas}, 0.92) 100%)`,
                    zIndex: 1,
                  }}
                />

                {/* InkGold atmosphere wash at top-left */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 20% 20%, rgba(${RGB.solidarityRed}, 0.20) 0%, transparent 60%)`,
                    zIndex: 1,
                  }}
                />
              </div>

              {/* Floating stat card — scaffold archetype (immutable, blockRiot02) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SETTLE, delay: 0.55 }}
                className="scaffold noise-texture absolute -bottom-4 -left-4 z-10 overflow-hidden"
                style={{
                  background: COLORS.surface1,
                  border: `1px solid ${COLORS.surface3}`,
                  padding: '20px 24px',
                  maxWidth: '200px',
                  boxShadow: `var(--sys-shadow-elevation4Float)`,
                }}
              >
                {/* Override globals.css p */}
                <p style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 800,
                  fontSize: '38px',
                  color: COLORS.inkGold,
                  lineHeight: 1,
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}>
                  127
                </p>
                <p style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: COLORS.workerAshMuted,
                  marginTop: '6px',
                  margin: '6px 0 0',
                }}>
                  STORIES ARCHIVED
                </p>
              </motion.div>

              {/* Floating accent chip — Signal Green, top-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING_SLAM, delay: 0.7 }}
                className="absolute -top-3 -right-3 z-10"
                style={{
                  background: `rgba(${RGB.signalGreen}, 0.10)`,
                  border: `1px solid rgba(${RGB.signalGreen}, 0.30)`,
                  borderRadius: SHAPES.march,
                  padding: '8px 14px',
                }}
              >
                <p style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 800,
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: COLORS.signalGreen,
                  margin: 0,
                }}>
                  ANTI-SLOP ACTIVE
                </p>
              </motion.div>
            </motion.div>
          </div>


          {/* ═══════════════════════════════════════════
              SOCIAL PROOF STRIP — Stats
              ═══════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SETTLE, delay: 0.5 }}
            className="mb-16 lg:mb-24 overflow-hidden noise-texture"
            style={{
              background: COLORS.surface1,
              border: `1px solid ${COLORS.surface3}`,
              borderRadius: SHAPES.block,
              padding: '28px 16px',
              // Subtle InkGold glow
              boxShadow: `0 0 40px rgba(${RGB.inkGold}, 0.04)`,
            }}
          >
            <div className="flex flex-wrap items-center justify-around gap-8">
              <StatBadge value="127"   label="Stories Archived"      accentToken={COLORS.inkGold} />
              <div className="hidden sm:block w-px h-10 self-center" style={{ background: COLORS.surface3 }} />
              <StatBadge value="45"    label="Orgs Represented"      accentToken={COLORS.solidarityRed} />
              <div className="hidden sm:block w-px h-10 self-center" style={{ background: COLORS.surface3 }} />
              <StatBadge value="98%"   label="KSC Match Rate"        accentToken={COLORS.signalGreen} />
              <div className="hidden sm:block w-px h-10 self-center" style={{ background: COLORS.surface3 }} />
              <StatBadge value="3×"    label="Faster Applications"   accentToken={COLORS.smokeOrange} />
            </div>
          </motion.section>


          {/* ═══════════════════════════════════════════
              FEATURE GRID — 3 Placard Cards
              ═══════════════════════════════════════════ */}
          <section className="mb-16 lg:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SETTLE, delay: 0.5 }}
              className="mb-8"
            >
              {/* Override globals.css p */}
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: COLORS.workerAshMuted,
                  marginBottom: '4px',
                  margin: '0 0 4px',
                }}
              >
                THE SOLIDARITY TOOLKIT
              </p>
            </motion.div>

            {/* .placard archetype cards — torn edge shape, morphs to blockRiot02 on focus */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FeatureCard
                icon={FileText}
                title="Build Your Story"
                description="Upload your resume, parse your experience, and let the archive reconstruct your professional narrative with precision."
                accentToken={COLORS.solidarityRed}
                accentRgb={RGB.solidarityRed}
                index={0}
              />
              <FeatureCard
                icon={Archive}
                title="Archive Evidence"
                description="Every skill, every role, every achievement — catalogued, cross-referenced, and ready for deployment at a moment's notice."
                accentToken={COLORS.inkGold}
                accentRgb={RGB.inkGold}
                index={1}
              />
              <FeatureCard
                icon={Shield}
                title="Resist Slop"
                description="AI-powered responses that cut through generic templates. Your applications are weapons of specificity, not wallpaper."
                accentToken={COLORS.signalGreen}
                accentRgb={RGB.signalGreen}
                index={2}
              />
            </div>
          </section>


          {/* ═══════════════════════════════════════════
              MANIFESTO STRIP — Kerala Houseboat visual
              ═══════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SETTLE, delay: 0.8 }}
            className="mb-16 lg:mb-24 relative overflow-hidden"
            style={{
              borderRadius: SHAPES.block,
              border: `1px solid ${COLORS.surface3}`,
            }}
          >
            {/* Background — Kerala backwater image with heavy dark overlay */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1733564377873-21e93cf1d8fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBiYWNrd2F0ZXIlMjBob3VzZWJvYXQlMjByaXZlciUyMG1pc3R5JTIwYXRtb3NwaGVyaWN8ZW58MXx8fHwxNzczNDU3OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(60%) brightness(0.25)' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, rgba(${RGB.canvas}, 0.85) 0%, rgba(${RGB.canvas}, 0.60) 100%)`,
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 px-10 py-16 lg:py-20 text-center">
              {/* Caveat annotation — rotated */}
              <p
                className="font-curator--rotated inline-block"
                style={{
                  fontFamily: FONTS.curator,
                  fontSize: '18px',
                  color: COLORS.smokeOrange,
                  marginBottom: '16px',
                }}
              >
                no neutral canvas.
              </p>

              {/* Main declaration — Libre Bodoni, extreme weight */}
              {/* Override globals.css h2 (72px Fraunces) with proclamation font */}
              <h2
                style={{
                  fontFamily: FONTS.proclamation,
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color: COLORS.workerAsh,
                  maxWidth: '800px',
                  margin: '0 auto 20px',
                  // Ink offset — stencilYellow shadow
                  textShadow: `3px 3px 0px rgba(${RGB.solidarityRed}, 0.28)`,
                }}
              >
                YOUR STORY IS<br />
                <span style={{ color: COLORS.solidarityRed }}>EVIDENCE.</span>
              </h2>

              {/* Sub-declaration */}
              <p
                style={{
                  fontFamily: FONTS.primary,
                  fontWeight: 100,
                  fontSize: '15px',
                  color: COLORS.workerAsh,
                  opacity: 0.65,
                  maxWidth: '520px',
                  margin: '0 auto 40px',
                  lineHeight: 1.7,
                  letterSpacing: '0.01em',
                }}
              >
                Social workers are archive-keepers. Career Copilot turns your lived professional
                experience into precision-targeted applications — specific, dignified, un-sloppable.
              </p>

              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2, boxShadow: `0 0 32px rgba(${RGB.solidarityRed}, 0.5)` }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="strike strike-defiance inline-flex items-center gap-3 group"
                  style={{
                    fontFamily: FONTS.primary,
                    fontWeight: 800,
                    fontSize: '14px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '16px 40px',
                    borderRadius: SHAPES.march,
                    border: 'none',
                    cursor: 'pointer',
                    color: COLORS.canvas,
                    background: COLORS.solidarityRed,
                  }}
                >
                  START YOUR ARCHIVE
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1"
                    style={{ transition: `transform 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})` }}
                  />
                </motion.button>
              </Link>
            </div>
          </motion.section>


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
            <div className="flex flex-col gap-1">
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: COLORS.workerAshMuted,
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                BUILT WITH SOLIDARITY // CAREER COPILOT v2.0
              </p>
              <p
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: '9px',
                  letterSpacing: '0.06em',
                  color: COLORS.workerAshDim,
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                TOKEN SYNC v2.0 · SHAPE SYSTEM v6.1 · ANTI-SLOP ACTIVE
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link
                to="/style-guide"
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  color: COLORS.workerAshMuted,
                  textTransform: 'uppercase',
                }}
              >
                STYLE GUIDE
              </Link>
              <p
                style={{
                  fontFamily: FONTS.curator,
                  fontSize: '15px',
                  color: COLORS.smokeOrange,
                  opacity: 0.65,
                  margin: 0,
                }}
              >
                no neutral canvas
              </p>
            </div>
          </motion.footer>

        </div>
      </div>
    </div>
  );
}
