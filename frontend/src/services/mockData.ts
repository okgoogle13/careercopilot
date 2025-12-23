
export interface Application {
  id: number | string;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  currentStep: number;
  steps: string[];
  // ATS Profile fields
  atsScore?: number;
  atsStatus?: string;
}

export type DocumentType = 'resume' | 'cover' | 'ksc';

export interface Document {
  id: number | string;
  name: string;
  type: DocumentType;
  date: string;
  icon: string;
  status: 'Ready' | 'Draft' | 'Review';
}

export interface KSCResponse {
  id: number | string;
  criteria: string;
  response: string;
  dateGenerated: string;
}

export interface UserStats {
  activeApplications: number;
  offersReceived: number;
  connections: number;
  upcomingInterviews: number;
}

export interface AnalysisData {
  atsScoreHistory: { month: string; score: number }[];
  applicationStatus: { name: string; value: number; color: string }[];
  keywordMatch: { keyword: string; rate: number }[];
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface Experience {
  role: string;
  company: string;
  date: string;
  description: string;
}

export interface UserProfile {
  name: string;
  role: string;
  title: string;
  location: string;
  email: string;
  website: string;
  experience: Experience[];
  skills: string[];
}

export interface Opportunity {
  id: number | string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  tags: string[];
  postedDate: string;
  description: string;
  salaryRange: string;
  isRemote: boolean;
  isFavorited: boolean;
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    appliedDate: '2 days ago',
    currentStep: 3,
    steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    atsScore: 92,
    atsStatus: 'Excellent'
  },
  {
    id: 2,
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Remote',
    appliedDate: '5 days ago',
    currentStep: 2,
    steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    atsScore: 85,
    atsStatus: 'Good'
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    appliedDate: '1 week ago',
    currentStep: 1,
    steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    atsScore: 78,
    atsStatus: 'Fair'
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'CodeFactory',
    location: 'Austin, TX',
    appliedDate: '3 days ago',
    currentStep: 2,
    steps: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted'],
    atsScore: 88,
    atsStatus: 'Good'
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 1,
    name: 'Software Engineer Resume',
    type: 'resume',
    date: 'Updated 2 days ago',
    icon: '📄',
    status: 'Ready'
  },
  {
    id: 2,
    name: 'Cover Letter - TechCorp',
    type: 'cover',
    date: 'Updated 3 days ago',
    icon: '📝',
    status: 'Draft'
  },
  {
    id: 3,
    name: 'UX Designer Resume',
    type: 'resume',
    date: 'Updated 1 week ago',
    icon: '📄',
    status: 'Ready'
  },
  {
    id: 4,
    name: 'Product Manager Resume',
    type: 'resume',
    date: 'Updated 1 week ago',
    icon: '📄',
    status: 'Review'
  },
  {
    id: 5,
    name: 'Cover Letter - DesignHub',
    type: 'cover',
    date: 'Updated 5 days ago',
    icon: '📝',
    status: 'Draft'
  },
  {
    id: 6,
    name: 'Generic Cover Letter',
    type: 'cover',
    date: 'Updated 2 weeks ago',
    icon: '📝',
    status: 'Ready'
  },
  {
    id: 7,
    name: 'KSC Response - Leadership',
    type: 'ksc',
    date: 'Updated 4 days ago',
    icon: '📋',
    status: 'Review'
  },
  {
    id: 8,
    name: 'KSC Response - Communication',
    type: 'ksc',
    date: 'Updated 1 week ago',
    icon: '📋',
    status: 'Ready'
  },
];

export const MOCK_USER_STATS: UserStats = {
  activeApplications: 8,
  offersReceived: 2,
  connections: 45,
  upcomingInterviews: 3
};

export const MOCK_KSC_RESPONSES: KSCResponse[] = [];

export const MOCK_ANALYSIS_DATA: AnalysisData = {
  atsScoreHistory: [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 83 },
    { month: 'Mar', score: 84 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 86 },
    { month: 'Jun', score: 87 },
  ],
  applicationStatus: [
    { name: 'Applied', value: 40, color: '#D0BCFF' },
    { name: 'Interviewing', value: 30, color: '#A8C5A3' },
    { name: 'Rejected', value: 20, color: '#E07A5F' },
    { name: 'Offered', value: 10, color: '#F4D06F' },
  ],
  keywordMatch: [
    { keyword: 'React.js', rate: 5 },
    { keyword: 'TypeScript', rate: 2 },
    { keyword: 'JavaScript', rate: 4 },
    { keyword: 'Node.js', rate: 3 },
    { keyword: 'Python', rate: 2 },
  ],
  matchedKeywords: [
    'Community Support', 'Case Management', 'Communication', 'Market Health',
    'Documentation', 'Accessibility', 'Accommodation', 'Data Monitoring'
  ],
  missingKeywords: [
    'React.js', 'Typescript', 'Learning Programs', 'Node.js', 'Data Analysis', 'Jira', 'Mentorship'
  ]
};

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Nishant J.',
  role: 'Premium User',
  title: 'Senior Full Stack Engineer',
  location: 'San Francisco, CA',
  email: 'nishant@example.com',
  website: 'github.com/nishant',
  experience: [
    {
      role: 'Senior Frontend Engineer',
      company: 'Tech Corp Inc.',
      date: '2022 - Present',
      description: 'Leading the frontend architecture migration to React 18 and Next.js. Improved performance by 40%'
    },
    {
      role: 'Software Developer',
      company: 'StartUp Studio',
      date: '2020 - 2022',
      description: 'Built and shipped 3 major products. Managed a team of 4 junior developers'
    },
    {
      role: 'Junior Developer',
      company: 'Web Solutions',
      date: '2018 - 2020',
      description: 'Full stack development using MERN stack. Implemented CI/CD pipelines'
    }
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'GraphQL', 'AWS', 'Python', 'Figma', 'PostgreSQL']
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: 'Senior Community Support Worker',
    company: 'Community Care Australia',
    location: 'Brisbane, QLD',
    matchScore: 94,
    salary: '$65k - $75k',
    salaryRange: '$65k - $75k',
    postedDate: '2 days ago',
    description: 'Join our passionate team providing support to individuals with disabilities in community settings.',
    tags: ['Disability Support', 'Case Management', 'Mentoring'],
    isRemote: false,
    isFavorited: false,
  },
  {
    id: 2,
    title: 'Mental Health Peer Worker',
    company: 'Queensland Health',
    location: 'Gold Coast, QLD',
    matchScore: 87,
    salary: '$60k - $70k',
    salaryRange: '$60k - $70k',
    postedDate: '5 days ago',
    description: 'Support individuals with lived experience of mental health challenges in their recovery journey.',
    tags: ['Mental Health', 'Peer Support', 'Group Facilitation'],
    isRemote: true,
    isFavorited: true,
  }
];
