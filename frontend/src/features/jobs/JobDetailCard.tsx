/**
 * ELECTRIC ALCHEMIST: JOB DETAIL CARD COMPONENT
 *
 * Detailed job view card using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import {
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Briefcase,
  CheckCircle,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components';
import { cn } from '@/lib/utils';

export interface JobDetailCardProps {
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
    logoUrl?: string;
  };
  onApply?: () => void;
  onSave?: () => void;
  saved?: boolean;
}

export const JobDetailCard: React.FC<JobDetailCardProps> = ({
  job,
  onApply,
  onSave,
  saved = false,
}) => {
  const formatSalary = () => {
    if (!job.salary) return null;
    const { min, max, currency, period } = job.salary;
    const periodText = period === 'hourly' ? '/hr' : '/year';

    if (min === max) {
      return `${currency}${min.toLocaleString()}${periodText}`;
    }
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}${periodText}`;
  };

  return (
    <Card variant="default" className="p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
          {job.logoUrl ? (
            <img
              src={job.logoUrl}
              alt={job.company}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <Building2 className="h-8 w-8 text-on-surface-variant" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-hero text-2xl font-semibold mb-2">{job.title}</h1>
          <p className="text-data text-base text-on-surface-variant mb-2">
            {job.company}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{job.type.replace('-', ' ')}</Badge>
            <Badge variant="outline">{job.experienceLevel}</Badge>
            {job.remote && <Badge variant="primary">Remote</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSave}>
            {saved ? <CheckCircle className="h-4 w-4" /> : 'Save'}
          </Button>
          <Button variant="default" onClick={onApply}>
            Apply Now
          </Button>
        </div>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-surface-container-low rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-on-surface-variant" />
          <span className="text-human text-sm text-on-surface">{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-on-surface-variant" />
            <span className="text-human text-sm text-on-surface">{formatSalary()}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-on-surface-variant" />
          <span className="text-data text-xs text-on-surface-variant">
            Posted {new Date(job.postedDate).toLocaleDateString()}
          </span>
        </div>
        {job.companySize && (
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-on-surface-variant" />
            <span className="text-data text-xs text-on-surface-variant">
              {job.companySize}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-hero text-lg font-semibold mb-3">Job Description</h2>
        <p className="text-human text-sm text-on-surface leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-hero text-lg font-semibold mb-3">Requirements</h2>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-human text-sm text-on-surface">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-hero text-lg font-semibold mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="mb-6">
          <h2 className="text-hero text-lg font-semibold mb-3">Benefits</h2>
          <ul className="space-y-2">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-tertiary mt-0.5 flex-shrink-0" />
                <span className="text-human text-sm text-on-surface">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Application Deadline */}
      {job.applicationDeadline && (
        <div className="p-4 bg-tertiary-container/10 border border-tertiary-container/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-tertiary" />
            <span className="text-human text-sm font-semibold text-tertiary">
              Application Deadline:{' '}
              {new Date(job.applicationDeadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default JobDetailCard;

