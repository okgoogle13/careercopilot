import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import { FilterPanel, JobFilters } from './FilterPanel';
import { JobCard } from './JobCard';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { Search, SlidersHorizontal, Grid3X3, List, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
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
    description: 'We are looking for a Senior Software Engineer to join our team and help build scalable web applications. You will work with cutting-edge technologies and collaborate with a diverse team of engineers.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'GCP'],
    postedDate: '2 days ago',
    isBookmarked: false,
    isRemote: true
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    experience: 'Mid Level',
    salary: '$110K - $160K',
    description: 'Join our frontend team to build amazing user experiences. We work with React, TypeScript, and modern web technologies to create products used by millions.',
    skills: ['TypeScript', 'React', 'CSS', 'Azure', 'Jest'],
    postedDate: '1 day ago',
    isBookmarked: true,
    isRemote: false
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Startup Inc',
    location: 'Austin, TX',
    type: 'Full-time',
    experience: 'Mid Level',
    salary: '$90K - $130K',
    description: 'Be part of a fast-growing startup and help shape the future of our product. You will work across the entire stack and have significant impact on our technology decisions.',
    skills: ['JavaScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    postedDate: '3 days ago',
    isBookmarked: false,
    isRemote: true
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    experience: 'Senior Level',
    salary: '$130K - $180K',
    description: 'Help us scale our infrastructure to serve millions of users worldwide. You will work with Kubernetes, AWS, and other modern DevOps tools.',
    skills: ['Kubernetes', 'AWS', 'Docker', 'Python', 'Terraform'],
    postedDate: '1 week ago',
    isBookmarked: false,
    isRemote: true
  }
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'date', label: 'Most Recent' },
  { value: 'salary', label: 'Highest Salary' },
  { value: 'company', label: 'Company Name' }
];

export function JobSearch({
  initialJobs = sampleJobs,
  isLoading = false,
  onJobApply,
  onJobBookmark,
  onJobView
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
      // Apply search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }

      // Apply location filter
      if (filters.location.length > 0) {
        filtered = filtered.filter(job =>
          filters.location.some(loc => job.location.includes(loc) || (job.isRemote && loc === 'Remote'))
        );
      }

      // Apply job type filter
      if (filters.jobType.length > 0) {
        filtered = filtered.filter(job => filters.jobType.includes(job.type));
      }

      // Apply experience level filter
      if (filters.experienceLevel.length > 0) {
        filtered = filtered.filter(job => filters.experienceLevel.includes(job.experience));
      }

      // Apply remote filter
      if (filters.remote) {
        filtered = filtered.filter(job => job.isRemote);
      }

      // Apply skills filter
      if (filters.skills.length > 0) {
        filtered = filtered.filter(job =>
          filters.skills.some(skill => job.skills.includes(skill))
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.postedDate.localeCompare(b.postedDate);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'salary':
          // Simple salary comparison (in a real app, you'd parse the salary string)
          return b.salary?.localeCompare(a.salary || '') || 0;
        default: // relevance
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
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
    onJobBookmark?.(jobId);
  };

  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (isLoading) {
    return <LoadingState size="lg" label="Searching for jobs..." />;
  }

  return (
    <Box className="w-full">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="text-2xl font-bold mb-2">
          Job Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find your next opportunity with our AI-powered job matching
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        {showFilters && (
          <Grid item xs={12} md={3}>
            <FilterPanel
              onFiltersChange={handleFiltersChange}
              onReset={() => setFilters(null)}
            />
          </Grid>
        )}

        {/* Main Content */}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
          {/* Controls */}
          <Paper className="p-4 mb-6">
            <Box className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <Box className="flex items-center gap-4">
                <Button
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  startIcon={<SlidersHorizontal size={16} />}
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>

                <Typography variant="body2" color="text.secondary">
                  {filteredJobs.length} jobs found
                </Typography>
              </Box>

              <Box className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <Box className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('grid')}
                    className={`rounded-none ${viewMode === 'grid' ? 'bg-primary' : ''}`}
                    size="small"
                  >
                    <Grid3X3 size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('list')}
                    className={`rounded-none ${viewMode === 'list' ? 'bg-primary' : ''}`}
                    size="small"
                  >
                    <List size={16} />
                  </Button>
                </Box>

                {/* Sort */}
                <FormControl size="small" className="min-w-32">
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

          {/* Job Results */}
          {currentJobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={48} className="text-gray-400" />}
              title="No jobs found"
              description="Try adjusting your filters or search criteria to find more opportunities."
              action={{
                label: "Clear Filters",
                onClick: () => setFilters(null)
              }}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Box className="flex justify-center mt-8">
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