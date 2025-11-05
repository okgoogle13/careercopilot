import { Close, ArrowLeft } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

// import { KanbanBoard } from '../features/opportunities/KanbanBoard';
import { TimelineView } from './TimelineView';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  nextEvent?: {
    type: string;
    date: string;
  };
  progress: number;
  companyLogo?: string;
}

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

interface ApplicationTrackerProps {
  applications?: Application[];
  onApplicationUpdate?: (application: Application) => void;
}

// Sample timeline events for demonstration
const sampleTimelineEvents: Record<string, TimelineEvent[]> = {
  '1': [
    {
      id: 'ev1',
      type: 'application',
      title: 'Application Submitted',
      description: 'Successfully submitted application through company portal',
      date: '2024-01-15 09:00 AM',
      status: 'completed',
      metadata: {
        documents: ['Resume.pdf', 'Cover Letter.pdf'],
        notes: 'Applied through LinkedIn job posting',
      },
    },
    {
      id: 'ev2',
      type: 'response',
      title: 'Application Acknowledged',
      description: 'Received automated confirmation email',
      date: '2024-01-15 09:15 AM',
      status: 'completed',
    },
    {
      id: 'ev3',
      type: 'interview',
      title: 'Phone Screening Scheduled',
      description: 'HR phone screening interview scheduled',
      date: '2024-01-18 02:00 PM',
      status: 'upcoming',
      metadata: {
        interviewer: 'Sarah Johnson (HR)',
        interviewType: 'Phone Screen',
        nextSteps: 'Prepare for behavioral questions and company research',
      },
    },
  ],
  '2': [
    {
      id: 'ev4',
      type: 'application',
      title: 'Application Submitted',
      description: 'Applied for Frontend Developer position',
      date: '2024-01-08 10:30 AM',
      status: 'completed',
      metadata: {
        documents: ['Resume.pdf', 'Portfolio Link'],
        notes: 'Referred by current employee John Smith',
      },
    },
    {
      id: 'ev5',
      type: 'interview',
      title: 'Phone Screening',
      description: 'Initial phone screening with HR',
      date: '2024-01-10 03:00 PM',
      status: 'completed',
      metadata: {
        interviewer: 'Mike Chen (HR)',
        interviewType: 'Phone Screen',
        notes: 'Went well, discussed role requirements and team structure',
      },
    },
    {
      id: 'ev6',
      type: 'interview',
      title: 'Technical Interview',
      description: 'Technical interview with senior engineers',
      date: '2024-01-19 10:00 AM',
      status: 'upcoming',
      metadata: {
        interviewer: 'Alex Rodriguez, Jennifer Wang (Engineering)',
        interviewType: 'Technical Interview',
        nextSteps: 'Review React concepts and prepare coding exercises',
      },
    },
  ],
};

export function ApplicationTracker({ applications, onApplicationUpdate }: ApplicationTrackerProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const selectedApplication = applications?.find((app) => app.id === selectedApplicationId);
  const timelineEvents = selectedApplicationId
    ? sampleTimelineEvents[selectedApplicationId] || []
    : [];

  const handleApplicationClick = (_applicationId: string) => {
    setSelectedApplicationId(_applicationId);
    setShowTimeline(true);
  };

  const handleCloseTimeline = () => {
    setShowTimeline(false);
    setSelectedApplicationId(null);
  };

  const handleApplicationMove = (_applicationId: string, newStatus: Application['status']) => {
    if (applications && onApplicationUpdate) {
      const application = applications.find((app) => app.id === _applicationId);
      if (application) {
        const updatedApplication = { ...application, status: newStatus };
        onApplicationUpdate(updatedApplication);
      }
    }
  };

  const handleAddApplication = () => {
    // This would typically open a form to add a new application
    console.log('Add new application');
  };

  const handleEventEdit = (eventId: string) => {
    console.log('Edit event:', eventId);
  };

  const handleAddNote = (eventId: string) => {
    console.log('Add note to event:', eventId);
  };

  const handleViewDocument = (documentName: string) => {
    console.log('View document:', documentName);
  };

  return (
    <Box sx={{
      width: "100%"
    }}>
      {/* Kanban Board View (WIP) */}
      {/* <KanbanBoard
        applications={applications}
        onApplicationMove={handleApplicationMove}
        onApplicationClick={handleApplicationClick}
        onAddApplication={handleAddApplication}
      /> */}

      {/* Timeline View Dialog */}
      <Dialog
        open={showTimeline}
        onClose={handleCloseTimeline}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          className: 'max-h-screen',
        }}
      >
        <DialogTitle>
          <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
            <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
              <IconButton
                onClick={handleCloseTimeline}
                size="small"
                aria-label="Back to kanban view"
              >
                <ArrowLeft sx={{ fontSize: 20 }} />
              </IconButton>
              <Typography variant="h6">Application Timeline</Typography>
            </Box>
            <IconButton onClick={handleCloseTimeline} size="small" aria-label="Close dialog">
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{
      p: 0
    }}>
          {selectedApplication && (
            <Box sx={{
      p: 6
    }}>
              <TimelineView
                applicationId={selectedApplication.id}
                companyName={selectedApplication.company}
                jobTitle={selectedApplication.jobTitle}
                events={timelineEvents}
                onEventEdit={handleEventEdit}
                onAddNote={handleAddNote}
                onViewDocument={handleViewDocument}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseTimeline}>Close</Button>
          <Button variant="contained" sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true }
    }}>
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
