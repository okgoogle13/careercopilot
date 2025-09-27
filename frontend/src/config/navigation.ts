import {
  Home,
  Folder,
  Upload,
  Description,
  Drafts,
  History,
  Build,
  EditDocument,
  Search,
  Handshake,
  Mic,
  TrendingUp,
  School,
  Psychology,
  Insights,
  Payments,
  AccountCircle,
  Person,
  Settings,
  WorkspacePremium,
  HelpOutline,
  Logout,
  Pending,
  ErrorOutline,
  CheckCircle,
  Bookmark,
  Event,
  UploadFile,
  Download,
  Edit,
  Delete,
  Share,
  Tune,
  Article,
  Drafts as DraftsIcon,
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
    icon: <Folder />,
    path: '/documents',
    children: [
      {
        label: 'Upload New',
        icon: <Upload />,
        path: '/documents/upload',
      },
      {
        label: 'My Resumes',
        icon: <Description />,
        path: '/documents/resumes',
      },
      {
        label: 'Cover Letters',
        icon: <DraftsIcon />,
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
    icon: <Build />,
    path: '/career-tools',
    children: [
      {
        label: 'Resume Builder',
        icon: <EditDocument />,
        path: '/career-tools/resume-builder',
      },
      {
        label: 'ATS Analysis',
        icon: <Search />,
        path: '/career-tools/ats-analysis',
      },
      {
        label: 'Job Matching',
        icon: <Handshake />,
        path: '/career-tools/job-matching',
      },
      {
        label: 'Interview Prep',
        icon: <Mic />,
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
  saved: <Bookmark />,
  interviews: <Event />,
};

export const actionIcons = {
  upload: <UploadFile />,
  download: <Download />,
  edit: <Edit />,
  delete: <Delete />,
  share: <Share />,
  search: <Search />,
  filter: <Tune />,
};

export const documentIcons = {
  resume: <Article />,
  coverLetter: <DraftsIcon />,
  portfolio: <FolderShared />,
};
