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

import { StatusBadge, type StatusBadgeVariant } from '@/components/ui/StatusBadge/StatusBadge';
import { KeralaRageButton } from '@/components/ui/KeralaRageButton';
import { motion } from 'framer-motion';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

/**
 * ApplicationCard - M3 Compliant Job Application Tracker Card
 *
 * Displays job application information with a multi-step progress indicator.
 * Built using Material Design 3 KeralaRage KrSolidarity design tokens.
 *
 * **M3 Design Token Usage:**
 * - Shape: `rounded-pebble` → `--sys-shape-pebble` (20px 20px 32px 32px) - [DEPRECATED_STYLE] asymmetric corners ✅
 * - Elevation: `shadow-elevation-1` → `shadow-elevation-2` on hover (M3 depth levels)
 * - Spacing: `p-space-xl` (32px) for card padding
 * - Motion: `duration-medium-1` (250ms) with `ease-spring` (expressive cubic-bezier)
 * - Colors: M3 semantic color roles (surface-container, primary-container, etc.)
 *
 * @param {ApplicationCardProps} props - Component properties
 * @returns {JSX.Element} Rendered application card
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
      className={`bg-surface-container rounded-pebble p-space-xl border border-[var(--kr-color-concrete-grey-steps-0)] shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-medium-1 ease-spring ${className}`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-12">
        <div className="flex-1">
          <h3
            className="text-on-surface mb-1 text-headline-large"
            style={{
              fontWeight: 'var(--sys-type-weight-display)',
              fontVariationSettings: 'var(--sys-type-axes-hero)',
            }}
          >
            {title}
          </h3>
          <p className="text-on-surface-variant text-title-large italic">{company}</p>
          <p className="text-on-surface-variant mt-2 uppercase tracking-wide text-label-small font-mono">
            {location} • Applied {appliedDate}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <StatusBadge
            label={steps[currentStep]}
            variant={getStatusVariant(steps[currentStep])}
            showDot
          />
          {onUpdateStatus && (
            <KeralaRageButton
              onClick={onUpdateStatus}
              variant="secondary"
              size="md"
            >
              Update Status
            </KeralaRageButton>
          )}
        </div>
      </div>

      {/* Stepper Section - M3 Expressive Pebble Shape Tabs */}
      <div className="flex gap-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <motion.div
              key={idx}
              className={`
                flex-1 px-4 py-3 text-center
                ${
                  isCurrent
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : isCompleted
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-high text-on-surface-variant'
                }
              `}
              style={{ clipPath: 'var(--md-ref-shape-pebble)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={KrDarkSpring}
            >
              <p className="text-label-medium">{step}</p>
            </motion.div>
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
