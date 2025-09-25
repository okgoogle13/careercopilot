import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
} from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "application" | "interview" | "follow-up" | "offer" | "rejection" | "acceptance" | "note";
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "upcoming" | "in-progress" | "cancelled";
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
    id: "1",
    type: "application",
    title: "Application Submitted",
    description: "Applied for Senior Frontend Developer position",
    timestamp: "2024-01-15T09:00:00Z",
    status: "completed",
    icon: FileText,
    color: "bg-brand-primary",
    details: {
      documents: ["Resume_v3.pdf", "Cover_Letter.pdf"],
      notes: "Applied through company website",
    },
  },
  {
    id: "2",
    type: "follow-up",
    title: "Application Acknowledged",
    description: "HR confirmed receipt of application",
    timestamp: "2024-01-16T14:30:00Z",
    status: "completed",
    icon: Mail,
    color: "bg-brand-secondary",
    details: {
      notes: "Automated confirmation email received",
    },
  },
  {
    id: "3",
    type: "interview",
    title: "Phone Screening",
    description: "Initial phone call with HR recruiter",
    timestamp: "2024-01-18T10:00:00Z",
    status: "completed",
    icon: Phone,
    color: "bg-brand-primary",
    details: {
      interviewer: "Sarah Johnson - HR Manager",
      platform: "Phone Call",
      notes: "Discussed role requirements and company culture",
      nextSteps: "Technical interview scheduled",
    },
  },
  {
    id: "4",
    type: "interview",
    title: "Technical Interview",
    description: "Video call with engineering team",
    timestamp: "2024-01-22T15:00:00Z",
    status: "completed",
    icon: Video,
    color: "bg-brand-primary",
    details: {
      interviewer: "Mike Chen - Senior Engineer",
      platform: "Google Meet",
      notes: "Live coding session, discussed React patterns",
      nextSteps: "Final round with CTO",
    },
  },
  {
    id: "5",
    type: "interview",
    title: "Final Interview",
    description: "Meeting with CTO and team leads",
    timestamp: "2024-01-25T11:00:00Z",
    status: "in-progress",
    icon: User,
    color: "bg-brand-tertiary",
    details: {
      interviewer: "Alex Rodriguez - CTO",
      platform: "In-person",
      notes: "Culture fit and leadership discussion",
    },
  },
  {
    id: "6",
    type: "offer",
    title: "Job Offer Expected",
    description: "Decision expected within 3-5 business days",
    timestamp: "2024-01-28T17:00:00Z",
    status: "upcoming",
    icon: Star,
    color: "bg-aurora-tertiary",
    details: {
      nextSteps: "HR will contact with decision",
    },
  },
];

const TimelineEventComponent: React.FC<{
  event: TimelineEvent;
  isLast: boolean;
  isLatest: boolean;
}> = ({ event, isLast, isLatest }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-brand-primary border-brand-primary";
      case "in-progress":
        return "text-brand-tertiary border-brand-tertiary";
      case "upcoming":
        return "text-brand-secondary border-brand-secondary";
      case "cancelled":
        return "text-brand-error border-brand-error";
      default:
        return "text-on-surface-variant border-outline-variant";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Clock;
      case "upcoming":
        return AlertCircle;
      case "cancelled":
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
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const IconComponent = event.icon;
  const StatusIcon = getStatusIcon(event.status);

  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-outline-variant opacity-50"></div>
      )}

      {/* Timeline Icon */}
      <div
        className={`
        relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
        ${getStatusColor(event.status)}
        ${isLatest ? "ring-4 ring-brand-primary/20 shadow-glow-primary" : ""}
        transition-all duration-300
      `}
      >
        <div
          className={`
          w-8 h-8 rounded-full ${event.color} flex items-center justify-center
          ${isLatest ? "animate-pulse" : ""}
        `}
        >
          <IconComponent className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Event Content */}
      <Card
        className={`
        flex-1 mb-6 transition-all duration-300
        ${isLatest ? "card-aurora ring-1 ring-brand-primary/20" : "card-surface"}
      `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-on-surface">{event.title}</h3>
                <StatusIcon className={`w-4 h-4 ${getStatusColor(event.status).split(" ")[0]}`} />
              </div>
              <p className="text-sm text-on-surface-variant mb-2">{event.description}</p>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Calendar className="w-3 h-3" />
                <span>{formatTimestamp(event.timestamp)}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`text-xs ${getStatusColor(event.status)} bg-transparent`}
            >
              {event.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Details */}
          {event.details && (
            <div className="space-y-2">
              {event.details.interviewer && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <User className="w-3 h-3" />
                  <span>{event.details.interviewer}</span>
                </div>
              )}
              {event.details.platform && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Video className="w-3 h-3" />
                  <span>{event.details.platform}</span>
                </div>
              )}
              {event.details.documents && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <FileText className="w-3 h-3" />
                  <span>
                    {event.details.documents.length} document
                    {event.details.documents.length !== 1 ? "s" : ""} shared
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Expandable Content */}
          {event.details?.notes && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 text-xs text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10"
              >
                {isExpanded ? "Show Less" : "Show Details"}
              </Button>

              {isExpanded && (
                <div className="mt-2 p-3 bg-surface-container-low rounded-lg animate-slide-up">
                  <div className="space-y-2 text-sm">
                    {event.details.notes && (
                      <div>
                        <h4 className="font-medium text-on-surface mb-1">Notes:</h4>
                        <p className="text-on-surface-variant">{event.details.notes}</p>
                      </div>
                    )}
                    {event.details.nextSteps && (
                      <div>
                        <h4 className="font-medium text-on-surface mb-1">Next Steps:</h4>
                        <p className="text-on-surface-variant">{event.details.nextSteps}</p>
                      </div>
                    )}
                    {event.details.documents && (
                      <div>
                        <h4 className="font-medium text-on-surface mb-1">Documents:</h4>
                        <div className="flex flex-wrap gap-1">
                          {event.details.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {doc}
                            </Badge>
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
      </Card>
    </div>
  );
};

interface TimelineViewProps {
  applicationId?: string;
  jobTitle?: string;
  companyName?: string;
  onBack?: () => void;
  className?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  applicationId,
  jobTitle = "Senior Frontend Developer",
  companyName = "TechCorp",
  onBack,
  className = "",
}) => {
  const [events] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [filter, setFilter] = useState<"all" | "interviews" | "communications">("all");

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    if (filter === "interviews") return event.type === "interview";
    if (filter === "communications") return ["follow-up", "note"].includes(event.type);
    return true;
  });

  const latestEventIndex =
    events.findIndex((event) => event.status === "in-progress") !== -1
      ? events.findIndex((event) => event.status === "in-progress")
      : 0;

  const handleAddEvent = () => {
    console.log("Add new timeline event");
    // This would open a modal to add a new event
  };

  const getProgressPercentage = () => {
    const completedEvents = events.filter((event) => event.status === "completed").length;
    return Math.round((completedEvents / events.length) * 100);
  };

  return (
    <div className={`min-h-screen bg-surface ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-lg border-b border-outline-variant">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-medium text-on-surface mb-1">Application Timeline</h1>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Building2 className="w-4 h-4" />
                  <span>
                    {jobTitle} at {companyName}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={handleAddEvent} className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          {/* Progress and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-surface-container-high rounded-full">
                  <div
                    className="h-full bg-aurora-primary rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <span className="text-sm text-on-surface-variant">
                  {getProgressPercentage()}% Complete
                </span>
              </div>
            </div>

            <div className="flex gap-1">
              {[
                { key: "all", label: "All Events" },
                { key: "interviews", label: "Interviews" },
                { key: "communications", label: "Communications" },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(key as any)}
                  className={filter === key ? "btn-gradient" : ""}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {filteredEvents.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-on-surface-variant/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-on-surface mb-2">No Events Found</h3>
              <p className="text-on-surface-variant mb-4">
                {filter === "all"
                  ? "No timeline events have been recorded yet."
                  : `No ${filter} events found.`}
              </p>
              <Button onClick={handleAddEvent} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add First Event
              </Button>
            </Card>
          ) : (
            <div className="space-y-0">
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
