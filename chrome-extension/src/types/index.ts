export interface JobData {
    title: string;
    company: string | null;
    description: string;
    location: string | null;
    employmentType: string | null;
    datePosted: string | null;
    salary: string | null;
    url: string;
    source: string | null;
}

export interface JobAnalysisRequest {
    title: string;
    company: string | null;
    location: string | null;
    description: string;
    url: string;
    source: string | null;
    employmentType?: string | null;
    datePosted?: string | null;
    salary?: string | null;
    resume_text?: string; // Optional resume context for better analysis
}

export interface JobAnalysisResponse {
    markdown_analysis: string;
    job_id?: string;  // ID of saved job in database
    job_saved?: boolean;  // Whether job was saved successfully
    deadline_found?: string | null; // Extracted deadline date (if any)
}

export interface Message {
    type: string;
    data?: any;
}
