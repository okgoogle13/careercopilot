import {
  Analytics,
  AttachMoney,
  Bookmark,
  BookmarkBorder,
  Business,
  Cancel,
  CheckCircle,
  Delete,
  FilterList,
  Flag,
  LocationOn,
  MoreVert,
  NotificationsActive,
  Schedule,
  Search,
  Send,
  Share,
  Sort,
  Star,
  Visibility,
  Work,
} from '@mui/icons-material';
import type { ChipProps, LinearProgressProps } from '@mui/material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import Grid from '@/components/ui/GridCompat';

interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  matchScore: number;
  isBookmarked: boolean;
  applicationStatus?: 'not-applied' | 'applied' | 'interviewing' | 'rejected' | 'offered';
  company_logo?: string;
  urgency: 'low' | 'medium' | 'high';
  tags: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`opportunities-tabpanel-${index}`}
      aria-labelledby={`opportunities-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

interface OpportunitiesPageProps {
  isEmpty?: boolean;
  onApply?: (jobId: string) => void;
  onBookmark?: (jobId: string) => void;
  onCreateAlert?: () => void;
}

export function OpportunitiesPage({
  isEmpty = false,
  onApply,
  onBookmark,
  onCreateAlert,
}: OpportunitiesPageProps) {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [_filterDialogOpen, _setFilterDialogOpen] = useState(false);
  const [jobDetailDialogOpen, setJobDetailDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  // Filter state
  const [filters, _setFilters] = useState({
    location: '',
    jobType: [],
    remote: false,
    salaryMin: 0,
    salaryMax: 200000,
    matchScoreMin: 0,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, job: JobOpportunity) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleBookmark = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job))
    );
    onBookmark?.(jobId);
  };

  // Sample data
  const [jobs, setJobs] = useState<JobOpportunity[]>([
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc',
      location: 'San Francisco, CA',
      type: 'full-time',
      remote: true,
      salary: { min: 120000, max: 160000, currency: 'USD' },
      postedDate: '2 days ago',
      deadline: '2024-04-15',
      description: 'We are looking for a senior full stack developer...',
      requirements: ['React', 'Node.js', 'TypeScript', 'AWS'],
      benefits: ['Health Insurance', 'Stock Options', 'Remote Work'],
      matchScore: 95,
      isBookmarked: true,
      applicationStatus: 'not-applied',
      urgency: 'high',
      tags: ['React', 'Node.js', 'Remote'],
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      type: 'full-time',
      remote: false,
      salary: { min: 110000, max: 140000, currency: 'USD' },
      postedDate: '1 week ago',
      deadline: '2024-04-20',
      description: 'Lead product strategy and development...',
      requirements: ['Product Management', 'Agile', 'Analytics'],
      benefits: ['Bonus', 'PTO', 'Learning Budget'],
      matchScore: 87,
      isBookmarked: false,
      applicationStatus: 'applied',
      urgency: 'medium',
      tags: ['Product', 'Strategy', 'Leadership'],
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Austin, TX',
      type: 'contract',
      remote: true,
      salary: { min: 80000, max: 100000, currency: 'USD' },
      postedDate: '3 days ago',
      deadline: '2024-04-10',
      description: 'Create exceptional user experiences...',
      requirements: ['Figma', 'User Research', 'Prototyping'],
      benefits: ['Flexible Hours', 'Equipment Allowance'],
      matchScore: 92,
      isBookmarked: true,
      applicationStatus: 'interviewing',
      urgency: 'high',
      tags: ['Design', 'UX', 'Figma'],
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudFirst Solutions',
      location: 'Seattle, WA',
      type: 'full-time',
      remote: true,
      salary: { min: 105000, max: 135000, currency: 'USD' },
      postedDate: '5 days ago',
      deadline: '2024-04-25',
      description: 'Build and maintain cloud infrastructure...',
      requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      benefits: ['401k Match', 'Health Insurance', 'Gym Membership'],
      matchScore: 78,
      isBookmarked: false,
      applicationStatus: 'not-applied',
      urgency: 'low',
      tags: ['DevOps', 'AWS', 'Docker'],
    },
  ]);

  const getStatusColor = (jobStatus: JobOpportunity['applicationStatus']): ChipProps['color'] => {
    switch (jobStatus) {
      case 'applied':
        return 'info';
      case 'interviewing':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'offered':
        return 'success';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency: JobOpportunity['urgency']): ChipProps['color'] => {
    switch (urgency) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getMatchScoreColor = (score: number): LinearProgressProps['color'] => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'error';
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilters =
      job.matchScore >= filters.matchScoreMin &&
      job.salary.min >= filters.salaryMin &&
      job.salary.max <= (filters.salaryMax || 200000);

    return matchesSearch && matchesFilters;
  });

  const jobsByStatus = {
    all: filteredJobs,
    'not-applied': filteredJobs.filter((job) => job.applicationStatus === 'not-applied'),
    applied: filteredJobs.filter((job) => job.applicationStatus === 'applied'),
    interviewing: filteredJobs.filter((job) => job.applicationStatus === 'interviewing'),
    bookmarked: filteredJobs.filter((job) => job.isBookmarked),
  };

  const currentJobs =
    tabValue === 0
      ? jobsByStatus.all
      : tabValue === 1
        ? jobsByStatus['not-applied']
        : tabValue === 2
          ? jobsByStatus.applied
          : tabValue === 3
            ? jobsByStatus.interviewing
            : jobsByStatus.bookmarked;

  if (isEmpty) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              maxWidth: 500,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Work
                sx={{
                  fontSize: 80,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Discover Opportunities
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Set up job alerts and preferences to find personalized job opportunities that match
                your skills and career goals.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<Search />}
                sx={{
                  borderRadius: 20,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Search Jobs
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<NotificationsActive />}
                onClick={onCreateAlert}
                sx={{
                  borderRadius: 20,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Create Alert
              </Button>
            </Stack>

            <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Get started with:
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="Job Alerts" size="small" />
                <Chip label="Match Scoring" size="small" />
                <Chip label="Application Tracking" size="small" />
                <Chip label="Company Research" size="small" />
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            Job Opportunities
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<NotificationsActive />}
              onClick={() => setAlertDialogOpen(true)}
            >
              Job Alerts
            </Button>
            <Button variant="contained" startIcon={<Analytics />}>
              Market Insights
            </Button>
          </Stack>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Discover and track job opportunities tailored to your profile
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={6} sm={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {jobs.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Opportunities
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={6} sm={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="warning.main">
                {jobs.filter((j) => j.applicationStatus === 'not-applied').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Opportunities
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={6} sm={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="info.main">
                {jobs.filter((j) => j.applicationStatus === 'applied').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Applications Sent
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={6} sm={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {Math.round(jobs.reduce((sum, job) => sum + job.matchScore, 0) / jobs.length)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Match Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search jobs, companies, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{ borderRadius: 20 }}
          >
            Filters
          </Button>
          <Button variant="outlined" startIcon={<Sort />} sx={{ borderRadius: 20 }}>
            Sort
          </Button>
        </Stack>

        {selectedJobs.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">{selectedJobs.length} jobs selected</Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" startIcon={<Send />}>
                  Bulk Apply
                </Button>
                <Button size="small" startIcon={<Bookmark />}>
                  Bookmark All
                </Button>
                <Button size="small" startIcon={<Delete />} color="error">
                  Remove
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Job Tabs */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
            <Tab
              label={`All (${jobsByStatus.all.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`New (${jobsByStatus['not-applied'].length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`Applied (${jobsByStatus.applied.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`Interviewing (${jobsByStatus.interviewing.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab
              label={`Bookmarked (${jobsByStatus.bookmarked.length})`}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
          </Tabs>
        </Box>

        {/* Job List */}
        <TabPanel value={tabValue} index={tabValue}>
          <Box sx={{ p: 3 }}>
            {currentJobs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Work sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No jobs found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria or filters
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {currentJobs.map((job) => (
                  <Grid size={{ xs: 12, md: 6 }} key={job.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: selectedJobs.includes(job.id) ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Checkbox
                              checked={selectedJobs.includes(job.id)}
                              onChange={() => handleJobSelect(job.id)}
                              size="small"
                            />
                            <Avatar
                              src={job.company_logo}
                              sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                            >
                              {job.company.charAt(0)}
                            </Avatar>
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => handleBookmark(job.id)}>
                              {job.isBookmarked ? <Bookmark color="warning" /> : <BookmarkBorder />}
                            </IconButton>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, job)}>
                              <MoreVert />
                            </IconButton>
                          </Stack>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {job.title}
                          </Typography>
                          <Typography variant="subtitle1" color="primary.main" gutterBottom>
                            {job.company}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" color="disabled" />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                            </Typography>
                            {job.remote && <Chip label="Remote" size="small" color="info" />}
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Match Score
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {job.matchScore}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={job.matchScore}
                            color={getMatchScoreColor(job.matchScore)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                              label={job.type.replace('-', ' ')}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                            <Chip
                              label={`$${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}`}
                              size="small"
                              color="success"
                            />
                            {job.applicationStatus !== 'not-applied' && (
                              <Chip
                                label={job.applicationStatus}
                                size="small"
                                color={getStatusColor(job.applicationStatus)}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            )}
                            <Chip
                              label={job.urgency}
                              size="small"
                              color={getUrgencyColor(job.urgency)}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </Stack>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <Chip
                                key={index}
                                label={req}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                            {job.requirements.length > 3 && (
                              <Chip
                                label={`+${job.requirements.length - 3}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                          </Stack>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Posted {job.postedDate} • Deadline {job.deadline}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedJob(job);
                            setJobDetailDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                        {job.applicationStatus === 'not-applied' && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Send />}
                            onClick={() => onApply?.(job.id)}
                          >
                            Apply Now
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Job Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1.5 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1.5 }} />
          Share Job
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Analytics sx={{ mr: 1.5 }} />
          Company Research
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Flag sx={{ mr: 1.5 }} />
          Report Job
        </MenuItem>
      </Menu>

      {/* Job Details Dialog */}
      <Dialog
        open={jobDetailDialogOpen}
        onClose={() => setJobDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedJob?.title}</Typography>
            <IconButton onClick={() => setJobDetailDialogOpen(false)}>
              <Cancel />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h6" gutterBottom>
                  Job Description
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedJob.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Requirements
                </Typography>
                <List>
                  {selectedJob.requirements.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Benefits
                </Typography>
                <List>
                  {selectedJob.benefits.map((benefit, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Star color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Job Summary
                    </Typography>

                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Business />
                        </ListItemIcon>
                        <ListItemText primary="Company" secondary={selectedJob.company} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn />
                        </ListItemIcon>
                        <ListItemText primary="Location" secondary={selectedJob.location} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Work />
                        </ListItemIcon>
                        <ListItemText primary="Type" secondary={selectedJob.type} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney />
                        </ListItemIcon>
                        <ListItemText
                          primary="Salary"
                          secondary={`$${selectedJob.salary.min.toLocaleString()}-${selectedJob.salary.max.toLocaleString()}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Schedule />
                        </ListItemIcon>
                        <ListItemText primary="Deadline" secondary={selectedJob.deadline} />
                      </ListItem>
                    </List>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Match Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={selectedJob.matchScore}
                          sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {selectedJob.matchScore}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDetailDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<Bookmark />}>
            Bookmark
          </Button>
          <Button variant="contained" startIcon={<Send />}>
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Alert Dialog */}
      <Dialog
        open={alertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Job Alert</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="keywords"
                label="Keywords"
                placeholder="e.g., React, Product Manager, Designer"
                inputProps={{ 'data-testid': 'keywords-input' }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="location"
                label="Location"
                placeholder="e.g., San Francisco, Remote"
                inputProps={{ 'data-testid': 'location-input' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="job-type-label">Job Type</InputLabel>
                <Select
                  labelId="job-type-label"
                  id="job-type"
                  label="Job Type"
                  inputProps={{ 'data-testid': 'job-type-select' }}
                >
                  <MenuItem value="full-time">Full Time</MenuItem>
                  <MenuItem value="part-time">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="min-salary"
                label="Min Salary"
                type="number"
                placeholder="50000"
                inputProps={{
                  'data-testid': 'min-salary-input',
                  min: 0,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel control={<Checkbox />} label="Include remote positions" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Email notifications for new matches"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onCreateAlert}>
            Create Alert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create alert"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setAlertDialogOpen(true)}
      >
        <NotificationsActive />
      </Fab>
    </Container>
  );
}
