import { applicationService } from '@/api/applicationService';
import { LayeredHero } from '@/components/kerala-rage/LayeredHero';
import { Strike } from '@/components/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { loadHeroRegistry } from '@/design/hero/heroRegistry';
import { resolvePageHeroComposition } from '@/design/hero/pageHeroMap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ApplicationDetailPanel } from '@/features/applications/components/ApplicationDetailPanel';
import { KanbanColumn } from '@/features/applications/components/KanbanColumn';
import { composeHero } from '@/lib/composeHero';
import type { SolidarityManifest } from '@/design/hero/heroTypes';
import {
  TRACKER_COLUMNS,
  mapTrackerStageToStatus,
  toTrackerApplication,
  type TrackerStage,
} from '@/features/applications/trackerTypes';

const atmosphericOverlay =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const wallpaper =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

export function ApplicationTracker() {
  const queryClient = useQueryClient();
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    safeZones?: any;
    renderHints?: any;
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
            safeZones: result.safeZones,
            renderHints: result.renderHints,
          });
        }
      } catch (error) {
        console.error('Failed to load tracker hero:', error);
      }
    }

    void loadHero();
  }, []);

  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tracker-applications'],
    queryFn: async () => applicationService.listApplications(),
    retry: false,
  });

  const trackerApplications = useMemo(() => applications.map(toTrackerApplication), [applications]);

  const moveApplication = useMutation({
    mutationFn: async ({
      applicationId,
      targetStage,
    }: {
      applicationId: string;
      targetStage: TrackerStage;
    }) =>
      applicationService.updateApplication(applicationId, {
        status: mapTrackerStageToStatus(targetStage),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tracker-applications'] });
      if (selectedApplicationId) {
        await queryClient.invalidateQueries({ queryKey: ['application', selectedApplicationId] });
      }
    },
  });

  return (
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden pb-12 w-full">
      {heroData && (
        <div className="absolute inset-0 pointer-events-none opacity-16 z-0">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }}
            animation={heroData.animation}
            safeZones={heroData.safeZones}
            renderHints={heroData.renderHints}
            className="h-full"
          />
        </div>
      )}

      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: '400px' }}
      />

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

        {error && (
          <div className="mb-8 rounded-placard border border-[var(--sys-color-protestMetalBlue-base)]/30 bg-[var(--sys-color-charcoalBackground-steps-2)]/70 p-4">
            <p className="font-mono text-sm text-[var(--sys-color-protestMetalBlue-base)]">
              Failed to load application data. Check backend auth or API availability.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-placard border border-concrete-grey/10 p-8">
            <p className="font-mono text-sm text-concrete-grey uppercase tracking-[0.18em]">
              Loading tracker board…
            </p>
          </div>
        ) : trackerApplications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Track every role you apply to. Start by generating your first application pack."
            ctaLabel="Add your first application →"
            ctaHref="/apply"
            className="border-concrete-grey/25 bg-asphalt-black/35"
          />
        ) : (
          <>
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
              {TRACKER_COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.id}
                  stage={column.id}
                  label={column.name}
                  count={
                    trackerApplications.filter(
                      (application) => application.trackerStage === column.id
                    ).length
                  }
                  applications={trackerApplications.filter(
                    (application) => application.trackerStage === column.id
                  )}
                  variant={column.id === 'archived' ? 'archived' : 'default'}
                  onCardClick={setSelectedApplicationId}
                  onDrop={(applicationId, targetStage) => {
                    moveApplication.mutate({ applicationId, targetStage });
                  }}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Strike
                iconLeft={<Plus className="w-4 h-4" />}
                onClick={() => {
                  window.location.assign('/apply');
                }}
              >
                Add Application
              </Strike>
            </div>
          </>
        )}
      </div>

      {selectedApplicationId && (
        <ApplicationDetailPanel
          applicationId={selectedApplicationId}
          isOpen={Boolean(selectedApplicationId)}
          onClose={() => setSelectedApplicationId(null)}
          onStatusChange={async () => {
            await queryClient.invalidateQueries({ queryKey: ['tracker-applications'] });
          }}
          onArchive={async () => {
            await queryClient.invalidateQueries({ queryKey: ['tracker-applications'] });
          }}
        />
      )}
    </div>
  );
}
