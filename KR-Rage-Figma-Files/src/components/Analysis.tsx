import { motion } from 'motion/react';
import { TrendingUp, Award, Target, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ============================================================================
// ANALYSIS — KERALA RAGE / SOLIDARITY MODE — "THE AUDIT"
// ATS performance analytics. Charcoal surfaces, recharts in KR palette.
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
};

const SHAPES = { pebble: '16px 8px 12px 20px' };
const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

// --- Mock Data ---
const ATS_TREND = [
  { month: 'Aug', score: 72 }, { month: 'Sep', score: 75 }, { month: 'Oct', score: 78 },
  { month: 'Nov', score: 82 }, { month: 'Dec', score: 85 }, { month: 'Jan', score: 87 },
  { month: 'Feb', score: 91 },
];

const APP_STATUS = [
  { name: 'Applied', value: 12, color: COLORS.solidarityRed },
  { name: 'Screening', value: 5, color: COLORS.stencilYellow },
  { name: 'Interview', value: 3, color: COLORS.signalGreen },
  { name: 'Offered', value: 1, color: COLORS.activistGreen },
  { name: 'Rejected', value: 4, color: COLORS.workerAshDim },
];

const KEYWORD_MATCH = [
  { keyword: 'Case Mgmt', rate: 94 }, { keyword: 'Risk Assess', rate: 88 },
  { keyword: 'Trauma Care', rate: 82 }, { keyword: 'Report Writing', rate: 79 },
  { keyword: 'Stakeholder', rate: 75 }, { keyword: 'NDIS', rate: 68 },
];

const MATCHED_SKILLS = [
  'Case Management', 'Risk Assessment', 'Trauma-Informed Care', 'Crisis Intervention',
  'Report Writing', 'Stakeholder Engagement', 'Cultural Safety',
];

const MISSING_SKILLS = [
  'Program Evaluation', 'Data Analysis', 'Grant Writing', 'Research Methods',
];

const METRICS = [
  { label: 'ATS AVERAGE', value: '87%', change: '+12%', up: true, color: COLORS.inkGold, icon: TrendingUp },
  { label: 'MATCH RATE', value: '79%', change: '+8%', up: true, color: COLORS.activistGreen, icon: Target },
  { label: 'APPLICATIONS', value: '25', change: '+6', up: true, color: COLORS.solidarityRed, icon: BarChart3 },
  { label: 'INTERVIEW RATE', value: '24%', change: '-3%', up: false, color: COLORS.stencilYellow, icon: Award },
];

const tooltipStyle = {
  backgroundColor: COLORS.surface2,
  border: `1px solid ${COLORS.surface4}`,
  borderRadius: '8px',
  color: COLORS.workerAsh,
  fontFamily: FONTS.mono,
  fontSize: '11px',
};

export function Analysis() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_SLAM}
        className="mb-10"
      >
        <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.solidarityRed, marginBottom: '12px' }}>
          THE AUDIT // PERFORMANCE INTELLIGENCE
        </p>
        <h1
          style={{
            fontFamily: FONTS.display,
            fontVariationSettings: "'wght' 800, 'wdth' 120",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: COLORS.workerAsh,
            marginBottom: '8px',
          }}
        >
          YOUR <span style={{ color: COLORS.inkGold }}>PERFORMANCE</span>
        </h1>
        <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 475, 'wdth' 98", fontSize: '15px', color: COLORS.workerAsh, opacity: 0.5, lineHeight: 1.6, maxWidth: '600px' }}>
          ATS scores, keyword matching, application pipeline — the data that drives your next move.
        </p>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SLAM, delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.45)' }}
            className="relative overflow-hidden noise-texture"
            style={{
              background: COLORS.surface1,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface4}`,
              padding: '24px',
              cursor: 'default',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: m.color }} />
            <div className="flex items-start justify-between mb-4">
              <div style={{ background: `${m.color}15`, borderRadius: SHAPES.pebble, padding: '8px' }}>
                <m.icon size={20} style={{ color: m.color }} />
              </div>
              <div className="flex items-center gap-1">
                {m.up ? <ArrowUpRight size={14} style={{ color: COLORS.activistGreen }} /> : <ArrowDownRight size={14} style={{ color: COLORS.charcoalRed }} />}
                <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: m.up ? COLORS.activistGreen : COLORS.charcoalRed }}>
                  {m.change}
                </span>
              </div>
            </div>
            <p style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: '36px', lineHeight: 1, color: COLORS.workerAsh, letterSpacing: '-0.02em', marginBottom: '4px' }}>
              {m.value}
            </p>
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.workerAshMuted }}>
              {m.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* ATS Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.3 }}
          className="lg:col-span-2 noise-texture relative overflow-hidden p-6"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.inkGold, marginBottom: '4px' }}>
            ATS SCORE TREND
          </p>
          <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, marginBottom: '24px' }}>
            6-MONTH TRAJECTORY
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ATS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} />
              <XAxis dataKey="month" tick={{ fill: COLORS.workerAshMuted, fontFamily: FONTS.mono, fontSize: 10 }} axisLine={{ stroke: COLORS.surface4 }} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: COLORS.workerAshMuted, fontFamily: FONTS.mono, fontSize: 10 }} axisLine={{ stroke: COLORS.surface4 }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke={COLORS.inkGold} strokeWidth={3} dot={{ fill: COLORS.inkGold, strokeWidth: 0, r: 5 }} activeDot={{ r: 7, fill: COLORS.stencilYellow }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Application Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.4 }}
          className="noise-texture relative overflow-hidden p-6"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.signalGreen, marginBottom: '4px' }}>
            PIPELINE
          </p>
          <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, marginBottom: '16px' }}>
            APPLICATION STATUS
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={APP_STATUS} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {APP_STATUS.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {APP_STATUS.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: '2px', background: s.color }} />
                  <span style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted }}>{s.name}</span>
                </div>
                <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', color: COLORS.workerAsh }}>{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Keyword match + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Keyword Match Rates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.5 }}
          className="noise-texture relative overflow-hidden p-6"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.stencilYellow, marginBottom: '4px' }}>
            KEYWORD MATCH RATES
          </p>
          <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, marginBottom: '24px' }}>
            TOP SKILLS VS JOB LISTINGS
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={KEYWORD_MATCH} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface3} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: COLORS.workerAshMuted, fontFamily: FONTS.mono, fontSize: 10 }} axisLine={{ stroke: COLORS.surface4 }} tickLine={false} />
              <YAxis dataKey="keyword" type="category" width={90} tick={{ fill: COLORS.workerAsh, fontFamily: FONTS.mono, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="rate" fill={COLORS.stencilYellow} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.6 }}
          className="noise-texture relative overflow-hidden p-6"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.activistGreen, marginBottom: '16px' }}>
            MATCHED SKILLS
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {MATCHED_SKILLS.map((skill) => (
              <span
                key={skill}
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: COLORS.activistGreen,
                  background: `${COLORS.activistGreen}12`,
                  padding: '6px 14px',
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.activistGreen}30`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.charcoalRed, marginBottom: '12px' }}>
            SKILL GAPS
          </p>
          <div className="flex flex-wrap gap-2">
            {MISSING_SKILLS.map((skill) => (
              <span
                key={skill}
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: COLORS.charcoalRed,
                  background: `${COLORS.charcoalRed}10`,
                  padding: '6px 14px',
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.charcoalRed}25`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Curator */}
          <p
            className="mt-6 pointer-events-none"
            style={{
              fontFamily: FONTS.curator,
              fontSize: '14px',
              color: COLORS.smokeOrange,
              opacity: 0.5,
            }}
          >
            the gaps are where the growth lives
          </p>
        </motion.div>
      </div>
    </div>
  );
}