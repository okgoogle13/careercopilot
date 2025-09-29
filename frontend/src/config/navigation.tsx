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
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
  divider?: boolean;
  permission?: string;
  description?: string;
  badge?: string | number;
}

export const mainNavigation: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home />,
    path: '/dashboard',
    description: 'Overview and analytics',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FolderOpen />,
    path: '/documents',
    description: 'Resumes and cover letters',
    badge: 3,
    children: [
      {
        id: 'upload-new',
        label: 'Upload New',
        icon: <CloudUpload />,
        path: '/documents/upload',
      },
      {
        id: 'my-resumes',
        label: 'My Resumes',
        icon: <Description />,
        path: '/documents/resumes',
      },
      {
        id: 'cover-letters',
        label: 'Cover Letters',
        icon: <Mail />,
        path: '/documents/cover-letters',
      },
      {
        id: 'recent-documents',
        label: 'Recent',
        icon: <History />,
        path: '/documents/recent',
      },
    ],
  },
  {
    id: 'career-tools',
    label: 'Career Tools',
    icon: <Construction />,
    path: '/career-tools',
    description: 'AI-powered tools for your job search',
    children: [
      {
        id: 'resume-builder',
        label: 'Resume Builder',
        icon: <EditNote />,
        path: '/career-tools/resume-builder',
        description: 'Build a professional resume',
      },
      {
        id: 'ats-analysis',
        label: 'ATS Analysis',
        icon: <ManageSearch />,
        path: '/career-tools/ats-analysis',
        description: 'Resume scoring and optimization',
      },
      {
        id: 'job-matching',
        label: 'Job Matching',
        icon: <HandshakeOutlined />,
        path: '/career-tools/job-matching',
        description: 'AI-powered job recommendations',
      },
      {
        id: 'interview-prep',
        label: 'Interview Prep',
        icon: <RecordVoiceOver />,
        path: '/career-tools/interview-prep',
        description: 'Practice and feedback',
      },
    ],
  },
  {
    id: 'career-growth',
    label: 'Career Growth',
    icon: <TrendingUp />,
    path: '/career-growth',
    description: 'Tools for your career development',
    children: [
      {
        id: 'career-hub',
        label: 'Career Hub',
        icon: <School />,
        path: '/career-growth/hub',
        description: 'Your career development center',
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: <Psychology />,
        path: '/career-growth/skills',
        description: 'Develop new skills',
      },
      {
        id: 'industry-insights',
        label: 'Industry Insights',
        icon: <Insights />,
        path: '/career-growth/insights',
        description: 'Stay up-to-date with industry trends',
      },
      {
        id: 'salary-data',
        label: 'Salary Data',
        icon: <Payments />,
        path: '/career-growth/salary-data',
        description: 'Know your worth',
      },
    ],
  },
];

export const userNavigation: NavItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <Person />,
    path: '/profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    path: '/settings',
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: <WorkspacePremium />,
    path: '/subscription',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: <HelpOutline />,
    path: '/help',
  },
  {
    id: 'logout',
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
