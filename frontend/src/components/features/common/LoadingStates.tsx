import { ArrowLeft, Upload, Description, AutorenewRounded, CheckCircle } from '@mui/icons-material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';

import { Progress } from '../../ui/progress';
import { Skeleton } from '../../ui/skeleton';

import { CareerCopilotLogo } from './CareerCopilotLogo';


interface LoadingStatesProps {
  onBack: () => void;
}

export function LoadingStates({ onBack }: LoadingStatesProps) {
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Simulate progress animations
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 101);
      setUploadProgress((prev) => (prev + 2) % 101);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const analysisSteps = [
    { label: 'Parsing document structure', completed: analysisStep > 0 },
    { label: 'Extracting keywords', completed: analysisStep > 1 },
    { label: 'Running ATS analysis', completed: analysisStep > 2 },
    { label: 'Generating recommendations', completed: analysisStep > 3 },
  ];

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Loading States</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Loading State */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">Profile Card Loading</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        </Card>

        {/* Document Analysis Loading */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">Document Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <AutorenewRounded className="w-6 h-6 text-primary animate-spin" />
              </div>
              <div>
                <p className="font-medium">Analyzing your resume...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
              </div>
            </div>

            <div className="space-y-3">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : index === analysisStep ? (
                    <AutorenewRounded className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-muted rounded-full" />
                  )}
                  <span
                    className={`text-sm ${step.completed ? 'text-green-400' : index === analysisStep ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* File Upload Loading */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">File Upload Progress</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-4">Uploading resume.pdf...</p>
              <Progress value={uploadProgress} className="w-full mb-2" />
              <p className="text-xs text-muted-foreground">{uploadProgress}% completed</p>
            </div>
          </div>
        </Card>

        {/* Template Generation Loading */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">Template Generation</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CareerCopilotLogo className="text-primary" sx={{ fontSize: 32 }} />
              </div>
              <p className="font-medium mb-2">Generating your resume</p>
              <p className="text-sm text-muted-foreground mb-4">
                Applying Modern Minimal template...
              </p>
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-xs text-muted-foreground">Processing content and formatting</p>
            </div>
          </div>
        </Card>

        {/* Dashboard Loading State */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">Dashboard Loading</h3>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 border">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Spinner Variations */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">Loading Spinners</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4 justify-center">
              <AutorenewRounded className="w-6 h-6 text-primary animate-spin" />
              <div className="text-sm text-muted-foreground">Default spinner</div>
            </div>

            <div className="flex items-center gap-4 justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="text-sm text-muted-foreground">Border spinner</div>
            </div>

            <div className="flex items-center gap-4 justify-center">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <div className="text-sm text-muted-foreground">Dot animation</div>
            </div>

            <div className="flex items-center gap-4 justify-center">
              <div className="w-6 h-6 border-2 border-muted rounded-full">
                <div className="w-full h-full border-2 border-primary border-b-transparent rounded-full animate-spin" />
              </div>
              <div className="text-sm text-muted-foreground">Double ring</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Full Page Loading Overlay Example */}
      <Card className="p-6 mt-6">
        <h3 className="font-medium mb-4">Full Page Loading Overlay</h3>
        <div className="relative bg-muted/10 border border-muted rounded-lg h-32 overflow-hidden">
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-3 animate-pulse">
                <CareerCopilotLogo className="text-primary mx-auto" sx={{ fontSize: 32 }} />
              </div>
              <p className="text-sm text-muted-foreground">Loading Career Copilot...</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
