import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
export const JobList: React.FC<JobListProps> = ({
  jobs,
  onJobSelect,
  isLoading = false
}) => {
  return (
    <main className="max-w-4xl mx-auto p-8 flex flex-col gap-12" role="main">
      <h1 className="text-[72px] font-solidarity-900 text-paper-white uppercase tracking-tighter">
        THE LOOKOUT
      </h1>

      <div className="flex flex-col gap-6" role="list">
        {isLoading ? (
          // Skeleton Pulse
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-charcoal-200/50 rounded-stone animate-pulse" />
          ))
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
              whileHover={{ y: -4, shadow: "0 20px 40px rgba(0,0,0,0.6)" }}
              className={cn(
                "p-8 bg-charcoal-100 border border-blueprint-grey/20",
                "rounded-stone shadow-viscous cursor-pointer group transition-all"
              )}
              onClick={() => onJobSelect(job.id)}
              role="listitem"
              aria-label={`Job: ${job.title} at ${job.location}`}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-paper-white group-hover:text-smoke-green transition-colors">
                  {job.title}
                </h2>
                <span className="text-jetbrains-mono text-sm text-blueprint-grey">
                  {job.salary}
                </span>
              </div>

              <div className="flex gap-3 flex-wrap">
                {job.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-signal-green/10 text-signal-green text-xs font-bold uppercase rounded-seed border border-signal-green/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-xs font-jetbrains-mono text-blueprint-grey/60 uppercase">
                {job.location}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {!isLoading && jobs.length === 0 && (
        <div className="flex flex-col items-center py-20 opacity-40 grayscale">
          <svg className="w-48 h-48 fill-paper-white mb-6" viewBox="0 0 100 100">
             {/* Stencil Palm Tree Motif */}
             <path d="M50,90 L50,40 M50,45 C70,45 80,30 80,20 M50,45 C30,45 20,30 20,20 M50,55 C75,55 85,45 85,35" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <p className="font-jetbrains-mono text-sm">NO OPPORTUNITIES FOUND IN THIS SECTOR</p>
        </div>
      )}
    </main>
  );
};
