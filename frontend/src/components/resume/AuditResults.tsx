import React from 'react';
import { useResumeRulesStore } from '../../stores/useResumeRulesStore';

export const AuditResults: React.FC = () => {
  const { violations, overallScore, scanSimulation, clearViolations } = useResumeRulesStore();

  if (violations.length === 0 && !overallScore) {
    return null;
  }

  const severityCounts = {
    error: violations.filter(v => v.severity === 'error').length,
    warning: violations.filter(v => v.severity === 'warning').length,
    info: violations.filter(v => v.severity === 'info').length
  };

  return (
    <div className="tech-card p-lg bg-asphalt-black border border-concrete-grey-dark">
      {/* Score Header */}
      <div className="flex justify-between items-start mb-lg">
        <div>
          <h3 className="text-display-kr-dark mb-xs">Audit Results</h3>
          <div className="flex gap-md text-xs">
            <span className="text-waratah-red">
              {severityCounts.error} errors
            </span>
            <span className="text-wattle-gold">
              {severityCounts.warning} warnings
            </span>
            <span className="text-concrete-grey-light">
              {severityCounts.info} suggestions
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl text-wattle-gold font-bold mb-xs">
            {overallScore}/100
          </div>
          <button
            onClick={clearViolations}
            className="text-xs text-concrete-grey-light hover:text-concrete-grey-lightest underline"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Scan Simulation */}
      {scanSimulation && (
        <div className="mb-lg p-md bg-asphalt-black-light border-l-4 border-wattle-gold">
          <h4 className="text-body-bold text-wattle-gold mb-xs">
            10-Second Recruiter Scan
          </h4>
          <p className="text-body text-concrete-grey-lightest">
            {scanSimulation}
          </p>
        </div>
      )}

      {/* Violations List */}
      <div className="space-y-md">
        {violations.map((violation, index) => {
          const borderColor = {
            error: 'border-waratah-red',
            warning: 'border-wattle-gold',
            info: 'border-concrete-grey'
          }[violation.severity];

          const bgColor = {
            error: 'bg-waratah-red/10',
            warning: 'bg-wattle-gold/10',
            info: 'bg-concrete-grey/10'
          }[violation.severity];

          return (
            <div
              key={index}
              className={`border-l-4 ${borderColor} ${bgColor} pl-md py-sm`}
            >
              <div className="flex justify-between items-start mb-xs">
                <code className="text-mono text-xs text-wattle-gold">
                  {violation.ruleId}
                </code>
                <span className={`text-xs uppercase tracking-wider ${
                  violation.severity === 'error' ? 'text-waratah-red' :
                  violation.severity === 'warning' ? 'text-wattle-gold' :
                  'text-concrete-grey-light'
                }`}>
                  {violation.severity}
                </span>
              </div>
              
              <p className="text-body-medium text-concrete-grey-lightest mb-xs">
                {violation.message}
              </p>
              
              {violation.location && (
                <p className="text-xs text-concrete-grey-dark">
                  📍 {violation.location}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
