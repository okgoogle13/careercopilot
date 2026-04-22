interface ApplicationCardProps {
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  currentStep: number;
  steps: string[];
  onUpdateStatus?: () => void;
  className?: string;
}

import { StatusBadge, type StatusBadgeVariant } from '../ui/StatusBadge';

/**
 * ApplicationCard - KeralaRage KrSolidarity V3.1 Job Application Tracker Card
 *
 * Displays job application information with a multi-step progress indicator.
 *
 * **KeralaRage KrSolidarity V3.1 Usage:**
 * - Shape: `rounded-march` → [DEPRECATED_STYLE] asymmetric corners ✅
 * - Elevation: `shadow-standard` → `shadow-maximum` on hover
 * - Typography: `text-bloom-KrDark` (SOFT=100) for titles
 * - Annotations: `text-curator-annotation` for curator notes
 */
export function ApplicationCard({
  title,
  company,
  location,
  appliedDate,
  currentStep,
  steps,
  onUpdateStatus,
  className = '',
}: ApplicationCardProps) {
  return (
    <div
      className={`bg-surface-container rounded-march p-space-xl border border-[var(--kr-color-concrete-grey-steps-0)] shadow-standard hover:shadow-maximum transition-all duration-300 ease-viscous-breeze ${className}`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <h3 className="text-bloom-KrDark text-xl mb-1">{title}</h3>
          <p className="text-on-surface-variant font-primary italic text-lg">{company}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-curator-annotation text-sm">→ {location}</span>
            <span className="text-on-surface-variant/50 text-[10px] font-mono uppercase tracking-widest pl-2">
              Applied {appliedDate}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <StatusBadge
            label={steps[currentStep]}
            variant={getStatusVariant(steps[currentStep])}
            showDot
          />
          {onUpdateStatus && (
            <button
              onClick={onUpdateStatus}
              className="bg-surface-container-high px-6 py-2 rounded-march text-on-surface hover:bg-surface-bright transition-all font-primary text-sm uppercase tracking-wide"
            >
              Update
            </button>
          )}
        </div>
      </div>

      {/* Stepper Section */}
      <div className="flex gap-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`
                flex-1 px-4 py-3 rounded-march text-center transition-all duration-short-2 ease-spring
                ${
                  isCurrent
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : isCompleted
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-high text-on-surface-variant'
                }
              `}
            >
              <p className="text-label-medium">{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStatusVariant(status: string): StatusBadgeVariant {
  const norm = status.toLowerCase();
  if (norm.includes('offer') || norm.includes('accepted')) return 'success';
  if (norm.includes('interview') || norm.includes('screening')) return 'info';
  if (norm.includes('applied')) return 'warning';
  return 'neutral';
}
