import { Strike, StatusBadge, Placard } from '@/components/ui';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronRight,
  Clock3,
  FileText,
  Home,
  CheckCircle2,
  MapPin,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import type { SolidarityManifest } from '../../design/hero/heroTypes';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { resolvePageHeroComposition } from '../../design/hero/pageHeroMap';
import { composeHero } from '../../lib/composeHero';
import { PageHeader } from '../../components/shared/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

// Assets
const atmosphericOverlay =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const wallpaper =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

interface Application {
  id: number;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  stage: string;
}

const STAGES = [
  { id: 'queued', name: 'Queued', description: 'Application lodged', icon: FileText },
  { id: 'screening', name: 'Screening', description: 'Initial review underway', icon: Clock3 },
  {
    id: 'interview',
    name: 'Interview',
    description: 'Interview sequence active',
    icon: ChevronRight,
  },
  { id: 'offer', name: 'Offer', description: 'Offer received', icon: CheckCircle2 },
  { id: 'closed', name: 'Closed', description: 'Finalized outcome', icon: Home },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    appliedDate: '2 days ago',
    stage: 'interview',
  },
  {
    id: 2,
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Remote',
    appliedDate: '5 days ago',
    stage: 'screening',
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    appliedDate: '1 week ago',
    stage: 'queued',
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'CodeFactory',
    location: 'Austin, TX',
    appliedDate: '3 days ago',
    stage: 'screening',
  },
];

/**
 * Application Tracker (Kanban Board)
 *
 * V3.1 Mixed Mode implementation.
 * Status-first workflow for tracking role progress from submission to outcome.
 */
export function ApplicationTracker() {
  const [applications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(
          manifest as SolidarityManifest,
          registry,
          resolvePageHeroComposition('applications-board')
        );

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation ?? result.motion,
            zIndexMap: result.zIndexMap,
          });
        }
      } catch (error) {
        console.error('Failed to load application tracker hero:', error);
      }
    }
    loadHero();
  }, []);

  return (
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden pb-12 w-full">
      {heroData && (
        <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }}
            animation={heroData.animation}
            zIndexMap={heroData.zIndexMap}
            className="h-full"
          />
        </div>
      )}

      {/* Dynamic stagecraft */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: '400px' }}
      />

      {/* Decorative Atmospheric Overlay */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-10 select-none">
        <img
          src={atmosphericOverlay}
          alt=""
          className="w-full h-full object-contain object-left-bottom grayscale brightness-200"
        />
      </div>

      <div className="relative z-10 p-6 md:p-12 max-w-[1600px] mx-auto">
        <PageHeader
          title="Application"
          highlightedWord="Tracker"
          description="Track every application stage from submission to final outcome."
        />

        {/* Kanban lanes */}
        {applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Track every role you apply to. Start by generating your first application pack."
            ctaLabel="Add your first application →"
            ctaHref="/apply/quick"
            className="border-concrete-grey/25 bg-asphalt-black/35"
          />
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className="flex-shrink-0 w-80 snap-start"
              >
                <div className="mb-6 px-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-lg font-black text-paper-white uppercase tracking-tighter flex items-center gap-2">
                      <stage.icon className="w-4 h-4 text-ink-gold" />
                      {stage.name}
                    </h3>
                    <span className="font-mono text-[9px] text-concrete-grey bg-concrete-grey/5 px-2 py-0.5 border border-concrete-grey/10">
                      {applications.filter((a) => a.stage === stage.id).length} UNITS
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-concrete-grey uppercase tracking-[0.2em] opacity-60">
                    {stage.description}
                  </p>
                </div>

                <div className="space-y-4 min-h-[500px] rounded-placard border border-dashed border-concrete-grey/5 bg-bark-light/[0.02] p-2">
                  {applications
                    .filter((app) => app.stage === stage.id)
                    .map((app) => (
                      <ApplicationLeaf
                        key={app.id}
                        application={app}
                      />
                    ))}

                  <button className="w-full py-4 border border-dashed border-[var(--sys-color-concreteGrey-steps-1)] rounded-megaphone flex items-center justify-center text-[var(--sys-color-concreteGrey-base)]/50 hover:border-[var(--sys-color-inkGold-base)]/40 hover:text-[var(--sys-color-inkGold-base)] transition-all group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Application card row.
 */
function ApplicationLeaf({ application }: { application: Application }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Placard
        elevation="floating"
        className="p-5 border-[var(--sys-color-concreteGrey-steps-1)] bg-[var(--sys-color-charcoalBackground-steps-2)]/40 backdrop-blur-sm group relative overflow-hidden"
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
            <h4 className="font-display text-base font-bold text-paper-white uppercase leading-none mb-1">
              {application.title}
            </h4>
            <p className="font-primary italic text-xs text-concrete-grey">{application.company}</p>
          </div>

          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-concrete-grey/60 uppercase tracking-widest">
              <MapPin className="w-3 h-3" /> {application.location}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-concrete-grey/40 uppercase tracking-widest">
              <Calendar className="w-3 h-3" /> {application.appliedDate}
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center border-t border-concrete-grey/5">
            <span className="font-mono text-[8px] text-[var(--sys-color-concreteGrey-base)]/50 uppercase tracking-[0.2em]">
              App ID: {application.id.toString().padStart(3, '0')}
            </span>
            <Strike
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] uppercase font-bold tracking-tighter hover:text-[var(--sys-color-inkGold-base)]"
            >
              DETAILS
            </Strike>
          </div>
        </div>
      </Placard>
    </motion.div>
  );
}
