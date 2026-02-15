import { Pebble } from '@/components/ui/Pebble';
import { Stone } from '@/components/ui/Stone';
import { Check, Clock, Edit2, Plus } from 'lucide-react';

export function ApplicationTracker() {
  const applications = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      appliedDate: '2 days ago',
      currentStep: 3,
      steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'Remote',
      appliedDate: '5 days ago',
      currentStep: 2,
      steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      appliedDate: '1 week ago',
      currentStep: 1,
      steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'CodeFactory',
      location: 'Austin, TX',
      appliedDate: '3 days ago',
      currentStep: 2,
      steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto bg-[var(--sys-color-charcoalBackground-base)] min-h-screen">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-display-large font-bold text-[var(--sys-color-worker-ash-steps-6)] mb-2">
          Application{' '}
          <span className="font-serif italic font-light text-[var(--sys-color-kr-activistSmokeGreen-base)]">
            Tracker
          </span>
        </h1>
        <p className="text-body-large text-[var(--sys-color-worker-ash-steps-4)]">
          Track your job applications through every stage
        </p>
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-6">
        {applications.map((app) => (
          <Stone
            key={app.id}
            elevation="flat"
            className="group transition-all duration-300 hover:border-[var(--sys-color-kr-activistSmokeGreen-base)] hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div className="flex-1">
                  <h3 className="text-display-small font-bold text-[var(--sys-color-worker-ash-steps-6)] mb-1">
                    {app.title}
                  </h3>
                  <p className="text-title-medium font-serif italic text-[var(--sys-color-worker-ash-steps-4)] mb-2">
                    {app.company}
                  </p>
                  <div className="flex items-center gap-2 text-label-small uppercase tracking-wider text-[var(--sys-color-worker-ash-steps-2)]">
                    <span>{app.location}</span>
                    <span>•</span>
                    <span>Applied {app.appliedDate}</span>
                  </div>
                </div>
                <Pebble
                  variant="secondary"
                  size="sm"
                  iconLeft={<Edit2 size={16} />}
                >
                  Update Status
                </Pebble>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {app.steps.map((step, idx) => {
                  const isCompleted = idx < app.currentStep;
                  const isCurrent = idx === app.currentStep;

                  // Determine variants and styling based on state
                  let variant: 'neutral' | 'primary' | 'secondary' = 'neutral';
                  let className =
                    'text-[var(--sys-color-worker-ash-steps-2)] bg-[var(--sys-color-charcoalBackground-steps-3)] opacity-60';

                  if (isCurrent) {
                    variant = 'primary'; // KeralaRage primary (Leaf)
                    className = 'font-bold shadow-sm scale-105 border-[var(--sys-color-kr-activistSmokeGreen-base)]';
                  } else if (isCompleted) {
                    variant = 'secondary'; // KeralaRage secondary (Ink) for completed
                    className = 'opacity-100';
                  }

                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-2"
                    >
                      {/* Mobile/Compact Label for small screens could be added here if needed, but keeping it simple for now */}
                      <div className={`flex items-center gap-2 p-2 rounded-seed ${className}`}>
                        {isCompleted ? <Check size={14} /> : isCurrent ? <Clock size={14} /> : null}
                        <span className="text-label-small">{step}</span>
                      </div>
                      {/* Connector Line (Visual only, simple version) */}
                      {idx < app.steps.length - 1 && (
                        <div
                          className={`hidden md:block h-1 w-full rounded-full mt-1 ${
                            idx < app.currentStep
                              ? 'bg-[var(--sys-color-kr-activistSmokeGreen-steps-4)]'
                              : 'bg-[var(--sys-color-charcoalBackground-steps-4)]'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Stone>
        ))}
      </div>

      {/* Add New Application */}
      <button className="mt-8 w-full py-8 border-2 border-dashed border-[var(--sys-color-charcoalBackground-steps-4)] rounded-2xl text-[var(--sys-color-worker-ash-steps-4)] hover:border-[var(--sys-color-kr-activistSmokeGreen-base)] hover:text-[var(--sys-color-kr-activistSmokeGreen-base)] hover:bg-[var(--sys-color-kr-activistSmokeGreen-steps-4)]/5 transition-all flex flex-col items-center justify-center gap-2 group">
        <div className="p-3 bg-[var(--sys-color-charcoalBackground-steps-3)] rounded-full group-hover:bg-[var(--sys-color-kr-activistSmokeGreen-base)] group-hover:text-white transition-colors">
          <Plus size={24} />
        </div>
        <span className="text-title-medium font-medium">Add New Application</span>
      </button>
    </div>
  );
}
