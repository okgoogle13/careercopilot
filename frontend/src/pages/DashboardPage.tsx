import {
  Add,
  Analytics,
  CheckCircle,
  Delete,
  Description,
  Download,
  Edit,
  MoreVert,
  Schedule,
  Share,
  Speed,
  TrendingUp,
  Warning,
  Work,
} from '@mui/icons-material';
import type {
  ChipProps} from '@mui/material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  // Grid removed; use GridCompat wrapper for legacy `size` and responsive props
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import GridCompat from '@/components/ui/GridCompat';

interface Profile {
  id: string;
  name: string;
  role: string;
  lastUpdated: string;
  atsScore: number;
  status: 'active' | 'draft' | 'pending';
  applications: number;
}

interface RecentActivity {
  id: string;
  action: string;
  document: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DashboardPageProps {
  isEmpty?: boolean;
  onCreateDocument?: () => void;
  onEditProfile?: (profile: Profile) => void;
}

export function DashboardPage({
  isEmpty = false,
  onCreateDocument,
  onEditProfile,
}: DashboardPageProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, profile: Profile) => {
    setAnchorEl(event.currentTarget);
    setSelectedProfile(profile);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProfile(null);
  };

  // Sample data
  const profiles: Profile[] = [
    {
      id: '1',
      name: 'Senior Software Developer',
      role: 'Technology',
      lastUpdated: '2 hours ago',
      atsScore: 85,
      status: 'active',
      applications: 5,
    },
    {
      id: '2',
      name: 'Product Manager',
      role: 'Product',
      lastUpdated: '1 day ago',
      atsScore: 92,
      status: 'active',
      applications: 3,
    },
    {
      id: '3',
      name: 'UX Designer',
      role: 'Design',
      lastUpdated: '3 days ago',
      atsScore: 78,
      status: 'draft',
      applications: 0,
    },
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      action: 'Resume updated',
      document: 'Senior Software Developer',
      timestamp: '2 hours ago',
      status: 'completed',
    },
    {
      id: '2',
      action: 'Application submitted',
      document: 'Product Manager',
      timestamp: '1 day ago',
      status: 'completed',
    },
    {
      id: '3',
      action: 'ATS analysis',
      document: 'UX Designer',
      timestamp: '3 days ago',
      status: 'pending',
    },
  ];

  const getStatusColor = (profileStatus: Profile['status']): ChipProps['color'] => {
    switch (profileStatus) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const getActivityIcon = (activityStatus: RecentActivity['status']) => {
    switch (activityStatus) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Schedule color="warning" />;
      case 'failed':
        return <Warning color="error" />;
      default:
        return <Schedule />;
    }
  };

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
              <Description
                sx={{
                  fontSize: 80,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Welcome to CareerCopilot
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Create your first AI-powered resume or cover letter to get started with your job
                search journey.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={onCreateDocument}
              sx={{
                borderRadius: 20,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Create Your First Document
            </Button>

            <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                What you can create:
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="AI Resume" size="small" />
                <Chip label="Cover Letter" size="small" />
                <Chip label="Selection Criteria" size="small" />
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
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateDocument}
            sx={{ borderRadius: 20 }}
          >
            Create Document
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your profiles and track your job application progress
        </Typography>
      </Box>

      {/* Stats Cards */}
      <GridCompat container spacing={3} sx={{ mb: 4 }}>
        <GridCompat xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Description color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  3
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active Profiles
              </Typography>
            </CardContent>
          </Card>
        </GridCompat>

        <GridCompat xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Work color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  8
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Applications
              </Typography>
            </CardContent>
          </Card>
        </GridCompat>

        <GridCompat xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  85%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Avg ATS Score
              </Typography>
            </CardContent>
          </Card>
        </GridCompat>

        <GridCompat xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  12%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Response Rate
              </Typography>
            </CardContent>
          </Card>
        </GridCompat>
      </GridCompat>

      <GridCompat container spacing={4}>
        {/* Profiles Section */}
        <GridCompat xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="h6" fontWeight={600}>
                Your Profiles
              </Typography>
              <Button size="small" startIcon={<Analytics />} sx={{ borderRadius: 20 }}>
                View Analytics
              </Button>
            </Box>

            <GridCompat container spacing={2}>
              {profiles.map((profile) => (
                <GridCompat xs={12} md={6} key={profile.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: 1,
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 40,
                              height: 40,
                              mr: 2,
                              fontSize: '1rem',
                            }}
                          >
                            {profile.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {profile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {profile.role}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, profile)}>
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            ATS Score
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {profile.atsScore}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={profile.atsScore}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'action.hover',
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Chip
                          label={profile.status}
                          size="small"
                          color={getStatusColor(profile.status)}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {profile.applications} apps
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Updated {profile.lastUpdated}
                          </Typography>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </GridCompat>
              ))}
            </GridCompat>
          </Paper>
        </GridCompat>

        {/* Recent Activity */}
        <GridCompat xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Recent Activity
            </Typography>

            <List disablePadding>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getActivityIcon(activity.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.document}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>

            <Button fullWidth variant="outlined" size="small" sx={{ mt: 2, borderRadius: 20 }}>
              View All Activity
            </Button>
          </Paper>

          {/* Quick Actions */}
          <Paper
            elevation={0}
            sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, mt: 3 }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Quick Actions
            </Typography>

            <Stack spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                sx={{ borderRadius: 20, justifyContent: 'flex-start' }}
                onClick={onCreateDocument}
              >
                Create New Document
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Analytics />}
                sx={{ borderRadius: 20, justifyContent: 'flex-start' }}
              >
                Run ATS Analysis
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Work />}
                sx={{ borderRadius: 20, justifyContent: 'flex-start' }}
              >
                Find Job Opportunities
              </Button>
            </Stack>
          </Paper>
        </GridCompat>
      </GridCompat>
      {/* Profile Menu */}
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
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEditProfile?.(selectedProfile!);
          }}
        >
          <Edit sx={{ mr: 1.5 }} />
          Edit Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 1.5 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1.5 }} />
          Share
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
}
