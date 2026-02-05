import admin from "firebase-admin";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: "hour" | "day" | "week" | "month" | "year";
  };
  location?: string;
  source: string;
  createdAt: admin.firestore.FieldValue | admin.firestore.Timestamp;
  updatedAt?: admin.firestore.FieldValue | admin.firestore.Timestamp;

  // Additional metadata
  metadata?: {
    isRemote?: boolean;
    jobType?: "full-time" | "part-time" | "contract" | "internship" | "temporary";
    experienceLevel?: "entry" | "mid" | "senior" | "lead" | "executive";
    industry?: string;
    benefits?: string[];
  };

  // Application details
  application?: {
    url?: string;
    email?: string;
    instructions?: string;
    deadline?: admin.firestore.Timestamp | Date;
  };

  // Status tracking
  status?: "active" | "expired" | "filled" | "draft";

  // Analytics
  views?: number;
  applications?: number;

  // System fields
  _searchTerms?: string[];
  _vector?: number[];
}
