import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, ArrowDownRight, Upload, Search, LayoutDashboard, BarChart3 } from 'lucide-react';
import moodBoardImage from 'figma:asset/da39bad7e7d503f7160d5074e14edb60898d0276.png';

// ============================================================================
// TACTICAL COMMAND MAP — Kerala Rage v6.1 · Operations Dashboard
// Not a dashboard — a high-contrast status map of career resistance.
// Theme: Tactical Command Map · Territory Gain · Radar Sweep Intel
// Token Sync v2.0 · Shape System v6.1 · Anti-Slop Active
//
// COMMAND LAWS:
//   1. Fraunces for ALL large numerics — Scroll-Pressure: wght 300→900
//   2. Work Sans for utility UI labels, CTAs, body copy
//   3. JetBrains Mono for data fields, codes, timestamps
//   4. Radar Sweep: SVG-based, solidarityRed, 4s rotation (windFlutter)
//   5. Territory Gain: 12px flat-fill industrial bars, Concrete Grey tracks
//   6. Stone containers: blockRiot02 shape, 2px Concrete Grey borders (heavy)
//   7. Solidarity Charcoal substrate (#1A1714)
//   8. Ink Gold for optimistic stats, solidarityRed for primary actions
//   9. Zero flora, zero circles (border-radius: 50% BANNED, SVG <circle> OK)
//   10. All shadows: 0 blur, flat offset only
// ============================================================================

// ── CSS VAR TOKENS ────────────────────────────────────────────────────────────
const C = {
  base:           'var(--sys-color-solidarityCharcoal-base)',  // #1A1714
  canvas:         'var(--sys-color-charcoalBackground-steps-0)',
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',
  surface2:       'var(--sys-color-charcoalBackground-steps-2)',
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',
  surface4:       'var(--sys-color-charcoalBackground-steps-4)',
  surface5:       'var(--sys-color-charcoalBackground-steps-5)',
  solidarityRed:  'var(--sys-color-solidarityRed-base)',
  inkGold:        'var(--sys-color-inkGold-base)',
  stencilYellow:  'var(--sys-color-stencilYellow-base)',
  signalGreen:    'var(--sys-color-signalGreen-base)',
  activistGreen:  'var(--sys-color-kr-activistSmokeGreen-base)',
  workerAsh:      'var(--sys-color-worker-ash-base)',
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',
  workerAshDim:   'var(--sys-color-worker-ash-steps-0)',
  smokeOrange:    'var(--sys-color-solidaritySmokeOrange-base)',
  metalBlue:      'var(--sys-color-protestMetalBlue-base)',
  concrete:       'var(--sys-color-concreteGrey-base)',
};

// Hex values for SVG and complex CSS expressions
const HEX = {
  solidarityRed: '#F14714',
  inkGold:       '#DAF674',
  stencilYellow: '#F6E748',
  activistGreen: '#48DA8B',
  metalBlue:     '#48B3DA',
  smokeOrange:   '#DA8B48',
  workerAsh:     '#DAF6B3',
  workerAshDim:  '#627A4F',
  surface2:      '#242424',
  surface3:      '#2A2A2A',
  surface4:      '#323232',
  concrete:      '#A39B8F',
};

// ── SHAPE TOKENS ──────────────────────────────────────────────────────────────
const S = {
  // Stone container — Scaffold archetype (immutable)
  stone:    'var(--sys-shape-blockRiot02)',    // 20px 4px 12px 2px
  // Strike CTA — primary action
  strike:   'var(--sys-shape-blockRiot03)',    // 32px 2px 2px 2px
  // March chip — filter/tag
  chip:     'var(--sys-shape-blockRiot01)',    // 8px 2px 8px 2px
  // Alert shard — status badge
  shard:    'var(--sys-shape-alertShard01)',   // 32px 2px 2px 32px
  // Pill — count badge only
  pill:     'var(--sys-shape-pillMarch01)',    // 9999px
};

// ── FONT FAMILY TOKENS ────────────────────────────────────────────────────────
const F = {
  display:      'var(--sys-type-fontFamilies-display), serif',       // Fraunces — large numerics
  primary:      'var(--sys-type-fontFamilies-primary), system-ui, sans-serif', // Work Sans — utility
  proclamation: 'var(--sys-type-fontFamilies-proclamation), serif',  // Libre Bodoni — editorial
  mono:         'var(--sys-type-fontFamilies-mono), monospace',       // JetBrains Mono — data
  curator:      'var(--sys-type-fontFamilies-curator), cursive',      // Caveat — handwritten notes
};

// Viscous Fluidity — M3 Expressive (overshoot, heavy surfaces)
const M3 = [0.34, 1.56, 0.64, 1] as const;
// Settle — controlled deceleration for large panel transitions
const SETTLE = [0.25, 0.46, 0.45, 0.94] as const;

// ============================================================================
// DATA
// ============================================================================

const OPS_STATUS = [
  {
    label: 'ACTIVE OPS',
    value: '8',
    delta: '+3 THIS WEEK',
    up: true,
    color: C.solidarityRed,
    hex:   HEX.solidarityRed,
  },
  {
    label: 'INTERVIEWS',
    value: '3',
    delta: 'NEXT: MONDAY',
    up: true,
    color: C.stencilYellow,
    hex:   HEX.stencilYellow,
  },
  {
    label: 'ATS MATCH AVG',
    value: '79%',
    delta: '+12% LAST MONTH',
    up: true,
    color: C.inkGold,
    hex:   HEX.inkGold,
  },
  {
    label: 'DOCS READY',
    value: '14',
    delta: '2 NEED UPDATE',
    up: false,
    color: C.activistGreen,
    hex:   HEX.activistGreen,
  },
];

const TERRITORY = [
  { label: 'APPLICATIONS SENT',  value: 82, colorHex: HEX.solidarityRed,  color: C.solidarityRed },
  { label: 'KSC ALIGNMENT',      value: 71, colorHex: HEX.inkGold,         color: C.inkGold },
  { label: 'INTERVIEW SUCCESS',  value: 58, colorHex: HEX.activistGreen,   color: C.activistGreen },
  { label: 'NETWORK REACH',      value: 45, colorHex: HEX.metalBlue,       color: C.metalBlue },
];

interface RecentOp {
  codename: string;
  role:     string;
  unit:     string;
  status:   'ACTIVE' | 'SCREENING' | 'INTERVIEW' | 'PENDING' | 'COMPLETE';
  score:    number;
  filed:    string;
}

const RECENT_OPS: RecentOp[] = [
  { codename: 'OP-0427', role: 'Senior Case Manager',          unit: 'Berry Street',     status: 'ACTIVE',    score: 94, filed: '2d ago' },
  { codename: 'OP-0391', role: 'Family Violence Practitioner', unit: 'Safe Steps',        status: 'SCREENING', score: 87, filed: '5d ago' },
  { codename: 'OP-0379', role: 'NDIS Support Coordinator',     unit: 'genU',              status: 'INTERVIEW', score: 71, filed: '8d ago' },
  { codename: 'OP-0341', role: 'Program Manager',              unit: 'Salvation Army',    status: 'PENDING',   score: 63, filed: '12d ago' },
  { codename: 'OP-0305', role: 'AOD Counsellor',               unit: 'Uniting',           status: 'COMPLETE',  score: 78, filed: '18d ago' },
];

function statusColor(s: RecentOp['status']): string {
  if (s === 'ACTIVE')    return C.solidarityRed;
  if (s === 'SCREENING') return C.stencilYellow;
  if (s === 'INTERVIEW') return C.inkGold;
  if (s === 'COMPLETE')  return C.activistGreen;
  return C.metalBlue;
}

function scoreColor(n: number): string {
  if (n >= 90) return HEX.inkGold;
  if (n >= 80) return HEX.activistGreen;
  if (n >= 70) return HEX.stencilYellow;
  return HEX.smokeOrange;
}

// ============================================================================
// RADAR SWEEP COMPONENT
// SVG-based clandestine radar — solidarityRed sweep, 4s rotation (windFlutter)
// Uses SVG <circle> (NOT border-radius: 50%) — compliant.
// prefers-reduced-motion: stops rotation, shows static grid.
// ============================================================================

function RadarSweep() {
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  return (
    <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
      {/* Rotating sweep — solidarityRed sector, 4s (windFlutter) */}
      {!reducedMotion && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            position:        'absolute',
            inset:           0,
            transformOrigin: 'center',
          }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180">
            {/* Primary sweep sector — 60° wedge */}
            <path
              d="M 90 90 L 90 6 A 84 84 0 0 1 162.7 132 Z"
              fill={HEX.solidarityRed}
              fillOpacity="0.20"
            />
            {/* Trailing decay sector — 30° after primary */}
            <path
              d="M 90 90 L 162.7 132 A 84 84 0 0 1 148.5 163.5 Z"
              fill={HEX.solidarityRed}
              fillOpacity="0.07"
            />
          </svg>
        </motion.div>
      )}

      {/* Static grid — always visible, rendered on top of sweep */}
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Grid rings — SVG circles (no border-radius, compliant) */}
        <circle cx="90" cy="90" r="82" fill="none" stroke={HEX.surface3} strokeWidth="0.8" strokeDasharray="5 3" />
        <circle cx="90" cy="90" r="58" fill="none" stroke={HEX.surface3} strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx="90" cy="90" r="34" fill="none" stroke={HEX.surface3} strokeWidth="0.8" />
        {/* Cross-hairs */}
        <line x1="90"  y1="4"   x2="90"  y2="176" stroke={HEX.surface4} strokeWidth="0.6" />
        <line x1="4"   y1="90"  x2="176" y2="90"  stroke={HEX.surface4} strokeWidth="0.6" />
        {/* Diagonal grid lines */}
        <line x1="32" y1="32" x2="148" y2="148" stroke={HEX.surface3} strokeWidth="0.4" strokeDasharray="3 4" />
        <line x1="148" y1="32" x2="32" y2="148" stroke={HEX.surface3} strokeWidth="0.4" strokeDasharray="3 4" />
        {/* Intel blips — intercepted job leads */}
        <circle cx="58"  cy="64"  r="4" fill={HEX.inkGold}    fillOpacity="0.9" />
        <circle cx="112" cy="48"  r="3" fill={HEX.metalBlue}  fillOpacity="0.85" />
        <circle cx="133" cy="104" r="2.5" fill={HEX.inkGold}  fillOpacity="0.6" />
        <circle cx="68"  cy="126" r="2"   fill={HEX.metalBlue} fillOpacity="0.5" />
        {/* Blip pulse rings */}
        <circle cx="58" cy="64" r="8" fill="none" stroke={HEX.inkGold} strokeWidth="0.5" strokeOpacity="0.4" />
        <circle cx="112" cy="48" r="6" fill="none" stroke={HEX.metalBlue} strokeWidth="0.5" strokeOpacity="0.35" />
        {/* Center origin */}
        <circle cx="90" cy="90" r="4" fill={HEX.solidarityRed} />
        <circle cx="90" cy="90" r="8" fill="none" stroke={HEX.solidarityRed} strokeWidth="0.8" strokeOpacity="0.4" />
        {/* Concrete Grey range tick marks */}
        <line x1="90" y1="6"   x2="90" y2="14"  stroke={HEX.concrete} strokeWidth="1.2" />
        <line x1="90" y1="166" x2="90" y2="174" stroke={HEX.concrete} strokeWidth="1.2" />
        <line x1="6"  y1="90"  x2="14" y2="90"  stroke={HEX.concrete} strokeWidth="1.2" />
        <line x1="166" y1="90" x2="174" y2="90" stroke={HEX.concrete} strokeWidth="1.2" />
      </svg>
    </div>
  );
}

// ============================================================================
// TERRITORY BAR — heavy industrial progress bar
// 12px flat-fill, Concrete Grey track, 0-blur shadow
// ============================================================================

function TerritoryBar({
  label,
  value,
  colorHex,
  delay = 0,
}: {
  label:    string;
  value:    number;
  colorHex: string;
  delay?:   number;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{
          fontFamily:   F.mono,
          fontWeight:   100,
          fontSize:     '9px',
          letterSpacing:'0.10em',
          textTransform:'uppercase' as const,
          color:        C.workerAshDim,
        }}>
          {label}
        </span>
        {/* Fraunces numeral — the value IS the data */}
        <span style={{
          fontFamily:            F.display,
          fontVariationSettings: "'wght' 900, 'SOFT' 0",
          fontSize:              '22px',
          lineHeight:             1,
          color:                 colorHex,
          // flat stencil shadow
          textShadow:            `2px 2px 0px ${HEX.surface3}`,
        }}>
          {value}
          <span style={{ fontSize: '13px', fontVariationSettings: "'wght' 400" }}>%</span>
        </span>
      </div>

      {/* Industrial track — 2px Concrete Grey border, flat */}
      <div style={{
        position:   'relative',
        height:     '12px',
        background: HEX.surface3,
        // Asymmetric radius — not uniform
        borderRadius: 'var(--sys-shape-radius-xs) var(--sys-shape-radius-none) var(--sys-shape-radius-none) var(--sys-shape-radius-xs)',
        border:       `1px solid ${HEX.surface4}`,
        overflow:     'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.4, ease: SETTLE, delay }}
          style={{
            height:       '100%',
            background:   colorHex,
            // flat ink bleed — zero blur
            boxShadow:    `3px 0 0px ${colorHex}`,
            borderRadius: 'inherit',
          }}
        />
        {/* Territory gain label inside bar — only if wide enough */}
        {value > 20 && (
          <span style={{
            position:     'absolute',
            left:         '8px',
            top:          '50%',
            transform:    'translateY(-50%)',
            fontFamily:   F.mono,
            fontWeight:   800,
            fontSize:     '7px',
            letterSpacing:'0.08em',
            color:        '#0F0F0F',
            opacity:      0.7,
          }}>
            {value >= 75 ? 'STRONG' : value >= 50 ? 'ADVANCING' : 'BUILDING'}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// OPERATIONS LOG — field report table
// ============================================================================

function OperationsLog() {
  const SETTLE_CSS = `cubic-bezier(${SETTLE.join(',')})`;

  return (
    <div
      className="noise-texture overflow-hidden"
      style={{
        background:   C.surface1,
        borderRadius: S.stone,
        // Heavy industrial borders — 2px Concrete Grey
        border:       `2px solid ${C.concrete}`,
        // flat offset shadow
        boxShadow:    `4px 4px 0px ${C.surface4}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${C.surface3}` }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: '3px', height: '18px', background: C.solidarityRed }} />
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '10px',
            letterSpacing:'0.10em',
            textTransform:'uppercase' as const,
            color:        C.workerAsh,
            margin:       0,
          }}>
            OPERATIONS LOG
          </p>
          <span style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '9px',
            letterSpacing:'0.06em',
            color:        C.workerAshDim,
          }}>
            {RECENT_OPS.length} FIELD REPORTS
          </span>
        </div>
        <Link to="/kanban">
          <span style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '9px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        C.metalBlue,
          }}>
            VIEW PIPELINE →
          </span>
        </Link>
      </div>

      {/* Column headers */}
      <div
        className="grid px-6 py-2"
        style={{
          gridTemplateColumns: '100px 1fr 140px 90px 56px 68px',
          gap: '12px',
          borderBottom: `1px solid ${C.surface3}`,
        }}
      >
        {['CODENAME', 'OPERATION', 'UNIT', 'STATUS', 'SCORE', 'FILED'].map(h => (
          <span key={h} style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '8px',
            letterSpacing:'0.10em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
          }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {RECENT_OPS.map((op, i) => (
        <motion.div
          key={op.codename}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: SETTLE, delay: 0.4 + i * 0.07 }}
          className="grid px-6 py-4 items-center group cursor-pointer"
          style={{
            gridTemplateColumns: '100px 1fr 140px 90px 56px 68px',
            gap:          '12px',
            borderBottom: i < RECENT_OPS.length - 1 ? `1px solid ${C.surface3}` : 'none',
            transition:   `background 180ms ${SETTLE_CSS}`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = HEX.surface2; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
        >
          {/* Codename */}
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: '10px', color: C.metalBlue, letterSpacing: '0.04em' }}>
            {op.codename}
          </span>

          {/* Role */}
          <span style={{ fontFamily: F.proclamation, fontWeight: 700, fontSize: '13px', color: C.workerAsh, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
            {op.role}
          </span>

          {/* Unit */}
          <span style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '10px', color: C.workerAshMuted, letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
            {op.unit}
          </span>

          {/* Status badge */}
          <span style={{
            fontFamily:   F.mono,
            fontWeight:   800,
            fontSize:     '7px',
            letterSpacing:'0.10em',
            textTransform:'uppercase' as const,
            color:        statusColor(op.status),
            background:   C.surface2,
            padding:      '3px 8px',
            borderRadius: S.shard,
            border:       `1px solid ${statusColor(op.status)}`,
            display:      'inline-block',
          }}>
            {op.status}
          </span>

          {/* Score — Fraunces, color-graded */}
          <span style={{
            fontFamily:            F.display,
            fontVariationSettings: "'wght' 900",
            fontSize:              '18px',
            color:                 scoreColor(op.score),
            textShadow:            `1px 1px 0px ${HEX.surface3}`,
          }}>
            {op.score}
          </span>

          {/* Filed */}
          <span style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '9px', color: C.workerAshDim, letterSpacing: '0.04em' }}>
            {op.filed}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN — TACTICAL COMMAND MAP
// ============================================================================

export function Dashboard() {
  const { scrollYProgress } = useScroll();

  // Scroll Pressure — hero weight builds with scroll (300→900)
  const heroWeight = useTransform(scrollYProgress, [0, 0.12], [300, 900]);
  const heroWidth  = useTransform(scrollYProgress, [0, 0.12], [100, 120]);

  // Live timestamp
  const [timestamp, setTimestamp] = useState('');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setTimestamp(
        `${d.toLocaleDateString('en-AU', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()} · ${d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false })} LOCAL`
      );
    };
    fmt();
    const id = setInterval(fmt, 30000);
    return () => clearInterval(id);
  }, []);

  const SETTLE_CSS = `cubic-bezier(${SETTLE.join(',')})`;

  return (
    <div
      className="relative min-h-screen"
      style={{ background: C.canvas, fontOpticalSizing: 'auto' as any }}
    >
      {/* Substrate noise */}
      <div className="fixed inset-0 -z-10 noise-texture" style={{ background: C.canvas }} />

      <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">

        {/* ═══════════════════════════════════════════════
            COMMAND STATUS BAR — thin intel strip
            ═══════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between flex-wrap gap-2 mb-6 px-4 py-2"
          style={{
            background:   C.surface1,
            borderRadius: S.chip,
            border:       `1px solid ${C.surface3}`,
          }}
        >
          <div className="flex items-center gap-4">
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: '9px', letterSpacing: '0.12em', color: C.solidarityRed }}>
              CAREER COPILOT
            </span>
            <span style={{ width: '1px', height: '12px', background: C.surface4, display: 'inline-block' }} />
            <span style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '9px', letterSpacing: '0.08em', color: C.workerAshDim }}>
              TACTICAL COMMAND MAP
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: SETTLE }}
              style={{ width: '6px', height: '6px', borderRadius: '1px', background: C.activistGreen }}
            />
            <span style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '8px', letterSpacing: '0.08em', color: C.workerAshDim }}>
              OPERATIONAL
            </span>
            <span style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '8px', letterSpacing: '0.06em', color: C.surface5 }}>
              {timestamp}
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            HERO — OPERATIONS STATUS
            Wheat-paste backdrop, Scroll Pressure headline
            ═══════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: SETTLE }}
          className="relative overflow-hidden noise-texture mb-8"
          style={{
            background:   C.surface1,
            borderRadius: S.stone,
            // Heavy industrial border — 2px Concrete Grey
            border:       `2px solid ${C.concrete}`,
            minHeight:    '280px',
            // flat offset shadow
            boxShadow:    `6px 6px 0px ${C.surface4}`,
          }}
        >
          {/* Mood board — wheat-paste texture at 6% */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:    `url(${moodBoardImage})`,
              backgroundSize:     'cover',
              backgroundPosition: 'center 30%',
              opacity:            0.06,
              mixBlendMode:       'screen',
            }}
          />

          {/* solidarityRed accent bar — top */}
          <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: C.solidarityRed }} />

          {/* Content */}
          <div
            className="relative z-10 p-8 md:p-12 flex flex-col justify-between"
            style={{ minHeight: '280px' }}
          >
            <div>
              {/* Breadcrumb label */}
              <motion.p
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: M3, delay: 0.1 }}
                style={{
                  fontFamily:   F.mono,
                  fontWeight:   100,
                  fontSize:     '10px',
                  letterSpacing:'0.14em',
                  textTransform:'uppercase' as const,
                  color:        C.solidarityRed,
                  margin:       '0 0 12px',
                }}
              >
                OPERATIONS STATUS // MELBOURNE SECTOR
              </motion.p>

              {/* Hero heading — Scroll Pressure: wght 300→900 with scroll */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: M3, delay: 0.15 }}
                style={{
                  fontFamily:            F.display,
                  fontWeight:            heroWeight as any,
                  fontVariationSettings: `'wdth' ${heroWidth}, 'SOFT' 0, 'WONK' 0`,
                  fontSize:              'clamp(2.5rem, 6vw, 5rem)',
                  lineHeight:            0.93,
                  letterSpacing:         '-0.02em',
                  textTransform:         'uppercase' as const,
                  color:                 C.workerAsh,
                  margin:                '0 0 12px',
                  textShadow:            `4px 4px 0px ${C.surface3}`,
                }}
              >
                RESISTANCE{' '}
                <span style={{ color: C.inkGold }}>ACTIVE</span>
              </motion.h1>

              {/* Sub-copy — Work Sans utility */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: M3, delay: 0.22 }}
                style={{
                  fontFamily:            F.primary,
                  fontVariationSettings: "'wght' 475",
                  fontSize:              '15px',
                  lineHeight:            1.6,
                  color:                 C.workerAsh,
                  opacity:               0.6,
                  maxWidth:              '520px',
                  margin:                '0 0 28px',
                }}
              >
                You have{' '}
                <span style={{ color: C.stencilYellow, fontVariationSettings: "'wght' 700" }}>3 interviews</span>{' '}
                this week and{' '}
                <span style={{ color: C.solidarityRed, fontVariationSettings: "'wght' 700" }}>2 docs</span>{' '}
                that need updating. Current ATS average:{' '}
                <span style={{ color: C.inkGold, fontVariationSettings: "'wght' 700" }}>79%</span>.
              </motion.p>
            </div>

            {/* Strike CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: M3, delay: 0.32 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/ingestion">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.28, ease: M3 }}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    gap:          '8px',
                    background:   C.solidarityRed,
                    color:        C.canvas,
                    fontFamily:   F.mono,
                    fontWeight:   900,
                    fontSize:     '11px',
                    letterSpacing:'0.10em',
                    textTransform:'uppercase' as const,
                    padding:      '13px 24px',
                    borderRadius: S.strike,
                    // flat shadow — zero blur
                    boxShadow:    `4px 4px 0px ${C.surface4}`,
                  }}
                >
                  <Upload size={14} strokeWidth={2.5} />
                  UPLOAD RESUME
                </motion.span>
              </Link>

              <Link to="/opportunities">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.28, ease: M3 }}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    gap:          '8px',
                    background:   'transparent',
                    color:        C.metalBlue,
                    fontFamily:   F.mono,
                    fontWeight:   700,
                    fontSize:     '11px',
                    letterSpacing:'0.10em',
                    textTransform:'uppercase' as const,
                    padding:      '12px 24px',
                    borderRadius: S.stone,
                    border:       `1px solid ${C.metalBlue}`,
                  }}
                >
                  <Search size={13} strokeWidth={2} />
                  FIND LEADS
                </motion.span>
              </Link>

              <Link to="/kanban">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.28, ease: M3 }}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    gap:          '8px',
                    background:   'transparent',
                    color:        C.inkGold,
                    fontFamily:   F.mono,
                    fontWeight:   700,
                    fontSize:     '11px',
                    letterSpacing:'0.10em',
                    textTransform:'uppercase' as const,
                    padding:      '12px 24px',
                    borderRadius: S.stone,
                    border:       `1px solid ${C.inkGold}`,
                  }}
                >
                  <LayoutDashboard size={13} strokeWidth={2} />
                  VIEW PIPELINE
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Handwritten curator note */}
          <motion.div
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 0.55, rotate: -3 }}
            transition={{ duration: 0.8, ease: SETTLE, delay: 0.6 }}
            className="absolute bottom-6 right-8 hidden md:block pointer-events-none"
            style={{
              fontFamily: F.curator,
              fontWeight: 400,
              fontSize:   '18px',
              color:      C.stencilYellow,
              transform:  'rotate(-3deg)',
            }}
          >
            momentum is building...
          </motion.div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            ACKNOWLEDGMENT OF COUNTRY
            ═══════════════════════════════════════════════ */}
        <div
          className="mb-8 px-5 py-4"
          style={{
            borderLeft:   `3px solid ${C.workerAsh}`,
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '11px',
            letterSpacing:'0.03em',
            color:        C.workerAsh,
            lineHeight:   1.7,
            opacity:      0.7,
          }}
        >
          We acknowledge the Traditional Owners of the land on which we work and live, and pay our respects to Elders past, present and emerging.
          Sovereignty was never ceded.{' '}
          <span style={{ fontWeight: 700 }}>This always was, always will be Aboriginal land.</span>
        </div>

        {/* ═══════════════════════════════════════════════
            STATUS GRID — 4 operation metrics
            Fraunces numerals · Concrete Grey borders
            ═══════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-8"
          style={{ gap: '2px', background: C.concrete }}
        >
          {OPS_STATUS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, x: 2 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.45, ease: SETTLE, delay: 0.2 + i * 0.08 }}
              className="relative overflow-hidden noise-texture"
              style={{
                background: C.surface1,
                padding:    '24px',
                // No uniform border-radius — sharp edges for industrial feel
                borderRadius: i === 0 ? S.stone : i === 3 ? 'var(--sys-shape-radius-none) var(--sys-shape-radius-md) var(--sys-shape-radius-md) var(--sys-shape-radius-none)' : 'var(--sys-shape-radius-none)',
              }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: stat.color }} />

              {/* Label */}
              <p style={{
                fontFamily:   F.mono,
                fontWeight:   100,
                fontSize:     '8px',
                letterSpacing:'0.12em',
                textTransform:'uppercase' as const,
                color:        C.workerAshDim,
                margin:       '0 0 10px',
              }}>
                {stat.label}
              </p>

              {/* Value — Fraunces extreme weight (Scroll Pressure at rest = 900) */}
              <p style={{
                fontFamily:            F.display,
                fontVariationSettings: "'wght' 900, 'SOFT' 0",
                fontSize:              '44px',
                lineHeight:            1,
                color:                 stat.color,
                margin:                '0 0 8px',
                textShadow:            `3px 3px 0px ${C.surface3}`,
              }}>
                {stat.value}
              </p>

              {/* Delta */}
              <div className="flex items-center gap-1">
                {stat.up
                  ? <ArrowUpRight size={11} style={{ color: stat.color, flexShrink: 0 }} />
                  : <ArrowDownRight size={11} style={{ color: C.solidarityRed, flexShrink: 0 }} />
                }
                <span style={{
                  fontFamily:   F.mono,
                  fontWeight:   700,
                  fontSize:     '9px',
                  letterSpacing:'0.06em',
                  color:        stat.up ? stat.color : C.solidarityRed,
                }}>
                  {stat.delta}
                </span>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ═══════════════════════════════════════════════
            MAIN GRID — Territory Gain + Radar Discovery
            ═══════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">

          {/* Territory Gain panel — 2/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: SETTLE, delay: 0.3 }}
            className="lg:col-span-2 noise-texture overflow-hidden"
            style={{
              background:   C.surface1,
              borderRadius: S.stone,
              border:       `2px solid ${C.concrete}`,
              padding:      '32px',
              boxShadow:    `4px 4px 0px ${C.surface4}`,
            }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: '4px', height: '20px', background: C.solidarityRed }} />
              <p style={{
                fontFamily:   F.mono,
                fontWeight:   700,
                fontSize:     '10px',
                letterSpacing:'0.10em',
                textTransform:'uppercase' as const,
                color:        C.workerAsh,
                margin:       0,
              }}>
                TERRITORY GAINED
              </p>
            </div>

            <p style={{
              fontFamily:            F.primary,
              fontVariationSettings: "'wght' 475",
              fontSize:              '13px',
              color:                 C.workerAsh,
              opacity:               0.5,
              margin:                '0 0 28px',
              lineHeight:            1.6,
            }}>
              Career resistance metrics — every application is a communiqué, every interview is territory gained.
            </p>

            {/* Heavy industrial bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {TERRITORY.map((t, i) => (
                <TerritoryBar
                  key={t.label}
                  label={t.label}
                  value={t.value}
                  colorHex={t.colorHex}
                  delay={0.5 + i * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Right column — Radar + Quick Strike */}
          <div className="flex flex-col gap-4">

            {/* Radar Discovery tile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: SETTLE, delay: 0.4 }}
              className="noise-texture overflow-hidden flex-1"
              style={{
                background:   C.surface1,
                borderRadius: S.stone,
                border:       `2px solid ${C.concrete}`,
                padding:      '24px',
                boxShadow:    `4px 4px 0px ${C.surface4}`,
              }}
            >
              <p style={{
                fontFamily:   F.mono,
                fontWeight:   700,
                fontSize:     '10px',
                letterSpacing:'0.10em',
                textTransform:'uppercase' as const,
                color:        C.solidarityRed,
                margin:       '0 0 16px',
              }}>
                JOB DISCOVERY // RADAR
              </p>

              <div className="flex items-center gap-4">
                <RadarSweep />

                <div className="flex flex-col gap-3">
                  {/* Intercept count — large Fraunces */}
                  <div>
                    <p style={{
                      fontFamily:            F.display,
                      fontVariationSettings: "'wght' 900, 'SOFT' 0",
                      fontSize:              '42px',
                      lineHeight:            1,
                      color:                 C.metalBlue,
                      textShadow:            `3px 3px 0px ${HEX.surface3}`,
                      margin:                0,
                    }}>
                      8
                    </p>
                    <p style={{
                      fontFamily:   F.mono,
                      fontWeight:   100,
                      fontSize:     '8px',
                      letterSpacing:'0.10em',
                      textTransform:'uppercase' as const,
                      color:        C.workerAshDim,
                      margin:       '2px 0 0',
                    }}>
                      NEW INTERCEPTS
                    </p>
                  </div>

                  {/* Signal breakdown */}
                  {[
                    { label: 'VERIFIED',    count: 4, color: C.metalBlue },
                    { label: 'URGENT',      count: 1, color: C.solidarityRed },
                    { label: 'UNCONFIRMED', count: 3, color: C.workerAshDim },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                      <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: s.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '8px', letterSpacing: '0.06em', color: C.workerAshDim }}>
                        {s.count} {s.label}
                      </span>
                    </div>
                  ))}

                  <Link to="/opportunities">
                    <motion.span
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.28, ease: M3 }}
                      className="flex items-center gap-1.5 cursor-pointer"
                      style={{
                        display:      'inline-flex',
                        fontFamily:   F.mono,
                        fontWeight:   900,
                        fontSize:     '9px',
                        letterSpacing:'0.10em',
                        textTransform:'uppercase' as const,
                        background:   C.metalBlue,
                        color:        C.canvas,
                        padding:      '8px 14px',
                        borderRadius: S.strike,
                        boxShadow:    `2px 2px 0px ${C.surface4}`,
                        marginTop:    '4px',
                      }}
                    >
                      OPEN LOOKOUT
                      <ArrowRight size={10} strokeWidth={2.5} />
                    </motion.span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Quick Strike Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: SETTLE, delay: 0.5 }}
              className="noise-texture overflow-hidden"
              style={{
                background:   C.surface1,
                borderRadius: S.stone,
                border:       `2px solid ${C.concrete}`,
                padding:      '20px',
                boxShadow:    `4px 4px 0px ${C.surface4}`,
              }}
            >
              <p style={{
                fontFamily:   F.mono,
                fontWeight:   100,
                fontSize:     '8px',
                letterSpacing:'0.12em',
                textTransform:'uppercase' as const,
                color:        C.workerAshDim,
                margin:       '0 0 12px',
              }}>
                QUICK STRIKE
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { to: '/analysis',   label: 'RUN ANALYSIS',   color: C.inkGold,    Icon: BarChart3 },
                  { to: '/ksc-generator', label: 'KSC STUDIO',  color: C.activistGreen, Icon: ArrowRight },
                ].map(({ to, label, color, Icon }) => (
                  <Link key={to} to={to}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.28, ease: M3 }}
                      className="flex items-center gap-3 cursor-pointer"
                      style={{
                        padding:      '10px 14px',
                        borderRadius: S.chip,
                        border:       `1px solid ${C.surface4}`,
                        background:   C.surface2,
                        transition:   `background 180ms ${SETTLE_CSS}`,
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = HEX.surface3; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = HEX.surface2; }}
                    >
                      <Icon size={14} style={{ color, flexShrink: 0 }} strokeWidth={1.5} />
                      <span style={{
                        fontFamily:   F.mono,
                        fontWeight:   700,
                        fontSize:     '10px',
                        letterSpacing:'0.08em',
                        color:        color,
                      }}>
                        {label}
                      </span>
                      <ArrowRight size={10} style={{ marginLeft: 'auto', color: C.workerAshDim }} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            OPERATIONS LOG — recent field reports
            ═══════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SETTLE, delay: 0.5 }}
          className="mb-8"
        >
          <OperationsLog />
        </motion.section>

        {/* ═══════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between flex-wrap gap-4 pt-6"
          style={{ borderTop: `1px solid ${C.surface3}` }}
        >
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '9px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
            margin:       0,
          }}>
            TACTICAL COMMAND MAP // SOLIDARITY MODE // CAREER COPILOT
          </p>
          <p style={{
            fontFamily: F.curator,
            fontWeight: 400,
            fontSize:   '16px',
            fontStyle:  'italic',
            color:      C.smokeOrange,
            opacity:    0.55,
            margin:     0,
          }}>
            the resistance is organised
          </p>
        </div>

      </div>
    </div>
  );
}
