import { Pebble, StatusBadge, Stone } from '@/components/ui';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronRight,
  Flower2,
  Home,
  Leaf,
  MapPin,
  MoreHorizontal,
  Plus,
  Sprout,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';

// Assets
const leafFern =
  '/assets/kr-solidarity/specimen/kr-solidarity__specimen__triage-natural-history__v1.png';
const wallpaper =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__kr-solidarity--texture--melbourne-laneway--v1__v1.png';

interface Application {
  id: number;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  stage: string;
}

const STAGES = [
  { id: 'nursery', name: 'The Nursery', description: 'Freshly Applied', icon: Sprout },
  { id: 'sunlight', name: 'The Sunlight', description: 'Initial Screening', icon: Flower2 },
  {
    id: 'transplant',
    name: 'The Transplant',
    description: 'Active Interviews',
    icon: ChevronRight,
  },
  { id: 'harvest', name: 'The Harvest', description: 'Offer Received', icon: Leaf },
  { id: 'archive', name: 'The Archive', description: 'Closed / Finalized', icon: Home },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    appliedDate: '2 days ago',
    stage: 'transplant',
  },
  {
    id: 2,
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Remote',
    appliedDate: '5 days ago',
    stage: 'sunlight',
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    appliedDate: '1 week ago',
    stage: 'nursery',
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'CodeFactory',
    location: 'Austin, TX',
    appliedDate: '3 days ago',
    stage: 'sunlight',
  },
];

/**
 * The Greenhouse (Application Tracker / Kanban Board)
 *
 * V3.1 Mixed Mode implementation.
 * A KeralaStreetprint greenhouse aesthetic where job applications are treated
 * as KrMotifs in various growth stages.
 */
export function ApplicationTracker() {
  const [applications] = useState<Application[]>(MOCK_APPLICATIONS);

  return (
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden pb-12 w-full">
      {/* Dynamic Stagecraft: Greenhouse Glass & Vines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: '400px' }}
      />

      {/* Decorative Fern Overlay */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-10 select-none">
        <img
          src={leafFern}
          alt=""
          className="w-full h-full object-contain object-left-bottom grayscale brightness-200"
        />
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-[1600px] mx-auto">
        <PageHeader
          title="The Greenhouse"
          highlightedWord="Tracker"
          description="Cultivate your career opportunities through every stage of growth."
        />

        {/* The Kanban Trellis */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 snap-start"
            >
              <div className="mb-6 px-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bloom text-lg font-black text-paper-white uppercase tracking-tighter flex items-center gap-2">
                    <stage.icon className="w-4 h-4 text-ink-gold" />
                    {stage.name}
                  </h3>
                  <span className="font-annotation text-[9px] text-concrete-grey bg-concrete-grey/5 px-2 py-0.5 border border-concrete-grey/10">
                    {applications.filter((a) => a.stage === stage.id).length} UNITS
                  </span>
                </div>
                <p className="font-annotation text-[10px] text-concrete-grey uppercase tracking-[0.2em] opacity-60">
                  {stage.description}
                </p>
              </div>

              {/* Glass Column Shell */}
              <div className="space-y-4 min-h-[500px] rounded-lg border border-dashed border-concrete-grey/5 bg-bark-light/[0.02] p-2">
                {applications
                  .filter((app) => app.stage === stage.id)
                  .map((app) => (
                    <ApplicationLeaf
                      key={app.id}
                      application={app}
                    />
                  ))}

                {/* Seedling Dispatch (Add Button) */}
                <button className="w-full py-4 border border-dashed border-concrete-grey/10 rounded-sm flex items-center justify-center text-concrete-grey/30 hover:border-ink-gold/40 hover:text-ink-gold transition-all group">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ApplicationLeaf component
 * A single job application card styled as a KrMotif leaf.
 */
function ApplicationLeaf({ application }: { application: Application }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Stone
        elevation="floating"
        className="p-5 border-concrete-grey/10 bg-asphalt-black/40 backdrop-blur-sm group relative overflow-hidden"
      >
        {/* Stage Indicator Notch */}
        <div className="absolute top-0 left-0 w-1 h-full bg-ink-gold opacity-40 group-hover:opacity-100 transition-opacity" />

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <StatusBadge
              label="ACTIVE"
              variant="success"
              showDot
            />
            <button className="text-concrete-grey/40 hover:text-ink-gold">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h4 className="font-bloom text-base font-bold text-paper-white uppercase leading-none mb-1">
              {application.title}
            </h4>
            <p className="font-field-note italic text-xs text-concrete-grey">
              {application.company}
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-annotation text-concrete-grey/60 uppercase tracking-widest">
              <MapPin className="w-3 h-3" /> {application.location}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-annotation text-concrete-grey/40 uppercase tracking-widest">
              <Calendar className="w-3 h-3" /> {application.appliedDate}
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center border-t border-concrete-grey/5">
            <span className="font-mono text-[8px] text-concrete-grey/30 uppercase tracking-[0.2em]">
              KrMotif_ID: {application.id.toString().padStart(3, '0')}
            </span>
            <Pebble
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] uppercase font-bold tracking-tighter hover:text-ink-gold"
            >
              DETAILS
            </Pebble>
          </div>
        </div>
      </Stone>
    </motion.div>
  );
}
