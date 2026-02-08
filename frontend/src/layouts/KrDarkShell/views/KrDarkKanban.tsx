import React from 'react';
import { useKanban, ApplicationStatus } from '@/hooks/useKanban';
import { GlassLeafCard } from '@/features/KrDark/GlassLeafCard';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

export const KrDarkKanban: React.FC = () => {
    const { applications, columns } = useKanban();

    const getColumnApplications = (status: ApplicationStatus) =>
        applications.filter(app => app.status === status);

    return (
        <div className="relative z-20 w-full h-full overflow-x-auto p-8 no-scrollbar">
            <h2 className="font-bloom text-2xl text-paper-white mb-6 sticky left-0">Application Tracker</h2>
            <div className="flex gap-6 min-w-max pb-8 h-[calc(100%-4rem)]">
                {columns.map((col) => {
                    const colApps = getColumnApplications(col);

                    return (
                        <div key={col} className="w-80 flex flex-col gap-4">
                            {/* Column Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-white/10 sticky top-0 bg-surface-asphalt-black/50 backdrop-blur-sm z-10 px-2 rounded-t-lg">
                                <h3 className="font-field-note font-bold text-secondary-concrete-grey uppercase text-xs tracking-widest">{col}</h3>
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-secondary-flannel-dim">{colApps.length}</span>
                            </div>

                            {/* Column Content */}
                            <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar p-1">
                                {colApps.map((app) => (
                                    <motion.div
                                        key={app.id}
                                        layoutId={app.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        whileHover={{ y: -4 }}
                                    >
                                        <GlassLeafCard
                                            intensity="light"
                                            className="group cursor-pointer relative"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <h4 className="font-bloom text-lg text-paper-white group-hover:text-wattle-gold transition-colors">{app.role}</h4>
                                                <div className="text-sm font-body text-secondary-concrete-grey">{app.company}</div>

                                                <div className="flex items-center gap-3 mt-2 text-xs text-secondary-flannel-dim font-annotation">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {app.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {app.updatedAt}
                                                    </div>
                                                </div>

                                                {app.status === 'Offer' && (
                                                    <div className="absolute top-2 right-2">
                                                        <span className="flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wattle-gold opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-wattle-gold"></span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </GlassLeafCard>
                                    </motion.div>
                                ))}

                                {colApps.length === 0 && (
                                    <div className="h-32 border-2 border-dashed border-white/5 rounded-lg flex flex-col items-center justify-center text-center p-4 opacity-50">
                                        <span className="font-handwriting text-2xl text-secondary-flannel-dim rotate-[-5deg] mb-2">Empty...</span>
                                        <span className="text-xs font-annotation text-secondary-concrete-grey">No KrMotifs here yet</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
