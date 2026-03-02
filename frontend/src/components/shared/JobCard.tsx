import { Pebble, Stone } from '@/components/ui';
import { Building, Globe, MapPin, Save, Share2 } from 'lucide-react';
import React from 'react';

export interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: string;
  salary: string;
  description: string;
  tags: string[];
  logo?: string;
  onApply?: () => void;
  onSave?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  type,
  postedAt,
  salary,
  description,
  tags,
  logo,
  onApply,
  onSave,
}) => {
  return (
    <Stone
      elevation="raised"
      className="h-full flex flex-col p-6 transition-all hover:border-[var(--color-leaf-base)]/30"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-stone bg-[var(--color-surface-container-high)] flex items-center justify-center overflow-hidden border border-white/5">
            {logo ? (
              <img
                src={logo}
                alt={company}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building
                size={24}
                className="text-[var(--color-text-tertiary)]"
              />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight mb-1">
              {title}
            </h3>
            <p className="text-sm font-medium text-[var(--color-leaf-base)]">{company}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Pebble
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="w-8 h-8 p-0 min-w-0"
          >
            <Save size={16} />
          </Pebble>
          <Pebble
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 min-w-0"
          >
            <Share2 size={16} />
          </Pebble>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-1.5">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe size={16} />
          <span>{type}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-[var(--color-bark-base)]">
          <span>{salary}</span>
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-6 flex-grow leading-relaxed">
        {description}
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-text-tertiary)] text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Pebble
            variant="primary"
            className="flex-1"
            onClick={onApply}
          >
            Apply Now
          </Pebble>
          <Pebble
            variant="secondary"
            onClick={() => {}}
          >
            Details
          </Pebble>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest font-medium">
        Posted {postedAt}
      </div>
    </Stone>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> restoration-KR-Rage-Figma-v2.0
