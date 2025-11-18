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
import { Box } from '@mui/material';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import React from 'react';

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
  follow_up: Clock,
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
  applicationId: _applicationId,
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
      <Card key={event.id} sx={{
      mb: 4
    }}>
        <CardContent sx={{
      p: 4
    }}>
          <Box sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 4
    }}>
            {/* Event Icon */}
            <Avatar sx={{}}>
              <IconComponent sx={{ fontSize: 20 }} />
            </Avatar>

            {/* Event Content */}
            <Box sx={{
      flex: 1
    }}>
              <Box sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      mb: 2
    }}>
                <Box>
                  <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 1
    }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
      mb: 2
    }}>
                    {event.description}
                  </Typography>
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      typography: "body1",
      color: "gray.500"
    }}>
                    <Clock sx={{ fontSize: 14 }} />
                    <span>{event.date}</span>
                  </Box>
                </Box>

                <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
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
                <Box sx={{
      mt: 4
    }}>
                  {event.metadata.interviewer && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{
      mb: 1
    }}>
                        Interviewer:
                      </Typography>
                      <Typography variant="body2">{event.metadata.interviewer}</Typography>
                    </Box>
                  )}

                  {event.metadata.interviewType && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{
      mb: 1
    }}>
                        Interview Type:
                      </Typography>
                      <Chip label={event.metadata.interviewType} size="small" variant="outlined" />
                    </Box>
                  )}

                  {event.metadata.documents && event.metadata.documents.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{
      mb: 2
    }}>
                        Documents:
                      </Typography>
                      <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
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
                      <Typography variant="caption" color="text.secondary" sx={{
      mb: 1
    }}>
                        Notes:
                      </Typography>
                      <Typography variant="body2" sx={{
      bgcolor: "gray.50",
      p: 3,
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                        {event.metadata.notes}
                      </Typography>
                    </Box>
                  )}

                  {event.metadata.nextSteps && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{
      mb: 1
    }}>
                        Next Steps:
                      </Typography>
                      <Typography variant="body2" sx={{
      color: "blue.600"
    }}>
                        {event.metadata.nextSteps}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{
      display: "flex",
      gap: 2,
      mt: 4
    }}>
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
    <Box sx={{
      width: "100%",}}>
      {/* Header */}
      <Box sx={{
      mb: 6
    }}>
        <Typography variant="h4" sx={{
      fontWeight: 700,
      mb: 2
    }}>
          Application Timeline
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {jobTitle} at {companyName}
        </Typography>
      </Box>

      {/* Timeline */}
      <Box sx={{}}>
        {/* Timeline Line */}
        <Box sx={{
      bgcolor: "gray.200"
    }} />

        {/* Events */}
        <Box sx={{}}>
          {sortedEvents.map((event, index) => (
            <Box key={event.id} sx={{}}>
              {/* Timeline Dot */}
              <Box sx={{
      borderRadius: "var(--sys-shape-radius-full)",
      bgcolor: "common.white",
      border: 4,}} />

              {/* Event Content */}
              <Box sx={{
      ml: 16
    }}>{renderEventContent(event)}</Box>
            </Box>
          ))}
        </Box>

        {/* Future Placeholder */}
        <Box sx={{
      mt: 6
    }}>
          <Box sx={{
      borderRadius: "var(--sys-shape-radius-full)",
      bgcolor: "gray.300",
      border: 4,}} />
          <Box sx={{
      ml: 16
    }}>
            <Card sx={{
      borderStyle: "dashed",
      border: 2,
      borderColor: "gray.300"
    }}>
              <CardContent sx={{
      p: 6,
      textAlign: "center"
    }}>
                <Typography variant="body1" color="text.secondary">
                  Add more events to track your progress
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
      mt: 3
    }}
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
      <Card sx={{
      mt: 8,
      bgcolor: "gray.50"
    }}>
        <CardContent sx={{
      p: 6
    }}>
          <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 4
    }}>
            Application Summary
          </Typography>
          <Box sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 4,
      textAlign: "center"
    }}>
            <Box>
              <Typography variant="h4" sx={{
      fontWeight: 700,
      color: "blue.600"
    }}>
                {events.filter((e) => e.status === 'completed').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed Events
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{
      fontWeight: 700,
      color: "orange.600"
    }}>
                {events.filter((e) => e.status === 'upcoming').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Upcoming Events
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{
      fontWeight: 700,
      color: "gray.600"
    }}>
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
