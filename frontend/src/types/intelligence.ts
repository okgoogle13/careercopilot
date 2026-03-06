/**
 * CORE DATA STRUCTURES: RESUME COPILOT
 *
 * This file serves as the strict source of truth for all data models.
 * It is decoupled from any specific transport layer or database.
 */

/**
 * Represents the AI's deconstruction of a job posting.
 */
export interface JobAnalysis {
  /** The official title as listed in the JD */
  jobTitle: string;
  /** The hiring organization */
  companyName: string;
  /** High-frequency, industry-standard terms essential for ATS scanning */
  keywords: string[];
  /** Essential criteria (Years of Exp, Degrees, Specific Certs) */
  minimumRequirements: string[];
  /** Primary duties and measurable performance indicators */
  keyResponsibilitiesAndKpis: string[];
  /** The "why" behind the role; what business value is created */
  valuedOutcomes: string[];
  /** Specific tools, software, or methodologies required */
  roleSpecificHardSkills: string[];
  /** Branding elements: industry focus and cultural pillars */
  companyNicheAndValues: string[];
  /** Personality traits or "nice-to-have" experiences */
  desirableAttributes: string[];
  /** Verified sources from Google Search grounding */
  sources?: GroundingSource[];
  /** Naarm sector-specific insights (APS, AASW, NDIS, WWCC) */
  sectorInsights?: {
    framework?: string; // e.g., "APS Integrated Leadership System"
    compliance?: string[]; // e.g., ["WWCC Required", "NDIS Screening"]
    standards?: string[]; // e.g., ["AASW Code of Ethics"]
  };
}

/** Grounding source from Google Search */
export interface GroundingSource {
  title: string;
  uri: string;
}

/**
 * The comprehensive professional identity of a user.
 */
export interface UserProfile {
  fullName: string;
  /** High-impact title: e.g., "Senior DevOps Engineer | 8+ Years in AWS & Kubernetes" */
  resumeHeadline: string;
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  /** A results-driven narrative of professional value */
  careerSummary: string;
  education: EducationEntry[];
  skills: SkillCategory[];
  experience: ExperienceEntry[];
  development: {
    certifications: CertificationEntry[];
    trainings: TrainingEntry[];
  };
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
}

export interface SkillCategory {
  /** e.g., "Cloud Infrastructure", "Programming", "Leadership" */
  category: string;
  skillsList: string[];
}

export interface ExperienceEntry {
  jobTitle: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  /** High-level context of the role */
  description: string;
  /** Bullet points rewritten for ATS and action-impact */
  responsibilities: string[];
  /** One standout, data-driven career win for this specific role */
  achievement: string;
}

export interface CertificationEntry {
  name: string;
  issuingBody: string;
  date: string;
}

export interface TrainingEntry {
  name: string;
  provider: string;
  year: string;
}

/**
 * The 4-Quadrant ATS & Human Recruiter Audit
 */
export interface AuditResponse {
  /** 0-100 aggregated matching score */
  overallScore: number;
  overallAnalysis: string;
  scoreBreakdown: {
    /** Technical keyword and tool alignment */
    hardSkillsMatch: ScoreComponent;
    /** Action verbs and behavioral keywords */
    softSkillsMatch: ScoreComponent;
    /** Presence of metrics and data-driven results */
    quantifiableAchievements: ScoreComponent;
    /** Structural parsing compatibility */
    atsReadability: ScoreComponent;
  };
  actionableFeedback: string[];
  /** Strategic rewrites for specific bullet points */
  quantificationSuggestions: Array<{
    originalText: string;
    suggestedRewrite: string;
    /** Strategic explanation of WHY this improvement helps (ATS or Psychology) */
    contextualWhy: string;
  }>;
}

export interface ScoreComponent {
  score: number;
  analysis: string;
}

/**
 * The unified response from the Generation Engine.
 */
export interface IntelligencePackage {
  /** The fully rewritten, job-tailored profile */
  tailoredResume: UserProfile;
  /** The detailed audit and score */
  audit: AuditResponse;
  /** Strategic headline alternatives */
  headlineSuggestions: string[];
}

export interface ImprovedBullet {
  original: string;
  improved: string;
  rationale: string;
  metric_type: string;
}

export interface SkillsGap {
  matched: string[];
  missing: string[];
  adjacent: string[];
  match_score: number;
}

export interface Job {
  jobTitle: string;
  companyName: string;
  location: string;
  jobDescription: string;
}
