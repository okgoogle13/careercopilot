export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export const isApiError = (error: any): error is ApiError => {
  return error !== null && typeof error === 'object' && 'code' in error && 'message' in error;
};

export const createErrorResponse = (code: string, message: string, details?: any): ApiError => {
  return {
    code,
    message,
    details,
  };
};

export type SkillProficiency = 'Novice' | 'Competent' | 'Proficient' | 'Expert' | 'Master';

export enum WorkType {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ONSITE = 'On-site',
  ANY = 'Any',
}

export interface PersonalInformation {
  FullName: string;
  Phone: string;
  Email: string;
  Location: string;
  Portfolio_Website_URLs: string[];
}

export interface JobPreferences {
  Target_Roles: string[];
  Min_Salary?: number;
  Preferred_Locations: string[];
  Work_Type: WorkType;
  Relocation_Open: boolean;
  Notice_Period?: string;
  Industry_Preferences?: string[];
}

export interface CareerProfile {
  Target_Titles: string[];
  Master_Summary_Points: string[];
  Job_Preferences?: JobPreferences;
}

export interface MasterSkill {
  Skill_Name: string;
  Category: string;
  Subtype: string[];
  Proficiency?: SkillProficiency;
  Years_Experience?: number;
  Last_Used_Year?: string;
}

export enum EntryType {
  WORK_EXPERIENCE = 'Work Experience',
  PROJECT = 'Project',
  EDUCATION = 'Education',
  CERTIFICATION = 'Certification',
  VOLUNTEER = 'Volunteer',
}

export interface CareerEntry {
  Entry_ID: string;
  Entry_Type: EntryType;
  Organization: string;
  Role: string;
  StartDate: string;
  EndDate: string;
  Location: string;
  Core_Responsibilities_Scope: string;
  Subtype_Tags: string[];
  Embedding?: number[]; // Vector embedding for RAG retrieval
}

export interface AchievementSuggestions {
  Action_Verb?: string;
  Noun_Task?: string;
  Metric?: string;
  Strategy?: string;
  Outcome?: string;
}

export interface StructuredAchievement {
  Achievement_ID: string;
  Entry_ID: string;
  Original_Text: string;
  Action_Verb: string;
  Noun_Task: string;
  Metric: string;
  Strategy: string;
  Outcome: string;
  Skills_Used: string[];
  Tools_Used: string[];
  Subtype_Tags: string[];
  Needs_Review_Flag: boolean;
  Embedding?: number[]; // Vector embedding for RAG retrieval
  Improvement_Suggestions?: AchievementSuggestions;
}

export interface KSCImprovementSuggestions {
  Situation?: string;
  Task?: string;
  Action?: string;
  Result?: string;
}

export interface KSCResponse {
  KSC_ID: string;
  KSC_Prompt: string;
  Situation: string;
  Task: string;
  Action: string;
  Result: string;
  Skills_Used: string[];
  Subtype_Tags: string[];
  Original_Text: string;
  Needs_Review_Flag: boolean;
  STAR_Feedback: string;
  Linked_Entry_ID?: string;
  Linked_Achievement_IDs?: string[];
  Embedding?: number[]; // Vector embedding for RAG retrieval
  Improvement_Suggestions: KSCImprovementSuggestions;
}

export interface CareerDatabase {
  Personal_Information: PersonalInformation;
  Career_Profile: CareerProfile;
  Master_Skills_Inventory: MasterSkill[];
  Career_Entries: CareerEntry[];
  Structured_Achievements: StructuredAchievement[];
  KSC_Responses: KSCResponse[];
}
