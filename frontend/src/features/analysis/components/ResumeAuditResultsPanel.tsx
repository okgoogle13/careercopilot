import React from 'react';
import { AlertCircle, CheckCircle2, Info, Lightbulb, TrendingUp } from 'lucide-react';

interface Violation {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
}

interface AuditResultData {
  overallScore: number;
  scanSimulation: string;
  violations: Violation[];
  recommendations: string[];
}

export interface ResumeAuditResultsPanelProps {
  data: AuditResultData;
  /** Allow user to dismiss/close results */
  onDismiss?: () => void;
}

export const ResumeAuditResultsPanel: React.FC<ResumeAuditResultsPanelProps> = ({
  data,
  onDismiss,
}) => {
  const scorePercentage = Math.round(data.overallScore);
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'var(--sys-color-kr-activistSmokeGreen-base)';
    if (score >= 70) return 'var(--sys-color-solidarityRed-base)';
    return 'var(--sys-color-kr-charcoalRed-base)';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <Info className="w-5 h-5" />;
      case 'info':
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'var(--sys-color-kr-charcoalRed-base)';
      case 'warning':
        return 'var(--sys-color-solidarityRed-base)';
      case 'info':
      default:
        return 'var(--sys-color-kr-activistSmokeGreen-base)';
    }
  };

  const errorCount = data.violations.filter((v) => v.severity === 'error').length;
  const warningCount = data.violations.filter((v) => v.severity === 'warning').length;

  return (
    <div
      className="rounded-placardTorn01 border border-outline-variant shadow-elevation-2 overflow-hidden"
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-base)',
        borderColor: 'var(--sys-color-outline-variant)',
        borderRadius: 'var(--shape-placardTorn01)',
      }}
    >
      {/* Header with Overall Score */}
      <div
        className="p-6 border-b"
        style={{
          backgroundColor: 'var(--sys-color-surface-container)',
          borderColor: 'var(--sys-color-outline-variant)',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3
              className="text-title-large font-bold mb-2"
              style={{ color: 'var(--sys-color-on-surface)' }}
            >
              Resume Audit Results
            </h3>
            <p
              className="text-body-small"
              style={{ color: 'var(--sys-color-on-surface-variant)' }}
            >
              RKL Knowledge Library Evaluation — Comprehensive Profile Analysis
            </p>
          </div>

          {/* Score Gauge */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-24 h-24 rounded-march flex items-center justify-center font-bold text-display-medium border-4"
              style={{
                backgroundColor: 'var(--sys-color-surface-container-low)',
                borderColor: getScoreColor(data.overallScore),
                color: getScoreColor(data.overallScore),
              }}
            >
              {scorePercentage}%
            </div>
            <span
              className="text-label-small font-bold"
              style={{ color: 'var(--sys-color-on-surface-variant)' }}
            >
              Overall Score
            </span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        className="grid grid-cols-3 gap-4 p-6 border-b"
        style={{
          backgroundColor: 'var(--sys-color-charcoalBackground-base)',
          borderColor: 'var(--sys-color-outline-variant)',
        }}
      >
        <div
          className="rounded-blockRiot01 p-4"
          style={{
            backgroundColor: 'var(--sys-color-surface-container-low)',
            borderRadius: 'var(--shape-blockRiot01)',
          }}
        >
          <div
            className="text-label-small font-bold uppercase tracking-wide mb-2"
            style={{ color: 'var(--sys-color-on-surface-variant)' }}
          >
            Errors
          </div>
          <div
            className="text-display-small font-bold"
            style={{ color: 'var(--sys-color-kr-charcoalRed-base)' }}
          >
            {errorCount}
          </div>
        </div>

        <div
          className="rounded-blockRiot01 p-4"
          style={{
            backgroundColor: 'var(--sys-color-surface-container-low)',
            borderRadius: 'var(--shape-blockRiot01)',
          }}
        >
          <div
            className="text-label-small font-bold uppercase tracking-wide mb-2"
            style={{ color: 'var(--sys-color-on-surface-variant)' }}
          >
            Warnings
          </div>
          <div
            className="text-display-small font-bold"
            style={{ color: 'var(--sys-color-solidarityRed-base)' }}
          >
            {warningCount}
          </div>
        </div>

        <div
          className="rounded-blockRiot01 p-4"
          style={{
            backgroundColor: 'var(--sys-color-surface-container-low)',
            borderRadius: 'var(--shape-blockRiot01)',
          }}
        >
          <div
            className="text-label-small font-bold uppercase tracking-wide mb-2"
            style={{ color: 'var(--sys-color-on-surface-variant)' }}
          >
            Total Issues
          </div>
          <div
            className="text-display-small font-bold"
            style={{ color: 'var(--sys-color-on-surface)' }}
          >
            {data.violations.length}
          </div>
        </div>
      </div>

      {/* Recruiter Scan Simulation */}
      {data.scanSimulation && (
        <div
          className="p-6 border-b"
          style={{
            backgroundColor: 'var(--sys-color-surface-container-low)',
            borderColor: 'var(--sys-color-outline-variant)',
          }}
        >
          <div className="flex items-start gap-3">
            <TrendingUp
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: 'var(--sys-color-kr-activistSmokeGreen-base)' }}
            />
            <div className="flex-1">
              <h4
                className="text-label-large font-bold mb-2"
                style={{ color: 'var(--sys-color-on-surface)' }}
              >
                10-Second Recruiter Scan
              </h4>
              <p
                className="text-body-medium leading-relaxed"
                style={{ color: 'var(--sys-color-on-surface-variant)' }}
              >
                {data.scanSimulation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Violations */}
      {data.violations.length > 0 && (
        <div
          className="p-6 border-b"
          style={{
            backgroundColor: 'var(--sys-color-charcoalBackground-base)',
            borderColor: 'var(--sys-color-outline-variant)',
          }}
        >
          <h4
            className="text-label-large font-bold mb-4"
            style={{ color: 'var(--sys-color-on-surface)' }}
          >
            Issues Detected
          </h4>

          <div className="space-y-3">
            {data.violations.map((violation, index) => (
              <div
                key={index}
                className="rounded-blockRiot01 p-4 flex gap-3"
                style={{
                  backgroundColor: 'var(--sys-color-surface-container-low)',
                  borderRadius: 'var(--shape-blockRiot01)',
                }}
              >
                <div style={{ color: getSeverityColor(violation.severity) }}>
                  {getSeverityIcon(violation.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div
                        className="text-label-medium font-bold"
                        style={{
                          color: getSeverityColor(violation.severity),
                        }}
                      >
                        {violation.ruleId}
                      </div>
                      <p
                        className="text-body-medium mt-1"
                        style={{ color: 'var(--sys-color-on-surface)' }}
                      >
                        {violation.message}
                      </p>
                    </div>
                  </div>
                  {violation.location && (
                    <p
                      className="text-body-small"
                      style={{ color: 'var(--sys-color-on-surface-variant)' }}
                    >
                      Location: {violation.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div
          className="p-6"
          style={{
            backgroundColor: 'var(--sys-color-charcoalBackground-base)',
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: 'var(--sys-color-solidarityRed-base)' }}
            />
            <h4
              className="text-label-large font-bold"
              style={{ color: 'var(--sys-color-on-surface)' }}
            >
              Recommendations
            </h4>
          </div>

          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li
                key={index}
                className="text-body-medium flex gap-3"
                style={{ color: 'var(--sys-color-on-surface-variant)' }}
              >
                <span style={{ color: 'var(--sys-color-kr-activistSmokeGreen-base)' }}>•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Actions */}
      <div
        className="p-6 flex gap-3 border-t"
        style={{
          backgroundColor: 'var(--sys-color-surface-container-low)',
          borderColor: 'var(--sys-color-outline-variant)',
        }}
      >
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-1 px-4 py-2 rounded-blockRiot01 font-bold text-label-medium transition-all duration-short"
            style={{
              backgroundColor: 'var(--sys-color-surface-container)',
              color: 'var(--sys-color-on-surface)',
              borderRadius: 'var(--shape-blockRiot01)',
            }}
          >
            Close
          </button>
        )}
        <a
          href="#"
          className="flex-1 px-4 py-2 rounded-blockRiot03 font-bold text-label-medium transition-all duration-short text-center"
          style={{
            backgroundColor: 'var(--sys-color-solidarityRed-base)',
            color: 'var(--sys-color-on-primary-container)',
            borderRadius: 'var(--shape-blockRiot03)',
          }}
        >
          Optimize Resume
        </a>
      </div>
    </div>
  );
};
