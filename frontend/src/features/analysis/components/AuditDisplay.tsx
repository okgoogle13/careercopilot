/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from 'react';
import type { DocumentAudit } from '../../../types/career';

interface AuditDisplayProps {
  audit: DocumentAudit;
  title: string;
}

export const AuditDisplay: React.FC<AuditDisplayProps> = ({ audit, title }) => {
  const severityCounts = {
    error: audit.violations.filter((v) => v.severity === 'error').length,
    warning: audit.violations.filter((v) => v.severity === 'warning').length,
    info: audit.violations.filter((v) => v.severity === 'info').length,
  };

  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'color-mix(in srgb, var(--sys-color-charcoalBackground-base) 80%, transparent)',
        borderRadius: 'var(--sys-shape-blockRiot03)',
        borderColor: 'var(--sys-color-concreteGrey-steps-0)',
        borderWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',
      }}
    >
      <div
        className="p-4 flex justify-between items-center"
        style={{
          background: 'var(--sys-color-charcoalBackground-steps-1)',
          borderBottomColor: 'var(--sys-color-concreteGrey-steps-0)',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
        }}
      >
        <div>
          <h3 className="text-lg font-bold text-[var(--sys-color-paperWhite-base)]">
            {title} Audit
          </h3>
          <div className="flex gap-4 mt-1">
            <span className="text-xs font-bold text-[var(--sys-color-solidarityRed-base)]">
              {severityCounts.error} Errors
            </span>
            <span className="text-xs font-bold text-[var(--sys-color-stencilYellow-base)]">
              {severityCounts.warning} Warnings
            </span>
            <span className="text-xs font-bold text-[var(--sys-color-protestMetalBlue-base)]">
              {severityCounts.info} Suggestions
            </span>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${audit.overallScore >= 80 ? 'text-[var(--sys-color-kr-activistSmokeGreen-base)]' : audit.overallScore >= 60 ? 'text-[var(--sys-color-stencilYellow-base)]' : 'text-[var(--sys-color-solidarityRed-base)]'}`}
          >
            {audit.overallScore}/100
          </div>
          <div className="text-[10px] text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest">
            ATS Score
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scan Simulation */}
        <div
          className="p-4"
          style={{
            background: 'color-mix(in srgb, var(--sys-color-solidarityRed-base) 10%, transparent)',
            borderLeftColor: 'var(--sys-color-solidarityRed-base)',
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
            borderRadius: 'var(--sys-shape-blockRiot02)',
          }}
        >
          <h4 className="text-xs font-bold text-[var(--sys-color-inkGold-base)] uppercase tracking-widest mb-2">
            10-Second Recruiter Scan
          </h4>
          <p className="text-sm text-[var(--sys-color-worker-ash-base)] leading-relaxed italic">
            "{audit.scanSimulation}"
          </p>
        </div>

        {/* Violations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest">
            Rule Violations
          </h4>
          {audit.violations.length === 0 ? (
            <p className="text-sm text-[var(--sys-color-concreteGrey-base)] italic">
              No violations found. Great job!
            </p>
          ) : (
            audit.violations.map((v, i) => {
              const styles = {
                error: 'text-[var(--sys-color-solidarityRed-base)]',
                warning: 'text-[var(--sys-color-stencilYellow-base)]',
                info: 'text-[var(--sys-color-protestMetalBlue-base)]',
              }[v.severity];

              const inlineStyles = {
                error: {
                  borderColor:
                    'color-mix(in srgb, var(--sys-color-solidarityRed-base) 30%, transparent)',
                  background:
                    'color-mix(in srgb, var(--sys-color-solidarityRed-base) 10%, transparent)',
                },
                warning: {
                  borderColor:
                    'color-mix(in srgb, var(--sys-color-stencilYellow-base) 30%, transparent)',
                  background:
                    'color-mix(in srgb, var(--sys-color-stencilYellow-base) 10%, transparent)',
                },
                info: {
                  borderColor:
                    'color-mix(in srgb, var(--sys-color-protestMetalBlue-base) 30%, transparent)',
                  background:
                    'color-mix(in srgb, var(--sys-color-protestMetalBlue-base) 10%, transparent)',
                },
              }[v.severity];

              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${styles}`}
                  style={inlineStyles}
                >
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-[10px] font-mono opacity-70">{v.ruleId}</code>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {v.severity}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{v.message}</p>
                  {v.location && (
                    <p className="text-[10px] mt-1 opacity-60 italic">Location: {v.location}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[var(--sys-color-concreteGrey-base)] uppercase tracking-widest">
            Actionable Recommendations
          </h4>
          <ul className="space-y-2">
            {audit.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-[var(--sys-color-worker-ash-base)]"
              >
                <span className="text-[var(--sys-color-inkGold-base)] font-bold">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
