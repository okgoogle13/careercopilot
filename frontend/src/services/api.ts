
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
    MOCK_OPPORTUNITIES
} from './mockData';
import { auth } from '../config/firebase';

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// Default to using mock API unless explicitly disabled
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    },

    async updateApplicationStatus(id: number | string, currentStep: number): Promise<Application> {
        await delay(500);
        const appIndex = applications.findIndex(a => a.id === id);
        if (appIndex === -1) throw new Error('Application not found');

        applications[appIndex] = {
            ...applications[appIndex],
            currentStep
        };
        return applications[appIndex];
    },

    async getDocuments(): Promise<Document[]> {
        await delay(500);
        return documents;
    },

    async getUserStats(): Promise<UserStats> {
        await delay(300);
        return MOCK_USER_STATS;
    },

    async getKSCResponses(): Promise<KSCResponse[]> {
        await delay(500);
        return kscResponses;
    },

    async generateKSCResponse(criteria: string, starData?: { situation: string, task: string, action: string, result: string }): Promise<KSCResponse> {
        await delay(2000); // Longer delay for "AI generation"

        let responseText = `Based on the selection criteria you provided, here's a tailored response aligned with the Australian Public Service (APS) Integrated Leadership System (ILS):\n\n`;

        if (starData) {
            responseText += `**Situation:** ${starData.situation}\n`;
            responseText += `**Task:** ${starData.task}\n`;
            responseText += `**Action:** ${starData.action}\n`;
            responseText += `**Result:** ${starData.result}\n\n`;
            responseText += `**Synthesis:**\nDrawing upon the STAR methodology, I effectively demonstrated...`;
        } else {
            responseText += `${criteria}\n\nI have demonstrated extensive experience in this area through my work at...`;
        }

        const newResponse: KSCResponse = {
            id: Date.now(),
            criteria,
            response: `Based on the selection criteria you provided, here's a tailored response:\n\n${criteria}\n\nI have demonstrated extensive experience in this area through my work at... (Generated ${new Date().toLocaleTimeString()})`,
            dateGenerated: new Date().toISOString()
        };
        kscResponses = [newResponse, ...kscResponses];
        return newResponse;
    },

    async getAnalysisData(): Promise<AnalysisData> {
        await delay(500);
        return MOCK_ANALYSIS_DATA;
    },

    async getUserProfile(): Promise<UserProfile> {
        await delay(300);
        return MOCK_USER_PROFILE;
    },

    async getOpportunities(): Promise<Opportunity[]> {
        await delay(500);
        return MOCK_OPPORTUNITIES;
    }
};

export const realApi = {
    async getApplications(): Promise<Application[]> {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/applications/`, {
            headers: { 'Authorization': `Bearer ${token}` }
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
            atsStatus: undefined
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
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch documents');
        const data = await response.json();
        return data.map((d: any) => ({
            id: d.id,
            name: d.name || 'Untitled Document',
            type: d.type || 'resume',
            date: d.date || 'Unknown date',
            icon: d.type === 'ksc' ? '📋' : (d.type === 'cover' ? '📝' : '📄'),
            status: d.status || 'Draft'
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

    async generateKSCResponse(criteria: string, starData?: { situation: string, task: string, action: string, result: string }): Promise<KSCResponse> {
        // Fallback to mock for now
        return mockApi.generateKSCResponse(criteria, starData);
    },

    async getAnalysisData(): Promise<AnalysisData> {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/analysis/`, {
            headers: { 'Authorization': `Bearer ${token}` }
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
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch opportunities');
        return await response.json();
    }
};

// Export the selected API implementation
export const api = USE_MOCK ? mockApi : realApi;
