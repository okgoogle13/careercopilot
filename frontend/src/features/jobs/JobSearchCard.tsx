/**
 * ELECTRIC ALCHEMIST: JOB SEARCH CARD COMPONENT
 *
 * Search card for job listings using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, Button, Input } from '@/components';

export interface JobSearchCardProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onFilterClick?: () => void;
  resultCount?: number;
}

export const JobSearchCard: React.FC<JobSearchCardProps> = ({
  searchQuery = '',
  onSearchChange,
  onFilterClick,
  resultCount,
}) => {
  return (
    <Card variant="default" className="p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="default">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      {resultCount !== undefined && (
        <p className="text-data text-xs text-on-surface-variant mt-4">
          {resultCount} {resultCount === 1 ? 'job' : 'jobs'} found
        </p>
      )}
    </Card>
  );
};

export default JobSearchCard;

