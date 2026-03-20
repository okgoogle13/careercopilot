import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendDataPoint } from './AnalysisTypes';

// ── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',
  inkGold:        'var(--sys-color-inkGold-base)',
  workerAsh:      'var(--sys-color-worker-ash-base)',
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',
};

const S = {
  panel: 'var(--sys-shape-scaffoldSlab01)', // Symmetric-ish slab for chart container
};

const F = {
  mono: 'var(--sys-type-fontFamilies-mono), monospace',
};

interface TrendChartProps {
  data: TrendDataPoint[];
}

/**
 * TrendChart — KR Solidarity v6.1
 * Decomposed from monolithic Analysis.tsx
 * Staging Release: Consolidated Reference
 */
export const TrendChart: React.FC<TrendChartProps> = ({ data = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.30 }}
      className="noise-texture relative overflow-hidden mb-8 p-8"
      style={{
        background:   C.surface1,
        borderRadius: S.panel,
        border:       `1px solid ${C.surface3}`,
        height:       '400px',
      }}
    >
      <div className="absolute top-0 left-0 p-6 z-10">
        <p style={{
          fontFamily:   F.mono,
          fontWeight:   700,
          fontSize:     '11px',
          letterSpacing:'0.12em',
          textTransform:'uppercase' as const,
          color:        C.inkGold,
          margin:       '0 0 4px',
        }}>
          ATS COMPLIANCE TRAJECTORY
        </p>
        <p style={{
          fontFamily:   F.mono,
          fontWeight:   100,
          fontSize:     '9px',
          letterSpacing:'0.05em',
          textTransform:'uppercase' as const,
          color:        C.workerAshMuted,
          margin:       0,
        }}>
          HISTORICAL SCORE VELOCITY (Q1 2024)
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 80, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.inkGold} stopOpacity={0.4} />
              <stop offset="95%" stopColor={C.inkGold} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.surface3} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: C.workerAshMuted, fontSize: 9, fontFamily: F.mono }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: C.workerAshMuted, fontSize: 9, fontFamily: F.mono }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: C.surface1,
              border: `1px solid ${C.inkGold}`,
              fontFamily: F.mono,
              fontSize: '11px',
              borderRadius: '2px',
              color: C.workerAsh
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={C.inkGold}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
