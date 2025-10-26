import { Search, Filter, X, ExpandMore } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Slider,
  TextField,
  Autocomplete,
  Chip,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React, { useState } from 'react';

interface FilterPanelProps {
  onFiltersChange?: (filters: JobFilters) => void;
  onReset?: () => void;
  isCollapsed?: boolean;
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

export function FilterPanel({ onFiltersChange, onReset, isCollapsed = false }: FilterPanelProps) {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

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
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.location.length) count++;
    if (filters.jobType.length) count++;
    if (filters.experienceLevel.length) count++;
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) count++;
    if (filters.company.length) count++;
    if (filters.skills.length) count++;
    if (filters.remote) count++;
    if (filters.datePosted !== 'any') count++;
    return count;
  };

  if (isCollapsed) {
    return (
      <Card className="p-4">
        <Box className="flex items-center gap-4">
          <Filter sx={{ fontSize: 20 }} className="text-gray-500" />
          <Typography variant="body2" color="text.secondary">
            {getActiveFilterCount()} filters active
          </Typography>
          <Button size="small" variant="outlined" onClick={handleReset}>
            Clear All
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-2">
            <Filter sx={{ fontSize: 20 }} className="text-primary" />
            <Typography variant="h6" className="font-semibold">
              Filters
            </Typography>
            {getActiveFilterCount() > 0 && (
              <Chip label={getActiveFilterCount()} size="small" className="bg-primary text-white" />
            )}
          </Box>
          <Button
            size="small"
            variant="text"
            onClick={handleReset}
            startIcon={<X sx={{ fontSize: 16 }} />}
            aria-label="Clear all filters"
          >
            Clear
          </Button>
        </Box>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Query */}
        <Box>
          <Typography variant="subtitle2" className="font-medium mb-3">
            Keywords
          </Typography>
          <TextField
            fullWidth
            placeholder="Search for jobs, skills, or companies..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ fontSize: 20 }} className="text-gray-400 mr-2" />,
            }}
            size="small"
            aria-label="Search jobs by keywords, skills, or companies"
          />
        </Box>

        <Divider />

        {/* Location */}
        <Box>
          <Typography variant="subtitle2" className="font-medium mb-3">
            Location
          </Typography>
          <Autocomplete
            multiple
            options={locationOptions}
            value={filters.location}
            onChange={(_, value) => handleFilterChange('location', value)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select locations" size="small" />
            )}
          />
        </Box>

        {/* Job Type */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" className="font-medium">
              Job Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="space-y-2">
              {jobTypeOptions.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={filters.jobType.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.jobType, type]
                          : filters.jobType.filter((t) => t !== type);
                        handleFilterChange('jobType', newTypes);
                      }}
                    />
                  }
                  label={type}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Experience Level */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2" className="font-medium">
              Experience Level
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="space-y-2">
              {experienceLevelOptions.map((level) => (
                <FormControlLabel
                  key={level}
                  control={
                    <Checkbox
                      checked={filters.experienceLevel.includes(level)}
                      onChange={(e) => {
                        const newLevels = e.target.checked
                          ? [...filters.experienceLevel, level]
                          : filters.experienceLevel.filter((l) => l !== level);
                        handleFilterChange('experienceLevel', newLevels);
                      }}
                    />
                  }
                  label={level}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Salary Range */}
        <Box>
          <Typography variant="subtitle2" className="font-medium mb-3">
            Salary Range
          </Typography>
          <Box className="px-2">
            <Slider
              value={filters.salaryRange}
              onChange={(_, value) => handleFilterChange('salaryRange', value)}
              valueLabelDisplay="auto"
              min={0}
              max={200000}
              step={5000}
              valueLabelFormat={(value) => `$${value.toLocaleString()}`}
            />
            <Box className="flex justify-between text-sm text-gray-500 mt-1">
              <span>${filters.salaryRange[0].toLocaleString()}</span>
              <span>${filters.salaryRange[1].toLocaleString()}</span>
            </Box>
          </Box>
        </Box>

        {/* Remote Work */}
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.remote}
                onChange={(e) => handleFilterChange('remote', e.target.checked)}
              />
            }
            label="Remote work available"
          />
        </Box>

        {/* Skills */}
        <Box>
          <Typography variant="subtitle2" className="font-medium mb-3">
            Required Skills
          </Typography>
          <Autocomplete
            multiple
            options={skillOptions}
            value={filters.skills}
            onChange={(_, value) => handleFilterChange('skills', value)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select skills" size="small" />
            )}
          />
        </Box>

        {/* Date Posted */}
        <Box>
          <Typography variant="subtitle2" className="font-medium mb-3">
            Date Posted
          </Typography>
          <Box className="space-y-2">
            {datePostedOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.datePosted === option.value}
                    onChange={() => handleFilterChange('datePosted', option.value)}
                  />
                }
                label={option.label}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
