import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

export interface JobOpportunity {
  id: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
}

export interface JobListProps {
  /** List of job openings */
  jobs: JobOpportunity[];
  /** Callback for selecting a job */
  onJobSelect: (id: string) => void;
  /** Loading state for skeleton display */
  isLoading?: boolean;
}

/**
 * JobList
 *
 * The "Lookout" feed for discoverable opportunities.
 * Uses staggered stencil-slam entrance animations.
 */
export const JobList: React.FC<JobListProps> = ({ jobs, onJobSelect, isLoading = false }) => {
  return (
    <main
      className="max-w-4xl mx-auto p-8 flex flex-col gap-12"
      role="main"
    >
      <h1 className="text-[72px] font-black text-[var(--sys-color-worker-ash-base)] uppercase tracking-tighter">
        THE LOOKOUT
      </h1>

      <div
        className="flex flex-col gap-6"
        role="list"
      >
        {isLoading
          ? // Skeleton Pulse
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-[var(--sys-color-surface-container-low)] rounded-megaphone animate-pulse"
              />
            ))
          : jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ y: -4, boxShadow: 'var(--sys-shadow-elevation3HoverLift)' }}
                className={cn(
                  'p-8 bg-[var(--sys-color-surface-container-low)] border border-[var(--sys-color-outline-variant)]',
                  'rounded-megaphone shadow-viscous cursor-pointer group transition-all'
                )}
                onClick={() => onJobSelect(job.id)}
                role="listitem"
                aria-label={`Job: ${job.title} at ${job.location}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-inkGold-base)] transition-colors">
                    {job.title}
                  </h2>
                  <span className="font-mono text-sm text-[var(--sys-color-concreteGrey-base)]">
                    {job.salary}
                  </span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--sys-color-primary-container)] text-[var(--sys-color-on-primary-container)] text-xs font-bold uppercase rounded-march border border-[var(--sys-color-outline-variant)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 text-xs font-mono text-[var(--sys-color-concreteGrey-base)] opacity-60 uppercase">
                  {job.location}
                </div>
              </motion.div>
            ))}
      </div>

      {!isLoading && jobs.length === 0 && (
        <div className="flex flex-col items-center py-20 opacity-40 grayscale">
          <Compass className="w-48 h-48 text-[var(--sys-color-concreteGrey-base)] mb-6 animate-pulse" />
          <p className="font-mono text-sm text-[var(--sys-color-concreteGrey-base)]">
            NO OPPORTUNITIES FOUND IN THIS SECTOR
          </p>
        </div>
      )}
    </main>
  );
};
