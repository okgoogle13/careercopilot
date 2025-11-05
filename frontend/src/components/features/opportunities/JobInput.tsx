import {
  ArrowLeft,
  Link,
  Description as FileText,
  AutorenewRounded as Loader2,
  OpenInNew as ExternalLink,
} from '@mui/icons-material';
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
import { useState } from 'react';

import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';

interface JobInputProps {
  documentType?: 'resume' | 'cover-letter' | 'selection-criteria';
  onAnalyze: (jobData: { url?: string; description?: string }) => void;
  onBack: () => void;
}

export function JobInput({ documentType, onAnalyze, onBack }: JobInputProps) {
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('url');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalyze({
        url: activeTab === 'url' ? jobUrl : undefined,
        description: activeTab === 'text' ? jobDescription : undefined,
      });
    }, 2000);
  };

  const isValidInput = () => {
    if (activeTab === 'url') {
      return jobUrl.trim().length > 0 && (jobUrl.includes('http') || jobUrl.includes('www'));
    }
    return jobDescription.trim().length > 50; // Minimum description length
  };

  return (
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 4
    }}>
      <div sx={{
      "max-w-3xl": true,
      "mx-auto": true
    }}>
        {/* Header */}
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 8
    }}>
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
            Back
          </Button>
        </div>

        <div sx={{
      textAlign: "center",
      mb: 8
    }}>
          <h1 sx={{
      typography: h3,
      fontWeight: 600,
      mb: 4
    }}>Analyze the Job</h1>
          <p sx={{
      "text-muted-foreground": true,
      typography: h6
    }}>
            Provide the job details so we can optimize your document for maximum impact.
          </p>
        </div>

        {/* Input Tabs */}
        <Card sx={{
      p: 8
    }}>
          <Tabs
            value={activeTab}
            onChange={(_e, value) => setActiveTab(value as string)}
            sx={{
      width: "100%"
    }}
          >
            <TabsList sx={{
      "grid": true,
      width: "100%",
      "grid-cols-2": true,
      mb: 6
    }}>
              <TabsTrigger value="url" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Link sx={{
      "w-4": true,
      "h-4": true
    }} />
                Job URL
              </TabsTrigger>
              <TabsTrigger value="text" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <FileText sx={{
      "w-4": true,
      "h-4": true
    }} />
                Job Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" currentValue={activeTab} sx={{
      "space-y-4": true
    }}>
              <div>
                <label sx={{
      typography: body1,
      fontWeight: 500,
      mb: 2,
      "block": true
    }}>Job Posting URL</label>
                <div sx={{
      "relative": true
    }}>
                  <Input
                    type="url"
                    placeholder="https://example.com/job-posting"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    sx={{
      pr: 10
    }}
                  />
                  <ExternalLink sx={{
      "w-4": true,
      "h-4": true,
      "text-muted-foreground": true,
      "absolute": true,
      "right-3": true,
      "top-1/2": true,
      "transform": true,
      "-translate-y-1/2": true
    }} />
                </div>
                <p sx={{
      typography: body1,
      "text-muted-foreground": true,
      mt: 2
    }}>
                  We'll automatically extract the job requirements and qualifications
                </p>
              </div>

              {jobUrl && (
                <div sx={{
      p: 4,
      "bg-primary/5": true,
      border: 1,
      "border-primary/20": true,
      borderRadius: 0.5rem
    }}>
                  <p sx={{
      typography: body1,
      "text-primary": true
    }}>✓ Valid job URL detected</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" currentValue={activeTab} sx={{
      "space-y-4": true
    }}>
              <div>
                <label sx={{
      typography: body1,
      fontWeight: 500,
      mb: 2,
      "block": true
    }}>Job Description</label>
                <Textarea
                  placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  sx={{
      h: "200px",
      "resize-none": true
    }}
                />
                <p sx={{
      typography: body1,
      "text-muted-foreground": true,
      mt: 2
    }}>
                  {jobDescription.length}/50 characters minimum
                </p>
              </div>

              {jobDescription.length >= 50 && (
                <div sx={{
      p: 4,
      "bg-primary/5": true,
      border: 1,
      "border-primary/20": true,
      borderRadius: 0.5rem
    }}>
                  <p sx={{
      typography: body1,
      "text-primary": true
    }}>✓ Job description looks good</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Analyze Button */}
          <div sx={{
      display: "flex",
      justifyContent: "center",
      mt: 8
    }}>
            <Button
              onClick={handleAnalyze}
              disabled={!isValidInput() || isAnalyzing}
              sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true },
      px: 8,
      py: 6,
      typography: h6
    }}
              size="large"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 sx={{
      "w-5": true,
      "h-5": true,
      mr: 2,
      "animate-spin": true
    }} />
                  Analyzing Job...
                </>
              ) : (
                'Analyze with AI'
              )}
            </Button>
          </div>
        </Card>

        {/* Features Preview */}
        <div sx={{
      mt: 8,
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-3": true },
      gap: 4
    }}>
          <div sx={{
      textAlign: "center",
      p: 4
    }}>
            <div sx={{
      "w-12": true,
      "h-12": true,
      "bg-blue-500/10": true,
      borderRadius: 0.5rem,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "mx-auto": true,
      mb: 3
    }}>
              <FileText sx={{
      "w-6": true,
      "h-6": true,
      color: "blue.500"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>Keyword Extraction</h3>
            <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Identify critical keywords and phrases</p>
          </div>

          <div sx={{
      textAlign: "center",
      p: 4
    }}>
            <div sx={{
      "w-12": true,
      "h-12": true,
      "bg-green-500/10": true,
      borderRadius: 0.5rem,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "mx-auto": true,
      mb: 3
    }}>
              <FileText sx={{
      "w-6": true,
      "h-6": true,
      color: "green.500"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>ATS Optimization</h3>
            <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Ensure your document passes ATS systems</p>
          </div>

          <div sx={{
      textAlign: "center",
      p: 4
    }}>
            <div sx={{
      "w-12": true,
      "h-12": true,
      "bg-purple-500/10": true,
      borderRadius: 0.5rem,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "mx-auto": true,
      mb: 3
    }}>
              <FileText sx={{
      "w-6": true,
      "h-6": true,
      color: "purple.500"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>Match Analysis</h3>
            <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Calculate your compatibility score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
