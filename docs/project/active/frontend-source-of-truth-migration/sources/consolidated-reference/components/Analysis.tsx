import { motion } from 'motion/react';
import { TrendingUp, Award, Target, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ============================================================================
// THE ANALYSIS — Kerala Rage v6.1 · Forensic Inking · Evidence Board
// ATS Performance Intelligence Workbench.
// Token Sync v2.0 · Shape System v6.1 · Anti-Slop Active
//
// FORENSIC LAWS (non-negotiable):
//   1. Stat cards → border-radius: 0 8px 8px 0 — sharp left (evidence edge)
//   2. Positive delta → border-left: 3px solid inkGold
//   3. Negative delta → border-left: 3px solid solidarityRed
//   4. ATS AVERAGE + MATCH RATE values → inkGold
//   5. APPLICATIONS + INTERVIEW RATE values → workerAsh
//   6. Skill Gaps → solidarityRed border + text (missing credentials ≠ neutral)
//   7. ATS trend line → type="linear" (sharp poly-line, NOT curve)
//   8. ATS data points → square (2×2 rect), NOT circles
//   9. Deep Recall stagger → translate(2px,-2px) → (0,0), 80ms per card
// ============================================================================

// ── CSS VAR TOKENS — zero hardcoded hex ─────────────────────────────────────
const C = {
  canvas:         'var(--sys-color-charcoalBackground-steps-0)',
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',
  surface2:       'var(--sys-color-charcoalBackground-steps-2)',
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',
  surface4:       'var(--sys-color-charcoalBackground-steps-4)',
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
  charcoalRed:    'var(--sys-color-kr-charcoalRed-base)',
};

// Resolved hex values for Recharts (can't consume CSS vars in SVG attributes)
const HEX = {
  inkGold:        '#DAF674',
  stencilYellow:  '#F6E748',
  signalGreen:    '#48F0E5',
  activistGreen:  '#48DA8B',
  solidarityRed:  '#F14714',
  workerAsh:      '#DAF6B3',
  workerAshMuted: '#8DAF75',
  workerAshDim:   '#627A4F',
  surface2:       '#242424',
  surface3:       '#2A2A2A',
  surface4:       '#323232',
  metalBlue:      '#48B3DA',
};

// ── SHAPE TOKENS — v6.1 ──────────────────────────────────────────────────────
const S = {
  // Evidence card: sharp left (logged evidence), rounded right — 0 8px 8px 0
  evidenceCard: `var(--sys-shape-radius-none) var(--sys-shape-radius-md) var(--sys-shape-radius-md) var(--sys-shape-radius-none)`,
  // Panel: scaffold shape
  panel:        'var(--sys-shape-blockRiot01)',
  // Skill tags: chip shape
  chip:         'var(--sys-shape-blockRiot01)',
  // Pill for pipeline legend dots
  sentry:       'var(--sys-shape-sentryAvatar)',
};

// ── FONT FAMILY TOKENS ───────────────────────────────────────────────────────
const F = {
  primary:      'var(--sys-type-fontFamilies-primary), system-ui, sans-serif',
  display:      'var(--sys-type-fontFamilies-display), serif',
  proclamation: 'var(--sys-type-fontFamilies-proclamation), serif',
  mono:         'var(--sys-type-fontFamilies-mono), monospace',
  curator:      'var(--sys-type-fontFamilies-curator), cursive',
};

// M3 Expressive — typographic transitions / hero entrance
const M3 = [0.34, 1.56, 0.64, 1] as const;
// Precise — controlled card stagger (no overshoot for evidence recall)
const PRECISE = [0.25, 0.46, 0.45, 0.94] as const;

// ── MOCK DATA — StrategyResult schema ────────────────────────────────────────

const ATS_TREND = [
  { month: 'Aug', score: 72 }, { month: 'Sep', score: 75 }, { month: 'Oct', score: 78 },
  { month: 'Nov', score: 82 }, { month: 'Dec', score: 85 }, { month: 'Jan', score: 87 },
  { month: 'Feb', score: 91 },
];

const APP_STATUS = [
  { name: 'Applied',    value: 12, color: HEX.solidarityRed },
  { name: 'Screening',  value: 5,  color: HEX.stencilYellow },
  { name: 'Interview',  value: 3,  color: HEX.signalGreen },
  { name: 'Offered',    value: 1,  color: HEX.activistGreen },
  { name: 'Rejected',   value: 4,  color: HEX.workerAshDim },
];

const KEYWORD_MATCH = [
  { keyword: 'Case Mgmt',    rate: 94 },
  { keyword: 'Risk Assess',  rate: 88 },
  { keyword: 'Trauma Care',  rate: 82 },
  { keyword: 'Report Write', rate: 79 },
  { keyword: 'Stakeholder',  rate: 75 },
  { keyword: 'NDIS',         rate: 68 },
];

const MATCHED_SKILLS = [
  'CASE MANAGEMENT', 'RISK ASSESSMENT', 'TRAUMA-INFORMED CARE',
  'CRISIS INTERVENTION', 'REPORT WRITING', 'STAKEHOLDER ENGAGEMENT', 'CULTURAL SAFETY',
];

const SKILL_GAPS = [
  'PROGRAM EVALUATION', 'DATA ANALYSIS', 'GRANT WRITING', 'RESEARCH METHODS',
];

// Metric config — explicit valueColor and borderColor per evidence card
const METRICS = [
  {
    label: 'ATS AVERAGE',    value: '87%', change: '+12%', up: true,
    valueColor: C.inkGold,   borderColor: C.inkGold,
    icon: TrendingUp,
  },
  {
    label: 'MATCH RATE',     value: '79%', change: '+8%',  up: true,
    valueColor: C.inkGold,   borderColor: C.inkGold,
    icon: Target,
  },
  {
    label: 'APPLICATIONS',   value: '25',  change: '+6',   up: true,
    valueColor: C.workerAsh, borderColor: C.inkGold,
    icon: BarChart3,
  },
  {
    label: 'INTERVIEW RATE', value: '24%', change: '-3%',  up: false,
    valueColor: C.workerAsh, borderColor: C.solidarityRed,
    icon: Award,
  },
];

// ── RECHARTS CUSTOM ELEMENTS ─────────────────────────────────────────────────

// Square dot render fns — inline in Line props, cx/cy only, no props spread.
// Spreading recharts dot props passes `key` into JSX which React forbids.

const tooltipStyle = {
  backgroundColor: HEX.surface2,
  border:          `1px solid ${HEX.surface4}`,
  borderRadius:    '2px',
  color:           HEX.workerAsh,
  fontFamily:      "'JetBrains Mono', monospace",
  fontSize:        '10px',
  boxShadow:       `2px 2px 0px ${HEX.surface4}`,
};

// ============================================================================
// COMPONENT
// ============================================================================

export function Analysis() {
  return (
    <div
      className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto"
      style={{ fontOpticalSizing: 'auto' as any }}
    >

      {/* ═══════════════════════════════════════
          HERO HEADER — THE ANALYSIS
          ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: M3 }}
        className="mb-10"
      >
        <p
          style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '10px',
            letterSpacing:'0.10em',
            textTransform:'uppercase' as const,
            color:        C.solidarityRed,
            marginBottom: '10px',
            margin:       '0 0 10px',
          }}
        >
          THE ANALYSIS // PERFORMANCE INTELLIGENCE
        </p>
        <h1
          style={{
            fontFamily:            F.display,
            fontVariationSettings: "'wght' 900, 'SOFT' 0, 'WONK' 0",
            fontSize:              'clamp(2rem, 5vw, 3.5rem)',
            lineHeight:             0.97,
            letterSpacing:         '0.02em',
            textTransform:         'uppercase' as const,
            color:                 C.inkGold,
            marginBottom:          '8px',
            margin:                '0 0 8px',
            // flat stencil shadow — zero blur
            textShadow:            `3px 3px 0px ${C.surface3}`,
          }}
        >
          YOUR PERFORMANCE
        </h1>
        <p
          style={{
            fontFamily:            F.primary,
            fontVariationSettings: "'wght' 475",
            fontSize:              '15px',
            color:                 C.workerAsh,
            opacity:               0.5,
            lineHeight:             1.6,
            maxWidth:              '560px',
            margin:                0,
          }}
        >
          ATS scores, keyword matching, application pipeline — the data that drives your next move.
        </p>
      </motion.div>

      {/* ═══════════════════════════════════════
          EVIDENCE FRAME LABEL
          ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: PRECISE }}
        className="flex items-center gap-3 mb-4"
      >
        {/* 3px flat solidarityRed rule — evidence bar */}
        <div style={{ width: '20px', height: '3px', background: C.solidarityRed, flexShrink: 0 }} />
        <p
          style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '9px',
            letterSpacing:'0.14em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
            margin:       0,
          }}
        >
          EVIDENCE // ATS INTELLIGENCE
        </p>
        <div style={{ flex: 1, height: '1px', background: C.surface3 }} />
      </motion.div>

      {/* ═══════════════════════════════════════
          STAT CARDS — Deep Recall Stagger
          Evidence cards: 0 8px 8px 0 radius, 3px left border
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-8"
        style={{ gap: '1px', background: C.surface3 }}
      >
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            // Deep Recall: 2px registration offset resolves flat — no shimmer
            initial={{ opacity: 0, x: 2, y: -2 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.45, ease: PRECISE, delay: i * 0.08 }}
            className="relative overflow-hidden noise-texture"
            style={{
              background:   C.surface1,
              borderRadius: S.evidenceCard,
              // Left border: inkGold for positive delta, solidarityRed for negative
              borderLeft:   `3px solid ${m.borderColor}`,
              borderTop:    `1px solid transparent`,
              borderRight:  `1px solid transparent`,
              borderBottom: `1px solid transparent`,
              padding:      '24px 20px',
              cursor:       'default',
            }}
          >
            {/* Icon + delta row */}
            <div className="flex items-start justify-between mb-5">
              <div style={{ color: m.borderColor }}>
                <m.icon size={18} strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-1">
                {m.up
                  ? <ArrowUpRight size={12} style={{ color: C.activistGreen }} />
                  : <ArrowDownRight size={12} style={{ color: C.solidarityRed }} />
                }
                <span style={{
                  fontFamily:   F.mono,
                  fontWeight:   700,
                  fontSize:     '10px',
                  color:        m.up ? C.activistGreen : C.solidarityRed,
                }}>
                  {m.change}
                </span>
              </div>
            </div>

            {/* Value — inkGold for ATS/MATCH, workerAsh for APPS/INTERVIEW */}
            <p style={{
              fontFamily:   F.mono,
              fontWeight:   800,
              fontSize:     '40px',
              lineHeight:    1,
              letterSpacing:'-0.03em',
              color:        m.valueColor,
              margin:       '0 0 6px',
              // flat ink shadow — zero blur
              textShadow:   `2px 2px 0px ${C.surface3}`,
            }}>
              {m.value}
            </p>

            {/* Label — mono wght 100 extreme contrast with value */}
            <p style={{
              fontFamily:   F.mono,
              fontWeight:   100,
              fontSize:     '9px',
              letterSpacing:'0.10em',
              textTransform:'uppercase' as const,
              color:        C.workerAshMuted,
              margin:       0,
            }}>
              {m.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════
          CHARTS ROW — ATS Trend + Pipeline
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* ATS Score Trend — sharp poly-line, square dots, inkGold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: PRECISE, delay: 0.32 }}
          className="lg:col-span-2 noise-texture relative overflow-hidden p-6"
          style={{
            background:   C.surface1,
            borderRadius: S.panel,
            border:       `1px solid ${C.surface3}`,
          }}
        >
          {/* Top accent bar — inkGold, flat */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: C.inkGold }} />

          <p style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '10px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        C.inkGold,
            margin:       '0 0 3px',
          }}>
            ATS SCORE TREND
          </p>
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '9px',
            letterSpacing:'0.06em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
            margin:       '0 0 24px',
          }}>
            6-MONTH TRAJECTORY · RANGE 60–100
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ATS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={HEX.surface3} />
              <XAxis
                dataKey="month"
                tick={{ fill: HEX.workerAshMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}
                axisLine={{ stroke: HEX.surface4 }}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fill: HEX.workerAshMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}
                axisLine={{ stroke: HEX.surface4 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: HEX.inkGold, fontWeight: 700 }}
              />
              {/* type="linear" — sharp poly-line, NOT monotone curve smoothing */}
              <Line
                type="linear"
                dataKey="score"
                stroke={HEX.inkGold}
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy } = props;
                  if (cx == null || cy == null) return <g />;
                  return <rect x={cx - 2} y={cy - 2} width={4} height={4} fill={HEX.inkGold} />;
                }}
                activeDot={(props: any) => {
                  const { cx, cy } = props;
                  if (cx == null || cy == null) return <g />;
                  return <rect x={cx - 4} y={cy - 4} width={8} height={8} fill={HEX.stencilYellow} />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Application Pipeline Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: PRECISE, delay: 0.40 }}
          className="noise-texture relative overflow-hidden p-6"
          style={{
            background:   C.surface1,
            borderRadius: S.panel,
            border:       `1px solid ${C.surface3}`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: C.signalGreen }} />

          <p style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '10px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        C.signalGreen,
            margin:       '0 0 3px',
          }}>
            PIPELINE
          </p>
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '9px',
            letterSpacing:'0.06em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
            margin:       '0 0 16px',
          }}>
            APPLICATION STATUS
          </p>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={APP_STATUS}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
              >
                {APP_STATUS.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend — flat squares, never circles */}
          <div style={{ marginTop: '8px' }}>
            {APP_STATUS.map((s) => (
              <div key={s.name} className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                <div className="flex items-center gap-2">
                  {/* Square legend mark — 98% radius is sentryAvatar, for dots use square here */}
                  <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '9px', letterSpacing: '0.04em', color: C.workerAshMuted }}>
                    {s.name}
                  </span>
                </div>
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: '10px', color: C.workerAsh }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
          BOTTOM ROW — Keyword Match + Skills
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Keyword Match Rates — horizontal bar, stencilYellow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: PRECISE, delay: 0.50 }}
          className="noise-texture relative overflow-hidden p-6"
          style={{
            background:   C.surface1,
            borderRadius: S.panel,
            border:       `1px solid ${C.surface3}`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: C.stencilYellow }} />

          <p style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '10px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        C.stencilYellow,
            margin:       '0 0 3px',
          }}>
            KEYWORD MATCH RATES
          </p>
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '9px',
            letterSpacing:'0.06em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
            margin:       '0 0 24px',
          }}>
            TOP SKILLS VS JOB LISTINGS
          </p>

          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={KEYWORD_MATCH} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={HEX.surface3} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: HEX.workerAshMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}
                axisLine={{ stroke: HEX.surface4 }}
                tickLine={false}
              />
              <YAxis
                dataKey="keyword"
                type="category"
                width={88}
                tick={{ fill: HEX.workerAsh, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="rate"
                fill={HEX.stencilYellow}
                // Sharp bars — 0 radius left, 2px right (screenprint ink)
                radius={[0, 2, 2, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Inventory — Matched + Gaps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: PRECISE, delay: 0.60 }}
          className="noise-texture relative overflow-hidden p-6 flex flex-col"
          style={{
            background:   C.surface1,
            borderRadius: S.panel,
            border:       `1px solid ${C.surface3}`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: C.activistGreen }} />

          {/* Matched Skills */}
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '10px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        C.activistGreen,
            margin:       '0 0 12px',
          }}>
            MATCHED SKILLS
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {MATCHED_SKILLS.map((skill) => (
              <span
                key={skill}
                style={{
                  fontFamily:   F.mono,
                  fontWeight:   700,
                  fontSize:     '9px',
                  letterSpacing:'0.05em',
                  textTransform:'uppercase' as const,
                  color:        C.activistGreen,
                  // flat tint — no gradient, no glow
                  background:   C.surface2,
                  padding:      '5px 12px',
                  borderRadius: S.chip,
                  border:       `1px solid ${C.activistGreen}`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: C.surface3, marginBottom: '16px' }} />

          {/* Skill Gaps — solidarityRed: missing credentials carry urgency */}
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '10px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        C.solidarityRed,
            margin:       '0 0 12px',
          }}>
            SKILL GAPS
          </p>
          <div className="flex flex-wrap gap-2">
            {SKILL_GAPS.map((skill) => (
              <span
                key={skill}
                style={{
                  fontFamily:   F.mono,
                  fontWeight:   700,
                  fontSize:     '9px',
                  letterSpacing:'0.05em',
                  textTransform:'uppercase' as const,
                  // solidarityRed text + border — missing credentials ≠ neutral
                  color:        C.solidarityRed,
                  background:   C.surface2,
                  padding:      '5px 12px',
                  borderRadius: S.chip,
                  border:       `1px solid ${C.solidarityRed}`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Curator footer caption */}
          <p
            className="mt-auto pt-6 text-right pointer-events-none"
            style={{
              fontFamily: F.curator,
              fontWeight: 400,
              fontSize:   '15px',
              fontStyle:  'italic',
              color:      C.smokeOrange,
              opacity:    0.6,
              margin:     '24px 0 0',
            }}
          >
            the gaps are where the growth lives
          </p>
        </motion.div>
      </div>

    </div>
  );
}
