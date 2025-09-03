import React from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Circle,
  Calendar,
  FileText,
  Send,
  MessageSquare,
  Star
} from 'lucide-react';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { cn } from '../../lib/utils';
import { Badge } from './badge';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'in-progress' | 'failed' | 'upcoming';
  type?: 'application' | 'interview' | 'response' | 'deadline' | 'follow-up' | 'offer';
  metadata?: {
    company?: string;
    position?: string;
    location?: string;
    interviewer?: string;
    notes?: string;
    documents?: string[];
  };
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  showTime?: boolean;
  showMetadata?: boolean;
  interactive?: boolean;
  onItemClick?: (item: TimelineItem) => void;
}

const getStatusIcon = (status: TimelineItem['status']) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'in-progress':
      return Clock;
    case 'failed':
      return XCircle;
    case 'pending':
      return AlertCircle;
    case 'upcoming':
      return Circle;
    default:
      return Circle;
  }
};

const getTypeIcon = (type?: TimelineItem['type']) => {
  switch (type) {
    case 'application':
      return Send;
    case 'interview':
      return MessageSquare;
    case 'response':
      return FileText;
    case 'deadline':
      return Calendar;
    case 'follow-up':
      return Clock;
    case 'offer':
      return Star;
    default:
      return FileText;
  }
};

const getStatusColor = (status: TimelineItem['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'upcoming':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getConnectorColor = (status: TimelineItem['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-200';
    case 'in-progress':
      return 'bg-blue-200';
    case 'failed':
      return 'bg-red-200';
    case 'pending':
      return 'bg-yellow-200';
    case 'upcoming':
      return 'bg-gray-200';
    default:
      return 'bg-gray-200';
  }
};

export function Timeline({
  items,
  className,
  showTime = true,
  showMetadata = false,
  interactive = false,
  onItemClick,
}: TimelineProps) {
  // Sort items by timestamp (most recent first)
  const sortedItems = [...items].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, h:mm a');
  };

  const getTimeBadgeVariant = (date: Date) => {
    if (isToday(date)) return 'default';
    if (isPast(date)) return 'secondary';
    if (isFuture(date)) return 'outline';
    return 'secondary';
  };

  return (
    <div className={cn('relative', className)}>
      {sortedItems.map((item, index) => {
        const StatusIcon = getStatusIcon(item.status);
        const TypeIcon = getTypeIcon(item.type);
        const isLast = index === sortedItems.length - 1;

        return (
          <div key={item.id} className="relative flex group">
            {/* Timeline connector line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-4 top-8 w-0.5 h-full -ml-px',
                  getConnectorColor(item.status)
                )}
              />
            )}

            {/* Timeline icon */}
            <div className={cn(
              'relative flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 z-10',
              getStatusColor(item.status)
            )}>
              <StatusIcon className="w-4 h-4" />
            </div>

            {/* Timeline content */}
            <div
              className={cn(
                'ml-4 pb-8 flex-1 min-w-0',
                interactive && 'cursor-pointer',
                interactive && 'hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors'
              )}
              onClick={() => interactive && onItemClick?.(item)}
            >
              {/* Header with title and timestamp */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <TypeIcon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm leading-5 truncate">
                      {item.title}
                    </h4>
                    {item.metadata?.company && (
                      <p className="text-xs text-muted-foreground">
                        {item.metadata.company}
                        {item.metadata.position && ` • ${item.metadata.position}`}
                      </p>
                    )}
                  </div>
                </div>

                {showTime && (
                  <Badge variant={getTimeBadgeVariant(item.timestamp)} className="text-xs whitespace-nowrap">
                    {formatTime(item.timestamp)}
                  </Badge>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Metadata */}
              {showMetadata && item.metadata && (
                <div className="space-y-1">
                  {item.metadata.location && (
                    <p className="text-xs text-muted-foreground">
                      📍 {item.metadata.location}
                    </p>
                  )}
                  {item.metadata.interviewer && (
                    <p className="text-xs text-muted-foreground">
                      👤 {item.metadata.interviewer}
                    </p>
                  )}
                  {item.metadata.documents && item.metadata.documents.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.metadata.documents.map((doc, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.metadata.notes && (
                    <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded">
                      💭 {item.metadata.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Specialized application timeline for job applications
interface ApplicationTimelineProps extends Omit<TimelineProps, 'items'> {
  applicationId: string;
  events: Array<{
    id: string;
    type: 'applied' | 'viewed' | 'interview-scheduled' | 'interview-completed' | 'follow-up' | 'rejected' | 'offered';
    timestamp: Date;
    details?: any;
  }>;
}

export function ApplicationTimeline({
  applicationId,
  events,
  ...props
}: ApplicationTimelineProps) {
  const timelineItems: TimelineItem[] = events.map(event => {
    const getEventData = () => {
      switch (event.type) {
        case 'applied':
          return {
            title: 'Application Submitted',
            description: 'Your application has been successfully submitted',
            status: 'completed' as const,
            type: 'application' as const,
          };
        case 'viewed':
          return {
            title: 'Application Viewed',
            description: 'Your application has been reviewed by the hiring team',
            status: 'completed' as const,
            type: 'response' as const,
          };
        case 'interview-scheduled':
          return {
            title: 'Interview Scheduled',
            description: `Interview scheduled for ${event.details?.date ? format(new Date(event.details.date), 'PPP') : 'TBD'}`,
            status: 'upcoming' as const,
            type: 'interview' as const,
          };
        case 'interview-completed':
          return {
            title: 'Interview Completed',
            description: 'Interview has been completed successfully',
            status: 'completed' as const,
            type: 'interview' as const,
          };
        case 'follow-up':
          return {
            title: 'Follow-up Sent',
            description: 'Follow-up message sent to hiring team',
            status: 'completed' as const,
            type: 'follow-up' as const,
          };
        case 'rejected':
          return {
            title: 'Application Declined',
            description: 'Unfortunately, your application was not successful',
            status: 'failed' as const,
            type: 'response' as const,
          };
        case 'offered':
          return {
            title: 'Job Offer Received',
            description: 'Congratulations! You have received a job offer',
            status: 'completed' as const,
            type: 'offer' as const,
          };
        default:
          return {
            title: 'Unknown Event',
            description: 'An event occurred in your application process',
            status: 'pending' as const,
            type: 'response' as const,
          };
      }
    };

    const eventData = getEventData();

    return {
      id: event.id,
      timestamp: event.timestamp,
      metadata: {
        ...event.details,
      },
      ...eventData,
    };
  });

  return <Timeline items={timelineItems} {...props} />;
}
