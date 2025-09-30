import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import {
  Schedule as Clock,
  CheckCircle,
  Error as AlertCircle,
  Description as FileText,
  CalendarToday as Calendar,
  ChatBubble as MessageCircle,
  Edit,
  OpenInNew as ExternalLink,
} from '@mui/icons-material';

interface TimelineEvent {
  id: string;
  type: 'application' | 'interview' | 'response' | 'follow_up' | 'offer' | 'rejection';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'upcoming' | 'pending' | 'cancelled';
  metadata?: {
    interviewer?: string;
    interviewType?: string;
    documents?: string[];
    notes?: string;
    nextSteps?: string;
  };
}

interface TimelineViewProps {
  applicationId: string;
  companyName: string;
  jobTitle: string;
  events: TimelineEvent[];
  onEventEdit?: (eventId: string) => void;
  onAddNote?: (eventId: string) => void;
  onViewDocument?: (documentName: string) => void;
}

const eventIcons = {
  application: FileText,
  interview: Calendar,
  response: MessageCircle,
  follow_up: Schedule as Clock,
  offer: CheckCircle,
  rejection: AlertCircle,
};

const eventColors = {
  application: 'bg-blue-100 text-blue-600',
  interview: 'bg-purple-100 text-purple-600',
  response: 'bg-green-100 text-green-600',
  follow_up: 'bg-orange-100 text-orange-600',
  offer: 'bg-green-100 text-green-600',
  rejection: 'bg-red-100 text-red-600',
};

const statusColors = {
  completed: 'success',
  upcoming: 'primary',
  pending: 'warning',
  cancelled: 'error',
} as const;

export function TimelineView({
  applicationId,
  companyName,
  jobTitle,
  events,
  onEventEdit,
  onAddNote,
  onViewDocument,
}: TimelineViewProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const renderEventContent = (event: TimelineEvent) => {
    const IconComponent = eventIcons[event.type];

    return (
      <Card key={event.id} className="mb-4">
        <CardContent className="p-4">
          <Box className="flex items-start gap-4">
            {/* Event Icon */}
            <Avatar className={`w-10 h-10 ${eventColors[event.type]}`}>
              <IconComponent sx={{ fontSize: 20 }} />
            </Avatar>

            {/* Event Content */}
            <Box className="flex-1">
              <Box className="flex items-start justify-between mb-2">
                <Box>
                  <Typography variant="h6" className="font-semibold mb-1">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    {event.description}
                  </Typography>
                  <Box className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock sx={{ fontSize: 14 }} />
                    <span>{event.date}</span>
                  </Box>
                </Box>

                <Box className="flex items-center gap-2">
                  <Chip
                    label={event.status.replace('_', ' ')}
                    size="small"
                    color={statusColors[event.status]}
                    variant="outlined"
                  />
                  {onEventEdit && (
                    <IconButton
                      size="small"
                      onClick={() => onEventEdit(event.id)}
                      aria-label="Edit event"
                    >
                      <Edit sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {/* Event Metadata */}
              {event.metadata && (
                <Box className="space-y-3 mt-4">
                  {event.metadata.interviewer && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" className="block mb-1">
                        Interviewer:
                      </Typography>
                      <Typography variant="body2">{event.metadata.interviewer}</Typography>
                    </Box>
                  )}

                  {event.metadata.interviewType && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" className="block mb-1">
                        Interview Type:
                      </Typography>
                      <Chip label={event.metadata.interviewType} size="small" variant="outlined" />
                    </Box>
                  )}

                  {event.metadata.documents && event.metadata.documents.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" className="block mb-2">
                        Documents:
                      </Typography>
                      <Box className="flex flex-wrap gap-2">
                        {event.metadata.documents.map((doc, index) => (
                          <Button
                            key={index}
                            size="small"
                            variant="outlined"
                            onClick={() => onViewDocument?.(doc)}
                            endIcon={<ExternalLink sx={{ fontSize: 14 }} />}
                          >
                            {doc}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {event.metadata.notes && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" className="block mb-1">
                        Notes:
                      </Typography>
                      <Typography variant="body2" className="bg-gray-50 p-3 rounded-lg">
                        {event.metadata.notes}
                      </Typography>
                    </Box>
                  )}

                  {event.metadata.nextSteps && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" className="block mb-1">
                        Next Steps:
                      </Typography>
                      <Typography variant="body2" className="text-blue-600">
                        {event.metadata.nextSteps}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Action Buttons */}
              <Box className="flex gap-2 mt-4">
                {onAddNote && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onAddNote(event.id)}
                    startIcon={<MessageCircle sx={{ fontSize: 16 }} />}
                  >
                    Add Note
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          Application Timeline
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {jobTitle} at {companyName}
        </Typography>
      </Box>

      {/* Timeline */}
      <Box className="relative">
        {/* Timeline Line */}
        <Box className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Events */}
        <Box className="space-y-6">
          {sortedEvents.map((event, index) => (
            <Box key={event.id} className="relative">
              {/* Timeline Dot */}
              <Box className="absolute left-6 w-4 h-4 rounded-full bg-white border-4 border-primary z-10" />

              {/* Event Content */}
              <Box className="ml-16">{renderEventContent(event)}</Box>
            </Box>
          ))}
        </Box>

        {/* Future Placeholder */}
        <Box className="relative mt-6">
          <Box className="absolute left-6 w-4 h-4 rounded-full bg-gray-300 border-4 border-gray-400" />
          <Box className="ml-16">
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6 text-center">
                <Typography variant="body1" color="text.secondary">
                  Add more events to track your progress
                </Typography>
                <Button
                  variant="outlined"
                  className="mt-3"
                  startIcon={<Calendar sx={{ fontSize: 16 }} />}
                >
                  Add Event
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Summary Stats */}
      <Card className="mt-8 bg-gray-50">
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            Application Summary
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <Box>
              <Typography variant="h4" className="font-bold text-blue-600">
                {events.filter((e) => e.status === 'completed').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed Events
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" className="font-bold text-orange-600">
                {events.filter((e) => e.status === 'upcoming').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Upcoming Events
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" className="font-bold text-gray-600">
                {Math.floor(
                  (Date.now() - new Date(events[0]?.date || Date.now()).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Days Since Applied
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
