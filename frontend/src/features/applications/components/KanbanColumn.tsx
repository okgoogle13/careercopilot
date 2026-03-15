import { Placard, StatusBadge, Strike } from '@/components/ui';
import { Calendar, MapPin } from 'lucide-react';
import type { TrackerApplication, TrackerStage } from '../trackerTypes';

export interface KanbanColumnProps {
  stage: TrackerStage;
  label: string;
  count: number;
  applications: TrackerApplication[];
  onDrop: (applicationId: string, targetStage: TrackerStage) => void;
  onCardClick: (applicationId: string) => void;
  variant?: 'default' | 'archived';
}

export const KanbanColumn = ({
  stage,
  label,
  count,
  applications,
  onDrop,
  onCardClick,
  variant = 'default',
}: KanbanColumnProps): React.ReactElement => {
  const isArchived = variant === 'archived';

  return (
    <div
      data-testid={`tracker-column-${stage}`}
      className="flex-shrink-0 w-80 snap-start"
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        const applicationId = event.dataTransfer.getData('text/plain');
        if (applicationId) {
          onDrop(applicationId, stage);
        }
      }}
    >
      <div className="mb-6 px-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-lg font-black text-paper-white uppercase tracking-tighter">
            {label}
          </h3>
          <span className="font-mono text-[9px] text-concrete-grey bg-concrete-grey/5 px-2 py-0.5 border border-concrete-grey/10">
            {count} UNITS
          </span>
        </div>
        <p className="font-mono text-[10px] text-concrete-grey uppercase tracking-[0.2em] opacity-60">
          {isArchived ? 'Hidden from active flow' : 'Live route-owned board'}
        </p>
      </div>

      <div className="space-y-4 min-h-[420px] rounded-placard border border-dashed border-concrete-grey/5 bg-bark-light/[0.02] p-2">
        {applications.map((application) => (
          <Placard
            key={application.id}
            data-testid={`tracker-card-${application.id}`}
            elevation="flat"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', application.id);
            }}
            className="cursor-grab border-[var(--sys-color-concreteGrey-steps-1)] bg-[var(--sys-color-charcoalBackground-steps-2)]/40 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <StatusBadge
                  label={application.status.toUpperCase()}
                  variant={isArchived ? 'neutral' : 'success'}
                  showDot
                />
                <span className="font-mono text-[9px] text-concrete-grey/60 uppercase tracking-[0.18em]">
                  {application.id.slice(0, 6)}
                </span>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-paper-white uppercase leading-none mb-1">
                  {application.jobTitle}
                </h4>
                <p className="font-primary italic text-xs text-concrete-grey">
                  {application.companyName}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-concrete-grey/60 uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  {application.locationLabel}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-concrete-grey/40 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {application.appliedLabel}
                </div>
              </div>

              <Strike
                variant="ghost"
                size="sm"
                className="justify-start px-0 text-[10px] uppercase tracking-[0.18em] hover:text-[var(--sys-color-inkGold-base)]"
                onClick={() => onCardClick(application.id)}
              >
                DETAILS
              </Strike>
            </div>
          </Placard>
        ))}

        {applications.length === 0 && (
          <div className="h-full min-h-40 border border-dashed border-concrete-grey/10 rounded-placard flex items-center justify-center text-center px-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey/60">
              No applications in {label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
