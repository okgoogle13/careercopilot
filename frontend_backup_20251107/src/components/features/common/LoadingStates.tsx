import { ArrowLeft, Upload, Description, AutorenewRounded, CheckCircle } from '@mui/icons-material';
import { Box } from '@mui/material';
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
    <div sx={{
      flex: 1,
      p: 8
    }}>
      <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 8
    }}>
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
          <Button
            variant="text"
            onClick={onBack}
            sx={{
      "text-muted-foreground": true,
      '&:hover': { "text-foreground": true }
    }}
          >
            <ArrowLeft sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
            Back to Dashboard
          </Button>
          <h1 sx={{
      typography: h4,
      fontWeight: 700,
      "text-foreground": true
    }}>Loading States</h1>
        </div>
      </div>

      <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('md')]: { "grid-cols-2": true },
      gap: 6
    }}>
        {/* Profile Loading State */}
        <Card sx={{
      p: 6
    }}>
          <h3 sx={{
      fontWeight: 500,
      mb: 4
    }}>Profile Card Loading</h3>
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
              <Skeleton sx={{
      "w-12": true,
      "h-12": true,
      borderRadius: 9999px
    }} />
              <div sx={{
      "space-y-2": true
    }}>
                <Skeleton sx={{
      "h-4": true,
      "w-32": true
    }} />
                <Skeleton sx={{
      "h-3": true,
      "w-24": true
    }} />
              </div>
            </div>
            <div sx={{
      "space-y-3": true
    }}>
              <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
                <Skeleton sx={{
      "h-3": true,
      "w-28": true
    }} />
                <Skeleton sx={{
      "h-3": true,
      "w-8": true
    }} />
              </div>
              <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
                <Skeleton sx={{
      "h-3": true,
      "w-24": true
    }} />
                <Skeleton sx={{
      "h-3": true,
      "w-12": true
    }} />
              </div>
              <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
                <Skeleton sx={{
      "h-3": true,
      "w-20": true
    }} />
                <Skeleton sx={{
      "h-3": true,
      "w-16": true
    }} />
              </div>
            </div>
            <div sx={{
      display: "flex",
      gap: 2,
      pt: 2
    }}>
              <Skeleton sx={{
      "h-8": true,
      flex: 1
    }} />
              <Skeleton sx={{
      "h-8": true,
      flex: 1
    }} />
            </div>
          </div>
        </Card>

        {/* Document Analysis Loading */}
        <Card sx={{
      p: 6
    }}>
          <h3 sx={{
      fontWeight: 500,
      mb: 4
    }}>Document Analysis</h3>
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
              <div sx={{
      "w-12": true,
      "h-12": true,
      "bg-primary/10": true,
      borderRadius: 9999px,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                <AutorenewRounded sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true,
      "animate-spin": true
    }} />
              </div>
              <div>
                <p sx={{
      fontWeight: 500
    }}>Analyzing your resume...</p>
                <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>This may take a few moments</p>
              </div>
            </div>

            <div sx={{
      "space-y-3": true
    }}>
              {analysisSteps.map((step, index) => (
                <div key={index} sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                  {step.completed ? (
                    <CheckCircle sx={{
      "w-4": true,
      "h-4": true,
      "text-green-400": true
    }} />
                  ) : index === analysisStep ? (
                    <AutorenewRounded sx={{
      "w-4": true,
      "h-4": true,
      "text-primary": true,
      "animate-spin": true
    }} />
                  ) : (
                    <div sx={{
      "w-4": true,
      "h-4": true,
      border: 2,
      "border-muted": true,
      borderRadius: 9999px
    }} />
                  )}
                  <span
                    sx={{
      typography: body1,
      "${step.completed": true,
      "?": true,
      "'text-green-400'": true,
      ":": true,
      "index": true,
      "===": true,
      "analysisStep": true,
      "?": true,
      "'text-primary'": true,
      ":": true,
      "'text-muted-foreground'}": true
    }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* File Upload Loading */}
        <Card sx={{
      p: 6
    }}>
          <h3 sx={{
      fontWeight: 500,
      mb: 4
    }}>File Upload Progress</h3>
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      border: 2,
      borderStyle: "dashed",
      "border-muted": true,
      borderRadius: 0.5rem,
      p: 6,
      textAlign: "center"
    }}>
              <Upload sx={{
      "w-8": true,
      "h-8": true,
      "text-muted-foreground": true,
      "mx-auto": true,
      mb: 2
    }} />
              <p sx={{
      typography: body1,
      "text-muted-foreground": true,
      mb: 4
    }}>Uploading resume.pdf...</p>
              <Progress value={uploadProgress} sx={{
      width: "100%",
      mb: 2
    }} />
              <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>{uploadProgress}% completed</p>
            </div>
          </div>
        </Card>

        {/* Template Generation Loading */}
        <Card sx={{
      p: 6
    }}>
          <h3 sx={{
      fontWeight: 500,
      mb: 4
    }}>Template Generation</h3>
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      textAlign: "center"
    }}>
              <div sx={{
      "w-16": true,
      "h-16": true,
      "bg-primary/10": true,
      borderRadius: 9999px,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "mx-auto": true,
      mb: 4,
      "animate-pulse": true
    }}>
                <CareerCopilotLogo sx={{
      "text-primary": true
    }} sx={{ fontSize: 32 }} />
              </div>
              <p sx={{
      fontWeight: 500,
      mb: 2
    }}>Generating your resume</p>
              <p sx={{
      typography: body1,
      "text-muted-foreground": true,
      mb: 4
    }}>
                Applying Modern Minimal template...
              </p>
              <Progress value={progress} sx={{
      width: "100%",
      mb: 2
    }} />
              <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>Processing content and formatting</p>
            </div>
          </div>
        </Card>

        {/* Dashboard Loading State */}
        <Card sx={{
      p: 6
    }}>
          <h3 sx={{
      fontWeight: 500,
      mb: 4
    }}>Dashboard Loading</h3>
          <div sx={{
      "grid": true,
      "grid-cols-1": true,
      gap: 4
    }}>
            {[1, 2, 3].map((i) => (
              <Card key={i} sx={{
      p: 4,
      border: 1
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 3
    }}>
                  <Skeleton sx={{
      "w-10": true,
      "h-10": true,
      borderRadius: 9999px
    }} />
                  <div sx={{
      "space-y-1": true
    }}>
                    <Skeleton sx={{
      "h-3": true,
      "w-24": true
    }} />
                    <Skeleton sx={{
      "h-3": true,
      "w-20": true
    }} />
                  </div>
                </div>
                <div sx={{
      "space-y-2": true
    }}>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <Skeleton sx={{
      "h-3": true,
      "w-20": true
    }} />
                    <Skeleton sx={{
      "h-3": true,
      "w-6": true
    }} />
                  </div>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <Skeleton sx={{
      "h-3": true,
      "w-24": true
    }} />
                    <Skeleton sx={{
      "h-3": true,
      "w-8": true
    }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Spinner Variations */}
        <Card sx={{
      p: 6
    }}>
          <h3 sx={{
      fontWeight: 500,
      mb: 4
    }}>Loading Spinners</h3>
          <div sx={{
      "space-y-6": true
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: "center"
    }}>
              <AutorenewRounded sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true,
      "animate-spin": true
    }} />
              <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Default spinner</div>
            </div>

            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: "center"
    }}>
              <div sx={{
      "w-6": true,
      "h-6": true,
      border: 2,
      "border-primary": true,
      "border-t-transparent": true,
      borderRadius: 9999px,
      "animate-spin": true
    }} />
              <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Border spinner</div>
            </div>

            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: "center"
    }}>
              <div sx={{
      display: "flex",
      gap: 1
    }}>
                <div
                  sx={{
      "w-2": true,
      "h-2": true,
      "bg-primary": true,
      borderRadius: 9999px,
      "animate-bounce": true
    }}
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  sx={{
      "w-2": true,
      "h-2": true,
      "bg-primary": true,
      borderRadius: 9999px,
      "animate-bounce": true
    }}
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  sx={{
      "w-2": true,
      "h-2": true,
      "bg-primary": true,
      borderRadius: 9999px,
      "animate-bounce": true
    }}
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Dot animation</div>
            </div>

            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: "center"
    }}>
              <div sx={{
      "w-6": true,
      "h-6": true,
      border: 2,
      "border-muted": true,
      borderRadius: 9999px
    }}>
                <div sx={{
      width: "100%",
      height: "100%",
      border: 2,
      "border-primary": true,
      "border-b-transparent": true,
      borderRadius: 9999px,
      "animate-spin": true
    }} />
              </div>
              <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Double ring</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Full Page Loading Overlay Example */}
      <Card sx={{
      p: 6,
      mt: 6
    }}>
        <h3 sx={{
      fontWeight: 500,
      mb: 4
    }}>Full Page Loading Overlay</h3>
        <div sx={{
      "relative": true,
      "bg-muted/10": true,
      border: 1,
      "border-muted": true,
      borderRadius: 0.5rem,
      "h-32": true,
      overflow: "hidden"
    }}>
          <div sx={{
      "absolute": true,
      "inset-0": true,
      "bg-background/80": true,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
            <div sx={{
      textAlign: "center"
    }}>
              <div sx={{
      mb: 3,
      "animate-pulse": true
    }}>
                <CareerCopilotLogo sx={{
      "text-primary": true,
      "mx-auto": true
    }} sx={{ fontSize: 32 }} />
              </div>
              <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Loading Career Copilot...</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
