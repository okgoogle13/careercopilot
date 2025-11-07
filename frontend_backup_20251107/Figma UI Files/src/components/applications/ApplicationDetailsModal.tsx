import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Edit2,
  Trash2,
  Archive,
  Link2,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';

export interface ApplicationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  application?: {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    salary?: string;
    appliedDate: string;
    status: 'applied' | 'interviewing' | 'offer' | 'rejected';
    priority: 'low' | 'medium' | 'high';
    notes?: string;
    documents?: {
      id: string;
      type: 'resume' | 'cover_letter' | 'ksc';
      name: string;
      url?: string;
      version?: number;
    }[];
    timeline?: {
      id: string;
      date: string;
      event: string;
      type: 'applied' | 'interview' | 'followup' | 'offer' | 'rejection' | 'note';
    }[];
  };
  onUpdate?: (updatedApplication: any) => void;
  onDelete?: () => void;
}

export function ApplicationDetailsModal({
  open,
  onOpenChange,
  application,
  onUpdate,
  onDelete,
}: ApplicationDetailsModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState(application?.notes || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!application) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'interviewing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'applied':
        return <CheckCircle className="w-4 h-4" />;
      case 'interview':
        return <Calendar className="w-4 h-4" />;
      case 'offer':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejection':
        return <AlertCircle className="w-4 h-4" />;
      case 'followup':
        return <Clock className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleSaveNotes = () => {
    if (onUpdate) {
      onUpdate({
        ...application,
        notes,
      });
    }
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with job info */}
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {application.company} • {application.location}
                </span>
              </div>
              <DialogTitle className="text-2xl">{application.jobTitle}</DialogTitle>
              <DialogDescription className="mt-2">
                Applied on{' '}
                {new Date(application.appliedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </DialogDescription>
            </div>

            {/* Status and Priority badges */}
            <div className="flex gap-2 flex-col">
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
              <Badge className={`text-xs px-2 py-1 ${getPriorityColor(application.priority)}`}>
                {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)}{' '}
                Priority
              </Badge>
            </div>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            {application.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="font-medium">{application.salary}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Applied</p>
                <p className="font-medium">
                  {new Date(application.appliedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Archive className="w-4 h-4" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </DialogHeader>

        {/* Tabbed content */}
        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold">Application Details</h3>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Job Title</label>
                    <Input defaultValue={application.jobTitle} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Company</label>
                    <Input defaultValue={application.company} disabled />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Location</label>
                      <Input defaultValue={application.location} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Salary</label>
                      <Input defaultValue={application.salary || ''} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Title:</span>
                    <span className="font-medium">{application.jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{application.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{application.location}</span>
                  </div>
                  {application.salary && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salary:</span>
                      <span className="font-medium">{application.salary}</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Application Timeline</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Event
                  </Button>
                </div>

                {application.timeline && application.timeline.length > 0 ? (
                  <div className="space-y-4">
                    {application.timeline.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getEventIcon(event.type)}
                          </div>
                          {index < application.timeline!.length - 1 && (
                            <div className="w-0.5 h-12 bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-sm">{event.event}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No timeline events yet</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Associated Documents</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Document
                  </Button>
                </div>

                {application.documents && application.documents.length > 0 ? (
                  <div className="space-y-2">
                    {application.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type.replace('_', ' ')} {doc.version && `• v${doc.version}`}
                            </p>
                          </div>
                        </div>
                        {doc.url && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No documents attached</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Application Notes</h3>

                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this application..."
                      className="min-h-48"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNotes(application.notes || '');
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveNotes}>
                        Save Notes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-4 rounded-lg bg-accent/50 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {notes ? (
                      <p className="text-sm whitespace-pre-wrap">{notes}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No notes yet. Click to add notes.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
