import { Article as ArticleIcon, Add as AddIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { useState } from 'react';

import type { DashboardTab } from '../../../types';

import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardStats } from './dashboard/DashboardStats';
import { ProfileGrid } from './dashboard/ProfileGrid';

interface Profile {
  id: string;
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Nishant Dougall',
    role: 'Community Support Worker',
    activeApplications: 8,
    atsScore: 87,
    lastUpdated: '2 days ago',
    avatarColor: '#e2b8ff',
  },
  {
    id: '2',
    name: 'Nishant Dougall',
    role: 'Peer Worker',
    activeApplications: 5,
    atsScore: 92,
    lastUpdated: '1 week ago',
    avatarColor: '#d4fb7f',
  },
];

// Mock data for profile variations
const profileVariations = [
  {
    id: '1',
    profile_name: 'Software Engineer Profile',
    keyword_count: 45,
    last_modified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    is_default: true,
  },
  {
    id: '2',
    profile_name: 'Data Scientist Profile',
    keyword_count: 38,
    last_modified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    is_default: false,
  },
];

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
  const [profiles, setProfiles] = useState(isEmpty ? [] : mockProfiles);

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  // Empty state for first-time users
  if (isEmpty || profiles.length === 0) {
    return (
      <div sx={{
      flex: 1,
      p: 8
    }}>
        <DashboardHeader
          title="Welcome to Career Copilot"
          onNavigateToSettings={onNavigateToSettings}
          onCreateProfile={onCreateProfile}
          showCreateButton={false}
          isEmpty={true}
        />

        <div sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      h: "60vh",
      textAlign: "center"
    }}>
          <div sx={{
      borderRadius: "var(--sys-shape-radius-full)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 6
    }}>
            <ArticleIcon sx={{}} />
          </div>

          <h2 sx={{
      typography: "h4",
      fontWeight: 600,
      mb: 3
    }}>Your Dashboard is Empty</h2>
          <p sx={{
      typography: "h6",
      mb: 8,
      maxWidth: "md"
    }}>
            Create your first document to get started with AI-powered job applications.
          </p>

          <Button
            onClick={() => onCreateProfile?.()}
            sx={{
      '&:hover': {},
      px: 8,
      py: 6,
      typography: "h6"
    }}
            size="large"
          >
            <AddIcon sx={{
      mr: 2
    }} />
            Create Your First Document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div sx={{
      flex: 1,
      p: 8
    }}>
      <DashboardHeader
        title="Your Job Seeker Profiles"
        onCreateProfile={onCreateProfile}
        onNavigateToSettings={onNavigateToSettings}
        isEmpty={false}
      />

      <DashboardStats />

      <ProfileGrid
        profiles={profiles}
        profileVariations={profileVariations}
        onCreateProfile={onCreateProfile}
        onEditProfile={onEditProfile}
        onDeleteProfile={handleDeleteProfile}
        onNavigateToCareerGrowth={onNavigateToCareerGrowth}
      />
    </div>
  );
}
