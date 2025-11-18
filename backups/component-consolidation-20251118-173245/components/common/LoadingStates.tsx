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
      '&:hover': {}
    }}
          >
            <ArrowLeft sx={{
      mr: 2
    }} />
            Back to Dashboard
          </Button>
          <h1 sx={{
      typography: "h4",
      fontWeight: 700,}}>Loading States</h1>
        </div>
      </div>

      <div sx={{
      [theme.breakpoints.up('md')]: {},
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
          <div sx={{}}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
              <Skeleton sx={{
      borderRadius: "9999px"
    }} />
              <div sx={{}}>
                <Skeleton sx={{}} />
                <Skeleton sx={{}} />
              </div>
            </div>
            <div sx={{}}>
              <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
                <Skeleton sx={{}} />
                <Skeleton sx={{}} />
              </div>
              <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
                <Skeleton sx={{}} />
                <Skeleton sx={{}} />
              </div>
              <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
                <Skeleton sx={{}} />
                <Skeleton sx={{}} />
              </div>
            </div>
            <div sx={{
      display: "flex",
      gap: 2,
      pt: 2
    }}>
              <Skeleton sx={{
      flex: 1
    }} />
              <Skeleton sx={{
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
          <div sx={{}}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
              <div sx={{
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                <AutorenewRounded sx={{}} />
              </div>
              <div>
                <p sx={{
      fontWeight: 500
    }}>Analyzing your resume...</p>
                <p sx={{
      typography: "body1",}}>This may take a few moments</p>
              </div>
            </div>

            <div sx={{}}>
              {analysisSteps.map((step, index) => (
                <div key={index} sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                  {step.completed ? (
                    <CheckCircle sx={{}} />
                  ) : index === analysisStep ? (
                    <AutorenewRounded sx={{}} />
                  ) : (
                    <div sx={{
      border: 2,
      borderRadius: "9999px"
    }} />
                  )}
                  <span
                    sx={{
      typography: "body1",}}
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
          <div sx={{}}>
            <div sx={{
      border: 2,
      borderStyle: "dashed",
      borderRadius: "0.5rem",
      p: 6,
      textAlign: "center"
    }}>
              <Upload sx={{
      mb: 2
    }} />
              <p sx={{
      typography: "body1",
      mb: 4
    }}>Uploading resume.pdf...</p>
              <Progress value={uploadProgress} sx={{
      width: "100%",
      mb: 2
    }} />
              <p sx={{
      typography: "body2",}}>{uploadProgress}% completed</p>
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
          <div sx={{}}>
            <div sx={{
      textAlign: "center"
    }}>
              <div sx={{
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 4,}}>
                <CareerCopilotLogo sx={{}} sx={{ fontSize: 32 }} />
              </div>
              <p sx={{
      fontWeight: 500,
      mb: 2
    }}>Generating your resume</p>
              <p sx={{
      typography: "body1",
      mb: 4
    }}>
                Applying Modern Minimal template...
              </p>
              <Progress value={progress} sx={{
      width: "100%",
      mb: 2
    }} />
              <p sx={{
      typography: "body2",}}>Processing content and formatting</p>
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
      borderRadius: "9999px"
    }} />
                  <div sx={{}}>
                    <Skeleton sx={{}} />
                    <Skeleton sx={{}} />
                  </div>
                </div>
                <div sx={{}}>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <Skeleton sx={{}} />
                    <Skeleton sx={{}} />
                  </div>
                  <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                    <Skeleton sx={{}} />
                    <Skeleton sx={{}} />
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
          <div sx={{}}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: "center"
    }}>
              <AutorenewRounded sx={{}} />
              <div sx={{
      typography: "body1",}}>Default spinner</div>
            </div>

            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: "center"
    }}>
              <div sx={{
      border: 2,
      borderRadius: "9999px",}} />
              <div sx={{
      typography: "body1",}}>Border spinner</div>
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
      borderRadius: "9999px",}}
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  sx={{
      borderRadius: "9999px",}}
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  sx={{
      borderRadius: "9999px",}}
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <div sx={{
      typography: "body1",}}>Dot animation</div>
            </div>

            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      justifyContent: "center"
    }}>
              <div sx={{
      border: 2,
      borderRadius: "9999px"
    }}>
                <div sx={{
      width: "100%",
      height: "100%",
      border: 2,
      borderRadius: "9999px",}} />
              </div>
              <div sx={{
      typography: "body1",}}>Double ring</div>
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
      border: 1,
      borderRadius: "0.5rem",
      overflow: "hidden"
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
            <div sx={{
      textAlign: "center"
    }}>
              <div sx={{
      mb: 3,}}>
                <CareerCopilotLogo sx={{}} sx={{ fontSize: 32 }} />
              </div>
              <p sx={{
      typography: "body1",}}>Loading Career Copilot...</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
