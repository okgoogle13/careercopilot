import hangingPlant from '../../assets/images/hanging-plant.jpg';
import { PageHeader } from '../../components/shared/PageHeader';
import { ApplicationCard } from '../../components/shared/ApplicationCard';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Application {
  id: number;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  currentStep: number;
  steps: string[];
}

// ============================================================================
// MOCK DATA - Replace with API calls
// ============================================================================

const APPLICATIONS: Application[] = [
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

// ============================================================================
// COMPONENT
// ============================================================================

export function ApplicationTracker() {
  const handleUpdateStatus = (applicationId: number) => {
    // TODO: Replace with actual API call
    console.log('Update status for application:', applicationId);
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl relative animate-in fade-in zoom-in-95 duration-500 ease-spring">
      {/* Hanging Plant Decoration - Top Right Corner */}
      <div className="absolute top-[-20px] right-0 pointer-events-none w-[320px] max-h-[800px] z-[5] opacity-60">
        <img
          src={hangingPlant}
          alt=""
          className="w-full h-auto mix-blend-screen"
          style={{
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)',
            maskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <PageHeader
          title="Application Tracker"
          highlightedWord="Tracker"
          description="Track your job applications through every stage"
        />

        {/* Applications List */}
        <div className="space-y-6">
          {APPLICATIONS.map((app) => (
            <ApplicationCard
              key={app.id}
              title={app.title}
              company={app.company}
              location={app.location}
              appliedDate={app.appliedDate}
              currentStep={app.currentStep}
              steps={app.steps}
              onUpdateStatus={() => handleUpdateStatus(app.id)}
            />
          ))}
        </div>

        {/* Add New Application Button */}
        <button className="mt-8 w-full bg-surface-container-low border-2 border-dashed border-outline-variant rounded-pebble py-8 text-on-surface hover:border-primary/50 hover:bg-surface-container transition-all duration-medium-1 ease-spring font-medium text-title-large uppercase tracking-wide">
          + Add New Application
        </button>
      </div>
    </div>
  );
}
