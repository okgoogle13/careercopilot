import { Close, ArrowLeft } from '@mui/icons-material';
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

import { TimelineView } from './TimelineView';
// import { KanbanBoard } from '../features/opportunities/KanbanBoard';

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
  type:
    | 'application'
    | 'interview'
    | 'response'
    | 'follow_up'
    | 'offer'
    | 'rejection';
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
};
export function ApplicationTracker({
  applications,
  onApplicationUpdate,
}: ApplicationTrackerProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const selectedApplication = applications?.find(
    (app) => app.id === selectedApplicationId
  );
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
  const handleApplicationMove = (
    _applicationId: string,
    newStatus: Application['status']
  ) => {
    if (applications && onApplicationUpdate) {
      const application = applications.find((app) => app.id === _applicationId);
      if (application) {
        const updatedApplication = { ...application, status: newStatus };
        onApplicationUpdate(updatedApplication);
      }
    }
  };
  const handleAddApplication = () => {
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
    <Box sx={{ width: '100%' }}>
      {/* <KanbanBoard
        applications={applications}
        onApplicationMove={handleApplicationMove}
        onApplicationClick={handleApplicationClick}
        onAddApplication={handleAddApplication}
      /> */}
      <Dialog
        open={showTimeline}
        onClose={handleCloseTimeline}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: 'calc(100vh - 64px)',
            backgroundColor: 'var(--sys-color-surface-container-low)',
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sys-spacing-2)',
              }}
            >
              <IconButton
                onClick={handleCloseTimeline}
                size="small"
                aria-label="Back to kanban view"
              >
                <ArrowLeft />
              </IconButton>
              <Typography sx={{ font: 'var(--sys-type-headline-small)' }}>
                Application Timeline
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseTimeline}
              size="small"
              aria-label="Close dialog"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {selectedApplication && (
            <Box sx={{ p: 'var(--sys-spacing-6)' }}>
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

        <DialogActions sx={{ p: 'var(--sys-spacing-3)' }}>
          <Button
            onClick={handleCloseTimeline}
            sx={{ color: 'var(--sys-color-primary)' }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'var(--sys-color-primary)',
              color: 'var(--sys-color-on-primary)',
              '&:hover': {
                backgroundColor: 'var(--sys-color-primary-dark)',
              },
            }}
          >
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}