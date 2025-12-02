/**
 * Dashboard Page
 * Main dashboard with profiles, stats, and recent activity
 * Migrated to Electric Alchemist Design System v4.2
 */

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
import React, { useState } from 'react';

import {
  Container,
  Card,
  Button,
  Badge,
  Avatar,
  Progress,
  Divider,
  Grid,
  Popover,
} from '../components/electric';

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

  const getStatusVariant = (
    profileStatus: Profile['status']
  ): 'primary' | 'secondary' | 'outline' | 'ghost' => {
    switch (profileStatus) {
      case 'active':
        return 'primary';
      case 'draft':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'ghost';
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
      <Container size="lg">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8">
          <Card variant="default" className="max-w-lg p-12">
            <div className="mb-8">
              <Description
                sx={{ fontSize: 80, color: '#D0BCFF', mb: 2 }}
                className="mb-4"
              />
              <h1 className="text-hero text-hero-sm mb-4">Welcome to CareerCopilot</h1>
              <p className="text-human text-outline mb-8">
                Create your first AI-powered resume or cover letter to get started with your job
                search journey.
              </p>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={onCreateDocument}
              className="px-8 py-3"
            >
              <Add className="mr-2" />
              Create Your First Document
            </Button>

            <div className="mt-8 pt-8 border-t border-outline-variant">
              <p className="text-ai text-outline mb-3">What you can create:</p>
              <div className="flex flex-row gap-2 justify-center flex-wrap">
                <Badge variant="secondary">AI Resume</Badge>
                <Badge variant="secondary">Cover Letter</Badge>
                <Badge variant="secondary">Selection Criteria</Badge>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container size="2xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-hero text-hero-sm">Dashboard</h1>
            <Button variant="default" onClick={onCreateDocument}>
              <Add className="mr-2" />
              Create Document
            </Button>
          </div>
          <p className="text-ai text-outline">
            Manage your profiles and track your job application progress
          </p>
        </div>

        {/* Stats Cards */}
        <Grid cols={4} gap="md" className="mb-8">
          <Card variant="default">
            <div className="flex items-center mb-4">
              <Description sx={{ color: '#D0BCFF', mr: 1 }} />
              <h2 className="text-hero text-hero-xs">3</h2>
            </div>
            <p className="text-ai text-outline">Active Profiles</p>
          </Card>

          <Card variant="default">
            <div className="flex items-center mb-4">
              <Work sx={{ color: '#81C784', mr: 1 }} />
              <h2 className="text-hero text-hero-xs">8</h2>
            </div>
            <p className="text-ai text-outline">Applications</p>
          </Card>

          <Card variant="default">
            <div className="flex items-center mb-4">
              <Speed sx={{ color: '#FFB74D', mr: 1 }} />
              <h2 className="text-hero text-hero-xs">85%</h2>
            </div>
            <p className="text-ai text-outline">Avg ATS Score</p>
          </Card>

          <Card variant="default">
            <div className="flex items-center mb-4">
              <TrendingUp sx={{ color: '#64B5F6', mr: 1 }} />
              <h2 className="text-hero text-hero-xs">12%</h2>
            </div>
            <p className="text-ai text-outline">Response Rate</p>
          </Card>
        </Grid>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profiles Section */}
          <div className="lg:col-span-2">
            <Card variant="default" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-hero text-hero-xs">Your Profiles</h2>
                <Button variant="outline" size="sm">
                  <Analytics className="mr-2" />
                  View Analytics
                </Button>
              </div>

              <Grid cols={2} gap="md">
                {profiles.map((profile) => (
                  <Card
                    key={profile.id}
                    variant="default"
                    interactive
                    className="transition-all duration-200 hover:border-primary"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <Avatar
                          size="md"
                          fallback={profile.name.charAt(0)}
                          className="mr-3"
                        />
                        <div>
                          <h3 className="text-ai font-semibold">{profile.name}</h3>
                          <p className="text-ai text-outline text-sm">{profile.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleMenuOpen(e, profile)}
                      >
                        <MoreVert />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-ai text-outline text-sm">ATS Score</span>
                        <span className="text-ai font-semibold text-sm">{profile.atsScore}%</span>
                      </div>
                      <Progress value={profile.atsScore} max={100} />
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge
                        variant={getStatusVariant(profile.status)}
                        className="capitalize"
                      >
                        {profile.status}
                      </Badge>
                      <div className="flex gap-3 items-center">
                        <span className="text-data text-sm">{profile.applications} apps</span>
                        <span className="text-data text-sm">Updated {profile.lastUpdated}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="flex flex-col gap-6">
            {/* Recent Activity */}
            <Card variant="default" className="p-6">
              <h2 className="text-hero text-hero-xs mb-6">Recent Activity</h2>

              <div className="flex flex-col">
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <div className="flex gap-4 py-3">
                      <div className="min-w-[40px]">{getActivityIcon(activity.status)}</div>
                      <div className="flex-1">
                        <p className="text-ai font-medium mb-1">{activity.action}</p>
                        <p className="text-ai text-outline text-sm mb-1">{activity.document}</p>
                        <span className="text-data text-sm">{activity.timestamp}</span>
                      </div>
                    </div>
                    {index < recentActivity.length - 1 && (
                      <Divider className="my-2" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Activity
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card variant="default" className="p-6">
              <h2 className="text-hero text-hero-xs mb-6">Quick Actions</h2>

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={onCreateDocument}
                  className="w-full justify-start"
                >
                  <Add className="mr-2" />
                  Create New Document
                </Button>
                <Button variant="outline" size="md" className="w-full justify-start">
                  <Analytics className="mr-2" />
                  Run ATS Analysis
                </Button>
                <Button variant="outline" size="md" className="w-full justify-start">
                  <Work className="mr-2" />
                  Find Job Opportunities
                </Button>
              </div>
            </Card>
          </div>
        </div>
        {/* Profile Menu */}
        <Popover
          trigger={<div />}
          content={
            <div className="flex flex-col gap-2 min-w-[200px]">
              <button
                onClick={() => {
                  handleMenuClose();
                  onEditProfile?.(selectedProfile!);
                }}
                className="flex items-center gap-3 px-4 py-2 text-ai hover:bg-surface-container transition-colors rounded-sm"
              >
                <Edit sx={{ fontSize: 20 }} />
                Edit Profile
              </button>
              <button
                onClick={handleMenuClose}
                className="flex items-center gap-3 px-4 py-2 text-ai hover:bg-surface-container transition-colors rounded-sm"
              >
                <Download sx={{ fontSize: 20 }} />
                Download
              </button>
              <button
                onClick={handleMenuClose}
                className="flex items-center gap-3 px-4 py-2 text-ai hover:bg-surface-container transition-colors rounded-sm"
              >
                <Share sx={{ fontSize: 20 }} />
                Share
              </button>
              <Divider className="my-1" />
              <button
                onClick={handleMenuClose}
                className="flex items-center gap-3 px-4 py-2 text-ai text-red-400 hover:bg-surface-container transition-colors rounded-sm"
              >
                <Delete sx={{ fontSize: 20 }} />
                Delete
              </button>
            </div>
          }
          open={Boolean(anchorEl)}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleMenuClose();
          }}
        />
      </div>
    </Container>
  );
}
