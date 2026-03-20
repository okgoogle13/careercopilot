import { useState } from 'react';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@careercopilot/ui';
import type { ImprovedBullet } from '../../services/aiInterface';

interface BulletMetricsSuggestorProps {
  /** Bullet rewrites returned by the backend. Empty list shows the CTA. */
  bullets: ImprovedBullet[];
  /** Callback to trigger the backend enhancement call. */
  onSuggestMetrics: () => void;
  /** Whether the enhancement request is in-flight. */
  loading: boolean;
}

const METRIC_BADGE: Record<string, string> = {
  number:
    '[background:var(--sys-color-solidarityRed-steps-0)] [color:var(--sys-color-worker-ash-base)]',
  percentage:
    '[background:var(--sys-color-kr-activistSmokeGreen-steps-0)] [color:var(--sys-color-worker-ash-base)]',
  timeframe:
    '[background:var(--sys-color-solidaritySmokeOrange-steps-0)] [color:var(--sys-color-worker-ash-base)]',
  scale:
    '[background:var(--sys-color-kr-charcoalRed-steps-0)] [color:var(--sys-color-paperWhite-base)]',
};

/**
 * BulletMetricsSuggestor
 *
 * Shows a "Suggest Metrics" CTA when no bullets are available yet.
 * Once bullets are loaded, renders per-bullet cards with original →
 * improved rewrites, metric-type badges, and rationale callouts.
 *
 * Follows the same design-token conventions as ImpactEnhancements.tsx.
 */
export function BulletMetricsSuggestor({
  bullets,
  onSuggestMetrics,
  loading,
}: BulletMetricsSuggestorProps) {
  return (
    <div
      className="rounded-tech p-8 border shadow-elevation-1"
      style={{
        background: 'var(--sys-color-charcoalBackground-steps-2)',
        borderColor: 'var(--sys-color-concreteGrey-steps-0)',
      }}
      data-testid="bullet-metrics-suggestor"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles
            className="w-6 h-6"
            style={{ color: 'var(--sys-color-solidarityRed-base)' }}
          />
          <h2
            className="text-title-large font-bold"
            style={{ color: 'var(--sys-color-worker-ash-base)' }}
          >
            Bullet Metrics Suggestions
          </h2>
        </div>

        <Button
          onClick={onSuggestMetrics}
          disabled={loading}
          className="rounded-pebble px-6 font-bold"
          style={{
            background: 'var(--sys-color-solidarityRed-steps-0)',
            color: 'var(--sys-color-worker-ash-base)',
          }}
          data-testid="suggest-metrics-btn"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enhancing…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Suggest Metrics
            </>
          )}
        </Button>
      </div>

      <p
        className="text-body-medium mb-6"
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
      >
        Rewrite your resume bullets using the <strong>Google XYZ Formula</strong>:{' '}
        <em>Accomplished [X] as measured by [Y], by doing [Z]</em>
      </p>

      {/* Empty state */}
      {bullets.length === 0 && !loading && (
        <div
          className="text-center py-10 rounded-tech border border-dashed"
          style={{
            background: 'var(--sys-color-charcoalBackground-steps-1)',
            borderColor: 'var(--sys-color-concreteGrey-steps-0)',
          }}
        >
          <Sparkles
            className="w-10 h-10 mx-auto mb-3 opacity-40"
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
          />
          <p
            className="text-body-medium"
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
          >
            Click <strong>Suggest Metrics</strong> to generate quantifiable rewrites for your resume
            bullets.
          </p>
        </div>
      )}

      {/* Bullet cards */}
      {bullets.length > 0 && (
        <div className="space-y-6">
          {bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="rounded-pebble p-6 border"
              style={{
                background: 'var(--sys-color-charcoalBackground-steps-1)',
                borderColor: 'var(--sys-color-concreteGrey-steps-1)',
              }}
              data-testid={`bullet-card-${idx}`}
            >
              {/* Original */}
              <div className="mb-4">
                <span
                  className="text-label-small uppercase tracking-wider font-mono"
                  style={{ color: 'var(--sys-color-concreteGrey-base)' }}
                >
                  Original
                </span>
                <p
                  className="text-body-large line-through opacity-60 mt-1"
                  style={{ color: 'var(--sys-color-concreteGrey-base)' }}
                >
                  {bullet.original}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight
                  className="w-5 h-5"
                  style={{ color: 'var(--sys-color-solidarityRed-base)' }}
                />
                <span
                  className="text-label-medium font-bold uppercase"
                  style={{ color: 'var(--sys-color-solidarityRed-base)' }}
                >
                  Enhanced
                </span>
              </div>

              {/* Improved */}
              <div className="mb-4">
                <p
                  className="text-body-large font-bold"
                  style={{ color: 'var(--sys-color-worker-ash-base)' }}
                >
                  {bullet.improved}
                </p>
              </div>

              {/* Rationale */}
              {bullet.rationale && (
                <div
                  className="rounded-pebble p-4 border-l-4 mb-4"
                  style={{
                    background:
                      'color-mix(in srgb, var(--sys-color-solidaritySmokeOrange-steps-0) 20%, transparent)',
                    borderLeftColor: 'var(--sys-color-solidaritySmokeOrange-base)',
                  }}
                >
                  <span
                    className="text-label-small uppercase tracking-wider font-bold"
                    style={{ color: 'var(--sys-color-worker-ash-base)' }}
                  >
                    💡 Why This Works:
                  </span>
                  <p
                    className="text-body-medium mt-2"
                    style={{ color: 'var(--sys-color-worker-ash-base)' }}
                  >
                    {bullet.rationale}
                  </p>
                </div>
              )}

              {/* Metric type badge */}
              <span
                className={`inline-flex px-3 py-1 rounded-pebble text-label-small font-bold ${
                  METRIC_BADGE[bullet.metric_type] ??
                  '[background:var(--sys-color-charcoalBackground-steps-2)] [color:var(--sys-color-worker-ash-base)]'
                }`}
                data-testid="metric-badge"
              >
                {bullet.metric_type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
