import React from 'react';
import {
  Home,
  FolderOpen,
  CloudUpload,
  Description,
  Mail,
  History,
  Construction,
  EditNote,
  ManageSearch,
  HandshakeOutlined,
  RecordVoiceOver,
  TrendingUp,
  School,
  Psychology,
  Insights,
  Payments,
  Person,
  Settings,
  WorkspacePremium,
  HelpOutline,
  Logout,
  Pending,
  ErrorOutline,
  CheckCircle,
  BookmarkBorder,
  Event,
  FileUpload,
  FileDownload,
  Edit,
  Delete,
  Share,
  Tune,
  Article,
  FolderShared,
} from '@mui/icons-material';

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
  divider?: boolean;
  permission?: string;
}

export const mainNavigation: NavItem[] = [
  {
    label: 'Home',
    icon: <Home />,
    path: '/dashboard',
  },
  {
    label: 'Documents',
    icon: <FolderOpen />,
    path: '/documents',
    children: [
      {
        label: 'Upload New',
        icon: <CloudUpload />,
        path: '/documents/upload',
      },
      {
        label: 'My Resumes',
        icon: <Description />,
        path: '/documents/resumes',
      },
      {
        label: 'Cover Letters',
        icon: <Mail />,
        path: '/documents/cover-letters',
      },
      {
        label: 'Recent',
        icon: <History />,
        path: '/documents/recent',
      },
    ],
  },
  {
    label: 'Career Tools',
    icon: <Construction />,
    path: '/career-tools',
    children: [
      {
        label: 'Resume Builder',
        icon: <EditNote />,
        path: '/career-tools/resume-builder',
      },
      {
        label: 'ATS Analysis',
        icon: <ManageSearch />,
        path: '/career-tools/ats-analysis',
      },
      {
        label: 'Job Matching',
        icon: <HandshakeOutlined />,
        path: '/career-tools/job-matching',
      },
      {
        label: 'Interview Prep',
        icon: <RecordVoiceOver />,
        path: '/career-tools/interview-prep',
      },
    ],
  },
  {
    label: 'Career Growth',
    icon: <TrendingUp />,
    path: '/career-growth',
    children: [
      {
        label: 'Career Hub',
        icon: <School />,
        path: '/career-growth/hub',
      },
      {
        label: 'Skills',
        icon: <Psychology />,
        path: '/career-growth/skills',
      },
      {
        label: 'Industry Insights',
        icon: <Insights />,
        path: '/career-growth/insights',
      },
      {
        label: 'Salary Data',
        icon: <Payments />,
        path: '/career-growth/salary-data',
      },
    ],
  },
];

export const userNavigation: NavItem[] = [
  {
    label: 'Profile',
    icon: <Person />,
    path: '/profile',
  },
  {
    label: 'Settings',
    icon: <Settings />,
    path: '/settings',
  },
  {
    label: 'Subscription',
    icon: <WorkspacePremium />,
    path: '/subscription',
  },
  {
    label: 'Help & Support',
    icon: <HelpOutline />,
    path: '/help',
  },
  {
    label: 'Sign Out',
    icon: <Logout />,
    path: '/logout',
    divider: true,
  },
];

export const statusIcons = {
  inProgress: <Pending />,
  needsReview: <ErrorOutline />,
  completed: <CheckCircle />,
  saved: <BookmarkBorder />,
  interviews: <Event />,
};

export const actionIcons = {
  upload: <FileUpload />,
  download: <FileDownload />,
  edit: <Edit />,
  delete: <Delete />,
  share: <Share />,
  search: <ManageSearch />,
  filter: <Tune />,
};

export const documentIcons = {
  resume: <Article />,
  coverLetter: <Mail />,
  portfolio: <FolderShared />,
};
