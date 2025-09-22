import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Description,
  Settings,
  Person,
  Email,
  TrendingUp,
  Work,
  Edit,
  Delete,
  Star,
} from '@mui/icons-material';

// Types
interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

interface DashboardTab {
  id: string;
  label: string;
}

interface DashboardProps {
  onCreateProfile?: () => void;
  onCreateDocument?: () => void;
  onEditProfile: (profile: Profile) => void;
  onNavigateToCareerGrowth?: () => void;
  onNavigateToSettings?: () => void;
  onTabChange?: (tab: DashboardTab) => void;
  activeTab?: DashboardTab;
  onCareerGrowthClick?: () => void;
  isEmpty?: boolean;
}

export function Dashboard({
  onCreateProfile,
  onCreateDocument,
  onEditProfile,
  onTabChange,
  activeTab,
  onCareerGrowthClick,
  onNavigateToCareerGrowth,
  onNavigateToSettings,
  isEmpty = false,
}: DashboardProps) {
  const theme = useTheme();

  // Mock profiles data with theme-aware colors
  const mockProfiles: Profile[] = [
    {
      id: '1',
      name: 'Nishant Dougall',
      role: 'Community Support Worker',
      activeApplications: 8,
      atsScore: 87,
      lastUpdated: '2 days ago',
      avatarColor: theme.palette.secondary.main,
    },
    {
      id: '2',
      name: 'Nishant Dougall',
      role: 'Peer Worker',
      activeApplications: 5,
      atsScore: 92,
      lastUpdated: '1 week ago',
      avatarColor: theme.palette.success.main,
    },
  ];

  const [profiles, setProfiles] = useState(isEmpty ? [] : mockProfiles);
  const [jobDescription, setJobDescription] = useState('');
  const [isPreparingApplication, setIsPreparingApplication] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [isScanningEmails, setIsScanningEmails] = useState(false);
  const [emailScanError, setEmailScanError] = useState('');

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  const handlePrepareApplication = async () => {
    if (!jobDescription.trim()) {
      setApplicationError('Please enter a job description');
      return;
    }

    setIsPreparingApplication(true);
    setApplicationError('');

    // Simulate API call
    setTimeout(() => {
      setJobDescription('');
      setIsPreparingApplication(false);
      // In real app, this would show a success notification
    }, 2000);
  };

  const handleScanEmails = async () => {
    setIsScanningEmails(true);
    setEmailScanError('');

    // Simulate API call
    setTimeout(() => {
      setIsScanningEmails(false);
      // In real app, this would show scan results
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Empty state for first-time users
  if (isEmpty || profiles.length === 0) {
    return (
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              Welcome to Career Copilot
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={onNavigateToSettings} size="small">
              <Settings />
            </IconButton>
            <Avatar sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
              <Person />
            </Avatar>
          </Stack>
        </Stack>

        {/* Empty State */}
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
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.primary.main + '20',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Description sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          </Box>

          <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
            Your Dashboard is Empty
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
            Create your first document to get started with AI-powered job applications.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={onCreateProfile}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            Create Your First Document
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Your Job Seeker Profiles
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">ATS Analysis</Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateProfile}
          >
            Create Document
          </Button>
          <IconButton onClick={onNavigateToSettings} size="small">
            <Settings />
          </IconButton>
          <Avatar sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
            <Person />
          </Avatar>
        </Stack>
      </Stack>

      {/* Dashboard Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* One-Click Application Prep Card */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.info.light}20 0%, ${theme.palette.info.main}20 100%)`,
              border: `1px solid ${theme.palette.info.light}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: theme.palette.info.light + '40',
                      borderRadius: 2,
                    }}
                  >
                    <Work sx={{ color: theme.palette.info.main }} />
                  </Box>
                  <Typography variant="h6" fontWeight="600" sx={{ color: theme.palette.info.dark }}>
                    One-Click Application Prep
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: theme.palette.info.dark }}>
                  Generate a complete application package including tailored resume, cover letter, and
                  KSC responses.
                </Typography>

                <TextField
                  multiline
                  rows={4}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isPreparingApplication}
                  variant="outlined"
                  fullWidth
                />

                {applicationError && (
                  <Alert severity="error" sx={{ py: 0 }}>
                    {applicationError}
                  </Alert>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={isPreparingApplication || !jobDescription.trim()}
                  onClick={handlePrepareApplication}
                  sx={{
                    bgcolor: theme.palette.info.main,
                    '&:hover': { bgcolor: theme.palette.info.dark },
                  }}
                  startIcon={
                    isPreparingApplication ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Work />
                    )
                  }
                >
                  {isPreparingApplication
                    ? 'Preparing Application Package...'
                    : 'Prepare Application Package'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Scanning Card */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.light}20 0%, ${theme.palette.success.main}20 100%)`,
              border: `1px solid ${theme.palette.success.light}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: theme.palette.success.light + '40',
                      borderRadius: 2,
                    }}
                  >
                    <Email sx={{ color: theme.palette.success.main }} />
                  </Box>
                  <Typography variant="h6" fontWeight="600" sx={{ color: theme.palette.success.dark }}>
                    Scan Inbox for Jobs
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: theme.palette.success.dark }}>
                  Automatically scan your email for job opportunities and create calendar tasks for
                  high-scoring matches.
                </Typography>

                {emailScanError && (
                  <Alert severity="error" sx={{ py: 0 }}>
                    {emailScanError}
                  </Alert>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={isScanningEmails}
                  onClick={handleScanEmails}
                  sx={{
                    bgcolor: theme.palette.success.main,
                    '&:hover': { bgcolor: theme.palette.success.dark },
                  }}
                  startIcon={
                    isScanningEmails ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Email />
                    )
                  }
                >
                  {isScanningEmails ? 'Scanning Inbox...' : 'Scan Inbox for Opportunities'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Variations Section */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
          Your Profile Variations
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No profile variations yet
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={onCreateProfile}>
            Create Your First Profile
          </Button>
        </Box>
      </Card>

      {/* Profile Cards Grid */}
      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} md={6} lg={4} key={profile.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Avatar
                      sx={{
                        bgcolor: profile.avatarColor,
                        width: 48,
                        height: 48,
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => onEditProfile(profile)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteProfile(profile.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.role}
                    </Typography>
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Active Applications
                      </Typography>
                      <Typography variant="h6" fontWeight="600">
                        {profile.activeApplications}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        ATS Score
                      </Typography>
                      <Chip
                        label={`${profile.atsScore}%`}
                        size="small"
                        sx={{
                          bgcolor: getScoreColor(profile.atsScore) + '20',
                          color: getScoreColor(profile.atsScore),
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    Last updated: {profile.lastUpdated}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Create Profile Card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              height: '100%',
              border: `2px dashed ${theme.palette.divider}`,
              bgcolor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: theme.palette.primary.main + '05',
              },
            }}
            onClick={onCreateProfile}
          >
            <CardContent>
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ height: '100%', minHeight: 200 }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: theme.palette.primary.main + '20',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Add sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h6" fontWeight="600" color="primary">
                  Create New Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Build a new job seeker profile for different roles
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Career Growth Card */}
        {onNavigateToCareerGrowth && (
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
                border: `1px solid ${theme.palette.primary.main}40`,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={onNavigateToCareerGrowth}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: theme.palette.primary.main + '20',
                        borderRadius: 2,
                      }}
                    >
                      <TrendingUp sx={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Typography variant="h6" fontWeight="600">
                      Career Growth
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Explore AI-powered career insights, job matching, and interview preparation tools.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<Star />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Explore Tools
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}