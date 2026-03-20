import React from 'react';
import { motion } from 'motion/react';

// ── TYPES ────────────────────────────────────────────────────────────────────
interface KeywordMatchEntry {
  keyword: string;
  rate: number;
}

interface AuditDisplayProps {
  keywordMatch: KeywordMatchEntry[];
  matchedSkills: string[];
  skillGaps: string[];
}

// ── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',
  surface2:       'var(--sys-color-charcoalBackground-steps-2)',
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',
  solidarityRed:  'var(--sys-color-solidarityRed-base)',
  stencilYellow:  'var(--sys-color-stencilYellow-base)',
  activistGreen:  'var(--sys-color-kr-activistSmokeGreen-base)',
  workerAsh:      'var(--sys-color-worker-ash-base)',
  workerAshDim:   'var(--sys-color-worker-ash-steps-0)',
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',
  smokeOrange:    'var(--sys-color-solidaritySmokeOrange-base)',
};

const S = {
  panel: 'var(--sys-shape-blockRiot01)',
  chip:  'var(--sys-shape-blockRiot01)',
};

const F = {
  mono:    'var(--sys-type-fontFamilies-mono), monospace',
  curator: 'var(--sys-type-fontFamilies-curator), cursive',
};

const PRECISE = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * AuditDisplay — KR Solidarity v6.1
 * Decomposed from monolithic Analysis.tsx
 * Staging Release: Consolidated Reference
 */
export const AuditDisplay: React.FC<AuditDisplayProps> = ({
  keywordMatch = [],
  matchedSkills = [],
  skillGaps = []
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Keyword Match Rates */}
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

        {/* Note: Recharts wrapper omitted for clean UI-component harvest,
            expecting props or child injection in parent. */}
        <div className="flex flex-col gap-4">
          {keywordMatch.map((m) => (
            <div key={m.keyword} className="flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.workerAsh }}>{m.keyword}</span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.stencilYellow }}>{m.rate}%</span>
              </div>
              <div className="w-full bg-black/20" style={{ height: '4px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${m.rate}%`,
                    background: C.stencilYellow,
                    borderRadius: '0 1px 1px 0'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills Inventory */}
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
          {matchedSkills.map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily:   F.mono,
                fontWeight:   700,
                fontSize:     '9px',
                letterSpacing:'0.05em',
                textTransform:'uppercase' as const,
                color:        C.activistGreen,
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

        <div style={{ height: '1px', background: C.surface3, marginBottom: '16px' }} />

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
          {skillGaps.map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily:   F.mono,
                fontWeight:   700,
                fontSize:     '9px',
                letterSpacing:'0.05em',
                textTransform:'uppercase' as const,
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

        <p
          className="mt-auto pt-6 text-right opacity-60"
          style={{
            fontFamily: F.curator,
            fontSize:   '15px',
            fontStyle:  'italic',
            color:      C.smokeOrange,
            margin:     '24px 0 0',
          }}
        >
          the gaps are where the growth lives
        </p>
      </motion.div>
    </div>
  );
};
