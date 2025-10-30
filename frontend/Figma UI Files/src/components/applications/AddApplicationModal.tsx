import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Stepper } from '../ui/stepper';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Card } from '../ui/card';
import { DatePicker } from '../ui/date-picker';
import { Badge } from '../ui/badge';
import { Link2, Zap, CheckCircle2, FileText, Calendar, Flag, AlertCircle } from 'lucide-react';

export interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateApplication?: (application: {
    jobTitle: string;
    company: string;
    location: string;
    salary?: string;
    jobDescription: string;
    jobUrl?: string;
    documents: string[]; // document IDs
    deadline?: Date;
    priority: 'low' | 'medium' | 'high';
    notes?: string;
  }) => void;
  existingDocuments?: Array<{
    id: string;
    name: string;
    type: 'resume' | 'cover_letter' | 'ksc';
  }>;
}

export function AddApplicationModal({
  open,
  onOpenChange,
  onCreateApplication,
  existingDocuments = [],
}: AddApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isParsingUrl, setIsParsingUrl] = useState(false);

  // Step 1: Job Details
  const [jobUrl, setJobUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Step 2: Documents
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Step 3: Tracking
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [priority, setPriority] = useState<'medium'>('medium');
  const [notes, setNotes] = useState('');

  const steps = [
    { label: 'Job Details', description: 'Enter job information' },
    { label: 'Documents', description: 'Select documents to attach' },
    { label: 'Tracking', description: 'Set deadline and priority' },
  ];

  const handleParseUrl = async () => {
    if (!jobUrl) return;

    setIsParsingUrl(true);
    // Simulate parsing - in real app, this would call an API
    setTimeout(() => {
      // Mock parsed data
      setCompany('Tech Company');
      setJobTitle('Senior Developer');
      setLocation('San Francisco, CA');
      setSalary('$120k - $150k');
      setJobDescription('We are looking for an experienced developer...');
      setIsParsingUrl(false);
    }, 1500);
  };

  const handleToggleDocument = (docId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleCreateApplication = () => {
    if (!jobTitle || !company || !location) {
      alert('Please fill in required fields');
      return;
    }

    if (onCreateApplication) {
      onCreateApplication({
        jobTitle,
        company,
        location,
        salary: salary || undefined,
        jobDescription,
        jobUrl: jobUrl || undefined,
        documents: selectedDocuments,
        deadline,
        priority: priority as 'low' | 'medium' | 'high',
        notes: notes || undefined,
      });
    }

    // Reset form
    setCurrentStep(0);
    setJobUrl('');
    setJobTitle('');
    setCompany('');
    setLocation('');
    setSalary('');
    setJobDescription('');
    setSelectedDocuments([]);
    setDeadline(undefined);
    setPriority('medium');
    setNotes('');

    onOpenChange(false);
  };

  const canProceedToStep2 = jobTitle && company && location;
  const canProceedToStep3 = true; // Documents are optional

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
          <DialogDescription>Follow the steps to track a new job application</DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="mt-6 mb-6">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Step 1: Job Details */}
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* URL Input Section */}
            <Card className="p-4 bg-accent/30 border-dashed">
              <div className="flex items-start gap-3 mb-3">
                <Link2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-3">Job Posting URL (Optional)</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste job posting URL..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      disabled={isParsingUrl}
                    />
                    <Button
                      variant="outline"
                      onClick={handleParseUrl}
                      disabled={!jobUrl || isParsingUrl}
                      className="shrink-0"
                    >
                      {isParsingUrl ? (
                        <>
                          <span className="animate-spin">⚙️</span>
                          Parse
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Auto-Fill
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Paste a link to automatically extract job details
                  </p>
                </div>
              </div>
            </Card>

            {/* Manual Entry Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Job Information
              </h3>

              <div>
                <label className="text-sm font-medium block mb-2">Job Title *</label>
                <Input
                  placeholder="e.g., Senior Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-2">Company *</label>
                  <Input
                    placeholder="e.g., TechCorp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Location *</label>
                  <Input
                    placeholder="e.g., San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Salary Range (Optional)</label>
                <Input
                  placeholder="e.g., $120k - $150k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-32"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Select Documents to Attach
              </h3>

              {existingDocuments.length > 0 ? (
                <div className="space-y-3">
                  {existingDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => handleToggleDocument(doc.id)}
                    >
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => handleToggleDocument(doc.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type.replace('_', ' ')}
                        </p>
                      </div>
                      {selectedDocuments.includes(doc.id) && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No documents available yet</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                Documents can be attached after creating the application
              </p>
            </div>

            {/* Option to generate documents */}
            <Card className="p-4 bg-accent/30 border-dashed">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Generate Tailored Documents</h4>
                  <p className="text-sm text-muted-foreground">
                    After creating the application, you can generate tailored resume and cover
                    letter for this position.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Tracking */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Track Application Progress
              </h3>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Application Deadline (Optional)
                </label>
                <DatePicker
                  value={deadline}
                  onChange={setDeadline}
                  placeholder="Select deadline date"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Priority Level</label>
                <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <Flag className="w-3 h-3" />
                        Low Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Flag className="w-3 h-3" />
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <Flag className="w-3 h-3" />
                        High Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Notes (Optional)</label>
                <Textarea
                  placeholder="Add any notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-24"
                />
              </div>
            </div>

            {/* Summary Card */}
            <Card className="p-4 bg-accent/30">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Application Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium">{jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium">{company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{location}</span>
                </div>
                {selectedDocuments.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Documents:</span>
                    <Badge variant="secondary">{selectedDocuments.length}</Badge>
                  </div>
                )}
                {deadline && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium">
                      {deadline.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="mt-6 flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === 0) {
                onOpenChange(false);
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 0 ? !canProceedToStep2 : !canProceedToStep3}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleCreateApplication}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Create Application
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
