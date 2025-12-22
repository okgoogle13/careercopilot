/**
 * ELECTRIC ALCHEMIST: JOB CARD COMPONENT
 *
 * Job card component using Electric Alchemist Design System v4.4.
 * PERFORMANCE OPTIMIZED: Memoized component and callbacks
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Building2,
  DollarSign,
  Zap,
  Star,
  TrendingUp,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { Card, Button, Badge, Avatar } from '@/components';
import { cn } from '@/lib/utils';

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'hybrid';
    salary?: {
      min: number;
      max: number;
      currency: string;
      period: 'hourly' | 'annually';
    };
    description: string;
    requirements: string[];
    skills: string[];
    benefits?: string[];
    postedDate: Date | string;
    applicationDeadline?: Date | string;
    companySize?: string;
    industry?: string;
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
    remote: boolean;
    sponsored?: boolean;
    verified?: boolean;
    aiMatch?: {
      score: number;
      reasons: string[];
    };
    logoUrl?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  saved?: boolean;
  applied?: boolean;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

// Move utility functions outside component to prevent recreation
const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
};

const formatSalary = (salary?: JobCardProps['job']['salary']): string | null => {
  if (!salary) return null;
  const { min, max, currency, period } = salary;
  const periodText = period === 'hourly' ? '/hr' : '/year';

  if (min === max) {
    return `${currency}${min.toLocaleString()}${periodText}`;
  }
  return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}${periodText}`;
};

const getMatchScoreColor = (score: number) => {
  if (score >= 90) return 'text-primary';
  if (score >= 75) return 'text-secondary';
  if (score >= 60) return 'text-tertiary';
  return 'text-error';
};

const getMatchScoreBg = (score: number) => {
  if (score >= 90) return 'bg-primary-container/10';
  if (score >= 75) return 'bg-secondary-container/10';
  if (score >= 60) return 'bg-tertiary-container/10';
  return 'bg-error-container/10';
};

export const JobCard = memo<JobCardProps>(({
  job,
  variant = 'default',
  saved = false,
  applied = false,
  onSave,
  onApply,
  onViewDetails,
}) => {
  const [isSaved, setIsSaved] = useState(saved);

  // Memoize handlers
  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSaved((prev) => !prev);
      onSave?.(job.id);
    },
    [job.id, onSave]
  );

  const handleApply = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onApply?.(job.id);
    },
    [job.id, onApply]
  );

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(job.id);
  }, [job.id, onViewDetails]);

  // Memoize computed values
  const salaryText = useMemo(() => formatSalary(job.salary), [job.salary]);
  const postedText = useMemo(() => formatRelativeTime(job.postedDate), [job.postedDate]);

  if (variant === 'compact') {
    return (
      <Card
        variant="default"
        interactive
        className="cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-hero text-sm font-semibold text-on-surface truncate">
                {job.title}
              </h3>
              {job.verified && (
                <Shield className="h-4 w-4 text-secondary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{job.company}</span>
              <span>•</span>
              <MapPin className="h-3 w-3" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {job.aiMatch && (
              <Badge
                variant="outline"
                className={cn(
                  'text-xs font-semibold',
                  getMatchScoreColor(job.aiMatch.score),
                  getMatchScoreBg(job.aiMatch.score)
                )}
              >
                {job.aiMatch.score}% match
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="p-2"
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5 text-on-surface-variant" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant={variant === 'featured' ? 'hero' : 'default'}
      interactive
      className={cn(
        'h-full flex flex-col cursor-pointer',
        variant === 'featured' && 'ring-2 ring-primary/20'
      )}
      onClick={handleViewDetails}
    >
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
              {job.logoUrl ? (
                <img
                  src={job.logoUrl}
                  alt={job.company}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
              ) : (
                <Building2 className="h-6 w-6 text-on-surface-variant shrink-0" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-data text-sm font-semibold text-on-surface-variant">
                  {job.company}
                </span>
                {job.verified && (
                  <Shield className="h-4 w-4 text-secondary" />
                )}
                {job.sponsored && (
                  <Badge variant="outline" className="text-xs">
                    Sponsored
                  </Badge>
                )}
              </div>
              <p className="text-data text-xs text-on-surface-variant">
                {job.industry} • {job.companySize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {job.aiMatch && (
              <div className="text-center">
                <div
                  className={cn(
                    'px-3 py-1 rounded-lg font-bold text-lg',
                    getMatchScoreColor(job.aiMatch.score),
                    getMatchScoreBg(job.aiMatch.score)
                  )}
                >
                  {job.aiMatch.score}%
                </div>
                <p className="text-data text-xs text-on-surface-variant mt-1">
                  AI Match
                </p>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="p-2"
            >
              {isSaved ? (
                <BookmarkCheck className="h-6 w-6 text-primary" />
              ) : (
                <Bookmark className="h-6 w-6 text-on-surface-variant" />
              )}
            </Button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-hero text-xl font-semibold mb-3">{job.title}</h2>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="text-human text-sm">{job.location}</span>
          </div>

          {salaryText && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              <span className="text-human text-sm">{salaryText}</span>
            </div>
          )}

          <span className="text-data text-xs">
            Posted {postedText}
          </span>
        </div>

        {/* Description */}
        <p className="text-human text-sm text-on-surface-variant mb-4 line-clamp-3">
          {job.description}
        </p>

        {/* Job Type & Experience Level */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {job.type.replace('-', ' ').toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.experienceLevel.toUpperCase()} LEVEL
          </Badge>
          {job.remote && (
            <Badge variant="primary" className="text-xs">
              REMOTE
            </Badge>
          )}
        </div>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-human text-sm font-semibold mb-2">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 6).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* AI Match Reasons */}
        {job.aiMatch && job.aiMatch.reasons.length > 0 && (
          <div className="mb-4 p-3 bg-primary-container/5 border border-primary-container/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <h4 className="text-human text-sm font-semibold text-primary">
                Why this matches you
              </h4>
            </div>
            <ul className="space-y-1.5 list-none pl-0">
              {job.aiMatch.reasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-data text-xs text-on-surface-variant">
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-outline-variant">
        {applied ? (
          <Button variant="outline" className="flex-1" disabled>
            Applied
          </Button>
        ) : (
          <Button
            variant="default"
            className="flex-1"
            onClick={handleApply}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        )}

        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Details
        </Button>
      </div>
    </Card>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
