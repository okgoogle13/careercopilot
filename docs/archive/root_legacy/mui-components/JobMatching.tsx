import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Container,
  Grid,
  IconButton,
  alpha,
} from "@mui/material";
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Heart,
  Star,
} from "lucide-react";

export interface JobMatchingProps {
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

const jobMatches: JobMatch[] = [
  {
    id: "1",
    title: "Senior Community Support Worker",
    company: "Community Care Australia",
    location: "Brisbane, QLD",
    matchPercentage: 94,
    salaryRange: "$65,000 - $75,000",
    postedDate: "2 days ago",
    description:
      "Join our passionate team providing support to individuals with disabilities in community settings.",
    keyRequirements: [
      "Certificate IV in Disability",
      "5+ years experience",
      "Valid driver's license",
    ],
    benefits: ["Professional development", "Health insurance", "Flexible hours"],
    isRemote: false,
    isFavorited: false,
  },
  {
    id: "2",
    title: "Mental Health Peer Worker",
    company: "Queensland Health",
    location: "Gold Coast, QLD",
    matchPercentage: 87,
    salaryRange: "$60,000 - $70,000",
    postedDate: "5 days ago",
    description:
      "Support individuals with lived experience of mental health challenges in their recovery journey.",
    keyRequirements: ["Lived experience", "Peer work certification", "Communication skills"],
    benefits: ["Government benefits", "Training opportunities", "Career progression"],
    isRemote: true,
    isFavorited: true,
  },
  {
    id: "3",
    title: "Community Outreach Coordinator",
    company: "Mental Health Foundation",
    location: "Sydney, NSW",
    matchPercentage: 82,
    salaryRange: "$55,000 - $65,000",
    postedDate: "1 week ago",
    description:
      "Coordinate community programs and build partnerships to support mental health initiatives.",
    keyRequirements: ["Bachelor's degree", "Community engagement", "Project management"],
    benefits: ["Salary sacrifice", "Professional development", "Work-life balance"],
    isRemote: false,
    isFavorited: false,
  },
];

const getMatchColor = (percentage: number) => {
  if (percentage >= 90) return "#86EFAC";
  if (percentage >= 80) return "#FDE047";
  return "#FDBA74";
};

export const JobMatching: React.FC<JobMatchingProps> = ({ onBack }) => {
  const [favorites, setFavorites] = useState<string[]>(
    jobMatches.filter((job) => job.isFavorited).map((job) => job.id),
  );

  const toggleFavorite = (jobId: string) => {
    setFavorites((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId],
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Button
            variant="text"
            startIcon={<ArrowLeft size={16} />}
            onClick={onBack}
            sx={{ color: "text.secondary", mb: 4 }}
          >
            Back to Career Hub
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Sparkles size={32} color="#A78BFA" />
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", serif',
                  fontWeight: 700,
                }}
              >
                AI Job Matching
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Discover roles that perfectly match your skills, experience, and career goals.
            </Typography>
          </Box>
        </Box>

        {/* Job Matches */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {jobMatches.map((job) => {
            const matchColor = getMatchColor(job.matchPercentage);
            const isFavorited = favorites.includes(job.id);

            return (
              <Card
                key={job.id}
                sx={{
                  bgcolor: "surface.container",
                  border: 1,
                  borderColor: "outline.variant",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    {/* Main Job Info */}
                    <Grid item xs={12} lg={8}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <Typography
                              variant="h5"
                              sx={{
                                fontFamily: '"Roboto Flex", "Roboto", serif',
                                fontWeight: 700,
                              }}
                            >
                              {job.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => toggleFavorite(job.id)}
                              sx={{
                                color: isFavorited ? "error.main" : "text.secondary",
                              }}
                            >
                              <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                            </IconButton>
                          </Box>

                          <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ fontWeight: 400, mb: 2 }}
                          >
                            {job.company}
                          </Typography>

                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <MapPin size={16} color="#94A3B8" />
                              <Typography variant="body2" color="text.secondary">
                                {job.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <DollarSign size={16} color="#94A3B8" />
                              <Typography variant="body2" color="text.secondary">
                                {job.salaryRange}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Clock size={16} color="#94A3B8" />
                              <Typography variant="body2" color="text.secondary">
                                {job.postedDate}
                              </Typography>
                            </Box>
                            {job.isRemote && (
                              <Chip label="Remote Available" size="small" color="primary" />
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, lineHeight: 1.7 }}
                      >
                        {job.description}
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                            Key Requirements
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {job.keyRequirements.map((req, index) => (
                              <Box
                                key={index}
                                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {req}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                            Benefits
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {job.benefits.map((benefit, index) => (
                              <Box
                                key={index}
                                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    bgcolor: "success.main",
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {benefit}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Match Score & Actions */}
                    <Grid item xs={12} lg={4}>
                      <Card
                        sx={{
                          bgcolor: (theme) => alpha(matchColor, 0.08),
                          border: "none",
                          textAlign: "center",
                          mb: 2,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography
                            variant="h2"
                            sx={{
                              fontFamily: '"Roboto Flex", "Roboto", serif',
                              fontWeight: 700,
                              color: matchColor,
                              mb: 1,
                            }}
                          >
                            {job.matchPercentage}%
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                            Match Score
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={job.matchPercentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: (theme) => alpha(matchColor, 0.2),
                              "& .MuiLinearProgress-bar": {
                                bgcolor: matchColor,
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, mt: 2 }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={
                                  i < Math.floor(job.matchPercentage / 20) ? matchColor : "none"
                                }
                                color={
                                  i < Math.floor(job.matchPercentage / 20) ? matchColor : "#48464F"
                                }
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          endIcon={<ExternalLink size={16} />}
                          sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            py: 1.5,
                            fontWeight: 600,
                          }}
                        >
                          View Full Listing
                        </Button>
                        <Button variant="outlined" fullWidth startIcon={<Sparkles size={16} />}>
                          AI Insights
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default JobMatching;
