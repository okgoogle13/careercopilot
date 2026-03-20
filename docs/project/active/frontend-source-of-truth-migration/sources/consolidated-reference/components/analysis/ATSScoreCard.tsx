import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Target, BarChart3, ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

// ── TYPES ────────────────────────────────────────────────────────────────────
interface MetricData {
  label: string;
  value: string;
  change: string;
  up: boolean;
  valueColor: string;
  borderColor: string;
  icon: LucideIcon;
}

interface ATSScoreCardProps {
  metrics: MetricData[];
}

// ── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',
  solidarityRed:  'var(--sys-color-solidarityRed-base)',
  activistGreen:  'var(--sys-color-kr-activistSmokeGreen-base)',
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',
  workerAsh:      'var(--sys-color-worker-ash-base)',
};

const S = {
  // Evidence card: sharp left (logged evidence), rounded right — 0 8px 8px 0
  evidenceCard: `var(--sys-shape-radius-none) var(--sys-shape-radius-md) var(--sys-shape-radius-md) var(--sys-shape-radius-none)`,
};

const F = {
  mono: 'var(--sys-type-fontFamilies-mono), monospace',
};

const PRECISE = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * ATSScoreCard — KR Solidarity v6.1
 * Decomposed from monolithic Analysis.tsx
 * Staging Release: Consolidated Reference
 */
export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-8"
      style={{ gap: '1px', background: C.surface3 }}
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: 2, y: -2 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.45, ease: PRECISE, delay: i * 0.08 }}
          className="relative overflow-hidden noise-texture"
          style={{
            background:   C.surface1,
            borderRadius: S.evidenceCard,
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

          {/* Value */}
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   800,
            fontSize:     '40px',
            lineHeight:    1,
            letterSpacing:'-0.03em',
            color:        m.valueColor,
            margin:       '0 0 6px',
            textShadow:   `2px 2px 0px ${C.surface3}`,
          }}>
            {m.value}
          </p>

          {/* Label */}
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
  );
};
