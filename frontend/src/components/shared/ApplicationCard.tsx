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
    <div className={`bg-surface-container rounded-xl p-8 border border-outline-variant shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-medium-1 ease-spring ${className}`}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-12">
        <div className="flex-1">
          <h3 className="text-on-surface mb-1 text-headline-large font-bold">{title}</h3>
          <p className="text-on-surface-variant text-title-large italic">{company}</p>
          <p className="text-on-surface-variant mt-2 uppercase tracking-wide text-label-small font-mono">
            {location} • Applied {appliedDate}
          </p>
        </div>
        {onUpdateStatus && (
          <button
            onClick={onUpdateStatus}
            className="bg-surface-container-high px-6 py-2 rounded-full text-on-surface hover:bg-surface-bright transition-all"
          >
            Update Status
          </button>
        )}
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
                flex-1 px-4 py-3 rounded-full text-center transition-all duration-short-2 ease-spring
                ${isCurrent
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
