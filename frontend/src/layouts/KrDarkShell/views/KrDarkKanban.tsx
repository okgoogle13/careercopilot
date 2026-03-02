import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { useKanban, ApplicationStatus } from '@/hooks/useKanban';
import { 
  KanbanBoard, 
  UnifiedColumn, 
  SolidarityCard, 
  ManifestoSlab,
  ActionButton
} from '../../../components/kerala-rage';

/**
 * KrDarkKanban (Hi-Fi)
 * 
 * High-fidelity mission tracking.
 * Features tactical assembly grids, dense mission cards with monospaced metadata, and status pulses.
 */
export const KrDarkKanban: React.FC = () => {
    const shouldReduceMotion = useReducedMotion() ?? false;
    const { applications, columns } = useKanban();

    const getColumnApplications = (status: ApplicationStatus) =>
        applications.filter(app => app.status === status);

    return (
        <div className="relative z-20 w-full h-[85vh] flex flex-col p-8 md:p-12 overflow-hidden">
            <header className="mb-14 flex justify-between items-end">
                <ManifestoSlab 
                  title="Mission Tracking" 
                  subtitle="Active Role Resurrections // Tactical Overview" 
                  className="w-full"
                />
                <div className="flex gap-4 pb-4">
                   <ActionButton variant="secondary" label="ARCHIVE_FILTER" size="sm" className="px-6 py-2 text-[9px]" />
                </div>
            </header>

            <KanbanBoard className="flex-1 gap-10">
                {columns.map((col, idx) => {
                    const colApps = getColumnApplications(col);

                    return (
                        <UnifiedColumn 
                          key={col} 
                          title={col} 
                          className="group/col border-r border-surface-KrDark-concrete-grey-high/20 pr-4 last:border-0"
                        >
                            <div className="space-y-6">
                              {colApps.map((app, appIdx) => (
                                  <motion.div
                                    key={app.id}
                                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (idx * 0.1) + (appIdx * 0.05) }}
                                  >
                                    <SolidarityCard
                                        className="p-8 group/card cursor-pointer border-surface-KrDark-concrete-grey-high/20 hover:border-ink-gold/20 transition-all duration-500 relative overflow-hidden"
                                        onClick={() => console.log('Opening mission:', app.id)}
                                    >
                                        <div className="flex flex-col gap-5 relative z-10">
                                            <div className="space-y-1">
                                              <span className="font-mono text-[8px] text-paper-white/20 uppercase tracking-widest">ID: {app.id.slice(0, 8)}</span>
                                              <h4 className="font-proclamation text-2xl uppercase text-paper-white group-hover/card:text-ink-gold transition-colors duration-500 leading-tight">
                                                {app.role}
                                              </h4>
                                            </div>

                                            <p className="font-body text-sm text-paper-white/40 italic">
                                              {app.company}
                                            </p>

                                            <div className="flex items-center gap-6 pt-4 border-t border-surface-KrDark-concrete-grey-high/20 text-[10px] text-paper-white/30 font-mono tracking-tighter">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-solidarity-red/40" />
                                                    {app.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-ink-gold/40" />
                                                    {app.updatedAt}
                                                </div>
                                            </div>

                                            {app.status === 'Offer' && (
                                                <div className="absolute top-0 right-0">
                                                   <div className="w-2 h-2 rounded-full bg-ink-gold animate-pulse shadow-ink-glow" />
                                                </div>
                                            )}
                                        </div>

                                        {/* TODO[asset]: Assembly Grid Motif substrate overlay (Z-1) */}
                                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-surface-KrDark-concrete-grey-high/5 blur-3xl rounded-full -mr-12 -mb-12" />
                                    </SolidarityCard>
                                  </motion.div>
                              ))}

                              {colApps.length === 0 && (
                                  <motion.div 
                                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 0.15, y: 0 }}
                                    className="h-64 border border-dashed border-surface-KrDark-concrete-grey-high/25 rounded-stone flex flex-col items-center justify-center text-center p-8"
                                  >
                                      <span className="font-proclamation text-3xl text-paper-white/20 -rotate-3 mb-4 uppercase">
                                        Silent Station...
                                      </span>
                                      <span className="text-[10px] font-annotation uppercase tracking-widest text-paper-white/40">
                                        Waiting for mission data
                                      </span>
                                  </motion.div>
                              )}
                            </div>
                        </UnifiedColumn>
                    );
                })}
            </KanbanBoard>

            <div className="mt-8 flex justify-between items-center opacity-20 border-t border-surface-KrDark-concrete-grey-high/20 pt-6">
               <span className="font-mono text-[9px] uppercase tracking-widest">Archive Integrity: Verified</span>
               <div className="flex gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest">Station: Kerala_Rage_v4</span>
               </div>
            </div>
        </div>
    );
};
