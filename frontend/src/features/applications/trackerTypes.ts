import type { Application, ApplicationStatus, ApplicationUpdate } from '@/api/applicationService';

export type TrackerStage = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'archived';

export interface TrackerColumnDefinition {
  id: TrackerStage;
  name: string;
  description: string;
}

export const TRACKER_COLUMNS: TrackerColumnDefinition[] = [
  { id: 'applied', name: 'Applied', description: 'Application submitted' },
  { id: 'interviewing', name: 'Interviewing', description: 'Interview process active' },
  { id: 'offer', name: 'Offer', description: 'Offer or advanced-stage discussion' },
  { id: 'rejected', name: 'Rejected', description: 'Application closed out' },
  { id: 'archived', name: 'Archived', description: 'Hidden from the active board' },
];

export interface TrackerApplication extends Application {
  trackerStage: TrackerStage;
  locationLabel: string;
  appliedLabel: string;
}

export interface ApplicationEditPayload {
  jobTitle?: string;
  companyName?: string;
  jobDescription?: string;
  notes?: string;
}

export function mapStatusToTrackerStage(status: ApplicationStatus): TrackerStage {
  switch (status) {
    case 'interviewing':
      return 'interviewing';
    case 'offer':
      return 'offer';
    case 'rejected':
      return 'rejected';
    case 'archived':
      return 'archived';
    case 'withdrawn':
      return 'archived';
    case 'draft':
    case 'applied':
    default:
      return 'applied';
  }
}

export function mapTrackerStageToStatus(stage: TrackerStage): ApplicationStatus {
  switch (stage) {
    case 'interviewing':
      return 'interviewing';
    case 'offer':
      return 'offer';
    case 'rejected':
      return 'rejected';
    case 'archived':
      return 'archived';
    case 'applied':
    default:
      return 'applied';
  }
}

export function toTrackerApplication(application: Application): TrackerApplication {
  return {
    ...application,
    trackerStage: mapStatusToTrackerStage(application.status),
    locationLabel:
      application.applicationMetadata?.location ??
      application.metadata?.location ??
      'Location pending',
    appliedLabel: application.appliedDate
      ? new Date(application.appliedDate).toLocaleDateString()
      : 'Not submitted',
  };
}

export function buildApplicationUpdatePayload(
  patch: Partial<ApplicationEditPayload> & { status?: ApplicationStatus }
): ApplicationUpdate {
  return {
    ...patch,
  };
}
