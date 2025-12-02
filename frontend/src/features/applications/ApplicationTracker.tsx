/**
 * ELECTRIC ALCHEMIST: APPLICATION TRACKER COMPONENT
 *
 * Application tracker using Electric Alchemist Design System v4.4.
 */

import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components';
import { TimelineView } from '@/components/electric';

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
    <div className="w-full">
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="max-w-4xl max-h-[calc(100vh-64px)] bg-surface-container-low">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseTimeline}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-hero text-lg font-semibold">
                  Application Timeline
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseTimeline}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedApplication && (
            <div className="p-6">
              <TimelineView
                applicationId={selectedApplication.id}
                companyName={selectedApplication.company}
                jobTitle={selectedApplication.jobTitle}
                events={timelineEvents}
                onEventEdit={handleEventEdit}
                onAddNote={handleAddNote}
                onViewDocument={handleViewDocument}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseTimeline}>
              Close
            </Button>
            <Button variant="default">Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApplicationTracker;

