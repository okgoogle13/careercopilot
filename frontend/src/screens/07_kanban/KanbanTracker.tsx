import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import clsx, { type ClassValue } from 'clsx';
import { useKanban, ApplicationStatus } from '../../hooks/useKanban';
import {
  KanbanBoard,
  UnifiedColumn,
  SolidarityCard,
  ManifestoSlab,
  ActionButton,
} from '../../components/kerala-rage';

export interface KanbanTrackerProps {
  className?: ClassValue;
}

/**
 * KanbanTracker (High-Fidelity Screen)
 *
 * Paired high-fidelity reference for the canonical /applications surface.
 * Fulfils the wireframe design truth for screen 07_kanban.
 */
export const KanbanTracker = memo(function KanbanTracker({ className }: KanbanTrackerProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { applications, columns, isLoading } = useKanban();

  const getColumnApplications = (status: ApplicationStatus) =>
    applications.filter((app) => app.status === status);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface">
        <span className="font-mono text-xs uppercase tracking-widest animate-pulse">
          Syncing Mission Data...
        </span>
      </div>
    );
  }

  return (
    <motion.section
      role="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'relative min-h-screen w-full flex flex-col p-8 md:p-12 overflow-hidden bg-surface',
        className
      )}
      data-testid="kanban-tracker-screen"
    >
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <ManifestoSlab
          title="Application Kanban"
          subtitle="Active Role Resurrections // Tactical State Transitions"
          className="max-w-3xl"
        />
        <div className="flex gap-4 pb-2">
          <ActionButton
            variant="secondary"
            label="ARCHIVE_INTEGRITY"
            size="sm"
            className="px-6 py-2 text-[9px]"
          />
          <ActionButton
            variant="primary"
            label="NEW_MISSION"
            size="sm"
            onClick={() => window.location.assign('/apply')}
            className="px-6 py-2 text-[9px]"
          />
        </div>
      </header>

      <KanbanBoard className="flex-1 gap-8 md:gap-12 overflow-x-auto pb-12">
        {columns.map((col, idx) => {
          const colApps = getColumnApplications(col);

          return (
            <UnifiedColumn
              key={col}
              title={col}
              className="group/col border-r border-[var(--kr-color-charcoal-background-steps-3)]/10 pr-6 last:border-0 min-w-[300px]"
            >
              <div className="space-y-6">
                {colApps.map((app, appIdx) => (
                  <motion.div
                    key={app.id}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + appIdx * 0.05 }}
                  >
                    <SolidarityCard
                      className="p-6 group/card cursor-pointer border-[var(--kr-color-charcoal-background-steps-3)]/20 hover:border-ink-gold/30 transition-all duration-500 relative overflow-hidden bg-[var(--kr-color-charcoal-background-steps-3)]/30"
                      onClick={() => console.log('Opening mission:', app.id)}
                    >
                      <div className="flex flex-col gap-4 relative z-10">
                        <div className="space-y-1">
                          <span className="font-mono text-[8px] text-paper-white/20 uppercase tracking-widest">
                            STATION_ID: {app.id.slice(0, 8)}
                          </span>
                          <h4 className="font-proclamation text-xl uppercase text-paper-white group-hover/card:text-ink-gold transition-colors duration-500 leading-tight">
                            {app.role}
                          </h4>
                        </div>

                        <p className="font-body text-xs text-paper-white/40 italic">
                          {app.company}
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--kr-color-charcoal-background-steps-3)]/10 text-[9px] text-paper-white/30 font-mono tracking-tighter">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <MapPin className="w-2.5 h-2.5 text-solidarity-red/40" />
                            {app.location}
                          </div>
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Clock className="w-2.5 h-2.5 text-ink-gold/40" />
                            {app.updatedAt}
                          </div>
                        </div>
                      </div>

                      {/* Asymmetric shape motifs per Zero-Flora archetypes */}
                      <div className="absolute bottom-0 right-0 w-16 h-16 bg-[var(--kr-color-charcoal-background-steps-3)]/5 blur-2xl rounded-march -mr-8 -mb-8" />
                    </SolidarityCard>
                  </motion.div>
                ))}

                {colApps.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    className="h-48 border border-dashed border-concrete-grey/25 rounded-megaphone flex flex-col items-center justify-center text-center p-6"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-concrete-grey">
                      Station Idle
                    </span>
                  </motion.div>
                )}
              </div>
            </UnifiedColumn>
          );
        })}
      </KanbanBoard>

      <footer className="mt-8 flex justify-between items-center opacity-30 border-t border-concrete-grey/10 pt-6">
        <span className="font-mono text-[8px] uppercase tracking-widest">
          Evidence Archive: v6.0.0
        </span>
        <div className="flex gap-4">
          <span className="font-mono text-[8px] uppercase tracking-widest">
            Station: Kerala_Rage_Consolidated
          </span>
        </div>
      </footer>
    </motion.section>
  );
});

export default KanbanTracker;
