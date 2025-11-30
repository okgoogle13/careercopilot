import { Search, Filter, X, ExpandMore } from '@mui/icons-material';
import React from 'react';

interface FilterPanelProps {
  onFiltersChange?: (filters: JobFilters) => void;
  onReset?: () => void;
}

export interface JobFilters {
  searchQuery: string;
  location: string[];
  jobType: string[];
  experienceLevel: string[];
  salaryRange: [number, number];
  company: string[];
  skills: string[];
  remote: boolean;
  datePosted: string;
}

const defaultFilters: JobFilters = {
  searchQuery: '',
  location: [],
  jobType: [],
  experienceLevel: [],
  salaryRange: [0, 200000],
  company: [],
  skills: [],
  remote: false,
  datePosted: 'any',
};

const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

const experienceLevelOptions = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead/Principal',
  'Executive',
];

const locationOptions = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Chicago, IL',
  'Remote',
];

const companyOptions = [
  'Google',
  'Microsoft',
  'Apple',
  'Amazon',
  'Meta',
  'Netflix',
  'Tesla',
  'Uber',
  'Airbnb',
  'Stripe',
];

const skillOptions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'AWS',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
];

const datePostedOptions = [
  { value: 'any', label: 'Any time' },
  { value: '1d', label: 'Past 24 hours' },
  { value: '3d', label: 'Past 3 days' },
  { value: '1w', label: 'Past week' },
  { value: '1m', label: 'Past month' },
];

export function FilterPanel({ onFiltersChange, onReset }: FilterPanelProps) {
  const [filters, setFilters] = React.useState<JobFilters>(defaultFilters);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onReset?.();
    onFiltersChange?.(defaultFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value && value !== 'any';
      if (typeof value === 'object' && value !== null) {
        return value.some((v: any) => v > 0);
      }
      return false;
    }).length;
  };

  return (
    <div className="p-2 bg-white rounded-lg border">
      <div className="p-2 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <div className="px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full">
              {getActiveFilterCount()}
            </div>
          )}
        </div>
        <button
          className="p-1 rounded-full hover:bg-gray-100 flex items-center gap-1 text-xs"
          onClick={handleReset}
          aria-label="Clear all filters"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="p-2 flex flex-col gap-3">
        {/* Search Query */}
        <div>
          <label className="text-sm font-medium mb-1">Keywords</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md"
              placeholder="Search for jobs, skills, or companies..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              aria-label="Search jobs by keywords, skills, or companies"
            />
          </div>
        </div>

        <hr />

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-1">Location</label>
          {/* Replace with a proper multi-select component */}
          <div className="text-sm text-gray-500">Multi-select placeholder</div>
        </div>

        {/* Job Type */}
        <div>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium">Job Type</span>
              <ExpandMore className="w-5 h-5 transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 flex flex-col">
              {jobTypeOptions.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.jobType.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.jobType, type]
                        : filters.jobType.filter((t) => t !== type);
                      handleFilterChange('jobType', newTypes);
                    }}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Experience Level */}
        <div>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium">Experience Level</span>
              <ExpandMore className="w-5 h-5 transform group-open:rotate-180" />
            </summary>
            <div className="mt-2 flex flex-col">
              {experienceLevelOptions.map((level) => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.experienceLevel.includes(level)}
                    onChange={(e) => {
                      const newLevels = e.target.checked
                        ? [...filters.experienceLevel, level]
                        : filters.experienceLevel.filter((l) => l !== level);
                      handleFilterChange('experienceLevel', newLevels);
                    }}
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Salary Range */}
        <div>
          <label className="text-sm font-medium mb-1">Salary Range</label>
          <div className="px-1">
            {/* Replace with a proper range slider component */}
            <div className="text-sm text-gray-500">Range slider placeholder</div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${filters.salaryRange[0].toLocaleString()}</span>
              <span>${filters.salaryRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Remote Work */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.remote}
              onChange={(e) => handleFilterChange('remote', e.target.checked)}
            />
            <span className="text-sm">Remote work available</span>
          </label>
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-medium mb-1">Required Skills</label>
          {/* Replace with a proper multi-select component */}
          <div className="text-sm text-gray-500">Multi-select placeholder</div>
        </div>

        {/* Date Posted */}
        <div>
          <label className="text-sm font-medium mb-1">Date Posted</label>
          <div className="flex flex-col">
            {datePostedOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="datePosted"
                  checked={filters.datePosted === option.value}
                  onChange={() => handleFilterChange('datePosted', option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}