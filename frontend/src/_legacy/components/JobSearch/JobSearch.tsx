import {
  Tune as SlidersHorizontal,
  GridView as Grid3X3,
  List,
  Work as Briefcase,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Paper,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import type { JobFilters } from '../features/FilterPanel/FilterPanel';
import { FilterPanel } from '../features/FilterPanel/FilterPanel';
import { JobCard } from '../features/JobCard/JobCard';
import { EmptyState } from '../ui/EmptyState/EmptyState';
import { LoadingState } from '../LoadingState';

type JobType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Freelance'
  | 'Internship';
type ExperienceLevel =
  | 'Entry Level'
  | 'Mid Level'
  | 'Senior Level'
  | 'Lead/Principal'
  | 'Executive';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  experience: ExperienceLevel;
  salary?: string;
  description: string;
  skills: string[];
  postedDate: string;
  isBookmarked: boolean;
  companyLogo?: string;
  isRemote: boolean;
}

interface JobSearchProps {
  initialJobs?: Job[];
  isLoading?: boolean;
  onJobApply?: (jobId: string) => void;
  onJobBookmark?: (jobId: string) => void;
  onJobView?: (jobId: string) => void;
}

const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    experience: 'Senior Level',
    salary: '$140K - $200K',
    description:
      'We are looking for a Senior Software Engineer to join our team and help build scalable web applications. You will work with cutting-edge technologies and collaborate with a diverse team of engineers.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'GCP'],
    postedDate: '2 days ago',
    isBookmarked: false,
    isRemote: true,
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    experience: 'Mid Level',
    salary: '$110K - $160K',
    description:
      'Join our frontend team to build amazing user experiences. We work with React, TypeScript, and modern web technologies to create products used by millions.',
    skills: ['TypeScript', 'React', 'CSS', 'Azure', 'Jest'],
    postedDate: '1 day ago',
    isBookmarked: true,
    isRemote: false,
  },
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'date', label: 'Most Recent' },
  { value: 'salary', label: 'Highest Salary' },
  { value: 'company', label: 'Company Name' },
];

export function JobSearch({
  initialJobs = sampleJobs,
  isLoading = false,
  onJobApply,
  onJobBookmark,
  onJobView,
}: JobSearchProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
  const [filters, setFilters] = useState<JobFilters | null>(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const jobsPerPage = 6;

  useEffect(() => {
    setJobs(initialJobs);
    setFilteredJobs(initialJobs);
  }, [initialJobs]);

  useEffect(() => {
    let filtered = [...jobs];

    if (filters) {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (job) =>
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.skills.some((skill) => skill.toLowerCase().includes(query))
        );
      }

      if (filters.location.length > 0) {
        filtered = filtered.filter((job) =>
          filters.location.some(
            (loc) =>
              job.location.includes(loc) || (job.isRemote && loc === 'Remote')
          )
        );
      }
      if (filters.jobType.length > 0) {
        filtered = filtered.filter((job) =>
          filters.jobType.includes(job.type)
        );
      }
      if (filters.experienceLevel.length > 0) {
        filtered = filtered.filter((job) =>
          filters.experienceLevel.includes(job.experience)
        );
      }
      if (filters.remote) {
        filtered = filtered.filter((job) => job.isRemote);
      }
      if (filters.skills.length > 0) {
        filtered = filtered.filter((job) =>
          filters.skills.some((skill) => job.skills.includes(skill))
        );
      }
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.postedDate.localeCompare(b.postedDate);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'salary':
          return b.salary?.localeCompare(a.salary || '') || 0;
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, filters, sortBy]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };
  const handleBookmark = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );
    onJobBookmark?.(jobId);
  };

  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (isLoading) {
    return <LoadingState message="Searching for jobs..." />;
  }

  return (
    <Box sx={{ width: '100%', p: 'var(--sys-spacing-4)' }}>
      <Box sx={{ mb: 'var(--sys-spacing-6)' }}>
        <Typography
          variant="h1"
          sx={{
            font: 'var(--sys-type-display-small)',
            fontWeight: 'var(--sys-type-weight-bold)',
            color: 'var(--sys-color-on-surface)',
            mb: 'var(--sys-spacing-2)',
          }}
        >
          Job Search
        </Typography>
        <Typography
          variant="body1"
          sx={{
            font: 'var(--sys-type-body-large)',
            color: 'var(--sys-color-on-surface-variant)',
          }}
        >
          Find your next opportunity with our AI-powered job matching
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {showFilters && (
          <Grid item xs={12} md={3}>
            <FilterPanel
              onFiltersChange={handleFiltersChange}
              onReset={() => setFilters(null)}
            />
          </Grid>
        )}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
          <Paper
            sx={{
              p: 'var(--sys-spacing-4)',
              mb: 'var(--sys-spacing-6)',
              backgroundColor: 'var(--sys-color-surface-container)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 'var(--sys-spacing-4)',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sys-spacing-4)',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  startIcon={<SlidersHorizontal />}
                  sx={{
                    borderColor: 'var(--sys-color-outline)',
                    color: 'var(--sys-color-on-surface)',
                  }}
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
                <Typography
                  variant="body2"
                  sx={{ color: 'var(--sys-color-on-surface-variant)' }}
                >
                  {filteredJobs.length} jobs found
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sys-spacing-4)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    border: '1px solid var(--sys-color-outline)',
                    borderRadius: 'var(--sys-shape-corner-medium)',
                    overflow: 'hidden',
                  }}
                >
                  <Button
                    variant={viewMode === 'grid' ? 'contained' : 'text'}
                    onClick={() => setViewMode('grid')}
                    sx={{
                      borderRadius: 0,
                      minWidth: 'auto',
                      p: 'var(--sys-spacing-2)',
                    }}
                    size="small"
                  >
                    <Grid3X3 />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'contained' : 'text'}
                    onClick={() => setViewMode('list')}
                    sx={{
                      borderRadius: 0,
                      minWidth: 'auto',
                      p: 'var(--sys-spacing-2)',
                    }}
                    size="small"
                  >
                    <List />
                  </Button>
                </Box>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort by"
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          {currentJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase sx={{ fontSize: 48 }} />}
              title="No jobs found"
              description="Try adjusting your filters or search criteria to find more opportunities."
              actionLabel="Clear Filters"
              onAction={() => setFilters(null)}
            />
          ) : (
            <>
              <Grid container spacing={3}>
                {currentJobs.map((job) => (
                  <Grid
                    item
                    xs={12}
                    md={viewMode === 'grid' ? 6 : 12}
                    lg={viewMode === 'grid' ? 4 : 12}
                    key={job.id}
                  >
                    <JobCard
                      {...job}
                      onBookmark={handleBookmark}
                      onApply={onJobApply}
                      onViewDetails={onJobView}
                    />
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 'var(--sys-spacing-8)',
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}