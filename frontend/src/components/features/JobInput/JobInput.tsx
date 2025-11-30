import {
  ArrowLeft,
  Link,
  Description as FileText,
  AutorenewRounded as Loader2,
  OpenInNew as ExternalLink,
} from '@mui/icons-material';
import { Box, Card, Typography, Button } from '@mui/material';
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
      return (
        jobUrl.trim().length > 0 &&
        (jobUrl.includes('http') || jobUrl.includes('www'))
      );
    }
    return jobDescription.trim().length > 50;
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 'var(--sys-spacing-4)',
        backgroundColor: 'var(--sys-color-surface)',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sys-spacing-4)',
            mb: 'var(--sys-spacing-8)',
          }}
        >
          <Button
            variant="text"
            size="small"
            onClick={onBack}
            sx={{ color: 'var(--sys-color-on-surface)' }}
          >
            <ArrowLeft sx={{ mr: 'var(--sys-spacing-2)' }} />
            Back
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 'var(--sys-spacing-8)' }}>
          <Typography
            variant="h1"
            sx={{
              font: 'var(--sys-type-display-small)',
              fontWeight: 'var(--sys-type-weight-bold)',
              mb: 'var(--sys-spacing-4)',
              color: 'var(--sys-color-on-surface)',
            }}
          >
            Analyze the Job
          </Typography>
          <Typography
            variant="h6"
            sx={{
              font: 'var(--sys-type-headline-small)',
              color: 'var(--sys-color-on-surface-variant)',
            }}
          >
            Provide the job details so we can optimize your document for maximum
            impact.
          </Typography>
        </Box>

        <Card
          sx={{
            p: 'var(--sys-spacing-8)',
            borderRadius: 'var(--sys-shape-corner-large)',
            boxShadow: 'var(--sys-elevation-level1)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_e, value) => setActiveTab(value as string)}
            sx={{ width: '100%' }}
          >
            <TabsList
              sx={{
                width: '100%',
                mb: 'var(--sys-spacing-6)',
                backgroundColor: 'var(--sys-color-surface-container)',
              }}
            >
              <TabsTrigger
                value="url"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sys-spacing-2)',
                  color: 'var(--sys-color-on-surface-variant)',
                  '&[data-state="active"]': {
                    color: 'var(--sys-color-primary)',
                  },
                }}
              >
                <Link />
                Job URL
              </TabsTrigger>
              <TabsTrigger
                value="text"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sys-spacing-2)',
                  color: 'var(--sys-color-on-surface-variant)',
                  '&[data-state="active"]': {
                    color: 'var(--sys-color-primary)',
                  },
                }}
              >
                <FileText />
                Job Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" sx={{}}>
              <Box>
                <Typography
                  component="label"
                  sx={{
                    font: 'var(--sys-type-body-large)',
                    fontWeight: 'var(--sys-type-weight-medium)',
                    mb: 'var(--sys-spacing-2)',
                    color: 'var(--sys-color-on-surface)',
                  }}
                >
                  Job Posting URL
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <Input
                    type="url"
                    placeholder="https://example.com/job-posting"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    sx={{ pr: 'var(--sys-spacing-10)' }}
                  />
                  <ExternalLink
                    sx={{
                      position: 'absolute',
                      right: 'var(--sys-spacing-2)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--sys-color-on-surface-variant)',
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    font: 'var(--sys-type-body-medium)',
                    mt: 'var(--sys-spacing-2)',
                    color: 'var(--sys-color-on-surface-variant)',
                  }}
                >
                  We'll automatically extract the job requirements and
                  qualifications
                </Typography>
              </Box>

              {jobUrl && (
                <Box
                  sx={{
                    p: 'var(--sys-spacing-4)',
                    border: '1px solid var(--sys-color-outline)',
                    borderRadius: 'var(--sys-shape-corner-medium)',
                    mt: 'var(--sys-spacing-2)',
                  }}
                >
                  <Typography
                    sx={{
                      font: 'var(--sys-type-body-medium)',
                      color: 'var(--sys-color-on-surface)',
                    }}
                  >
                    ✓ Valid job URL detected
                  </Typography>
                </Box>
              )}
            </TabsContent>

            <TabsContent value="text" sx={{}}>
              <Box>
                <Typography
                  component="label"
                  sx={{
                    font: 'var(--sys-type-body-large)',
                    fontWeight: 'var(--sys-type-weight-medium)',
                    mb: 'var(--sys-spacing-2)',
                    color: 'var(--sys-color-on-surface)',
                  }}
                >
                  Job Description
                </Typography>
                <Textarea
                  placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  sx={{
                    minHeight: '200px',
                    font: 'var(--sys-type-body-large)',
                  }}
                />
                <Typography
                  sx={{
                    font: 'var(--sys-type-body-medium)',
                    mt: 'var(--sys-spacing-2)',
                    color: 'var(--sys-color-on-surface-variant)',
                  }}
                >
                  {jobDescription.length}/50 characters minimum
                </Typography>
              </Box>

              {jobDescription.length >= 50 && (
                <Box
                  sx={{
                    p: 'var(--sys-spacing-4)',
                    border: '1px solid var(--sys-color-outline)',
                    borderRadius: 'var(--sys-shape-corner-medium)',
                    mt: 'var(--sys-spacing-2)',
                  }}
                >
                  <Typography
                    sx={{
                      font: 'var(--sys-type-body-medium)',
                      color: 'var(--sys-color-on-surface)',
                    }}
                  >
                    ✓ Job description looks good
                  </Typography>
                </Box>
              )}
            </TabsContent>
          </Tabs>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 'var(--sys-spacing-8)',
            }}
          >
            <Button
              onClick={handleAnalyze}
              disabled={!isValidInput() || isAnalyzing}
              sx={{
                px: 'var(--sys-spacing-8)',
                py: 'var(--sys-spacing-4)',
                font: 'var(--sys-type-title-large)',
                backgroundColor: 'var(--sys-color-primary)',
                color: 'var(--sys-color-on-primary)',
                '&:hover': {
                  backgroundColor: 'var(--sys-color-primary-dark)',
                },
              }}
              size="large"
            >
              {isAnalyzing ? (
                <>
                  <Loader2
                    sx={{
                      mr: 'var(--sys-spacing-2)',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  Analyzing Job...
                </>
              ) : (
                'Analyze with AI'
              )}
            </Button>
          </Box>
        </Card>
        <Box
          sx={{
            mt: 'var(--sys-spacing-8)',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
            },
            gap: 'var(--sys-spacing-4)',
          }}
        >
          {[
            {
              icon: <FileText sx={{ color: 'var(--sys-color-primary)' }} />,
              title: 'Keyword Extraction',
              description: 'Identify critical keywords and phrases',
            },
            {
              icon: <FileText sx={{ color: 'var(--sys-color-secondary)' }} />,
              title: 'ATS Optimization',
              description: 'Ensure your document passes ATS systems',
            },
            {
              icon: <FileText sx={{ color: 'var(--sys-color-tertiary)' }} />,
              title: 'Match Analysis',
              description: 'Calculate your compatibility score',
            },
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
                p: 'var(--sys-spacing-4)',
                backgroundColor: 'var(--sys-color-surface-container-low)',
                borderRadius: 'var(--sys-shape-corner-medium)',
              }}
            >
              <Box
                sx={{
                  borderRadius: 'var(--sys-shape-corner-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 'var(--sys-spacing-3)',
                  width: 'var(--sys-spacing-12)',
                  height: 'var(--sys-spacing-12)',
                  backgroundColor: 'var(--sys-color-surface-container-high)',
                  margin: '0 auto var(--sys-spacing-3) auto',
                }}
              >
                {feature.icon}
              </Box>
              <Typography
                sx={{
                  font: 'var(--sys-type-title-medium)',
                  fontWeight: 'var(--sys-type-weight-semibold)',
                  mb: 'var(--sys-spacing-1)',
                  color: 'var(--sys-color-on-surface)',
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{
                  font: 'var(--sys-type-body-medium)',
                  color: 'var(--sys-color-on-surface-variant)',
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}