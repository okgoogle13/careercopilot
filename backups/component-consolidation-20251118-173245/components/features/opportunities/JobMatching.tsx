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

import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

interface JobMatchingProps {
  onBack: () => void;
}

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
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

    // Simulate AI analysis
    setTimeout(() => {
      setIsGeneratingInsights(false);
    }, 2000);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 80) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500/10';
    if (percentage >= 80) return 'bg-yellow-500/10';
    return 'bg-orange-500/10';
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
            Back to Career Hub
          </Button>
        </div>

        <div sx={{
      textAlign: "center",
      mb: 8
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mb: 4
    }}>
            <Sparkles sx={{}} />
            <h1 sx={{
      typography: "h3",
      fontWeight: 600
    }}>AI Job Matching</h1>
          </div>
          <p sx={{
      typography: "h6"
    }}>
            Discover roles that perfectly match your skills, experience, and career goals.
          </p>
        </div>

        {/* Job Matches */}
        <div sx={{}}>
          {jobMatches.map((job) => (
            <Card key={job.id} sx={{
      p: 6,
      '&:hover': { boxShadow: 4 },}}>
              <div sx={{
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up('md')]: { flexDirection: "row" },
      gap: 6
    }}>
                {/* Main Job Info */}
                <div sx={{
      flex: 1,}}>
                  <div sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }}>
                    <div>
                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 2
    }}>
                        <h3 sx={{
      typography: "h5",
      fontWeight: 600
    }}>{job.title}</h3>
                        {job.isFavorited && <Heart sx={{
      color: "red.500",
      fill: "currentColor"
    }} />}
                      </div>
                      <p sx={{
      typography: "h6",}}>{job.company}</p>

                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mt: 2,
      typography: "body1",}}>
                        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                          <MapPin sx={{}} />
                          {job.location}
                        </div>
                        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                          <DollarSign sx={{}} />
                          {job.salaryRange}
                        </div>
                        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                          <Clock sx={{}} />
                          {job.postedDate}
                        </div>
                        {job.isRemote && <Badge variant="secondary">Remote Available</Badge>}
                      </div>
                    </div>
                  </div>

                  <p sx={{}}>{job.description}</p>

                  <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 4
    }}>
                    <div>
                      <h4 sx={{
      fontWeight: 500,
      mb: 2
    }}>Key Requirements</h4>
                      <ul sx={{}}>
                        {job.keyRequirements.map((req, index) => (
                          <li
                            key={index}
                            sx={{
      typography: "body1",
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                          >
                            <div sx={{
      borderRadius: "9999px"
    }} />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 sx={{
      fontWeight: 500,
      mb: 2
    }}>Benefits</h4>
                      <ul sx={{}}>
                        {job.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            sx={{
      typography: "body1",
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                          >
                            <div sx={{
      bgcolor: "green.500",
      borderRadius: "9999px"
    }} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Match Score & Actions */}
                <div sx={{
      [theme.breakpoints.up('md')]: {},}}>
                  <Card sx={{
      p: 4,
      border: 0
    }}>
                    <div sx={{
      textAlign: "center"
    }}>
                      <div
                        sx={{
      typography: "h3",
      fontWeight: 700,
      mb: 2
    }}
                      >
                        {job.matchPercentage}%
                      </div>
                      <p sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 3
    }}>Match Score</p>
                      <Progress value={job.matchPercentage} sx={{
      width: "100%"
    }} />
                      <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      mt: 2
    }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            sx={{}}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>

                  <div sx={{}}>
                    <Button
                      sx={{
      width: "100%",
      '&:hover': {}
    }}
                      onClick={() => handleGenerateInsights(job.id)}
                      disabled={isGeneratingInsights && selectedJob === job.id}
                    >
                      {isGeneratingInsights && selectedJob === job.id ? (
                        <>
                          <Sparkles sx={{
      mr: 2,}} />
                          Generating Insights...
                        </>
                      ) : (
                        <>
                          <Sparkles sx={{
      mr: 2
    }} />
                          Get AI Insights
                        </>
                      )}
                    </Button>

                    <Button variant="outlined" sx={{
      width: "100%"
    }}>
                      <ExternalLink sx={{
      mr: 2
    }} />
                      View Full Job
                    </Button>

                    <Button variant="outlined" sx={{
      width: "100%"
    }}>
                      <Heart
                        sx={{
      mr: 2,}}
                      />
                      {job.isFavorited ? 'Saved' : 'Save Job'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Insights (shown when generated) */}
              {isGeneratingInsights && selectedJob === job.id && (
                <div sx={{
      mt: 6,
      p: 4,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      mb: 3
    }}>
                    <Sparkles sx={{}} />
                    <h4 sx={{
      fontWeight: 500,}}>AI-Generated Insights</h4>
                  </div>
                  <div sx={{
      typography: "body1"
    }}>
                    <p>
                      • <strong>Strong match:</strong> Your Community Support Worker experience
                      aligns perfectly with this role
                    </p>
                    <p>
                      • <strong>Salary competitive:</strong> This position offers 15% above market
                      average for your experience level
                    </p>
                    <p>
                      • <strong>Growth opportunity:</strong> Company has promoted 78% of CSWs to
                      senior roles within 2 years
                    </p>
                    <p>
                      • <strong>Recommendation:</strong> Highlight your crisis intervention skills
                      and community engagement experience
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div sx={{
      textAlign: "center",
      mt: 8
    }}>
          <Button variant="outlined" size="large">
            Load More Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
