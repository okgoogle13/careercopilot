import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  FileText,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Video,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  ArrowLeft,
  Building2,
  User,
  Star,
} from 'lucide-react';

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

const TimelineEventComponent: React.FC<TimelineEventComponentProps> = ({ event, isLast, isLatest }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { main: 'primary.main', border: 'primary.main' };
      case 'in-progress':
        return { main: 'tertiary.main', border: 'tertiary.main' };
      case 'upcoming':
        return { main: 'secondary.main', border: 'secondary.main' };
      case 'cancelled':
        return { main: 'error.main', border: 'error.main' };
      default:
        return { main: 'text.secondary', border: 'outline.variant' };
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
  const statusColor = getStatusColor(event.status);

  return (
    <Box sx={{ position: 'relative', display: 'flex', gap: 2, mb: 3 }}>
      {/* Timeline Line */}
      {!isLast && (
        <Box
          sx={{
            position: 'absolute',
            left: 24,
            top: 48,
            width: 2,
            height: 'calc(100% + 12px)',
            bgcolor: 'outline.variant',
            opacity: 0.5,
          }}
        />
      )}

      {/* Timeline Icon */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: 2,
          borderColor: statusColor.border,
          bgcolor: 'background.default',
          flexShrink: 0,
          ...(isLatest && {
            boxShadow: (theme) => `0 0 0 8px ${alpha(theme.palette.primary.main, 0.2)}`,
          }),
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: `${event.color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isLatest ? 'glow-pulse 2s ease-in-out infinite' : 'none',
          }}
        >
          <IconComponent size={16} color="white" />
        </Box>
      </Box>

      {/* Event Content */}
      <Card
        variant={isLatest ? 'glass' : undefined}
        sx={{
          flex: 1,
          ...(isLatest && {
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
            boxShadow: (theme) => theme.customShadows.glowPrimary,
          }),
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {event.title}
                </Typography>
                <StatusIcon size={16} color={statusColor.main} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {event.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={12} />
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(event.timestamp)}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={event.status.replace('-', ' ').toUpperCase()}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette[statusColor.main.split('.')[0] as 'primary' | 'secondary' | 'tertiary' | 'error']?.main || theme.palette.primary.main, 0.1),
                color: statusColor.main,
                border: 1,
                borderColor: (theme) => alpha(theme.palette[statusColor.main.split('.')[0] as 'primary' | 'secondary' | 'tertiary' | 'error']?.main || theme.palette.primary.main, 0.2),
              }}
            />
          </Box>

          {/* Details */}
          {event.details && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {event.details.interviewer && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={12} />
                  <Typography variant="body2" color="text.secondary">
                    {event.details.interviewer}
                  </Typography>
                </Box>
              )}
              {event.details.platform && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Video size={12} />
                  <Typography variant="body2" color="text.secondary">
                    {event.details.platform}
                  </Typography>
                </Box>
              )}
              {event.details.documents && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileText size={12} />
                  <Typography variant="body2" color="text.secondary">
                    {event.details.documents.length} document{event.details.documents.length !== 1 ? 's' : ''} shared
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Expandable Content */}
          {event.details?.notes && (
            <Box>
              <Button
                variant="text"
                size="small"
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {isExpanded ? 'Show Less' : 'Show Details'}
              </Button>

              <Collapse in={isExpanded}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'surface.containerLow',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {event.details.notes && (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Notes:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.details.notes}
                        </Typography>
                      </Box>
                    )}
                    {event.details.nextSteps && (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Next Steps:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.details.nextSteps}
                        </Typography>
                      </Box>
                    )}
                    {event.details.documents && (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Documents:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {event.details.documents.map((doc, index) => (
                            <Chip key={index} label={doc} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Collapse>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(24px)',
          borderBottom: 1,
          borderColor: 'outline.variant',
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {onBack && (
              <Button variant="text" startIcon={<ArrowLeft size={16} />} onClick={onBack}>
                Back
              </Button>
            )}
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                Application Timeline
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Building2 size={16} />
                <Typography variant="body2">
                  {jobTitle} at {companyName}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button variant="aurora" startIcon={<Plus size={16} />} onClick={handleAddEvent}>
            Add Event
          </Button>
        </Box>

        {/* Progress and Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 96, height: 8, bgcolor: 'surface.containerHigh', borderRadius: 4 }}>
              <Box
                sx={{
                  height: '100%',
                  width: `${getProgressPercentage()}%`,
                  bgcolor: 'primary.main',
                  borderRadius: 4,
                  transition: 'width 0.5s',
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {getProgressPercentage()}% Complete
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {[
              { key: 'all', label: 'All Events' },
              { key: 'interviews', label: 'Interviews' },
              { key: 'communications', label: 'Communications' },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? 'aurora' : 'text'}
                size="small"
                onClick={() => setFilter(key as any)}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Timeline Content */}
      <Box sx={{ p: 4 }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          {filteredEvents.length === 0 ? (
            <Card sx={{ p: 8, textAlign: 'center' }}>
              <MessageSquare size={64} style={{ opacity: 0.4, margin: '0 auto 16px' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                No Events Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {filter === 'all' ? 'No timeline events have been recorded yet.' : `No ${filter} events found.`}
              </Typography>
              <Button variant="aurora" startIcon={<Plus size={16} />} onClick={handleAddEvent}>
                Add First Event
              </Button>
            </Card>
          ) : (
            <Box>
              {filteredEvents.map((event, index) => (
                <TimelineEventComponent
                  key={event.id}
                  event={event}
                  isLast={index === filteredEvents.length - 1}
                  isLatest={index === latestEventIndex}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TimelineView;
