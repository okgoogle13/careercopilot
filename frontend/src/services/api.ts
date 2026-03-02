import {
  Application,
  Document,
  UserStats,
  KSCResponse,
  AnalysisData,
  UserProfile,
  Opportunity,
  MOCK_APPLICATIONS,
  MOCK_DOCUMENTS,
  MOCK_USER_STATS,
  MOCK_KSC_RESPONSES,
  MOCK_ANALYSIS_DATA,
  MOCK_USER_PROFILE,
  MOCK_OPPORTUNITIES,
} from './mockData';
<<<<<<< HEAD
import { auth } from '../config/firebase';
=======
import { syncEngine } from '../lib/syncEngine';
import { supabase } from '../config/supabase';
>>>>>>> restoration-KR-Rage-Figma-v2.0

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// Default to using mock API unless explicitly disabled
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

<<<<<<< HEAD
// In-memory state to persist changes during session (for mock mode)
let applications = [...MOCK_APPLICATIONS];
let documents = [...MOCK_DOCUMENTS];

let kscResponses = [...MOCK_KSC_RESPONSES];

const getAuthToken = async () => {
  if (import.meta.env.DEV) return 'dev-token';
  const user = auth.currentUser;
  return user ? await user.getIdToken() : '';
};

export const mockApi = {
  async getApplications(): Promise<Application[]> {
    await delay(500);
    return applications;
=======
const getAuthToken = async () => {
    // In dev mode with mock api enabled, return a dummy token
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false') {
        return 'dev-token';
    }
    
    // Get session from Supabase client
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
};

// Keys for syncEngine
const APPS_KEY = 'persistent_applications';
const OPP_KEY = 'persistent_opportunities';
const KSC_DRAFT_KEY = 'persistent_ksc_draft';
const PROFILE_KEY = 'persistent_user_profile';

export interface KSCDraft {
  criteria: string;
  star: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  step: number;
}

export const mockApi = {
  async getApplications(): Promise<Application[]> {
    await delay(500);
    let apps = await syncEngine.get<Application[]>(APPS_KEY);
    if (!apps) {
      // Seed with initial mock data
      apps = [...MOCK_APPLICATIONS];
      await syncEngine.set(APPS_KEY, apps);
    }
    return apps;
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },

  async updateApplicationStatus(id: number | string, currentStep: number): Promise<Application> {
    await delay(500);
<<<<<<< HEAD
    const appIndex = applications.findIndex((a) => a.id === id);
    if (appIndex === -1) throw new Error('Application not found');

    applications[appIndex] = {
      ...applications[appIndex],
      currentStep,
    };
    return applications[appIndex];
=======
    const apps = await this.getApplications();
    const appIndex = apps.findIndex((a) => a.id === id);
    if (appIndex === -1) throw new Error('Application not found');

    apps[appIndex] = {
      ...apps[appIndex],
      currentStep,
    };
    await syncEngine.set(APPS_KEY, apps);
    return apps[appIndex];
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },

  async getDocuments(): Promise<Document[]> {
    await delay(500);
<<<<<<< HEAD
    return documents;
=======
    return MOCK_DOCUMENTS;
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },

  async getUserStats(): Promise<UserStats> {
    await delay(300);
<<<<<<< HEAD
    return MOCK_USER_STATS;
=======
    const apps = await this.getApplications();
    return {
      ...MOCK_USER_STATS,
      activeApplications: apps.length,
    };
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },

  async getKSCResponses(): Promise<KSCResponse[]> {
    await delay(500);
<<<<<<< HEAD
    return kscResponses;
=======
    return MOCK_KSC_RESPONSES;
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },

  async generateKSCResponse(
    criteria: string,
    _starData?: { situation: string; task: string; action: string; result: string }
  ): Promise<KSCResponse> {
    await delay(2000); // Longer delay for "AI generation"

<<<<<<< HEAD
    // Simulation of AI generation (responseText logic removed as it was unused)

=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
    const newResponse: KSCResponse = {
      id: Date.now(),
      criteria,
      response: `Based on the selection criteria you provided, here's a tailored response:\n\n${criteria}\n\nI have demonstrated extensive experience in this area through my work at... (Generated ${new Date().toLocaleTimeString()})`,
      dateGenerated: new Date().toISOString(),
    };
<<<<<<< HEAD
    kscResponses = [newResponse, ...kscResponses];
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
    return newResponse;
  },

  async getAnalysisData(): Promise<AnalysisData> {
    await delay(500);
    return MOCK_ANALYSIS_DATA;
  },

  async getUserProfile(): Promise<UserProfile> {
<<<<<<< HEAD
    await delay(300);
    return MOCK_USER_PROFILE;
=======
    const profile = await syncEngine.get<UserProfile>(PROFILE_KEY);
    if (!profile) {
      await syncEngine.set(PROFILE_KEY, MOCK_USER_PROFILE);
      return MOCK_USER_PROFILE;
    }
    return profile;
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    await syncEngine.set(PROFILE_KEY, profile);
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },

  async getOpportunities(): Promise<Opportunity[]> {
    await delay(500);
<<<<<<< HEAD
    return MOCK_OPPORTUNITIES;
=======
    let opps = await syncEngine.get<Opportunity[]>(OPP_KEY);
    if (!opps) {
      opps = [...MOCK_OPPORTUNITIES];
      await syncEngine.set(OPP_KEY, opps);
    }
    return opps;
  },

  async saveKSCDraft(draft: KSCDraft): Promise<void> {
    await syncEngine.set(KSC_DRAFT_KEY, draft);
  },

  async getKSCDraft(): Promise<KSCDraft | null> {
    return await syncEngine.get<KSCDraft>(KSC_DRAFT_KEY);
  },

  async clearKSCDraft(): Promise<void> {
    await syncEngine.delete(KSC_DRAFT_KEY);
>>>>>>> restoration-KR-Rage-Figma-v2.0
  },
};

export const realApi = {
  async getApplications(): Promise<Application[]> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/applications/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    const data = await response.json();

    // Adapt Backend ApplicationSchema to Frontend Application Interface
    return data.map((d: any) => ({
      id: d.id,
      title: d.jobTitle,
      company: d.companyName,
      location: 'Remote', // Placeholder
      appliedDate: d.appliedDate ? new Date(d.appliedDate).toLocaleDateString() : 'Just now',
      currentStep: 1, // Placeholder
      steps: ['Applied', 'Screening', 'Interview', 'Offer'],
      atsScore: undefined,
      atsStatus: undefined,
    }));
  },

  async updateApplicationStatus(id: number | string, currentStep: number): Promise<Application> {
    // Placeholder implementation
    console.warn('Backend update not fully implemented');
    return mockApi.updateApplicationStatus(id, currentStep);
  },

  async getDocuments(): Promise<Document[]> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/documents/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch documents');
    const data = await response.json();
    return data.map((d: any) => ({
      id: d.id,
      name: d.name || 'Untitled Document',
      type: d.type || 'resume',
      date: d.date || 'Unknown date',
      icon: d.type === 'ksc' ? '📋' : d.type === 'cover' ? '📝' : '📄',
      status: d.status || 'Draft',
    }));
  },

  async getUserStats(): Promise<UserStats> {
    // Fallback to mock for now
    return mockApi.getUserStats();
  },

  async getKSCResponses(): Promise<KSCResponse[]> {
    // Fallback to mock for now
    return mockApi.getKSCResponses();
  },

  async generateKSCResponse(
    criteria: string,
    starData?: { situation: string; task: string; action: string; result: string }
  ): Promise<KSCResponse> {
    // Fallback to mock for now
    return mockApi.generateKSCResponse(criteria, starData);
  },

  async getAnalysisData(): Promise<AnalysisData> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/analysis/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch analysis data');
    return await response.json();
  },

  async getUserProfile(): Promise<UserProfile> {
    // Fallback to mock for now
    return mockApi.getUserProfile();
  },

  async getOpportunities(): Promise<Opportunity[]> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/opportunities/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch opportunities');
    return await response.json();
  },
<<<<<<< HEAD
=======

  async saveKSCDraft(draft: KSCDraft): Promise<void> {
    return mockApi.saveKSCDraft(draft);
  },

  async getKSCDraft(): Promise<KSCDraft | null> {
    return mockApi.getKSCDraft();
  },

  async clearKSCDraft(): Promise<void> {
    return mockApi.clearKSCDraft();
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    return mockApi.saveUserProfile(profile);
  },
>>>>>>> restoration-KR-Rage-Figma-v2.0
};

// Export the selected API implementation
export const api = USE_MOCK ? mockApi : realApi;
