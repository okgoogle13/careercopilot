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
      p: 4
    }}>
      <div sx={{}}>
        {/* Header */}
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 8
    }}>
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft sx={{
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
      typography: "h3",
      fontWeight: 600,
      mb: 4
    }}>Analyze the Job</h1>
          <p sx={{
      typography: "h6"
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
      width: "100%",
      mb: 6
    }}>
              <TabsTrigger value="url" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Link sx={{}} />
                Job URL
              </TabsTrigger>
              <TabsTrigger value="text" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <FileText sx={{}} />
                Job Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" currentValue={activeTab} sx={{}}>
              <div>
                <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Job Posting URL</label>
                <div sx={{}}>
                  <Input
                    type="url"
                    placeholder="https://example.com/job-posting"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    sx={{
      pr: 10
    }}
                  />
                  <ExternalLink sx={{}} />
                </div>
                <p sx={{
      typography: "body1",
      mt: 2
    }}>
                  We'll automatically extract the job requirements and qualifications
                </p>
              </div>

              {jobUrl && (
                <div sx={{
      p: 4,
      border: 1,
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                  <p sx={{
      typography: "body1",}}>✓ Valid job URL detected</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" currentValue={activeTab} sx={{}}>
              <div>
                <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Job Description</label>
                <Textarea
                  placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  sx={{
      h: "200px",}}
                />
                <p sx={{
      typography: "body1",
      mt: 2
    }}>
                  {jobDescription.length}/50 characters minimum
                </p>
              </div>

              {jobDescription.length >= 50 && (
                <div sx={{
      p: 4,
      border: 1,
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                  <p sx={{
      typography: "body1",}}>✓ Job description looks good</p>
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
      '&:hover': {},
      px: 8,
      py: 6,
      typography: "h6"
    }}
              size="large"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 sx={{
      mr: 2,}} />
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
      [theme.breakpoints.up('sm')]: {},
      gap: 4
    }}>
          <div sx={{
      textAlign: "center",
      p: 4
    }}>
            <div sx={{
      borderRadius: "var(--sys-shape-radius-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 3
    }}>
              <FileText sx={{
      color: "blue.500"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>Keyword Extraction</h3>
            <p sx={{
      typography: "body1",}}>Identify critical keywords and phrases</p>
          </div>

          <div sx={{
      textAlign: "center",
      p: 4
    }}>
            <div sx={{
      borderRadius: "var(--sys-shape-radius-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 3
    }}>
              <FileText sx={{
      color: "green.500"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>ATS Optimization</h3>
            <p sx={{
      typography: "body1",}}>Ensure your document passes ATS systems</p>
          </div>

          <div sx={{
      textAlign: "center",
      p: 4
    }}>
            <div sx={{
      borderRadius: "var(--sys-shape-radius-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 3
    }}>
              <FileText sx={{
      color: "purple.500"
    }} />
            </div>
            <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>Match Analysis</h3>
            <p sx={{
      typography: "body1",}}>Calculate your compatibility score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
