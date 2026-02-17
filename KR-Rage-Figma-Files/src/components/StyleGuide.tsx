import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, FileText, TrendingUp, Clock, ArrowUpRight, Zap, Eye,
  Search, Heart, Star, Settings, User, Bell, ChevronRight, Plus,
  Download, Upload, Trash2, Edit3, Check, X, AlertTriangle, Info,
  Home, BarChart3, Sparkles, FolderOpen, ClipboardList, Menu,
} from 'lucide-react';

// ============================================================================
// KERALA RAGE — SOLIDARITY MODE — STYLE GUIDE
// Living reference for every design token, pattern, and component.
// ============================================================================

// --- DESIGN TOKENS (inline, matching Dashboard for portability) ---
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
  smokeOrange: '#DA8B48',
  metalBlue: '#48B3DA',
  charcoalRed: '#F14844',
  workerAshMuted: '#9AAF7D',
  workerAshDim: '#7A8A6D',
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
  slab: '48% 52% 58% 42% / 55% 45% 60% 40%',
  stone: '42% 58% 45% 55% / 48% 62% 38% 52%',
  sentry: '98%',
  torn: 'polygon(0% 2%, 3% 0%, 7% 1.5%, 12% 0.5%, 18% 2%, 25% 0%, 32% 1%, 40% 0.5%, 48% 2%, 55% 0%, 62% 1.5%, 70% 0%, 78% 2%, 85% 0.5%, 92% 1%, 97% 0%, 100% 2%, 100% 98%, 97% 100%, 92% 98.5%, 85% 100%, 78% 98%, 70% 100%, 62% 98.5%, 55% 100%, 48% 98%, 40% 99.5%, 32% 100%, 25% 98%, 18% 100%, 12% 99%, 7% 100%, 3% 98.5%, 0% 100%)',
};

const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

// ============================================================================
// SECTION WRAPPER — Consistent section layout
// ============================================================================

function Section({
  id,
  label,
  title,
  accent,
  children,
}: {
  id: string;
  label: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={SPRING_SETTLE}
      className="mb-16"
    >
      {/* Section label */}
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: accent,
          marginBottom: '8px',
        }}
      >
        {label}
      </p>
      {/* Section title */}
      <h2
        style={{
          fontFamily: FONTS.display,
          fontVariationSettings: "'wght' 800, 'wdth' 120",
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase' as const,
          color: COLORS.workerAsh,
          marginBottom: '32px',
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

// ============================================================================
// SWATCH COMPONENT — Reusable color swatch
// ============================================================================

function Swatch({
  hex,
  name,
  token,
  large,
}: {
  hex: string;
  name: string;
  token: string;
  large?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
      className="text-left cursor-pointer group"
      style={{ border: 'none', background: 'none', padding: 0 }}
    >
      <div
        className="relative overflow-hidden mb-3"
        style={{
          background: hex,
          borderRadius: SHAPES.pebble,
          height: large ? '100px' : '72px',
          width: '100%',
          border: `1px solid ${COLORS.surface4}`,
        }}
      >
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)' }}
            >
              <Check size={20} style={{ color: COLORS.inkGold }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: '11px',
          color: COLORS.workerAsh,
          marginBottom: '2px',
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 400,
          fontSize: '10px',
          color: COLORS.workerAshMuted,
          letterSpacing: '0.02em',
        }}
      >
        {hex}
      </p>
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 400,
          fontSize: '9px',
          color: COLORS.workerAshDim,
          marginTop: '2px',
          wordBreak: 'break-all' as const,
        }}
      >
        {token}
      </p>
    </motion.button>
  );
}

// ============================================================================
// MAIN STYLE GUIDE COMPONENT
// ============================================================================

export function StyleGuide() {
  const [activeMotionDemo, setActiveMotionDemo] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen" style={{ background: COLORS.canvas }}>
      {/* Atmosphere */}
      <div className="fixed inset-0 -z-10 mesh-gradient noise-texture" style={{ background: COLORS.canvas }} />

      <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">

        {/* ═══════════════════════════════════════════════════════════
            HERO — Style Guide identity
            ═══════════════════════════════════════════════════════════ */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden mb-16 noise-texture"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: COLORS.solidarityRed }}
          />

          <div className="relative z-10 p-8 md:p-12">
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
              KERALA RAGE v1.0.0 // LIVING STYLE GUIDE
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SLAM, delay: 0.15 }}
              style={{
                fontFamily: FONTS.display,
                fontVariationSettings: "'wght' 800, 'wdth' 120",
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: COLORS.workerAsh,
                marginBottom: '16px',
              }}
            >
              Solidarity{' '}
              <span style={{ color: COLORS.stencilYellow }}>Mode</span>
            </motion.h1>

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
                maxWidth: '600px',
              }}
            >
              A wheat-paste protest wall on charcoal. Every token, shape, and motion pattern
              in the Kerala Rage design system — rendered live. Click any swatch to copy its hex.
            </motion.p>

            {/* Curator annotation */}
            <motion.div
              initial={{ opacity: 0, rotate: -8 }}
              animate={{ opacity: 0.6, rotate: -4 }}
              transition={{ ...SPRING_SETTLE, delay: 0.5 }}
              className="absolute bottom-6 right-8 hidden md:block pointer-events-none"
              style={{
                fontFamily: FONTS.curator,
                fontSize: '18px',
                color: COLORS.stencilYellow,
                textShadow: `0 0 20px ${COLORS.stencilYellow}40`,
              }}
            >
              no neutral canvas
            </motion.div>
          </div>
        </motion.header>

        {/* ═══════════════════════════════════════════════════════════
            TABLE OF CONTENTS — Quick nav
            ═══════════════════════════════════════════════════════════ */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.3 }}
          className="mb-16 p-6 noise-texture"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <p
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 700,
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: COLORS.workerAshMuted,
              marginBottom: '16px',
            }}
          >
            SECTIONS
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'colors', label: 'Colors' },
              { id: 'surfaces', label: 'Surfaces' },
              { id: 'typography', label: 'Typography' },
              { id: 'emotional', label: 'Emotional Type' },
              { id: 'scale', label: 'Type Scale' },
              { id: 'shapes', label: 'Shape DNA' },
              { id: 'elevation', label: 'Elevation' },
              { id: 'noise', label: 'Noise Texture' },
              { id: 'mesh', label: 'Mesh Gradient' },
              { id: 'motion', label: 'Motion' },
              { id: 'buttons', label: 'Buttons' },
              { id: 'tags', label: 'Tags & Badges' },
              { id: 'icons', label: 'Iconography' },
              { id: 'data', label: 'Data Labels' },
              { id: 'cards', label: 'Cards' },
              { id: 'fraunces', label: 'Fraunces Variants' },
              { id: 'inputs', label: 'Inputs' },
              { id: 'assets', label: 'Asset Manifest' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  color: COLORS.signalGreen,
                  background: `${COLORS.signalGreen}10`,
                  padding: '6px 14px',
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.signalGreen}25`,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.nav>


        {/* ═══════════════════════════════════════════════════════════
            1. COLOR PALETTE
            ═══════════════════════════════════════════════════════════ */}
        <Section id="colors" label="01 // TOKENS" title="Color Palette" accent={COLORS.solidarityRed}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <Swatch hex={COLORS.solidarityRed} name="Solidarity Red" token="--sys-color-solidarityRed-base" large />
            <Swatch hex={COLORS.inkGold} name="Ink Gold" token="--sys-color-inkGold-base" large />
            <Swatch hex={COLORS.stencilYellow} name="Stencil Yellow" token="--sys-color-stencilYellow-base" large />
            <Swatch hex={COLORS.signalGreen} name="Signal Green" token="--sys-color-signalGreen-base" large />
            <Swatch hex={COLORS.activistGreen} name="Activist Smoke Green" token="--sys-color-kr-activistSmokeGreen-base" />
            <Swatch hex={COLORS.workerAsh} name="Worker Ash" token="--sys-color-worker-ash-base" />
            <Swatch hex={COLORS.smokeOrange} name="Smoke Orange" token="--sys-color-solidaritySmokeOrange-base" />
            <Swatch hex={COLORS.metalBlue} name="Metal Blue" token="--sys-color-labWrenMetalBlue-base" />
            <Swatch hex={COLORS.charcoalRed} name="Charcoal Red" token="--sys-color-kr-charcoalRed-base" />
          </div>

          {/* Utility class reference */}
          <div
            className="mt-8 p-5"
            style={{
              background: COLORS.surface2,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface4}`,
            }}
          >
            <p
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: COLORS.workerAshMuted,
                marginBottom: '12px',
              }}
            >
              CSS UTILITY CLASSES
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                '.text-solidarity', '.bg-solidarity', '.text-ink-gold', '.bg-ink-gold',
                '.text-stencil', '.text-signal', '.text-activist', '.text-worker-ash',
                '.text-smoke-orange', '.text-metal-blue', '.text-charcoal-red',
              ].map((cls) => (
                <code
                  key={cls}
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: '11px',
                    color: COLORS.inkGold,
                    background: `${COLORS.inkGold}10`,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.inkGold}20`,
                  }}
                >
                  {cls}
                </code>
              ))}
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            2. SURFACE SYSTEM
            ═══════════════════════════════════════════════════════════ */}
        <Section id="surfaces" label="02 // CHARCOAL" title="Surface System" accent={COLORS.metalBlue}>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            {[
              { step: 0, hex: COLORS.canvas, usage: 'App background', cls: '.bg-canvas' },
              { step: 1, hex: COLORS.surface1, usage: 'Surfaces', cls: '.bg-surface' },
              { step: 2, hex: COLORS.surface2, usage: 'Elevation', cls: '.bg-surface-raised' },
              { step: 3, hex: COLORS.surface3, usage: 'Gutters', cls: '.bg-surface-gutter' },
              { step: 4, hex: COLORS.surface4, usage: 'Raised cards', cls: '.bg-surface-card' },
              { step: 5, hex: COLORS.surface5, usage: 'Hover', cls: '.bg-surface-hover' },
              { step: 6, hex: COLORS.surface6, usage: 'Active', cls: '.bg-surface-active' },
            ].map((s) => (
              <div key={s.step}>
                <div
                  className="mb-3"
                  style={{
                    background: s.hex,
                    borderRadius: SHAPES.pebble,
                    height: '80px',
                    border: `1px solid ${COLORS.surface4}`,
                  }}
                />
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.workerAsh }}>
                  Step {s.step}
                </p>
                <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted }}>
                  {s.hex}
                </p>
                <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.workerAshDim, marginTop: '2px' }}>
                  {s.usage}
                </p>
                <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                  {s.cls}
                </code>
              </div>
            ))}
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            3. TYPOGRAPHY — All 6 font families
            ═══════════════════════════════════════════════════════════ */}
        <Section id="typography" label="03 // TYPE" title="Font Families" accent={COLORS.stencilYellow}>
          <div className="space-y-6">
            {[
              {
                name: 'Work Sans',
                role: 'Primary',
                font: FONTS.primary,
                sample: 'The quick brown fox jumps over the lazy dog.',
                weight: 400,
                usage: 'Body, UI, navigation',
                cls: 'font-family: var(--sys-type-fontFamilies-primary)',
              },
              {
                name: 'Fraunces',
                role: 'Display',
                font: FONTS.display,
                sample: 'Solidarity Never Sleeps',
                weight: 800,
                usage: 'Hero headlines, display type',
                cls: '.font-display',
              },
              {
                name: 'Libre Bodoni',
                role: 'Proclamation',
                font: FONTS.proclamation,
                sample: 'Senior Case Manager — Berry Street Victoria',
                weight: 700,
                usage: 'Declarative statements, editorial',
                cls: '.font-proclamation',
              },
              {
                name: 'JetBrains Mono',
                role: 'Mono',
                font: FONTS.mono,
                sample: 'ATS_SCORE: 94 | STATUS: STRONG | DAYS_AGO: 2',
                weight: 700,
                usage: 'Data, code, technical labels',
                cls: '.font-mono',
              },
              {
                name: 'Caveat',
                role: 'Curator',
                font: FONTS.curator,
                sample: 'momentum is building... keep going, you\'re almost there',
                weight: 400,
                usage: 'Handwritten annotations, personal notes',
                cls: '.font-curator',
              },
              {
                name: 'Nabla',
                role: 'Color Accent',
                font: FONTS.colorAccent,
                sample: 'ABCDEFG',
                weight: 400,
                usage: 'Decorative, icon-scale color glyphs',
                cls: '.font-color-accent',
              },
            ].map((font) => (
              <div
                key={font.role}
                className="p-6 noise-texture relative overflow-hidden"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="md:w-48 flex-shrink-0">
                    <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.stencilYellow, marginBottom: '4px' }}>
                      {font.role}
                    </p>
                    <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAsh, marginBottom: '4px' }}>
                      {font.name}
                    </p>
                    <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.workerAshMuted }}>
                      {font.usage}
                    </p>
                    <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '4px' }}>
                      {font.cls}
                    </code>
                  </div>
                  <div className="flex-1">
                    <p
                      style={{
                        fontFamily: font.font,
                        fontWeight: font.weight,
                        fontSize: font.role === 'Display' ? '32px' : font.role === 'Color Accent' ? '28px' : '20px',
                        color: COLORS.workerAsh,
                        lineHeight: 1.4,
                      }}
                    >
                      {font.sample}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            4. EMOTIONAL TYPOGRAPHY — Side-by-side comparison
            ═══════════════════════════════════════════════════════════ */}
        <Section id="emotional" label="04 // EMOTION" title="Emotional Typography" accent={COLORS.solidarityRed}>
          {/* Solidarity Protest vs Labor Pressure — SIDE BY SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Solidarity Protest */}
            <div
              className="p-8 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: COLORS.solidarityRed }}
              />
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.solidarityRed, marginBottom: '16px' }}>
                SOLIDARITY PROTEST
              </p>
              <p
                style={{
                  fontFamily: FONTS.primary,
                  fontVariationSettings: "'wght' 800, 'wdth' 120",
                  fontSize: '36px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase' as const,
                  color: COLORS.workerAsh,
                  lineHeight: 1.1,
                  marginBottom: '16px',
                }}
              >
                NO NEUTRAL CANVAS
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>wght: 800</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>wdth: 120</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>tracking: 0.02em</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>CAPS</code>
              </div>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, lineHeight: 1.6 }}>
                Wide, heavy, loud. Declarative headers, street-poster slab words.
              </p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '8px' }}>
                .type-solidarity-protest
              </code>
            </div>

            {/* Labor Pressure */}
            <div
              className="p-8 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: COLORS.smokeOrange }}
              />
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.smokeOrange, marginBottom: '16px' }}>
                LABOR PRESSURE
              </p>
              <p
                style={{
                  fontFamily: FONTS.primary,
                  fontVariationSettings: "'wght' 900, 'wdth' 75",
                  fontSize: '36px',
                  letterSpacing: '0em',
                  color: COLORS.workerAsh,
                  lineHeight: 1.1,
                  marginBottom: '16px',
                }}
              >
                extraction fatigue
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>wght: 900</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>wdth: 75</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>tracking: 0</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>lowercase</code>
              </div>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, lineHeight: 1.6 }}>
                Compressed, maximal weight. Wage critique, exhaustion, extraction.
              </p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '8px' }}>
                .type-labor-pressure
              </code>
            </div>
          </div>

          {/* Remaining emotional patterns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Melancholy Longing */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.metalBlue, marginBottom: '12px' }}>
                MELANCHOLY LONGING
              </p>
              <p
                style={{
                  fontFamily: FONTS.primary,
                  fontVariationSettings: "'wght' 475, 'wdth' 98",
                  fontSize: '22px',
                  color: COLORS.workerAsh,
                  opacity: 0.85,
                  lineHeight: 1.4,
                  marginBottom: '12px',
                }}
              >
                the backwaters remember what we left behind
              </p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                .type-melancholy
              </code>
            </div>

            {/* Identity Assertion */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.inkGold, marginBottom: '12px' }}>
                IDENTITY ASSERTION
              </p>
              <p
                style={{
                  fontFamily: FONTS.primary,
                  fontVariationSettings: "'wght' 700, 'wdth' 110",
                  fontSize: '28px',
                  textTransform: 'uppercase' as const,
                  color: COLORS.workerAsh,
                  lineHeight: 1.1,
                  marginBottom: '12px',
                }}
              >
                AUSSIE?
              </p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                .type-identity-assertion
              </code>
            </div>

            {/* Extreme Contrast */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.activistGreen, marginBottom: '12px' }}>
                EXTREME CONTRAST
              </p>
              <div style={{ marginBottom: '12px' }}>
                <span
                  style={{
                    fontFamily: FONTS.primary,
                    fontVariationSettings: "'wght' 100, 'wdth' 100",
                    fontSize: '42px',
                    letterSpacing: '-0.02em',
                    color: COLORS.workerAsh,
                    lineHeight: 1,
                  }}
                >
                  thin
                </span>
                <span
                  style={{
                    fontFamily: FONTS.primary,
                    fontWeight: 900,
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                    color: COLORS.surface6,
                    marginLeft: '12px',
                    verticalAlign: 'super',
                  }}
                >
                  VS ULTRA BLACK
                </span>
              </div>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                .type-extreme-contrast
              </code>
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            5. TYPE SCALE
            ═══════════════════════════════════════════════════════════ */}
        <Section id="scale" label="05 // SCALE" title="Type Scale" accent={COLORS.inkGold}>
          <div
            className="p-6 md:p-8 noise-texture overflow-x-auto"
            style={{
              background: COLORS.surface1,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface3}`,
            }}
          >
            {[
              { size: '8px', name: 'Micro', cls: '.text-micro', token: '--sys-type-scale-micro' },
              { size: '12px', name: 'Small', cls: '.text-small', token: '--sys-type-scale-small' },
              { size: '16px', name: 'Body', cls: '.text-body', token: '--sys-type-scale-body' },
              { size: '24px', name: 'Subhead', cls: '.text-subhead', token: '--sys-type-scale-subhead' },
              { size: '48px', name: 'Headline', cls: '.text-headline', token: '--sys-type-scale-headline' },
              { size: '72px', name: 'Display', cls: '.text-display', token: '--sys-type-scale-display' },
              { size: '144px', name: 'Hero', cls: '.text-hero', token: '--sys-type-scale-hero' },
            ].map((step) => (
              <div
                key={step.name}
                className="flex items-baseline gap-6 py-3"
                style={{ borderBottom: `1px solid ${COLORS.surface3}` }}
              >
                <div className="w-24 flex-shrink-0">
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', color: COLORS.stencilYellow, letterSpacing: '0.04em' }}>
                    {step.size}
                  </p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.surface6 }}>
                    {step.name}
                  </p>
                  <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                    {step.cls}
                  </code>
                </div>
                <p
                  style={{
                    fontFamily: FONTS.display,
                    fontWeight: 700,
                    fontSize: step.size,
                    color: COLORS.workerAsh,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  {step.name === 'Hero' ? 'Ag' : step.name === 'Display' ? 'Rage' : 'Solidarity'}
                </p>
              </div>
            ))}
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            6. SHAPE DNA
            ═══════════════════════════════════════════════════════════ */}
        <Section id="shapes" label="06 // SHAPE" title="Shape DNA" accent={COLORS.activistGreen}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Stone', radius: SHAPES.stone, cls: '.shape-stone', desc: 'Irregular blob containers', cssVal: '42% 58% 45% 55% / 48% 62% 38% 52%' },
              { name: 'Slab', radius: SHAPES.slab, cls: '.shape-slab', desc: 'Editorial blocks', cssVal: '48% 52% 58% 42% / 55% 45% 60% 40%' },
              { name: 'Pebble', radius: SHAPES.pebble, cls: '.shape-pebble', desc: 'Interactive elements', cssVal: '16px 8px 12px 20px' },
              { name: 'Sentry', radius: SHAPES.sentry, cls: '.shape-sentry', desc: 'Avatar frames (not 50%!)', cssVal: '98%' },
              { name: 'Torn Edge', radius: undefined, cls: '.shape-torn', desc: 'Poster/placard edges', cssVal: 'clip-path: polygon(...)' },
            ].map((shape) => (
              <div key={shape.name} className="text-center">
                <div
                  className="mx-auto mb-4"
                  style={{
                    width: '120px',
                    height: '120px',
                    background: shape.name === 'Sentry'
                      ? `linear-gradient(135deg, ${COLORS.solidarityRed}, ${COLORS.smokeOrange})`
                      : `linear-gradient(135deg, ${COLORS.surface4}, ${COLORS.surface2})`,
                    borderRadius: shape.radius || undefined,
                    clipPath: shape.name === 'Torn Edge' ? SHAPES.torn : undefined,
                    border: shape.name !== 'Torn Edge' ? `2px solid ${COLORS.surface5}` : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {shape.name === 'Sentry' && (
                    <span style={{ fontFamily: FONTS.primary, fontWeight: 800, fontSize: '32px', color: COLORS.canvas }}>N</span>
                  )}
                </div>
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '12px', color: COLORS.workerAsh, marginBottom: '2px' }}>
                  {shape.name}
                </p>
                <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.surface6, marginBottom: '4px' }}>
                  {shape.desc}
                </p>
                <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                  {shape.cls}
                </code>
              </div>
            ))}
          </div>

          {/* BANNED callout */}
          <div
            className="mt-8 p-5 flex items-start gap-4"
            style={{
              background: `${COLORS.charcoalRed}10`,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.charcoalRed}30`,
            }}
          >
            <AlertTriangle size={20} style={{ color: COLORS.charcoalRed, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.charcoalRed, letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                BANNED: border-radius: 50%
              </p>
              <p style={{ fontFamily: FONTS.primary, fontSize: '13px', color: COLORS.workerAsh, opacity: 0.7, lineHeight: 1.5 }}>
                Perfect circles are not allowed. Use <code style={{ fontFamily: FONTS.mono, color: COLORS.signalGreen }}>98%</code> for avatars (Sentry shape).
              </p>
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            7. ELEVATION (SHADOWS)
            ═══════════════════════════════════════════════════════════ */}
        <Section id="elevation" label="07 // DEPTH" title="Elevation System" accent={COLORS.smokeOrange}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'Pebble', shadow: '0 2px 4px rgba(0,0,0,0.25)', cls: '.elevation-1', usage: 'Resting state' },
              { name: 'Stone', shadow: '0 4px 8px rgba(0,0,0,0.35)', cls: '.elevation-2', usage: 'Cards' },
              { name: 'Hover Lift', shadow: '0 8px 16px rgba(0,0,0,0.45)', cls: '.elevation-3', usage: 'Hover' },
              { name: 'Float', shadow: '0 16px 32px rgba(0,0,0,0.55)', cls: '.elevation-4', usage: 'Modals, overlays' },
              { name: 'Ink Offset', shadow: `2px 2px 0px ${COLORS.inkGold}`, cls: '.shadow-ink', usage: 'Stencil text', isText: true },
              { name: 'Solidarity Bleed', shadow: `0 0 12px ${COLORS.solidarityRed}`, cls: '.shadow-bleed', usage: 'Urgent glow' },
            ].map((elev) => (
              <div
                key={elev.name}
                className="p-6"
                style={{
                  background: COLORS.surface2,
                  borderRadius: SHAPES.pebble,
                  boxShadow: elev.isText ? undefined : elev.shadow,
                  border: `1px solid ${COLORS.surface4}`,
                }}
              >
                {elev.isText ? (
                  <p
                    style={{
                      fontFamily: FONTS.display,
                      fontWeight: 800,
                      fontSize: '28px',
                      color: COLORS.workerAsh,
                      textShadow: elev.shadow,
                      marginBottom: '12px',
                    }}
                  >
                    Ink
                  </p>
                ) : (
                  <div style={{ height: '32px', marginBottom: '12px' }} />
                )}
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.workerAsh }}>
                  {elev.name}
                </p>
                <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6 }}>
                  {elev.usage}
                </p>
                <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '4px' }}>
                  {elev.cls}
                </code>
              </div>
            ))}
          </div>

          {/* Glow utilities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { name: 'Solidarity Glow', cls: '.glow-solidarity', color: COLORS.solidarityRed },
              { name: 'Ink Gold Glow', cls: '.glow-ink-gold', color: COLORS.inkGold },
              { name: 'Signal Glow', cls: '.glow-signal', color: COLORS.signalGreen },
            ].map((g) => (
              <div
                key={g.name}
                className="p-5 text-center"
                style={{
                  background: COLORS.surface2,
                  borderRadius: SHAPES.pebble,
                  boxShadow: `0 0 24px -4px ${g.color}`,
                  border: `1px solid ${g.color}30`,
                }}
              >
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: g.color }}>
                  {g.name}
                </p>
                <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                  {g.cls}
                </code>
              </div>
            ))}
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            8. NOISE TEXTURE OVERLAY
            ═══════════════════════════════════════════════════════════ */}
        <Section id="noise" label="08 // TEXTURE" title="Noise Texture Overlay" accent={COLORS.workerAsh}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Without noise */}
            <div
              className="p-8"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.charcoalRed, marginBottom: '12px' }}>
                WITHOUT .noise-texture
              </p>
              <p style={{ fontFamily: FONTS.primary, fontSize: '14px', color: COLORS.workerAsh, opacity: 0.7, lineHeight: 1.6 }}>
                Flat, clean surface. No character. Too corporate. Too slop.
              </p>
            </div>

            {/* With noise */}
            <div
              className="p-8 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.inkGold, marginBottom: '12px' }}>
                WITH .noise-texture ✓
              </p>
              <p style={{ fontFamily: FONTS.primary, fontSize: '14px', color: COLORS.workerAsh, opacity: 0.7, lineHeight: 1.6 }}>
                SVG fractalNoise overlay at 4% opacity with mix-blend-mode: overlay. Adds grain, texture, wheat-paste character. Anti-Slop approved.
              </p>
            </div>
          </div>

          <div
            className="mt-4 p-5"
            style={{
              background: COLORS.surface2,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface4}`,
            }}
          >
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '8px' }}>
              USAGE
            </p>
            <code style={{ fontFamily: FONTS.mono, fontSize: '12px', color: COLORS.inkGold }}>
              {'<div className="noise-texture relative overflow-hidden">'}
            </code>
            <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, marginTop: '8px' }}>
              Requires <code style={{ color: COLORS.signalGreen }}>position: relative</code> and <code style={{ color: COLORS.signalGreen }}>overflow: hidden</code> on the container. The ::after pseudo-element is absolutely positioned.
            </p>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            9. MESH GRADIENT
            ═══════════════════════════════════════════════════════════ */}
        <Section id="mesh" label="09 // ATMOSPHERE" title="Mesh Gradient" accent={COLORS.signalGreen}>
          <div
            className="mesh-gradient noise-texture relative overflow-hidden p-12"
            style={{
              background: COLORS.canvas,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface3}`,
              minHeight: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="text-center relative z-10">
              <p
                style={{
                  fontFamily: FONTS.display,
                  fontVariationSettings: "'wght' 800, 'wdth' 120",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.02em',
                  color: COLORS.workerAsh,
                  marginBottom: '12px',
                }}
              >
                ATMOSPHERIC <span style={{ color: COLORS.stencilYellow }}>DEPTH</span>
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.surface6, letterSpacing: '0.04em' }}>
                4 layered radial-gradient circles — Red, Gold, Signal, Stencil — over the canvas background
              </p>
            </div>
          </div>

          <div
            className="mt-4 p-5"
            style={{
              background: COLORS.surface2,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface4}`,
            }}
          >
            <code style={{ fontFamily: FONTS.mono, fontSize: '12px', color: COLORS.inkGold }}>
              {'<div className="mesh-gradient noise-texture" style={{ background: \'#0F0F0F\' }}>'}
            </code>
            <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, marginTop: '8px' }}>
              .mesh-gradient
            </p>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            10. MOTION PATTERNS
            ═══════════════════════════════════════════════════════════ */}
        <Section id="motion" label="10 // MOTION" title="Motion Patterns" accent={COLORS.stencilYellow}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Spring Slam */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.solidarityRed, marginBottom: '8px' }}>
                TYPE SPRING SLAM
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, marginBottom: '16px' }}>
                600ms · Hero entrance, weight/width shifts
              </p>
              <motion.button
                onClick={() => setActiveMotionDemo(activeMotionDemo === 'slam' ? null : 'slam')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                style={{
                  background: COLORS.solidarityRed,
                  color: COLORS.canvas,
                  fontFamily: FONTS.primary,
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  padding: '10px 20px',
                  borderRadius: SHAPES.pebble,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                TRIGGER SLAM
              </motion.button>
              <AnimatePresence>
                {activeMotionDemo === 'slam' && (
                  <motion.p
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={SPRING_SLAM}
                    style={{
                      fontFamily: FONTS.display,
                      fontWeight: 800,
                      fontSize: '24px',
                      color: COLORS.inkGold,
                      marginTop: '16px',
                      textAlign: 'center' as const,
                    }}
                  >
                    SLAM!
                  </motion.p>
                )}
              </AnimatePresence>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '12px' }}>
                .motion-spring-slam
              </code>
            </div>

            {/* Drag Settle */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.inkGold, marginBottom: '8px' }}>
                DRAG SETTLE
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, marginBottom: '16px' }}>
                800ms · Card drag, panel expansions
              </p>
              <motion.div
                drag="x"
                dragConstraints={{ left: -50, right: 50 }}
                dragElastic={0.3}
                whileDrag={{ scale: 1.05, boxShadow: `0 8px 16px rgba(0,0,0,0.45)` }}
                transition={SPRING_SETTLE}
                className="cursor-grab active:cursor-grabbing"
                style={{
                  background: COLORS.surface4,
                  borderRadius: SHAPES.pebble,
                  padding: '16px',
                  textAlign: 'center' as const,
                  border: `1px solid ${COLORS.surface5}`,
                }}
              >
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.workerAsh, letterSpacing: '0.04em', pointerEvents: 'none' as const }}>
                  ← DRAG ME →
                </p>
              </motion.div>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '12px' }}>
                .motion-drag-settle
              </code>
            </div>

            {/* Pulse Throb */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.charcoalRed, marginBottom: '8px' }}>
                PULSE THROB
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, marginBottom: '16px' }}>
                1000ms · Urgent text emphasis
              </p>
              <motion.p
                animate={{
                  opacity: [1, 0.6, 1],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: M3_EXPRESSIVE,
                }}
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 800,
                  fontSize: '20px',
                  color: COLORS.charcoalRed,
                  textAlign: 'center' as const,
                  textShadow: `0 0 12px ${COLORS.charcoalRed}`,
                }}
              >
                URGENT
              </motion.p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '12px' }}>
                .motion-pulse-throb
              </code>
            </div>
          </div>

          {/* Easing callout */}
          <div
            className="mt-6 p-5 flex items-start gap-4"
            style={{
              background: `${COLORS.stencilYellow}08`,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.stencilYellow}20`,
            }}
          >
            <Info size={18} style={{ color: COLORS.stencilYellow, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.stencilYellow, letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                M3 EXPRESSIVE EASING — THE ONLY ALLOWED CURVE
              </p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '12px', color: COLORS.inkGold }}>
                cubic-bezier(0.34, 1.56, 0.64, 1)
              </code>
              <p style={{ fontFamily: FONTS.primary, fontSize: '12px', color: COLORS.workerAsh, opacity: 0.6, marginTop: '6px' }}>
                BANNED: <code style={{ color: COLORS.charcoalRed }}>ease</code>, <code style={{ color: COLORS.charcoalRed }}>linear</code>, generic transitions.
              </p>
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            11. BUTTONS
            ═══════════════════════════════════════════════════════════ */}
        <Section id="buttons" label="11 // INTERACTIVE" title="Button Variants" accent={COLORS.solidarityRed}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary — Solidarity Red */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
                PRIMARY (FILLED)
              </p>
              <div className="space-y-3">
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
                    width: '100%',
                  }}
                >
                  PRIMARY ACTION
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  style={{
                    background: COLORS.inkGold,
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
                    width: '100%',
                  }}
                >
                  INK GOLD CTA
                </motion.button>
              </div>
            </div>

            {/* Outline */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
                OUTLINE
              </p>
              <div className="space-y-3">
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
                    width: '100%',
                  }}
                >
                  OUTLINE GOLD
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  style={{
                    background: 'transparent',
                    color: COLORS.signalGreen,
                    fontFamily: FONTS.primary,
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    padding: '12px 28px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.signalGreen}30`,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  OUTLINE SIGNAL
                </motion.button>
              </div>
            </div>

            {/* Ghost + Destructive */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
                GHOST & DESTRUCTIVE
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2, background: COLORS.surface3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  style={{
                    background: 'transparent',
                    color: COLORS.workerAsh,
                    fontFamily: FONTS.primary,
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    padding: '12px 28px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.surface4}`,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  GHOST
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  style={{
                    background: `${COLORS.charcoalRed}18`,
                    color: COLORS.charcoalRed,
                    fontFamily: FONTS.primary,
                    fontWeight: 800,
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    padding: '12px 28px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.charcoalRed}30`,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  DELETE
                </motion.button>
              </div>
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            12. TAGS & BADGES
            ═══════════════════════════════════════════════════════════ */}
        <Section id="tags" label="12 // TAXONOMY" title="Tags & Badges" accent={COLORS.signalGreen}>
          {/* Keyword Tags — Pebble shape */}
          <div
            className="p-6 mb-6 noise-texture relative overflow-hidden"
            style={{
              background: COLORS.surface1,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface3}`,
            }}
          >
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
              KEYWORD TAGS — PEBBLE SHAPE
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: 'Case Management', color: COLORS.inkGold },
                { label: 'Family Violence', color: COLORS.solidarityRed },
                { label: 'Youth Outreach', color: COLORS.signalGreen },
                { label: 'AOD Counselling', color: COLORS.metalBlue },
                { label: 'Trauma Informed', color: COLORS.activistGreen },
                { label: 'NDIS', color: COLORS.stencilYellow },
                { label: 'Mental Health', color: COLORS.smokeOrange },
              ].map((tag) => (
                <motion.span
                  key={tag.label}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    color: tag.color,
                    background: `${tag.color}15`,
                    padding: '6px 16px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${tag.color}30`,
                    cursor: 'default',
                    display: 'inline-block',
                  }}
                >
                  {tag.label}
                </motion.span>
              ))}
            </div>

            {/* Status badges */}
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '12px' }}>
              STATUS BADGES
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'STRONG', color: COLORS.inkGold },
                { label: 'SOLID', color: COLORS.activistGreen },
                { label: 'BUILDING', color: COLORS.stencilYellow },
                { label: 'DEVELOPING', color: COLORS.smokeOrange },
                { label: 'CRITICAL', color: COLORS.charcoalRed },
                { label: 'APPLIED', color: COLORS.signalGreen },
                { label: 'INTERVIEW', color: COLORS.metalBlue },
              ].map((badge) => (
                <span
                  key={badge.label}
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                    color: badge.color,
                    background: `${badge.color}18`,
                    padding: '4px 12px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${badge.color}30`,
                  }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            13. ICONOGRAPHY — Lucide icons with micro-interactions
            ═══════════════════════════════════════════════════════════ */}
        <Section id="icons" label="13 // ICONS" title="Iconography" accent={COLORS.metalBlue}>
          <div
            className="p-6 noise-texture relative overflow-hidden"
            style={{
              background: COLORS.surface1,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface3}`,
            }}
          >
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '8px' }}>
              LUCIDE-REACT · HOVER MICRO-INTERACTIONS
            </p>
            <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface5, marginBottom: '24px' }}>
              hover:rotate-12 · hover:scale-110 · M3 Expressive easing
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {[
                { Icon: Home, name: 'Home', color: COLORS.solidarityRed },
                { Icon: Briefcase, name: 'Briefcase', color: COLORS.inkGold },
                { Icon: FileText, name: 'FileText', color: COLORS.signalGreen },
                { Icon: BarChart3, name: 'BarChart3', color: COLORS.metalBlue },
                { Icon: ClipboardList, name: 'Clipboard', color: COLORS.stencilYellow },
                { Icon: Sparkles, name: 'Sparkles', color: COLORS.activistGreen },
                { Icon: FolderOpen, name: 'Folder', color: COLORS.smokeOrange },
                { Icon: Settings, name: 'Settings', color: COLORS.workerAsh },
                { Icon: Search, name: 'Search', color: COLORS.signalGreen },
                { Icon: Heart, name: 'Heart', color: COLORS.charcoalRed },
                { Icon: Star, name: 'Star', color: COLORS.stencilYellow },
                { Icon: User, name: 'User', color: COLORS.workerAsh },
                { Icon: Bell, name: 'Bell', color: COLORS.inkGold },
                { Icon: TrendingUp, name: 'Trending', color: COLORS.activistGreen },
                { Icon: Download, name: 'Download', color: COLORS.metalBlue },
                { Icon: Upload, name: 'Upload', color: COLORS.smokeOrange },
                { Icon: Trash2, name: 'Trash', color: COLORS.charcoalRed },
                { Icon: Edit3, name: 'Edit', color: COLORS.signalGreen },
                { Icon: Check, name: 'Check', color: COLORS.activistGreen },
                { Icon: X, name: 'Close', color: COLORS.charcoalRed },
                { Icon: Plus, name: 'Plus', color: COLORS.solidarityRed },
                { Icon: ChevronRight, name: 'Chevron', color: COLORS.surface6 },
                { Icon: Zap, name: 'Zap', color: COLORS.stencilYellow },
                { Icon: Eye, name: 'Eye', color: COLORS.metalBlue },
              ].map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.15, rotate: 12 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex flex-col items-center gap-2 cursor-default"
                  style={{
                    padding: '12px',
                    borderRadius: SHAPES.pebble,
                    background: `${item.color}08`,
                    border: `1px solid ${item.color}15`,
                  }}
                >
                  <item.Icon size={24} style={{ color: item.color }} />
                  <p style={{ fontFamily: FONTS.mono, fontSize: '8px', color: COLORS.surface6, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                    {item.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            14. DATA LABELS
            ═══════════════════════════════════════════════════════════ */}
        <Section id="data" label="14 // DATA" title="Data Labels & Mono Patterns" accent={COLORS.inkGold}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data label specimens */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
                .data-label CLASS
              </p>

              <div className="space-y-4">
                {[
                  { label: 'ACTIVE APPLICATIONS', value: '8', color: COLORS.solidarityRed },
                  { label: 'ATS MATCH AVG', value: '79%', color: COLORS.inkGold },
                  { label: 'DOCS READY', value: '14', color: COLORS.signalGreen },
                  { label: 'INTERVIEWS PENDING', value: '3', color: COLORS.stencilYellow },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase' as const,
                        color: COLORS.surface6,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontWeight: 800,
                        fontSize: '24px',
                        color: item.color,
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code / Technical */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
                MONO TECHNICAL PATTERNS
              </p>
              <div
                className="p-4 mb-4"
                style={{
                  background: COLORS.surface2,
                  borderRadius: '6px',
                  border: `1px solid ${COLORS.surface4}`,
                }}
              >
                <pre style={{ fontFamily: FONTS.mono, fontSize: '12px', color: COLORS.workerAsh, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' as const }}>
                  <span style={{ color: COLORS.surface6 }}>{'// '}</span><span style={{ color: COLORS.signalGreen }}>Status codes</span>{'\n'}
                  <span style={{ color: COLORS.inkGold }}>ATS_SCORE</span>: <span style={{ color: COLORS.stencilYellow }}>94</span>{'\n'}
                  <span style={{ color: COLORS.inkGold }}>STATUS</span>:    <span style={{ color: COLORS.activistGreen }}>STRONG</span>{'\n'}
                  <span style={{ color: COLORS.inkGold }}>DAYS_AGO</span>:  <span style={{ color: COLORS.smokeOrange }}>2</span>{'\n'}
                  <span style={{ color: COLORS.inkGold }}>ROUTE</span>:     <span style={{ color: COLORS.metalBlue }}>/tracker</span>
                </pre>
              </div>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen }}>
                font-family: 'JetBrains Mono' · .font-mono
              </code>
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            15. CARDS — Metric + Profile patterns
            ═══════════════════════════════════════════════════════════ */}
        <Section id="cards" label="15 // COMPOSITION" title="Card Patterns" accent={COLORS.activistGreen}>
          {/* Metric Cards */}
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '12px' }}>
            METRIC CARD — FROM DASHBOARD
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'ACTIVE APPLICATIONS', value: '8', sublabel: '+3 this week', color: COLORS.solidarityRed, Icon: Briefcase },
              { label: 'INTERVIEWS PENDING', value: '3', sublabel: 'Next: Tomorrow 2pm', color: COLORS.stencilYellow, Icon: Clock },
              { label: 'ATS MATCH AVG', value: '79%', sublabel: '↑12% from last month', color: COLORS.inkGold, Icon: TrendingUp },
              { label: 'DOCS READY', value: '14', sublabel: '2 need updating', color: COLORS.signalGreen, Icon: FileText },
            ].map((card) => (
              <motion.div
                key={card.label}
                whileHover={{ y: -4, boxShadow: `0 8px 16px rgba(0,0,0,0.45)` }}
                className="relative overflow-hidden noise-texture"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface4}`,
                  padding: '24px',
                  cursor: 'default',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: card.color }} />
                <div className="flex items-start justify-between mb-4">
                  <div style={{ background: `${card.color}15`, borderRadius: SHAPES.pebble, padding: '8px' }}>
                    <card.Icon size={20} style={{ color: card.color }} />
                  </div>
                  <ArrowUpRight size={14} style={{ color: COLORS.surface6 }} />
                </div>
                <p style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: '36px', lineHeight: 1, color: COLORS.workerAsh, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {card.value}
                </p>
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '8px' }}>
                  {card.label}
                </p>
                <p style={{ fontFamily: FONTS.primary, fontWeight: 400, fontSize: '12px', color: card.color, opacity: 0.9 }}>
                  {card.sublabel}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Profile Card */}
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '12px' }}>
            PROFILE / ATS CARD — PROCLAMATION FONT TITLE
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { role: 'Senior Case Manager', org: 'Berry Street', score: 94, status: 'STRONG', color: COLORS.inkGold },
              { role: 'Family Violence Practitioner', org: 'Safe Steps', score: 87, status: 'SOLID', color: COLORS.activistGreen },
            ].map((profile) => (
              <motion.div
                key={profile.role}
                whileHover={{ y: -6, boxShadow: `0 8px 16px rgba(0,0,0,0.45)` }}
                className="relative overflow-hidden noise-texture group cursor-pointer"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                  padding: '28px',
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: profile.color }} />
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1 pr-4">
                    <h4
                      style={{
                        fontFamily: FONTS.proclamation,
                        fontWeight: 700,
                        fontSize: '17px',
                        color: COLORS.workerAsh,
                        lineHeight: 1.3,
                        marginBottom: '4px',
                      }}
                    >
                      {profile.role}
                    </h4>
                    <p style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: COLORS.surface6 }}>
                      {profile.org}
                    </p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: '32px', lineHeight: 1, color: profile.color, textShadow: `0 0 12px ${profile.color}66` }}>
                      {profile.score}
                    </p>
                    <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: profile.color, opacity: 0.7, marginTop: '4px' }}>
                      ATS SCORE
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                    color: profile.color,
                    background: `${profile.color}18`,
                    padding: '4px 12px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${profile.color}30`,
                  }}
                >
                  {profile.status}
                </span>
              </motion.div>
            ))}
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            16. FRAUNCES VARIATIONS — Energetic vs Restrained
            ═══════════════════════════════════════════════════════════ */}
        <Section id="fraunces" label="16 // DISPLAY" title="Fraunces Variations" accent={COLORS.stencilYellow}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Energetic */}
            <div
              className="p-8 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: COLORS.solidarityRed }} />
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.solidarityRed, marginBottom: '8px' }}>
                FRAUNCES ENERGETIC
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>SOFT: 100</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>WONK: 1</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>wght: 900</code>
              </div>
              <p
                style={{
                  fontFamily: FONTS.display,
                  fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1",
                  fontSize: '36px',
                  lineHeight: 1.05,
                  color: COLORS.workerAsh,
                  marginBottom: '12px',
                }}
              >
                THE SOLIDARITY MANIFESTO
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, lineHeight: 1.6 }}>
                Maximum expression. Soft, bouncy serifs with high contrast. Used for hero headlines (72px–144px).
              </p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '12px' }}>
                fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1"
              </code>
            </div>

            {/* Restrained */}
            <div
              className="p-8 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: COLORS.inkGold }} />
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.inkGold, marginBottom: '8px' }}>
                FRAUNCES RESTRAINED
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>SOFT: 20</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>WONK: 0</code>
                <code style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, background: COLORS.surface3, padding: '3px 8px', borderRadius: '4px' }}>wght: 700</code>
              </div>
              <p
                style={{
                  fontFamily: FONTS.display,
                  fontVariationSettings: "'wght' 700, 'wdth' 100, 'SOFT' 20, 'WONK' 0",
                  fontSize: '36px',
                  lineHeight: 1.05,
                  textTransform: 'uppercase' as const,
                  color: COLORS.workerAsh,
                  marginBottom: '12px',
                }}
              >
                ARCHIVE CONFIGURATION
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.surface6, lineHeight: 1.6 }}>
                Structured, formal. Straightened serifs with minimal optical variation. Used for section headers (24px–64px), column titles.
              </p>
              <code style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.signalGreen, display: 'block', marginTop: '12px' }}>
                fontVariationSettings: "'wght' 700, 'SOFT' 20, 'WONK' 0"
              </code>
            </div>
          </div>

          {/* Side-by-side scale comparison */}
          <div
            className="p-6 noise-texture relative overflow-hidden"
            style={{
              background: COLORS.surface1,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface3}`,
            }}
          >
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
              ENERGETIC VS RESTRAINED AT DIFFERENT SCALES
            </p>
            {[72, 48, 32, 24].map((size) => (
              <div key={size} className="flex items-baseline gap-6 py-3" style={{ borderBottom: `1px solid ${COLORS.surface3}` }}>
                <div className="w-16 flex-shrink-0">
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', color: COLORS.stencilYellow }}>{size}px</p>
                </div>
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                  <p style={{ fontFamily: FONTS.display, fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1", fontSize: `${Math.min(size, 48)}px`, color: COLORS.solidarityRed, lineHeight: 1.1 }}>
                    Ag
                  </p>
                  <p style={{ fontFamily: FONTS.display, fontVariationSettings: "'wght' 700, 'SOFT' 20, 'WONK' 0", fontSize: `${Math.min(size, 48)}px`, color: COLORS.inkGold, lineHeight: 1.1 }}>
                    Ag
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            17. INPUTS — Text fields with inkGold focus
            ═══════════════════════════════════════════════════════════ */}
        <Section id="inputs" label="17 // FORMS" title="Input Fields" accent={COLORS.inkGold}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default + Focus */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
                TEXT INPUT STATES
              </p>
              <div className="space-y-5">
                {/* Default */}
                <div>
                  <label style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: COLORS.surface6, display: 'block', marginBottom: '6px' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="nishant@solidarity.org"
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 400,
                      fontSize: '14px',
                      color: COLORS.workerAsh,
                      background: COLORS.surface2,
                      border: `1px solid ${COLORS.surface4}`,
                      borderRadius: SHAPES.pebble,
                      padding: '12px 16px',
                      width: '100%',
                      outline: 'none',
                    }}
                  />
                  <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.surface5, marginTop: '4px' }}>
                    DEFAULT STATE
                  </p>
                </div>

                {/* Focus */}
                <div>
                  <label style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: COLORS.inkGold, display: 'block', marginBottom: '6px' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Nishant|"
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 400,
                      fontSize: '14px',
                      color: COLORS.workerAsh,
                      background: COLORS.surface2,
                      border: `2px solid ${COLORS.inkGold}`,
                      borderRadius: SHAPES.pebble,
                      padding: '12px 16px',
                      width: '100%',
                      outline: 'none',
                      boxShadow: `0 0 12px ${COLORS.inkGold}22`,
                    }}
                  />
                  <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.inkGold, marginTop: '4px' }}>
                    FOCUS STATE — inkGold border + glow
                  </p>
                </div>

                {/* Error */}
                <div>
                  <label style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: COLORS.charcoalRed, display: 'block', marginBottom: '6px' }}>
                    PASSWORD
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="•••"
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 400,
                      fontSize: '14px',
                      color: COLORS.charcoalRed,
                      background: `${COLORS.charcoalRed}08`,
                      border: `2px solid ${COLORS.charcoalRed}`,
                      borderRadius: SHAPES.pebble,
                      padding: '12px 16px',
                      width: '100%',
                      outline: 'none',
                      boxShadow: `0 0 12px ${COLORS.charcoalRed}22`,
                    }}
                  />
                  <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.charcoalRed, marginTop: '4px' }}>
                    ERROR STATE — charcoalRed
                  </p>
                </div>

                {/* Disabled */}
                <div>
                  <label style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: COLORS.surface5, display: 'block', marginBottom: '6px' }}>
                    ORGANISATION
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value="Career Copilot"
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 400,
                      fontSize: '14px',
                      color: COLORS.surface5,
                      background: COLORS.surface2,
                      border: `1px solid ${COLORS.surface3}`,
                      borderRadius: SHAPES.pebble,
                      padding: '12px 16px',
                      width: '100%',
                      outline: 'none',
                      opacity: 0.5,
                    }}
                  />
                  <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.surface5, marginTop: '4px' }}>
                    DISABLED STATE
                  </p>
                </div>
              </div>
            </div>

            {/* Textarea + Select */}
            <div
              className="p-6 noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
              }}
            >
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '16px' }}>
                TEXTAREA & SELECT
              </p>
              <div className="space-y-5">
                <div>
                  <label style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: COLORS.surface6, display: 'block', marginBottom: '6px' }}>
                    BIO / NOTES
                  </label>
                  <textarea
                    readOnly
                    rows={4}
                    value="Social worker with 5+ years experience in family violence prevention and community outreach..."
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 400,
                      fontSize: '14px',
                      color: COLORS.workerAsh,
                      background: COLORS.surface2,
                      border: `1px solid ${COLORS.surface4}`,
                      borderRadius: SHAPES.pebble,
                      padding: '12px 16px',
                      width: '100%',
                      outline: 'none',
                      resize: 'vertical' as const,
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: COLORS.surface6, display: 'block', marginBottom: '6px' }}>
                    INDUSTRY PATH
                  </label>
                  <select
                    style={{
                      fontFamily: FONTS.primary,
                      fontWeight: 600,
                      fontSize: '14px',
                      color: COLORS.workerAsh,
                      background: COLORS.surface2,
                      border: `1px solid ${COLORS.surface4}`,
                      borderRadius: SHAPES.pebble,
                      padding: '12px 16px',
                      width: '100%',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option>CARE — Social Work & Community</option>
                    <option>TECH — Engineering & Design</option>
                    <option>CREATIVE — Arts & Communication</option>
                  </select>
                </div>

                {/* Token reference */}
                <div
                  className="p-4 mt-2"
                  style={{
                    background: COLORS.surface2,
                    borderRadius: '6px',
                    border: `1px solid ${COLORS.surface4}`,
                  }}
                >
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.surface6, marginBottom: '8px' }}>
                    FOCUS RING TOKENS
                  </p>
                  <pre style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAsh, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' as const }}>
                    <span style={{ color: COLORS.inkGold }}>border</span>: <span style={{ color: COLORS.stencilYellow }}>2px solid inkGold</span>{'\n'}
                    <span style={{ color: COLORS.inkGold }}>shadow</span>: <span style={{ color: COLORS.stencilYellow }}>0 0 12px inkGold/22</span>{'\n'}
                    <span style={{ color: COLORS.inkGold }}>label</span>:  <span style={{ color: COLORS.stencilYellow }}>JetBrains Mono 10px UPPERCASE</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            18. ASSET MANIFEST — All placeholder frames
            ═══════════════════════════════════════════════════════════ */}
        <Section id="assets" label="18 // ASSETS" title="Asset Manifest" accent={COLORS.smokeOrange}>
          <div
            className="p-5 mb-6 flex items-start gap-4"
            style={{
              background: `${COLORS.stencilYellow}08`,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.stencilYellow}20`,
            }}
          >
            <Info size={18} style={{ color: COLORS.stencilYellow, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.stencilYellow, letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                ASSETS NOT YET PROVIDED
              </p>
              <p style={{ fontFamily: FONTS.primary, fontSize: '12px', color: COLORS.workerAsh, opacity: 0.6, lineHeight: 1.5 }}>
                All frames below are colored placeholders sized to the correct aspect ratio. Replace with actual assets when available.
              </p>
            </div>
          </div>

          {/* ATMOSPHERIC & SUBSTRATE */}
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.smokeOrange, marginBottom: '12px' }}>
            ATMOSPHERIC & SUBSTRATE BACKGROUNDS
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-10">
            {[
              { id: 'KR-SOLID-034', name: 'Melbourne Laneway', aspect: '1:1', role: 'Substrate' },
              { id: 'KR-SOLID-001', name: 'Abstract Solidarity', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-002', name: 'Abstract Dalle', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-003', name: 'Abstract Gemini', aspect: '3:4', role: 'Atmospheric' },
              { id: 'KR-SOLID-004', name: 'Kerala Rage Bee', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-005', name: 'Kerala Rage Bra', aspect: '11:6', role: 'Atmospheric' },
              { id: 'KR-SOLID-006', name: 'Kerala Rage Fly', aspect: '11:6', role: 'Atmospheric' },
              { id: 'KR-SOLID-007', name: 'Kerala Rage Fri', aspect: '16:9', role: 'Atmospheric' },
              { id: 'KR-SOLID-008', name: 'Kerala Rage Gri', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-009', name: 'Kerala Rage Kr', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-010', name: 'Kerala Rage Nav', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-011', name: 'Kerala Rage Rad', aspect: '11:6', role: 'Atmospheric' },
              { id: 'KR-SOLID-012', name: 'Kerala Rage Sea', aspect: '11:6', role: 'Atmospheric' },
              { id: 'KR-SOLID-013', name: 'Kerala Rage Sen', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-014', name: 'Kerala Rage Wat', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-015', name: 'Kr Solid 013', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-016', name: 'Kr Solid 014', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-017', name: 'Moodboard 12 Ti', aspect: '2:3', role: 'Atmospheric' },
              { id: 'KR-SOLID-018', name: 'Abstract Solidarity', aspect: '1:1', role: 'Atmospheric' },
              { id: 'KR-SOLID-019', name: 'Paint Splash V1', aspect: '1:1', role: 'Atmospheric' },
            ].map((asset) => {
              const [w, h] = asset.aspect.split(':').map(Number);
              return (
                <div key={asset.id}>
                  <div
                    style={{
                      aspectRatio: `${w}/${h}`,
                      background: COLORS.surface2,
                      borderRadius: SHAPES.pebble,
                      border: `1px dashed ${COLORS.surface4}`,
                      display: 'flex',
                      flexDirection: 'column' as const,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                    }}
                  >
                    <span style={{ fontFamily: FONTS.mono, fontSize: '9px', fontWeight: 700, color: COLORS.surface5, letterSpacing: '0.04em', textAlign: 'center' as const }}>
                      {asset.id}
                    </span>
                  </div>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.surface6, marginTop: '4px', lineHeight: 1.3 }}>
                    {asset.name}
                  </p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '8px', color: COLORS.surface5 }}>
                    {asset.role} · {asset.aspect}
                  </p>
                </div>
              );
            })}
          </div>

          {/* RESISTANCE & CULTURAL ANCHORS */}
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.solidarityRed, marginBottom: '12px' }}>
            RESISTANCE & CULTURAL ANCHORS
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-10">
            {[
              { id: 'KR-SOLID-020', name: 'Devotional Cultural Anchor', aspect: '1:1', role: 'Mythic Anchor' },
              { id: 'KR-SOLID-021', name: 'Shiva Statue V1', aspect: '1:1', role: 'Mythic Anchor' },
              { id: 'KR-SOLID-022', name: 'Shiva Statue Street V1', aspect: '16:9', role: 'Mythic Anchor' },
              { id: 'KR-SOLID-023', name: 'Shiva Urban Protest V1', aspect: '16:9', role: 'Mythic Anchor' },
              { id: 'KR-SOLID-024', name: 'Resistance Portrait', aspect: '1:1', role: 'Heroic' },
              { id: 'KR-SOLID-025', name: 'Bhagat Singh V1', aspect: '3:4', role: 'Heroic' },
              { id: 'KR-SOLID-026', name: 'Tipu Sultan V1', aspect: '1:1', role: 'Heroic' },
              { id: 'KR-SOLID-027', name: 'Turbaned Man V1', aspect: '3:2', role: 'Heroic' },
              { id: 'KR-SOLID-028', name: 'Resistance History', aspect: '1:1', role: 'Heroic' },
              { id: 'KR-SOLID-029', name: 'First Nations Placard', aspect: '29:36', role: 'Heroic' },
              { id: 'KR-SOLID-030', name: 'Treaty Now Poster V1', aspect: '1:1', role: 'Heroic' },
              { id: 'KR-SOLID-031', name: 'Resistance Activist', aspect: '24:43', role: 'Heroic' },
              { id: 'KR-SOLID-032', name: 'Kerala Elephant V1', aspect: '1:1', role: 'Iconic Anchor' },
              { id: 'KR-SOLID-033', name: 'Kerala Landscape V1', aspect: '16:9', role: 'Iconic Anchor' },
            ].map((asset) => {
              const [w, h] = asset.aspect.split(':').map(Number);
              const isCritical = ['Mythic Anchor', 'Heroic'].includes(asset.role);
              return (
                <div key={asset.id}>
                  <div
                    style={{
                      aspectRatio: `${w}/${h}`,
                      background: isCritical ? `${COLORS.solidarityRed}08` : COLORS.surface2,
                      borderRadius: SHAPES.pebble,
                      border: `1px dashed ${isCritical ? COLORS.solidarityRed + '40' : COLORS.surface4}`,
                      display: 'flex',
                      flexDirection: 'column' as const,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                    }}
                  >
                    <span style={{ fontFamily: FONTS.mono, fontSize: '9px', fontWeight: 700, color: isCritical ? COLORS.solidarityRed : COLORS.surface5, letterSpacing: '0.04em', textAlign: 'center' as const }}>
                      {asset.id}
                    </span>
                    {isCritical && (
                      <span style={{ fontFamily: FONTS.mono, fontSize: '7px', fontWeight: 700, color: COLORS.charcoalRed, marginTop: '2px', letterSpacing: '0.06em' }}>
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.surface6, marginTop: '4px', lineHeight: 1.3 }}>
                    {asset.name}
                  </p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '8px', color: isCritical ? COLORS.solidarityRed : COLORS.surface5 }}>
                    {asset.role} · {asset.aspect}
                  </p>
                </div>
              );
            })}
          </div>

          {/* UI KIT */}
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: COLORS.signalGreen, marginBottom: '12px' }}>
            UI KIT — FUNCTIONAL ELEMENTS
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { id: 'KR-UI-001', name: 'Wheat Paste Tear', role: 'UI Element' },
              { id: 'KR-UI-002', name: 'Halo Disk', role: 'UI Element' },
              { id: 'KR-UI-003', name: 'Grit Particles', role: 'UI Element' },
              { id: 'KR-UI-004', name: 'Blueprint Grid', role: 'UI Element' },
              { id: 'KR-UI-005', name: 'Charcoal Paper', role: 'UI Element' },
              { id: 'KR-UI-006', name: 'Blueprint Layout', role: 'UI Element' },
              { id: 'KR-UI-007', name: 'Screenprint Stamp', role: 'UI Element' },
              { id: 'KR-UI-008', name: 'Elite Mastery Motif', role: 'Overlay' },
              { id: 'KR-UI-009', name: 'Mastery Chart Patterns', role: 'Pattern Fill' },
              { id: 'KR-UI-010', name: 'Success Screen Motif', role: 'Overlay' },
              { id: 'KR-UI-011', name: 'Historical Record', role: 'Pattern Fill' },
              { id: 'KR-UI-012', name: 'Metric Motifs', role: 'Motif Glyph' },
              { id: 'KR-UI-013', name: 'Scanning Holographic', role: 'Overlay' },
              { id: 'KR-UI-014', name: 'Resolved Card Motif', role: 'Corner Motif' },
              { id: 'KR-UI-015', name: 'Priority Halo', role: 'Motif Glyph' },
              { id: 'KR-UI-016', name: 'Status Icons Set', role: 'Icon Set' },
              { id: 'KR-UI-017', name: 'Skill Badge', role: 'Badge Set' },
            ].map((asset) => (
              <div key={asset.id}>
                <div
                  style={{
                    aspectRatio: '1/1',
                    background: COLORS.surface2,
                    borderRadius: SHAPES.pebble,
                    border: `1px dashed ${COLORS.signalGreen}25`,
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                  }}
                >
                  <span style={{ fontFamily: FONTS.mono, fontSize: '9px', fontWeight: 700, color: COLORS.signalGreen, letterSpacing: '0.04em', textAlign: 'center' as const, opacity: 0.7 }}>
                    {asset.id}
                  </span>
                </div>
                <p style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.surface6, marginTop: '4px', lineHeight: 1.3 }}>
                  {asset.name}
                </p>
                <p style={{ fontFamily: FONTS.mono, fontSize: '8px', color: COLORS.surface5 }}>
                  {asset.role}
                </p>
              </div>
            ))}
          </div>
        </Section>


        {/* ═══════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════ */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="pt-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${COLORS.surface3}` }}
        >
          <p style={{ fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.06em', color: COLORS.surface6, textTransform: 'uppercase' as const }}>
            KERALA RAGE v1.0.0 // LIVING STYLE GUIDE // SOLIDARITY MODE
          </p>
          <p style={{ fontFamily: FONTS.curator, fontSize: '14px', color: COLORS.smokeOrange, opacity: 0.6 }}>
            every pixel carries conviction
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
