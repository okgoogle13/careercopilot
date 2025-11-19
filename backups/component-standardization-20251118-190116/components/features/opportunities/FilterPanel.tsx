import { Search, Filter, X, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
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
import React from 'react';

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
      <Card sx={{
      p: 2
    }}>
        <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
          <Filter sx={{ fontSize: 20, color: "text.secondary" }} />
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
    <Card sx={{ p: 2 }}>
      <CardHeader sx={{
      p: 2,
      pb: 2
    }}>
        <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
            <Filter sx={{ fontSize: 20 }} />
            <Typography variant="h6" sx={{
      fontWeight: 600
    }}>
              Filters
            </Typography>
            {getActiveFilterCount() > 0 && (
              <Chip label={getActiveFilterCount()} size="small" color="primary" sx={{
      color: "common.white"
    }} />
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

      <CardContent sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
        {/* Search Query */}
        <Box>
          <Typography variant="subtitle2" sx={{
      fontWeight: 500,
      mb: 1
    }}>
            Keywords
          </Typography>
          <TextField
            fullWidth
            placeholder="Search for jobs, skills, or companies..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
            aria-label="Search jobs by keywords, skills, or companies"
          />
        </Box>

        <Divider />

        {/* Location */}
        <Box>
          <Typography variant="subtitle2" sx={{
      fontWeight: 500,
      mb: 1
    }}>
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
        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 0 }}>
            <Typography variant="subtitle2" sx={{
      fontWeight: 500
    }}>
              Job Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{type}</Typography>}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Experience Level */}
        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 0 }}>
            <Typography variant="subtitle2" sx={{
      fontWeight: 500
    }}>
              Experience Level
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{level}</Typography>}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Salary Range */}
        <Box>
          <Typography variant="subtitle2" sx={{
      fontWeight: 500,
      mb: 1
    }}>
            Salary Range
          </Typography>
          <Box sx={{
      px: 1
    }}>
            <Slider
              value={filters.salaryRange}
              onChange={(_, value) => handleFilterChange('salaryRange', value)}
              valueLabelDisplay="auto"
              min={0}
              max={200000}
              step={5000}
              valueLabelFormat={(value) => `$${Math.round(value / 1000)}k`}
            />
            <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      typography: "body2",
      color: "text.secondary",
      mt: -1
    }}>
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
                size="small"
              />
            }
            label={<Typography variant="body2">Remote work available</Typography>}
          />
        </Box>

        {/* Skills */}
        <Box>
          <Typography variant="subtitle2" sx={{
      fontWeight: 500,
      mb: 1
    }}>
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
          <Typography variant="subtitle2" sx={{
      fontWeight: 500,
      mb: 1
    }}>
            Date Posted
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {datePostedOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={filters.datePosted === option.value}
                    onChange={() => handleFilterChange('datePosted', option.value)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{option.label}</Typography>}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}