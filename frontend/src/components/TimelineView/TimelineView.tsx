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
      <div key={event.id} className="mb-4 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-start gap-4">
          {/* Event Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-gray-500" />
          </div>

          {/* Event Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[event.status]
                  }`}
                >
                  {event.status.replace('_', ' ')}
                </div>
                {onEventEdit && (
                  <button
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => onEventEdit(event.id)}
                    aria-label="Edit event"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Event Metadata */}
            {event.metadata && (
              <div className="mt-4">
                {event.metadata.interviewer && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Interviewer:</p>
                    <p className="text-sm">{event.metadata.interviewer}</p>
                  </div>
                )}

                {event.metadata.interviewType && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Interview Type:</p>
                    <div className="px-2 py-1 text-xs font-medium rounded-full border">
                      {event.metadata.interviewType}
                    </div>
                  </div>
                )}

                {event.metadata.documents && event.metadata.documents.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Documents:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.metadata.documents.map((doc, index) => (
                        <button
                          key={index}
                          className="px-2 py-1 text-xs font-medium rounded-full border hover:bg-gray-100 flex items-center gap-1"
                          onClick={() => onViewDocument?.(doc)}
                        >
                          {doc}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {event.metadata.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Notes:</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">
                      {event.metadata.notes}
                    </p>
                  </div>
                )}

                {event.metadata.nextSteps && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Next Steps:</p>
                    <p className="text-sm text-blue-600">{event.metadata.nextSteps}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {onAddNote && (
                <button
                  className="px-2 py-1 text-xs font-medium rounded-full border hover:bg-gray-100 flex items-center gap-1"
                  onClick={() => onAddNote(event.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Add Note
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Application Timeline</h1>
        <h2 className="text-xl text-gray-600">
          {jobTitle} at {companyName}
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200" />

        {/* Events */}
        <div className="relative">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative pl-16">
              {/* Timeline Dot */}
              <div className="absolute left-2.5 top-2 w-5 h-5 rounded-full bg-white border-4 border-gray-300" />

              {/* Event Content */}
              {renderEventContent(event)}
            </div>
          ))}
        </div>

        {/* Future Placeholder */}
        <div className="relative pl-16 mt-6">
          <div className="absolute left-2.5 top-2 w-5 h-5 rounded-full bg-gray-300 border-4 border-white" />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600">
              Add more events to track your progress
            </p>
            <button className="mt-3 px-3 py-1 text-sm font-medium rounded-full border hover:bg-gray-100 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Application Summary</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">
              {events.filter((e) => e.status === 'completed').length}
            </p>
            <p className="text-xs text-gray-500">Completed Events</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">
              {events.filter((e) => e.status === 'upcoming').length}
            </p>
            <p className="text-xs text-gray-500">Upcoming Events</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-600">
              {Math.floor(
                (Date.now() - new Date(events[0]?.date || Date.now()).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </p>
            <p className="text-xs text-gray-500">Days Since Applied</p>
          </div>
        </div>
      </div>
    </div>
  );
}
