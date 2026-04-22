/* eslint-disable */
/**
 * ATS Trend Chart
 *
 * Pure SVG sparkline showing ATS score trend across last N applications.
 * Harvested from: sources/prototype_v2.0/src/components/feature/DashboardOverview.tsx
 * Route owner: /dashboard (B19 — DashboardVisuals)
 *
 * No external chart libs. Uses --sys-color-* tokens only.
 * Positive segments: --sys-color-inkGold-base
 * Critical dip segments: --sys-color-solidarityRed-base
 */

interface DataPoint {
  label: string;
  score: number;
}

interface ATSTrendChartProps {
  data?: DataPoint[];
  height?: number;
}

const DEFAULT_DATA: DataPoint[] = [
  { label: 'App 1', score: 78 },
  { label: 'App 2', score: 85 },
  { label: 'App 3', score: 92 },
  { label: 'App 4', score: 88 },
  { label: 'App 5', score: 95 },
];

const WIDTH = 400;
const HEIGHT = 160;
const PADDING = { top: 16, right: 16, bottom: 32, left: 36 };

function toSvgCoords(
  points: DataPoint[],
  w: number,
  h: number,
  pad: typeof PADDING
): Array<{ x: number; y: number; score: number; label: string }> {
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const minScore = 0;
  const maxScore = 100;

  return points.map((pt, i) => ({
    x: pad.left + (i / (points.length - 1)) * innerW,
    y: pad.top + innerH - ((pt.score - minScore) / (maxScore - minScore)) * innerH,
    score: pt.score,
    label: pt.label,
  }));
}

export function ATSTrendChart({ data = DEFAULT_DATA, height = HEIGHT }: ATSTrendChartProps) {
  const coords = toSvgCoords(data, WIDTH, height, PADDING);
  const innerH = height - PADDING.top - PADDING.bottom;
  const innerW = WIDTH - PADDING.left - PADDING.right;

  // Y-axis grid lines at 0, 50, 100
  const gridLines = [0, 50, 100].map((v) => ({
    y: PADDING.top + innerH - (v / 100) * innerH,
    label: v,
  }));

  return (
    <div
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
        borderColor: 'var(--kr-color-concrete-grey-steps-0)',
        borderRadius: 'var(--sys-shape-placardTorn01)',
      }}
      className="p-6 border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            style={{ color: 'var(--sys-color-paperWhite-base)' }}
            className="font-display text-base font-bold uppercase tracking-tight"
          >
            ATS Score Trend
          </h3>
          <p
            style={{ color: 'var(--sys-color-worker-ash-base)' }}
            className="text-[10px] font-mono uppercase tracking-widest mt-0.5"
          >
            Last {data.length} applications
          </p>
        </div>
        <div
          style={{
            color: 'var(--sys-color-solidarityRed-base)',
            borderColor: 'var(--sys-color-solidarityRed-base)',
            borderRadius: 'var(--sys-shape-blockRiot03)',
          }}
          className="px-3 py-1 border text-[9px] font-bold uppercase tracking-widest opacity-70"
        >
          Live Tracking
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        width="100%"
        height={height}
        aria-label="ATS score trend chart"
        role="img"
      >
        {/* Grid lines */}
        {gridLines.map(({ y, label }) => (
          <g key={label}>
            <line
              x1={PADDING.left}
              y1={y}
              x2={WIDTH - PADDING.right}
              y2={y}
              stroke="var(--kr-color-concrete-grey-steps-0)"
              strokeOpacity={0.12}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={PADDING.left - 6}
              y={y + 4}
              textAnchor="end"
              fill="var(--sys-color-worker-ash-base)"
              fontSize={9}
              fontFamily="monospace"
              opacity={0.5}
            >
              {label}
            </text>
          </g>
        ))}

        {/* X-axis base line */}
        <line
          x1={PADDING.left}
          y1={PADDING.top + innerH}
          x2={WIDTH - PADDING.right}
          y2={PADDING.top + innerH}
          stroke="var(--kr-color-concrete-grey-steps-0)"
          strokeOpacity={0.2}
          strokeWidth={1}
        />

        {/* Segments — colored by direction */}
        {coords.slice(1).map((pt, i) => {
          const prev = coords[i];
          const isRising = pt.score >= prev.score;
          const strokeColor = isRising
            ? 'var(--sys-color-inkGold-base)'
            : 'var(--sys-color-solidarityRed-base)';
          return (
            <line
              key={i}
              x1={prev.x}
              y1={prev.y}
              x2={pt.x}
              y2={pt.y}
              stroke={strokeColor}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}

        {/* Data point dots */}
        {coords.map((pt, i) => {
          const isLast = i === coords.length - 1;
          return (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isLast ? 6 : 4}
                fill="var(--sys-color-charcoalBackground-steps-2)"
                stroke={
                  isLast ? 'var(--sys-color-inkGold-base)' : 'var(--sys-color-worker-ash-base)'
                }
                strokeWidth={2}
              />
              {/* Score label above last point */}
              {isLast && (
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  fill="var(--sys-color-inkGold-base)"
                  fontSize={11}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pt.score}
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis labels */}
        {coords.map((pt) => (
          <text
            key={pt.label}
            x={pt.x}
            y={PADDING.top + innerH + 18}
            textAnchor="middle"
            fill="var(--sys-color-worker-ash-base)"
            fontSize={9}
            fontFamily="monospace"
            opacity={0.5}
          >
            {pt.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
