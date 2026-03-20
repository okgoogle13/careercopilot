import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PipelineDataPoint } from './AnalysisTypes';

// ── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',
  protestBlue:    'var(--sys-color-protestMetalBlue-base)',
  workerAsh:      'var(--sys-color-worker-ash-base)',
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',
};

const S = {
  panel: 'var(--sys-shape-scaffoldSlab01)',
};

const F = {
  mono: 'var(--sys-type-fontFamilies-mono), monospace',
};

interface PipelineChartProps {
  data: PipelineDataPoint[];
}

/**
 * PipelineChart — KR Solidarity v6.1
 * Decomposed from monolithic Analysis.tsx
 * Staging Release: Consolidated Reference
 */
export const PipelineChart: React.FC<PipelineChartProps> = ({ data = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.40 }}
      className="noise-texture relative overflow-hidden mb-8 p-8 flex flex-col items-center justify-center lg:mb-0"
      style={{
        background:   C.surface1,
        borderRadius: S.panel,
        border:       `1px solid ${C.surface3}`,
        height:       '400px',
      }}
    >
      <div className="absolute top-0 left-0 p-6 z-10 w-full">
        <p style={{
          fontFamily:   F.mono,
          fontWeight:   700,
          fontSize:     '11px',
          letterSpacing:'0.12em',
          textTransform:'uppercase' as const,
          color:        C.protestBlue,
          margin:       '0 0 4px',
        }}>
          PIPELINE DISTRIBUTION
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
          APPLICATION STATUS INVENTORY
        </p>
      </div>

      <div className="w-full h-full pt-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: C.surface1,
                border: `1px solid ${C.protestBlue}`,
                fontFamily: F.mono,
                fontSize: '11px',
                borderRadius: '2px',
                color: C.workerAsh
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 w-full px-4">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div style={{ width: '8px', height: '8px', background: d.color, borderRadius: '1px' }} />
            <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.workerAshMuted, textTransform: 'uppercase' as const }}>
              {d.name}
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.workerAsh, fontWeight: 700, marginLeft: 'auto' }}>
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
