export interface ApplicationEvent {
  id: string;
  type: string;
  date: string;
  notes?: string;
  completed?: boolean;
}

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  appliedDate: string;
  status: 'saved' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted' | 'withdrawn';
  events: ApplicationEvent[];
  nextEvent?: {
    type: string;
    date: string;
  };
  progress: number;
  companyLogo?: string;
  notes?: string;
  jobDescription?: string;
  jobPostingUrl?: string;
  contactPerson?: {
    name: string;
    email?: string;
    phone?: string;
    position?: string;
  };
  resumeVersion?: string;
  coverLetterVersion?: string;
  skills?: string[];
  isRemote?: boolean;
  isFavorite?: boolean;
  tags?: string[];
  source?: string;
  followUpDate?: string;
  archived?: boolean;
}
