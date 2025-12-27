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
  className = "",
}: ApplicationCardProps) {
  return (
    <div className={`bg-[#25232A] rounded-[28px] p-8 ${className}`}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-12">
        <div className="flex-1">
          <h3 className="text-[#E6E1E5] mb-1 text-3xl font-bold">{title}</h3>
          <p className="text-[#CAC4D0] text-xl italic">{company}</p>
          <p className="text-[#CAC4D0] mt-2 uppercase tracking-[0.04em] text-[0.7rem] font-mono">
            {location} • Applied {appliedDate}
          </p>
        </div>
        {onUpdateStatus && (
          <button
            onClick={onUpdateStatus}
            className="bg-[#36343B] px-6 py-2 rounded-full text-[#FFFFFF] hover:bg-[#413F47] transition-all"
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
                flex-1 px-4 py-3 rounded-full text-center transition-all
                ${
                  isCurrent
                    ? "bg-[#D0BCFF] text-[#381E72]"
                    : isCompleted
                      ? "bg-[#A8C5A3] text-[#141218]"
                      : "bg-[#2B2930] text-[#CAC4D0]"
                }
              `}
            >
              <p className="text-sm font-medium">{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
