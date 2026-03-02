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
  number: 'bg-primary-container text-on-primary-container',
  percentage: 'bg-secondary-container text-on-secondary-container',
  timeframe: 'bg-tertiary-container text-on-tertiary-container',
  scale: 'bg-error-container text-on-error-container',
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
      className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1"
      data-testid="bullet-metrics-suggestor"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-title-large font-bold text-on-surface">
            Bullet Metrics Suggestions
          </h2>
        </div>

        <Button
          onClick={onSuggestMetrics}
          disabled={loading}
          className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary rounded-pebble px-6 font-bold"
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

      <p className="text-body-medium text-on-surface-variant mb-6">
        Rewrite your resume bullets using the{' '}
        <strong>Google XYZ Formula</strong>:{' '}
        <em>Accomplished [X] as measured by [Y], by doing [Z]</em>
      </p>

      {/* Empty state */}
      {bullets.length === 0 && !loading && (
        <div className="text-center py-10 bg-surface-container-low rounded-tech border border-outline-variant border-dashed">
          <Sparkles className="w-10 h-10 text-on-surface-variant mx-auto mb-3 opacity-40" />
          <p className="text-body-medium text-on-surface-variant">
            Click <strong>Suggest Metrics</strong> to generate quantifiable
            rewrites for your resume bullets.
          </p>
        </div>
      )}

      {/* Bullet cards */}
      {bullets.length > 0 && (
        <div className="space-y-6">
          {bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="bg-surface-container-low rounded-pebble p-6 border border-outline"
              data-testid={`bullet-card-${idx}`}
            >
              {/* Original */}
              <div className="mb-4">
                <span className="text-label-small text-on-surface-variant uppercase tracking-wider font-mono">
                  Original
                </span>
                <p className="text-body-large text-on-surface-variant line-through opacity-60 mt-1">
                  {bullet.original}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight className="w-5 h-5 text-primary" />
                <span className="text-label-medium text-primary font-bold uppercase">
                  Enhanced
                </span>
              </div>

              {/* Improved */}
              <div className="mb-4">
                <p className="text-body-large font-bold text-on-surface">
                  {bullet.improved}
                </p>
              </div>

              {/* Rationale */}
              {bullet.rationale && (
                <div className="bg-tertiary-container/20 rounded-pebble p-4 border-l-4 border-tertiary mb-4">
                  <span className="text-label-small text-on-tertiary-container uppercase tracking-wider font-bold">
                    💡 Why This Works:
                  </span>
                  <p className="text-body-medium text-on-tertiary-container mt-2">
                    {bullet.rationale}
                  </p>
                </div>
              )}

              {/* Metric type badge */}
              <span
                className={`inline-flex px-3 py-1 rounded-pebble text-label-small font-bold ${
                  METRIC_BADGE[bullet.metric_type] ??
                  'bg-surface-container text-on-surface'
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
