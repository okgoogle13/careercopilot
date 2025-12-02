import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  LocationOn as MapPin,
  AttachMoney as DollarSign,
  Schedule as Clock,
  OpenInNew as ExternalLink,
  Favorite as Heart,
  Star,
} from '@mui/icons-material';
import { Box, Card, Typography, Button, IconButton } from '@mui/material';
import { useState } from 'react';

import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

interface JobMatchingProps {
  onBack: () => void;
}

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location:string;
  matchPercentage: number;
  salaryRange: string;
  postedDate: string;
  description: string;
  keyRequirements: string[];
  benefits: string[];
  isRemote: boolean;
  isFavorited: boolean;
}

export function JobMatching({ onBack }: JobMatchingProps) {
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const jobMatches: JobMatch[] = [
    {
      id: '1',
      title: 'Senior Community Support Worker',
      company: 'Community Care Australia',
      location: 'Brisbane, QLD',
      matchPercentage: 94,
      salaryRange: '$65,000 - $75,000',
      postedDate: '2 days ago',
      description:
        'Join our passionate team providing support to individuals with disabilities in community settings.',
      keyRequirements: [
        'Certificate IV in Disability',
        '5+ years experience',
        "Valid driver's license",
      ],
      benefits: ['Professional development', 'Health insurance', 'Flexible hours'],
      isRemote: false,
      isFavorited: false,
    },
    {
      id: '2',
      title: 'Mental Health Peer Worker',
      company: 'Queensland Health',
      location: 'Gold Coast, QLD',
      matchPercentage: 87,
      salaryRange: '$60,000 - $70,000',
      postedDate: '5 days ago',
      description:
        'Support individuals with lived experience of mental health challenges in their recovery journey.',
      keyRequirements: ['Lived experience', 'Peer work certification', 'Communication skills'],
      benefits: ['Government benefits', 'Training opportunities', 'Career progression'],
      isRemote: true,
      isFavorited: true,
    },
    {
      id: '3',
      title: 'Community Outreach Coordinator',
      company: 'Mental Health Foundation',
      location: 'Sydney, NSW',
      matchPercentage: 82,
      salaryRange: '$55,000 - $65,000',
      postedDate: '1 week ago',
      description:
        'Coordinate community programs and build partnerships to support mental health initiatives.',
      keyRequirements: ["Bachelor's degree", 'Community engagement', 'Project management'],
      benefits: ['Salary sacrifice', 'Professional development', 'Work-life balance'],
      isRemote: false,
      isFavorited: false,
    },
  ];

  const handleGenerateInsights = async (jobId: string) => {
    setIsGeneratingInsights(true);
    setSelectedJob(jobId);
    setTimeout(() => {
      setIsGeneratingInsights(false);
    }, 2000);
  };
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'var(--sys-color-primary)';
    if (percentage >= 80) return 'var(--sys-color-secondary)';
    return 'var(--sys-color-tertiary)';
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
            Back to Career Hub
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 'var(--sys-spacing-8)' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--sys-spacing-2)',
              mb: 'var(--sys-spacing-4)',
            }}
          >
            <Sparkles sx={{ color: 'var(--sys-color-primary)' }} />
            <Typography
              variant="h1"
              sx={{
                font: 'var(--sys-type-display-small)',
                fontWeight: 'var(--sys-type-weight-bold)',
                color: 'var(--sys-color-on-surface)',
              }}
            >
              AI Job Matching
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              font: 'var(--sys-type-headline-small)',
              color: 'var(--sys-color-on-surface-variant)',
            }}
          >
            Discover roles that perfectly match your skills, experience, and
            career goals.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 'var(--sys-spacing-4)' }}>
          {jobMatches.map((job) => (
            <Card
              key={job.id}
              sx={{
                p: 'var(--sys-spacing-6)',
                borderRadius: 'var(--sys-shape-corner-large)',
                boxShadow: 'var(--sys-elevation-level1)',
                transition:
                  'box-shadow var(--sys-motion-duration-short2) var(--sys-motion-easing-standard)',
                '&:hover': { boxShadow: 'var(--sys-elevation-level2)' },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: '1fr 300px',
                  },
                  gap: 'var(--sys-spacing-6)',
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 'var(--sys-spacing-2)',
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sys-spacing-3)',
                          mb: 'var(--sys-spacing-2)',
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            font: 'var(--sys-type-headline-medium)',
                            fontWeight: 'var(--sys-type-weight-semibold)',
                            color: 'var(--sys-color-on-surface)',
                          }}
                        >
                          {job.title}
                        </Typography>
                        {job.isFavorited && (
                          <Heart sx={{ color: 'var(--sys-color-error)' }} />
                        )}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          font: 'var(--sys-type-title-large)',
                          color: 'var(--sys-color-on-surface-variant)',
                        }}
                      >
                        {job.company}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sys-spacing-4)',
                          mt: 'var(--sys-spacing-2)',
                          font: 'var(--sys-type-body-medium)',
                          color: 'var(--sys-color-on-surface-variant)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--sys-spacing-1)',
                          }}
                        >
                          <MapPin />
                          {job.location}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--sys-spacing-1)',
                          }}
                        >
                          <DollarSign />
                          {job.salaryRange}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--sys-spacing-1)',
                          }}
                        >
                          <Clock />
                          {job.postedDate}
                        </Box>
                        {job.isRemote && (
                          <Badge variant="secondary">Remote Available</Badge>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      font: 'var(--sys-type-body-large)',
                      my: 'var(--sys-spacing-4)',
                      color: 'var(--sys-color-on-surface-variant)',
                    }}
                  >
                    {job.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                      },
                      gap: 'var(--sys-spacing-4)',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          font: 'var(--sys-type-title-medium)',
                          fontWeight: 'var(--sys-type-weight-medium)',
                          mb: 'var(--sys-spacing-2)',
                          color: 'var(--sys-color-on-surface)',
                        }}
                      >
                        Key Requirements
                      </Typography>
                      <Box
                        component="ul"
                        sx={{
                          listStyle: 'none',
                          p: 0,
                          m: 0,
                          display: 'grid',
                          gap: 'var(--sys-spacing-1)',
                        }}
                      >
                        {job.keyRequirements.map((req, index) => (
                          <Box
                            component="li"
                            key={index}
                            sx={{
                              font: 'var(--sys-type-body-medium)',
                              color: 'var(--sys-color-on-surface-variant)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--sys-spacing-2)',
                            }}
                          >
                            <Box
                              sx={{
                                width: '8px',
                                height: '8px',
                                borderRadius: 'var(--sys-shape-corner-full)',
                                backgroundColor: 'var(--sys-color-primary)',
                              }}
                            />
                            {req}
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          font: 'var(--sys-type-title-medium)',
                          fontWeight: 'var(--sys-type-weight-medium)',
                          mb: 'var(--sys-spacing-2)',
                          color: 'var(--sys-color-on-surface)',
                        }}
                      >
                        Benefits
                      </Typography>
                      <Box
                        component="ul"
                        sx={{
                          listStyle: 'none',
                          p: 0,
                          m: 0,
                          display: 'grid',
                          gap: 'var(--sys-spacing-1)',
                        }}
                      >
                        {job.benefits.map((benefit, index) => (
                          <Box
                            component="li"
                            key={index}
                            sx={{
                              font: 'var(--sys-type-body-medium)',
                              color: 'var(--sys-color-on-surface-variant)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--sys-spacing-2)',
                            }}
                          >
                            <Box
                              sx={{
                                width: '8px',
                                height: '8px',
                                borderRadius: 'var(--sys-shape-corner-full)',
                                backgroundColor: 'var(--sys-color-secondary)',
                              }}
                            />
                            {benefit}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--sys-spacing-2)',
                  }}
                >
                  <Card
                    sx={{
                      p: 'var(--sys-spacing-4)',
                      border: '1px solid var(--sys-color-outline-variant)',
                      borderRadius: 'var(--sys-shape-corner-medium)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        font: 'var(--sys-type-display-small)',
                        fontWeight: 'var(--sys-type-weight-bold)',
                        mb: 'var(--sys-spacing-2)',
                        color: getMatchColor(job.matchPercentage),
                      }}
                    >
                      {job.matchPercentage}%
                    </Typography>
                    <Typography
                      sx={{
                        font: 'var(--sys-type-body-large)',
                        fontWeight: 'var(--sys-type-weight-medium)',
                        mb: 'var(--sys-spacing-3)',
                        color: 'var(--sys-color-on-surface-variant)',
                      }}
                    >
                      Match Score
                    </Typography>
                    <Progress
                      value={job.matchPercentage}
                      sx={{
                        width: '100%',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getMatchColor(job.matchPercentage),
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--sys-spacing-1)',
                        mt: 'var(--sys-spacing-2)',
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            color:
                              i < Math.round(job.matchPercentage / 20)
                                ? 'var(--sys-color-tertiary)'
                                : 'var(--sys-color-outline-variant)',
                          }}
                        />
                      ))}
                    </Box>
                  </Card>

                  <Button
                    sx={{
                      width: '100%',
                      backgroundColor: 'var(--sys-color-primary)',
                      color: 'var(--sys-color-on-primary)',
                      '&:hover': {
                        backgroundColor: 'var(--sys-color-primary-dark)',
                      },
                    }}
                    onClick={() => handleGenerateInsights(job.id)}
                    disabled={isGeneratingInsights && selectedJob === job.id}
                  >
                    {isGeneratingInsights && selectedJob === job.id ? (
                      <>
                        <Sparkles sx={{ mr: 'var(--sys-spacing-2)' }} />
                        Generating Insights...
                      </>
                    ) : (
                      <>
                        <Sparkles sx={{ mr: 'var(--sys-spacing-2)' }} />
                        Get AI Insights
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      width: '100%',
                      borderColor: 'var(--sys-color-outline)',
                      color: 'var(--sys-color-primary)',
                    }}
                  >
                    <ExternalLink sx={{ mr: 'var(--sys-spacing-2)' }} />
                    View Full Job
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      width: '100%',
                      borderColor: 'var(--sys-color-outline)',
                      color: 'var(--sys-color-primary)',
                    }}
                  >
                    <Heart sx={{ mr: 'var(--sys-spacing-2)' }} />
                    {job.isFavorited ? 'Saved' : 'Save Job'}
                  </Button>
                </Box>
              </Box>
              {isGeneratingInsights && selectedJob === job.id && (
                <Box
                  sx={{
                    mt: 'var(--sys-spacing-6)',
                    p: 'var(--sys-spacing-4)',
                    border: '1px solid var(--sys-color-outline-variant)',
                    borderRadius: 'var(--sys-shape-corner-medium)',
                    backgroundColor: 'var(--sys-color-surface-container-low)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sys-spacing-2)',
                      mb: 'var(--sys-spacing-3)',
                    }}
                  >
                    <Sparkles sx={{ color: 'var(--sys-color-primary)' }} />
                    <Typography
                      sx={{
                        font: 'var(--sys-type-title-medium)',
                        fontWeight: 'var(--sys-type-weight-medium)',
                        color: 'var(--sys-color-on-surface)',
                      }}
                    >
                      AI-Generated Insights
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      font: 'var(--sys-type-body-large)',
                      color: 'var(--sys-color-on-surface-variant)',
                      display: 'grid',
                      gap: 'var(--sys-spacing-2)',
                    }}
                  >
                    <Typography>
                      • <strong>Strong match:</strong> Your Community Support
                      Worker experience aligns perfectly with this role
                    </Typography>
                    <Typography>
                      • <strong>Salary competitive:</strong> This position
                      offers 15% above market average for your experience level
                    </Typography>
                    <Typography>
                      • <strong>Growth opportunity:</strong> Company has
                      promoted 78% of CSWs to senior roles within 2 years
                    </Typography>
                    <Typography>
                      • <strong>Recommendation:</strong> Highlight your crisis
                      intervention skills and community engagement experience
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 'var(--sys-spacing-8)' }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'var(--sys-color-outline)',
              color: 'var(--sys-color-primary)',
            }}
          >
            Load More Matches
          </Button>
        </Box>
      </Box>
    </Box>
  );
}