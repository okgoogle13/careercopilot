import { Placard, Strike } from '@/components/ui';
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
        <h1 className="text-display-large font-bold text-[var(--sys-color-worker-ash-base)] mb-2">
          Application{' '}
          <span className="font-serif italic font-light text-[var(--sys-color-inkGold-base)]">
            Tracker
          </span>
        </h1>
        <p className="text-body-large text-[var(--sys-color-concreteGrey-base)]">
          Manage your struggle. Track every tactical advancement.
        </p>
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-6">
        {applications.map((app) => (
          <Placard
            key={app.id}
            elevation="raised"
            className="group transition-all duration-300 hover:border-[var(--sys-color-inkGold-base)]"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div className="flex-1">
                  <h3 className="text-display-small font-bold text-[var(--sys-color-worker-ash-base)] mb-1">
                    {app.title}
                  </h3>
                  <p className="text-title-medium font-serif italic text-[var(--sys-color-concreteGrey-base)] mb-2">
                    {app.company}
                  </p>
                  <div className="flex items-center gap-2 text-label-small uppercase tracking-wider text-[var(--sys-color-concreteGrey-steps-4)]">
                    <span>{app.location}</span>
                    <span>•</span>
                    <span>Applied {app.appliedDate}</span>
                  </div>
                </div>
                <Strike
                  variant="secondary"
                  size="sm"
                  iconLeft={<Edit2 size={16} />}
                >
                  Update Status
                </Strike>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {app.steps.map((step, idx) => {
                  const isCompleted = idx < app.currentStep;
                  const isCurrent = idx === app.currentStep;

                  // Determine variants and styling based on state
                  let statusStyle =
                    'text-[var(--sys-color-concreteGrey-steps-4)] bg-[var(--sys-color-charcoalBackground-steps-1)] opacity-60';
                  let barStyle = 'bg-[var(--sys-color-charcoalBackground-steps-2)]';

                  if (isCurrent) {
                    statusStyle =
                      'font-bold scale-105 border-[var(--sys-color-inkGold-base)] text-[var(--sys-color-inkGold-base)] bg-[var(--sys-color-charcoalBackground-steps-2)] outline outline-1 outline-[var(--sys-color-inkGold-base)]';
                    barStyle =
                      'bg-[var(--sys-color-inkGold-base)] shadow-[0_0_10px_var(--sys-color-inkGold-steps-0)]';
                  } else if (isCompleted) {
                    statusStyle =
                      'opacity-100 text-[var(--sys-color-activistSmokeGreen-base)] bg-[var(--sys-color-charcoalBackground-steps-1)]';
                    barStyle = 'bg-[var(--sys-color-activistSmokeGreen-base)]';
                  }

                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-2"
                    >
                      <div
                        className={`flex items-center gap-2 p-2 rounded-seed transition-all duration-300 ${statusStyle}`}
                      >
                        {isCompleted ? <Check size={14} /> : isCurrent ? <Clock size={14} /> : null}
                        <span className="text-label-small uppercase tracking-tight">{step}</span>
                      </div>
                      {/* Connector Line */}
                      {idx < app.steps.length - 1 && (
                        <div
                          className={`hidden md:block h-1.5 w-full rounded-march mt-1 transition-all duration-500 ${barStyle}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Placard>
        ))}
      </div>

      {/* Add New Application */}
      <button className="mt-8 w-full py-12 border-2 border-dashed border-[var(--sys-color-concreteGrey-steps-2)] rounded-placard text-[var(--sys-color-concreteGrey-base)] hover:border-[var(--sys-color-inkGold-base)] hover:text-[var(--sys-color-inkGold-base)] hover:bg-[var(--sys-color-inkGold-steps-0)]/5 transition-all flex flex-col items-center justify-center gap-4 group">
        <div className="p-4 bg-[var(--sys-color-charcoalBackground-steps-1)] rounded-march group-hover:bg-[var(--sys-color-inkGold-base)] group-hover:text-[var(--sys-color-charcoalBackground-base)] transition-all duration-300">
          <Plus size={32} />
        </div>
        <span className="text-display-tiny font-bold uppercase tracking-widest">
          Strike New Ground
        </span>
      </button>
    </div>
  );
}
