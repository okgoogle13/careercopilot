import React from 'react';

export interface JobListItem {
  id: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
}

export interface JobListProps {
  jobs: JobListItem[];
  onJobSelect?: (id: string) => void;
  isLoading?: boolean;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onJobSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div
        className="text-xs font-mono uppercase tracking-widest py-8 text-center"
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
      >
        Loading…
      </div>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-3">
      {jobs.map((job) => (
        <li
          key={job.id}
          onClick={() => onJobSelect?.(job.id)}
          className="rounded-[var(--sys-shape-placard01,8px)] border p-4 cursor-pointer transition-all hover:border-[var(--sys-color-inkGold-base)]"
          style={{
            background: 'var(--sys-color-charcoalBackground-base)',
            borderColor: 'rgba(163,155,143,0.2)',
          }}
        >
          <p
            className="font-bold text-sm uppercase tracking-tight"
            style={{ color: 'var(--sys-color-worker-ash-base)' }}
          >
            {job.title}
          </p>
          <div
            className="flex gap-4 mt-1 text-xs font-mono"
            style={{ color: 'var(--sys-color-concreteGrey-base)' }}
          >
            <span>{job.location}</span>
            <span>{job.salary}</span>
          </div>
          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(218,246,116,0.08)',
                    color: 'var(--sys-color-inkGold-base)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default JobList;
