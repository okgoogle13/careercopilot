import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SolidarityCard, ActionButton, UnifiedColumn } from '../../../components/kerala-rage';

/**
 * KrDarkSearch (Hi-Fi)
 * 
 * Strategic opportunity discovery.
 * Features dense filter sidebar, tactical result cards, and atmospheric search pulses.
 */
export const KrDarkSearch: React.FC = () => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const results = [
    { title: 'Logistics Coordinator', company: 'Global Front', match: '98%', id: 'JOB_A' },
    { title: 'Security Architect', company: 'Sentry Core', match: '94%', id: 'JOB_B' },
    { title: 'Community Liaison', company: 'Collective Hub', match: '89%', id: 'JOB_C' },
    { title: 'Data Naturalist', company: 'Archive Prime', match: '85%', id: 'JOB_D' },
    { title: 'Tactical Analyst', company: 'Mission Control', match: '82%', id: 'JOB_E' },
  ];

  return (
    <div className="relative z-20 w-full h-[90vh] flex flex-col p-8 md:p-12 gap-10 overflow-hidden">
      {/* SECTION 1: Tactical Search Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group">
          {/* TODO[asset]: Search Pulse motif overlay (Z-1) */}
          <input 
            type="text" 
            placeholder="PROBE THE COLLECTIVE ARCHIVE..."
            className="w-full bg-asphalt-black/40 border border-white/5 rounded-pebble px-8 py-5 font-mono text-sm text-paper-white focus:outline-none focus:border-ink-gold/40 focus:ring-1 focus:ring-ink-gold/20 transition-all duration-500 shadow-viscous"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
            <span className="font-mono text-[10px] tracking-widest uppercase">CTRL_S</span>
          </div>
        </div>
        <ActionButton variant="primary" label="INITIATE PROBE" className="px-12 py-5 text-xs tracking-[0.2em] shrink-0" />
      </div>

      <div className="flex flex-1 gap-12 overflow-hidden">
        {/* SECTION 2: Filter Column */}
        <UnifiedColumn 
          title="TACTICAL_FILTERS" 
          className="w-72 shrink-0 h-full hidden lg:block border-r border-white/5 pr-8"
        >
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="font-annotation text-[9px] uppercase tracking-[0.4em] text-paper-white/30">Sector Density</label>
              <div className="flex flex-wrap gap-2">
                {['Logistics', 'Defense', 'Extraction', 'Community'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-pebble text-[10px] font-mono font-bold uppercase text-paper-white/40 hover:text-ink-gold hover:border-ink-gold/20 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-annotation text-[9px] uppercase tracking-[0.4em] text-paper-white/30">Match Minimum</label>
              <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-3/4 bg-ink-gold/40" />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-paper-white/20">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </UnifiedColumn>

        {/* SECTION 3: Result Stream */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-6 custom-scrollbar">
          {results.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
            >
              <SolidarityCard className="p-8 group hover:border-ink-gold/30 transition-all duration-500 cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] text-ink-gold uppercase tracking-[0.2em] opacity-60">
                      ID: {job.id} // MATCH: {job.match}
                    </span>
                    <h3 className="font-proclamation text-3xl uppercase text-paper-white group-hover:text-ink-gold transition-colors duration-500">
                      {job.title}
                    </h3>
                    <p className="font-body text-base text-paper-white/40 italic">
                      {job.company} — Secure Station Area 7
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-6">
                    <ActionButton variant="secondary" label="AUDIT POSITION" size="sm" className="px-6 py-2 text-[10px] tracking-widest" />
                    <div className="flex gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-ink-gold animate-pulse" />
                       <span className="font-mono text-[9px] text-paper-white/20 uppercase">Active Broadcast</span>
                    </div>
                  </div>
                </div>

                {/* Internal Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-ink-gold/5 blur-[60px] rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </SolidarityCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
