/**
 * ELECTRIC ALCHEMIST: IMPORT WIZARD COMPONENT
 *
 * A multi-step wizard for importing profile data from various sources.
 */

import React, { useState } from 'react';
import { Upload, Linkedin, FileText, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components';
import { ElectricCard as Card } from '@/components/electric/card';
import { ElectricProgress as Progress } from '@/components/electric/progress';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/electric/tabs';
import { cn } from '@/lib/utils';

type ImportSource = 'linkedin' | 'resume' | 'manual';

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  className?: string;
}

export function ImportWizard({ open, onClose, onComplete, className }: ImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<ImportSource | null>(null);
  const [activeTab, setActiveTab] = useState<string>('linkedin');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importedData, setImportedData] = useState<any>(null);

  const steps = [
    { id: 1, name: 'Select Source', description: 'Choose where to import from' },
    { id: 2, name: 'Authenticate', description: 'Connect to the service' },
    { id: 3, name: 'Review', description: 'Verify your data' },
    { id: 4, name: 'Complete', description: 'Import successful' },
  ];

  const handleSourceSelect = (source: ImportSource) => {
    setSelectedSource(source);
    setCurrentStep(2);
    // Simulate authentication step
    simulateAuthentication();
  };

  const simulateAuthentication = () => {
    setIsLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          setCurrentStep(3);
          // Mock imported data
          setImportedData({
            name: 'John Doe',
            email: 'john.doe@example.com',
            title: 'Senior Software Engineer',
            experience: [
              { title: 'Senior Software Engineer', company: 'Tech Corp', duration: '2020 - Present' },
              { title: 'Software Engineer', company: 'Dev Solutions', duration: '2017 - 2020' },
            ],
            education: [
              { degree: 'B.Sc. Computer Science', institution: 'Tech University', year: '2017' },
            ],
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
          });
        }
        return Math.min(newProgress, 100);
      });
    }, 300);
  };

  const handleComplete = () => {
    setCurrentStep(4);
    // Simulate completion delay
    setTimeout(() => {
      onComplete(importedData);
      onClose();
      // Reset wizard
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedSource(null);
        setProgress(0);
        setImportedData(null);
      }, 500);
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card
              className={cn(
                'p-6 text-center cursor-pointer transition-all',
                'hover:border-primary hover:shadow-md',
                selectedSource === 'linkedin' && 'border-2 border-primary'
              )}
              onClick={() => handleSourceSelect('linkedin')}
            >
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Linkedin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium mb-1">LinkedIn</h3>
              <p className="text-sm text-on-surface-variant">Import your LinkedIn profile</p>
            </Card>

            <Card
              className={cn(
                'p-6 text-center cursor-pointer transition-all',
                'hover:border-primary hover:shadow-md',
                selectedSource === 'resume' && 'border-2 border-primary'
              )}
              onClick={() => handleSourceSelect('resume')}
            >
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium mb-1">Resume/CV</h3>
              <p className="text-sm text-on-surface-variant">Upload a resume or CV file</p>
            </Card>

            <Card
              className={cn(
                'p-6 text-center cursor-pointer transition-all',
                'hover:border-primary hover:shadow-md',
                selectedSource === 'manual' && 'border-2 border-primary'
              )}
              onClick={() => handleSourceSelect('manual')}
            >
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium mb-1">Manual Entry</h3>
              <p className="text-sm text-on-surface-variant">Enter your details manually</p>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="mt-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              ) : (
                <Check className="h-10 w-10 text-primary" />
              )}
            </div>
            <h3 className="text-xl font-medium mb-2">
              {isLoading ? 'Connecting to ' : 'Connected to '}
              {selectedSource === 'linkedin' && 'LinkedIn'}
              {selectedSource === 'resume' && 'Resume Parser'}
              {selectedSource === 'manual' && 'Manual Entry'}
            </h3>
            <p className="text-on-surface-variant mb-6">
              {isLoading
                ? 'Please wait while we connect to the service...'
                : 'Successfully connected! Click next to continue.'}
            </p>
            
            {isLoading && (
              <div className="max-w-md mx-auto mt-8">
                <div className="flex justify-between text-sm text-on-surface-variant mb-1">
                  <span>Connecting...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Review Your Information</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="linkedin">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger value="resume">
                  <FileText className="mr-2 h-4 w-4" />
                  Resume
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <FileText className="mr-2 h-4 w-4" />
                  Manual
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="linkedin" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-on-surface-variant">Full Name</p>
                    <p className="font-medium">{importedData?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Email</p>
                    <p className="font-medium">{importedData?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Current Title</p>
                    <p className="font-medium">{importedData?.title || 'N/A'}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-4">
                {importedData?.experience?.length > 0 ? (
                  <ul className="space-y-4">
                    {importedData.experience.map((exp: any, index: number) => (
                      <li key={index} className="border-l-2 border-primary pl-4 py-1">
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm text-on-surface-variant">{exp.company}</p>
                        <p className="text-xs text-on-surface-variant/70">{exp.duration}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-on-surface-variant">No experience found</p>
                )}
              </TabsContent>
              
              <TabsContent value="skills">
                {importedData?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {importedData.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant">No skills found</p>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-4 border-t border-outline-variant">
              <p className="text-sm text-on-surface-variant mb-4">
                Please review your information above. You can edit any details after importing.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Import Complete!</h3>
            <p className="text-on-surface-variant mb-6">
              Your profile has been successfully imported and saved.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50',
        !open && 'hidden',
        className
      )}
    >
      <div className="bg-surface-container-highest rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Import Profile</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-surface-variant/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        currentStep > step.id
                          ? 'bg-primary text-on-primary'
                          : currentStep === step.id
                          ? 'border-2 border-primary text-primary'
                          : 'border-2 border-outline text-on-surface-variant',
                        'transition-colors duration-200'
                      )}
                    >
                      {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                    </div>
                    <span
                      className={cn(
                        'text-xs mt-1',
                        currentStep >= step.id ? 'text-on-surface' : 'text-on-surface-variant'
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-2',
                        currentStep > step.id ? 'bg-primary' : 'bg-outline-variant'
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {renderStepContent()}

          <div className="mt-8 pt-4 border-t border-outline-variant flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  onClose();
                }
              }}
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={() => {
                  if (currentStep === 3) {
                    handleComplete();
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                disabled={isLoading || (currentStep === 1 && !selectedSource) || (currentStep === 2 && progress < 100)}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={onClose}>Done</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportWizard;
