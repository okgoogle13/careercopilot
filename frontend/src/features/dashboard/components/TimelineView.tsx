import { Pebble } from '@/components/ui/Pebble';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import { Stone } from '@/components/ui/Stone';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Star,
  User,
  Video,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

interface TimelineEvent {
  id: string;
  type: 'application' | 'interview' | 'follow-up' | 'offer' | 'rejection' | 'acceptance' | 'note';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'upcoming' | 'in-progress' | 'cancelled';
  icon: React.ComponentType<any>;
  color: string;
  details?: {
    interviewer?: string;
    platform?: string;
    documents?: string[];
    notes?: string;
    nextSteps?: string;
  };
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'application',
    title: 'Application Submitted',
    description: 'Applied for Senior Frontend Developer position',
    timestamp: '2024-01-15T09:00:00Z',
    status: 'completed',
    icon: FileText,
    color: 'primary',
    details: {
      documents: ['Resume_v3.pdf', 'Cover_Letter.pdf'],
      notes: 'Applied through company website',
    },
  },
  {
    id: '2',
    type: 'follow-up',
    title: 'Application Acknowledged',
    description: 'HR confirmed receipt of application',
    timestamp: '2024-01-16T14:30:00Z',
    status: 'completed',
    icon: Mail,
    color: 'secondary',
    details: {
      notes: 'Automated confirmation email received',
    },
  },
  {
    id: '3',
    type: 'interview',
    title: 'Phone Screening',
    description: 'Initial phone call with HR recruiter',
    timestamp: '2024-01-18T10:00:00Z',
    status: 'completed',
    icon: Phone,
    color: 'primary',
    details: {
      interviewer: 'Sarah Johnson - HR Manager',
      platform: 'Phone Call',
      notes: 'Discussed role requirements and company culture',
      nextSteps: 'Technical interview scheduled',
    },
  },
  {
    id: '4',
    type: 'interview',
    title: 'Technical Interview',
    description: 'Video call with engineering team',
    timestamp: '2024-01-22T15:00:00Z',
    status: 'completed',
    icon: Video,
    color: 'primary',
    details: {
      interviewer: 'Mike Chen - Senior Engineer',
      platform: 'Google Meet',
      notes: 'Live coding session, discussed React patterns',
      nextSteps: 'Final round with CTO',
    },
  },
  {
    id: '5',
    type: 'interview',
    title: 'Final Interview',
    description: 'Meeting with CTO and team leads',
    timestamp: '2024-01-25T11:00:00Z',
    status: 'in-progress',
    icon: User,
    color: 'tertiary',
    details: {
      interviewer: 'Alex Rodriguez - CTO',
      platform: 'In-person',
      notes: 'Culture fit and leadership discussion',
    },
  },
  {
    id: '6',
    type: 'offer',
    title: 'Job Offer Expected',
    description: 'Decision expected within 3-5 business days',
    timestamp: '2024-01-28T17:00:00Z',
    status: 'upcoming',
    icon: Star,
    color: 'tertiary',
    details: {
      nextSteps: 'HR will contact with decision',
    },
  },
];

interface TimelineEventComponentProps {
  event: TimelineEvent;
  isLast: boolean;
  isLatest: boolean;
}

const TimelineEventComponent: React.FC<TimelineEventComponentProps> = ({
  event,
  isLast,
  isLatest,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[var(--color-leaf-base)]';
      case 'in-progress':
        return 'text-[var(--color-flower-base)]';
      case 'upcoming':
        return 'text-[var(--color-ink-base)]';
      case 'cancelled':
        return 'text-[var(--color-bark-base)]';
      default:
        return 'text-[var(--color-text-secondary)]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Clock;
      case 'upcoming':
        return AlertCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const IconComponent = event.icon;
  const StatusIcon = getStatusIcon(event.status);
  const statusClass = getStatusColor(event.status);

  return (
    <div className="relative flex gap-4 mb-6">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-[calc(100%+24px)] bg-[var(--color-surface-container-high)] opacity-50" />
      )}

      {/* Timeline Icon */}
      <div
        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-sentry border-2 border-[var(--color-surface-container-high)] bg-[var(--color-surface-base)] flex-shrink-0 ${
          isLatest ? 'shadow-[0_0_0_4px_rgba(var(--bg-leaf-base)_/_0.2)]' : ''
        }`}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-sentry ${
            // Map colors to our design tokens simply
            event.color === 'primary'
              ? 'bg-[var(--color-leaf-base)]'
              : event.color === 'secondary'
                ? 'bg-[var(--color-ink-base)]'
                : event.color === 'tertiary'
                  ? 'bg-[var(--color-flower-base)]'
                  : event.color === 'error'
                    ? 'bg-[var(--color-bark-base)]'
                    : 'bg-[var(--color-leaf-base)]'
          } ${isLatest ? 'animate-pulse' : ''}`}
        >
          <IconComponent
            size={16}
            className="text-white"
          />
        </div>
      </div>

      {/* Event Content */}
      <div className="flex-1">
        <Stone
          elevation={isLatest ? 'raised' : 'flat'}
          className={`${isLatest ? 'border-[var(--color-leaf-base)]' : ''}`}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-body-large text-[var(--color-text-primary)]">
                    {event.title}
                  </span>
                  <StatusIcon
                    size={16}
                    className={statusClass}
                  />
                </div>
                <p className="text-body-medium text-[var(--color-text-secondary)] mb-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-body-small text-[var(--color-text-tertiary)]">
                  <Calendar size={12} />
                  <span>{formatTimestamp(event.timestamp)}</span>
                </div>
              </div>
              <StatusBadge
                label={event.status.replace('-', ' ').toUpperCase()}
                variant="neutral"
                className={`${statusClass} opacity-90`}
              />
            </div>

            {/* Details */}
            {event.details && (
              <div className="flex flex-col gap-2 mb-4 pl-1">
                {event.details.interviewer && (
                  <div className="flex items-center gap-2 text-body-small text-[var(--color-text-secondary)]">
                    <User size={14} />
                    <span>{event.details.interviewer}</span>
                  </div>
                )}
                {event.details.platform && (
                  <div className="flex items-center gap-2 text-body-small text-[var(--color-text-secondary)]">
                    <Video size={14} />
                    <span>{event.details.platform}</span>
                  </div>
                )}
                {event.details.documents && event.details.documents.length > 0 && (
                  <div className="flex items-center gap-2 text-body-small text-[var(--color-text-secondary)]">
                    <FileText size={14} />
                    <span>
                      {event.details.documents.length} document
                      {event.details.documents.length !== 1 ? 's' : ''} shared
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Expandable Content (Notes / Next Steps) */}
            {(event.details?.notes || event.details?.nextSteps || event.details?.documents) && (
              <div className="mt-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-label-medium text-[var(--color-leaf-base)] hover:underline focus:outline-none mb-2"
                >
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Show Details <ChevronDown size={14} />
                    </>
                  )}
                </button>

                {isExpanded && (
                  <div className="p-3 bg-[var(--color-surface-container-low)] rounded-stone animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-3">
                      {event.details?.notes && (
                        <div>
                          <h4 className="text-label-small font-bold text-[var(--color-text-primary)] mb-1">
                            Notes:
                          </h4>
                          <p className="text-body-small text-[var(--color-text-secondary)]">
                            {event.details.notes}
                          </p>
                        </div>
                      )}
                      {event.details?.nextSteps && (
                        <div>
                          <h4 className="text-label-small font-bold text-[var(--color-text-primary)] mb-1">
                            Next Steps:
                          </h4>
                          <p className="text-body-small text-[var(--color-text-secondary)]">
                            {event.details.nextSteps}
                          </p>
                        </div>
                      )}
                      {event.details?.documents && (
                        <div>
                          <h4 className="text-label-small font-bold text-[var(--color-text-primary)] mb-1">
                            Documents:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {event.details.documents.map((doc, i) => (
                              <StatusBadge
                                key={i}
                                label={doc}
                                variant="neutral"
                                className="bg-[var(--color-surface-container)]"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Stone>
      </div>
    </div>
  );
};

export interface TimelineViewProps {
  applicationId?: string;
  jobTitle?: string;
  companyName?: string;
  onBack?: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  applicationId,
  jobTitle = 'Senior Frontend Developer',
  companyName = 'TechCorp',
  onBack,
}) => {
  const [events] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [filter, setFilter] = useState<'all' | 'interviews' | 'communications'>('all');

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    if (filter === 'interviews') return event.type === 'interview';
    if (filter === 'communications') return ['follow-up', 'note'].includes(event.type);
    return true;
  });

  const latestEventIndex =
    events.findIndex((event) => event.status === 'in-progress') !== -1
      ? events.findIndex((event) => event.status === 'in-progress')
      : 0;

  const handleAddEvent = () => {
    console.log('Add new timeline event');
  };

  const getProgressPercentage = () => {
    const completedEvents = events.filter((event) => event.status === 'completed').length;
    return Math.round((completedEvents / events.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-base)]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[var(--color-background-base)]/80 backdrop-blur-md border-b border-[var(--color-surface-container-high)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Pebble
                variant="ghost"
                iconLeft={<ArrowLeft size={16} />}
                onClick={onBack}
              >
                Back
              </Pebble>
            )}
            <div>
              <h1 className="text-display-small font-bold text-[var(--color-text-primary)]">
                Application Timeline
              </h1>
              <div className="flex items-center gap-2 text-body-medium text-[var(--color-text-secondary)] mt-1">
                <Building2 size={16} />
                <span>
                  {jobTitle} at {companyName}
                </span>
              </div>
            </div>
          </div>
          <Pebble
            variant="primary"
            iconLeft={<Plus size={16} />}
            onClick={handleAddEvent}
          >
            Add Event
          </Pebble>
        </div>

        {/* Progress and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-full max-w-xs h-2 bg-[var(--color-surface-container-high)] rounded-sentry overflow-hidden">
              <div
                className="h-full bg-[var(--color-leaf-base)] transition-all duration-500 rounded-sentry"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <span className="text-body-small text-[var(--color-text-secondary)] whitespace-nowrap">
              {getProgressPercentage()}% Complete
            </span>
          </div>

          <div className="flex gap-2 bg-[var(--color-surface-container-low)] p-1 rounded-sentry">
            {[
              { key: 'all', label: 'All' },
              { key: 'interviews', label: 'Interviews' },
              { key: 'communications', label: 'Comms' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-1.5 rounded-sentry text-label-small transition-colors ${
                  filter === key
                    ? 'bg-[var(--color-surface-base)] shadow-sm text-[var(--color-text-primary)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          {filteredEvents.length === 0 ? (
            <Stone className="p-12 text-center bg-[var(--color-surface-container-low)] border-dashed border-2 border-[var(--color-surface-container-high)]">
              <MessageSquare
                size={48}
                className="mx-auto mb-4 text-[var(--color-text-tertiary)]"
              />
              <h3 className="text-display-small font-medium text-[var(--color-text-primary)] mb-2">
                No Events Found
              </h3>
              <p className="text-body-medium text-[var(--color-text-secondary)] mb-6">
                {filter === 'all'
                  ? 'No timeline events have been recorded yet.'
                  : `No ${filter} events found.`}
              </p>
              <Pebble
                variant="secondary"
                iconLeft={<Plus size={16} />}
                onClick={handleAddEvent}
              >
                Add First Event
              </Pebble>
            </Stone>
          ) : (
            <div>
              {filteredEvents.map((event, index) => (
                <TimelineEventComponent
                  key={event.id}
                  event={event}
                  isLast={index === filteredEvents.length - 1}
                  isLatest={index === latestEventIndex}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
