/**
 * ELECTRIC ALCHEMIST: NAVIGATION CONFIGURATION
 *
 * Navigation structure using lucide-react icons instead of MUI icons.
 * Uses Electric Alchemist design system tokens.
 */

import React from 'react';
import {
  Home,
  FolderOpen,
  UploadCloud,
  FileText,
  Mail,
  History,
  Wrench,
  Edit,
  Search,
  HelpingHand,
  Mic,
  TrendingUp,
  GraduationCap,
  Brain,
  BarChart3,
  CreditCard,
  User,
  Settings,
  Award,
  HelpCircle,
  LogOut,
  Clock,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  Calendar,
  Upload,
  Download,
  Pencil,
  Trash2,
  Share2,
  Sliders,
  FileText as Article,
  Folder as FolderShared,
} from 'lucide-react';

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
    icon: <Home size={20} />,
    path: '/dashboard',
    description: 'Overview and analytics',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FolderOpen size={20} />,
    path: '/documents',
    description: 'Resumes and cover letters',
    badge: 3,
    children: [
      {
        id: 'upload-new',
        label: 'Upload New',
        icon: <UploadCloud size={18} />,
        path: '/documents/upload',
      },
      {
        id: 'my-resumes',
        label: 'My Resumes',
        icon: <FileText size={18} />,
        path: '/documents/resumes',
      },
      {
        id: 'cover-letters',
        label: 'Cover Letters',
        icon: <Mail size={18} />,
        path: '/documents/cover-letters',
      },
      {
        id: 'recent-documents',
        label: 'Recent',
        icon: <History size={18} />,
        path: '/documents/recent',
      },
    ],
  },
  {
    id: 'career-tools',
    label: 'Career Tools',
    icon: <Wrench size={20} />,
    path: '/career-tools',
    description: 'AI-powered tools for your job search',
    children: [
      {
        id: 'resume-builder',
        label: 'Resume Builder',
        icon: <Edit size={18} />,
        path: '/career-tools/resume-builder',
        description: 'Build a professional resume',
      },
      {
        id: 'ats-analysis',
        label: 'ATS Analysis',
        icon: <Search size={18} />,
        path: '/career-tools/ats-analysis',
        description: 'Resume scoring and optimization',
      },
      {
        id: 'job-matching',
        label: 'Job Matching',
        icon: <HelpingHand size={18} />,
        path: '/career-tools/job-matching',
        description: 'AI-powered job recommendations',
      },
      {
        id: 'interview-prep',
        label: 'Interview Prep',
        icon: <Mic size={18} />,
        path: '/career-tools/interview-prep',
        description: 'Practice and feedback',
      },
    ],
  },
  {
    id: 'career-growth',
    label: 'Career Growth',
    icon: <TrendingUp size={20} />,
    path: '/career-growth',
    description: 'Tools for your career development',
    children: [
      {
        id: 'career-hub',
        label: 'Career Hub',
        icon: <GraduationCap size={18} />,
        path: '/career-growth/hub',
        description: 'Your career development center',
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: <Brain size={18} />,
        path: '/career-growth/skills',
        description: 'Develop new skills',
      },
      {
        id: 'industry-insights',
        label: 'Industry Insights',
        icon: <BarChart3 size={18} />,
        path: '/career-growth/insights',
        description: 'Stay up-to-date with industry trends',
      },
      {
        id: 'salary-data',
        label: 'Salary Data',
        icon: <CreditCard size={18} />,
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
    icon: <User size={20} />,
    path: '/profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={20} />,
    path: '/settings',
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: <Award size={20} />,
    path: '/subscription',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: <HelpCircle size={20} />,
    path: '/help',
  },
  {
    id: 'logout',
    label: 'Sign Out',
    icon: <LogOut size={20} />,
    path: '/logout',
    divider: true,
  },
];

export const statusIcons = {
  inProgress: <Clock size={20} />,
  needsReview: <AlertCircle size={20} />,
  completed: <CheckCircle2 size={20} />,
  saved: <Bookmark size={20} />,
  interviews: <Calendar size={20} />,
};

export const actionIcons = {
  upload: <Upload size={20} />,
  download: <Download size={20} />,
  edit: <Pencil size={20} />,
  delete: <Trash2 size={20} />,
  share: <Share2 size={20} />,
  search: <Search size={20} />,
  filter: <Sliders size={20} />,
};

export const documentIcons = {
  resume: <Article size={20} />,
  coverLetter: <Mail size={20} />,
  portfolio: <FolderShared size={20} />,
};
